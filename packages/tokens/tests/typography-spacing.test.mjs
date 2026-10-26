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
// documented next to the CSS, never published as new tokens.
const TYPOGRAPHY = [
  { name: 'display-hero', size: '56px', lineHeight: '1.1', fontWeight: '800', letterSpacing: '0' },
  { name: 'display-show', size: '96px', lineHeight: '0.9', fontWeight: '800', letterSpacing: '0' },
  { name: 'display-pro', size: '64px', lineHeight: '0.95', fontWeight: '800', letterSpacing: '0' },
  { name: 'heading-section', size: '40px', lineHeight: '1.2', fontWeight: '800', letterSpacing: '0' },
  { name: 'heading-small', size: '24px', lineHeight: '1.2', fontWeight: '700', letterSpacing: '0' },
  { name: 'body-large', size: '20px', lineHeight: '1.6', fontWeight: '500', letterSpacing: '0' },
  { name: 'body-default', size: '16px', lineHeight: '1.6', fontWeight: '500', letterSpacing: '0' },
  { name: 'body-muted', size: '20px', lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' },
  { name: 'label-default', size: '14px', lineHeight: '1.2', fontWeight: '600', letterSpacing: '0' },
  { name: 'label-eyebrow', size: '14px', lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.12em' },
  { name: 'meta', size: '14px', lineHeight: '1.3', fontWeight: '600', letterSpacing: '0.08em' },
  { name: 'cta-label', size: '16px', lineHeight: '1.2', fontWeight: '700', letterSpacing: '0' },
  { name: 'code', size: '14px', lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' }
];

// Fluid Title recipes approved for Text/Heading (#108 D8): exact legacy .eg-title clamps.
const TITLE_TYPOGRAPHY = [
  { name: 'title-section', size: 'clamp(40px, 5.6vw, 64px)', lineHeight: '0.9', fontWeight: '800', letterSpacing: '0' },
  { name: 'title-hero', size: 'clamp(60px, 9vw, 140px)', lineHeight: '0.86', fontWeight: '800', letterSpacing: '0' },
  { name: 'title-show', size: 'clamp(56px, 8.2vw, 132px)', lineHeight: '0.86', fontWeight: '800', letterSpacing: '0' },
  {
    name: 'title-display',
    size: 'clamp(64px, 9.6vw, 164px)',
    lineHeight: '0.82',
    fontWeight: '800',
    letterSpacing: '0'
  }
];

// Fluid quotation recipes approved for PullQuote (#98 D7): exact legacy .eg-quote__text clamps.
const QUOTE_TYPOGRAPHY = [
  { name: 'quote-pull', size: 'clamp(19px, 1.7vw, 23px)', lineHeight: '1.4', fontWeight: '500', letterSpacing: '0' },
  {
    name: 'quote-display',
    size: 'clamp(48px, 6.2vw, 100px)',
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

test('static theme publishes the four fluid Title recipes and the hero glyph glow (#108 D8/D9)', () => {
  assert.deepEqual(findRecipeDrift(staticBlock, TITLE_TYPOGRAPHY), [], 'Title recipes must match the approved clamps');
  assert.equal(
    toDeclarationMap(staticBlock).get('--text-shadow-title-hero'),
    '0 0 40px var(--color-alpha-red-30)',
    'hero accent glow must be a text-shadow token, never a box-shadow reuse'
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
    ...[...TYPOGRAPHY, ...TITLE_TYPOGRAPHY, ...QUOTE_TYPOGRAPHY].map(({ name }) => `--text-${name}--font-weight`)
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
