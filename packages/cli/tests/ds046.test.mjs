import assert from 'node:assert/strict';
import { rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { createGuard } from '../src/guard.mjs';
import { engine, json, npmViteFixture, runBin, treeHash, write } from './helpers.mjs';

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
const source = (file, content) => ({ file, content });
const view = (content) => source('src/view.tsx', content);
const css = (content) => source('src/styles.css', content);
const finding = (line, snippet, component, properties) => ({
  file: 'src/styles.css',
  line,
  snippet,
  component,
  properties
});

// S3: the guard's public result keeps DS040/DS041 violations separate from DS046 findings.
test('S3 DS046 collects static classes only on named, aliased and namespace UI imports', () => {
  const files = [
    view(
      [
        "import { ListItemTitle, IconButton as Eye } from '@egdev/ui';",
        "import * as UI from '@egdev/ui';",
        'const a = <ListItemTitle className="compact-note__title" />;',
        "const b = <Eye className={'compact-note__eye'} />;",
        'const c = <UI.ListItemTitle className={`template ${value} tail`} />;',
        "const d = <ListItemTitle className={cn('from-cn', clsx('from-clsx', value), value)} />;",
        'const e = <ListItemTitle className={dynamic} />;'
      ].join('\n')
    ),
    source(
      'src/other.tsx',
      'import { ListItemTitle } from \'./app\'; const x = <ListItemTitle className="local-only" />;'
    ),
    css(
      [
        '.compact-note__title { font-size: 1rem; font-weight: 700; }',
        '.compact-note__eye { width: 1rem; height: 1rem; }',
        '.template:hover { color: red; }',
        '.tail::before { content: ""; }',
        '.from-cn { padding: 1rem; }',
        '.from-clsx { border: 0; }',
        '.local-only { color: red; }',
        '.dynamic { color: red; }'
      ].join('\n')
    )
  ];
  const result = checkDesignSystem(files, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, [
    finding(1, '.compact-note__title', 'ListItemTitle', ['font-size', 'font-weight']),
    finding(2, '.compact-note__eye', 'Eye', ['width', 'height']),
    finding(3, '.template:hover', 'UI.ListItemTitle', ['color']),
    finding(4, '.tail::before', 'UI.ListItemTitle', ['content']),
    finding(5, '.from-cn', 'ListItemTitle', ['padding']),
    finding(6, '.from-clsx', 'ListItemTitle', ['border'])
  ]);
});

test('T1 verification collects literals throughout className expressions but ignores computed object keys', () => {
  const names = [
    'cond',
    'tern',
    'other',
    'obj-key',
    'plain',
    'shorthand',
    'obj-value',
    'array-class',
    'or-class',
    'nullish-class',
    'direct-a',
    'direct-b',
    'head',
    'inner-yes',
    'inner-template',
    'tail',
    'bare-template',
    'condition-lit'
  ];
  const ignored = ['dynamic', 'computed-key', 'computed-template', 'computed-yes', 'computed-no'];
  const files = [
    view(
      [
        "import { Button } from '@egdev/ui';",
        'const a = <Button className={cn(',
        "  on && 'cond', on ? 'tern' : 'other',",
        "  { 'obj-key': on, plain: on, shorthand, ['computed-key']: 'obj-value',",
        "    [`computed-template`]: on, [on ? 'computed-yes' : 'computed-no']: on },",
        "  [on && 'array-class', on || 'or-class', on ?? 'nullish-class']",
        ')} />;',
        "const b = <Button className={on ? 'direct-a' : 'direct-b'} />;",
        "const c = <Button className={`head ${on ? 'inner-yes' : `inner-template`} tail`} />;",
        'const d = <Button className={`bare-template`} />;',
        "const e = <Button className={mode === 'condition-lit' ? dynamic : dynamic} />;",
        'const f = <Button className={dynamic} />;'
      ].join('\n')
    ),
    css([...names, ...ignored].map((name) => `.${name} { color: red; }`).join('\n'))
  ];
  const result = checkDesignSystem(files, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pendingIssueCount, 0);
  assert.deepEqual(
    result.appearanceViolations,
    names.map((name, index) => finding(index + 1, `.${name}`, 'Button', ['color']))
  );
});

test('S3 DS046 ignores locally shadowed names instead of treating them as UI imports', () => {
  const result = checkDesignSystem(
    [
      view(
        [
          "import { Button } from '@egdev/ui';",
          "import * as UI from '@egdev/ui';",
          'function App(Button, UI) { return <><Button className="local" /><UI.IconButton className="local-ns" /></>; }',
          'const real = <><Button className="real" /><UI.IconButton className="real-ns" /></>;'
        ].join('\n')
      ),
      css('.local { color: red; } .local-ns { color: red; } .real { color: red; } .real-ns { color: red; }')
    ],
    []
  );
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.appearanceViolations, [
    finding(1, '.real', 'Button', ['color']),
    finding(1, '.real-ns', 'UI.IconButton', ['color'])
  ]);
});

