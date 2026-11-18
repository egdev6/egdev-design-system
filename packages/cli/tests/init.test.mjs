import assert from 'node:assert/strict';
import { chmodSync, existsSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { run } from '../src/cli.mjs';
import { planWorkspace } from '../src/pnpm-workspace.mjs';
import {
  COMMIT,
  FULL_SET,
  fakeInstaller,
  freshNpmVite,
  freshPnpmNext,
  freshPnpmVite,
  json,
  MANIFESTS,
  npmViteFixture,
  OTHER_COMMIT,
  releaseFixture,
  runBin,
  runInProcess,
  sha256,
  tarball,
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
const release = (selected = FULL_SET, commit = COMMIT) => {
  const directory = releaseFixture(selected, commit);
  scratch.push(directory);
  return directory;
};
const read = (path) => readFileSync(path, 'utf8');
const readJson = (path) => JSON.parse(read(path));
const editJson = (path, edit) => writeFileSync(path, json(edit(readJson(path))));

const C7 = COMMIT.slice(0, 7);
const file = (pkg, commit = C7) => `vendor/egdev/egdev-${pkg}-${MANIFESTS[pkg].version}-${commit}.tgz`;
const spec = (pkg) => `file:./${file(pkg)}`;
const line = (verb, path, detail) => `  ${verb.padEnd(8)}${path}${detail ? `  ${detail}` : ''}`;
const copy = (pkg) => line('copy', file(pkg), `sha256 ${sha256(tarball(MANIFESTS[pkg])).slice(0, 12)}…`);
const MCP = { command: 'node', args: ['node_modules/@egdev/mcp/dist/index.js'] };
const nextSteps = (doctorScript) => [
  'Next steps:',
  '  Restart the dev server with --force.',
  '  Regenerate design/system.md with egdev-system-md --write.',
  `  Add ${doctorScript} to CI.`,
  'Review the diff before committing.'
];

async function init(fixture, args, runner) {
  return runInProcess(run, ['init', fixture.argument, ...args], fixture.root, runner ? { runner } : {});
}

// The paths outside node_modules that differ between two treeContents snapshots.
function changed(before, after) {
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((path) => before[path] !== after[path] && !path.includes('/node_modules'))
    .sort();
}

const npmPlan = (fixture, from) => [
  `egdev-ds init ${fixture.argument} (npm, vite, native) from ${from} at ${C7}`,
  ...['tokens', 'ui', 'system', 'mcp', 'cli'].map(copy),
  line('edit', 'package.json', `dependencies.@egdev/tokens = ${spec('tokens')}`),
  line('edit', 'package.json', `dependencies.@egdev/ui = ${spec('ui')}`),
  line('edit', 'package.json', `devDependencies.@egdev/system = ${spec('system')}`),
  line('edit', 'package.json', `devDependencies.@egdev/mcp = ${spec('mcp')}`),
  line('edit', 'package.json', `devDependencies.@egdev/cli = ${spec('cli')}`),
  line('keep', 'package.json', 'dependencies.react = ^19.3.0'),
  line('keep', 'package.json', 'dependencies.react-dom = ^19.3.0'),
  line('edit', 'package.json', 'scripts.ds:doctor = egdev-ds doctor .'),
  line('edit', 'package.json', 'overrides.@egdev/system = $@egdev/system'),
  line('edit', 'src/index.css', '+@import "@egdev/tokens/tokens.css"'),
  line('edit', 'src/index.css', '+@import "@egdev/ui/styles.css"'),
  line('create', 'egdev-ds.json', 'localRepo=hub'),
  line('create', '.mcp.json', 'mcpServers.egdev-design-system')
];

test('AC3 AC6 npm+Vite+native --dry-run prints the exact plan and writes nothing anywhere', async () => {
  const fixture = track(freshNpmVite());
  const from = release();
  const before = [treeHash(fixture.root), treeHash(from)];
  const { calls, runner } = fakeInstaller();
  assert.deepEqual(await init(fixture, ['--from', from, '--dry-run'], runner), {
    status: 0,
    stdout: [...npmPlan(fixture, from), line('run', 'npm install'), 'Dry run: nothing written.', ''].join('\n'),
    stderr: ''
  });
  assert.deepEqual([treeHash(fixture.root), treeHash(from)], before, 'dry run writes nothing, node_modules included');
  assert.deepEqual(calls, [], 'dry run spawns nothing');
});

test('AC6 AC16 npm+Vite+native init writes exactly the §6 effects, runs only npm install, and doctor passes', async () => {
  const fixture = track(freshNpmVite());
  const from = release();
  const before = treeContents(fixture.project);
  const { calls, runner } = fakeInstaller();
  assert.deepEqual(await init(fixture, ['--from', from], runner), {
    status: 0,
    stdout: [
      ...npmPlan(fixture, from),
      line('run', 'npm install'),
      `Initialized at ${C7}; 5 vendored integrities verified.`,
      ...nextSteps('npm run ds:doctor'),
      ''
    ].join('\n'),
    stderr: 'added 5 packages\n'
  });
  assert.deepEqual(calls, [['npm', ['install'], fixture.project]], 'only the detected package manager, never git');
  const { project } = fixture;
  assert.equal(
    read(join(project, 'package.json')),
    json({
      name: 'hub',
      private: true,
      type: 'module',
      scripts: { dev: 'vite', 'ds:doctor': 'egdev-ds doctor .' },
      dependencies: {
        react: '^19.3.0',
        'react-dom': '^19.3.0',
        '@egdev/tokens': spec('tokens'),
        '@egdev/ui': spec('ui')
      },
      devDependencies: {
        typescript: '^5.9.0',
        vite: '^7.1.0',
        '@egdev/system': spec('system'),
        '@egdev/mcp': spec('mcp'),
        '@egdev/cli': spec('cli')
      },
      overrides: { '@egdev/system': '$@egdev/system' }
    })
  );
  assert.equal(
    read(join(project, 'src/index.css')),
    '@import "@egdev/tokens/tokens.css";\n@import "@egdev/ui/styles.css";\n:root { color-scheme: dark; }\n'
  );
  assert.equal(
    read(join(project, 'egdev-ds.json')),
    json({ schemaVersion: 1, sourceDirectory: 'src', themeDirectory: 'src/theme/', localRepo: 'hub', exclude: [] })
  );
  assert.equal(read(join(project, '.mcp.json')), json({ mcpServers: { 'egdev-design-system': MCP } }));
  for (const pkg of ['tokens', 'ui', 'system', 'mcp', 'cli']) {
    assert.deepEqual(readFileSync(join(project, file(pkg))), tarball(MANIFESTS[pkg]), `${pkg} copied byte for byte`);
  }
  assert.deepEqual(changed(before, treeContents(project)), [
    './.mcp.json',
    './egdev-ds.json',
    './package-lock.json',
    './package.json',
    './src/index.css',
    './vendor',
    './vendor/egdev',
    ...['cli', 'mcp', 'system', 'tokens', 'ui'].map((pkg) => `./${file(pkg)}`)
  ]);
  assert.deepEqual(await runInProcess(run, ['doctor', 'apps/hub', '--from', from], fixture.root), {
    status: 0,
    stdout:
      'egdev-ds doctor apps/hub (npm, vite, native)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n',
    stderr: ''
  });
});

test('AC7 a second init at the same commit is a no-op: Already at, exit 0, files byte-identical, no spawn', async () => {
  const fixture = track(freshNpmVite());
  const from = release();
  assert.equal((await init(fixture, ['--from', from], fakeInstaller().runner)).status, 0);
  const before = treeHash(fixture.root);
  const { calls, runner } = fakeInstaller();
  const header = `egdev-ds init apps/hub (npm, vite, native) from ${from} at ${C7}`;
  const current = `Already at ${C7}; 5 vendored integrities verified; no changes.`;
  assert.deepEqual(await init(fixture, ['--from', from], runner), {
    status: 0,
    stdout: `${header}\n${current}\n`,
    stderr: ''
  });
  assert.deepEqual(await init(fixture, ['--from', from, '--dry-run'], runner), {
    status: 0,
    stdout: `${header}\n${current}\n`,
    stderr: ''
  });
  const document = JSON.parse((await init(fixture, ['--from', from, '--json'], runner)).stdout);
  assert.equal(document.result, 'current');
  assert.deepEqual(document.actions, []);
  assert.equal(treeHash(fixture.root), before);
  assert.deepEqual(calls, []);
});

test('AC6 pnpm+Next.js+tailwind init with effects: workspace overrides, packageManager, three, theme.css; doctor passes', async () => {
  const fixture = track(freshPnpmNext());
  const from = release();
  const { calls, runner } = fakeInstaller();
  const selected = ['tokens', 'ui', 'effects', 'system', 'mcp', 'cli'];
  const result = await init(fixture, ['--from', from, '--packages', 'tokens,ui,effects,system,mcp'], runner);
  assert.deepEqual(result, {
    status: 0,
    stdout: [
      `egdev-ds init . (pnpm, next, tailwind) from ${from} at ${C7}`,
      ...selected.map(copy),
      line('edit', 'package.json', `dependencies.@egdev/tokens = ${spec('tokens')}`),
      line('edit', 'package.json', `dependencies.@egdev/ui = ${spec('ui')}`),
      line('edit', 'package.json', `dependencies.@egdev/effects = ${spec('effects')}`),
      line('edit', 'package.json', `devDependencies.@egdev/system = ${spec('system')}`),
      line('edit', 'package.json', `devDependencies.@egdev/mcp = ${spec('mcp')}`),
      line('edit', 'package.json', `devDependencies.@egdev/cli = ${spec('cli')}`),
      line('keep', 'package.json', 'dependencies.react = 19.3.0'),
      line('keep', 'package.json', 'dependencies.react-dom = 19.3.0'),
      line('edit', 'package.json', 'dependencies.three = 0.160.0'),
      line('edit', 'package.json', 'scripts.ds:doctor = egdev-ds doctor .'),
      line('edit', 'package.json', 'packageManager = pnpm@10.34.6'),
      ...selected.map((pkg) => line('edit', 'pnpm-workspace.yaml', `overrides.@egdev/${pkg} = ${spec(pkg)}`)),
      line('edit', 'pnpm-workspace.yaml', 'strictPeerDependencies = true'),
      line('edit', 'src/app/globals.css', '+@import "@egdev/tokens/theme.css"'),
      line('edit', 'src/app/globals.css', '+@import "@egdev/ui/styles.css"'),
      line('edit', 'src/app/globals.css', '+@import "@egdev/effects/styles.css"'),
      line('create', 'egdev-ds.json', 'localRepo=site'),
      line('create', '.mcp.json', 'mcpServers.egdev-design-system'),
      line('run', 'pnpm install --no-frozen-lockfile'),
      `Initialized at ${C7}; 6 vendored integrities verified.`,
      ...nextSteps('pnpm ds:doctor'),
      ''
    ].join('\n'),
    stderr: 'added 6 packages\n'
  });
  assert.deepEqual(calls, [['pnpm', ['install', '--no-frozen-lockfile'], fixture.project]]);
  const { project } = fixture;
  assert.equal(
    read(join(project, 'package.json')),
    json({
      name: 'site',
      private: true,
      type: 'module',
      scripts: { dev: 'next dev', 'ds:doctor': 'egdev-ds doctor .' },
      dependencies: {
        next: '16.4.5',
        react: '19.3.0',
        'react-dom': '19.3.0',
        '@egdev/tokens': spec('tokens'),
        '@egdev/ui': spec('ui'),
        '@egdev/effects': spec('effects'),
        three: '0.160.0'
      },
      devDependencies: {
        '@tailwindcss/postcss': '4.3.4',
        postcss: '8.5.32',
        tailwindcss: '4.3.4',
        typescript: '6.0.3',
        '@egdev/system': spec('system'),
        '@egdev/mcp': spec('mcp'),
        '@egdev/cli': spec('cli')
      },
      packageManager: 'pnpm@10.34.6'
    })
  );
  assert.equal(
    read(join(project, 'pnpm-workspace.yaml')),
    [
      'packages:',
      '  - .',
      '',
      '# pnpm 10 blocks dependency build scripts by default.',
      'onlyBuiltDependencies:',
      '  - esbuild',
      '',
      'overrides:',
      ...selected.map((pkg) => `  '@egdev/${pkg}': '${spec(pkg)}'`),
      '',
      'strictPeerDependencies: true',
      ''
    ].join('\n')
  );
  assert.equal(
    read(join(project, 'src/app/globals.css')),
    [
      "@import 'tailwindcss';",
      '@import "@egdev/tokens/theme.css";',
      '@import "@egdev/ui/styles.css";',
      '@import "@egdev/effects/styles.css";',
      '',
      'body { margin: 0; }',
      ''
    ].join('\n')
  );
  assert.equal(
    read(join(project, 'egdev-ds.json')),
    json({ schemaVersion: 1, sourceDirectory: 'src', themeDirectory: 'src/theme/', localRepo: 'site', exclude: [] })
  );
  assert.deepEqual(await runInProcess(run, ['doctor', '.', '--from', from], project), {
    status: 0,
    stdout:
      'egdev-ds doctor . (pnpm, next, tailwind)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n',
    stderr: ''
  });
  const again = await init(fixture, ['--from', from, '--packages', 'tokens,ui,effects,system,mcp'], runner);
  assert.equal(again.stdout.split('\n')[1], `Already at ${C7}; 6 vendored integrities verified; no changes.`);
});

test('AC6 npm+Vite+tailwind inserts theme.css after @import "tailwindcss"; doctor passes', async () => {
  const fixture = track(freshNpmVite({ tailwind: true }));
  const from = release();
  const result = await init(fixture, ['--from', from], fakeInstaller().runner);
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.split('\n')[0], `egdev-ds init apps/hub (npm, vite, tailwind) from ${from} at ${C7}`);
  assert.equal(
    read(join(fixture.project, 'src/index.css')),
    '@import "tailwindcss";\n@import "@egdev/tokens/theme.css";\n@import "@egdev/ui/styles.css";\n\n:root { color-scheme: dark; }\n'
  );
  const doctor = await runInProcess(run, ['doctor', 'apps/hub', '--from', from], fixture.root);
  assert.equal(
    doctor.stdout,
    'egdev-ds doctor apps/hub (npm, vite, tailwind)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n'
  );
});

test('AC6 pnpm+Vite+native without a lockfile creates pnpm-workspace.yaml and keeps @charset first; doctor passes', async () => {
  const fixture = track(freshPnpmVite());
  const from = release();
  const { calls, runner } = fakeInstaller();
  const result = await init(fixture, ['--from', from, '--offline'], runner);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(calls, [['pnpm', ['install', '--no-frozen-lockfile', '--offline'], fixture.project]]);
  assert.ok(result.stdout.includes(`${line('keep', 'package.json', 'packageManager = pnpm@10.34.6')}\n`));
  assert.ok(result.stdout.includes(`${line('create', 'pnpm-workspace.yaml', 'overrides, strictPeerDependencies')}\n`));
  assert.ok(result.stdout.includes(`${line('run', 'pnpm install --no-frozen-lockfile --offline')}\n`));
  const selected = ['tokens', 'ui', 'system', 'mcp', 'cli'];
  assert.equal(
    read(join(fixture.project, 'pnpm-workspace.yaml')),
    [
      'overrides:',
      ...selected.map((pkg) => `  '@egdev/${pkg}': '${spec(pkg)}'`),
      '',
      'strictPeerDependencies: true',
      ''
    ].join('\n')
  );
  assert.equal(
    read(join(fixture.project, 'src/styles/app.css')),
    '@charset "utf-8";\n@import "@egdev/tokens/tokens.css";\n@import "@egdev/ui/styles.css";\nbody { margin: 0; }\n'
  );
  const doctor = await runInProcess(run, ['doctor', '.', '--from', from], fixture.project);
  assert.equal(
    doctor.stdout,
    'egdev-ds doctor . (pnpm, vite, native)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n'
  );
});

test('AC6 a Vite entry module that already imports @egdev CSS is wired: no CSS edit (Nexo layout)', async () => {
  const fixture = track(freshNpmVite());
  write(
    join(fixture.project, 'src/main.tsx'),
    "import '@egdev/tokens/tokens.css';\nimport '@egdev/ui/styles.css';\nimport './index.css';\n"
  );
  const result = await init(fixture, ['--from', release(), '--dry-run'], fakeInstaller().runner);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(
    result.stdout.includes(`${line('keep', 'src/main.tsx', 'design system CSS imported by the entry module')}\n`)
  );
  assert.ok(!result.stdout.includes('src/index.css'));
});

test('AC5 detection ambiguities exit 2 with one stderr line and write nothing', async () => {
  const from = release();
  const cases = [
    [
      (f) => write(join(f.project, 'pnpm-lock.yaml'), ''),
      'Both package-lock.json and pnpm-lock.yaml exist; remove one.'
    ],
    [
      (f) => rmSync(join(f.project, 'package-lock.json')),
      'Cannot detect the package manager: add a lockfile or packageManager.'
    ],
    [
      (f) => {
        rmSync(join(f.project, 'package-lock.json'));
        write(join(f.project, 'yarn.lock'), '');
      },
      'Unsupported package manager: yarn; use pnpm or npm.'
    ],
    [
      (f) =>
        editJson(join(f.project, 'package.json'), (m) => ({
          ...m,
          dependencies: { ...m.dependencies, next: '16.4.5' }
        })),
      'Cannot find the CSS entry: both next and vite are declared.'
    ],
    [
      (f) => editJson(join(f.project, 'package.json'), (m) => ({ ...m, devDependencies: { typescript: '^5.9.0' } })),
      'Cannot find the CSS entry: declare next or vite.'
    ],
    [
      (f) =>
        editJson(join(f.project, 'package.json'), (m) => ({
          ...m,
          devDependencies: { ...m.devDependencies, tailwindcss: '4.3.4' }
        })),
      'Contradictory CSS signals: tailwindcss without @tailwindcss/vite; pass --css tailwind|native.'
    ],
    [
      (f) => write(join(f.project, 'src/index.css'), '@import "tailwindcss";\n'),
      'Contradictory CSS signals: src/index.css imports tailwindcss, which is not a dependency; pass --css tailwind|native.'
    ],
    [
      (f) => write(join(f.project, 'src/main.tsx'), "import { App } from './App';\n"),
      'No CSS entry: src/main.tsx imports no local .css file; pass --css-entry <path>.'
    ],
    [(f) => rmSync(join(f.project, 'index.html')), 'No CSS entry: index.html not found; pass --css-entry <path>.'],
    [(f) => rmSync(join(f.project, 'package.json')), 'Cannot read apps/hub/package.json: not found.']
  ];
  for (const [mutate, message] of cases) {
    const fixture = track(freshNpmVite());
    mutate(fixture);
    const before = treeHash(fixture.root);
    assert.deepEqual(await init(fixture, ['--from', from], fakeInstaller().runner), {
      status: 2,
      stdout: '',
      stderr: `${message}\n`
    });
    assert.equal(treeHash(fixture.root), before, message);
  }
});

test('AC5 explicit --css and --css-entry override detection', async () => {
  const fixture = track(freshNpmVite());
  write(join(fixture.project, 'src/main.tsx'), "import { App } from './App';\n");
  write(join(fixture.project, 'src/app.css'), 'body { margin: 0; }\n');
  const from = release();
  const result = await init(
    fixture,
    ['--from', from, '--css-entry', 'src/app.css', '--dry-run'],
    fakeInstaller().runner
  );
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(`${line('edit', 'src/app.css', '+@import "@egdev/tokens/tokens.css"')}\n`));
  const outside = await init(fixture, ['--from', from, '--css-entry', '../other.css'], fakeInstaller().runner);
  assert.deepEqual(outside, {
    status: 2,
    stdout: '',
    stderr: 'Invalid --css-entry: ../other.css is not a file inside apps/hub.\n'
  });
  const tailwind = await init(
    fixture,
    ['--from', from, '--css-entry', 'src/app.css', '--css', 'tailwind'],
    fakeInstaller().runner
  );
  assert.deepEqual(tailwind, {
    status: 2,
    stdout: '',
    stderr: 'src/app.css has no @import "tailwindcss"; add it first or pass --css native.\n'
  });
});

