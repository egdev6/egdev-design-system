import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
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
const structure = (line, snippet, component, selectors = [snippet]) => ({
  file: 'src/styles.css',
  line,
  snippet,
  component,
  selectors
});
const findings = (result) => result.structuralViolations ?? [];
const ds = 'import { DialogContent } from \'@egdev/ui\'; const dialog = <DialogContent className="x" />;';
const entry = (pattern, issue = 'egdev6/egdev-design-system#530') => ({
  file: 'src/styles.css',
  pattern,
  issue,
  reason: 'Temporary workaround.'
});

test('S6 Recado structure: descendants, children, app children and sibling exclusions', () => {
  const markup = [
    "import { DialogContent } from '@egdev/ui';",
    'const dialog = <DialogContent className="note-detail"><div className="note-detail__actions" /></DialogContent>;'
  ];
  const styles = [
    '.note-detail > footer { margin: 0; }',
    '.note-detail > button { color: red; }',
    '.note-detail > header { --x: 0; }',
    '.note-detail > div:not([data-state]) { padding: 0; }',
    '.note-detail > div[data-state] { display: block; }',
    '.note-detail .note-detail__actions { padding: 0; }',
    '.note-detail + .sibling { color: red; }',
    '.note-detail ~ p { color: red; }'
  ];
  const result = checkDesignSystem([view(markup.join('\n')), css(styles.join('\n'))], []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(findings(result), [
    structure(1, '.note-detail > footer', 'DialogContent'),
    structure(2, '.note-detail > button', 'DialogContent'),
    structure(3, '.note-detail > header', 'DialogContent'),
    structure(4, '.note-detail > div:not([data-state])', 'DialogContent'),
    structure(5, '.note-detail > div[data-state]', 'DialogContent')
  ]);
});

test('S6 subjects, combinators, selector lists and DS041 are judged per selector', () => {
  const styles = [
    '.x * { margin: 0; }',
    '.x [role=dialog] { --x: 0; }',
    '.x :focus-visible { order: 1; }',
    '.x > div > span { color: red; }',
    '.x .y { color: red; }',
    '.x + .sibling > p { color: red; }',
    '.x ~ div > span { color: red; }',
    '.x > .eg-dialog { color: red; }',
    '.x + p, .x > footer, .x [role=dialog] { margin: 0; }',
    '.x > div + p { margin: 0; }',
    '.x > footer {}'
  ];
  const result = checkDesignSystem([view(ds), css(styles.join('\n'))], []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, [{ file: 'src/styles.css', line: 8, snippet: '.x > .eg-dialog' }]);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(findings(result), [
    structure(1, '.x *', 'DialogContent'),
    structure(2, '.x [role=dialog]', 'DialogContent'),
    structure(3, '.x :focus-visible', 'DialogContent'),
    structure(4, '.x > div > span', 'DialogContent'),
    structure(5, '.x .y', 'DialogContent'),
    structure(9, '.x + p, .x > footer, .x [role=dialog]', 'DialogContent', ['.x > footer', '.x [role=dialog]']),
    structure(10, '.x > div + p', 'DialogContent')
  ]);
});

test('S6 app-owned classes use the same static expression rules on any JSX tag', () => {
  const names = ['dom', 'app', 'cond', 'then', 'else', 'key', 'value', 'array', 'head', 'tail', 'escaped:class'];
  const markup = [
    ds,
    'const children = <><div className="dom" /><Local className="app" />',
    "  <span className={cn(on && 'cond', on ? 'then' : 'else', { key: on, ['computed']: 'value' }, ['array'])} />",
    '  <span className={`head ${dynamic} tail escaped:class`} /></>;',
    'const text = <span title="attribute-only" className={dynamic} />;'
  ];
  const styles = [
    ...names.map((name) => `.x > .${name.replace(':', '\\:')} { color: red; }`),
    '.x > .computed { color: red; }',
    '.x > .attribute-only { color: red; }',
    '.x > .test-only { color: red; }',
    '.dom > footer { color: red; }',
    '.app > footer { color: red; }'
  ];
  const files = [
    view(markup.join('\n')),
    source('src/only.test.tsx', 'const test = <div className="test-only" />;'),
    css(styles.join('\n'))
  ];
  const result = checkDesignSystem(files, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(findings(result), [
    structure(12, '.x > .computed', 'DialogContent'),
    structure(13, '.x > .attribute-only', 'DialogContent'),
    structure(14, '.x > .test-only', 'DialogContent')
  ]);
});

test('S6 nested, conditional and selector syntax preserve the actual subject', () => {
  const styles = [
    '@media (min-width: 1px) { .x > footer { margin: 0; } }',
    '.x {',
    '  & > footer { margin: 0; }',
    '  @media (hover: hover) { & > button { order: 1; } }',
    '  &:hover { & > header { color: red; } }',
    '  footer { margin: 0; }',
    '}',
    ':is(.x, .other) > footer { margin: 0; }',
    ':not(.x) > footer { margin: 0; }',
    '[data-text=".x > footer"] { content: ".x > footer"; }',
    '.x[data-text="a > b"]/* comment */ > div { margin: 0; }'
  ];
  const result = checkDesignSystem([view(ds), css(styles.join('\n'))], []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(findings(result), [
    structure(1, '.x > footer', 'DialogContent'),
    structure(3, '& > footer', 'DialogContent'),
    structure(4, '& > button', 'DialogContent'),
    structure(5, '& > header', 'DialogContent'),
    structure(6, 'footer', 'DialogContent'),
    structure(8, ':is(.x, .other) > footer', 'DialogContent'),
    structure(11, '.x[data-text="a > b"]/* comment */ > div', 'DialogContent')
  ]);
});

test('S6 one selector entry covers DS046 and DS047; duplicate rules and stale entries are independent', () => {
  const files = [view(ds), css('.x, .x > footer { padding: 1px; }\n.x, .x > footer { padding: 2px; }')];
  const result = checkDesignSystem(files, [entry('.x, .x > footer'), entry('.gone')]);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, [
    {
      file: 'src/styles.css',
      line: 2,
      snippet: '.x, .x > footer',
      component: 'DialogContent',
      properties: ['padding']
    }
  ]);
  assert.deepEqual(findings(result), [structure(2, '.x, .x > footer', 'DialogContent', ['.x > footer'])]);
  assert.deepEqual(result.errors, ['src/styles.css: stale allowlist entry .gone; remove it']);
  assert.equal(result.pendingIssueCount, 0);
});

test('S6 reuses an existing single-selector DS041 entry for every check on the same rule', () => {
  const files = [
    view('import { DialogContent } from \'@egdev/ui\'; const x = <DialogContent className="x eg-parent" />;'),
    css('.eg-parent > footer { margin: 0; }')
  ];
  const result = checkDesignSystem(files, [entry('.eg-parent > footer')]);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(findings(result), []);
  assert.deepEqual(result.errors, []);
});

test('S6 doctor reports exact text and JSON, with only the offending parts of a list and no writes', () => {
  const app = fixture();
  const baselineText = runBin(['doctor', 'apps/hub'], app.root);
  const baselineJson = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(baselineText.status, 0);
  assert.equal(baselineText.stderr, '');
  assert.equal(baselineJson.status, 0);
  assert.equal(baselineJson.stderr, '');
  write(join(app.project, 'src/Note.tsx'), `${ds}\n`);
  write(join(app.project, 'src/styles.css'), '/* test */\n.x + p, .x > footer, .x [role=dialog] { margin: 0; }\n');
  const before = treeHash(app.root);
  const message =
    '.x > footer, .x [role=dialog] reaches into DialogContent internals: use the component API or add an allowlist entry with an issue.';
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: baselineText.stdout
      .replace('DS051 skipped', `DS047 error src/styles.css:2: ${message}\nDS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '1 error, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(baselineJson.stdout);
  expected.findings.splice(2, 0, { code: 'DS047', severity: 'error', message, file: 'src/styles.css', line: 2 });
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('S6 doctor honors allowlist, stale and pending entries, exclusions and fail-on-pending', () => {
  const app = fixture();
  write(join(app.project, 'egdev-ds.json'), json({ schemaVersion: 1, localRepo: 'nexo', exclude: ['src/gen'] }));
  write(join(app.project, 'src/Note.tsx'), `${ds}\n`);
  write(
    join(app.project, 'src/Note.test.tsx'),
    'import { DialogContent } from \'@egdev/ui\'; const v = <DialogContent className="test-only" />;'
  );
  write(
    join(app.project, 'src/gen/Generated.tsx'),
    'import { DialogContent } from \'@egdev/ui\'; const v = <DialogContent className="excluded" />;'
  );
  write(join(app.project, 'src/gen/generated.css'), '.x > footer { padding: 0; }');
  write(join(app.project, 'src/theme/skin.css'), '.x > footer { padding: 0; }');
  write(
    join(app.project, 'src/styles.css'),
    '.x, .x > footer { padding: 0; }\n.test-only > footer { margin: 0; }\n.excluded > footer { margin: 0; }\n'
  );
  const entries = [entry('.x, .x > footer', 'nexo#TBD-dialog'), entry('.gone')];
  write(
    join(app.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify(entries)};\n`
  );
  const before = treeHash(app.root);
  const pending = '1 allowlist entry uses nexo#TBD-* placeholders; replace it with a real issue.';
  const output = (severity) =>
    [
      'egdev-ds doctor apps/hub (npm, vite, native)',
      'DS014 skipped Release check skipped: pass --from <dir>.',
      'DS017 skipped Release check skipped: pass --from <dir>.',
      'DS042 error src/styles.css: Stale allowlist entry .gone; remove it.',
      `DS043 ${severity} src/design-system-allowlist.ts: ${pending}`,
      'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
      'DS052 skipped Release check skipped: pass --from <dir>.',
      severity === 'warning' ? '1 error, 1 warning, 4 skipped.' : '2 errors, 0 warnings, 4 skipped.',
      ''
    ].join('\n');
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), { status: 1, stdout: output('warning'), stderr: '' });
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending'], app.root), {
    status: 1,
    stdout: output('error'),
    stderr: ''
  });
  const parsed = runBin(['doctor', 'apps/hub', '--fail-on-pending', '--json'], app.root);
  assert.equal(parsed.status, 1);
  assert.equal(parsed.stderr, '');
  const document = JSON.parse(parsed.stdout);
  assert.deepEqual(
    document.findings.map(({ code, severity }) => [code, severity]),
    [
      ['DS014', 'skipped'],
      ['DS017', 'skipped'],
      ['DS042', 'error'],
      ['DS043', 'error'],
      ['DS051', 'skipped'],
      ['DS052', 'skipped']
    ]
  );
  assert.equal(document.result, 'failed');
  assert.equal(treeHash(app.root), before);
});

