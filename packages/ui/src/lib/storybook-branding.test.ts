import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Preview } from '@storybook/react-vite';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { jsdocControlsEnhancer } from '../../../../.storybook/jsdoc-controls';
import { createBrandTheme } from '../../../../.storybook/theme';

// Representative resolved values injected to test mapping independently of browser CSS.
const tokens: Record<string, string> = {
  '--color-fg-brand-default': '#FF0036',
  '--color-fg-brand-raised': '#FF0036',
  '--color-bg-canvas': '#141518',
  '--color-surface-0': '#141518',
  '--color-surface-1': '#1B1C20',
  '--color-surface-2': '#232428',
  '--color-border-hairline': 'rgba(255, 255, 255, 0.08)',
  '--color-border-control': '#7A7B81',
  '--radius-md': '9.6px',
  '--radius-sm': '3.2px',
  '--font-sans': '"Barlow", system-ui, sans-serif',
  '--font-mono': '"JetBrains Mono", ui-monospace, monospace',
  '--color-fg-default': '#FFFFFF',
  '--color-fg-muted': '#A1A2A8',
  '--color-fg-on-status': '#000000',
  '--color-fg-secondary': '#CCCCCC'
};

const readToken = (name: string) => tokens[name] ?? '';

describe('Storybook brand theme', () => {
  it('uses the approved display name and original horizontal logo route', () => {
    expect(createBrandTheme(readToken)).toMatchObject({
      base: 'dark',
      brandTitle: 'Egdev Design system',
      brandImage: './brand/egdev-logo-with-name.png',
      brandUrl: 'https://egdev.es'
    });
  });

  it('reads resolved EGDEV tokens instead of falling back to the default palette', () => {
    const reader = vi.fn((name: string) => `  ${readToken(name)}  `);
    expect(createBrandTheme(reader)).toMatchObject({
      colorPrimary: '#FF0036',
      colorSecondary: '#FF0036',
      appBg: '#141518',
      appContentBg: '#1B1C20',
      appPreviewBg: '#141518',
      appBorderColor: 'rgba(255, 255, 255, 0.08)',
      appBorderRadius: 9.6,
      fontBase: tokens['--font-sans'],
      fontCode: tokens['--font-mono'],
      inputBorderRadius: 3.2
    });
    expect(reader).toHaveBeenCalledWith('--color-bg-canvas');
    expect(reader).toHaveBeenCalledWith('--color-fg-brand-raised');
  });

  it('fails explicitly when tokens are unavailable at initialization', () => {
    expect(() => createBrandTheme(() => '')).toThrow('Missing EGDEV token: --color-fg-brand-default');
  });

  it('preserves the approved transparent PNG bytes', () => {
    const logo = readFileSync(resolve(import.meta.dirname, '../../../../.storybook/public/egdev-logo-with-name.png'));
    // Fingerprint of the user-approved original; no dependency on a personal filesystem path.
    expect(createHash('sha256').update(logo).digest('hex')).toBe(
      '67ae5f19a14994cd842bf1f74a8bf9d4dc6158cdd280cfca8e29e10fbe728bd5'
    );
    expect([logo.readUInt32BE(16), logo.readUInt32BE(20)]).toEqual([653, 258]);
  });
});

