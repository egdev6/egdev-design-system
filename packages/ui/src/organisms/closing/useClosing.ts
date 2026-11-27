import type { ComponentPropsWithoutRef } from 'react';
import { Children } from 'react';
import { cn } from '../../lib/cn';
import {
  type ClosingProps,
  closingActionsVariants,
  closingCopyVariants,
  closingGridVariants,
  closingHeadingVariants,
  closingLedeVariants,
  closingMediaVariants,
  closingVariants
} from './types';

/** Derive part classes and exclude protected native attributes even from untyped callers. */
export function useClosing(props: ClosingProps) {
  const {
    title,
    level,
    titleVariant,
    eyebrow,
    accent,
    lede,
    media,
    children,
    id,
    className,
    role: _role,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ...native
  } = props as ClosingProps & Pick<ComponentPropsWithoutRef<'div'>, 'role' | 'style' | 'dangerouslySetInnerHTML'>;
  const hasMedia = Children.toArray(media).length > 0;
  // Only 'show' selects the smaller recipe; any other runtime value, including null, resolves to the default.
  const titleRecipe: NonNullable<ClosingProps['titleVariant']> = titleVariant === 'show' ? 'show' : 'hero';
  return {
    title,
    level,
    titleVariant: titleRecipe,
    eyebrow,
    accent,
    lede,
    media,
    children,
    id,
    rootProps: { ...native, className: cn(closingVariants(), className) },
    hasMedia,
    grid: cn(closingGridVariants({ media: hasMedia })),
    copy: cn(closingCopyVariants()),
    heading: cn(closingHeadingVariants()),
    ledeClass: cn(closingLedeVariants()),
    actions: cn(closingActionsVariants()),
    mediaClass: cn(closingMediaVariants())
  };
}
