import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';

/** A host-owned section destination. */
export type SectionNavItem = {
  /**
   * Stable, unique section identity.
   * @control text
   */
  id: string;
  /**
   * Localized section name.
   * @control text
   */
  label: string;
  /**
   * Same-document destination.
   * @control text
   */
  href: string;
};

type NativeProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'style'
>;
/** Host-driven navigation; the host supplies equivalent progress text and moves focus before hiding. Root className supports outer placement only. */
export type SectionNavProps = NativeProps & {
  /**
   * Localized navigation and dialog name.
   * @control text
   */
  label: string;
  /**
   * Localized disclosure name.
   * @control text
   */
  disclosureLabel: string;
  /**
   * Localized next destination name, updated when the destination changes.
   * @control text
   */
  nextLabel: string;
  /**
   * Ordered section destinations.
   * @control false
   * @controlReason Structured items are not serializable as a control; see Default.
   */
  items: SectionNavItem[];
  /**
   * Host-designated current section identity.
   * @control text
   */
  activeId: string;
  /**
   * Scroll progress in percent; host supplies equivalent text.
   * @control number
   */
  value: number;
  /**
   * Controlled visibility; the host acknowledges requested changes.
   * @control boolean
   */
  open?: boolean;
  /**
   * Initial uncontrolled visibility.
   * @default false
   * @control boolean
   */
  defaultOpen?: boolean;
  /**
   * Notify the host when visibility is requested.
   * @control false
   * @controlReason Callbacks are not serializable; see Controlled.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Notify the host of link activation without intercepting navigation.
   * @control false
   * @controlReason Callbacks are not serializable; see Controlled.
   */
  onNavigate?: (item: SectionNavItem, event: MouseEvent<HTMLAnchorElement>) => void;
};

export const sectionNavRootVariants = cva(
  'eg-section-nav fixed z-10 right-[calc(var(--space-6)+env(safe-area-inset-right,0px))] bottom-[calc(var(--space-6)+env(safe-area-inset-bottom,0px))] flex flex-col items-end gap-0 transition-none transform-none before:content-none motion-reduce:transition-none motion-reduce:transform-none'
);
export const sectionNavPillVariants = cva(
  'relative flex items-center h-14 px-4 [@media(width<=520px)]:h-14 [@media(width<=520px)]:px-3 overflow-hidden'
);
export const sectionNavTriggerVariants = cva(
  'flex items-center gap-3 border-0 bg-transparent p-0 font-sans text-body-default text-fg-default cursor-pointer min-w-14 min-h-14 [@media(width<=520px)]:min-w-14 [@media(width<=520px)]:min-h-14 motion-reduce:transition-none'
);
export const sectionNavNextVariants = cva(
  'inline-flex items-center justify-center text-fg-default min-w-14 min-h-14 [@media(width<=520px)]:min-w-14 [@media(width<=520px)]:min-h-14 focus-visible:shadow-[var(--shadow-focus)] motion-reduce:transition-none'
);
export const sectionNavListVariants = cva('m-0 p-0 list-none');
export const sectionNavLinkVariants = cva(
  'flex items-center gap-3 min-h-14 text-fg-default no-underline focus-visible:shadow-[var(--shadow-focus)] aria-[current=location]:underline motion-reduce:transition-none'
);
