import type * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export const aspectRatioVariants = cva('min-w-0');

export type AspectRatioProps = Omit<ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>, 'asChild' | 'ratio'> & {
  /**
   * Width divided by height. Non-positive, non-finite or unrepresentable
   * reciprocal percentages fall back to a square. The parent owns width.
   * @default 1
   * @control number
   */
  ratio?: number;
};
