// Lockfile integrity checks (spec §8 DS010, DS012): every vendored lock entry must carry the
// tarball's sha512, and every vendored specifier must already be in the lockfile.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { isVendorPath, safeVendorFile } from './detect.mjs';
import { isRecord, sri } from './release.mjs';

/** @typedef {{ code: 'DS010' | 'DS012', message: string, file: string }} LockProblem */

/**
 * @param {string} project
 * @param {string} file
 * @returns {string | null}
 */
function digest(project, file) {
  try {
    return sri(readFileSync(join(project, file)));
  } catch {
    return null;
  }
}

/**
 * Integrity of each vendored lock entry and presence of each expected vendored file. With
 * `exclusive`, a vendored lock entry for a file outside `expected` is stale (upgrade, spec §7.8).
 * @param {{
 *   project: string,
 *   packageManager: 'npm' | 'pnpm',
 *   expected: { name: string, file: string, spec: string }[],
 *   exclusive?: boolean
 * }} input
 * @returns {LockProblem[]}
 */
export function checkLockfile({ project, packageManager, expected, exclusive = false }) {
  const lockName = packageManager === 'npm' ? 'package-lock.json' : 'pnpm-lock.yaml';
  const install = `${packageManager} install`;
  /** @type {string} */
  let text;
  try {
    text = readFileSync(join(project, lockName), 'utf8');
  } catch {
    return [{ code: 'DS012', message: `Missing lockfile: run ${install}.`, file: lockName }];
  }
  /** @type {{ name: string, resolved: string, integrity: unknown }[]} */
  const entries = [];
  if (packageManager === 'npm') {
    /** @type {unknown} */
    let lock;
    try {
      lock = JSON.parse(text);
    } catch {
      return [{ code: 'DS012', message: `Cannot read ${lockName}: invalid JSON.`, file: lockName }];
    }
    const packages = isRecord(lock) && isRecord(lock.packages) ? lock.packages : {};
    for (const [key, entry] of Object.entries(packages)) {
      if (isRecord(entry) && typeof entry.resolved === 'string' && isVendorPath(entry.resolved)) {
        entries.push({
          name: key.replace(/^.*node_modules\//, ''),
          resolved: entry.resolved,
          integrity: entry.integrity
        });
      }
    }
  } else {
    for (const match of text.matchAll(/resolution: \{integrity: ([^,}\s]+), tarball: (file:[^}\s]+)\}/g)) {
      const resolved = match[2] ?? '';
      if (isVendorPath(resolved)) {
        const pkg = resolved.match(/egdev-([a-z]+)-[^/]*\.tgz$/)?.[1] ?? '?';
        entries.push({ name: `@egdev/${pkg}`, resolved, integrity: match[1] });
      }
    }
  }
  /** @type {LockProblem[]} */
  const problems = [];
  const locked = new Set();
  for (const { name, resolved, integrity } of entries) {
    const file = safeVendorFile(resolved);
    if (!file) {
      problems.push({ code: 'DS010', message: `Unsafe vendored path: ${name} (${resolved}).`, file: lockName });
      continue;
    }
    locked.add(file);
    const actual = digest(project, file);
    // A missing tarball is DS011's finding; only present bytes are compared.
    if (actual !== null && actual !== integrity) {
      problems.push({ code: 'DS012', message: `Integrity mismatch: ${name} (${resolved}).`, file: lockName });
    }
  }
  for (const { name, file, spec } of expected) {
    if (!locked.has(file)) {
      problems.push({
        code: 'DS012',
        message: `Not in the lockfile: ${name} (${spec}); run ${install}.`,
        file: lockName
      });
    }
  }
  if (exclusive) {
    const wanted = new Set(expected.map(({ file }) => file));
    for (const { name, resolved } of entries) {
      const file = safeVendorFile(resolved);
      if (file && !wanted.has(file)) {
        problems.push({ code: 'DS012', message: `Stale lock entry: ${name} (${resolved}).`, file: lockName });
      }
    }
  }
  return problems;
}

/** Lock entry fields npm copies from the packed manifest; rewritten with each replaced tarball. */
const METADATA = ['dependencies', 'optionalDependencies', 'peerDependencies', 'peerDependenciesMeta', 'bin', 'engines'];

/**
 * Rewrites the npm lock before installing (spec §6.7, §7.7), so npm cannot keep a stale integrity:
 * each vendored entry whose tarball is replaced gets the new `version`, `resolved`, `integrity` and
 * packed metadata, and the root entry's specifiers follow `package.json`. Other entries stay as they
 * are. Returns the new text and one line per rewritten entry, or an error for an unreadable lock.
 * @param {string} text
 * @param {(file: string) => { file: string, integrity: string, packed: Record<string, unknown> } | null} replace
 * @param {(spec: string) => string | null} respec
 * @returns {{ text: string, changed: boolean, rewritten: { key: string, resolved: string }[], error?: undefined }
 *   | { text: null, changed: false, rewritten: [], error: string }}
 */
export function rewriteNpmLock(text, replace, respec) {
  /** @type {unknown} */
  let lock;
  try {
    lock = JSON.parse(text);
  } catch {
    return { text: null, changed: false, rewritten: [], error: 'Cannot read package-lock.json: invalid JSON.' };
  }
  const packages = isRecord(lock) && isRecord(lock.packages) ? lock.packages : {};
  /** @type {{ key: string, resolved: string }[]} */
  const rewritten = [];
  let changed = false;
  for (const [key, entry] of Object.entries(packages)) {
    if (!isRecord(entry)) {
      continue;
    }
    if (key === '') {
      for (const fieldName of ['dependencies', 'devDependencies', 'optionalDependencies', 'peerDependencies']) {
        const specs = entry[fieldName];
        for (const [name, spec] of Object.entries(isRecord(specs) ? specs : {})) {
          const next = typeof spec === 'string' ? respec(spec) : null;
          if (isRecord(specs) && next !== null) {
            specs[name] = next;
            changed = true;
          }
        }
      }
      continue;
    }
    const file = typeof entry.resolved === 'string' ? safeVendorFile(entry.resolved) : null;
    const replacement = file ? replace(file) : null;
    if (!replacement) {
      continue;
    }
    entry.version = replacement.packed.version;
    const resolved = `file:${replacement.file}`;
    entry.resolved = resolved;
    entry.integrity = replacement.integrity;
    for (const fieldName of METADATA) {
      if (replacement.packed[fieldName] === undefined) {
        delete entry[fieldName];
      } else {
        entry[fieldName] = replacement.packed[fieldName];
      }
    }
    rewritten.push({ key, resolved });
  }
  return { text: `${JSON.stringify(lock, null, 2)}\n`, changed: changed || rewritten.length > 0, rewritten };
}