test('AC7 init refuses a project vendored at another commit or with a mixed set: use upgrade', async () => {
  const fixture = track(npmViteFixture());
  const from = release(FULL_SET, OTHER_COMMIT);
  assert.deepEqual(await init(fixture, ['--from', from], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: `apps/hub is vendored at ${C7}; run egdev-ds upgrade.\n`
  });
  editJson(join(fixture.project, 'package.json'), (m) => ({
    ...m,
    dependencies: { ...m.dependencies, '@egdev/ui': 'file:vendor/egdev-ui-0.3.1.tgz' }
  }));
  assert.deepEqual(await init(fixture, ['--from', from], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: `apps/hub has a mixed vendored set (${C7}, none); run egdev-ds upgrade.\n`
  });
  editJson(join(fixture.project, 'package.json'), (m) => ({
    ...m,
    dependencies: { ...m.dependencies, '@egdev/ui': 'file:vendor/../ui.tgz' }
  }));
  assert.deepEqual(await init(fixture, ['--from', from], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: 'Unsafe vendored path: @egdev/ui (file:vendor/../ui.tgz).\n'
  });
});

test('AC15 Q8 conflicts exit 2 listing every one; --force replaces only those values', async () => {
  const fixture = track(freshPnpmNext());
  const from = release();
  const path = join(fixture.project, 'package.json');
  editJson(path, (m) => ({
    ...m,
    scripts: { ...m.scripts, 'ds:doctor': 'vitest run' },
    dependencies: { ...m.dependencies, '@egdev/ui': '^0.3.0', three: '0.161.0' }
  }));
  write(
    join(fixture.project, '.mcp.json'),
    json({
      mcpServers: {
        other: { command: 'x' },
        'egdev-design-system': { command: 'npx', args: ['egdev-mcp'], env: { debug: '1' } }
      }
    })
  );
  const before = treeHash(fixture.root);
  const args = ['--from', from, '--packages', 'tokens,ui,effects,system,mcp'];
  assert.deepEqual(await init(fixture, args, fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: [
      `Conflict: package.json dependencies.@egdev/ui is "^0.3.0"; egdev-ds sets "${spec('ui')}".`,
      'Conflict: package.json dependencies.three is "0.161.0"; egdev-ds sets "0.160.0".',
      'Conflict: package.json scripts.ds:doctor is "vitest run"; egdev-ds sets "egdev-ds doctor .".',
      `Conflict: .mcp.json mcpServers.egdev-design-system is ${JSON.stringify({ command: 'npx', args: ['egdev-mcp'] })}; egdev-ds sets ${JSON.stringify(MCP)}.`,
      '4 conflicts: nothing written; pass --force to replace only these values.',
      ''
    ].join('\n')
  });
  assert.equal(treeHash(fixture.root), before, 'conflicts write nothing');
  const forced = await init(fixture, [...args, '--force'], fakeInstaller().runner);
  assert.equal(forced.status, 0, forced.stderr);
  assert.ok(
    forced.stdout.includes(
      `${line('edit', 'package.json', 'scripts.ds:doctor = egdev-ds doctor . (replaces "vitest run")')}\n`
    )
  );
  const manifest = readJson(path);
  assert.equal(manifest.scripts['ds:doctor'], 'egdev-ds doctor .');
  assert.equal(manifest.scripts.dev, 'next dev', 'other keys stay');
  assert.equal(manifest.dependencies['@egdev/ui'], spec('ui'));
  assert.equal(manifest.dependencies.three, '0.160.0');
  assert.deepEqual(readJson(join(fixture.project, '.mcp.json')), {
    mcpServers: { other: { command: 'x' }, 'egdev-design-system': { ...MCP, env: { debug: '1' } } }
  });
});

