import type * as PortalPrimitive from '@radix-ui/react-portal';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type PortalProps = Omit<
  ComponentPropsWithoutRef<typeof PortalPrimitive.Root>,
  'asChild' | 'children' | 'container'
> & {
  /**
   * Layered content to render out of tree. The property is required, but ReactNode may be empty.
   * @control false
   * @controlReason ReactNode content; see Default and CustomContainer.
   */
  children: ReactNode;
  /**
   * Ready client-side mount node. Absent or null uses document.body after mounting.
   * To wait for a node, render Portal conditionally; null does not defer mounting.
   * Do not supply a DOM container during server rendering.
   * @control false
   * @controlReason DOM node; see the CustomContainer story.
   */
  container?: Element | DocumentFragment | null;
};
