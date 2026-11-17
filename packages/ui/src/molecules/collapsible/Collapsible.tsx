import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import { type FC, forwardRef } from 'react';
import { Icon } from '@/atoms/icon';
import { Surface } from '@/primitives/surface';
import type {
  CollapsibleContentProps,
  CollapsibleHeaderProps,
  CollapsibleProps,
  CollapsibleTriggerProps
} from './types';
import { useCollapsible, useCollapsibleContent, useCollapsibleHeader, useCollapsibleTrigger } from './useCollapsible';

/** One independent in-flow disclosure, composed on the fixed Material Surface frame. */
export const Collapsible: FC<CollapsibleProps> = (props) => {
  const { rootProps, children } = useCollapsible(props);
  return (
    <CollapsiblePrimitive.Root {...rootProps} asChild={true}>
      <Surface tone='surface-1' elevation={0} radius='md' padding='none'>
        {children}
      </Surface>
    </CollapsiblePrimitive.Root>
  );
};

/** Optional row placing independently owned actions outside the Trigger. */
export const CollapsibleHeader: FC<CollapsibleHeaderProps> = (props) => {
  const { headerProps, actionsProps, actions, children } = useCollapsibleHeader(props);
  return (
    <div {...headerProps}>
      {children}
      {actions != null && <div {...actionsProps}>{actions}</div>}
    </div>
  );
};

/** Native button; the React 18-compatible bridge connects only this public part's ref. */
export const CollapsibleTrigger = forwardRef<HTMLButtonElement, CollapsibleTriggerProps>((props, ref) => {
  const { triggerProps, labelProps, caretProps, children } = useCollapsibleTrigger(props);
  return (
    <CollapsiblePrimitive.Trigger {...triggerProps} ref={ref}>
      <span {...labelProps}>{children}</span>
      <span {...caretProps}>
        <Icon name='chevron-down' size='sm' />
      </span>
    </CollapsiblePrimitive.Trigger>
  );
});
CollapsibleTrigger.displayName = 'CollapsibleTrigger';

/** Native presence boundary with an optional retained, closed-hidden subtree. */
export const CollapsibleContent: FC<CollapsibleContentProps> = (props) => {
  const { contentProps, children } = useCollapsibleContent(props);
  return <CollapsiblePrimitive.Content {...contentProps}>{children}</CollapsiblePrimitive.Content>;
};
