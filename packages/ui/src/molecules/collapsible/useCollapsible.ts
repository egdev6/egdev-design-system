import type * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { buttonVariants } from '@/atoms/button/types';
import { cn } from '@/lib/cn';
import {
  type CollapsibleContentProps,
  type CollapsibleHeaderProps,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  collapsibleActionsVariants,
  collapsibleCaretVariants,
  collapsibleContentVariants,
  collapsibleHeaderVariants,
  collapsibleLabelVariants,
  collapsibleTriggerVariants,
  collapsibleVariants
} from './types';

const FORBIDDEN = new Set([
  'style',
  'dangerouslySetInnerHTML',
  'contentEditable',
  'suppressContentEditableWarning',
  'aria-expanded',
  'aria-controls',
  'data-state',
  'data-disabled',
  'asChild',
  'forceMount',
  'keepMounted',
  '__scopeCollapsible',
  'ref'
]);
const ROOT_OWNED = new Set(['role', 'tabIndex']);
const TRIGGER_OWNED = new Set(['type', 'disabled', 'role', 'tabIndex', 'aria-disabled', 'aria-pressed']);
const CONTENT_OWNED = new Set(['id', 'hidden', 'tabIndex']);

/** Preserve native attributes/handlers without letting untyped spreads replace owned semantics. */
function nativeProps(props: Record<string, unknown>, owned: ReadonlySet<string>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(props).filter(([key]) => !FORBIDDEN.has(key) && !owned.has(key)));
}

type RootResult = {
  rootProps: Omit<ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>, 'children' | 'asChild'>;
  children: ReactNode;
};
type HeaderResult = {
  headerProps: ComponentPropsWithoutRef<'div'>;
  actionsProps: { className: string };
  actions: ReactNode;
  children: ReactNode;
};
type TriggerResult = {
  triggerProps: Omit<ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>, 'children' | 'asChild'>;
  labelProps: { className: string };
  caretProps: { className: string; 'aria-hidden': true };
  children: ReactNode;
};
type ContentResult = {
  contentProps: Omit<ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>, 'children' | 'asChild'>;
  children: ReactNode;
};

/** Prepare the fixed frame and pass state straight to Radix, without a second state/context engine. */
export function useCollapsible(props: CollapsibleProps): RootResult {
  const { open, defaultOpen, onOpenChange, disabled = false, children, className, ...rest } = props;
  return {
    rootProps: {
      ...nativeProps(rest, ROOT_OWNED),
      open,
      defaultOpen,
      onOpenChange,
      disabled,
      className: cn(collapsibleVariants(), className)
    },
    children
  };
}

/** Prepare an unpainted row and independent action wrapper without owning action state. */
export function useCollapsibleHeader(props: CollapsibleHeaderProps): HeaderResult {
  const { children, actions, className, ...rest } = props;
  return {
    headerProps: { ...nativeProps(rest, ROOT_OWNED), className: cn(collapsibleHeaderVariants(), className) },
    actionsProps: { className: cn(collapsibleActionsVariants()) },
    actions,
    children
  };
}

/** Reuse the neutral/md recipe only; Button/useButton would overwrite native open/closed data-state. */
export function useCollapsibleTrigger(props: CollapsibleTriggerProps): TriggerResult {
  const { children, className, motion = 'default', ...rest } = props;
  return {
    triggerProps: {
      ...nativeProps(rest, TRIGGER_OWNED),
      className: cn(
        buttonVariants({ variant: 'neutral', size: 'md' }),
        collapsibleTriggerVariants({ motion }),
        className
      )
    },
    labelProps: { className: cn(collapsibleLabelVariants()) },
    caretProps: { className: cn(collapsibleCaretVariants({ motion })), 'aria-hidden': true },
    children
  };
}

/** Radix owns its id and lifetime; retained closed content gets an explicit display reset. */
export function useCollapsibleContent(props: CollapsibleContentProps): ContentResult {
  const { children, className, padding = 'md', presence = 'unmount', ...rest } = props;
  return {
    contentProps: {
      ...nativeProps(rest, CONTENT_OWNED),
      forceMount: presence === 'keep-mounted' ? true : undefined,
      className: cn(collapsibleContentVariants({ padding, presence }), className)
    },
    children
  };
}
