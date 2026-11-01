import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TabBar } from './TabBar';
import type { TabBarItem, TabBarProps } from './types';

type Assert<T extends true> = T;
// @ts-expect-error Unknown glyphs are not part of the IconName union.
type InvalidIcon = Assert<'not-a-glyph' extends TabBarItem['icon'] ? true : false>;
// @ts-expect-error A navigation label and items are required.
type InvalidProps = Assert<object extends TabBarProps ? true : false>;
// @ts-expect-error Current state is restricted to the native page value.
type InvalidCurrent = Assert<'step' extends TabBarItem['aria-current'] ? true : false>;
export type TypeNegatives = [InvalidIcon, InvalidProps, InvalidCurrent];

const home: TabBarItem = { id: 'home', label: 'Home', href: '#home', icon: 'compass' };

describe('TabBar', () => {
  it('renders named navigation, native list and current links with decorative icons', () => {
    render(
      <TabBar
        label='Main'
        items={[
          { ...home, 'aria-current': 'page' },
          { ...home, id: 'inbox', label: 'Inbox' }
        ]}
      />
    );
    const nav = screen.getByRole('navigation', { name: 'Main' });
    expect(within(nav).getByRole('list')).toBeInTheDocument();
    const links = within(nav).getAllByRole('link');
    expect(links[0]).toHaveAccessibleName('Home');
    expect(links[0]).toHaveAttribute('aria-current', 'page');
    expect(links[1]).not.toHaveAttribute('aria-current');
    expect(within(nav).queryByRole('img')).toBeNull();
    expect(nav.querySelector('[role]')).toBeNull();
  });
  it.each([
    [1, '1'],
    [99, '99'],
    [100, '99+'],
    [250, '99+'],
    [Number.MAX_SAFE_INTEGER + 1, '99+']
  ])('announces count %s and displays %s', (count, visual) => {
    render(<TabBar label='Main' items={[{ ...home, count }]} />);
    expect(screen.getByRole('link')).toHaveAccessibleName(`Home, ${count} pending`);
    expect(screen.getByText(visual)).toHaveAttribute('aria-hidden', 'true');
  });
  it.each([0, -1, 0.5, NaN, Infinity, -Infinity])('omits invalid count %s', (count) => {
    render(<TabBar label='Main' items={[{ ...home, count }]} />);
    expect(screen.getByRole('link')).toHaveAccessibleName('Home');
    expect(document.querySelector('.eg-badge')).toBeNull();
  });
  it('localizes count and forwards root attributes, safe-area and layout classes', () => {
    render(
      <TabBar
        label='Main'
        items={[{ ...home, count: 250 }]}
        messages={{ pendingCount: (count) => `${count} waiting` }}
        id='nav'
        data-owner='app'
        className='w-4 mt-4'
      />
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('id', 'nav');
    expect(nav).toHaveAttribute('data-owner', 'app');
    expect(nav).toHaveClass('eg-tabbar', 'w-4', 'mt-4', 'pb-[max(var(--space-5),env(safe-area-inset-bottom))]');
    expect(nav).not.toHaveClass('w-full');
    expect(screen.getByRole('link')).toHaveAccessibleName('Home, 250 waiting');
  });
  it('passes original item and cancellable event and does not intercept auxclick', () => {
    const onNavigate = vi.fn((_item, event) => event.preventDefault());
    render(<TabBar label='Main' items={[home]} onNavigate={onNavigate} />);
    const link = screen.getByRole('link');
    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate.mock.calls[0]?.[0]).toBe(home);
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });
  it('retains the Button md touch-target utility', () => {
    render(<TabBar label='Main' items={[home]} />);
    expect(screen.getByRole('link')).toHaveClass('min-h-12');
  });
  it('keeps native Tab and Shift+Tab order without roving focus', async () => {
    const user = userEvent.setup();
    render(<TabBar label='Main' items={[home, { ...home, id: 'second', label: 'Second' }]} />);
    const [first, second] = screen.getAllByRole('link');
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowRight}{Escape}');
    expect(first).toHaveFocus();
    await user.tab();
    expect(second).toHaveFocus();
    await user.tab({ shift: true });
    expect(first).toHaveFocus();
  });
  it('moves current state on rerender without navigation or focus changes', () => {
    const onNavigate = vi.fn();
    const second = { ...home, id: 'second', label: 'Second' };
    const { rerender } = render(
      <TabBar label='Main' items={[{ ...home, 'aria-current': 'page' }, second]} onNavigate={onNavigate} />
    );
    const [first, last] = screen.getAllByRole('link');
    first?.focus();
    rerender(<TabBar label='Main' items={[home, { ...second, 'aria-current': 'page' }]} onNavigate={onNavigate} />);
    expect(first).not.toHaveAttribute('aria-current');
    expect(last).toHaveAttribute('aria-current', 'page');
    expect(first).toHaveFocus();
    expect(onNavigate).not.toHaveBeenCalled();
  });
  it('renders empty lists', () => {
    render(<TabBar label='Main' items={[]} />);
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
  });
});
