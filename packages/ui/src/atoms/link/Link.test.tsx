import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';
import { createRef, forwardRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Link } from './Link';
import { useLink } from './useLink';

const RouterLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) => (
  <a {...props} ref={ref} />
));

describe('Link navigation contract', () => {
  it('renders the native destination, public marker and decorative small right arrow by default', () => {
    render(<Link href='#articles'>All articles</Link>);
    const link = screen.getByRole('link', { name: 'All articles' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '#articles');
    expect(link).toHaveClass(
      'eg-link',
      'text-label-default',
      'text-fg-brand-raised',
      'items-center',
      'border-0',
      'pb-0'
    );
    expect(link).not.toHaveClass('border-b', 'border-border-brand', 'text-fg-default');
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    const arrow = link.querySelector('svg');
    expect(arrow).toHaveAttribute('aria-hidden', 'true');
    expect(arrow).toHaveAttribute('focusable', 'false');
    expect(arrow).toHaveClass('eg-icon', 'size-4', 'transform-none');
    expect(arrow?.innerHTML).toContain('M5 12h14');
    expect(link.querySelector('span')).toBeNull();
  });

  it('derives hook defaults, arrow direction and safe deduplicated rel tokens', () => {
    const { result, rerender } = renderHook(
      ({ external }) => useLink({ href: '#docs', children: 'Docs', external, rel: 'author noopener author' }),
      { initialProps: { external: false } }
    );
    expect(result.current.arrowName).toBe('arrow-right');
    expect(result.current.showArrow).toBe(true);
    expect(result.current.rootProps.rel).toBe('author noopener author');
    expect(result.current.rootProps.target).toBeUndefined();
    rerender({ external: true });
    expect(result.current.arrowName).toBe('arrow-right');
    expect(result.current.rootProps.target).toBe('_blank');
    expect(result.current.rootProps.rel).toBe('author noopener noreferrer');
    expect(result.current.newTabText).toBe('(opens in a new tab)');
  });

  it('announces external navigation and overrides a conflicting native target', () => {
    render(
      <Link href='https://example.com' external={true} target='_self' rel='author noreferrer'>
        Repository
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Repository (opens in a new tab)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(new Set(link.getAttribute('rel')?.split(' '))).toEqual(new Set(['author', 'noopener', 'noreferrer']));
    expect(link.querySelector('svg')?.innerHTML).toContain('M5 12h14');
    const notice = screen.getByText('(opens in a new tab)');
    expect(notice).not.toHaveAttribute('aria-hidden');
    expect(notice.style.position).toBe('absolute');
  });

  it('localizes the notice, hides only the arrow and removes external additions on rerender', () => {
    const { rerender } = render(
      <Link href='#docs' external={true} arrow={false} newTabText='(new window)'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link', { name: 'Docs (new window)' }).querySelector('svg')).toBeNull();
    rerender(
      <Link href='#docs' arrow={false} newTabText='(new window)'>
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(link).not.toHaveAttribute('target');
    expect(link).not.toHaveAttribute('rel');
    expect(screen.queryByText('(new window)')).toBeNull();
  });

  it('preserves native attributes, supported layout and native refs without leaking own props', () => {
    const ref = createRef<HTMLAnchorElement>();
    render(
      <Link
        href='#docs'
        ref={ref}
        id='docs'
        title='Read docs'
        lang='en'
        data-purpose='help'
        aria-describedby='hint'
        className='mt-2 mt-4 self-start'
      >
        Docs
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Docs' });
    expect(ref.current === link).toBe(true);
    expect(link).toHaveClass('eg-link', 'mt-4', 'self-start');
    expect(link).not.toHaveClass('mt-2');
    expect(link).toHaveAttribute('aria-describedby', 'hint');
    expect(link).toHaveAttribute('data-purpose', 'help');
    expect(link).toHaveAttribute('title', 'Read docs');
    for (const prop of ['external', 'newTabText', 'asChild', 'arrow']) {
      expect(link).not.toHaveAttribute(prop);
    }
  });

  it('slots one router-like anchor, composing refs, child events, layout and appended content', async () => {
    const user = userEvent.setup();
    const parentRef = createRef<HTMLAnchorElement>();
    const childRef = createRef<HTMLAnchorElement>();
    const parentClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const childClick = vi.fn();
    render(
      <Link asChild={true} ref={parentRef} onClick={parentClick} className='mt-4'>
        <RouterLink href='#router' ref={childRef} onClick={childClick} className='self-start'>
          Router docs
        </RouterLink>
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Router docs' });
    expect(screen.getAllByRole('link')).toHaveLength(1);
    expect(link).toHaveClass('eg-link', 'mt-4', 'self-start');
    expect(parentRef.current === link && childRef.current === link).toBe(true);
    expect(link.querySelector('svg')).not.toBeNull();
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(childClick).toHaveBeenCalledOnce();
    expect(parentClick).toHaveBeenCalledOnce();
    expect(childClick.mock.invocationCallOrder[0]).toBeLessThan(parentClick.mock.invocationCallOrder[0] ?? 0);
  });

  it('keeps external safety and notice even when the slotted anchor supplies target and rel', () => {
    render(
      <Link asChild={true} external={true} rel='author' newTabText='(new window)'>
        <RouterLink href='#router' target='_self' rel='help noreferrer'>
          Router docs
        </RouterLink>
      </Link>
    );
    const link = screen.getByRole('link', { name: 'Router docs (new window)' });
    expect(link).toHaveAttribute('target', '_blank');
    expect(new Set(link.getAttribute('rel')?.split(' '))).toEqual(
      new Set(['author', 'help', 'noopener', 'noreferrer'])
    );
    expect(link.querySelector('svg')?.innerHTML).toContain('M5 12h14');
  });

  it('leaves ordinary native and slotted targets/rel untouched when external is false', () => {
    const { rerender } = render(
      <Link href='#docs' target='details' rel='help'>
        Docs
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', 'details');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'help');
    rerender(
      <Link asChild={true}>
        <RouterLink href='#router' target='router' rel='bookmark'>
          Docs
        </RouterLink>
      </Link>
    );
    expect(screen.getByRole('link')).toHaveAttribute('target', 'router');
    expect(screen.getByRole('link')).toHaveAttribute('rel', 'bookmark');
  });

  it('uses native Tab/Enter and forwards click prevention without custom keyboard handlers', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <Link href='#docs' onClick={onClick}>
        Docs
      </Link>
    );
    await user.tab();
    expect(screen.getByRole('link')).toHaveFocus();
    await user.keyboard('{Enter}');
    await user.click(screen.getByRole('link'));
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('link')).not.toHaveAttribute('role');
    expect(screen.getByRole('link')).not.toHaveAttribute('tabindex');
  });

  it('provides scoped hover, focus and reduced-motion utilities while resetting legacy transforms', () => {
    const { result } = renderHook(() => useLink({ href: '#docs', children: 'Docs' }));
    expect(result.current.rootProps.className).toContain('group/link');
    expect(result.current.rootProps.className).toContain('focus-visible:[box-shadow:var(--shadow-focus)]');
    expect(result.current.rootProps.className).toContain('motion-reduce:transition-none');
    expect(result.current.arrowClassName).toContain('transform-none');
    expect(result.current.arrowClassName).toContain('motion-safe:group-hover/link:translate-x-1');
    expect(result.current.arrowClassName).not.toContain('translate-y');
    expect(result.current.arrowClassName).toContain('self-center');
    expect(result.current.arrowClassName).toContain('duration-(--duration-fast)');
    expect(result.current.arrowClassName).toContain('ease-(--ease-out)');
    expect(result.current.arrowClassName).toContain('motion-reduce:translate-none');
    expect(result.current.arrowClassName).toContain('motion-reduce:transition-none');
  });

  it('server-renders native and slotted anchors with safe external semantics', () => {
    const html = renderToString(
      <Link href='#docs' external={true}>
        Docs
      </Link>
    );
    expect(html).toContain('target="_blank"');
    expect(html).toContain('noopener noreferrer');
    expect(html).toContain('(opens in a new tab)');
    const slotted = renderToString(
      <Link asChild={true}>
        <RouterLink href='#router'>Router docs</RouterLink>
      </Link>
    );
    expect(slotted.startsWith('<a ')).toBe(true);
    expect(slotted).toContain('eg-link');
    expect(slotted).toContain('href="#router"');
    expect(slotted).not.toContain('asChild');
  });
});
