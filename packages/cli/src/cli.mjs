// `run()` is the whole CLI behind injectable streams and cwd; the bin only wires the process.
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs, RefusedError, USAGE, USAGE_LINE, UsageError } from './args.mjs';
import { runDoctor } from './doctor.mjs';
import { runInit, spawnRunner } from './init.mjs';
import { formatDoctorJson, formatDoctorText, hasErrors } from './plan.mjs';
import { readRelease } from './release.mjs';

/**
 * @typedef {{
 *   cwd: string,
 *   stdout: (text: string) => void,
 *   stderr: (text: string) => void,
 *   runner?: import('./init.mjs').Runner
 * }} RunContext
 */

export { RefusedError };

/** The release folder when `--from` is omitted, resolved against the current directory (spec §3). */
export const DEFAULT_RELEASE = '../egdev-design-system/release';

/** @returns {string} */
function version() {
  const manifest = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  return String(manifest.version);
}

/** @param {string} path */
const isDirectory = (path) => {
  try {
    return statSync(path).isDirectory();
  } catch {
    return false;
  }
};

/**
 * Collapses every line break and the whitespace around it into one space, in linear time.
 * Same result as replacing each whitespace-newline-whitespace run with a space, without the polynomial
 * backtracking of that regular expression (CodeQL js/polynomial-redos).
 * @param {string} text
 * @returns {string}
 */
export function flattenMessage(text) {
  const lines = text.split('\n');
  const last = lines.length - 1;
  /** @type {string[]} */
  const parts = [];
  lines.forEach((line, index) => {
    const start = index === 0 ? line : line.trimStart();
    const trimmed = index === last ? start : start.trimEnd();
    if (trimmed !== '' || index === 0 || index === last) {
      parts.push(trimmed);
    }
  });
  return parts.join(' ');
}

/**
 * @param {readonly string[]} args
 * @param {RunContext} context
 * @returns {Promise<number>} the process exit code
 */
export async function run(args, { cwd, stdout, stderr, runner = spawnRunner }) {
  try {
    const parsed = parseArgs(args);
    if (parsed.kind === 'help') {
      stdout(USAGE);
      return 0;
    }
    if (parsed.kind === 'version') {
      stdout(`${version()}\n`);
      return 0;
    }
    const { command, project, options } = parsed;
    if (command === 'upgrade') {
      throw new RefusedError(`egdev-ds ${command} is not implemented yet; only doctor and init are available.`);
    }
    if (command === 'init') {
      const from = options.from ?? DEFAULT_RELEASE;
      const releaseDir = resolve(cwd, from);
      if (!isDirectory(releaseDir)) {
        throw new RefusedError(
          options.from === undefined
            ? `No release folder: pass --from <dir> (default ${DEFAULT_RELEASE} not found).`
            : `No release folder: ${options.from} not found.`
        );
      }
      const release = readRelease(releaseDir);
      return await runInit({
        argument: project,
        project: resolve(cwd, project),
        from,
        releaseDir,
        release,
        options,
        runner,
        stdout,
        stderr
      });
    }
    let release = null;
    if (options.from !== undefined) {
      const directory = resolve(cwd, options.from);
      if (!isDirectory(directory)) {
        throw new RefusedError(`No release folder: ${options.from} not found.`);
      }
      release = readRelease(directory);
    }
    const report = await runDoctor({ project: resolve(cwd, project), release });
    const summary = release && options.from !== undefined ? { dir: options.from, commit: release.commit } : null;
    stdout(
      options.json ? formatDoctorJson({ project, report, release: summary }) : formatDoctorText({ project, report })
    );
    return hasErrors(report.findings) ? 1 : 0;
  } catch (error) {
    const message = flattenMessage(error instanceof Error ? error.message : String(error));
    if (error instanceof UsageError) {
      stderr(`${message}\n${USAGE_LINE}\n`);
      return 2;
    }
    stderr(`${message}\n`);
    return error instanceof RefusedError ? 2 : 1;
  }
}
