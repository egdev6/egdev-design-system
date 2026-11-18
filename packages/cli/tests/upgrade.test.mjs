import assert from 'node:assert/strict';
import { chmodSync, readdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
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
  sri,
  treeContents,
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
const releaseA = (selected = FULL_SET) => {
  const directory = releaseFixture(selected, COMMIT);
  scratch.push(directory);
  return directory;
};
const releaseB = (selected = FULL_SET, manifests = MANIFESTS_B) => {
  const directory = releaseFixture(selected, OTHER_COMMIT, { manifests, changelogs: CHANGELOGS_B });
  scratch.push(directory);
  return directory;
};
const read = (path) => readFileSync(path, 'utf8');
const readJson = (path) => JSON.parse(read(path));
const editJson = (path, edit) => writeFileSync(path, json(edit(readJson(path))));

const A7 = COMMIT.slice(0, 7);
const B7 = OTHER_COMMIT.slice(0, 7);
const name = (pkg, manifests, commit) => `egdev-${pkg}-${manifests[pkg].version}-${commit}.tgz`;
const oldName = (pkg) => name(pkg, MANIFESTS, A7);
const newName = (pkg) => name(pkg, MANIFESTS_B, B7);
const line = (verb, path, detail) => `  ${verb.padEnd(8)}${path}${detail ? `  ${detail}` : ''}`;
const releaseSha = (from, pkg) => sha256(readFileSync(join(from, `egdev-${pkg}-${MANIFESTS_B[pkg].version}.tgz`)));
const copy = (from, dir, pkg) =>
  line('copy', `${dir}/${newName(pkg)}`, `sha256 ${releaseSha(from, pkg).slice(0, 12)}…`);
const nextSteps = (doctorScript) => [
  'Next steps:',
  '  Restart the dev server with --force.',
  '  Regenerate design/system.md with egdev-system-md --write.',
  `  Add ${doctorScript} to CI.`,
  'Review the diff before committing.'
];

// The changelog diff for release A → B: only the sections after the installed version.
const CHANGELOG = {
  tokens: [
    '  @egdev/tokens 0.5.0 → 0.6.0',
    '    ## 0.6.0',
    '',
    '    - Adds the surface-raised token.',
    '',
    '    ## 0.5.1',
    '',
    '    - Fixes the focus ring contrast.'
  ],
  ui: [
    '  @egdev/ui 0.3.1 → 0.4.0',
    '    ## 0.4.0',
    '',
    '    - Adds Tabs orientation.',
    '    - Needs @egdev/tokens 0.6.0.'
  ],
  effects: ['  @egdev/effects 0.2.1 → 0.2.2', '    ## 0.2.2', '', '    - Follows @egdev/ui 0.4.0.'],
  system: ['  @egdev/system 0.4.1 unchanged version'],
  mcp: ['  @egdev/mcp 0.4.1 → 0.4.2', '    ## 0.4.2', '', '    - Adds the doctor tool.']
};
const changelog = (packages) => [`Changelog (${A7} → ${B7}):`, ...packages.flatMap((pkg) => CHANGELOG[pkg])];

async function upgrade(fixture, args, runner) {
  return runInProcess(run, ['upgrade', fixture.argument, ...args], fixture.root, runner ? { runner } : {});
}

// The paths outside node_modules that differ between two treeContents snapshots.
function changed(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((path) => before[path] !== after[path] && !path.includes('/node_modules'))
    .sort();
}

// npm + Vite (Nexo-like): bare vendor/, file:vendor/ specifiers, the $ override, no effects.
const NPM = ['tokens', 'ui', 'mcp', 'system'];
const npmPlan = (from, { install = true } = {}) => [
  `egdev-ds upgrade apps/hub (npm, vite, native) from ${from} at ${B7}`,
  ...NPM.map((pkg) => copy(from, 'vendor', pkg)),
  line('edit', 'package.json', `dependencies.@egdev/tokens = file:vendor/${newName('tokens')}`),
  line('edit', 'package.json', `dependencies.@egdev/ui = file:vendor/${newName('ui')}`),
  line('edit', 'package.json', `devDependencies.@egdev/mcp = file:vendor/${newName('mcp')}`),
  line('edit', 'package.json', `devDependencies.@egdev/system = file:vendor/${newName('system')}`),
  line('keep', 'package.json', 'overrides.@egdev/system = $@egdev/system'),
  ...['tokens', 'ui', 'system', 'mcp'].map((pkg) =>
    line('edit', 'package-lock.json', `node_modules/@egdev/${pkg} = file:vendor/${newName(pkg)}`)
  ),
  ...(install ? [line('remove', 'node_modules/@egdev'), line('run', 'npm install')] : []),
  ...NPM.map((pkg) => line('remove', `vendor/${oldName(pkg)}`)),
  ...changelog(['tokens', 'ui', 'system', 'mcp'])
];

test('AC3 AC8 upgrade --dry-run prints the plan with the changelog diff and writes nothing anywhere', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const before = [treeHash(fixture.root), treeHash(from)];
  const { calls, runner } = fakeInstaller();
  assert.deepEqual(await upgrade(fixture, ['--from', from, '--dry-run'], runner), {
    status: 0,
    stdout: [...npmPlan(from), 'Dry run: nothing written.', ''].join('\n'),
    stderr: ''
  });
  assert.deepEqual([treeHash(fixture.root), treeHash(from)], before, 'dry run writes nothing, node_modules included');
  assert.deepEqual(calls, [], 'dry run spawns nothing');
});

