// Flag parsing and usage text (docs/distribution/egdev-ds-cli.md §4). Misuse is a UsageError,
// which the CLI reports on stderr with the usage line and exit code 2.
import { REPO_NAME } from './detect.mjs';

/** @typedef {'init' | 'upgrade' | 'doctor' | 'status'} Command */
/** @typedef {'tokens' | 'ui' | 'effects' | 'system' | 'mcp'} PackageName */
/** @typedef {PackageName | 'cli'} ReleasePackageName */

/**
 * @typedef {{
 *   from?: string,
 *   packages?: PackageName[],
 *   add?: ReleasePackageName[],
 *   css?: 'tailwind' | 'native',
 *   cssEntry?: string,
 *   localRepo?: string,
 *   accent: boolean,
 *   noInstall: boolean,
 *   offline: boolean,
 *   allowDirty: boolean,
 *   force: boolean,
 *   dryRun: boolean,
 *   failOnPending?: boolean,
 *   json: boolean
 * }} Options
 */

/**
 * @typedef {{ kind: 'help' }
 *   | { kind: 'version' }
 *   | { kind: 'command', command: Command, project: string, options: Options }} ParsedArgs
 */

export const USAGE = `Usage:
  egdev-ds init    <project> [--from <dir>] [--packages <list>] [--css tailwind|native] [--css-entry <path>]
                             [--local-repo <name>] [--accent] [--no-install] [--offline] [--allow-dirty] [--force]
                             [--dry-run] [--json]
  egdev-ds upgrade <project> [--from <dir>] [--add <list>] [--local-repo <name>] [--no-install] [--offline]
                             [--allow-dirty] [--dry-run] [--json]
  egdev-ds doctor  <project> [--from <dir>] [--fail-on-pending] [--json]
  egdev-ds status  <project> [--from <dir>] [--json]
  egdev-ds --help | --version
`;

export const USAGE_LINE =
  'Usage: egdev-ds init|upgrade|doctor|status <project> [options]; run egdev-ds --help for details.';

/** Misuse or a refused precondition: exit 2, nothing written. */
export class UsageError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.status = 2;
  }
}

/** A refused precondition: exit 2 with one stderr line and no usage. Nothing is written. */
export class RefusedError extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.status = 2;
  }
}

/** @type {readonly PackageName[]} */
export const PACKAGE_NAMES = ['tokens', 'ui', 'effects', 'system', 'mcp'];

/** Names `upgrade --add` accepts: the whole release set, the CLI included (owner decision L11). */
/** @type {readonly ReleasePackageName[]} */
export const ADD_NAMES = [...PACKAGE_NAMES, 'cli'];

/** @type {Record<Command, readonly string[]>} */
const VALUE_FLAGS = {
  init: ['--from', '--packages', '--css', '--css-entry', '--local-repo'],
  upgrade: ['--from', '--add', '--local-repo'],
  doctor: ['--from'],
  status: ['--from']
};

/** @type {Record<Command, readonly string[]>} */
const BOOLEAN_FLAGS = {
  init: ['--accent', '--no-install', '--offline', '--allow-dirty', '--force', '--dry-run', '--json'],
  upgrade: ['--no-install', '--offline', '--allow-dirty', '--dry-run', '--json'],
  doctor: ['--fail-on-pending', '--json'],
  status: ['--json']
};

const KNOWN_FLAGS = new Set([...Object.values(VALUE_FLAGS).flat(), ...Object.values(BOOLEAN_FLAGS).flat()]);

/** @type {Record<string, 'accent' | 'noInstall' | 'offline' | 'allowDirty' | 'force' | 'dryRun' | 'failOnPending' | 'json'>} */
const BOOLEAN_KEYS = {
  '--accent': 'accent',
  '--no-install': 'noInstall',
  '--offline': 'offline',
  '--allow-dirty': 'allowDirty',
  '--force': 'force',
  '--dry-run': 'dryRun',
  '--fail-on-pending': 'failOnPending',
  '--json': 'json'
};

/**
 * @param {string} value
 * @returns {value is Command}
 */