test('S3 DS046 checks only the last compound and reports one finding per rule', () => {
  const result = checkDesignSystem(
    [
      view('import { Button } from \'@egdev/ui\'; const x = <Button className="target other" />;'),
      css(
        [
          '.target > footer { color: red; }',
          '.target .child { color: red; }',
          '.wrapper > .target.other:hover::before { color: red; }',
          '[data-x=".target"] { color: red; }',
          '.target, .other { color: red; }',
          '/* .target */ .unrelated { color: red; }'
        ].join('\n')
      )
    ],
    []
  );
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.appearanceViolations, [
    finding(3, '.wrapper > .target.other:hover::before', 'Button', ['color']),
    finding(5, '.target, .other', 'Button', ['color'])
  ]);
});

test('S3 DS046 recognizes classes on the subject inside selector-list pseudos without matching descendants', () => {
  const result = checkDesignSystem(
    [
      view('import { Button } from \'@egdev/ui\'; const x = <Button className="target escaped:class" />;'),
      css(
        [
          ':is(.target, .other):hover { color: red; }',
          ':where(.container > .target)::before { content: ""; }',
          '.escaped\\:class { width: 1rem; }',
          ':nth-child(2n + 1 of .target) { padding: 0; }',
          ':is(.target > footer, .other) { color: red; }',
          ':not(.target) { color: red; }',
          ':has(.target) { color: red; }'
        ].join('\n')
      )
    ],
    []
  );
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.appearanceViolations, [
    finding(1, ':is(.target, .other):hover', 'Button', ['color']),
    finding(2, ':where(.container > .target)::before', 'Button', ['content']),
    finding(3, '.escaped\\:class', 'Button', ['width']),
    finding(4, ':nth-child(2n + 1 of .target)', 'Button', ['padding'])
  ]);
});

test('S3 DS046 permits only the placement list and lists only distinct offending properties', () => {
  const result = checkDesignSystem(
    [
      view('import { IconButton } from \'@egdev/ui\'; const x = <IconButton className="layout mixed" />;'),
      css(
        [
          '.layout { --gap: 1rem; margin: 0; margin-inline: 1rem; align-self: center; justify-self: start;',
          '  place-self: center; flex: 1; flex-grow: 1; flex-shrink: 0; flex-basis: auto; order: 1;',
          '  grid-area: a; grid-column: 1; grid-column-start: 1; grid-row: 2; grid-row-end: 3; }',
          '.mixed { margin-top: 1rem; width: 2rem; --size: 2rem; height: 2rem; width: 3rem; }'
        ].join('\n')
      )
    ],
    []
  );
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, [finding(4, '.mixed', 'IconButton', ['width', 'height'])]);
});

test('S5 DS046 permits zero min-width and min-height, including units and important declarations', () => {
  const result = checkDesignSystem(
    [
      view(
        [
          "import { ListItemContent, Field } from '@egdev/ui';",
          'const content = <ListItemContent className="compact-note__content px units important" />;',
          'const field = <Field className="local-app-field" />;'
        ].join('\n')
      ),
      css(
        [
          '.compact-note__content { min-width: 0; }',
          '.local-app-field { min-width: 0; }',
          '.px { min-height: 0px; }',
          '.units { MIN-WIDTH: 0%; min-height: 0ReM; }',
          '.important { min-width: 0 !important; min-height: 0PX !IMPORTANT; }'
        ].join('\n')
      )
    ],
    []
  );
  assert.deepEqual(result, { violations: [], appearanceViolations: [], errors: [], pendingIssueCount: 0 });
});

