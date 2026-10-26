import * as SlotPrimitive from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { Spinner } from '../spinner';
import type { ButtonProps } from './types';
import { useButton } from './useButton';

/** Labelled Material action; Slot preserves the semantics and DOM ref of a composed child. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const button = useButton(props);
  const Root = button.asChild ? SlotPrimitive.Root : 'button';
  const icon = button.showIcon ? (
    <span className={button.iconClassName} aria-hidden='true'>
      {button.loading ? <Spinner size={button.size} /> : button.icon}
    </span>
  ) : null;
  return (
    <Root {...button.rootProps} ref={ref}>
      {button.iconPosition === 'start' && icon}
      <SlotPrimitive.Slottable>{button.children}</SlotPrimitive.Slottable>
      {button.iconPosition === 'end' && icon}
    </Root>
  );
});

Button.displayName = 'Button';
