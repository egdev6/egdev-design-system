import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Single-value horizontal range control over Radix Slider. Native span attributes reach the
 * root, except aria-describedby, which the hook routes to the focusable thumb.
 */
export type SliderProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'defaultValue' | 'dir' | 'onChange'> & {
  /**
   * Accessible name of the thumb. When a Field renders a visible label it passes the same text.
   * @control text
   */
  label: string;
  /**
   * Controlled value, rendered clamped to [min, max]. When omitted the slider is uncontrolled.
   * @control number
   */
  value?: number;
  /**
   * Initial value when uncontrolled, clamped to [min, max]. Falls back to min when omitted.
   * @control number
   */
  defaultValue?: number;
  /**
   * Called with the new value while the user changes it; never for incoming prop updates.
   * @control false
   * @controlReason Event handler with no serializable value; see the Controlled story.
   */
  onValueChange?: (value: number) => void;
  /**
   * Called with the final value when the user ends an interaction: pointer release or each keyboard step.
   * @control false
   * @controlReason Event handler with no serializable value; see the Controlled story.
   */
  onValueCommit?: (value: number) => void;
  /**
   * Lower bound.
   * @control number
   * @default 0
   */
  min?: number;
  /**
   * Upper bound.
   * @control number
   * @default 100
   */
  max?: number;
  /**
   * Step between values; Page keys and Shift+arrows move ten steps.
   * @control number
   * @default 1
   */
  step?: number;
  /**
   * Formats the current value as the thumb's aria-valuetext. When omitted, or when it returns an
   * empty string, assistive technology announces the number.
   * @control false
   * @controlReason Formatter function with no serializable value; see the WithValueText story.
   */
  valueText?: (value: number) => string;
  /**
   * Blocks keyboard and pointer changes, removes the thumb from the Tab order and dims the slider.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * Form field name; inside a form a hidden input submits the current value. Nothing is submitted when omitted.
   * @control text
   */
  name?: string;
};

/** Root hit area: 24px high, 44px on coarse pointers; consumer className sets outer layout only. */
export const sliderVariants = cva(
  'eg-slider relative flex w-full items-center h-6 pointer-coarse:h-11 touch-none select-none data-[disabled]:opacity-45 data-[disabled]:pointer-events-none'
);

/** Track: 4px Material well ("what is filled sinks"). */
export const sliderTrackVariants = cva(
  'relative h-1 grow overflow-hidden rounded-full bg-surface-0 shadow-[var(--shadow-well)]'
);

/** Range: brand fill up to the value; Radix positions it with inline percentages. */
export const sliderRangeVariants = cva('absolute h-full bg-fg-brand-default');

/** Thumb: raised 16px handle ("what is pressed stands out"); the focus ring replaces the elevation. */
export const sliderThumbVariants = cva(
  'block size-4 rounded-full bg-fg-default shadow-[var(--shadow-elev-1)] cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] transition-shadow duration-[var(--duration-fast)] ease-[var(--ease-out)] motion-reduce:transition-none'
);
