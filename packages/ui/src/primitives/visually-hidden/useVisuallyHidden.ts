import { cn } from '@/lib/cn';
import type { VisuallyHiddenProps } from './types';

/** Compose the public marker with non-visual consumer hooks; preserve native props. */
export function useVisuallyHidden({
  className,
  asChild = false,
  ...props
}: VisuallyHiddenProps): VisuallyHiddenProps & { className: string } {
  return { ...props, asChild, className: cn('eg-visually-hidden', className) };
}
