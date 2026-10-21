import { Slot } from '@radix-ui/react-slot';
import type { FC } from 'react';
import type { ClusterProps } from './types';
import { useCluster } from './useCluster';

/**
 * Horizontal wrapping flex row with token gaps and no paint.
 * A passive layout with no public ref; an asChild child keeps its own ref through Slot.
 */
export const Cluster: FC<ClusterProps> = (props) => {
  const { asChild, rootProps } = useCluster(props);
  return asChild ? <Slot {...rootProps} /> : <div {...rootProps} />;
};

Cluster.displayName = 'Cluster';