test('AC12 install failure and integrity mismatch roll back every byte and exit 1', async () => {
  for (const [options, stderr] of [
    [{ fail: true }, 'npm ERR! install failed\nnpm install failed (exit 1); rolled back.\n'],
    [
      { corrupt: true },
      `added 5 packages\nIntegrity check failed: ${['tokens', 'ui', 'system', 'mcp', 'cli']
        .map((pkg) => `Integrity mismatch: @egdev/${pkg} (file:${file(pkg)}).`)
        .join(' ')
        .slice(0, -1)}; rolled back.\n`
    ]
  ]) {
    const fixture = track(freshNpmVite());
    const from = release();
    const before = treeContents(fixture.project);
    const result = await init(fixture, ['--from', from], fakeInstaller(options).runner);
    assert.equal(result.status, 1);
    assert.equal(result.stderr, stderr);
    assert.ok(!result.stdout.includes('Initialized'));
    assert.deepEqual(
      changed(before, treeContents(fixture.project)),
      [],
      'package.json, lockfile, CSS restored; tarballs removed'
    );
    assert.ok(!existsSync(join(fixture.project, 'vendor')), 'created folders removed');
  }
});

test('AC12 a failed atomic write mid-transaction rolls back the files already written', {
  skip: process.getuid?.() === 0
}, async () => {
  const fixture = track(freshNpmVite());
  const before = treeContents(fixture.project);
  chmodSync(join(fixture.project, 'src'), 0o555);
  try {
    const { calls, runner } = fakeInstaller();
    const result = await init(fixture, ['--from', release()], runner);
    assert.equal(result.status, 1);
    assert.equal(result.stderr, 'Cannot write src/index.css (EACCES); rolled back.\n');
    assert.deepEqual(calls, []);
  } finally {
    chmodSync(join(fixture.project, 'src'), 0o755);
  }
  assert.deepEqual(changed(before, treeContents(fixture.project)), []);
});

