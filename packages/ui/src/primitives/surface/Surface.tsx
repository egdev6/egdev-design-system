import { Slot } from 'radix-ui';
import type { FC } from 'react';
import type { SurfaceProps } from './types';
import { useSurface } from './useSurface';

export const Surface: FC<SurfaceProps> = (props) => {
  const { asChild, ...rest } = useSurface(props);
  const Comp = asChild ? Slot.Root : 'div';
  return <Comp {...rest} />;
};
