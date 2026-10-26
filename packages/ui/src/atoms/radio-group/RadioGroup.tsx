import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { FC } from 'react';
import type { RadioGroupProps } from './types';
import { useRadioGroup } from './useRadioGroup';

/** Exclusive choice among a short list of text options over Radix RadioGroup. */
export const RadioGroup: FC<RadioGroupProps> = (props) => {
  const { rootProps, items } = useRadioGroup(props);
  return (
    <RadioGroupPrimitive.Root {...rootProps}>
      {items.map((item) => (
        <div key={item.key} {...item.rowProps}>
          <RadioGroupPrimitive.Item {...item.itemProps}>
            <RadioGroupPrimitive.Indicator {...item.indicatorProps} />
          </RadioGroupPrimitive.Item>
          <label {...item.labelProps} />
        </div>
      ))}
    </RadioGroupPrimitive.Root>
  );
};