test('AC8 AC10 AC16 npm+Vite upgrade A → B replaces the set as one unit, never adds effects or cli; doctor passes', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const { project } = fixture;
  const original = readJson(join(project, 'package.json'));
  const before = treeContents(project);
  const { calls, runner } = fakeInstaller();
  assert.deepEqual(await upgrade(fixture, ['--from', from], runner), {
    status: 0,
    stdout: [
      ...npmPlan(from),
      `Upgraded to ${B7}; 4 vendored integrities verified.`,
      ...nextSteps('npm run ds:doctor'),
      ''
    ].join('\n'),
    stderr: 'added 4 packages\n'
  });
  assert.deepEqual(calls, [['npm', ['install'], project]], 'only the detected package manager, never git');
  const spec = (pkg) => `file:vendor/${newName(pkg)}`;
  assert.equal(
    read(join(project, 'package.json')),
    json({
      ...original,
      dependencies: { ...original.dependencies, '@egdev/tokens': spec('tokens'), '@egdev/ui': spec('ui') },
      devDependencies: { ...original.devDependencies, '@egdev/mcp': spec('mcp'), '@egdev/system': spec('system') }
    })
  );
  assert.deepEqual(readdirSync(join(project, 'vendor')).sort(), NPM.map(newName).sort(), 'old tarballs removed');
  for (const pkg of NPM) {
    assert.equal(sha256(readFileSync(join(project, 'vendor', newName(pkg)))), releaseSha(from, pkg), `${pkg} sha256`);
  }
  assert.deepEqual(
    changed(before, treeContents(project)),
    [
      './package-lock.json',
      './package.json',
      ...NPM.flatMap((pkg) => [`./vendor/${newName(pkg)}`, `./vendor/${oldName(pkg)}`])
    ].sort()
  );
  const manifest = readJson(join(project, 'package.json'));
  for (const absent of ['@egdev/effects', '@egdev/cli']) {
    assert.ok(!(absent in manifest.dependencies) && !(absent in manifest.devDependencies), `${absent} not added`);
  }
  assert.deepEqual(await runInProcess(run, ['doctor', 'apps/hub', '--from', from], fixture.root), {
    status: 0,
    stdout:
      'egdev-ds doctor apps/hub (npm, vite, native)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n',
    stderr: ''
  });
});

