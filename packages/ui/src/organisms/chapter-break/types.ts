import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Passive scene; className supports outer placement only. */
export type ChapterBreakProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'id' | 'role' | 'style' | 'dangerouslySetInnerHTML' | 'title'
> & {
  /** Main heading text; include trailing whitespace when the accent needs a separator.
   * @control text
   */
  title: string;
  /** Host-selected heading rank.
   * @control select
   */
  level: 1 | 2 | 3 | 4 | 5 | 6;
  /** Optional chapter context.
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
  /** Decorative, non-focusable media, never the sole source of meaning.
   * @control false
   * @controlReason ReactNode media cannot be serialized; see the DecorativeMedia story.
   */
  media?: ReactNode;
  /** Unique heading ID supplied by the host for its section label. */
  id?: string;
};

export const chapterBreakVariants = cva('eg-chapter-break box-border w-full font-sans text-fg-default');
export const chapterBreakGridVariants = cva('grid min-w-0 grid-cols-1 items-center gap-10', {
  variants: {
    media: {
      true: 'grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-2',
      false: ''
    }
  },
  defaultVariants: { media: false }
});
export const chapterBreakCopyVariants = cva('min-w-0');
export const chapterBreakHeadingVariants = cva('mt-5 mb-7');
export const chapterBreakLedeVariants = cva(
  'm-0 max-w-[52ch] font-sans text-body-large text-fg-default wrap-break-word'
);
export const chapterBreakMediaVariants = cva(
  'relative mx-auto aspect-square w-[min(100%,58vh)] min-w-0 [@media(width<=860px)]:order-first [@media(width<=860px)]:w-[min(100%,34svh,calc(var(--space-24)*4))]'
);
