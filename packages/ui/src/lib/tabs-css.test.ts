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
  expect(rule('.grid {')).toContain('display: grid');
  expect(rule('.w-full {')).toMatch(/width:\s*100%/);
  expect(rule('.py-1 {')).toContain('padding-block:');
  expect(rule('.grid-flow-col')).toContain('grid-auto-flow: column');
  // Plain 1fr keeps each column at least as wide as its label, so overflow scrolls instead of squeezing.
  expect(rule(String.raw`.auto-cols-\[1fr\]`)).toMatch(/grid-auto-columns:\s*1fr/);
  // Blink/WebKit get pseudo-element styling without arrow buttons; Firefox gets the standard
  // properties behind @supports, so Chromium 121+ does not ignore the pseudo-elements.
  expect(css).toMatch(/::-webkit-scrollbar\s*\{[^}]*height:\s*calc\(var\(--space-1\)\s*\*\s*1\.5\)/);
  expect(css).toMatch(/::-webkit-scrollbar-thumb\s*\{[^}]*background-color:\s*var\(--color-border-control[,)]/);
  expect(css).toMatch(/::-webkit-scrollbar-thumb\s*\{[^}]*background-color:\s*var\(--color-fg-muted[,)]/);
  expect(css).toMatch(/::-webkit-scrollbar-button\s*\{[^}]*display:\s*none/);
  expect(css).toMatch(/@supports\s+\(?not\s+selector\(::-webkit-scrollbar\)\)?\s*\{[^}]*scrollbar-width:\s*thin/);
  expect(css).toMatch(
    /@supports\s+\(?not\s+selector\(::-webkit-scrollbar\)\)?\s*\{[\s\S]*?scrollbar-color:\s*var\(--color-border-control\) transparent/
  );
  expect(rule('.wrap-anywhere')).toContain('overflow-wrap: anywhere');
  expect(rule('.wrap-break-word')).toContain('overflow-wrap: break-word');
  expect(rule('.whitespace-normal')).toContain('white-space: normal');
  expect(rule('.whitespace-nowrap')).toContain('white-space: nowrap');
  expect(rule('.text-start')).toContain('text-align: start');
  expect(rule('.justify-start')).toContain('justify-content: flex-start');
  expect(rule('.justify-center')).toContain('justify-content: center');
  expect(rule('.self-stretch')).toContain('align-self: stretch');
  expect(rule('.overflow-x-auto')).toContain('overflow-x: auto');
  expect(rule(String.raw`.p-0\.75`)).toMatch(/padding:\s*calc\(var\(--space-1\)\s*\*\s*0\.75\)/);
  expect(rule(String.raw`.min-h-8\.5`)).toMatch(/min-height:\s*calc\(var\(--space-1\)\s*\*\s*8\.5\)/);
  expect(rule(String.raw`.rounded-\[calc\(var\(--radius-md\)---spacing\(0\.75\)\)\]`)).toMatch(
    /border-radius:\s*calc\(var\(--radius-md\)\s*-\s*calc\(var\(--space-1\)\s*\*\s*0\.75\)\)/
  );
  expect(rule(String.raw`.\[scrollbar-width\:none\]`)).toContain('scrollbar-width: none');
  expect(rule(String.raw`.data-\[state\=active\]\:after\:bg-state-selected`)).toMatch(
    /var\(--color-state-selected[,)]/
  );
  expect(rule(String.raw`.data-\[state\=active\]\:after\:shadow-\[var\(--shadow-state-indicator\)\]`)).toMatch(
    /--tw-shadow:\s*var\(--shadow-state-indicator\)[\s\S]*box-shadow:/
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
  // Outline: accent-following border and chip sheen over surface-1 with the edge-only shadow.
  expect(rule(String.raw`.data-\[state\=active\]\:border-state-selected`)).toMatch(
    /border-color:\s*var\(--color-state-selected[,)]/
  );
  expect(
    rule(String.raw`.data-\[state\=active\]\:\[background\:var\(--gradient-chip-active\)\,var\(--color-surface-1\)\]`)
  ).toMatch(/background:\s*var\(--gradient-chip-active\),\s*var\(--color-surface-1\)/);
  const edgeOnly = String.raw`.data-\[state\=active\]\:shadow-\[var\(--shadow-edge-strong\)\]`;
  expect(rule(edgeOnly)).toMatch(/--tw-shadow:\s*var\(--shadow-edge-strong\)[\s\S]*box-shadow:/);
  expect(css.indexOf(String.raw`.data-\[state\=active\]\:focus-visible\:shadow-focus`)).toBeGreaterThan(
    css.indexOf(edgeOnly)
  );
  // v0.4 edge fade: registered fade sizes, scroll-driven keyframes and a mask guarded by @supports, so
  // browsers without scroll timelines render exactly as v0.3. Longhands only: the animation shorthand
  // would reset animation-timeline.
  expect(css).toMatch(/@property --eg-tabs-fade-start\s*\{[^}]*syntax:\s*"<length>"[^}]*initial-value:\s*0px/);
  expect(css).toMatch(/@property --eg-tabs-fade-end\s*\{[^}]*inherits:\s*false/);
  expect(css).toMatch(/@keyframes eg-tabs-edge-fade\s*\{[\s\S]*--eg-tabs-fade-end:\s*var\(--eg-tabs-fade-size\)/);
  const fadeGuard =
    /@supports\s*\(animation-timeline:\s*scroll\(\)\)\s*\{[\s\S]*?mask-image:\s*var\(--mask-scroll-fade-inline\)/;
  expect(css).toMatch(fadeGuard);
  expect(css).toMatch(
    /@supports\s*\(animation-timeline:\s*scroll\(\)\)\s*\{[\s\S]*?animation-timeline:\s*scroll\(self inline\)/
  );
  expect(css).not.toMatch(/animation:\s*eg-tabs-edge-fade/);
  // The fade width equals the scroll padding, so focus always lands past the faded zone.
  expect(rule(String.raw`.\[--eg-tabs-fade-size\:var\(--space-8\)\]`)).toMatch(
    /--eg-tabs-fade-size:\s*var\(--space-8\)/
  );
  expect(rule('.scroll-px-8')).toMatch(/scroll-padding-inline:\s*var\(--space-8\)/);
  expect(css).toMatch(
    /@supports\s*\(animation-timeline:\s*scroll\(\)\)\s*\{[\s\S]*?mask-size:\s*var\(--mask-fade-left\) 100%,\s*calc\(100% - var\(--mask-fade-left\) - var\(--mask-fade-right\)\) 100%,\s*var\(--mask-fade-right\) 100%/
  );
  expect(css).toMatch(
    /@supports\s*\(animation-timeline:\s*scroll\(\)\)\s*\{[\s\S]*?mask-position:\s*left,\s*var\(--mask-fade-left\) 0,\s*right/
  );
  expect(css).toMatch(/@supports\s*\(animation-timeline:\s*scroll\(\)\)\s*\{[\s\S]*?mask-repeat:\s*no-repeat/);
  expect(css).toMatch(/:dir\(rtl\)[\s\S]*?--mask-fade-left:\s*var\(--eg-tabs-fade-end\)/);
  // Scroll buttons are display:none by default; only the fine-hover media rule reveals them.
  const finePointerSelector = String.raw`.\[\@media\(hover\:hover\)_and_\(pointer\:fine\)\]\:inline-flex`;
  expect(rule(finePointerSelector)).toMatch(/display:\s*inline-flex/);
  // The selector's own rule follows its wrapping media query; nothing closes between them.
  const beforeFinePointer = css.slice(0, css.indexOf(finePointerSelector));
  const finePointerMedia = beforeFinePointer.slice(beforeFinePointer.lastIndexOf('@media'));
  expect(finePointerMedia).toMatch(/^@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{\s*$/);
  const theme = readFileSync(fileURLToPath(new URL('../../../tokens/src/theme.css', import.meta.url)), 'utf8');
  // Static layers only: a var() inside a :root token would be substituted at :root, never on the list.
  expect(theme).toContain(
    '--mask-scroll-fade-inline: linear-gradient(to right, transparent, #000), linear-gradient(#000, #000), linear-gradient(to left, transparent, #000);'
  );
}, 30_000);
