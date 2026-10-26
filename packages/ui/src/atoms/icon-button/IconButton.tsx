import * as AccessibleIconPrimitive from '@radix-ui/react-accessible-icon';
import * as SlotPrimitive from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { IconButtonProps } from './types';
import { useIconButton } from './useIconButton';

/** Icon-only native action or slotted link with a required, visually hidden accessible name. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { rootComponent: Root, rootProps, asChild, children, label, icon } = useIconButton(props);
  return (
    <Root {...rootProps} ref={ref}>
      {asChild && <SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>}
      <AccessibleIconPrimitive.Root label={label}>{icon}</AccessibleIconPrimitive.Root>
    </Root>
  );
});
IconButton.displayName = 'IconButton';
