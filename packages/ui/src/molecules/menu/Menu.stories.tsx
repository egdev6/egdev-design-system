import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Avatar } from '../../atoms/avatar';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import { Menu } from './Menu';
import { accountMenuRecipeVariants, type MenuActionItem, type MenuEntry, type MenuProps } from './types';

const actions: MenuActionItem[] = [
  { id: 'edit', label: 'Edit', onSelect: action('edit') },
  { id: 'duplicate', label: 'Duplicate', onSelect: action('duplicate') }
];

/**
 * ## Description
 * A data-driven dropdown of actions or destination links, with one optional submenu level.
 *
 * ## Dependencies
 * Radix DropdownMenu owns interaction, focus, ARIA, positioning and portals. Surface supplies
 * the shared overlay recipe; Icon and Kbd render decorative glyphs and display-only shortcuts.
 *
 * ## Usage guidelines
 * Provide one named, focusable, prop-spreading and ref-forwarding trigger. Entry ids must be
 * unique and labels non-empty. Keep headers non-interactive, place danger actions after a
 * separator and bind shortcuts in the application. Menu forwards no native props or ref.
 * Enter/Space toggle; ArrowDown opens; ArrowUp on a closed trigger is inert (A1).
 * ArrowLeft closes a submenu; Escape closes the whole menu (A2). Radix owns these behaviors.
 * className supports Content layout additions, not appearance overrides.
 */
const meta: Meta<typeof Menu> = {
  title: 'Molecules/Menu',
  component: Menu,
  tags: ['autodocs'],
  args: { children: <Button>Actions</Button>, items: actions }
};
export default meta;
type Story = StoryObj<typeof Menu>;

/** Required inputs only; preserves uncontrolled visibility and placement defaults. */
export const Default: Story = {};

/** System icons are decorative; shortcuts are visible hints, never registered bindings. */
export const WithIconsAndShortcuts: Story = {
  args: {
    items: [
      { id: 'edit', label: 'Edit', icon: 'pencil', shortcut: '⌘E', onSelect: action('edit') },
      { id: 'copy', label: 'Copy', icon: 'copy', shortcut: '⌘C', onSelect: action('copy') }
    ]
  }
};

/** Tone is a single axis; the destructive action follows a separator and has an explicit label. */
export const Danger: Story = {
  args: {
    items: [
      ...actions,
      { kind: 'separator', id: 'separator' },
      { id: 'delete', label: 'Delete', icon: 'trash', tone: 'danger', onSelect: action('delete') }
    ]
  }
};

/** One submenu level with a group heading and an omitted-kind action inside it. */
export const Submenu: Story = {
  args: {
    items: [
      ...actions,
      {
        kind: 'submenu',
        id: 'share',
        label: 'Share',
        icon: 'users',
        items: [
          { kind: 'label', id: 'destinations', label: 'Destinations' },
          { id: 'copy-link', label: 'Copy link', icon: 'copy', onSelect: action('copy link') },
          { kind: 'link', id: 'documentation', label: 'Documentation', href: '#documentation' }
        ]
      }
    ]
  }
};

/** Native anchors remain destinations; preventing navigation does not prevent menu dismissal. */
export const Links: Story = {
  args: {
    items: [
      { kind: 'link', id: 'profile', label: 'My profile', icon: 'user', href: '#profile' },
      { kind: 'link', id: 'saved', label: 'Saved items', icon: 'bookmark', href: '#saved' },
      { kind: 'link', id: 'disabled-link', label: 'Unavailable destination', href: '#disabled', disabled: true }
    ],
    onNavigate: (entry, event) => {
      event.preventDefault();
      action('navigate')(entry);
    }
  }
};

/** Non-interactive account context precedes a primary sign-in action with a neon glyph. */
export const Header: Story = {
  args: {
    header: (
      <>
        <Avatar size='sm' />
        <span>Guest account</span>
      </>
    ),
    items: [
      { kind: 'link', id: 'profile', label: 'My profile', icon: 'user', href: '#profile' },
      { kind: 'link', id: 'saved', label: 'Saved items', icon: 'bookmark', href: '#saved' },
      { kind: 'separator', id: 'separator' },
      { id: 'sign-in', label: 'Sign in', icon: 'log-out', tone: 'primary', onSelect: action('sign in') }
    ]
  }
};

function ControlledMenu(props: MenuProps) {
  const [open, setOpen] = useState(false);
  return (
    <Menu
      {...props}
      open={open}
      onOpenChange={(next) => {
        action('open change')(next);
        setOpen(next);
      }}
    />
  );
}

/** The host applies visibility requests; incoming props and mounting emit no echo notification. */
export const Controlled: Story = { render: (args) => <ControlledMenu {...args} /> };

/** Disabled entries remain readable but cannot focus or activate, including disabled submenus. */
export const Disabled: Story = {
  args: {
    items: [
      ...actions,
      { id: 'disabled', label: 'Unavailable action', icon: 'pencil', disabled: true },
      { kind: 'submenu', id: 'disabled-submenu', label: 'Unavailable submenu', disabled: true, items: actions }
    ]
  }
};

const accountItems: MenuEntry[] = [
  { kind: 'link', id: 'profile', label: 'Profile', icon: 'user', href: '#profile' },
  { kind: 'link', id: 'saved', label: 'Saved', icon: 'bookmark', href: '#saved' },
  { kind: 'link', id: 'notifications', label: 'Notifications', icon: 'bell', href: '#notifications' },
  { kind: 'link', id: 'settings', label: 'Settings', icon: 'settings', href: '#settings' },
  { kind: 'separator', id: 'account-separator' },
  { id: 'sign-in', label: 'Sign in', icon: 'log-out', tone: 'primary', onSelect: action('sign in') }
];

const accountArgs = {
  children: (
    <button type='button' aria-label='Account menu' className={cn(accountMenuRecipeVariants({ part: 'trigger' }))}>
      <Avatar size='md' />
      <Icon name='chevron-down' className={cn(accountMenuRecipeVariants({ part: 'caret' }))} />
    </button>
  ),
  header: (
    <>
      <Avatar size='lg' />
      <span className={cn(accountMenuRecipeVariants({ part: 'identity' }))}>
        <span className={cn(accountMenuRecipeVariants({ part: 'name' }))}>Guest</span>
        <span className={cn(accountMenuRecipeVariants({ part: 'description' }))}>Sign in to save content</span>
      </span>
    </>
  ),
  items: accountItems,
  side: 'bottom',
  align: 'end',
  className: cn(accountMenuRecipeVariants({ part: 'panel' })),
  onNavigate: (entry, event) => {
    event.preventDefault();
    action('account navigation')(entry);
  }
} satisfies MenuProps;

/**
 * Account access is a Menu recipe, not a UserMenu export. Copy, routes and authentication
 * remain application-owned. Copy these static part classes when composing in an application;
 * accountMenuRecipeVariants is internal and is not a supported package import.
 * Menu/Radix alone own expanded state, focus, dismissal and the portaled panel.
 */
export const AccountMenu: Story = {
  args: accountArgs,
  render: (args) => (
    <div className={cn(accountMenuRecipeVariants({ part: 'wrapper' }))}>
      <Menu {...args} />
    </div>
  )
};

/** A host applies visibility requests; the trigger caret follows native aria-expanded only. */
export const AccountMenuControlled: Story = {
  args: accountArgs,
  render: (args) => (
    <div className={cn(accountMenuRecipeVariants({ part: 'wrapper' }))}>
      <ControlledMenu {...args} />
    </div>
  )
};
