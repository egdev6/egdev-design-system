// `localRepo` default and `--local-repo` (#485, odd/tasks/egdev-ds-485-486.md S2): the name of the
// nearest ancestor folder that holds a `.git` entry (no git command run), shown in the plan; existing
// egdev-ds.json files keep their value.
import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { after, test } from 'node:test';
import { USAGE_LINE } from '../src/args.mjs';
import { run } from '../src/cli.mjs';
import { defaultLocalRepo } from '../src/doctor.mjs';
import {
  COMMIT,
  FULL_SET,
  fakeInstaller,
  freshNpmVite,
  json,
  MANIFESTS_B,
  npmViteFixture,
  OTHER_COMMIT,
  releaseFixture,
  runInProcess,
  treeHash,
  write
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
const release = (commit = COMMIT, options = {}) => {
  const directory = releaseFixture(FULL_SET, commit, options);
  scratch.push(directory);
  return directory;
};
const read = (path) => readFileSync(path, 'utf8');
const line = (verb, path, detail) => `  ${verb.padEnd(8)}${path}${detail ? `  ${detail}` : ''}`;
const config = (localRepo) =>
  json({ schemaVersion: 1, sourceDirectory: 'src', themeDirectory: 'src/theme/', localRepo, exclude: [] });

// A fresh npm + Vite app at `<repo>/apps/hub` whose package name (`hub`) differs from the repository
// folder. `git` is 'dir', 'file' (a worktree's `.git` file) or null; `folder` names the repository folder.
function monorepo({ git = 'dir', folder = 'nexo' } = {}) {
  const fixture = track(freshNpmVite());
  const parent = mkdtempSync(join(tmpdir(), 'egdev-ds-repo-'));
  scratch.push(parent);
  const root = join(parent, folder);
  renameSync(fixture.root, root);
  if (git === 'dir') {
    mkdirSync(join(root, '.git/objects'), { recursive: true });
  } else if (git === 'file') {
    write(join(root, '.git'), 'gitdir: /elsewhere/.git/worktrees/nexo\n');
  }
  return { root, project: join(root, 'apps/hub'), argument: 'apps/hub' };
}

async function init(fixture, args, runner) {
  return runInProcess(run, ['init', fixture.argument, ...args], fixture.root, runner ? { runner } : {});
}

const configLine = (stdout) => stdout.split('\n').find((text) => text.includes('egdev-ds.json'));

test('S2 init defaults localRepo to the repository folder, not the app package name', async () => {
  const fixture = monorepo();
  const from = release();
  const dry = await init(fixture, ['--from', from, '--dry-run']);
  assert.equal(dry.status, 0);
  assert.equal(configLine(dry.stdout), line('create', 'egdev-ds.json', 'localRepo=nexo'));
  const planned = JSON.parse((await init(fixture, ['--from', from, '--dry-run', '--json'])).stdout);
  assert.deepEqual(
    planned.actions.find((action) => action.path === 'egdev-ds.json'),
    { verb: 'create', path: 'egdev-ds.json', detail: 'localRepo=nexo' }
  );
  const { calls, runner } = fakeInstaller();
  assert.equal((await init(fixture, ['--from', from], runner)).status, 0);
  assert.equal(read(join(fixture.project, 'egdev-ds.json')), config('nexo'));
  assert.deepEqual(
    calls.map(([command]) => command),
    ['npm'],
    'only the package manager runs, never git'
  );
});

test('S2 a .git file (worktree) marks the repository root too', async () => {
  const fixture = monorepo({ git: 'file', folder: 'nexo-worktree' });
  const result = await init(fixture, ['--from', release(), '--dry-run']);
  assert.equal(configLine(result.stdout), line('create', 'egdev-ds.json', 'localRepo=nexo-worktree'));
});

test('S2 without a .git ancestor, or with an invalid folder name, localRepo falls back to the package name', async () => {
  const none = track(freshNpmVite());
  assert.equal(
    configLine((await init(none, ['--from', release(), '--dry-run'])).stdout),
    line('create', 'egdev-ds.json', 'localRepo=hub')
  );
  const spaced = monorepo({ folder: 'my repo' });
  assert.equal(
    configLine((await init(spaced, ['--from', release(), '--dry-run'])).stdout),
    line('create', 'egdev-ds.json', 'localRepo=hub')
  );
  assert.equal(defaultLocalRepo(spaced.project, { name: '@scope/web-app' }), 'web-app');
  assert.equal(defaultLocalRepo(spaced.project, { name: 'not valid!' }), 'app');
  assert.equal(defaultLocalRepo(monorepo().project, { name: 'hub' }), 'nexo');
});

test('S2 --local-repo overrides the default for a new egdev-ds.json', async () => {
  const fixture = monorepo();
  const from = release();
  const dry = await init(fixture, ['--from', from, '--local-repo', 'nexo-hub', '--dry-run']);
  assert.equal(configLine(dry.stdout), line('create', 'egdev-ds.json', 'localRepo=nexo-hub'));
  const { runner } = fakeInstaller();
  assert.equal((await init(fixture, ['--from', from, '--local-repo', 'nexo-hub'], runner)).status, 0);
  assert.equal(read(join(fixture.project, 'egdev-ds.json')), config('nexo-hub'));
});

test('S2 an invalid --local-repo is misuse: exit 2 with usage, nothing written', async () => {
  const fixture = monorepo();
  const from = release();
  for (const [args, message] of [
    [
      ['init', 'apps/hub', '--from', from, '--local-repo', 'a b'],
      'Invalid --local-repo: expected a repository name (letters, digits, ., _ or -).'
    ],
    [
      ['upgrade', 'apps/hub', '--from', from, '--local-repo', 'nexo/hub'],
      'Invalid --local-repo: expected a repository name (letters, digits, ., _ or -).'
    ],
    [['init', 'apps/hub', '--local-repo'], 'Missing value: --local-repo'],
    [['doctor', 'apps/hub', '--local-repo', 'nexo'], 'Unknown argument for doctor: --local-repo']
  ]) {
    const before = treeHash(fixture.root);
    assert.deepEqual(await runInProcess(run, args, fixture.root), {
      status: 2,
      stdout: '',
      stderr: `${message}\n${USAGE_LINE}\n`
    });
    assert.equal(treeHash(fixture.root), before);
  }
});

test('S2 an existing egdev-ds.json keeps its value; a different --local-repo prints a note, not an error', async () => {
  const fixture = monorepo();
  write(join(fixture.project, 'egdev-ds.json'), config('custom'));
  const from = release();
  const plain = await init(fixture, ['--from', from, '--dry-run']);
  assert.equal(plain.stderr, '');
  assert.equal(configLine(plain.stdout), line('keep', 'egdev-ds.json'));
  const noted = await init(fixture, ['--from', from, '--local-repo', 'nexo', '--dry-run']);
  assert.equal(noted.status, 0);
  assert.equal(configLine(noted.stdout), line('keep', 'egdev-ds.json'));
  assert.equal(
    noted.stderr,
    'Note: egdev-ds.json keeps localRepo "custom"; --local-repo nexo applies only when egdev-ds.json is created.\n'
  );
  const same = await init(fixture, ['--from', from, '--local-repo', 'custom', '--dry-run']);
  assert.equal(same.stderr, '', 'the same value needs no note');
  const { runner } = fakeInstaller();
  const applied = await init(fixture, ['--from', from, '--local-repo', 'nexo'], runner);
  assert.equal(applied.status, 0);
  assert.equal(read(join(fixture.project, 'egdev-ds.json')), config('custom'), 'the file is untouched');
});

test('S2 upgrade --add cli creates egdev-ds.json with the repository folder or --local-repo', async () => {
  const fixture = track(npmViteFixture());
  rmSync(join(fixture.project, 'egdev-ds.json'));
  mkdirSync(join(fixture.root, '.git'));
  const from = release(OTHER_COMMIT, { manifests: MANIFESTS_B });
  const upgrade = (args) => runInProcess(run, ['upgrade', 'apps/hub', '--from', from, ...args], fixture.root);
  const dry = await upgrade(['--add', 'cli', '--dry-run']);
  assert.equal(dry.status, 0);
  assert.equal(configLine(dry.stdout), line('create', 'egdev-ds.json', `localRepo=${basename(fixture.root)}`));
  const flagged = await upgrade(['--add', 'cli', '--local-repo', 'nexo', '--dry-run', '--json']);
  assert.deepEqual(
    JSON.parse(flagged.stdout).actions.find((action) => action.path === 'egdev-ds.json'),
    { verb: 'create', path: 'egdev-ds.json', detail: 'localRepo=nexo' }
  );
  const { runner } = fakeInstaller();
  const applied = await runInProcess(
    run,
    ['upgrade', 'apps/hub', '--from', from, '--add', 'cli', '--local-repo', 'nexo'],
    fixture.root,
    { runner }
  );
  assert.equal(applied.status, 0);
  assert.equal(read(join(fixture.project, 'egdev-ds.json')), config('nexo'));
});

test('S2 upgrade --local-repo notes when it cannot apply: existing file, or no egdev-ds.json created', async () => {
  const kept = track(npmViteFixture());
  const from = release(OTHER_COMMIT, { manifests: MANIFESTS_B });
  const before = treeHash(kept.root);
  const noted = await runInProcess(
    run,
    ['upgrade', 'apps/hub', '--from', from, '--add', 'cli', '--local-repo', 'other', '--dry-run'],
    kept.root
  );
  assert.equal(noted.status, 0);
  assert.equal(
    noted.stderr,
    'Note: egdev-ds.json keeps localRepo "nexo"; --local-repo other applies only when egdev-ds.json is created.\n'
  );
  assert.equal(treeHash(kept.root), before);
  const missing = track(npmViteFixture());
  rmSync(join(missing.project, 'egdev-ds.json'));
  const ignored = await runInProcess(
    run,
    ['upgrade', 'apps/hub', '--from', from, '--local-repo', 'nexo', '--dry-run'],
    missing.root
  );
  assert.equal(ignored.status, 0);
  assert.equal(
    ignored.stderr,
    'Note: --local-repo nexo has no effect: upgrade creates egdev-ds.json only with --add cli.\n'
  );
});

test('S2 doctor uses the same default when egdev-ds.json is missing (DS045 plus guard placeholders)', async () => {
  const fixture = track(npmViteFixture());
  rmSync(join(fixture.project, 'egdev-ds.json'));
  mkdirSync(join(fixture.root, '.git'));
  const repo = basename(fixture.root);
  writeFileSync(
    join(fixture.project, 'src/design-system-allowlist.ts'),
    `import type { GuardAllowlistEntry } from './design-system-guard';\n\nexport const designSystemAllowlist: GuardAllowlistEntry[] = [\n  { file: 'src/Raw.tsx', pattern: '<button type="button">', issue: '${repo}#TBD-raw-button', reason: 'Pending.' }\n];\n`
  );
  write(join(fixture.project, 'src/Raw.tsx'), 'export const Raw = () => <button type="button">Go</button>;\n');
  const result = await runInProcess(run, ['doctor', 'apps/hub'], fixture.root);
  assert.equal(result.status, 1);
  const findings = result.stdout.split('\n').filter((text) => /^DS04[0-5] /.test(text));
  assert.deepEqual(findings, [
    'DS043 warning src/design-system-allowlist.ts: 1 allowlist entry uses ' +
      `${repo}#TBD-* placeholders; replace it with a real issue.`,
    'DS045 error egdev-ds.json: File not found.'
  ]);
});
