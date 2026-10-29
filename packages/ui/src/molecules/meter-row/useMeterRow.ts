import { type ComponentPropsWithoutRef, useId } from 'react';
import type { ProgressBarProps } from '@/atoms/progress-bar';
import { cn } from '@/lib/cn';
import {
  type MeterRowProps,
  meterRowHeaderVariants,
  meterRowHelpVariants,
  meterRowKeyVariants,
  meterRowLabelGroupVariants,
  meterRowLabelVariants,
  meterRowValueVariants,
  meterRowVariants
} from './types';

const FORBIDDEN = new Set([
  'children',
  'dangerouslySetInnerHTML',
  'role',
  'tabIndex',
  'accessKey',
  'contentEditable',
  'onClick',
  'onChange',
  'aria-label',
  'aria-labelledby',
  'aria-describedby',
  'aria-hidden',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext',
  'aria-live',
  'aria-atomic',
  'aria-relevant',
  'aria-disabled',
  'data-state',
  'data-variant',
  'ref',
  'asChild'
]);

type PartProps = { className: string };
export type UseMeterRowResult = {
  rootProps: ComponentPropsWithoutRef<'div'> & { 'data-variant': string };
  headerProps: PartProps & { 'aria-hidden': true };
  labelGroupProps: PartProps;
  keyProps: PartProps;
  labelProps: PartProps;
  valueProps: PartProps & { id?: string };
  helpProps: PartProps & { id: string };
  progressProps: ProgressBarProps;
  label: string;
  readout: string;
  help: string | undefined;
};

/** Normalize once, resolve text/description relationships and compose every supported part. */
export function useMeterRow(props: MeterRowProps): UseMeterRowResult {
  const { label, value, valueText, help, variant = 'default', messages, className, ...rest } = props;
  const id = useId();
  const finite = Number.isFinite(value);
  const normalized = finite ? Math.min(100, Math.max(0, value)) : value;
  const readout = finite ? (valueText ?? `${normalized}%`) : (messages?.indeterminate ?? 'In progress');
  const explanation = help?.trim() ? help : undefined;
  const valueId = `${id}-value`;
  const helpId = `${id}-help`;
  const description = [!finite && valueId, explanation && helpId].filter(Boolean).join(' ') || undefined;
  const native: Record<string, unknown> = {};
  for (const [key, attribute] of Object.entries(rest)) {
    if (!FORBIDDEN.has(key)) {
      native[key] = attribute;
    }
  }
  return {
    rootProps: { ...native, className: cn(meterRowVariants(), className), 'data-variant': variant },
    headerProps: { className: cn(meterRowHeaderVariants()), 'aria-hidden': true },
    labelGroupProps: { className: cn(meterRowLabelGroupVariants()) },
    keyProps: { className: cn(meterRowKeyVariants({ variant })) },
    labelProps: { className: cn(meterRowLabelVariants()) },
    valueProps: { className: cn(meterRowValueVariants()), id: finite ? undefined : valueId },
    helpProps: { className: cn(meterRowHelpVariants()), id: helpId },
    progressProps: {
      label,
      value: normalized,
      valueText: finite ? readout : undefined,
      size: 'lg',
      variant,
      'aria-describedby': description
    },
    label,
    readout,
    help: explanation
  };
}
