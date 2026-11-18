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
 * Integrity of each vendored lock entry and presence of each expected vendored file.
 * @param {{
 *   project: string,
 *   packageManager: 'npm' | 'pnpm',
 *   expected: { name: string, file: string, spec: string }[]
 * }} input
 * @returns {LockProblem[]}
 */
export function checkLockfile({ project, packageManager, expected }) {
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
  return problems;
}
