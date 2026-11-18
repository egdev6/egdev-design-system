// `egdev-ds status <project>` (#486, odd/tasks/egdev-ds-485-486.md S3): read-only report of the
// vendored commit, package versions and files, derived from the vendored file names.
import assert from 'node:assert/strict';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { USAGE_LINE } from '../src/args.mjs';
import { run } from '../src/cli.mjs';
import {
  COMMIT,
  fakeInstaller,
  freshNpmVite,
  json,
  npmViteFixture,
  OTHER_COMMIT,
  pnpmNextFixture,
  releaseFixture,
  runBin,
  runInProcess,
  treeHash
} from './helpers.mjs';

const scratch = [];
after(() => {
  for (const path of scratch) {
    rmSync(path, { recursive: true, force: true });
  }
});
const track = (fixture) => {
  scratch.push(fixture.root);
  return fixture;
};
const release = (commit = COMMIT) => {
  const directory = releaseFixture(['tokens', 'ui', 'effects', 'system', 'mcp'], commit);
  scratch.push(directory);
  return directory;
};
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const editJson = (path, edit) => writeFileSync(path, json(edit(readJson(path))));

const NPM_TEXT = [
  'egdev-ds status apps/hub (npm, vite, native)',
  'Vendored at e712915:',
  '  @egdev/tokens  0.5.0  file:vendor/egdev-tokens-0.5.0-e712915.tgz',
  '  @egdev/ui      0.3.1  file:vendor/egdev-ui-0.3.1-e712915.tgz',
  '  @egdev/system  0.4.1  file:vendor/egdev-system-0.4.1-e712915.tgz',
  '  @egdev/mcp     0.4.1  file:vendor/egdev-mcp-0.4.1-e712915.tgz'
];

const NPM_PACKAGES = [
  { name: '@egdev/tokens', version: '0.5.0', file: 'vendor/egdev-tokens-0.5.0-e712915.tgz', style: 'file:' },
  { name: '@egdev/ui', version: '0.3.1', file: 'vendor/egdev-ui-0.3.1-e712915.tgz', style: 'file:' },
  { name: '@egdev/system', version: '0.4.1', file: 'vendor/egdev-system-0.4.1-e712915.tgz', style: 'file:' },
  { name: '@egdev/mcp', version: '0.4.1', file: 'vendor/egdev-mcp-0.4.1-e712915.tgz', style: 'file:' }
];

test('S3 status npm+Vite (Nexo-like): exact text, exit 0, nothing written or spawned', async () => {
  const fixture = track(npmViteFixture());
  const before = treeHash(fixture.root);
  const { calls, runner } = fakeInstaller();
  assert.deepEqual(await runInProcess(run, ['status', 'apps/hub'], fixture.root, { runner }), {
    status: 0,
    stdout: [...NPM_TEXT, 'Release check skipped: pass --from <dir>.', ''].join('\n'),
    stderr: ''
  });
  assert.deepEqual(calls, [], 'status spawns nothing');
  assert.equal(treeHash(fixture.root), before, 'status never writes');
});

test('S3 status --json npm+Vite: one versioned document', () => {
  const fixture = track(npmViteFixture());
  const before = treeHash(fixture.root);
  const result = runBin(['status', 'apps/hub', '--json'], fixture.root);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.ok(result.stdout.endsWith('}\n'));
  assert.deepEqual(JSON.parse(result.stdout), {
    schemaVersion: 1,
    command: 'status',
    project: 'apps/hub',
    packageManager: 'npm',
    framework: 'vite',
    cssMode: 'native',
    release: null,
    commit: 'e712915',
    packages: NPM_PACKAGES,
    upgradeAvailable: null
  });
  assert.equal(treeHash(fixture.root), before);
});

test('S3 status pnpm+Next.js (website-like): exact text and JSON, every package in release-set order', () => {
  const fixture = track(pnpmNextFixture());
  const before = treeHash(fixture.root);
  assert.deepEqual(runBin(['status', '.'], fixture.root), {
    status: 0,
    stdout: [
      'egdev-ds status . (pnpm, next, tailwind)',
      'Vendored at e712915:',
      '  @egdev/tokens   0.5.0  file:./vendor/egdev/egdev-tokens-0.5.0-e712915.tgz',
      '  @egdev/ui       0.3.1  file:./vendor/egdev/egdev-ui-0.3.1-e712915.tgz',
      '  @egdev/effects  0.2.1  file:./vendor/egdev/egdev-effects-0.2.1-e712915.tgz',
      '  @egdev/system   0.4.1  file:./vendor/egdev/egdev-system-0.4.1-e712915.tgz',
      '  @egdev/mcp      0.4.1  file:./vendor/egdev/egdev-mcp-0.4.1-e712915.tgz',
      'Release check skipped: pass --from <dir>.',
      ''
    ].join('\n'),
    stderr: ''
  });
  const result = runBin(['status', '.', '--json'], fixture.root);
  assert.equal(result.status, 0);
  assert.deepEqual(JSON.parse(result.stdout), {
    schemaVersion: 1,
    command: 'status',
    project: '.',
    packageManager: 'pnpm',
    framework: 'next',
    cssMode: 'tailwind',
    release: null,
    commit: 'e712915',
    packages: ['tokens', 'ui', 'effects', 'system', 'mcp'].map((pkg) => {
      const version = { tokens: '0.5.0', ui: '0.3.1', effects: '0.2.1', system: '0.4.1', mcp: '0.4.1' }[pkg];
      return {
        name: `@egdev/${pkg}`,
        version,
        file: `vendor/egdev/egdev-${pkg}-${version}-e712915.tgz`,
        style: 'file:./'
      };
    }),
    upgradeAvailable: null
  });
  assert.equal(treeHash(fixture.root), before);
});

