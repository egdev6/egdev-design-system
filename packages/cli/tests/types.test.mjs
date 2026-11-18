// S6 (#488): the type-only public entry of @egdev/cli. The declaration is the one source of truth for
// the allowlist entry shape; doctor validates the same keys (DS042).
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { packReleaseSet, releaseMembers } from '../../../scripts/lib/pack-packages.mjs';
import { run } from '../src/cli.mjs';
import { readPackedFile } from '../src/release.mjs';
import { engine, json, npmViteFixture, runInProcess, typescriptDirectory, write } from './helpers.mjs';

const scratch = [];
after(() => {
  for (const path of scratch) {
    rmSync(path, { recursive: true, force: true });
  }
});
const temp = (prefix) => {
  const directory = mkdtempSync(join(tmpdir(), prefix));
  scratch.push(directory);
  return directory;
};
const npm = () => {
  const fixture = npmViteFixture();
  scratch.push(fixture.root);
  return fixture;
};

const declarationPath = new URL('../types/index.d.ts', import.meta.url);

/** The members of the declared GuardAllowlistEntry type, read with the TypeScript compiler API. */
function declaredMembers() {
  const { ts } = engine;
  const source = ts.createSourceFile('index.d.ts', readFileSync(declarationPath, 'utf8'), ts.ScriptTarget.Latest, true);
  const alias = source.statements.find(
    (statement) => ts.isTypeAliasDeclaration(statement) && statement.name.text === 'GuardAllowlistEntry'
  );
  assert.ok(alias && ts.isTypeAliasDeclaration(alias), 'types/index.d.ts declares type GuardAllowlistEntry');
  assert.ok(
    alias.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
    'GuardAllowlistEntry is exported'
  );
  assert.ok(ts.isTypeLiteralNode(alias.type), 'GuardAllowlistEntry is an object type literal');
  return alias.type.members.map((member) => {
    assert.ok(ts.isPropertySignature(member) && member.type);
    return {
      name: member.name.getText(source),
      optional: Boolean(member.questionToken),
      type: member.type.getText(source)
    };
  });
}

const ALLOWLIST = 'src/design-system-allowlist.ts';
const typedAllowlist = (body) =>
  [
    "import type { GuardAllowlistEntry } from '@egdev/cli';",
    '',
    'export const designSystemAllowlist: readonly GuardAllowlistEntry[] = [',
    body,
    '];',
    ''
  ].join('\n');

async function doctor(fixture) {
  const result = await runInProcess(run, ['doctor', fixture.argument], fixture.root);
  assert.equal(result.stderr, '', 'Findings go to stdout; stderr stays empty');
  const lines = result.stdout.trimEnd().split('\n');
  return { status: result.status, findings: lines.slice(1, -1).filter((line) => !/^DS\d{3} skipped /.test(line)) };
}

// A project whose allowlist covers one raw element and one component gap, using every declared key.
const GAP_COMMENT = '// TODO(egdev-design-system#391): Replace with the DS switcher.';
const FULL_ENTRY = {
  file: 'src/Gap.tsx',
  pattern: '<Cluster gap={4}>',
  issue: 'egdev6/egdev-design-system#391',
  reason: 'Awaiting the DS switcher.',
  kind: 'component-gap',
  comment: GAP_COMMENT
};
const RAW_ENTRY = { file: 'src/Swatch.tsx', pattern: '<input type="color" />', issue: 'nexo#21', reason: 'Picker.' };
function guardedProject(entries) {
  const fixture = npm();
  write(join(fixture.project, 'src/Swatch.tsx'), 'export const Swatch = () => <input type="color" />;\n');
  write(
    join(fixture.project, 'src/Gap.tsx'),
    `export const Gap = () => {\n  ${GAP_COMMENT}\n  return <Cluster gap={4}>Go</Cluster>;\n};\n`
  );
  write(
    join(fixture.project, ALLOWLIST),
    typedAllowlist(entries.map((entry) => `  ${JSON.stringify(entry)},`).join('\n'))
  );
  return fixture;
}

test('S6 the declared GuardAllowlistEntry keys are the keys doctor requires and accepts (DS042)', async () => {
  const members = declaredMembers();
  assert.deepEqual(members, [
    { name: 'file', optional: false, type: 'string' },
    { name: 'pattern', optional: false, type: 'string' },
    { name: 'issue', optional: false, type: 'string' },
    { name: 'reason', optional: false, type: 'string' },
    { name: 'kind', optional: true, type: "'component-gap'" },
    { name: 'comment', optional: true, type: 'string' }
  ]);
  assert.deepEqual(
    Object.keys(FULL_ENTRY),
    members.map((member) => member.name)
  );

  // Every declared key together loads and matches: doctor requires nothing the type omits.
  assert.deepEqual(await doctor(guardedProject([RAW_ENTRY, FULL_ENTRY])), { status: 0, findings: [] });

  for (const member of members) {
    if (member.optional) {
      // An optional key may be left out, and doctor rejects a value outside the declared type.
      const { [member.name]: _omitted, ...without } = FULL_ENTRY;
      const loaded = await doctor(guardedProject([RAW_ENTRY, { ...without, kind: undefined }]));
      assert.equal(
        loaded.findings.some((line) => line.includes('Invalid allowlist entry')),
        false,
        `${member.name} is optional for doctor`
      );
      assert.deepEqual((await doctor(guardedProject([{ ...FULL_ENTRY, [member.name]: 1 }]))).findings, [
        `DS042 error ${ALLOWLIST}: Invalid allowlist entry 1: kind must be component-gap and comment a string.`
      ]);
    } else {
      // A required key cannot be left out.
      const { [member.name]: _omitted, ...without } = RAW_ENTRY;
      assert.deepEqual((await doctor(guardedProject([without]))).findings, [
        `DS042 error ${ALLOWLIST}: Invalid allowlist entry 1: file, pattern, issue and reason must be strings.`
      ]);
    }
  }
});

