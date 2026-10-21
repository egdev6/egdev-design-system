import * as PortalPrimitive from '@radix-ui/react-portal';
import { forwardRef } from 'react';
import type { PortalProps } from './types';
import { usePortal } from './usePortal';

/** Renders an unstyled div outside the DOM tree without changing React context or events. */
export const Portal = forwardRef<HTMLDivElement, PortalProps>(function Portal(props, ref) {
  const rootProps = usePortal(props);
  return <PortalPrimitive.Root {...rootProps} ref={ref} />;
});
