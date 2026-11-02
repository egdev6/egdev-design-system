import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Density preset: the standard card or the compact three-up NowStrip card. */
export type NowCardSize = 'md' | 'sm';

/** Native heading rank, independent of typography. */
export type NowCardLevel = 2 | 3 | 4 | 5 | 6;

type NowCardNativeProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  | 'children'
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
>;

/**
 * Passive current-status article named by its generated heading. className supports outer margin,
 * width and parent-grid placement only, merged last through cn. No ref, asChild, whole-card
 * activation, hover motion or nested interactive controls.
 */
export type NowCardProps = NowCardNativeProps & {
  /**
   * Optional consumer-supplied non-interactive status node, typically a Badge composition,
   * rendered before the heading as the card's first content. Absent/null/boolean renders
   * nothing. No interactive descendants, no baked-in status word, no tone ownership.
   * @control false
   * @controlReason ReactNode is not serializable; see Default and WithBadge for status compositions.
   */
  statusBadge?: ReactNode;
  /**
   * Visible non-empty heading and complete article name. Blank titles warn in development and render nothing.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only; the visual step follows size.
   * @default 3
   * @control select
   */
  level?: NowCardLevel;
  /**
   * Density preset: md is the standard card, sm the three-up NowStrip density. Density never clamps,
   * truncates or hides supplied content.
   * @default md
   * @control select
   */
  size?: NowCardSize;
  /**
   * Body and footer parts in reading order (NowCardBody, then NowCardFooter).
   * @control false
   * @controlReason ReactNode is not serializable; see Default, WithBadge, WithLink and WithNextDate.
   */
  children?: ReactNode;
};

/** Padded growing zone for the consumer-supplied copy; no interactive content, no badge slot. */
export type NowCardBodyProps = {
  /**
   * One or two short paragraphs. No controls, no links, no status badge: the card renders the
   * consumer's statusBadge slot itself, before the heading.
   * @control false
   * @controlReason ReactNode is not serializable; see Default for the copy composition.
   */
  children: ReactNode;
  /**
   * Local layout only (grid placement, margin, width); no appearance overrides, no hidden content,
   * no reordering.
   * @control text
   */
  className?: string;
};

/**
 * Lower band for one supporting detail and/or one action (a Link or a labelled IconButton);
 * never two competing actions.
 */
export type NowCardFooterProps = {
  /**
   * One NowCardDetail and/or one Link/IconButton. Omit the part entirely when the card has no footer.
   * @control false
   * @controlReason ReactNode is not serializable; see WithLink, WithNextDate and WithSingleChild.
   */
  children: ReactNode;
  /**
   * Local layout only (grid placement, margin, width); no appearance overrides, no hidden content,
   * no reordering.
   * @control text
   */
  className?: string;
};

/** Supporting date or context line with an emphasized value; no controls. */
export type NowCardDetailProps = {
  /**
   * One short visible sentence; mark the value with <b> (for example a real <time dateTime> inside it).
   * @control false
   * @controlReason ReactNode is not serializable; see WithNextDate for the emphasized value composition.
   */
  children: ReactNode;
  /**
   * Local layout only (margin, width); no appearance overrides, no hidden content.
   * @control text
   */
  className?: string;
};

/** Material frame: solid surface-1 tonal card, light edge, one-step elevation, no inner padding. */
export const nowCardVariants = cva(
  'eg-now-card flex flex-col items-stretch gap-0 min-w-0 min-h-0 overflow-hidden transform-none transition-none backdrop-filter-none',
  {
    variants: {
      size: { md: '', sm: '' }
    },
    defaultVariants: { size: 'md' }
  }
);

/** Inner padded body; the density step shrinks the padding and the body copy, never the content. */
export const nowCardBodyVariants = cva('eg-now-card__body flex flex-col gap-2 p-6 text-body-large text-fg-secondary', {
  variants: {
    size: { md: '', sm: 'p-4 text-body-default' }
  },
  defaultVariants: { size: 'md' }
});

/**
 * Leading status wrapper: the card renders the consumer's statusBadge node verbatim inside this
 * marked span, before the heading. The node stays readable; no aria-hidden and no tone ownership.
 */
export const nowCardBadgeVariants = cva('eg-now-card__badge flex px-6 pt-6 pb-3');

/**
 * Documented ModuleCard banded-footer geometry over the surface-0 band: only the top hairline is
 * kept, sheen and shadow are dropped, and the bottom radius tracks the frame.
 */
export const nowCardFootVariants = cva(
  'eg-now-card__foot m-0 flex flex-wrap items-center justify-between gap-2 min-w-0 border-x-0 border-b-0 border-t bg-none shadow-none rounded-b-xl px-6 py-3',
  {
    variants: {
      size: { md: '', sm: 'px-5 py-2' }
    },
    defaultVariants: { size: 'md' }
  }
);

/** Supporting context line: display family, metadata step, uppercase with tabular numerals. */
export const nowCardDetailVariants = cva(
  'eg-now-card__detail font-display text-meta uppercase tabular-nums text-fg-muted'
);

/**
 * Emphasized <b> value inside the supplied detail content; static token-backed descendant
 * utilities on the part, so no stylesheet and no per-instance recipe is needed. The planned
 * 800 emphasis uses the existing --text-title-section weight token (800), not a bare default.
 */
export const nowCardDetailValueVariants = cva(
  '[&_b]:text-fg-default [&_b]:font-(weight:--text-title-section--font-weight)'
);
