import type * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import type { IconProps } from '../icon';
import { type CheckboxProps, checkboxIconVariants, checkboxIndicatorVariants, checkboxVariants } from './types';

type CheckboxResult = {
  rootProps: ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>;
  indicatorProps: ComponentPropsWithoutRef<typeof CheckboxPrimitive.Indicator>;
  iconProps: Pick<IconProps, 'className'>;
};

/** Split the native/Radix API and compose each supported part; state stays entirely in Radix. */
export function useCheckbox({
  className,
  checked,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  required = false,
  name,
  value = 'on',
  ...rest
}: CheckboxProps): CheckboxResult {
  return {
    rootProps: {
      ...rest,
      checked,
      defaultChecked,
      onCheckedChange,
      disabled,
      required,
      name,
      value,
      className: cn(checkboxVariants(), className)
    },
    indicatorProps: { className: cn(checkboxIndicatorVariants()), 'aria-hidden': true },
    iconProps: { className: cn(checkboxIconVariants()) }
  };
}
