import { fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { MouseEvent } from 'react';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Avatar } from '../../atoms/avatar';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { MenuEntry, MenuLinkItem, MenuProps, MenuSubmenuItem } from './index';
import { Menu } from './index';
import { accountMenuRecipeVariants } from './types';
import { useMenu } from './useMenu';

const entries: MenuEntry[] = [
  { kind: 'label', id: 'group', label: 'Actions' },
  { id: 'edit', label: 'Edit', icon: 'pencil', shortcut: '⌘E' },
  { id: 'disabled', label: 'Unavailable', disabled: true },
  { kind: 'separator', id: 'separator' },
  { kind: 'link', id: 'docs', label: 'Documentation', href: '#docs' },
  { id: 'delete', label: 'Delete', tone: 'danger', icon: 'trash' }
];
const trigger = <Button>Actions menu</Button>;

async function openWithKeyboard(key = '{ArrowDown}') {
  const user = userEvent.setup();
  screen.getByRole('button', { name: 'Actions menu' }).focus();
  await user.keyboard(key);
  await screen.findByRole('menu', { name: 'Actions menu' });
  return user;
}

describe('Menu public contract v0.1 + A1 + A2', () => {
  it('opens a labelled portal from a composed trigger and restores focus on Escape', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const { container } = render(
      <Menu items={entries}>
        <Button ref={ref}>Actions menu</Button>
      </Menu>
    );
    const button = screen.getByRole('button', { name: 'Actions menu' });
    expect(ref.current).toBe(button);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await user.click(button);
    const menu = await screen.findByRole('menu', { name: 'Actions menu' });
    expect(container).not.toContainElement(menu);
    expect(document.body).toContainElement(menu);
    expect(button).toHaveAttribute('aria-controls', menu.id);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(menu).toHaveAttribute('data-side', 'bottom');
    expect(menu).toHaveAttribute('data-align', 'start');
    expect(menu).toHaveClass('eg-menu', 'eg-surface', 'p-2');
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(button).toHaveFocus();
  });

  it.each(['{Enter}', ' ', '{ArrowDown}'])('uses native Radix opening with %s', async (key) => {
    render(<Menu items={entries}>{trigger}</Menu>);
    await openWithKeyboard(key);
    expect(screen.getByRole('menuitem', { name: 'Edit⌘E' })).toHaveFocus();
  });

  it('leaves ArrowUp on a closed trigger inert (A1)', async () => {
    const change = vi.fn();
    render(
      <Menu items={entries} onOpenChange={change}>
        {trigger}
      </Menu>
    );
    const user = userEvent.setup();
    screen.getByRole('button', { name: 'Actions menu' }).focus();
    await user.keyboard('{ArrowUp}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
  });

  it('skips disabled entries and non-items, loops and supports Home/End and typeahead', async () => {
    render(
      <Menu items={entries} header={<span>Account context</span>}>
        {trigger}
      </Menu>
    );
    const user = await openWithKeyboard();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Documentation' })).toHaveFocus();
    await user.keyboard('{End}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Edit⌘E' })).toHaveFocus();
    await user.keyboard('{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Home}');
    expect(screen.getByRole('menuitem', { name: 'Edit⌘E' })).toHaveFocus();
    await user.keyboard('d');
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Documentation' })).toHaveFocus());
    expect(screen.getByText('Account context')).not.toHaveAttribute('role', 'menuitem');
    expect(screen.getByText('Actions')).not.toHaveAttribute('role', 'menuitem');
  });

  it('dispatches every entry kind without leaking schema attributes and composes decorative Icon/Kbd', async () => {
    render(
      <Menu items={entries} defaultOpen={true}>
        {trigger}
      </Menu>
    );
    const menu = await screen.findByRole('menu');
    expect(
      within(menu)
        .getAllByRole('menuitem')
        .map((item) => item.textContent)
    ).toEqual(['Edit⌘E', 'Unavailable', 'Documentation', 'Delete']);
    expect(within(menu).getByRole('separator')).toBeInTheDocument();
    expect(menu.querySelector('[kind]')).toBeNull();
    const edit = screen.getByRole('menuitem', { name: 'Edit⌘E' });
    expect(edit.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(edit.querySelector('svg')).toHaveClass('eg-icon', 'size-4.5');
    expect(edit.querySelector('kbd')).toHaveClass('eg-kbd');
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveClass('text-status-danger');
  });

  it('selects an omitted-kind action and closes, while preventDefault keeps it open', async () => {
    const select = vi.fn();
    const keep = vi.fn((event: Event) => event.preventDefault());
    render(
      <Menu
        items={[
          { id: 'keep', label: 'Keep open', onSelect: keep },
          { id: 'save', label: 'Save', onSelect: select }
        ]}
      >
        {trigger}
      </Menu>
    );
    const user = await openWithKeyboard();
    await user.keyboard('{Enter}');
    expect(keep).toHaveBeenCalledOnce();
    expect(screen.getByRole('menu')).toBeInTheDocument();
    await user.keyboard('{ArrowDown}{Enter}');
    expect(select).toHaveBeenCalledOnce();
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Actions menu' })).toHaveFocus();
  });

  it.each(['keyboard', 'pointer'])('intercepts navigation but still dismisses (%s)', async (mode) => {
    const link: MenuLinkItem = { kind: 'link', id: 'docs', label: 'Documentation', href: '#docs' };
    const navigate = vi.fn((_entry: MenuLinkItem, event: MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <Menu items={[link]} onNavigate={navigate}>
        {trigger}
      </Menu>
    );
    const user = await openWithKeyboard();
    const anchor = screen.getByRole('menuitem', { name: 'Documentation' });
    expect(anchor.tagName).toBe('A');
    expect(anchor).toHaveAttribute('href', '#docs');
    if (mode === 'keyboard') {
      await user.keyboard('{Enter}');
    } else {
      await user.click(anchor);
    }
    expect(navigate).toHaveBeenCalledOnce();
    expect(navigate.mock.calls[0]?.[0]).toBe(link);
    expect(navigate.mock.calls[0]?.[1].defaultPrevented).toBe(true);
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('disabled action/link/submenu entries cannot activate; disabled anchors have no href', async () => {
    const select = vi.fn();
    const navigate = vi.fn();
    render(
      <Menu
        defaultOpen={true}
        onNavigate={navigate}
        items={[
          { id: 'action', label: 'Disabled action', disabled: true, onSelect: select },
          { kind: 'link', id: 'link', label: 'Disabled link', href: '#disabled', disabled: true },
          { kind: 'submenu', id: 'sub', label: 'Disabled submenu', disabled: true, items: [] }
        ]}
      >
        {trigger}
      </Menu>
    );
    for (const item of await screen.findAllByRole('menuitem')) {
      expect(item).toHaveAttribute('data-disabled');
      expect(item).toHaveAttribute('aria-disabled', 'true');
      expect(item).not.toHaveAttribute('href');
      fireEvent.click(item);
    }
    expect(select).not.toHaveBeenCalled();
    expect(navigate).not.toHaveBeenCalled();
    expect(screen.getAllByRole('menu')).toHaveLength(1);
  });

  it.each(['{ArrowLeft}', '{Escape}'])('uses native Radix submenu dismissal with %s (A2)', async (close) => {
    const select = vi.fn();
    render(
      <Menu
        items={[
          {
            kind: 'submenu',
            id: 'sub',
            label: 'More',
            icon: 'menu',
            items: [
              { kind: 'label', id: 'label', label: 'More actions' },
              { id: 'nested', label: 'Nested action', onSelect: select },
              { kind: 'separator', id: 'sep' },
              { kind: 'link', id: 'link', label: 'Nested link', href: '#nested' }
            ]
          }
        ]}
      >
        {trigger}
      </Menu>
    );
    const user = await openWithKeyboard();
    const subTrigger = screen.getByRole('menuitem', { name: 'More' });
    await user.keyboard('{ArrowRight}');
    const nested = await screen.findByRole('menuitem', { name: 'Nested action' });
    await waitFor(() => expect(nested).toHaveFocus());
    expect(screen.getAllByRole('menu')).toHaveLength(2);
    for (const panel of screen.getAllByRole('menu')) {
      expect(panel).toHaveClass('eg-menu', 'eg-surface', 'p-2');
    }
    expect(subTrigger).toHaveAttribute('data-state', 'open');
    await user.keyboard(close);
    await waitFor(() => expect(screen.queryByRole('menuitem', { name: 'Nested action' })).not.toBeInTheDocument());
    if (close === '{Escape}') {
      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Actions menu' })).toHaveFocus();
    } else {
      expect(subTrigger).toHaveFocus();
      await user.keyboard('{ArrowRight}{Enter}');
      expect(select).toHaveBeenCalledOnce();
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    }
  });

  it('does not echo visibility props and preserves controlled state until updated', async () => {
    const change = vi.fn();
    const { rerender } = render(
      <Menu items={entries} open={false} onOpenChange={change}>
        {trigger}
      </Menu>
    );
    expect(change).not.toHaveBeenCalled();
    const user = userEvent.setup();
    screen.getByRole('button', { name: 'Actions menu' }).focus();
    await user.keyboard('{Enter}');
    expect(change).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    rerender(
      <Menu items={entries} open={true} onOpenChange={change}>
        {trigger}
      </Menu>
    );
    await screen.findByRole('menu');
    expect(change).toHaveBeenCalledTimes(1);
    await user.keyboard('{Escape}');
    expect(change).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    rerender(
      <Menu items={entries} open={false} onOpenChange={change}>
        {trigger}
      </Menu>
    );
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
    expect(change).toHaveBeenCalledTimes(2);
  });

  it('supports an empty panel and uncontrolled initialization without echo notifications', async () => {
    const change = vi.fn();
    render(
      <Menu items={[]} defaultOpen={true} onOpenChange={change}>
        {trigger}
      </Menu>
    );
    await screen.findByRole('menu');
    expect(screen.queryAllByRole('menuitem')).toHaveLength(0);
    expect(change).not.toHaveBeenCalled();
  });

  it('composes the shared overlay recipe, layout-safe merge and constant positioning through the hook', () => {
    const { result } = renderHook(() => useMenu({ children: trigger, items: entries, className: 'min-w-80' }));
    const { contentProps } = result.current;
    expect(contentProps.side).toBe('bottom');
    expect(contentProps.align).toBe('start');
    expect(contentProps.sideOffset).toBe(8);
    expect(contentProps.loop).toBe(true);
    const classes = contentProps.className.split(' ');
    for (const name of surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' }).split(' ')) {
      if (name !== 'p-0' && name !== 'text-fg-default') {
        expect(classes).toContain(name);
      }
    }
    expect(classes).toContain('min-w-80');
    expect(classes).not.toContain('min-w-57.5');
    expect(classes).toContain('p-2');
    expect(classes).not.toContain('p-0');
    expect(classes).toContain('motion-reduce:transition-none');
    expect(result.current.subContentProps.sideOffset).toBe(4);
    expect(result.current.subContentProps.alignOffset).toBe(-8);
  });

  it('supports explicit placement, primary glyphs and danger glyph invariants', async () => {
    const { result } = renderHook(() => useMenu({ children: trigger, items: [], side: 'left', align: 'end' }));
    expect(result.current.contentProps).toMatchObject({ side: 'left', align: 'end' });
    render(
      <Menu
        defaultOpen={true}
        items={[
          { id: 'sign-in', label: 'Sign in', icon: 'user', tone: 'primary' },
          { kind: 'separator', id: 'sep' },
          { kind: 'link', id: 'delete', label: 'Delete account', href: '#delete', icon: 'trash', tone: 'danger' }
        ]}
      >
        {trigger}
      </Menu>
    );
    const primary = await screen.findByRole('menuitem', { name: 'Sign in' });
    expect(primary).toHaveClass('text-fg-default');
    expect(primary.querySelector('svg')).toHaveClass('text-fg-brand-default');
    const danger = screen.getByRole('menuitem', { name: 'Delete account' });
    expect(danger).toHaveClass('data-highlighted:bg-status-danger/10', 'data-highlighted:text-status-danger');
    expect(danger.querySelector('svg')).toHaveClass('text-status-danger');
    expect(danger.querySelector('svg')).not.toHaveClass('group-data-highlighted:text-fg-brand-default');
  });

  it('opens a submenu on pointer hover and dismisses on an outside pointer event', async () => {
    render(
      <Menu items={[{ kind: 'submenu', id: 'more', label: 'More', items: [{ id: 'copy', label: 'Copy' }] }]}>
        {trigger}
      </Menu>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Actions menu' }));
    await user.hover(await screen.findByRole('menuitem', { name: 'More' }));
    await screen.findByRole('menuitem', { name: 'Copy' });
    fireEvent.pointerDown(document.body, { button: 0, ctrlKey: false, pointerType: 'mouse' });
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('does not intercept auxiliary anchor activation or register a shortcut binding', async () => {
    const navigate = vi.fn();
    const select = vi.fn();
    render(
      <Menu
        items={[
          { kind: 'link', id: 'docs', label: 'Documentation', href: '#docs' },
          { id: 'edit', label: 'Edit', shortcut: '⌘E', onSelect: select }
        ]}
        onNavigate={navigate}
      >
        {trigger}
      </Menu>
    );
    const user = await openWithKeyboard();
    const link = screen.getByRole('menuitem', { name: 'Documentation' });
    expect(fireEvent(link, new window.MouseEvent('auxclick', { button: 1, bubbles: true, cancelable: true }))).toBe(
      true
    );
    expect(navigate).not.toHaveBeenCalled();
    expect(link).toHaveAttribute('href', '#docs');
    await user.keyboard('{Meta>}e{/Meta}');
    expect(select).not.toHaveBeenCalled();
  });

  it('rejects unsupported schema shapes and limits the public API', () => {
    expectTypeOf<MenuEntry>().toEqualTypeOf<MenuProps['items'][number]>();
    const valid: MenuEntry = { id: 'action', label: 'Action' };
    expect(valid.kind).toBeUndefined();
    // @ts-expect-error Link entries require a destination.
    const missingHref: MenuEntry = { kind: 'link', id: 'link', label: 'Link' };
    // @ts-expect-error The former entry type discriminator is unsupported.
    const oldType: MenuEntry = { type: 'item', id: 'old', label: 'Old' };
    // @ts-expect-error Submenu children cannot contain another submenu.
    const deep: MenuSubmenuItem['items'][number] = { kind: 'submenu', id: 'deep', label: 'Deep', items: [] };
    // @ts-expect-error Menu does not forward native attributes.
    const native: MenuProps = { children: trigger, items: [], title: 'Unsupported' };
    // @ts-expect-error Menu has no public ref API.
    const ref: MenuProps = { children: trigger, items: [], ref: createRef<HTMLDivElement>() };
    void [missingHref, oldType, deep, native, ref];
  });
});

describe('Account menu recipe', () => {
  function accountTrigger() {
    return (
      <button type='button' aria-label='Account menu' className={cn(accountMenuRecipeVariants({ part: 'trigger' }))}>
        <Avatar size='md' />
        <Icon name='chevron-down' className={cn(accountMenuRecipeVariants({ part: 'caret' }))} />
      </button>
    );
  }

  const header = (
    <>
      <Avatar size='lg' />
      <span className={cn(accountMenuRecipeVariants({ part: 'identity' }))}>
        <span className={cn(accountMenuRecipeVariants({ part: 'name' }))}>Guest</span>
        <span className={cn(accountMenuRecipeVariants({ part: 'description' }))}>Sign in to save content</span>
      </span>
    </>
  );

  it.each(['{Enter}', ' ', '{ArrowDown}', 'pointer'])(
    'opens from a decorative-avatar native trigger with %s',
    async (key) => {
      const { container } = render(
        <div className={cn(accountMenuRecipeVariants({ part: 'wrapper' }))}>
          <Menu header={header} items={entries} side='bottom' align='end' className='min-w-62.5'>
            {accountTrigger()}
          </Menu>
        </div>
      );
      const user = userEvent.setup();
      const button = screen.getByRole('button', { name: 'Account menu' });
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-expanded', 'false');
      expect(container.querySelector('.eg-user-menu')).toBeInTheDocument();
      expect(button.querySelector('.eg-avatar')).toHaveAttribute('aria-hidden', 'true');
      expect(button.querySelector('.eg-icon')).toHaveAttribute('aria-hidden', 'true');
      expect(within(button).queryByRole('button')).not.toBeInTheDocument();
      button.focus();
      if (key === 'pointer') {
        await user.click(button);
      } else {
        await user.keyboard(key);
      }
      const menu = await screen.findByRole('menu', { name: 'Account menu' });
      expect(container).not.toContainElement(menu);
      expect(menu).toHaveClass('eg-menu', 'min-w-62.5');
      expect(menu).toHaveAttribute('data-side', 'bottom');
      expect(menu).toHaveAttribute('data-align', 'end');
      expect(button).toHaveAttribute('aria-controls', menu.id);
      expect(button).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByText('Guest')).not.toHaveAttribute('role', 'menuitem');
      expect(screen.getByText('Sign in to save content')).toBeInTheDocument();
      if (key !== 'pointer') {
        expect(screen.getByRole('menuitem', { name: 'Edit⌘E' })).toHaveFocus();
      }
      await user.keyboard('{Escape}');
      await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
      expect(button).toHaveFocus();
    }
  );

  it('keeps controlled requests separate from actual expanded state and routes app-owned entries', async () => {
    const change = vi.fn();
    const navigate = vi.fn((_entry: MenuLinkItem, event: MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    const link: MenuLinkItem = { kind: 'link', id: 'profile', label: 'Profile', href: '#profile' };
    const props = { items: [link], header, onOpenChange: change, onNavigate: navigate };
    const { rerender } = render(
      <Menu {...props} open={false}>
        {accountTrigger()}
      </Menu>
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: 'Account menu' }));
    expect(change).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole('button', { name: 'Account menu' })).toHaveAttribute('aria-expanded', 'false');
    rerender(
      <Menu {...props} open={true}>
        {accountTrigger()}
      </Menu>
    );
    await user.click(await screen.findByRole('menuitem', { name: 'Profile' }));
    expect(navigate).toHaveBeenCalledOnce();
    expect(navigate.mock.calls[0]?.[0]).toBe(link);
    expect(change).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('menu')).toBeInTheDocument();
    rerender(
      <Menu {...props} open={false}>
        {accountTrigger()}
      </Menu>
    );
    await waitFor(() => expect(screen.queryByRole('menu')).not.toBeInTheDocument());
  });

  it('retains the Surface sheen/elevation while focus and native expanded variants own trigger styling', () => {
    const classes = cn(accountMenuRecipeVariants({ part: 'trigger' })).split(' ');
    for (const token of [
      'eg-surface',
      'bg-surface-1',
      'bg-[image:var(--gradient-sheen)]',
      'shadow-[var(--shadow-edge),var(--shadow-elev-1)]',
      'rounded-full',
      'border-border-hairline-strong',
      'focus-visible:shadow-focus',
      'aria-expanded:bg-surface-2',
      'pointer-coarse:min-h-11'
    ]) {
      expect(classes).toContain(token);
    }
    expect(classes).not.toContain('border-border-hairline');
    expect(classes).not.toContain('text-fg-default');
    expect(cn(accountMenuRecipeVariants({ part: 'caret' }))).toContain('motion-safe:group-aria-expanded:rotate-180');
    expect(cn(accountMenuRecipeVariants({ part: 'caret' }))).toContain('motion-reduce:transition-none');
  });
});
