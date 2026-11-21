// `egdev-ds doctor <project>` (spec §8): read-only checks with stable codes. A code is never reused
// for another check; the text after it may change. Doctor writes nothing, anywhere.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { basename, dirname, isAbsolute, join, relative, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { findCssEntry } from './css.mjs';
import {
  collectSpecifiers,
  commitOf,
  DEPENDENCY_FIELDS,
  declares,
  detectCssMode,
  detectFramework,
  detectPackageManager,
  field,
  findRepoRoot,
  isVendorPath,
  overrideEntries,
  PACKAGES,
  REPO_NAME,
  safeVendorFile,
  workspaceOverrides
} from './detect.mjs';
import { createGuard } from './guard.mjs';
import { checkLockfile } from './lockfile.mjs';
import { isRecord, readPackedManifest, sha256 } from './release.mjs';
import { satisfies } from './semver.mjs';
import { flattenMessage } from './text.mjs';

/** @typedef {import('./release.mjs').Release} Release */
/** @typedef {import('./release.mjs').ResolvedIssue} ResolvedIssue */
/** @typedef {import('./guard.mjs').GuardAllowlistEntry} GuardAllowlistEntry */
/** @typedef {import('./guard.mjs').GuardSource} GuardSource */
/** @typedef {import('./guard.mjs').GuardEngine} GuardEngine */
/** @typedef {'error' | 'warning' | 'skipped'} Severity */
/** @typedef {{ code: string, severity: Severity, message: string, file?: string, line?: number }} Finding */
/**
 * @typedef {{
 *   packageManager: 'npm' | 'pnpm' | null,
 *   framework: 'next' | 'vite' | null,
 *   cssMode: 'tailwind' | 'native' | null,
 *   findings: Finding[]
 * }} DoctorReport
 */
/** @typedef {{ sourceDirectory: string, themeDirectory: string, localRepo: string, exclude: string[] }} DoctorConfig */
/** @typedef {{ name: string, spec: string, file: string, source: string, field: string }} Vendored */

export const CONFIG_FILE = 'egdev-ds.json';
export const ALLOWLIST_FILE = 'design-system-allowlist.ts';
const RELEASE_SKIPPED = 'Release check skipped: pass --from <dir>.';
const CSS_PACKAGES = ['tokens', 'ui', 'effects'];
const CONFIG_KEYS = new Set(['schemaVersion', 'sourceDirectory', 'themeDirectory', 'localRepo', 'exclude']);
export const SYSTEM_MD = 'design/system.md';
// The header the apps' design/system.md sync scripts write on the first line (#486):
// `<!-- Generated from EGDEV design system <commit>; regenerate: … -->`.
const SYSTEM_MD_HEADER = /^<!-- Generated from EGDEV design system ([0-9a-f]{7,40})(?![0-9a-f])/;

/**
 * @param {string} path
 * @returns {string | null}
 */
function readText(path) {
  try {
    return readFileSync(path, 'utf8');
  } catch {
    return null;
  }
}

/** @param {string} path */
const isFile = (path) => {
  try {
    return statSync(path).isFile();
  } catch {
    return false;
  }
};

/** @param {string} text */
const oneLine = (text) => flattenMessage(text).trim();

/** @param {string} path */
const isRelativePath = (path) =>
  path !== '' &&
  !isAbsolute(path) &&
  !path.includes('\\') &&
  path.split('/').every((part) => part !== '' && part !== '.' && part !== '..');

/**
 * The default `localRepo` (#485, odd/tasks/egdev-ds-485-486.md S2): the folder name of the nearest
 * ancestor holding `.git`, else the unscoped package name, else `app`. Names must be repository names.
 * @param {string} project an absolute path
 * @param {Record<string, unknown>} manifest
 */
