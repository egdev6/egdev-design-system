import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { run } from '../src/cli.mjs';
import {
  COMMIT,
  json,
  MANIFESTS,
  npmViteFixture,
  OTHER_COMMIT,
  pnpmNextFixture,
  releaseFixture,
  runBin,
  runInProcess,
  sha256,
  sri,
  tarball,
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
const npm = () => track(npmViteFixture());
const pnpm = () => track(pnpmNextFixture());
const release = (...args) => {
  const directory = releaseFixture(...args);
  scratch.push(directory);
  return directory;
};
const readJson = (path) => JSON.parse(readFileSync(path, 'utf8'));
const editJson = (path, edit) => writeFileSync(path, json(edit(readJson(path))));
const skipped = 'Release check skipped: pass --from <dir>.';

// Runs doctor in process and returns the exit code plus the non-skipped finding lines.
async function doctor(fixture, extra = []) {
  const result = await runInProcess(run, ['doctor', fixture.argument, ...extra], fixture.root);
  assert.equal(result.stderr, '', 'Findings go to stdout; stderr stays empty');
  const lines = result.stdout.trimEnd().split('\n');
  return { status: result.status, findings: lines.slice(1, -1).filter((line) => !/^DS\d{3} skipped /.test(line)) };
}

test('AC17 npm+Vite (Nexo-like) clean project: exit 0, exact stdout, nothing written', () => {
  const fixture = npm();
  const before = treeHash(fixture.root);
  assert.deepEqual(runBin(['doctor', 'apps/hub'], fixture.root), {
    status: 0,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      `DS014 skipped ${skipped}`,
      `DS017 skipped ${skipped}`,
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      `DS052 skipped ${skipped}`,
      '0 errors, 0 warnings, 4 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before, 'doctor never writes');
});

test('AC17 pnpm+Next.js (website-like) clean project with --from: exit 0, nothing written', () => {
  const fixture = pnpm();
  const releaseDirectory = release();
  const before = [treeHash(fixture.root), treeHash(releaseDirectory)];
  assert.deepEqual(runBin(['doctor', '.', '--from', releaseDirectory], fixture.root), {
    status: 0,
    stdout:
      'egdev-ds doctor . (pnpm, next, tailwind)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n',
    stderr: ''
  });
  assert.deepEqual([treeHash(fixture.root), treeHash(releaseDirectory)], before, 'doctor never writes');
});

test('AC17 --json prints exactly one document on stdout, also when errors exit 1', () => {
  const fixture = npm();
  const releaseDirectory = release();
  write(join(fixture.project, 'src/Raw.tsx'), 'export const Raw = () => <button type="button">Go</button>;\n');
  const before = treeHash(fixture.root);
  const result = runBin(['doctor', 'apps/hub', '--json', '--from', releaseDirectory], fixture.root);
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.ok(result.stdout.endsWith('}\n'));
  assert.deepEqual(JSON.parse(result.stdout), {
    schemaVersion: 1,
    command: 'doctor',
    project: 'apps/hub',
    packageManager: 'npm',
    framework: 'vite',
    cssMode: 'native',
    release: { dir: releaseDirectory, commit: COMMIT },
    actions: [],
    findings: [
      {
        code: 'DS040',
        severity: 'error',
        message: 'Raw <button type="button">: use a DS component or add an allowlist entry with an issue.',
        file: 'src/Raw.tsx',
        line: 1
      },
      {
        code: 'DS051',
        severity: 'skipped',
        message: 'Skipped: no design/system.md in the project or up to its repository root.'
      }
    ],
    result: 'failed'
  });
  assert.equal(treeHash(fixture.root), before);
  const clean = npm();
  const ok = runBin(['doctor', 'apps/hub', '--json'], clean.root);
  assert.equal(ok.status, 0);
  const document = JSON.parse(ok.stdout);
  assert.equal(document.result, 'current');
  assert.equal(document.release, null);
  assert.deepEqual(
    document.findings.map(({ code, severity }) => `${code} ${severity}`),
    ['DS014 skipped', 'DS017 skipped', 'DS051 skipped', 'DS052 skipped']
  );
});

test('AC17 a failing doctor run prints its findings, the summary and exits 1 without writing', () => {
  const fixture = npm();
  editJson(join(fixture.project, 'package.json'), (manifest) => ({ ...manifest, overrides: undefined }));
  write(join(fixture.project, 'src/view.css'), '.wrapper .eg-button { color: red; }\n');
  const before = treeHash(fixture.root);
  assert.deepEqual(runBin(['doctor', 'apps/hub'], fixture.root), {
    status: 1,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      `DS014 skipped ${skipped}`,
      'DS016 error package.json: Missing npm override: "@egdev/system": "$@egdev/system".',
      `DS017 skipped ${skipped}`,
      'DS041 error src/view.css:1: DS internal selector .wrapper .eg-button: move it under src/theme/ or add an allowlist entry with an issue.',
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      `DS052 skipped ${skipped}`,
      '2 errors, 0 warnings, 4 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
});

test('AC17 DS001 package.json missing or invalid stops the run', async () => {
  const empty = mkdtempSync(join(tmpdir(), 'egdev-ds-empty-'));
  scratch.push(empty);
  mkdirSync(join(empty, 'app'));
  assert.deepEqual(await runInProcess(run, ['doctor', 'app'], empty), {
    status: 1,
    stdout: [
      'egdev-ds doctor app (unknown, unknown, unknown)',
      'DS001 error package.json: Cannot read package.json: not found.',
      '1 error, 0 warnings, 0 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  writeFileSync(join(empty, 'app/package.json'), '{ nope');
  assert.deepEqual((await doctor({ root: empty, argument: 'app' })).findings, [
    'DS001 error package.json: Cannot read package.json: invalid JSON.'
  ]);
});

test('AC17 DS002 package manager ambiguous, missing or unsupported', async () => {
  const both = npm();
  writeFileSync(join(both.project, 'pnpm-lock.yaml'), "lockfileVersion: '9.0'\n");
  assert.deepEqual(await doctor(both), {
    status: 1,
    findings: ['DS002 error Both package-lock.json and pnpm-lock.yaml exist; remove one.']
  });
  const none = npm();
  rmSync(join(none.project, 'package-lock.json'));
  assert.deepEqual((await doctor(none)).findings, [
    'DS002 error Cannot detect the package manager: add a lockfile or packageManager.'
  ]);
  const yarn = npm();
  rmSync(join(yarn.project, 'package-lock.json'));
  editJson(join(yarn.project, 'package.json'), (manifest) => ({ ...manifest, packageManager: 'yarn@4.5.0' }));
  assert.deepEqual((await doctor(yarn)).findings, ['DS002 error Unsupported package manager: yarn; use pnpm or npm.']);
});

test('AC17 DS003 warns on a pnpm major other than 10 and still exits 0', async () => {
  const fixture = pnpm();
  editJson(join(fixture.project, 'package.json'), (manifest) => ({ ...manifest, packageManager: 'pnpm@9.15.0' }));
  assert.deepEqual(await doctor(fixture), {
    status: 0,
    findings: ['DS003 warning package.json: packageManager pnpm@9.15.0 differs from the design system pin pnpm@10.']
  });
});

test('AC17 DS010 unsafe or non-vendored specifiers', async () => {
  const fixture = npm();
  editJson(join(fixture.project, 'package.json'), (manifest) => ({
    ...manifest,
    devDependencies: { ...manifest.devDependencies, '@egdev/system': 'file:vendor/../../egdev-system.tgz' },
    dependencies: { ...manifest.dependencies, '@egdev/tokens': '^0.5.0' }
  }));
  assert.deepEqual(await doctor(fixture), {
    status: 1,
    findings: [
      'DS010 error package.json: Not vendored: @egdev/tokens (^0.5.0); point it at a vendor/ tarball.',
      'DS010 error package.json: Unsafe vendored path: @egdev/system (file:vendor/../../egdev-system.tgz).'
    ]
  });
});

test('AC17 DS011 missing vendored tarball', async () => {
  const fixture = npm();
  rmSync(join(fixture.project, 'vendor', fixture.vendorName('ui')));
  assert.deepEqual((await doctor(fixture)).findings, [
    'DS011 error package.json: Missing vendored tarball: vendor/egdev-ui-0.3.1-e712915.tgz.'
  ]);
});

test('AC17 DS012 npm integrity mismatch and stale lockfile', async () => {
  const mismatch = npm();
  editJson(join(mismatch.project, 'package-lock.json'), (lock) => {
    lock.packages['node_modules/@egdev/ui'].integrity = sri(Buffer.from('other'));
    return lock;
  });
  assert.deepEqual(await doctor(mismatch), {
    status: 1,
    findings: ['DS012 error package-lock.json: Integrity mismatch: @egdev/ui (file:vendor/egdev-ui-0.3.1-e712915.tgz).']
  });
  const stale = npm();
  editJson(join(stale.project, 'package-lock.json'), (lock) => {
    delete lock.packages['node_modules/@egdev/ui'];
    return lock;
  });
  assert.deepEqual((await doctor(stale)).findings, [
    'DS012 error package-lock.json: Not in the lockfile: @egdev/ui (file:vendor/egdev-ui-0.3.1-e712915.tgz); run npm install.'
  ]);
});

test('AC17 DS012 pnpm integrity mismatch and missing lockfile', async () => {
  const mismatch = pnpm();
  const lockPath = join(mismatch.project, 'pnpm-lock.yaml');
  const uiIntegrity = sri(tarball(MANIFESTS.ui));
  writeFileSync(lockPath, readFileSync(lockPath, 'utf8').replace(uiIntegrity, sri(Buffer.from('other'))));
  assert.deepEqual((await doctor(mismatch)).findings, [
    'DS012 error pnpm-lock.yaml: Integrity mismatch: @egdev/ui (file:vendor/egdev/egdev-ui-0.3.1-e712915.tgz).'
  ]);
  const missing = pnpm();
  rmSync(join(missing.project, 'pnpm-lock.yaml'));
  assert.deepEqual((await doctor(missing)).findings, [
    'DS012 error pnpm-lock.yaml: Missing lockfile: run pnpm install.'
  ]);
});

test('AC17 DS013 workspace: or link: in package.json or an installed manifest', async () => {
  const fixture = npm();
  editJson(join(fixture.project, 'package.json'), (manifest) => ({
    ...manifest,
    dependencies: { ...manifest.dependencies, '@egdev/ui': 'workspace:*' }
  }));
  writeFileSync(
    join(fixture.project, 'node_modules/@egdev/tokens/package.json'),
    json({ ...MANIFESTS.tokens, peerDependencies: { '@egdev/system': 'link:../system' } })
  );
  assert.deepEqual(await doctor(fixture), {
    status: 1,
    findings: [
      'DS013 error package.json: @egdev/ui uses workspace:*; vendor the tarball instead.',
      'DS013 error node_modules/@egdev/tokens/package.json: Installed @egdev/tokens declares @egdev/system as link:../system.'
    ]
  });
});

test('AC17 DS014 mixed commits, and upgrade available with --from', async () => {
  const fixture = npm();
  const name = fixture.vendorName('mcp', OTHER_COMMIT);
  const bytes = tarball(MANIFESTS.mcp);
  write(join(fixture.project, 'vendor', name), bytes);
  editJson(join(fixture.project, 'package.json'), (manifest) => ({
    ...manifest,
    devDependencies: { ...manifest.devDependencies, '@egdev/mcp': `file:vendor/${name}` }
  }));
  editJson(join(fixture.project, 'package-lock.json'), (lock) => {
    lock.packages['node_modules/@egdev/mcp'].resolved = `file:vendor/${name}`;
    lock.packages['node_modules/@egdev/mcp'].integrity = sri(bytes);
    return lock;
  });
  assert.deepEqual(await doctor(fixture), {
    status: 1,
    findings: ['DS014 error package.json: Vendored files do not share one commit: b54222c, e712915.']
  });
  const behind = npm();
  const newer = await runInProcess(
    run,
    ['doctor', 'apps/hub', '--from', release(undefined, OTHER_COMMIT)],
    behind.root
  );
  assert.equal(newer.status, 0);
  assert.deepEqual(newer.stdout.split('\n').slice(1, -2), [
    'DS014 warning package.json: upgrade available: vendored at e712915, release at b54222c.',
    'DS017 skipped Release check skipped: the vendored commit differs from the release.',
    'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
    'DS052 skipped Skipped: vendored set is not at the release commit; upgrade first.'
  ]);
});

test('AC17 DS015 not installed, wrong version, or resolved outside the project', async () => {
  const missing = npm();
  rmSync(join(missing.project, 'node_modules/@egdev/ui'), { recursive: true });
  assert.deepEqual((await doctor(missing)).findings, ['DS015 error @egdev/ui is not installed; run npm install.']);
  const version = npm();
  writeFileSync(
    join(version.project, 'node_modules/@egdev/ui/package.json'),
    json({ ...MANIFESTS.ui, version: '0.3.0' })
  );
  assert.deepEqual((await doctor(version)).findings, [
    'DS015 error @egdev/ui installed 0.3.0, vendored tarball is 0.3.1; run npm install.'
  ]);
  const linked = npm();
  const outside = join(linked.root, 'ds-checkout/ui');
  write(join(outside, 'package.json'), json(MANIFESTS.ui));
  rmSync(join(linked.project, 'node_modules/@egdev/ui'), { recursive: true });
  symlinkSync(outside, join(linked.project, 'node_modules/@egdev/ui'));
  assert.deepEqual((await doctor(linked)).findings, [
    `DS015 error @egdev/ui resolves outside the project: ${outside}.`
  ]);
});

test('AC17 DS016 missing npm $ override and missing pnpm override', async () => {
  const npmFixture = npm();
  editJson(join(npmFixture.project, 'package.json'), (manifest) => ({ ...manifest, overrides: {} }));
  assert.deepEqual((await doctor(npmFixture)).findings, [
    'DS016 error package.json: Missing npm override: "@egdev/system": "$@egdev/system".'
  ]);
  const pnpmFixture = pnpm();
  const workspace = join(pnpmFixture.project, 'pnpm-workspace.yaml');
  writeFileSync(
    workspace,
    readFileSync(workspace, 'utf8')
      .split('\n')
      .filter((line) => !line.includes("'@egdev/ui'"))
      .join('\n')
  );
  assert.deepEqual((await doctor(pnpmFixture)).findings, [
    "DS016 error pnpm-workspace.yaml: Missing pnpm override: '@egdev/ui': 'file:./vendor/egdev/egdev-ui-0.3.1-e712915.tgz'."
  ]);
});

test('AC17 DS017 vendored sha256 differs from release.json at the same commit', async () => {
  const fixture = npm();
  const releaseDirectory = release();
  const changed = tarball({ ...MANIFESTS.ui, description: 'repacked' });
  writeFileSync(join(releaseDirectory, 'egdev-ui-0.3.1.tgz'), changed);
  editJson(join(releaseDirectory, 'release.json'), (manifest) => {
    manifest.packages.find((entry) => entry.name === '@egdev/ui').sha256 = sha256(changed);
    return manifest;
  });
  assert.deepEqual(await doctor(fixture, ['--from', releaseDirectory]), {
    status: 1,
    findings: ['DS017 error vendor/egdev-ui-0.3.1-e712915.tgz: sha256 differs from release.json (@egdev/ui 0.3.1).']
  });
});

test('AC17 DS020 internal peer and DS021 external peer coherence', async () => {
  const internal = npm();
  writeFileSync(
    join(internal.project, 'node_modules/@egdev/tokens/package.json'),
    json({ ...MANIFESTS.tokens, version: '0.4.0' })
  );
  assert.deepEqual((await doctor(internal)).findings, [
    'DS015 error @egdev/tokens installed 0.4.0, vendored tarball is 0.5.0; run npm install.',
    'DS020 error @egdev/ui 0.3.1 needs @egdev/tokens 0.5.0; installed 0.4.0.'
  ]);
  const external = npm();
  writeFileSync(join(external.project, 'node_modules/react/package.json'), json({ name: 'react', version: '19.1.0' }));
  assert.deepEqual((await doctor(external)).findings, [
    'DS021 error @egdev/ui 0.3.1 needs react ^18.3.1 || ^19.3.0; installed 19.1.0.'
  ]);
  const three = pnpm();
  rmSync(join(three.project, 'node_modules/three'), { recursive: true });
  assert.deepEqual((await doctor(three)).findings, [
    'DS021 error @egdev/effects 0.2.1 needs three 0.160.0; not installed.'
  ]);
});

test('AC17 DS030 missing CSS import, from the JS entry (Vite) or the CSS entry (Next.js)', async () => {
  const vite = npm();
  const main = join(vite.project, 'src/main.tsx');
  writeFileSync(main, readFileSync(main, 'utf8').replace("import '@egdev/ui/styles.css';\n", ''));
  assert.deepEqual((await doctor(vite)).findings, ['DS030 error src/main.tsx: Missing import: @egdev/ui/styles.css.']);
  const next = pnpm();
  const globals = join(next.project, 'src/app/globals.css');
  writeFileSync(globals, readFileSync(globals, 'utf8').replace("@import '@egdev/effects/styles.css';\n", ''));
  assert.deepEqual((await doctor(next)).findings, [
    'DS030 error src/app/globals.css: Missing import: @egdev/effects/styles.css.'
  ]);
  const noEntry = pnpm();
  rmSync(join(noEntry.project, 'src/app/globals.css'));
  assert.deepEqual((await doctor(noEntry)).findings, [
    'DS030 error No CSS entry: expected src/app/globals.css or app/globals.css.'
  ]);
});

test('AC17 DS031 CSS mode coherence', async () => {
  const next = pnpm();
  const globals = join(next.project, 'src/app/globals.css');
  writeFileSync(
    globals,
    "@import '@egdev/tokens/theme.css';\n@import 'tailwindcss';\n@import '@egdev/effects/styles.css';\n@import '@egdev/ui/styles.css';\n"
  );
  assert.deepEqual((await doctor(next)).findings, [
    'DS031 error src/app/globals.css: @egdev/tokens/theme.css needs @import "tailwindcss" before it.'
  ]);
  const vite = npm();
  const main = join(vite.project, 'src/main.tsx');
  writeFileSync(main, `import '@egdev/tokens/theme.css';\n${readFileSync(main, 'utf8')}`);
  assert.deepEqual((await doctor(vite)).findings, [
    'DS031 error src/main.tsx: @egdev/tokens/theme.css needs @import "tailwindcss" before it.',
    'DS031 error src/main.tsx: Both @egdev/tokens/tokens.css and @egdev/tokens/theme.css are imported; choose one CSS mode.'
  ]);
});

test('AC17 DS040 raw elements and DS041 internal selectors, with exclusions honoured', async () => {
  const fixture = pnpm();
  write(join(fixture.project, 'src/Raw.tsx'), 'export const Raw = () => <button type="button">Go</button>;\n');
  write(join(fixture.project, 'src/app/(payload)/admin.css'), '.eg-button { color: red; }\n');
  write(join(fixture.project, 'src/app/site.css'), '.wrapper [role=tab] { color: red; }\n');
  assert.deepEqual(await doctor(fixture), {
    status: 1,
    findings: [
      'DS040 error src/Raw.tsx:1: Raw <button type="button">: use a DS component or add an allowlist entry with an issue.',
      'DS041 error src/app/site.css:1: DS internal selector .wrapper [role=tab]: move it under src/theme/ or add an allowlist entry with an issue.'
    ]
  });
});

test('AC17 DS042 stale, malformed or unloadable allowlist; DS043 pending TBD placeholders', async () => {
  const stale = npm();
  const allowlist = join(stale.project, 'src/design-system-allowlist.ts');
  const entries = (body) =>
    `import type { GuardAllowlistEntry } from './design-system-guard';\n\nexport const designSystemAllowlist: GuardAllowlistEntry[] = [\n${body}\n];\n`;
  writeFileSync(
    allowlist,
    entries("  { file: 'src/gone.tsx', pattern: '<button />', issue: 'nexo#12', reason: 'Old control.' }")
  );
  assert.deepEqual((await doctor(stale)).findings, [
    'DS042 error src/gone.tsx: Stale allowlist entry <button />; remove it.'
  ]);
  const shape = npm();
  writeFileSync(join(shape.project, 'src/design-system-allowlist.ts'), 'export const designSystemAllowlist = {};\n');
  assert.deepEqual((await doctor(shape)).findings, [
    'DS042 error src/design-system-allowlist.ts: Invalid allowlist: expected an exported designSystemAllowlist array.'
  ]);
  const entry = npm();
  writeFileSync(join(entry.project, 'src/design-system-allowlist.ts'), entries("  { file: 'src/a.tsx', pattern: 1 }"));
  assert.deepEqual((await doctor(entry)).findings, [
    'DS042 error src/design-system-allowlist.ts: Invalid allowlist entry 1: file, pattern, issue and reason must be strings.'
  ]);
  const broken = npm();
  writeFileSync(join(broken.project, 'src/design-system-allowlist.ts'), 'export const designSystemAllowlist = [;\n');
  const brokenResult = await doctor(broken);
  assert.equal(brokenResult.status, 1);
  assert.equal(brokenResult.findings.length, 1);
  assert.match(
    brokenResult.findings[0],
    /^DS042 error src\/design-system-allowlist\.ts: Cannot load the allowlist: .+/
  );
  const pending = npm();
  write(join(pending.project, 'src/Swatch.tsx'), 'export const Swatch = () => <input type="color" />;\n');
  writeFileSync(
    join(pending.project, 'src/design-system-allowlist.ts'),
    entries(
      "  { file: 'src/Swatch.tsx', pattern: '<input type=\"color\" />', issue: 'nexo#TBD-color-swatch', reason: 'Awaiting issue.' }"
    )
  );
  assert.deepEqual(await doctor(pending), {
    status: 0,
    findings: [
      'DS043 warning src/design-system-allowlist.ts: 1 allowlist entry uses nexo#TBD-* placeholders; replace it with a real issue.'
    ]
  });
});

// S13 keeps the ordinary doctor output byte-for-byte; only the pending DS043 severity changes.
function pendingFixture(count = 1) {
  const fixture = npm();
  const entries = [];
  for (let index = 1; index <= count; index++) {
    const file = `src/Swatch${index}.tsx`;
    const pattern = `<input type="color" data-swatch="${index}" />`;
    write(join(fixture.project, file), `export const Swatch${index} = () => ${pattern};\n`);
    entries.push({ file, pattern, issue: `nexo#TBD-color-${index}`, reason: 'Awaiting issue.' });
  }
  write(
    join(fixture.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify(entries, null, 2)};\n`
  );
  return fixture;
}

const pendingMessage = (count) =>
  count === 1
    ? '1 allowlist entry uses nexo#TBD-* placeholders; replace it with a real issue.'
    : `${count} allowlist entries use nexo#TBD-* placeholders; replace them with real issues.`;
const pendingText = (severity, count = 1) =>
  [
    'egdev-ds doctor apps/hub (npm, vite, native)',
    `DS014 skipped ${skipped}`,
    `DS017 skipped ${skipped}`,
    `DS043 ${severity} src/design-system-allowlist.ts: ${pendingMessage(count)}`,
    'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
    `DS052 skipped ${skipped}`,
    severity === 'error' ? '1 error, 0 warnings, 4 skipped.' : '0 errors, 1 warning, 4 skipped.',
    ''
  ].join('\n');
const pendingJson = (severity, count = 1) =>
  `${JSON.stringify(
    {
      schemaVersion: 1,
      command: 'doctor',
      project: 'apps/hub',
      packageManager: 'npm',
      framework: 'vite',
      cssMode: 'native',
      release: null,
      actions: [],
      findings: [
        { code: 'DS014', severity: 'skipped', message: skipped },
        { code: 'DS017', severity: 'skipped', message: skipped },
        {
          code: 'DS043',
          severity,
          message: pendingMessage(count),
          file: 'src/design-system-allowlist.ts'
        },
        {
          code: 'DS051',
          severity: 'skipped',
          message: 'Skipped: no design/system.md in the project or up to its repository root.'
        },
        { code: 'DS052', severity: 'skipped', message: skipped }
      ],
      result: severity === 'error' ? 'failed' : 'current'
    },
    null,
    2
  )}\n`;

test('S13 without the flag a pending placeholder retains exact text and JSON outputs and exit 0', () => {
  const fixture = pendingFixture();
  const before = treeHash(fixture.root);
  assert.deepEqual(runBin(['doctor', 'apps/hub'], fixture.root), {
    status: 0,
    stdout: pendingText('warning'),
    stderr: ''
  });
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], fixture.root), {
    status: 0,
    stdout: pendingJson('warning'),
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
});

test('S13 --fail-on-pending makes a pending DS043 an error in text and exits 1', () => {
  const fixture = pendingFixture();
  const before = treeHash(fixture.root);
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending'], fixture.root), {
    status: 1,
    stdout: pendingText('error'),
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
});

test('S13 --fail-on-pending exposes the effective DS043 error and failed result in JSON', () => {
  const fixture = pendingFixture();
  const before = treeHash(fixture.root);
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending', '--json'], fixture.root), {
    status: 1,
    stdout: pendingJson('error'),
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
});

test('S13 --fail-on-pending preserves the plural message for multiple placeholders', () => {
  const fixture = pendingFixture(2);
  const before = treeHash(fixture.root);
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending'], fixture.root), {
    status: 1,
    stdout: pendingText('error', 2),
    stderr: ''
  });
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending', '--json'], fixture.root), {
    status: 1,
    stdout: pendingJson('error', 2),
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
});

test('S13 --fail-on-pending with no pending placeholders leaves text and JSON unchanged', () => {
  const fixture = npm();
  const before = treeHash(fixture.root);
  for (const extra of [[], ['--json']]) {
    const baseline = runBin(['doctor', 'apps/hub', ...extra], fixture.root);
    assert.equal(baseline.status, 0);
    assert.equal(baseline.stderr, '');
    assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending', ...extra], fixture.root), baseline);
  }
  assert.equal(treeHash(fixture.root), before);
});

test('S13 --fail-on-pending leaves unavailable guard checks and their errors unchanged', () => {
  const fixture = npm();
  rmSync(join(fixture.project, 'node_modules/postcss'));
  const before = treeHash(fixture.root);
  for (const extra of [[], ['--json']]) {
    const baseline = runBin(['doctor', 'apps/hub', ...extra], fixture.root);
    assert.equal(baseline.status, 1);
    assert.equal(baseline.stderr, '');
    assert.ok(baseline.stdout.includes('Cannot resolve postcss from the project; add it as a devDependency.'));
    assert.ok(!baseline.stdout.includes('DS043'));
    assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending', ...extra], fixture.root), baseline);
  }
  assert.equal(treeHash(fixture.root), before);
});

test('S13 --fail-on-pending changes only DS043 when other errors and warnings exist', () => {
  const fixture = pendingFixture();
  rmSync(join(fixture.root, '.mcp.json'));
  write(join(fixture.project, 'src/Raw.tsx'), 'export const Raw = () => <button type="button">Go</button>;\n');
  const before = treeHash(fixture.root);
  const baseline = runBin(['doctor', 'apps/hub'], fixture.root);
  assert.equal(baseline.status, 1);
  assert.equal(baseline.stderr, '');
  assert.ok(baseline.stdout.includes('DS040 error src/Raw.tsx:1:'));
  assert.ok(baseline.stdout.includes('DS050 warning '));
  assert.ok(baseline.stdout.endsWith('1 error, 2 warnings, 4 skipped.\n'));
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending'], fixture.root), {
    status: 1,
    stdout: baseline.stdout
      .replace('DS043 warning ', 'DS043 error ')
      .replace('1 error, 2 warnings, 4 skipped.\n', '2 errors, 1 warning, 4 skipped.\n'),
    stderr: ''
  });
  const jsonBaseline = runBin(['doctor', 'apps/hub', '--json'], fixture.root);
  assert.equal(jsonBaseline.status, 1);
  assert.equal(jsonBaseline.stderr, '');
  const expected = JSON.parse(jsonBaseline.stdout);
  const pending = expected.findings.find((finding) => finding.code === 'DS043');
  assert.equal(pending.severity, 'warning');
  pending.severity = 'error';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending', '--json'], fixture.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(fixture.root), before);
});

test('AC17 DS044 guard engine missing from the consumer (Q4)', async () => {
  const fixture = npm();
  rmSync(join(fixture.project, 'node_modules/postcss'));
  assert.deepEqual(await doctor(fixture), {
    status: 1,
    findings: ['DS044 error Cannot resolve postcss from the project; add it as a devDependency.']
  });
});

test('AC17 DS045 egdev-ds.json missing or invalid (Q6)', async () => {
  const cases = [
    [null, 'File not found.'],
    ['{', 'Invalid JSON.'],
    [json({ schemaVersion: 2 }), 'schemaVersion must be 1.'],
    [json({ schemaVersion: 1, colors: true }), 'Unknown key "colors".'],
    [
      json({ schemaVersion: 1, sourceDirectory: '../src' }),
      'sourceDirectory must be a relative directory inside the project.'
    ],
    [
      json({ schemaVersion: 1, themeDirectory: 'src/theme' }),
      'themeDirectory must be a relative directory ending with /.'
    ],
    [json({ schemaVersion: 1, localRepo: 'a b' }), 'localRepo must be a repository name.'],
    [json({ schemaVersion: 1, exclude: ['/abs'] }), 'exclude must be an array of relative paths.']
  ];
  for (const [content, message] of cases) {
    const fixture = npm();
    const path = join(fixture.project, 'egdev-ds.json');
    if (content === null) {
      rmSync(path);
    } else {
      writeFileSync(path, content);
    }
    assert.deepEqual(await doctor(fixture), { status: 1, findings: [`DS045 error egdev-ds.json: ${message}`] });
  }
});

test('AC17 DS050 warns when no .mcp.json wires the MCP server', async () => {
  const fixture = npm();
  rmSync(join(fixture.root, '.mcp.json'));
  assert.deepEqual(await doctor(fixture), {
    status: 0,
    findings: [
      'DS050 warning @egdev/mcp is a dependency, but no .mcp.json in the project or an ancestor has an egdev-design-system server whose script exists.'
    ]
  });
});

test('AC4 doctor --from: missing folder exits 2; missing or tampered release.json exits 1 naming the file', () => {
  const fixture = npm();
  const missing = join(fixture.root, 'no-release');
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--from', missing], fixture.root), {
    status: 2,
    stdout: '',
    stderr: `No release folder: ${missing} not found.\n`
  });
  const empty = join(fixture.root, 'empty-release');
  mkdirSync(empty);
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--from', empty], fixture.root), {
    status: 1,
    stdout: '',
    stderr: `Cannot read ${empty}/release.json: not found.\n`
  });
  const tampered = release();
  writeFileSync(join(tampered, 'egdev-ui-0.3.1.tgz'), 'tampered');
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--from', tampered, '--json'], fixture.root), {
    status: 1,
    stdout: '',
    stderr: `Release mismatch: ${tampered}/egdev-ui-0.3.1.tgz sha256 differs from ${tampered}/release.json.\n`
  });
});