const isCommand = (value) => value === 'init' || value === 'upgrade' || value === 'doctor' || value === 'status';

/**
 * @param {string} value
 * @returns {value is PackageName}
 */
const isPackageName = (value) => PACKAGE_NAMES.some((name) => name === value);

/**
 * @param {string} value
 * @returns {value is ReleasePackageName}
 */
const isAddName = (value) => ADD_NAMES.some((name) => name === value);

/**
 * @param {Options} options
 * @param {string} flag
 * @param {string} value
 */
function setValue(options, flag, value) {
  if (flag === '--from') {
    options.from = value;
  } else if (flag === '--packages') {
    const names = value.split(',');
    if (!names.every(isPackageName) || new Set(names).size !== names.length) {
      throw new UsageError(`Invalid packages: choose from ${PACKAGE_NAMES.join(',')}.`);
    }
    options.packages = names.filter(isPackageName);
  } else if (flag === '--add') {
    const names = value.split(',');
    if (!names.every(isAddName) || new Set(names).size !== names.length) {
      throw new UsageError(`Invalid --add: choose from ${ADD_NAMES.join(',')}.`);
    }
    options.add = names.filter(isAddName);
  } else if (flag === '--css') {
    if (value !== 'tailwind' && value !== 'native') {
      throw new UsageError('Invalid --css: choose tailwind or native.');
    }
    options.css = value;
  } else if (flag === '--local-repo') {
    if (!REPO_NAME.test(value)) {
      throw new UsageError('Invalid --local-repo: expected a repository name (letters, digits, ., _ or -).');
    }
    options.localRepo = value;
  } else {
    if (!value.endsWith('.css')) {
      throw new UsageError('Invalid --css-entry: expected a .css file.');
    }
    options.cssEntry = value;
  }
}

/**
 * Parses `egdev-ds` arguments. Long kebab-case flags only; `--flag=value` is not accepted.
 * @param {readonly string[]} args
 * @returns {ParsedArgs}
 */
export function parseArgs(args) {
  if (args.includes('--help')) {
    return { kind: 'help' };
  }
  const [first, ...rest] = args;
  if (first === undefined) {
    throw new UsageError('Missing command.');
  }
  if (first === '--version') {
    if (rest[0] !== undefined) {
      throw new UsageError(`Unexpected argument: ${rest[0]}`);
    }
    return { kind: 'version' };
  }
  if (first.startsWith('--')) {
    throw new UsageError(`Unknown argument: ${first}`);
  }
  if (!isCommand(first)) {
    throw new UsageError(`Unknown command: ${first}`);
  }
  const command = first;
  /** @type {Options} */
  const options = {
    accent: false,
    allowDirty: false,
    dryRun: false,
    force: false,
    json: false,
    noInstall: false,
    offline: false
  };
  /** @type {string | undefined} */
  let project;
  const seen = new Set();
  for (let index = 0; index < rest.length; index++) {
    const arg = rest[index] ?? '';
    if (!arg.startsWith('--')) {
      if (project !== undefined) {
        throw new UsageError(`Unexpected argument: ${arg}`);
      }
      project = arg;
      continue;
    }
    const isValue = VALUE_FLAGS[command].includes(arg);
    if (!isValue && !BOOLEAN_FLAGS[command].includes(arg)) {
      throw new UsageError(
        KNOWN_FLAGS.has(arg) ? `Unknown argument for ${command}: ${arg}` : `Unknown argument: ${arg}`
      );
    }
    if (seen.has(arg)) {
      throw new UsageError(`Duplicate argument: ${arg}`);
    }
    seen.add(arg);
    if (isValue) {
      const value = rest[index + 1];
      if (!value || value.startsWith('--')) {
        throw new UsageError(`Missing value: ${arg}`);
      }
      setValue(options, arg, value);
      index++;
    } else {
      const key = BOOLEAN_KEYS[arg];
      if (key) {
        options[key] = true;
      }
    }
  }
  if (project === undefined) {
    throw new UsageError('Missing <project>.');
  }
  return { kind: 'command', command, project, options };
}
