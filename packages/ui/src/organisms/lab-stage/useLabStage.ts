import { Children, type ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import {
  type LabStageProps,
  labStageCopyVariants,
  labStageExperimentVariants,
  labStageGridVariants,
  labStageHeadingVariants,
  labStageLedeVariants,
  labStageMediaVariants,
  labStageVariants
} from './types';

/** Derive parts and protect root semantics at untyped boundaries. */
export function useLabStage(props: LabStageProps) {
  const {
    title,
    level,
    titleVariant,
    eyebrow,
    accent,
    lede,
    children,
    media,
    id,
    className,
    role: _role,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    asChild: _asChild,
    ...native
  } = props as LabStageProps &
    Pick<ComponentPropsWithoutRef<'div'>, 'role' | 'style' | 'dangerouslySetInnerHTML'> & {
      ref?: unknown;
      asChild?: unknown;
    };
  const hasMedia = Children.toArray(media).length > 0;
  const hasChildren = Children.toArray(children).length > 0;
  // Only 'show' selects the smaller recipe; any other runtime value, including null, resolves to the default.
  const titleRecipe: NonNullable<LabStageProps['titleVariant']> = titleVariant === 'show' ? 'show' : 'hero';
  return {
    title,
    level,
    titleVariant: titleRecipe,
    eyebrow,
    accent,
    lede,
    children,
    media,
    id,
    hasMedia,
    hasChildren,
    rootProps: { ...native, className: cn(labStageVariants(), className) },
    grid: cn(labStageGridVariants({ media: hasMedia })),
    copy: cn(labStageCopyVariants()),
    heading: cn(labStageHeadingVariants()),
    ledeClass: cn(labStageLedeVariants()),
    experiment: cn(labStageExperimentVariants()),
    mediaClass: cn(labStageMediaVariants())
  };
}
