import type * as ProgressPrimitive from '@radix-ui/react-progress';
import type { ComponentPropsWithoutRef, CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import { type ProgressBarProps, progressBarFillVariants, progressBarVariants } from './types';

/** Semantics Radix and the contract own even when unsupported code paths inject them. */
const FORBIDDEN = new Set([
  'children',
  'role',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext',
  'aria-label',
  'aria-labelledby',
  'aria-hidden',
  'dangerouslySetInnerHTML',
  'max',
  'getValueLabel',
  'asChild'
]);

type ProgressBarFillStyle = CSSProperties & { '--eg-progress-value': number };
export type UseProgressBarResult = {
  rootProps: ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    value: number | null;
    max: 100;
    className: string;
  };
  fillProps: { className: string; style: ProgressBarFillStyle };
};

/** Clamp to 0–100, map non-finite values to indeterminate, derive naming and compose classes. */
export function useProgressBar(props: ProgressBarProps): UseProgressBarResult {
  const { value, label, valueText, size, variant, edge, className, ...rest } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, attribute] of Object.entries(rest)) {
    if (!FORBIDDEN.has(key)) {
      passthrough[key] = attribute;
    }
  }
  const normalized = Number.isFinite(value) ? Math.min(100, Math.max(0, value)) : null;
  const name = label?.trim() ? label : undefined;
  const text = valueText?.trim() ? valueText : undefined;
  const preset = size ?? 'sm';
  return {
    rootProps: {
      ...passthrough,
      value: normalized,
      max: 100,
      getValueLabel: text ? () => text : undefined,
      ...(name ? { 'aria-label': name } : { 'aria-hidden': true }),
      // D7: untyped callers cannot pin the lg goal bar to an edge.
      className: cn(progressBarVariants({ size: preset, edge: preset === 'sm' && edge === true }), className)
    },
    fillProps: {
      className: cn(progressBarFillVariants({ size: preset, variant })),
      style: { '--eg-progress-value': normalized === null ? 0 : normalized / 100 }
    }
  };
}
