import * as TogglePrimitive from '@radix-ui/react-toggle';
import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import type { FC } from 'react';
import type { ChipProps } from './types';
import { useChip } from './useChip';

/** One pill in three modes: a pressable toggle (default), a static label or a navigation link. */
export const Chip: FC<ChipProps> = (props) => {
  const result = useChip(props);
  const content = (
    <>
      {result.showIcon && <span {...result.iconProps}>{result.icon}</span>}
      {result.children}
    </>
  );
  if (result.mode === 'static') {
    return <span {...result.rootProps}>{content}</span>;
  }
  if (result.mode === 'link') {
    return (
      <a {...result.rootProps}>
        {content}
        {result.external && ' '}
        {result.external && <VisuallyHiddenPrimitive.Root>{result.newTabText}</VisuallyHiddenPrimitive.Root>}
      </a>
    );
  }
  return <TogglePrimitive.Root {...result.rootProps}>{content}</TogglePrimitive.Root>;
};
