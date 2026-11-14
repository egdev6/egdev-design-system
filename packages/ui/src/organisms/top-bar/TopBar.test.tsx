import { act, cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLayoutEffect } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Dialog, DialogContent, DialogTrigger } from '../../molecules/dialog';
import { TopBarEnd } from './index';
import {
  TopBar,
  TopBarBrand,
  TopBarMobileTrigger,
  TopBarSearchCompact,
  TopBarSearchFull,
  TopBarUserMenu
} from './TopBar';
import type { TopBarItem, TopBarPartProps, TopBarProps } from './types';

type Assert<T extends true> = T;
// @ts-expect-error Parts do not expose className.
type InvalidPart = Assert<'className' extends keyof TopBarPartProps ? true : false>;
// @ts-expect-error The root does not expose a role override.
type InvalidRole = Assert<'role' extends keyof TopBarProps ? true : false>;
// @ts-expect-error Current state is restricted to page.
type InvalidCurrent = Assert<'step' extends TopBarItem['aria-current'] ? true : false>;
type StateContract = Assert<TopBarProps extends { 'data-state'?: 'transparent' | 'glass' } ? true : false>;
// @ts-expect-error Native state accepts only transparent or glass.
type InvalidState = Assert<'open' extends TopBarProps['data-state'] ? true : false>;
export type TypeNegatives = [InvalidPart, InvalidRole, InvalidCurrent, StateContract, InvalidState];

const home: TopBarItem = { id: 'home', label: 'Home', href: '#home' };
const about: TopBarItem = { id: 'about', label: 'About', href: '#about' };
const brand = (
  <TopBarBrand>
    <a href='/'>Brand</a>
  </TopBarBrand>
);

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

function scrollDriver(initial = 0) {
  let position = initial;
  let next = 0;
  const frames = new Map<number, FrameRequestCallback>();
  vi.spyOn(window, 'scrollY', 'get').mockImplementation(() => position);
  const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
    const id = ++next;
    frames.set(id, callback);
    return id;
  });
  const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((id) => {
    frames.delete(id);
  });
  return {
    request,
    cancel,
    pending: () => frames.size,
    move(value: number) {
      position = value;
      fireEvent.scroll(window);
    },
    flush() {
      const callbacks = [...frames.values()];
      frames.clear();
      act(() => callbacks.forEach((callback) => callback(0)));
    }
  };
}

