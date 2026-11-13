import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import {
  compareParity,
  extractDeclarations,
  findAliasCycles,
  findDuplicates,
  findUnresolvedAliases,
  toDeclarationMap
} from '../scripts/token-css.mjs';

// The single source of truth is src/theme.css. The baseline fixture is an immutable
// snapshot of the pre-CSS-only tokens.css and is used only to prove compilation parity.
const at = (path) => fileURLToPath(new URL(path, import.meta.url));
const maybeRead = (path) => (existsSync(at(path)) ? readFileSync(at(path), 'utf8') : '');
const themeSource = maybeRead('../src/theme.css');
const nativeSource = maybeRead('../src/native.css');
const baseline = maybeRead('./fixtures/original-tokens.css');
const manifest = JSON.parse(readFileSync(at('../package.json'), 'utf8'));

const globalReset = /--\*\s*:\s*initial\s*;/;
const themeBlock = themeSource.match(/@theme\s+static\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
const inlineBlock = themeSource.match(/@theme\s+inline\s+static\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';
const rootBlock = themeSource.match(/\n:root\s*\{([\s\S]*?)\n\}/)?.[1] ?? '';

test('theme.css keeps exactly the static theme and the inline spacing theme', () => {
  const headers = [...themeSource.matchAll(/@theme[^\n{]*\{/g)].map(([header]) => header.replace(/\s+/g, ' ').trim());
  assert.deepEqual(
    headers,
    ['@theme static {', '@theme inline static {'],
    'theme.css must not open a plain or additional @theme block'
  );
  assert.ok(themeBlock, 'theme.css must expose a @theme static block');
  assert.ok(inlineBlock, 'theme.css must expose a @theme inline static block');
  assert.ok(rootBlock, 'theme.css must expose a :root block');
});

test('theme.css keeps the Tailwind color reset instead of a global reset', () => {
  assert.match(themeBlock, /--color-\*:\s*initial;/, 'color namespace reset must stay');
  assert.doesNotMatch(themeSource, globalReset, 'only the color namespace may be reset');
});

// #219 B adds 1 semantic color token (danger tinted well): 212 + 1 = 213 utility, 283 + 2 = 285 total.
// #219 B adds 1 root geometry token (invalid border width): 55 + 1 = 56 root variables.
// #126 D17 adds 1 component container size (CalendarGrid stacking): 213 + 1 = 214 utility, 285 + 1 = 286 total.
// #291 adds 4 owner-approved SectionShell root tokens (show halo, three fade masks): 56 + 4 = 60 root, 286 + 4 = 290 total.
// NavList v0.3 adds four static typography declarations: 214 + 4 = 218 utility, 292 + 4 = 296 total.
test('theme.css declares exactly 218 utility variables, 16 inline aliases, and 62 root variables', () => {
  assert.equal(extractDeclarations(themeBlock).length, 218, 'utility namespace declaration count');
  assert.equal(extractDeclarations(inlineBlock).length, 16, 'inline spacing alias count');
  assert.equal(extractDeclarations(rootBlock).length, 62, 'root declaration count');
  assert.equal(extractDeclarations(themeSource).length, 296, 'total declaration count');
});

test('theme.css declares the CalendarGrid stacking container size (#126 D17)', () => {
  const declarations = extractDeclarations(themeBlock);
  const container = declarations.find(({ name }) => name === '--container-calendar-grid-stack');
  assert.equal(container?.value, '960px', 'CalendarGrid lanes stack below a 960px container');
  assert.equal(
    declarations.filter(({ name }) => name === '--container-calendar-grid-stack').length,
    1,
    'the component container size is declared once'
  );
});

test('theme.css declares the owner-approved error-vs-focus tokens (#219 option A)', () => {
  const dangerBg = extractDeclarations(themeBlock).find(({ name }) => name === '--color-status-danger-bg');
  assert.equal(
    dangerBg?.value,
    'color-mix(in srgb, var(--color-status-danger) 12%, transparent)',
    'danger well tint derives from the existing status-danger primitive (owner option 1)'
  );
  const invalidWidth = extractDeclarations(rootBlock).find(({ name }) => name === '--border-width-invalid');
  assert.equal(invalidWidth?.value, '2px', 'invalid border doubles the resting width to the focus geometry');
});

test('theme.css declares the approved SectionHeader split breakpoint in the static namespace', () => {
  const breakpoint = extractDeclarations(themeBlock).find(({ name }) => name === '--breakpoint-section-header-split');
  assert.equal(breakpoint?.value, '860px', '#100 D7 minimum-width breakpoint');
});

test('theme.css declares the decorative pulse animation token with its keyframes', () => {
  const pulse = extractDeclarations(themeBlock).find(({ name }) => name === '--animate-pulse');
  assert.equal(pulse?.value, 'pulse 2s var(--ease-snappy) infinite', 'pulse animation token value');
  assert.match(themeBlock, /@keyframes\s+pulse\s*\{\s*50%\s*\{\s*opacity:\s*0\.5;\s*\}\s*\}/, 'pulse keyframes');
});

test('theme.css declares the indeterminate spin animation token with its keyframes', () => {
  const spin = extractDeclarations(themeBlock).find(({ name }) => name === '--animate-spin');
  assert.equal(spin?.value, 'spin 1s linear infinite', 'spin animation token value');
  assert.match(
    themeBlock,
    /@keyframes\s+spin\s*\{\s*to\s*\{\s*transform:\s*rotate\(360deg\);\s*\}\s*\}/,
    'spin keyframes'
  );
});

// #291 --gradient-section-show references --color-alpha-red-12: 53 + 1 = 54 aliases.
test('theme.css preserves all 54 aliases and has no duplicates, missing targets, or cycles', () => {
  const declarations = extractDeclarations(themeSource);
  assert.equal(declarations.filter(({ value }) => value.includes('var(')).length, 54, 'alias count');
  assert.deepEqual(findDuplicates(declarations), [], 'duplicate declarations');
  assert.deepEqual(findUnresolvedAliases(declarations), [], 'unresolved aliases');
  assert.deepEqual(findAliasCycles(declarations), [], 'alias cycles');
});

test('native.css imports the source theme and generates no utilities', () => {
  assert.match(nativeSource, /@import\s+["']\.\/theme\.css["'];/, 'native entry must import theme.css');
  assert.match(nativeSource, /@tailwind\s+utilities\s+source\(none\);/, 'native entry must not scan sources');
});

test('generated sources, JSON source, and custom generators are removed', () => {
  for (const removed of [
    '../src/tokens.css',
    '../src/tokens.json',
    '../scripts/build-tokens.mjs',
    '../scripts/build-theme.mjs'
  ]) {
    assert.equal(existsSync(at(removed)), false, `${removed} must be removed`);
  }
});

test('package publishes compiled tokens and keeps backward CSS exports', () => {
  assert.equal(manifest.version, '0.3.0');
  assert.equal(manifest.exports['./tokens.json'], undefined, 'tokens.json export must be retired');
  assert.equal(manifest.exports['./tokens.css'], './dist/tokens.css', 'public native import stays tokens.css');
  assert.equal(manifest.exports['./theme.css'], './src/theme.css', 'public Tailwind import stays theme.css');
  assert.equal(manifest.exports['./native.css'], './src/native.css');
  assert.ok(manifest.files.includes('src'), 'source must ship');
  assert.ok(manifest.files.includes('dist'), 'compiled artifact must ship');
});

test('compiled dist/tokens.css exposes the 296 manual variables and preserves the original 168 values', () => {
  const artifactPath = at('../dist/tokens.css');
  assert.ok(existsSync(artifactPath), 'dist/tokens.css missing — run pnpm tokens before this test');
  const artifact = readFileSync(artifactPath, 'utf8');
  assert.doesNotMatch(artifact, /@theme/, 'compiled artifact must not keep the @theme at-rule');
  const compiled = toDeclarationMap(artifact);
  assert.equal(compiled.size, 296, 'compiled artifact must expose 296 variables');
  assert.match(artifact, /@keyframes\s+pulse\s*\{/, 'compiled artifact must ship the pulse keyframes');
  assert.match(artifact, /@keyframes\s+spin\s*\{/, 'compiled artifact must ship the spin keyframes');
  const parity = compareParity(artifact, themeSource);
  assert.deepEqual(parity.missing, [], 'compiled artifact dropped tokens');
  assert.deepEqual(parity.extra, [], 'compiled artifact invented tokens');
  assert.deepEqual(parity.changed, [], 'compiled artifact changed token values');
  // The immutable fixture proves the pre-#10 tokens keep their exact values and units,
  // except the 24 tokens the owner re-valued with the #218 global scale and the brand-text token re-pointed to neon ×0.8 (spec S13,
  // L8 OQ1 exact sub-pixel values); those are compared against their new scale.
  const rescaledBy218 = new Map([
    ['--space-1', '3.2px'],
    ['--space-2', '6.4px'],
    ['--space-3', '9.6px'],
    ['--space-4', '12.8px'],
    ['--space-5', '16px'],
    ['--space-6', '19.2px'],
    ['--space-7', '22.4px'],
    ['--space-8', '25.6px'],
    ['--space-10', '32px'],
    ['--space-12', '38.4px'],
    ['--space-14', '44.8px'],
    ['--space-16', '51.2px'],
    ['--space-20', '64px'],
    ['--space-24', '76.8px'],
    ['--radius-sm', '3.2px'],
    ['--radius-md', '9.6px'],
    ['--radius-lg', '12.8px'],
    ['--radius-xl', '17.6px'],
    ['--radius-2xl', '19.2px'],
    ['--icon-size', '16px'],
    ['--effect-grid-size', '32px'],
    ['--content-max', '1024px'],
    ['--gutter', 'clamp(12.8px, 3.2vw, 32px)'],
    ['--nav-height', '54.4px'],
    // Owner visual review 2026-11-01 ("Todo neón"): brand text on raised surfaces uses neon.
    ['--color-fg-brand-raised', 'var(--color-primitive-red-neon)']
  ]);
  const original = toDeclarationMap(baseline);
  assert.equal(original.size, 168, 'baseline fixture must keep its 168 original tokens');
  for (const [name, value] of original) {
    assert.equal(
      compiled.get(name),
      rescaledBy218.get(name) ?? value,
      `compiled artifact must preserve the original value of ${name}`
    );
  }
});

test('reset guard catches a global theme reset without rejecting the color reset', () => {
  assert.match('@theme static { --*: initial; }', globalReset);
  assert.doesNotMatch('@theme static { --color-*: initial; }', globalReset);
});

test('validator permits local fallbacks but still rejects missing required references', () => {
  assert.deepEqual(findUnresolvedAliases(extractDeclarations(':root { --a: var(--external, 12px); }')), []);
  assert.deepEqual(findUnresolvedAliases(extractDeclarations(':root { --a: var(--external, var(--missing)); }')), [
    '--a -> --missing'
  ]);
});

test('validator rejects duplicates, missing targets, cycles, and drifted artifacts', () => {
  const duplicates = extractDeclarations(':root {\n  --a: 1px;\n  --a: 2px;\n}');
  assert.deepEqual(findDuplicates(duplicates), ['--a']);

  const missing = extractDeclarations(':root {\n  --a: var(--b);\n}');
  assert.deepEqual(findUnresolvedAliases(missing), ['--a -> --b']);

  const cyclic = extractDeclarations(':root {\n  --a: var(--b);\n  --b: var(--a);\n}');
  assert.ok(findAliasCycles(cyclic).length > 0, 'cycle must be reported');

  const drifted = compareParity(':root {\n  --a: 2px;\n}', ':root {\n  --a: 1px;\n}');
  assert.equal(drifted.ok, false);
  assert.deepEqual(drifted.changed, ['--a: 1px -> 2px']);
});

test('HomeTemplate vignette is the exact owner-approved root token', () => {
  const values = extractDeclarations(rootBlock).filter(({ name }) => name === '--gradient-vignette');
  assert.equal(values.length, 1);
  assert.equal(
    values[0]?.value,
    'radial-gradient(ellipse 120% 90% at 50% 45%, transparent 35%, rgba(0, 0, 0, 0.55) 75%, rgba(0, 0, 0, 0.92) 100%)'
  );
});

test('ScrollReveal wipe timing is the owner-approved 800ms root token', () => {
  const declarations = extractDeclarations(rootBlock);
  const values = declarations.filter(({ name }) => name === '--duration-wipe');
  assert.equal(values.length, 1);
  assert.equal(values[0]?.value, '800ms');
  // Existing reveal timing remains unchanged.
  assert.equal(declarations.find(({ name }) => name === '--duration-reveal')?.value, '560ms');
});
