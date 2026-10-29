import * as HoverCardPrimitive from '@radix-ui/react-hover-card';
import { forwardRef } from 'react';
import { Surface } from '../../primitives/surface';
import type { HoverCardContentProps, HoverCardProps, HoverCardTriggerProps } from './types';
import { useHoverCard, useHoverCardContent, useHoverCardTrigger } from './useHoverCard';

/** Supplementary preview state and native Radix timers; renders no DOM of its own. */
export function HoverCard(props: HoverCardProps) {
  const root = useHoverCard(props);
  return <HoverCardPrimitive.Root {...root} />;
}

/** Named link trigger. Always provide a separate persistent destination link for touch users. */
export const HoverCardTrigger = forwardRef<HTMLAnchorElement, HoverCardTriggerProps>((props, ref) => {
  const trigger = useHoverCardTrigger(props);
  return <HoverCardPrimitive.Trigger {...trigger} ref={ref} />;
});
HoverCardTrigger.displayName = 'HoverCardTrigger';

/** Read-only, non-essential body; portalled under document.body with Surface overlay Material. */
export function HoverCardContent(props: HoverCardContentProps) {
  const content = useHoverCardContent(props);
  return (
    <HoverCardPrimitive.Portal>
      <HoverCardPrimitive.Content {...content} asChild={true}>
        <Surface tone='overlay' padding='md' radius='xl'>
          {content.children}
        </Surface>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Portal>
  );
}