test('AC9 a second upgrade (or one at the same commit) verifies only: Already at, exit 0, no writes, no spawn', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  assert.equal((await upgrade(fixture, ['--from', from], fakeInstaller().runner)).status, 0);
  const before = treeHash(fixture.root);
  const { calls, runner } = fakeInstaller();
  const expected = {
    status: 0,
    stdout: [
      `egdev-ds upgrade apps/hub (npm, vite, native) from ${from} at ${B7}`,
      `Already at ${B7}; 4 vendored integrities verified; no changes.`,
      ''
    ].join('\n'),
    stderr: ''
  };
  assert.deepEqual(await upgrade(fixture, ['--from', from], runner), expected);
  assert.deepEqual(await upgrade(fixture, ['--from', from, '--dry-run'], runner), expected);
  const document = JSON.parse((await upgrade(fixture, ['--from', from, '--json'], runner)).stdout);
  assert.equal(document.command, 'upgrade');
  assert.equal(document.result, 'current');
  assert.deepEqual(document.actions, []);
  assert.equal(treeHash(fixture.root), before);
  assert.deepEqual(calls, []);

  const same = track(npmViteFixture());
  const at = releaseA();
  const sameBefore = treeHash(same.root);
  assert.deepEqual(
    (await upgrade(same, ['--from', at], runner)).stdout.split('\n')[1],
    `Already at ${A7}; 4 vendored integrities verified; no changes.`
  );
  assert.equal(treeHash(same.root), sameBefore);
});

test('AC8 AC10 pnpm+Next.js upgrade A → B rewrites package.json and pnpm-workspace.yaml in place; doctor passes', async () => {
  const fixture = track(pnpmNextFixture());
  const from = releaseB();
  const { project } = fixture;
  const original = readJson(join(project, 'package.json'));
  const workspace = read(join(project, 'pnpm-workspace.yaml'));
  const before = treeContents(project);
  const { calls, runner } = fakeInstaller();
  const order = ['effects', 'tokens', 'ui', 'mcp', 'system'];
  const spec = (pkg) => `file:./vendor/egdev/${newName(pkg)}`;
  const result = await upgrade(fixture, ['--from', from], runner);
  assert.deepEqual(result, {
    status: 0,
    stdout: [
      `egdev-ds upgrade . (pnpm, next, tailwind) from ${from} at ${B7}`,
      ...order.map((pkg) => copy(from, 'vendor/egdev', pkg)),
      line('edit', 'package.json', `dependencies.@egdev/effects = ${spec('effects')}`),
      line('edit', 'package.json', `dependencies.@egdev/tokens = ${spec('tokens')}`),
      line('edit', 'package.json', `dependencies.@egdev/ui = ${spec('ui')}`),
      line('edit', 'package.json', `devDependencies.@egdev/mcp = ${spec('mcp')}`),
      line('edit', 'package.json', `devDependencies.@egdev/system = ${spec('system')}`),
      ...['effects', 'tokens', 'ui', 'system', 'mcp'].map((pkg) =>
        line('edit', 'pnpm-workspace.yaml', `overrides.@egdev/${pkg} = ${spec(pkg)}`)
      ),
      line('remove', 'node_modules/@egdev'),
      line('run', 'pnpm install --no-frozen-lockfile'),
      ...order.map((pkg) => line('remove', `vendor/egdev/${oldName(pkg)}`)),
      ...changelog(['tokens', 'ui', 'effects', 'system', 'mcp']),
      `Upgraded to ${B7}; 5 vendored integrities verified.`,
      ...nextSteps('pnpm ds:doctor'),
      ''
    ].join('\n'),
    stderr: 'added 5 packages\n'
  });
  assert.deepEqual(calls, [['pnpm', ['install', '--no-frozen-lockfile'], project]]);
  assert.equal(
    read(join(project, 'package.json')),
    json({
      ...original,
      dependencies: {
        ...original.dependencies,
        '@egdev/effects': spec('effects'),
        '@egdev/tokens': spec('tokens'),
        '@egdev/ui': spec('ui')
      },
      devDependencies: { ...original.devDependencies, '@egdev/mcp': spec('mcp'), '@egdev/system': spec('system') }
    })
  );
  let expectedWorkspace = workspace;
  for (const pkg of order) {
    expectedWorkspace = expectedWorkspace.replace(`vendor/egdev/${oldName(pkg)}`, `vendor/egdev/${newName(pkg)}`);
  }
  assert.equal(read(join(project, 'pnpm-workspace.yaml')), expectedWorkspace, 'comments and layout survive');
  assert.deepEqual(readdirSync(join(project, 'vendor/egdev')).sort(), order.map(newName).sort());
  assert.deepEqual(
    changed(before, treeContents(project)),
    [
      './package.json',
      './pnpm-lock.yaml',
      './pnpm-workspace.yaml',
      ...order.flatMap((pkg) => [`./vendor/egdev/${newName(pkg)}`, `./vendor/egdev/${oldName(pkg)}`])
    ].sort()
  );
  assert.deepEqual(await runInProcess(run, ['doctor', '.', '--from', from], project), {
    status: 0,
    stdout:
      'egdev-ds doctor . (pnpm, next, tailwind)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n',
    stderr: ''
  });
});

