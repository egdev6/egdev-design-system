import * as PopoverPrimitive from '@radix-ui/react-popover';
import type { FC } from 'react';
import { forwardRef } from 'react';
import { Surface } from '../../primitives/surface';
import type { PopoverCloseProps, PopoverContentProps, PopoverProps, PopoverTriggerProps } from './types';
import { PopoverModalityContext, usePopover, usePopoverButton, usePopoverContent } from './usePopover';

/** State root with no DOM; Radix owns controlled and uncontrolled visibility. */
export const Popover: FC<PopoverProps> = (props) => {
  const root = usePopover(props);
  return (
    <PopoverModalityContext.Provider value={root.modal}>
      <PopoverPrimitive.Root {...root.rootProps}>{root.children}</PopoverPrimitive.Root>
    </PopoverModalityContext.Provider>
  );
};

/** Named button that toggles the associated dialog; optionally compose an existing Button. */
export const PopoverTrigger = forwardRef<HTMLButtonElement, PopoverTriggerProps>((props, ref) => {
  const trigger = usePopoverButton(props, true);
  return <PopoverPrimitive.Trigger {...trigger.buttonProps} ref={ref} />;
});
PopoverTrigger.displayName = 'PopoverTrigger';

/** Internally portalled named dialog on the existing Surface overlay treatment. */
export const PopoverContent: FC<PopoverContentProps> = (props) => {
  const content = usePopoverContent(props);
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content {...content.contentProps} asChild={true}>
        <Surface tone='overlay' padding='md' radius='xl'>
          {content.children}
        </Surface>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
};

/** Explicit named dismissal action; optionally compose a button-compatible child. */
export const PopoverClose = forwardRef<HTMLButtonElement, PopoverCloseProps>((props, ref) => {
  const close = usePopoverButton(props);
  return <PopoverPrimitive.Close {...close.buttonProps} ref={ref} />;
});
PopoverClose.displayName = 'PopoverClose';
