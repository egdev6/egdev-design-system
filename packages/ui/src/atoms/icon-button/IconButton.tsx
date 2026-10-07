import { AccessibleIcon, Slot } from 'radix-ui';
import type { FC } from 'react';
import type { IconButtonProps } from './types';
import { useIconButton } from './useIconButton';

export const IconButton: FC<IconButtonProps> = (props) => {
  const { asChild, ariaLabel, ariaPressed, icon, type, children, ...rest } = useIconButton(props);
  const content = <AccessibleIcon.Root label={ariaLabel}>{icon}</AccessibleIcon.Root>;

  if (asChild) {
    return (
      <Slot.Root {...rest}>
        <Slot.Slottable>{children}</Slot.Slottable>
        {content}
      </Slot.Root>
    );
  }

  return (
    <button {...rest} type={type} aria-pressed={ariaPressed}>
      {content}
    </button>
  );
};
