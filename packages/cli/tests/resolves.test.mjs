import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { completeReleasePack } from '../../../scripts/lib/pack-packages.mjs';
import { run } from '../src/cli.mjs';
import {
  CHANGELOGS_B,
  COMMIT,
  FULL_SET,
  fakeInstaller,
  json,
  MANIFESTS_B,
  npmViteFixture,
  OTHER_COMMIT,
  releaseFixture,
  runInProcess,
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
const project = () => {
  const fixture = npmViteFixture();
  scratch.push(fixture.root);
  return fixture;
};
const release = (commit = COMMIT) => {
  const directory = releaseFixture(FULL_SET, commit, {
    ...(commit === OTHER_COMMIT ? { manifests: MANIFESTS_B, changelogs: CHANGELOGS_B } : {})
  });
  scratch.push(directory);
  return directory;
};
const setResolves = (directory, resolves) => {
  const path = join(directory, 'release.json');
  const record = JSON.parse(readFileSync(path, 'utf8'));
  if (resolves === undefined) {
    delete record.resolves;
  } else {
    record.resolves = resolves;
  }
  writeFileSync(path, json(record));
};
const cli = (fixture, args, extra = {}) => runInProcess(run, args, fixture.root, extra);
const resolved = [
  { issue: 12, package: '@egdev/ui', version: '0.7.0' },
  { issue: 34, package: '@egdev/tokens', version: '0.6.0' }
];

function addMitigations(fixture) {
  const entries = [
    {
      file: 'src/Gap.tsx',
      pattern: '<Panel>',
      issue: 'egdev6/egdev-design-system#12',
      reason: 'Waiting for the DS.',
      kind: 'component-gap',
      comment: '// TODO(egdev-design-system#12): Remove the composition.'
    },
    {
      file: 'src/OtherGap.tsx',
      pattern: '<Panel>',
      issue: 'egdev6/egdev-design-system#34',
      reason: 'Waiting for the DS.',
      kind: 'component-gap',
      comment: '// TODO(egdev-design-system#34): Remove the composition.'
    }
  ];
  for (const entry of entries) {
    write(
      join(fixture.project, entry.file),
      `export function Gap() {\n  ${entry.comment}\n  return <Panel>Go</Panel>;\n}\n`
    );
  }
  write(
    join(fixture.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify(entries, null, 2)};\n`
  );
  return entries;
}

function addRepeatedMitigations(fixture) {
  const comment = '// TODO(egdev-design-system#12): Remove the composition.';
  write(
    join(fixture.project, 'src/Gap.tsx'),
    `export function Gap() {\n  ${comment}\n  const first = <Panel>First</Panel>;\n  ${comment}\n  return <Cluster>{first}</Cluster>;\n}\n`
  );
  const entries = ['<Panel>', '<Cluster>'].map((pattern) => ({
    file: 'src/Gap.tsx',
    pattern,
    issue: 'egdev6/egdev-design-system#12',
    reason: 'Waiting for the DS.',
    kind: 'component-gap',
    comment
  }));
  write(
    join(fixture.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify(entries)};\n`
  );
}

function packedFixture(changelogs) {
  const root = mkdtempSync(join(tmpdir(), 'egdev-resolves-pack-'));
  scratch.push(root);
  const destination = join(root, 'release');
  return {
    destination,
    packed: Object.entries(changelogs).map(([pkg, text]) => {
      const name = `@egdev/${pkg}`;
      const version = pkg === 'ui' ? '0.7.0' : '0.6.0';
      const file = `egdev-${pkg}-${version}.tgz`;
      const path = join(destination, file);
      const directory = join(root, pkg);
      // The source differs deliberately: release.json must describe the packed changelog.
      write(join(directory, 'CHANGELOG.md'), `# Changelog\n\n## ${version}\n\n- Source only (#999).\n`);
      write(path, tarball({ name, version }, { 'package/CHANGELOG.md': text }));
      return { name, version, file, path, directory };
    })
  };
}

function pack(fixture) {
  const lines = [];
  const errors = [];
  const status = completeReleasePack(fixture.packed, {
    destination: fixture.destination,
    provenance: { commit: COMMIT, dirty: false },
    log: (line) => lines.push(line),
    error: (line) => errors.push(line)
  });
  return { status, lines, errors, bytes: readFileSync(join(fixture.destination, 'release.json'), 'utf8') };
}

test('S14 packed release metadata is cumulative, oldest-first per issue and package, sorted and deterministic', () => {
  const fixture = packedFixture({
    ui: [
      '# Changelog',
      '',
      '## Unreleased',
      '- Pending (#88).',
      '',
      '## 0.7.0',
      '- Repeat (#12); multiple (#34, #56); zero (#0).',
      '- Partial work: Refs #522.',
      '',
      '## 0.6.0 (#65)',
      '- Added (#12).',
      '',
      '## 0.5.0',
      '- Historical (#34) and (#99).',
      ''
    ].join('\n'),
    tokens: '# Changelog\n\n## 0.6.0\n\n- Shared (#12).\n\n## 0.5.0\n\n- Older (#12).\n'
  });
  const result = pack(fixture);
  assert.equal(result.status, 0);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.lines, [
    ...fixture.packed.map(({ file, name, version }) => `${file}: ${name}@${version}`),
    `release.json: ${COMMIT}`
  ]);
  const record = JSON.parse(result.bytes);
  assert.deepEqual(Object.keys(record), ['schemaVersion', 'commit', 'dirty', 'packages', 'resolves']);
  assert.equal(record.schemaVersion, 1);
  assert.deepEqual(record.resolves, [
    { issue: 12, package: '@egdev/tokens', version: '0.5.0' },
    { issue: 12, package: '@egdev/ui', version: '0.6.0' },
    { issue: 34, package: '@egdev/ui', version: '0.5.0' },
    { issue: 56, package: '@egdev/ui', version: '0.7.0' },
    { issue: 65, package: '@egdev/ui', version: '0.6.0' },
    { issue: 99, package: '@egdev/ui', version: '0.5.0' }
  ]);
  assert.equal(pack(fixture).bytes, result.bytes);
});

