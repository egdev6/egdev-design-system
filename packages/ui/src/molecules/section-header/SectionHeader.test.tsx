import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useId } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { useSectionHeader } from '@/molecules/section-header/useSectionHeader';
import { SectionHeader, type SectionHeaderLevel, type SectionHeaderProps } from './index';

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
