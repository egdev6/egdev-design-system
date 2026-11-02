import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Native heading rank for the document outline, independent of typography. */
export type CommunityCardLevel = 2 | 3 | 4 | 5 | 6;

type CommunityCardNativeProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  | 'title'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-disabled'
  | 'aria-selected'
  | 'aria-pressed'
  | 'aria-live'
  | 'style'
>;

/** Passive named community card with a banded Material header. className supports outer layout
 * only (grid placement, width, margin, equal-height stretching), merged last; appearance, spacing
 * and parts remain owned. The heading names the article; no ref, asChild or whole-card activation.
 */
export type CommunityCardProps = CommunityCardNativeProps & {
  /**
   * Visible community name and the complete article name. Blank or whitespace-only titles warn
   * in development and render nothing, because an unnamed article is never promised.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only; the display typography never follows the rank.
   * @default 3
   * @control select
   */
  level?: CommunityCardLevel;
  /**
   * Optional relationship line above the name, rendered through the public Text eyebrow primitive.
   * Whitespace-only renders nothing and the top row collapses to the mark when one is supplied.
   * @control text
   */
  eyebrow?: string;
  /**
   * Free descriptive copy in reading order: paragraphs and phrasing content, never headings or
   * interactive content. Direct CommunityCardMark children are hoisted into the header band's top
   * row; a CommunityCardAction child stays in the body flow where it is placed.
   * @control false
   * @controlReason Non-serializable ReactNode content; see Default, WithButton and WithLink for body compositions.
   */
  children?: ReactNode;
  /**
   * Outer layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Decorative consumer mark slot on the trailing edge of the header band's top row. */
export type CommunityCardMarkProps = {
  /**
   * Exactly one consumer-supplied, non-interactive mark element: no anchor, button or tab stop.
   * Either named — `role="img"` with `aria-label`, or `img` with `alt` — so it joins the card
   * content, or decorative — `img` with `alt=""` or `aria-hidden` — when the mark repeats the
   * visible name, so the card is not announced twice. Not type-enforced; rendered untouched.
   * @control false
   * @controlReason A consumer ReactElement is not serializable; see WithImageMark and WithWordmarkMark.
   */
  children: ReactElement;
  /**
   * Local layout only (width, margin); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Bottom-edge zone for the card's single supplied action; the card itself stays passive. */
export type CommunityCardActionProps = {
  /**
   * Exactly one consumer `Button` (optionally `asChild` with an anchor) or `Link`. Two competing
   * actions are outside the contract; the action keeps its own events, focus ring and target.
   * @control false
   * @controlReason A consumer ReactElement is not serializable; see WithButton and WithLink.
   */
  children: ReactElement;
  /**
   * Local layout only (width, margin); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Raised Material frame; the band and the body zone own their spacing and typography. */
export const communityCardVariants = cva(
  'eg-community-card flex min-w-0 flex-col items-stretch gap-0 overflow-hidden backdrop-filter-none'
);

/** Tonal header band: top radius and bottom hairline, kept inside the rounded frame by the root. */
export const communityCardBandVariants = cva('eg-community-card__band border-b border-border-hairline rounded-t-xl');

/** Top row inside the band; collapses to its single supplied child. */
export const communityCardTopRowVariants = cva(
  'flex min-w-0 items-center justify-between gap-3 px-6 py-4 md:px-8 md:py-5'
);

/** Consumer mark slot on the trailing edge; a consumer image keeps its aspect inside the cap. */
export const communityCardMarkVariants = cva(
  'eg-community-card__mark ms-auto flex max-h-16 max-w-full shrink-0 items-center justify-center [&>img]:max-h-16 [&>img]:object-contain'
);

/** Display name typography, independent of the heading rank. */
export const communityCardTitleVariants = cva('m-0 min-w-0 wrap-anywhere text-title-section text-fg-default');

/** Body zone: the frame's large padding step and inherited copy typography. */
export const communityCardBodyVariants = cva(
  'flex min-w-0 flex-col gap-4 p-6 text-body-default text-fg-secondary md:p-8'
);

/** Bottom-edge zone for the card's single supplied action; engages when the host stretches the card. */
export const communityCardActionVariants = cva('eg-community-card__action mt-auto flex items-center');
