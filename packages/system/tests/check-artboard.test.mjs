import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const cli = fileURLToPath(new URL('../src/check-artboard-cli.mjs', import.meta.url));
const fixture = (name) => fileURLToPath(new URL(`./fixtures/artboards/${name}.html`, import.meta.url));
const run = (name, ...options) =>
  spawnSync(process.execPath, [cli, fixture(name), ...(options.length ? options : ['--artifact'])], {
    encoding: 'utf8'
  });

test('reports traced values from a self-contained artboard', () => {
  const result = run('pass');
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '4 | color | var(--color-action-primary-fg) | --color-action-primary-fg',
      '5 | background-color | color-mix(in oklab, var(--color-primitive-red-neon) 60%, transparent) | --color-primitive-red-neon',
      '6 | font-family | var(--font-sans) | --font-sans',
      '7 | font-size | var(--text-body-large) | --text-body-large',
      '8 | padding | var(--spacing-4) | --spacing-4',
      '9 | border-radius | var(--radius-md) | --radius-md',
      '10 | box-shadow | var(--shadow-btn-pressed) | --shadow-btn-pressed',
      'Untraced: 0',
      ''
    ].join('\n')
  );
});

test('checks a WebTemplate and two WebSection walkthrough-shaped artboard', () => {
  const result = run('walkthrough');
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '6 | color | var(--color-action-primary-fg) | --color-action-primary-fg',
      '6 | font-family | var(--font-sans) | --font-sans',
      '7 | padding | var(--spacing-4) | --spacing-4',
      '8 | border-radius | var(--radius-md) | --radius-md',
      '8 | box-shadow | var(--shadow-btn-pressed) | --shadow-btn-pressed',
      'Untraced: 0',
      ''
    ].join('\n')
  );
});

test('checks the reported artboard while counting structural declarations separately', () => {
  const system = fileURLToPath(new URL('../system.md', import.meta.url));
  for (const options of [['--artifact'], ['--system', system]]) {
    const result = run('scope-example', ...options);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.equal(
      result.stdout,
      [
        'Line | Property | Value | Trace',
        '1 | --color-bg-canvas | #141518 | --color-bg-canvas',
        '1 | display | flex | NOT CHECKED',
        '1 | position | relative | NOT CHECKED',
        '1 | align-items | center | NOT CHECKED',
        '1 | width | 100% | NOT CHECKED',
        '1 | color | var(--color-bg-canvas) | --color-bg-canvas',
        '1 | gap | var(--spacing) | --spacing',
        'Untraced: 0',
        'Not checked: 4',
        ''
      ].join('\n')
    );
  }
});

test('counts common structural text and background layout properties', () => {
  const result = run('structural');
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '3 | text-align | center | NOT CHECKED',
      '3 | text-transform | uppercase | NOT CHECKED',
      '3 | white-space | nowrap | NOT CHECKED',
      '3 | cursor | pointer | NOT CHECKED',
      '3 | background-position | center | NOT CHECKED',
      '3 | background-repeat | no-repeat | NOT CHECKED',
      'Untraced: 0',
      'Not checked: 6',
      ''
    ].join('\n')
  );
});

test('traces spacing scale calculations and non-prefixed token names', () => {
  const system = fileURLToPath(new URL('../system.md', import.meta.url));
  for (const options of [['--artifact'], ['--system', system]]) {
    const result = run('spacing-scale', ...options);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.equal(
      result.stdout,
      [
        'Line | Property | Value | Trace',
        '3 | padding | calc(var(--spacing) * 4) | --spacing',
        '3 | inset | var(--nav-height) | --nav-height',
        '3 | width | auto | NOT CHECKED',
        '3 | height | 100% | NOT CHECKED',
        'Untraced: 0',
        'Not checked: 2',
        ''
      ].join('\n')
    );
  }
});

test('keeps unknown dimensional and colour properties and invalid calculations untraced', () => {
  const result = run('scope-rejected');
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '3 | mystery | 4px | UNTRACED',
      '3 | widget | #123456 | UNTRACED',
      '3 | padding | calc(var(--spacing) * nope) | UNTRACED',
      'Untraced: 3',
      ''
    ].join('\n')
  );
});

