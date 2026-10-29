// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';
import { expect, it } from 'vitest';

it('compiles production Tabs CVA utilities without writing build artifacts', async () => {
  const entry = fileURLToPath(new URL('../styles/compiled.css', import.meta.url));
  expect(readFileSync(entry, 'utf8')).toContain('@source "../molecules/tabs/types.ts"');
  const result = await build({
    configFile: false,
    envDir: false,
    plugins: [tailwindcss({ optimize: false })],
    logLevel: 'warn',
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      rolldownOptions: { input: entry }
    }
  });
  const assets = (Array.isArray(result) ? result : [result]).flatMap((output) =>
    'output' in output ? output.output : []
  );
  const asset = assets.find((output) => output.type === 'asset' && output.fileName.endsWith('.css'));
  if (asset?.type !== 'asset') {
    throw new Error('Missing production CSS output');
  }
  const css = String(asset.source);
  const rule = (selector: string) => {
    const start = css.indexOf(selector);
    expect(start, selector).toBeGreaterThan(-1);
    return css.slice(start, css.indexOf('}', start) + 1);
  };
  expect(rule(String.raw`.p-0\.75`)).toMatch(/padding:\s*calc\(var\(--space-1\)\s*\*\s*0\.75\)/);
  expect(rule(String.raw`.min-h-8\.5`)).toMatch(/min-height:\s*calc\(var\(--space-1\)\s*\*\s*8\.5\)/);
  expect(rule(String.raw`.rounded-\[calc\(var\(--radius-md\)---spacing\(0\.75\)\)\]`)).toMatch(
    /border-radius:\s*calc\(var\(--radius-md\)\s*-\s*calc\(var\(--space-1\)\s*\*\s*0\.75\)\)/
  );
  expect(rule(String.raw`.\[scrollbar-width\:none\]`)).toContain('scrollbar-width: none');
  expect(rule(String.raw`.data-\[state\=active\]\:after\:bg-fg-brand-default`)).toMatch(
    /var\(--color-fg-brand-default[,)]/
  );
  expect(rule(String.raw`.data-\[state\=active\]\:after\:shadow-glow-base`)).toMatch(
    /--tw-shadow:[^;]+;[\s\S]*box-shadow:/
  );
  expect(rule(String.raw`.bg-status-danger\/14`)).toMatch(/var\(--color-status-danger[^;]*14%, transparent/);
  expect(rule(String.raw`.focus-visible\:inset-ring-focus-ring`)).toMatch(/var\(--color-focus-ring[,)]/);
  const reducedIndicator = String.raw`.motion-reduce\:after\:transition-none`;
  expect(rule(reducedIndicator)).toContain('transition-property: none');
  const reducedStart = css.indexOf(reducedIndicator);
  expect(css.slice(css.lastIndexOf('@media', reducedStart), reducedStart)).toContain('prefers-reduced-motion: reduce');
  const activeShadow = css.indexOf(String.raw`.data-\[state\=active\]\:shadow-\[var\(--shadow-edge-strong\)`);
  const activeFocus = css.indexOf(String.raw`.data-\[state\=active\]\:focus-visible\:shadow-focus`);
  expect(activeShadow).toBeGreaterThan(-1);
  expect(activeFocus).toBeGreaterThan(activeShadow);
  expect(rule(String.raw`.data-\[state\=active\]\:focus-visible\:shadow-focus`)).toMatch(
    /--tw-shadow:[^;]+;[\s\S]*box-shadow:/
  );
}, 30_000);
