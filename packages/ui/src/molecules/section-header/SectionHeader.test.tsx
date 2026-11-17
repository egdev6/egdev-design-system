import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useId } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { useSectionHeader } from '@/molecules/section-header/useSectionHeader';
import type { SectionHeaderTextRun as RootRun, SectionHeaderText as RootText } from '../../index';
import {
  SectionHeader,
  type SectionHeaderLevel,
  type SectionHeaderProps,
  type SectionHeaderText,
  type SectionHeaderTextRun
} from './index';

const copy = { title: 'Build ', accent: 'together.', eyebrow: 'Our work', lede: 'Tools for thoughtful teams.' };

describe('SectionHeader public contract', () => {
  it('renders only a native h2 in a stable header by default', () => {
    const { container } = render(<SectionHeader title='Build' />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Build' });
    const root = heading.parentElement;
    expect(root?.tagName).toBe('HEADER');
    expect(root).toHaveClass('eg-section-head', 'flex', 'gap-5');
    expect(root?.children).toHaveLength(1);
    expect(container.querySelector('[id], [role], [aria-live], [data-state], [tabindex]')).toBeNull();
  });

  it('derives explicit primitive defaults and effective fallbacks in the hook', () => {
    const { result, rerender } = renderHook((props: SectionHeaderProps) => useSectionHeader(props), {
      initialProps: { title: 'Build', variant: 'split' } as SectionHeaderProps
    });
    expect(result.current.headingProps).toMatchObject({
      variant: 'section',
      level: 2,
      tone: 'canvas',
      accentBreak: false
    });
    expect(result.current.rootProps.className).toContain('flex');
    rerender({ title: 'Build', variant: 'split', lede: 'Together' });
    expect(result.current.rootProps.className).toContain(
      'section-header-split:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]'
    );
  });

  it('preserves caller whitespace and punctuation without inserting separators', () => {
    const { rerender } = render(<SectionHeader {...copy} />);
    const heading = screen.getByRole('heading', { name: 'Build together.' });
    expect(heading.textContent).toBe('Build together.');
    expect(screen.getByText('together.')).toHaveClass('inline');
    rerender(<SectionHeader title='Build' accent='.' accentBreak={true} />);
    expect(screen.getByRole('heading', { name: 'Build.' }).textContent).toBe('Build.');
    expect(screen.getByText('.')).toHaveClass('block');
  });

  it.each([1, 2, 3, 4, 5, 6] as SectionHeaderLevel[])('keeps section typography at heading rank %s', (level) => {
    render(<SectionHeader {...copy} level={level} />);
    expect(screen.getByRole('heading', { level, name: 'Build together.' })).toHaveClass(
      'eg-heading',
      'text-title-section'
    );
  });

  it('composes split parts in source order without an empty eyebrow row', () => {
    const { rerender } = render(<SectionHeader {...copy} variant='split' />);
    const root = screen.getByRole('heading').parentElement;
    expect(root).toHaveClass('grid', 'grid-cols-1', 'items-end', 'gap-y-6', 'gap-x-12');
    expect(Array.from(root?.children ?? []).map((node) => node.textContent)).toEqual([
      'Our work',
      'Build together.',
      copy.lede
    ]);
    expect(screen.getByText('Our work')).toHaveClass('eg-text', 'col-span-full');
    expect(screen.getByText(copy.lede)).toHaveClass(
      'eg-section-head__lede',
      'text-body-muted',
      'text-fg-secondary',
      'max-w-[var(--bp-sm)]',
      'section-header-split:justify-self-end'
    );
    rerender(<SectionHeader title='Build' lede={copy.lede} variant='split' />);
    expect(root?.children).toHaveLength(2);
    expect(root?.firstElementChild?.tagName).toBe('H2');
  });

  it('uses a presentational decorative Divider in inline layout, never a separator', () => {
    render(<SectionHeader {...copy} variant='inline' />);
    const root = screen.getByRole('heading').parentElement;
    expect(root).toHaveClass('grid-cols-[minmax(0,auto)_minmax(0,1fr)]', 'gap-6');
    expect(Array.from(root?.children ?? []).map((node) => node.textContent)).toEqual([
      'Our work',
      '',
      'Build together.',
      copy.lede
    ]);
    expect(root?.children[1]).toHaveClass('eg-divider', 'min-w-0', 'data-[orientation=horizontal]:min-w-0');
    expect(root?.children[1]).not.toHaveClass('data-[orientation=horizontal]:min-w-6');
    expect(root?.children[1]).toHaveAttribute('role', 'none');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveClass('col-span-full');
    expect(screen.getByText(copy.lede)).toHaveClass('col-span-full');
  });

  it.each([undefined, '', ' \n\t '])('omits blank optional content (%s) without placeholders', (blank) => {
    const { rerender } = render(
      <SectionHeader title='Build' eyebrow={blank} accent={blank} lede={blank} titleId={blank} variant='inline' />
    );
    const heading = screen.getByRole('heading');
    const root = heading.parentElement;
    expect(root?.children).toHaveLength(1);
    expect(root).toHaveClass('flex', 'gap-5');
    expect(heading).not.toHaveAttribute('id');
    expect(heading.querySelector('span')).toBeNull();
    rerender(<SectionHeader title='Build' eyebrow='Context' lede={blank} variant='split' />);
    expect(root).toHaveClass('flex', 'gap-5');
    expect(root?.children).toHaveLength(2);
  });

  it.each(['', ' \n\t '])('warns and renders nothing for blank title (%s), then recovers', (title) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const { container, rerender } = render(<SectionHeader {...copy} title={title} variant='inline' />);
      expect(container).toBeEmptyDOMElement();
      expect(warning).toHaveBeenCalledWith(expect.stringMatching(/SectionHeader.*title/));
      rerender(<SectionHeader {...copy} />);
      expect(screen.getByRole('heading', { name: 'Build together.' })).toBeVisible();
    } finally {
      warning.mockRestore();
    }
  });

  it('renders no header and emits no warning for blank title under the production environment', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      const { container } = render(<SectionHeader title=' ' />);
      expect(container).toBeEmptyDOMElement();
      expect(warning).not.toHaveBeenCalled();
    } finally {
      warning.mockRestore();
      vi.unstubAllEnvs();
    }
  });

  it('keeps root IDs distinct from consumer heading relationships across instances', () => {
    function NamedSection({ title }: { title: string }) {
      const id = useId();
      return (
        <section aria-labelledby={id}>
          <SectionHeader title={title} titleId={id} id={`${id}-root`} />
        </section>
      );
    }
    render(
      <>
        <NamedSection title='First' />
        <NamedSection title='Second' />
      </>
    );
    const ids = screen.getAllByRole('heading').map((heading) => heading.id);
    expect(new Set(ids).size).toBe(2);
    for (const name of ['First', 'Second']) {
      const heading = screen.getByRole('heading', { name });
      expect(screen.getByRole('region', { name })).toContainElement(heading);
      expect(heading.parentElement).toHaveAttribute('id', `${heading.id}-root`);
    }
  });

  it('forwards native attributes only to root, merges outer layout and isolates parts', () => {
    render(
      <SectionHeader
        {...copy}
        id='root'
        dir='rtl'
        lang='en'
        aria-describedby='external'
        data-owner='consumer'
        className='w-full mt-6 min-w-12'
        tone='raised'
      />
    );
    const heading = screen.getByRole('heading');
    const root = heading.parentElement;
    expect(root).toHaveClass('eg-section-head', 'w-full', 'mt-6', 'min-w-12');
    expect(root).not.toHaveClass('min-w-0');
    expect(heading).toHaveClass('min-w-0');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('lang', 'en');
    expect(root).toHaveAttribute('data-owner', 'consumer');
    expect(root).toHaveAttribute('aria-describedby', 'external');
    expect(root).not.toHaveAttribute('title');
    expect(heading).not.toHaveAttribute('id');
    expect(heading).not.toHaveAttribute('aria-describedby');
    expect(heading).not.toHaveClass('w-full', 'mt-6');
    expect(screen.getByText('together.')).toHaveClass('text-fg-brand-raised');
    expect(root).not.toHaveClass('eg-surface', 'eg-section-head--split', 'eg-section-head--inline');
  });

  it('drops untyped injected children and HTML rather than rendering extra content', () => {
    const injected = { children: 'Injected', dangerouslySetInnerHTML: { __html: '<button>Injected</button>' } };
    render(<SectionHeader title='Build' {...injected} />);
    expect(screen.queryByText('Injected')).not.toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Build');
  });

  it('adds no focus stops or announcements when content changes', async () => {
    const user = userEvent.setup();
    const { rerender, container } = render(
      <>
        <button type='button'>Before</button>
        <SectionHeader {...copy} variant='inline' />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    rerender(
      <>
        <button type='button'>Before</button>
        <SectionHeader title='Updated' />
        <button type='button'>After</button>
      </>
    );
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(container.querySelector('[aria-live], [data-state]')).toBeNull();
  });

  it('renders deterministic server markup with long Unicode content and no generated IDs', () => {
    const props = { ...copy, title: 'Équipe '.repeat(80), dir: 'rtl' as const, variant: 'split' as const };
    const html = renderToString(<SectionHeader {...props} />);
    expect(html).toBe(renderToString(<SectionHeader {...props} />));
    expect(html).toContain('Équipe ');
    expect(html).not.toMatch(/\sid=|aria-live|tabindex/);
  });
});