test('S3 status --from reports the release commit and whether an upgrade is available', () => {
  const fixture = track(npmViteFixture());
  const newer = release(OTHER_COMMIT);
  const same = release(COMMIT);
  const before = [treeHash(fixture.root), treeHash(newer), treeHash(same)];
  assert.deepEqual(runBin(['status', 'apps/hub', '--from', newer], fixture.root), {
    status: 0,
    stdout: [...NPM_TEXT, `Release at b54222c (${newer}): upgrade available.`, ''].join('\n'),
    stderr: ''
  });
  assert.deepEqual(runBin(['status', 'apps/hub', '--from', same], fixture.root), {
    status: 0,
    stdout: [...NPM_TEXT, `Release at e712915 (${same}): up to date.`, ''].join('\n'),
    stderr: ''
  });
  const document = JSON.parse(runBin(['status', 'apps/hub', '--from', newer, '--json'], fixture.root).stdout);
  assert.deepEqual(document.release, { dir: newer, commit: OTHER_COMMIT });
  assert.equal(document.upgradeAvailable, true);
  assert.equal(
    JSON.parse(runBin(['status', 'apps/hub', '--from', same, '--json'], fixture.root).stdout).upgradeAvailable,
    false
  );
  assert.deepEqual([treeHash(fixture.root), treeHash(newer), treeHash(same)], before);
});

test('S3 status refuses none, unsafe, foreign and mixed states with exit 2 and writes nothing', async () => {
  const fresh = track(freshNpmVite());
  const cases = [[fresh, 'apps/hub has no vendored @egdev packages; run egdev-ds init.']];
  const unsafe = track(npmViteFixture());
  editJson(join(unsafe.project, 'package.json'), (manifest) => ({
    ...manifest,
    dependencies: { ...manifest.dependencies, '@egdev/ui': 'file:vendor/../egdev-ui.tgz' }
  }));
  cases.push([unsafe, 'Unsafe vendored path: @egdev/ui (file:vendor/../egdev-ui.tgz).']);
  const foreign = track(npmViteFixture());
  editJson(join(foreign.project, 'package.json'), (manifest) => ({
    ...manifest,
    dependencies: { ...manifest.dependencies, '@egdev/tokens': '^0.5.0' }
  }));
  cases.push([
    foreign,
    'apps/hub declares @egdev/tokens as ^0.5.0 (package.json dependencies); status reads only vendored tarballs.'
  ]);
  const mixed = track(npmViteFixture());
  editJson(join(mixed.project, 'package.json'), (manifest) => ({
    ...manifest,
    dependencies: { ...manifest.dependencies, '@egdev/ui': 'file:vendor/egdev-ui-0.3.1-b54222c.tgz' }
  }));
  cases.push([mixed, 'apps/hub has a mixed vendored set (b54222c, e712915); run egdev-ds upgrade.']);
  for (const [fixture, message] of cases) {
    const before = treeHash(fixture.root);
    for (const args of [
      ['status', 'apps/hub'],
      ['status', 'apps/hub', '--json']
    ]) {
      assert.deepEqual(await runInProcess(run, args, fixture.root), { status: 2, stdout: '', stderr: `${message}\n` });
    }
    assert.equal(treeHash(fixture.root), before);
  }
});

test('S3 status flags: --from and --json only; misuse exits 2 with usage', async () => {
  const fixture = track(npmViteFixture());
  for (const [args, message] of [
    [['status'], 'Missing <project>.'],
    [['status', 'apps/hub', '--dry-run'], 'Unknown argument for status: --dry-run'],
    [['status', 'apps/hub', '--local-repo', 'nexo'], 'Unknown argument for status: --local-repo'],
    [['status', 'apps/hub', '--json', '--json'], 'Duplicate argument: --json']
  ]) {
    assert.deepEqual(await runInProcess(run, args, fixture.root), {
      status: 2,
      stdout: '',
      stderr: `${message}\n${USAGE_LINE}\n`
    });
  }
  assert.deepEqual(await runInProcess(run, ['status', 'apps/hub', '--from', 'nowhere'], fixture.root), {
    status: 2,
    stdout: '',
    stderr: 'No release folder: nowhere not found.\n'
  });
});
