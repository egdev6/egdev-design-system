import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import type { IconName } from '../icon';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

type AvatarNativeProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-hidden' | 'dangerouslySetInnerHTML'
>;

/** Passive identity disc. className supports outer margin/alignment and token-valued --eg-avatar-ring only. */
export type AvatarProps = AvatarNativeProps & {
  /**
   * Photo URL. When absent or unavailable, Radix shows the user glyph.
   * @control text
   */
  src?: string;
  /**
   * Person or channel name. Without a label the whole avatar is decorative.
   * Include network and paused meaning here or in adjacent text when applicable.
   * @control text
   */
  label?: string;
  /**
   * Disc diameter: sm 24px, md 30px, lg 40px, xl 48px.
   * @control select
   * @default md
   */
  size?: AvatarSize;
  /**
   * Decorative network glyph in a corner badge. Omitted when absent.
   * @control select
   */
  badgeIcon?: IconName;
  /**
   * De-emphasizes a paused entity; also communicate the meaning in label or adjacent text.
   * @control boolean
   * @default false
   */
  paused?: boolean;
};

export const avatarVariants = cva(
  'eg-avatar relative inline-grid shrink-0 place-items-center rounded-full bg-linear-135 from-bg-deep to-primitive-red-neon text-fg-default data-[state=paused]:grayscale data-[state=paused]:opacity-60',
  {
    variants: { size: { sm: 'size-6', md: 'size-7.5', lg: 'size-10', xl: 'size-12' } },
    defaultVariants: { size: 'md' }
  }
);

export const avatarImageVariants = cva('size-full rounded-full object-cover');
export const avatarFallbackVariants = cva('grid size-full place-items-center');
export const avatarFallbackIconVariants = cva('', {
  variants: { size: { sm: 'size-3.25', md: 'size-4', lg: 'size-(--icon-size)', xl: 'size-6' } },
  defaultVariants: { size: 'md' }
});
export const avatarBadgeVariants = cva(
  'eg-avatar__badge absolute -right-1 -bottom-1 grid place-items-center rounded-full bg-bg-canvas text-fg-default ring-2 ring-[var(--eg-avatar-ring,var(--color-bg-surface))]',
  {
    variants: { size: { sm: 'size-4.5', md: 'size-4.5', lg: 'size-4.5', xl: 'size-5.5' } },
    defaultVariants: { size: 'md' }
  }
);
export const avatarBadgeIconVariants = cva('', {
  variants: { size: { sm: 'size-2.75', md: 'size-2.75', lg: 'size-2.75', xl: 'size-3.25' } },
  defaultVariants: { size: 'md' }
});
