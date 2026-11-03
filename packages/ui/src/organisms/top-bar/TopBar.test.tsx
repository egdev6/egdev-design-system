import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
export type TypeNegatives = [InvalidPart, InvalidRole, InvalidCurrent];

const home: TopBarItem = { id: 'home', label: 'Home', href: '#home' };
const about: TopBarItem = { id: 'about', label: 'About', href: '#about' };
const brand = (
  <TopBarBrand>
    <a href='/'>Brand</a>
  </TopBarBrand>
);

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
  it('TB-03 exposes host state and glass treatment without scroll listeners', () => {
    const spy = vi.spyOn(window, 'addEventListener');
    const { rerender } = render(
      <TopBar label='Main' items={[]}>
        {brand}
      </TopBar>
    );
    const header = screen.getByRole('banner');
    expect(header).not.toHaveAttribute('data-state');
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
