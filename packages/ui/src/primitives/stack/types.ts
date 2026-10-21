import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Exact existing spacing-token keys; never an arbitrary CSS length. */
export type LayoutGap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 10 | 12 | 14 | 16 | 20 | 24;

/** Cross-axis alignment choices shared by both layout primitives. */
export type LayoutAlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';

/** Main-axis distribution choices shared by both layout primitives. */
export type LayoutJustifyContent = 'start' | 'center' | 'end' | 'between';

const gapClasses = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  7: 'gap-7',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  14: 'gap-14',
  16: 'gap-16',
  20: 'gap-20',
  24: 'gap-24'
} as const satisfies Record<LayoutGap, `gap-${LayoutGap}`>;

export const layoutGapClasses = gapClasses;

const alignItemsClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline'
} as const satisfies Record<LayoutAlignItems, `items-${LayoutAlignItems}`>;

const justifyContentClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between'
} as const satisfies Record<LayoutJustifyContent, `justify-${LayoutJustifyContent}`>;

export const stackVariants = cva('eg-stack flex min-w-0 flex-col flex-nowrap', {
  variants: {
    gap: gapClasses,
    alignItems: alignItemsClasses,
    justifyContent: justifyContentClasses
  },
  defaultVariants: { gap: 4, alignItems: 'stretch', justifyContent: 'start' }
});

export const clusterVariants = cva('eg-cluster flex min-w-0 flex-row flex-wrap', {
  variants: {
    gap: gapClasses,
    alignItems: alignItemsClasses,
    justifyContent: justifyContentClasses
  },
  defaultVariants: { gap: 4, alignItems: 'center', justifyContent: 'start' }
});

type LayoutVariantProps = VariantProps<typeof stackVariants>;

type LayoutSharedProps = Omit<ComponentPropsWithoutRef<'div'>, keyof LayoutVariantProps> & {
  /**
   * Token-key gap between children on both axes.
   * @default 4
   * @control select
   */
  gap?: LayoutGap;
  /**
   * Main-axis distribution when free space is available.
   * @default start
   * @control select
   */
  justifyContent?: LayoutJustifyContent;
  /**
   * Merge the layout onto one child element through Slot instead of rendering a div.
   * @default false
   * @control boolean
   */
  asChild?: boolean;
  /** Layout children; with asChild, exactly one prop-spreading element. */
  children?: ReactNode;
};

export type StackProps = LayoutSharedProps & {
  /**
   * Cross-axis alignment across the vertical stack.
   * @default stretch
   * @control select
   */
  alignItems?: LayoutAlignItems;
};

export type ClusterProps = LayoutSharedProps & {
  /**
   * Cross-axis alignment within each wrapping row.
   * @default center
   * @control select
   */
  alignItems?: LayoutAlignItems;
};
