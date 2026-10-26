import * as SliderPrimitive from '@radix-ui/react-slider';
import type { FC } from 'react';
import type { SliderProps } from './types';
import { useSlider } from './useSlider';

/** Single-value horizontal range control over Radix Slider: well track, brand range, raised thumb. */
export const Slider: FC<SliderProps> = (props) => {
  const slider = useSlider(props);
  return (
    <SliderPrimitive.Root {...slider.rootProps}>
      <SliderPrimitive.Track {...slider.trackProps}>
        <SliderPrimitive.Range {...slider.rangeProps} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb {...slider.thumbProps} />
    </SliderPrimitive.Root>
  );
};
