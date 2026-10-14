import { create } from 'storybook/theming/create';

/** Lee valores resueltos: Storybook calcula colores y necesita valores, no expresiones var(). */
export const createBrandTheme = (
  readToken: (name: string) => string = (name) => getComputedStyle(document.documentElement).getPropertyValue(name)
) => {
  const token = (name: string): string => {
    const value = readToken(name).trim();
    if (!value) {
      throw new Error(`Missing EGDEV token: ${name}`);
    }
    return value;
  };
  return create({
    base: 'dark',
    brandTitle: 'EGDEV',
    brandImage: './brand/egdev-logo.png',
    brandUrl: 'https://egdev.es',
    brandTarget: '_blank',
    colorPrimary: token('--color-fg-brand-default'),
    colorSecondary: token('--color-fg-brand-raised'),
    appBg: token('--color-bg-canvas'),
    appContentBg: token('--color-surface-1'),
    appPreviewBg: token('--color-bg-canvas'),
    appBorderColor: token('--color-border-hairline'),
    appBorderRadius: Number.parseFloat(token('--radius-md')),
    fontBase: token('--font-sans'),
    fontCode: token('--font-mono'),
    textColor: token('--color-fg-default'),
    textMutedColor: token('--color-fg-muted'),
    textInverseColor: token('--color-fg-on-status'),
    barBg: token('--color-surface-1'),
    barTextColor: token('--color-fg-secondary'),
    barHoverColor: token('--color-fg-default'),
    barSelectedColor: token('--color-fg-brand-raised'),
    buttonBg: token('--color-surface-2'),
    buttonBorder: token('--color-border-control'),
    inputBg: token('--color-surface-0'),
    inputBorder: token('--color-border-control'),
    inputTextColor: token('--color-fg-default'),
    inputBorderRadius: Number.parseFloat(token('--radius-sm'))
  });
};
