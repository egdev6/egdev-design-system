import * as AspectRatioPrimitive from '@radix-ui/react-aspect-ratio';
import { forwardRef } from 'react';
import type { AspectRatioProps } from './types';
import { useAspectRatio } from './useAspectRatio';

/** Reserves responsive proportions without adding paint, clipping or media semantics. */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>((props, ref) => {
  const { rootProps } = useAspectRatio(props, ref);
  return <AspectRatioPrimitive.Root {...rootProps} />;
});

AspectRatio.displayName = 'AspectRatio';
