import { cva } from 'class-variance-authority';
import type { ReactElement } from 'react';

/**
 * Short supplementary plain text shown when a pointer rests on, or keyboard focus reaches, one
 * trigger element. It describes the trigger; it never names it.
 */
export type TooltipProps = {
  /**
   * Supplementary plain text shown in the bubble and announced as the trigger's description.
   * Not interactive, not rich content and never the trigger's accessible name.
   * @control text
   */
  content: string;
  /**
   * Exactly one focusable trigger element, rendered as the Radix trigger through `asChild`. It
   * must forward refs, spread props and keep its own accessible name.
   * @control false
   * @controlReason A ReactElement trigger is not serializable as a control; see the Default, IconButtonTrigger and Sides stories.
   */
  children: ReactElement;
  /**
   * Preferred side of the trigger; Radix flips to the opposite side when there is no room.
   * @default top
   * @control select
   */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /**
   * Layout-safe classes merged last onto the bubble, for example `text-center` for multi-line
   * text. Appearance overrides are unsupported.
   * @control text
   */
  className?: string;
};

/**
 * Material overlay bubble: translucent surface-overlay with blur and saturation, strong hairline,
 * light edge plus elevation 3, and a solid surface-2 fallback under reduced transparency. Enters
 * with an opacity fade, no transform; reduced motion removes the transition.
 */
export const tooltipVariants = cva([
  'eg-tooltip box-border px-2 py-1 rounded-sm',
  'bg-surface-overlay backdrop-blur-[var(--blur-overlay)] backdrop-saturate-150',
  'border border-border-hairline-strong shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]',
  'text-label-default font-sans text-fg-default max-w-[var(--radix-tooltip-content-available-width)]',
  '[@media(prefers-reduced-transparency:reduce)]:bg-surface-2',
  '[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none',
  '[@media(prefers-reduced-transparency:reduce)]:backdrop-saturate-100',
  'transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-out)] starting:opacity-0',
  'motion-reduce:transition-none'
]);