test('S5 DS046 reports nonzero and dynamic minimums, preserves other dimensions and omits allowed zeros', () => {
  const result = checkDesignSystem(
    [
      view(
        'import { Field } from \'@egdev/ui\'; const x = <Field className="mixed length auto keyword math var dims" />;'
      ),
      css(
        [
          '.mixed { min-width: 0; font-size: 1rem; min-height: 0px; }',
          '.length { min-width: 10px; min-height: 1px; }',
          '.auto { min-width: auto; }',
          '.keyword { min-height: min-content; }',
          '.math { min-width: calc(0px); }',
          '.var { min-height: var(--size); }',
          '.dims { width: 0; max-width: 0; height: 0; max-height: 0; }'
        ].join('\n')
      )
    ],
    []
  );
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pendingIssueCount, 0);
  assert.deepEqual(result.appearanceViolations, [
    finding(1, '.mixed', 'Field', ['font-size']),
    finding(2, '.length', 'Field', ['min-width', 'min-height']),
    finding(3, '.auto', 'Field', ['min-width']),
    finding(4, '.keyword', 'Field', ['min-height']),
    finding(5, '.math', 'Field', ['min-width']),
    finding(6, '.var', 'Field', ['min-height']),
    finding(7, '.dims', 'Field', ['width', 'max-width', 'height', 'max-height'])
  ]);
});

test('T1 verification S5 accepts only the specified zero length units and percentages', () => {
  const units = [
    'px',
    'em',
    'rem',
    'ex',
    'ch',
    'cap',
    'ic',
    'lh',
    'rlh',
    'vw',
    'vh',
    'vi',
    'vb',
    'vmin',
    'vmax',
    'svw',
    'svh',
    'lvw',
    'lvh',
    'dvw',
    'dvh',
    'cqw',
    'cqh',
    'cqi',
    'cqb',
    'cqmin',
    'cqmax',
    'cm',
    'mm',
    'q',
    'in',
    'pt',
    'pc',
    '%'
  ];
  const allowed = ['', ...units]
    .flatMap((unit) => [`min-width: 0${unit.toUpperCase()} !IMPORTANT;`, `min-height: 0${unit};`])
    .join(' ');
  const invalid = [
    ['fake-width', 'min-width', '0foo'],
    ['fake-height', 'min-height', '0s'],
    ['angle', 'min-width', '0deg'],
    ['grid', 'min-height', '0fr'],
    ['compound', 'min-width', '0pxx'],
    ['decimal', 'min-height', '0.0px'],
    ['negative', 'min-width', '-0px'],
    ['nonzero', 'min-height', '0.5px']
  ];
  const names = ['safe', ...invalid.map(([name]) => name)].join(' ');
  const result = checkDesignSystem(
    [
      view(`import { Field } from '@egdev/ui'; const x = <Field className="${names}" />;`),
      css(
        [
          `.safe { ${allowed} }`,
          ...invalid.map(([name, property, value]) => `.${name} { ${property}: ${value}; }`)
        ].join('\n')
      )
    ],
    []
  );
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pendingIssueCount, 0);
  assert.deepEqual(
    result.appearanceViolations,
    invalid.map(([name, property], index) => finding(index + 2, `.${name}`, 'Field', [property]))
  );
});

test('S5 an allowlist entry for a now-allowed zero minimum becomes stale', () => {
  const result = checkDesignSystem(
    [
      view('import { Field } from \'@egdev/ui\'; const x = <Field className="local-app-field" />;'),
      css('.local-app-field { min-width: 0; }')
    ],
    [
      {
        file: 'src/styles.css',
        pattern: '.local-app-field',
        issue: 'egdev6/egdev-design-system#530',
        reason: 'Previously required.'
      }
    ]
  );
  assert.deepEqual(result, {
    violations: [],
    appearanceViolations: [],
    errors: ['src/styles.css: stale allowlist entry .local-app-field; remove it'],
    pendingIssueCount: 0
  });
});

