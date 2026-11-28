import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { parseArgs, USAGE, USAGE_LINE } from '../src/args.mjs';
import { runBin, treeHash } from './helpers.mjs';

const scratch = [];
after(() => {
  for (const path of scratch) {
    rmSync(path, { recursive: true, force: true });
  }
});
const temporary = () => {
  const directory = mkdtempSync(join(tmpdir(), 'egdev-ds-args-'));
  scratch.push(directory);
  return directory;
};

const defaults = {
  accent: false,
  allowDirty: false,
  dryRun: false,
  force: false,
  json: false,
  noInstall: false,
  offline: false
};

test('AC2 parseArgs reads every documented command and flag', () => {
  assert.deepEqual(parseArgs(['--help']), { kind: 'help' });
  assert.deepEqual(parseArgs(['doctor', 'apps/hub', '--help']), { kind: 'help' });
  assert.deepEqual(parseArgs(['--version']), { kind: 'version' });
  assert.deepEqual(parseArgs(['doctor', '.']), { kind: 'command', command: 'doctor', project: '.', options: defaults });
  assert.deepEqual(parseArgs(['doctor', '--json', 'apps/hub', '--from', '../release']), {
    kind: 'command',
    command: 'doctor',
    project: 'apps/hub',
    options: { ...defaults, json: true, from: '../release' }
  });
  assert.deepEqual(
    parseArgs([
      'init',
      'app',
      '--packages',
      'tokens,ui,effects',
      '--css',
      'tailwind',
      '--css-entry',
      'src/app.css',
      '--accent',
      '--no-install',
      '--offline',
      '--allow-dirty',
      '--force',
      '--dry-run'
    ]),
    {
      kind: 'command',
      command: 'init',
      project: 'app',
      options: {
        accent: true,
        allowDirty: true,
        dryRun: true,
        force: true,
        json: false,
        noInstall: true,
        offline: true,
        packages: ['tokens', 'ui', 'effects'],
        css: 'tailwind',
        cssEntry: 'src/app.css'
      }
    }
  );
  assert.deepEqual(parseArgs(['status', 'apps/hub', '--json', '--from', '../release']), {
    kind: 'command',
    command: 'status',
    project: 'apps/hub',
    options: { ...defaults, json: true, from: '../release' }
  });
  assert.deepEqual(parseArgs(['upgrade', '.', '--local-repo', 'nexo']), {
    kind: 'command',
    command: 'upgrade',
    project: '.',
    options: { ...defaults, localRepo: 'nexo' }
  });
  assert.deepEqual(parseArgs(['upgrade', 'app', '--offline', '--dry-run']).options, {
    ...defaults,
    offline: true,
    dryRun: true
  });
});

test('AC2 parseArgs rejects misuse with one stable message each', () => {
  const cases = [
    [[], 'Missing command.'],
    [['fix', '.'], 'Unknown command: fix'],
    [['--verbose'], 'Unknown argument: --verbose'],
    [['--version', 'doctor'], 'Unexpected argument: doctor'],
    [['doctor'], 'Missing <project>.'],
    [['doctor', 'a', 'b'], 'Unexpected argument: b'],
    [['doctor', '.', '--verbose'], 'Unknown argument: --verbose'],
    [['doctor', '.', '--dry-run'], 'Unknown argument for doctor: --dry-run'],
    [['upgrade', '.', '--packages', 'ui'], 'Unknown argument for upgrade: --packages'],
    [['doctor', '.', '--from'], 'Missing value: --from'],
    [['doctor', '.', '--from', '--json'], 'Missing value: --from'],
    [['doctor', '.', '--from', ''], 'Missing value: --from'],
    [['doctor', '.', '--json', '--json'], 'Duplicate argument: --json'],
    [['doctor', '.', '--from=release'], 'Unknown argument: --from=release'],
    [['init', '.', '--packages', 'ui,cli'], 'Invalid packages: choose from tokens,ui,effects,system,mcp.'],
    [['init', '.', '--packages', 'ui,ui'], 'Invalid packages: choose from tokens,ui,effects,system,mcp.'],
    [['init', '.', '--css', 'sass'], 'Invalid --css: choose tailwind or native.'],
    [['init', '.', '--css-entry', 'src/app.scss'], 'Invalid --css-entry: expected a .css file.']
  ];
  for (const [args, message] of cases) {
    assert.throws(
      () => parseArgs(args),
      (error) =>
        error instanceof Error && error.message === message && /** @type {{status?: number}} */ (error).status === 2,
      `${JSON.stringify(args)} must fail with ${message}`
    );
  }
});

