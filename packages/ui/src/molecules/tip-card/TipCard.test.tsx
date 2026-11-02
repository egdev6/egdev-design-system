import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TipCard } from './TipCard';
import type { TipCardProps } from './types';
import { useTipCard } from './useTipCard';

const base = { title: 'Ship faster', src: 'cover.webp', alt: 'Cover of the ship-faster tip' } as const;
const injected = (props: Record<string, unknown>) => props as unknown as Parameters<typeof useTipCard>[0];

const focalPointClasses = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
  'left-top': 'object-left-top',
  'right-top': 'object-right-top',
  'left-bottom': 'object-left-bottom',
  'right-bottom': 'object-right-bottom'
} as const;

describe('TipCard public contract', () => {
  it('normalizes the hook: default rank, data hook, heading id and protected-prop stripping (TP-01)', () => {
    const { result } = renderHook(() =>
      useTipCard(injected({ ...base, role: 'button', 'aria-label': 'hijack', tabIndex: 0, level: 9 }))
    );
    expect(result.current.valid).toBe(true);
    expect(result.current.headingElement).toBe('h3');
    expect(result.current.rootProps['aria-labelledby']).toBe(result.current.headingProps.id);
    expect(result.current.rootProps.role).toBeUndefined();
    expect(result.current.rootProps['aria-label']).toBeUndefined();
    expect(result.current.rootProps.tabIndex).toBeUndefined();
    expect(result.current.rootProps['data-level']).toBe(3);
  });

  it('renders a passive article named by its generated heading, with the PhotoFrame cover (TP-01)', () => {
    render(<TipCard {...base} />);
    const article = screen.getByRole('article', { name: 'Ship faster' });
    expect(article).toHaveClass('eg-tip-card');
    const heading = within(article).getByRole('heading', { name: 'Ship faster', level: 3 });
    expect(article).toHaveAttribute('aria-labelledby', heading.id);
    const image = within(article).getByRole('img', { name: base.alt });
    expect(image).toHaveAttribute('src', base.src);
  });

  it.each([2, 4, 5, 6] as const)('renders the heading as h%s when level=%s (TP-01)', (level) => {
    render(<TipCard {...base} level={level} />);
    expect(screen.getByRole('heading', { name: base.title, level })).toBeInTheDocument();
    expect(screen.getByRole('article', { name: base.title })).toHaveAttribute('data-level', String(level));
  });

  it('warns and renders nothing for a blank title, then recovers (TP-02)', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container, rerender } = render(<TipCard {...base} title='   ' />);
    expect(container.querySelector('article')).toBeNull();
    expect(warn).toHaveBeenCalledTimes(1);
    rerender(<TipCard {...base} />);
    expect(screen.getByRole('article', { name: base.title })).toBeInTheDocument();
    warn.mockRestore();
  });

  it('renders a solid brand badge in the caption row only when supplied (TP-03)', () => {
    render(<TipCard {...base} badge='Tip' />);
    const badge = screen.getByText('Tip');
    expect(badge).toHaveClass('eg-badge');
    expect(badge).toHaveClass('bg-action-primary-solid-bg', 'text-action-primary-solid-fg');
    // The badge sits inside the caption row, before the heading.
    expect(badge.parentElement).toHaveClass('eg-tip-card__cap');
    expect(badge.nextElementSibling).toBe(screen.getByRole('heading', { name: base.title }));
  });

  it('omits the badge and leaves no empty pill when absent or whitespace-only (TP-03)', () => {
    render(
      <>
        <TipCard {...base} />
        <TipCard {...base} title='Second tip' badge='   ' />
      </>
    );
    expect(screen.getByRole('article', { name: base.title }).querySelector('.eg-badge')).toBeNull();
    expect(screen.getByRole('article', { name: 'Second tip' }).querySelector('.eg-badge')).toBeNull();
  });

  it('composes the raised surface-1 frame recipe with box-border (TP-04, G7a)', () => {
    render(<TipCard {...base} />);
    const article = screen.getByRole('article', { name: base.title });
    expect(article).toHaveClass(
      'eg-tip-card',
      'box-border',
      'bg-surface-1',
      'rounded-xl',
      'p-3',
      'shadow-[var(--shadow-edge),var(--shadow-elev-1)]'
    );
  });

  it('reserves the fixed 2:3 cover through PhotoFrame and applies the supplied focal point (TP-04)', () => {
    const { container } = render(<TipCard {...base} focalPoint='left' />);
    const wrapper = container.querySelector('[data-radix-aspect-ratio-wrapper]');
    expect(wrapper).toHaveStyle({ paddingBottom: '150%' });
    expect(screen.getByRole('figure')).toHaveAttribute('data-ratio', String(2 / 3));
    expect(screen.getByRole('img')).toHaveClass('object-left');
  });

  it.each(Object.entries(focalPointClasses) as [TipCardProps['focalPoint'], string][])(
    'maps focalPoint %s to exactly its own crop class (TP-04)',
    (focalPoint, focalClass) => {
      const { unmount } = render(<TipCard {...base} focalPoint={focalPoint} />);
      expect(screen.getByRole('img')).toHaveClass(focalClass);
      unmount();
    }
  );

  it('keeps every own element free of inline style and custom properties (TP-04)', () => {
    render(<TipCard {...base} focalPoint='right-top' />);
    const article = screen.getByRole('article', { name: base.title });
    // The Radix AspectRatio reservation (its wrapper and inner box) is the approved inline
    // geometry mechanism owned by the primitive; PhotoFrame's own suite asserts it. Every other
    // element in the tree is TipCard-owned and carries no inline appearance.
    const ownElements = [article, ...article.querySelectorAll('*')].filter(
      (element) => element.closest('[data-radix-aspect-ratio-wrapper]') === null
    );
    expect(ownElements.length).toBeGreaterThan(0);
    for (const element of ownElements) {
      expect(element).not.toHaveAttribute('style');
    }
  });

  it('keeps the 2:3 reservation inside a narrow flex host with a failing image (TP-04, G7b)', () => {
    const { container } = render(
      <div className='w-48 flex flex-col'>
        <TipCard {...base} src='definitely-missing.webp' />
      </div>
    );
    // jsdom cannot measure offsetHeight/offsetWidth; the reservation is asserted through the
    // Radix reservation box (padding-bottom 150%), and real-browser geometry is the parent's
    // plan §10 browser check.
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toHaveStyle({ paddingBottom: '150%' });
    const article = screen.getByRole('article', { name: base.title });
    expect(within(article).getByRole('heading', { name: base.title })).toBeInTheDocument();
  });

  it('wraps a long title without truncation, clamping or reordering (TP-05)', () => {
    const longTitle = 'A deliberately long technical label that must wrap across several lines in a narrow poster';
    render(
      <div className='w-48'>
        <TipCard title={longTitle} badge='Tip' src={base.src} alt={base.alt} />
      </div>
    );
    const article = screen.getByRole('article', { name: longTitle });
    const heading = within(article).getByRole('heading', { name: longTitle });
    expect(heading).toHaveClass('wrap-anywhere');
    // DOM order: cover, badge, heading.
    expect(article.children[0]?.tagName).toBe('FIGURE');
    expect(article.children[1]).toHaveClass('eg-tip-card__cap');
    expect(article.children[1]?.children[0]).toHaveClass('eg-badge');
    expect(article.children[1]?.children[1]?.tagName).toBe('H3');
    // Badge's own approved recipe keeps a single pill label on one line; the card itself adds no
    // truncation (same exclusion ProjectCard applies to static Chips).
    for (const element of [article, ...article.querySelectorAll('*')].filter(
      (el) => !el.classList.contains('eg-badge')
    )) {
      for (const cls of element.classList) {
        expect(cls).not.toMatch(/^(truncate|line-clamp|text-ellipsis|whitespace-nowrap)/);
      }
    }
  });

  it('exposes zero tab stops, no interactive descendant and no pointer affordance (TP-06)', async () => {
    const user = userEvent.setup();
    render(<TipCard {...base} />);
    const article = screen.getByRole('article', { name: base.title });
    for (const element of article.querySelectorAll('*')) {
      expect(element).not.toHaveAttribute('tabindex');
    }
    expect(article.querySelector('a, button, [role], [contenteditable]')).toBeNull();
    await user.tab();
    expect(document.activeElement).toBe(document.body);
    for (const cls of article.classList) {
      expect(cls.startsWith('hover:')).toBe(false);
      if (cls.startsWith('transition')) {
        expect(cls).toBe('transition-none');
      }
      expect(cls).not.toBe('cursor-pointer');
    }
  });

  it('merges consumer className last for outer layout and ships no built-in width (TP-07)', () => {
    render(
      <>
        <TipCard {...base} />
        <TipCard {...base} title='Second poster' className='mt-6' />
      </>
    );
    // Without a consumer className the card root ships no built-in width at all.
    const bare = screen.getByRole('article', { name: base.title });
    for (const cls of bare.classList) {
      expect(cls.startsWith('w-')).toBe(false);
      expect(cls.startsWith('max-w-')).toBe(false);
    }
    const article = screen.getByRole('article', { name: 'Second poster' });
    expect(article).toHaveClass('mt-6');
    const ordered = article.className.split(' ');
    expect(ordered.indexOf('mt-6')).toBeGreaterThan(ordered.indexOf('eg-tip-card'));
  });

  it('keeps the 2:3 reservation at two consumer widths (TP-07)', () => {
    const { container } = render(
      <div className='flex flex-col gap-6'>
        <div className='w-48'>
          <TipCard {...base} />
        </div>
        <div className='w-72'>
          <TipCard {...base} title='Wide poster' />
        </div>
      </div>
    );
    for (const wrapper of container.querySelectorAll('[data-radix-aspect-ratio-wrapper]')) {
      expect(wrapper).toHaveStyle({ paddingBottom: '150%' });
    }
  });

  it('neutralizes the legacy root transform, transition and display rules (legacy collision regression)', () => {
    render(<TipCard {...base} />);
    const article = screen.getByRole('article', { name: base.title });
    // Legacy .eg-tip-card paints a 3D coverflow transform, an opacity calc and a box-shadow
    // transition on the stable root; the passive recipe neutralizes with scoped utilities
    // (utilities layer wins over the legacy components layer). The flex column layout overrides
    // the legacy display:block.
    expect(article).toHaveClass('transform-none', 'transition-none', 'flex', 'flex-col');
  });

  it('keeps the caption row in flow below the cover without the legacy overlay scrim (legacy collision regression)', () => {
    render(<TipCard {...base} badge='Tip' />);
    const caption = screen.getByRole('article', { name: base.title }).querySelector('.eg-tip-card__cap');
    expect(caption).not.toBeNull();
    // Legacy .eg-tip-card__cap positions the caption absolutely over the image with a gradient
    // scrim and padding; the approved recipe keeps it below the cover with no paint.
    expect(caption).toHaveClass('relative', 'inset-auto', 'p-0', 'bg-none');
    expect(caption).not.toHaveClass('absolute');
  });
});
