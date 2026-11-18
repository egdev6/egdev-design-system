// `run()` is the whole CLI behind injectable streams and cwd; the bin only wires the process.
import { readFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs, USAGE, USAGE_LINE, UsageError } from './args.mjs';
import { runDoctor } from './doctor.mjs';
import { formatDoctorJson, formatDoctorText, hasErrors } from './plan.mjs';
import { readRelease } from './release.mjs';

/** @typedef {{ cwd: string, stdout: (text: string) => void, stderr: (text: string) => void }} RunContext */

/** A refused precondition: exit 2 with one stderr line and no usage. */
export class RefusedError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.status = 2;
  }
}

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
export async function run(args, { cwd, stdout, stderr }) {
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
    if (command !== 'doctor') {
      throw new RefusedError(`egdev-ds ${command} is not implemented yet; only doctor is available.`);
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
    const message = (error instanceof Error ? error.message : String(error)).replace(/\s*\n\s*/g, ' ');
    if (error instanceof UsageError) {
      stderr(`${message}\n${USAGE_LINE}\n`);
      return 2;
    }
    stderr(`${message}\n`);
    return error instanceof RefusedError ? 2 : 1;
  }
}
