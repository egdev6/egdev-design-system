import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { createGuard } from '../src/guard.mjs';
import { engine, npmViteFixture, runBin, treeHash, write } from './helpers.mjs';

// S1 (#580): DS040 accepts a raw `a` in a file that renders `Prose`. Prose styles the bare anchors of long-form
// content at the reading size, so DS `Link` (a smaller label step) is the wrong element there. The guard resolves no
// modules, so `Prose` is recognized by its export name from any module; `button`, `input` and `label` stay reported.
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
const page = (lines) => source('src/page.tsx', lines.join('\n'));
const violation = (line, snippet, file = 'src/page.tsx') => ({ file, line, snippet });
// The whole guard result for DS040-only input: nothing but `violations` may be present.
const outcome = (violations = []) => ({ violations, appearanceViolations: [], errors: [], pendingIssueCount: 0 });
const judge = (rows) => Object.fromEntries(rows.map(([name, lines]) => [name, checkDesignSystem([page(lines)], [])]));

test('S1 DS040 accepts a raw anchor in a file that renders Prose', () => {
  const rows = [
    [
      'a named import from the package',
      ["import { Prose } from '@egdev/ui';", 'export const Page = () => <Prose><p><a href="/x">x</a></p></Prose>;']
    ],
    [
      'an aliased import, matched by its export name',
      [
        "import { Prose as Reading } from '@egdev/ui';",
        'export const Page = () => <Reading><a href="/x">x</a></Reading>;'
      ]
    ],
    [
      'a namespace member',
      ["import * as DS from '@egdev/ui';", 'export const Page = () => <DS.Prose><a href="/x">x</a></DS.Prose>;']
    ],
    [
      'an app barrel specifier',
      [
        "import { Link, Prose, Text } from '@/components/egdev-ui';",
        'export const Page = () => <Prose><a href="/x">x</a></Prose>;'
      ]
    ],
    [
      'a relative specifier',
      ["import { Prose } from './egdev-ui';", 'export const Page = () => <Prose><a href="/x">x</a></Prose>;']
    ],
    [
      'deep children: a list item and a quoted strong',
      [
        "import { Prose } from '@egdev/ui';",
        'export const Page = () => (',
        '  <Prose>',
        '    <ul>',
        '      <li><a href="/a">a</a></li>',
        '    </ul>',
        '    <blockquote>',
        '      <p><strong><a href="/b">b</a></strong></p>',
        '    </blockquote>',
        '  </Prose>',
        ');'
      ]
    ],
    [
      'a fragment, a conditional and a map callback',
      [
        "import { Prose } from '@egdev/ui';",
        'export const Page = ({ ok, items }) => (',
        '  <Prose>',
        '    <>',
        '      {ok && <a href="/x">x</a>}',
        '      {items.map((item) => <a key={item} href={item}>{item}</a>)}',
        '    </>',
        '  </Prose>',
        ');'
      ]
    ],
    [
      'attributes and a self-closing anchor',
      [
        "import { Prose } from '@egdev/ui';",
        'export const Page = () => (',
        '  <Prose>',
        '    <a href="/x" target="_blank" rel="noopener noreferrer" className="x">x</a>',
        '    <a href="/y" />',
        '  </Prose>',
        ');'
      ]
    ],
    [
      'an anchor outside the Prose element, in the same file',
      [
        "import { Prose } from '@egdev/ui';",
        'export const Page = () => (',
        '  <>',
        '    <a href="/home">Home</a>',
        '    <Prose>Text</Prose>',
        '  </>',
        ');'
      ]
    ],
    [
      'the website shape: the anchor is built in a function and Prose renders the blocks',
      [
        "import { Prose } from '@/components/egdev-ui';",
        'function createConverters() {',
        '  function renderLink(url, children) {',
        '    return <a href={url}>{children}</a>;',
        '  }',
        '  return { link: renderLink };',
        '}',
        'export function DetailProse({ blocks }) {',
        '  return <Prose size="md">{blocks}</Prose>;',
        '}'
      ]
    ],
    [
      'a self-closing Prose element',
      [
        "import { Prose } from '@egdev/ui';",
        'const link = <a href="/x">x</a>;',
        'export const Page = (props) => <Prose {...props} />;'
      ]
    ]
  ];
  assert.deepEqual(judge(rows), Object.fromEntries(rows.map(([name]) => [name, outcome()])));
});

