import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Entrance style of the utility. */
export type ScrollRevealVariant = 'reveal' | 'wipe';

/** Observation state carried on the root marker. */
export type ScrollRevealState = 'hidden' | 'revealed';

export type ScrollRevealProps = ComponentPropsWithoutRef<'div'> & {
  /**
   * Content of the wrapper, or the single native element when asChild is enabled.
   * @control false
   */
  children?: ReactNode;
  /**
   * Entrance style: `reveal` fades in and rises; `wipe` uncovers left to right via clip-path.
   * @default reveal
   * @control select
   */
  variant?: ScrollRevealVariant;
  /**
   * Advanced opt-in: merge behavior and state markers onto the consumer's single native child element
   * instead of rendering the wrapper root. Allowed only under the documented conflict policy.
   * @default false
   * @control boolean
   */
  asChild?: boolean;
  /**
   * Static transition delay in milliseconds for stagger. Must be a finite number >= 0;
   * non-finite or negative values are ignored and the element runs with no delay.
   * @control number
   */
  delay?: number;
};

export const scrollRevealRootVariants = cva('eg-scroll-reveal', {
  variants: {
    variant: {
      reveal:
        'box-border transition-[opacity,translate] duration-[var(--duration-reveal)] ease-[var(--ease-out)] delay-[var(--eg-scroll-reveal-delay)] motion-reduce:transition-none focus-within:transition-none data-[state=hidden]:opacity-0 data-[state=hidden]:translate-y-7',
      wipe: 'box-border transition-[clip-path] duration-[var(--duration-wipe)] ease-[var(--ease-out)] delay-[var(--eg-scroll-reveal-delay)] motion-reduce:transition-none focus-within:transition-none data-[state=hidden]:[clip-path:inset(-10%_100%_-10%_0)] data-[state=revealed]:[clip-path:inset(-10%_-2%_-10%_0)] [&[data-done]]:[clip-path:none]'
    }
  }
});
