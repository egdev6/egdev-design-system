import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { GaugeState } from '../../atoms/gauge/types';

export type GaugeGroupSize = 'sm' | 'md' | 'lg';

/** One independent measurement; non-normal conditions require visible text. */
export type GaugeGroupRing = {
  /** Required non-empty magnitude name.
   * @control text
   */
  label: string;
  /** Finite values clamp to 0–100; non-finite values are unavailable.
   * @control number
   */
  value: number;
  /** Coherent text equivalent; otherwise the normalized decimal X / 100.
   * @control text
   */
  valueText?: string;
  /** Readable fallback for unavailable data.
   * @control text
   * @default Data unavailable
   */
  unavailableText?: string;
} & (
  | {
      /** Consumer-selected condition.
       * @control select
       * @default normal
       */
      state?: 'normal';
      /** Optional visible condition description.
       * @control text
       */
      stateText?: string;
    }
  | {
      /** Consumer-selected non-normal condition.
       * @control select
       */
      state: Exclude<GaugeState, 'normal'>;
      /** Required visible condition description.
       * @control text
       */
      stateText: string;
    }
);

export type GaugeGroupItems =
  | readonly [GaugeGroupRing, GaugeGroupRing]
  | readonly [GaugeGroupRing, GaugeGroupRing, GaugeGroupRing];

/** Passive independent measurements; className supports outer margin/alignment only. */
export type GaugeGroupProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | 'accessKey'
  | 'contentEditable'
  | 'onClick'
  | 'onChange'
  | 'defaultValue'
  | 'style'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-hidden'
  | 'aria-live'
  | 'aria-disabled'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuenow'
  | 'aria-valuetext'
> & {
  /** Required non-empty collection name.
   * @control text
   */
  label: string;
  /** Two or three independent ordered readings.
   * @control false
   * @controlReason Tuple data is not representable by a single control; see Default and ThreeRings.
   */
  items: GaugeGroupItems;
  /** Diagram preset diameter.
   * @control select
   * @default md
   */
  size?: GaugeGroupSize;
  /** Decorative, non-interactive content already represented in the readings.
   * @control false
   * @controlReason Non-serializable ReactNode; see CenterContent.
   */
  center?: ReactNode;
};

export const groupRootVariants = cva('eg-gauge-group flex flex-wrap items-start gap-3 font-sans text-fg-default');
export const groupFrameVariants = cva(
  'relative shrink-0 box-border p-0 border-0 border-solid border-[var(--color-border-hairline)] rounded-[var(--radius-full)] bg-transparent bg-none [box-shadow:none] text-fg-default [--eg-gauge-stroke:var(--space-1)]',
  {
    variants: {
      size: {
        sm: 'w-[var(--space-14)] h-[var(--space-14)]',
        md: 'w-[var(--space-20)] h-[var(--space-20)]',
        lg: 'w-[var(--space-24)] h-[var(--space-24)]'
      }
    },
    defaultVariants: { size: 'md' }
  }
);
export const groupSlotVariants = cva('eg-gauge-group-slot', {
  variants: {
    index: {
      0: '[--eg-gauge-group-slot-inset:var(--space-0)]',
      1: '[--eg-gauge-group-slot-inset:calc(var(--space-1)+var(--space-1))]',
      2: '[--eg-gauge-group-slot-inset:calc((var(--space-1)+var(--space-1))*2)]'
    }
  }
});
export const groupCenterVariants = cva('eg-gauge-group-center text-label-default font-sans', {
  variants: {
    count: {
      2: '[--eg-gauge-group-center-inset:var(--space-3)]',
      3: '[--eg-gauge-group-center-inset:var(--space-5)]'
    }
  }
});
export const groupListVariants = cva('m-0 list-none p-0 flex min-w-0 flex-col gap-2');
export const groupRowVariants = cva('flex flex-wrap items-baseline gap-2 text-body-default');
export const groupPositionVariants = cva('text-label-default');
export const groupValueVariants = cva('text-body-default');
