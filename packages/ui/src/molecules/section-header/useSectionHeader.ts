import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import type { HeadingProps } from '../../primitives/text';
import {
  type SectionHeaderProps,
  sectionHeaderEyebrowVariants,
  sectionHeaderHeadingVariants,
  sectionHeaderLedeVariants,
  sectionHeaderRuleVariants,
  sectionHeaderVariants
} from './types';

type OwnedProps = { children?: unknown; dangerouslySetInnerHTML?: unknown };

type UseSectionHeaderResult = {
  renderHeader: boolean;
  rootProps: ComponentPropsWithoutRef<'header'>;
  headingProps: HeadingProps;
  eyebrow: string | undefined;
  lede: string | undefined;
  showRule: boolean;
  eyebrowClassName: string;
  ledeClassName: string;
  ruleClassName: string;
};

/** Resolve optional parts, effective layout and explicit primitive defaults without state or effects. */
export function useSectionHeader(props: SectionHeaderProps): UseSectionHeaderResult {
  const {
    title,
    eyebrow,
    accent,
    accentBreak = false,
    lede,
    variant = 'stack',
    level = 2,
    titleId,
    tone = 'canvas',
    className,
    children: _children,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = props as SectionHeaderProps & OwnedProps;
  const renderHeader = Boolean(title.trim());
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !renderHeader) {
    console.warn('SectionHeader requires a non-blank title; no header was rendered.');
  }
  const visibleEyebrow = eyebrow?.trim() ? eyebrow : undefined;
  const visibleLede = lede?.trim() ? lede : undefined;
  const effectiveVariant =
    (variant === 'split' && !visibleLede) || (variant === 'inline' && !visibleEyebrow) ? 'stack' : variant;
  return {
    renderHeader,
    rootProps: { ...rest, className: cn(sectionHeaderVariants({ variant: effectiveVariant }), className) },
    headingProps: {
      children: title,
      variant: 'section',
      level,
      tone,
      accent: accent?.trim() ? accent : undefined,
      accentBreak,
      id: titleId?.trim() ? titleId : undefined,
      className: cn(sectionHeaderHeadingVariants({ variant: effectiveVariant }))
    },
    eyebrow: visibleEyebrow,
    lede: visibleLede,
    showRule: effectiveVariant === 'inline',
    eyebrowClassName: cn(sectionHeaderEyebrowVariants({ variant: effectiveVariant })),
    ledeClassName: cn(sectionHeaderLedeVariants({ variant: effectiveVariant })),
    ruleClassName: cn(sectionHeaderRuleVariants())
  };
}
