import * as TogglePrimitive from '@radix-ui/react-toggle';
import type { FC } from 'react';
import type { ChipProps } from './types';
import { useChip } from './useChip';

/** A Radix pressed button rendered as a pill, with an optional decorative leading icon. */
export const Chip: FC<ChipProps> = (props) => {
  const { rootProps, iconProps, icon, showIcon, children } = useChip(props);
  return (
    <TogglePrimitive.Root {...rootProps}>
      {showIcon && <span {...iconProps}>{icon}</span>}
      {children}
    </TogglePrimitive.Root>
  );
};