export function defaultLocalRepo(project, manifest) {
  const root = findRepoRoot(project);
  const folder = root ? basename(root) : '';
  if (REPO_NAME.test(folder)) {
    return folder;
  }
  const name = typeof manifest.name === 'string' ? manifest.name.replace(/^@[^/]+\//, '') : '';
  return REPO_NAME.test(name) ? name : 'app';
}

/**
 * Doctor options from `egdev-ds.json` (Q6). Missing or invalid files fall back to the defaults so
 * the remaining checks still run, and DS045 reports the problem.
 * @param {string} project
 * @param {Record<string, unknown>} manifest
 * @returns {{ config: DoctorConfig, problem?: string }}
 */
export function readConfig(project, manifest) {
  /** @type {DoctorConfig} */
  const config = {
    sourceDirectory: 'src',
    themeDirectory: 'src/theme/',
    localRepo: defaultLocalRepo(project, manifest),
    exclude: []
  };
  const text = readText(join(project, CONFIG_FILE));
  if (text === null) {
    return { config, problem: 'File not found.' };
  }
  /** @type {unknown} */
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    return { config, problem: 'Invalid JSON.' };
  }
  if (!isRecord(data) || data.schemaVersion !== 1) {
    return { config, problem: 'schemaVersion must be 1.' };
  }
  const unknown = Object.keys(data).find((key) => !CONFIG_KEYS.has(key));
  if (unknown) {
    return { config, problem: `Unknown key "${unknown}".` };
  }
  const { sourceDirectory, themeDirectory, localRepo, exclude } = data;
  if (sourceDirectory !== undefined && (typeof sourceDirectory !== 'string' || !isRelativePath(sourceDirectory))) {
    return { config, problem: 'sourceDirectory must be a relative directory inside the project.' };
  }
  if (
    themeDirectory !== undefined &&
    (typeof themeDirectory !== 'string' ||
      !themeDirectory.endsWith('/') ||
      !isRelativePath(themeDirectory.slice(0, -1)))
  ) {
    return { config, problem: 'themeDirectory must be a relative directory ending with /.' };
  }
  if (localRepo !== undefined && (typeof localRepo !== 'string' || !REPO_NAME.test(localRepo))) {
    return { config, problem: 'localRepo must be a repository name.' };
  }
  if (
    exclude !== undefined &&
    (!Array.isArray(exclude) ||
      !exclude.every((entry) => typeof entry === 'string' && isRelativePath(entry.replace(/\/$/, ''))))
  ) {
    return { config, problem: 'exclude must be an array of relative paths.' };
  }
  return {
    config: {
      sourceDirectory: sourceDirectory ?? config.sourceDirectory,
      themeDirectory: themeDirectory ?? config.themeDirectory,
      localRepo: localRepo ?? config.localRepo,
      exclude: Array.isArray(exclude) ? exclude.map((entry) => String(entry).replace(/\/$/, '')) : []
    }
  };
}

/**
 * The nearest `design/system.md` from `project` up to its repository root (the nearest `.git`
 * ancestor), or only inside `project` when there is none. Nexo keeps the file at its repository root.
 * @param {string} project
 * @returns {string | null} an absolute path
 */
function findSystemMd(project) {
  const root = findRepoRoot(project) ?? project;
  for (let directory = project; ; directory = dirname(directory)) {
    const path = join(directory, SYSTEM_MD);
    if (isFile(path)) {
      return path;
    }
    if (directory === root || dirname(directory) === directory) {
      return null;
    }
  }
}

/**
 * The DS commit recorded in the first line of a design/system.md, or null.
 * @param {string} text
 */
export function systemMdCommit(text) {
  const end = text.indexOf('\n');
  return (end === -1 ? text : text.slice(0, end)).match(SYSTEM_MD_HEADER)?.[1] ?? null;
}

/**
 * Node-style lookup of an installed package from `from`, never above `root`.
 * @param {string} from
 * @param {string} name
 * @param {string} root
 * @returns {Record<string, unknown> | null}
 */
export function findInstalled(from, name, root) {
  for (let directory = from; ; directory = dirname(directory)) {
    if (basename(directory) !== 'node_modules') {
      const text = readText(join(directory, 'node_modules', name, 'package.json'));
      if (text !== null) {
        try {
          const manifest = JSON.parse(text);
          return isRecord(manifest) ? manifest : null;
        } catch {
          return null;
        }
      }
    }
    if (directory === root || dirname(directory) === directory) {
      return null;
    }
  }
}

