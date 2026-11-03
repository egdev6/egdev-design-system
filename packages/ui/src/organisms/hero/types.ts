import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Passive scene. className supports outer placement only; id names the heading. */
export type HeroProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'id' | 'title' | 'role' | 'style' | 'dangerouslySetInnerHTML'
> & {
  /** Main heading text. Supply trailing whitespace before an accent when needed.
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
  /** Optional trailing heading accent.
   * @control text
   */
  accent?: string;
  /** Optional introductory paragraph.
   * @control text
   */
  lede?: string;
  /** Zero to two independent named actions; at most one primary.
   * @control false
   * @controlReason ReactNode actions are not serializable; see OneAction and TwoActions.
   */
  children?: ReactNode;
  /** Decorative nonfocusable media, never the sole source of meaning.
   * @control false
   * @controlReason ReactNode media is not serializable; see MediaOnlyDecoration.
   */
  media?: ReactNode;
  /** Consumer-named social profile links.
   * @control false
   * @controlReason ReactNode composition is not serializable; see FullScene.
   */
  social?: ReactNode;
  /** Unique heading ID for the host section's aria-labelledby.
   * @control text
   */
  id?: string;
};

export const heroVariants = cva(
  'eg-hero box-border w-full max-w-none mx-0 px-0 grid grid-cols-1 items-center gap-8 font-sans text-fg-default',
  {
    variants: {
      media: {
        true: 'grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] [@media(width<=860px)]:grid-cols-1 [@media(width<=860px)]:gap-4',
        false: ''
      }
    }
  }
);
export const heroCopyVariants = cva('min-w-0 flex flex-col items-start');
export const heroEyebrowVariants = cva('mb-5 [@media(width>=961px)]:mb-3');
export const heroHeadingVariants = cva('mb-7 [@media(width>=961px)]:mb-5');
export const heroLedeVariants = cva('m-0 max-w-full font-sans text-body-large text-fg-secondary wrap-break-word');
export const heroActionsVariants = cva(
  'flex flex-wrap gap-3 mt-8 mb-10 [@media(width>=961px)]:mt-7 [@media(width>=961px)]:mb-8'
);
export const heroSocialVariants = cva('min-w-0');
export const heroMediaVariants = cva('min-w-0 flex items-center justify-center [@media(width<=860px)]:order-first');
export const heroSlotVariants = cva(
  'w-full aspect-square max-w-[62vh] mx-auto [@media(width<=860px)]:max-w-[min(34svh,calc(var(--space-24)*4))] [@media(width>=961px)]:max-w-[min(56svh,calc(var(--space-24)*7))]'
);