test('Q2 a dirty release is refused unless --allow-dirty', async () => {
  const fixture = track(freshNpmVite());
  const from = release();
  editJson(join(from, 'release.json'), (m) => ({ ...m, dirty: true }));
  const before = treeHash(fixture.root);
  assert.deepEqual(await init(fixture, ['--from', from, '--dry-run'], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: `Release ${from} was packed from a dirty tree (${C7}); pass --allow-dirty to use it.\n`
  });
  const allowed = await init(fixture, ['--from', from, '--dry-run', '--allow-dirty'], fakeInstaller().runner);
  assert.equal(allowed.status, 0, allowed.stderr);
  assert.equal(treeHash(fixture.root), before);
});

test('Q7 a release without @egdev/cli is refused with exit 1 naming release.json', async () => {
  const fixture = track(freshNpmVite());
  const from = release(['tokens', 'ui', 'effects', 'system', 'mcp']);
  const before = treeHash(fixture.root);
  assert.deepEqual(await init(fixture, ['--from', from, '--dry-run'], fakeInstaller().runner), {
    status: 1,
    stdout: '',
    stderr: `Release lacks @egdev/cli: ${from}/release.json does not list it.\n`
  });
  assert.equal(treeHash(fixture.root), before);
});

test('Q13 package selection: default set plus cli; internal requirements are refused with exit 2', async () => {
  const fixture = track(freshNpmVite());
  const from = release();
  assert.deepEqual(await init(fixture, ['--from', from, '--packages', 'tokens,effects'], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: '@egdev/effects needs @egdev/ui; add ui to --packages.\n'
  });
  const minimal = await init(fixture, ['--from', from, '--packages', 'tokens,ui', '--dry-run'], fakeInstaller().runner);
  assert.equal(minimal.status, 0, minimal.stderr);
  assert.ok(minimal.stdout.includes(copy('cli')), 'cli is always added');
  assert.ok(!minimal.stdout.includes('.mcp.json'), 'no MCP wiring without mcp');
  assert.ok(!minimal.stdout.includes('overrides'), 'no internal dependency to override');
});

