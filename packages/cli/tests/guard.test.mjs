// AC18: the skill's guard suite (assets/guard/design-system-guard.test.ts), moved with the guard.
// Assertions are unchanged; only the runner (node:test) and the engine injection differ. The
// app-specific "guards the real hub source" case is replaced by `egdev-ds doctor` itself.
import assert from 'node:assert/strict';
import test from 'node:test';
import { createGuard } from '../src/guard.mjs';
import { engine } from './helpers.mjs';

const { checkDesignSystem } = createGuard(engine);
const it = test;
const expect = (actual) => ({
  toEqual: (expected) => assert.deepEqual(actual, expected),
  toBe: (expected) => assert.equal(actual, expected)
});

const describeViolation = ({ file, line, snippet }) =>
  `${file}:${line}: ${snippet} — Use a DS component or add an allowlist entry with an issue.`;

it('AC18 rejects new raw JSX elements, including both forms of anchor, with file, line and snippet', () => {
  const content = [
    'const View = () => <>',
    '  <button type="button">Go</button>',
    '  <input />',
    '  <a href="/">link</a>',
    '  <a>plain</a>',
    '  <label htmlFor="id">Label</label>',
    '</>;'
  ].join('\n');
  const result = checkDesignSystem([{ file: 'src/new.tsx', content }], []);
  expect(result.errors).toEqual([]);
  expect(result.violations.map(describeViolation)).toEqual([
    'src/new.tsx:2: <button type="button"> — Use a DS component or add an allowlist entry with an issue.',
    'src/new.tsx:3: <input /> — Use a DS component or add an allowlist entry with an issue.',
    'src/new.tsx:4: <a href="/"> — Use a DS component or add an allowlist entry with an issue.',
    'src/new.tsx:5: <a> — Use a DS component or add an allowlist entry with an issue.',
    'src/new.tsx:6: <label htmlFor="id"> — Use a DS component or add an allowlist entry with an issue.'
  ]);
});

it('AC18 finds DS class and all tab selector spellings, including nested and multiline rules', () => {
  const content = [
    '/* .eg-comment, [role=tab] */',
    '.local { content: ".eg-string [role=tab]"; }',
    '[data-icon=".eg-attribute"] { color: red; }',
    '.wrapper',
    '  > .eg-button,',
    '[role=\'tab\'], [role="tab"], [role=tab], [role = "tab" ] { color: red; }',
    '[role=tablist], [role="tabpanel"] { color: red; }',
    '@media (min-width: 1px) { .eg-nested { color: blue; } }'
  ].join('\n');
  const result = checkDesignSystem([{ file: 'src/new.css', content }], []);
  expect(result.violations.map(({ line, snippet }) => [line, snippet])).toEqual([
    [4, '.wrapper > .eg-button'],
    [6, "[role='tab']"],
    [6, '[role="tab"]'],
    [6, '[role=tab]'],
    [6, '[role = "tab" ]'],
    [8, '.eg-nested']
  ]);
});

it('AC18 ignores tests, theme CSS, JSX strings and comments, and non-target paths', () => {
  const files = [
    { file: 'src/view.test.tsx', content: 'const a = <button />;' },
    { file: 'src/view.spec.tsx', content: 'const a = <input />;' },
    { file: 'src/__tests__/view.tsx', content: 'const a = <label />;' },
    { file: 'src/theme/colors.css', content: '.eg-button, [role=tab] {}' },
    { file: 'elsewhere/view.tsx', content: 'const a = <a />;' },
    {
      file: 'src/view.tsx',
      content: 'const text = "<button />"; const view = <div>{/* <label /> */}<Button /></div>;'
    }
  ];
  expect(checkDesignSystem(files, []).violations).toEqual([]);
});

