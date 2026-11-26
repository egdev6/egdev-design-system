import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

type SpanProps = ComponentPropsWithoutRef<'span'>;
type EventProp = Extract<keyof SpanProps, `on${string}`>;

/**
 * Passive, informative named image of a coarse stepped level: a short row of skewed steps, filled from the inline
 * start and empty afterwards. It is not a measurement, input or live region: the consumer owns the level, the
 * wording of label and any announcement when the level changes. className merges last on the root for outer
 * placement only; steps expose no className. No ref, asChild or built-in text. Handlers, focus, content and the
 * semantics that label owns are not part of the public type and are discarded at untyped runtime boundaries.
 */
export type StepMeterProps = Omit<
  SpanProps,
  | EventProp
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-hidden'
  | 'aria-live'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext'
  | 'data-state'
  | 'title'
  | 'tabIndex'
  | 'contentEditable'
> & {
  /**
   * Accessible name of the image, never rendered visibly. State the level in words (for example "High progress")
   * so it stands alone when a screen reader reaches it. The wording and language are the consumer's: there is no
   * built-in text and no default. A blank or non-string label warns in development and renders nothing.
   * @control text
   */
  label: string;
  /**
   * Number of filled steps, counted from the inline start. A finite number is floored to an integer and clamped
   * to 0 through steps, so the level is never overstated. NaN, an infinite or a non-numeric value warns in
   * development and renders nothing.
   * @control number
   */
  value: number;
  /**
   * Total number of steps, an integer from 1 to 10. Anything else (non-integer, below 1, above 10, non-finite or
   * non-numeric) falls back to 4 without a warning.
   * @default 4
   * @control number
   */
  steps?: number;
};

/** Root: the single named image, a static inline flex row. It carries no paint of its own. */
export const stepMeterVariants = cva('eg-step-meter inline-flex flex-none items-center gap-1');

/**
 * One skewed step, sized by token spacing units with the approved 27 degree clip-path literal. Flat token paint
 * under the recipe approved in docs/components/step-meter/v0.1/spec.md: a decorative mark, not an elevated surface,
 * well or overlay, so no Surface, glow, gradient, shadow or border. The filled state is read from data-state; under
 * forced colors the filled steps paint CanvasText and the empty steps are not painted, so the distinction is
 * presence, never hue.
 */
export const stepMeterStepVariants = cva([
  'eg-step-meter__step inline-block flex-none w-3.5 h-3.75 [clip-path:polygon(0_0,100%_47.6%,100%_100%,0_52.4%)]',
  'bg-alpha-red-22 data-[state=filled]:bg-fg-brand-default transition-none',
  'forced-colors:forced-color-adjust-none forced-colors:data-[state=filled]:bg-[color:CanvasText]',
  'forced-colors:data-[state=empty]:bg-transparent'
]);
