import { create } from 'storybook/theming/create';

/** Read resolved tokens: Storybook calculates colors and cannot use var() expressions. */
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
    brandTitle: 'Egdev Design system',
    brandImage: './brand/egdev-logo-with-name.png',
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
