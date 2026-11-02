import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, HTMLAttributes, ReactNode } from 'react';

/** Native heading rank for the document outline, independent of typography. */
export type ArticleFeatureLevel = 2 | 3 | 4 | 5 | 6;

/**
 * Native-anchor branch: the card element is the anchor. role, tabIndex and style stay protected
 * (stripped by the hook); aria-label and aria-labelledby are deliberately not protected, so a
 * consumer can replace the content-derived accessible name.
 */
export type ArticleFeatureLinkProps = Omit<
  ComponentPropsWithoutRef<'a'>,
  'title' | 'children' | 'className' | 'role' | 'tabIndex' | 'style'
> & {
  /**
   * Destination of the card's single whole-card link.
   * @control text
   */
  href: string;
  /**
   * Render the native anchor that wraps the whole card.
   * @default false
   * @control boolean
   */
  asChild?: false;
  /**
   * Visible article title and the card link's name. Blank or whitespace-only warns in development
   * and renders nothing, because an unnamed link is never promised.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only; the title typography never follows the rank.
   * @default 3
   * @control select
   */
  level?: ArticleFeatureLevel;
  /**
   * Category line of the context row, rendered in the brand raised ink. Whitespace-only renders nothing.
   * @control text
   */
  eyebrow?: string;
  /**
   * Reading time, date or other short fact of the context row, rendered in the secondary ink.
   * Formatting is the consumer's. Whitespace-only renders nothing.
   * @control text
   */
  detail?: string;
  /**
   * Visible text of the card's action affordance. Paint and text only: it never becomes a nested
   * link. Whitespace-only renders nothing.
   * @control text
   */
  actionLabel?: string;
  /**
   * At most one ArticleFeatureCover, rendered before the context row.
   * @control false
   * @controlReason Non-serializable ReactNode composition; see Default, GenerativeCover and MediaCover.
   */
  children?: ReactNode;
  /**
   * Outer layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/**
 * Slotted branch: one consumer anchor (router link, analytics link) receives the whole card
 * through Radix Slot and owns href. role, tabIndex and style stay protected (stripped by the
 * hook); aria-label and aria-labelledby are deliberately not protected, so a consumer can
 * replace the content-derived accessible name.
 */
export type ArticleFeatureSlottedProps = Omit<
  HTMLAttributes<HTMLAnchorElement>,
  'children' | 'title' | 'className' | 'role' | 'tabIndex' | 'style'
> & {
  /**
   * Merge the card onto one consumer anchor through Radix Slot; the child keeps anchor semantics.
   * @control boolean
   */
  asChild: true;
  /**
   * The consumer anchor owns the destination; the slotted branch accepts no href of its own.
   */
  href?: never;
  /**
   * Visible article title and the card link's name. Blank or whitespace-only warns in development
   * and renders nothing, because an unnamed link is never promised.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only; the title typography never follows the rank.
   * @control select
   */
  level?: ArticleFeatureLevel;
  /**
   * Category line of the context row, rendered in the brand raised ink. Whitespace-only renders nothing.
   * @control text
   */
  eyebrow?: string;
  /**
   * Reading time, date or other short fact of the context row, rendered in the secondary ink.
   * Formatting is the consumer's. Whitespace-only renders nothing.
   * @control text
   */
  detail?: string;
  /**
   * Visible text of the card's action affordance. Paint and text only: it never becomes a nested
   * link. Whitespace-only renders nothing.
   * @control text
   */
  actionLabel?: string;
  /**
   * At most one ArticleFeatureCover, rendered before the context row.
   * @control false
   * @controlReason Non-serializable ReactNode composition; see Default, GenerativeCover and MediaCover.
   */
  children?: ReactNode;
  /**
   * Outer layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/**
 * Whole-card featured-article link: one anchor (native or the consumer's through asChild) around
 * a reserved 16:8 cover, an optional context row, a generated heading and a paint-only action
 * label. No ref API; the card is the single tab stop.
 */
// Slotted branch first keeps docgen's union merge on the required-href native branch, mirroring
// the Chip union arrangement; branch order does not change assignability.
export type ArticleFeatureProps = ArticleFeatureSlottedProps | ArticleFeatureLinkProps;

/** Cover region props: one generative plate or exactly one `PhotoFrame ratio="auto"`. */
export type ArticleFeatureCoverProps = {
  /**
   * Oversized decorative word of the generative plate, for example /src. aria-hidden and never
   * part of the accessible name. Ignored when a media child is supplied; whitespace-only renders nothing.
   * @control text
   */
  coverWord?: string;
  /**
   * Featured flag rendered as a solid brand Badge over the cover corner. Whitespace-only renders
   * no badge.
   * @control text
   */
  badge?: string;
  /**
   * Exactly one PhotoFrame composed with ratio="auto": the cover region reserves the 16:8
   * proportion and the auto media fills the reserved height. A child with its own ratio breaks
   * the reservation; that composition error is documented and warned about in development, not
   * rejected by the type.
   * @control false
   * @controlReason Non-serializable ReactNode media composition; see the MediaCover story.
   */
  children?: ReactNode;
  /**
   * Local layout only (width, margin, placement); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Root anchor: Surface raised frame plus the approved ListItem whole-card anchor hover recipe. */
export const articleFeatureVariants = cva([
  'eg-article-feature flex flex-col gap-4 min-w-0 no-underline text-fg-default',
  'cursor-pointer hover:border-border-brand hover:[background:var(--gradient-sheen),var(--color-surface-2)]',
  'focus-visible:outline-none focus-visible:shadow-focus',
  'transition-[color,background-color,border-color] duration-(--duration-fast) ease-(--ease-out)',
  'motion-reduce:transition-none'
]);

/** Cover region: relative positioning for the overlay badge around the reserved proportion. */
export const articleFeatureCoverVariants = cva('eg-article-feature__cover relative min-w-0');

/** Generative plate layout inside the reserved region; the well recipe supplies the recessed paint. */
export const articleFeaturePlateVariants = cva('flex items-end min-w-0');

/** Oversized decorative word; token display step at the ghost alpha instead of the web's clamp literal. */
export const articleFeatureWordVariants = cva(
  'block px-4 text-title-display uppercase text-alpha-white-07 leading-none'
);

/** Overlay position of the featured badge over the cover corner. */
export const articleFeatureBadgeVariants = cva('absolute top-4 left-4');

/** Internal context row: uppercase display metadata in one line that wraps, never truncates. */
export const articleFeatureMetaVariants = cva(
  'eg-article-feature__meta m-0 flex items-center gap-2 min-w-0 font-display text-meta uppercase text-fg-secondary'
);

/** Category ink of the context row. */
export const articleFeatureEyebrowVariants = cva('text-fg-brand-raised min-w-0');

/** Detail ink of the context row. */
export const articleFeatureDetailVariants = cva('text-fg-secondary min-w-0');

/** Generated heading: token title step, independent of the heading rank; wraps instead of truncating. */
export const articleFeatureTitleVariants = cva('m-0 min-w-0 wrap-anywhere text-heading-small text-fg-default');

/** Paint-only action affordance: underlined label pinned last so unequal cards keep it aligned. */
export const articleFeatureActionVariants = cva(
  'eg-article-feature__action mt-auto self-start inline-flex items-center gap-1.5 text-label-default text-fg-brand-raised border-b border-border-brand'
);
