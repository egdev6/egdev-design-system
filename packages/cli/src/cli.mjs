// `run()` is the whole CLI behind injectable streams and cwd; the bin only wires the process.
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs, RefusedError, USAGE, USAGE_LINE, UsageError } from './args.mjs';
import { runDoctor } from './doctor.mjs';
import { runInit, spawnRunner } from './init.mjs';
import { formatDoctorJson, formatDoctorText, hasErrors } from './plan.mjs';
import { readRelease } from './release.mjs';
import { flattenMessage } from './text.mjs';

export { flattenMessage };

import { runUpgrade } from './upgrade.mjs';

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
    if (command === 'init' || command === 'upgrade') {
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
      return await (command === 'init' ? runInit : runUpgrade)({
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
