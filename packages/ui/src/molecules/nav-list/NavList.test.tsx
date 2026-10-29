import { fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { NavListCollapsibleGroup, NavListEntry, NavListLink } from '../nav-list';
import { NavList } from '../nav-list';
import { useNavList } from '../nav-list/useNavList';

const home: NavListLink = { id: 'home', label: 'Home', href: '#home', icon: 'compass' };
const group = (overrides: Partial<NavListCollapsibleGroup> = {}): NavListCollapsibleGroup => ({
  kind: 'collapsible-group',
  id: 'content',
  label: 'Content',
  items: [{ id: 'drafts', label: 'Drafts', href: '#drafts' }],
  ...overrides
});

describe('NavList public contract v0.2', () => {
  it('renders a named landmark, native lists and ordered anchors without menu semantics', () => {
    render(<NavList label='Workspace' items={[home, { id: 'settings', label: 'Settings', href: '#settings' }]} />);
    const nav = screen.getByRole('navigation', { name: 'Workspace' });
    expect(nav).toHaveClass('eg-nav-list');
    expect(
      within(nav)
        .getAllByRole('link')
        .map((link) => link.textContent)
    ).toEqual(['Home', 'Settings']);
    expect(within(nav).getByRole('list').tagName).toBe('UL');
    expect(nav.querySelector('[role]')).toBeNull();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '#home');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('composes Surface only for the explicitly current anchor and clears it on update', () => {
    const { rerender } = render(<NavList label='Workspace' items={[{ ...home, 'aria-current': 'page' }]} />);
    const link = screen.getByRole('link', { name: 'Home' });
    expect(link).toHaveAttribute('aria-current', 'page');
    expect(link).toHaveClass(
      'eg-surface',
      'bg-surface-3',
      'border-border-hairline',
      'shadow-[var(--shadow-edge),var(--shadow-elev-1)]',
      'bg-[image:var(--gradient-sheen)]',
      'px-3',
      'py-1.5'
    );
    expect(screen.getByRole('navigation')).not.toHaveClass('eg-surface');
    expect(link).not.toHaveAttribute('aria-selected');
    rerender(<NavList label='Workspace' items={[home]} />);
    expect(link).not.toHaveAttribute('aria-current');
    expect(link).not.toHaveClass('eg-surface', 'bg-surface-3');
  });

  it('names static lists with unique generated caption ids, not data ids', () => {
    const entries: NavListEntry[] = [{ kind: 'group', id: 'public-id', label: 'Tools', items: [home] }];
    render(
      <>
        <NavList label='One' items={entries} />
        <NavList label='Two' items={entries} />
      </>
    );
    const lists = screen.getAllByRole('list', { name: 'Tools' });
    const ids = lists.map((list) => list.getAttribute('aria-labelledby'));
    expect(new Set(ids).size).toBe(2);
    expect(ids).not.toContain('public-id');
    for (const id of ids) {
      expect(document.getElementById(id ?? '')).toHaveTextContent('Tools');
    }
  });

  it('uses independent native Radix disclosures, retains signals/counts and trigger focus', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <NavList
        label='Workspace'
        items={[
          group({ count: 0, signal: { state: 'live', text: 'Voting live' }, onOpenChange }),
          group({ id: 'other', label: 'Other', items: [{ ...home, id: 'other-home' }] })
        ]}
      />
    );
    const trigger = screen.getByRole('button', { name: /Content\s*Voting live\s*0/ });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Drafts' })).not.toBeInTheDocument();
    await user.click(trigger);
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    const content = document.getElementById(trigger.getAttribute('aria-controls') ?? '');
    expect(content).toContainElement(screen.getByRole('link', { name: 'Drafts' }));
    expect(screen.getByRole('button', { name: 'Other' })).toHaveAttribute('aria-expanded', 'false');
    await user.keyboard(' ');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAccessibleName(/Content\s*Voting live\s*0/);
    expect(screen.queryByRole('link', { name: 'Drafts' })).not.toBeInTheDocument();
    await user.keyboard('{Enter}');
    expect(onOpenChange.mock.calls.map(([open]) => open)).toEqual([true, false, true]);
  });

  it('keeps Radix content relationships unique across independently mounted lists', () => {
    render(
      <>
        <NavList label='One' items={[group({ defaultOpen: true })]} />
        <NavList label='Two' items={[group({ defaultOpen: true })]} />
      </>
    );
    const triggers = screen.getAllByRole('button', { name: 'Content' });
    const controls = triggers.map((trigger) => trigger.getAttribute('aria-controls'));
    expect(new Set(controls).size).toBe(2);
    for (const id of controls) {
      expect(document.getElementById(id ?? '')?.querySelector('a')).toHaveTextContent('Drafts');
    }
  });

  it('requests controlled changes without updating and does not echo incoming changes', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <NavList label='Workspace' items={[group({ open: false, defaultOpen: true, onOpenChange })]} />
    );
    const trigger = screen.getByRole('button', { name: 'Content' });
    await user.click(trigger);
    expect(onOpenChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    rerender(<NavList label='Workspace' items={[group({ open: true, onOpenChange })]} />);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(onOpenChange).toHaveBeenCalledTimes(1);
  });

  it('initializes defaultOpen once and preserves independent uncontrolled state on reorder', async () => {
    const user = userEvent.setup();
    const first = group({ defaultOpen: true });
    const second = group({ id: 'second', label: 'Second', items: [] });
    const { rerender } = render(<NavList label='Workspace' items={[first, second]} />);
    await user.click(screen.getByRole('button', { name: 'Second' }));
    rerender(<NavList label='Workspace' items={[second, { ...first, defaultOpen: false }]} />);
    expect(screen.getByRole('button', { name: 'Second' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('button', { name: 'Content' })).toHaveAttribute('aria-expanded', 'true');
  });

  it('does not reveal or mirror a current destination inside a collapsed group', () => {
    render(<NavList label='Workspace' items={[group({ items: [{ ...home, 'aria-current': 'page' }] })]} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('button')).not.toHaveClass('eg-surface');
  });

  it('keeps native Tab order, skips closed links and adds no arrow/Escape model', async () => {
    const user = userEvent.setup();
    render(<NavList label='Workspace' items={[home, group(), { ...home, id: 'last', label: 'Last' }]} />);
    await user.tab();
    expect(screen.getByRole('link', { name: 'Home' })).toHaveFocus();
    await user.tab();
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}{Escape}');
    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.tab();
    expect(screen.getByRole('link', { name: 'Last' })).toHaveFocus();
    await user.tab({ shift: true });
    await user.keyboard('{Enter}');
    await user.tab();
    expect(screen.getByRole('link', { name: 'Drafts' })).toHaveFocus();
  });

  it('passes original entries and cancellable React events without intercepting modifiers or auxclick', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn((_item, event) => {
      if (!event.ctrlKey) {
        event.preventDefault();
      }
    });
    render(<NavList label='Workspace' items={[home]} onNavigate={onNavigate} />);
    const link = screen.getByRole('link');
    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate.mock.calls[0]?.[0]).toBe(home);
    expect(onNavigate.mock.calls[0]?.[1].defaultPrevented).toBe(true);
    expect(fireEvent.click(link, { ctrlKey: true })).toBe(true);
    fireEvent(link, new MouseEvent('auxclick', { bubbles: true, button: 1 }));
    expect(onNavigate).toHaveBeenCalledTimes(2);
    link.focus();
    await user.keyboard('{Enter}');
    expect(onNavigate).toHaveBeenCalledTimes(3);
  });

  it.each([-1, 0.5, NaN, Infinity, -Infinity])('omits invalid count %s, without clamping', (count) => {
    render(<NavList label='Workspace' items={[{ ...home, count }, group({ count })]} />);
    expect(screen.getByRole('link')).toHaveAccessibleName('Home');
    expect(screen.getByRole('button')).toHaveAccessibleName('Content');
  });

  it('retains raw zero/integer counters and never computes group totals', () => {
    render(
      <NavList
        label='Workspace'
        items={[
          { ...home, count: 0 },
          group({ count: 1200, defaultOpen: true, items: [{ ...home, id: 'child', label: 'Child', count: 2 }] })
        ]}
      />
    );
    expect(screen.getByRole('link', { name: /Home\s*0/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Content\s*1200/ })).toBeInTheDocument();
    expect(screen.getByText('1200')).toHaveClass('tabular-nums', 'text-label-default');
  });

  it('composes unmodified Badge and StatusDot with readable warning/signal equivalents', () => {
    const { container } = render(
      <NavList
        label='Workspace'
        items={[
          { ...home, tag: { children: 'New', tone: 'brand' }, warning: 'Needs attention' },
          group({ signal: { state: 'standby', text: 'Waiting for votes' } })
        ]}
      />
    );
    expect(screen.getByRole('link', { name: /Home\s*New\s*Needs attention/ })).toBeInTheDocument();
    expect(screen.getByText('New')).toHaveClass('eg-badge', 'rounded-full', 'py-1.5');
    expect(screen.getByRole('button', { name: /Content\s*Waiting for votes/ })).toBeInTheDocument();
    expect(container.querySelector('.eg-status-dot')).toHaveAttribute('data-state', 'standby');
    expect(container.querySelector('.eg-status-dot')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('omits blank optional decorations and uses neutral Badge tone when absent', () => {
    const { rerender, container } = render(
      <NavList
        label='Workspace'
        items={[{ ...home, tag: { children: ' \n ' }, warning: ' ' }, group({ signal: { state: 'live', text: '\t' } })]}
      />
    );
    expect(screen.getByRole('link')).toHaveAccessibleName('Home');
    expect(screen.getByRole('button')).toHaveAccessibleName('Content');
    expect(container.querySelector('.eg-badge, .eg-status-dot')).toBeNull();
    rerender(<NavList label='Workspace' items={[{ ...home, tag: { children: 'Beta' } }]} />);
    expect(screen.getByText('Beta')).toHaveClass('text-fg-secondary');
  });

  it('renders empty lists and empty static/disclosure groups without fabricated text', async () => {
    const { rerender } = render(<NavList label='Workspace' items={[]} />);
    expect(screen.getByRole('list')).toBeEmptyDOMElement();
    rerender(
      <NavList
        label='Workspace'
        items={[{ kind: 'group', id: 'empty', label: 'Empty', items: [] }, group({ items: [] })]}
      />
    );
    expect(screen.getByRole('list', { name: 'Empty' })).toBeEmptyDOMElement();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('forwards compatible native props and merges supported outer width conflicts last', () => {
    const { rerender } = render(
      <NavList
        label='Workspace'
        items={[home]}
        id='workspace'
        title='Destinations'
        data-owner='app'
        className='w-4 w-full mt-4'
      />
    );
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('id', 'workspace');
    expect(nav).toHaveAttribute('data-owner', 'app');
    expect(nav).toHaveClass('eg-nav-list', 'w-full', 'mt-4');
    expect(nav).not.toHaveClass('w-4');
    const injected = {
      role: 'menu',
      'aria-label': 'Wrong',
      'aria-labelledby': 'wrong',
      children: 'Injected',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' }
    } as unknown as Record<string, never>;
    rerender(<NavList {...injected} label='Workspace' items={[home]} />);
    expect(screen.getByRole('navigation', { name: 'Workspace' })).toBeInTheDocument();
    expect(screen.queryByText('Injected')).not.toBeInTheDocument();
  });

  it('keeps 44px targets, label-only truncation, focus tokens and reduced-motion recipes', () => {
    render(<NavList label='Workspace' items={[home, group()]} />);
    const link = screen.getByRole('link');
    expect(link).toHaveClass(
      'min-h-11',
      'motion-reduce:transition-none',
      'focus-visible:outline-[var(--color-focus-ring-inverse)]'
    );
    expect(screen.getByText('Home')).toHaveClass('truncate', 'min-w-0');
    expect(link).not.toHaveClass('truncate');
    const trigger = screen.getByRole('button');
    expect(trigger).toHaveClass('min-h-11', 'focus-visible:shadow-focus');
    expect(trigger.querySelector('svg')).toHaveClass('motion-reduce:transform-none', 'motion-reduce:transition-none');
  });

  it('derives normalization, callbacks and per-part classes in the hook', () => {
    const { result } = renderHook(() =>
      useNavList({ label: 'Workspace', items: [{ ...home, count: NaN, warning: ' ' }] })
    );
    expect(result.current.rootProps['aria-label']).toBe('Workspace');
    expect(result.current.entries[0]).toMatchObject({ id: 'home', count: undefined, warning: undefined });
    expect(result.current.listClassName).toContain('list-none');
  });
});
