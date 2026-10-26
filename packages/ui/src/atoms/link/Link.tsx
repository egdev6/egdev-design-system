import * as SlotPrimitive from '@radix-ui/react-slot';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import { forwardRef } from 'react';
import { Icon } from '../icon';
import type { LinkProps } from './types';
import { useLink } from './useLink';

/** Standalone navigation link with an optional decorative arrow and new-tab notice. */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => {
  const {
    root: Root,
    rootProps,
    children,
    external,
    newTabText,
    showArrow,
    arrowName,
    arrowClassName
  } = useLink(props);
  return (
    <Root {...rootProps} ref={ref}>
      <SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>
      {showArrow && <Icon name={arrowName} size='sm' className={arrowClassName} />}
      {external && ' '}
      {external && <VisuallyHiddenPrimitive.Root>{newTabText}</VisuallyHiddenPrimitive.Root>}
    </Root>
  );
});
Link.displayName = 'Link';
