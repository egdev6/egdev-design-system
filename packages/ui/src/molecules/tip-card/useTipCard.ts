import { type ComponentPropsWithoutRef, useId } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type TipCardLevel,
  type TipCardProps,
  tipCardCapVariants,
  tipCardTitleVariants,
  tipCardVariants
} from './types';

export type UseTipCardResult = {
  valid: boolean;
  rootProps: ComponentPropsWithoutRef<'article'> & {
    'data-level': TipCardLevel;
    'aria-labelledby': string;
  };
  headingElement: `h${TipCardLevel}`;
  headingProps: { id: string; className: string };
  title: string;
  badge: string | null;
  capProps: { className: string };
};

/** Normalize title and badge, strip protected native semantics and compose each part. */
export function useTipCard({
  title,
  level = 3,
  badge,
  src,
  alt,
  focalPoint,
  className,
  ...native
}: TipCardProps): UseTipCardResult {
  const headingId = useId();
  const valid = typeof title === 'string' && title.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('TipCard requires a non-empty title. Nothing was rendered.');
  }
  const rank: TipCardLevel = [2, 3, 4, 5, 6].includes(level) ? level : 3;
  const badgeText = typeof badge === 'string' && badge.trim().length > 0 ? badge : null;
  // Remove protected native semantics even at untyped/JavaScript boundaries; children is stripped
  // because the poster's content is entirely prop-driven (cover, badge, heading).
  const {
    children: _children,
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
      'data-level': rank,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'sm', radius: 'xl' }),
        tipCardVariants(),
        className
      )
    },
    headingElement: `h${rank}`,
    headingProps: {
      id: headingId,
      className: cn(tipCardTitleVariants())
    },
    title,
    badge: badgeText,
    capProps: { className: cn(tipCardCapVariants()) }
  };
}
