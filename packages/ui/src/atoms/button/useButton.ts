import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { type ButtonProps, type ButtonSize, buttonIconVariants, buttonVariants } from './types';

type ButtonModel = {
  asChild: boolean;
  children: ReactNode;
  icon: ReactNode;
  loading: boolean;
  size: ButtonSize;
  iconPosition: 'start' | 'end';
  showIcon: boolean;
  iconClassName: string;
  rootProps: ComponentPropsWithoutRef<'button'> & {
    'data-state': 'idle' | 'loading';
    'data-disabled': '' | undefined;
  };
};

/** Derive state and guard activation before Slot's child-first bubbling handlers. */
export function useButton({
  asChild = false,
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'end',
  loading = false,
  disabled = false,
  type = 'button',
  tabIndex,
  onClick,
  onClickCapture,
  className,
  ...rest
}: ButtonProps): ButtonModel {
  const blocked = loading || disabled;
  const guard = (event: MouseEvent<HTMLButtonElement>): boolean => {
    if (!blocked) {
      return false;
    }
    event.preventDefault();
    event.stopPropagation();
    return true;
  };
  return {
    asChild,
    children,
    icon,
    loading,
    size,
    iconPosition,
    showIcon: loading || (icon !== undefined && icon !== null && icon !== false),
    iconClassName: cn(buttonIconVariants({ size })),
    rootProps: {
      ...rest,
      className: cn(buttonVariants({ variant, size }), className),
      type: asChild ? undefined : type,
      disabled: asChild ? undefined : disabled,
      tabIndex: asChild && disabled ? -1 : tabIndex,
      'aria-disabled': blocked ? true : rest['aria-disabled'],
      'aria-busy': loading ? true : rest['aria-busy'],
      'data-state': loading ? 'loading' : 'idle',
      'data-disabled': disabled ? '' : undefined,
      onClickCapture: (event) => {
        if (!guard(event)) {
          onClickCapture?.(event);
        }
      },
      onClick: (event) => {
        if (!guard(event)) {
          onClick?.(event);
        }
      }
    }
  };
}
