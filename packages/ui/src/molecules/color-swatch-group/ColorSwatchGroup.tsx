import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import type { FC } from 'react';
import { Icon } from '@/atoms/icon';
import type { ColorSwatchGroupProps } from './types';
import { useColorSwatchGroup } from './useColorSwatchGroup';

/** Named circular preset colors and an optional native picker coordinated by one consumer-owned value. */
export const ColorSwatchGroup: FC<ColorSwatchGroupProps> = (props) => {
  const {
    visible,
    rootProps,
    legendProps,
    groupProps,
    rowClass,
    items,
    optionLabelClass,
    ringClass,
    custom,
    outputProps
  } = useColorSwatchGroup(props);
  if (!visible) {
    return null;
  }
  return (
    <fieldset {...rootProps}>
      <legend {...legendProps} />
      <div className={rowClass}>
        {items.length > 0 && (
          <RadioGroupPrimitive.Root {...groupProps}>
            {items.map((item) => (
              <RadioGroupPrimitive.Item key={item.key} {...item.itemProps}>
                <span {...item.patchProps} />
                <span aria-hidden='true' className={ringClass} />
                <span className={optionLabelClass}>{item.label}</span>
              </RadioGroupPrimitive.Item>
            ))}
          </RadioGroupPrimitive.Root>
        )}
        {custom && (
          <div {...custom.frameProps}>
            <span {...custom.spectrumProps} />
            <span aria-hidden='true' className={ringClass} />
            <span {...custom.badgeProps}>
              <Icon name='plus' size='sm' />
            </span>
            <label {...custom.labelProps} />
            <input key={custom.key} {...custom.inputProps} />
          </div>
        )}
      </div>
      <output {...outputProps} />
    </fieldset>
  );
};
