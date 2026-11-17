import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type AppIconSize = 'sm' | 'md' | 'lg';

type AppIconNativeProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  | 'children'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-hidden'
  | 'tabIndex'
  | 'style'
  | 'dangerouslySetInnerHTML'
  | 'contentEditable'
  | 'onClick'
  | 'onKeyDown'
>;

/** Passive app identity. className supports outer margin, alignment and placement only. */
export type AppIconProps = AppIconNativeProps & {
  /**
   * Consumer-supplied app initials, rendered exactly as provided when the image is unavailable.
   * Supply one or two meaningful grapheme clusters.
   * @control text
   */
  monogram: string;
  /**
   * Identity image source. Empty or whitespace-only values show the monogram instead.
   * @control text
   */
  src?: string;
  /**
   * Accessible app name. An absent or blank label makes the icon decorative.
   * @control text
   */
  label?: string;
  /**
   * Square frame size.
   * @control select
   * @default md
   */
  size?: AppIconSize;
};

export const appIconVariants = cva('eg-app-icon relative inline-grid shrink-0 place-items-center overflow-hidden', {
  variants: { size: { sm: 'size-8', md: 'size-10', lg: 'size-12' } },
  defaultVariants: { size: 'md' }
});

export const appIconImageVariants = cva('size-full object-contain object-center');
export const appIconFallbackVariants = cva('grid size-full place-items-center font-sans text-fg-default', {
  variants: { size: { sm: 'text-label-default', md: 'text-body-default', lg: 'text-body-default' } },
  defaultVariants: { size: 'md' }
});
