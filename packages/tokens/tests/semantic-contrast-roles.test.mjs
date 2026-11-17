import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';
import { extractGroupedDeclarations, toDeclarationMap } from '../scripts/token-css.mjs';

// Issue #425: the owner approved these aliases, not new values. Expectations live
// in tests; theme.css remains the only manual source of production token values.
const at = (path) => fileURLToPath(new URL(path, import.meta.url));
const themeSource = readFileSync(at('../src/theme.css'), 'utf8');
const nativeCss = readFileSync(at('../dist/tokens.css'), 'utf8');
const source = toDeclarationMap(themeSource);
const native = toDeclarationMap(nativeCss);
const groups = extractGroupedDeclarations(themeSource);

const roles = [
  ['--color-app-page', '--color-surface-0', '#141518'],
  ['--color-app-card', '--color-surface-1', '#1B1C20'],
  ['--color-app-card-header', '--color-surface-2', '#232428'],
  ['--color-app-inset', '--color-surface-0', '#141518'],
  ['--color-control-well', '--color-surface-0', '#141518'],
  ['--color-control-boundary', '--color-border-control', '#7A7B81'],
  ['--color-state-selected', '--color-action-primary-solid-bg', '#FF0036'],
  ['--color-on-selected', '--color-action-primary-solid-fg', '#000000'],
  ['--color-state-selected-surface', '--color-surface-3', '#2D2E33'],
  ['--color-link-default', '--color-fg-brand-raised', '#FF0036'],
  ['--color-link-hover', '--color-primitive-red-200', '#FF8FA6'],
  [
    '--gradient-state-selected',
    '--gradient-btn-primary',
    'linear-gradient(180deg, #FF2D57 0%, #FF0036 52%, #EE0031 100%)'
  ],
  [
    '--shadow-state-selected',
    '--shadow-btn-primary',
    'inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(0, 0, 0, 0.28), 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 22px -8px rgba(255, 0, 54, 0.7)'
  ],
  ['--shadow-state-indicator', '--shadow-glow-base', '0 4px 20px 0 rgba(255, 0, 54, 0.15)']
];

// Pin the referenced declarations and their transitive primitives, as well as the
// existing segmented border/tint role selected in D3. No new D3 token is needed.
const existing = [
  ['--color-surface-0', 'var(--color-primitive-graphite-950)'],
  ['--color-surface-1', 'var(--color-primitive-graphite-900)'],
  ['--color-surface-2', 'var(--color-primitive-graphite-850)'],
  ['--color-surface-3', 'var(--color-primitive-graphite-750)'],
  ['--color-primitive-graphite-950', '#141518'],
  ['--color-primitive-graphite-900', '#1B1C20'],
  ['--color-primitive-graphite-850', '#232428'],
  ['--color-primitive-graphite-750', '#2D2E33'],
  ['--color-border-control', 'var(--color-primitive-graphite-500)'],
  ['--color-primitive-graphite-500', '#7A7B81'],
  ['--color-action-primary-solid-bg', 'var(--color-primitive-red-neon)'],
  ['--color-action-primary-solid-fg', 'var(--color-primitive-black)'],
  ['--color-fg-brand-raised', 'var(--color-primitive-red-neon)'],
  ['--color-primitive-red-neon', '#FF0036'],
  ['--color-primitive-black', '#000000'],
  ['--color-primitive-red-200', '#FF8FA6'],
  ['--color-border-brand', 'var(--color-alpha-red-45)'],
  ['--color-alpha-red-45', 'rgba(255, 0, 54, 0.45)'],
  ['--gradient-btn-primary', 'linear-gradient(180deg, #FF2D57 0%, #FF0036 52%, #EE0031 100%)'],
  [
    '--shadow-btn-primary',
    'inset 0 1px 0 rgba(255, 255, 255, 0.38), inset 0 -1px 0 rgba(0, 0, 0, 0.28), 0 1px 2px rgba(0, 0, 0, 0.6), 0 8px 22px -8px rgba(255, 0, 54, 0.7)'
  ],
  ['--shadow-glow-base', '0 4px 20px 0 rgba(255, 0, 54, 0.15)']
];

function resolveValue(declarations, name, visited = new Set()) {
  assert.ok(!visited.has(name), `cycle resolving ${name}`);
  const value = declarations.get(name);
  assert.notEqual(value, undefined, `missing ${name}`);
  const next = new Set(visited).add(name);
  return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, target) => resolveValue(declarations, target, next));
}

