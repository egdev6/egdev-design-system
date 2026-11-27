import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type { Button, ButtonProps } from '../../atoms/button';
import type { IconName } from '../../atoms/icon';
import type { Link, LinkProps } from '../../atoms/link';

/** Native heading rank for the document outline, independent of the sans heading typography. */
export type EmptyStateLevel = 2 | 3 | 4 | 5 | 6;

type EmptyStateActions = ReactElement<ButtonProps, typeof Button> | ReactElement<LinkProps, typeof Link>;

type EmptyStateNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'title'
  | 'role'
  | 'aria-live'
  | 'aria-atomic'
  | 'aria-relevant'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
  | 'tabIndex'
  | 'contentEditable'
>;

/**
 * Passive empty state for a listing, or a filter combination, that returns nothing: a native heading, an optional
 * plain-text explanation, an optional decorative pictogram and one recovery action, unpainted on the host backdrop.
 * It renders no live region and never moves focus, so the host announces "no results" if it wants speech and places
 * focus when the action removes the state. There is no built-in copy: consumers provide localized text.
 * className supports outer layout only (margin, self-alignment, grid and flex item placement, width constraints),
 * merged last on the root; spacing, typography, color and paint are not override surfaces.
 * No ref, asChild, children or part-class API.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
export type EmptyStateProps = EmptyStateNativeProps & {
  /**
   * Visible plain-text heading naming the state, never a native tooltip. Consumer-owned copy and language: there is
   * no built-in text. A blank, whitespace-only or non-string title warns in development and renders nothing, so a
   * state is never left unnamed.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only, from 2 to 6 and never h1, which belongs to the page header; the heading typography
   * never follows the rank. Any other value falls back to 3 without a warning.
   * @default 3
   * @control select
   */
  level?: EmptyStateLevel;
  /**
   * Short plain-text explanation after the title, never rich or interactive content. Omitted when absent, empty,
   * whitespace-only or not a string.
   * @control text
   */
  description?: string;
  /**
   * Decorative pictogram from the closed system icon set, rendered by the component before the title at the lg
   * preset and hidden from assistive technology. No wrapper renders when absent. It never carries meaning alone:
   * the title does.
   * @control select
   */
  icon?: IconName;
  /**
   * One recovery action: a single Button (including asChild) or Link, rendered unchanged and never cloned.
   * Undefined, null and booleans omit the actions area. Arrays, fragments, wrappers, groups and a second action are
   * unsupported, and JSX type erasure cannot enforce component identity. Prefer a Button, or a Button asChild around
   * an anchor, where a 44px touch target matters: a bare Link's hit area is only its text line.
   * @control false
   * @controlReason Non-serializable ReactElement/boolean union; see Default, WithLinkAction and AsLinkButton.
   */
  actions?: EmptyStateActions | null | boolean;
};

export const emptyStateVariants = cva(
  'eg-empty-state flex min-w-0 flex-col items-center gap-3 px-4 py-8 text-center font-sans'
);
export const emptyStateIconVariants = cva('inline-flex shrink-0 text-fg-muted');
export const emptyStateTitleVariants = cva('m-0 font-sans text-heading-small text-fg-default wrap-anywhere');
export const emptyStateDescriptionVariants = cva(
  'm-0 max-w-[var(--bp-sm)] font-sans text-body-default text-fg-secondary wrap-anywhere'
);
export const emptyStateActionsVariants = cva('flex min-w-0 max-w-full flex-wrap items-center justify-center gap-2');
