import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { FC } from 'react';
import type { TooltipProps } from './types';
import { useTooltip } from './useTooltip';

/** Supplementary hover/focus text for one trigger, with its own provider and a portaled overlay bubble. */
export const Tooltip: FC<TooltipProps> = (props) => {
  const tooltip = useTooltip(props);
  return (
    <TooltipPrimitive.Provider>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild={true}>{tooltip.trigger}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content {...tooltip.contentProps}>{tooltip.content}</TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
};
