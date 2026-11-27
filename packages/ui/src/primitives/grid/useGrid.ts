import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { type GridItemProps, type GridProps, gridItemVariants, gridVariants } from './types';

type GridPartResult = {
  asChild: boolean;
  rootProps: ComponentPropsWithoutRef<'div'>;
};

/** Derive the grid root props from the approved defaults and variants. */
export function useGrid({
  columnCount = 1,
  gap = 4,
  alignItems = 'stretch',
  collapseBelow,
  asChild = false,
  className,
  ...rest
}: GridProps): GridPartResult {
  return {
    asChild,
    rootProps: {
      ...rest,
      className: cn(gridVariants({ columnCount, gap, alignItems, collapseBelow }), className)
    }
  };
}

/** Derive the grid item root props; an item without a span or row span takes one cell. */
export function useGridItem({ span, rowSpan, asChild = false, className, ...rest }: GridItemProps): GridPartResult {
  return {
    asChild,
    rootProps: {
      ...rest,
      className: cn(gridItemVariants({ span, rowSpan }), className)
    }
  };
}
