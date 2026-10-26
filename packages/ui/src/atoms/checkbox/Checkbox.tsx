import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { forwardRef } from 'react';
import { Icon } from '../icon';
import type { CheckboxProps } from './types';
import { useCheckbox } from './useCheckbox';

/** Bare form checkbox with Radix-owned semantics, interaction and form integration. */
export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>((props, ref) => {
  const { rootProps, indicatorProps, iconProps } = useCheckbox(props);
  return (
    <CheckboxPrimitive.Root {...rootProps} ref={ref}>
      <CheckboxPrimitive.Indicator {...indicatorProps}>
        <Icon {...iconProps} name='check' />
        <Icon {...iconProps} name='minus' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
});

Checkbox.displayName = 'Checkbox';
