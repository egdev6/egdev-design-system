// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';
import { beforeAll, describe, expect, it } from 'vitest';
import { gaugeCircleVariants } from '../atoms/gauge/types';

let css: string;

// Limited, comment-free emitted CSS: nonempty double-quoted charset strings (no escapes or
// line breaks), and comma-separated dotted ASCII layer names starting with a letter/underscore.
// This checks statement syntax/position, not encoding labels, reserved names or charset ordering.
function isImportPreamble(prefix: string): boolean {
  let position = 0;
  const skipWhitespace = () => {
    while (position < prefix.length && /[ \t\r\n\f]/.test(prefix[position] ?? '')) {
      position++;
    }
  };

  // The cursor only advances; all character tests and keyword lookups have bounded length.
  while (true) {
    skipWhitespace();
    if (position === prefix.length) {
      return true;
    }
    const charset = prefix.startsWith('@charset', position);
    if (!charset && !prefix.startsWith('@layer', position)) {
      return false;
    }
    position += charset ? 8 : 6;
    const keywordEnd = position;
    skipWhitespace();
    if (position === keywordEnd) {
      return false;
    }

    if (charset) {
      if (prefix[position] !== '"') {
        return false;
      }
      position++;
      const stringStart = position;
      while (position < prefix.length && prefix[position] !== '"') {
        if (/[\\\r\n\f]/.test(prefix[position] ?? '')) {
          return false;
        }
        position++;
      }
      if (position === stringStart || position === prefix.length) {
        return false;
      }
      position++;
    } else {
      while (true) {
        if (!/[A-Za-z_]/.test(prefix[position] ?? '')) {
          return false;
        }
        position++;
        while (position < prefix.length && /[A-Za-z0-9_-]/.test(prefix[position] ?? '')) {
          position++;
        }
        if (prefix[position] === '.') {
          position++;
          continue;
        }
        skipWhitespace();
        if (prefix[position] !== ',') {
          break;
        }
        position++;
        skipWhitespace();
      }
    }
    skipWhitespace();
    if (prefix[position] !== ';') {
      return false;
    }
    position++;
  }
}

describe('font import preamble validation', () => {
  it.each([
    '',
    ' \t\r\n\f',
    '@charset "UTF-8";',
    '@charset "semi;colon";',
    '@layer reset;',
    '@layer _reset-2, theme.components;',
    '@layer reset, theme.components, utilities;',
    ' \n@charset "UTF-8";\n@layer reset; @layer theme.components;\n'
  ])('accepts the supported preamble %j', (prefix) => {
    expect(isImportPreamble(prefix)).toBe(true);
  });

  it.each([
    'body { color: red; }',
    '@layer reset {}',
    '@media print {}',
    '@import "other.css";',
    '@charset "UTF-8"',
    '@layer reset',
    '@charset;',
    '@layer;',
    '@charset   ;',
    '@layer \t ;',
    '@charset "";',
    '@charset UTF-8;',
    '@charset "UTF-8;',
    '@charset "UTF-8" extra;',
    '@charset "UTF\n8";',
    '@charset "UTF\\8";',
    "@charset 'UTF-8';",
    '@layered reset;',
    '@charsetx "UTF-8";',
    '@layer reset,;',
    '@layer reset..theme;',
    '@layer reset.;',
    '@layer reset .theme;',
    '@layer 2reset;',
    '@layer reset theme;',
    '@layer "reset";',
    '@layer reset};',
    '@layer reset; body {}'
  ])('rejects the malformed or disallowed preamble %j', (prefix) => {
    expect(isImportPreamble(prefix)).toBe(false);
  });

  it('handles long whitespace and missing delimiters without backtracking', () => {
    const whitespace = ' '.repeat(100_000);
    expect(isImportPreamble(whitespace)).toBe(true);
    expect(isImportPreamble(`@layer ${whitespace};`)).toBe(false);
    expect(isImportPreamble(`@charset ${whitespace}`)).toBe(false);
    expect(isImportPreamble(`@charset "${'a'.repeat(100_000)}`)).toBe(false);
    expect(isImportPreamble(`@layer ${'a'.repeat(100_000)}`)).toBe(false);
    expect(isImportPreamble('@layer reset;\n'.repeat(10_000))).toBe(true);
  });
});