test('Q5 the allowlist loads with type stripping without a warning, even in a typeless package', () => {
  const fixture = pnpm();
  editJson(join(fixture.project, 'package.json'), (manifest) => ({ ...manifest, type: undefined }));
  const result = runBin(['doctor', '.'], fixture.root);
  assert.equal(result.stderr, '');
  assert.equal(result.status, 0);
});

// DS051 (#486, odd/tasks/egdev-ds-485-486.md S3): the commit in the design/system.md header that the
// apps' sync scripts write (`<!-- Generated from EGDEV design system <commit>; … -->`).
const systemHeader = (commit) =>
  `<!-- Generated from EGDEV design system ${commit}; regenerate: \`node scripts/sync-design-system-md.mjs\` (from repository root). -->\n\n## Composition guide\n`;
const ds051 = (stdout) => stdout.split('\n').filter((line) => line.startsWith('DS051 '));

test('S3 DS051 design/system.md header matches the vendored commit: no finding', async () => {
  for (const commit of [COMMIT.slice(0, 7), COMMIT]) {
    const fixture = pnpm();
    write(join(fixture.project, 'design/system.md'), systemHeader(commit));
    const result = await runInProcess(run, ['doctor', '.'], fixture.root);
    assert.equal(result.status, 0);
    assert.deepEqual(ds051(result.stdout), []);
  }
});