test('--no-install prints the exact install command instead of running it', async () => {
  const fixture = track(freshNpmVite());
  const { calls, runner } = fakeInstaller();
  const result = await init(fixture, ['--from', release(), '--no-install', '--offline'], runner);
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(calls, []);
  assert.ok(!result.stdout.includes('  run '));
  assert.ok(
    result.stdout.endsWith(
      [
        `Initialized at ${C7}; integrities unverified (--no-install).`,
        'Next steps:',
        '  Run npm install --offline.',
        ...nextSteps('npm run ds:doctor').slice(1),
        ''
      ].join('\n')
    )
  );
});

test('--json prints exactly one document on stdout for the plan', async () => {
  const fixture = track(freshNpmVite());
  const from = release();
  const result = await init(fixture, ['--from', from, '--dry-run', '--json'], fakeInstaller().runner);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  const document = JSON.parse(result.stdout);
  assert.deepEqual(Object.keys(document), [
    'schemaVersion',
    'command',
    'project',
    'packageManager',
    'framework',
    'cssMode',
    'release',
    'actions',
    'findings',
    'result'
  ]);
  assert.deepEqual(
    { ...document, actions: document.actions.length },
    {
      schemaVersion: 1,
      command: 'init',
      project: 'apps/hub',
      packageManager: 'npm',
      framework: 'vite',
      cssMode: 'native',
      release: { dir: from, commit: COMMIT },
      actions: 19,
      findings: [],
      result: 'planned'
    }
  );
  assert.deepEqual(document.actions.at(-1), { verb: 'run', path: 'npm install', detail: '' });
  assert.deepEqual(document.actions[0], {
    verb: 'copy',
    path: file('tokens'),
    detail: `sha256 ${sha256(tarball(MANIFESTS.tokens))}`
  });
});

