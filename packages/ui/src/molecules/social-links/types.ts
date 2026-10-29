import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

/** IconButton treatments supported by the collection. */
export type SocialLinksVariant = 'outline' | 'ghost';
/** lg is touch-sized (48px); md is dense desktop only (40px). */
export type SocialLinksSize = 'md' | 'lg';
/** Existing spacing-token keys, not pixel lengths. */
export type SocialLinksGap = 1 | 2;

/** One native profile destination; no arbitrary anchor props or target override. */
export type SocialLinkItem = {
  /**
   * Non-empty stable key, unique within this collection; never emitted as a DOM id.
   * @control text
   */
  id: string;
  /**
   * Absolute HTTPS destination without credentials or raw control characters.
   * @control text
   */
  href: string;
  /**
   * Required non-empty destination name, independent of glyph and hostname.
   * @control text
   */
  label: string;
  /**
   * One decorative Icon element without its own label; normally a network glyph at md.
   * @control false
   * @controlReason Non-serializable ReactElement; see Default and MixedTargets for decorative Icon examples.
   */
  icon: ReactElement;
  /**
   * Opt into a new browsing context with secure rel and an accessible notice.
   * @default false
   * @control boolean
   */
  external?: boolean;
  /**
   * Native relation tokens; external entries always retain noopener and noreferrer.
   * @control text
   */
  rel?: string;
};

type SocialLinksNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'aria-label' | 'aria-labelledby'
>;

/**
 * Ordered social destinations with optional visible context, not a navigation landmark.
 * className supports outer margin, width/min/max width and parent placement only.
 * No ref, asChild, free children, per-part styling or item rendering callback is exposed.
 */
export type SocialLinksProps = SocialLinksNativeProps & {
  /**
   * Ordered profile entries. Empty or all-invalid entries render nothing; invalid entries warn in development.
   * @control false
   * @controlReason Structured entries contain non-serializable ReactElement icons; see Default, MixedTargets and InvalidItems.
   */
  items: SocialLinkItem[];
  /**
   * Accessible list name, separate from the caption. Blank input warns and uses Social profiles.
   * @default Social profiles
   * @control text
   */
  label?: string;
  /**
   * Visible contextual copy; null or whitespace-only omits the caption without losing the list name.
   * @default Follow me
   * @control false
   * @controlReason Nullable string cannot be represented by one text control; see WithoutCaption for null and blank examples.
   */
  caption?: string | null;
  /**
   * Arrange caption and list in a wrapping row rather than a stack; DOM order stays unchanged.
   * @default false
   * @control boolean
   */
  inline?: boolean;
  /**
   * Delegated IconButton treatment; the collection paints no surface of its own.
   * @default outline
   * @control select
   */
  variant?: SocialLinksVariant;
  /**
   * Delegated IconButton size; lg is 48px, md is 40px for dense desktop use only.
   * @default lg
   * @control select
   */
  size?: SocialLinksSize;
  /**
   * Token-key list spacing: 1 is 4px and 2 is 8px, including wrapped rows.
   * @default 2
   * @control select
   */
  gap?: SocialLinksGap;
  /**
   * Localized notice appended once to external link names. Blank input warns and uses the default notice.
   * @default (opens in a new tab)
   * @control text
   */
  newTabText?: string;
};

/** Unpainted marker and minimum intrinsic sizing; layout belongs to Stack/Cluster. */
export const socialLinksVariants = cva('eg-social min-w-0');
/** Caption typography without Text's eyebrow diamond. */
export const socialLinksCaptionVariants = cva(
  'eg-social__label m-0 font-display text-label-eyebrow text-fg-secondary uppercase'
);
/** Native list reset only; Cluster owns direction, wrapping and gap. */
export const socialLinksListVariants = cva('eg-social__list min-w-0 m-0 p-0 list-none');
/** Keep each native destination together in a direct list entry. */
export const socialLinksItemVariants = cva('flex shrink-0');
