import type { SkeletonProps } from './types';
import { useSkeleton } from './useSkeleton';

/** Renders only an empty decorative placeholder; unsupported decorative overrides are dropped. */
export function Skeleton(props: SkeletonProps) {
  const { rootProps } = useSkeleton(props);
  return <span {...rootProps} />;
}