describe('SectionHeader multilingual public contract', () => {
  it('exposes readonly runs and requires callers to narrow before string operations', () => {
    const run: SectionHeaderTextRun = ['Hola', 'es', false];
    const rootRun: RootRun = run;
    const text: SectionHeaderText = [rootRun, ['/', undefined, true], ['Hello', 'en']];
    const rootText: RootText = text;
    const upper = (value: SectionHeaderText) =>
      typeof value === 'string' ? value.toUpperCase() : value.map(([content]) => content).join('');
    // @ts-expect-error Structured entries are tuples, not arbitrary objects.
    const object: SectionHeaderText = [{ text: 'No' }];
    // @ts-expect-error Runs have at most three entries.
    const extra: SectionHeaderText = [['No', 'en', false, 'extra']];
    // @ts-expect-error Language is a string, never a number.
    const numericLang: SectionHeaderText = [['No', 7]];
    // @ts-expect-error The title union must be narrowed before using string methods.
    const unsafe = (value: SectionHeaderText) => value.toUpperCase();
    expect(upper(rootText)).toBe('Hola/Hello');
    expect([object, extra, numericLang, unsafe]).toHaveLength(4);
  });

  const title = [
    ['Hotel ', 'es'],
    ['/ ', undefined, true],
    ['Hotel', 'en']
  ] as const;
  const eyebrow = [
    ['Trabajo ', 'es'],
    ['/ ', undefined, true],
    ['Work', 'en']
  ] as const;
  const lede = [
    ['Hola ', 'es'],
    ['/ ', undefined, true],
    ['Hello', 'en']
  ] as const;

  it.each(['stack', 'split', 'inline'] as const)(
    'preserves run order, whitespace, language and one eyebrow wrapper in %s',
    (variant) => {
      render(<SectionHeader title={title} eyebrow={eyebrow} lede={lede} accent=' now' variant={variant} />);
      // dom-accessibility-api trims each inline span; verify exact spacing separately in real browser AX.
      const heading = screen.getByRole('heading', { name: /^Hotel\s*Hotel\s*now$/ });
      expect(heading.textContent).toBe('Hotel / Hotel now');
      const titleSpans = Array.from(heading.children);
      expect(titleSpans.map((span) => span.textContent)).toEqual(['Hotel ', '/ ', 'Hotel', ' now']);
      expect(titleSpans[0]).toHaveAttribute('lang', 'es');
      expect(titleSpans[1]).not.toHaveAttribute('lang');
      expect(titleSpans[1]).toHaveAttribute('aria-hidden', 'true');
      expect(titleSpans[2]).toHaveAttribute('lang', 'en');
      expect(titleSpans[2]).not.toHaveAttribute('aria-hidden');
      expect(titleSpans[3]).toHaveClass('eg-heading__accent');
      expect(titleSpans[3]).not.toHaveAttribute('aria-hidden');

      const root = heading.parentElement;
      const eyebrowRoot = root?.firstElementChild;
      expect(eyebrowRoot).toHaveClass('eg-text', 'inline-flex');
      expect(eyebrowRoot?.children).toHaveLength(1);
      const wrapper = eyebrowRoot?.firstElementChild;
      expect(wrapper?.tagName).toBe('SPAN');
      expect(wrapper).not.toHaveAttribute('class');
      expect(Array.from(wrapper?.children ?? []).map((span) => span.textContent)).toEqual(['Trabajo ', '/ ', 'Work']);
      expect(wrapper?.children[0]).toHaveAttribute('lang', 'es');
      expect(wrapper?.children[1]).toHaveAttribute('aria-hidden', 'true');
      expect(wrapper?.children[2]).toHaveAttribute('lang', 'en');

      const paragraph = root?.querySelector('.eg-section-head__lede');
      expect(paragraph?.tagName).toBe('P');
      expect(paragraph).toHaveClass(
        'eg-text',
        'eg-section-head__lede',
        'font-sans',
        'text-body-muted',
        'text-fg-secondary'
      );
      expect(Array.from(paragraph?.children ?? []).map((span) => span.textContent)).toEqual(['Hola ', '/ ', 'Hello']);
      expect(paragraph?.children[0]).toHaveAttribute('lang', 'es');
      expect(paragraph?.children[1]).toHaveAttribute('aria-hidden', 'true');
      expect(paragraph?.children[2]).toHaveAttribute('lang', 'en');
    }
  );

  it('keeps string content unwrapped and uses the Text lede recipe', () => {
    render(<SectionHeader title='Build ' eyebrow='Context' lede='Plain lede' accent='now' />);
    const heading = screen.getByRole('heading', { name: 'Build now' });
    expect(heading.firstChild?.nodeType).toBe(Node.TEXT_NODE);
    expect(heading.firstChild?.textContent).toBe('Build ');
    expect(heading.children).toHaveLength(1);
    const context = screen.getByText('Context');
    expect(context.children).toHaveLength(0);
    const paragraph = screen.getByText('Plain lede');
    expect(paragraph.tagName).toBe('P');
    expect(paragraph.children).toHaveLength(0);
    expect(paragraph).toHaveClass(
      'eg-text',
      'eg-section-head__lede',
      'm-0',
      'font-sans',
      'text-body-muted',
      'text-fg-secondary'
    );
  });

  it('skips malformed entries while preserving valid one-to-three element tuples', () => {
    const mixed = [
      ['Uno ', 'es'],
      null,
      {},
      [],
      [1],
      ['bad', 3],
      ['bad', 'en', 'true'],
      ['bad', 'en', false, 'extra'],
      ['/', undefined, true],
      [' Two', '', false],
      ['!']
    ] as unknown as SectionHeaderProps['title'];
    render(<SectionHeader title={mixed} eyebrow={mixed} lede={mixed} />);
    const heading = screen.getByRole('heading', { name: /^Uno\s*Two!$/ });
    expect(heading.textContent).toBe('Uno / Two!');
    expect(Array.from(heading.children).map((span) => span.textContent)).toEqual(['Uno ', '/', ' Two', '!']);
    expect(heading.children[1]).toHaveAttribute('aria-hidden', 'true');
    expect(heading.children[2]).toHaveAttribute('lang', '');
    expect(heading.children[2]).not.toHaveAttribute('aria-hidden');
    expect(heading.children[3]).not.toHaveAttribute('lang');
    expect(heading.parentElement?.querySelector('.eg-section-head__lede')?.textContent).toBe('Uno / Two!');
  });

  it.each(['development', 'production'] as const)(
    'rejects empty, blank, decorative-only and malformed titles in %s and recovers on rerender',
    (environment) => {
      vi.stubEnv('NODE_ENV', environment);
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const invalid: unknown[] = [
        '',
        '  \n\t',
        [],
        [[' ']],
        [['/', undefined, true]],
        [
          [' ', 'en'],
          ['/', undefined, true]
        ],
        null,
        7,
        {},
        [null, ['bad', 1]],
        [['bad', 'en', false, 'extra']]
      ];
      try {
        const { container, rerender } = render(<SectionHeader title='initial' />);
        for (const value of invalid) {
          warning.mockClear();
          rerender(<SectionHeader title={value as SectionHeaderProps['title']} accent='cannot rescue' />);
          expect(container).toBeEmptyDOMElement();
          if (environment === 'development') {
            expect(warning).toHaveBeenCalledOnce();
            expect(warning).toHaveBeenCalledWith('SectionHeader requires a non-blank title; no header was rendered.');
          } else {
            expect(warning).not.toHaveBeenCalled();
          }
          rerender(<SectionHeader title={title} />);
          expect(screen.getByRole('heading', { name: /^Hotel\s*Hotel$/ })).toBeVisible();
        }
      } finally {
        warning.mockRestore();
        vi.unstubAllEnvs();
      }
    }
  );

  it.each(['split', 'inline'] as const)('omits invalid optional parts and falls back in %s', (variant) => {
    const invalid: unknown[] = [
      undefined,
      '',
      '  ',
      [],
      [[' ']],
      [['/', undefined, true]],
      null,
      7,
      {},
      [null],
      [['bad', 1]],
      [['bad', 'en', false, 'extra']]
    ];
    const { rerender } = render(<SectionHeader title='Valid' />);
    for (const value of invalid) {
      const part = value as SectionHeaderProps['lede'];
      rerender(<SectionHeader title='Valid' variant={variant} eyebrow={part} lede={part} />);
      const root = screen.getByRole('heading', { name: 'Valid' }).parentElement;
      expect(root).toHaveClass('flex', 'gap-5');
      expect(root?.children).toHaveLength(1);
      expect(root?.querySelector('.eg-section-head__lede, .eg-divider')).toBeNull();
    }
  });

  it.each([1, 2, 3, 4, 5, 6] as const)('preserves rank %s, IDs, inherited language and deterministic SSR', (level) => {
    const props = {
      title,
      eyebrow,
      lede,
      level,
      titleId: `heading-${level}`,
      id: `root-${level}`,
      lang: 'fr',
      dir: 'rtl' as const
    };
    const html = renderToString(<SectionHeader {...props} />);
    expect(html).toBe(renderToString(<SectionHeader {...props} />));
    expect(html).toContain('<span lang="es">Hotel </span>');
    expect(html).toContain('<span aria-hidden="true">/ </span>');
    render(
      <section aria-labelledby={props.titleId}>
        <SectionHeader {...props} />
      </section>
    );
    const heading = screen.getByRole('heading', { level, name: /^Hotel\s*Hotel$/ });
    expect(screen.getByRole('region', { name: /^Hotel\s*Hotel$/ })).toContainElement(heading);
    expect(heading).toHaveAttribute('id', props.titleId);
    expect(heading.parentElement).toHaveAttribute('id', props.id);
    expect(heading.parentElement).toHaveAttribute('lang', 'fr');
    expect(heading.parentElement).toHaveAttribute('dir', 'rtl');
    expect(heading.children[0]?.closest('[lang]')).toHaveAttribute('lang', 'es');
    expect(heading.children[1]?.closest('[lang]')).toHaveAttribute('lang', 'fr');
    expect(heading.children[2]?.closest('[lang]')).toHaveAttribute('lang', 'en');
  });
});
