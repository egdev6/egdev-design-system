import type * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import type { ComponentPropsWithoutRef } from 'react';
import { chipVariants } from '@/atoms/chip';
import { cn } from '@/lib/cn';
import {
  type ChipGroupOption,
  type ChipGroupProps,
  chipGroupIconVariants,
  chipGroupItemVariants,
  chipGroupVariants
} from './types';

type OwnedInputs = {
  children?: unknown;
  role?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  tabIndex?: unknown;
  dangerouslySetInnerHTML?: unknown;
  onChange?: unknown;
  asChild?: unknown;
  ref?: unknown;
  name?: unknown;
  required?: unknown;
  orientation?: unknown;
  loop?: unknown;
  rovingFocus?: unknown;
};

type ChipGroupResult = {
  rootProps: ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>;
  options: (ChipGroupOption & { showIcon: boolean })[];
  itemClassName: string;
  iconProps: { className: string; 'aria-hidden': true };
};

/** Splits the discriminated API without parallel selection state; Radix owns all interaction. */
export function useChipGroup(props: ChipGroupProps): ChipGroupResult {
  const {
    type: _type,
    value: _value,
    defaultValue: _defaultValue,
    onValueChange: _onValueChange,
    label,
    options,
    disabled = false,
    dir = 'ltr',
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledby,
    tabIndex: _tabIndex,
    dangerouslySetInnerHTML: _html,
    onChange: _onChange,
    asChild: _asChild,
    ref: _ref,
    name: _name,
    required: _required,
    orientation: _orientation,
    loop: _loop,
    rovingFocus: _rovingFocus,
    ...native
  } = props as ChipGroupProps & OwnedInputs;
  const selection =
    props.type === 'single'
      ? { type: props.type, value: props.value, defaultValue: props.defaultValue, onValueChange: props.onValueChange }
      : { type: props.type, value: props.value, defaultValue: props.defaultValue, onValueChange: props.onValueChange };

  return {
    rootProps: {
      ...native,
      ...selection,
      disabled,
      dir,
      role: 'group',
      'aria-label': label,
      orientation: 'horizontal',
      rovingFocus: true,
      loop: true,
      className: cn(chipGroupVariants(), className)
    },
    options: options.map((option) => ({
      ...option,
      showIcon: option.icon !== undefined && option.icon !== null && typeof option.icon !== 'boolean'
    })),
    itemClassName: cn(chipVariants(), chipGroupItemVariants()),
    iconProps: { className: cn(chipGroupIconVariants()), 'aria-hidden': true }
  };
}
