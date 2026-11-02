import type { MouseEvent } from 'react';
import { useId, useRef } from 'react';
import { cn } from '@/lib/cn';
import { type AppShellArrangement, type AppShellProps, appShellVariants } from './types';

const defaultSkipToContent = 'Skip to content';

/** Derive the arrangement from slot presence; the shell holds no viewport or layout state. */
function deriveArrangement(
  side: AppShellProps['sideNavigation'],
  bottom: AppShellProps['bottomNavigation']
): AppShellArrangement {
  if (side != null && bottom != null) {
    return 'switching';
  }
  if (side != null) {
    return 'side';
  }
  return bottom != null ? 'bottom' : 'content';
}

/**
 * Resolves the slot-derived arrangement, the localized skip text, the generated main id and the
 * skip activation handler, and composes every part with cn(). Both navigation organisms stay
 * mounted; the inactive region is hidden through static viewport utilities only.
 */
export function useAppShell({
  sideNavigation,
  bottomNavigation,
  children,
  messages,
  className,
  ...native
}: AppShellProps) {
  const mainId = useId();
  const mainRef = useRef<HTMLElement>(null);
  const {
    role: _role,
    dangerouslySetInnerHTML: _html,
    ...safeNative
  } = native as typeof native & { role?: unknown; dangerouslySetInnerHTML?: unknown };
  const arrangement = deriveArrangement(sideNavigation, bottomNavigation);
  const skipLabel = messages?.skipToContent ?? defaultSkipToContent;
  const onSkipClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    mainRef.current?.focus();
  };
  return {
    sideNavigation,
    bottomNavigation,
    children,
    showSkipRow: sideNavigation != null,
    skipLabel,
    skipHref: `#${mainId}`,
    onSkipClick,
    skipLinkClass: cn(appShellVariants.skipLink()),
    mainId,
    mainRef,
    rootProps: { ...safeNative, className: cn(appShellVariants.root(), className) },
    skipRowClass: cn(appShellVariants.skip({ arrangement })),
    bodyClass: cn(appShellVariants.body()),
    sideClass: cn(appShellVariants.side({ arrangement })),
    mainClass: cn(appShellVariants.main()),
    bottomClass: cn(appShellVariants.bottom({ arrangement }))
  };
}
