import * as AvatarPrimitive from '@radix-ui/react-avatar';
import type { FC } from 'react';
import type { AppIconProps } from './types';
import { useAppIcon } from './useAppIcon';

/** Passive application identity with Radix-managed image fallback. */
export const AppIcon: FC<AppIconProps> = (props) => {
  const { rootProps, src, imageClassName, fallbackClassName } = useAppIcon(props);
  return (
    <AvatarPrimitive.Root {...rootProps}>
      {src && <AvatarPrimitive.Image src={src} alt='' className={imageClassName} />}
      <AvatarPrimitive.Fallback aria-hidden='true' className={fallbackClassName}>
        {props.monogram}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
};
