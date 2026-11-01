import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ModuleRail } from './ModuleRail';

describe('ModuleRail', () => {
  afterEach(() => {
    vi.useRealTimers();
  });
  it('renders named navigation, identity, grouped named links, current state, add and end links in order', () => {
    const add = vi.fn();
    const navigate = vi.fn();
    render(
      <ModuleRail
        label='Modules'
        product={{ name: 'Product', node: <span>Logo</span>, href: '/home' }}
        items={[
          { kind: 'separator', id: 's0' },
          { id: 'a', label: 'Alpha', href: '/a', icon: 'plus', state: 'running', 'aria-current': 'page' },
          { kind: 'separator', id: 's1' },
          { kind: 'separator', id: 's2' },
          { id: 'b', label: 'Beta', href: '/b', icon: 'plus' },
          { kind: 'separator', id: 's3' }
        ]}
        endItems={[{ id: 'end', label: 'Settings', href: '/settings', icon: 'plus' }]}
        onAdd={add}
        onNavigate={navigate}
        className='h-96'
        data-example='yes'
      />
    );
    const nav = screen.getByRole('navigation', { name: 'Modules' });
    expect(nav).toHaveClass('eg-rail', 'h-96');
    expect(nav).toHaveAttribute('data-example', 'yes');
    expect(within(nav).getAllByRole('list')).toHaveLength(3);
    const alpha = screen.getByRole('link', { name: 'Alpha, running' });
    expect(alpha).toHaveAttribute('aria-current', 'page');
    fireEvent.click(alpha);
    expect(navigate).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Add module' }));
    expect(add).toHaveBeenCalledOnce();
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.getAttribute('href'))
    ).toEqual(['/home', '/a', '/b', '/settings']);
  });

  it('reports native activation with the entry and event while routing stays native', () => {
    const navigate = vi.fn();
    render(
      <ModuleRail
        label='Modules'
        items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus' }]}
        onNavigate={navigate}
      />
    );
    const link = screen.getByRole('link', { name: 'Alpha' });
    fireEvent.click(link, { button: 0, ctrlKey: true, shiftKey: true });
    expect(navigate).toHaveBeenCalledOnce();
    const [item, event] = navigate.mock.calls[0] ?? [];
    expect(item).toMatchObject({ id: 'a', label: 'Alpha' });
    expect(event).toMatchObject({ button: 0, ctrlKey: true, shiftKey: true });
    // The callback never prevents default: unmodified primary activation keeps native navigation.
    expect(event.defaultPrevented).toBe(false);
  });

  it('reports middle-click and modified activation through the native anchor only', () => {
    const navigate = vi.fn();
    render(
      <ModuleRail
        label='Modules'
        items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus' }]}
        onNavigate={navigate}
      />
    );
    const link = screen.getByRole('link', { name: 'Alpha' });
    const event = new MouseEvent('click', { bubbles: true, cancelable: true, button: 1, ctrlKey: true });
    link.dispatchEvent(event);
    expect(navigate).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(false);
  });

  it('moves state text and dot with the supplied state', () => {
    const { rerender } = render(
      <ModuleRail label='Modules' items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus' }]} />
    );
    expect(screen.queryByText(/running/)).toBeNull();
    for (const state of ['running', 'idle', 'warning', 'error', 'stopped'] as const) {
      rerender(<ModuleRail label='Modules' items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus', state }]} />);
      const link = screen.getByRole('link', { name: `Alpha, ${state}` });
      expect(link.querySelector('.eg-status-dot')).toBeInTheDocument();
      expect(screen.queryByRole('status')).toBeNull();
      expect(link.getAttribute('aria-live')).toBeNull();
    }
    rerender(<ModuleRail label='Modules' items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus' }]} />);
    expect(screen.queryByRole('link', { name: /Alpha,/ })).toBeNull();
  });

  it('derives the tooltip side from inherited direction, including changes', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <div dir='ltr'>
        <ModuleRail label='Modules' items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus' }]} />
      </div>
    );
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', 'right');
    rerender(
      <div dir='rtl'>
        <ModuleRail label='Modules' items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus' }]} />
      </div>
    );
    await user.keyboard('{Escape}');
    await user.tab({ shift: true });
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', 'left');
    container.remove();
  });

  it('shows the tooltip on hover as well as focus', () => {
    vi.useFakeTimers();
    render(<ModuleRail label='Modules' items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus' }]} />);
    const link = screen.getByRole('link', { name: 'Alpha' });
    fireEvent.pointerMove(link, { pointerType: 'mouse' });
    expect(screen.queryByRole('tooltip')).toBeNull();
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(screen.getByRole('tooltip')).toHaveTextContent('Alpha');
    fireEvent.pointerLeave(link, { pointerType: 'mouse', clientX: 900, clientY: 700 });
    fireEvent.pointerMove(document.body, { pointerType: 'mouse', clientX: 900, clientY: 700 });
    expect(screen.queryByRole('tooltip')).toBeNull();
  });

  it('keeps the current Surface border rather than the inactive transparent border', () => {
    render(
      <ModuleRail
        label='Modules'
        items={[
          { id: 'current', label: 'Current', href: '#current', icon: 'plus', 'aria-current': 'page' },
          { id: 'other', label: 'Other', href: '#other', icon: 'plus' }
        ]}
      />
    );
    const current = screen.getByRole('link', { name: 'Current' });
    expect(current).toHaveClass('eg-surface', 'bg-surface-3', 'border-border-hairline');
    expect(current).not.toHaveClass('border-transparent');
    expect(screen.getByRole('link', { name: 'Other' })).not.toHaveAttribute('aria-current');
  });

  it('tabs through identity, main, add and end controls with native focus', async () => {
    const user = userEvent.setup();
    const add = vi.fn();
    render(
      <ModuleRail
        label='Modules'
        product={{ name: 'Product', node: 'P', href: '#home' }}
        items={[{ id: 'main', label: 'Main', href: '#main', icon: 'plus' }]}
        endItems={[{ id: 'end', label: 'End', href: '#end', icon: 'settings' }]}
        onAdd={add}
      />
    );
    for (const element of [
      screen.getByRole('link', { name: 'Product' }),
      screen.getByRole('link', { name: 'Main' }),
      screen.getByRole('button', { name: 'Add module' }),
      screen.getByRole('link', { name: 'End' })
    ]) {
      await user.tab();
      expect(element).toHaveFocus();
    }
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Add module' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(add).toHaveBeenCalledOnce();
  });

  it('shows supplementary tooltip on focus while retaining the icon link name', async () => {
    const user = userEvent.setup();
    render(<ModuleRail label='Modules' items={[{ id: 'main', label: 'Main', href: '#main', icon: 'plus' }]} />);
    const link = screen.getByRole('link', { name: 'Main' });
    await user.tab();
    expect(link).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toHaveTextContent('Main');
    expect(link).toHaveAccessibleName('Main');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(link).toHaveFocus();
  });

  it('omits empty groups and add while localizing state', () => {
    const { rerender } = render(<ModuleRail label='Modules' items={[]} />);
    expect(screen.queryByRole('list')).toBeNull();
    expect(screen.queryByRole('button')).toBeNull();
    rerender(
      <ModuleRail
        label='Modules'
        items={[{ id: 'a', label: 'Alpha', href: '/a', icon: 'plus', state: 'warning' }]}
        messages={{ states: { warning: 'Attention' } }}
      />
    );
    expect(screen.getByRole('link', { name: 'Alpha, Attention' })).toBeInTheDocument();
  });
});
