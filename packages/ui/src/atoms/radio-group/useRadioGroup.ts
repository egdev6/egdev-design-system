import { useId } from 'react';
import { cn } from '@/lib/cn';
import type { RadioGroupOrientation, RadioGroupProps } from './types';
import { radioGroupVariants } from './types';

type RadioGroupRootProps = Omit<RadioGroupProps, 'label' | 'options' | 'className'> & {
  'aria-label': string;
  orientation: RadioGroupOrientation;
  disabled: boolean;
  required: boolean;
  className: string;
};

export type RadioGroupItemParts = {
  key: string;
  rowProps: { className: string };
  itemProps: { id: string; value: string; disabled: boolean; className: string };
  indicatorProps: { className: string };
  labelProps: { htmlFor: string; className: string; children: string };
};

export type UseRadioGroupResult = {
  rootProps: RadioGroupRootProps;
  items: RadioGroupItemParts[];
};

/**
 * Applies the documented constant defaults, names the group from label, hands selection to
 * Radix (no own state) and maps each option to its row, radio, indicator and label parts.
 * Item ids derive from useId() for label association only; className composes on the root last.
 */
export function useRadioGroup({
  label,
  options,
  orientation = 'vertical',
  disabled = false,
  required = false,
  className,
  ...rest
}: RadioGroupProps): UseRadioGroupResult {
  const baseId = useId();
  return {
    rootProps: {
      ...rest,
      'aria-label': label,
      orientation,
      disabled,
      required,
      className: cn(radioGroupVariants.root({ orientation }), className)
    },
    items: options.map((option, index) => {
      const id = `${baseId}-${index}`;
      return {
        key: option.value,
        rowProps: { className: cn(radioGroupVariants.row()) },
        itemProps: {
          id,
          value: option.value,
          disabled: option.disabled ?? false,
          className: cn(radioGroupVariants.item())
        },
        indicatorProps: { className: cn(radioGroupVariants.indicator()) },
        labelProps: { htmlFor: id, className: cn(radioGroupVariants.label()), children: option.label }
      };
    })
  };
}