test('S14 a packed release without versioned issue references writes an empty resolves array', () => {
  const fixture = packedFixture({ ui: '# Changelog\n\n## Unreleased\n\n- Pending (#5).\n\n## 0.7.0\n\n- None.\n' });
  const result = pack(fixture);
  assert.equal(result.status, 0);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(JSON.parse(result.bytes).resolves, []);
});

test('S14 the public release reader accepts valid and absent resolves without changing old status output', async () => {
  const fixture = project();
  const from = release();
  const args = ['status', fixture.argument, '--from', from, '--json'];
  const before = treeHash(fixture.root);
  const old = await cli(fixture, args);
  assert.equal(old.status, 0);
  assert.equal(old.stderr, '');
  setResolves(from, []);
  assert.deepEqual(await cli(fixture, args), old);
  setResolves(from, resolved);
  assert.deepEqual(await cli(fixture, args), old);
  assert.equal(treeHash(fixture.root), before);
});

test('S14 the public release reader rejects malformed resolves without changing project or release', async () => {
  const fixture = project();
  const from = release();
  const invalidEntry = 'resolves[0] needs a positive integer issue, package and version strings.';
  const cases = [
    [null, 'resolves must be an array.'],
    [{}, 'resolves must be an array.'],
    ...[
      { issue: 0, package: '@egdev/ui', version: '0.7.0' },
      { issue: -1, package: '@egdev/ui', version: '0.7.0' },
      { issue: 1.5, package: '@egdev/ui', version: '0.7.0' },
      { issue: '12', package: '@egdev/ui', version: '0.7.0' },
      { issue: 12, package: null, version: '0.7.0' },
      { issue: 12, package: '@egdev/ui', version: null },
      null
    ].map((entry) => [[entry], invalidEntry])
  ];
  for (const [value, message] of cases) {
    setResolves(from, value);
    const before = [treeHash(fixture.root), treeHash(from)];
    assert.deepEqual(await cli(fixture, ['status', fixture.argument, '--from', from]), {
      status: 1,
      stdout: '',
      stderr: `Invalid ${from}/release.json: ${message}\n`
    });
    assert.deepEqual([treeHash(fixture.root), treeHash(from)], before);
  }
});

