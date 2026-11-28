import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { createGuard } from '../src/guard.mjs';
import { engine, json, npmViteFixture, runBin, treeHash, write } from './helpers.mjs';

// #582 (odd/tasks/doctor-barrels-582.md S5): DS049 is a warning for a barrel the guard cannot follow, so DS046 and
// DS047 do not check what it re-exports: an unfollowable value re-export from `@egdev/ui` or `@egdev/effects`
// (`export *`, `export * as NS`, a local re-export of an imported binding), or a barrel no scanned import resolves
// to. One finding per barrel file; no allowlist entry can suppress it and `--fail-on-pending` does not change it.
const { checkDesignSystem } = createGuard(engine);
const scratch = [];
after(() => {
  for (const path of scratch) {
    rmSync(path, { recursive: true, force: true });
  }
});
const fixture = () => {
  const app = npmViteFixture();
  scratch.push(app.root);
  return app;
};

const BARREL = 'src/components/egdev-ui.ts';
const source = (file, content) => ({ file, content });
const lines = (...rows) => `${rows.join('\n')}\n`;
const clean = { violations: [], appearanceViolations: [], errors: [], pendingIssueCount: 0 };
const star = "export * from '@egdev/ui';";

const forms = [
  ['star', ["export * from '@egdev/ui';"], 1, ["export * from '@egdev/ui'"]],
  ['star-effects', ["export * from '@egdev/effects';"], 1, ["export * from '@egdev/effects'"]],
  ['namespace', ["export * as UI from '@egdev/ui';"], 1, ["export * as UI from '@egdev/ui'"]],
  ['local', ["import { Button } from '@egdev/ui';", 'export { Button };'], 2, ['export { Button }']],
  [
    'local-alias',
    ["import { Button } from '@egdev/ui';", '', 'export { Button as UIButton };'],
    3,
    ['export { Button as UIButton }']
  ],
  ['local-namespace', ["import * as UI from '@egdev/effects';", 'export { UI };'], 2, ['export { UI }']],
  ['default', ["import { Button } from '@egdev/ui';", 'export default Button;'], 2, ['export default Button']],
  [
    'mixed-with-named',
    ["export { Card } from '@egdev/ui';", "export * from '@egdev/effects';"],
    2,
    ["export * from '@egdev/effects'"]
  ],
  [
    'list-with-local-names',
    ["import { Button } from '@egdev/ui';", "import { Local } from './local';", 'export { Button, Local };'],
    3,
    ['export { Button, Local }']
  ]
];

test('S5 an export *, an export * as NS and a local re-export of an imported binding cannot be followed', () => {
  const barrels = forms.map(([name, rows]) => source(`src/ui/${name}.ts`, lines(...rows)));
  const importer = source(
    'src/view.tsx',
    lines(...forms.map(([name], index) => `import * as B${index} from './ui/${name}';`))
  );
  assert.deepEqual(checkDesignSystem([...barrels, importer], []), {
    ...clean,
    barrelWarnings: forms.map(([name, , line, reexports]) => ({
      file: `src/ui/${name}.ts`,
      line,
      reexports,
      unreached: false
    }))
  });
});

test('S5 type-only declarations and specifiers, other modules and wrappers are no unfollowable re-export', () => {
  const quiet = [
    ['type-only declaration of a value', ["import { Button } from '@egdev/ui';", 'export type { Button };']],
    ['type-only specifier of a value', ["import { Button } from '@egdev/ui';", 'export { type Button };']],
    ['type import', ["import type { Props } from '@egdev/ui';", 'export { Props };']],
    ['type-only star', ["export type * from '@egdev/ui';"]],
    ['type-only namespace', ["export type * as T from '@egdev/effects';"]],
    ['another module', ["export * from './local';", "export * as Local from './local';"]],
    ['another package', ["export * from 'react';", "export { createElement } from 'react';"]],
    ['a binding of another module', ["import { Local } from './local';", 'export { Local };']],
    ['a wrapper', ["import { Button } from '@egdev/ui';", 'export const Wrapped = () => Button;']],
    ['an import only', ["import { Button } from '@egdev/ui';", 'export const used = [Button];']]
  ];
  // No importer reaches these files: any of them taken for a barrel would also be reported as unreached.
  const files = quiet.map(([, rows], index) => source(`src/quiet/${index}.ts`, lines(...rows)));
  assert.deepEqual(checkDesignSystem(files, []), clean, quiet.map(([name]) => name).join(', '));
});

const named = source(BARREL, lines("export { Button } from '@egdev/ui';"));
const unreached = { file: BARREL, reexports: [], unreached: true };

