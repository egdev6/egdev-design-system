// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';
import { beforeAll, describe, expect, it } from 'vitest';
import { gaugeCircleVariants } from '../atoms/gauge/types';

let css: string;

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
    [
      'bg-[var(--color-surface-0)]',
      String.raw`.bg-\[var\(--color-surface-0\)\]`,
      /background-color:\s*var\(--color-surface-0\)\s*;/
    ],
    ['bg-none', '.bg-none', /background-image:\s*none\s*;/],
    [
      '[box-shadow:var(--shadow-well)]',
      String.raw`.\[box-shadow\:var\(--shadow-well\)\]`,
      /box-shadow:\s*var\(--shadow-well\)\s*;/
    ],
    [
      'text-fg-default',
      '.text-fg-default',
      /color:\s*var\(--color-fg-default(?:,\s*var\(--color-primitive-white\))?\)\s*;/
    ]
  ])('emits the native Gauge well Material utility %s', (utility, selector, declaration) => {
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

  it('preserves the external font import in a valid position and the existing body token bindings', () => {
    const fonts = /@import\s+(?:url\()?['"]https:\/\/fonts\.googleapis\.com\/css2\?[^'"]+['"]\)?\s*;/.exec(css);
    expect(fonts, 'Google Fonts must remain imported, not silently dropped by compilation').not.toBeNull();
    if (!fonts) {
      throw new Error('Missing external font import');
    }
    // Only charset/layer statements may precede imports, never style rules or layer blocks.
    expect(css.slice(0, fonts.index)).toMatch(/^(?:\s*@(?:charset\s+[^;]+|layer\s+[^;{]+);)*\s*$/);
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
