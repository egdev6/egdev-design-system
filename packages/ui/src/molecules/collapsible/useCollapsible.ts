import type * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { buttonVariants } from '@/atoms/button/types';
import { cn } from '@/lib/cn';
import {
  type CollapsibleContentProps,
  type CollapsibleProps,
  type CollapsibleTriggerProps,
  collapsibleCaretVariants,
  collapsibleContentVariants,
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
type TriggerResult = {
  triggerProps: Omit<ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>, 'children' | 'asChild'>;
  labelProps: { className: string };
  caretProps: { className: string; 'aria-hidden': true };
  children: ReactNode;
};
type ContentResult = {
  contentProps: Omit<
    ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>,
    'children' | 'asChild' | 'forceMount'
  >;
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

/** Reuse the ghost/md recipe only; Button/useButton would overwrite native open/closed data-state. */
export function useCollapsibleTrigger(props: CollapsibleTriggerProps): TriggerResult {
  const { children, className, ...rest } = props;
  return {
    triggerProps: {
      ...nativeProps(rest, TRIGGER_OWNED),
      className: cn(buttonVariants({ variant: 'ghost', size: 'md' }), collapsibleTriggerVariants(), className)
    },
    labelProps: { className: cn(collapsibleLabelVariants()) },
    caretProps: { className: cn(collapsibleCaretVariants()), 'aria-hidden': true },
    children
  };
}

/** Prepare native presence-boundary props; Radix alone owns its id, hidden state and children lifetime. */
export function useCollapsibleContent(props: CollapsibleContentProps): ContentResult {
  const { children, className, ...rest } = props;
  return {
    contentProps: {
      ...nativeProps(rest, CONTENT_OWNED),
      className: cn(collapsibleContentVariants(), className)
    },
    children
  };
}
