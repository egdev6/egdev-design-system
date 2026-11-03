import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Passive scene. className supports outer placement only, not appearance overrides. */
export type ClosingProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'id' | 'role' | 'style' | 'dangerouslySetInnerHTML' | 'title'
> & {
  /**
   * Main heading text. Supply trailing whitespace when the accent needs a separator.
   * @control text
   */
  title: string;
  /**
   * Heading rank chosen by the host.
   * @control select
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /**
   * Optional context above the heading.
   * @control text
   */
  eyebrow?: string;
  /**
   * Optional trailing highlighted heading text.
   * @control text
   */
  accent?: string;
  /**
   * Optional introductory paragraph.
   * @control text
   */
  lede?: string;
  /**
   * One to three independent, named CTA controls; consumers own targets and accessibility.
   * @control false
   * @controlReason ReactNode controls cannot be serialized; see the ThreeActions story.
   */
  children: ReactNode;
  /**
   * Optional decorative, non-focusable media; never interactive or the sole source of meaning.
   * @control false
   * @controlReason ReactNode media cannot be serialized; see the DecorativeMedia story.
   */
  media?: ReactNode;
  /** Native heading ID, supplied uniquely by the host for its section label. */
  id?: string;
};

export const closingVariants = cva(
  'eg-closing box-border relative isolate w-full font-sans text-fg-default before:content-none'
);
export const closingGridVariants = cva(
  'grid min-w-0 grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] items-center gap-10 [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-2'
);
export const closingCopyVariants = cva('min-w-0');
export const closingHeadingVariants = cva('mt-5 mb-7');
export const closingLedeVariants = cva('m-0 max-w-[40ch] font-sans text-body-large text-fg-default wrap-break-word');
export const closingActionsVariants = cva('mt-8 flex flex-wrap gap-3');
export const closingMediaVariants = cva(
  'relative mx-auto aspect-square w-[min(100%,62vh)] min-w-0 [@media(width<=860px)]:order-first [@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]'
);
