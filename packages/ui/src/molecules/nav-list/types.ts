import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import type { IconName } from '../../atoms/icon';

/** Short, readable Badge metadata; no compact appearance override. */
export type NavListTag = {
  /**
   * Non-empty short metadata text. Blank text omits the tag.
   * @control text
   */
  children: string;
  /**
   * Badge's existing soft color family.
   * @default neutral
   * @control select
   */
  tone?: 'neutral' | 'brand';
};

/** Decorative StatusDot paired with a readable equivalent. */
export type NavListSignal = {
  /**
   * StatusDot signal state, independent of disclosure state.
   * @control select
   */
  state: 'live' | 'standby';
  /**
   * Non-empty signal equivalent included in the group name. Blank text omits the signal.
   * @control text
   */
  text: string;
};

/** Native same-context destination; unavailable destinations are omitted by the consumer. */
export type NavListLink = {
  /**
   * Entry role; omitted means a destination link.
   * @default link
   * @control select
   */
  kind?: 'link';
  /**
   * Non-empty React key, unique across the whole list; never used as a DOM id.
   * @control text
   */
  id: string;
  /**
   * Required non-empty visible destination name; truncation preserves its accessible text.
   * @control text
   */
  label: string;
  /**
   * Required native destination URL.
   * @control text
   */
  href: string;
  /**
   * Optional decorative leading system glyph.
   * @control select
   */
  icon?: IconName;
  /**
   * Native current-page indication. The consumer marks at most one link across the list.
   * @control select
   */
  'aria-current'?: 'page';
  /**
   * Raw finite non-negative integer quantity, including zero. Invalid counts are omitted.
   * @control number
   */
  count?: number;
  /**
   * Optional readable Badge metadata.
   * @control false
   * @controlReason Structured Badge data is not a scalar control; see CountsAndTags.
   */
  tag?: NavListTag;
  /**
   * Readable warning equivalent next to a decorative alert glyph; blank text is omitted.
   * @control text
   */
  warning?: string;
};

/** One grouping level only; group counts are supplied, never computed. */
export type NavListGroupBase = {
  /**
   * Non-empty React key, unique across the whole list; keep stable to preserve disclosure state.
   * @control text
   */
  id: string;
  /**
   * Required non-empty visible group name.
   * @control text
   */
  label: string;
  /**
   * Ordered destinations only; nested groups are not supported.
   * @control false
   * @controlReason Structured link data is not a scalar control; see StaticGroups and CollapsibleGroups.
   */
  items: NavListLink[];
  /**
   * Supplied finite non-negative integer quantity, including zero; invalid counts are omitted.
   * @control number
   */
  count?: number;
  /**
   * Optional StatusDot and readable equivalent; retained while collapsed.
   * @control false
   * @controlReason Structured signal data is not a scalar control; see GroupSignals.
   */
  signal?: NavListSignal;
};

/** Non-interactive caption and a named nested list. */
export type NavListStaticGroup = NavListGroupBase & {
  /**
   * Static group entry role.
   * @control select
   */
  kind: 'group';
};

/** Independent Radix disclosure; do not switch controlled mode while mounted. */
export type NavListCollapsibleGroup = NavListGroupBase & {
  /**
   * Independent disclosure entry role.
   * @control select
   */
  kind: 'collapsible-group';
  /**
   * Controlled visibility; wins over defaultOpen. Incoming updates do not emit callbacks.
   * @control boolean
   */
  open?: boolean;
  /**
   * Initial uncontrolled visibility, read once by Radix.
   * @default false
   * @control boolean
   */
  defaultOpen?: boolean;
  /**
   * User-requested next visibility; the controlling owner must acknowledge it.
   * @control false
   * @controlReason Callback functions are not serializable; see ControlledGroups.
   */
  onOpenChange?: (open: boolean) => void;
};

/** Ordered in-flow navigation entry schema, not menu or tree data. */
export type NavListEntry = NavListLink | NavListStaticGroup | NavListCollapsibleGroup;

/** Named navigation landmark. className supports outer width, margin, placement and alignment only. No ref or asChild. */
export type NavListProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role'
> & {
  /**
   * Required non-empty accessible name of the navigation landmark.
   * @control text
   */
  label: string;
  /**
   * Ordered links and one-level groups. Empty data renders an empty list.
   * @control false
   * @controlReason Structured entry data is not a scalar control; see StaticGroups and CollapsibleGroups.
   */
  items: NavListEntry[];
  /**
   * Native click notification with the original entry and React event. For client routing,
   * preventDefault only on unmodified primary activations; modifiers and auxclick remain native.
   * @control false
   * @controlReason Callback functions are not serializable; see Default and CurrentPage.
   */
  onNavigate?: (item: NavListLink, event: MouseEvent<HTMLAnchorElement>) => void;
};

/** Public root recipe; the host, not NavList, owns the panel. */
export const navListVariants = cva('eg-nav-list min-w-0 font-sans');
export const navListListVariants = cva('m-0 p-0 list-none flex flex-col gap-0.5');
export const navListLinkVariants = cva([
  'group/nav-link box-border flex items-center gap-3 min-h-11 px-3 py-1.5 rounded-md',
  'font-sans text-label-default text-fg-secondary no-underline',
  'hover:bg-fg-default/6 hover:text-fg-default aria-[current=page]:text-fg-default',
  'aria-[current=page]:hover:bg-surface-3',
  'transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none',
  'focus-visible:outline-solid focus-visible:outline-[length:var(--focus-width)]',
  'focus-visible:outline-[var(--color-focus-ring-inverse)] focus-visible:outline-offset-[calc(var(--focus-width)*-1)]'
]);
export const navListIconVariants = cva([
  'size-4.5 text-fg-muted group-hover/nav-link:text-fg-brand-default',
  'group-aria-[current=page]/nav-link:text-fg-brand-raised',
  'group-aria-[current=page]/nav-link:group-hover/nav-link:text-fg-brand-raised'
]);
export const navListLabelVariants = cva('flex-1 min-w-0 truncate');
export const navListCountVariants = cva(
  'shrink-0 tabular-nums text-label-default text-fg-muted group-aria-[current=page]/nav-link:text-fg-default'
);
export const navListMetadataVariants = cva('ml-auto inline-flex shrink-0 items-center gap-2');
export const navListCaptionVariants = cva(
  'flex items-center gap-2 font-display text-meta uppercase text-fg-muted mx-3 mt-4 mb-1'
);
export const navListTriggerVariants = cva([
  'group/nav-trigger flex w-full min-h-11 items-center gap-2 px-3 border-0 bg-transparent rounded-md',
  'text-left font-display text-meta uppercase text-fg-muted focus-visible:shadow-focus'
]);
export const navListChevronVariants = cva([
  'size-3.5 group-data-[state=closed]/nav-trigger:-rotate-90',
  'transition-transform duration-[var(--duration-fast)] ease-[var(--ease-out)]',
  'motion-reduce:transform-none motion-reduce:transition-none'
]);
export const navListWarningVariants = cva('size-4 text-status-warning');