test('S5 a barrel that no scanned import resolves to is reported, whatever it re-exports', () => {
  const cases = [
    ['no importer at all', []],
    [
      'an alias that has no tsconfig paths',
      [source('src/view.tsx', "import { Button } from '@/components/egdev-ui';\n")]
    ],
    [
      'imports in test files only',
      [
        source('src/view.test.tsx', "import { Button } from './components/egdev-ui';\n"),
        source('src/__tests__/view.tsx', "import { Button } from '../components/egdev-ui';\n")
      ]
    ],
    ['an import in a .ts file', [source('src/model.ts', "import { Button } from './components/egdev-ui';\n")]],
    [
      'a chain through a module that is no barrel',
      [
        source('src/components/index.ts', "export * from './egdev-ui';\n"),
        source('src/view.tsx', "import { Button } from './components';\n")
      ]
    ]
  ];
  assert.deepEqual(
    Object.fromEntries(cases.map(([name, files]) => [name, checkDesignSystem([named, ...files], [])])),
    Object.fromEntries(cases.map(([name]) => [name, { ...clean, barrelWarnings: [unreached] }]))
  );
});

test('S5 a non-test .tsx import reaches the barrel, a type-only import included, and nothing is reported', () => {
  const imports = [
    "import { Button } from './components/egdev-ui';",
    "import type { Button } from './components/egdev-ui';",
    "import * as UI from './components/egdev-ui';"
  ];
  const cases = imports.map((line) => checkDesignSystem([named, source('src/view.tsx', `${line}\n`)], []));
  assert.deepEqual(cases, [clean, clean, clean]);
});

test('S5 test files are not barrels', () => {
  const files = ['src/ui.test.ts', 'src/ui.spec.tsx', 'src/__tests__/ui.ts', 'src/components/__tests__/ui.tsx'].map(
    (file) => source(file, lines(star))
  );
  assert.deepEqual(checkDesignSystem(files, []), clean);
});

test('S5 one finding per barrel lists every unfollowable re-export and adds the unreached reason', () => {
  const content = lines(
    "'use client';",
    star,
    "export { Card } from '@egdev/ui';",
    "export * as Fx from '@egdev/effects';",
    "import { Button } from '@egdev/ui';",
    'export { Button };'
  );
  assert.deepEqual(checkDesignSystem([source(BARREL, content)], []), {
    ...clean,
    barrelWarnings: [
      {
        file: BARREL,
        line: 2,
        reexports: ["export * from '@egdev/ui'", "export * as Fx from '@egdev/effects'", 'export { Button }'],
        unreached: true
      }
    ]
  });
});

test('S5 no allowlist entry can suppress DS049: it is a stale entry', () => {
  const files = [source(BARREL, lines(star)), source('src/view.tsx', "import * as UI from './components/egdev-ui';\n")];
  const allowlist = [
    { file: BARREL, pattern: "export * from '@egdev/ui'", issue: 'egdev6/egdev-design-system#582', reason: 'Barrel.' }
  ];
  assert.deepEqual(checkDesignSystem(files, allowlist), {
    ...clean,
    errors: [`${BARREL}: stale allowlist entry export * from '@egdev/ui'; remove it`],
    barrelWarnings: [{ file: BARREL, line: 1, reexports: ["export * from '@egdev/ui'"], unreached: false }]
  });
});

const message = {
  star: "Barrel not followed (export * from '@egdev/ui'): DS046 and DS047 do not check what it re-exports; re-export each component by name from its package.",
  unreached:
    'Barrel not followed (no scanned import resolves to it): DS046 and DS047 do not check what it re-exports; import the barrel by a relative path or a tsconfig.json paths alias.',
  both: 'Barrel not followed (export { Card }; no scanned import resolves to it): DS046 and DS047 do not check what it re-exports; re-export each component by name from its package and import the barrel by a relative path or a tsconfig.json paths alias.'
};
const threeBarrels = (app) => {
  write(join(app.project, 'src/ui/a-star.ts'), lines("'use client';", '', star));
  write(join(app.project, 'src/ui/b-unreached.ts'), lines("export { Button } from '@egdev/ui';"));
  write(join(app.project, 'src/ui/c-both.ts'), lines("import { Card } from '@egdev/ui';", 'export { Card };'));
  write(join(app.project, 'src/Note.tsx'), lines("import { Star } from './ui/a-star';", 'export const Note = Star;'));
};

