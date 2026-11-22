import assert from 'node:assert/strict';
import { readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { after, test } from 'node:test';
import { run } from '../src/cli.mjs';
import { createGuard } from '../src/guard.mjs';
import {
  CHANGELOGS_B,
  engine,
  FULL_SET,
  json,
  MANIFESTS_B,
  npmViteFixture,
  OTHER_COMMIT,
  releaseFixture,
  runBin,
  runInProcess,
  treeHash,
  write
} from './helpers.mjs';

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
const found = (result) => result.domViolations ?? [];
const dom = (file, line, snippet, call, marker) => ({ file, line, snippet, call, marker });
const entry = (file, pattern, issue = 'egdev6/egdev-design-system#530') => ({
  file,
  pattern,
  issue,
  reason: 'Temporary workaround.'
});
const message = (call, marker) =>
  `${call} depends on DS markup (${marker}): use a ref or an app-owned wrapper, or add an allowlist entry with an issue.`;

test('S7 Recado closest finds the same selector in TSX and TS with exact source locations', () => {
  const call = "closest('[data-recado-appearance] > .eg-panel')";
  const selector = '[data-recado-appearance] > .eg-panel';
  const files = [
    source('src/components/CompactNote.tsx', `// Recado\nel.${call};\n`),
    source('src/components/panel.ts', `// Recado\nel.${call};\n`)
  ];
  const result = checkDesignSystem(files, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pendingIssueCount, 0);
  assert.deepEqual(found(result), [
    dom(files[0].file, 2, selector, call, '.eg-panel'),
    dom(files[1].file, 2, selector, call, '.eg-panel')
  ]);
});

test('S7 selector methods match any receiver, optional and literal element access, and static template parts', () => {
  const lines = [
    "document.querySelector('.eg-dialog');",
    "container.querySelectorAll('.app > .eg-items');",
    "el.matches('.eg-active');",
    "el?.closest('.eg-optional');",
    "el['closest']('.eg-indexed');",
    'el.closest(`.eg-template`);',
    'el.matches(`.eg-static > [data-${state}]`);',
    "other.querySelector('.eg-any-receiver');",
    "el.closest('.eg-first, .eg-second');",
    'el.closest(`[data-kind="${kind}"] > .eg-template-tail`);'
  ];
  const file = 'src/selectors.ts';
  const result = checkDesignSystem([source(file, lines.join('\n'))], []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(found(result), [
    dom(file, 1, '.eg-dialog', "querySelector('.eg-dialog')", '.eg-dialog'),
    dom(file, 2, '.app > .eg-items', "querySelectorAll('.app > .eg-items')", '.eg-items'),
    dom(file, 3, '.eg-active', "matches('.eg-active')", '.eg-active'),
    dom(file, 4, '.eg-optional', "closest('.eg-optional')", '.eg-optional'),
    dom(file, 5, '.eg-indexed', "closest('.eg-indexed')", '.eg-indexed'),
    dom(file, 6, '.eg-template', 'closest(`.eg-template`)', '.eg-template'),
    dom(file, 7, '.eg-static > [data-', 'matches(`.eg-static > [data-${state}]`)', '.eg-static'),
    dom(file, 8, '.eg-any-receiver', "querySelector('.eg-any-receiver')", '.eg-any-receiver'),
    dom(file, 9, '.eg-first, .eg-second', "closest('.eg-first, .eg-second')", '.eg-first'),
    dom(file, 10, '"] > .eg-template-tail', 'closest(`[data-kind="${kind}"] > .eg-template-tail`)', '.eg-template-tail')
  ]);
});

test('S7 preserves literal escapes and selects the matching static template part for exceptions', () => {
  const file = 'src/escapes.ts';
  const escaped = String.raw`el.closest('\x2eeg-panel');`;
  const tail = 'el.closest(`${scope} > .eg-tail`);';
  const result = checkDesignSystem([source(file, `${escaped}\n${tail}`)], []);
  assert.deepEqual(found(result), [
    dom(file, 1, String.raw`\x2eeg-panel`, String.raw`closest('\x2eeg-panel')`, '.eg-panel'),
    dom(file, 2, '> .eg-tail', 'closest(`${scope} > .eg-tail`)', '.eg-tail')
  ]);
  const allowed = checkDesignSystem(
    [source(file, `${escaped}\n${tail}`)],
    [entry(file, String.raw`\x2eeg-panel`), entry(file, '> .eg-tail')]
  );
  assert.deepEqual(found(allowed), []);
  assert.deepEqual(allowed.errors, []);
});

test('S7 class lookups check class tokens and all static classList arguments once per call', () => {
  const lines = [
    "document.getElementsByClassName('app eg-panel');",
    "el.classList.contains('eg-panel');",
    "el.classList.add('app', 'eg-added', 'eg-other');",
    "el.classList.remove('eg-removed');",
    "el.classList.toggle('eg-toggled', active);",
    "el['classList']['add']('eg-indexed');",
    'el.classList.add(`${prefix} eg-static`);'
  ];
  const file = 'src/classes.tsx';
  const result = checkDesignSystem([source(file, lines.join('\n'))], []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(found(result), [
    dom(file, 1, 'app eg-panel', "getElementsByClassName('app eg-panel')", '.eg-panel'),
    dom(file, 2, 'eg-panel', "contains('eg-panel')", '.eg-panel'),
    dom(file, 3, 'eg-added', "add('app', 'eg-added', 'eg-other')", '.eg-added'),
    dom(file, 4, 'eg-removed', "remove('eg-removed')", '.eg-removed'),
    dom(file, 5, 'eg-toggled', "toggle('eg-toggled', active)", '.eg-toggled'),
    dom(file, 6, 'eg-indexed', "add('eg-indexed')", '.eg-indexed'),
    dom(file, 7, 'eg-static', 'add(`${prefix} eg-static`)', '.eg-static')
  ]);
});

test('S7 ignores unrelated selectors, token substrings, dynamic arguments, other methods and plain strings', () => {
  const lines = [
    "el.closest('[data-state]');",
    "el.querySelector('.app-class, .leg-x, .my-eg-x');",
    'el.querySelector(\'[data-text=".eg-attribute"]\');',
    "el.querySelector('.eg-');",
    'el.querySelector(dynamic);',
    "el.querySelector('.eg-' + name);",
    "el.matches(enabled ? '.eg-dynamic' : '.app');",
    'el.closest(`.eg-${name}`);',
    'el.closest(`[data-kind="${kind}.eg-attribute"]`);',
    "el.closest(`[data-${state === '.eg-inside-expression'}]`);",
    "el.other('.eg-other-method');",
    "el.contains('.eg-not-class-list');",
    "el.classList.contains('my-eg-x');",
    'el.classList.contains(`my-${prefix}eg-not-a-whole-token`);',
    "document.getElementsByClassName('leg-x my-eg-x eg-');",
    "const selector = '.eg-plain-string';",
    "// el.closest('.eg-comment');"
  ];
  const result = checkDesignSystem([source('src/safe.tsx', lines.join('\n'))], []);
  assert.deepEqual(found(result), []);
  assert.deepEqual(result.errors, []);
  assert.deepEqual(result.violations, []);
  assert.deepEqual(result.appearanceViolations, []);
});

test('S7 scopes TS and TSX to the configured source, excluding the guard test-file pattern', () => {
  const call = "el.closest('.eg-panel');";
  const files = [
    source('app/live.ts', call),
    source('app/live.tsx', call),
    source('app/live.test.ts', call),
    source('app/live.spec.ts', call),
    source('app/live.test.tsx', call),
    source('app/live.spec.tsx', call),
    source('app/__tests__/nested.ts', call),
    source('app/__tests__/nested.tsx', call),
    source('app/live.stories.tsx', call),
    source('src/outside.ts', call),
    source('app/view.js', call)
  ];
  const result = checkDesignSystem(files, [], { sourceDirectory: 'app' });
  assert.deepEqual(found(result), [
    dom('app/live.ts', 1, '.eg-panel', "closest('.eg-panel')", '.eg-panel'),
    dom('app/live.tsx', 1, '.eg-panel', "closest('.eg-panel')", '.eg-panel'),
    dom('app/live.stories.tsx', 1, '.eg-panel', "closest('.eg-panel')", '.eg-panel')
  ]);
  assert.deepEqual(result.errors, []);
});

test('S7 consumes normalized selector and class exceptions once per call and validates stale issues', () => {
  const file = 'src/panel.ts';
  const lines = [
    "el.closest('  [data-a]  >   .eg-panel  ');",
    "el.closest('  [data-a]  >   .eg-panel  ');",
    "el.classList.add('eg-panel');"
  ];
  const result = checkDesignSystem(
    [source(file, lines.join('\n'))],
    [
      entry(file, '[data-a] > .eg-panel', 'nexo#TBD-panel'),
      entry(file, 'eg-panel', 'wrong#42'),
      entry('src/elsewhere.ts', '[data-a] > .eg-panel')
    ]
  );
  assert.deepEqual(found(result), [
    dom(file, 2, '[data-a] > .eg-panel', "closest(' [data-a] > .eg-panel ')", '.eg-panel')
  ]);
  assert.deepEqual(result.errors, [
    'src/panel.ts: invalid issue for allowlist entry eg-panel',
    'src/elsewhere.ts: stale allowlist entry [data-a] > .eg-panel; remove it'
  ]);
  assert.equal(result.pendingIssueCount, 1);
});

test('S7 doctor emits exact Recado findings in text and JSON, including repeated calls on one line', () => {
  const app = fixture();
  const baselineText = runBin(['doctor', 'apps/hub'], app.root);
  const baselineJson = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(baselineText.status, 0);
  assert.equal(baselineText.stderr, '');
  assert.equal(baselineJson.status, 0);
  assert.equal(baselineJson.stderr, '');
  const call = "closest('[data-recado-appearance] > .eg-panel')";
  const detail = message(call, '.eg-panel');
  write(join(app.project, 'src/CompactNote.tsx'), `// Recado\nel.${call};\n`);
  write(join(app.project, 'src/panel.ts'), `el.${call}; el.${call};\n`);
  const before = treeHash(app.root);
  const rows = [
    `DS048 error src/CompactNote.tsx:2: ${detail}\n`,
    `DS048 error src/panel.ts:1: ${detail}\n`,
    `DS048 error src/panel.ts:1: ${detail}\n`
  ].join('');
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: baselineText.stdout
      .replace('DS051 skipped', `${rows}DS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '3 errors, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(baselineJson.stdout);
  const finding = (file, line) => ({ code: 'DS048', severity: 'error', message: detail, file, line });
  expected.findings.splice(
    2,
    0,
    finding('src/CompactNote.tsx', 2),
    finding('src/panel.ts', 1),
    finding('src/panel.ts', 1)
  );
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('S7 doctor honors sourceDirectory, excluded paths and test files', () => {
  const app = fixture();
  write(
    join(app.project, 'egdev-ds.json'),
    json({ schemaVersion: 1, sourceDirectory: 'app', localRepo: 'nexo', exclude: ['app/gen'] })
  );
  const baselineText = runBin(['doctor', 'apps/hub'], app.root);
  const baselineJson = runBin(['doctor', 'apps/hub', '--json'], app.root);
  assert.equal(baselineText.status, 0);
  assert.equal(baselineText.stderr, '');
  assert.equal(baselineJson.status, 0);
  assert.equal(baselineJson.stderr, '');
  const call = "closest('.eg-live')";
  const text = `el.${call};\n`;
  for (const path of [
    'app/live.ts',
    'app/gen/ignored.ts',
    'app/gen/ignored.tsx',
    'app/live.test.ts',
    'app/live.spec.tsx',
    'app/__tests__/live.ts',
    'src/outside.ts'
  ]) {
    write(join(app.project, path), text);
  }
  const before = treeHash(app.root);
  const detail = message(call, '.eg-live');
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), {
    status: 1,
    stdout: baselineText.stdout
      .replace('DS051 skipped', `DS048 error app/live.ts:1: ${detail}\nDS051 skipped`)
      .replace('0 errors, 0 warnings, 4 skipped.', '1 error, 0 warnings, 4 skipped.'),
    stderr: ''
  });
  const expected = JSON.parse(baselineJson.stdout);
  expected.findings.splice(2, 0, { code: 'DS048', severity: 'error', message: detail, file: 'app/live.ts', line: 1 });
  expected.result = 'failed';
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--json'], app.root), {
    status: 1,
    stdout: `${JSON.stringify(expected, null, 2)}\n`,
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('S7 doctor suppresses allowed calls and reports stale and pending entries with fail-on-pending', () => {
  const app = fixture();
  write(join(app.project, 'src/panel.ts'), "el.closest('[data-recado-appearance] > .eg-panel');\n");
  const entries = [
    entry('src/panel.ts', '[data-recado-appearance] > .eg-panel', 'nexo#TBD-panel'),
    entry('src/panel.ts', '.eg-gone')
  ];
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
      'DS042 error src/panel.ts: Stale allowlist entry .eg-gone; remove it.',
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
  const result = runBin(['doctor', 'apps/hub', '--json', '--fail-on-pending'], app.root);
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.deepEqual(
    JSON.parse(result.stdout).findings.map(({ code, severity }) => [code, severity]),
    [
      ['DS014', 'skipped'],
      ['DS017', 'skipped'],
      ['DS042', 'error'],
      ['DS043', 'error'],
      ['DS051', 'skipped'],
      ['DS052', 'skipped']
    ]
  );
  assert.equal(treeHash(app.root), before);
});

test('S7 pending allowlisted call alone changes only DS043 under fail-on-pending', () => {
  const app = fixture();
  write(join(app.project, 'src/panel.ts'), "el.classList.add('eg-panel');\n");
  write(
    join(app.project, 'src/design-system-allowlist.ts'),
    `export const designSystemAllowlist = ${JSON.stringify([entry('src/panel.ts', 'eg-panel', 'nexo#TBD-panel')])};\n`
  );
  const before = treeHash(app.root);
  const warning =
    'DS043 warning src/design-system-allowlist.ts: 1 allowlist entry uses nexo#TBD-* placeholders; replace it with a real issue.\n';
  const stdout = [
    'egdev-ds doctor apps/hub (npm, vite, native)',
    'DS014 skipped Release check skipped: pass --from <dir>.',
    'DS017 skipped Release check skipped: pass --from <dir>.',
    warning.trimEnd(),
    'DS051 skipped Skipped: no design/system.md in the project or up to its repository root.',
    'DS052 skipped Release check skipped: pass --from <dir>.',
    '0 errors, 1 warning, 4 skipped.',
    ''
  ].join('\n');
  assert.deepEqual(runBin(['doctor', 'apps/hub'], app.root), { status: 0, stdout, stderr: '' });
  assert.deepEqual(runBin(['doctor', 'apps/hub', '--fail-on-pending'], app.root), {
    status: 1,
    stdout: stdout.replace('DS043 warning', 'DS043 error').replace('0 errors, 1 warning', '1 error, 0 warnings'),
    stderr: ''
  });
  assert.equal(treeHash(app.root), before);
});

test('S7 keeps upgrade mitigation notices unchanged when a TS DOM query is present', async () => {
  const baseline = fixture();
  const withQuery = fixture();
  const from = releaseFixture(FULL_SET, OTHER_COMMIT, { manifests: MANIFESTS_B, changelogs: CHANGELOGS_B });
  scratch.push(from);
  const releaseFile = join(from, 'release.json');
  const release = JSON.parse(readFileSync(releaseFile, 'utf8'));
  release.resolves = [{ issue: 530, package: '@egdev/ui', version: '0.7.0' }];
  write(releaseFile, json(release));
  for (const app of [baseline, withQuery]) {
    write(
      join(app.project, 'src/design-system-allowlist.ts'),
      `export const designSystemAllowlist = ${JSON.stringify([entry('src/panel.ts', '.eg-panel')])};\n`
    );
  }
  write(join(baseline.project, 'src/panel.ts'), '// No DOM query.\n');
  write(join(withQuery.project, 'src/panel.ts'), "el.closest('.eg-panel');\n");
  const args = ['upgrade', 'apps/hub', '--from', from, '--no-install'];
  const previous = await runInProcess(run, args, baseline.root);
  assert.equal(previous.status, 0);
  assert.equal(previous.stderr, '');
  assert.ok(
    previous.stdout.includes(
      '  Remove the mitigation for egdev6/egdev-design-system#530 in src/panel.ts (resolved in @egdev/ui 0.7.0).\n'
    )
  );
  assert.deepEqual(await runInProcess(run, args, withQuery.root), previous);
});

test('S7 preserves DS040, DS041, DS046 and DS047 alongside a code finding', () => {
  const files = [
    source(
      'src/view.tsx',
      "import { Button } from '@egdev/ui'; const view = <><button /><Button className=\"x\" /></>; el.closest('.eg-panel');"
    ),
    source('src/styles.css', '.eg-button { color: red; }\n.x { padding: 1px; }\n.x > footer { margin: 0; }')
  ];
  const result = checkDesignSystem(files, []);
  assert.deepEqual(result.violations, [
    { file: 'src/view.tsx', line: 1, snippet: '<button />' },
    { file: 'src/styles.css', line: 1, snippet: '.eg-button' }
  ]);
  assert.deepEqual(result.appearanceViolations, [
    { file: 'src/styles.css', line: 2, snippet: '.x', component: 'Button', properties: ['padding'] }
  ]);
  assert.deepEqual(result.structuralViolations, [
    { file: 'src/styles.css', line: 3, snippet: '.x > footer', component: 'Button', selectors: ['.x > footer'] }
  ]);
  assert.deepEqual(found(result), [dom('src/view.tsx', 1, '.eg-panel', "closest('.eg-panel')", '.eg-panel')]);
  assert.deepEqual(result.errors, []);
  assert.equal(result.pendingIssueCount, 0);
});