test('S14 upgrade reports each resolved allowlist mitigation after success; dry run and JSON keep their existing convention', async () => {
  const baseline = project();
  const fixture = project();
  const entries = addMitigations(fixture);
  const from = release(OTHER_COMMIT);
  const args = ['upgrade', fixture.argument, '--from', from];
  const oldDry = await cli(fixture, [...args, '--dry-run']);
  assert.equal(oldDry.status, 0);
  assert.equal(oldDry.stderr, '');
  const old = await cli(baseline, args, { runner: fakeInstaller().runner });
  assert.equal(old.status, 0);
  assert.equal(old.stderr, 'added 4 packages\n');
  setResolves(from, resolved);
  const before = treeHash(fixture.root);
  assert.deepEqual(await cli(fixture, [...args, '--dry-run']), oldDry);
  const dryJson = await cli(fixture, [...args, '--dry-run', '--json']);
  assert.equal(dryJson.status, 0);
  assert.equal(dryJson.stderr, '');
  assert.equal(Object.hasOwn(JSON.parse(dryJson.stdout), 'nextSteps'), false);
  assert.equal(treeHash(fixture.root), before);
  const result = await cli(fixture, args, { runner: fakeInstaller().runner });
  const notices = [
    '  Remove the mitigation for egdev6/egdev-design-system#12 in src/Gap.tsx:2 (resolved in @egdev/ui 0.7.0).',
    '  Remove the mitigation for egdev6/egdev-design-system#34 in src/OtherGap.tsx:2 (resolved in @egdev/tokens 0.6.0).'
  ];
  assert.deepEqual(result, {
    ...old,
    stdout: old.stdout.replace(
      'Review the diff before committing.',
      `${notices.join('\n')}\nReview the diff before committing.`
    )
  });
  for (const entry of entries) {
    assert.ok(readFileSync(join(fixture.project, entry.file), 'utf8').includes(entry.comment));
  }
  assert.ok(readFileSync(join(fixture.project, 'src/design-system-allowlist.ts'), 'utf8').includes(entries[0].issue));
});

test('S14 upgrade with no match or an unloadable allowlist succeeds without notices', async () => {
  const from = release(OTHER_COMMIT);
  setResolves(from, resolved);
  for (const broken of [false, true]) {
    const fixture = project();
    write(
      join(fixture.project, 'src/design-system-allowlist.ts'),
      broken
        ? 'export const designSystemAllowlist = [;\n'
        : `export const designSystemAllowlist = ${JSON.stringify([
            { file: 'src/Gap.tsx', pattern: '<Panel>', issue: 'nexo#12', reason: 'Local issue.' },
            {
              file: 'src/Gap.tsx',
              pattern: '<Panel>',
              issue: 'egdev6/egdev-design-system#99',
              reason: 'Other DS issue.'
            }
          ])};\n`
    );
    const result = await cli(fixture, ['upgrade', fixture.argument, '--from', from], {
      runner: fakeInstaller().runner
    });
    assert.equal(result.status, 0);
    assert.equal(result.stderr, 'added 4 packages\n');
    assert.equal(result.stdout.includes('Remove the mitigation'), false);
  }
});