test('S3 DS046 respects source and theme directories, ignores tests and DOM/app-only classes', () => {
  const files = [
    source('app/view.tsx', 'import { Button } from \'@egdev/ui\'; const a = <Button className="hit" />;'),
    source('app/other.tsx', 'const x = <><div className="dom" /><App className="app-only" /></>;'),
    source('app/view.test.tsx', 'import { Button } from \'@egdev/ui\'; const a = <Button className="test" />;'),
    source('app/view.spec.tsx', 'import { Button } from \'@egdev/ui\'; const a = <Button className="spec" />;'),
    source(
      'app/__tests__/view.tsx',
      'import { Button } from \'@egdev/ui\'; const a = <Button className="nested-test" />;'
    ),
    source('src/ignored.tsx', 'import { Button } from \'@egdev/ui\'; const a = <Button className="outside" />;'),
    source('app/theme/skin.css', '.hit { color: red; }'),
    source('src/ignored.css', '.hit { color: red; }'),
    source(
      'app/view.css',
      '.hit { color: red; } .dom { color: red; } .app-only { color: red; } .test { color: red; } .spec { color: red; } .nested-test { color: red; } .outside { color: red; }'
    )
  ];
  const result = checkDesignSystem(files, [], { sourceDirectory: 'app', themeDirectory: 'app/theme/' });
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, [
    { file: 'app/view.css', line: 1, snippet: '.hit', component: 'Button', properties: ['color'] }
  ]);
});

test('S3 DS046 supports media and nested rules, including nested selectors using &', () => {
  const result = checkDesignSystem(
    [
      view('import { Button } from \'@egdev/ui\'; const x = <Button className="target" />;'),
      css(
        [
          '@media (min-width: 1px) {',
          '  .parent > .target { color: red; }',
          '}',
          '.wrapper {',
          '  .target {',
          '    @media (orientation: landscape) { color: blue; }',
          '    @media (hover: hover) {',
          '      &:hover { opacity: .5; }',
          '    }',
          '    & > footer { font-weight: 700; }',
          '  }',
          '}'
        ].join('\n')
      )
    ],
    []
  );
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, [
    finding(2, '.parent > .target', 'Button', ['color']),
    finding(5, '.target', 'Button', ['color']),
    finding(8, '&:hover', 'Button', ['opacity'])
  ]);
});

test('S3 DS046 uses the guard allowlist once per rule and marks unused entries stale', () => {
  const files = [
    view('import { ListItemTitle } from \'@egdev/ui\'; const x = <ListItemTitle className="title" />;'),
    css('.title { font-size: 1rem; }\n.title { font-weight: 700; }')
  ];
  const entry = {
    file: 'src/styles.css',
    pattern: '.title',
    issue: 'egdev6/egdev-design-system#530',
    reason: 'Temporary workaround.'
  };
  const result = checkDesignSystem(files, [entry, { ...entry, pattern: '.gone' }]);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, [finding(2, '.title', 'ListItemTitle', ['font-weight'])]);
  assert.deepEqual(result.errors, ['src/styles.css: stale allowlist entry .gone; remove it']);
  assert.equal(result.pendingIssueCount, 0);
});

test('T1 verification uses normalized selectors and marks placement-only allowlist entries stale', () => {
  const files = [
    view('import { Button } from \'@egdev/ui\'; const x = <Button className="target placement" />;'),
    css('.layout\n  >  .target:hover { color: red; }\n.placement { margin: 0; min-width: 0px; }')
  ];
  const entry = { file: 'src/styles.css', issue: 'nexo#12', reason: 'Temporary.' };
  const result = checkDesignSystem(files, [
    { ...entry, pattern: '.layout > .target:hover' },
    { ...entry, pattern: '.placement' }
  ]);
  assert.deepEqual(result, {
    violations: [],
    appearanceViolations: [],
    errors: ['src/styles.css: stale allowlist entry .placement; remove it'],
    pendingIssueCount: 0
  });
});

