import { type ComponentPropsWithoutRef, useId } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type ProjectCardCodeLine,
  type ProjectCardLevel,
  type ProjectCardProps,
  type ProjectCardSize,
  type ProjectCardVariant,
  projectCardBodyVariants,
  projectCardCodeGlyphVariants,
  projectCardCodeLineVariants,
  projectCardCodeVariants,
  projectCardEyebrowVariants,
  projectCardFootVariants,
  projectCardHeadingVariants,
  projectCardIndexVariants,
  projectCardTagsVariants,
  projectCardVariants
} from './types';

export type UseProjectCardResult = {
  valid: boolean;
  rootProps: ComponentPropsWithoutRef<'article'> & {
    'data-variant': ProjectCardVariant;
    'data-size': ProjectCardSize;
    'aria-labelledby': string;
  };
  headingElement: `h${ProjectCardLevel}`;
  headingProps: { id: string; className: string };
  title: string;
  index: string | null;
  indexProps: { 'aria-hidden': true; className: string };
  eyebrow: string | null;
  eyebrowProps: { className: string };
  children: React.ReactNode;
};

/** Normalize name and editorial slots, strip protected native semantics and compose each part. */
export function useProjectCard({
  title,
  level = 3,
  eyebrow,
  index,
  variant = 'default',
  size = 'md',
  children,
  className,
  ...native
}: ProjectCardProps): UseProjectCardResult {
  const headingId = useId();
  const valid = typeof title === 'string' && title.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('ProjectCard requires a non-empty title. Nothing was rendered.');
  }
  const effectiveVariant = variant === 'featured' ? 'featured' : 'default';
  const effectiveSize = size === 'sm' ? 'sm' : 'md';
  const rank: ProjectCardLevel = [2, 3, 4, 5, 6].includes(level) ? level : 3;
  const eyebrowText = typeof eyebrow === 'string' && eyebrow.trim().length > 0 ? eyebrow : null;
  const indexText = typeof index === 'string' && index.trim().length > 0 ? index : null;
  // Remove protected native semantics even at untyped/JavaScript boundaries.
  const {
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _editable,
    dangerouslySetInnerHTML: _html,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    'aria-disabled': _disabled,
    'aria-selected': _selected,
    'aria-pressed': _pressed,
    'aria-live': _live,
    ref: _ref,
    ...rest
  } = native as typeof native & Record<string, unknown>;
  return {
    valid,
    rootProps: {
      ...rest,
      'aria-labelledby': headingId,
      'data-variant': effectiveVariant,
      'data-size': effectiveSize,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'md', radius: 'xl' }),
        projectCardVariants({ variant: effectiveVariant, size: effectiveSize }),
        projectCardBodyVariants(),
        className
      )
    },
    headingElement: `h${rank}`,
    headingProps: {
      id: headingId,
      className: cn(projectCardHeadingVariants({ size: effectiveSize }))
    },
    title,
    index: indexText,
    indexProps: {
      'aria-hidden': true,
      className: cn(projectCardIndexVariants({ variant: effectiveVariant, size: effectiveSize }))
    },
    eyebrow: eyebrowText,
    eyebrowProps: { className: cn(projectCardEyebrowVariants()) },
    children
  };
}

export type UseProjectCardTagsResult = {
  listProps: ComponentPropsWithoutRef<'ul'>;
  items: string[];
};

/** Compose the tag list: one static Chip per supplied label. */
export function useProjectCardTags({
  items,
  className
}: {
  items: string[];
  className?: string;
}): UseProjectCardTagsResult {
  return { listProps: { className: cn(projectCardTagsVariants(), className) }, items };
}

export type UseProjectCardCodeResult = {
  preProps: ComponentPropsWithoutRef<'pre'>;
  lines: ProjectCardCodeLine[];
  lineProps: (line: ProjectCardCodeLine) => { className: string };
  glyphProps: { 'aria-hidden': true; className: string };
};

/** Compose the labelled mono well and resolve each line's kind, prompt glyph and muted comment. */
export function useProjectCardCode({
  label,
  items,
  className
}: {
  label: string;
  items: ProjectCardCodeLine[];
  className?: string;
}): UseProjectCardCodeResult {
  return {
    preProps: {
      'aria-label': label,
      className: cn(
        surfaceVariants({ tone: 'well', padding: 'sm', radius: 'md' }),
        projectCardCodeVariants(),
        className
      )
    },
    lines: items,
    lineProps: (line) => ({
      className: cn(projectCardCodeLineVariants({ kind: line.kind === 'comment' ? 'comment' : 'command' }))
    }),
    glyphProps: { 'aria-hidden': true, className: cn(projectCardCodeGlyphVariants()) }
  };
}

export type UseProjectCardFooterResult = {
  footProps: ComponentPropsWithoutRef<'div'>;
  children: React.ReactNode;
};

/** Compose the footer zone for the card's single supplied action. */
export function useProjectCardFooter({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}): UseProjectCardFooterResult {
  return { footProps: { className: cn(projectCardFootVariants(), className) }, children };
}
