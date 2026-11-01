import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// Owner visual review (2026-11-01): "ese rojo debería ser el predominante en los elementos"
// → "Todo neón". Brand text on raised surfaces uses the neon primitive; the owner accepts
// that small brand text no longer meets WCAG AA except on the canvas. Errors keep red-300
// so they stay distinct from the neon focus ring (#219 option A).
const themeSource = readFileSync(fileURLToPath(new URL('../src/theme.css', import.meta.url)), 'utf8');
const declaration = (name) => {
  const match = themeSource.match(new RegExp(`${name}:\\s*([^;]+);`));
  assert.ok(match, `${name} must be declared in theme.css`);
  return match[1].trim();
};

test('brand text on raised surfaces resolves to the neon brand red', () => {
  assert.equal(declaration('--color-fg-brand-raised'), 'var(--color-primitive-red-neon)');
  assert.equal(declaration('--color-fg-brand-default'), 'var(--color-primitive-red-neon)');
});

test('errors keep red-300 so they never look like the neon focus ring', () => {
  assert.equal(declaration('--color-status-danger'), 'var(--color-primitive-red-300)');
  assert.equal(declaration('--color-primitive-red-300'), '#FF6680');
});
