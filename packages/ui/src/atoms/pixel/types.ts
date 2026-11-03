import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type PixelState = 'idle' | 'past' | 'active';

type SpanProps = ComponentPropsWithoutRef<'span'>;
type EventProp = Extract<keyof SpanProps, `on${string}`>;

/** A passive position marker whose meaning is supplied by its host. */
export type PixelProps = Omit<
  SpanProps,
  | EventProp
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'data-state'
  | 'tabIndex'
  | 'contentEditable'
> & {
  /**
   * Position condition selected by the consumer, not inferred from progress.
   * @control select
   * @default idle
   */
  state?: PixelState;
};

export const pixelVariants = cva(
  'eg-pixel inline-block flex-none w-2 h-3 [clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)] filter-none transition-none',
  {
    variants: {
      state: { idle: 'bg-fg-default/18', past: 'bg-bg-deep', active: 'bg-fg-brand-default' }
    },
    defaultVariants: { state: 'idle' }
  }
);
