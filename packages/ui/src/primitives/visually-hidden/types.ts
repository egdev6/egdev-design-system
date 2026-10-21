import type * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/**
 * Hidden, non-focusable content that remains available to assistive technology.
 * Native attributes remain span attributes with asChild; child-specific props are not inferred.
 * Neither root nor child styles/classes may override Radix's hiding geometry.
 */
export type VisuallyHiddenProps = Omit<
  ComponentPropsWithoutRef<typeof VisuallyHiddenPrimitive.Root>,
  'children' | 'asChild'
> & {
  /**
   * Content read by assistive technology. With asChild, supply one non-focusable HTML
   * element or a component forwarding props/ref to that host; no SVG or Fragment.
   * No focusable descendants, skip links, or automatic live announcements.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default and AsChild.
   */
  children: ReactNode;
  /**
   * Apply hiding geometry to one non-focusable HTML child instead of a span.
   * A custom child must forward props and its ref to one HTML host.
   * @control boolean
   * @default false
   */
  asChild?: boolean;
};
