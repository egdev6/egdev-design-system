import { cva } from 'class-variance-authority';
import type { MouseEvent, ReactElement, ReactNode } from 'react';
import type { IconName } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';

/** Entry color treatment; the label always carries the meaning. */
export type MenuTone = 'default' | 'primary' | 'danger';
/** Alignment along the preferred side before Radix collision handling. */
export type MenuAlign = 'start' | 'center' | 'end';
/** Preferred placement; Radix may flip or shift the panel. */
export type MenuSide = 'top' | 'right' | 'bottom' | 'left';

/** Action entry; omitting kind selects this branch. */
export type MenuActionItem = {
  /**
   * Semantic entry role; omission means an action.
   * @control select
   * @default item
   */
  kind?: 'item';
  /**
   * Stable unique key within the collection.
   * @control text
   */
  id: string;
  /**
   * Non-empty visible action name.
   * @control text
   */
  label: string;
  /**
   * Decorative system glyph beside the label.
   * @control select
   */
  icon?: IconName;
  /**
   * Display-only shortcut; the consumer binds it.
   * @control text
   */
  shortcut?: string;
  /**
   * Color treatment; place danger actions after a separator.
   * @control select
   * @default default
   */
  tone?: MenuTone;
  /**
   * Exclude this entry from focus and activation.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * Action selection; preventDefault keeps the menu open.
   * @control false
   * @controlReason Callbacks are not serializable; see Default and Controlled.
   */
  onSelect?: (event: Event) => void;
};

