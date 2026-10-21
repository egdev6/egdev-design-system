import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { type ClusterProps, clusterVariants } from './types';

type ClusterResult = {
  asChild: boolean;
  rootProps: Omit<ComponentPropsWithoutRef<'div'>, keyof ClusterProps>;
};

/** Derive the wrapping row root props from the approved defaults and variants. */
export function useCluster({
  gap = 4,
  alignItems = 'center',
  justifyContent = 'start',
  asChild = false,
  className,
  ...rest
}: ClusterProps): ClusterResult {
  return {
    asChild,
    rootProps: {
      ...rest,
      className: cn(clusterVariants({ gap, alignItems, justifyContent }), className)
    }
  };
}
