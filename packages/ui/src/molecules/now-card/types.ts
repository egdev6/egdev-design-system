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
  | 'style'
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
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
export type NowCardProps = NowCardNativeProps & {
  /**
   * Optional consumer-supplied non-interactive status node rendered before the heading as the card's first
   * content. With the default `badge` presentation it is typically a Badge composition and keeps its own paint.
   * With `statusPresentation='band'` the card paints the band, so supply the label words and, optionally, a
   * decorative Icon instead of a Badge, which would paint a second pill inside the band. Absent/null/boolean
   * renders nothing. No interactive descendants, no baked-in status word.
   * @control false
   * @controlReason ReactNode is not serializable; see Default, WithBadge and WithStatusBand for status compositions.
   */
  statusBadge?: ReactNode;
  /**
   * Presentation of the leading status slot. `badge` renders the supplied node at its content width. `band` paints a
   * full-width, uppercase, brand-tinted band across the top of the card and frames the supplied label in it. It has
   * no effect without `statusBadge`.
   * @default badge
   * @control select
   */
  statusPresentation?: 'badge' | 'band';
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

/** Padded growing zone for the consumer-supplied copy; no interactive content, no badge slot.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
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
 * Lower band for one supporting detail and/or one action (a Link or a labelled IconButton), never two competing
 * actions, and optionally one StepMeter. With a StepMeter the footer holds it plus at most one other child; that
 * rule is the consumer's, as the card never inspects, reorders or limits its children.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
export type NowCardFooterProps = {
  /**
   * One NowCardDetail and/or one Link/IconButton, and optionally one StepMeter (an informative named image with its
   * own label); with a StepMeter, at most one other child. Omit the part entirely when the card has no footer.
   * @control false
   * @controlReason ReactNode is not serializable; see WithLink, WithNextDate, WithStepMeter and WithSingleChild.
   */
  children: ReactNode;
  /**
   * Local layout only (grid placement, margin, width); no appearance overrides, no hidden content,
   * no reordering.
   * @control text
   */
  className?: string;
};

/** Supporting date or context line with an emphasized value; no controls.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
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

/** Heading density and inset for the presence of the leading badge. */
export const nowCardHeadingVariants = cva('m-0 min-w-0 px-6 text-heading-small text-fg-default wrap-anywhere', {
  variants: {
    size: { md: '', sm: 'px-4 text-body-large' },
    badge: { true: 'pt-0', false: 'pt-6' }
  },
  defaultVariants: { size: 'md', badge: false }
});

/** Inner padded body; the density step shrinks the padding and the body copy, never the content. */
export const nowCardBodyVariants = cva(
  'eg-now-card__body flex flex-1 flex-col gap-2 p-6 text-body-large text-fg-secondary',
  {
    variants: {
      size: { md: '', sm: 'p-4 text-body-default' }
    },
    defaultVariants: { size: 'md' }
  }
);

/**
 * Leading status wrapper: the card renders the consumer's statusBadge node verbatim inside this
 * marked span, before the heading. The node stays readable; no aria-hidden. In the default `badge`
 * presentation the card owns no tone and the node keeps its own paint. In `band` the wrapper is the band
 * itself (recipe R1): the card owns the brand tint, margins keep the pill's slot and the heading's inset,
 * and the label wraps.
 */
export const nowCardBadgeVariants = cva('eg-now-card__badge flex', {
  variants: {
    presentation: {
      badge: 'px-6 pt-6 pb-3',
      band: 'mt-6 mb-3 items-center gap-2 rounded-sm border border-alpha-red-22 bg-alpha-red-12 px-2.5 py-1.5 font-display text-label-eyebrow text-primitive-red-200 uppercase shadow-edge wrap-anywhere'
    },
    size: { md: '', sm: '' }
  },
  compoundVariants: [
    { presentation: 'band', size: 'md', class: 'mx-6' },
    { presentation: 'band', size: 'sm', class: 'mx-4' }
  ],
  defaultVariants: { presentation: 'badge', size: 'md' }
});

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
