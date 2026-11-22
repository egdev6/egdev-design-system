// `egdev-ds init <project>` (spec §5, §6, §9): read-only detection, then a plan of every owned
// edit, conflict refusal, and one transaction that copies, writes, installs and verifies.
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, statSync } from 'node:fs';
import { dirname, isAbsolute, join, relative, resolve, sep } from 'node:path';
import { assertSafeTarget, transact } from './apply.mjs';
import { RefusedError } from './args.mjs';
import { cssImports, designSystemImports, findCssEntry, insertCssImports } from './css.mjs';
import {
  collectSpecifiers,
  commitOf,
  detectFramework,
  detectInitCssMode,
  detectPackageManager,
  field,
  findRepoRoot,
  PACKAGES,
  safeVendorFile,
  vendorState
} from './detect.mjs';
import { CONFIG_FILE, readConfig } from './doctor.mjs';
import { checkLockfile } from './lockfile.mjs';
import { MANIFEST_FILE, planManifest } from './manifest.mjs';
import { formatAction, formatHeader, formatPlanJson } from './plan.mjs';
import { planWorkspace, WORKSPACE_FILE } from './pnpm-workspace.mjs';
import { isRecord, loadReleasePackage, readPackedManifest, sha256 } from './release.mjs';

/** @typedef {import('./args.mjs').Options} Options */
/** @typedef {import('./release.mjs').Release} Release */
/** @typedef {import('./manifest.mjs').Action} Action */
/** @typedef {import('./manifest.mjs').Conflict} Conflict */
/** @typedef {import('./manifest.mjs').SelectedPackage} SelectedPackage */
/** @typedef {import('./plan.mjs').PlanHeader} PlanHeader */
/** @typedef {import('./apply.mjs').FileWrite} FileWrite */
/** @typedef {import('./apply.mjs').FileCopy} FileCopy */
/**
 * The package manager spawn (spec §9.2): the only process the CLI ever starts.
 * @typedef {(command: string, args: string[], cwd: string) => {
 *   status: number | null,
 *   stdout?: string | null,
 *   stderr?: string | null,
 *   error?: Error
 * }} Runner
 */

export const DEFAULT_PACKAGES = ['tokens', 'ui', 'system', 'mcp'];
export const VENDOR_DIRECTORY = 'vendor/egdev';
export const MCP_FILE = '.mcp.json';
export const MCP_SERVER = 'egdev-design-system';
export const MCP_ENTRY = { command: 'node', args: ['node_modules/@egdev/mcp/dist/index.js'] };
const CONTRIBUTING_FILE = 'CONTRIBUTING.md';
const CONTRIBUTING_START = '<!-- egdev-ds:consumer-requests -->';
const CONTRIBUTING_END = '<!-- /egdev-ds:consumer-requests -->';
const CONTRIBUTING_BLOCK = [
  CONTRIBUTING_START,
  '## Design system changes',
  '',
  'Do not edit vendored tarballs, `egdev-ds.json` or `@egdev/*` lockfile entries.',
  'Request design system changes with a "Consumer request" issue in `egdev6/egdev-design-system`.',
  'Optional local mitigations use the guard allowlist tied to the DS issue; the maintainer upgrades the DS in a separate PR.',
  'See https://github.com/egdev6/egdev-design-system/blob/main/docs/distribution/consumer-requests.md.',
  CONTRIBUTING_END,
  ''
].join('\n');
const AGENTS_FILE = 'AGENTS.md';
const AGENTS_START = '<!-- egdev-ds:agents -->';
const AGENTS_END = '<!-- /egdev-ds:agents -->';
const AGENTS_BLOCK = [
  AGENTS_START,
  '## EGDEV design system',
  '',
  '- Before writing UI, use `@egdev/ui` and `@egdev/tokens` and query the `egdev-design-system` MCP server.',
  '- Stay within component APIs: no appearance or layout CSS on classes passed to DS components (DS046).',
  '- Do not select component internals (DS041, DS047) or look up `.eg-*` markup in code (DS048).',
  '- Do not hand-write colors, spacing or fonts.',
  '- If the DS lacks something, stop that part and open a Consumer request describing the need: https://github.com/egdev6/egdev-design-system/issues/new?template=consumer_request.yml',
  '- Mitigate only by composing DS parts with `// TODO(egdev-design-system#N)` and an issue-backed allowlist entry.',
  '- Never edit vendored tarballs, `egdev-ds.json` or `@egdev/*` lockfile entries.',
  '- Flow: https://github.com/egdev6/egdev-design-system/blob/main/docs/distribution/consumer-requests.md.',
  AGENTS_END,
  ''
].join('\n');
/** @typedef {{ file: string, start: string, end: string, block: string, detail: string, searchUnsafeAncestors?: boolean }} Guide */
/** @type {Guide[]} */
const GUIDES = [
  {
    file: CONTRIBUTING_FILE,
    start: CONTRIBUTING_START,
    end: CONTRIBUTING_END,
    block: CONTRIBUTING_BLOCK,
    detail: 'consumer requests summary'
  },
  {
    file: AGENTS_FILE,
    start: AGENTS_START,
    end: AGENTS_END,
    block: AGENTS_BLOCK,
    detail: 'design system agent rules',
    searchUnsafeAncestors: true
  }
];
export const ACCENT_FILE = 'src/theme/accent-host.ts';
export const ACCENT_HOST = `// Accent host scaffold from \`egdev-ds init --accent\` (docs/foundation/runtime-accent.md).
// Wire it in by hand: call applyAccent with an element your app owns, never a DS component.
import { createAccentTheme } from '@egdev/tokens/accent';

/** Applies the complete runtime accent map to a consumer-owned host element. */
export function applyAccent(host: HTMLElement, accent: string | null | undefined): void {
  const { variables } = createAccentTheme(accent);
  for (const [name, value] of Object.entries(variables)) {
    host.style.setProperty(name, value);
  }
}
`;