test('Q9 --accent writes src/theme/accent-host.ts once, applying the full createAccentTheme map', async () => {
  const fixture = track(freshNpmVite());
  const from = release();
  const result = await init(fixture, ['--from', from, '--accent'], fakeInstaller().runner);
  assert.equal(result.status, 0, result.stderr);
  assert.ok(result.stdout.includes(`${line('create', 'src/theme/accent-host.ts', 'applyAccent(host, accent)')}\n`));
  assert.ok(
    result.stdout.includes('  Call applyAccent from src/theme/accent-host.ts on a host element your app owns.\n')
  );
  const text = read(join(fixture.project, 'src/theme/accent-host.ts'));
  assert.match(text, /^import \{ createAccentTheme \} from '@egdev\/tokens\/accent';$/m);
  assert.match(text, /const \{ variables \} = createAccentTheme\(accent\);/);
  assert.match(text, /host\.style\.setProperty\(name, value\);/);
  const doctor = await runInProcess(run, ['doctor', 'apps/hub', '--from', from], fixture.root);
  assert.equal(doctor.status, 0, doctor.stdout);
  const refused = track(freshNpmVite());
  assert.deepEqual(await init(refused, ['--from', from, '--accent', '--packages', 'ui'], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: '@egdev/ui needs @egdev/tokens; add tokens to --packages.\n'
  });
});