test('S1 a file is not a Prose file when the name is not an import of the export Prose', () => {
  const link = '<a href="/x">';
  const rows = [
    [
      'a type-only import',
      ["import type { Prose } from '@egdev/ui';", 'export const Page = () => <Prose><a href="/x">x</a></Prose>;'],
      2
    ],
    [
      'a type-only specifier',
      ["import { type Prose } from '@egdev/ui';", 'export const Page = () => <Prose><a href="/x">x</a></Prose>;'],
      2
    ],
    [
      'a parameter that shadows the import',
      [
        "import { Prose } from '@egdev/ui';",
        'export function Page(Prose) {',
        '  return <Prose><a href="/x">x</a></Prose>;',
        '}'
      ],
      3
    ],
    [
      'a local that shadows the import',
      [
        "import { Prose } from '@egdev/ui';",
        'export function Page() {',
        "  const Prose = 'section';",
        '  return <Prose><a href="/x">x</a></Prose>;',
        '}'
      ],
      4
    ],
    [
      'a function declared in the file',
      [
        'export function Prose({ children }) {',
        '  return <div>{children}</div>;',
        '}',
        'export const Page = () => <Prose><a href="/x">x</a></Prose>;'
      ],
      4
    ],
    [
      'a class declared in the file',
      ['class Prose {}', 'export const Page = () => <Prose><a href="/x">x</a></Prose>;'],
      2
    ],
    [
      'a default import',
      ["import Prose from './prose';", 'export const Page = () => <Prose><a href="/x">x</a></Prose>;'],
      2
    ],
    [
      'a require call',
      ["const { Prose } = require('@egdev/ui');", 'export const Page = () => <Prose><a href="/x">x</a></Prose>;'],
      2
    ],
    [
      'a lowercase tag',
      ["import { Prose } from '@egdev/ui';", 'export const Page = () => <prose><a href="/x">x</a></prose>;'],
      2
    ],
    ['a re-export', ["export { Prose } from '@egdev/ui';", 'export const Page = () => <a href="/x">x</a>;'], 2],
    [
      'a barrel alias that renames the export',
      [
        "import { Article } from '@/components/egdev-ui';",
        'export const Page = () => <Article><a href="/x">x</a></Article>;'
      ],
      2
    ],
    [
      'an import that is never rendered',
      ["import { Prose } from '@egdev/ui';", 'export const Page = () => <a href="/x">x</a>;'],
      2
    ],
    [
      'a namespace member other than Prose',
      ["import * as DS from '@egdev/ui';", 'export const Page = () => <DS.Text><a href="/x">x</a></DS.Text>;'],
      2
    ]
  ];
  assert.deepEqual(
    judge(rows),
    Object.fromEntries(rows.map(([name, , line]) => [name, outcome([violation(line, link)])]))
  );
});

test('S1 only a is exempt: button, input and label are still reported in a file that renders Prose', () => {
  const result = checkDesignSystem(
    [
      page([
        "import { Prose } from '@egdev/ui';",
        'export const Page = () => (',
        '  <Prose>',
        '    <button type="button">Go</button>',
        '    <input />',
        '    <a href="/x">x</a>',
        '    <label htmlFor="id">Label</label>',
        '  </Prose>',
        ');'
      ])
    ],
    []
  );
  assert.deepEqual(
    result,
    outcome([violation(4, '<button type="button">'), violation(5, '<input />'), violation(7, '<label htmlFor="id">')])
  );
});

test('S1 a raw anchor is reported in a file that does not render Prose, even when another file renders it', () => {
  const files = [
    source('src/converters.tsx', 'export const renderLink = (url, children) => <a href={url}>{children}</a>;'),
    source(
      'src/article.tsx',
      [
        "import { Prose } from '@egdev/ui';",
        'export const Article = ({ children }) => <Prose>{children}</Prose>;'
      ].join('\n')
    ),
    source(
      'src/page.tsx',
      ["import { Article } from './article';", 'export const Page = () => <Article><a href="/x">x</a></Article>;'].join(
        '\n'
      )
    )
  ];
  assert.deepEqual(
    checkDesignSystem(files, []),
    outcome([violation(1, '<a href={url}>', 'src/converters.tsx'), violation(2, '<a href="/x">')])
  );
});

