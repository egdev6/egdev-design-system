import { cn } from '@/lib/cn';
import { type DividerProps, dividerVariants } from './types';

/** Derives explicit defaults and supported outer layout without duplicating Radix semantics. */
export function useDivider({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...rest
}: DividerProps): DividerProps {
  return { ...rest, orientation, decorative, className: cn(dividerVariants(), className) };
}