test('S6 selector-list pseudos inspect their positive complex subjects, not negation or relationships', () => {
  const styles = [
    ':is(.x > footer) { margin: 0; }',
    ':where(.x > div > span) { margin: 0; }',
    ':is(.x > footer) :focus-visible { margin: 0; }',
    ':nth-child(2n + 1 of .x > footer) { margin: 0; }',
    ':nth-last-child(1 of .x > span) { margin: 0; }',
    ':not(:is(.x > footer)) { margin: 0; }',
    ':has(.x > footer) { margin: 0; }',
    ':is(.x + div) > footer { margin: 0; }',
    ':nth-child(1 of .x + footer) { margin: 0; }'
  ];
  const result = checkDesignSystem([view(ds), css(styles.join('\n'))], []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(findings(result), [
    structure(1, ':is(.x > footer)', 'DialogContent'),
    structure(2, ':where(.x > div > span)', 'DialogContent'),
    structure(3, ':is(.x > footer) :focus-visible', 'DialogContent'),
    structure(4, ':nth-child(2n + 1 of .x > footer)', 'DialogContent'),
    structure(5, ':nth-last-child(1 of .x > span)', 'DialogContent')
  ]);
});

test('S6 nesting in positive pseudo alternatives distinguishes children from siblings', () => {
  const styles = [
    '.x {',
    '  :is(& + footer) { margin: 0; }',
    '  :where(& ~ footer) { margin: 0; }',
    '  :is(& > footer) { margin: 0; }',
    '  :where(& span) { margin: 0; }',
    '}',
    '.x > :is(.own, footer) { margin: 0; }'
  ];
  const files = [view(`${ds}\nconst child = <div className="own" />;`), css(styles.join('\n'))];
  const result = checkDesignSystem(files, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(findings(result), [
    structure(4, ':is(& > footer)', 'DialogContent'),
    structure(5, ':where(& span)', 'DialogContent'),
    structure(7, '.x > :is(.own, footer)', 'DialogContent')
  ]);
});

test('S6 allowlist is per rule even for identical same-line selectors and declaration-free rules', () => {
  const files = [
    view('import { DialogContent } from \'@egdev/ui\'; const d = <DialogContent className="eg-parent" />;'),
    css('.eg-parent > footer {} .eg-parent > footer { margin: 0; }')
  ];
  const result = checkDesignSystem(files, [entry('.eg-parent > footer')]);
  assert.deepEqual(result.violations, [{ file: 'src/styles.css', line: 1, snippet: '.eg-parent > footer' }]);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(findings(result), [structure(1, '.eg-parent > footer', 'DialogContent')]);
  assert.deepEqual(result.errors, []);
});

test('S6 a full selector-list exception covers DS041, DS046 and DS047 on the same rule', () => {
  const files = [
    view('import { DialogContent } from \'@egdev/ui\'; const d = <DialogContent className="x eg-parent" />;'),
    css('.eg-parent, .x > footer { padding: 0; }')
  ];
  const result = checkDesignSystem(files, [entry('.eg-parent, .x > footer')]);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(findings(result), []);
  assert.deepEqual(result.errors, []);
});

test('S6 pending DS047-only allowlist entry changes only DS043 with fail-on-pending', () => {
  const app = fixture();
  write(join(app.project, 'src/Note.tsx'), `${ds}\n`);
  write(join(app.project, 'src/styles.css'), '.x > footer { margin: 0; }\n');
  const entries = [entry('.x > footer', 'nexo#TBD-dialog')];
  write(
    join(app.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify(entries)};\n`
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

test('S3-S5 existing raw, internal and appearance results stay unchanged alongside DS047', () => {
  const files = [
    view('import { Button } from \'@egdev/ui\'; const view = <><button /><Button className="x" /></>;'),
    css('.eg-button { color: red; }\n.x { min-width: 0; padding: 1px; }\n.x > footer { margin: 0; }')
  ];
  const result = checkDesignSystem(files, []);
  assert.deepEqual(result.violations, [
    { file: 'src/view.tsx', line: 1, snippet: '<button />' },
    { file: 'src/styles.css', line: 1, snippet: '.eg-button' }
  ]);
  assert.deepEqual(result.appearanceViolations, [
    { file: 'src/styles.css', line: 2, snippet: '.x', component: 'Button', properties: ['padding'] }
  ]);
  assert.deepEqual(findings(result), [structure(3, '.x > footer', 'Button')]);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pendingIssueCount, 0);
});
