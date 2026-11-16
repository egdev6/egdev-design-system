import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type { Button, ButtonProps } from '../../atoms/button';
import type { IconButton, IconButtonProps } from '../../atoms/icon-button';
import type { ButtonGroup, ButtonGroupProps } from '../button-group';

/** Semantic heading rank, independent of the compact typography. */
export type PageHeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;

type PageHeaderActions = ReactElement<ButtonProps, typeof Button> | ReactElement<ButtonGroupProps, typeof ButtonGroup>;
type PageHeaderLeadingAction = ReactElement<IconButtonProps, typeof IconButton>;

type PageHeaderNativeProps = Omit<ComponentPropsWithoutRef<'header'>, 'children' | 'title' | 'dangerouslySetInnerHTML'>;

/**
 * Compact product heading inside main/sectioning content, not a site banner.
 * className supports external margins, width/min/max sizing and parent placement only;
 * internal spacing, reflow, typography and paint are not override surfaces.
 * No public ref, asChild, rich title, children or part-class API.
 */
export type PageHeaderProps = PageHeaderNativeProps & {
  /**
   * Visible plain-string heading, not a native tooltip. Must contain non-whitespace text;
   * otherwise the entire header is omitted, with a development warning.
   * @control text
   */
  title: string;
  /**
   * Context before the heading. Absent or whitespace-only text is omitted;
   * nonblank supplied text is preserved without a decorative diamond.
   * @control text
   */
  eyebrow?: string;
  /**
   * Native h1–h6 rank; never changes the compact heading-small recipe.
   * @default 1
   * @control select
   */
  level?: PageHeaderLevel;
  /**
   * One direct Button (including asChild links), or one supplied ButtonGroup variant="spaced"
   * with at least two direct supported children. Rendered unchanged, never cloned or parsed.
   * Null, undefined and booleans omit the action area. Arrays, fragments, arbitrary wrappers
   * and nested groups are unsupported; JSX type erasure cannot enforce target identity.
   * @control false
   * @controlReason Non-serializable ReactElement/boolean union; see SingleAction and WithActions.
   */
  actions?: PageHeaderActions | null | boolean;
  /**
   * One direct IconButton, including its asChild link, rendered unchanged before the text.
   * Null, undefined and booleans omit the area. Arrays, fragments and wrappers are unsupported;
   * JSX type erasure cannot enforce component identity. The child owns its name and behavior.
   * @control false
   * @controlReason Non-serializable ReactElement/boolean union; see LeadingAction and Combined.
   */
  leadingAction?: PageHeaderLeadingAction | null | boolean;
  /**
   * Optional plain page-purpose text after the heading. Blank text is omitted; nonblank text
   * is preserved verbatim and is not added to the heading's accessible name.
   * @control text
   */
  lede?: string;
};

export const pageHeaderVariants = cva(
  'eg-page-header flex min-w-0 flex-wrap items-center justify-between gap-x-6 gap-y-4'
);
export const pageHeaderStartVariants = cva('flex min-w-0 grow basis-[calc(var(--space-24)*3)] items-start gap-3');
export const pageHeaderLeadingVariants = cva('flex-none');
export const pageHeaderTextVariants = cva('min-w-0', {
  variants: {
    nested: { false: 'grow basis-[calc(var(--space-24)*3)]', true: 'flex-1' }
  },
  defaultVariants: { nested: false }
});
export const pageHeaderHeadingVariants = cva('font-sans text-heading-small text-fg-default m-0 wrap-anywhere');
export const pageHeaderEyebrowVariants = cva('font-display text-label-eyebrow uppercase text-fg-muted m-0');
export const pageHeaderLedeVariants = cva('m-0 min-w-0 font-sans text-body-default text-fg-secondary wrap-anywhere');
export const pageHeaderActionsVariants = cva('min-w-0 max-w-full');
