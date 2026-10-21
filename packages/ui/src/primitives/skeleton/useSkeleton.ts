import { cn } from '@/lib/cn';
import type { SkeletonProps } from './types';
import { skeletonVariants } from './types';

/** Keys the decorative contract rejects even when unsupported code paths inject them. */
const FORBIDDEN = new Set([
  'children',
  'dangerouslySetInnerHTML',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'aria-live',
  'aria-busy',
  'tabIndex',
  'contentEditable',
  'asChild',
  'ref'
]);

/** Resolve the decorative shape and keep hidden decorative invariants. */
export function useSkeleton(props: SkeletonProps) {
  const { variant, size, pulse = true, className, ...rest } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!FORBIDDEN.has(key)) {
      passthrough[key] = value;
    }
  }
  return {
    rootProps: {
      ...passthrough,
      'aria-hidden': true,
      className: cn(skeletonVariants({ variant, size, pulse }), className)
    }
  };
}
