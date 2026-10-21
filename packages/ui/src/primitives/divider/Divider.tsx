import * as SeparatorPrimitive from '@radix-ui/react-separator';
import type { FC } from 'react';
import type { DividerProps } from './types';
import { useDivider } from './useDivider';

/** A passive brand rule with explicit decorative or semantic separation. */
export const Divider: FC<DividerProps> = (props) => {
  const rootProps = useDivider(props);
  return (
    <SeparatorPrimitive.Root {...rootProps} asChild={true}>
      <span />
    </SeparatorPrimitive.Root>
  );
};
