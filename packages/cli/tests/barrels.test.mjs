import assert from 'node:assert/strict';
import { mkdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { createGuard } from '../src/guard.mjs';
import { engine, json, npmViteFixture, runBin, treeHash, write } from './helpers.mjs';

// #582 (odd/tasks/doctor-barrels-582.md S2-S4): DS046 and DS047 treat a design-system component imported through a
// local barrel exactly as a direct import. The guard follows a barrel's named re-exports syntactically over the
// scanned files, with no TypeScript module resolution and no disk reads; the project's tsconfig `paths` reach it as
// data (`pathMappings`), which doctor reads from `<project>/tsconfig.json`.
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
const barrel = (...rows) => source(BARREL, lines(...rows));
const view = (rows, file = 'src/view.tsx') => source(file, rows.join('\n'));
const css = (...rules) => source('src/styles.css', rules.join('\n'));
const finding = (line, snippet, component, properties) => ({
  file: 'src/styles.css',
  line,
  snippet,
  component,
  properties
});
const structure = (line, snippet, component, selectors = [snippet]) => ({
  file: 'src/styles.css',
  line,
  snippet,
  component,
  selectors
});
const entry = (pattern, issue = 'egdev6/egdev-design-system#582') => ({
  file: 'src/styles.css',
  pattern,
  issue,
  reason: 'Temporary workaround.'
});
// The whole guard result when nothing but what a test lists is found: DS049 data and the optional DS047 and DS048
// lists are absent when empty, as they are today.
const clean = { violations: [], appearanceViolations: [], errors: [], pendingIssueCount: 0 };
const unreached = (file = BARREL) => ({ file, reexports: [], unreached: true });

test('S2 a barrel maps each re-exported name to the export and the package it re-exports', () => {
  const files = [
    barrel(
      "'use client';",
      '',
      "export { Button, Card as Panel } from '@egdev/ui';",
      "export { HomeTemplate as Home } from '@egdev/effects';"
    ),
    view([
      "import { Button, Panel, Home } from './components/egdev-ui';",
      "import * as UI from './components/egdev-ui';",
      'const a = <Button className="b" />;',
      'const c = <Panel className="p" />;',
      'const h = <Home className="h" />;',
      'const n = <UI.Panel className="n" />;'
    ]),
    css('.b { color: red; }', '.p { color: red; }', '.h { color: red; }', '.n { color: red; }')
  ];
  // Allowances are keyed by the real export and package: Card (not the alias Panel) and HomeTemplate of effects (not
  // the same name of ui) are the ones that permit `color`.
  const classNameAllows = new Map([
    ['@egdev/ui:Card', new Set(['color'])],
    ['@egdev/ui:Panel', new Set(['padding'])],
    ['@egdev/effects:HomeTemplate', new Set(['color'])],
    ['@egdev/ui:HomeTemplate', new Set(['padding'])]
  ]);
  const result = checkDesignSystem(files, [], { classNameAllows });
  assert.deepEqual(result, { ...clean, appearanceViolations: [finding(1, '.b', 'Button', ['color'])] });
});

test('S2 type-only declarations and specifiers are ignored', () => {
  const files = [
    barrel(
      "export { Button, type Card, type Field as F } from '@egdev/ui';",
      "export type { DialogContent } from '@egdev/ui';",
      "export type * from '@egdev/effects';"
    ),
    view([
      "import { Button, Card, F, DialogContent } from './components/egdev-ui';",
      'const x = <><Button className="b" /><Card className="c" /><F className="f" /><DialogContent className="d" /></>;'
    ]),
    css('.b { color: red; }', '.c { color: red; }', '.f { color: red; }', '.d { color: red; }')
  ];
  assert.deepEqual(checkDesignSystem(files, []), {
    ...clean,
    appearanceViolations: [finding(1, '.b', 'Button', ['color'])]
  });
});

const through = (specifier, { barrelFile = BARREL, importer = 'src/view.tsx', extra = [], options } = {}) =>
  checkDesignSystem(
    [
      source(barrelFile, "export { Button } from '@egdev/ui';\n"),
      source(importer, `import { Button } from '${specifier}';\nconst x = <Button className="x" />;`),
      css('.x { color: red; }'),
      ...extra
    ],
    [],
    options
  );
const reached = { ...clean, appearanceViolations: [finding(1, '.x', 'Button', ['color'])] };

test('S3 a relative import reaches the barrel as written, with an extension or as a directory index', () => {
  const rows = [
    ['a path from a sibling directory', ['./components/egdev-ui', {}]],
    ['a path from a parent directory', ['../components/egdev-ui', { importer: 'src/pages/home.tsx' }]],
    ['a path in the same directory', ['./egdev-ui', { importer: 'src/components/card.tsx' }]],
    ['the extension as written', ['./components/egdev-ui.ts', {}]],
    ['a .tsx barrel', ['./components/egdev-ui', { barrelFile: 'src/components/egdev-ui.tsx' }]],
    ['a directory with index.ts', ['./ui', { barrelFile: 'src/ui/index.ts' }]],
    ['a directory with index.tsx', ['./ui', { barrelFile: 'src/ui/index.tsx' }]],
    ['a directory path with a trailing slash', ['./ui/', { barrelFile: 'src/ui/index.ts' }]],
    ['the current directory', ['.', { barrelFile: 'src/components/index.ts', importer: 'src/components/card.tsx' }]],
    [
      'the parent directory',
      ['..', { barrelFile: 'src/components/index.ts', importer: 'src/components/inner/card.tsx' }]
    ]
  ];
  assert.deepEqual(
    Object.fromEntries(rows.map(([name, [specifier, options]]) => [name, through(specifier, options)])),
    Object.fromEntries(rows.map(([name]) => [name, reached]))
  );
});

test('S3 an import that resolves to no scanned file leaves the barrel unreached', () => {
  const rows = [
    ['a missing file', ['./components/missing', {}]],
    ['a bare specifier', ['components/egdev-ui', {}]],
    ['an alias without tsconfig paths', ['@/components/egdev-ui', {}]]
  ];
  assert.deepEqual(
    Object.fromEntries(rows.map(([name, [specifier, options]]) => [name, through(specifier, options)])),
    Object.fromEntries(rows.map(([name]) => [name, { ...clean, barrelWarnings: [unreached()] }]))
  );
  // A file outside sourceDirectory is not scanned, so it is neither a barrel nor reported.
  assert.deepEqual(through('../lib/egdev-ui', { barrelFile: 'lib/egdev-ui.ts' }), clean);
});

test('S3 probing stops at the first scanned file: .ts, then .tsx, then /index.ts, then /index.tsx', () => {
  const reexport = "export { Button } from '@egdev/ui';\n";
  const plain = 'export const answer = 42;\n';
  const importer = view(["import { Button } from './lib';", 'const x = <Button className="x" />;']);
  const run = (...files) => checkDesignSystem([...files, importer, css('.x { color: red; }')], []);
  // lib.ts is not a barrel, and it wins over the two barrels that nothing reaches.
  assert.deepEqual(
    run(source('src/lib.ts', plain), source('src/lib.tsx', reexport), source('src/lib/index.ts', reexport)),
    { ...clean, barrelWarnings: [unreached('src/lib.tsx'), unreached('src/lib/index.ts')] }
  );
  // Without lib.ts, lib.tsx wins over lib/index.ts.
  assert.deepEqual(run(source('src/lib.tsx', reexport), source('src/lib/index.ts', reexport)), {
    ...reached,
    barrelWarnings: [unreached('src/lib/index.ts')]
  });
  // Without lib.tsx, lib/index.ts wins over lib/index.tsx.
  assert.deepEqual(run(source('src/lib/index.ts', reexport), source('src/lib/index.tsx', reexport)), {
    ...reached,
    barrelWarnings: [unreached('src/lib/index.tsx')]
  });
});

const mapped = (paths, specifier, baseDirectory = '', extra = []) =>
  through(specifier, { extra, options: { pathMappings: { baseDirectory, paths: new Map(Object.entries(paths)) } } });

test('S3 compilerOptions.paths: wildcards, exact keys, the longest prefix, target order and baseUrl', () => {
  const rows = [
    ['a * wildcard', mapped({ '@/*': ['./src/*'] }, '@/components/egdev-ui')],
    ['an exact key', mapped({ '@ui': ['./src/components/egdev-ui'] }, '@ui')],
    ['a wildcard key with a target without *', mapped({ '@/*': ['./src/components/egdev-ui'] }, '@/anything')],
    ['a * after a prefix inside a segment', mapped({ '@egdev-*': ['./src/components/egdev-*'] }, '@egdev-ui')],
    ['a * before a suffix', mapped({ '*-kit': ['./src/components/*.ts'] }, 'egdev-ui-kit')],
    [
      'the longest matching prefix',
      mapped({ '@/*': ['./nope/*'], '@/components/*': ['./src/components/*'] }, '@/components/egdev-ui')
    ],
    [
      'an exact key over a wildcard',
      mapped({ '@/*': ['./nope/*'], '@/components/egdev-ui': ['./src/components/egdev-ui'] }, '@/components/egdev-ui')
    ],
    ['targets in order', mapped({ '@/*': ['./missing/*', './src/*'] }, '@/components/egdev-ui')],
    ['a catch-all key', mapped({ '*': ['./nope/*', './src/*'] }, 'components/egdev-ui')],
    ['baseUrl as the base of the targets', mapped({ '@ui/*': ['components/*'] }, '@ui/egdev-ui', 'src')],
    ['a relative specifier that ignores paths', mapped({ '*': ['./nope/*'] }, './components/egdev-ui')]
  ];
  assert.deepEqual(Object.fromEntries(rows), Object.fromEntries(rows.map(([name]) => [name, reached])));
});

test('S3 compilerOptions.paths: no matching key, a bare baseUrl, an outside target and the first target that exists', () => {
  const nonBarrel = source('src/other/components/egdev-ui.ts', 'export const answer = 42;\n');
  const rows = [
    ['no matching key', mapped({ '~/*': ['./src/*'] }, '@/components/egdev-ui')],
    ['a bare baseUrl, which resolves nothing without a paths entry', mapped({}, 'components/egdev-ui', 'src')],
    ['a target outside the scanned files', mapped({ '@/*': ['../outside/*'] }, '@/components/egdev-ui')],
    [
      'the first target that resolves, even to a file that is no barrel',
      mapped({ '@/*': ['./src/other/*', './src/*'] }, '@/components/egdev-ui', '', [nonBarrel])
    ]
  ];
  assert.deepEqual(
    Object.fromEntries(rows),
    Object.fromEntries(rows.map(([name]) => [name, { ...clean, barrelWarnings: [unreached()] }]))
  );
});

// The website shape (egdev-website): `@/components/egdev-ui` is a barrel that tsconfig.json aliases with `@/*`.
const websiteProject = (app, { tsconfig, specifier = '@/components/egdev-ui' } = {}) => {
  write(join(app.project, BARREL), lines("'use client';", '', "export { Button } from '@egdev/ui';"));
  write(
    join(app.project, 'src/Note.tsx'),
    lines(`import { Button } from '${specifier}';`, 'export const Note = () => <Button className="note" />;')
  );
  write(join(app.project, 'src/styles.css'), '.note { padding: 1px; }\n');
  if (typeof tsconfig === 'function') {
    tsconfig(app);
  } else if (tsconfig !== undefined) {
    write(join(app.project, 'tsconfig.json'), tsconfig);
  }
};
const doctorFindings = (app) => JSON.parse(runBin(['doctor', app.argument, '--json'], app.root).stdout).findings;
const ds046 = {
  code: 'DS046',
  severity: 'error',
  message: '.note on Button sets padding: use the component API or add an allowlist entry with an issue.',
  file: 'src/styles.css',
  line: 1
};
const ds049Unreached = {
  code: 'DS049',
  severity: 'warning',
  message:
    'Barrel not followed (no scanned import resolves to it): DS046 and DS047 do not check what it re-exports; import the barrel by a relative path or a tsconfig.json paths alias.',
  file: BARREL
};
// Doctor sorts findings by code, so DS046 and DS049 follow the two skipped release notices DS014 and DS017.
const afterBaseline = (baseline, ...added) => [...baseline.slice(0, 2), ...added, ...baseline.slice(2)];

test('S3 doctor reads paths and baseUrl from a tsconfig.json with comments and trailing commas', () => {
  const withComments = [
    '// Compiler options: "paths" maps "@/*" to "./src/*" (a line comment with quotes and a /* opener).',
    '{',
    '  /* A block comment: { "paths": {} } */',
    '  "compilerOptions": {',
    '    "target": "ES2022", // trailing comment',
    '    "paths": { "@/*": ["./src/*",], },',
    '  },',
    '}',
    ''
  ].join('\n');
  const withBaseUrl = json({ compilerOptions: { baseUrl: './src', paths: { '@ui/*': ['components/*'] } } });
  const cases = [
    ['comments and trailing commas', withComments, '@/components/egdev-ui'],
    ['baseUrl as the base of the targets', withBaseUrl, '@ui/egdev-ui'],
    [
      'baseUrl "." and a project-relative target',
      json({ compilerOptions: { baseUrl: '.', paths: { '~/*': ['src/*'] } } }),
      '~/components/egdev-ui'
    ]
  ];
  const results = {};
  for (const [name, tsconfig, specifier] of cases) {
    const app = fixture();
    const baseline = doctorFindings(app);
    websiteProject(app, { tsconfig, specifier });
    const before = treeHash(app.root);
    results[name] = { findings: doctorFindings(app), baseline, writes: treeHash(app.root) !== before };
  }
  assert.deepEqual(
    results,
    Object.fromEntries(
      cases.map(([name]) => [
        name,
        {
          findings: afterBaseline(results[name].baseline, ds046),
          baseline: results[name].baseline,
          writes: false
        }
      ])
    )
  );
});

test('S3 a missing, unreadable or unusable tsconfig.json adds no paths and no finding of its own', () => {
  const asDirectory = (app) => mkdirSync(join(app.project, 'tsconfig.json'));
  const extendsOnly = (app) => {
    write(join(app.project, 'tsconfig.json'), json({ extends: './tsconfig.base.json' }));
    write(join(app.project, 'tsconfig.base.json'), json({ compilerOptions: { paths: { '@/*': ['./src/*'] } } }));
  };
  const cases = [
    ['a missing file', undefined],
    ['invalid JSON', '{ "compilerOptions": '],
    ['a directory instead of a file', asDirectory],
    ['extends, which is not followed', extendsOnly],
    ['an array at the root', '[]'],
    ['paths and baseUrl of the wrong type', json({ compilerOptions: { baseUrl: 5, paths: [] } })],
    ['targets that are not arrays', json({ compilerOptions: { paths: { '@/*': './src/*' } } })]
  ];
  const results = {};
  for (const [name, tsconfig] of cases) {
    const app = fixture();
    const baseline = doctorFindings(app);
    websiteProject(app, { tsconfig });
    results[name] = { findings: doctorFindings(app), baseline };
  }
  assert.deepEqual(
    results,
    Object.fromEntries(
      cases.map(([name]) => [
        name,
        { findings: afterBaseline(results[name].baseline, ds049Unreached), baseline: results[name].baseline }
      ])
    )
  );
});

// One component per parity row: the markup differs only in the import, so the findings must be identical.
const barrelOfUi = barrel("export { Button, Card as Panel } from '@egdev/ui';");
const parityStyles = css('.x { color: red; padding: 1px; }', '.x > footer { margin: 0; }');
const parity = (name, via, direct, jsx, component) => ({ name, via, direct, jsx, component });
const parityRows = [
  parity(
    'a named import',
    "import { Button } from './components/egdev-ui';",
    "import { Button } from '@egdev/ui';",
    '<Button className="x" />',
    'Button'
  ),
  parity(
    'an aliased import',
    "import { Button as B } from './components/egdev-ui';",
    "import { Button as B } from '@egdev/ui';",
    '<B className="x" />',
    'B'
  ),
  parity(
    'a name the barrel re-exports under an alias',
    "import { Panel } from './components/egdev-ui';",
    "import { Card as Panel } from '@egdev/ui';",
    '<Panel className="x" />',
    'Panel'
  ),
  parity(
    'a namespace member',
    "import * as UI from './components/egdev-ui';",
    "import * as UI from '@egdev/ui';",
    '<UI.Button className="x" />',
    'UI.Button'
  )
];

test('S4 named, aliased and namespace imports of a barrel name give the DS046 and DS047 findings of a direct import', () => {
  const run = (files) => checkDesignSystem(files, []);
  const judged = Object.fromEntries(
    parityRows.map(({ name, via, direct, jsx }) => [
      name,
      {
        via: run([barrelOfUi, view([via, `const x = ${jsx};`]), parityStyles]),
        direct: run([view([direct, `const x = ${jsx};`]), parityStyles])
      }
    ])
  );
  const expected = (component) => ({
    ...clean,
    appearanceViolations: [finding(1, '.x', component, ['color', 'padding'])],
    structuralViolations: [structure(2, '.x > footer', component)]
  });
  assert.deepEqual(
    judged,
    Object.fromEntries(
      parityRows.map(({ name, component }) => [name, { via: expected(component), direct: expected(component) }])
    )
  );
});

test('S4 an effects barrel export uses the effects allowances and never reaches DS047', () => {
  const styles = css('.w { width: 1px; color: red; }', '.w > footer { margin: 0; }');
  const classNameAllows = new Map([
    ['@egdev/effects:Widget', new Set(['width'])],
    ['@egdev/ui:Widget', new Set(['color'])]
  ]);
  const run = (files) => checkDesignSystem(files, [], { classNameAllows });
  const via = run([
    barrel("export { Widget } from '@egdev/effects';"),
    view(["import { Widget } from './components/egdev-ui';", 'const x = <Widget className="w" />;']),
    styles
  ]);
  const direct = run([
    view(["import { Widget } from '@egdev/effects';", 'const x = <Widget className="w" />;']),
    styles
  ]);
  const expected = { ...clean, appearanceViolations: [finding(1, '.w', 'Widget', ['color'])] };
  assert.deepEqual({ via, direct }, { via: expected, direct: expected });
});

test('S4 only the names a barrel re-exports from @egdev/* are owners: wrappers and other modules are not', () => {
  const files = [
    barrel(
      "export { Card } from '@egdev/ui';",
      "export { Local } from './local';",
      "export { Other } from 'other-library';",
      'export const Wrapper = () => null;',
      'export function Fn() { return null; }'
    ),
    view([
      "import { Card, Local, Other, Wrapper, Fn, Missing } from './components/egdev-ui';",
      'const x = <><Card className="card" /><Local className="local" /><Other className="other" />',
      '  <Wrapper className="wrapper" /><Fn className="fn" /><Missing className="missing" /></>;'
    ]),
    css(...['card', 'local', 'other', 'wrapper', 'fn', 'missing'].map((name) => `.${name} { color: red; }`))
  ];
  assert.deepEqual(checkDesignSystem(files, []), {
    ...clean,
    appearanceViolations: [finding(1, '.card', 'Card', ['color'])]
  });
});

test('S4 shadowing, type-only and default imports follow the same rules as for a direct import', () => {
  const markup = (from) => [
    `import { Button } from '${from}';`,
    `import * as UI from '${from}';`,
    `import type { Card } from '${from}';`,
    `import { type Field } from '${from}';`,
    `import Dialog from '${from}';`,
    'function App(Button, UI) { return <><Button className="shadow" /><UI.Card className="shadow-ns" /></>; }',
    'const real = <><Button className="real" /><UI.Card className="real-ns" /><Card className="type-only" />',
    '  <Field className="type-spec" /><Dialog className="default" /></>;'
  ];
  const styles = css(
    ...['shadow', 'shadow-ns', 'real', 'real-ns', 'type-only', 'type-spec', 'default'].map(
      (name) => `.${name} { color: red; }`
    )
  );
  const via = checkDesignSystem(
    [barrel("export { Button, Card, Field, Dialog } from '@egdev/ui';"), view(markup('./components/egdev-ui')), styles],
    []
  );
  const direct = checkDesignSystem([view(markup('@egdev/ui')), styles], []);
  const expected = {
    ...clean,
    appearanceViolations: [finding(3, '.real', 'Button', ['color']), finding(4, '.real-ns', 'UI.Card', ['color'])]
  };
  assert.deepEqual({ via, direct }, { via: expected, direct: expected });
});

test('S4 allowlist entries match, go stale and count as pending as they do for a direct import', () => {
  const markup = (from) => [`import { Button } from '${from}';`, 'const x = <Button className="x" />;'];
  const styles = css('.x { color: red; }', '.x > footer { margin: 0; }');
  const allowlist = [entry('.x'), entry('.x > footer', 'nexo#TBD-footer'), entry('.stale')];
  const options = { localRepo: 'nexo' };
  const via = checkDesignSystem([barrelOfUi, view(markup('./components/egdev-ui')), styles], allowlist, options);
  const direct = checkDesignSystem([view(markup('@egdev/ui')), styles], allowlist, options);
  const expected = {
    ...clean,
    errors: ['src/styles.css: stale allowlist entry .stale; remove it'],
    pendingIssueCount: 1
  };
  assert.deepEqual({ via, direct }, { via: expected, direct: expected });
});

test('S4 doctor reports the same DS046 and DS047 text and JSON through a barrel as for a direct import', () => {
  const styles = '.x { padding: 1px; }\n.x > footer { margin: 0; }\n';
  const direct = fixture();
  write(
    join(direct.project, 'src/Note.tsx'),
    lines("import { DialogContent } from '@egdev/ui';", 'export const Note = () => <DialogContent className="x" />;')
  );
  write(join(direct.project, 'src/styles.css'), styles);
  const aliased = fixture();
  write(join(aliased.project, 'tsconfig.json'), json({ compilerOptions: { paths: { '@/*': ['./src/*'] } } }));
  write(join(aliased.project, BARREL), lines("'use client';", '', "export { DialogContent } from '@egdev/ui';"));
  write(
    join(aliased.project, 'src/Note.tsx'),
    lines(
      "import { DialogContent } from '@/components/egdev-ui';",
      'export const Note = () => <DialogContent className="x" />;'
    )
  );
  write(join(aliased.project, 'src/styles.css'), styles);
  const before = treeHash(aliased.root);
  const text = runBin(['doctor', aliased.argument], aliased.root);
  const parsed = runBin(['doctor', aliased.argument, '--json'], aliased.root);
  assert.equal(treeHash(aliased.root), before, 'doctor never writes');
  assert.deepEqual(
    { text, parsed },
    {
      text: runBin(['doctor', direct.argument], direct.root),
      parsed: runBin(['doctor', direct.argument, '--json'], direct.root)
    }
  );
  assert.equal(text.status, 1);
  assert.equal(text.stderr, '');
  assert.ok(
    text.stdout.includes(
      'DS046 error src/styles.css:1: .x on DialogContent sets padding: use the component API or add an allowlist entry with an issue.\n' +
        'DS047 error src/styles.css:2: .x > footer reaches into DialogContent internals: use the component API or add an allowlist entry with an issue.\n'
    )
  );
});

test('PRESERVE a barrel changes nothing for direct imports, DS040 Prose, DS041 and DS048', () => {
  const files = [
    barrel("export { Prose } from '@egdev/ui';"),
    source(
      'src/direct.tsx',
      lines(
        "import { Button } from '@egdev/ui';",
        'export const A = () => <><button type="button">Go</button><Button className="x" /></>;'
      )
    ),
    source(
      'src/prose.tsx',
      lines(
        "import { Prose } from './components/egdev-ui';",
        'export const B = () => <Prose><a href="/x">x</a><button type="button">Go</button></Prose>;'
      )
    ),
    source('src/other.tsx', 'export const C = () => <a href="/y">y</a>;\n'),
    source('src/query.ts', "export const peek = () => document.querySelector('.eg-panel');\n"),
    css('.eg-button { color: red; }', '.x { padding: 1px; }', '.x > footer { margin: 0; }')
  ];
  assert.deepEqual(checkDesignSystem(files, []), {
    violations: [
      { file: 'src/direct.tsx', line: 2, snippet: '<button type="button">' },
      { file: 'src/prose.tsx', line: 2, snippet: '<button type="button">' },
      { file: 'src/other.tsx', line: 1, snippet: '<a href="/y">' },
      { file: 'src/styles.css', line: 1, snippet: '.eg-button' }
    ],
    appearanceViolations: [finding(2, '.x', 'Button', ['padding'])],
    structuralViolations: [structure(3, '.x > footer', 'Button')],
    domViolations: [
      {
        file: 'src/query.ts',
        line: 1,
        snippet: '.eg-panel',
        call: "querySelector('.eg-panel')",
        marker: '.eg-panel'
      }
    ],
    errors: [],
    pendingIssueCount: 0
  });
});

// Independent-verification probes (odd/tasks/doctor-barrels-582.md, T2).
test('S5 a barrel mixing a named re-export with export * keeps the named owner and warns once', () => {
  const result = checkDesignSystem(
    [
      source(BARREL, "export { Button } from '@egdev/ui';\nexport * from '@egdev/effects';\n"),
      source('src/view.tsx', 'import { Button } from \'./components/egdev-ui\';\nconst x = <Button className="x" />;'),
      source('src/styles.css', '.x { color: red; }\n.x > footer { margin: 0; }\n')
    ],
    []
  );
  assert.deepEqual(result, {
    ...clean,
    appearanceViolations: [finding(1, '.x', 'Button', ['color'])],
    structuralViolations: [structure(2, '.x > footer', 'Button')],
    barrelWarnings: [{ file: BARREL, line: 2, reexports: ["export * from '@egdev/effects'"], unreached: false }]
  });
});

test('S3 a two-hop barrel, a .ts importer and a test importer do not reach the barrel', () => {
  const target = source(BARREL, "export { Button } from '@egdev/ui';\n");
  const styles = source('src/styles.css', '.x { color: red; }\n');
  const rows = {
    'two hops': [
      source('src/lib/ui.ts', "export { Button } from '../components/egdev-ui';\n"),
      source('src/view.tsx', 'import { Button } from \'./lib/ui\';\nconst x = <Button className="x" />;')
    ],
    '.ts importer': [source('src/x.ts', "import { Button } from './components/egdev-ui';\nexport const y = Button;\n")],
    'test importer': [
      source(
        'src/view.test.tsx',
        'import { Button } from \'./components/egdev-ui\';\nconst x = <Button className="x" />;'
      )
    ]
  };
  for (const [name, extra] of Object.entries(rows)) {
    assert.deepEqual(
      checkDesignSystem([target, ...extra, styles], []),
      { ...clean, barrelWarnings: [unreached()] },
      name
    );
  }
});

test('S4 export { default as Button } matches a direct default-as import', () => {
  const styles = source('src/styles.css', '.x { color: red; }\n');
  const jsx = 'const x = <Button className="x" />;';
  const via = checkDesignSystem(
    [
      source(BARREL, "export { default as Button } from '@egdev/ui';\n"),
      source('src/view.tsx', `import { Button } from './components/egdev-ui';\n${jsx}`),
      styles
    ],
    []
  );
  const direct = checkDesignSystem(
    [source('src/view.tsx', `import { default as Button } from '@egdev/ui';\n${jsx}`), styles],
    []
  );
  assert.deepEqual(via, direct);
});
