import { Slot, Slottable } from '@radix-ui/react-slot';
import type { FC } from 'react';
import type { TextProps } from './types';
import { useText } from './useText';

/**
 * Non-heading body copy, display copy or a diamond-prefixed eyebrow. Display recipes may have a
 * trailing accent; body recipes support semantic strong content and a foreground selection.
 * Passive typography with no public ref; an asChild child keeps its own ref through Slot.
 */
export const Text: FC<TextProps> = (props) => {
  const { asChild, children, accent, rootProps } = useText(props);
  const accentPart = accent ? <span className={accent.className}>{accent.text}</span> : null;
  return asChild ? (
    <Slot {...rootProps}>
      <Slottable>{children}</Slottable>
      {accentPart}
    </Slot>
  ) : (
    <p {...rootProps}>
      {children}
      {accentPart}
    </p>
  );
};

Text.displayName = 'Text';
