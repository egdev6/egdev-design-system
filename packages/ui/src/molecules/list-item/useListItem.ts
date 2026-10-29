import * as SlotPrimitive from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { ListItemPartProps, ListItemProps, ListItemStatus, ListItemVariant } from './types';
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
  };
};

/** Normalize untyped enum inputs without owning transitions or validating a child tree. */
export function useListItem(props: ListItemProps): UseListItemResult {
  const {
    status = 'default',
    variant = 'card',
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
  const variants: ListItemVariant[] = ['card', 'compact', 'row'];
  const normalizedStatus = statuses.includes(status) ? status : 'default';
  const normalizedVariant = normalizedStatus === 'empty' || !variants.includes(variant) ? 'card' : variant;
  return {
    component: asChild ? SlotPrimitive.Root : 'div',
    children,
    rootProps: {
      ...rest,
      'data-state': normalizedStatus,
      'data-variant': normalizedVariant,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }),
        listItemVariants(),
        className
      )
    }
  };
}

type Part = 'body' | 'content' | 'media' | 'footer' | 'meta' | 'actions';

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
