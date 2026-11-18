// `upgrade --add <pkg>[,<pkg>]` (owner decision L11, spec §7.2): an explicit opt-in that adds release
// packages to an already-vendored app with the file effects `init` uses for them. Without `--add`,
// upgrade still adds nothing (upgrade.test.mjs).
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { USAGE_LINE } from '../src/args.mjs';
import { run } from '../src/cli.mjs';
import {
  CHANGELOGS_B,
  COMMIT,
  FULL_SET,
  fakeInstaller,
  freshNpmVite,
  json,
  MANIFESTS,
  MANIFESTS_B,
  npmViteFixture,
  OTHER_COMMIT,
  pnpmNextFixture,
  releaseFixture,
  runInProcess,
  sha256,
  treeContents,
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
const releaseA = (selected = FULL_SET) => {
  const directory = releaseFixture(selected, COMMIT);
  scratch.push(directory);
  return directory;
};
const releaseB = (selected = FULL_SET) => {
  const directory = releaseFixture(selected, OTHER_COMMIT, { manifests: MANIFESTS_B, changelogs: CHANGELOGS_B });
  scratch.push(directory);
  return directory;
};
const read = (path) => readFileSync(path, 'utf8');
const readJson = (path) => JSON.parse(read(path));
const editJson = (path, edit) => writeFileSync(path, json(edit(readJson(path))));

const A7 = COMMIT.slice(0, 7);
const B7 = OTHER_COMMIT.slice(0, 7);
const oldName = (pkg) => `egdev-${pkg}-${MANIFESTS[pkg].version}-${A7}.tgz`;
const newName = (pkg) => `egdev-${pkg}-${MANIFESTS_B[pkg].version}-${B7}.tgz`;
const line = (verb, path, detail) => `  ${verb.padEnd(8)}${path}${detail ? `  ${detail}` : ''}`;
const releaseSha = (from, pkg) => sha256(readFileSync(join(from, `egdev-${pkg}-${MANIFESTS_B[pkg].version}.tgz`)));
const copy = (from, dir, pkg) =>
  line('copy', `${dir}/${newName(pkg)}`, `sha256 ${releaseSha(from, pkg).slice(0, 12)}…`);

async function upgrade(fixture, args, runner) {
  return runInProcess(run, ['upgrade', fixture.argument, ...args], fixture.root, runner ? { runner } : {});
}

function changed(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((path) => before[path] !== after[path] && !path.includes('/node_modules'))
    .sort();
}

// Nexo-like npm + Vite app (bare vendor/, file:vendor/ style, no cli, no effects).
const NPM = ['tokens', 'ui', 'mcp', 'system'];

test('L11 AC2 --add is an upgrade flag: names come from the release set, duplicates and other commands are misuse', async () => {
  const cwd = track(npmViteFixture()).root;
  for (const [args, message] of [
    [['upgrade', 'apps/hub', '--add', 'cli,nope'], 'Invalid --add: choose from tokens,ui,effects,system,mcp,cli.'],
    [['upgrade', 'apps/hub', '--add', 'cli,cli'], 'Invalid --add: choose from tokens,ui,effects,system,mcp,cli.'],
    [['upgrade', 'apps/hub', '--add'], 'Missing value: --add'],
    [['upgrade', 'apps/hub', '--add', 'cli', '--add', 'effects'], 'Duplicate argument: --add'],
    [['init', 'apps/hub', '--add', 'cli'], 'Unknown argument for init: --add'],
    [['doctor', 'apps/hub', '--add', 'cli'], 'Unknown argument for doctor: --add']
  ]) {
    const before = treeHash(cwd);
    assert.deepEqual(await runInProcess(run, args, cwd), {
      status: 2,
      stdout: '',
      stderr: `${message}\n${USAGE_LINE}\n`
    });
    assert.equal(treeHash(cwd), before);
  }
});

test('L11 AC3 upgrade --add cli --dry-run plans the cli tarball, its devDependency and egdev-ds.json; writes nothing', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const before = [treeHash(fixture.root), treeHash(from)];
  const { calls, runner } = fakeInstaller();
  assert.deepEqual(await upgrade(fixture, ['--from', from, '--add', 'cli', '--dry-run'], runner), {
    status: 0,
    stdout: [
      `egdev-ds upgrade apps/hub (npm, vite, native) from ${from} at ${B7}`,
      ...NPM.map((pkg) => copy(from, 'vendor', pkg)),
      copy(from, 'vendor', 'cli'),
      line('edit', 'package.json', `dependencies.@egdev/tokens = file:vendor/${newName('tokens')}`),
      line('edit', 'package.json', `dependencies.@egdev/ui = file:vendor/${newName('ui')}`),
      line('edit', 'package.json', `devDependencies.@egdev/mcp = file:vendor/${newName('mcp')}`),
      line('edit', 'package.json', `devDependencies.@egdev/system = file:vendor/${newName('system')}`),
      line('edit', 'package.json', `devDependencies.@egdev/cli = file:vendor/${newName('cli')}`),
      line('keep', 'package.json', 'scripts.ds:doctor = egdev-ds doctor .'),
      line('keep', 'package.json', 'overrides.@egdev/system = $@egdev/system'),
      ...['tokens', 'ui', 'system', 'mcp'].map((pkg) =>
        line('edit', 'package-lock.json', `node_modules/@egdev/${pkg} = file:vendor/${newName(pkg)}`)
      ),
      line('keep', 'egdev-ds.json'),
      line('remove', 'node_modules/@egdev'),
      line('run', 'npm install'),
      ...NPM.map((pkg) => line('remove', `vendor/${oldName(pkg)}`)),
      `Changelog (${A7} → ${B7}):`,
      '  @egdev/tokens 0.5.0 → 0.6.0',
      '    ## 0.6.0',
      '',
      '    - Adds the surface-raised token.',
      '',
      '    ## 0.5.1',
      '',
      '    - Fixes the focus ring contrast.',
      '  @egdev/ui 0.3.1 → 0.4.0',
      '    ## 0.4.0',
      '',
      '    - Adds Tabs orientation.',
      '    - Needs @egdev/tokens 0.6.0.',
      '  @egdev/system 0.4.1 unchanged version',
      '  @egdev/mcp 0.4.1 → 0.4.2',
      '    ## 0.4.2',
      '',
      '    - Adds the doctor tool.',
      'Dry run: nothing written.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.deepEqual([treeHash(fixture.root), treeHash(from)], before, 'dry run writes nothing, node_modules included');
  assert.deepEqual(calls, []);
});

test('L11 AC16 npm upgrade --add cli vendors the CLI as a devDependency, doctor passes, and a second run is a no-op', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const { project } = fixture;
  const original = readJson(join(project, 'package.json'));
  const before = treeContents(project);
  const { calls, runner } = fakeInstaller();
  const result = await upgrade(fixture, ['--from', from, '--add', 'cli'], runner);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(`Upgraded to ${B7}; 5 vendored integrities verified.\n`));
  assert.deepEqual(calls, [['npm', ['install'], project]], 'only the detected package manager, never git');
  const spec = (pkg) => `file:vendor/${newName(pkg)}`;
  assert.equal(
    read(join(project, 'package.json')),
    json({
      ...original,
      dependencies: { ...original.dependencies, '@egdev/tokens': spec('tokens'), '@egdev/ui': spec('ui') },
      devDependencies: {
        ...original.devDependencies,
        '@egdev/mcp': spec('mcp'),
        '@egdev/system': spec('system'),
        '@egdev/cli': spec('cli')
      }
    })
  );
  assert.deepEqual(readdirSync(join(project, 'vendor')).sort(), [...NPM, 'cli'].map(newName).sort());
  assert.equal(sha256(readFileSync(join(project, 'vendor', newName('cli')))), releaseSha(from, 'cli'));
  assert.deepEqual(
    changed(before, treeContents(project)),
    [
      './package-lock.json',
      './package.json',
      `./vendor/${newName('cli')}`,
      ...NPM.flatMap((pkg) => [`./vendor/${newName(pkg)}`, `./vendor/${oldName(pkg)}`])
    ].sort(),
    'no effects, no CSS and no MCP edit for cli alone'
  );
  assert.deepEqual(await runInProcess(run, ['doctor', 'apps/hub', '--from', from], fixture.root), {
    status: 0,
    stdout: 'egdev-ds doctor apps/hub (npm, vite, native)\n0 errors, 0 warnings, 0 skipped.\n',
    stderr: ''
  });

  const settled = treeHash(fixture.root);
  const again = fakeInstaller();
  for (const args of [['--add', 'cli'], []]) {
    assert.deepEqual(await upgrade(fixture, ['--from', from, ...args], again.runner), {
      status: 0,
      stdout: [
        `egdev-ds upgrade apps/hub (npm, vite, native) from ${from} at ${B7}`,
        `Already at ${B7}; 5 vendored integrities verified; no changes.`,
        ''
      ].join('\n'),
      stderr: ''
    });
  }
  assert.equal(treeHash(fixture.root), settled, 'idempotent: an already-declared --add package adds nothing');
  assert.deepEqual(again.calls, []);
});

test('L11 npm upgrade --add effects adds the dependency, the exact three peer, the $ui override and the CSS import', async () => {
  const fixture = track(freshNpmVite());
  const { project } = fixture;
  const init = await runInProcess(run, ['init', 'apps/hub', '--from', releaseA()], fixture.root, {
    runner: fakeInstaller().runner
  });
  assert.equal(init.status, 0, init.stderr);
  const original = readJson(join(project, 'package.json'));
  const css = read(join(project, 'src/index.css'));
  const from = releaseB();
  const result = await upgrade(fixture, ['--from', from, '--add', 'effects'], fakeInstaller().runner);
  assert.equal(result.status, 0, result.stderr);
  const spec = (pkg) => `file:./vendor/egdev/${newName(pkg)}`;
  const lines = result.stdout.split('\n');
  for (const expected of [
    copy(from, 'vendor/egdev', 'effects'),
    line('edit', 'package.json', `dependencies.@egdev/effects = ${spec('effects')}`),
    line('edit', 'package.json', 'dependencies.three = 0.160.0'),
    line('edit', 'package.json', 'overrides.@egdev/ui = $@egdev/ui'),
    line('edit', 'src/index.css', '+@import "@egdev/effects/styles.css"')
  ]) {
    assert.ok(lines.includes(expected), `missing plan line: ${expected}`);
  }
  assert.ok(!result.stdout.includes('@egdev/effects 0.2.2'), 'an added package has no changelog diff');
  const manifest = readJson(join(project, 'package.json'));
  assert.deepEqual(Object.keys(manifest.dependencies), [
    ...Object.keys(original.dependencies),
    '@egdev/effects',
    'three'
  ]);
  assert.equal(manifest.dependencies['@egdev/effects'], spec('effects'));
  assert.equal(manifest.dependencies.three, '0.160.0');
  assert.deepEqual(manifest.overrides, { '@egdev/system': '$@egdev/system', '@egdev/ui': '$@egdev/ui' });
  assert.equal(
    read(join(project, 'src/index.css')),
    css.replace(
      '@import "@egdev/ui/styles.css";\n',
      '@import "@egdev/ui/styles.css";\n@import "@egdev/effects/styles.css";\n'
    )
  );
  // The fake installer installs only @egdev packages; the real install also brings three.
  write(join(project, 'node_modules/three/package.json'), json({ name: 'three', version: '0.160.0' }));
  assert.deepEqual(await runInProcess(run, ['doctor', 'apps/hub', '--from', from], fixture.root), {
    status: 0,
    stdout: 'egdev-ds doctor apps/hub (npm, vite, native)\n0 errors, 0 warnings, 0 skipped.\n',
    stderr: ''
  });
});

test('L11 when the entry module imports the DS CSS, --add effects leaves code alone and names the import to add', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const main = read(join(fixture.project, 'src/main.tsx'));
  const result = await upgrade(fixture, ['--from', from, '--add', 'effects', '--no-install'], fakeInstaller().runner);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(result.stdout.split('\n').slice(-9), [
    `Upgraded to ${B7}; integrities unverified (--no-install).`,
    'Next steps:',
    '  Run npm install.',
    '  Restart the dev server with --force.',
    '  Regenerate design/system.md with egdev-system-md --write.',
    '  Add npm run ds:doctor to CI.',
    '  Import @egdev/effects/styles.css in src/main.tsx.',
    'Review the diff before committing.',
    ''
  ]);
  assert.equal(read(join(fixture.project, 'src/main.tsx')), main);
  assert.equal(read(join(fixture.project, 'src/theme/family.css')), '.eg-button { font-family: inherit; }\n');
});