describe('Storybook-only palette', () => {
  const read = (path: string) => readFileSync(resolve(import.meta.dirname, '../../../../', path), 'utf8');

  it('shows the published tokens without any Storybook substitution', () => {
    const sheet = new CSSStyleSheet();
    sheet.replaceSync(read('.storybook/palette.css')); // Comment-only sheet: no rules, no alias.
    expect(sheet.cssRules).toHaveLength(0);
    expect(read('.storybook/palette.css')).not.toContain('--color-primitive-red-300');
  });

  it.each(['manager', 'preview'])('loads the shared palette before %s reads the theme', (entry) => {
    const css = read(`.storybook/${entry}.css`);
    const paletteImport = css.indexOf('@import "./palette.css";');
    expect(paletteImport).toBeGreaterThanOrEqual(0);
    // Imports must precede style rules and Tailwind source directives to be valid CSS.
    expect(css.slice(0, paletteImport)).not.toMatch(/[{}]|@source\b/);
    const bootstrap = read(`.storybook/${entry}.${entry === 'preview' ? 'tsx' : 'ts'}`);
    const styleImport = bootstrap.indexOf(`import './${entry}.css';`);
    expect(styleImport).toBeGreaterThanOrEqual(0);
    expect(styleImport).toBeLessThan(bootstrap.indexOf('createBrandTheme()'));
  });

  it('publishes neon brand text and keeps the pink primitive for errors only', () => {
    for (const path of ['packages/tokens/src/theme.css', 'packages/tokens/dist/tokens.css']) {
      const css = read(path);
      expect(css).toContain('--color-primitive-red-300: #FF6680;');
      expect(css).toContain('--color-status-danger: var(--color-primitive-red-300);');
      expect(css).toContain('--color-fg-brand-raised: var(--color-primitive-red-neon);');
    }
  });
});

describe('Storybook preview configuration', () => {
  let preview: Preview;

  beforeAll(async () => {
    for (const [name, value] of Object.entries(tokens)) {
      document.documentElement.style.setProperty(name, value);
    }
    preview = (await import('../../../../.storybook/preview')).default;
  });

  afterAll(() => {
    for (const name of Object.keys(tokens)) {
      document.documentElement.style.removeProperty(name);
    }
  });

  it('gives Docs the same token-resolved dark theme as the manager', () => {
    expect(preview.parameters?.docs?.theme).toEqual(createBrandTheme());
    expect(preview.parameters?.docs?.theme.appBg).toBe('#141518');
  });

  it('orders the approved documentation hierarchy without renaming component groups', () => {
    expect(preview.parameters?.options?.storySort).toEqual({
      order: [
        'Welcome',
        'Foundations',
        ['Color', 'Typography', 'Layout', 'Material', 'Motion'],
        'Arquitectura',
        'Primitives',
        'Atoms',
        'Molecules',
        'Organisms',
        'Templates',
        'Contributing'
      ]
    });
  });

  it('preserves the Gauge JSDoc controls enhancer and canvas defaults', () => {
    expect(preview.argTypesEnhancers).toContain(jsdocControlsEnhancer);
    expect(preview.parameters).toMatchObject({ backgrounds: { disable: true }, layout: 'padded' });
  });

  it('loads token CSS before the preview module reads computed values', () => {
    const head = readFileSync(resolve(import.meta.dirname, '../../../../.storybook/preview-head.html'), 'utf8');
    const parsed = new DOMParser().parseFromString(head, 'text/html');
    expect(parsed.querySelector('link[rel="stylesheet"]')?.getAttribute('href')).toBe('./tokens/tokens.css');
  });

  it('keeps portable-story configuration importable in Node without browser styles', async () => {
    vi.resetModules();
    vi.stubGlobal('document', undefined);
    try {
      const portablePreview = (await import('../../../../.storybook/preview')).default;
      expect(portablePreview.parameters?.docs?.theme).toBeUndefined();
      expect(portablePreview.parameters?.layout).toBe('padded');
    } finally {
      vi.unstubAllGlobals();
      vi.resetModules();
    }
  });
});

describe('Storybook manager sidebar icons', () => {
  const read = (path: string) => readFileSync(resolve(import.meta.dirname, '../../../../', path), 'utf8');
  it('paints document and story icons with the neon brand token outside the selected row', () => {
    const css = read('.storybook/manager.css');
    expect(css).toMatch(
      /#storybook-explorer-tree \[data-selected=["']false["']\] svg\[type=["']document["']\],\s*#storybook-explorer-tree \[data-selected=["']false["']\] svg\[type=["']story["']\]\s*\{\s*color: var\(--color-fg-brand-raised\);\s*\}/
    );
  });
});