it('AC18 allows only the exact file and opening tag or selector, once per entry', () => {
  const files = [
    {
      file: 'src/view.tsx',
      content: 'const a = <button type="button" />; const b = <button type="button" />; const c = <button disabled />;'
    },
    { file: 'src/other.tsx', content: 'const a = <button type="button" />;' },
    { file: 'src/view.css', content: '.box .eg-button { color: red; } .box .eg-button:hover { color: blue; }' }
  ];
  const allowlist = [
    { file: 'src/view.tsx', pattern: '<button type="button" />', issue: 'nexo#12', reason: 'Temporary control.' },
    {
      file: 'src/view.css',
      pattern: '.box .eg-button',
      issue: 'egdev6/egdev-design-system#404',
      reason: 'Temporary override.'
    }
  ];
  const result = checkDesignSystem(files, allowlist);
  expect(result.errors).toEqual([]);
  expect(result.violations.map(({ file, snippet }) => [file, snippet])).toEqual([
    ['src/view.tsx', '<button type="button" />'],
    ['src/view.tsx', '<button disabled />'],
    ['src/other.tsx', '<button type="button" />'],
    ['src/view.css', '.box .eg-button:hover']
  ]);
});

it('AC18 marks a duplicate exception stale when one of its matching occurrences is removed', () => {
  const entry = { file: 'src/view.tsx', pattern: '<button />', issue: 'nexo#12', reason: 'Temporary control.' };
  const result = checkDesignSystem([{ file: 'src/view.tsx', content: 'const view = <button />;' }], [entry, entry]);
  expect(result.violations).toEqual([]);
  expect(result.errors).toEqual(['src/view.tsx: stale allowlist entry <button />; remove it']);
});

it('AC18 rejects missing or malformed issues, blank reasons and stale entries', () => {
  const source = [{ file: 'src/view.tsx', content: 'const view = <button />;' }];
  const result = checkDesignSystem(source, [
    { file: 'src/view.tsx', pattern: '<button />', issue: '', reason: ' ' },
    { file: 'src/old.css', pattern: '.eg-old', issue: 'egdev-design-system#404', reason: 'Old override.' }
  ]);
  expect(result.errors).toEqual([
    'src/view.tsx: invalid issue for allowlist entry <button />',
    'src/view.tsx: empty reason for allowlist entry <button />',
    'src/old.css: invalid issue for allowlist entry .eg-old',
    'src/old.css: stale allowlist entry .eg-old; remove it'
  ]);
});

it('AC18 tracks component gaps only while both their exact opening tag and TODO comment exist', () => {
  const pattern = '<p className="first-run__eyebrow">';
  const comment = '// TODO(egdev-design-system#TBD-section-header-rich-text): Preserve bilingual language tags.';
  const entry = {
    file: 'src/intro.tsx',
    pattern,
    comment,
    issue: 'nexo#TBD-section-header-rich-text',
    reason: 'Replace the intro when SectionHeader supports mixed-language content.',
    kind: 'component-gap'
  };
  const check = (content) => checkDesignSystem([{ file: 'src/intro.tsx', content }], [entry]);
  expect(check(`${comment}\nconst view = ${pattern}Hello</p>;`).errors).toEqual([]);
  expect(check(`${comment}\nconst view = <section />;`).errors).toEqual([
    `src/intro.tsx: stale allowlist entry ${pattern}; remove it`
  ]);
  expect(check(`const text = ${JSON.stringify(comment)}; const view = ${pattern}Hello</p>;`).errors).toEqual([
    `src/intro.tsx: stale allowlist entry ${pattern}; remove it`
  ]);
});

it('AC18 accepts visible nexo TBD placeholders without accepting arbitrary issue references', () => {
  const files = [{ file: 'src/view.tsx', content: 'const a = <button />; const b = <input />;' }];
  const result = checkDesignSystem(files, [
    { file: 'src/view.tsx', pattern: '<button />', issue: 'nexo#TBD-color-swatch', reason: 'Awaiting issue.' },
    { file: 'src/view.tsx', pattern: '<input />', issue: 'egdev6/egdev-design-system#404', reason: 'Tracked.' }
  ]);
  expect(result.errors).toEqual([]);
  expect(result.violations).toEqual([]);
  expect(result.pendingIssueCount).toBe(1);
});