test('L11 pnpm upgrade --add cli pins the CLI in pnpm-workspace.yaml as text and doctor passes', async () => {
  const fixture = track(pnpmNextFixture());
  const from = releaseB();
  const { project } = fixture;
  const workspace = read(join(project, 'pnpm-workspace.yaml'));
  const result = await upgrade(fixture, ['--from', from, '--add', 'cli'], fakeInstaller().runner);
  assert.equal(result.status, 0, result.stderr);
  const spec = (pkg) => `file:./vendor/egdev/${newName(pkg)}`;
  assert.equal(readJson(join(project, 'package.json')).devDependencies['@egdev/cli'], spec('cli'));
  let expected = workspace;
  for (const pkg of ['effects', 'tokens', 'ui', 'system', 'mcp']) {
    expected = expected.replace(`vendor/egdev/${oldName(pkg)}`, `vendor/egdev/${newName(pkg)}`);
  }
  expected = expected.replace(
    `  '@egdev/mcp': '${spec('mcp')}'\n`,
    `  '@egdev/mcp': '${spec('mcp')}'\n  '@egdev/cli': '${spec('cli')}'\n`
  );
  assert.equal(read(join(project, 'pnpm-workspace.yaml')), expected, 'comments and layout survive');
  assert.deepEqual(await runInProcess(run, ['doctor', '.', '--from', from], project), {
    status: 0,
    stdout: 'egdev-ds doctor . (pnpm, next, tailwind)\n0 errors, 0 warnings, 0 skipped.\n',
    stderr: ''
  });
});

