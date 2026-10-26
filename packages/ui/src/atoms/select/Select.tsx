import * as SelectPrimitive from '@radix-ui/react-select';
import { forwardRef } from 'react';
import { Icon } from '../icon';
import type { SelectProps } from './types';
import { useSelect } from './useSelect';

/** A data-driven single-choice control; Radix owns keyboard, focus, ARIA and form wiring. */
export const Select = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const {
    rootProps,
    triggerProps,
    options,
    placeholder,
    contentClassName,
    itemClassName,
    chevronClassName,
    indicatorClassName,
    viewportClassName
  } = useSelect(props);

  return (
    <SelectPrimitive.Root {...rootProps}>
      <SelectPrimitive.Trigger {...triggerProps} ref={ref}>
        <SelectPrimitive.Value placeholder={placeholder} />
        <SelectPrimitive.Icon className={chevronClassName} aria-hidden='true'>
          <Icon name='chevron-down' size='sm' />
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content position='popper' className={contentClassName}>
          <SelectPrimitive.Viewport className={viewportClassName}>
            {options.map((option) => (
              <SelectPrimitive.Item
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={itemClassName}
              >
                <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator className={indicatorClassName} aria-hidden='true'>
                  <Icon name='check' size='sm' />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
});
Select.displayName = 'Select';
