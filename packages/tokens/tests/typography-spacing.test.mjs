import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { toDeclarationMap } from '../scripts/token-css.mjs';

// Test-only contract for issue #10. The single value source is src/theme.css; the
// literals below describe the expected contract and never feed production code.
const at = (path) => fileURLToPath(new URL(path, import.meta.url));
const themeSource = readFileSync(at('../src/theme.css'), 'utf8');

const blockOf = (source, header) => {
  const escaped = header.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return source.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\n\\}`))?.[1] ?? '';
};

const staticBlock = blockOf(themeSource, '@theme static');

// Approved typography recipes from docs/tokens-reference.md. Family and casing are
// documented next to the CSS, never published as new tokens. Sizes are the #218
// global scale ×0.8 of the originally approved px values (exact sub-pixel, L8 OQ1).
const TYPOGRAPHY = [
  { name: 'display-hero', size: '44.8px', lineHeight: '1.1', fontWeight: '800', letterSpacing: '0' },
  { name: 'display-show', size: '76.8px', lineHeight: '0.9', fontWeight: '800', letterSpacing: '0' },
  { name: 'display-pro', size: '51.2px', lineHeight: '0.95', fontWeight: '800', letterSpacing: '0' },
  { name: 'heading-section', size: '32px', lineHeight: '1.2', fontWeight: '800', letterSpacing: '0' },
  { name: 'heading-small', size: '19.2px', lineHeight: '1.2', fontWeight: '700', letterSpacing: '0' },
  { name: 'body-large', size: '16px', lineHeight: '1.6', fontWeight: '500', letterSpacing: '0' },
  { name: 'body-default', size: '12.8px', lineHeight: '1.6', fontWeight: '500', letterSpacing: '0' },
  { name: 'body-muted', size: '16px', lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' },
  { name: 'label-default', size: '11.2px', lineHeight: '1.2', fontWeight: '600', letterSpacing: '0' },
  { name: 'label-eyebrow', size: '11.2px', lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.12em' },
  { name: 'meta', size: '11.2px', lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.08em' },
  { name: 'cta-label', size: '12.8px', lineHeight: '1.2', fontWeight: '700', letterSpacing: '0' },
  { name: 'code', size: '11.2px', lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' }
];

// Fluid Title recipes approved for Text/Heading (#108 D8): exact legacy .eg-title clamps
// scaled ×0.8 end to end, midpoint included (#218).
const TITLE_TYPOGRAPHY = [
  {
    name: 'title-section',
    size: 'clamp(32px, 4.48vw, 51.2px)',
    lineHeight: '0.9',
    fontWeight: '800',
    letterSpacing: '0'
  },
  {
    name: 'title-hero',
    size: 'clamp(48px, 7.2vw, 112px)',
    lineHeight: '0.86',
    fontWeight: '800',
    letterSpacing: '0'
  },
  {
    name: 'title-show',
    size: 'clamp(44.8px, 6.56vw, 105.6px)',
    lineHeight: '0.86',
    fontWeight: '800',
    letterSpacing: '0'
  },
  {
    name: 'title-display',
    size: 'clamp(51.2px, 7.68vw, 131.2px)',
    lineHeight: '0.82',
    fontWeight: '800',
    letterSpacing: '0'
  }
];

// Fixed Stat figure recipes approved for Stat (#70 D6): legacy .eg-stat__value 36px and --sm 28px,
// scaled ×0.8 by #218.
const STAT_TYPOGRAPHY = [
  { name: 'display-stat', size: '28.8px', lineHeight: '1', fontWeight: '800', letterSpacing: '0' },
  { name: 'display-stat-sm', size: '22.4px', lineHeight: '1', fontWeight: '800', letterSpacing: '0' }
];

// Countdown digit recipes approved by the owner for #82 (2026-10-26): exact source clamps,
// scaled ×0.8 by #218.
const COUNTDOWN_TYPOGRAPHY = [
  {
    name: 'countdown-md',
    size: 'clamp(41.6px, 4.8vw, 76.8px)',
    lineHeight: '0.85',
    fontWeight: '800',
    letterSpacing: '0'
  },
  {
    name: 'countdown-sm',
    size: 'clamp(28.8px, 3.2vw, 44.8px)',
    lineHeight: '0.85',
    fontWeight: '800',
    letterSpacing: '0'
  }
];

// Countdown spacing approved with the recipes above: responsive column gap and minimum digit measure.
const COUNTDOWN_SPACING = [
  ['--spacing-countdown-column', 'clamp(11.2px, 1.76vw, 25.6px)'],
  ['--spacing-countdown-unit', '1.9ch']
];

// Fluid quotation recipes approved for PullQuote (#98 D7): exact legacy .eg-quote__text clamps,
// scaled ×0.8 by #218.
const QUOTE_TYPOGRAPHY = [
  {
    name: 'quote-pull',
    size: 'clamp(15.2px, 1.36vw, 18.4px)',
    lineHeight: '1.4',
    fontWeight: '500',
    letterSpacing: '0'
  },
  {
    name: 'quote-display',
    size: 'clamp(38.4px, 4.96vw, 80px)',
    lineHeight: '0.86',
    fontWeight: '800',
    letterSpacing: '0'
  }
];

const SPACING_STEPS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '10', '12', '14', '16', '20', '24'];

const findRecipeDrift = (css, recipes) => {
  const declarations = toDeclarationMap(css);
  const drift = [];
  for (const recipe of recipes) {
    const expected = [
      [`--text-${recipe.name}`, recipe.size],
      [`--text-${recipe.name}--line-height`, recipe.lineHeight],
      [`--text-${recipe.name}--font-weight`, recipe.fontWeight],
      [`--text-${recipe.name}--letter-spacing`, recipe.letterSpacing]
    ];
    for (const [name, value] of expected) {
      if (declarations.get(name) !== value) {
        drift.push(`${name}: ${declarations.get(name)} != ${value}`);
      }
    }
  }
  return drift;
};

const findSpacingDrift = (css, steps) => {
  const declarations = toDeclarationMap(css);
  const drift = [];
  if (declarations.get('--spacing') !== 'var(--space-1)') {
    drift.push(`--spacing: ${declarations.get('--spacing')} != var(--space-1)`);
  }
  for (const step of steps) {
    if (declarations.get(`--spacing-${step}`) !== `var(--space-${step})`) {
      drift.push(`--spacing-${step}: ${declarations.get(`--spacing-${step}`)} != var(--space-${step})`);
    }
  }
  return drift;
};

test('static theme publishes the 13 typography recipes with Tailwind companion fields', () => {
  assert.deepEqual(
    findRecipeDrift(staticBlock, TYPOGRAPHY),
    [],
    'typography recipes must match the approved size/line/weight/tracking contract'
  );
});

test('static theme publishes the partial navigation row size and retains its reused tokens', () => {
  const declarations = toDeclarationMap(staticBlock);
  assert.deepEqual(
    [...declarations].filter(([name]) => name === '--text-nav-row' || name.startsWith('--text-nav-row--')),
    [['--text-nav-row', '13.5px']]
  );
  assert.equal(declarations.get('--font-sans'), '"Barlow", system-ui, sans-serif');
  assert.equal(declarations.get('--text-label-default--line-height'), '1.2');
  assert.equal(declarations.get('--text-label-default--letter-spacing'), '0');
  assert.equal(declarations.get('--text-body-muted--font-weight'), '400');
});

test('static theme publishes the partial navigation group recipe and retains its reused tokens', () => {
  const declarations = toDeclarationMap(staticBlock);
  assert.deepEqual(
    [...declarations].filter(([name]) => name === '--text-nav-group' || name.startsWith('--text-nav-group--')),
    [
      ['--text-nav-group', '14px'],
      ['--text-nav-group--line-height', '1'],
      ['--text-nav-group--letter-spacing', '0.14em']
    ]
  );
  assert.equal(declarations.get('--font-display'), '"Barlow Condensed", "Arial Narrow", sans-serif');
  assert.equal(declarations.get('--text-label-eyebrow--font-weight'), '700');
});

test('static theme publishes only the navigation count size and reuses mono, leading and weight', () => {
  const declarations = toDeclarationMap(staticBlock);
  assert.deepEqual(
    [...declarations].filter(([name]) => name === '--text-nav-count' || name.startsWith('--text-nav-count--')),
    [['--text-nav-count', '11.5px']]
  );
  assert.equal(declarations.get('--font-mono'), '"JetBrains Mono", ui-monospace, monospace');
  assert.equal(declarations.get('--text-nav-group--line-height'), '1');
  assert.equal(declarations.get('--text-label-default--font-weight'), '600');
});

test('static theme publishes the four fluid Title recipes and the hero glyph glow (#108 D8/D9)', () => {
  assert.deepEqual(findRecipeDrift(staticBlock, TITLE_TYPOGRAPHY), [], 'Title recipes must match the approved clamps');
  assert.equal(
    toDeclarationMap(staticBlock).get('--text-shadow-title-hero'),
    '0 0 40px var(--color-alpha-red-30)',
    'hero accent glow must be a text-shadow token, never a box-shadow reuse'
  );
});

test('static theme publishes the two fixed Stat figure recipes (#70 D6)', () => {
  assert.deepEqual(findRecipeDrift(staticBlock, STAT_TYPOGRAPHY), [], 'Stat recipes must match the approved values');
});

test('static theme publishes the two Countdown digit recipes and their spacing (#82)', () => {
  assert.deepEqual(
    findRecipeDrift(staticBlock, COUNTDOWN_TYPOGRAPHY),
    [],
    'Countdown recipes must match the approved clamps'
  );
  const declarations = toDeclarationMap(staticBlock);
  for (const [name, value] of COUNTDOWN_SPACING) {
    assert.equal(declarations.get(name), value, `${name} must keep its approved value`);
  }
  for (const [name] of COUNTDOWN_SPACING) {
    assert.equal(
      toDeclarationMap(blockOf(themeSource, '@theme inline static')).has(name),
      false,
      `${name} stays static`
    );
  }
});

test('altered Countdown recipes and spacing are detected as drift', () => {
  const altered = themeSource.replace(
    '--text-countdown-sm--line-height: 0.85;',
    '--text-countdown-sm--line-height: 0.9;'
  );
  assert.deepEqual(findRecipeDrift(blockOf(altered, '@theme static'), COUNTDOWN_TYPOGRAPHY), [
    '--text-countdown-sm--line-height: 0.9 != 0.85'
  ]);
  const shifted = themeSource.replace('--spacing-countdown-unit: 1.9ch;', '--spacing-countdown-unit: 2ch;');
  assert.equal(toDeclarationMap(blockOf(shifted, '@theme static')).get('--spacing-countdown-unit'), '2ch');
  assert.notEqual(
    toDeclarationMap(blockOf(shifted, '@theme static')).get('--spacing-countdown-unit'),
    COUNTDOWN_SPACING[1][1]
  );
});

test('static theme publishes the two fluid quote recipes and the pull measure (#98 D7/D8)', () => {
  assert.deepEqual(findRecipeDrift(staticBlock, QUOTE_TYPOGRAPHY), [], 'Quote recipes must match the approved clamps');
  assert.equal(toDeclarationMap(staticBlock).get('--container-quote-pull'), '40ch', 'pull quote measure');
});

test('typography recipes keep the approved tracking strings', () => {
  const declarations = toDeclarationMap(staticBlock);
  assert.equal(declarations.get('--text-label-eyebrow--letter-spacing'), '0.12em', 'label-eyebrow tracking');
  assert.equal(declarations.get('--text-meta--letter-spacing'), '0.08em', 'meta tracking');
  for (const recipe of TYPOGRAPHY) {
    assert.doesNotMatch(recipe.letterSpacing, /^\./, 'tracking must use the approved 0.x/0.xx form');
  }
});

test('typography recipes introduce no family or casing tokens', () => {
  const names = [...toDeclarationMap(staticBlock).keys()];
  const expectedFonts = [
    '--font-display',
    '--font-mono',
    '--font-sans',
    ...[...TYPOGRAPHY, ...TITLE_TYPOGRAPHY, ...STAT_TYPOGRAPHY, ...COUNTDOWN_TYPOGRAPHY, ...QUOTE_TYPOGRAPHY].map(
      ({ name }) => `--text-${name}--font-weight`
    )
  ].sort();
  assert.deepEqual(
    names.filter((name) => name.includes('font')).sort(),
    expectedFonts,
    'families stay in --font-* and companions only add --font-weight'
  );
  for (const name of names) {
    assert.doesNotMatch(name, /--(?:family|casing|text-transform)/, 'no family or casing token may be authored');
  }
});

test('inline static theme binds the 15 spacing steps and the base step to --space-*', () => {
  const inlineBlock = blockOf(themeSource, '@theme inline static');
  assert.deepEqual(
    findSpacingDrift(inlineBlock, SPACING_STEPS),
    [],
    'spacing aliases must point at their own --space-*'
  );
  assert.equal(toDeclarationMap(inlineBlock).size, 16, 'inline theme must expose 16 aliases');
});

test('only the spacing aliases live in the inline static theme', () => {
  const inlineBlock = blockOf(themeSource, '@theme inline static');
  assert.doesNotMatch(inlineBlock, /--text-/, 'typography stays in the static theme');
  assert.doesNotMatch(staticBlock, /--spacing-[0-9]+:/, 'spacing aliases stay inline');
  assert.doesNotMatch(blockOf(themeSource, ':root'), /--spacing-[0-9]+:/, 'spacing aliases must not leak into :root');
});

test('altered and missing typography fields are detected as drift', () => {
  const altered = themeSource.replace('--text-code--font-weight: 400;', '--text-code--font-weight: 500;');
  assert.deepEqual(findRecipeDrift(blockOf(altered, '@theme static'), TYPOGRAPHY), [
    '--text-code--font-weight: 500 != 400'
  ]);

  const missing = themeSource.replace(/--text-meta--letter-spacing: [^;]+;\n/, '');
  const missingDrift = findRecipeDrift(blockOf(missing, '@theme static'), TYPOGRAPHY);
  assert.ok(
    missingDrift.some((line) => line.startsWith('--text-meta--letter-spacing: undefined != 0.08em')),
    'a missing companion field must be reported'
  );
});

test('spacing aliases never point at a neighbor step', () => {
  const swapped = themeSource.replace('--spacing-4: var(--space-4);', '--spacing-4: var(--space-2);');
  assert.deepEqual(findSpacingDrift(blockOf(swapped, '@theme inline static'), SPACING_STEPS), [
    '--spacing-4: var(--space-2) != var(--space-4)'
  ]);
});

test('production helpers stay value-free: typography lives only in theme.css', () => {
  const helper = readFileSync(at('../scripts/token-css.mjs'), 'utf8');
  assert.doesNotMatch(helper, /--text-/, 'helper must not carry typography names');
  assert.doesNotMatch(helper, /--spacing-/, 'helper must not carry spacing names');
});