test('S14 doctor DS052 is a warning per resolved entry, independent of --fail-on-pending', async () => {
  const fixture = project();
  addMitigations(fixture);
  const from = release();
  const args = ['doctor', fixture.argument, '--from', from];
  const noMatch = await cli(fixture, args);
  assert.deepEqual(noMatch, {
    status: 0,
    stdout:
      'egdev-ds doctor apps/hub (npm, vite, native)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n',
    stderr: ''
  });
  setResolves(from, resolved);
  const before = [treeHash(fixture.root), treeHash(from)];
  const expected = {
    status: 0,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 warning src/Gap.tsx:2: Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/ui 0.7.0).',
      'DS052 warning src/OtherGap.tsx:2: Remove the mitigation for egdev6/egdev-design-system#34 (resolved in @egdev/tokens 0.6.0).',
      '0 errors, 2 warnings, 1 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  };
  assert.deepEqual(await cli(fixture, args), expected);
  assert.deepEqual(await cli(fixture, [...args, '--fail-on-pending']), expected);
  const jsonResult = await cli(fixture, [...args, '--fail-on-pending', '--json']);
  assert.equal(jsonResult.status, 0);
  assert.equal(jsonResult.stderr, '');
  assert.deepEqual(
    JSON.parse(jsonResult.stdout).findings.filter(({ code }) => code === 'DS052'),
    [
      {
        code: 'DS052',
        severity: 'warning',
        message: 'Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/ui 0.7.0).',
        file: 'src/Gap.tsx',
        line: 2
      },
      {
        code: 'DS052',
        severity: 'warning',
        message: 'Remove the mitigation for egdev6/egdev-design-system#34 (resolved in @egdev/tokens 0.6.0).',
        file: 'src/OtherGap.tsx',
        line: 2
      }
    ]
  );
  assert.deepEqual([treeHash(fixture.root), treeHash(from)], before);
  const withoutFrom = await cli(fixture, ['doctor', fixture.argument]);
  assert.equal(withoutFrom.status, 0);
  assert.equal(withoutFrom.stderr, '');
  assert.ok(withoutFrom.stdout.includes('DS052 skipped Release check skipped: pass --from <dir>.\n'));
  assert.ok(withoutFrom.stdout.endsWith('0 errors, 0 warnings, 4 skipped.\n'));

  write(join(fixture.project, 'src/Pending.tsx'), 'export const Pending = () => <input type="color" />;\n');
  const allowlist = join(fixture.project, 'src/design-system-allowlist.ts');
  const pendingEntries = [
    ...addMitigations(fixture),
    { file: 'src/Pending.tsx', pattern: '<input type="color" />', issue: 'nexo#TBD-color', reason: 'Pending.' }
  ];
  write(allowlist, `export const designSystemAllowlist = ${JSON.stringify(pendingEntries)};\n`);
  const pending = await cli(fixture, [...args, '--fail-on-pending', '--json']);
  assert.equal(pending.status, 1);
  assert.equal(pending.stderr, '');
  const findings = JSON.parse(pending.stdout).findings;
  assert.equal(findings.find(({ code }) => code === 'DS043').severity, 'error');
  assert.deepEqual(
    findings.filter(({ code }) => code === 'DS052').map(({ severity }) => severity),
    ['warning', 'warning']
  );
});

test('DS052 skips a newer release until the vendored commit matches', async () => {
  const fixture = project();
  addMitigations(fixture);
  const same = release();
  const newer = release(OTHER_COMMIT);
  const issue = [{ issue: 12, package: '@egdev/ui', version: '0.7.0' }];
  setResolves(same, issue);
  setResolves(newer, issue);
  const before = [treeHash(fixture.root), treeHash(same), treeHash(newer)];
  assert.deepEqual(await cli(fixture, ['doctor', fixture.argument, '--from', newer]), {
    status: 0,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS014 warning package.json: upgrade available: vendored at e712915, release at b54222c.',
      'DS017 skipped Release check skipped: the vendored commit differs from the release.',
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 skipped Skipped: vendored set is not at the release commit; upgrade first.',
      '0 errors, 1 warning, 3 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.deepEqual(await cli(fixture, ['doctor', fixture.argument, '--from', same]), {
    status: 0,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 warning src/Gap.tsx:2: Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/ui 0.7.0).',
      '0 errors, 1 warning, 1 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.deepEqual(await cli(fixture, ['doctor', fixture.argument, '--from', newer, '--json']), {
    status: 0,
    stdout: json({
      schemaVersion: 1,
      command: 'doctor',
      project: fixture.argument,
      packageManager: 'npm',
      framework: 'vite',
      cssMode: 'native',
      release: { dir: newer, commit: OTHER_COMMIT },
      actions: [],
      findings: [
        {
          code: 'DS014',
          severity: 'warning',
          message: 'upgrade available: vendored at e712915, release at b54222c.',
          file: 'package.json'
        },
        {
          code: 'DS017',
          severity: 'skipped',
          message: 'Release check skipped: the vendored commit differs from the release.'
        },
        {
          code: 'DS051',
          severity: 'skipped',
          message: 'Skipped: no design/system.md in the project or up to its repository root.'
        },
        {
          code: 'DS052',
          severity: 'skipped',
          message: 'Skipped: vendored set is not at the release commit; upgrade first.'
        }
      ],
      result: 'current'
    }),
    stderr: ''
  });
  assert.deepEqual([treeHash(fixture.root), treeHash(same), treeHash(newer)], before);
});

