import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// Issue #218 (T10, spec S13/L8): owner-approved global scale ×0.8 with exact
// sub-pixel values ("Exactos"). The single value source is src/theme.css; this
// contract pins one representative token per scaled group and re-pins the
// rendering constants that must NOT scale (borders, focus, breakpoints, shadows).
const at = (path) => fileURLToPath(new URL(path, import.meta.url));
const themeSource = readFileSync(at('../src/theme.css'), 'utf8');

const declaration = (name) => {
  const match = themeSource.match(new RegExp(`${name.replace(/[$]/g, '\\$&')}:\\s*([^;]+);`));
  assert.ok(match, `${name} must be declared in theme.css`);
  return match[1].trim();
};

test('issue #218 scales one representative token per group to exact ×0.8', () => {
  // Spacing (Tailwind --spacing base).
  assert.equal(declaration('--space-1'), '3.2px', 'spacing base scales ×0.8');
  // Typography recipe.
  assert.equal(declaration('--text-meta'), '11.2px', 'text recipes scale ×0.8');
  // Fluid recipe: both clamp endpoints and the vw midpoint scale.
  assert.equal(
    declaration('--text-title-section'),
    'clamp(32px, 4.48vw, 51.2px)',
    'fluid recipes scale endpoints and midpoint'
  );
  // Radii.
  assert.equal(declaration('--radius-md'), '9.6px', 'radii scale ×0.8');
  // Icon base.
  assert.equal(declaration('--icon-size'), '16px', 'icon size scales ×0.8');
  // Effect grid keeps the "coincide con --space-10" comment true.
  assert.equal(declaration('--effect-grid-size'), '32px', 'effect grid follows --space-10');
  // egdev.es layout constants (OQ5).
  assert.equal(declaration('--nav-height'), '54.4px', 'nav height scales ×0.8');
  assert.equal(declaration('--content-max'), '1024px', 'content max scales ×0.8');
  assert.equal(declaration('--gutter'), 'clamp(12.8px, 3.2vw, 32px)', 'gutter scales ×0.8');
});

test('issue #218 keeps rendering constants, breakpoints and shadows unscaled', () => {
  assert.equal(declaration('--border-width'), '1px', 'hairline is a rendering constant');
  assert.equal(declaration('--focus-width'), '2px', 'focus ring stays 2px');
  assert.equal(declaration('--focus-offset'), '2px', 'focus offset stays 2px');
  assert.equal(declaration('--icon-stroke'), '1.75', 'stroke is unitless');
  assert.equal(declaration('--bp-sm'), '520px', 'viewport thresholds are not size tokens');
  assert.equal(declaration('--bp-md'), '960px', 'viewport thresholds are not size tokens');
  assert.equal(declaration('--bp-lg'), '1260px', 'viewport thresholds are not size tokens');
  assert.equal(declaration('--breakpoint-section-header-split'), '860px', 'media-query breakpoints stay unchanged');
  assert.equal(declaration('--shadow-focus'), '0 0 0 2px #141518, 0 0 0 4px #FF0036', 'focus shadow geometry stays');
  assert.equal(declaration('--radius-full'), '9999px', 'pills and circles stay');
  assert.equal(declaration('--radius-none'), '0px', 'no radius stays');
  assert.equal(declaration('--spacing-countdown-unit'), '1.9ch', 'relative measure stays');
  assert.equal(declaration('--container-quote-pull'), '40ch', 'relative measure stays');
});
