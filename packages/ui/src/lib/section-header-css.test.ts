// @vitest-environment node
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';
import { expect, it } from 'vitest';

it('compiles SectionHeader layout and Text lede utilities from production sources in memory', async () => {
  const entry = fileURLToPath(new URL('../styles/compiled.css', import.meta.url));
  const source = readFileSync(entry, 'utf8');
  expect(source).toContain('@source "../molecules/section-header/types.ts"');
  expect(source).toContain('@source "../primitives/text/types.ts"');
  expect(existsSync(fileURLToPath(new URL('../molecules/section-header/section-header.css', import.meta.url)))).toBe(
    false
  );
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
  expect(css).toMatch(/\.text-body-muted\s*\{[^}]*font-size:\s*var\(--text-body-muted/);
  expect(css).toMatch(/\.text-body-muted\s*\{[^}]*line-height:[^}]*--text-body-muted--line-height/);
  expect(css).toMatch(/\.font-sans\s*\{[^}]*font-family:\s*var\(--font-sans/);
  expect(css).toMatch(/\.text-fg-secondary\s*\{[^}]*color:\s*var\(--color-fg-secondary/);
  expect(css).toMatch(/@media\s*\(width >= 860px\)/);
  expect(css).toContain(String.raw`.section-header-split\:grid-cols-`);
}, 30_000);