/** @type {Runner} */
export const spawnRunner = (command, args, cwd) => {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, error: result.error };
};

/**
 * @param {string} path
 * @returns {string | null}
 */
export function readText(path) {
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

/** @param {string} path */
const toPosix = (path) => path.split(sep).join('/');

/**
 * True when the ordered marker pair is present.
 * @param {string} text
 * @param {string} startMarker
 * @param {string} endMarker
 */
const hasGuideBlock = (text, startMarker, endMarker) => {
  const start = text.indexOf(startMarker);
  return start !== -1 && text.indexOf(endMarker, start + startMarker.length) !== -1;
};

/**
 * The unique vendored files the lockfile must hold: every one for pnpm, the `package.json`
 * dependency specifiers for npm (its `$` overrides are references, not files). Same set as doctor.
 * @param {Record<string, unknown>} manifest
 * @param {string | null} workspace
 * @param {'npm' | 'pnpm'} packageManager
 */
function expectedFiles(manifest, workspace, packageManager) {
  /** @type {Map<string, { name: string, file: string, spec: string }>} */
  const files = new Map();
  for (const { name, spec, source } of collectSpecifiers(manifest, workspace)) {
    const file = safeVendorFile(spec);
    if (file && !files.has(file) && (packageManager === 'pnpm' || source === MANIFEST_FILE)) {
      files.set(file, { name, file, spec });
    }
  }
  return [...files.values()];
}

/**
 * Verifies every vendored lockfile integrity against its tarball's sha512; returns the count.
 * `exclusive` also refuses lock entries for any other vendored file (upgrade, spec §7.8).
 * @param {string} project
 * @param {'npm' | 'pnpm'} packageManager
 * @param {boolean} [exclusive]
 */
export function verifyLock(project, packageManager, exclusive = false) {
  const manifest = JSON.parse(readFileSync(join(project, MANIFEST_FILE), 'utf8'));
  const expected = expectedFiles(manifest, readText(join(project, WORKSPACE_FILE)), packageManager);
  const problems = checkLockfile({ project, packageManager, expected, exclusive });
  if (problems.length > 0) {
    throw new Error(`Integrity check failed: ${problems.map(({ message }) => message).join(' ')}`);
  }
  return expected.length;
}

/**
 * @param {string} message
 * @param {string} suffix
 */
const withSuffix = (message, suffix) => `${message.endsWith('.') ? message.slice(0, -1) : message}${suffix}`;

/**
 * Reads `<project>/package.json` as an object; any failure is a refused precondition (exit 2).
 * @param {string} project
 * @param {string} argument the project as the user passed it
 * @returns {{ manifest: Record<string, unknown>, text: string }}
 */
export function readManifest(project, argument) {
  const manifestPath = toPosix(join(argument, MANIFEST_FILE));
  const text = readText(join(project, MANIFEST_FILE));
  if (text === null) {
    throw new RefusedError(`Cannot read ${manifestPath}: not found.`);
  }
  /** @type {unknown} */
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new RefusedError(`Cannot read ${manifestPath}: invalid JSON.`);
  }
  if (!isRecord(parsed)) {
    throw new RefusedError(`Cannot read ${manifestPath}: expected a JSON object.`);
  }
  return { manifest: parsed, text };
}

