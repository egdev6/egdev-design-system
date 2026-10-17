import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type GaugeState = 'normal' | 'warning' | 'critical' | 'muted';
export type GaugeSize = 'sm' | 'md' | 'lg';
type GaugeStateProps =
  | {
      /**
       * Consumer-selected condition, independent of value; no automatic thresholds.
       * @control select
       * @default normal
       */
      state?: 'normal';
      /**
       * Optional visible condition description, connected through aria-describedby.
       * Omitted when not supplied in the normal state.
       * @control text
       */
      stateText?: string;
    }
  | {
      /**
       * Consumer-selected non-normal condition; requires stateText, never disabled semantics.
       * @control select
       */
      state: Exclude<GaugeState, 'normal'>;
      /**
       * Required non-empty visible description, accompanied by an icon and connected through aria-describedby.
       * @control text
       */
      stateText: string;
    };
type GaugeNativeProps = Omit<
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
  | 'aria-live'
  | 'aria-disabled'
  | 'tabIndex'
  | 'accessKey'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'onClick'
  | 'onChange'
  | 'defaultValue'
>;

/**
 * Passive controlled measurement; non-normal states require stateText through the discriminated union.
 * Compatible native div attributes are inherited; computed semantics are protected and descriptions merged.
 * className supports outer margin/alignment only; size, state and appearance remain component-owned.
 * No children, ref, asChild or Gauge events; consumers supply coherent text and non-interactive centers.
 */
export type GaugeProps = GaugeNativeProps &
  GaugeStateProps & {
    /**
     * Required non-empty accessible name for the magnitude.
     * @control text
     */
    label: string;
    /**
     * Finite values clamp to 0–100; non-finite values are unavailable.
     * @control number
     */
    value: number;
    /**
     * Coherent contextual measurement equivalent; retain the normalized decimal value.
     * When omitted for finite values, uses the normalized decimal "X / 100".
     * Non-finite values expose no aria-valuetext.
     * @control text
     */
    valueText?: string;
    /**
     * Decorative, non-interactive icon, number or short text; meaning belongs in label or valueText.
     * No center content when omitted.
     * @control false
     * @controlReason Non-serializable ReactNode; use the CenterContent story for examples.
     */
    center?: ReactNode;
    /**
     * sm/md/lg use 40/56/80px; any finite positive CSS-pixel diameter, including fractions, has no cap.
     * Invalid numeric sizes fall back to md (56px), independently of measurement clamping.
     * @control false
     * @controlReason Mixed preset and numeric diameter union; no single control represents both. Use the Sizes story.
     * @default md
     */
    size?: GaugeSize | number;
    /**
     * Non-empty readable fallback for non-finite values; no measurement, center or state cue is presented.
     * @control text
     * @default Data unavailable
     */
    unavailableText?: string;
  };

export const gaugeRootVariants = cva(
  'eg-gauge inline-flex h-auto w-auto flex-col items-center gap-2 rounded-none bg-transparent shadow-none hover:shadow-none transition-none cursor-default font-sans text-label-default text-fg-default'
);
export const gaugeCircleVariants = cva(
  'eg-gauge-well relative shrink-0 overflow-hidden box-border p-0 border-0 border-solid border-[var(--color-border-hairline)] rounded-[var(--radius-full)] bg-transparent bg-none [box-shadow:none] text-fg-default',
  {
    variants: {
      size: {
        sm: 'w-[var(--space-10)] h-[var(--space-10)] [--eg-gauge-stroke:3px]',
        md: 'w-[var(--space-14)] h-[var(--space-14)] [--eg-gauge-stroke:4px]',
        lg: 'w-[var(--space-20)] h-[var(--space-20)] [--eg-gauge-stroke:6px]',
        custom: 'w-[var(--eg-gauge-size)] h-[var(--eg-gauge-size)] [--eg-gauge-stroke:calc(var(--eg-gauge-size)/14)]'
      }
    },
    defaultVariants: { size: 'md' }
  }
);
export const gaugeArcVariants = cva(
  'eg-gauge-arc rounded-full [--eg-gauge-track:--alpha(var(--color-fg-default)/10%)] [--eg-gauge-fill:var(--color-fg-brand-default)] data-[state=warning]:[--eg-gauge-fill:var(--color-status-warning)] data-[state=critical]:[--eg-gauge-fill:var(--color-status-danger)] data-[state=muted]:[--eg-gauge-fill:var(--color-fg-muted)]'
);
export const gaugeCenterVariants = cva('eg-gauge-center text-label-default font-sans');
export const gaugeCueVariants = cva('inline-flex items-center gap-2 text-label-default font-sans');
export const gaugeIconVariants = cva('h-[var(--space-4)] w-[var(--space-4)] shrink-0');
