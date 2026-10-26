import type * as TogglePrimitive from '@radix-ui/react-toggle';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type ToggleProps, toggleIconVariants, toggleVariants } from './types';

type ToggleResult = {
  rootProps: ComponentPropsWithoutRef<typeof TogglePrimitive.Root>;
  iconProps: { className: string };
  iconOnly: boolean;
  icon: ReactElement | undefined;
  children: ReactNode;
  label: string | undefined;
};

/** Derives content anatomy and classes; all interactive state and behavior stay in Radix. */
export function useToggle(props: ToggleProps): ToggleResult {
  const {
    children,
    icon,
    label,
    size = 'md',
    defaultPressed = false,
    className,
    asChild: _asChild,
    'aria-pressed': _ariaPressed,
    'data-state': _dataState,
    ...rest
  } = props as ToggleProps & { asChild?: boolean; 'aria-pressed'?: unknown; 'data-state'?: unknown };
  const iconOnly = label !== undefined;
  return {
    rootProps: { ...rest, defaultPressed, className: cn(toggleVariants({ size, iconOnly }), className) },
    iconProps: { className: cn(toggleIconVariants({ size })) },
    iconOnly,
    icon,
    children,
    label
  };
}
