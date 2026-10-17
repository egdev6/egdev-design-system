import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, within } from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import { ColorInventory, parseColorTokens } from '../../../../.storybook/color-inventory';

const read = (path: string) => readFileSync(resolve(import.meta.dirname, '../../../../', path), 'utf8');
const source = read('packages/tokens/src/theme.css');
const declarations = [...source.replace(/\/\*[\s\S]*?\*\//g, '').matchAll(/(--[\w*-]+)\s*:\s*([^;]+);/g)]
  .map((match) => [match[1] ?? '', match[2]?.trim() ?? ''])
  .filter(
    ([name = '']) => (name.startsWith('--color-') && name !== '--color-*') || /^--logo-red(?:-shade)?$/.test(name)
  );

afterEach(() => vi.restoreAllMocks());

it('integrates every source color once, rather than a curated MDX subset', () => {
  const mdx = read('docs/storybook/color.mdx');
  expect(mdx, 'Color MDX must import the canonical theme as raw source for the complete inventory').toMatch(
    /import tokenSource from ['"]\.\.\/\.\.\/packages\/tokens\/src\/theme\.css\?raw['"]/
  );
  expect(mdx).toMatch(/import \{ ColorInventory \} from ['"]\.\.\/\.\.\/\.storybook\/color-inventory['"]/);
  expect(mdx).toContain('<ColorInventory source={tokenSource} />');
  expect(mdx).not.toContain('data-color=');
  const { container } = render(<ColorInventory source={source} />);
  const names = [...container.querySelectorAll('[data-token]')].map((card) => card.getAttribute('data-token'));
  expect(names).toHaveLength(81);
  expect(new Set(names).size).toBe(names.length);
  expect(names.sort()).toEqual(declarations.map(([name]) => name).sort());
  expect(container.querySelectorAll('[data-token] .eg-docs-swatch')).toHaveLength(names.length * 2);
  expect(parseColorTokens(source).map(({ name, declaration }) => [name, declaration])).toEqual(declarations);
});

it('preserves literals and references while resolving forward aliases and logo colors', () => {
  const fixture = `@theme static {
    --color-*: initial;
    /* --color-not-a-token: #FF0036; */
    --color-status-danger: var(--color-fg-brand-raised);
    --color-fg-brand-raised: var(--color-primitive-red-300);
    --color-bg-deep: var(--logo-red-shade);
    --color-primitive-red-300: #FF6680;
    --color-alpha-red-12: rgba(255, 0, 54, 0.12);
    --space-1: 4px;
  }
  :root { --logo-red: #E91B35; --logo-red-shade: #800C1D; }`;
  expect(parseColorTokens(fixture).map(({ name, declaration, canonical }) => [name, declaration, canonical])).toEqual([
    ['--color-status-danger', 'var(--color-fg-brand-raised)', '#FF6680'],
    ['--color-fg-brand-raised', 'var(--color-primitive-red-300)', '#FF6680'],
    ['--color-bg-deep', 'var(--logo-red-shade)', '#800C1D'],
    ['--color-primitive-red-300', '#FF6680', '#FF6680'],
    ['--color-alpha-red-12', 'rgba(255, 0, 54, 0.12)', 'rgba(255, 0, 54, 0.12)'],
    ['--logo-red', '#E91B35', '#E91B35'],
    ['--logo-red-shade', '#800C1D', '#800C1D']
  ]);
});

it('rejects missing references and cycles explicitly instead of inventing canonical colors', () => {
  expect(() => parseColorTokens('--color-bg-deep: var(--logo-red-shade);')).toThrow(
    'Missing color reference: --logo-red-shade'
  );
  expect(() => parseColorTokens('--color-a: var(--color-b); --color-b: var(--color-a);')).toThrow(
    'Circular color reference: --color-a → --color-b → --color-a'
  );
});

it('emits one card per name when a declaration is repeated', () => {
  expect(parseColorTokens('--color-primitive-red-300: #FF6680; --color-primitive-red-300: #FF0036;')).toEqual([
    expect.objectContaining({ name: '--color-primitive-red-300', declaration: '#FF0036', canonical: '#FF0036' })
  ]);
});

it('shows six distinct original reds and all seven navigable inventory groups', () => {
  const { container, getAllByRole } = render(<ColorInventory source={source} />);
  expect(getAllByRole('heading', { level: 2 }).map((heading) => heading.textContent)).toEqual([
    'Brand reds',
    'Graphite',
    'Neutrals',
    'Alpha colors',
    'Semantic roles',
    'Ambient colors',
    'Logo colors'
  ]);
  const reds = [...container.querySelectorAll('[data-token^="--color-primitive-red-"]')];
  expect(reds).toHaveLength(6);
  expect(
    new Set(reds.map((card) => card.querySelector<HTMLElement>('[data-view="original"]')?.style.backgroundColor)).size
  ).toBe(6);
  for (const card of reds) {
    expect(within(card as HTMLElement).getByText('Original token')).toBeInTheDocument();
    expect(within(card as HTMLElement).getByText('Storybook preview')).toBeInTheDocument();
  }
});

it('reads effective preview paint, discloses substituted aliases, and never overrides token variables', () => {
  // JSDOM is not the browser acceptance gate: simulate computed CSS, not an override in the renderer.
  const tokens = parseColorTokens(source);
  const changed = ['--color-primitive-red-300', '--color-fg-brand-raised', '--color-status-danger'];
  const nativeComputedStyle = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
    const name = element.closest('[data-token]')?.getAttribute('data-token');
    if (name && element.getAttribute('data-view') === 'preview') {
      const style = document.createElement('span').style;
      style.backgroundColor = changed.includes(name)
        ? '#FF0036'
        : (tokens.find((token) => token.name === name)?.canonical ?? '');
      return style;
    }
    return nativeComputedStyle(element);
  });
  const rootStyle = document.documentElement.getAttribute('style');
  const { container } = render(<ColorInventory source={source} />);
  expect(document.documentElement.getAttribute('style')).toBe(rootStyle);
  expect(container.querySelectorAll('[data-different="true"]')).toHaveLength(3);
  expect(container.querySelectorAll('[data-different="false"]')).toHaveLength(78);
  for (const name of changed) {
    const card = container.querySelector(`[data-token="${name}"]`) as HTMLElement;
    const figures = within(card).getAllByRole('figure');
    expect(figures[0]).toHaveTextContent('Original token#FF6680');
    expect(figures[1]).toHaveTextContent('Storybook preview#FF0036');
    expect(within(card).getByText('Differs from original')).toBeInTheDocument();
    expect(card.querySelector<HTMLElement>('[data-view="preview"]')?.style.backgroundColor).toBe(`var(${name})`);
  }
  expect(container.querySelector('[data-token="--color-bg-deep"]')).toHaveTextContent('#800C1D');
  expect(container.querySelector('[data-token="--color-fg-brand-raised"]')).toHaveTextContent(
    'var(--color-primitive-red-300)'
  );
  const alpha = container.querySelector('[data-token="--color-alpha-red-12"]') as HTMLElement;
  expect(within(alpha).getAllByRole('figure')[1]).toHaveTextContent('rgba(255, 0, 54, 0.12)');
});
