import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { FC } from 'react';
import { Icon } from '../icon';
import type { AvatarProps } from './types';
import { useAvatar } from './useAvatar';

/** A passive user or channel identity with Radix-managed photo fallback. */
export const Avatar: FC<AvatarProps> = (props) => {
  const {
    rootProps,
    src,
    badgeIcon,
    imageClassName,
    fallbackClassName,
    fallbackIconClassName,
    badgeClassName,
    badgeIconClassName
  } = useAvatar(props);
  return (
    <AvatarPrimitive.Root {...rootProps}>
      <AvatarPrimitive.Image src={src} alt='' className={imageClassName} />
      <AvatarPrimitive.Fallback className={fallbackClassName}>
        <Icon name='user' className={fallbackIconClassName} />
      </AvatarPrimitive.Fallback>
      {badgeIcon && (
        <span aria-hidden='true' className={badgeClassName}>
          <Icon name={badgeIcon} className={badgeIconClassName} />
        </span>
      )}
    </AvatarPrimitive.Root>
  );
};
