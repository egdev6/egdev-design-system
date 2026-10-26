import type * as TogglePrimitive from '@radix-ui/react-toggle';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type ChipProps, chipIconVariants, chipVariants } from './types';

type ChipResult = {
  rootProps: ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;
  iconProps: { className: string; 'aria-hidden': true };
  icon: ReactNode;
  showIcon: boolean;
  children: ReactNode;
};

/** Composes classes and the icon part; pressed state, keyboard and disabled handling stay in Radix. */
export function useChip(props: ChipProps): ChipResult {
  const {
    children,
    icon,
    defaultPressed = false,
    className,
    asChild: _asChild,
    type: _type,
    'aria-pressed': _ariaPressed,
    'data-state': _dataState,
    ...rest
  } = props as ChipProps & { asChild?: unknown; type?: unknown; 'aria-pressed'?: unknown; 'data-state'?: unknown };
  return {
    rootProps: { ...rest, defaultPressed, className: cn(chipVariants(), className) },
    iconProps: { className: cn(chipIconVariants()), 'aria-hidden': true },
    icon,
    showIcon: icon !== undefined && icon !== null && typeof icon !== 'boolean',
    children
  };
}
