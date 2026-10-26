import type { FC } from 'react';
import type { BadgeProps } from './types';
import { useBadge } from './useBadge';

/** Passive classification or condition label; announcements belong to the host. */
export const Badge: FC<BadgeProps> = (props) => {
  const { rootProps, iconProps, children, icon, showIcon } = useBadge(props);
  return (
    <span {...rootProps}>
      {showIcon && <span {...iconProps}>{icon}</span>}
      {children}
    </span>
  );
};
