import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import { forwardRef } from 'react';
import type { VisuallyHiddenProps } from './types';
import { useVisuallyHidden } from './useVisuallyHidden';

/** Hide content visually without removing it from the accessibility tree. */
export const VisuallyHidden = forwardRef<HTMLElement, VisuallyHiddenProps>((props, ref) => {
  const rootProps = useVisuallyHidden(props);
  return <VisuallyHiddenPrimitive.Root {...rootProps} ref={ref} />;
});

VisuallyHidden.displayName = 'VisuallyHidden';