// Match emitted static selectors, not class strings in source files or a full CSS snapshot.
function rule(selector: string) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  // The installed optimizer may emit both a fallback and an @supports rule for one selector.
  const matches = [...css.matchAll(new RegExp(`(?:^|[{}])\\s*${escaped}\\s*\\{([^}]+)\\}`, 'g'))];
  expect(matches.length, `Missing compiled preview rule ${selector}`).toBeGreaterThan(0);
  return matches.map((match) => match[1]).join('\n');
}

describe('Storybook preview CSS', () => {
  beforeAll(async () => {
    const result = await build({
      configFile: false,
      envDir: false,
      plugins: [tailwindcss()],
      logLevel: 'warn',
      build: {
        write: false,
        minify: false,
        cssMinify: false,
        rolldownOptions: {
          input: fileURLToPath(new URL('../../../../.storybook/preview.css', import.meta.url))
        }
      }
    });
    const assets = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const stylesheet = assets.find((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
    if (stylesheet?.type !== 'asset') {
      throw new Error('The actual Storybook preview must emit a CSS asset');
    }
    css = String(stylesheet.source).replace(/\/\*[\s\S]*?\*\//g, '');
  }, 30_000);

  it('compiles the first molecule source with Radix available-space bounds and opacity entry', () => {
    expect(rule(String.raw`.max-w-\[var\(--radix-hover-card-content-available-width\)\]`)).toMatch(
      /max-width:\s*var\(--radix-hover-card-content-available-width\)/
    );
    expect(rule(String.raw`.max-h-\[var\(--radix-hover-card-content-available-height\)\]`)).toMatch(
      /max-height:\s*var\(--radix-hover-card-content-available-height\)/
    );
    expect(rule(String.raw`.w-\[calc\(var\(--space-24\)\*4\)\]`)).toMatch(/width:\s*calc\(/);
    expect(css).toContain(String.raw`.data-\[state\=open\]\:starting\:opacity-0`);
    expect(css).toMatch(/@starting-style/);
    expect(css).not.toMatch(/\.eg-hover-card\s*[,{]/);
  });

  it('compiles SocialLinks resets, caption typography and delegated wrapping layouts alongside legacy styles', () => {
    expect(rule('.list-none')).toMatch(/list-style-type:\s*none/);
    expect(rule('.shrink-0')).toMatch(/flex-shrink:\s*0/);
    expect(rule('.text-label-eyebrow')).toMatch(/font-size:\s*var\(--text-label-eyebrow[,)]/);
    expect(rule('.text-label-eyebrow')).toMatch(
      /letter-spacing:\s*(?:var\(--tw-tracking,\s*)?var\(--text-label-eyebrow--letter-spacing[,)]/
    );
    expect(rule('.text-fg-secondary')).toMatch(/color:\s*var\(--color-fg-secondary[,)]/);
    expect(rule('.font-display')).toMatch(/font-family:\s*var\(--font-display[,)]/);
    for (const gap of [1, 2, 3, 4]) {
      expect(rule(`.gap-${gap}`)).toMatch(new RegExp(`gap:\\s*var\\(--space-${gap}[,)]`));
    }
    expect(rule('.flex-wrap')).toMatch(/flex-wrap:\s*wrap/);
    expect(rule('.flex-row')).toMatch(/flex-direction:\s*row/);
    expect(css).toMatch(/\.eg-social__list>li|\.eg-social__list\s*>\s*li/);
  });

  it('compiles MeterRow wrapping, typography and key utilities from its production CVA source', () => {
    expect(rule('.gap-x-3')).toMatch(/column-gap:\s*var\(--space-3[,)]/);
    expect(rule('.gap-y-1')).toMatch(/row-gap:\s*var\(--space-1[,)]/);
    expect(rule(String.raw`.\[overflow-wrap\:anywhere\]`)).toMatch(/overflow-wrap:\s*anywhere/);
    expect(rule('.text-label-default')).toMatch(/font-size:\s*var\(--text-label-default[,)]/);
    expect(rule(String.raw`.leading-\[var\(--text-body-default--line-height\)\]`)).toMatch(
      /line-height:\s*var\(--text-body-default--line-height[,)]/
    );
    expect(rule(String.raw`.font-\[var\(--text-body-muted--font-weight\)\]`)).toMatch(
      /font-weight:\s*var\(--text-body-muted--font-weight[,)]/
    );
    expect(rule('.bg-fg-brand-default')).toMatch(/background-color:\s*var\(--color-fg-brand-default[,)]/);
    expect(rule('.bg-fg-muted')).toMatch(/background-color:\s*var\(--color-fg-muted[,)]/);
  });

  it('compiles Notice tint opacity, token typography and responsive basis from molecule sources', () => {
    for (const color of ['fg-secondary', 'status-info', 'status-success', 'status-warning', 'status-danger']) {
      for (const [prefix, opacity] of [
        ['border', 30],
        ['from', 11],
        ['to', 4]
      ] as const) {
        const emitted = rule(`.${prefix}-${color}\\/${opacity}`);
        expect(emitted).toContain(`var(--color-${color}`);
        expect(emitted).toContain(`${opacity}%, transparent)`);
      }
    }
    expect(rule('.bg-linear-to-b')).toMatch(/background-image:\s*linear-gradient/);
    expect(rule(String.raw`.basis-\[calc\(var\(--space-24\)\*2\.5\)\]`)).toMatch(
      /flex-basis:\s*calc\(var\(--space-24\)\s*\*\s*2\.5\)/
    );
    expect(rule('.text-body-default')).toContain('var(--text-body-default');
    expect(rule('.text-label-default')).toContain('var(--text-label-default');
    expect(rule('.flex-wrap')).toMatch(/flex-wrap:\s*wrap/);
  });

  it('compiles Gauge geometry and the static utilities that make its ring valid', () => {
    expect(rule('.inline-flex')).toMatch(/display:\s*inline-flex\s*;/);
    expect(rule('.w-auto')).toMatch(/width:\s*auto\s*;/);
    expect(rule('.h-auto')).toMatch(/height:\s*auto\s*;/);
    expect(rule('.relative')).toMatch(/position:\s*relative\s*;/);
    expect(rule('.border-0')).toMatch(/border-(?:width|style):/);
    for (const size of ['space-4', 'space-10', 'space-14', 'space-20', 'eg-gauge-size']) {
      for (const [prefix, property] of [
        ['w', 'width'],
        ['h', 'height']
      ]) {
        expect(rule(`.${prefix}-\\[var\\(--${size}\\)\\]`)).toMatch(
          new RegExp(`${property}:\\s*var\\(--${size}\\)\\s*;`)
        );
      }
    }
    for (const stroke of ['3px', '4px', '6px']) {
      expect(rule(`.\\[--eg-gauge-stroke\\:${stroke}\\]`)).toContain(`--eg-gauge-stroke: ${stroke};`);
    }
    expect(rule(String.raw`.\[--eg-gauge-stroke\:calc\(var\(--eg-gauge-size\)\/14\)\]`)).toMatch(
      /--eg-gauge-stroke:\s*calc\(var\(--eg-gauge-size\)\s*\/\s*14\)\s*;/
    );
    expect(rule(String.raw`.\[--eg-gauge-fill\:var\(--color-fg-brand-default\)\]`)).toMatch(
      /--eg-gauge-fill:\s*var\(--color-fg-brand-default\)\s*;/
    );
    expect(rule(String.raw`.\[--eg-gauge-track\:--alpha\(var\(--color-fg-default\)\/10\%\)\]`)).toMatch(
      /--eg-gauge-track:\s*color-mix\(in oklab,\s*var\(--color-fg-default\)\s*10%,\s*transparent\)\s*;/
    );
    expect(css).not.toMatch(/--alpha\s*\(/);
    const arc = rule('.eg-gauge-arc');
    expect(arc).toMatch(/position:\s*absolute\s*;/);
    expect(arc).toMatch(/inset:\s*0\s*;/);
    expect(arc).toMatch(
      /background:\s*conic-gradient\(var\(--eg-gauge-fill\) calc\(var\(--eg-gauge-value\) \* 1%\), var\(--eg-gauge-track\) 0\)\s*;/
    );
    expect(arc).toMatch(/mask:\s*radial-gradient\([^;]*var\(--eg-gauge-stroke\)/);
    expect(rule('.eg-gauge-center')).toMatch(/inset:\s*30%\s*;/);
  });

  it.each([
    ['box-border', '.box-border', /box-sizing:\s*border-box\s*;/],
    ['p-0', '.p-0', /padding:\s*var\(--space-0\)\s*;/],
    ['border-0', '.border-0', /border-width:\s*0(?:px)?\s*;/],
    ['border-solid', '.border-solid', /border-style:\s*solid\s*;/],
    [
      'border-[var(--color-border-hairline)]',
      String.raw`.border-\[var\(--color-border-hairline\)\]`,
      /border-color:\s*var\(--color-border-hairline\)\s*;/
    ],
    [
      'rounded-[var(--radius-full)]',
      String.raw`.rounded-\[var\(--radius-full\)\]`,
      /border-radius:\s*var\(--radius-full\)\s*;/
    ],
    ['bg-transparent', '.bg-transparent', /background-color:\s*(?:transparent|#0000(?:0000)?)\s*;/],
    ['bg-none', '.bg-none', /background-image:\s*none\s*;/],
    ['[box-shadow:none]', String.raw`.\[box-shadow\:none\]`, /box-shadow:\s*none\s*;/],
    [
      'text-fg-default',
      '.text-fg-default',
      /color:\s*var\(--color-fg-default(?:,\s*var\(--color-primitive-white\))?\)\s*;/
    ]
  ])('emits the native Gauge transparent-frame utility %s', (utility, selector, declaration) => {
    // Inspect the exact emitted utility, not a legacy or retired component's Material recipe.
    expect(rule(selector)).toMatch(declaration);
    expect(gaugeCircleVariants().split(/\s+/)).toContain(utility);
  });

  it('keeps Gauge independent of Surface imports and class identities', () => {
    for (const file of ['Gauge.tsx', 'types.ts', 'useGauge.ts']) {
      const source = readFileSync(new URL(`../atoms/gauge/${file}`, import.meta.url), 'utf8');
      expect(source).not.toMatch(/(?:from\s*['"][^'"]*surface|\beg-surface\b|<Surface\b)/i);
    }
  });

  it('preserves the original half-pixel inner-edge smoothing without changing the stroke origin', () => {
    const arc = rule('.eg-gauge-arc');
    expect(arc).toMatch(/transparent calc\(100% - var\(--eg-gauge-stroke\)\)/);
    expect(arc).toMatch(/(?:black|#000(?:000)?) calc\(100% - var\(--eg-gauge-stroke\) \+ 0?\.5px\)/);
  });

  it('compiles the Gauge story example layouts without requiring production story scanning', () => {
    expect(rule('.flex')).toMatch(/display:\s*flex\s*;/);
    expect(rule('.flex-wrap')).toMatch(/flex-wrap:\s*wrap\s*;/);
    expect(rule('.items-start')).toMatch(/align-items:\s*flex-start\s*;/);
    expect(rule('.gap-4')).toMatch(/gap:\s*var\(--space-4\)\s*;/);
    expect(css).not.toMatch(/@(reference|source|tailwind)\b/);
  });

  it('compiles the first molecule source with snap, dragging, token gap and slide-focus utilities', () => {
    expect(rule('.basis-full')).toMatch(/flex-basis:\s*100%/);
    expect(rule('.snap-center')).toMatch(/scroll-snap-align:\s*center/);
    expect(rule('.scroll-auto')).toMatch(/scroll-behavior:\s*auto/);
    expect(rule('.gap-7')).toMatch(/gap:\s*var\(--space-7[,)]/);
    expect(css).toContain(String.raw`.group-data-\[state\=dragging\]\:snap-none`);
    expect(css).toContain(String.raw`.group-data-\[state\=dragging\]\:cursor-grabbing`);
    expect(css).toContain(String.raw`.focus-visible\:shadow-\[var\(--shadow-focus\)\]`);
    expect(css).not.toMatch(/\.eg-carousel[^{]*\{/);
  });

  it('preserves the external font import in a valid position and the existing body token bindings', () => {
    const fonts = /@import\s+(?:url\()?['"]https:\/\/fonts\.googleapis\.com\/css2\?[^'"]+['"]\)?\s*;/.exec(css);
    expect(fonts, 'Google Fonts must remain imported, not silently dropped by compilation').not.toBeNull();
    if (!fonts) {
      throw new Error('Missing external font import');
    }
    // Only charset/layer statements may precede imports, never style rules or layer blocks.
    expect(isImportPreamble(css.slice(0, fonts.index))).toBe(true);
    for (const family of ['Barlow+Condensed', 'Barlow', 'JetBrains+Mono']) {
      expect(fonts[0]).toContain(`family=${family}:`);
    }
    const body = rule('body');
    expect(body).toMatch(/margin:\s*0\s*;/);
    expect(body).toMatch(/background:\s*var\(--color-bg-canvas\)\s*;/);
    expect(body).toMatch(/color:\s*var\(--color-fg-default\)\s*;/);
    expect(body).toMatch(/font-family:\s*var\(--font-sans\)\s*;/);
  });
});
