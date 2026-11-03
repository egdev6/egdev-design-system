import { cn } from '@/lib/cn';
import { type SectionShellProps, sectionShellVariants, sectionShellWrapVariants } from './types';

/** Compose the frame and wrapper while forwarding only supported native attributes. */
export function useSectionShell({ children, register = 'pro', wrap = true, className, ...native }: SectionShellProps) {
  const {
    role: _role,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ...safeNative
  } = native as typeof native & {
    role?: unknown;
    style?: unknown;
    dangerouslySetInnerHTML?: unknown;
  };
  return {
    children,
    wrap,
    rootProps: { ...safeNative, className: cn(sectionShellVariants({ register, wrap }), className) },
    wrapClass: cn(sectionShellWrapVariants())
  };
}
