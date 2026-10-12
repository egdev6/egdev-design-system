import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as Slot from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { IconButtonProps } from './types';
import { useIconButton } from './useIconButton';

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
  const { asChild, ariaLabel, ariaPressed, icon, type, children, ...rest } = useIconButton(props);
  const content = <AccessibleIcon.Root label={ariaLabel}>{icon}</AccessibleIcon.Root>;

  if (asChild) {
    return (
      <Slot.Root {...rest} ref={ref}>
        <Slot.Slottable>{children}</Slot.Slottable>
        {content}
      </Slot.Root>
    );
  }

  return (
    <button {...rest} ref={ref} type={type} aria-pressed={ariaPressed}>
      {content}
    </button>
  );
});
IconButton.displayName = 'IconButton';
