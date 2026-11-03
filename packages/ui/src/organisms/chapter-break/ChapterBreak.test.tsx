import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
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
