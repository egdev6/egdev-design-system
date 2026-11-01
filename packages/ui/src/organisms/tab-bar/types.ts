import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import type { IconName } from '../../atoms/icon';

/** One native destination; ids are unique React keys, not DOM ids. */
export type TabBarItem = {
  /** Stable non-empty key. @control text */
  id: string;
  /** Visible, non-empty destination name. @control text */
  label: string;
  /** Native non-empty destination URL. @control text */
  href: string;
  /** Decorative system glyph. @control select */
  icon: IconName;
  /** Positive finite integer pending count; invalid values are omitted. @control number */
  count?: number;
  /** The consumer marks at most one current page. @control select */
  'aria-current'?: 'page';
};

/** Localized accessible phrases. */
export type TabBarMessages = {
  /** Formats the exact pending count. @control false
   * @controlReason Functions are not serializable; see LocalizedMessages.
   */
  pendingCount?: (count: number) => string;
};

/** In-flow bottom navigation; the host owns positioning, responsive visibility and clearance. className supports outer layout only. */
export type TabBarProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role'
> & {
  /** Required navigation landmark name. @control text */
  label: string;
  /** Ordered destinations. @control false
   * @controlReason Structured items are not scalar controls; see FourItems.
   */
  items: TabBarItem[];
  /** Native click notification; prevent default only for unmodified primary routing. @control false
   * @controlReason Callbacks are not serializable; see CurrentPage.
   */
  onNavigate?: (item: TabBarItem, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Optional count localization. @control false
   * @controlReason Structured functions are not serializable; see LocalizedMessages.
   */
  messages?: TabBarMessages;
};

/** Public root layout recipe; Surface supplies Material. */
export const tabBarVariants = cva(
  'eg-tabbar box-border block w-full pt-1.5 px-2 pb-[max(var(--space-5),env(safe-area-inset-bottom))] font-sans'
);
export const tabBarListVariants = cva('m-0 p-0 list-none grid grid-flow-col auto-cols-fr');
export const tabBarItemVariants = cva('min-w-0');
export const tabBarLinkVariants = cva([
  'group relative flex flex-col items-center justify-center gap-1 min-h-12 py-2 px-1 rounded-md no-underline text-label-default text-fg-secondary',
  'hover:text-fg-default aria-[current=page]:text-fg-default',
  "aria-[current=page]:before:content-[''] aria-[current=page]:before:absolute aria-[current=page]:before:top-0 aria-[current=page]:before:left-1/2 aria-[current=page]:before:-translate-x-1/2 aria-[current=page]:before:h-0.5 aria-[current=page]:before:w-6 aria-[current=page]:before:rounded-full aria-[current=page]:before:bg-fg-brand-default",
  'transition-[color,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] active:scale-97 focus-visible:shadow-focus motion-reduce:transition-none motion-reduce:active:scale-100'
]);
export const tabBarIconVariants = cva('group-aria-[current=page]:text-fg-brand-default');
export const tabBarLabelVariants = cva('block max-w-full truncate');
export const tabBarCountVariants = cva('absolute top-1 left-1/2 ml-1.5 pointer-events-none');
