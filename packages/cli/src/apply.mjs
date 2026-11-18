// Transactional writes (spec §9.3-§9.5): every target stays inside <project>, with symlinks and
// multi-link files refused; each file is written to a temporary sibling and renamed into place; any
// failure restores every original byte, removes the copied tarballs and the folders it created.
import { randomUUID } from 'node:crypto';
import {
  constants,
  copyFileSync,
  lstatSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmdirSync,
  rmSync,
  writeFileSync
} from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { RefusedError } from './args.mjs';
import { sha256 } from './release.mjs';

/** @typedef {{ path: string, content: string }} FileWrite */
/** @typedef {{ path: string, source: string, sha256: string }} FileCopy */

/** The run failed and was rolled back: exit 1. */
export class TransactionError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.status = 1;
  }
}

/** @param {string} path */
const lstatIfPresent = (path) => {
  try {
    return lstatSync(path);
  } catch {
    return null;
  }
};

/** @param {string} path */
const readIfPresent = (path) => {
  try {
    return readFileSync(path);
  } catch {
    return null;
  }
};

/** @param {unknown} error */
export const codeOf = (error) =>
  error instanceof Error && 'code' in error && typeof error.code === 'string' ? error.code : 'error';

/**
 * Refuses a target outside `project`, or one reached through a symlink, a hard link or a non-file.
 * @param {string} project
 * @param {string} path project-relative, `/`-separated
 */
export function assertSafeTarget(project, path) {
  const parts = path.split('/');
  if (parts.some((part) => part === '' || part === '.' || part === '..')) {
    throw new RefusedError(`Unsafe target: ${path} is outside the project.`);
  }
  let current = project;
  for (const [index, part] of parts.entries()) {
    current = join(current, part);
    const stat = lstatIfPresent(current);
    if (!stat) {
      return;
    }
    const last = index === parts.length - 1;
    if (stat.isSymbolicLink() || (last ? !stat.isFile() || stat.nlink !== 1 : !stat.isDirectory())) {
      throw new RefusedError(`Unsafe target: ${path} is a symlink, a hard link or not a regular file.`);
    }
  }
}

/** @param {string} path */
const temporaryFor = (path) => join(dirname(path), `.${basename(path)}.${randomUUID().slice(0, 8)}.egdev-ds.tmp`);

/**
 * @param {string} path
 * @param {string | Buffer} content
 */
function atomicWrite(path, content) {
  const temporary = temporaryFor(path);
  try {
    writeFileSync(temporary, content, { flag: 'wx' });
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
}

/**
 * @param {string} source
 * @param {string} path
 * @param {string} expected
 */
function atomicCopy(source, path, expected) {
  const temporary = temporaryFor(path);
  try {
    copyFileSync(source, temporary, constants.COPYFILE_EXCL);
    if (sha256(readFileSync(temporary)) !== expected) {
      throw new Error(`Release file changed while copying: ${source}`);
    }
    renameSync(temporary, path);
  } catch (error) {
    rmSync(temporary, { force: true });
    throw error;
  }
}

/**
 * Creates the missing folders of `path` below `project` and records each one.
 * @param {string} project
 * @param {string} path
 * @param {string[]} created
 */
function ensureParent(project, path, created) {
  const parts = path.split('/').slice(0, -1);
  let current = project;
  for (const part of parts) {
    current = join(current, part);
    if (!lstatIfPresent(current)) {
      mkdirSync(current);
      created.push(current);
    }
  }
}

/**
 * Copies, then writes, then runs `finish`, as one unit. `watch` lists files that `finish` may
 * change (the lockfile); they are restored byte for byte too.
 * @template T
 * @param {{
 *   project: string,
 *   copies: readonly FileCopy[],
 *   writes: readonly FileWrite[],
 *   watch: readonly string[],
 *   finish: () => T | Promise<T>
 * }} input
 * @returns {Promise<T>}
 */
export async function transact({ project, copies, writes, watch, finish }) {
  const targets = [...copies.map(({ path }) => path), ...writes.map(({ path }) => path), ...watch];
  for (const path of targets) {
    assertSafeTarget(project, path);
  }
  /** @type {Map<string, Buffer | null>} */
  const originals = new Map();
  for (const path of [...writes.map((write) => write.path), ...watch]) {
    originals.set(path, readIfPresent(join(project, path)));
  }
  /** @type {string[]} */
  const copied = [];
  /** @type {string[]} */
  const directories = [];
  /** @type {string | null} */
  let current = null;
  try {
    for (const copy of copies) {
      current = copy.path;
      ensureParent(project, copy.path, directories);
      atomicCopy(copy.source, join(project, copy.path), copy.sha256);
      copied.push(copy.path);
    }
    for (const write of writes) {
      current = write.path;
      ensureParent(project, write.path, directories);
      atomicWrite(join(project, write.path), write.content);
    }
    current = null;
    return await finish();
  } catch (error) {
    const reason = current
      ? `Cannot write ${current} (${codeOf(error)})`
      : (error instanceof Error ? error.message : String(error)).replace(/\.$/, '');
    /** @type {string[]} */
    const failed = [];
    for (const [path, original] of originals) {
      try {
        const now = readIfPresent(join(project, path));
        if (original === null) {
          rmSync(join(project, path), { force: true });
        } else if (now === null || !now.equals(original)) {
          atomicWrite(join(project, path), original);
        }
      } catch {
        failed.push(path);
      }
    }
    for (const path of copied) {
      try {
        rmSync(join(project, path), { force: true });
      } catch {
        failed.push(path);
      }
    }
    for (const directory of directories.reverse()) {
      try {
        rmdirSync(directory);
      } catch {
        // A folder that is not empty keeps files this run did not create.
      }
    }
    const suffix = failed.length > 0 ? `; rollback failed for ${failed.join(', ')}` : '; rolled back';
    throw new TransactionError(`${reason}${suffix}.`);
  }
}
