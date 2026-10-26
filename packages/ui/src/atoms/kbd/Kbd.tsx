import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import type { FC } from 'react';
import type { KbdProps } from './types';
import { useKbd } from './useKbd';

/** One keyboard key or shortcut glyph; symbol keys may carry a spoken label. */
export const Kbd: FC<KbdProps> = (props) => {
  const kbd = useKbd(props);
  return (
    <kbd {...kbd.rootProps}>
      {kbd.label ? (
        <>
          <span aria-hidden='true'>{kbd.children}</span>
          <VisuallyHiddenPrimitive.Root>{kbd.label}</VisuallyHiddenPrimitive.Root>
        </>
      ) : (
        kbd.children
      )}
    </kbd>
  );
};
