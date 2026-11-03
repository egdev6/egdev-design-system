import { Children, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import {
  type ChapterBreakProps,
  chapterBreakCopyVariants,
  chapterBreakGridVariants,
  chapterBreakHeadingVariants,
  chapterBreakLedeVariants,
  chapterBreakMediaVariants,
  chapterBreakVariants
} from './types';

/** Derive part classes and filter protected inputs from untyped callers. */
export function useChapterBreak(props: ChapterBreakProps) {
  const {
    title,
    level,
    eyebrow,
    accent,
    lede,
    media,
    id,
    className,
    role: _role,
    style: _style,
    dangerouslySetInnerHTML: _html,
    children: _children,
    ref: _ref,
    asChild: _asChild,
    ...native
  } = props as ChapterBreakProps &
    Pick<ComponentPropsWithoutRef<'div'>, 'role' | 'style' | 'dangerouslySetInnerHTML' | 'children'> & {
      ref?: unknown;
      asChild?: unknown;
    };
  const hasMedia = Children.toArray(media).length > 0;
  return {
    title,
    level,
    eyebrow,
    accent,
    lede,
    media,
    id,
    hasMedia,
    rootProps: { ...native, className: cn(chapterBreakVariants(), className) },
    grid: cn(chapterBreakGridVariants({ media: hasMedia })),
    copy: cn(chapterBreakCopyVariants()),
    heading: cn(chapterBreakHeadingVariants()),
    ledeClass: cn(chapterBreakLedeVariants()),
    mediaClass: cn(chapterBreakMediaVariants())
  };
}
