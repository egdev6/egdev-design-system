import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type MeterRowVariant = 'default' | 'muted';

/** Localizable built-in task-progress text. */
export type MeterRowMessages = {
  /**
   * Readable unknown-progress phrase. Omitted dictionary entries resolve to In progress.
   * @control text
   */
  indeterminate: string;
};

type MeterRowNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | 'accessKey'
  | 'contentEditable'
  | 'onClick'
  | 'onChange'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-describedby'
  | 'aria-hidden'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext'
  | 'aria-live'
  | 'aria-atomic'
  | 'aria-relevant'
  | 'aria-disabled'
>;

/**
 * Labelled task/goal completion, never capacity, quota, CPU load or arbitrary measurements.
 * ProgressBar alone owns semantics. No ref, asChild, children, actions or live announcements.
 * className merges last for outer margins, width/min/max-width and parent flex/grid placement
 * only; internal appearance overrides are unsupported. Compatible native metadata reaches the div.
 */
export type MeterRowProps = MeterRowNativeProps & {
  /**
   * Required non-empty visible task/goal name and sole progressbar accessible name.
   * @control text
   */
  label: string;
  /**
   * Required task percent. Finite values clamp to 0–100 with decimals preserved;
   * NaN and infinities mean indeterminate progress, not unavailable data or zero.
   * @control number
   */
  value: number;
  /**
   * Non-empty coherent completion equivalent, visible and accessible. Finite values otherwise
   * derive normalized decimal percent text; ignored during indeterminate progress.
   * @control text
   */
  valueText?: string;
  /**
   * Persistent plain-text explanation linked to the indicator. Absent or whitespace-only help
   * is omitted; this is not form guidance, a tooltip, an error or the numeric readout.
   * @control text
   */
  help?: string;
  /**
   * Brand or muted comparison-task family for the bar and decorative key, never disabled state.
   * @default default
   * @control select
   */
  variant?: MeterRowVariant;
  /**
   * Localizable built-in text. Omitted indeterminate entries resolve to In progress.
   * Supplied phrases must be non-empty; no locale-aware number formatting is built in.
   * @control false
   * @controlReason A dictionary cannot be represented by one scalar control; use the Localized story.
   */
  messages?: Partial<MeterRowMessages>;
};

/** Unpainted structural row; consumers own its host surface. */
export const meterRowVariants = cva('eg-meter-row flex flex-col min-w-0 gap-2 font-sans');
/** Wrapping visible header, hidden from accessibility APIs. */
export const meterRowHeaderVariants = cva(
  'eg-meter-row__head flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1'
);
/** Intrinsic label/key grouping. */
export const meterRowLabelGroupVariants = cva('inline-flex min-w-0 items-center gap-2');
/** Decorative swatch shares the atom family without copying its recipe. */
export const meterRowKeyVariants = cva('eg-meter-row__key w-2 h-2 shrink-0 rounded-full', {
  variants: { variant: { default: 'bg-fg-brand-default', muted: 'bg-fg-muted' } },
  defaultVariants: { variant: 'default' }
});
/** Label and readout preserve unbroken text reflow. */
export const meterRowLabelVariants = cva(
  'eg-meter-row__label min-w-0 text-label-default text-fg-default [overflow-wrap:anywhere]'
);
export const meterRowValueVariants = cva(
  'eg-meter-row__value min-w-0 text-label-default text-fg-default tabular-nums [overflow-wrap:anywhere]'
);
/** Help uses existing typography companions without introducing a new recipe token. */
export const meterRowHelpVariants = cva(
  'eg-meter-row__help m-0 min-w-0 text-label-default text-fg-muted leading-[var(--text-body-default--line-height)] font-[var(--text-body-muted--font-weight)] [overflow-wrap:anywhere]'
);