/**
 * Walks the guarded tree: `.tsx` and `.css` files, sorted by name, skipping symlinks, `node_modules`
 * and excluded paths.
 * @param {string} project
 * @param {DoctorConfig} config
 * @returns {GuardSource[]}
 */
function readSources(project, config) {
  /** @param {string} directory */
  const visit = (directory) => {
    /** @type {GuardSource[]} */
    const sources = [];
    /** @type {import('node:fs').Dirent[]} */
    let entries;
    try {
      entries = readdirSync(join(project, directory), { withFileTypes: true });
    } catch {
      return sources;
    }
    for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
      const file = `${directory}/${entry.name}`;
      if (config.exclude.some((excluded) => file === excluded || file.startsWith(`${excluded}/`))) {
        continue;
      }
      if (entry.isDirectory() && entry.name !== 'node_modules') {
        sources.push(...visit(file));
      } else if (entry.isFile() && /\.(?:tsx|css)$/.test(entry.name)) {
        sources.push({ file, content: readFileSync(join(project, file), 'utf8') });
      }
    }
    return sources;
  };
  return visit(config.sourceDirectory);
}

/**
 * Loads `<sourceDirectory>/design-system-allowlist.ts` with Node's built-in type stripping (Q5).
 * @param {string} project
 * @param {string} file
 * @returns {Promise<{ allowlist: GuardAllowlistEntry[] } | { problem: string }>}
 */
export async function loadAllowlist(project, file) {
  const path = join(project, file);
  const text = readText(path);
  if (text === null) {
    return { allowlist: [] };
  }
  /** @type {unknown} */
  let value;
  try {
    // The content hash defeats the module cache, so a changed file is never served stale.
    const version = createHash('sha256').update(text).digest('hex').slice(0, 16);
    const loaded = await import(`${pathToFileURL(path).href}?v=${version}`);
    value = loaded.designSystemAllowlist;
  } catch (error) {
    return { problem: `Cannot load the allowlist: ${oneLine(error instanceof Error ? error.message : String(error))}` };
  }
  if (!Array.isArray(value)) {
    return { problem: 'Invalid allowlist: expected an exported designSystemAllowlist array.' };
  }
  /** @type {GuardAllowlistEntry[]} */
  const allowlist = [];
  for (const [index, entry] of value.entries()) {
    const label = `Invalid allowlist entry ${index + 1}`;
    if (
      !isRecord(entry) ||
      typeof entry.file !== 'string' ||
      typeof entry.pattern !== 'string' ||
      typeof entry.issue !== 'string' ||
      typeof entry.reason !== 'string'
    ) {
      return { problem: `${label}: file, pattern, issue and reason must be strings.` };
    }
    if (
      (entry.kind !== undefined && entry.kind !== 'component-gap') ||
      (entry.comment !== undefined && typeof entry.comment !== 'string')
    ) {
      return { problem: `${label}: kind must be component-gap and comment a string.` };
    }
    allowlist.push({
      file: entry.file,
      pattern: entry.pattern,
      issue: entry.issue,
      reason: entry.reason,
      ...(entry.kind === 'component-gap' ? { kind: entry.kind } : {}),
      ...(typeof entry.comment === 'string' ? { comment: entry.comment } : {})
    });
  }
  return { allowlist };
}

/**
 * Match DS issues in the guard allowlist to release metadata. Reuse the guard's source walk to
 * locate a TODO or pattern when possible; unresolved or unsafe paths still produce a file notice.
 * @param {{ project: string, config: DoctorConfig, allowlist: GuardAllowlistEntry[], resolves: ResolvedIssue[], usedPackages: ReadonlySet<string> }} input
 * @returns {{ entry: GuardAllowlistEntry, resolvedIn: string, line?: number }[]}
 */
