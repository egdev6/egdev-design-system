// @vitest-environment node
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { createBrandTheme } from '../../../../.storybook/theme';

const readToken = (name: string): string =>
  name === '--radius-md' ? '12px' : name === '--radius-sm' ? '4px' : `resolved:${name}`;

describe('Storybook brand theme', () => {
  it('publishes tokens and branding at the URLs used by the manager', () => {
    const main = readFileSync(new URL('../../../../.storybook/main.ts', import.meta.url), 'utf8');
    const head = readFileSync(new URL('../../../../.storybook/manager-head.html', import.meta.url), 'utf8');

    expect(main).toContain("{ from: '../packages/tokens/dist', to: '/tokens' }");
    expect(main).toContain("{ from: './public', to: '/brand' }");
    expect(head).toContain('href="./tokens/tokens.css"');
    expect(createBrandTheme(readToken).brandImage).toBe('./brand/egdev-logo.png');
    expect(
      readFileSync(new URL('../../../../.storybook/public/egdev-logo.png', import.meta.url)).length
    ).toBeGreaterThan(0);
  });

  it('maps manager and docs colors and fonts to the same EGDEV tokens', () => {
    const theme = createBrandTheme(readToken);
    expect(theme.base).toBe('dark');
    expect(theme.brandTitle).toBe('EGDEV');
    expect(theme.brandImage).toBe('./brand/egdev-logo.png');
    expect(theme.appBg).toBe('resolved:--color-bg-canvas');
    expect(theme.appContentBg).toBe('resolved:--color-surface-1');
    expect(theme.colorSecondary).toBe('resolved:--color-fg-brand-raised');
    expect(theme.fontBase).toBe('resolved:--font-sans');
    expect(theme.fontCode).toBe('resolved:--font-mono');
    expect(theme.appBorderRadius).toBe(12);
    expect(theme.inputBorderRadius).toBe(4);
  });

  it('rejects missing tokens rather than silently using unrelated colors', () => {
    expect(() => createBrandTheme(() => '')).toThrow(/Missing EGDEV token/);
  });
});