/** Native destination link, not a form value or an action callback. */
export type MenuLinkItem = {
  /**
   * Destination entry role.
   * @control select
   */
  kind: 'link';
  /**
   * Stable unique key within the collection.
   * @control text
   */
  id: string;
  /**
   * Non-empty visible destination name.
   * @control text
   */
  label: string;
  /**
   * Native anchor destination; omitted from the DOM when disabled.
   * @control text
   */
  href: string;
  /**
   * Decorative system glyph beside the label.
   * @control select
   */
  icon?: IconName;
  /**
   * Color treatment; place danger links after a separator.
   * @control select
   * @default default
   */
  tone?: MenuTone;
  /**
   * Exclude this entry from focus and activation.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
};

/** Non-interactive separation between entry groups. */
export type MenuSeparatorItem = {
  /**
   * Separator entry role.
   * @control select
   */
  kind: 'separator';
  /**
   * Stable unique key within the collection.
   * @control text
   */
  id: string;
};

/** Non-interactive heading for the following entries. */
export type MenuLabelItem = {
  /**
   * Group-heading entry role.
   * @control select
   */
  kind: 'label';
  /**
   * Stable unique key within the collection.
   * @control text
   */
  id: string;
  /**
   * Non-empty visible group heading.
   * @control text
   */
  label: string;
};

/** One submenu level; its children deliberately exclude another submenu. */
export type MenuSubmenuItem = {
  /**
   * Submenu entry role.
   * @control select
   */
  kind: 'submenu';
  /**
   * Stable unique key within the collection.
   * @control text
   */
  id: string;
  /**
   * Non-empty visible submenu name.
   * @control text
   */
  label: string;
  /**
   * Decorative system glyph beside the label.
   * @control select
   */
  icon?: IconName;
  /**
   * Exclude this submenu from focus and activation.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * Ordered entries; nested submenus are not supported.
   * @control false
   * @controlReason Structured entry data cannot be represented by one control; see Submenu.
   */
  items: (MenuActionItem | MenuLinkItem | MenuSeparatorItem | MenuLabelItem)[];
};

/** Data-driven action, link, separator, heading or one-level submenu. */
export type MenuEntry = MenuActionItem | MenuLinkItem | MenuSeparatorItem | MenuLabelItem | MenuSubmenuItem;

/** Dropdown action menu; no native props, ref or asChild API are forwarded by Menu itself. */
export type MenuProps = {
  /**
   * One named focusable element that spreads props and forwards its ref.
   * @control false
   * @controlReason ReactElement triggers are not serializable; see Default and Disabled.
   */
  children: ReactElement;
  /**
   * Ordered entries with unique ids and non-empty labels where applicable.
   * @control false
   * @controlReason Structured entries and callbacks need dedicated examples; see WithIconsAndShortcuts, Danger, Submenu and Links.
   */
  items: MenuEntry[];
  /**
   * Non-interactive context before the entries; absent means no header.
   * @control false
   * @controlReason ReactNode content is not serializable; see Header.
   */
  header?: ReactNode;
  /**
   * Preferred side, adjusted by Radix collision handling.
   * @control select
   * @default bottom
   */
  side?: MenuSide;
  /**
   * Alignment along the preferred side.
   * @control select
   * @default start
   */
  align?: MenuAlign;
  /**
   * Controlled visibility; omission leaves Radix in control.
   * @control boolean
   */
  open?: boolean;
  /**
   * Initial uncontrolled visibility; subsequent updates do not control it.
   * @control boolean
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Visibility request caused by user interaction, not mounting or incoming props.
   * @control false
   * @controlReason Callbacks are not serializable; see Controlled.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Link activation before native navigation; preventDefault supports client-side routing.
   * @control false
   * @controlReason Callbacks receive a native-anchor React event; see Links.
   */
  onNavigate?: (item: MenuLinkItem, event: MouseEvent<HTMLAnchorElement>) => void;
  /**
   * Layout-safe Content additions, such as a larger min-width; appearance overrides are unsupported.
   * @control text
   */
  className?: string;
};

/** Menu geometry/motion only; Material comes from the existing Surface recipe. */
export const menuVariants = cva(
  'eg-menu min-w-57.5 max-h-[var(--radix-dropdown-menu-content-available-height)] overflow-y-auto p-2 font-sans text-fg-secondary transition-[opacity,translate] duration-[var(--duration-fast)] ease-[var(--ease-out)] starting:opacity-0 motion-safe:starting:-translate-y-1.5 motion-reduce:transition-none'
);

export const menuItemVariants = cva(
  'group flex items-center gap-3 px-3 py-2.25 pointer-coarse:min-h-11 rounded-md text-label-default text-fg-secondary no-underline cursor-pointer select-none outline-none transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] data-highlighted:bg-fg-default/6 data-highlighted:text-fg-default focus-visible:inset-ring-2 focus-visible:inset-ring-focus-ring-inverse data-disabled:opacity-45 data-disabled:pointer-events-none motion-reduce:transition-none',
  {
    variants: {
      tone: {
        default: '',
        primary: 'text-fg-default',
        danger: 'text-status-danger data-highlighted:bg-status-danger/10 data-highlighted:text-status-danger'
      },
      submenu: { true: 'data-[state=open]:bg-fg-default/6 data-[state=open]:text-fg-default', false: '' }
    },
    defaultVariants: { tone: 'default', submenu: false }
  }
);
export const menuIconVariants = cva('size-4.5 shrink-0 transition-colors motion-reduce:transition-none', {
  variants: {
    tone: {
      default: 'text-fg-muted group-data-highlighted:text-fg-brand-default',
      primary: 'text-fg-brand-default',
      danger: 'text-status-danger'
    }
  },
  defaultVariants: { tone: 'default' }
});
export const menuShortcutVariants = cva('ml-auto pl-3');
export const menuChevronVariants = cva('ml-auto size-4 -rotate-90');
export const menuSeparatorVariants = cva('h-px my-1.5 mx-1 bg-border-subtle');
export const menuLabelVariants = cva('px-3 pt-2 pb-1 font-display text-meta uppercase text-fg-muted');
export const menuHeaderVariants = cva('flex items-center gap-3 p-2.5 pb-3 mb-1.5 border-b border-border-subtle');

/** Internal account recipe parts; intentionally absent from Menu's public barrel. */
export const accountMenuRecipeVariants = cva('', {
  variants: {
    part: {
      wrapper: 'eg-user-menu inline-flex',
      panel: 'min-w-62.5',
      trigger: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'full' }),
        'group inline-flex items-center gap-1 min-h-10 pointer-coarse:min-h-11 pl-1 pr-1.5 border-border-hairline-strong text-fg-secondary cursor-pointer hover:bg-surface-2 hover:border-border-brand hover:text-fg-default aria-expanded:bg-surface-2 aria-expanded:border-border-brand aria-expanded:text-fg-default focus-visible:outline-none focus-visible:shadow-focus transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none'
      ),
      caret:
        'size-4 transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-safe:group-aria-expanded:rotate-180 motion-reduce:transition-none',
      identity: 'min-w-0',
      name: 'block font-sans text-label-default text-fg-default',
      description: 'block font-sans text-label-default text-fg-muted'
    }
  }
});