test('checks inline literals and token aliases in both source modes', () => {
  const system = fileURLToPath(new URL('../system.md', import.meta.url));
  for (const options of [['--artifact'], ['--system', system]]) {
    const result = run('inline', ...options);
    assert.equal(result.status, 0);
    assert.equal(result.stderr, '');
    assert.equal(
      result.stdout,
      [
        'Line | Property | Value | Trace',
        '2 | border-radius | 9.6px | --radius-md',
        '2 | padding | var(--spacing-4) | --spacing-4',
        'Untraced: 0',
        ''
      ].join('\n')
    );
  }
});

test('rejects malformed CSS without a misleading report', () => {
  const path = fileURLToPath(new URL('./fixtures/artboards/malformed.txt', import.meta.url));
  const result = spawnSync(process.execPath, [cli, path, '--artifact'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'Invalid CSS: unbalanced block\n');
});

test('rejects locally redefined token references', () => {
  const result = run('forged');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /4 \| color \| var\(--color-primitive-white\) \| UNTRACED/);
  assert.equal(result.stderr, '');
});

test('lists copied token definitions as well as their uses', () => {
  const result = run('definitions');
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '3 | --radius-md | 9.6px | --radius-md',
      '4 | border-radius | var(--radius-md) | --radius-md',
      'Untraced: 0',
      ''
    ].join('\n')
  );
});

test('does not trust an alias of an overridden token', () => {
  const result = run('alias-override');
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /4 \| color \| var\(--color-action-primary-fg\) \| UNTRACED/);
});

test('traces a transparency mix of a resolved token colour', () => {
  const result = run('mix-literal');
  assert.equal(result.status, 0);
  assert.equal(result.stderr, '');
  assert.match(result.stdout, /3 \| color \| color-mix\(in oklab, #FFFFFF 60%, transparent\) \| --color-/);
});

test('rejects external stylesheets rather than claiming a complete check', () => {
  const result = run('external');
  assert.equal(result.status, 1);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'Unsupported HTML: external stylesheet\n');
});

test('checks styles after a quoted greater-than sign', () => {
  const result = run('quoted-angle');
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    ['Line | Property | Value | Trace', '2 | color | #123456 | UNTRACED', 'Untraced: 1', ''].join('\n')
  );
});

test('reports escaped property names as gaps in styles and attributes', () => {
  const path = fileURLToPath(new URL('./fixtures/artboards/escaped-properties.txt', import.meta.url));
  const result = spawnSync(process.execPath, [cli, path, '--artifact'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '3 | c\\6flor | #123456 | UNTRACED',
      '3 | \\63 olor | var(--color-primitive-white) | UNTRACED',
      '3 | foo\\;bar | red | UNTRACED',
      '5 | \\63 olor | #123456 | UNTRACED',
      'Untraced: 4',
      ''
    ].join('\n')
  );
});

test('does not trust token references when an escaped custom property could override them', () => {
  const path = fileURLToPath(new URL('./fixtures/artboards/escaped-override.txt', import.meta.url));
  const result = spawnSync(process.execPath, [cli, path, '--artifact'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '3 | --color-\\70 rimitive-white | #123456 | UNTRACED',
      '4 | color | var(--color-primitive-white) | UNTRACED',
      'Untraced: 2',
      ''
    ].join('\n')
  );
});

test('reports otherwise unclassified declarations instead of skipping them', () => {
  const path = fileURLToPath(new URL('./fixtures/artboards/unknown-properties.txt', import.meta.url));
  const result = spawnSync(process.execPath, [cli, path, '--artifact'], { encoding: 'utf8' });
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '3 | future-property | #123456 | UNTRACED',
      '3 | display | block | NOT CHECKED',
      '3 | color | var(--color-action-primary-fg) | --color-action-primary-fg',
      'Untraced: 1',
      'Not checked: 1',
      ''
    ].join('\n')
  );
});

test('reports SVG colour properties', () => {
  const result = run('svg-color');
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    ['Line | Property | Value | Trace', '3 | stop-color | #123456 | UNTRACED', 'Untraced: 1', ''].join('\n')
  );
});

test('reports additional colour and spacing properties', () => {
  const result = run('additional');
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    [
      'Line | Property | Value | Trace',
      '3 | accent-color | #123456 | UNTRACED',
      '3 | letter-spacing | 7px | UNTRACED',
      'Untraced: 2',
      ''
    ].join('\n')
  );
});

test('reports untraced values and exits nonzero', () => {
  const result = run('fail');
  assert.equal(result.status, 1);
  assert.equal(result.stderr, '');
  assert.equal(
    result.stdout,
    ['Line | Property | Value | Trace', '4 | color | #123456 | UNTRACED', 'Untraced: 1', ''].join('\n')
  );
});
