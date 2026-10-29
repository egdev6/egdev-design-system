import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { FC } from 'react';
import type { ChipGroupProps } from './types';
import { useChipGroup } from './useChipGroup';

/** Named single- or multiple-selection filters, not mandatory form radios. */
export const ChipGroup: FC<ChipGroupProps> = (props) => {
  const { rootProps, options, itemClassName, iconProps } = useChipGroup(props);
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
        </ToggleGroupPrimitive.Item>
      ))}
    </ToggleGroupPrimitive.Root>
  );
};
