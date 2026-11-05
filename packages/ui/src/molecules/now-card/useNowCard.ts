import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { createContext, useContext, useId } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type {
  NowCardBodyProps,
  NowCardDetailProps,
  NowCardFooterProps,
  NowCardLevel,
  NowCardProps,
  NowCardSize
} from './types';
import {
  nowCardBadgeVariants,
  nowCardBodyVariants,
  nowCardDetailValueVariants,
  nowCardDetailVariants,
  nowCardFootVariants,
  nowCardHeadingVariants,
  nowCardVariants
} from './types';

/** Density shared with the rendered parts; absent outside a card, where parts fall back to md. */
export type NowCardContextValue = { size: NowCardSize };
export const NowCardContext = createContext<NowCardContextValue | null>(null);

export type UseNowCardResult = {
  valid: boolean;
  size: NowCardSize;
  showBadge: boolean;
  badge: ReactNode;
  badgeProps: { className: string };
  rootProps: ComponentPropsWithoutRef<'article'> & {
    'data-size': NowCardSize;
    'data-badge': boolean;
    'aria-labelledby': string;
  };
  headingElement: `h${NowCardLevel}`;
  headingProps: { id: string; className: string };
  title: string;
  children: ReactNode;
};

export type UseNowCardPartResult = { className: string };

const present = (slot: ReactNode) => slot !== undefined && slot !== null && typeof slot !== 'boolean';

/** Normalize the title, name the article through the generated heading, resolve density and compose the frame. */
export function useNowCard({
  title,
  level = 3,
  size = 'md',
  statusBadge,
  children,
  className,
  ...native
}: NowCardProps): UseNowCardResult {
  const headingId = useId();
  const valid = typeof title === 'string' && title.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('NowCard requires a non-empty title. Nothing was rendered.');
  }
  const rank: NowCardLevel = [2, 3, 4, 5, 6].includes(level) ? level : 3;
  const showBadge = present(statusBadge);
  // Remove protected native semantics even at untyped/JavaScript boundaries: the heading owns the name.
  const {
    role: _role,
    style: _style,
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
    size,
    showBadge,
    badge: statusBadge,
    badgeProps: { className: cn(nowCardBadgeVariants()) },
    rootProps: {
      ...rest,
      'aria-labelledby': headingId,
      'data-size': size,
      'data-badge': showBadge,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }),
        nowCardVariants({ size }),
        className
      )
    },
    headingElement: `h${rank}`,
    headingProps: { id: headingId, className: cn(nowCardHeadingVariants({ size, badge: showBadge })) },
    title,
    children
  };
}

/** Body part composition; parts rendered outside a card fall back to md density. */
export function useNowCardBody({ className }: NowCardBodyProps): UseNowCardPartResult {
  const size = useContext(NowCardContext)?.size ?? 'md';
  return { className: cn(nowCardBodyVariants({ size }), className) };
}

/** Footer band composition: the surface-0 band under the documented banded-footer geometry. */
export function useNowCardFooter({ className }: NowCardFooterProps): UseNowCardPartResult {
  const size = useContext(NowCardContext)?.size ?? 'md';
  return {
    className: cn(
      surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }),
      nowCardFootVariants({ size }),
      className
    )
  };
}

/** Detail line composition with the emphasized <b> value utilities on the part itself. */
export function useNowCardDetail({ className }: NowCardDetailProps): UseNowCardPartResult {
  return { className: cn(nowCardDetailVariants(), nowCardDetailValueVariants(), className) };
}