test('AC2 bin: --help and --version print on stdout and exit 0', () => {
  const cwd = temporary();
  const help = runBin(['--help'], cwd);
  assert.deepEqual(help, { status: 0, stdout: USAGE, stderr: '' });
  assert.match(USAGE, /^Usage:\n {2}egdev-ds init {4}<project> \[--from <dir>\]/);
  assert.match(USAGE, /\n {2}egdev-ds doctor {2}<project> \[--from <dir>\] \[--fail-on-pending\] \[--json\]\n/);
  assert.deepEqual(runBin(['--version'], cwd), { status: 0, stdout: '0.6.0\n', stderr: '' });
});

test('AC2 bin: misuse exits 2 with one error line plus usage on stderr, empty stdout, no files changed', () => {
  const cwd = temporary();
  writeFileSync(join(cwd, 'package.json'), '{}\n');
  const before = treeHash(cwd);
  for (const [args, message] of [
    [['doctor', '.', '--unknown'], 'Unknown argument: --unknown'],
    [['doctor', '.', '--json', '--json'], 'Duplicate argument: --json'],
    [['doctor', '.', '--from'], 'Missing value: --from'],
    [['doctor'], 'Missing <project>.'],
    [[], 'Missing command.']
  ]) {
    assert.deepEqual(runBin(args, cwd), { status: 2, stdout: '', stderr: `${message}\n${USAGE_LINE}\n` });
  }
  assert.equal(treeHash(cwd), before);
});

test('S13 bin: --fail-on-pending is rejected for other commands and duplicates, without writes', () => {
  const cwd = temporary();
  writeFileSync(join(cwd, 'package.json'), '{}\n');
  const before = treeHash(cwd);
  for (const command of ['init', 'upgrade', 'status']) {
    assert.deepEqual(runBin([command, '.', '--fail-on-pending'], cwd), {
      status: 2,
      stdout: '',
      stderr: `Unknown argument for ${command}: --fail-on-pending\n${USAGE_LINE}\n`
    });
    assert.equal(treeHash(cwd), before);
  }
  assert.deepEqual(runBin(['doctor', '.', '--fail-on-pending', '--fail-on-pending'], cwd), {
    status: 2,
    stdout: '',
    stderr: `Duplicate argument: --fail-on-pending\n${USAGE_LINE}\n`
  });
  assert.equal(treeHash(cwd), before);
});

test('S13 shared parser preserves init --dry-run with --from', () => {
  const cwd = temporary();
  writeFileSync(join(cwd, 'package.json'), '{}\n');
  const before = treeHash(cwd);
  assert.deepEqual(runBin(['init', '.', '--dry-run', '--from', 'missing-release'], cwd), {
    status: 2,
    stdout: '',
    stderr: 'No release folder: missing-release not found.\n'
  });
  assert.equal(treeHash(cwd), before);
});

test('S13 shared parser preserves upgrade --add with --from', () => {
  const cwd = temporary();
  writeFileSync(join(cwd, 'package.json'), '{}\n');
  const before = treeHash(cwd);
  assert.deepEqual(runBin(['upgrade', '.', '--add', 'cli', '--from', 'missing-release'], cwd), {
    status: 2,
    stdout: '',
    stderr: 'No release folder: missing-release not found.\n'
  });
  assert.equal(treeHash(cwd), before);
});

test('S13 shared parser preserves the existing status --dry-run rejection', () => {
  const cwd = temporary();
  writeFileSync(join(cwd, 'package.json'), '{}\n');
  const before = treeHash(cwd);
  assert.deepEqual(runBin(['status', '.', '--dry-run'], cwd), {
    status: 2,
    stdout: '',
    stderr: `Unknown argument for status: --dry-run\n${USAGE_LINE}\n`
  });
  assert.equal(treeHash(cwd), before);
});

test('AC2 bin: upgrade and init are available; without a release folder both exit 2 writing nothing', () => {
  const cwd = temporary();
  writeFileSync(join(cwd, 'package.json'), '{}\n');
  const before = treeHash(cwd);
  const missing = 'No release folder: pass --from <dir> (default ../egdev-design-system/release not found).\n';
  for (const command of ['upgrade', 'init']) {
    assert.deepEqual(runBin([command, '.', '--dry-run'], cwd), { status: 2, stdout: '', stderr: missing });
  }
  assert.equal(treeHash(cwd), before);
});
