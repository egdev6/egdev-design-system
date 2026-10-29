// @vitest-environment node
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';
import { describe, expect, it } from 'vitest';

/** Compile the real production entry in memory: no dist writes or incidental story scanning. */
describe('Menu production CSS', () => {
  it('emits token geometry, data variants, shared overlay fallbacks and reduced-motion-safe entry', async () => {
    const result = await build({
      configFile: false,
      envDir: false,
      plugins: [tailwindcss({ optimize: false })],
      logLevel: 'warn',
      build: {
        write: false,
        minify: false,
        cssMinify: false,
        rolldownOptions: { input: fileURLToPath(new URL('../styles/compiled.css', import.meta.url)) }
      }
    });
    const assets = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const asset = assets.find((item) => item.type === 'asset' && item.fileName.endsWith('.css'));
    if (asset?.type !== 'asset') {
      throw new Error('Missing production CSS asset');
    }
    const css = String(asset.source).replace(/\/\*[\s\S]*?\*\//g, '');
    for (const selector of [
      String.raw`.min-w-57\.5`,
      String.raw`.py-2\.25`,
      String.raw`.max-h-\[var\(--radix-dropdown-menu-content-available-height\)\]`,
      String.raw`.data-highlighted\:bg-status-danger\/10`,
      String.raw`.group-data-highlighted\:text-fg-brand-default`,
      String.raw`.focus-visible\:inset-ring-focus-ring-inverse`,
      String.raw`.pointer-coarse\:min-h-11`,
      String.raw`.starting\:opacity-0`,
      String.raw`.motion-safe\:starting\:-translate-y-1\.5`,
      String.raw`.motion-reduce\:transition-none`
    ]) {
      expect(css, selector).toContain(selector);
    }
    expect(css).toMatch(/min-width:\s*calc\(var\(--space-1\)\s*\*\s*57\.5\)/);
    expect(css).toMatch(/padding-block:\s*calc\(var\(--space-1\)\s*\*\s*2\.25\)/);
    expect(css).toMatch(/max-height:\s*var\(--radix-dropdown-menu-content-available-height\)/);
    expect(css).toMatch(/transition-property:\s*opacity,\s*translate/);
    expect(css).toMatch(/@starting-style/);
    expect(css).toMatch(/prefers-reduced-motion:\s*no-preference/);
    expect(css).toMatch(/prefers-reduced-transparency:\s*reduce/);
    expect(css).toMatch(/not \(backdrop-filter:/);
    expect(css).toContain('var(--color-surface-overlay)');
    expect(css).toContain('var(--shadow-edge-strong), var(--shadow-elev-3)');
    expect(css).toContain('var(--color-surface-2)');
    expect(css).not.toMatch(/@(source|reference|tailwind|theme)\b/);
  }, 30_000);
});