test('§9 unsafe targets and different existing tarballs are refused without writes', async () => {
  const from = release();
  const linked = track(freshNpmVite());
  const real = join(linked.root, 'real-package.json');
  writeFileSync(real, read(join(linked.project, 'package.json')));
  rmSync(join(linked.project, 'package.json'));
  symlinkSync(real, join(linked.project, 'package.json'));
  assert.deepEqual(await init(linked, ['--from', from], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: 'Unsafe target: package.json is a symlink, a hard link or not a regular file.\n'
  });
  const occupied = track(freshNpmVite());
  write(join(occupied.project, file('ui')), 'other bytes');
  const before = treeHash(occupied.root);
  assert.deepEqual(await init(occupied, ['--from', from], fakeInstaller().runner), {
    status: 2,
    stdout: '',
    stderr: `Refusing to overwrite a different tarball: ${file('ui')}.\n`
  });
  assert.equal(treeHash(occupied.root), before);
});

test('§3 init without --from and no sibling release exits 2 with the exact message', () => {
  const fixture = track(freshNpmVite());
  assert.deepEqual(runBin(['init', 'apps/hub', '--dry-run'], fixture.root), {
    status: 2,
    stdout: '',
    stderr: 'No release folder: pass --from <dir> (default ../egdev-design-system/release not found).\n'
  });
});

