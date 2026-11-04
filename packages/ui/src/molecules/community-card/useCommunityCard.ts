import type { ReactElement, ReactNode } from 'react';
import { Children, type ComponentPropsWithoutRef, type FC, Fragment, isValidElement, useId } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type CommunityCardActionProps,
  type CommunityCardLevel,
  type CommunityCardMarkProps,
  type CommunityCardProps,
  communityCardActionVariants,
  communityCardBandVariants,
  communityCardBodyVariants,
  communityCardEyebrowTextVariants,
  communityCardEyebrowVariants,
  communityCardMarkVariants,
  communityCardTitleVariants,
  communityCardTopRowVariants,
  communityCardVariants
} from './types';

export type UseCommunityCardResult = {
  valid: boolean;
  rootProps: ComponentPropsWithoutRef<'article'> & {
    'data-level': CommunityCardLevel;
    'aria-labelledby': string;
  };
  bandProps: ComponentPropsWithoutRef<'div'>;
  topRowProps: ComponentPropsWithoutRef<'div'>;
  eyebrowProps: ComponentPropsWithoutRef<'span'>;
  eyebrowTextProps: ComponentPropsWithoutRef<'span'>;
  headingElement: `h${CommunityCardLevel}`;
  headingProps: { id: string; className: string };
  title: string;
  eyebrow: string | null;
  marks: ReactElement[];
  bodyProps: ComponentPropsWithoutRef<'div'>;
  bodyChildren: ReactNode[];
};

/** Depth-first child partition: fragments open into their children, mark parts hoist, the rest
 * keeps reading order. Keys stay with the original elements; the renderer adds positional keys. */
function partitionChildren(
  node: ReactNode,
  markComponent: FC<CommunityCardMarkProps>,
  marks: ReactElement[],
  restNodes: ReactNode[]
): void {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) {
      restNodes.push(child);
      return;
    }
    if (child.type === Fragment) {
      partitionChildren((child.props as { children?: ReactNode }).children, markComponent, marks, restNodes);
      return;
    }
    if (child.type === markComponent) {
      marks.push(child);
    } else {
      restNodes.push(child);
    }
  });
}

/** Normalize name and eyebrow, hoist direct mark parts into the band, strip protected native
 * semantics and compose each part. */
export function useCommunityCard(
  { title, level = 3, eyebrow, children, className, ...native }: CommunityCardProps,
  markComponent: FC<CommunityCardMarkProps>
): UseCommunityCardResult {
  const headingId = useId();
  const valid = typeof title === 'string' && title.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('CommunityCard requires a non-empty title. Nothing was rendered.');
  }
  const rank: CommunityCardLevel = [2, 3, 4, 5, 6].includes(level) ? level : 3;
  const eyebrowText = typeof eyebrow === 'string' && eyebrow.trim().length > 0 ? eyebrow : null;
  const marks: ReactElement[] = [];
  const restNodes: ReactNode[] = [];
  partitionChildren(children, markComponent, marks, restNodes);
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
    style: _style,
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
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }),
        communityCardVariants(),
        className
      )
    },
    bandProps: {
      className: cn(
        surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }),
        communityCardBandVariants()
      )
    },
    topRowProps: { className: cn(communityCardTopRowVariants()) },
    eyebrowProps: { className: cn(communityCardEyebrowVariants()) },
    eyebrowTextProps: { className: cn(communityCardEyebrowTextVariants()) },
    headingElement: `h${rank}`,
    headingProps: { id: headingId, className: cn(communityCardTitleVariants()) },
    title,
    eyebrow: eyebrowText,
    marks,
    bodyProps: { className: cn(communityCardBodyVariants()) },
    bodyChildren: restNodes
  };
}

export type UseCommunityCardMarkResult = {
  slotProps: ComponentPropsWithoutRef<'div'>;
  children: ReactElement;
};

/** Compose the consumer mark slot rendered inside the header band's top row. */
export function useCommunityCardMark({ children, className }: CommunityCardMarkProps): UseCommunityCardMarkResult {
  return { slotProps: { className: cn(communityCardMarkVariants(), className) }, children };
}

export type UseCommunityCardActionResult = {
  actionProps: ComponentPropsWithoutRef<'div'>;
  children: ReactElement;
};

/** Compose the bottom-edge zone for the card's single supplied action. */
export function useCommunityCardAction({
  children,
  className
}: CommunityCardActionProps): UseCommunityCardActionResult {
  return { actionProps: { className: cn(communityCardActionVariants(), className) }, children };
}
