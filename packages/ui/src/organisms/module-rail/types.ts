import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import type { IconName } from '../../atoms/icon';
import type { ProductIdentity } from '../../types/product-identity';

export type ModuleRailState = 'running' | 'idle' | 'warning' | 'error' | 'stopped';
export type ModuleRailLink = {
  kind?: 'link';
  id: string;
  label: string;
  href: string;
  icon: IconName;
  state?: ModuleRailState;
  'aria-current'?: 'page';
};
export type ModuleRailEntry = ModuleRailLink | { kind: 'separator'; id: string };
export type ModuleRailMessages = { add?: string; states?: Partial<Record<ModuleRailState, string>> };

/** Compact host-sized navigation; the host owns responsive switching and routing. */
export type ModuleRailProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role' | 'dangerouslySetInnerHTML'
> & {
  /** Accessible navigation landmark name.
   * @control text
   */
  label: string;
  /** Ordered destinations and separators.
   * @control false
   * @controlReason Structured items are not serializable; see Default and Separators.
   */
  items: ModuleRailEntry[];
  /** Consumer artwork and optional product home.
   * @control false
   * @controlReason ReactNode identity is not serializable; see Default.
   */
  product?: ProductIdentity;
  /** Pinned destinations after the add action.
   * @control false
   * @controlReason Structured items are not serializable; see EndItems.
   */
  endItems?: ModuleRailLink[];
  /** Called on native link click; the consumer owns routing.
   * @control false
   * @controlReason Function callbacks are not serializable; see Default.
   */
  onNavigate?: (item: ModuleRailLink, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Requests creation; omitted when creation is unavailable.
   * @control false
   * @controlReason Function callbacks are not serializable; see WithAdd.
   */
  onAdd?: (event: MouseEvent<HTMLButtonElement>) => void;
  /** Localized add and state words.
   * @control false
   * @controlReason Structured messages are not serializable; see Localized.
   */
  messages?: ModuleRailMessages;
};
export const moduleRailVariants = cva(
  'eg-rail box-border flex h-full w-19 min-h-0 flex-col items-center gap-2 border-y-0 border-s-0 py-4'
);
export const railBodyVariants = cva(
  'flex min-h-0 w-full flex-1 flex-col items-center overflow-y-auto overscroll-contain [scrollbar-width:thin]'
);
export const railListVariants = cva('m-0 flex list-none flex-col items-center gap-2 p-0');
export const railLinkVariants = cva(
  'relative grid size-12 place-items-center rounded-md border border-transparent text-fg-secondary no-underline hover:bg-surface-2 hover:text-fg-default focus-visible:outline-none focus-visible:shadow-focus motion-reduce:transition-none'
);
export const railSeparatorVariants = cva('my-1.5 h-px w-8 shrink-0 bg-border-hairline');
export const railDotVariants = cva('absolute end-2 bottom-2');
export const railCurrentVariants = cva('text-fg-brand-raised');
export const railStoppedVariants = cva('[&_.eg-icon]:opacity-45');
