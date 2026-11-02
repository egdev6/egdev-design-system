import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import type { PhotoFrameFocalPoint } from '../../atoms/photo-frame';

export type { PhotoFrameFocalPoint };

/** Native heading rank for the document outline, independent of the mono label typography. */
export type TipCardLevel = 2 | 3 | 4 | 5 | 6;

type TipCardNativeProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  | 'children'
  | 'title'
  | 'className'
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

/** Passive 2:3 tip poster. className supports external layout only, merged last;
 * appearance, spacing and parts remain owned. Use className for grid placement, margin and width.
 * The poster carries no children: every content slot (cover, badge, heading) is prop-driven.
 * No ref, asChild or activation API.
 */
export type TipCardProps = TipCardNativeProps & {
  /**
   * Visible technical label in the caption row and the complete article name. Blank titles warn
   * in development and render nothing.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only; the mono label typography never follows the rank.
   * @default 3
   * @control select
   */
  level?: TipCardLevel;
  /**
   * Optional category word rendered as a solid brand Badge above the label in the caption row.
   * Whitespace-only renders no badge and leaves no empty pill.
   * @control text
   */
  badge?: string;
  /**
   * Cover image resource handed to PhotoFrame. Required: the poster is content, never decorative.
   * @control text
   */
  src: string;
  /**
   * Cover alternative text carrying the real post text. Required and non-empty in practice: the
   * poster never depends on the category badge for meaning.
   * @control text
   */
  alt: string;
  /**
   * Static cover crop alignment inside the 2:3 viewport; crop only, never a mirror.
   * @default center
   * @control select
   */
  focalPoint?: PhotoFrameFocalPoint;
  /**
   * Outer layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Raised Material poster frame over the surface-1 recipe; the layout and passivity neutralizers
 * (no transform, no transition, flat opaque geometry) also override the legacy coverflow rules on
 * the stable root regardless of inherited --ad/--d host variables. */
export const tipCardVariants = cva(
  'eg-tip-card flex min-w-0 flex-col gap-3 transform-none transition-none opacity-100 transform-flat'
);

/** Caption row below the cover. `relative inset-auto p-0 bg-none` neutralizes the legacy overlay
 * rule (absolute position, gradient scrim and padding) so the caption stays in flow, unpainted. */
export const tipCardCapVariants = cva(
  'eg-tip-card__cap relative inset-auto p-0 bg-none flex flex-col items-start gap-1.5 min-w-0'
);

/** Mono technical label that wraps at word boundaries; the rank never changes this typography. */
export const tipCardTitleVariants = cva('font-mono text-label-default text-fg-default wrap-anywhere');
