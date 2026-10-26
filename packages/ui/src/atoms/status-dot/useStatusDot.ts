import { cn } from '@/lib/cn';
import type { StatusDotProps, StatusDotState } from './types';
import { statusDotVariants } from './types';

/** Semantics the decorative contract owns even when unsupported code paths inject them. */
const FORBIDDEN = new Set(['children', 'role', 'aria-hidden', 'aria-label', 'aria-labelledby', 'data-state']);

export type UseStatusDotResult = {
  rootProps: Record<string, unknown> & {
    'aria-hidden': true;
    'data-state': StatusDotState;
    className: string;
  };
};

/** Resolve the state geometry and pulse, and keep the dot hidden from assistive technology. */
export function useStatusDot(props: StatusDotProps): UseStatusDotResult {
  const { state = 'stopped', pulse = true, className, ...rest } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!FORBIDDEN.has(key)) {
      passthrough[key] = value;
    }
  }
  return {
    rootProps: {
      ...passthrough,
      'aria-hidden': true,
      'data-state': state,
      className: cn(statusDotVariants({ state, pulse }), className)
    }
  };
}
