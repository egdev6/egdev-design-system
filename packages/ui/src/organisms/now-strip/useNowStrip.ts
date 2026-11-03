import { useId } from 'react';
import { cn } from '../../lib/cn';
import { type NowStripProps, nowStripGridVariants, nowStripLabelVariants, nowStripVariants } from './types';

/** Validate the visible name and compose the protected group and layout props. */
export function useNowStrip({ label, children, className, ...native }: NowStripProps) {
  const id = useId();
  const valid = typeof label === 'string' && label.trim().length > 0;
  if (!valid && (typeof process === 'undefined' || process.env.NODE_ENV !== 'production')) {
    console.warn('NowStrip requires a non-empty label. Nothing was rendered.');
  }
  const {
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'aria-live': _ariaLive,
    tabIndex: _tabIndex,
    dangerouslySetInnerHTML: _html,
    style: _style,
    ...rest
  } = native as typeof native & Record<string, unknown>;
  return {
    valid,
    label,
    children,
    rootProps: { ...rest, role: 'group' as const, 'aria-labelledby': id, className: cn(nowStripVariants(), className) },
    labelProps: { id, className: cn(nowStripLabelVariants()) },
    gridClassName: cn(nowStripGridVariants())
  };
}
