// @vitest-environment node
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { build } from 'vite';
import { expect, it } from 'vitest';
import { type NoticeTone, noticeVariants } from '../molecules/notice/types';

const tones: NoticeTone[] = ['neutral', 'info', 'success', 'warning', 'danger'];

it.each(tones)('composes both Notice sizes and replaces Surface border and sheen for %s', (tone) => {
  for (const size of ['md', 'sm'] as const) {
    const classes = noticeVariants({ tone, size }).split(' ');
    const color = tone === 'neutral' ? 'fg-secondary' : `status-${tone}`;
    expect(classes).toContain(`border-${color}/30`);
    expect(classes).toContain(`from-${color}/11`);
    expect(classes).toContain(`to-${color}/4`);
    expect(classes).toContain('bg-linear-to-b');
    expect(classes).toContain('bg-surface-1');
    expect(classes).toContain('shadow-[var(--shadow-edge),var(--shadow-elev-1)]');
    expect(classes).not.toContain('border-border-hairline');
    expect(classes).not.toContain('bg-[image:var(--gradient-sheen)]');
    // Surface's p-0 may remain: Notice's axis-specific padding overrides both axes.
    expect(classes).toContain(size === 'sm' ? 'px-3' : 'px-4');
    expect(classes).toContain(size === 'sm' ? 'py-2' : 'py-3');
    expect(classes).toContain(size === 'sm' ? 'text-label-default' : 'text-body-default');
  }
});

it('exports shared Notice appearance with only the inherited Surface marker (A1)', () => {
  const classes = noticeVariants();
  expect(classes.split(' ')).toContain('eg-surface');
  expect(classes).not.toMatch(/eg-notice|eg-toast|role=|aria-|bell|alert|check/);
});

/** Compile the real production entry in memory, without a tokens dist or a consumer compiler. */
it('ships Notice molecule utilities in the production CSS entry', async () => {
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
        input: fileURLToPath(new URL('../styles/compiled.css', import.meta.url))
      }
    }
  });
  const assets = (Array.isArray(result) ? result : [result]).flatMap((output) =>
    'output' in output ? output.output : []
  );
  const stylesheet = assets.find((asset) => asset.type === 'asset' && asset.fileName.endsWith('.css'));
  if (stylesheet?.type !== 'asset') {
    throw new Error('Production entry did not emit a CSS asset');
  }
  const css = String(stylesheet.source);
  const rule = (selector: string) => {
    const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = [...css.matchAll(new RegExp(`${escaped}\\s*\\{([^}]+)\\}`, 'g'))];
    expect(matches.length, `Missing production utility ${selector}`).toBeGreaterThan(0);
    return matches.map((match) => match[1]).join('\n');
  };
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
  expect(rule('.m-0')).toMatch(/margin:\s*var\(--space-0/);
  expect(css.indexOf('.m-0')).toBeLessThan(css.indexOf('.ms-auto'));
  expect(css).toContain('var(--shadow-edge), var(--shadow-elev-1)');
});