describe('TopBar', () => {
  it('partitions reordered and fragment-wrapped known parts into DOM order', () => {
    render(
      <TopBar label='Main' items={[home]}>
        <TopBarUserMenu>
          <button>Account</button>
        </TopBarUserMenu>
        <>
          <TopBarSearchFull>
            <button>Search</button>
          </TopBarSearchFull>
          {brand}
        </>
      </TopBar>
    );
    expect(Array.from(screen.getByRole('banner').querySelectorAll('a,button')).map((el) => el.textContent)).toEqual([
      'Brand',
      'Home',
      'Search',
      'Account'
    ]);
  });
  it('warns about a missing brand', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <TopBar label='Main' items={[]}>
        <TopBarUserMenu>
          <button>Account</button>
        </TopBarUserMenu>
      </TopBar>
    );
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/brand/i));
    warn.mockRestore();
  });
  it('warns about duplicate parts', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <TopBar label='Main' items={[]}>
        {brand}
        <TopBarBrand>
          <a href='/other'>Other</a>
        </TopBarBrand>
      </TopBar>
    );
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/duplicate/i));
    warn.mockRestore();
  });
  it('warns about non-part children', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <TopBar label='Main' items={[]}>
        {brand}
        <span>Invalid</span>
      </TopBar>
    );
    expect(warn).toHaveBeenCalledWith(expect.stringMatching(/part/i));
    warn.mockRestore();
  });
  it('TB-01 renders named native landmarks, ordered links and host current state', () => {
    const { rerender } = render(
      <TopBar label='Main' items={[{ ...home, 'aria-current': 'page' }, about]} id='site' data-owner='host'>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(header).toHaveAttribute('id', 'site');
    expect(header).toHaveAttribute('data-owner', 'host');
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => link.textContent)).toEqual(['Home', 'About']);
    expect(links[0]).toHaveAttribute('aria-current', 'page');
    expect(links[1]).not.toHaveAttribute('aria-current');
    expect(within(nav).queryByRole('banner')).toBeNull();
    rerender(
      <TopBar label='Main' items={[]}>
        {brand}
      </TopBar>
    );
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
  });
  it('renders the v0.3 full-height link finish with a 44.8px minimum target', () => {
    const { rerender } = render(
      <TopBar label='Main' items={[{ ...home, 'aria-current': 'page' }, about]}>
        {brand}
      </TopBar>
    );
    const links = within(screen.getByRole('navigation')).getAllByRole('link');
    expect(links.filter((link) => link.getAttribute('aria-current') === 'page')).toEqual([links[0]]);
    for (const link of links) {
      expect(link).toHaveClass(
        'relative',
        'inline-flex',
        'items-center',
        'h-full',
        'min-h-14',
        'font-sans',
        'text-body-large',
        'text-fg-secondary',
        'after:absolute',
        'after:-bottom-px',
        'after:h-[calc(var(--space-1)*0.625)]',
        'after:w-full',
        'after:bg-transparent',
        'after:transition-colors',
        'motion-reduce:after:transition-none',
        'aria-[current=page]:after:bg-bg-flood',
        'aria-[current=page]:font-[var(--text-label-default--font-weight)]',
        'aria-[current=page]:text-fg-default',
        'hover:text-fg-default',
        'no-underline',
        'focus-visible:outline-2',
        'focus-visible:outline-focus-ring'
      );
      for (const removed of [
        'after:rounded-full',
        'after:inset-x-3',
        'aria-[current=page]:after:shadow-glow-base',
        'aria-[current=page]:underline'
      ]) {
        expect(link).not.toHaveClass(removed);
      }
      expect(link.parentElement).toHaveClass('h-full');
    }
    expect(screen.getByRole('navigation')).toHaveClass('h-full');
    expect(screen.getByRole('list')).toHaveClass('h-full', 'gap-8');
    rerender(
      <TopBar label='Main' items={[home, about]}>
        {brand}
      </TopBar>
    );
    expect(within(screen.getByRole('navigation')).queryByRole('link', { current: 'page' })).toBeNull();
  });
  it('A5 preserves native navigation order, tab stops and arrow-key behavior', async () => {
    const user = userEvent.setup();
    render(
      <TopBar label='Main' items={[home, about]}>
        {brand}
      </TopBar>
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    const links = within(nav).getAllByRole('link');
    expect(links.map((link) => [link.textContent, link.getAttribute('href')])).toEqual([
      ['Home', '#home'],
      ['About', '#about']
    ]);
    expect(within(nav).queryByRole('tab')).toBeNull();
    expect(within(nav).queryByRole('menu')).toBeNull();
    for (const link of links) {
      expect(link).not.toHaveAttribute('aria-selected');
      expect(link).not.toHaveAttribute('tabindex');
    }
    await user.tab();
    expect(screen.getByRole('link', { name: 'Brand' })).toHaveFocus();
    await user.tab();
    expect(links[0]).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(links[0]).toHaveFocus();
    await user.tab();
    expect(links[1]).toHaveFocus();
  });
  it('TB-02 preserves native links and forwards click events without changing focus', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((_item, event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const { rerender } = render(
      <TopBar label='Main' items={[home, about]} onNavigate={onNavigate}>
        {brand}
      </TopBar>
    );
    const link = screen.getByRole('link', { name: 'Home' });
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(false);
    expect(onNavigate.mock.calls[0]?.[0]).toBe(home);
    expect(onNavigate.mock.calls[0]?.[1].ctrlKey).toBe(true);
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
    link.focus();
    await user.keyboard('{Enter}');
    expect(onNavigate).toHaveBeenCalledTimes(2);
    rerender(
      <TopBar label='Main' items={[home, { ...about, 'aria-current': 'page' }]} onNavigate={onNavigate}>
        {brand}
      </TopBar>
    );
    expect(link).toHaveFocus();
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('aria-current', 'page');
  });
  it('TB-03 preserves the explicit glass state and treatment without a scroll listener', () => {
    const spy = vi.spyOn(window, 'addEventListener');
    const { rerender } = render(
      <TopBar label='Main' items={[]} data-state='transparent'>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('data-state', 'transparent');
    expect(header).toHaveClass(
      'data-[state=glass]:bg-surface-overlay',
      'data-[state=glass]:border-border-hairline-strong',
      'data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]'
    );
    expect(header.className).toContain('prefers-reduced-transparency:reduce');
    expect(header).toHaveClass('motion-reduce:transition-none');
    rerender(
      <TopBar label='Main' items={[]} data-state='glass'>
        {brand}
      </TopBar>
    );
    expect(header).toHaveAttribute('data-state', 'glass');
    expect(spy.mock.calls.filter(([name]) => name === 'scroll')).toHaveLength(0);
    spy.mockRestore();
  });
  it('TB-04 composes supplied controls and leaves absent parts out', () => {
    const { rerender } = render(
      <TopBar label='Main' items={[home]}>
        {brand}
        <TopBarSearchFull>
          <button>Full search</button>
        </TopBarSearchFull>
        <TopBarSearchCompact>
          <button>Compact search</button>
        </TopBarSearchCompact>
        <TopBarUserMenu>
          <button>Account</button>
        </TopBarUserMenu>
        <TopBarMobileTrigger>
          <button>Menu</button>
        </TopBarMobileTrigger>
      </TopBar>
    );
    const header = screen.getByRole('banner');
    expect(Array.from(header.querySelectorAll('a,button')).map((el) => el.textContent)).toEqual([
      'Brand',
      'Home',
      'Full search',
      'Compact search',
      'Account',
      'Menu'
    ]);
    rerender(
      <TopBar label='Main' items={[]}>
        {brand}
      </TopBar>
    );
    expect(header.querySelectorAll('button')).toHaveLength(0);
  });
  it('TB-05 gives desktop and compact branches exclusive and equality container variants', () => {
    render(
      <TopBar label='Main' items={[home]}>
        {brand}
        <TopBarSearchFull>
          <button>Full</button>
        </TopBarSearchFull>
        <TopBarSearchCompact>
          <button>Compact</button>
        </TopBarSearchCompact>
        <TopBarMobileTrigger>
          <button>Menu</button>
        </TopBarMobileTrigger>
      </TopBar>
    );
    for (const el of [screen.getByRole('navigation'), screen.getByText('Full').parentElement]) {
      expect(el).toHaveClass('@max-[900px]:hidden', '[@container_(width=900px)]:hidden');
    }
    for (const el of [screen.getByText('Compact').parentElement, screen.getByText('Menu').parentElement]) {
      expect(el).toHaveClass('hidden', '@max-[900px]:block', '[@container_(width=900px)]:block');
    }
  });
  it('accepts non-link brand content without a composition warning', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <TopBar label='Main' items={[]}>
        <TopBarBrand>Product identity</TopBarBrand>
      </TopBar>
    );
    expect(screen.getByText('Product identity')).toBeInTheDocument();
    expect(warn).not.toHaveBeenCalled();
  });

  it('places an arbitrary end slot after both search branches and before the user and mobile parts', () => {
    render(
      <TopBar label='Main' items={[home]}>
        <TopBarMobileTrigger>
          <button>Menu</button>
        </TopBarMobileTrigger>
        <TopBarUserMenu>
          <button>Account</button>
        </TopBarUserMenu>
        <TopBarEnd>
          Online <span>Ready</span>
        </TopBarEnd>
        <TopBarSearchCompact>
          <button>Compact</button>
        </TopBarSearchCompact>
        <TopBarSearchFull>
          <button>Full</button>
        </TopBarSearchFull>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    const end = screen.getByText('Ready').parentElement;
    expect(end).toHaveTextContent('Online Ready');
    expect(Array.from(header.querySelectorAll('a,button,span')).map((node) => node.textContent)).toEqual([
      'Brand',
      'Home',
      'Full',
      'Compact',
      'Ready',
      'Account',
      'Menu'
    ]);
    for (const hidden of ['hidden', '@max-[900px]:hidden', '[@container_(width=900px)]:hidden']) {
      expect(end).not.toHaveClass(hidden);
    }
    expect(screen.getByText('Full').parentElement).toHaveClass('@max-[900px]:hidden');
    expect(screen.getByText('Compact').parentElement).toHaveClass('hidden', '@max-[900px]:block');
  });

  it('accepts empty and fragment end content and keeps only the first end part', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { rerender } = render(
      <TopBar label='Main' items={[]}>
        {brand}
        <TopBarEnd>{null}</TopBarEnd>
      </TopBar>
    );
    expect(screen.getByRole('banner').querySelectorAll('nav + div')).toHaveLength(1);
    rerender(
      <TopBar label='Main' items={[]}>
        {brand}
        <TopBarEnd>
          <>
            First <span>fragment</span>
          </>
        </TopBarEnd>
        <TopBarEnd>Second</TopBarEnd>
      </TopBar>
    );
    expect(screen.getByText('fragment')).toBeInTheDocument();
    expect(screen.queryByText('Second')).toBeNull();
    expect(warn).toHaveBeenCalledWith('TopBar received a duplicate end part.');
  });

  it('uses transparent backing by default and composes the solid Surface backing only when requested', () => {
    const { rerender } = render(
      <TopBar label='Main' items={[]}>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-transparent', 'bg-none');
    expect(header).not.toHaveClass('bg-surface-1');
    expect(header).not.toHaveClass('bg-[image:var(--gradient-sheen)]');
    rerender(
      <TopBar label='Main' items={[]} initialBackground='transparent'>
        {brand}
      </TopBar>
    );
    expect(header).toHaveClass('bg-transparent', 'bg-none');
    rerender(
      <TopBar label='Main' items={[]} initialBackground='solid'>
        {brand}
      </TopBar>
    );
    expect(header).toHaveClass(
      'eg-surface',
      'bg-surface-1',
      'bg-[image:var(--gradient-sheen)]',
      'shadow-edge',
      'border-b'
    );
    expect(header).toHaveClass(
      'data-[state=glass]:bg-none',
      'data-[state=transparent]:bg-transparent',
      'data-[state=transparent]:bg-none'
    );
  });

  it('constrains the row by default or allows full width while retaining gutters and full-bleed root', () => {
    const { rerender } = render(
      <TopBar label='Main' items={[]}>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    const row = screen.getByRole('navigation').parentElement;
    expect(header).toHaveClass('w-full', 'inset-x-0');
    expect(row).toHaveClass('w-full', 'mx-auto', 'max-w-[var(--content-max)]', 'px-[var(--gutter)]');
    rerender(
      <TopBar label='Main' items={[]} contentWidth='content'>
        {brand}
      </TopBar>
    );
    expect(row).toHaveClass('max-w-[var(--content-max)]', 'px-[var(--gutter)]');
    rerender(
      <TopBar label='Main' items={[]} contentWidth='full'>
        {brand}
      </TopBar>
    );
    expect(row).toHaveClass('w-full', 'px-[var(--gutter)]');
    expect(row).not.toHaveClass('max-w-[var(--content-max)]');
    expect(header).toHaveClass('w-full', 'inset-x-0');
  });

  it('samples scroll in one passive rAF, restores the backing at the top, and cleans up', () => {
    const driver = scrollDriver();
    const add = vi.spyOn(window, 'addEventListener');
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(
      <TopBar label='Main' items={[]} initialBackground='solid'>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    expect(header).not.toHaveAttribute('data-state');
    expect(
      add.mock.calls.some(
        ([type, , options]) => type === 'scroll' && typeof options === 'object' && options?.passive === true
      )
    ).toBe(true);
    driver.move(1);
    driver.move(20);
    expect(driver.pending()).toBe(1);
    expect(driver.request).toHaveBeenCalledTimes(1);
    expect(header).not.toHaveAttribute('data-state');
    driver.flush();
    expect(header).toHaveAttribute('data-state', 'glass');
    driver.move(0);
    driver.flush();
    expect(header).not.toHaveAttribute('data-state');
    driver.move(5);
    unmount();
    expect(driver.cancel).toHaveBeenCalledTimes(1);
    expect(driver.pending()).toBe(0);
    expect(remove.mock.calls.some(([type]) => type === 'scroll')).toBe(true);
  });

  it.each(['transparent', 'glass'] as const)(
    'host state %s wins at both scroll positions and removal resynchronizes',
    (state) => {
      const driver = scrollDriver();
      const add = vi.spyOn(window, 'addEventListener');
      const { rerender } = render(
        <TopBar label='Main' items={[]} initialBackground='solid' data-state={state}>
          {brand}
        </TopBar>
      );
      const header = screen.getByRole('banner');
      expect(header).toHaveAttribute('data-state', state);
      driver.move(10);
      expect(header).toHaveAttribute('data-state', state);
      driver.move(0);
      expect(header).toHaveAttribute('data-state', state);
      driver.move(10);
      expect(driver.pending()).toBe(0);
      expect(add.mock.calls.filter(([type]) => type === 'scroll')).toHaveLength(0);
      rerender(
        <TopBar label='Main' items={[]} initialBackground='solid'>
          {brand}
        </TopBar>
      );
      expect(header).toHaveAttribute('data-state', 'glass');
      driver.move(0);
      driver.flush();
      expect(header).not.toHaveAttribute('data-state');
      driver.move(5);
      expect(driver.pending()).toBe(1);
      rerender(
        <TopBar label='Main' items={[]} initialBackground='solid' data-state={state}>
          {brand}
        </TopBar>
      );
      expect(header).toHaveAttribute('data-state', state);
      expect(driver.pending()).toBe(0);
      expect(driver.cancel).toHaveBeenCalled();
    }
  );

  it('keeps a supplied Dialog in control of opening, Escape and the host-selected header state', async () => {
    const user = userEvent.setup();
    render(
      <Dialog>
        <TopBar label='Main' items={[]} data-state='transparent'>
          {brand}
          <TopBarMobileTrigger>
            <DialogTrigger asChild={true}>
              <button type='button'>Menu</button>
            </DialogTrigger>
          </TopBarMobileTrigger>
        </TopBar>
        <DialogContent title='Mobile navigation'>Destinations</DialogContent>
      </Dialog>
    );
    await user.click(screen.getByRole('button', { name: 'Menu' }));
    expect(screen.getByRole('dialog', { name: 'Mobile navigation' })).toBeInTheDocument();
    expect(document.querySelector('header')).toHaveAttribute('data-state', 'transparent');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('renders unscrolled on the server and first client render, then synchronizes an already-scrolled window', () => {
    scrollDriver(12);
    let firstClientState: string | null | undefined;
    function Probe() {
      useLayoutEffect(() => {
        firstClientState = document.querySelector('header')?.getAttribute('data-state');
      }, []);
      return <span>Identity</span>;
    }
    const view = (
      <TopBar label='Main' items={[]}>
        <TopBarBrand>
          <Probe />
        </TopBarBrand>
      </TopBar>
    );
    expect(renderToString(view)).not.toContain('data-state="glass"');
    render(view);
    expect(firstClientState).toBeNull();
    expect(screen.getByRole('banner')).toHaveAttribute('data-state', 'glass');
  });

  it('TB-07 and TB-08 keep root fixed and container internal without legacy markers', () => {
    render(
      <TopBar label='Main' items={[home]} className='z-50'>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('eg-topbar', 'fixed', 'z-50', '[container-type:normal]', '[container-name:none]');
    expect(header).not.toHaveClass('@container');
    expect(header.querySelector('.\\@container')).not.toBeNull();
    expect(header.innerHTML).not.toMatch(/eg-topbar__|is-scrolled|is-open/);
    expect(header.className).not.toMatch(/is-scrolled|is-open/);
  });
});
