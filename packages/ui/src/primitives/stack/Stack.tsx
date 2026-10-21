import { Slot } from '@radix-ui/react-slot';
import type { FC } from 'react';
import type { StackProps } from './types';
import { useStack } from './useStack';

/**
 * Vertical flex flow with token gaps, no wrapping and no paint.
 * A passive layout with no public ref; an asChild child keeps its own ref through Slot.
 */
export const Stack: FC<StackProps> = (props) => {
  const { asChild, rootProps } = useStack(props);
  return asChild ? <Slot {...rootProps} /> : <div {...rootProps} />;
};

Stack.displayName = 'Stack';