test('S1 the sole asChild child stays unreported in files with and without Prose', () => {
  const files = [
    source(
      'src/slot.tsx',
      [
        "import { Button } from '@egdev/ui';",
        'export const A = () => <Button asChild><a href="/x">x</a></Button>;'
      ].join('\n')
    ),
    source(
      'src/prose-slot.tsx',
      [
        "import { Button, Prose } from '@egdev/ui';",
        'export const B = () => (',
        '  <Prose>',
        '    <Button asChild><button type="button">x</button></Button>',
        '  </Prose>',
        ');'
      ].join('\n')
    )
  ];
  assert.deepEqual(checkDesignSystem(files, []), outcome());
});

const entry = (file, pattern) => ({
  file,
  pattern,
  issue: 'egdev6/egdev-design-system#580',
  reason: 'Awaiting the Prose anchor exemption.'
});
const twoAnchors = source('src/other.tsx', 'export const Links = () => <><a href="/y">y</a><a href="/y">y</a></>;');

test('S1 an allowlist entry for an exempt anchor is stale', () => {
  const files = [
    page(["import { Prose } from '@egdev/ui';", 'export const Page = () => <Prose><a href="/x">x</a></Prose>;']),
    twoAnchors
  ];
  const result = checkDesignSystem(files, [
    entry('src/page.tsx', '<a href="/x">'),
    entry('src/other.tsx', '<a href="/y">')
  ]);
  // The entry of the exempt anchor is unused. The entry of the file that does not render Prose is consumed once, so
  // the second identical anchor stays reported.
  assert.deepEqual(result, {
    ...outcome([violation(1, '<a href="/y">', 'src/other.tsx')]),
    errors: ['src/page.tsx: stale allowlist entry <a href="/x">; remove it']
  });
});

test('S1 an allowlist entry for a still-reported anchor is consumed once', () => {
  assert.deepEqual(
    checkDesignSystem([twoAnchors], [entry('src/other.tsx', '<a href="/y">')]),
    outcome([violation(1, '<a href="/y">', 'src/other.tsx')])
  );
});

test('S1 DS041, DS046, DS047 and DS048 are unchanged in a file that renders Prose', () => {
  const files = [
    page([
      "import { Prose } from '@egdev/ui';",
      'export const Page = () => (',
      '  <Prose className="post">',
      '    <a className="link" href="/x">x</a>',
      '  </Prose>',
      ');',
      "export const peek = () => document.querySelector('.eg-prose a');"
    ]),
    source(
      'src/styles.css',
      [
        '.post > a { color: red; }',
        '.post { max-width: 10px; }',
        '.link { color: red; }',
        '.eg-prose > a { color: red; }'
      ].join('\n')
    )
  ];
  const result = checkDesignSystem(files, []);
  // A class on the raw anchor has no owner (`.link` is never judged); a class on Prose keeps DS046's base list and
  // DS047 still reports the selector that reaches through it; DS041 and DS048 report as before.
  assert.deepEqual(
    result.violations.filter(({ file }) => file.endsWith('.css')),
    [violation(4, '.eg-prose > a', 'src/styles.css')]
  );
  assert.deepEqual(result.appearanceViolations, [
    { file: 'src/styles.css', line: 2, snippet: '.post', component: 'Prose', properties: ['max-width'] }
  ]);
  assert.deepEqual(result.structuralViolations, [
    { file: 'src/styles.css', line: 1, snippet: '.post > a', component: 'Prose', selectors: ['.post > a'] }
  ]);
  assert.deepEqual(result.domViolations, [
    {
      file: 'src/page.tsx',
      line: 7,
      snippet: '.eg-prose a',
      call: "querySelector('.eg-prose a')",
      marker: '.eg-prose'
    }
  ]);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pendingIssueCount, 0);
});

