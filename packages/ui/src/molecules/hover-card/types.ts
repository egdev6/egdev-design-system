import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Supplementary sighted preview; never place essential information or actions in Content. */
export type HoverCardProps = {
  /**
   * One HoverCardTrigger and one HoverCardContent.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and GaugePreview.
   */
  children: ReactNode;
  /**
   * Controlled visibility; omit for uncontrolled state. Do not switch modes after mounting.
   * @control boolean
   */
  open?: boolean;
  /**
   * Initial uncontrolled visibility; later changes do not reset the state.
   * @default false
   * @control boolean
   */
  defaultOpen?: boolean;
  /**
   * Requests the next visibility after Radix interaction or its timers, never on prop updates.
   * @control false
   * @controlReason Callbacks are not serializable; see Controlled for owner acknowledgement.
   */
  onOpenChange?: (open: boolean) => void;
};

/**
 * Named, link-compatible trigger with an anchor ref. Preserve its focus ring and hit target.
 * A1: touch taps may be cancelled by Radix; always supply a separate persistent details link.
 */
export type HoverCardTriggerProps = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href'> &
  (
    | {
        /**
         * Render the native anchor rather than slotting one link-compatible child.
         * @default false
         * @control boolean
         */
        asChild?: false;
        /**
         * Named link content; passive Gauge content needs an explicitly named outer anchor.
         * @control false
         * @controlReason ReactNode content is not serializable; see Default and GaugePreview.
         */
        children: ReactNode;
        /**
         * Native persistent details destination, required on the default anchor.
         * @control text
         */
        href: string;
      }
    | {
        /**
         * Slot behavior onto one focusable link-compatible child that forwards props and ref.
         * @control boolean
         */
        asChild: true;
        /**
         * One named, ref-forwarding link-compatible element; never use Gauge as the target.
         * @control false
         * @controlReason ReactElement composition is not serializable; see AsChildLink and GaugePreview.
         */
        children: ReactElement;
        /**
         * With asChild, the child owns its native destination; no wrapper href is accepted.
         * @control text
         */
        href?: never;
      }
  );

/**
 * Internally portalled read-only preview. No public ref, asChild, role or focus surface.
 * className is merged last for width/height limits, margins and alignment only; Surface owns
 * Material, padding and radius. Native style is not appearance-override permission.
 */
export type HoverCardContentProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'dangerouslySetInnerHTML' | 'tabIndex' | 'role' | 'aria-live' | 'contentEditable'
> & {
  /**
   * Rich, non-interactive, non-essential content repeated at the persistent destination.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default and LongContent.
   */
  children: ReactNode;
  /**
   * Preferred side before Radix collision handling.
   * @default top
   * @control select
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Preferred alignment along the chosen side before Radix collision handling.
   * @default start
   * @control select
   */
  align?: 'start' | 'center' | 'end';
};

/** Minimal link affordance; consumer link appearance must preserve focus and target size. */
export const hoverCardTriggerVariants = cva([
  'inline-flex items-center justify-center min-w-[var(--space-10)] min-h-[var(--space-10)]',
  'pointer-coarse:min-w-[var(--space-12)] pointer-coarse:min-h-[var(--space-12)]',
  'rounded-md focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]'
]);

/** Layout and opacity only; Surface supplies the overlay recipe, not a local copy. */
export const hoverCardContentVariants = cva([
  'eg-hover-card w-[calc(var(--space-24)*4)]',
  'max-w-[var(--radix-hover-card-content-available-width)] max-h-[var(--radix-hover-card-content-available-height)]',
  'overflow-y-auto break-words font-sans text-body-default',
  'transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)]',
  'data-[state=open]:starting:opacity-0 motion-reduce:transition-none'
]);
