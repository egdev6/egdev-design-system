import * as AccessibleIcon from '@radix-ui/react-accessible-icon';
import * as TogglePrimitive from '@radix-ui/react-toggle';
import { forwardRef } from 'react';
import type { ToggleProps } from './types';
import { useToggle } from './useToggle';

/** A Radix pressed button with visible text or a separately named decorative icon. */
export const Toggle = forwardRef<HTMLButtonElement, ToggleProps>((props, ref) => {
  const { rootProps, iconProps, iconOnly, icon, children, label } = useToggle(props);
  return (
    <TogglePrimitive.Root {...rootProps} ref={ref}>
      {iconOnly ? (
        <AccessibleIcon.Root label={label ?? ''}>
          <span {...iconProps}>{icon}</span>
        </AccessibleIcon.Root>
      ) : (
        <>
          {icon && (
            <span {...iconProps} aria-hidden={true}>
              {icon}
            </span>
          )}
          {children}
        </>
      )}
    </TogglePrimitive.Root>
  );
});
Toggle.displayName = 'Toggle';
