import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { FC } from 'react';
import { Icon } from '@/atoms/icon';
import type { ColorSwatchGroupProps } from './types';
import { useColorSwatchGroup } from './useColorSwatchGroup';

/** Named preset colors and an optional native picker coordinated by one consumer-owned value. */
export const ColorSwatchGroup: FC<ColorSwatchGroupProps> = (props) => {
  const { visible, rootProps, legendProps, groupProps, items, optionLabelClass, indicatorClass, custom, outputProps } =
    useColorSwatchGroup(props);
  if (!visible) {
    return null;
  }
  return (
    <fieldset {...rootProps}>
      <legend {...legendProps} />
      {items.length > 0 && (
        <RadioGroupPrimitive.Root {...groupProps}>
          {items.map((item) => (
            <RadioGroupPrimitive.Item key={item.key} {...item.itemProps}>
              <span {...item.patchProps} />
              <span className={optionLabelClass}>{item.label}</span>
              <RadioGroupPrimitive.Indicator aria-hidden='true' className={indicatorClass}>
                <Icon name='check' size='sm' />
              </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
          ))}
        </RadioGroupPrimitive.Root>
      )}
      {custom && (
        <div className={custom.frameClass}>
          <label {...custom.labelProps} />
          <input key={custom.key} {...custom.inputProps} />
        </div>
      )}
      <output {...outputProps} />
    </fieldset>
  );
};
