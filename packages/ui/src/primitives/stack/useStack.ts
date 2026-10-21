import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { type StackProps, stackVariants } from './types';

type StackResult = {
  asChild: boolean;
  rootProps: Omit<ComponentPropsWithoutRef<'div'>, keyof StackProps>;
};

/** Derive the vertical stack root props from the approved defaults and variants. */
export function useStack({
  gap = 4,
  alignItems = 'stretch',
  justifyContent = 'start',
  asChild = false,
  className,
  ...rest
}: StackProps): StackResult {
  return {
    asChild,
    rootProps: {
      ...rest,
      className: cn(stackVariants({ gap, alignItems, justifyContent }), className)
    }
  };
}
