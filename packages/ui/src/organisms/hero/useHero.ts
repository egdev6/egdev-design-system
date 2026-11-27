import { Children } from 'react';
import { cn } from '../../lib/cn';
import {
  type HeroProps,
  heroActionsVariants,
  heroCopyVariants,
  heroEyebrowVariants,
  heroHeadingVariants,
  heroLedeVariants,
  heroMediaVariants,
  heroSlotVariants,
  heroSocialVariants,
  heroVariants
} from './types';

export function useHero({
  title,
  level,
  titleVariant,
  id,
  eyebrow,
  accent,
  lede,
  children,
  media,
  social,
  className,
  ...native
}: HeroProps) {
  const hasMedia = Children.toArray(media).length > 0;
  const hasActions = Children.toArray(children).length > 0;
  const hasSocial = Children.toArray(social).length > 0;
  // Only 'show' selects the smaller recipe; any other runtime value, including null, resolves to the default.
  const titleRecipe: NonNullable<HeroProps['titleVariant']> = titleVariant === 'show' ? 'show' : 'hero';
  const safeNative = Object.fromEntries(
    Object.entries(native).filter(
      ([key]) => !['role', 'style', 'dangerouslySetInnerHTML', 'ref', 'asChild'].includes(key)
    )
  );
  return {
    title,
    level,
    titleVariant: titleRecipe,
    id,
    eyebrow,
    accent,
    lede,
    children,
    media,
    social,
    hasMedia,
    hasActions,
    hasSocial,
    rootProps: { ...safeNative, className: cn(heroVariants({ media: hasMedia }), className) },
    copyClass: cn(heroCopyVariants()),
    eyebrowClass: cn(heroEyebrowVariants()),
    headingClass: cn(heroHeadingVariants()),
    ledeClass: cn(heroLedeVariants()),
    actionsClass: cn(heroActionsVariants()),
    socialClass: cn(heroSocialVariants()),
    mediaClass: cn(heroMediaVariants()),
    slotClass: cn(heroSlotVariants())
  };
}
