// Release folder reader: `release.json` provenance (spec §3), sha256, and the packed-manifest
// reader that `scripts/lib/pack-packages.mjs` also uses, so the logic has a single owner that
// still works when the CLI runs from its tarball.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gunzipSync } from 'node:zlib';

/** @typedef {{ name: string, version: string, file: string, sha256: string }} ReleasePackage */
/** @typedef {{ schemaVersion: 1, commit: string, dirty: boolean, packages: ReleasePackage[] }} Release */

/** An unreadable or inconsistent release: exit 1 with one stderr line naming the file. */
export class ReleaseError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.status = 1;
  }
}

/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
export const isRecord = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);

/** @param {Uint8Array} bytes */
export const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

/** @param {Uint8Array} bytes */
export const sri = (bytes) => `sha512-${createHash('sha512').update(bytes).digest('base64')}`;

/**
 * @param {Buffer} header
 * @param {number} offset
 * @param {number} length
 */
function headerString(header, offset, length) {
  const field = header.subarray(offset, offset + length);
  const end = field.indexOf(0);
  return field.subarray(0, end === -1 ? field.length : end).toString('utf8');
}

/**
 * Dependency-free reader for the packed manifest: gunzip plus 512-byte tar headers, no `tar` CLI
 * and no new dependency on any platform.
 * @param {string} tarball
 * @returns {Record<string, unknown>}
 */
export function readPackedManifest(tarball) {
  const archive = gunzipSync(readFileSync(tarball));
  for (let offset = 0; offset + 512 <= archive.length; ) {
    const header = archive.subarray(offset, offset + 512);
    if (header.every((byte) => byte === 0)) {
      break;
    }
    const entryName = headerString(header, 0, 100).replace(/^\.\//, '');
    const size = Number.parseInt(headerString(header, 124, 12).trim() || '0', 8);
    const dataStart = offset + 512;
    if (entryName === 'package/package.json') {
      return JSON.parse(archive.subarray(dataStart, dataStart + size).toString('utf8'));
    }
    offset = dataStart + Math.ceil(size / 512) * 512;
  }
  throw new Error(`No package/package.json inside ${tarball}`);
}

/**
 * @param {unknown} entry
 * @returns {entry is ReleasePackage}
 */
const isReleasePackage = (entry) =>
  isRecord(entry) &&
  typeof entry.name === 'string' &&
  /^@egdev\/[a-z]+$/.test(entry.name) &&
  typeof entry.version === 'string' &&
  entry.version !== '' &&
  typeof entry.file === 'string' &&
  /^egdev-[a-z0-9][a-z0-9.+-]*\.tgz$/.test(entry.file) &&
  typeof entry.sha256 === 'string' &&
  /^[0-9a-f]{64}$/.test(entry.sha256);

/**
 * Reads `<dir>/release.json` and verifies every listed tarball's sha256. `dir` is used as given in
 * messages, so they name the path the user passed.
 * @param {string} dir
 * @returns {Release}
 */
export function readRelease(dir) {
  const path = join(dir, 'release.json');
  /** @type {string} */
  let text;
  try {
    text = readFileSync(path, 'utf8');
  } catch {
    throw new ReleaseError(`Cannot read ${path}: not found.`);
  }
  /** @type {unknown} */
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ReleaseError(`Cannot read ${path}: invalid JSON.`);
  }
  /** @param {string} reason */
  const invalid = (reason) => new ReleaseError(`Invalid ${path}: ${reason}`);
  if (!isRecord(data) || data.schemaVersion !== 1) {
    throw invalid('schemaVersion must be 1.');
  }
  if (typeof data.commit !== 'string' || !/^[0-9a-f]{40}$/.test(data.commit)) {
    throw invalid('commit must be a 40-character hex SHA.');
  }
  if (typeof data.dirty !== 'boolean') {
    throw invalid('dirty must be a boolean.');
  }
  if (!Array.isArray(data.packages)) {
    throw invalid('packages must be an array.');
  }
  /** @type {ReleasePackage[]} */
  const packages = [];
  for (const [index, entry] of data.packages.entries()) {
    if (!isReleasePackage(entry)) {
      throw invalid(`packages[${index}] needs name, version, file and a 64-hex sha256.`);
    }
    const file = join(dir, entry.file);
    /** @type {Buffer} */
    let bytes;
    try {
      bytes = readFileSync(file);
    } catch {
      throw new ReleaseError(`Release file missing: ${file} (listed in ${path}).`);
    }
    if (sha256(bytes) !== entry.sha256) {
      throw new ReleaseError(`Release mismatch: ${file} sha256 differs from ${path}.`);
    }
    packages.push({ name: entry.name, version: entry.version, file: entry.file, sha256: entry.sha256 });
  }
  return { schemaVersion: 1, commit: data.commit, dirty: data.dirty, packages };
}
