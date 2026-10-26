import type { FC } from 'react';
import type { StatusDotProps } from './types';
import { useStatusDot } from './useStatusDot';

/** Decorative dot that reinforces a module/service condition or a live signal beside its text. */
export const StatusDot: FC<StatusDotProps> = (props) => {
  const statusDot = useStatusDot(props);
  return <span {...statusDot.rootProps} />;
};
