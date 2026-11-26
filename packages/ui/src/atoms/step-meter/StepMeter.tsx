import type { FC } from 'react';
import type { StepMeterProps } from './types';
import { useStepMeter } from './useStepMeter';

/** Passive named image of a coarse stepped level; the consumer owns the level and its wording. */
export const StepMeter: FC<StepMeterProps> = (props) => {
  const { valid, rootProps, steps } = useStepMeter(props);
  return valid ? (
    <span {...rootProps}>
      {steps.map(({ position, ...step }) => (
        <span key={position} {...step} />
      ))}
    </span>
  ) : null;
};
