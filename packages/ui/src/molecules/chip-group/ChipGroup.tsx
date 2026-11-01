import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { FC } from 'react';
import { Icon } from '@/atoms/icon';
import type { ChipGroupProps } from './types';
import { useChipGroup } from './useChipGroup';

/** Named single- or multiple-selection filters, not mandatory form radios. */
export const ChipGroup: FC<ChipGroupProps> = (props) => {
  const { rootProps, options, itemClassName, iconProps, checkProps } = useChipGroup(props);
  return (
    <ToggleGroupPrimitive.Root {...rootProps}>
      {options.map((option) => (
        <ToggleGroupPrimitive.Item
          key={option.value}
          value={option.value}
          disabled={option.disabled}
          className={itemClassName}
        >
          {option.showIcon && <span {...iconProps}>{option.icon}</span>}
          {option.label}
          <span {...checkProps}>
            <Icon name='check' size='sm' />
          </span>
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
};
