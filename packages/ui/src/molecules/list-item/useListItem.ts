import * as SlotPrimitive from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type {
  ListItemPartProps,
  ListItemProps,
  ListItemSize,
  ListItemStatus,
  ListItemTitleLevel,
  ListItemTitleProps,
  ListItemVariant
} from './types';
import { listItemPartVariants, listItemVariants } from './types';

type ProtectedPartProps = {
  role?: unknown;
  tabIndex?: unknown;
  contentEditable?: unknown;
  dangerouslySetInnerHTML?: unknown;
  ref?: unknown;
};
type ProtectedRootProps = ProtectedPartProps & {
  'aria-selected'?: unknown;
  'aria-pressed'?: unknown;
  'aria-disabled'?: unknown;
};

export type UseListItemResult = {
  component: 'div' | typeof SlotPrimitive.Root;
  children: ReactNode;
  rootProps: ComponentPropsWithoutRef<'div'> & {
    className: string;
    'data-state': ListItemStatus;
    'data-variant': ListItemVariant;
    'data-size': ListItemSize;
  };
};

/** Normalize untyped enum inputs without owning transitions or validating a child tree. */
export function useListItem(props: ListItemProps): UseListItemResult {
  const {
    status = 'default',
    variant = 'card',
    size = 'md',
    asChild = false,
    children,
    className,
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _editable,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    'aria-selected': _selected,
    'aria-pressed': _pressed,
    'aria-disabled': _disabled,
    ...rest
  } = props as ListItemProps & ProtectedRootProps;
  const statuses: ListItemStatus[] = ['default', 'new', 'failed', 'done', 'empty', 'dragging', 'off'];
  const variants: ListItemVariant[] = ['card', 'compact', 'row', 'editorial', 'editorial-divided'];
  const sizes: ListItemSize[] = ['md', 'sm'];
  const normalizedStatus = statuses.includes(status) ? status : 'default';
  const normalizedVariant = normalizedStatus === 'empty' || !variants.includes(variant) ? 'card' : variant;
  const normalizedSize = sizes.includes(size) ? size : 'md';
  return {
    component: asChild ? SlotPrimitive.Root : 'div',
    children,
    rootProps: {
      ...rest,
      'data-state': normalizedStatus,
      'data-variant': normalizedVariant,
      'data-size': normalizedSize,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }),
        listItemVariants(),
        className
      )
    }
  };
}

type Part = 'body' | 'content' | 'media' | 'footer' | 'meta' | 'actions' | 'leading' | 'title' | 'trailing';

/** Shared typed part composition; Media alone composes Surface's recessed well. */
export function useListItemPart(part: Part, props: ListItemPartProps): ComponentPropsWithoutRef<'div'> {
  const {
    className,
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _editable,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    ...rest
  } = props as ListItemPartProps & ProtectedPartProps;
  return {
    ...rest,
    className: cn(
      part === 'media' && surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }),
      listItemPartVariants({ part }),
      className
    )
  };
}

export type UseListItemTitleResult = {
  component: `h${ListItemTitleLevel}`;
  titleProps: ComponentPropsWithoutRef<'h2'> & { className: string };
};

/** Heading rank is consumer-owned; typography and marker stay in the part recipe. */
export function useListItemTitle(props: ListItemTitleProps): UseListItemTitleResult {
  const {
    level = 3,
    className,
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _editable,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    ...rest
  } = props as ListItemTitleProps & ProtectedPartProps;
  const ranks: ListItemTitleLevel[] = [2, 3, 4, 5, 6];
  const rank = ranks.includes(level) ? level : 3;
  return {
    component: `h${rank}`,
    titleProps: {
      ...rest,
      className: cn(listItemPartVariants({ part: 'title' }), className)
    }
  };
}