// The website shape (egdev-website `detail-prose.tsx`): a `'use client'` barrel re-exports `Prose`, and one file builds
// the anchor in a converter function and renders `<Prose>{blocks}</Prose>`.
const barrel = "'use client';\n\nexport { Prose } from '@egdev/ui';\n";
const converterAndProse = [
  "import { Prose } from '@/components/egdev-ui';",
  '',
  'function createConverters() {',
  '  function renderLink(url: string, children: string) {',
  '    return <a href={url}>{children}</a>;',
  '  }',
  '  return { link: renderLink };',
  '}',
  '',
  'export function DetailProse({ blocks }: { blocks: string }) {',
  '  return <Prose size="md">{createConverters().link(\'/x\', blocks)}</Prose>;',
  '}',
  ''
].join('\n');
const proseOverBlocks = [
  "import { Prose } from '@/components/egdev-ui';",
  '',
  'export function DetailProse({ blocks }: { blocks: string }) {',
  '  return <Prose size="md">{blocks}</Prose>;',
  '}',
  ''
].join('\n');
const websiteShaped = (app, content) => {
  write(join(app.project, 'src/components/egdev-ui.ts'), barrel);
  write(join(app.project, 'src/components/detail-prose.tsx'), content);
};

test('S1 doctor: a website-shaped project keeps the baseline output in text and JSON', () => {
  const app = fixture();
  const textBaseline = runBin(['doctor', 'apps/hub'], app.root);
  const jsonBaseline = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(textBaseline.status, 0);
  assert.equal(textBaseline.stderr, '');
  assert.equal(jsonBaseline.status, 0);
  assert.equal(jsonBaseline.stderr, '');
  websiteShaped(app, converterAndProse);
  const before = treeHash(app.root);
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), textBaseline);
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), jsonBaseline);
  assert.equal(treeHash(app.root), before, 'doctor never writes');
});

test('S1 doctor: the same anchor in a file that does not render Prose is one DS040 finding', () => {
  const app = fixture();
  const textBaseline = runBin(['doctor', 'apps/hub'], app.root);
  const jsonBaseline = runBin(['doctor', 'apps/hub', '--json'], app.root);
  websiteShaped(app, proseOverBlocks);
  write(
    join(app.project, 'src/components/render-link.tsx'),
    'export const renderLink = (url: string) => <a href={url}>Link</a>;\n'
  );
  const before = treeHash(app.root);
  const message = 'Raw <a href={url}>: use a DS component or add an allowlist entry with an issue.';
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: textBaseline.stdout
      .replace('DS051 skipped', `DS040 error src/components/render-link.tsx:1: ${message}\nDS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '1 error, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(jsonBaseline.stdout);
  expected.findings.splice(2, 0, {
    code: 'DS040',
    severity: 'error',
    message,
    file: 'src/components/render-link.tsx',
    line: 1
  });
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before, 'doctor never writes');
});

test('S1 doctor: an allowlist entry for an exempt anchor is a stale DS042 finding', () => {
  const app = fixture();
  const textBaseline = runBin(['doctor', 'apps/hub'], app.root);
  const jsonBaseline = runBin(['doctor', 'apps/hub', '--json'], app.root);
  websiteShaped(app, converterAndProse);
  write(
    join(app.project, 'src/design-system-allowlist.ts'),
    [
      "import type { GuardAllowlistEntry } from './design-system-guard';",
      '',
      'export const designSystemAllowlist: GuardAllowlistEntry[] = [',
      '  {',
      "    file: 'src/components/detail-prose.tsx',",
      "    pattern: '<a href={url}>',",
      "    issue: 'egdev6/egdev-design-system#580',",
      "    reason: 'Awaiting the Prose anchor exemption.'",
      '  }',
      '];',
      ''
    ].join('\n')
  );
  const before = treeHash(app.root);
  const message = 'Stale allowlist entry <a href={url}>; remove it.';
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: textBaseline.stdout
      .replace('DS051 skipped', `DS042 error src/components/detail-prose.tsx: ${message}\nDS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '1 error, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(jsonBaseline.stdout);
  expected.findings.splice(2, 0, {
    code: 'DS042',
    severity: 'error',
    message,
    file: 'src/components/detail-prose.tsx'
  });
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before, 'doctor never writes');
});
