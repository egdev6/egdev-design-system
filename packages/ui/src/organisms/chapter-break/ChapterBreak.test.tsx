import { render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SectionShell } from '../../templates/section-shell';
import { ChapterBreak, type ChapterBreakProps } from './index';

describe('ChapterBreak contract', () => {
  it.each([1, 2, 3, 4, 5, 6] as const)(
    'CB-01 names a host with heading rank %i and an ID only on the heading',
    (level) => {
      const { container } = render(
        <SectionShell register='show' aria-labelledby={`heading-${level}`}>
          <ChapterBreak title='Chapter' level={level} id={`heading-${level}`} />
        </SectionShell>
      );
      const region = screen.getByRole('region', { name: 'Chapter' });
      expect(within(region).getByRole('heading', { level, name: 'Chapter' })).toHaveAttribute('id', `heading-${level}`);
      expect(container.querySelectorAll('[role="region"], section')).toHaveLength(1);
      expect(container.querySelectorAll(`#heading-${level}`)).toHaveLength(1);
      expect(container.querySelector('.eg-chapter-break')).not.toHaveAttribute('id');
    }
  );

  it('CB-01 preserves distinct IDs on rerender with no invented copy or landmarks', () => {
    const view = (title: string) => (
      <>
        <ChapterBreak title={title} level={1} id='one' />
        <ChapterBreak title='Second' level={3} id='two' />
      </>
    );
    const { container, rerender } = render(view('First'));
    rerender(view('Changed'));
    expect(screen.getByRole('heading', { level: 1, name: 'Changed' })).toHaveAttribute('id', 'one');
    expect(screen.getByRole('heading', { level: 3, name: 'Second' })).toHaveAttribute('id', 'two');
    expect(container.querySelectorAll('[id]')).toHaveLength(2);
    expect(container.textContent).toBe('ChangedSecond');
    expect(screen.queryByRole('region')).toBeNull();
  });

  it.each(['eyebrow', 'accent', 'lede', 'media'] as const)(
    'CB-02/03 independently omits %s without an empty wrapper',
    (missing) => {
      const options = {
        eyebrow: 'Context',
        accent: 'Accent',
        lede: 'Introduction',
        media: <img alt='' src='/decoration.png' />
      };
      const { [missing]: _omitted, ...present } = options;
      const { container } = render(<ChapterBreak title='Heading ' level={2} {...present} />);
      expect(Boolean(screen.queryByText('Context'))).toBe(missing !== 'eyebrow');
      expect(Boolean(container.querySelector('.eg-heading__accent'))).toBe(missing !== 'accent');
      expect(Boolean(screen.queryByText('Introduction'))).toBe(missing !== 'lede');
      expect(Boolean(container.querySelector('[aria-hidden="true"]:has(img)'))).toBe(missing !== 'media');
      const grid = container.querySelector('.eg-chapter-break')?.firstElementChild;
      expect(grid?.children).toHaveLength(missing === 'media' ? 1 : 2);
      expect(grid?.firstElementChild?.children).toHaveLength(missing === 'eyebrow' || missing === 'lede' ? 2 : 3);
      expect(
        screen.getByRole('heading', { name: missing === 'accent' ? 'Heading' : 'Heading Accent' })
      ).toBeInTheDocument();
    }
  );

  it('CB-02/03/04 keeps copy before decorative media with an accessible accent name', () => {
    const { container } = render(
      <ChapterBreak
        title='Build '
        accent='together'
        level={2}
        eyebrow='Context'
        lede='Introduction'
        media={<img alt='' src='/decoration.png' />}
      />
    );
    const heading = screen.getByRole('heading', { name: 'Build together' });
    const image = container.querySelector('img');
    const wrapper = image?.parentElement;
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).not.toHaveAttribute('tabindex');
    expect(wrapper?.querySelector('a, button, input, select, textarea, [tabindex]')).toBeNull();
    expect(
      screen.getByText('Context').compareDocumentPosition(heading) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(
      heading.compareDocumentPosition(screen.getByText('Introduction')) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(heading.compareDocumentPosition(wrapper as Node) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it('CB-03 switches grid and wrapper for present, omitted, null, false and empty media', () => {
    const { container, rerender } = render(
      <ChapterBreak title='Title' level={2} media={<img alt='' src='/decoration.png' />} />
    );
    const grid = () => container.querySelector('.eg-chapter-break')?.firstElementChild;
    expect(grid()).toHaveClass('grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]');
    expect(grid()?.children).toHaveLength(2);
    for (const media of [undefined, null, false, []]) {
      rerender(<ChapterBreak title='Title' level={2} media={media} />);
      expect(grid()).toHaveClass('grid-cols-1');
      expect(grid()).not.toHaveClass('grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]');
      expect(grid()?.children).toHaveLength(1);
      expect(container.querySelector('[aria-hidden="true"]')).toBeNull();
    }
  });

  it('CB-07 rejects protected props at runtime and forwards safe native attributes', () => {
    const unsafe = {
      role: 'navigation',
      style: { color: 'red' },
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' },
      children: 'Injected child',
      asChild: true,
      ref: { current: null }
    };
    const { container } = render(
      <ChapterBreak
        {...unsafe}
        title='Protected'
        level={2}
        id='owned-heading'
        data-owner='host'
        aria-label='Scene'
        tabIndex={-1}
      />
    );
    const root = container.querySelector('.eg-chapter-break');
    for (const attr of ['role', 'style', 'id', 'aschild']) {
      expect(root).not.toHaveAttribute(attr);
    }
    expect(unsafe.ref.current).toBeNull();
    expect(root).toHaveAttribute('data-owner', 'host');
    expect(root).toHaveAttribute('aria-label', 'Scene');
    expect(root).toHaveAttribute('tabindex', '-1');
    expect(container.textContent).toBe('Protected');
    expect(screen.getByRole('heading', { name: 'Protected' })).toHaveAttribute('id', 'owned-heading');
  });

  it('CB-04/05/07 puts responsive, sizing and reset utilities on the right parts and merges placement', () => {
    const { container } = render(
      <ChapterBreak
        title='Title'
        level={2}
        lede='Body'
        media={<img alt='' src='/decoration.png' />}
        className='mt-4 mt-8'
      />
    );
    const root = container.querySelector('.eg-chapter-break');
    expect(root).toHaveClass('box-border', 'w-full', 'font-sans', 'text-fg-default', 'mt-8');
    expect(root).not.toHaveClass('mt-4');
    const grid = root?.firstElementChild;
    expect(grid).toHaveClass(
      'grid',
      'min-w-0',
      'items-center',
      'gap-10',
      'grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]',
      '[@media(width<=860px)]:grid-cols-1',
      '[@media(width<=860px)]:gap-2'
    );
    expect(grid?.firstElementChild).toHaveClass('min-w-0');
    expect(screen.getByRole('heading').parentElement).toHaveClass('mt-5', 'mb-7');
    expect(screen.getByText('Body')).toHaveClass(
      'm-0',
      'max-w-[52ch]',
      'font-sans',
      'text-body-large',
      'text-fg-default',
      'wrap-break-word'
    );
    expect(container.querySelector('img')?.parentElement).toHaveClass(
      'relative',
      'mx-auto',
      'aspect-square',
      'w-[min(100%,58vh)]',
      'min-w-0',
      '[@media(width<=860px)]:order-first',
      '[@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]'
    );
    expect(container.querySelector('[class~="eg-chapter"], [class*="eg-chapter__"]')).toBeNull();
  });

  it('CB-02/07 rejects protected and invalid public types', () => {
    const valid = { title: 'Title', level: 2 as const };
    // @ts-expect-error role is protected.
    const role: ChapterBreakProps = { ...valid, role: 'navigation' };
    // @ts-expect-error style is protected.
    const style: ChapterBreakProps = { ...valid, style: {} };
    // @ts-expect-error raw HTML is protected.
    const html: ChapterBreakProps = { ...valid, dangerouslySetInnerHTML: { __html: 'bad' } };
    // @ts-expect-error children are not supported.
    const children: ChapterBreakProps = { ...valid, children: 'Action' };
    // @ts-expect-error rank must be 1 through 6.
    const rank: ChapterBreakProps = { ...valid, level: 7 };
    // @ts-expect-error title is required.
    const title: ChapterBreakProps = { level: 2 };
    // @ts-expect-error level is required.
    const level: ChapterBreakProps = { title: 'Title' };
    // @ts-expect-error asChild is not supported.
    const asChild: ChapterBreakProps = { ...valid, asChild: true };
    expect([role, style, html, children, rank, title, level, asChild]).toHaveLength(8);
  });
});

describe('ChapterBreak titleVariant (#560)', () => {
  // Every optional part is present. Plain elements keep ids out of the markup, so two renders compare byte for byte.
  const props = {
    title: 'Build ',
    accent: 'together',
    level: 2,
    id: 'chapter-title',
    eyebrow: 'Chapter',
    lede: 'Introduction',
    media: <span>Art</span>
  } satisfies ChapterBreakProps;
  const glow = '[text-shadow:var(--text-shadow-title-hero)]';
  const baseline = () => {
    const view = render(<ChapterBreak {...props} />);
    const html = view.container.innerHTML;
    view.unmount();
    return html;
  };

  it('TV-01 renders the default recipe, byte for byte, with the prop omitted and with hero', () => {
    const expected = baseline();
    const { container } = render(<ChapterBreak {...props} titleVariant='hero' />);
    expect(container.innerHTML).toBe(expected);
    const heading = screen.getByRole('heading', { level: 2, name: 'Build together' });
    expect(heading).toHaveClass('text-title-hero');
    expect(heading).not.toHaveClass('text-title-show');
    expect(screen.getByText('together')).toHaveClass('block', 'text-fg-brand-default', glow);
    expect(screen.getByText('together')).not.toHaveClass('[text-shadow:none]');
  });

  it('TV-02 selects the show recipe on the same heading and drops the accent glow', () => {
    const { container } = render(<ChapterBreak {...props} titleVariant='show' />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Build together' });
    expect(heading).toHaveAttribute('id', 'chapter-title');
    expect(heading).toHaveClass('text-title-show');
    expect(heading).not.toHaveClass('text-title-hero');
    expect(screen.getByText('together')).toHaveClass('block', 'text-fg-brand-default', '[text-shadow:none]');
    expect(screen.getByText('together')).not.toHaveClass(glow);
    expect(container.querySelectorAll('h1, h2, h3, h4, h5, h6')).toHaveLength(1);
  });

  it.each(['display', 'section', 'inverse', 'compact', 'SHOW', '', null, 42])(
    'TV-03 resolves the untyped value %j to hero and never reaches the DOM',
    (value) => {
      const expected = baseline();
      const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
      try {
        const untyped = { titleVariant: value } as unknown as ChapterBreakProps;
        const { container } = render(<ChapterBreak {...props} {...untyped} />);
        expect(container.innerHTML).toBe(expected);
        expect(container.innerHTML).not.toMatch(/title-?variant/i);
        expect(container.querySelector('.eg-chapter-break')?.getAttributeNames()).toEqual(['class']);
        expect(screen.getByRole('heading', { level: 2 })).toHaveClass('text-title-hero');
        expect(error).not.toHaveBeenCalled();
      } finally {
        error.mockRestore();
      }
    }
  );

  it('TV-03 accepts only hero and show at compile time', () => {
    const base = { title: 'Title', level: 2 as const };
    const hero: ChapterBreakProps = { ...base, titleVariant: 'hero' };
    const show: ChapterBreakProps = { ...base, titleVariant: 'show' };
    // @ts-expect-error display is not a supported scene recipe.
    const display: ChapterBreakProps = { ...base, titleVariant: 'display' };
    // @ts-expect-error section is not a supported scene recipe.
    const section: ChapterBreakProps = { ...base, titleVariant: 'section' };
    // @ts-expect-error inverse is not a supported scene recipe.
    const inverse: ChapterBreakProps = { ...base, titleVariant: 'inverse' };
    // @ts-expect-error compact is not a supported scene recipe.
    const compact: ChapterBreakProps = { ...base, titleVariant: 'compact' };
    // @ts-expect-error a number is not a recipe.
    const numeric: ChapterBreakProps = { ...base, titleVariant: 42 };
    expect([hero, show, display, section, inverse, compact, numeric]).toHaveLength(7);
  });

  it('TV-04 changes nothing but the recipe class and the glow utility', () => {
    const hero = render(<ChapterBreak {...props} titleVariant='hero' />);
    const heroHtml = hero.container.innerHTML;
    hero.unmount();
    const { container } = render(<ChapterBreak {...props} titleVariant='show' />);
    expect(heroHtml.split('text-title-hero')).toHaveLength(2);
    expect(heroHtml.split(glow)).toHaveLength(2);
    const swapped = heroHtml.replace('text-title-hero', 'text-title-show').replace(glow, '[text-shadow:none]');
    expect(container.innerHTML).toBe(swapped);
    expect(container.innerHTML).not.toBe(heroHtml);
    expect(container.querySelector('[style]')).toBeNull();
    const markers = (html: string) => html.match(/\beg-[\w-]+/g);
    expect(markers(container.innerHTML)).toEqual(markers(heroHtml));
  });

  it('TV-05 keeps the heading node and id across hero, show and hero again', () => {
    const { rerender } = render(<ChapterBreak {...props} />);
    const heading = screen.getByRole('heading', { level: 2 });
    rerender(<ChapterBreak {...props} titleVariant='show' />);
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(heading).toHaveClass('text-title-show');
    expect(heading).not.toHaveClass('text-title-hero');
    expect(heading).toHaveAttribute('id', 'chapter-title');
    rerender(<ChapterBreak {...props} titleVariant='hero' />);
    expect(screen.getByRole('heading', { level: 2 })).toBe(heading);
    expect(heading).toHaveClass('text-title-hero');
    expect(heading).not.toHaveClass('text-title-show');
    expect(heading).toHaveAttribute('id', 'chapter-title');
  });

  it('TV-05 keeps instance ids distinct when scenes choose different recipes', () => {
    const { container } = render(
      <>
        <ChapterBreak {...props} id='first-chapter' titleVariant='show' />
        <ChapterBreak {...props} id='second-chapter' title='Another ' />
      </>
    );
    const [first, second] = screen.getAllByRole('heading', { level: 2 });
    expect(first).toHaveAttribute('id', 'first-chapter');
    expect(second).toHaveAttribute('id', 'second-chapter');
    expect(first).toHaveClass('text-title-show');
    expect(second).toHaveClass('text-title-hero');
    expect(container.querySelectorAll('[id]')).toHaveLength(2);
  });
});