test('L11 --add refusals: a release without the package, owned-key conflicts, a missing internal dependency', async () => {
  const lacking = track(npmViteFixture());
  const withoutCli = releaseB(['tokens', 'ui', 'effects', 'system', 'mcp']);
  let before = treeHash(lacking.root);
  assert.deepEqual(await upgrade(lacking, ['--from', withoutCli, '--add', 'cli'], fakeInstaller().runner), {
    status: 1,
    stdout: '',
    stderr: `Release lacks @egdev/cli: ${withoutCli}/release.json does not list it.\n`
  });
  assert.equal(treeHash(lacking.root), before);

  const conflicting = track(npmViteFixture());
  editJson(join(conflicting.project, 'package.json'), (m) => ({
    ...m,
    scripts: { 'ds:doctor': 'vitest run ds' },
    dependencies: { ...m.dependencies, three: '0.161.0' }
  }));
  before = treeHash(conflicting.root);
  assert.deepEqual(
    await upgrade(conflicting, ['--from', releaseB(), '--add', 'cli,effects', '--dry-run'], fakeInstaller().runner),
    {
      status: 2,
      stdout: '',
      stderr: [
        'Conflict: package.json dependencies.three is "0.161.0"; egdev-ds sets "0.160.0".',
        'Conflict: package.json scripts.ds:doctor is "vitest run ds"; egdev-ds sets "egdev-ds doctor .".',
        '2 conflicts: nothing written; upgrade has no --force: edit these values by hand, then upgrade again.',
        ''
      ].join('\n')
    }
  );
  assert.equal(treeHash(conflicting.root), before);

  const partial = track(npmViteFixture());
  editJson(join(partial.project, 'package.json'), (m) => {
    const { '@egdev/ui': _ui, ...dependencies } = m.dependencies;
    return { ...m, dependencies };
  });
  before = treeHash(partial.root);
  assert.deepEqual(await upgrade(partial, ['--from', releaseB(), '--add', 'effects'], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr:
      '@egdev/effects 0.2.2 needs @egdev/ui, which apps/hub does not declare; upgrade adds no packages: pass --add ui.\n'
  });
  assert.equal(treeHash(partial.root), before);
});

test('L11 AC12 an install failure after --add rolls back every byte, the added tarball included', async () => {
  const fixture = track(npmViteFixture());
  const before = treeContents(fixture.project);
  const result = await upgrade(fixture, ['--from', releaseB(), '--add', 'cli'], fakeInstaller({ fail: true }).runner);
  assert.equal(result.status, 1);
  assert.equal(result.stderr, 'npm ERR! install failed\nnpm install failed (exit 1); rolled back.\n');
  assert.deepEqual(changed(before, treeContents(fixture.project)), []);
});