for (const [name, target, value] of roles) {
  test(`source publishes ${name} as its approved alias`, () => {
    assert.equal(source.get(name), `var(${target})`);
    assert.equal(resolveValue(source, name), value);
    const entries = groups.filter((entry) => entry.name === name);
    assert.equal(entries.length, 1, `${name} is declared exactly once`);
    assert.equal(entries[0].group, name.startsWith('--color-') ? 'theme' : 'root');
  });

  test(`native CSS publishes ${name} as its approved alias`, () => {
    assert.equal(native.get(name), `var(${target})`);
    assert.equal(resolveValue(native, name), value);
  });
}

test('referenced existing values and D3 brand border are unchanged in both CSS exports', () => {
  for (const [name, value] of existing) {
    assert.equal(source.get(name), value, `source ${name}`);
    assert.equal(native.get(name), value, `native ${name}`);
  }
});

test('Tailwind generates background, text and border utilities for every color role', async () => {
  const colorRoles = roles.filter(([name]) => name.startsWith('--color-'));
  const candidates = colorRoles.flatMap(([name]) => {
    const suffix = name.slice('--color-'.length);
    return [`bg-${suffix}`, `text-${suffix}`, `border-${suffix}`];
  });
  const compiler = await compile(`${themeSource}\n@tailwind utilities;`);
  const css = compiler.build(candidates);
  for (const [name] of colorRoles) {
    const suffix = name.slice('--color-'.length);
    for (const [prefix, property] of [
      ['bg', 'background-color'],
      ['text', 'color'],
      ['border', 'border-color']
    ]) {
      const selector = `${prefix}-${suffix}`;
      const block = css.match(new RegExp(`\\.${selector}\\s*\\{([^}]*)\\}`))?.[1];
      assert.ok(block, `missing .${selector}`);
      assert.match(block, new RegExp(`${property}:\\s*var\\(${name}\\)`), selector);
    }
  }
});

function luminance(hex) {
  assert.match(hex, /^#[\da-f]{6}$/i);
  const channels = [1, 3, 5].map((index) => {
    const value = Number.parseInt(hex.slice(index, index + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(first, second) {
  const values = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

function assertRatio(first, second, expected) {
  assert.equal(contrast(first, second).toFixed(2), expected.toFixed(2), `${first} on ${second}`);
}

test('approved solid color contrast evidence reproduces from source aliases', () => {
  const value = (name) => resolveValue(source, name);
  const surfaces = [
    '--color-app-page',
    '--color-app-card',
    '--color-app-card-header',
    '--color-state-selected-surface'
  ];
  const white = value('--color-fg-default');
  const muted = value('--color-fg-muted');
  for (const [name, whiteRatio, mutedRatio] of [
    ['--color-app-page', 18.26, 7.17],
    ['--color-app-card', 17.02, 6.69],
    ['--color-app-card-header', 15.5, 6.09],
    ['--color-app-inset', 18.26, 7.17],
    ['--color-control-well', 18.26, 7.17],
    ['--color-state-selected-surface', 13.55, 5.32]
  ]) {
    assertRatio(white, value(name), whiteRatio);
    assertRatio(muted, value(name), mutedRatio);
  }
  for (const [name, ratios] of [
    ['--color-control-boundary', [4.33, 4.04, 3.68, 3.21]],
    ['--color-state-selected', [4.61, 4.3, 3.92, 3.42]],
    ['--color-link-default', [4.61, 4.3, 3.92, 3.42]],
    ['--color-link-hover', [8.46, 7.89, 7.18, 6.28]]
  ]) {
    surfaces.forEach((surface, index) => assertRatio(value(name), value(surface), ratios[index]));
  }
  assertRatio(value('--color-on-selected'), value('--color-state-selected'), 5.31);
  assertRatio(value('--color-state-selected-surface'), value('--color-control-well'), 1.35);
});

test('approved selected gradient stop contrast evidence reproduces without rounding intermediate values', () => {
  const gradient = resolveValue(source, '--gradient-state-selected');
  const stops = [...gradient.matchAll(/#[\da-f]{6}\b/gi)].map(([hex]) => hex);
  assert.equal(stops.length, 3);
  const ink = resolveValue(source, '--color-on-selected');
  [5.76, 5.31, 4.68].forEach((ratio, index) => assertRatio(ink, stops[index], ratio));
  assertRatio(stops[2], resolveValue(source, '--color-state-selected-surface'), 3.02);
});
