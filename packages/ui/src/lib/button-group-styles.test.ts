// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { compile } from 'tailwindcss';
import { describe, expect, it } from 'vitest';
import { buttonGroupVariants } from '../molecules/button-group/types';

// Compile in memory: no build artifacts or consumer installs are created by this focused check.
describe('ButtonGroup static utility emission', () => {
  it('emits the actual CVA candidates with token gaps, logical corners and child focus stacking', async () => {
    const theme = fileURLToPath(new URL('../../../tokens/src/theme.css', import.meta.url));
    const compiler = await compile('@reference "tokens"; @layer utilities { @tailwind utilities; }', {
      loadStylesheet: async () => ({ path: theme, base: '', content: readFileSync(theme, 'utf8') })
    });
    const candidates = [
      ...new Set([
        ...buttonGroupVariants().split(' '),
        ...buttonGroupVariants({ variant: 'attached' }).split(' '),
        'rounded-md'
      ])
    ];
    const css = compiler.build(candidates);
    expect(css).toContain('.gap-3');
    expect(css).toMatch(/gap:\s*var\(--space-3\)/);
    expect(css).toContain(String.raw`.gap-0\.5`);
    expect(css).toMatch(/gap:\s*calc\(var\(--space-1\)\s*\*\s*0\.5\)/);
    expect(css).toMatch(/flex-wrap:\s*wrap/);
    expect(css).toMatch(/flex-wrap:\s*nowrap/);
    for (const selector of [
      String.raw`.\*\:not-first\:rounded-s-sm`,
      String.raw`.\*\:not-last\:rounded-e-sm`,
      String.raw`.\*\:focus-visible\:relative`,
      String.raw`.\*\:focus-visible\:z-10`
    ]) {
      expect(css).toContain(selector);
    }
    expect(css).toMatch(/:not\(:first-child\)/);
    expect(css).toMatch(/:not\(:last-child\)/);
    for (const corner of ['start-start', 'start-end', 'end-start', 'end-end']) {
      expect(css).toContain(`border-${corner}-radius: var(--radius-sm, 4px)`);
    }
    expect(css).toMatch(/position:\s*relative/);
    expect(css).toMatch(/z-index:\s*10/);
    expect(css.indexOf(String.raw`.\*\:not-first\:rounded-s-sm`)).toBeGreaterThan(css.indexOf('.rounded-md'));
    const source = readFileSync(fileURLToPath(new URL('../styles/compiled.css', import.meta.url)), 'utf8');
    expect(source).toContain('@source "../molecules/**/types.ts"');
  });
});
