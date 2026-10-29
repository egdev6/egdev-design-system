import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { InputNativeProps, InputProps, InputSize, InputType, InputVariant } from './types';
import { inputControlVariants, inputIconVariants, inputSpinnerVariants, inputVariants } from './types';

export type UseInputResult = {
  rootProps: { className: string };
  controlProps: Omit<InputNativeProps, 'className'> & { type: InputType; className: string };
  icon: ReactNode;
  iconClassName: string;
  spinnerClassName: string;
  loading: boolean;
  hasIcon: boolean;
  size: InputSize;
  variant: InputVariant;
};

/** Resolve decorative slots and busy semantics; loading never changes native editability. */
export function useInput({
  size = 'md',
  variant = 'default',
  type = 'text',
  icon,
  loading = false,
  className,
  ...rest
}: InputProps): UseInputResult {
  const hasIcon = icon !== undefined && icon !== null && typeof icon !== 'boolean' && icon !== '';
  return {
    rootProps: { className: cn(inputVariants(), className) },
    controlProps: {
      ...rest,
      type,
      'aria-busy': loading ? true : rest['aria-busy'],
      className: cn(inputControlVariants({ size, variant, icon: hasIcon, loading }))
    },
    icon,
    iconClassName: cn(inputIconVariants()),
    spinnerClassName: cn(inputSpinnerVariants()),
    loading,
    hasIcon,
    size,
    variant
  };
}
