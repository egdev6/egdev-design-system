import { Slot } from '@radix-ui/react-slot';
import type { FC } from 'react';
import type { GridItemProps, GridProps } from './types';
import { useGrid, useGridItem } from './useGrid';

/**
 * Equal-width column grid with token gaps, an opt-in one-column collapse and no paint.
 * A passive layout with no public ref; an asChild child keeps its own ref through Slot.
 */
export const Grid: FC<GridProps> = (props) => {
  const { asChild, rootProps } = useGrid(props);
  return asChild ? <Slot {...rootProps} /> : <div {...rootProps} />;
};

Grid.displayName = 'Grid';

/**
 * Places one child of a Grid by column span and row span, with a zero minimum width so long content cannot widen its
 * track. A passive layout with no public ref; an asChild child keeps its own ref through Slot.
 */
export const GridItem: FC<GridItemProps> = (props) => {
  const { asChild, rootProps } = useGridItem(props);
  return asChild ? <Slot {...rootProps} /> : <div {...rootProps} />;
};

GridItem.displayName = 'GridItem';
