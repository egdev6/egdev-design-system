import type * as SliderPrimitive from '@radix-ui/react-slider';
import type { ComponentPropsWithoutRef } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/cn';
import type { SliderProps } from './types';
import { sliderRangeVariants, sliderThumbVariants, sliderTrackVariants, sliderVariants } from './types';

export type UseSliderResult = {
  rootProps: ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & { className: string };
  trackProps: { className: string };
  rangeProps: { className: string };
  thumbProps: {
    'aria-label': string;
    'aria-valuetext'?: string;
    'aria-describedby'?: string;
    className: string;
  };
};

const clamp = (value: number, min: number, max: number): number => Math.min(Math.max(value, min), max);

/**
 * Maps the scalar API onto Radix's single-thumb array shape: clamps incoming values, unwraps
 * callbacks, mirrors the current value for valueText and routes aria-describedby to the thumb.
 * Radix keeps owning value state, keyboard, pointer and ARIA.
 */
export function useSlider({
  label,
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  valueText,
  disabled = false,
  className,
  'aria-describedby': describedBy,
  ...rest
}: SliderProps): UseSliderResult {
  // Radix does not expose its uncontrolled value; mirror it so valueText reflects the thumb.
  const [uncontrolled, setUncontrolled] = useState(() => clamp(defaultValue ?? min, min, max));
  const current = value === undefined ? clamp(uncontrolled, min, max) : clamp(value, min, max);
  const text = valueText?.(current) || undefined;
  return {
    rootProps: {
      ...rest,
      min,
      max,
      step,
      disabled,
      value: value === undefined ? undefined : [current],
      defaultValue: defaultValue === undefined ? undefined : [clamp(defaultValue, min, max)],
      onValueChange: ([next]) => {
        if (next === undefined) {
          return;
        }
        setUncontrolled(next);
        onValueChange?.(next);
      },
      onValueCommit: ([next]) => {
        if (next !== undefined) {
          onValueCommit?.(next);
        }
      },
      className: cn(sliderVariants(), className)
    },
    trackProps: { className: cn(sliderTrackVariants()) },
    rangeProps: { className: cn(sliderRangeVariants()) },
    thumbProps: {
      'aria-label': label,
      ...(text === undefined ? {} : { 'aria-valuetext': text }),
      ...(describedBy === undefined ? {} : { 'aria-describedby': describedBy }),
      className: cn(sliderThumbVariants())
    }
  };
}
