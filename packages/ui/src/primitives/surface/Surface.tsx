import * as Slot from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { SurfaceProps } from './types';
import { useSurface } from './useSurface';

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>((props, ref) => {
  const { asChild, ...rest } = useSurface(props);
  const Comp = asChild ? Slot.Root : 'div';
  return <Comp {...rest} ref={ref} />;
});
Surface.displayName = 'Surface';
