import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

type ProductMarkOwnProps = {
  /**
   * One or two visible characters that identify the product, for example `M` or `Cr`. Longer
   * monograms are unsupported: they are not truncated. Hidden from assistive technology.
   * @control text
   */
  monogram: string;
  /**
   * Product name, or link purpose in link mode, for example `Mando` or `Mando home`. It is the
   * accessible name of the mark.
   * @control text
   */
  label: string;
};

// Union branches merge their JSDoc in docgen: repeat the same @control on both branches.
/** Link mode: a native anchor that names its destination. */
export type ProductMarkLinkProps = ProductMarkOwnProps &
  Omit<
    ComponentPropsWithoutRef<'a'>,
    'children' | 'href' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML'
  > & {
    /**
     * Destination of the native link. When absent, the mark renders a passive `role="img"` tile.
     * @control text
     */
    href: string;
  };

/** Image mode: a passive tile named by its label. */
export type ProductMarkImageProps = ProductMarkOwnProps &
  Omit<
    ComponentPropsWithoutRef<'span'>,
    'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-hidden' | 'dangerouslySetInnerHTML'
  > & {
    /**
     * Destination of the native link. When absent, the mark renders a passive `role="img"` tile.
     * @control text
     */
    href?: undefined;
  };

/** Square product monogram tile: passive image by default, native link with `href`. */
export type ProductMarkProps = ProductMarkLinkProps | ProductMarkImageProps;

/** Product-mark Material recipe: primary gradient fill, primary bevel and halo, black display text. */
export const productMarkVariants = cva(
  'eg-product-mark inline-flex size-10 shrink-0 items-center justify-center rounded-md bg-(image:--gradient-btn-primary) shadow-btn-primary text-action-primary-solid-fg font-display text-heading-small no-underline',
  {
    variants: {
      // Link focus replaces the material shadow with the focus ring; the image tile is not focusable.
      link: { true: 'focus-visible:outline-none focus-visible:shadow-focus', false: '' }
    },
    defaultVariants: { link: false }
  }
);