/**
 * The install command init and upgrade run. pnpm freezes the lockfile under `CI=true`, but egdev-ds edits
 * the manifests on purpose and verifies the lockfile afterwards, so pnpm must be allowed to update it.
 * @param {'npm' | 'pnpm'} packageManager
 * @param {boolean | undefined} offline
 * @returns {string[]}
 */
export const installCommand = (packageManager, offline) => [
  packageManager,
  'install',
  ...(packageManager === 'pnpm' ? ['--no-frozen-lockfile'] : []),
  ...(offline ? ['--offline'] : [])
];

/**
 * A fresh install of the vendored set, as ds-vendor.mjs does (spec §6.7, §7.8): removes
 * `node_modules/@egdev`, runs the package manager, passes its output to stderr, and throws when it
 * cannot start or exits non-zero.
 * @param {{ project: string, install: readonly string[], runner: Runner, stderr: (text: string) => void }} input
 */
export function runInstall({ project, install, runner, stderr }) {
  const [command = 'npm', ...args] = install;
  rmSync(join(project, 'node_modules/@egdev'), { recursive: true, force: true });
  const result = runner(command, args, project);
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`;
  if (output) {
    stderr(output);
  }
  if (result.error) {
    const code = 'code' in result.error ? String(result.error.code) : result.error.message;
    throw new Error(`Cannot run ${command} (${code})`);
  }
  if (result.status !== 0) {
    throw new Error(`${install.join(' ')} failed (exit ${result.status ?? 'signal'})`);
  }
}

/**
 * The "Next steps" lines after a real run (spec §6.7), ending with the review reminder (Q14).
 * @param {{ packageManager: 'npm' | 'pnpm', install: readonly string[], noInstall: boolean, extra?: string[] }} input
 */
export function nextSteps({ packageManager, install, noInstall, extra = [] }) {
  const doctorScript = packageManager === 'npm' ? 'npm run ds:doctor' : 'pnpm ds:doctor';
  return [
    'Next steps:',
    ...(noInstall ? [`  Run ${install.join(' ')}.`] : []),
    '  Restart the dev server with --force.',
    '  Regenerate design/system.md with egdev-system-md --write.',
    `  Add ${doctorScript} to CI.`,
    ...extra,
    'Review the diff before committing.'
  ];
}

/**
 * `egdev-ds.json` (spec §6.7): kept when it exists, otherwise created with the doctor defaults.
 * `localRepo` is `--local-repo` or the repository folder default (#485); the plan line shows it.
 * @param {string} project
 * @param {Record<string, unknown>} manifest
 * @param {string} [localRepo] the `--local-repo` value
 * @returns {{ action: Action, write: FileWrite | null }}
 */
export function planConfig(project, manifest, localRepo) {
  if (existsSync(join(project, CONFIG_FILE))) {
    return { action: { verb: 'keep', path: CONFIG_FILE, detail: '' }, write: null };
  }
  const { config } = readConfig(project, manifest);
  const created = { ...config, localRepo: localRepo ?? config.localRepo };
  return {
    action: { verb: 'create', path: CONFIG_FILE, detail: `localRepo=${created.localRepo}` },
    write: { path: CONFIG_FILE, content: `${JSON.stringify({ schemaVersion: 1, ...created }, null, 2)}\n` }
  };
}

/**
 * Plan a marked guide up to the nearest repository root. Only the project guide is written;
 * ancestor guides are read-only. Preserve original bytes, extra blank lines and newline style.
 * @param {string} project
 * @param {Guide} guide
 * @returns {{ action: Action, write: FileWrite } | { nextStep: string } | null}
 */
function planGuide(project, { file, start, end, block, detail, searchUnsafeAncestors = false }) {
  const path = join(project, file);
  const manual = { nextStep: `  Add the ${detail} to ${file} by hand; it is a link or not a regular file.` };
  let unsafe = false;
  try {
    assertSafeTarget(project, file);
  } catch (error) {
    if (!(error instanceof RefusedError)) {
      throw error;
    }
    // A linked or irregular project guide is never written. Reading only checks for the markers.
    const linked = isFile(path) ? readText(path) : null;
    if (linked !== null && hasGuideBlock(linked, start, end)) {
      return null;
    }
    // Preserve CONTRIBUTING's existing linked-file precedence; S8 also checks ancestors for AGENTS.
    if (!searchUnsafeAncestors) {
      return manual;
    }
    unsafe = true;
  }
  const original = !unsafe && existsSync(path) ? readFileSync(path) : null;
  const text = original?.toString('utf8') ?? '';
  const root = findRepoRoot(project) ?? project;
  let nearest = unsafe || original !== null ? path : null;
  for (let directory = project; ; directory = dirname(directory)) {
    const candidate = join(directory, file);
    let candidateText = directory === project && original !== null ? text : null;
    if (directory !== project && isFile(candidate)) {
      nearest ??= candidate;
      candidateText = readText(candidate);
    }
    if (candidateText !== null && hasGuideBlock(candidateText, start, end)) {
      return null;
    }
    if (directory === root || dirname(directory) === directory) {
      break;
    }
  }
  if (unsafe) {
    return manual;
  }
  if (nearest !== null && nearest !== path) {
    return { nextStep: `  Add the ${detail} to ${toPosix(relative(project, nearest))}.` };
  }
  const newline = text.includes('\r\n') ? '\r\n' : '\n';
  let separator = '';
  if (original && original.length > 0) {
    if (!text.endsWith('\n')) {
      separator = newline;
    }
    const completed = text + separator;
    const previousNewline = completed.lastIndexOf('\n', completed.length - 2);
    if (completed.slice(previousNewline + 1, -1).trim() !== '') {
      separator += newline;
    }
  }
  return {
    action: { verb: original === null ? 'create' : 'edit', path: file, detail },
    write: {
      path: file,
      content: Buffer.concat([original ?? Buffer.alloc(0), Buffer.from(separator + block.replaceAll('\n', newline))])
    }
  };
}

/** @param {string} project */
function planGuides(project) {
  /** @type {Action[]} */
  const actions = [];
  /** @type {FileWrite[]} */
  const writes = [];
  /** @type {string[]} */
  const steps = [];
  for (const guide of GUIDES) {
    const planned = planGuide(project, guide);
    if (planned && 'write' in planned) {
      actions.push(planned.action);
      writes.push(planned.write);
    } else if (planned) {
      steps.push(planned.nextStep);
    }
  }
  return { actions, writes, steps };
}

/**
 * The stderr note when `--local-repo` differs from the `localRepo` of an existing egdev-ds.json,
 * which is kept (#485): not an error. Null when there is nothing to note.
 * @param {string} project
 * @param {string | undefined} localRepo the `--local-repo` value
 * @returns {string | null}
 */
export function localRepoNote(project, localRepo) {
  const text = localRepo === undefined ? null : readText(join(project, CONFIG_FILE));
  if (text === null) {
    return null;
  }
  /** @type {unknown} */
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }
  const current = isRecord(data) ? data.localRepo : undefined;
  if (current === localRepo) {
    return null;
  }
  const shown = typeof current === 'string' ? `"${current}"` : 'its value';
  return `Note: ${CONFIG_FILE} keeps localRepo ${shown}; --local-repo ${localRepo} applies only when ${CONFIG_FILE} is created.\n`;
}

/**
 * The `egdev-design-system` server in `<project>/.mcp.json` (spec §6.7): created, added next to
 * other servers, kept when equal, or a conflict that `force` resolves by replacing only that entry.
 * @param {string} project
 * @param {boolean} force
 * @returns {{ actions: Action[], conflicts: Conflict[], write: FileWrite | null }}
 */
export function planMcp(project, force) {
  const detail = `mcpServers.${MCP_SERVER}`;
  const mcpText = readText(join(project, MCP_FILE));
  if (mcpText === null) {
    return {
      actions: [{ verb: 'create', path: MCP_FILE, detail }],
      conflicts: [],
      write: { path: MCP_FILE, content: `${JSON.stringify({ mcpServers: { [MCP_SERVER]: MCP_ENTRY } }, null, 2)}\n` }
    };
  }
  /** @type {Action[]} */
  const actions = [];
  /** @type {Conflict[]} */
  const conflicts = [];
  /** @type {unknown} */
  let data = null;
  try {
    data = JSON.parse(mcpText);
  } catch {
    data = null;
  }
  if (isRecord(data) && data.mcpServers === undefined) {
    data.mcpServers = {};
  }
  const servers = isRecord(data) ? data.mcpServers : null;
  if (!isRecord(data) || !isRecord(servers)) {
    throw new RefusedError(`Cannot edit ${MCP_FILE}: expected a JSON object with an mcpServers object.`);
  }
  let changed = true;
  const server = servers[MCP_SERVER];
  const current = isRecord(server) ? { command: server.command, args: server.args } : server;
  if (server === undefined) {
    servers[MCP_SERVER] = MCP_ENTRY;
    actions.push({ verb: 'edit', path: MCP_FILE, detail });
  } else if (JSON.stringify(current) === JSON.stringify(MCP_ENTRY)) {
    changed = false;
    actions.push({ verb: 'keep', path: MCP_FILE, detail });
  } else {
    changed = force;
    const shown = JSON.stringify(current) ?? String(current);
    conflicts.push({ file: MCP_FILE, key: detail, current: shown, wanted: JSON.stringify(MCP_ENTRY) });
    if (force) {
      servers[MCP_SERVER] = isRecord(server) ? { ...server, ...MCP_ENTRY } : MCP_ENTRY;
      actions.push({ verb: 'edit', path: MCP_FILE, detail: `${detail} (replaces ${shown})` });
    }
  }
  const nextMcp = `${JSON.stringify(data, null, 2)}\n`;
  return { actions, conflicts, write: changed && nextMcp !== mcpText ? { path: MCP_FILE, content: nextMcp } : null };
}

/**
 * Lists conflicts on stderr, one per line, then the count and how to resolve them (spec §9.7).
 * @param {readonly Conflict[]} conflicts
 * @param {string} resolution
 * @param {(text: string) => void} stderr
 */
export function reportConflicts(conflicts, resolution, stderr) {
  const lines = conflicts.map(
    ({ file, key, current, wanted }) => `Conflict: ${file} ${key} is ${current}; egdev-ds sets ${wanted}.`
  );
  const count = `${conflicts.length} conflict${conflicts.length === 1 ? '' : 's'}`;
  stderr(`${lines.join('\n')}\n${count}: nothing written; ${resolution}\n`);
}

/**
 * Runs `egdev-ds init`. Refusals throw RefusedError (exit 2); release and apply failures throw
 * errors with status 1. Conflicts are listed on stderr, one per line, and return 2.
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
export async function runInit({ argument, project, from, releaseDir, release, options, runner, stdout, stderr }) {
  // Detection (spec §5): reads only, stops at the first ambiguity.
  const { manifest, text: manifestText } = readManifest(project, argument);
  const { packageManager, error: packageManagerError } = detectPackageManager(project, manifest);
  if (!packageManager) {
    throw new RefusedError(packageManagerError ?? 'Cannot detect the package manager.');
  }
  const { framework, error: frameworkError } = detectFramework(manifest);
  if (!framework) {
    throw new RefusedError(frameworkError ?? 'Cannot detect the framework.');
  }

  /** @type {string | null} */
  let cssFile = null;
  /** @type {string | null} */
  let wiredModule = null;
  if (options.cssEntry !== undefined) {
    const target = toPosix(relative(project, resolve(project, options.cssEntry)));
    if (target.startsWith('..') || isAbsolute(target) || !isFile(join(project, target))) {
      throw new RefusedError(`Invalid --css-entry: ${options.cssEntry} is not a file inside ${argument}.`);
    }
    cssFile = target;
  } else {
    const found = findCssEntry(project, framework);
    if (found.error) {
      throw new RefusedError(withSuffix(found.error, '; pass --css-entry <path>.'));
    }
    if (found.moduleImports.some((specifier) => specifier.startsWith('@egdev/') && specifier.endsWith('.css'))) {
      wiredModule = found.module;
    } else if (found.file) {
      cssFile = found.file;
    } else {
      throw new RefusedError(`No CSS entry: ${found.module} imports no local .css file; pass --css-entry <path>.`);
    }
  }
  const cssText = cssFile ? (readText(join(project, cssFile)) ?? '') : null;
  const detected =
    options.css === undefined
      ? detectInitCssMode(manifest, framework, cssFile ? { file: cssFile, imports: cssImports(cssText ?? '') } : null)
      : { cssMode: options.css };
  if (!detected.cssMode) {
    throw new RefusedError(detected.error ?? 'Cannot detect the CSS mode.');
  }
  const cssMode = detected.cssMode;

  const workspaceText = readText(join(project, WORKSPACE_FILE));
  const state = vendorState(collectSpecifiers(manifest, workspaceText));
  const short = release.commit.slice(0, 7);
  if (state.unsafe) {
    throw new RefusedError(`Unsafe vendored path: ${state.unsafe.name} (${state.unsafe.spec}).`);
  }
  const [vendoredAt] = state.commits;
  if (state.commits.length > 1 || vendoredAt === 'none') {
    throw new RefusedError(`${argument} has a mixed vendored set (${state.commits.join(', ')}); run egdev-ds upgrade.`);
  }
  if (vendoredAt && !release.commit.startsWith(vendoredAt)) {
    throw new RefusedError(`${argument} is vendored at ${vendoredAt.slice(0, 7)}; run egdev-ds upgrade.`);
  }
  if (release.dirty && !options.allowDirty) {
    throw new RefusedError(`Release ${from} was packed from a dirty tree (${short}); pass --allow-dirty to use it.`);
  }

  /** @type {PlanHeader} */
  const header = {
    command: 'init',
    project: argument,
    packageManager,
    framework,
    cssMode,
    release: { dir: from, commit: release.commit }
  };
  const install = installCommand(packageManager, options.offline);

  // Already vendored at the release commit: verify first, then backfill missing guides without reinstalling.
  if (vendoredAt && !state.foreign) {
    for (const item of expectedFiles(manifest, workspaceText, 'pnpm')) {
      let packed;
      try {
        packed = readPackedManifest(join(project, item.file));
      } catch {
        throw new Error(`Unreadable vendored tarball: ${item.file}.`);
      }
      const entry = release.packages.find(({ name, version }) => name === packed.name && version === packed.version);
      if (!entry || sha256(readFileSync(join(project, item.file))) !== entry.sha256) {
        throw new Error(`Vendored tarball differs from the release: ${item.file}.`);
      }
    }
    const count = options.noInstall ? null : verifyLock(project, packageManager);
    const guides = planGuides(project);
    if (guides.writes.length > 0) {
      const actions = guides.actions;
      if (!options.json) {
        stdout(`${[formatHeader(header), ...actions.map(formatAction)].join('\n')}\n`);
      }
      if (options.dryRun) {
        stdout(options.json ? formatPlanJson({ header, actions, result: 'planned' }) : 'Dry run: nothing written.\n');
        return 0;
      }
      try {
        await transact({ project, copies: [], writes: guides.writes, watch: [], finish: () => count });
      } catch (error) {
        if (options.json) {
          stdout(formatPlanJson({ header, actions, result: 'failed' }));
        }
        throw error;
      }
      if (options.json) {
        stdout(formatPlanJson({ header, actions, result: 'applied' }));
      } else {
        const verified =
          count === null ? 'integrities unverified (--no-install)' : `${count} vendored integrities verified`;
        stdout(
          [
            `Initialized at ${short}; ${verified}.`,
            ...nextSteps({ packageManager, install, noInstall: options.noInstall, extra: guides.steps }),
            ''
          ].join('\n')
        );
      }
      return 0;
    }
    if (options.json) {
      stdout(formatPlanJson({ header, actions: [], result: 'current' }));
    } else {
      const verified =
        count === null ? 'integrities unverified (--no-install)' : `${count} vendored integrities verified`;
      const next = guides.steps.length > 0 ? `Next steps:\n${guides.steps.join('\n')}\n` : '';
      stdout(`${formatHeader(header)}\nAlready at ${short}; ${verified}; no changes.\n${next}`);
    }
    return 0;
  }

  // Selection (spec §4 `--packages`, Q7, Q13): the default set or the list, plus the CLI.
  const names = options.packages ?? DEFAULT_PACKAGES;
  /** @type {(SelectedPackage & { file: string, source: string, sha256: string })[]} */
  const selected = [];
  for (const pkg of PACKAGES.filter((item) => item === 'cli' || names.some((name) => name === item))) {
    const name = `@egdev/${pkg}`;
    const { entry, source, packed } = loadReleasePackage({ release, releaseDir, from, name });
    const file = `${VENDOR_DIRECTORY}/egdev-${pkg}-${entry.version}-${short}.tgz`;
    selected.push({ pkg, name, spec: `file:./${file}`, packed, file, source, sha256: entry.sha256 });
  }
  const chosen = new Set(selected.map(({ name }) => name));
  for (const { name, packed } of selected) {
    for (const key of ['dependencies', 'peerDependencies']) {
      const missing = Object.keys(field(packed, key)).find(
        (dependency) => dependency.startsWith('@egdev/') && !chosen.has(dependency)
      );
      if (missing) {
        throw new RefusedError(`${name} needs ${missing}; add ${missing.slice('@egdev/'.length)} to --packages.`);
      }
    }
  }
  const packages = selected.map(({ pkg }) => pkg);
  if (options.accent && !packages.includes('tokens')) {
    throw new RefusedError('--accent needs the tokens package; add tokens to --packages.');
  }

  // Plan (spec §6, S12, S8): copies, package.json, workspace, CSS, config, MCP, guides, accent, install.
  /** @type {Action[]} */
  const actions = [];
  /** @type {Conflict[]} */
  const conflicts = [];
  /** @type {FileCopy[]} */
  const copies = [];
  /** @type {FileWrite[]} */
  const writes = [];
  for (const item of selected) {
    const detail = `sha256 ${item.sha256}`;
    const existing = existsSync(join(project, item.file)) ? readFileSync(join(project, item.file)) : null;
    if (existing && sha256(existing) !== item.sha256) {
      throw new RefusedError(`Refusing to overwrite a different tarball: ${item.file}.`);
    }
    actions.push({ verb: existing ? 'keep' : 'copy', path: item.file, detail });
    if (!existing) {
      copies.push({ path: item.file, source: item.source, sha256: item.sha256 });
    }
  }

  const manifestPlan = planManifest({ manifest, packageManager, selected, force: options.force });
  actions.push(...manifestPlan.ledger.actions);
  conflicts.push(...manifestPlan.ledger.conflicts);
  const nextManifestText = `${JSON.stringify(manifestPlan.manifest, null, 2)}\n`;
  if (nextManifestText !== manifestText) {
    writes.push({ path: MANIFEST_FILE, content: nextManifestText });
  }

  let nextWorkspace = workspaceText;
  if (packageManager === 'pnpm' && !manifestPlan.manifestOverrides) {
    const workspacePlan = planWorkspace(workspaceText, selected, options.force);
    if (workspacePlan.error !== undefined) {
      throw new RefusedError(workspacePlan.error);
    }
    actions.push(...workspacePlan.actions);
    conflicts.push(...workspacePlan.conflicts);
    nextWorkspace = workspacePlan.text;
    if (nextWorkspace !== workspaceText) {
      writes.push({ path: WORKSPACE_FILE, content: nextWorkspace });
    }
  }

  if (cssFile !== null && cssText !== null) {
    const wanted = designSystemImports(cssMode, packages);
    const inserted = insertCssImports(cssText, cssFile, cssMode, wanted);
    if (inserted.error !== undefined) {
      throw new RefusedError(inserted.error);
    }
    for (const target of wanted) {
      const verb = inserted.added.includes(target) ? 'edit' : 'keep';
      actions.push({ verb, path: cssFile, detail: `${verb === 'edit' ? '+' : ''}@import "${target}"` });
    }
    if (inserted.text !== cssText) {
      writes.push({ path: cssFile, content: inserted.text });
    }
  } else if (wiredModule) {
    actions.push({ verb: 'keep', path: wiredModule, detail: 'design system CSS imported by the entry module' });
  }

  const configPlan = planConfig(project, manifest, options.localRepo);
  actions.push(configPlan.action);
  const note = localRepoNote(project, options.localRepo);
  if (note) {
    stderr(note);
  }
  if (configPlan.write) {
    writes.push(configPlan.write);
  }

  if (packages.includes('mcp')) {
    const mcpPlan = planMcp(project, options.force);
    actions.push(...mcpPlan.actions);
    conflicts.push(...mcpPlan.conflicts);
    if (mcpPlan.write) {
      writes.push(mcpPlan.write);
    }
  }

  const guides = planGuides(project);
  actions.push(...guides.actions);
  writes.push(...guides.writes);

  let accentCreated = false;
  if (options.accent) {
    accentCreated = !existsSync(join(project, ACCENT_FILE));
    actions.push({ verb: accentCreated ? 'create' : 'keep', path: ACCENT_FILE, detail: 'applyAccent(host, accent)' });
    if (accentCreated) {
      writes.push({ path: ACCENT_FILE, content: ACCENT_HOST });
    }
  }

  if (!options.noInstall) {
    if (existsSync(join(project, 'node_modules/@egdev'))) {
      actions.push({ verb: 'remove', path: 'node_modules/@egdev', detail: '' });
    }
    actions.push({ verb: 'run', path: install.join(' '), detail: '' });
  }

  // Conflicts (spec §9.7, Q8): listed, nothing written, unless --force replaced exactly those values.
  if (conflicts.length > 0 && !options.force) {
    reportConflicts(conflicts, 'pass --force to replace only these values.', stderr);
    return 2;
  }
  // Specifiers outside the owned keys (a nested npm override, for example) are never rewritten.
  for (const { name, spec, field: key, source } of collectSpecifiers(manifestPlan.manifest, nextWorkspace)) {
    const file = safeVendorFile(spec);
    if (!file || commitOf(file) !== short) {
      throw new RefusedError(
        `${name} in ${source} ${key} still uses ${spec}; init cannot replace it: edit it by hand.`
      );
    }
  }
  for (const path of [...copies.map((copy) => copy.path), ...writes.map((write) => write.path)]) {
    assertSafeTarget(project, path);
  }

  if (!options.json) {
    stdout(`${[formatHeader(header), ...actions.map(formatAction)].join('\n')}\n`);
  }
  if (options.dryRun) {
    stdout(options.json ? formatPlanJson({ header, actions, result: 'planned' }) : 'Dry run: nothing written.\n');
    return 0;
  }

  const lockfile = packageManager === 'npm' ? 'package-lock.json' : 'pnpm-lock.yaml';
  /** @type {number | null} */
  let count;
  try {
    count = await transact({
      project,
      copies,
      writes,
      watch: [lockfile],
      finish: () => {
        if (options.noInstall) {
          return null;
        }
        runInstall({ project, install, runner, stderr });
        return verifyLock(project, packageManager);
      }
    });
  } catch (error) {
    if (options.json) {
      stdout(formatPlanJson({ header, actions, result: 'failed' }));
    }
    throw error;
  }

  if (options.json) {
    stdout(formatPlanJson({ header, actions, result: 'applied' }));
    return 0;
  }
  stdout(
    [
      `Initialized at ${short}; ${count === null ? 'integrities unverified (--no-install)' : `${count} vendored integrities verified`}.`,
      ...nextSteps({
        packageManager,
        install,
        noInstall: options.noInstall,
        extra: [
          ...guides.steps,
          ...(accentCreated ? [`  Call applyAccent from ${ACCENT_FILE} on a host element your app owns.`] : [])
        ]
      }),
      ''
    ].join('\n')
  );
  return 0;
}