test('S6 doctor loads an allowlist typed with import type from @egdev/cli and reports no DS042', async () => {
  const fixture = guardedProject([RAW_ENTRY]);
  assert.match(
    readFileSync(join(fixture.project, ALLOWLIST), 'utf8'),
    /^import type \{ GuardAllowlistEntry \} from '@egdev\/cli';\n/
  );
  const result = await doctor(fixture);
  assert.deepEqual(result, { status: 0, findings: [] });
});

test('S6 a TypeScript consumer of the packed @egdev/cli type-checks its allowlist', () => {
  const members = releaseMembers().filter((member) => member.name === '@egdev/cli');
  assert.equal(members.length, 1);
  const [packed] = packReleaseSet({ destination: temp('egdev-cli-types-pack-'), members });
  const manifestBytes = readPackedFile(packed.path, 'package/package.json');
  const declaration = readPackedFile(packed.path, 'package/types/index.d.ts');
  assert.ok(manifestBytes && declaration, 'The tarball ships package.json and types/index.d.ts');
  const manifest = JSON.parse(manifestBytes.toString('utf8'));
  assert.equal(manifest.dependencies, undefined, 'The types entry adds no runtime dependency');

  // Offline install: extract the packed manifest and declaration into node_modules/@egdev/cli.
  const project = temp('egdev-cli-types-consumer-');
  write(join(project, 'node_modules/@egdev/cli/package.json'), manifestBytes.toString('utf8'));
  write(join(project, 'node_modules/@egdev/cli/types/index.d.ts'), declaration.toString('utf8'));
  write(join(project, 'package.json'), json({ name: 'consumer', private: true, type: 'module' }));
  write(
    join(project, 'src/valid.ts'),
    [
      "import type { DesignSystemAllowlist, GuardAllowlistEntry } from '@egdev/cli';",
      '',
      'export const designSystemAllowlist: readonly GuardAllowlistEntry[] = [',
      "  { file: 'src/Swatch.tsx', pattern: '<input type=\"color\" />', issue: 'app#21', reason: 'Picker.' },",
      '  {',
      "    file: 'src/Gap.tsx',",
      "    pattern: '<Cluster gap={4}>',",
      "    issue: 'egdev6/egdev-design-system#391',",
      "    reason: 'Awaiting the DS switcher.',",
      "    kind: 'component-gap',",
      `    comment: '${GAP_COMMENT}'`,
      '  }',
      '];',
      'export const sameList: DesignSystemAllowlist = designSystemAllowlist;',
      ''
    ].join('\n')
  );
  write(
    join(project, 'src/wrong-kind.ts'),
    [
      "import type { GuardAllowlistEntry } from '@egdev/cli';",
      '',
      'export const designSystemAllowlist: readonly GuardAllowlistEntry[] = [',
      "  { file: 'src/a.tsx', pattern: '<a href=\"/\">', issue: 'app#1', reason: 'Link.', kind: 'gap' }",
      '];',
      ''
    ].join('\n')
  );
  const resolutions = {
    nodenext: { module: 'NodeNext', moduleResolution: 'NodeNext' },
    bundler: { module: 'ESNext', moduleResolution: 'Bundler' }
  };
  const tsc = (resolution, file) => {
    const config = `tsconfig.${resolution}.${file}.json`;
    write(
      join(project, config),
      json({
        compilerOptions: {
          ...resolutions[resolution],
          target: 'ES2022',
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          verbatimModuleSyntax: true,
          types: []
        },
        files: [`src/${file}.ts`]
      })
    );
    const result = spawnSync(
      process.execPath,
      [join(typescriptDirectory, 'bin/tsc'), '-p', config, '--pretty', 'false'],
      {
        cwd: project,
        encoding: 'utf8',
        timeout: 120_000
      }
    );
    return { status: result.status, stdout: result.stdout.trim(), stderr: result.stderr };
  };
  for (const resolution of Object.keys(resolutions)) {
    assert.deepEqual(tsc(resolution, 'valid'), { status: 0, stdout: '', stderr: '' }, `${resolution}: valid compiles`);
    const wrong = tsc(resolution, 'wrong-kind');
    assert.equal(wrong.status, 2, `${resolution}: a wrong kind fails`);
    assert.equal(wrong.stderr, '');
    assert.match(
      wrong.stdout,
      /^src\/wrong-kind\.ts\(4,\d+\): error TS2322: Type '"gap"' is not assignable to type '"component-gap"'\.$/,
      `${resolution}: the only error is the kind`
    );
  }
});
