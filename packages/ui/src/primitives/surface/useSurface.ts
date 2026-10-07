import { cn } from '@/lib/cn';
import { type SurfaceProps, surfaceVariants } from './types';

type UseSurfaceReturn = Omit<SurfaceProps, 'tone' | 'elevation' | 'padding' | 'radius'> & {
  asChild: boolean;
  className: string;
};

export const useSurface = ({
  tone = 'default',
  elevation = 'low',
  padding = 'md',
  radius = 'xl',
  asChild = false,
  className,
  ...rest
}: SurfaceProps): UseSurfaceReturn => ({
  ...rest,
  asChild,
  className: cn(surfaceVariants({ tone, elevation, padding, radius }), className)
});