test('S5 doctor reports DS049 as a warning with exact text and JSON, exit code 0 and no writes', () => {
  const app = fixture();
  const textBaseline = runBin(['doctor', 'apps/hub'], app.root);
  const jsonBaseline = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(textBaseline.status, 0);
  assert.equal(jsonBaseline.status, 0);
  threeBarrels(app);
  const before = treeHash(app.root);
  const lines049 = [
    `DS049 warning src/ui/a-star.ts:3: ${message.star}`,
    `DS049 warning src/ui/b-unreached.ts: ${message.unreached}`,
    `DS049 warning src/ui/c-both.ts:2: ${message.both}`
  ];
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 0,
    stdout: textBaseline.stdout
      .replace('DS051 skipped', `${lines049.join('\n')}\nDS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '0 errors, 3 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(jsonBaseline.stdout);
  expected.findings.splice(
    2,
    0,
    { code: 'DS049', severity: 'warning', message: message.star, file: 'src/ui/a-star.ts', line: 3 },
    { code: 'DS049', severity: 'warning', message: message.unreached, file: 'src/ui/b-unreached.ts' },
    { code: 'DS049', severity: 'warning', message: message.both, file: 'src/ui/c-both.ts', line: 2 }
  );
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 0,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before, 'doctor never writes');
  // A warning never decides the exit code: an error elsewhere still fails, and the warnings stay.
  write(join(app.project, 'src/Raw.tsx'), 'export const Raw = () => <button type="button">Go</button>;\n');
  const failed = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(failed.status, 1);
  const document = JSON.parse(failed.stdout);
  assert.equal(document.result, 'failed');
  assert.deepEqual(
    document.findings.map(({ code, severity }) => `${code} ${severity}`),
    [
      'DS014 skipped',
      'DS017 skipped',
      'DS040 error',
      'DS049 warning',
      'DS049 warning',
      'DS049 warning',
      'DS051 skipped',
      'DS052 skipped'
    ]
  );
});

test('S5 doctor: an allowlist entry cannot suppress DS049 and --fail-on-pending does not change it', () => {
  const app = fixture();
  write(join(app.project, BARREL), lines(star));
  write(
    join(app.project, 'src/Note.tsx'),
    lines("import * as UI from './components/egdev-ui';", 'export const Note = UI;')
  );
  write(join(app.project, 'src/Raw.tsx'), 'export const Raw = () => <button type="button">Go</button>;\n');
  const entries = [
    { file: BARREL, pattern: "export * from '@egdev/ui'", issue: 'egdev6/egdev-design-system#582', reason: 'Barrel.' },
    { file: 'src/Raw.tsx', pattern: '<button type="button">', issue: 'nexo#TBD-raw', reason: 'Pending.' }
  ];
  write(
    join(app.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify(entries)};\n`
  );
  const before = treeHash(app.root);
  const output = (pending) =>
    [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS014 skipped Release check skipped: pass --from <dir>.',
      'DS017 skipped Release check skipped: pass --from <dir>.',
      "DS042 error src/components/egdev-ui.ts: Stale allowlist entry export * from '@egdev/ui'; remove it.",
      `DS043 ${pending} src/design-system-allowlist.ts: 1 allowlist entry uses nexo#TBD-* placeholders; replace it with a real issue.`,
      `DS049 warning src/components/egdev-ui.ts:1: ${message.star}`,
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 skipped Release check skipped: pass --from <dir>.',
      pending === 'warning' ? '1 error, 2 warnings, 4 skipped.' : '2 errors, 1 warning, 4 skipped.',
      ''
    ].join('\n');
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), { status: 1, stdout: output('warning'), stderr: '' });
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending'], app.root), {
    status: 1,
    stdout: output('error'),
    stderr: ''
  });
  assert.equal(treeHash(app.root), before, 'doctor never writes');
});

test('S5 doctor honors exclude and ignores test files', () => {
  const app = fixture();
  write(join(app.project, 'egdev-ds.json'), json({ schemaVersion: 1, localRepo: 'nexo', exclude: ['src/generated'] }));
  write(join(app.project, 'src/ui/index.ts'), lines(star));
  write(join(app.project, 'src/Note.tsx'), lines("import * as UI from './ui';", 'export const Note = UI;'));
  write(join(app.project, 'src/generated/ui.ts'), lines(star));
  write(join(app.project, 'src/ui/index.test.ts'), lines(star));
  write(join(app.project, 'src/__tests__/ui.ts'), lines(star));
  const parsed = JSON.parse(runBin(['doctor', 'apps/hub', '--json'], app.root).stdout);
  assert.deepEqual(
    parsed.findings.filter(({ code }) => code === 'DS049'),
    [{ code: 'DS049', severity: 'warning', message: message.star, file: 'src/ui/index.ts', line: 1 }]
  );
});
