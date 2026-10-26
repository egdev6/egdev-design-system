import type { ReactElement } from 'react';
import { cn } from '@/lib/cn';
import type { TooltipProps } from './types';
import { tooltipVariants } from './types';

/** Distance from the trigger in CSS pixels, equal to `--space-2`; Radix only accepts a number. */
export const TOOLTIP_SIDE_OFFSET = 8;

export type UseTooltipResult = {
  trigger: ReactElement;
  content: string;
  contentProps: {
    side: NonNullable<TooltipProps['side']>;
    align: 'center';
    sideOffset: number;
    className: string;
  };
};

/** Resolve the preferred side, the fixed geometry and the bubble classes with layout className last. */
export function useTooltip({ content, children, side = 'top', className }: TooltipProps): UseTooltipResult {
  return {
    trigger: children,
    content,
    contentProps: {
      side,
      align: 'center',
      sideOffset: TOOLTIP_SIDE_OFFSET,
      className: cn(tooltipVariants(), className)
    }
  };
}