test('S3 DS051 a stale header is a warning (exit 0) naming both commits; nothing written', async () => {
  const fixture = pnpm();
  write(join(fixture.project, 'design/system.md'), systemHeader(OTHER_COMMIT.slice(0, 7)));
  const before = treeHash(fixture.root);
  const result = await runInProcess(run, ['doctor', '.', '--json'], fixture.root);
  assert.equal(result.status, 0);
  assert.deepEqual(
    JSON.parse(result.stdout).findings.filter(({ code }) => code === 'DS051'),
    [
      {
        code: 'DS051',
        severity: 'warning',
        message: 'Header records b54222c, vendored at e712915: regenerate design/system.md.',
        file: 'design/system.md'
      }
    ]
  );
  assert.equal(treeHash(fixture.root), before);
});

test('S3 DS051 finds design/system.md up to the repository root (Nexo keeps it there)', async () => {
  const fixture = npm();
  write(join(fixture.root, 'design/system.md'), systemHeader(OTHER_COMMIT.slice(0, 7)));
  const outside = await runInProcess(run, ['doctor', 'apps/hub'], fixture.root);
  assert.deepEqual(ds051(outside.stdout), [
    'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.'
  ]);
  mkdirSync(join(fixture.root, '.git'));
  const inside = await runInProcess(run, ['doctor', 'apps/hub'], fixture.root);
  assert.equal(inside.status, 0);
  assert.deepEqual(ds051(inside.stdout), [
    'DS051 warning ../../design/system.md: Header records b54222c, vendored at e712915: regenerate design/system.md.'
  ]);
});

test('S3 DS051 is skipped without a recorded commit or a single vendored commit', async () => {
  const plain = pnpm();
  write(join(plain.project, 'design/system.md'), '<!-- Generated from design-system.json. Do not edit. -->\n# EGDEV\n');
  assert.deepEqual(ds051((await runInProcess(run, ['doctor', '.'], plain.root)).stdout), [
    'DS051 skipped design/system.md: Skipped: the header records no design system commit.'
  ]);
  const mixed = pnpm();
  write(join(mixed.project, 'design/system.md'), systemHeader(COMMIT.slice(0, 7)));
  const name = `egdev-ui-${MANIFESTS.ui.version}-${OTHER_COMMIT.slice(0, 7)}.tgz`;
  write(join(mixed.project, 'vendor/egdev', name), tarball(MANIFESTS.ui));
  editJson(join(mixed.project, 'package.json'), (manifest) => ({
    ...manifest,
    dependencies: { ...manifest.dependencies, '@egdev/ui': `file:./vendor/egdev/${name}` }
  }));
  assert.deepEqual(ds051((await runInProcess(run, ['doctor', '.'], mixed.root)).stdout), [
    'DS051 skipped Skipped: the vendored set is mixed (DS014).'
  ]);
});
