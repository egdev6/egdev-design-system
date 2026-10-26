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

test('theme.css declares exactly 167 utility variables, 16 inline aliases, and 55 root variables', () => {
  assert.equal(extractDeclarations(themeBlock).length, 167, 'utility namespace declaration count');
  assert.equal(extractDeclarations(inlineBlock).length, 16, 'inline spacing alias count');
  assert.equal(extractDeclarations(rootBlock).length, 55, 'root declaration count');
  assert.equal(extractDeclarations(themeSource).length, 238, 'total declaration count');
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

test('theme.css preserves all 51 aliases and has no duplicates, missing targets, or cycles', () => {
  const declarations = extractDeclarations(themeSource);
  assert.equal(declarations.filter(({ value }) => value.includes('var(')).length, 51, 'alias count');
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

test('compiled dist/tokens.css exposes the 238 manual variables and preserves the original 168 values', () => {
  const artifactPath = at('../dist/tokens.css');
  assert.ok(existsSync(artifactPath), 'dist/tokens.css missing — run pnpm tokens before this test');
  const artifact = readFileSync(artifactPath, 'utf8');
  assert.doesNotMatch(artifact, /@theme/, 'compiled artifact must not keep the @theme at-rule');
  const compiled = toDeclarationMap(artifact);
  assert.equal(compiled.size, 238, 'compiled artifact must expose 238 variables');
  assert.match(artifact, /@keyframes\s+pulse\s*\{/, 'compiled artifact must ship the pulse keyframes');
  assert.match(artifact, /@keyframes\s+spin\s*\{/, 'compiled artifact must ship the spin keyframes');
  const parity = compareParity(artifact, themeSource);
  assert.deepEqual(parity.missing, [], 'compiled artifact dropped tokens');
  assert.deepEqual(parity.extra, [], 'compiled artifact invented tokens');
  assert.deepEqual(parity.changed, [], 'compiled artifact changed token values');
  // The immutable fixture proves the pre-#10 tokens keep their exact values and units.
  const original = toDeclarationMap(baseline);
  assert.equal(original.size, 168, 'baseline fixture must keep its 168 original tokens');
  for (const [name, value] of original) {
    assert.equal(compiled.get(name), value, `compiled artifact must preserve the original value of ${name}`);
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