test('§6.4 pnpm-workspace.yaml edits keep comments and indent, and refuse flow mappings and anchors', () => {
  const entries = [
    { name: '@egdev/ui', spec: 'file:./vendor/egdev/ui.tgz' },
    { name: '@egdev/tokens', spec: 'file:./vendor/egdev/tokens.tgz' }
  ];
  const text = [
    'packages:',
    '  - .',
    '# Overrides pinned by hand.',
    'overrides:',
    '    "@egdev/ui": "file:./vendor/egdev/ui.tgz" # vendored',
    '    lodash: 4.17.21',
    '',
    'strictPeerDependencies: false',
    ''
  ].join('\n');
  const planned = planWorkspace(text, entries, false);
  assert.deepEqual(planned.conflicts, []);
  assert.equal(
    planned.text,
    [
      'packages:',
      '  - .',
      '# Overrides pinned by hand.',
      'overrides:',
      '    "@egdev/ui": "file:./vendor/egdev/ui.tgz" # vendored',
      '    lodash: 4.17.21',
      "    '@egdev/tokens': 'file:./vendor/egdev/tokens.tgz'",
      '',
      'strictPeerDependencies: false',
      ''
    ].join('\n')
  );
  assert.deepEqual(
    planned.actions.map(({ verb, detail }) => `${verb} ${detail}`),
    [
      'keep overrides.@egdev/ui = file:./vendor/egdev/ui.tgz',
      'edit overrides.@egdev/tokens = file:./vendor/egdev/tokens.tgz',
      'keep strictPeerDependencies = false'
    ]
  );
  const conflicting = planWorkspace("overrides:\n  '@egdev/ui': '^0.3.0'\n", entries.slice(0, 1), false);
  assert.deepEqual(conflicting.conflicts, [
    {
      file: 'pnpm-workspace.yaml',
      key: 'overrides.@egdev/ui',
      current: '"^0.3.0"',
      wanted: '"file:./vendor/egdev/ui.tgz"'
    }
  ]);
  assert.equal(
    planWorkspace("overrides:\n  '@egdev/ui': '^0.3.0'\n", entries.slice(0, 1), true).text,
    "overrides:\n  '@egdev/ui': 'file:./vendor/egdev/ui.tgz'\n\nstrictPeerDependencies: true\n"
  );
  for (const layout of ['overrides: { lodash: 1 }\n', 'base: &pins\n  lodash: 1\noverrides:\n  <<: *pins\n']) {
    assert.match(planWorkspace(layout, entries, false).error ?? '', /^Cannot edit pnpm-workspace\.yaml safely: /);
  }
});
