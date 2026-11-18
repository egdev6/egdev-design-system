// Read-only detection (spec §5): package manager, framework, CSS mode and the vendored state.
import { existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import { isRecord } from './release.mjs';

/** @typedef {'npm' | 'pnpm'} PackageManager */
/** @typedef {'next' | 'vite'} Framework */
/**
 * @typedef {{
 *   name: string,
 *   spec: string,
 *   source: 'package.json' | 'pnpm-workspace.yaml',
 *   field: string
 * }} Specifier
 */

/** Every package of the release set, including the CLI itself (Q7). */
export const PACKAGES = ['tokens', 'ui', 'effects', 'system', 'mcp', 'cli'];
export const DEPENDENCY_FIELDS = ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies'];
const NAMES = new Set(PACKAGES.map((pkg) => `@egdev/${pkg}`));

/**
 * @param {Record<string, unknown>} manifest
 * @param {string} field
 * @returns {Record<string, unknown>}
 */
export function field(manifest, field) {
  const value = manifest[field];
  return isRecord(value) ? value : {};
}

/**
 * @param {Record<string, unknown>} manifest
 * @param {string} name
 */
export const declares = (manifest, name) => DEPENDENCY_FIELDS.some((key) => Object.hasOwn(field(manifest, key), name));

/**
 * Package manager (spec §5.1).
 * @param {string} project
 * @param {Record<string, unknown>} manifest
 * @returns {{ packageManager: PackageManager | null, error?: string }}
 */
export function detectPackageManager(project, manifest) {
  const npm = existsSync(join(project, 'package-lock.json'));
  const pnpm = existsSync(join(project, 'pnpm-lock.yaml'));
  if (npm && pnpm) {
    return { packageManager: null, error: 'Both package-lock.json and pnpm-lock.yaml exist; remove one.' };
  }
  if (npm) {
    return { packageManager: 'npm' };
  }
  if (pnpm) {
    return { packageManager: 'pnpm' };
  }
  /** @param {string} name */
  const unsupported = (name) => ({
    packageManager: null,
    error: `Unsupported package manager: ${name}; use pnpm or npm.`
  });
  if (existsSync(join(project, 'yarn.lock'))) {
    return unsupported('yarn');
  }
  if (existsSync(join(project, 'bun.lock')) || existsSync(join(project, 'bun.lockb'))) {
    return unsupported('bun');
  }
  const pinned = typeof manifest.packageManager === 'string' ? manifest.packageManager.split('@')[0] : undefined;
  if (pinned === 'npm' || pinned === 'pnpm') {
    return { packageManager: pinned };
  }
  if (pinned) {
    return unsupported(pinned);
  }
  return { packageManager: null, error: 'Cannot detect the package manager: add a lockfile or packageManager.' };
}

/**
 * Framework (spec §5.2).
 * @param {Record<string, unknown>} manifest
 * @returns {{ framework: Framework | null, error?: string }}
 */
export function detectFramework(manifest) {
  const next = declares(manifest, 'next');
  const vite = declares(manifest, 'vite');
  if (next && vite) {
    return { framework: null, error: 'Cannot find the CSS entry: both next and vite are declared.' };
  }
  if (next) {
    return { framework: 'next' };
  }
  if (vite) {
    return { framework: 'vite' };
  }
  return { framework: null, error: 'Cannot find the CSS entry: declare next or vite.' };
}

/**
 * CSS mode for doctor: Tailwind when the app declares `tailwindcss` (spec §5.3).
 * @param {Record<string, unknown>} manifest
 * @returns {'tailwind' | 'native'}
 */
export const detectCssMode = (manifest) => (declares(manifest, 'tailwindcss') ? 'tailwind' : 'native');

/**
 * App-relative tarball path for `file:vendor/<name>` or `file:./vendor/<dir>/<name>`, else null.
 * @param {unknown} spec
 * @returns {string | null}
 */
export function safeVendorFile(spec) {
  const match =
    typeof spec === 'string' &&
    spec.match(/^file:(?:\.\/)?(vendor\/(?:[a-z0-9][a-z0-9-]*\/)?egdev-[a-z0-9][a-z0-9.+-]*\.tgz)$/);
  return match ? (match[1] ?? null) : null;
}

/** @param {string} spec */
export const isVendorPath = (spec) => /^file:(?:\.\/)?vendor\//.test(spec);

/**
 * The 7-40 hex DS commit in `egdev-<pkg>-<version>-<commit>.tgz`, or null for legacy names.
 * @param {string} file
 */
export function commitOf(file) {
  return (
    basename(file)
      .match(/^egdev-[a-z]+-\d+\.\d+\.\d+[^-]*-([a-f\d]{7,40})\.tgz$/i)?.[1]
      ?.toLowerCase() ?? null
  );
}

/**
 * Override values, not parent selectors such as `{ "other": { ... } }` (npm and `pnpm.overrides`).
 * @param {unknown} value
 * @returns {{ name: string, spec: string }[]}
 */
export function overrideEntries(value) {
  /** @type {{ name: string, spec: string }[]} */
  const entries = [];
  /** @param {unknown} object */
  const visit = (object) => {
    if (!isRecord(object)) {
      return;
    }
    for (const [key, current] of Object.entries(object)) {
      const name = [...NAMES].find((item) => key === item || key.startsWith(`${item}@`));
      if (name && typeof current === 'string') {
        entries.push({ name, spec: current });
      }
      if (name && isRecord(current) && typeof current['.'] === 'string') {
        entries.push({ name, spec: current['.'] });
      }
      visit(current);
    }
  };
  visit(value);
  return entries;
}

/**
 * `@egdev/*` entries of the top-level `overrides:` block of `pnpm-workspace.yaml`, read as text.
 * @param {string | null} text
 * @returns {{ name: string, spec: string }[]}
 */
export function workspaceOverrides(text) {
  if (!text) {
    return [];
  }
  /** @type {{ name: string, spec: string }[]} */
  const entries = [];
  let inside = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^overrides:\s*(?:#.*)?$/.test(line)) {
      inside = true;
      continue;
    }
    if (!inside || /^\s*(?:#.*)?$/.test(line)) {
      continue;
    }
    if (!/^\s/.test(line)) {
      inside = false;
      continue;
    }
    const match = line.match(/^\s+(['"]?)(@egdev\/[a-z]+)\1\s*:\s*(['"]?)([^'"#]*?)\3\s*(?:#.*)?$/);
    if (match?.[2] && NAMES.has(match[2])) {
      entries.push({ name: match[2], spec: (match[4] ?? '').trim() });
    }
  }
  return entries;
}

/**
 * Every `@egdev/*` specifier: dependency fields, npm `overrides`, `pnpm.overrides` and the
 * `pnpm-workspace.yaml` `overrides:` block (spec §5.5). npm `$` references are not specifiers.
 * @param {Record<string, unknown>} manifest
 * @param {string | null} workspace
 * @returns {Specifier[]}
 */
export function collectSpecifiers(manifest, workspace) {
  /** @type {Specifier[]} */
  const specs = [];
  for (const key of DEPENDENCY_FIELDS) {
    for (const [name, spec] of Object.entries(field(manifest, key))) {
      if (NAMES.has(name) && typeof spec === 'string') {
        specs.push({ name, spec, source: 'package.json', field: key });
      }
    }
  }
  for (const { name, spec } of overrideEntries(manifest.overrides)) {
    specs.push({ name, spec, source: 'package.json', field: 'overrides' });
  }
  for (const { name, spec } of overrideEntries(field(manifest, 'pnpm').overrides)) {
    specs.push({ name, spec, source: 'package.json', field: 'pnpm.overrides' });
  }
  for (const { name, spec } of workspaceOverrides(workspace)) {
    specs.push({ name, spec, source: 'pnpm-workspace.yaml', field: 'overrides' });
  }
  return specs.filter(({ spec }) => !spec.startsWith('$'));
}

/**
 * CSS mode for init (spec §5.3): every signal must agree, otherwise the caller asks for `--css`.
 * `entry` is the detected CSS entry and its `@import` targets, or null when the CSS is imported
 * from the Vite entry module.
 * @param {Record<string, unknown>} manifest
 * @param {Framework} framework
 * @param {{ file: string, imports: readonly string[] } | null} entry
 * @returns {{ cssMode: 'tailwind' | 'native', error?: undefined } | { cssMode: null, error: string }}
 */
export function detectInitCssMode(manifest, framework, entry) {
  const plugin = framework === 'vite' ? '@tailwindcss/vite' : '@tailwindcss/postcss';
  const dependency = declares(manifest, 'tailwindcss');
  const hasPlugin = declares(manifest, plugin);
  const imported = entry ? entry.imports.includes('tailwindcss') : null;
  /** @param {string} reason */
  const ask = (reason) => ({
    cssMode: /** @type {null} */ (null),
    error: `Contradictory CSS signals: ${reason}; pass --css tailwind|native.`
  });
  if (dependency && !hasPlugin) {
    return ask(`tailwindcss without ${plugin}`);
  }
  if (!dependency && hasPlugin) {
    return ask(`${plugin} without tailwindcss`);
  }
  if (entry && !dependency && imported) {
    return ask(`${entry.file} imports tailwindcss, which is not a dependency`);
  }
  if (entry && dependency && !imported) {
    return ask(`${entry.file} has no @import "tailwindcss"`);
  }
  return { cssMode: dependency ? 'tailwind' : 'native' };
}

/**
 * The vendored state (spec §5.5) from every `@egdev/*` specifier: `unsafe` names the first unsafe
 * `file:vendor/` path, `commits` the sorted commits of the vendored files (`none` for legacy names),
 * and `foreign` whether any specifier is a registry range or a `workspace:`/`link:` path.
 * @param {readonly Specifier[]} specs
 * @returns {{ unsafe: Specifier | null, commits: string[], foreign: boolean }}
 */
export function vendorState(specs) {
  const unsafe = specs.find(({ spec }) => isVendorPath(spec) && !safeVendorFile(spec)) ?? null;
  const files = specs.map(({ spec }) => safeVendorFile(spec)).filter((file) => file !== null);
  return {
    unsafe,
    commits: [...new Set(files.map((file) => commitOf(file) ?? 'none'))].sort(),
    foreign: specs.some(({ spec }) => !isVendorPath(spec))
  };
}
