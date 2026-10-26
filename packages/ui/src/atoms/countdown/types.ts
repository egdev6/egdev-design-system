import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Digit scale preset: the source default and small fluid recipes. */
export type CountdownSize = 'md' | 'sm';

/** Foreground treatment: inherit the host foreground, or white digits with secondary labels on canvas. */
export type CountdownTone = 'inherit' | 'canvas';

/** Ordered column labels for days, hours, minutes and seconds. */
export type CountdownUnits = [days: string, hours: string, minutes: string, seconds: string];

type CountdownNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'aria-atomic'
  | 'aria-hidden'
  | 'tabIndex'
  | 'accessKey'
  | 'contentEditable'
>;

/**
 * Passive remaining-time readout to one absolute instant, with a readable deadline and quiet
 * timer semantics. The client clock is sampled only after mount; server and first client renders
 * show the initializing text.
 */
export type CountdownProps = CountdownNativeProps & {
  /**
   * Target instant in Unix epoch milliseconds: a safe integer whose UTC year is 1–9999. Zero and
   * negative values are valid past instants. Strings, Date objects, fractions and non-finite or
   * out-of-range numbers are never coerced: the timer shows unavailableText and runs no clock.
   * @control number
   */
  deadline: number;
  /**
   * Human-readable date, time and timezone of the deadline, rendered in a native time element.
   * The caller owns its localization and accuracy. A blank value warns and falls back to the
   * deterministic UTC ISO string of the deadline. Omitted for an invalid deadline.
   * @control text
   */
  deadlineText: string;
  /**
   * Visible label that also names the timer. A blank value warns and uses the default.
   * @control text
   * @default Next event in
   */
  label?: string;
  /**
   * Column labels for days, hours, minutes and seconds, in that fixed order; English
   * `days`, `hours`, `minutes`, `seconds` when omitted. No plural inflection is applied. A
   * tuple with the wrong length or a blank entry warns and uses the complete default tuple.
   * @control false
   * @controlReason Fixed four-string localization tuple; no single control edits it safely. Use the Localized story.
   */
  units?: CountdownUnits;
  /**
   * Digit scale preset.
   * @control select
   * @default md
   */
  size?: CountdownSize;
  /**
   * Foreground treatment. `inherit` keeps the host foreground on every part (for example
   * black on a flood field); `canvas` uses white digits with secondary labels and text.
   * @control select
   * @default inherit
   */
  tone?: CountdownTone;
  /**
   * Called once per deadline episode when the client first observes the deadline reached,
   * including an already-past deadline at mount, with the normalized deadline. Never per tick,
   * render or server render. Absent by default.
   * @control false
   * @controlReason Callback function; it is not serializable. Use the WithExpiration story.
   */
  onExpire?: (deadline: number) => void;
  /**
   * Placeholder shown before the first client clock sample, without digits. A blank value
   * warns and uses the default.
   * @control text
   * @default Calculating time remaining
   */
  initializingText?: string;
  /**
   * Non-live explanation shown beside the zero readout once the deadline is reached. A blank
   * value warns and uses the default.
   * @control text
   * @default Time reached
   */
  expiredText?: string;
  /**
   * Fallback shown for an invalid deadline, without digits or date metadata. A blank value
   * warns and uses the default.
   * @control text
   * @default Time unavailable
   */
  unavailableText?: string;
};

/** Root: stable marker and foreground; no panel paint, the host owns its field. */
export const countdownRootVariants = cva('eg-countdown min-w-0', {
  variants: {
    tone: { inherit: 'text-inherit', canvas: 'text-fg-default' }
  },
  defaultVariants: { tone: 'inherit' }
});

/** Top label and unit names share the existing eyebrow label recipe. */
const secondaryTone = { inherit: 'text-inherit', canvas: 'text-fg-secondary' };

export const countdownLabelVariants = cva('eg-countdown__label m-0 font-display text-label-eyebrow uppercase', {
  variants: { tone: secondaryTone },
  defaultVariants: { tone: 'inherit' }
});

export const countdownRowVariants = cva('eg-countdown__row mt-2.5 flex flex-wrap gap-y-2 gap-x-countdown-column');

export const countdownUnitVariants = cva('eg-countdown__unit flex flex-col');

export const countdownValueVariants = cva('eg-countdown__value min-w-countdown-unit font-display tabular-nums', {
  variants: {
    size: { md: 'text-countdown-md', sm: 'text-countdown-sm' },
    tone: { inherit: 'text-inherit', canvas: 'text-fg-default' }
  },
  defaultVariants: { size: 'md', tone: 'inherit' }
});

export const countdownNameVariants = cva(
  'eg-countdown__name mt-2 font-display text-label-eyebrow uppercase not-italic',
  {
    variants: { tone: secondaryTone },
    defaultVariants: { tone: 'inherit' }
  }
);

/** Absolute deadline and state message follow the row in body copy. */
export const countdownDateVariants = cva('mt-3 block font-sans text-body-default', {
  variants: { tone: secondaryTone },
  defaultVariants: { tone: 'inherit' }
});

export const countdownStatusVariants = cva('m-0 mt-3 font-sans text-body-default', {
  variants: { tone: secondaryTone },
  defaultVariants: { tone: 'inherit' }
});