it('AC18 allows a raw element only as the single Slot child of a component with asChild true', () => {
  const content = [
    'const allowed = <ListItem variant="editorial" asChild>',
    '  <a href="/post"><ListItemBody /></a>',
    '</ListItem>;',
    'const explicit = <UI.Item asChild={true}><button type="button" /></UI.Item>;',
    'const lower = <div asChild><a href="/lower" /></div>;',
    'const disabled = <Card asChild={false}><a href="/off" /></Card>;',
    'const two = <Card asChild><span /><a href="/two" /></Card>;',
    'const none = <Card><a href="/none" /></Card>;'
  ].join('\n');
  expect(
    checkDesignSystem([{ file: 'src/slot.tsx', content }], []).violations.map(({ line, snippet }) => [line, snippet])
  ).toEqual([
    [5, '<a href="/lower" />'],
    [6, '<a href="/off" />'],
    [7, '<a href="/two" />'],
    [8, '<a href="/none" />']
  ]);
});

it('AC18 uses the configured local repository for issue references and TBD placeholders', () => {
  const files = [{ file: 'src/view.tsx', content: 'const a = <button />; const b = <input />;' }];
  const result = checkDesignSystem(
    files,
    [
      { file: 'src/view.tsx', pattern: '<button />', issue: 'egdev-website#TBD-x', reason: 'Awaiting issue.' },
      { file: 'src/view.tsx', pattern: '<input />', issue: 'nexo#12', reason: 'Wrong repository.' }
    ],
    { localRepo: 'egdev-website' }
  );
  expect(result.errors).toEqual(['src/view.tsx: invalid issue for allowlist entry <input />']);
  expect(result.pendingIssueCount).toBe(1);
});

it('AC18 finds component-gap TODO comments after template literals and apostrophes in JSX text', () => {
  const pattern = '<Cluster gap={4}>';
  const comment = '// TODO(egdev-design-system#391): Replace with the DS switcher.';
  const entry = {
    file: 'src/switch.tsx',
    pattern,
    comment,
    issue: 'egdev6/egdev-design-system#391',
    reason: 'Gap.',
    kind: 'component-gap'
  };
  const content = [
    'const path = `/${locale}`;',
    "const intro = <p>Today's live</p>;",
    'const view = () => {',
    `  ${comment}`,
    `  return ${pattern}<a href={path} /></Cluster>;`,
    '};'
  ].join('\n');
  expect(checkDesignSystem([{ file: 'src/switch.tsx', content }], [entry]).errors).toEqual([]);
});

it('AC18 keeps flagging raw elements that are not the single direct Slot child', () => {
  const content = [
    'const a = <Card asChild>{ok && <a href="/c" />}</Card>;',
    'const b = <Card asChild><a href="/n"><button type="button" /></a></Card>;',
    'const c = <Card asChild="true"><a href="/s" /></Card>;',
    'const d = <Card asChild><><a href="/f" /></></Card>;',
    'const e = <Card asChild>{label}<a href="/e" /></Card>;',
    'const f = <Card {...p}><a href="/p" /></Card>;'
  ].join('\n');
  expect(
    checkDesignSystem([{ file: 'src/slot.tsx', content }], []).violations.map(({ line, snippet }) => [line, snippet])
  ).toEqual([
    [1, '<a href="/c" />'],
    [2, '<button type="button" />'],
    [3, '<a href="/s" />'],
    [4, '<a href="/f" />'],
    [5, '<a href="/e" />'],
    [6, '<a href="/p" />']
  ]);
});

it('AC18 sourceDirectory moves the guarded tree without changing the default src/', () => {
  const files = [
    { file: 'app/view.tsx', content: 'const a = <button />;' },
    { file: 'app/view.css', content: '.eg-button {}' },
    { file: 'app/skin/view.css', content: '.eg-button {}' },
    { file: 'src/view.tsx', content: 'const a = <input />;' }
  ];
  const moved = checkDesignSystem(files, [], { sourceDirectory: 'app', themeDirectory: 'app/skin/' });
  expect(moved.violations.map(({ file, snippet }) => [file, snippet])).toEqual([
    ['app/view.tsx', '<button />'],
    ['app/view.css', '.eg-button']
  ]);
  expect(checkDesignSystem(files, []).violations.map(({ file }) => file)).toEqual(['src/view.tsx']);
});
