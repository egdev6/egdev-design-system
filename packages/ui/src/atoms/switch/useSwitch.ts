import { cn } from '@/lib/cn';
import type { SwitchProps } from './types';
import { switchThumbVariants, switchVariants } from './types';

export type UseSwitchResult = {
  rootProps: Omit<SwitchProps, 'className'> & { className: string };
  thumbProps: { className: string };
};

/**
 * Applies the documented constant defaults, hands state to Radix (no own state) and composes
 * the track classes with layout-only className last; the thumb takes no consumer classes.
 */
export function useSwitch({
  defaultChecked = false,
  disabled = false,
  required = false,
  value = 'on',
  className,
  ...rest
}: SwitchProps): UseSwitchResult {
  return {
    rootProps: {
      ...rest,
      defaultChecked,
      disabled,
      required,
      value,
      className: cn(switchVariants(), className)
    },
    thumbProps: { className: switchThumbVariants() }
  };
}
