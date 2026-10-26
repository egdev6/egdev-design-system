import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { type SurfaceProps, surfaceVariants } from './types';

type SurfaceResult = {
  asChild: boolean;
  rootProps: HTMLAttributes<HTMLElement>;
};

/** Resolve the approved defaults into the Material recipe and choose the root element. */
export function useSurface({
  tone = 'surface-1',
  elevation,
  padding = 'md',
  radius = 'xl',
  asChild = false,
  className,
  ...rest
}: SurfaceProps): SurfaceResult {
  // Well and overlay own fixed recipes; only raised tones resolve an elevation (default 1).
  const raised = tone !== 'well' && tone !== 'overlay';
  return {
    asChild,
    rootProps: {
      ...rest,
      className: cn(surfaceVariants({ tone, elevation: raised ? (elevation ?? 1) : null, padding, radius }), className)
    }
  };
}
