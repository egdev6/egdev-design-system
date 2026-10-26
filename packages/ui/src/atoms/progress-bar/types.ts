import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type ProgressBarSize = 'sm' | 'lg';
export type ProgressBarVariant = 'default' | 'muted';

type ProgressBarSizeProps =
  | {
      /**
       * sm is a 2px hairline bar; lg is a 10px goal bar in a Material well.
       * @control select
       * @default sm
       */
      size?: 'sm';
      /**
       * Pins the bar to the bottom edge of the nearest positioned, overflow-clipping ancestor,
       * full width and without radius. Only available with the sm size.
       * @control boolean
       * @default false
       */
      edge?: boolean;
    }
  | {
      /**
       * sm is a 2px hairline bar; lg is a 10px goal bar in a Material well.
       * @control select
       */
      size: 'lg';
      /**
       * Pins the bar to the bottom edge of the nearest positioned, overflow-clipping ancestor,
       * full width and without radius. Only available with the sm size.
       * @control boolean
       */
      edge?: false;
    };

type ProgressBarNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'role'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-hidden'
  | 'dangerouslySetInnerHTML'
>;

/**
 * Passive, controlled horizontal progress in percent. Radix Progress owns the progressbar
 * role and its value attributes; label decides between an announced and a decorative bar.
 * className supports outer layout only (width, margin, positioning when not edge).
 * No children, ref or asChild; edge is only available with the sm size.
 */
export type ProgressBarProps = ProgressBarNativeProps &
  ProgressBarSizeProps & {
    /**
     * Progress in percent. Finite values clamp to 0–100; non-finite values are indeterminate:
     * no aria-valuenow, data-state="indeterminate" and an empty fill.
     * @control number
     */
    value: number;
    /**
     * Accessible name of the progressbar; never rendered visibly. When omitted, empty or
     * whitespace-only, the bar is decorative and hidden from assistive technology, so the
     * consumer must expose the progress as text.
     * @control text
     */
    label?: string;
    /**
     * Text equivalent announced as aria-valuetext for finite values. When omitted, the Radix
     * rounded percentage ("45%") is announced.
     * @control text
     */
    valueText?: string;
    /**
     * default paints the brand fill (gradient on lg); muted paints a comparison series in fg-muted.
     * @control select
     * @default default
     */
    variant?: ProgressBarVariant;
  };

/** Track: size preset, Material well on lg and the sm-only edge placement. */
export const progressBarVariants = cva('eg-progress block overflow-hidden', {
  variants: {
    size: {
      sm: 'h-0.5',
      lg: 'h-2.5 rounded-full bg-surface-0 shadow-well'
    },
    edge: {
      false: 'relative w-full',
      true: 'absolute inset-x-0 bottom-0 w-auto rounded-none bg-bg-glass pointer-events-none'
    }
  },
  compoundVariants: [{ size: 'sm', edge: false, class: 'rounded-[var(--radius-sm)] bg-border-subtle' }],
  defaultVariants: { size: 'sm', edge: false }
});

/** Fill: left-origin scale driven by --eg-progress-value, with a reduced-motion-safe transition. */
export const progressBarFillVariants = cva(
  'eg-progress-fill block h-full w-full origin-left scale-x-[var(--eg-progress-value)] transition-transform duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none',
  {
    variants: {
      size: {
        sm: '',
        lg: 'rounded-[inherit] shadow-edge-strong'
      },
      variant: {
        default: '',
        muted: 'bg-fg-muted'
      }
    },
    compoundVariants: [
      { size: 'sm', variant: 'default', class: 'bg-fg-brand-default' },
      { size: 'lg', variant: 'default', class: 'bg-[image:var(--gradient-progress)]' }
    ],
    defaultVariants: { size: 'sm', variant: 'default' }
  }
);
