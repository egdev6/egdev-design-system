import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import type { HeadingProps } from '../../primitives/text';
import {
  type SectionHeaderProps,
  type SectionHeaderText,
  type SectionHeaderTextRun,
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
  headingProps: Pick<HeadingProps, 'level' | 'accent' | 'accentBreak' | 'id' | 'className'> & {
    variant: 'section';
    tone: SectionHeaderProps['tone'];
  };
  title: SectionHeaderText | undefined;
  eyebrow: SectionHeaderText | undefined;
  lede: SectionHeaderText | undefined;
  showRule: boolean;
  eyebrowClassName: string;
  ledeClassName: string;
  ruleClassName: string;
};

/** Skip malformed untyped entries and retain content only when it has readable text. */
function normalizeText(value: unknown): SectionHeaderText | undefined {
  if (typeof value === 'string') {
    return value.trim() ? value : undefined;
  }
  if (!Array.isArray(value)) {
    return undefined;
  }
  const runs: SectionHeaderTextRun[] = value.filter(
    (entry): entry is SectionHeaderTextRun =>
      Array.isArray(entry) &&
      entry.length >= 1 &&
      entry.length <= 3 &&
      typeof entry[0] === 'string' &&
      (entry[1] === undefined || typeof entry[1] === 'string') &&
      (entry[2] === undefined || typeof entry[2] === 'boolean')
  );
  return runs.some(([text, , decorative]) => !decorative && text.trim()) ? runs : undefined;
}

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
  const visibleTitle = normalizeText(title);
  const renderHeader = visibleTitle !== undefined;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !renderHeader) {
    console.warn('SectionHeader requires a non-blank title; no header was rendered.');
  }
  const visibleEyebrow = normalizeText(eyebrow);
  const visibleLede = normalizeText(lede);
  const effectiveVariant =
    (variant === 'split' && !visibleLede) || (variant === 'inline' && !visibleEyebrow) ? 'stack' : variant;
  return {
    renderHeader,
    rootProps: { ...rest, className: cn(sectionHeaderVariants({ variant: effectiveVariant }), className) },
    headingProps: {
      variant: 'section',
      level,
      tone,
      accent: typeof accent === 'string' && accent.trim() ? accent : undefined,
      accentBreak,
      id: typeof titleId === 'string' && titleId.trim() ? titleId : undefined,
      className: cn(sectionHeaderHeadingVariants({ variant: effectiveVariant }))
    },
    title: visibleTitle,
    eyebrow: visibleEyebrow,
    lede: visibleLede,
    showRule: effectiveVariant === 'inline',
    eyebrowClassName: cn(sectionHeaderEyebrowVariants({ variant: effectiveVariant })),
    ledeClassName: cn(sectionHeaderLedeVariants({ variant: effectiveVariant })),
    ruleClassName: cn(sectionHeaderRuleVariants())
  };
}