test('S3 one allowlist entry covers both DS041 and DS046 on the same rule', () => {
  const files = [
    view('import { Button } from \'@egdev/ui\'; const x = <Button className="eg-button" />;'),
    css('.eg-button { color: red; }')
  ];
  const result = checkDesignSystem(files, [
    { file: 'src/styles.css', pattern: '.eg-button', issue: 'nexo#12', reason: 'Temporary.' }
  ]);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(result.errors, []);
});

test('S3 DS046 adds only its exact finding to an existing doctor fixture in text and JSON', () => {
  const app = fixture();
  const textBaseline = runBin(['doctor', 'apps/hub'], app.root);
  const jsonBaseline = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(textBaseline.status, 0);
  assert.equal(textBaseline.stderr, '');
  assert.equal(jsonBaseline.status, 0);
  assert.equal(jsonBaseline.stderr, '');
  write(
    join(app.project, 'src/Note.tsx'),
    'import { ListItemTitle } from \'@egdev/ui\';\nexport const Note = () => <ListItemTitle className="compact-note__title" />;\n'
  );
  write(
    join(app.project, 'src/styles.css'),
    '/* Recado */\n.compact-note__title { font-size: 1rem; font-weight: 700; }\n'
  );
  const before = treeHash(app.root);
  const message =
    '.compact-note__title on ListItemTitle sets font-size, font-weight: use the component API or add an allowlist entry with an issue.';
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: textBaseline.stdout
      .replace('DS051 skipped', `DS046 error src/styles.css:2: ${message}\nDS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '1 error, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(jsonBaseline.stdout);
  expected.findings.splice(2, 0, { code: 'DS046', severity: 'error', message, file: 'src/styles.css', line: 2 });
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('S5 doctor reports only the offending declarations in text and JSON without writes', () => {
  const app = fixture();
  const baselineText = runBin(['doctor', 'apps/hub'], app.root);
  const baselineJson = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(baselineText.status, 0);
  assert.equal(baselineText.stderr, '');
  assert.equal(baselineJson.status, 0);
  assert.equal(baselineJson.stderr, '');
  write(
    join(app.project, 'src/Example.tsx'),
    [
      "import { ListItemContent, Field } from '@egdev/ui';",
      'const content = <ListItemContent className="compact-note__content" />;',
      'const field = <Field className="local-app-field mixed length auto" />;',
      ''
    ].join('\n')
  );
  write(
    join(app.project, 'src/styles.css'),
    [
      '.compact-note__content { min-width: 0; }',
      '.local-app-field { min-width: 0; }',
      '.mixed { min-height: 0px; font-size: 1rem; }',
      '.length { min-width: 10px; }',
      '.auto { min-width: auto; }',
      ''
    ].join('\n')
  );
  const before = treeHash(app.root);
  const suffix = ': use the component API or add an allowlist entry with an issue.';
  const messages = [
    `.mixed on Field sets font-size${suffix}`,
    `.length on Field sets min-width${suffix}`,
    `.auto on Field sets min-width${suffix}`
  ];
  const lines = messages.map((message, index) => `DS046 error src/styles.css:${index + 3}: ${message}\n`).join('');
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: baselineText.stdout
      .replace('DS051 skipped', `${lines}DS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '3 errors, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(baselineJson.stdout);
  expected.findings.splice(
    2,
    0,
    ...messages.map((message, index) => ({
      code: 'DS046',
      severity: 'error',
      message,
      file: 'src/styles.css',
      line: index + 3
    }))
  );
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('T1 verification doctor skips src/gen, test sources and theme CSS while reporting live classes', () => {
  const app = fixture();
  writeFileSync(
    join(app.project, 'egdev-ds.json'),
    json({ schemaVersion: 1, localRepo: 'nexo', exclude: ['src/gen'] })
  );
  const baselineText = runBin(['doctor', 'apps/hub'], app.root);
  const baselineJson = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(baselineText.status, 0);
  assert.equal(baselineText.stderr, '');
  assert.equal(baselineJson.status, 0);
  assert.equal(baselineJson.stderr, '');
  write(
    join(app.project, 'src/Live.tsx'),
    "import { Button } from '@egdev/ui'; const x = <Button className={cn(on && 'live')} />;\n"
  );
  write(
    join(app.project, 'src/gen/Generated.tsx'),
    'import { Button } from \'@egdev/ui\'; const x = <Button className="generated-only" />;\n'
  );
  write(
    join(app.project, 'src/Live.test.tsx'),
    'import { Button } from \'@egdev/ui\'; const x = <Button className="test-only" />;\n'
  );
  write(join(app.project, 'src/gen/generated.css'), '.live { width: 2px; }\n');
  write(join(app.project, 'src/theme/extra.css'), '.live { font-size: 1rem; }\n');
  write(
    join(app.project, 'src/styles.css'),
    '.live { color: red; }\n.generated-only { color: red; }\n.test-only { color: red; }\n'
  );
  const before = treeHash(app.root);
  const message = '.live on Button sets color: use the component API or add an allowlist entry with an issue.';
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: baselineText.stdout
      .replace('DS051 skipped', `DS046 error src/styles.css:1: ${message}\nDS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '1 error, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(baselineJson.stdout);
  expected.findings.splice(2, 0, { code: 'DS046', severity: 'error', message, file: 'src/styles.css', line: 1 });
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('S3 doctor reports each same-line rule even when findings have identical text', () => {
  const app = fixture();
  const baseline = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(baseline.status, 0);
  assert.equal(baseline.stderr, '');
  write(
    join(app.project, 'src/Note.tsx'),
    'import { ListItemTitle } from \'@egdev/ui\'; const note = <ListItemTitle className="title" />;\n'
  );
  write(join(app.project, 'src/styles.css'), '.title { color: red; } .title { color: blue; }\n');
  const before = treeHash(app.root);
  const message = '.title on ListItemTitle sets color: use the component API or add an allowlist entry with an issue.';
  const entry = { code: 'DS046', severity: 'error', message, file: 'src/styles.css', line: 1 };
  const expected = JSON.parse(baseline.stdout);
  expected.findings.splice(2, 0, entry, entry);
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('S3 doctor honors excluded paths and a pending allowlisted DS046, including --fail-on-pending', () => {
  const app = fixture();
  writeFileSync(
    join(app.project, 'egdev-ds.json'),
    json({ schemaVersion: 1, localRepo: 'nexo', exclude: ['src/excluded'] })
  );
  write(
    join(app.project, 'src/Note.tsx'),
    'import { IconButton } from \'@egdev/ui\'; export const Eye = () => <IconButton className="compact-note__eye" />;\n'
  );
  write(join(app.project, 'src/styles.css'), '.compact-note__eye { width: 2rem; height: 2rem; }\n');
  write(join(app.project, 'src/excluded/ignored.css'), '.compact-note__eye { color: red; }\n');
  write(
    join(app.project, 'src/excluded/ignored.tsx'),
    'import { IconButton } from \'@egdev/ui\'; const x = <IconButton className="excluded" />;\n'
  );
  write(join(app.project, 'src/other.css'), '.excluded { color: red; }\n');
  write(join(app.project, 'src/theme/skin.css'), '.compact-note__eye { color: red; }\n');
  write(
    join(app.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify([
      { file: 'src/styles.css', pattern: '.compact-note__eye', issue: 'nexo#TBD-eye-size', reason: 'Awaiting issue.' }
    ])};\n`
  );
  const before = treeHash(app.root);
  const pending = '1 allowlist entry uses nexo#TBD-* placeholders; replace it with a real issue.';
  const output = (severity) =>
    [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS014 skipped Release check skipped: pass --from <dir>.',
      'DS017 skipped Release check skipped: pass --from <dir>.',
      `DS043 ${severity} src/design-system-allowlist.ts: ${pending}`,
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 skipped Release check skipped: pass --from <dir>.',
      severity === 'warning' ? '0 errors, 1 warning, 4 skipped.' : '1 error, 0 warnings, 4 skipped.',
      ''
    ].join('\n');
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), { status: 0, stdout: output('warning'), stderr: '' });
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending'], app.root), {
    status: 1,
    stdout: output('error'),
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});
