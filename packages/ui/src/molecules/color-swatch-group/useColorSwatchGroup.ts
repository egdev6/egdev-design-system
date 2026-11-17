import type * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { type ChangeEvent, type ComponentPropsWithoutRef, type CSSProperties, useId } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '@/primitives/surface';
import { type ColorSwatchGroupOption, type ColorSwatchGroupProps, colorSwatchGroupVariants } from './types';

const forbidden = new Set([
  'children',
  'style',
  'role',
  'aria-label',
  'aria-labelledby',
  'onChange',
  'name',
  'dangerouslySetInnerHTML',
  'defaultValue',
  'required',
  'asChild',
  'ref'
]);

/** Length also excludes the trailing newline accepted by JavaScript's $ anchor. */
function isHexColor(value: unknown): value is string {
  return typeof value === 'string' && value.length === 7 && /^#[0-9a-fA-F]{6}$/.test(value);
}

function acceptedOptions(options: ColorSwatchGroupOption[]): ColorSwatchGroupOption[] {
  const seen = new Set<string>();
  const accepted: ColorSwatchGroupOption[] = [];
  for (const option of options) {
    if (!option || !isHexColor(option.value) || typeof option.label !== 'string' || !option.label.trim()) {
      continue;
    }
    const color = option.value.toLowerCase();
    if (seen.has(color)) {
      continue;
    }
    seen.add(color);
    accepted.push(option);
  }
  return accepted;
}

type ColorPatchStyle = CSSProperties & { '--eg-swatch-color': string };
type Item = {
  key: string;
  label: string;
  itemProps: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item>;
  patchProps: ComponentPropsWithoutRef<'span'> & { style: ColorPatchStyle };
};

type UseColorSwatchGroupResult = {
  visible: boolean;
  rootProps: ComponentPropsWithoutRef<'fieldset'>;
  legendProps: ComponentPropsWithoutRef<'legend'>;
  groupProps: ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root>;
  items: Item[];
  optionLabelClass: string;
  indicatorClass: string;
  custom: {
    key: string;
    frameClass: string;
    labelProps: ComponentPropsWithoutRef<'label'>;
    inputProps: ComponentPropsWithoutRef<'input'>;
  } | null;
  outputProps: ComponentPropsWithoutRef<'output'>;
};

/** Validates untrusted data and derives parts and user requests; Radix owns radio interaction. */
export function useColorSwatchGroup({
  label,
  options,
  value,
  onValueChange,
  customLabel,
  disabled = false,
  dir,
  className,
  ...rest
}: ColorSwatchGroupProps): UseColorSwatchGroupResult {
  const id = useId();
  const legendId = `${id}-legend`;
  const inputId = `${id}-custom`;
  const validValue = isHexColor(value);
  const current = validValue ? value.toLowerCase() : null;
  const choices = acceptedOptions(options);
  const selected = choices.find((option) => option.value.toLowerCase() === current);
  const nativeProps: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(rest)) {
    if (!forbidden.has(key)) {
      nativeProps[key] = entry;
    }
  }
  const frame = surfaceVariants({ tone: 'surface-1', elevation: 1, radius: 'md', padding: 'none' });

  const requestPreset = (next: string) => {
    const option = choices.find((choice) => choice.value === next);
    if (disabled || !option || option.disabled || option.value.toLowerCase() === current) {
      return;
    }
    onValueChange(option.value);
  };
  const requestCustom = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.currentTarget.value;
    if (disabled || !validValue || !isHexColor(next) || next.toLowerCase() === current) {
      return;
    }
    onValueChange(next);
  };
  const custom =
    typeof customLabel === 'string' && customLabel.trim()
      ? {
          // Remount across validity changes rather than switching the native input's controlledness.
          key: validValue ? 'valid' : 'invalid',
          frameClass: cn(frame, colorSwatchGroupVariants.customFrame()),
          labelProps: {
            htmlFor: inputId,
            className: cn(colorSwatchGroupVariants.customLabel()),
            children: customLabel
          },
          inputProps: {
            id: inputId,
            type: 'color',
            disabled: disabled || !validValue,
            value: validValue ? value : undefined,
            onChange: requestCustom,
            className: cn(colorSwatchGroupVariants.customInput())
          }
        }
      : null;

  return {
    visible: typeof label === 'string' && label.trim().length > 0,
    rootProps: { ...nativeProps, disabled, dir, className: cn(colorSwatchGroupVariants.root(), className) },
    legendProps: { id: legendId, className: cn(colorSwatchGroupVariants.legend()), children: label },
    groupProps: {
      'aria-labelledby': legendId,
      orientation: 'horizontal',
      loop: true,
      // Forward the native fieldset direction unchanged to Radix and its rendered collection.
      dir: dir as 'ltr' | 'rtl' | undefined,
      disabled,
      value: selected?.value ?? '',
      onValueChange: requestPreset,
      className: cn(colorSwatchGroupVariants.group())
    },
    items: choices.map((option) => ({
      key: option.value.toLowerCase(),
      label: option.label,
      itemProps: {
        value: option.value,
        disabled: disabled || (option.disabled ?? false),
        className: cn(frame, colorSwatchGroupVariants.item())
      },
      patchProps: {
        'aria-hidden': true,
        className: cn(colorSwatchGroupVariants.patch()),
        style: { '--eg-swatch-color': option.value.toLowerCase() }
      }
    })),
    optionLabelClass: cn(colorSwatchGroupVariants.optionLabel()),
    indicatorClass: cn(colorSwatchGroupVariants.indicator()),
    custom,
    outputProps: {
      'aria-live': 'polite',
      className: cn(colorSwatchGroupVariants.output()),
      children: `${label}: ${validValue ? value : '—'}`
    }
  };
}
