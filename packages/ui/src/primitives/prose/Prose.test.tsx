import { readdirSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import * as barrel from './index';
import { Prose } from './Prose';
import { type ProseProps, type ProseSize, type ProseTone, proseVariants } from './types';
import { useProse } from './useProse';

// The one documented cast: a JavaScript caller can pass values that the public type rejects.
function untyped(props: Record<string, unknown>): ProseProps {
  return props as unknown as ProseProps;
}

function rootOf(container: HTMLElement): HTMLElement {
  const root = container.querySelector<HTMLElement>('.eg-prose');
  if (!root) {
    throw new Error('The Prose root was not rendered');
  }
  return root;
}

function has(root: HTMLElement, token: string): boolean {
  return root.classList.contains(token);
}

// Every element Prose styles in v0.1, as bare semantic flow content.
const tour: ReactNode = (
  <>
    <h2>Section title</h2>
    <h3>Subsection title</h3>
    <h4>Minor title</h4>
    <p>
      Body text with <a href='#first'>a first link</a>, <strong>strong words</strong> and <code>inline code</code>.
    </p>
    <ul>
      <li>First bullet</li>
      <li>Second bullet</li>
    </ul>
    <ol>
      <li>First step</li>
      <li>Second step</li>
    </ol>
    <blockquote>
      <p>A quotation.</p>
    </blockquote>
    <pre>
      <code>const answer = 42;</code>
    </pre>
    <figure>
      <img src='/diagnostic.svg' alt='Diagnostic pattern' />
      <figcaption>A captioned image.</figcaption>
    </figure>
    <table>
      <thead>
        <tr>
          <th scope='col'>Name</th>
          <th scope='col'>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Measure</td>
          <td>65ch</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <p>
      Closing paragraph with <a href='#second'>a second link</a>.
    </p>
  </>
);

// One row per target of the approved recipe (spec block 6). Utilities are written without their variant prefix and
// asserted as whole class tokens (`[selector]:utility`), never as substrings: the root also holds the size step and
// other prefixed utilities that must not satisfy an unprefixed assertion.
const recipe = [
  [
    'h2',
    '&_h2',
    ['m-0', 'mt-12', 'mb-4', 'font-display', 'uppercase', 'text-heading-section', 'text-fg-default', 'text-balance']
  ],
  [
    'h3',
    '&_h3',
    ['m-0', 'mt-8', 'mb-3', 'font-sans', 'normal-case', 'text-heading-small', 'text-fg-default', 'text-balance']
  ],
  [
    'h4',
    '&_h4',
    [
      'm-0',
      'mt-6',
      'mb-2',
      'font-sans',
      'normal-case',
      'text-body-large',
      'text-fg-default',
      'text-balance',
      '[font-weight:var(--text-heading-small--font-weight)]'
    ]
  ],
  ['p', '&_p', ['m-0', 'mb-5']],
  ['a', '&_a', ['text-link-default', 'underline', 'underline-offset-(--space-1)']],
  ['a:hover', '&_a:hover', ['no-underline']],
  ['a:focus-visible', '&_a:focus-visible', ['outline-none', 'rounded-sm', '[box-shadow:var(--shadow-focus)]']],
  ['strong', '&_strong', ['[font-weight:var(--text-heading-small--font-weight)]']],
  ['ul', '&_ul', ['m-0', 'mb-5', 'ps-7', 'list-disc']],
  ['ol', '&_ol', ['m-0', 'mb-5', 'ps-7', 'list-decimal']],
  ['li', '&_li', ['mt-2']],
  ['li:first-child', '&_li:first-child', ['mt-0']],
  ['li::marker', '&_li::marker', ['text-fg-muted']],
  [
    'blockquote',
    '&_blockquote',
    [
      'm-0',
      'my-8',
      'border-s-[length:calc(var(--border-width)*2)]',
      'border-fg-brand-default',
      'ps-4.5',
      'text-fg-secondary'
    ]
  ],
  ['code', '&_code', ['font-mono', 'text-code']],
  [
    'pre',
    '&_pre',
    [
      'my-6',
      'overflow-x-auto',
      'rounded-md',
      'border',
      'border-border-hairline',
      'bg-surface-0',
      'p-4',
      'shadow-[var(--shadow-well)]',
      'font-mono',
      'text-code',
      'text-fg-secondary'
    ]
  ],
  ['pre:focus-visible', '&_pre:focus-visible', ['outline-none', '[box-shadow:var(--shadow-focus)]']],
  ['img', '&_img', ['block', 'h-auto', 'max-w-full', 'rounded-md']],
  ['figure', '&_figure', ['m-0', 'my-8']],
  ['figcaption', '&_figcaption', ['mt-2', 'text-body-default', 'text-fg-muted']],
  ['table', '&_table', ['my-8', 'w-full', 'border-collapse']],
  [
    'th',
    '&_th',
    [
      'border-b',
      'border-border-default',
      'bg-surface-2',
      'px-4',
      'py-2.5',
      'text-start',
      'font-display',
      'text-label-eyebrow',
      'uppercase',
      'text-fg-muted'
    ]
  ],
  [
    'td',
    '&_td',
    [
      'border-b',
      'border-border-subtle',
      'px-4',
      'py-3',
      'text-start',
      'align-top',
      'wrap-break-word',
      'text-body-default',
      'text-fg-secondary'
    ]
  ],
  ['hr', '&_hr', ['m-0', 'my-10', 'border-0', 'border-t', 'border-solid', 'border-border-hairline']]
] as const satisfies readonly (readonly [target: string, selector: string, utilities: readonly string[]])[];

const inlineCode = '&_code:not(pre_code)';

describe('Prose root (PRS-01)', () => {
  it('renders one div with the stable marker around the unchanged children, in order', () => {
    const { container } = render(
      <Prose>
        <p>First paragraph</p>
        <p>Second paragraph</p>
      </Prose>
    );
    expect(container.children).toHaveLength(1);
    const root = rootOf(container);
    expect(container.firstElementChild).toBe(root);
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-prose');
    expect([...root.children].map((child) => child.textContent)).toEqual(['First paragraph', 'Second paragraph']);
    const [first, second] = [...root.children];
    expect(first?.compareDocumentPosition(second as Node)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
  });

  it('adds no role, id, tabindex, data-state or extra node', () => {
    const { container } = render(<Prose>Plain text</Prose>);
    const root = rootOf(container);
    for (const attribute of ['role', 'id', 'tabindex', 'data-state', 'aria-label', 'aria-labelledby']) {
      expect(root, attribute).not.toHaveAttribute(attribute);
    }
    expect(root.getAttributeNames()).toEqual(['class']);
    expect(root.childNodes).toHaveLength(1);
    expect(root.textContent).toBe('Plain text');
    expect(root.querySelectorAll('[class]')).toHaveLength(0);
  });

  it('derives only a className for the default root props in the hook', () => {
    const { result } = renderHook(() => useProse({ children: 'Text' }));
    expect(Object.keys(result.current.rootProps)).toEqual(['className']);
    expect(result.current.rootProps.className.split(' ')).toContain('eg-prose');
    expect(result.current.children).toBe('Text');
  });

  it('exposes only the component from the public module and no part marker', () => {
    expect(Object.keys(barrel)).toEqual(['Prose']);
    expect(Prose.displayName).toBe('Prose');
    const { container } = render(<Prose>{tour}</Prose>);
    expect(container.querySelectorAll('[class*="eg-prose__"]')).toHaveLength(0);
    expect(
      proseVariants()
        .split(' ')
        .filter((token) => token.startsWith('eg-prose__'))
    ).toEqual([]);
  });
});

describe('Prose size and tone (PRS-02)', () => {
  it.each([
    [undefined, 'text-body-large', 'text-body-default'],
    ['md', 'text-body-large', 'text-body-default'],
    ['sm', 'text-body-default', 'text-body-large']
  ] as const)('size %s carries %s and never %s', (size, carried, absent) => {
    const { container } = render(<Prose size={size}>Text</Prose>);
    const root = rootOf(container);
    expect(has(root, carried)).toBe(true);
    expect(has(root, absent)).toBe(false);
  });

  it.each([
    [undefined, 'text-fg-brand-default', 'text-fg-brand-raised'],
    ['canvas', 'text-fg-brand-default', 'text-fg-brand-raised'],
    ['raised', 'text-fg-brand-raised', 'text-fg-brand-default']
  ] as const)('tone %s colours inline code with %s and never %s', (tone, carried, absent) => {
    const { container } = render(<Prose tone={tone}>Text</Prose>);
    const root = rootOf(container);
    expect(has(root, `[${inlineCode}]:${carried}`)).toBe(true);
    expect(has(root, `[${inlineCode}]:${absent}`)).toBe(false);
  });

  it.each([
    ['lg', 'flood'],
    [null, null],
    [42, 42],
    ['', '']
  ])('falls back to md and canvas for the untyped values %j and %j', (size, tone) => {
    const { container } = render(<Prose {...untyped({ size, tone, children: 'Text' })} />);
    const root = rootOf(container);
    expect(has(root, 'text-body-large')).toBe(true);
    expect(has(root, 'text-body-default')).toBe(false);
    expect(has(root, `[${inlineCode}]:text-fg-brand-default`)).toBe(true);
    expect(has(root, `[${inlineCode}]:text-fg-brand-raised`)).toBe(false);
    expect(root).not.toHaveAttribute('size');
    expect(root).not.toHaveAttribute('tone');
  });

  it('keeps the two axes independent', () => {
    const { container } = render(
      <Prose size='sm' tone='raised'>
        Text
      </Prose>
    );
    const root = rootOf(container);
    expect(has(root, 'text-body-default')).toBe(true);
    expect(has(root, `[${inlineCode}]:text-fg-brand-raised`)).toBe(true);
  });
});

describe('Prose measure (PRS-03)', () => {
  it.each<ProseSize>(['sm', 'md'])('carries the shrinkable token measure at size %s', (size) => {
    const { container } = render(<Prose size={size}>Text</Prose>);
    const root = rootOf(container);
    for (const token of ['max-w-prose', 'min-w-0', 'box-border', 'font-sans', 'wrap-break-word', 'text-pretty']) {
      expect(has(root, token), token).toBe(true);
    }
    expect(has(root, 'w-full')).toBe(false);
  });
});

describe('Prose descendant recipe (PRS-04, PRS-06)', () => {
  it.each(recipe)('carries the %s recipe on the root after cn()', (_target, selector, utilities) => {
    const { container } = render(<Prose>{tour}</Prose>);
    const root = rootOf(container);
    for (const utility of utilities) {
      expect(has(root, `[${selector}]:${utility}`), `[${selector}]:${utility}`).toBe(true);
    }
  });

  it('trims the outer margins of the direct first and last children only', () => {
    const { container } = render(<Prose>{tour}</Prose>);
    const root = rootOf(container);
    expect(has(root, '[&>:first-child]:mt-0')).toBe(true);
    expect(has(root, '[&>:last-child]:mb-0')).toBe(true);
  });

  it('keeps every recipe token after the size and tone axes and a consumer className', () => {
    const { container } = render(
      <Prose size='sm' tone='raised' className='mx-auto'>
        {tour}
      </Prose>
    );
    const root = rootOf(container);
    for (const [, selector, utilities] of recipe) {
      for (const utility of utilities) {
        expect(has(root, `[${selector}]:${utility}`), `[${selector}]:${utility}`).toBe(true);
      }
    }
  });

  it('draws the quotation rule on the inline start only, never an all-sides border style', () => {
    // Without Preflight the unset border widths are `medium`, so a style on all four sides would draw a 3px frame.
    const { container } = render(<Prose>{tour}</Prose>);
    const root = rootOf(container);
    const borders = [...root.classList].filter((token) => token.startsWith('[&_blockquote]:border'));
    expect(borders.sort()).toEqual([
      '[&_blockquote]:border-fg-brand-default',
      '[&_blockquote]:border-s-[length:calc(var(--border-width)*2)]'
    ]);
  });

  it('never gives block code the inline-code colour unconditionally', () => {
    for (const tone of ['canvas', 'raised'] as const) {
      const tokens = proseVariants({ tone }).split(' ');
      expect(tokens.filter((token) => /^\[&_code\]:text-fg-brand-/.test(token))).toEqual([]);
      expect(tokens.filter((token) => /^\[&_pre_code\]:/.test(token))).toEqual([]);
      expect(tokens.filter((token) => token.includes('text-fg-brand-') && token.includes('code'))).toEqual([
        `[${inlineCode}]:text-fg-brand-${tone === 'raised' ? 'raised' : 'default'}`
      ]);
    }
  });
});

describe('Prose inline code selector (PRS-06, Amendment 1)', () => {
  // The recipe's own colour variant read as the CSS selector a browser evaluates: `&` is the root and `_` a space.
  function inlineCodeSelector(tone: ProseTone): string {
    const token = proseVariants({ tone })
      .split(' ')
      .find((candidate) => candidate.includes('text-fg-brand-') && candidate.includes('code'));
    if (token === undefined) {
      throw new Error('The inline code colour utility is missing');
    }
    const variant = token.slice(1, token.indexOf(']:'));
    return `.eg-prose${variant.slice(1).replaceAll('_', ' ')}`;
  }

  it.each(['canvas', 'raised'] as const)('matches inline code anywhere under the %s root except inside pre', (tone) => {
    render(
      <Prose tone={tone}>
        <code>direct child</code>
        <p>
          <code>in a paragraph</code>
        </p>
        <p>
          <a href='#target'>
            <code>in a link</code>
          </a>
        </p>
        <ul>
          <li>
            <code>in a list item</code>
          </li>
        </ul>
        <pre>
          <code>block code</code>
        </pre>
        <pre>
          <span>
            <code>nested in a block</code>
          </span>
        </pre>
      </Prose>
    );
    const selector = inlineCodeSelector(tone);
    for (const inline of ['direct child', 'in a paragraph', 'in a link', 'in a list item']) {
      expect(screen.getByText(inline).matches(selector), inline).toBe(true);
    }
    for (const block of ['block code', 'nested in a block']) {
      expect(screen.getByText(block).matches(selector), block).toBe(false);
    }
  });
});

describe('Prose source (PRS-07)', () => {
  // The four forms with precedent in PullQuote, Surface, Text and Link, plus the token reference of Link's underline.
  const precedentForms = [
    'border-s-[length:calc(var(--border-width)*2)]',
    'shadow-[var(--shadow-well)]',
    '[font-weight:var(--text-heading-small--font-weight)]',
    '[box-shadow:var(--shadow-focus)]',
    'underline-offset-(--space-1)'
  ];

  // Removes the leading `[&…]:` selector variant by bracket depth, leaving the utility itself.
  function utilityOf(token: string): string {
    if (!token.startsWith('[&')) {
      return token;
    }
    let depth = 0;
    for (let index = 0; index < token.length; index += 1) {
      const character = token[index];
      depth += character === '[' ? 1 : character === ']' ? -1 : 0;
      if (depth === 0 && token[index + 1] === ':') {
        return token.slice(index + 2);
      }
    }
    return token;
  }

  const tokens = (['sm', 'md'] as const)
    .flatMap((size) => (['canvas', 'raised'] as const).map((tone) => proseVariants({ size, tone })))
    .flatMap((classes) => classes.split(' '));

  it('uses only token utilities plus the forms that already have precedent', () => {
    expect(tokens.length).toBeGreaterThan(100);
    for (const token of new Set(tokens)) {
      const utility = utilityOf(token);
      if (precedentForms.includes(utility)) {
        continue;
      }
      expect(utility, token).toMatch(/^[a-z0-9.-]+$/);
    }
  });

  it('holds no colour, pixel or important literal and no inline appearance', () => {
    for (const token of new Set(tokens)) {
      expect(token, token).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(|\d\s*px\b|!/i);
    }
    const { result } = renderHook(() => useProse({ children: 'Text' }));
    expect(result.current.rootProps).not.toHaveProperty('style');
  });

  it('is exactly the six mandatory files with no stylesheet and no class-name allowance', () => {
    const folder = import.meta.dirname;
    expect(readdirSync(folder).sort()).toEqual([
      'Prose.stories.tsx',
      'Prose.test.tsx',
      'Prose.tsx',
      'index.ts',
      'types.ts',
      'useProse.ts'
    ]);
    expect(readFileSync(resolve(folder, 'types.ts'), 'utf8')).not.toContain('@classNameAllows');
  });
});

describe('Prose class composition (PRS-08)', () => {
  it('merges className after the variants and keeps the marker and the descendant recipe', () => {
    const { container } = render(<Prose className='mx-auto mt-8'>{tour}</Prose>);
    const root = rootOf(container);
    const tokens = root.className.split(' ');
    expect(tokens).toContain('mx-auto');
    expect(tokens).toContain('mt-8');
    expect(tokens.indexOf('mx-auto')).toBeGreaterThan(tokens.indexOf('eg-prose'));
    expect(tokens.indexOf('mt-8')).toBe(tokens.length - 1);
    expect(tokens[0]).toBe('eg-prose');
    for (const token of ['max-w-prose', '[&_h2]:mt-12', '[&>:first-child]:mt-0', '[&_a]:underline']) {
      expect(has(root, token), token).toBe(true);
    }
  });

  it('forwards the native attributes the contract documents to the root', () => {
    const { container } = render(
      <Prose id='article-body' lang='es' dir='ltr' title='Body' data-source='cms' aria-describedby='hint'>
        Text
      </Prose>
    );
    const root = rootOf(container);
    expect(root).toHaveAttribute('id', 'article-body');
    expect(root).toHaveAttribute('lang', 'es');
    expect(root).toHaveAttribute('dir', 'ltr');
    expect(root).toHaveAttribute('title', 'Body');
    expect(root).toHaveAttribute('data-source', 'cms');
    expect(root).toHaveAttribute('aria-describedby', 'hint');
  });
});

describe('Prose protected API (PRS-09)', () => {
  it('requires children and exposes no role, name, HTML string, ref or asChild in the type', () => {
    expectTypeOf<
      Extract<
        keyof ProseProps,
        'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'ref' | 'asChild'
      >
    >().toEqualTypeOf<never>();
    expectTypeOf<ProseProps['children']>().toEqualTypeOf<ReactNode>();
    expectTypeOf<ProseProps['size']>().toEqualTypeOf<ProseSize | undefined>();
    expectTypeOf<ProseProps['tone']>().toEqualTypeOf<ProseTone | undefined>();
    expectTypeOf<ProseSize>().toEqualTypeOf<'sm' | 'md'>();
    expectTypeOf<ProseTone>().toEqualTypeOf<'canvas' | 'raised'>();
    // @ts-expect-error children is required: a Prose with no content is not part of the contract
    const missingChildren: ProseProps = {};
    // @ts-expect-error role is omitted: the root is a generic div and a landmark wraps Prose
    const withRole: ProseProps = { children: 'Text', role: 'article' };
    // @ts-expect-error aria-label is omitted: the root carries no accessible name
    const withName: ProseProps = { children: 'Text', 'aria-label': 'Body' };
    // @ts-expect-error aria-labelledby is omitted: the root carries no accessible name
    const withNamedBy: ProseProps = { children: 'Text', 'aria-labelledby': 'title' };
    // @ts-expect-error dangerouslySetInnerHTML is omitted: Prose never takes an HTML string
    const withHtml: ProseProps = { children: 'Text', dangerouslySetInnerHTML: { __html: '<p>x</p>' } };
    // @ts-expect-error size accepts only sm and md
    const withBadSize: ProseProps = { children: 'Text', size: 'lg' };
    // @ts-expect-error tone accepts only canvas and raised
    const withBadTone: ProseProps = { children: 'Text', tone: 'flood' };
    expect([missingChildren, withRole, withName, withNamedBy, withHtml, withBadSize, withBadTone]).toHaveLength(7);
  });

  it('discards an untyped dangerouslySetInnerHTML so no markup is injected and React does not throw', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: any React error is asserted below, not printed.
    });
    const { container } = render(
      <Prose {...untyped({ dangerouslySetInnerHTML: { __html: '<b>injected</b>' }, children: 'Rendered text' })} />
    );
    const root = rootOf(container);
    expect(root.textContent).toBe('Rendered text');
    expect(root.querySelector('b')).toBeNull();
    expect(root).not.toHaveAttribute('dangerouslysetinnerhtml');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('drops an untyped dangerouslySetInnerHTML from the hook root props', () => {
    const { result } = renderHook(() =>
      useProse(untyped({ dangerouslySetInnerHTML: { __html: '<b>x</b>' }, children: 'Text', id: 'body' }))
    );
    expect(result.current.rootProps).not.toHaveProperty('dangerouslySetInnerHTML');
    expect(result.current.rootProps).toMatchObject({ id: 'body' });
    expect(result.current.rootProps).not.toHaveProperty('size');
    expect(result.current.rootProps).not.toHaveProperty('tone');
  });
});

describe('Prose semantics (PRS-10)', () => {
  it('renders the same inner HTML as a plain div and adds no ARIA attribute, id or wrapper', () => {
    const inside = render(<Prose>{tour}</Prose>).container;
    const outside = render(<div>{tour}</div>).container;
    const plain = outside.firstElementChild;
    expect(plain).not.toBeNull();
    expect(rootOf(inside).innerHTML).toBe(plain?.innerHTML);
    const root = rootOf(inside);
    expect(root.getAttributeNames()).toEqual(['class']);
    expect(
      root.querySelectorAll('[aria-label], [aria-labelledby], [aria-hidden], [role], [id], [tabindex]')
    ).toHaveLength(0);
    expect(root.firstElementChild?.tagName).toBe('H2');
  });

  it('keeps the roles of the supplied elements', () => {
    render(<Prose>{tour}</Prose>);
    expect(screen.getByRole('heading', { level: 2, name: 'Section title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Subsection title' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 4, name: 'Minor title' })).toBeInTheDocument();
    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(4);
    expect(screen.getByRole('link', { name: 'a first link' })).toHaveAttribute('href', '#first');
    expect(screen.getByRole('img', { name: 'Diagnostic pattern' })).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(2);
    expect(screen.getByRole('separator')).toBeInTheDocument();
    expect(screen.getByRole('blockquote')).toBeInTheDocument();
  });

  it('renders identically on the server, with the root first and the children unchanged', () => {
    // React 19 hoists an image preload hint before the root; it is not part of the rendered tree.
    const withoutHints = (html: string) => html.replace(/<link rel="preload"[^>]*\/>/g, '');
    const markup = withoutHints(renderToStaticMarkup(<Prose>{tour}</Prose>));
    const plain = withoutHints(renderToStaticMarkup(<div>{tour}</div>));
    expect(markup.startsWith('<div class="eg-prose ')).toBe(true);
    expect(markup.endsWith('</div>')).toBe(true);
    expect(markup.slice(markup.indexOf('>') + 1)).toBe(plain.slice('<div>'.length));
    expect(markup).not.toMatch(/\b(role|id|tabindex|data-state|aria-[a-z]+)=/);
  });
});

describe('Prose keyboard and links (PRS-11)', () => {
  it('reaches the links with Tab in document order and adds no tabindex', async () => {
    const user = userEvent.setup();
    const { container } = render(<Prose>{tour}</Prose>);
    const first = screen.getByRole('link', { name: 'a first link' });
    const second = screen.getByRole('link', { name: 'a second link' });
    await user.tab();
    expect(first).toHaveFocus();
    await user.tab();
    expect(second).toHaveFocus();
    expect(rootOf(container).querySelectorAll('[tabindex]')).toHaveLength(0);
  });

  it('keeps an underline at rest and paints the focus ring through the shared shadow token', () => {
    const { container } = render(<Prose>{tour}</Prose>);
    const root = rootOf(container);
    expect(has(root, '[&_a]:underline')).toBe(true);
    expect(has(root, '[&_a:hover]:no-underline')).toBe(true);
    expect(has(root, '[&_a:focus-visible]:[box-shadow:var(--shadow-focus)]')).toBe(true);
    expect(has(root, '[&_pre:focus-visible]:[box-shadow:var(--shadow-focus)]')).toBe(true);
  });
});