test('AC10 npm --no-install rewrites the lock entries with fresh sha512 and metadata before any install', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const { calls, runner } = fakeInstaller();
  const result = await upgrade(fixture, ['--from', from, '--no-install'], runner);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(calls, []);
  assert.deepEqual(result.stdout.split('\n').slice(-8), [
    `Upgraded to ${B7}; integrities unverified (--no-install).`,
    'Next steps:',
    '  Run npm install.',
    '  Restart the dev server with --force.',
    '  Regenerate design/system.md with egdev-system-md --write.',
    '  Add npm run ds:doctor to CI.',
    'Review the diff before committing.',
    ''
  ]);
  const lock = readJson(join(fixture.project, 'package-lock.json'));
  const bytes = (pkg) => readFileSync(join(fixture.project, 'vendor', newName(pkg)));
  assert.deepEqual(lock.packages['node_modules/@egdev/mcp'], {
    version: '0.4.2',
    resolved: `file:vendor/${newName('mcp')}`,
    integrity: sri(bytes('mcp')),
    dependencies: { '@egdev/system': '0.4.1' }
  });
  assert.deepEqual(lock.packages['node_modules/@egdev/ui'], {
    version: '0.4.0',
    resolved: `file:vendor/${newName('ui')}`,
    integrity: sri(bytes('ui')),
    peerDependencies: MANIFESTS_B.ui.peerDependencies
  });
  assert.equal(lock.packages[''].dependencies['@egdev/tokens'], `file:vendor/${newName('tokens')}`);
  assert.equal(lock.packages[''].devDependencies['@egdev/system'], `file:vendor/${newName('system')}`);
});

test('AC12 install failure and integrity mismatch roll back every byte, keep the old tarballs and exit 1', async () => {
  for (const [options, stderr] of [
    [{ fail: true }, 'npm ERR! install failed\nnpm install failed (exit 1); rolled back.\n'],
    [
      { corrupt: true },
      `added 4 packages\nIntegrity check failed: ${NPM.map(
        (pkg) => `Integrity mismatch: @egdev/${pkg} (file:vendor/${newName(pkg)}).`
      )
        .join(' ')
        .slice(0, -1)}; rolled back.\n`
    ]
  ]) {
    const fixture = track(npmViteFixture());
    const from = releaseB();
    const before = treeContents(fixture.project);
    const result = await upgrade(fixture, ['--from', from], fakeInstaller(options).runner);
    assert.equal(result.status, 1);
    assert.equal(result.stderr, stderr);
    assert.ok(!result.stdout.includes('Upgraded'));
    assert.deepEqual(changed(before, treeContents(fixture.project)), [], 'package.json, lockfile, tarballs restored');
  }
});

