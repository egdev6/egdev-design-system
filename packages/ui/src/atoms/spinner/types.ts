import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type SpinnerSize = 'sm' | 'md' | 'lg';

/**
 * Indeterminate activity indicator. Semantics are component-owned: a status region with a
 * label, decorative otherwise. Color is inherited from the host through currentColor.
 */
export type SpinnerProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'role' | 'aria-hidden' | 'aria-live'> & {
  /**
   * Non-empty status text read by assistive technology; makes the root a polite status region.
   * When omitted, empty or whitespace-only, the spinner is decorative and hidden from assistive
   * technology, for hosts that own their busy state (for example a loading Button).
   * @control text
   */
  label?: string;
  /**
   * Icon-scale square: sm 16px, md 20px (--icon-size), lg 28px.
   * @control select
   * @default md
   */
  size?: SpinnerSize;
};

export const spinnerVariants = cva('eg-spinner inline-flex shrink-0', {
  variants: {
    size: {
      sm: 'size-4',
      md: 'size-(--icon-size)',
      lg: 'size-7'
    }
  },
  defaultVariants: { size: 'md' }
});

/** Open-arc glyph: inherited stroke, Icon stroke width and one linear turn per second. */
export const spinnerArcVariants = cva(
  'size-full fill-none stroke-current stroke-(length:--icon-stroke) animate-spin motion-reduce:animate-none'
);
