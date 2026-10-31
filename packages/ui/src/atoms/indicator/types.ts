import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { IconName } from '../icon';

export type IndicatorVariant = 'dot' | 'count' | 'icon';
export type IndicatorTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'brand';
export type IndicatorSize = 'sm' | 'md';
export type IndicatorPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

type IndicatorNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'style'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'autoFocus'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'aria-atomic'
  | 'aria-relevant'
>;

type IndicatorBranch =
  | {
      /**
       * Empty decorative marker. Count and icon branches require their explicit variant.
       * @control select
       * @default dot
       */
      variant?: 'dot';
      /**
       * Supplementary total; available only in the count branch.
       * @control number
       */
      count?: never;
      /**
       * Display overflow threshold; available only in the count branch.
       * @control number
       */
      max?: never;
      /**
       * Decorative origin glyph; available only in the icon branch.
       * @control select
       */
      badgeIcon?: never;
    }
  | {
      /**
       * Decimal supplementary count, not a primary measurement.
       * @control select
       */
      variant: 'count';
      /**
       * Positive safe-integer total. Zero, invalid and unsafe inputs suppress only the marker.
       * No coercion, rounding, automatic announcement or data clamping.
       * @control number
       */
      count: number;
      /**
       * Positive safe-integer display threshold. Larger totals show threshold-plus-sign text;
       * invalid thresholds fall back to 99, without invalidating the underlying count.
       * @control number
       * @default 99
       */
      max?: number;
      /**
       * Decorative origin glyph; available only in the icon branch.
       * @control select
       */
      badgeIcon?: never;
    }
  | {
      /**
       * Existing decorative origin/network glyph, not an action.
       * @control select
       */
      variant: 'icon';
      /**
       * Closed system glyph for origin/network decoration. Meaning belongs in child text/name.
       * @control select
       */
      badgeIcon: IconName;
      /**
       * Supplementary total; available only in the count branch.
       * @control number
       */
      count?: never;
      /**
       * Display overflow threshold; available only in the count branch.
       * @control number
       */
      max?: never;
    };

/**
 * Passive supplementary marker on a direct-children div anchor; no ref or asChild API.
 * className supports outer margins, alignment and grid placement only, not appearance or
 * internal positioning/display/padding/overflow overrides. No universal merge guarantee.
 */
export type IndicatorProps = IndicatorNativeProps & {
  /**
   * Meaningful anchor content rendered directly, without cloning. Null/empty content is valid.
   * @control false
   * @controlReason Non-serializable ReactNode; Default and OnButton demonstrate consumer-owned content and semantics.
   */
  children: ReactNode;
  /**
   * Supplementary signal color family; meaning must also exist in readable consumer content.
   * @control select
   * @default danger
   */
  tone?: IndicatorTone;
  /**
   * Marker geometry preset, independent of child dimensions. Counts may grow with text zoom.
   * @control select
   * @default sm
   */
  size?: IndicatorSize;
  /**
   * Physical corner of the shared anchor footprint; does not flip in RTL or avoid collisions.
   * @control select
   * @default top-right
   */
  position?: IndicatorPosition;
} & IndicatorBranch;

export const indicatorRootVariants = cva('eg-indicator relative inline-flex align-middle overflow-visible');

/** Source-private position recipe shared with Avatar; never a package-barrel export. */
export const indicatorPositionVariants = cva('', {
  variants: {
    position: {
      'top-left': '-top-1 -left-1',
      'top-right': '-top-1 -right-1',
      'bottom-left': '-bottom-1 -left-1',
      'bottom-right': '-bottom-1 -right-1'
    }
  },
  defaultVariants: { position: 'top-right' }
});

/** Geometry only: no paint, pointer/selection policy, outline, border or elevation. */
export const indicatorMarkerGeometryVariants = cva('absolute grid place-items-center rounded-full', {
  variants: {
    variant: { dot: '', count: '', icon: '' },
    size: { sm: '', md: '' }
  },
  compoundVariants: [
    { variant: 'dot', size: 'sm', className: 'size-2' },
    { variant: 'dot', size: 'md', className: 'size-2.5' },
    { variant: 'icon', size: 'sm', className: 'size-4.5' },
    { variant: 'icon', size: 'md', className: 'size-5.5' },
    { variant: 'count', size: 'sm', className: 'min-h-4.5 min-w-4.5' },
    { variant: 'count', size: 'md', className: 'min-h-5.5 min-w-5.5' }
  ],
  defaultVariants: { variant: 'dot', size: 'sm' }
});

/** Source-private glyph geometry shared with Avatar, without Icon naming or paint. */
export const indicatorGlyphVariants = cva('', {
  variants: { size: { sm: 'size-2.75', md: 'size-3.25' } },
  defaultVariants: { size: 'sm' }
});

/** Indicator-only compact signal Material; never composed into Avatar. */
export const indicatorMarkerPaintVariants = cva(
  'box-border pointer-events-none select-none border-[length:var(--border-width)] border-solid border-border-hairline bg-[image:var(--gradient-sheen)] outline-[length:var(--focus-width)] outline-solid outline-bg-surface outline-offset-0',
  {
    variants: {
      tone: {
        neutral: 'bg-bg-canvas text-fg-default',
        info: 'bg-status-info text-fg-on-status',
        success: 'bg-status-success text-fg-on-status',
        warning: 'bg-status-warning text-fg-on-status',
        danger: 'bg-status-danger text-fg-on-status',
        brand: 'bg-action-primary-solid-bg text-action-primary-solid-fg'
      },
      variant: {
        dot: 'shadow-[var(--shadow-edge)]',
        count:
          'w-auto px-1 py-0 whitespace-nowrap font-sans text-label-default tabular-nums shadow-[var(--shadow-edge),var(--shadow-elev-1)]',
        icon: 'shadow-[var(--shadow-edge),var(--shadow-elev-1)]'
      }
    },
    defaultVariants: { tone: 'danger', variant: 'dot' }
  }
);
