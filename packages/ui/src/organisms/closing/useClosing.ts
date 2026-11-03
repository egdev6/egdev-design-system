import type { ComponentPropsWithoutRef } from 'react';
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
  return {
    title,
    level,
    eyebrow,
    accent,
    lede,
    media,
    children,
    id,
    rootProps: { ...native, className: cn(closingVariants(), className) },
    grid: cn(closingGridVariants()),
    copy: cn(closingCopyVariants()),
    heading: cn(closingHeadingVariants()),
    ledeClass: cn(closingLedeVariants()),
    actions: cn(closingActionsVariants()),
    mediaClass: cn(closingMediaVariants())
  };
}
