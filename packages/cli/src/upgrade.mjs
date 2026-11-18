// `egdev-ds upgrade <project>` (spec §7, §9): replaces the vendored set as one unit from a newer
// release, only for the packages the app already declares. Copies, edits, install and verification
// run as one transaction with rollback; the previous tarballs are removed only after success.
import { existsSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { assertSafeTarget, codeOf, transact } from './apply.mjs';
import { RefusedError } from './args.mjs';
import {
  collectSpecifiers,
  DEPENDENCY_FIELDS,
  detectCssMode,
  detectFramework,
  detectPackageManager,
  field,
  isVendorPath,
  PACKAGES,
  safeVendorFile,
  vendorState,
  workspaceOverrides
} from './detect.mjs';
import { findInstalled } from './doctor.mjs';
import { nextSteps, readManifest, readText, runInstall, verifyLock } from './init.mjs';
import { rewriteNpmLock } from './lockfile.mjs';
import { MANIFEST_FILE } from './manifest.mjs';
import { formatAction, formatHeader, formatPlanJson } from './plan.mjs';
import { planWorkspace, rewriteWorkspace, WORKSPACE_FILE } from './pnpm-workspace.mjs';
import {
  isRecord,
  loadReleasePackage,
  ReleaseError,
  readPackedFile,
  readPackedManifest,
  sha256,
  sri
} from './release.mjs';
import { compareVersions, satisfies } from './semver.mjs';

/** @typedef {import('./args.mjs').Options} Options */
/** @typedef {import('./release.mjs').Release} Release */
/** @typedef {import('./release.mjs').ReleasePackage} ReleasePackage */
/** @typedef {import('./init.mjs').Runner} Runner */
/** @typedef {import('./manifest.mjs').Action} Action */
/** @typedef {import('./plan.mjs').PlanHeader} PlanHeader */
/** @typedef {import('./plan.mjs').ChangelogEntry} ChangelogEntry */
/** @typedef {import('./apply.mjs').FileWrite} FileWrite */
/** @typedef {import('./apply.mjs').FileCopy} FileCopy */
/**
 * @typedef {{ pkg: string, entry: ReleasePackage, source: string, packed: Record<string, unknown> }} Selected
 * @typedef {{ name: string, target: string, sha256: string, source: string, packed: Record<string, unknown> }} Move
 */

/**
 * The version of a `## <version>` heading: `## 0.6.0`, `## [0.6.0] - 2026-11-18` or `## v0.6.0`.
 * @param {string} line
 */
function headingVersion(line) {
  let token = line.slice(3).trim().split(' ')[0] ?? '';
  if (token.startsWith('[')) {
    token = token.slice(1);
  }
  if (token.endsWith(']')) {
    token = token.slice(0, -1);
  }
  return token.startsWith('v') ? token.slice(1) : token;
}

/**
 * The `## <version>` sections of a CHANGELOG.md newer than `from`, up to and including `to`, in file
 * order (spec §7.6). With an unknown `from`, only the `to` section. Trailing blank lines are dropped.
 * @param {string} text
 * @param {string | null} from
 * @param {string} to
 * @returns {string}
 */
export function changelogBetween(text, from, to) {
  /** @type {string[]} */
  const kept = [];
  let include = false;
  for (const raw of text.split('\n')) {
    const line = raw.endsWith('\r') ? raw.slice(0, -1) : raw;
    if (line.startsWith('# ')) {
      include = false;
      continue;
    }
    if (line.startsWith('## ')) {
      const version = headingVersion(line);
      const upTo = compareVersions(version, to);
      const after = from === null ? (upTo === 0 ? 1 : null) : compareVersions(version, from);
      include = upTo !== null && upTo <= 0 && after !== null && after > 0;
    }
    if (include) {
      kept.push(line);
    }
  }
  while (kept.length > 0 && kept.at(-1)?.trim() === '') {
    kept.pop();
  }
  return kept.join('\n');
}

/**
 * Text lines of the changelog block: one head line per package, its sections indented below.
 * @param {string} vendoredAt
 * @param {string} short
 * @param {readonly ChangelogEntry[]} changelog
 */
function formatChangelog(vendoredAt, short, changelog) {
  return [
    `Changelog (${vendoredAt} → ${short}):`,
    ...changelog.flatMap(({ name, from, to, notes }) => {
      if (from === to) {
        return [`  ${name} ${to} unchanged version`];
      }
      const head = `  ${name} ${from ?? 'unknown'} → ${to}`;
      if (notes === null) {
        return [`${head} (no CHANGELOG.md in the tarball)`];
      }
      return [head, ...(notes === '' ? [] : notes.split('\n').map((line) => (line === '' ? '' : `    ${line}`)))];
    })
  ];
}

/**
 * Runs `egdev-ds upgrade`. Refusals throw RefusedError (exit 2); release, apply and verification
 * failures throw errors with status 1. A failed removal of an old tarball returns 1 after success.
 * @param {{
 *   argument: string,
 *   project: string,
 *   from: string,
 *   releaseDir: string,
 *   release: Release,
 *   options: Options,
 *   runner: Runner,
 *   stdout: (text: string) => void,
 *   stderr: (text: string) => void
 * }} input
 * @returns {Promise<number>}
 */
export async function runUpgrade({ argument, project, from, releaseDir, release, options, runner, stdout, stderr }) {
  // 1. Detect (spec §7.1, §5.5): only a vendored set can be upgraded.
  const { manifest } = readManifest(project, argument);
  const { packageManager, error: packageManagerError } = detectPackageManager(project, manifest);
  if (!packageManager) {
    throw new RefusedError(packageManagerError ?? 'Cannot detect the package manager.');
  }
  const workspaceText = readText(join(project, WORKSPACE_FILE));
  const specs = collectSpecifiers(manifest, workspaceText);
  if (specs.length === 0) {
    throw new RefusedError(`${argument} has no vendored @egdev packages; run egdev-ds init.`);
  }
  const state = vendorState(specs);
  if (state.unsafe) {
    throw new RefusedError(`Unsafe vendored path: ${state.unsafe.name} (${state.unsafe.spec}).`);
  }
  const foreign = specs.find(({ spec }) => !isVendorPath(spec));
  if (foreign) {
    throw new RefusedError(
      `${argument} declares ${foreign.name} as ${foreign.spec} (${foreign.source} ${foreign.field}); upgrade replaces only vendored tarballs.`
    );
  }
  const short = release.commit.slice(0, 7);
  if (release.dirty && !options.allowDirty) {
    throw new RefusedError(`Release ${from} was packed from a dirty tree (${short}); pass --allow-dirty to use it.`);
  }

  // 2-3. Select only what the app declares or overrides, and load it from the release (sha256 was
  // verified by readRelease; name, version and workspace: by loadReleasePackage).
  /** @type {Map<string, Selected>} */
  const selected = new Map();
  for (const pkg of PACKAGES) {
    const name = `@egdev/${pkg}`;
    if (specs.some((spec) => spec.name === name)) {
      selected.set(name, { pkg, ...loadReleasePackage({ release, releaseDir, from, name }) });
    }
  }

  // 4. The set as one unit: internal versions from the same release, declared by the app; external
  // peers satisfied by the installed versions.
  const releaseFile = join(from, 'release.json');
  for (const [name, { packed }] of selected) {
    const version = String(packed.version);
    const peers = field(packed, 'peerDependencies');
    const meta = field(packed, 'peerDependenciesMeta');
    for (const [dependency, range] of Object.entries({ ...field(packed, 'dependencies'), ...peers })) {
      if (typeof range !== 'string') {
        continue;
      }
      const optional = isRecord(meta[dependency]) && field(meta, dependency).optional === true;
      if (dependency.startsWith('@egdev/')) {
        const entry = release.packages.find((item) => item.name === dependency);
        if (!entry) {
          throw new ReleaseError(
            `Release lacks ${dependency}, which ${name} ${version} needs: ${releaseFile} does not list it.`
          );
        }
        if (satisfies(entry.version, range) !== true) {
          throw new ReleaseError(
            `Release mismatch: ${name} ${version} needs ${dependency} ${range}; ${releaseFile} has ${entry.version}.`
          );
        }
        if (!selected.has(dependency) && !optional) {
          throw new RefusedError(
            `${name} ${version} needs ${dependency}, which ${argument} does not declare; upgrade adds no packages.`
          );
        }
      } else if (Object.hasOwn(peers, dependency)) {
        const installed = findInstalled(project, dependency, project);
        const at = installed && typeof installed.version === 'string' ? installed.version : null;
        if (at === null && !optional) {
          throw new RefusedError(
            `${name} ${version} needs ${dependency} ${range}; ${argument} does not have it installed: run ${packageManager} install first.`
          );
        }
        if (at !== null && satisfies(at, range) !== true) {
          throw new RefusedError(
            `${name} ${version} needs ${dependency} ${range}; ${argument} has ${at} installed: update it, then upgrade.`
          );
        }
      }
    }
  }

  // 7. Plan: every vendored file moves to `<same folder>/egdev-<pkg>-<version>-<commit7>.tgz`.
  /** @type {Map<string, Move>} */
  const moves = new Map();
  for (const { name, spec } of specs) {
    const file = safeVendorFile(spec);
    const item = selected.get(name);
    if (file && item && !moves.has(file)) {
      const folder = file.slice(0, file.lastIndexOf('/'));
      moves.set(file, {
        name,
        target: `${folder}/egdev-${item.pkg}-${item.entry.version}-${short}.tgz`,
        sha256: item.entry.sha256,
        source: item.source,
        packed: item.packed
      });
    }
  }
  /** @param {string} spec */
  const respec = (spec) => {
    const file = safeVendorFile(spec);
    const move = file ? moves.get(file) : undefined;
    return file && move && move.target !== file ? `${spec.slice(0, spec.length - file.length)}${move.target}` : null;
  };

  /** @type {Action[]} */
  const actions = [];
  /** @type {FileCopy[]} */
  const copies = [];
  /** @type {FileWrite[]} */
  const writes = [];
  const targets = new Set();
  for (const move of moves.values()) {
    if (targets.has(move.target)) {
      continue;
    }
    targets.add(move.target);
    const existing = existsSync(join(project, move.target)) ? readFileSync(join(project, move.target)) : null;
    if (existing && sha256(existing) !== move.sha256) {
      throw new RefusedError(`Refusing to overwrite a different tarball: ${move.target}.`);
    }
    actions.push({ verb: existing ? 'keep' : 'copy', path: move.target, detail: `sha256 ${move.sha256}` });
    if (!existing) {
      copies.push({ path: move.target, source: move.source, sha256: move.sha256 });
    }
  }

  // Every specifier location, each keeping its folder and `file:` / `file:./` style.
  const next = structuredClone(manifest);
  /** @param {string} detail */
  const editManifest = (detail) => actions.push({ verb: 'edit', path: MANIFEST_FILE, detail });
  for (const key of DEPENDENCY_FIELDS) {
    const record = field(next, key);
    for (const [name, spec] of Object.entries(record)) {
      const value = name.startsWith('@egdev/') && typeof spec === 'string' ? respec(spec) : null;
      if (value !== null) {
        record[name] = value;
        editManifest(`${key}.${name} = ${value}`);
      }
    }
  }
  /**
   * @param {unknown} object
   * @param {string} label
   */
  const rewriteTree = (object, label) => {
    if (!isRecord(object)) {
      return;
    }
    for (const [key, value] of Object.entries(object)) {
      const replaced = typeof value === 'string' ? respec(value) : null;
      if (replaced !== null) {
        object[key] = replaced;
        editManifest(`${label}.${key} = ${replaced}`);
      } else {
        rewriteTree(value, `${label}.${key}`);
      }
    }
  };
  rewriteTree(next.overrides, 'overrides');
  rewriteTree(field(next, 'pnpm').overrides, 'pnpm.overrides');

  // Overrides the new set needs (spec §6.3-§6.4): npm `$` references for internal dependencies,
  // pnpm pins for every upgraded package. Existing values are never replaced.
  if (packageManager === 'npm') {
    const internal = [...selected.values()].flatMap(({ packed }) =>
      Object.keys(field(packed, 'dependencies')).filter((name) => name.startsWith('@egdev/'))
    );
    for (const dependency of new Set(internal)) {
      if (next.overrides === undefined) {
        next.overrides = {};
      }
      const overrides = next.overrides;
      if (!isRecord(overrides)) {
        throw new RefusedError(`${MANIFEST_FILE} overrides is not an object.`);
      }
      const reference = `$${dependency}`;
      if (!Object.hasOwn(overrides, dependency)) {
        overrides[dependency] = reference;
        editManifest(`overrides.${dependency} = ${reference}`);
      } else if (overrides[dependency] === reference) {
        actions.push({ verb: 'keep', path: MANIFEST_FILE, detail: `overrides.${dependency} = ${reference}` });
      }
    }
  }
  let nextWorkspace = workspaceText;
  if (workspaceText !== null) {
    const rewritten = rewriteWorkspace(workspaceText, respec);
    nextWorkspace = rewritten.text;
    actions.push(...rewritten.actions);
  }
  if (packageManager === 'pnpm') {
    /** @param {string} name */
    const pin = (name) => {
      const spec = specs.find((item) => item.name === name && DEPENDENCY_FIELDS.includes(item.field))?.spec;
      const fallback = specs.find((item) => item.name === name)?.spec ?? '';
      return respec(spec ?? fallback) ?? spec ?? fallback;
    };
    const pnpmOverrides = field(next, 'pnpm').overrides;
    if (isRecord(pnpmOverrides)) {
      for (const name of selected.keys()) {
        if (!Object.hasOwn(pnpmOverrides, name)) {
          const spec = pin(name);
          pnpmOverrides[name] = spec;
          editManifest(`pnpm.overrides.${name} = ${spec}`);
        }
      }
    } else {
      const present = new Set(workspaceOverrides(nextWorkspace).map(({ name }) => name));
      const missing = [...selected.keys()]
        .filter((name) => !present.has(name))
        .map((name) => ({ name, spec: pin(name) }));
      if (missing.length > 0) {
        const plan = planWorkspace(nextWorkspace, missing, false, false);
        if (plan.error !== undefined) {
          throw new RefusedError(plan.error);
        }
        actions.push(...plan.actions);
        nextWorkspace = plan.text;
      }
    }
  }
  if (actions.some((action) => action.path === MANIFEST_FILE && action.verb === 'edit')) {
    // Written only when a value changed, so an app's own formatting survives a no-op.
    writes.push({ path: MANIFEST_FILE, content: `${JSON.stringify(next, null, 2)}\n` });
  }
  if (nextWorkspace !== null && nextWorkspace !== workspaceText) {
    writes.push({ path: WORKSPACE_FILE, content: nextWorkspace });
  }

  // npm keeps a stale integrity unless the lock is rewritten before installing (spec §6.7).
  const lockfile = packageManager === 'npm' ? 'package-lock.json' : 'pnpm-lock.yaml';
  const lockText = packageManager === 'npm' ? readText(join(project, lockfile)) : null;
  if (lockText !== null) {
    /** @param {string} file */
    const replace = (file) => {
      const move = moves.get(file);
      return move && move.target !== file
        ? { file: move.target, integrity: sri(readFileSync(move.source)), packed: move.packed }
        : null;
    };
    const lock = rewriteNpmLock(lockText, replace, respec);
    if (lock.error !== undefined) {
      throw new RefusedError(lock.error);
    }
    for (const { key, resolved } of lock.rewritten) {
      actions.push({ verb: 'edit', path: lockfile, detail: `${key} = ${resolved}` });
    }
    if (lock.changed) {
      writes.push({ path: lockfile, content: lock.text });
    }
  }

  // 8 and 10: install, then remove the previous tarballs nothing references anymore.
  const install = [packageManager, 'install', ...(options.offline ? ['--offline'] : [])];
  if (!options.noInstall) {
    if (existsSync(join(project, 'node_modules/@egdev'))) {
      actions.push({ verb: 'remove', path: 'node_modules/@egdev', detail: '' });
    }
    actions.push({ verb: 'run', path: install.join(' '), detail: '' });
  }
  const removals = [...moves.keys()].filter((file) => !targets.has(file));
  for (const file of removals) {
    actions.push({ verb: 'remove', path: file, detail: '' });
  }

  // 6. Changelog diff between the installed and the new version of each package.
  /** @type {ChangelogEntry[]} */
  const changelog = [];
  for (const [name, item] of selected) {
    const oldFile = [...moves.entries()].find(([, move]) => move.name === name)?.[0];
    /** @type {string | null} */
    let installedVersion = null;
    try {
      const version = oldFile ? readPackedManifest(join(project, oldFile)).version : null;
      installedVersion = typeof version === 'string' ? version : null;
    } catch {
      installedVersion = null;
    }
    const to = item.entry.version;
    /** @type {string | null} */
    let notes = '';
    if (installedVersion !== to) {
      const bytes = readPackedFile(item.source, 'package/CHANGELOG.md');
      notes = bytes === null ? null : changelogBetween(bytes.toString('utf8'), installedVersion, to);
    }
    changelog.push({ name, from: installedVersion, to, notes });
  }
  const vendoredAt = state.commits.map((commit) => (commit === 'none' ? 'unversioned' : commit.slice(0, 7))).join(', ');

  /** @type {PlanHeader} */
  const header = {
    command: 'upgrade',
    project: argument,
    packageManager,
    framework: detectFramework(manifest).framework,
    cssMode: detectCssMode(manifest),
    release: { dir: from, commit: release.commit }
  };

  // 5. Already current: verify the integrities, change nothing (spec §7.5, §9.8).
  if (copies.length === 0 && writes.length === 0 && removals.length === 0) {
    const count = options.noInstall ? null : verifyLock(project, packageManager, true);
    if (options.json) {
      stdout(formatPlanJson({ header, actions: [], result: 'current', changelog: [] }));
    } else {
      const verified =
        count === null ? 'integrities unverified (--no-install)' : `${count} vendored integrities verified`;
      stdout(`${formatHeader(header)}\nAlready at ${short}; ${verified}; no changes.\n`);
    }
    return 0;
  }
  for (const path of [...copies.map((copy) => copy.path), ...writes.map((write) => write.path), ...removals]) {
    assertSafeTarget(project, path);
  }

  if (!options.json) {
    stdout(
      `${[formatHeader(header), ...actions.map(formatAction), ...formatChangelog(vendoredAt, short, changelog)].join('\n')}\n`
    );
  }
  if (options.dryRun) {
    stdout(
      options.json ? formatPlanJson({ header, actions, result: 'planned', changelog }) : 'Dry run: nothing written.\n'
    );
    return 0;
  }

  // 7-9. One transaction: copies, writes, install and verification; any failure restores every byte.
  /** @type {number | null} */
  let count;
  try {
    count = await transact({
      project,
      copies,
      writes,
      watch: packageManager === 'pnpm' ? [lockfile, WORKSPACE_FILE] : [lockfile],
      finish: () => {
        if (options.noInstall) {
          return null;
        }
        runInstall({ project, install, runner, stderr });
        return verifyLock(project, packageManager, true);
      }
    });
  } catch (error) {
    if (options.json) {
      stdout(formatPlanJson({ header, actions, result: 'failed', changelog }));
    }
    throw error;
  }

  // 10. Old tarballs go only after success; a failure here leaves the new install as it is.
  /** @type {string[]} */
  const failures = [];
  for (const file of removals) {
    try {
      assertSafeTarget(project, file);
      rmSync(join(project, file), { force: true });
    } catch (error) {
      failures.push(`Cannot remove ${file} (${codeOf(error)}); new installation is intact.`);
    }
  }

  if (options.json) {
    stdout(formatPlanJson({ header, actions, result: 'applied', changelog }));
  } else {
    const verified =
      count === null ? 'integrities unverified (--no-install)' : `${count} vendored integrities verified`;
    stdout(
      [
        `Upgraded to ${short}; ${verified}.`,
        ...nextSteps({ packageManager, install, noInstall: options.noInstall }),
        ''
      ].join('\n')
    );
  }
  if (failures.length > 0) {
    stderr(`${failures.join('\n')}\n`);
    return 1;
  }
  return 0;
}