test('AC13 an old-tarball removal failure exits 1 with "new installation is intact" and is never rolled back', {
  skip: process.getuid?.() === 0
}, async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const vendor = join(fixture.project, 'vendor');
  const { runner: install } = fakeInstaller();
  const runner = (command, args, cwd) => {
    const result = install(command, args, cwd);
    chmodSync(vendor, 0o555);
    return result;
  };
  try {
    const result = await upgrade(fixture, ['--from', from], runner);
    assert.equal(result.status, 1);
    assert.ok(result.stdout.includes(`Upgraded to ${B7}; 4 vendored integrities verified.\n`));
    assert.equal(
      result.stderr,
      [
        'added 4 packages',
        ...NPM.map((pkg) => `Cannot remove vendor/${oldName(pkg)} (EACCES); new installation is intact.`),
        ''
      ].join('\n')
    );
  } finally {
    chmodSync(vendor, 0o755);
  }
  assert.equal(
    readJson(join(fixture.project, 'package.json')).dependencies['@egdev/ui'],
    `file:vendor/${newName('ui')}`
  );
});

test('AC11 a legacy unsuffixed name migrates to <version>-<commit> in the same folder and style', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const { project } = fixture;
  renameSync(join(project, 'vendor', oldName('ui')), join(project, 'vendor/egdev-ui-0.3.1.tgz'));
  editJson(join(project, 'package.json'), (m) => ({
    ...m,
    dependencies: { ...m.dependencies, '@egdev/ui': 'file:./vendor/egdev-ui-0.3.1.tgz' }
  }));
  const result = await upgrade(fixture, ['--from', from], fakeInstaller().runner);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(`Changelog (${A7}, unversioned → ${B7}):\n`));
  assert.ok(result.stdout.includes(`${line('remove', 'vendor/egdev-ui-0.3.1.tgz')}\n`));
  assert.equal(readJson(join(project, 'package.json')).dependencies['@egdev/ui'], `file:./vendor/${newName('ui')}`);
  assert.deepEqual(readdirSync(join(project, 'vendor')).sort(), NPM.map(newName).sort());
});

test('Q2 a dirty release is refused unless --allow-dirty', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  editJson(join(from, 'release.json'), (m) => ({ ...m, dirty: true }));
  const before = treeHash(fixture.root);
  assert.deepEqual(await upgrade(fixture, ['--from', from, '--dry-run'], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: `Release ${from} was packed from a dirty tree (${B7}); pass --allow-dirty to use it.\n`
  });
  const allowed = await upgrade(fixture, ['--from', from, '--dry-run', '--allow-dirty'], fakeInstaller().runner);
  assert.equal(allowed.status, 0, allowed.stderr);
  assert.equal(treeHash(fixture.root), before);
});

test('§7.4 a release that lacks a package the app depends on exits 1 naming release.json; nothing written', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB(['tokens', 'effects', 'system', 'mcp', 'cli']);
  const before = treeHash(fixture.root);
  assert.deepEqual(await upgrade(fixture, ['--from', from], fakeInstaller().runner), {
    status: 1,
    stdout: '',
    stderr: `Release lacks @egdev/ui: ${from}/release.json does not list it.\n`
  });
  assert.equal(treeHash(fixture.root), before);
  // A release without @egdev/cli (packed before it joined the set) still upgrades an app without cli.
  const withoutCli = await upgrade(fixture, ['--from', releaseB(['tokens', 'ui', 'system', 'mcp']), '--dry-run']);
  assert.equal(withoutCli.status, 0, withoutCli.stderr);
});

