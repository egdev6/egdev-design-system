import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type StatusDotState = 'running' | 'idle' | 'warning' | 'error' | 'stopped' | 'live' | 'standby';

/**
 * Decorative condition dot, always hidden from assistive technology. The state word lives in
 * adjacent text or in the accessible name of the containing control.
 */
export type StatusDotProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children' | 'role' | 'aria-hidden' | 'aria-label' | 'aria-labelledby'
> & {
  /**
   * Condition the dot represents, selected by the consumer. Status states (running, idle,
   * warning, error, stopped) are 8px ringed dots; signal states (live, standby) are 10px
   * glowing dots.
   * @control select
   * @default stopped
   */
  state?: StatusDotState;
  /**
   * Animates the live/standby pulse. It has no effect on status states, and reduced-motion
   * preferences always render the dot static.
   * @control boolean
   * @default true
   */
  pulse?: boolean;
};

export const statusDotVariants = cva('eg-status-dot inline-block shrink-0 rounded-full', {
  variants: {
    state: {
      running: 'size-2 ring-2 ring-bg-surface bg-status-success',
      idle: 'size-2 ring-2 ring-bg-surface bg-status-info',
      warning: 'size-2 ring-2 ring-bg-surface bg-status-warning',
      error: 'size-2 ring-2 ring-bg-surface bg-status-danger',
      stopped: 'size-2 ring-2 ring-bg-surface bg-primitive-neutral-600',
      live: 'size-2.5 shadow-glow-hot bg-fg-brand-default',
      standby: 'size-2.5 shadow-glow-hot bg-primitive-white'
    },
    pulse: { true: '', false: '' }
  },
  compoundVariants: [
    {
      state: ['live', 'standby'],
      pulse: true,
      className: 'motion-safe:animate-[eg-status-dot-pulse_2.4s_var(--ease-out)_infinite]'
    }
  ],
  defaultVariants: { state: 'stopped', pulse: true }
});
