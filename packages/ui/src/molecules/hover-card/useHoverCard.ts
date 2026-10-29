import type * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { cn } from '../../lib/cn';
import type { HoverCardContentProps, HoverCardProps, HoverCardTriggerProps } from './types';
import { hoverCardContentVariants, hoverCardTriggerVariants } from './types';

/** D8: Radix requires positioning numbers; both correspond to the existing --space-2 (8px). */
const SIDE_OFFSET = 8;
const COLLISION_PADDING = 8;

/** Only the approved Root state surface reaches Radix; retain its native 700/300ms timers. */
export function useHoverCard({
  children,
  open,
  defaultOpen = false,
  onOpenChange
}: HoverCardProps): HoverCardPrimitive.HoverCardProps {
  return { children, open, defaultOpen, onOpenChange };
}

type TriggerOwnedProps = { 'data-state'?: unknown };

/** Resolve the anchor/slot and per-part classes without intercepting native Radix events. */
export function useHoverCardTrigger(props: HoverCardTriggerProps): HoverCardPrimitive.HoverCardTriggerProps {
  const {
    asChild = false,
    className,
    'data-state': _state,
    ...rest
  } = props as HoverCardTriggerProps & TriggerOwnedProps;
  return { ...rest, asChild, className: cn(hoverCardTriggerVariants(), className) };
}

type ContentOwnedKey =
  | 'ref'
  | 'role'
  | 'tabIndex'
  | 'aria-live'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'asChild'
  | 'forceMount'
  | 'container'
  | 'sideOffset'
  | 'alignOffset'
  | 'collisionPadding'
  | 'avoidCollisions'
  | 'collisionBoundary'
  | 'sticky'
  | 'hideWhenDetached'
  | 'updatePositionStrategy'
  | 'onEscapeKeyDown'
  | 'onPointerDownOutside'
  | 'onFocusOutside'
  | 'onInteractOutside'
  | 'data-state'
  | 'data-side'
  | 'data-align';

/** Drop unsupported injection from untyped consumers as well as protecting the public types. */
export function useHoverCardContent(props: HoverCardContentProps): HoverCardPrimitive.HoverCardContentProps {
  const {
    side = 'top',
    align = 'start',
    className,
    ref: _ref,
    role: _role,
    tabIndex: _tabIndex,
    'aria-live': _live,
    contentEditable: _editable,
    dangerouslySetInnerHTML: _html,
    asChild: _asChild,
    forceMount: _forceMount,
    container: _container,
    sideOffset: _sideOffset,
    alignOffset: _alignOffset,
    collisionPadding: _padding,
    avoidCollisions: _avoid,
    collisionBoundary: _boundary,
    sticky: _sticky,
    hideWhenDetached: _hide,
    updatePositionStrategy: _strategy,
    onEscapeKeyDown: _escape,
    onPointerDownOutside: _pointerOutside,
    onFocusOutside: _focusOutside,
    onInteractOutside: _interactOutside,
    'data-state': _state,
    'data-side': _side,
    'data-align': _align,
    ...rest
  } = props as HoverCardContentProps & Partial<Record<ContentOwnedKey, unknown>>;
  return {
    ...rest,
    side,
    align,
    sideOffset: SIDE_OFFSET,
    collisionPadding: COLLISION_PADDING,
    className: cn(hoverCardContentVariants(), className)
  };
}
