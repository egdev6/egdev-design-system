import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { type ButtonGroupProps, buttonGroupVariants } from './types';

type ButtonGroupResult = {
  rootProps: ComponentPropsWithoutRef<'div'>;
  children: ReactNode;
};

/** Derives static grouping semantics and root layout without touching the action children. */
export function useButtonGroup({
  label,
  variant = 'spaced',
  className,
  children,
  ...rest
}: ButtonGroupProps): ButtonGroupResult {
  return {
    rootProps: {
      ...rest,
      role: 'group',
      'aria-label': label || undefined,
      className: cn(buttonGroupVariants({ variant }), className)
    },
    children
  };
}
