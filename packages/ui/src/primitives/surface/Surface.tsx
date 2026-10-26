import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type Ref } from 'react';
import type { SurfaceComponent, SurfaceProps } from './types';
import { useSurface } from './useSurface';

/** React 18-compatible bridge; the exported value narrows it to the public call signatures. */
const SurfaceRoot = forwardRef<HTMLElement, SurfaceProps>((props, ref) => {
  const { asChild, rootProps } = useSurface(props);
  // The default branch renders a real div, so its HTMLElement ref only ever receives a div.
  return asChild ? <Slot {...rootProps} ref={ref} /> : <div {...rootProps} ref={ref as Ref<HTMLDivElement>} />;
});

SurfaceRoot.displayName = 'Surface';

/**
 * Static Material v2 box with tonal level, light edge, two-layer shadow and hairline border.
 * Renders a div with an HTMLDivElement ref, or merges onto one HTMLElement child with asChild.
 */
export const Surface: SurfaceComponent = SurfaceRoot;
