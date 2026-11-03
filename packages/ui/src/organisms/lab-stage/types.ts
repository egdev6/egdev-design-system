import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Passive scene; className supports outer placement only. */
export type LabStageProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'id' | 'role' | 'style' | 'dangerouslySetInnerHTML' | 'title'
> & {
  /** Main heading text; supply trailing whitespace before an accent when needed.
   * @control text
   */
  title: string;
  /** Heading rank selected by the host.
   * @control select
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Optional context above the heading.
   * @control text
   */
  eyebrow?: string;
  /** Optional trailing highlighted heading text.
   * @control text
   */
  accent?: string;
  /** Optional introductory paragraph.
   * @control text
   */
  lede?: string;
  /** Consumer-owned experiment content and semantics.
   * @control false
   * @controlReason ReactNode content cannot be serialized; see the Experiment story.
   */
  children?: ReactNode;
  /** Decorative, non-focusable media, never interactive or the sole source of meaning.
   * @control false
   * @controlReason ReactNode media cannot be serialized; see the DecorativeMedia story.
   */
  media?: ReactNode;
  /** Native heading ID, uniquely supplied by the host. */
  id?: string;
};

export const labStageVariants = cva('eg-lab box-border relative h-auto w-full font-sans text-fg-default');
export const labStageGridVariants = cva('grid min-w-0 grid-cols-1 items-center gap-10', {
  variants: {
    media: {
      true: 'grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-2',
      false: ''
    }
  },
  defaultVariants: { media: false }
});
export const labStageCopyVariants = cva('min-w-0');
export const labStageHeadingVariants = cva('mt-5 mb-7');
export const labStageLedeVariants = cva('m-0 max-w-[40ch] font-sans text-body-large text-fg-default wrap-break-word');
export const labStageExperimentVariants = cva('mt-8 min-w-0');
export const labStageMediaVariants = cva(
  'relative mx-auto aspect-square w-[min(100%,72vh)] min-w-0 [@media(width<=860px)]:order-first [@media(width<=860px)]:w-[min(100%,36svh,calc(var(--space-24)*4))]'
);
