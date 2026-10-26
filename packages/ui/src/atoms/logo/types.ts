import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type LogoVariant = 'mark' | 'wordmark';
export type LogoSize = 'sm' | 'md' | 'lg';

/** Ink of one artwork shape: the isotype's light and shade faces, or the white name. */
export type LogoInk = 'light' | 'shade' | 'name';

type LogoOwnProps = {
  /**
   * Artwork: the isometric isotype alone (`mark`) or the isotype with the white name
   * (`wordmark`). Use the wordmark only on the canvas or surface backgrounds.
   * @control select
   * @default wordmark
   */
  variant?: LogoVariant;
  /**
   * Height preset: sm 28px, md 32px, lg 36px. The width follows the artwork ratio.
   * @control select
   * @default md
   */
  size?: LogoSize;
  /**
   * Accessible name of the image or link, for example `egdev, home` for a home link.
   * An empty or whitespace-only label also falls back to the default name.
   * @control text
   * @default egdev
   */
  label?: string;
};

type LogoLinkProps = Omit<
  ComponentPropsWithoutRef<'a'>,
  'children' | 'href' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML'
> & {
  /**
   * Link destination. Renders a native `a` that forwards anchor attributes and events;
   * client-router navigation is the consumer's (wrap an unlinked Logo instead).
   * @control text
   */
  href: string;
};

type LogoImageProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-hidden' | 'dangerouslySetInnerHTML'
> & {
  /**
   * Absent in image mode: the root is a named `span` image, not focusable. Docgen merges this
   * branch with the link branch, so both share the text directive (setting it selects link mode).
   * @control text
   */
  href?: undefined;
};

/**
 * The egdev brand logo as a named image, or as a named native link when `href` is set.
 * Artwork is inline SVG data with token inks; it is never recolored.
 */
export type LogoProps = LogoOwnProps & (LogoLinkProps | LogoImageProps);

/** Brand artwork root: no Material paint, only the height preset and the link focus ring. */
export const logoVariants = cva('eg-logo inline-block shrink-0 leading-none rounded-sm', {
  variants: {
    size: {
      sm: 'h-7',
      md: 'h-8',
      lg: 'h-9'
    },
    link: {
      true: 'focus-visible:outline-none focus-visible:shadow-focus',
      false: ''
    }
  },
  defaultVariants: { size: 'md', link: false }
});

/** Artwork fills the root height; its width follows the viewBox ratio. */
export const logoArtworkVariants = cva('block h-full w-auto');

/** Token inks of the V4 artwork (D3). Static strings so the CSS build scans them. */
export const logoInkClasses: Record<LogoInk, string> = {
  light: 'fill-(--logo-red)',
  shade: 'fill-(--logo-red-shade)',
  name: 'fill-primitive-white'
};
