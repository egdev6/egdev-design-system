import type * as SelectPrimitive from '@radix-ui/react-select';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import {
  type SelectOption,
  type SelectProps,
  selectChevronVariants,
  selectContentVariants,
  selectIndicatorVariants,
  selectItemVariants,
  selectTriggerVariants,
  selectViewportVariants
} from './types';

type UseSelectReturn = {
  rootProps: ComponentPropsWithoutRef<typeof SelectPrimitive.Root>;
  triggerProps: ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>;
  options: SelectOption[];
  placeholder: string | undefined;
  contentClassName: string;
  itemClassName: string;
  chevronClassName: string;
  indicatorClassName: string;
  viewportClassName: string;
};

/** Splits native/form props without mirroring Radix value, focus or open state. */
export function useSelect({
  options,
  value,
  defaultValue,
  onValueChange,
  placeholder,
  size = 'md',
  name,
  required = false,
  disabled = false,
  className,
  ...triggerProps
}: SelectProps): UseSelectReturn {
  return {
    rootProps: { value, defaultValue, onValueChange, name, required, disabled },
    triggerProps: { ...triggerProps, disabled, className: cn(selectTriggerVariants({ size }), className) },
    options,
    placeholder,
    contentClassName: cn(selectContentVariants()),
    itemClassName: cn(selectItemVariants()),
    chevronClassName: cn(selectChevronVariants()),
    indicatorClassName: cn(selectIndicatorVariants()),
    viewportClassName: cn(selectViewportVariants())
  };
}
