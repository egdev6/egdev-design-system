import type * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import type { ComponentPropsWithoutRef, ForwardedRef } from 'react';
import { cn } from '@/lib/cn';
import { type AspectRatioProps, aspectRatioVariants } from './types';

type AspectRatioResult = {
  rootProps: ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root> & {
    ref: ForwardedRef<HTMLDivElement>;
  };
};

export function useAspectRatio(
  { ratio = 1, className, ...rest }: AspectRatioProps,
  ref: ForwardedRef<HTMLDivElement>
): AspectRatioResult {
  const normalizedRatio = Number.isFinite(ratio) && ratio > 0 && Number.isFinite(100 / ratio) ? ratio : 1;
  return {
    rootProps: {
      ...rest,
      ref,
      ratio: normalizedRatio,
      className: cn('eg-aspect-ratio', aspectRatioVariants(), className)
    }
  };
}