export function resolvedMitigations({ project, config, allowlist, resolves, usedPackages }) {
  const matches = allowlist.flatMap((entry) => {
    const reference = entry.issue.match(/^egdev6\/egdev-design-system#(\d+)$/);
    const issue = reference ? Number(reference[1]) : 0;
    /** @type {Map<string, ResolvedIssue>} */
    const packages = new Map();
    for (const resolution of resolves) {
      if (
        issue > 0 &&
        resolution.issue === issue &&
        usedPackages.has(resolution.package) &&
        !packages.has(resolution.package)
      ) {
        packages.set(resolution.package, resolution);
      }
    }
    const resolvedIn = [...packages.values()]
      .sort((a, b) => (a.package < b.package ? -1 : a.package > b.package ? 1 : 0))
      .map((resolution) => `${resolution.package} ${resolution.version}`)
      .join(', ');
    return resolvedIn ? [{ entry, resolvedIn }] : [];
  });
  if (matches.length === 0) {
    return [];
  }
  /** @type {GuardSource[]} */
  let sources = [];
  try {
    // A symlinked source root must not make upgrade read outside the consumer project.
    const projectRoot = realpathSync(project);
    const sourceRoot = realpathSync(join(project, config.sourceDirectory));
    const within = relative(projectRoot, sourceRoot);
    if (!within.startsWith('..') && !isAbsolute(within)) {
      sources = readSources(project, config);
    }
  } catch {
    // The entry still identifies the file even when its source cannot be read.
  }
  const sourceByFile = new Map(sources.map((source) => [source.file, source]));
  const offsets = new Map();
  /** @type {Map<GuardAllowlistEntry, number>} */
  const lines = new Map();
  // The guard consumes one occurrence per entry. Advance through repeated anchors even for
  // unmatched entries, so each notice points to its own occurrence rather than the first one.
  for (const entry of allowlist) {
    const source = sourceByFile.get(entry.file);
    const anchor = entry.comment ?? entry.pattern;
    const key = `${entry.file}\0${anchor}`;
    const offset = anchor ? (source?.content.indexOf(anchor, offsets.get(key) ?? 0) ?? -1) : -1;
    if (source && offset >= 0) {
      offsets.set(key, offset + anchor.length);
      lines.set(entry, source.content.slice(0, offset).split('\n').length);
    }
  }
  return matches.map(({ entry, resolvedIn }) => {
    const line = lines.get(entry);
    return { entry, resolvedIn, ...(line === undefined ? {} : { line }) };
  });
}

/**
 * Runs every doctor check against `project` (an absolute path). `release` is the verified
 * `--from` release, or null when no `--from` was passed. `failOnPending` affects DS043 only.
 * @param {{ project: string, release: Release | null, failOnPending?: boolean }} input
 * @returns {Promise<DoctorReport>}
 */
export async function runDoctor({ project, release, failOnPending = false }) {
  /** @type {Finding[]} */
  const findings = [];
  const seen = new Set();
  /**
   * @param {string} code
   * @param {Severity} severity
   * @param {string} message
   * @param {string} [file]
   * @param {number} [line]
   * @param {number} [entryIndex] distinguish matching allowlist entries with identical locations
   */
  const add = (code, severity, message, file, line, entryIndex) => {
    const key = `${code}\0${file ?? ''}\0${line ?? ''}\0${message}\0${entryIndex ?? ''}`;
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    findings.push({ code, severity, message, ...(file ? { file } : {}), ...(line ? { line } : {}) });
  };
  const sorted = () =>
    findings
      .map((finding, index) => ({ finding, index }))
      .sort((a, b) => a.finding.code.localeCompare(b.finding.code) || a.index - b.index)
      .map(({ finding }) => finding);

  // DS001
  const manifestText = readText(join(project, 'package.json'));
  /** @type {unknown} */
  let parsed = null;
  if (manifestText !== null) {
    try {
      parsed = JSON.parse(manifestText);
    } catch {
      parsed = null;
    }
  }
  if (!isRecord(parsed)) {
    add(
      'DS001',
      'error',
      `Cannot read package.json: ${manifestText === null ? 'not found' : 'invalid JSON'}.`,
      'package.json'
    );
    return { packageManager: null, framework: null, cssMode: null, findings: sorted() };
  }
  const manifest = parsed;
  const projectReal = realpathSync(project);

  // DS002, DS003
  const { packageManager, error: packageManagerError } = detectPackageManager(project, manifest);
  if (packageManagerError) {
    add('DS002', 'error', packageManagerError);
  }
  const install = `run ${packageManager ?? 'the package manager'} install`;
  const pin = typeof manifest.packageManager === 'string' ? manifest.packageManager : '';
  const pnpmMajor = pin.match(/^pnpm@(\d+)/)?.[1];
  if (packageManager === 'pnpm' && pnpmMajor && pnpmMajor !== '10') {
    add('DS003', 'warning', `packageManager ${pin} differs from the design system pin pnpm@10.`, 'package.json');
  }

  // DS010, DS013 (specifiers)
  const workspace = readText(join(project, 'pnpm-workspace.yaml'));
  const specs = collectSpecifiers(manifest, workspace);
  /** @type {Vendored[]} */
  const vendored = [];
  for (const { name, spec, source, field: key } of specs) {
    const file = safeVendorFile(spec);
    if (/^(?:workspace|link):/.test(spec)) {
      add('DS013', 'error', `${name} uses ${spec}; vendor the tarball instead.`, source);
    } else if (file) {
      vendored.push({ name, spec, file, source, field: key });
    } else if (isVendorPath(spec)) {
      add('DS010', 'error', `Unsafe vendored path: ${name} (${spec}).`, source);
    } else {
      add('DS010', 'error', `Not vendored: ${name} (${spec}); point it at a vendor/ tarball.`, source);
    }
  }

  // DS011 and the packed manifest of each vendored file
  /** @type {Map<string, { first: Vendored, manifest: Record<string, unknown> | null }>} */
  const files = new Map();
  for (const item of vendored) {
    if (files.has(item.file)) {
      continue;
    }
    const path = join(project, item.file);
    /** @type {Record<string, unknown> | null} */
    let packed = null;
    if (!isFile(path)) {
      add('DS011', 'error', `Missing vendored tarball: ${item.file}.`, item.source);
    } else {
      try {
        packed = readPackedManifest(path);
      } catch {
        add('DS011', 'error', `Unreadable vendored tarball: ${item.file}.`, item.source);
      }
    }
    files.set(item.file, { first: item, manifest: packed });
  }

  // DS012
  if (vendored.length > 0) {
    if (!packageManager) {
      add('DS012', 'skipped', 'Skipped: the package manager is unknown (DS002).');
    } else {
      const expected = [...files.values()]
        .map(({ first }) => first)
        .filter((item) => packageManager === 'pnpm' || item.source === 'package.json');
      for (const problem of checkLockfile({ project, packageManager, expected })) {
        add(problem.code, 'error', problem.message, problem.file);
      }
    }
  }

  // Installed copies of the declared packages
  const declared = PACKAGES.map((pkg) => `@egdev/${pkg}`).filter((name) => declares(manifest, name));
  /** @type {{ name: string, directory: string, manifest: Record<string, unknown> }[]} */
  const installed = [];
  for (const name of declared) {
    const link = join(project, 'node_modules', name);
    const text = readText(join(link, 'package.json'));
    /** @type {unknown} */
    let copy = null;
    try {
      copy = text === null ? null : JSON.parse(text);
    } catch {
      copy = null;
    }
    if (!isRecord(copy)) {
      add('DS015', 'error', `${name} is not installed; ${install}.`);
      continue;
    }
    const real = realpathSync(link);
    const inside = relative(projectReal, real);
    if (inside.startsWith('..') || isAbsolute(inside)) {
      add('DS015', 'error', `${name} resolves outside the project: ${real}.`);
      continue;
    }
    installed.push({ name, directory: real, manifest: copy });
    // DS013 (installed manifests)
    for (const key of DEPENDENCY_FIELDS) {
      for (const [dependency, range] of Object.entries(field(copy, key))) {
        if (typeof range === 'string' && /^(?:workspace|link):/.test(range)) {
          add(
            'DS013',
            'error',
            `Installed ${name} declares ${dependency} as ${range}.`,
            `node_modules/${name}/package.json`
          );
        }
      }
    }
    // DS015 (version)
    const direct = vendored.find((item) => item.name === name && DEPENDENCY_FIELDS.includes(item.field));
    const packed = direct ? files.get(direct.file)?.manifest : null;
    if (packed && copy.version !== packed.version) {
      add('DS015', 'error', `${name} installed ${copy.version}, vendored tarball is ${packed.version}; ${install}.`);
    }
  }

  // DS014, DS017, DS051; DS052 uses the same single-commit gate as DS017.
  const commits = [...new Set([...files.keys()].map((file) => commitOf(file) ?? 'none'))].sort();
  const commit = commits.length === 1 && commits[0] !== 'none' ? (commits[0] ?? null) : null;
  if (files.size > 0) {
    const systemMd = findSystemMd(project);
    const systemFile = systemMd ? relative(project, systemMd).split('\\').join('/') : undefined;
    const recorded = systemMd ? systemMdCommit(readText(systemMd) ?? '') : null;
    if (!commit) {
      add('DS051', 'skipped', 'Skipped: the vendored set is mixed (DS014).');
    } else if (!systemMd) {
      add('DS051', 'skipped', `Skipped: no ${SYSTEM_MD} in the project or up to its repository root.`);
    } else if (!recorded) {
      add('DS051', 'skipped', 'Skipped: the header records no design system commit.', systemFile);
    } else if (!recorded.startsWith(commit) && !commit.startsWith(recorded)) {
      add(
        'DS051',
        'warning',
        `Header records ${recorded.slice(0, 7)}, vendored at ${commit.slice(0, 7)}: regenerate ${SYSTEM_MD}.`,
        systemFile
      );
    }
    if (!commit) {
      add('DS014', 'error', `Vendored files do not share one commit: ${commits.join(', ')}.`, 'package.json');
      add('DS017', 'skipped', release ? 'Release check skipped: the vendored set is mixed (DS014).' : RELEASE_SKIPPED);
    } else if (!release) {
      add('DS014', 'skipped', RELEASE_SKIPPED);
      add('DS017', 'skipped', RELEASE_SKIPPED);
    } else if (!release.commit.startsWith(commit)) {
      add(
        'DS014',
        'warning',
        `upgrade available: vendored at ${commit.slice(0, 7)}, release at ${release.commit.slice(0, 7)}.`,
        'package.json'
      );
      add('DS017', 'skipped', 'Release check skipped: the vendored commit differs from the release.');
    } else {
      for (const [file, { manifest: packed }] of files) {
        if (!packed) {
          continue;
        }
        const entry = release.packages.find((item) => item.name === packed.name && item.version === packed.version);
        if (!entry) {
          add(
            'DS017',
            'error',
            `${packed.name} ${packed.version} is not in the release at ${release.commit.slice(0, 7)}.`,
            file
          );
        } else if (sha256(readFileSync(join(project, file))) !== entry.sha256) {
          add('DS017', 'error', `sha256 differs from release.json (${packed.name} ${packed.version}).`, file);
        }
      }
    }
  }

  // DS016
  if (packageManager === 'npm') {
    const overrides = field(manifest, 'overrides');
    for (const { manifest: packed } of files.values()) {
      for (const dependency of Object.keys(packed ? field(packed, 'dependencies') : {})) {
        if (!PACKAGES.some((pkg) => dependency === `@egdev/${pkg}`)) {
          continue;
        }
        const value = overrides[dependency];
        const spec = isRecord(value) ? value['.'] : value;
        if (spec !== `$${dependency}` && !safeVendorFile(spec)) {
          add('DS016', 'error', `Missing npm override: "${dependency}": "$${dependency}".`, 'package.json');
        }
      }
    }
  } else if (packageManager === 'pnpm') {
    const inManifest = isRecord(field(manifest, 'pnpm').overrides);
    const location = inManifest ? 'package.json' : 'pnpm-workspace.yaml';
    const overrides = [...overrideEntries(field(manifest, 'pnpm').overrides), ...workspaceOverrides(workspace)];
    for (const item of vendored.filter((entry) => DEPENDENCY_FIELDS.includes(entry.field))) {
      const override = overrides.find((entry) => entry.name === item.name);
      if (!override) {
        add('DS016', 'error', `Missing pnpm override: '${item.name}': '${item.spec}'.`, location);
      } else if (safeVendorFile(override.spec) !== item.file) {
        add(
          'DS016',
          'error',
          `pnpm override for ${item.name} points at ${override.spec}; the dependency points at ${item.spec}.`,
          location
        );
      }
    }
  }

  // DS020, DS021
  for (const { name, directory, manifest: copy } of installed) {
    const peers = field(copy, 'peerDependencies');
    const meta = field(copy, 'peerDependenciesMeta');
    for (const [dependency, range] of Object.entries({ ...field(copy, 'dependencies'), ...peers })) {
      const internal = dependency.startsWith('@egdev/');
      if (typeof range !== 'string' || /^(?:workspace|link):/.test(range) || (!internal && !(dependency in peers))) {
        continue;
      }
      const code = internal ? 'DS020' : 'DS021';
      const needs = `${name} ${copy.version} needs ${dependency} ${range}`;
      const found = findInstalled(directory, dependency, projectReal);
      const optional = isRecord(meta[dependency]) && field(meta, dependency).optional === true;
      if (!found || typeof found.version !== 'string') {
        if (!optional) {
          add(code, 'error', `${needs}; not installed.`);
        }
        continue;
      }
      const result = satisfies(found.version, range);
      if (result === false) {
        add(code, 'error', `${needs}; installed ${found.version}.`);
      } else if (result === null) {
        add(code, 'error', `${needs}; installed ${found.version} (range not checked).`);
      }
    }
  }

  // DS030, DS031
  const frameworkResult = detectFramework(manifest);
  const cssMode = detectCssMode(manifest);
  const cssPackages = CSS_PACKAGES.filter((pkg) => declares(manifest, `@egdev/${pkg}`));
  if (cssPackages.length > 0) {
    if (!frameworkResult.framework) {
      add('DS030', 'error', frameworkResult.error ?? 'Cannot find the CSS entry.');
    } else {
      const entry = findCssEntry(project, frameworkResult.framework);
      if (entry.error) {
        add('DS030', 'error', entry.error);
      } else {
        const fromModule = entry.moduleImports.some((specifier) => /^@egdev\/.+\.css$/.test(specifier));
        const location = (fromModule ? entry.module : (entry.file ?? entry.module)) ?? undefined;
        const imports = [...entry.moduleImports, ...entry.cssImports];
        const theme = '@egdev/tokens/theme.css';
        const tokens = '@egdev/tokens/tokens.css';
        /** @type {Record<string, string>} */
        const required = {
          tokens: cssMode === 'tailwind' ? theme : tokens,
          ui: '@egdev/ui/styles.css',
          effects: '@egdev/effects/styles.css'
        };
        for (const pkg of cssPackages) {
          const target = required[pkg];
          if (target && !imports.includes(target)) {
            add('DS030', 'error', `Missing import: ${target}.`, location);
          }
        }
        const needsTailwind = `${theme} needs @import "tailwindcss" before it.`;
        const themeIndex = entry.cssImports.indexOf(theme);
        const tailwindIndex = entry.cssImports.indexOf('tailwindcss');
        if (themeIndex !== -1 && (tailwindIndex === -1 || tailwindIndex > themeIndex)) {
          add('DS031', 'error', needsTailwind, entry.file ?? undefined);
        }
        if (entry.moduleImports.includes(theme)) {
          add('DS031', 'error', needsTailwind, entry.module ?? undefined);
        }
        if (imports.includes(theme) && imports.includes(tokens)) {
          add('DS031', 'error', `Both ${tokens} and ${theme} are imported; choose one CSS mode.`, location);
        }
      }
    }
  }

  // DS045, DS044, DS040-DS043
  const { config, problem } = readConfig(project, manifest);
  if (problem) {
    add('DS045', 'error', problem, CONFIG_FILE);
  }
  const require = createRequire(join(project, 'package.json'));
  const missingEngines = ['typescript', 'postcss'].filter((name) => {
    try {
      require.resolve(name);
      return false;
    } catch {
      return true;
    }
  });
  for (const name of missingEngines) {
    add('DS044', 'error', `Cannot resolve ${name} from the project; add it as a devDependency.`);
  }
  const allowlistFile = `${config.sourceDirectory}/${ALLOWLIST_FILE}`;
  const loaded =
    missingEngines.length === 0 || (release && release.resolves.length > 0)
      ? await loadAllowlist(project, allowlistFile)
      : null;
  if (missingEngines.length === 0 && loaded) {
    /** @type {GuardEngine} */
    const engine = { ts: require('typescript'), postcss: require('postcss') };
    if ('problem' in loaded) {
      add('DS042', 'error', loaded.problem, allowlistFile);
    } else {
      const sources = readSources(project, config).filter((source) => {
        if (!source.file.endsWith('.css')) {
          return true;
        }
        try {
          engine.postcss.parse(source.content, { from: source.file });
          return true;
        } catch (error) {
          const detail = isRecord(error) && typeof error.reason === 'string' ? error.reason : 'syntax error';
          const line = isRecord(error) && typeof error.line === 'number' ? error.line : undefined;
          add('DS041', 'error', `Cannot parse CSS: ${detail}.`, source.file, line);
          return false;
        }
      });
      const result = createGuard(engine).checkDesignSystem(sources, loaded.allowlist, {
        localRepo: config.localRepo,
        themeDirectory: config.themeDirectory,
        sourceDirectory: config.sourceDirectory
      });
      for (const { file, line, snippet } of result.violations) {
        if (file.endsWith('.css')) {
          add(
            'DS041',
            'error',
            `DS internal selector ${snippet}: move it under ${config.themeDirectory} or add an allowlist entry with an issue.`,
            file,
            line
          );
        } else {
          add(
            'DS040',
            'error',
            `Raw ${snippet}: use a DS component or add an allowlist entry with an issue.`,
            file,
            line
          );
        }
      }
      for (const error of result.errors) {
        const split = error.indexOf(': ');
        const text = error.slice(split + 2);
        add('DS042', 'error', `${text.charAt(0).toUpperCase()}${text.slice(1)}.`, error.slice(0, split));
      }
      const pending = result.pendingIssueCount;
      if (pending > 0) {
        const placeholder = `${config.localRepo}#TBD-*`;
        add(
          'DS043',
          failOnPending ? 'error' : 'warning',
          pending === 1
            ? `1 allowlist entry uses ${placeholder} placeholders; replace it with a real issue.`
            : `${pending} allowlist entries use ${placeholder} placeholders; replace them with real issues.`,
          allowlistFile
        );
      }
    }
  }

  // DS052: release-dependent notices do not change DS043 or --fail-on-pending.
  if (!release) {
    add('DS052', 'skipped', RELEASE_SKIPPED);
  } else if (!commit || !release.commit.startsWith(commit)) {
    add('DS052', 'skipped', 'Skipped: vendored set is not at the release commit; upgrade first.');
  } else if (release.resolves.length > 0 && loaded) {
    if ('problem' in loaded) {
      add('DS052', 'skipped', 'Skipped: cannot load the allowlist.', allowlistFile);
    } else {
      for (const [index, { entry, resolvedIn, line }] of resolvedMitigations({
        project,
        config,
        allowlist: loaded.allowlist,
        resolves: release.resolves,
        usedPackages: new Set(specs.map(({ name }) => name))
      }).entries()) {
        add(
          'DS052',
          'warning',
          `Remove the mitigation for ${entry.issue} (resolved in ${resolvedIn}).`,
          entry.file,
          line,
          index
        );
      }
    }
  }

  // DS050
  if (declares(manifest, '@egdev/mcp')) {
    let wired = false;
    for (let directory = project; !wired; directory = dirname(directory)) {
      const text = readText(join(directory, '.mcp.json'));
      if (text !== null) {
        try {
          const data = JSON.parse(text);
          const server = isRecord(data) ? field(field(data, 'mcpServers'), 'egdev-design-system') : {};
          const args = Array.isArray(server.args) ? server.args.filter((arg) => typeof arg === 'string') : [];
          const script = args.find((arg) => /\.[cm]?js$/.test(arg)) ?? args[0];
          wired = typeof script === 'string' && existsSync(resolve(directory, script));
        } catch {
          wired = false;
        }
      }
      if (dirname(directory) === directory) {
        break;
      }
    }
    if (!wired) {
      add(
        'DS050',
        'warning',
        '@egdev/mcp is a dependency, but no .mcp.json in the project or an ancestor has an egdev-design-system server whose script exists.'
      );
    }
  }

  return { packageManager, framework: frameworkResult.framework, cssMode, findings: sorted() };
}
