import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import type { LayoutAlignItems, LayoutGap } from '../stack/types';

type GridOwnProps = {
  /**
   * Number of equal-width columns, drawn as `repeat(N, minmax(0, 1fr))`: a track may shrink below the minimum width of
   * its content.
   * @default 1
   * @control select
   */
  columnCount?: 1 | 2 | 3 | 4 | 12;
  /**
   * Token-key gap between rows and between columns.
   * @default 4
   * @control select
   */
  gap?: LayoutGap;
  /**
   * Cross-axis alignment of each item inside its grid area.
   * @default stretch
   * @control select
   */
  alignItems?: LayoutAlignItems;
  /**
   * Viewport width in CSS pixels at and below which, inclusive, the grid becomes one column and each direct child's
   * column and row placement resets to automatic. Above it nothing changes. When omitted the grid never collapses. The
   * threshold follows the viewport, not the width of the grid.
   * @control select
   */
  collapseBelow?: 860 | 1080;
  /**
   * Merge the grid onto its single child element through Slot instead of rendering a div.
   * @default false
   * @control boolean
   */
  asChild?: boolean;
};

type GridItemOwnProps = {
  /**
   * Number of columns the item spans. Keep it at or below the grid's `columnCount`: a larger span adds implicit
   * columns. When omitted the item takes one column.
   * @control select
   */
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  /**
   * Number of rows the item spans in the automatic flow. When omitted the item takes one row.
   * @control select
   */
  rowSpan?: 1 | 2 | 3 | 4;
  /**
   * Merge the placement onto its single child element through Slot instead of rendering a div.
   * @default false
   * @control boolean
   */
  asChild?: boolean;
};

export type GridProps = Omit<ComponentPropsWithoutRef<'div'>, keyof GridOwnProps> & GridOwnProps;

export type GridItemProps = Omit<ComponentPropsWithoutRef<'div'>, keyof GridItemOwnProps> & GridItemOwnProps;

/**
 * Static utilities only: every axis map is an inline literal, so the stylesheet scan and the system artifact see each
 * class. The one-column fold uses the inclusive `<=` form (Tailwind's `max-*` variant is exclusive) and resets the direct
 * children's placement; it is emitted after the base utilities at equal specificity, so source order decides.
 */
export const gridVariants = cva('eg-grid grid min-w-0', {
  variants: {
    columnCount: {
      1: 'grid-cols-1',
      2: 'grid-cols-2',
      3: 'grid-cols-3',
      4: 'grid-cols-4',
      12: 'grid-cols-12'
    },
    gap: {
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
    },
    alignItems: {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline'
    },
    collapseBelow: {
      860: '[@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:[&>*]:col-auto [@media(width<=860px)]:[&>*]:row-auto',
      1080: '[@media(width<=1080px)]:grid-cols-1 [@media(width<=1080px)]:[&>*]:col-auto [@media(width<=1080px)]:[&>*]:row-auto'
    }
  },
  defaultVariants: { columnCount: 1, gap: 4, alignItems: 'stretch' }
});

export const gridItemVariants = cva('eg-grid-item min-w-0', {
  variants: {
    span: {
      1: 'col-span-1',
      2: 'col-span-2',
      3: 'col-span-3',
      4: 'col-span-4',
      5: 'col-span-5',
      6: 'col-span-6',
      7: 'col-span-7',
      8: 'col-span-8',
      9: 'col-span-9',
      10: 'col-span-10',
      11: 'col-span-11',
      12: 'col-span-12'
    },
    rowSpan: {
      1: 'row-span-1',
      2: 'row-span-2',
      3: 'row-span-3',
      4: 'row-span-4'
    }
  }
});
