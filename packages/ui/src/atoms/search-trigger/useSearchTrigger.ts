import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { SearchTriggerProps } from './types';
import { searchTriggerHintVariants, searchTriggerLabelVariants, searchTriggerVariants } from './types';

/** Owned root attributes dropped even when untyped code injects them. */
type OwnedProps = {
  type?: unknown;
  role?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  'aria-pressed'?: unknown;
  children?: unknown;
  dangerouslySetInnerHTML?: unknown;
};

export type UseSearchTriggerResult = {
  rootProps: ComponentPropsWithoutRef<'button'> & { type: 'button'; 'aria-label': string; className: string };
  /** Visible label, or undefined in compact mode. */
  label: string | undefined;
  /** Raw display-only hint, or undefined when absent, whitespace-only or compact. */
  shortcut: string | undefined;
  labelClassName: string;
  hintClassName: string;
};

/** Resolve the name, visible parts and per-part classes; no state, effects or listeners. */
export function useSearchTrigger(props: SearchTriggerProps): UseSearchTriggerResult {
  const {
    label = 'Search…',
    shortcut,
    compact = false,
    className,
    type: _type,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'aria-pressed': _ariaPressed,
    children: _children,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = props as SearchTriggerProps & OwnedProps;
  return {
    rootProps: {
      ...rest,
      type: 'button',
      'aria-label': label,
      className: cn(
        surfaceVariants({ tone: 'well', padding: 'none', radius: 'md' }),
        searchTriggerVariants({ compact }),
        className
      )
    },
    label: compact ? undefined : label,
    shortcut: compact || !shortcut?.trim() ? undefined : shortcut,
    labelClassName: cn(searchTriggerLabelVariants()),
    hintClassName: cn(searchTriggerHintVariants())
  };
}
