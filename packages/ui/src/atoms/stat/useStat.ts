import { type ComponentPropsWithoutRef, useId } from 'react';
import { cn } from '@/lib/cn';
import type { StatProps } from './types';
import {
  statDeltaVariants,
  statLabelVariants,
  statUnavailableTextVariants,
  statValueVariants,
  statVariants
} from './types';

/** Figure resolution: the given text, or the no-data dash with its readable replacement. */
export type StatValue = { unavailable: boolean; text: string };

export type UseStatResult = {
  rootProps: Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
    role: 'group';
    'aria-labelledby': string;
    'data-state': 'highlighted' | undefined;
    className: string;
  };
  labelProps: { id: string; className: string };
  labelText: string;
  valueProps: { 'data-state': 'unavailable' | undefined; className: string };
  unavailableTextProps: { className: string };
  value: StatValue;
  deltaProps: { className: string };
  delta: string | undefined;
};

/**
 * Name the group by its label id, resolve the no-data figure and the highlight state, and
 * compose every part's classes. Root semantics and state are owned: injected role, naming,
 * data-state or HTML content never reach the DOM.
 */
export function useStat({
  label,
  value,
  delta,
  highlighted = false,
  size = 'md',
  unavailableText = 'No data',
  className,
  ...native
}: StatProps): UseStatResult {
  const labelId = useId();
  const {
    dangerouslySetInnerHTML: _html,
    role: _role,
    'aria-labelledby': _labelledBy,
    'data-state': _state,
    ...rest
  } = native as typeof native & {
    dangerouslySetInnerHTML?: unknown;
    role?: unknown;
    'data-state'?: unknown;
  };
  const unavailable = value === null;
  return {
    rootProps: {
      ...rest,
      role: 'group',
      'aria-labelledby': labelId,
      'data-state': highlighted ? 'highlighted' : undefined,
      className: cn(statVariants({ size }), className)
    },
    labelProps: { id: labelId, className: cn(statLabelVariants()) },
    labelText: label,
    valueProps: {
      'data-state': unavailable ? 'unavailable' : undefined,
      className: cn(statValueVariants({ size }))
    },
    unavailableTextProps: { className: cn(statUnavailableTextVariants()) },
    value: unavailable ? { unavailable: true, text: unavailableText } : { unavailable: false, text: String(value) },
    deltaProps: { className: cn(statDeltaVariants()) },
    delta: delta ? delta : undefined
  };
}
