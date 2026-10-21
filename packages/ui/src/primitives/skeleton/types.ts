import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type SkeletonVariant = 'line' | 'block' | 'circle';
export type SkeletonSize = 'sm' | 'md' | 'lg';

/** Decorative, empty placeholder. Native hooks must not add interaction or change hiddenness. */
export type SkeletonProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'aria-busy'
  | 'tabIndex'
  | 'contentEditable'
> & {
  /**
   * Presentation silhouette, not a loading state or semantic role.
   * @control select
   * @default line
   */
  variant?: SkeletonVariant;
  /**
   * Token-backed, variant-specific dimensions. Numeric sizes are not supported.
   * @control select
   * @default md
   */
  size?: SkeletonSize;
  /**
   * Plays a decorative opacity pulse while the placeholder is shown. Reduced-motion
   * preferences always render it static.
   * @control boolean
   * @default true
   */
  pulse?: boolean;
};

export const skeletonVariants = cva('eg-skeleton block box-border shrink-0 bg-border-default border-0 p-0', {
  variants: {
    variant: {
      line: 'w-full rounded-sm',
      block: 'w-full rounded-md',
      circle: 'rounded-full'
    },
    size: { sm: '', md: '', lg: '' },
    pulse: { true: 'animate-pulse motion-reduce:animate-none', false: '' }
  },
  compoundVariants: [
    { variant: 'line', size: 'sm', className: 'h-3' },
    { variant: 'line', size: 'md', className: 'h-4' },
    { variant: 'line', size: 'lg', className: 'h-5' },
    { variant: 'block', size: 'sm', className: 'h-12' },
    { variant: 'block', size: 'md', className: 'h-20' },
    { variant: 'block', size: 'lg', className: 'h-24' },
    { variant: 'circle', size: 'sm', className: 'size-8' },
    { variant: 'circle', size: 'md', className: 'size-12' },
    { variant: 'circle', size: 'lg', className: 'size-16' }
  ],
  defaultVariants: { variant: 'line', size: 'md', pulse: true }
});