test('AC14 workspace: specifiers, mismatched internal peers and unsatisfied external peers are refused without writes', async () => {
  const cases = [
    [
      { ...MANIFESTS_B, ui: { ...MANIFESTS_B.ui, peerDependencies: { '@egdev/tokens': 'workspace:*' } } },
      1,
      (from) => `Release mismatch: ${from}/egdev-ui-0.4.0.tgz declares @egdev/tokens as workspace:*.\n`
    ],
    [
      { ...MANIFESTS_B, ui: { ...MANIFESTS_B.ui, peerDependencies: { '@egdev/tokens': '0.5.9' } } },
      1,
      (from) => `Release mismatch: @egdev/ui 0.4.0 needs @egdev/tokens 0.5.9; ${from}/release.json has 0.6.0.\n`
    ],
    [
      { ...MANIFESTS_B, ui: { ...MANIFESTS_B.ui, peerDependencies: { react: '^20.0.0' } } },
      2,
      () => '@egdev/ui 0.4.0 needs react ^20.0.0; apps/hub has 19.3.0 installed: update it, then upgrade.\n'
    ],
    [
      { ...MANIFESTS_B, mcp: { ...MANIFESTS_B.mcp, dependencies: { '@egdev/effects': '0.2.2' } } },
      2,
      () =>
        '@egdev/mcp 0.4.2 needs @egdev/effects, which apps/hub does not declare; upgrade adds no packages: pass --add effects.\n'
    ]
  ];
  for (const [manifests, status, stderr] of cases) {
    const fixture = track(npmViteFixture());
    const from = releaseB(FULL_SET, manifests);
    const before = treeHash(fixture.root);
    assert.deepEqual(await upgrade(fixture, ['--from', from], fakeInstaller().runner), {
      status,
      stdout: '',
      stderr: stderr(from)
    });
    assert.equal(treeHash(fixture.root), before);
  }
});

test('§7.1 nothing vendored, foreign and unsafe specifiers are refused with exit 2', async () => {
  const fresh = track(freshNpmVite());
  assert.deepEqual(await upgrade(fresh, ['--from', releaseB()]), {
    status: 2,
    stdout: '',
    stderr: 'apps/hub has no vendored @egdev packages; run egdev-ds init.\n'
  });
  for (const [ui, stderr] of [
    [
      'workspace:*',
      'apps/hub declares @egdev/ui as workspace:* (package.json dependencies); upgrade replaces only vendored tarballs.\n'
    ],
    [
      '^0.3.0',
      'apps/hub declares @egdev/ui as ^0.3.0 (package.json dependencies); upgrade replaces only vendored tarballs.\n'
    ],
    ['file:vendor/../ui.tgz', 'Unsafe vendored path: @egdev/ui (file:vendor/../ui.tgz).\n']
  ]) {
    const fixture = track(npmViteFixture());
    editJson(join(fixture.project, 'package.json'), (m) => ({
      ...m,
      dependencies: { ...m.dependencies, '@egdev/ui': ui }
    }));
    const before = treeHash(fixture.root);
    assert.deepEqual(await upgrade(fixture, ['--from', releaseB()]), { status: 2, stdout: '', stderr });
    assert.equal(treeHash(fixture.root), before);
  }
});

test('--json prints exactly one document with the actions and the changelog', async () => {
  const fixture = track(npmViteFixture());
  const from = releaseB();
  const planned = await upgrade(fixture, ['--from', from, '--dry-run', '--json'], fakeInstaller().runner);
  assert.equal(planned.status, 0);
  const document = JSON.parse(planned.stdout);
  assert.equal(document.command, 'upgrade');
  assert.equal(document.result, 'planned');
  assert.deepEqual(document.release, { dir: from, commit: OTHER_COMMIT });
  assert.deepEqual(document.actions[0], {
    verb: 'copy',
    path: `vendor/${newName('tokens')}`,
    detail: `sha256 ${releaseSha(from, 'tokens')}`
  });
  assert.deepEqual(document.changelog[0], {
    name: '@egdev/tokens',
    from: '0.5.0',
    to: '0.6.0',
    notes: '## 0.6.0\n\n- Adds the surface-raised token.\n\n## 0.5.1\n\n- Fixes the focus ring contrast.'
  });
  assert.deepEqual(document.changelog[2], { name: '@egdev/system', from: '0.4.1', to: '0.4.1', notes: '' });
  const applied = await upgrade(fixture, ['--from', from, '--json'], fakeInstaller().runner);
  assert.equal(JSON.parse(applied.stdout).result, 'applied');
});
