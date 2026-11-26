import type { ComponentPropsWithoutRef } from 'react';
import type { IconName } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import {
  type EmptyStateLevel,
  type EmptyStateProps,
  emptyStateActionsVariants,
  emptyStateDescriptionVariants,
  emptyStateIconVariants,
  emptyStateTitleVariants,
  emptyStateVariants
} from './types';

export type UseEmptyStateResult = {
  valid: boolean;
  rootProps: ComponentPropsWithoutRef<'div'>;
  headingElement: `h${EmptyStateLevel}`;
  title: string;
  description: string | null;
  iconName: IconName | null;
  action: Exclude<EmptyStateProps['actions'], boolean | null | undefined> | null;
  iconClassName: string;
  headingClassName: string;
  descriptionClassName: string;
  actionsClassName: string;
};

/** Validate the title, resolve the passive content and compose the class of each part. */
export function useEmptyState({
  title,
  level = 3,
  description,
  icon,
  actions,
  className,
  ...rest
}: EmptyStateProps): UseEmptyStateResult {
  const valid = typeof title === 'string' && title.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('EmptyState requires a non-empty title. Nothing was rendered.');
  }
  // Any rank outside 2 to 6 (including 1, which belongs to the page header) falls back silently.
  const rank: EmptyStateLevel = [2, 3, 4, 5, 6].includes(level) ? level : 3;
  const text = typeof description === 'string' && description.trim().length > 0 ? description : null;
  const action = actions == null || typeof actions === 'boolean' ? null : actions;
  // Remove the protected native semantics even at untyped/JavaScript boundaries: the root is a passive, unnamed
  // generic container with no role, live region, focus stop or raw content, and it exposes no ref (React 19 hands
  // `ref` to a function component as an ordinary prop, which would otherwise reach the root).
  const {
    children: _children,
    role: _role,
    'aria-live': _live,
    'aria-atomic': _atomic,
    'aria-relevant': _relevant,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    dangerouslySetInnerHTML: _html,
    tabIndex: _tabIndex,
    contentEditable: _editable,
    ref: _ref,
    ...native
  } = rest as typeof rest & Record<string, unknown>;
  return {
    valid,
    rootProps: { ...native, className: cn(emptyStateVariants(), className) },
    headingElement: `h${rank}`,
    title,
    description: text,
    iconName: icon ?? null,
    action,
    iconClassName: cn(emptyStateIconVariants()),
    headingClassName: cn(emptyStateTitleVariants()),
    descriptionClassName: cn(emptyStateDescriptionVariants()),
    actionsClassName: cn(emptyStateActionsVariants())
  };
}