test('DS052 skips mixed and absent vendored commits', async () => {
  const mixed = project();
  addMitigations(mixed);
  const from = release();
  setResolves(from, [{ issue: 12, package: '@egdev/ui', version: '0.7.0' }]);
  const oldFile = mixed.vendorName('ui');
  const newFile = mixed.vendorName('ui', OTHER_COMMIT);
  write(join(mixed.project, 'vendor', newFile), readFileSync(join(mixed.project, 'vendor', oldFile)));
  const manifestFile = join(mixed.project, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  manifest.dependencies['@egdev/ui'] = `file:vendor/${newFile}`;
  writeFileSync(manifestFile, json(manifest));
  const lockFile = join(mixed.project, 'package-lock.json');
  const lock = JSON.parse(readFileSync(lockFile, 'utf8'));
  lock.packages['node_modules/@egdev/ui'].resolved = `file:vendor/${newFile}`;
  writeFileSync(lockFile, json(lock));
  const beforeMixed = treeHash(mixed.root);
  assert.deepEqual(await cli(mixed, ['doctor', mixed.argument, '--from', from]), {
    status: 1,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS014 error package.json: Vendored files do not share one commit: b54222c, e712915.',
      'DS017 skipped Release check skipped: the vendored set is mixed (DS014).',
      'DS051 skipped Skipped: the vendored set is mixed (DS014).',
      'DS052 skipped Skipped: vendored set is not at the release commit; upgrade first.',
      '1 error, 0 warnings, 3 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.equal(treeHash(mixed.root), beforeMixed);

  const absent = project();
  addMitigations(absent);
  const absentManifestFile = join(absent.project, 'package.json');
  const absentManifest = JSON.parse(readFileSync(absentManifestFile, 'utf8'));
  for (const field of ['dependencies', 'devDependencies', 'overrides']) {
    for (const name of Object.keys(absentManifest[field] ?? {})) {
      if (name.startsWith('@egdev/')) {
        delete absentManifest[field][name];
      }
    }
  }
  writeFileSync(absentManifestFile, json(absentManifest));
  const beforeAbsent = treeHash(absent.root);
  assert.deepEqual(await cli(absent, ['doctor', absent.argument, '--from', from]), {
    status: 0,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS052 skipped Skipped: vendored set is not at the release commit; upgrade first.',
      '0 errors, 0 warnings, 1 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.equal(treeHash(absent.root), beforeAbsent);
});

test('doctor and upgrade ignore resolutions from packages the project does not use', async () => {
  const fixture = project();
  addMitigations(fixture);
  const same = release();
  const doctorArgs = ['doctor', fixture.argument, '--from', same];
  const before = treeHash(fixture.root);
  const baseline = await cli(fixture, doctorArgs);
  assert.deepEqual(baseline, {
    status: 0,
    stdout:
      'egdev-ds doctor apps/hub (npm, vite, native)\nDS051 skipped Skipped: no design/system.md in the project or up to its repository root.\n0 errors, 0 warnings, 1 skipped.\n',
    stderr: ''
  });
  setResolves(same, [{ issue: 34, package: '@egdev/effects', version: '0.2.2' }]);
  assert.deepEqual(await cli(fixture, doctorArgs), baseline);
  assert.equal(treeHash(fixture.root), before);

  const newer = release(OTHER_COMMIT);
  const first = project();
  const second = project();
  addMitigations(first);
  addMitigations(second);
  const args = ['upgrade', first.argument, '--from', newer];
  const previous = await cli(first, args, { runner: fakeInstaller().runner });
  assert.equal(previous.status, 0);
  assert.equal(previous.stderr, 'added 4 packages\n');
  setResolves(newer, [{ issue: 34, package: '@egdev/effects', version: '0.2.2' }]);
  const allowlist = readFileSync(join(second.project, 'src/design-system-allowlist.ts'), 'utf8');
  assert.deepEqual(await cli(second, args, { runner: fakeInstaller().runner }), previous);
  assert.equal(readFileSync(join(second.project, 'src/design-system-allowlist.ts'), 'utf8'), allowlist);
});

test('doctor lists multiple used resolutions once per allowlist entry in package order', async () => {
  const fixture = project();
  addMitigations(fixture);
  const from = release();
  setResolves(from, [
    { issue: 12, package: '@egdev/ui', version: '0.7.0' },
    { issue: 12, package: '@egdev/effects', version: '0.2.2' },
    { issue: 12, package: '@egdev/tokens', version: '0.5.1' }
  ]);
  const before = [treeHash(fixture.root), treeHash(from)];
  assert.deepEqual(await cli(fixture, ['doctor', fixture.argument, '--from', from]), {
    status: 0,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 warning src/Gap.tsx:2: Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/tokens 0.5.1, @egdev/ui 0.7.0).',
      '0 errors, 1 warning, 1 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.deepEqual(await cli(fixture, ['doctor', fixture.argument, '--from', from, '--json', '--fail-on-pending']), {
    status: 0,
    stdout: json({
      schemaVersion: 1,
      command: 'doctor',
      project: fixture.argument,
      packageManager: 'npm',
      framework: 'vite',
      cssMode: 'native',
      release: { dir: from, commit: COMMIT },
      actions: [],
      findings: [
        {
          code: 'DS051',
          severity: 'skipped',
          message: 'Skipped: no design/system.md in the project or up to its repository root.'
        },
        {
          code: 'DS052',
          severity: 'warning',
          message:
            'Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/tokens 0.5.1, @egdev/ui 0.7.0).',
          file: 'src/Gap.tsx',
          line: 2
        }
      ],
      result: 'current'
    }),
    stderr: ''
  });
  assert.deepEqual([treeHash(fixture.root), treeHash(from)], before);
});

test('upgrade lists multiple used resolutions once per allowlist entry in package order', async () => {
  const baseline = project();
  const fixture = project();
  addMitigations(baseline);
  addMitigations(fixture);
  const from = release(OTHER_COMMIT);
  const args = ['upgrade', fixture.argument, '--from', from];
  const previous = await cli(baseline, args, { runner: fakeInstaller().runner });
  assert.equal(previous.status, 0);
  assert.equal(previous.stderr, 'added 4 packages\n');
  setResolves(from, [
    { issue: 12, package: '@egdev/ui', version: '0.7.0' },
    { issue: 12, package: '@egdev/effects', version: '0.2.2' },
    { issue: 12, package: '@egdev/tokens', version: '0.5.1' }
  ]);
  const notice =
    '  Remove the mitigation for egdev6/egdev-design-system#12 in src/Gap.tsx:2 (resolved in @egdev/tokens 0.5.1, @egdev/ui 0.7.0).';
  const allowlist = readFileSync(join(fixture.project, 'src/design-system-allowlist.ts'), 'utf8');
  assert.deepEqual(await cli(fixture, args, { runner: fakeInstaller().runner }), {
    ...previous,
    stdout: previous.stdout.replace(
      'Review the diff before committing.',
      `${notice}\nReview the diff before committing.`
    )
  });
  assert.equal(readFileSync(join(fixture.project, 'src/design-system-allowlist.ts'), 'utf8'), allowlist);
});

test('doctor reports each allowlist entry separately when TODO text is repeated', async () => {
  const fixture = project();
  addRepeatedMitigations(fixture);
  const from = release();
  setResolves(from, [
    { issue: 12, package: '@egdev/ui', version: '0.7.0' },
    { issue: 12, package: '@egdev/tokens', version: '0.5.1' }
  ]);
  const before = [treeHash(fixture.root), treeHash(from)];
  assert.deepEqual(await cli(fixture, ['doctor', fixture.argument, '--from', from]), {
    status: 0,
    stdout: [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 warning src/Gap.tsx:2: Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/tokens 0.5.1, @egdev/ui 0.7.0).',
      'DS052 warning src/Gap.tsx:4: Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/tokens 0.5.1, @egdev/ui 0.7.0).',
      '0 errors, 2 warnings, 1 skipped.',
      ''
    ].join('\n'),
    stderr: ''
  });
  assert.deepEqual([treeHash(fixture.root), treeHash(from)], before);
});

test('upgrade reports each allowlist entry separately when TODO text is repeated', async () => {
  const baseline = project();
  const fixture = project();
  addRepeatedMitigations(baseline);
  addRepeatedMitigations(fixture);
  const from = release(OTHER_COMMIT);
  const args = ['upgrade', fixture.argument, '--from', from];
  const previous = await cli(baseline, args, { runner: fakeInstaller().runner });
  assert.equal(previous.status, 0);
  assert.equal(previous.stderr, 'added 4 packages\n');
  setResolves(from, [
    { issue: 12, package: '@egdev/ui', version: '0.7.0' },
    { issue: 12, package: '@egdev/tokens', version: '0.5.1' }
  ]);
  const notices = [2, 4].map(
    (line) =>
      `  Remove the mitigation for egdev6/egdev-design-system#12 in src/Gap.tsx:${line} (resolved in @egdev/tokens 0.5.1, @egdev/ui 0.7.0).`
  );
  const allowlist = readFileSync(join(fixture.project, 'src/design-system-allowlist.ts'), 'utf8');
  assert.deepEqual(await cli(fixture, args, { runner: fakeInstaller().runner }), {
    ...previous,
    stdout: previous.stdout.replace(
      'Review the diff before committing.',
      `${notices.join('\n')}\nReview the diff before committing.`
    )
  });
  assert.equal(readFileSync(join(fixture.project, 'src/design-system-allowlist.ts'), 'utf8'), allowlist);
});

test('upgrade --add includes the newly selected package in resolved mitigation notices', async () => {
  const fixture = project();
  addMitigations(fixture);
  const from = release(OTHER_COMMIT);
  setResolves(from, [{ issue: 12, package: '@egdev/effects', version: '0.2.2' }]);
  const result = await cli(fixture, ['upgrade', fixture.argument, '--from', from, '--add', 'effects', '--no-install']);
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout
      .split('\n')
      .filter((line) => line.includes('Remove the mitigation'))
      .join('\n'),
    '  Remove the mitigation for egdev6/egdev-design-system#12 in src/Gap.tsx:2 (resolved in @egdev/effects 0.2.2).'
  );
  assert.ok(JSON.parse(readFileSync(join(fixture.project, 'package.json'), 'utf8')).dependencies['@egdev/effects']);
});

test('doctor and upgrade include a package selected only by an override', async () => {
  const fixture = project();
  addMitigations(fixture);
  const manifestFile = join(fixture.project, 'package.json');
  const manifest = JSON.parse(readFileSync(manifestFile, 'utf8'));
  delete manifest.devDependencies['@egdev/system'];
  manifest.overrides['@egdev/system'] = fixture.spec('system');
  writeFileSync(manifestFile, json(manifest));
  const same = release();
  const newer = release(OTHER_COMMIT);
  const issue = [{ issue: 12, package: '@egdev/system', version: '0.4.1' }];
  setResolves(same, issue);
  setResolves(newer, issue);
  const before = treeHash(fixture.root);
  const doctor = await cli(fixture, ['doctor', fixture.argument, '--from', same]);
  assert.equal(doctor.status, 0);
  assert.equal(doctor.stderr, '');
  assert.ok(
    doctor.stdout.includes(
      'DS052 warning src/Gap.tsx:2: Remove the mitigation for egdev6/egdev-design-system#12 (resolved in @egdev/system 0.4.1).\n'
    )
  );
  assert.equal(treeHash(fixture.root), before);
  const upgrade = await cli(fixture, ['upgrade', fixture.argument, '--from', newer, '--no-install']);
  assert.equal(upgrade.status, 0);
  assert.equal(upgrade.stderr, '');
  assert.ok(
    upgrade.stdout.includes(
      '  Remove the mitigation for egdev6/egdev-design-system#12 in src/Gap.tsx:2 (resolved in @egdev/system 0.4.1).\n'
    )
  );
});

test('S14 old releases preserve upgrade and doctor output when resolves is absent or empty', async () => {
  const fixture = project();
  const from = release(OTHER_COMMIT);
  const before = treeHash(fixture.root);
  for (const args of [
    ['doctor', fixture.argument, '--from', from],
    ['upgrade', fixture.argument, '--from', from, '--dry-run'],
    ['upgrade', fixture.argument, '--from', from, '--dry-run', '--json']
  ]) {
    setResolves(from, undefined);
    const legacy = await cli(fixture, args);
    assert.equal(legacy.status, 0);
    assert.equal(legacy.stderr, '');
    setResolves(from, []);
    assert.deepEqual(await cli(fixture, args), legacy);
  }
  assert.equal(treeHash(fixture.root), before);
});

test('S14 doctor --from an old release without resolves at another commit prints no DS052', async () => {
  const fixture = project();
  const from = release(OTHER_COMMIT);
  setResolves(from, undefined);
  const result = await cli(fixture, ['doctor', fixture.argument, '--from', from]);
  assert.equal(result.stdout.includes('DS052'), false);
  assert.ok(result.stdout.endsWith('0 errors, 1 warning, 2 skipped.\n'));
});
