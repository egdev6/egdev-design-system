import { cn } from '@/lib/cn';
import type { KbdProps } from './types';
import { kbdVariants } from './types';

export type UseKbdResult = {
  rootProps: Omit<KbdProps, 'children' | 'label'> & { className: string };
  children: string;
  label: string | undefined;
};

/** Resolve labelled versus plain mode and compose the root classes with layout className last. */
export function useKbd({ children, label, className, ...rest }: KbdProps): UseKbdResult {
  return {
    rootProps: { ...rest, className: cn(kbdVariants(), className) },
    children,
    label: label ? label : undefined
  };
}
