import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { InputNativeProps, InputProps, InputSize, InputType, InputVariant } from './types';
import { inputControlVariants, inputIconVariants, inputVariants } from './types';

export type UseInputResult = {
  rootProps: { className: string };
  controlProps: Omit<InputNativeProps, 'className'> & { type: InputType; className: string };
  icon: ReactNode;
  iconClassName: string;
  hasIcon: boolean;
  size: InputSize;
  variant: InputVariant;
};

/** Resolve defaults and icon presence, send className to the root and every native prop to the control. */
export function useInput({
  size = 'md',
  variant = 'default',
  type = 'text',
  icon,
  className,
  ...rest
}: InputProps): UseInputResult {
  const hasIcon = icon !== undefined && icon !== null && typeof icon !== 'boolean' && icon !== '';
  return {
    rootProps: { className: cn(inputVariants(), className) },
    controlProps: { ...rest, type, className: cn(inputControlVariants({ size, variant, icon: hasIcon })) },
    icon,
    iconClassName: cn(inputIconVariants()),
    hasIcon,
    size,
    variant
  };
}
