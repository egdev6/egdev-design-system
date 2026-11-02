import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PhotoFrame } from '../../atoms/photo-frame';
import * as publicAPI from '.';
import { ArticleFeature, ArticleFeatureCover } from './ArticleFeature';
import { useArticleFeature, useArticleFeatureCover } from './useArticleFeature';

const mediaChild = <PhotoFrame ratio='auto' src='data:image/svg+xml;base64,ZGlhZ25vc3RpYw==' alt='' />;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('ArticleFeature public contract', () => {
  it('renders exactly one anchor around the whole composition with no wrapper (AF-01)', () => {
    const { container } = render(<ArticleFeature title='Design tokens' href='/blog/tokens' />);
    const link = screen.getByRole('link', { name: 'Design tokens' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/blog/tokens');
    expect(link).toHaveClass('eg-article-feature');
    // The anchor itself is the card root: nothing wraps it inside the container.
    expect(link.parentElement).toBe(container);
    expect(screen.getByRole('heading', { level: 3, name: 'Design tokens' })).toBeInTheDocument();
    // No empty zones when the optional parts are not supplied.
    expect(container.querySelector('.eg-article-feature__cover')).toBeNull();
    expect(container.querySelector('.eg-article-feature__meta')).toBeNull();
    expect(container.querySelector('.eg-article-feature__action')).toBeNull();
  });

  it('selects the native heading rank from level without changing the title typography (AF-01)', () => {
    const { rerender } = render(<ArticleFeature title='Ranked' href='#ranked' level={2} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Ranked' }).tagName).toBe('H2');
    rerender(<ArticleFeature title='Ranked' href='#ranked' level={6} />);
    expect(screen.getByRole('heading', { level: 6, name: 'Ranked' }).tagName).toBe('H6');
  });

  it('merges asChild onto one consumer anchor with no nested anchor and one tab stop (AF-02)', async () => {
    const user = userEvent.setup();
    render(
      <ArticleFeature title='Router link' asChild={true}>
        <a href='https://example.com/post' />
      </ArticleFeature>
    );
    const link = screen.getByRole('link', { name: 'Router link' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', 'https://example.com/post');
    expect(link).toHaveClass('eg-article-feature');
    expect(link.parentElement).toBe(screen.getByRole('link').parentElement);
    expect(link.querySelector('a, button')).toBeNull();
    await user.tab();
    expect(link).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
  });

  it('renders one context row with an aria-hidden separator only between supplied values (AF-03)', () => {
    const { rerender, container } = render(
      <ArticleFeature title='T' href='#t' eyebrow='Architecture' detail='12 min · 18 Sep 2026' />
    );
    const row = container.querySelector('.eg-article-feature__meta');
    expect(row?.tagName).toBe('P');
    expect(screen.getByText('Architecture')).toHaveClass('text-fg-brand-raised');
    expect(screen.getByText('12 min · 18 Sep 2026')).toHaveClass('text-fg-secondary', 'min-w-0');
    const separator = row?.querySelector('[aria-hidden="true"]');
    expect(separator).not.toBeNull();
    expect(separator).toHaveTextContent('·');
    rerender(<ArticleFeature title='T' href='#t' eyebrow='Architecture' />);
    expect(container.querySelector('.eg-article-feature__meta [aria-hidden="true"]')).toBeNull();
    expect(screen.queryByText('12 min · 18 Sep 2026')).not.toBeInTheDocument();
    rerender(<ArticleFeature title='T' href='#t' />);
    expect(container.querySelector('.eg-article-feature__meta')).toBeNull();
    rerender(<ArticleFeature title='T' href='#t' eyebrow='   ' detail='  ' />);
    expect(container.querySelector('.eg-article-feature__meta')).toBeNull();
  });

  it('warns and renders nothing for a blank title on both branches (AF-04)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = render(
      <ArticleFeature title='   ' href='/blog/tokens'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();
    warnSpy.mockClear();
    rerender(
      <ArticleFeature title='' asChild={true}>
        <a href='/blog/tokens' />
      </ArticleFeature>
    );
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(warnSpy).toHaveBeenCalled();
  });

  it('neutralizes legacy cover paint and fills the reserved well (AF-05)', () => {
    const { container } = render(
      <ArticleFeature title='Covered' href='#covered'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
    );
    const cover = container.querySelector('.eg-article-feature__cover');
    expect(cover).toHaveClass('bg-none', 'border-b-0', 'aspect-auto', 'overflow-visible');
  });

  it('fills the reserved well so its decorative word aligns to the bottom (AF-05)', () => {
    render(
      <ArticleFeature title='Covered' href='#covered'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
    );
    expect(screen.getByText('/src').parentElement).toHaveClass('h-full', 'flex', 'items-end');
  });

  it('clips the oversized decorative word inside the well on narrow cards (AF-05, AF-09)', () => {
    render(
      <ArticleFeature title='Narrow' href='#narrow' className='w-72'>
        <ArticleFeatureCover coverWord='/design-system' />
      </ArticleFeature>
    );
    expect(screen.getByText('/design-system').parentElement).toHaveClass('overflow-hidden');
  });

  it('neutralizes legacy root and metadata effects while retaining approved styling (AF-03, AF-08)', () => {
    const { container } = render(<ArticleFeature title='T' href='#t' eyebrow='Architecture' />);
    expect(screen.getByRole('link')).toHaveClass('backdrop-filter-none', 'overflow-visible');
    expect(container.querySelector('.eg-article-feature__meta')).toHaveClass('normal-nums', 'text-meta');
  });

  it('reserves 16:8 for a generative well with an aria-hidden cover word (AF-05)', () => {
    const { container } = render(
      <ArticleFeature title='Covered' href='#covered'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
    );
    const cover = container.querySelector('.eg-article-feature__cover');
    expect(cover).toHaveAttribute('data-cover', 'generative');
    const reservation = cover?.querySelector('[data-radix-aspect-ratio-wrapper]');
    expect(reservation).toHaveStyle({ paddingBottom: '50%' });
    const word = cover?.querySelector('[aria-hidden="true"]');
    expect(word).toHaveTextContent('/src');
    expect(word?.className).toContain('text-title-display');
    expect(word?.className).toContain('text-alpha-white-07');
    expect(word?.className).toContain('leading-none');
    expect(word?.className).toContain('uppercase');
  });

  it('fills the reserved 16:8 with an auto PhotoFrame child and no word (AF-05)', () => {
    const { container } = render(
      <ArticleFeature title='Photographed' href='#photo'>
        <ArticleFeatureCover>{mediaChild}</ArticleFeatureCover>
      </ArticleFeature>
    );
    const cover = container.querySelector('.eg-article-feature__cover');
    expect(cover).toHaveAttribute('data-cover', 'media');
    expect(cover).toHaveClass('bg-none', 'border-b-0', 'aspect-auto', 'overflow-visible');
    expect(cover?.querySelector('[data-radix-aspect-ratio-wrapper]')).toHaveStyle({ paddingBottom: '50%' });
    const figure = container.querySelector('figure');
    expect(figure).toHaveAttribute('data-ratio', 'auto');
    expect(figure).toHaveClass('h-full', 'min-h-0');
    expect(container.querySelector('[aria-hidden="true"]')?.textContent).not.toBe('/src');
  });

  it('warns when the media child sets its own ratio instead of auto (AF-05)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useArticleFeatureCover({
        children: <PhotoFrame ratio={1} src='data:image/svg+xml;base64,ZGlhZ25vc3RpYw==' alt='' />
      })
    );
    expect(result.current.coverProps['data-cover']).toBe('media');
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('ratio="auto"'));
  });

  it('warns that media wins over coverWord when both are supplied (AF-05)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { container } = render(
      <ArticleFeature title='Both' href='#both'>
        <ArticleFeatureCover coverWord='/src'>{mediaChild}</ArticleFeatureCover>
      </ArticleFeature>
    );
    const cover = container.querySelector('.eg-article-feature__cover');
    expect(cover).toHaveAttribute('data-cover', 'media');
    expect(cover?.textContent).not.toContain('/src');
    expect(warnSpy).toHaveBeenCalled();
  });

  it('omits a whitespace-only cover word from the generative plate (AF-05)', () => {
    const { container } = render(
      <ArticleFeature title='Blank word' href='#blank'>
        <ArticleFeatureCover coverWord='   ' />
      </ArticleFeature>
    );
    const cover = container.querySelector('.eg-article-feature__cover');
    expect(cover).toHaveAttribute('data-cover', 'generative');
    expect(cover?.querySelector('[aria-hidden="true"]')).toBeNull();
  });

  it('renders a solid brand badge over the cover only when supplied, never interactive (AF-06)', async () => {
    const user = userEvent.setup();
    const { rerender, container } = render(
      <ArticleFeature title='Flagged' href='#flagged'>
        <ArticleFeatureCover coverWord='/src' badge='Featured' />
      </ArticleFeature>
    );
    const badge = screen.getByText('Featured');
    expect(badge).toHaveClass('eg-badge');
    expect(badge.closest('.eg-article-feature__cover')).not.toBeNull();
    // The badge is plain text inside the card link, never its own interactive element or tab stop.
    expect(badge.querySelector('a, button')).toBeNull();
    expect(badge.closest('[tabindex]')).toBeNull();
    await user.tab();
    expect(screen.getByRole('link', { name: /Flagged/ })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
    rerender(
      <ArticleFeature title='Flagged' href='#flagged'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
    );
    expect(container.querySelector('.eg-badge')).toBeNull();
    rerender(
      <ArticleFeature title='Flagged' href='#flagged'>
        <ArticleFeatureCover coverWord='/src' badge='   ' />
      </ArticleFeature>
    );
    expect(container.querySelector('.eg-badge')).toBeNull();
  });

  it('renders the action label as paint and text with a decorative arrow, never a control (AF-07)', async () => {
    const user = userEvent.setup();
    const { rerender, container } = render(<ArticleFeature title='Action' href='#action' actionLabel='Read article' />);
    const action = container.querySelector('.eg-article-feature__action');
    expect(action?.tagName).toBe('SPAN');
    expect(action).toHaveTextContent('Read article');
    const arrow = action?.querySelector('svg');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('a, button')).toBe(screen.getByRole('link', { name: /Read article/ }));
    await user.tab();
    expect(screen.getByRole('link', { name: /Read article/ })).toHaveFocus();
    await user.tab();
    expect(document.body).toHaveFocus();
    rerender(<ArticleFeature title='Action' href='#action' actionLabel='   ' />);
    expect(container.querySelector('.eg-article-feature__action')).toBeNull();
  });

  it('applies the approved hover/focus recipe with no lift, scale or glow (AF-08)', () => {
    render(<ArticleFeature title='Hovered' href='#hover' />);
    const root = screen.getByRole('link', { name: 'Hovered' });
    for (const marker of [
      'hover:border-border-brand',
      'hover:[background:var(--gradient-sheen),var(--color-surface-2)]',
      'focus-visible:shadow-focus',
      'motion-reduce:transition-none',
      'duration-(--duration-fast)',
      'ease-(--ease-out)'
    ]) {
      expect(root.className).toContain(marker);
    }
    // No lift, scale or glow: only the approved hover hairline plus tonal step, and the Surface
    // elevation-1 frame shadow, never an added glow, hover or transform shadow utility.
    expect(root.className).not.toMatch(/scale-|translate-|rotate-|glow|shadow-hot/);
    expect(root.className).not.toMatch(/hover:[^\s]*shadow|shadow-[^\s]*(?:glow|hot|lift)/);
  });

  it('renders unchanged under prefers-reduced-motion reduce (AF-08)', () => {
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockImplementation((query: string) => ({
        matches: query.includes('prefers-reduced-motion: reduce'),
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    );
    render(
      <ArticleFeature title='Still' href='#still' eyebrow='Architecture' actionLabel='Read article'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
    );
    const root = screen.getByRole('link', { name: /Still/ });
    expect(root.className).toContain('motion-reduce:transition-none');
    expect(screen.getByRole('heading', { name: 'Still' })).toBeInTheDocument();
    expect(document.querySelector('.eg-article-feature__cover')).not.toBeNull();
  });

  it('wraps long content without truncation and keeps the action label pinned (AF-09)', () => {
    const { container } = render(
      <ArticleFeature
        title='A very long featured article title that must wrap across several narrow lines instead of being truncated'
        href='#long'
        eyebrow='Architecture'
        detail='twelve minutes of reading time plus the nineteenth of September in the year twenty twenty-six'
        actionLabel='Read article'
        className='w-64'
      />
    );
    const root = screen.getByRole('link');
    const heading = screen.getByRole('heading');
    const action = container.querySelector('.eg-article-feature__action');
    expect(root).toHaveClass('w-64', 'min-w-0');
    expect(heading).toHaveClass('wrap-anywhere');
    expect(root.className).not.toMatch(/truncate|line-clamp|overflow-x/);
    expect(root.textContent).toContain('truncated');
    expect(root.textContent).not.toContain('…');
    expect(action).toHaveClass('mt-auto');
  });

  it('keeps box-border on the merged root of both branches and honors aria-label overrides (AF-10)', () => {
    const { rerender } = render(<ArticleFeature title='Boxed' href='#boxed' aria-label='Read the tokens article' />);
    const link = screen.getByRole('link', { name: 'Read the tokens article' });
    expect(link).toHaveClass('box-border');
    expect(screen.queryByRole('link', { name: 'Boxed' })).not.toBeInTheDocument();
    rerender(
      <ArticleFeature title='Boxed' asChild={true} aria-label='Slotted name'>
        <a href='#slotted' />
      </ArticleFeature>
    );
    expect(screen.getByRole('link', { name: 'Slotted name' })).toHaveClass('box-border');
  });

  it('normalizes slots and strips protected semantics in the hook', () => {
    const { result } = renderHook(() =>
      useArticleFeature({
        title: 'Hooked',
        href: '#hooked',
        level: 9 as 3,
        eyebrow: '  Architecture  ',
        detail: '   ',
        actionLabel: 'Read',
        role: 'dialog',
        tabIndex: 0,
        style: { background: 'red' },
        'aria-label': 'Kept'
      } as Parameters<typeof useArticleFeature>[0])
    );
    expect(result.current.valid).toBe(true);
    expect(result.current.headingElement).toBe('h3');
    expect(result.current.rootProps['data-level']).toBe(3);
    expect(result.current.eyebrow).toBe('  Architecture  ');
    expect(result.current.detail).toBeNull();
    expect(result.current.action).toBe('Read');
    expect(result.current.rootProps['aria-label']).toBe('Kept');
    for (const key of ['role', 'tabIndex', 'style', 'ref']) {
      expect(result.current.rootProps).not.toHaveProperty(key);
    }
  });

  it('warns and renders nothing for a blank title through the hook', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { result } = renderHook(() =>
      useArticleFeature({ title: ' ', href: '#blank' } as Parameters<typeof useArticleFeature>[0])
    );
    expect(result.current.valid).toBe(false);
    expect(warnSpy).toHaveBeenCalled();
  });

  it('exports both components through the folder index', () => {
    expect(Object.keys(publicAPI).sort()).toEqual(['ArticleFeature', 'ArticleFeatureCover']);
  });
});
