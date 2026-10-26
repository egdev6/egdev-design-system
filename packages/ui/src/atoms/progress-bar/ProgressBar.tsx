import * as ProgressPrimitive from '@radix-ui/react-progress';
import type { FC } from 'react';
import type { ProgressBarProps } from './types';
import { useProgressBar } from './useProgressBar';

/** Passive horizontal progress in percent: a Radix Progress track with a scaled fill. */
export const ProgressBar: FC<ProgressBarProps> = (props) => {
  const progress = useProgressBar(props);
  return (
    <ProgressPrimitive.Root {...progress.rootProps}>
      <ProgressPrimitive.Indicator {...progress.fillProps} />
    </ProgressPrimitive.Root>
  );
};
