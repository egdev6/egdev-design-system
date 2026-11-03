import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** A section destination, preserved exactly as supplied. */
export type FooterNavigationItem = {
  /**
   * Native destination; empty values are omitted.
   * @control text
   */
  href: string;
  /**
   * Visible and accessible link name; blank values are omitted.
   * @control text
   */
  label: string;
};

/** Native heading rank for the navigation. */
export type FooterNavigationLevel = 2 | 3 | 4 | 5 | 6;

type RootNative = Omit<
  ComponentPropsWithoutRef<'footer'>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'style' | 'tabIndex'
>;
type PartNative = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'dangerouslySetInnerHTML'>;

/** Site footer; place outside main and sectioning content for a contentinfo landmark. */
export type FooterProps = RootNative & {
  /**
   * Optional named parts, each at most once in the documented order.
   * @control false
   * @controlReason ReactNode composition cannot be serialized; see Default and Minimal.
   */
  children: ReactNode;
};

/** Motto stage containing one non-interactive consumer Text element. */
export type FooterMottoProps = PartNative & {
  /**
   * One non-interactive Text element, including any consumer-owned accent.
   * @control false
   * @controlReason ReactElement composition cannot be serialized; see Default.
   */
  children: ReactElement;
};

/** Brand identity and optional tagline. */
export type FooterBrandProps = PartNative & {
  /**
   * Named brand element and optional descriptive copy, without nested anchors.
   * @control false
   * @controlReason ReactNode composition cannot be serialized; see Default.
   */
  children: ReactNode;
};

/** Section navigation with a visible heading and ordered destinations. */
export type FooterNavigationProps = Omit<
  ComponentPropsWithoutRef<'nav'>,
  'children' | 'dangerouslySetInnerHTML' | 'aria-label' | 'aria-labelledby'
> & {
  /**
   * Visible heading and accessible landmark name; blank omits the group.
   * @control text
   */
  label: string;
  /**
   * Heading rank selected for the host document outline.
   * @default 2
   * @control select
   */
  level?: FooterNavigationLevel;
  /**
   * Ordered destinations; invalid entries are omitted without changing valid values.
   * @control false
   * @controlReason Structured destination entries cannot be represented by a supported control; see Default and Invalid.
   */
  items: FooterNavigationItem[];
};

/** Consumer social heading and named SocialLinks list. */
export type FooterSocialProps = PartNative & {
  /**
   * Consumer heading and configured SocialLinks; use a list label and caption={null}.
   * @control false
   * @controlReason ReactNode composition cannot be serialized; see Social.
   */
  children: ReactNode;
};

/** Consumer legal and credit content in reading order. */
export type FooterLegalProps = PartNative & {
  /**
   * Legal text and optional links supplied by the host.
   * @control false
   * @controlReason ReactNode composition cannot be serialized; see Default.
   */
  children: ReactNode;
};

/** Root boundary on a host-owned background. */
export const footerVariants = cva(
  'eg-footer relative box-border p-0 pb-8 font-sans text-fg-default border-t-[length:var(--border-width)] [border-top-style:solid] border-t-border-hairline border-b-[length:var(--border-width)] [border-bottom-style:solid] border-b-border-hairline'
);
/** Motto stage resets the legacy spacing. */
export const footerMottoVariants = cva('eg-footer__stage min-w-0 px-0 pt-12 pb-10');
/** Three tracks and inclusive local two-track layout, with legacy first-child reset. */
export const footerGridVariants = cva(
  'eg-footer__grid grid min-w-0 grid-cols-[minmax(0,1.4fr)_repeat(2,minmax(0,1fr))] gap-10 pt-10 border-t-[length:var(--border-width)] [border-top-style:solid] border-t-border-hairline [@media(width<=860px)]:grid-cols-2 [@media(width<=860px)]:[&>:first-child]:col-auto [@media(width<=860px)]:[&>.footer-brand:first-child]:col-span-2'
);
/** Brand spans both tracks at the inclusive local breakpoint. */
export const footerBrandVariants = cva('footer-brand min-w-0 wrap-anywhere [@media(width<=860px)]:col-span-2');
/** Navigation layout and wrapping. */
export const footerNavigationVariants = cva('min-w-0 wrap-anywhere');
/** Social content remains consumer-owned. */
export const footerSocialVariants = cva('min-w-0 wrap-anywhere');
/** Legal row explicitly matches retained legacy layout and uses token typography. */
export const footerLegalVariants = cva(
  'eg-footer__legal flex min-w-0 flex-wrap justify-between gap-4 mt-12 pt-5 border-t-[length:var(--border-width)] [border-top-style:solid] border-t-border-hairline text-body-default text-fg-muted wrap-anywhere'
);
/** Visible navigation heading. */
export const footerHeadingVariants = cva(
  'm-0 mb-4 font-display text-label-eyebrow text-fg-secondary uppercase wrap-anywhere'
);
/** Native list reset independent of preflight. */
export const footerListVariants = cva('m-0 p-0 list-none');
