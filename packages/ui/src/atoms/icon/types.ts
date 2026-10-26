import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Closed system icon set: 25 Foundation glyphs plus 17 Lucide additions. */
export type IconName =
  | 'github'
  | 'youtube'
  | 'twitch'
  | 'x'
  | 'linkedin'
  | 'instagram'
  | 'search'
  | 'arrow-right'
  | 'arrow-up-right'
  | 'arrow-down'
  | 'play'
  | 'users'
  | 'menu'
  | 'radio'
  | 'terminal'
  | 'hammer'
  | 'compass'
  | 'alert'
  | 'close'
  | 'user'
  | 'bookmark'
  | 'bell'
  | 'settings'
  | 'log-out'
  | 'chevron-down'
  | 'calendar'
  | 'inbox'
  | 'lightbulb'
  | 'shuffle'
  | 'pause'
  | 'pencil'
  | 'send'
  | 'grip'
  | 'upload'
  | 'flask'
  | 'plug'
  | 'bot'
  | 'trash'
  | 'copy'
  | 'check'
  | 'minus'
  | 'plus';

export type IconSize = 'sm' | 'md' | 'lg';

/** Geometry, paint and naming attributes stay component-owned so presets and accessibility hold. */
type IconNativeProps = Omit<
  ComponentPropsWithoutRef<'svg'>,
  | 'children'
  | 'viewBox'
  | 'role'
  | 'aria-hidden'
  | 'aria-label'
  | 'aria-labelledby'
  | 'focusable'
  | 'fill'
  | 'stroke'
  | 'strokeWidth'
  | 'width'
  | 'height'
  | 'dangerouslySetInnerHTML'
>;

/** Inline system glyph inheriting currentColor; decorative unless labelled. */
export type IconProps = IconNativeProps & {
  /**
   * Glyph to draw from the closed system icon set.
   * @control select
   */
  name: IconName;
  /**
   * Preset square size: sm 16px, md 20px (--icon-size), lg 28px. Containers needing other
   * sizes pass a spacing-scale size-* utility in className, which wins over the preset.
   * @control select
   * @default md
   */
  size?: IconSize;
  /**
   * Fills the glyph with currentColor in addition to its stroke, e.g. a solid play triangle.
   * @control boolean
   * @default false
   */
  filled?: boolean;
  /**
   * Accessible name for an informative icon, exposed through Radix AccessibleIcon. When
   * omitted or empty, the icon is decorative and hidden from assistive technology.
   * @control text
   */
  label?: string;
};

export const iconVariants = cva(
  'eg-icon inline-block shrink-0 align-middle stroke-current stroke-(length:--icon-stroke)',
  {
    variants: {
      size: { sm: 'size-4', md: 'size-(--icon-size)', lg: 'size-7' },
      filled: { true: 'fill-current', false: 'fill-none' }
    },
    defaultVariants: { size: 'md', filled: false }
  }
);
