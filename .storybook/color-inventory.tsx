import { useEffect, useRef, useState } from 'react';

type ColorToken = { name: string; declaration: string; canonical: string };

/** Parse the existing source's simple color declarations, not arbitrary CSS syntax. */
export function parseColorTokens(source: string): ColorToken[] {
  const declarations = new Map<string, string>();
  const css = source.replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of css.matchAll(/(--(?:color-[\w-]+|logo-red(?:-shade)?))\s*:\s*([^;{}]+);/g)) {
    const [, name = '', value = ''] = match;
    declarations.set(name, value.trim());
  }
  function resolve(name: string, path: string[] = []): string {
    if (path.includes(name)) {
      throw new Error(`Circular color reference: ${[...path, name].join(' → ')}`);
    }
    const value = declarations.get(name);
    if (value === undefined) {
      throw new Error(`Missing color reference: ${name}`);
    }
    return value.replace(/var\(\s*(--[\w-]+)\s*\)/g, (_, reference: string) => resolve(reference, [...path, name]));
  }
  return [...declarations].map(([name, declaration]) => ({ name, declaration, canonical: resolve(name) }));
}

const groups = [
  ['Brand reds', '--color-primitive-red-'],
  ['Graphite', '--color-primitive-graphite-'],
  ['Neutrals', '--color-primitive-'],
  ['Alpha colors', '--color-alpha-'],
  ['Ambient colors', '--color-ambient-'],
  ['Logo colors', '--logo-']
] as const;
const sections = [
  'Brand reds',
  'Graphite',
  'Neutrals',
  'Alpha colors',
  'Semantic roles',
  'Ambient colors',
  'Logo colors'
];
const groupFor = (name: string) => groups.find(([, prefix]) => name.startsWith(prefix))?.[0] ?? 'Semantic roles';

function previewValue(color: string): string {
  const rgb = /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/.exec(color);
  return rgb
    ? `#${rgb
        .slice(1)
        .map((channel) => Number(channel).toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase()}`
    : color;
}

function TokenCard({ token }: { token: ColorToken }) {
  const original = useRef<HTMLSpanElement>(null);
  const preview = useRef<HTMLSpanElement>(null);
  const [effective, setEffective] = useState<{ value: string; different: boolean }>();
  useEffect(() => {
    if (original.current && preview.current) {
      const originalColor = window.getComputedStyle(original.current).backgroundColor;
      const previewColor = window.getComputedStyle(preview.current).backgroundColor;
      setEffective({ value: previewValue(previewColor), different: originalColor !== previewColor });
    }
  }, [token.canonical, token.name]);
  return (
    <article className='eg-docs-card eg-docs-color-card' data-token={token.name} data-different={effective?.different}>
      <h3>
        <code>{token.name}</code>
      </h3>
      <p className='eg-docs-color-source'>
        Source: <code>{token.declaration}</code>
      </p>
      <div className='eg-docs-color-pair'>
        <figure>
          <span
            ref={original}
            className='eg-docs-swatch'
            data-view='original'
            style={{ backgroundColor: token.canonical }}
          />
          <figcaption>
            <strong>Original token</strong>
            <code>{token.canonical}</code>
          </figcaption>
        </figure>
        <figure>
          <span
            ref={preview}
            className='eg-docs-swatch'
            data-view='preview'
            style={{ backgroundColor: `var(${token.name})` }}
          />
          <figcaption>
            <strong>Storybook preview</strong>
            <code>{effective?.value || 'Reading preview…'}</code>
          </figcaption>
        </figure>
      </div>
      <p className='eg-docs-color-comparison'>
        {effective
          ? effective.different
            ? 'Differs from original'
            : 'Same as original'
          : 'Waiting for browser values'}
      </p>
    </article>
  );
}

/** Private Storybook Docs utility; no public component or token stylesheet imports. */
export function ColorInventory({ source }: { source: string }) {
  const tokens = parseColorTokens(source);
  return (
    <>
      {sections.map((title) => (
        <section className='eg-docs-panel' key={title}>
          <h2>
            <span className='eg-docs-section-title'>{title}</span>
          </h2>
          <div className='eg-docs-grid eg-docs-color-grid'>
            {tokens
              .filter(({ name }) => groupFor(name) === title)
              .map((token) => (
                <TokenCard key={token.name} token={token} />
              ))}
          </div>
        </section>
      ))}
    </>
  );
}
