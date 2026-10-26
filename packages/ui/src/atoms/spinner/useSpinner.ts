import { cn } from '@/lib/cn';
import type { SpinnerProps } from './types';
import { spinnerArcVariants, spinnerVariants } from './types';

/** Semantics the contract owns even when unsupported code paths inject them. */
const FORBIDDEN = new Set(['children', 'role', 'aria-hidden', 'aria-live']);

export type UseSpinnerResult = {
  rootProps: Record<string, unknown> & { className: string };
  arcClassName: string;
  label: string | undefined;
};

/** Derive status or decorative semantics, resolve the size preset and compose root classes. */
export function useSpinner(props: SpinnerProps): UseSpinnerResult {
  const { label, size, className, ...rest } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!FORBIDDEN.has(key)) {
      passthrough[key] = value;
    }
  }
  const text = label?.trim() ? label : undefined;
  return {
    rootProps: {
      ...passthrough,
      ...(text ? { role: 'status' } : { 'aria-hidden': true }),
      className: cn(spinnerVariants({ size }), className)
    },
    arcClassName: cn(spinnerArcVariants()),
    label: text
  };
}
