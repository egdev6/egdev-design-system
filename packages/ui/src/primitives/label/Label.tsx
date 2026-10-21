import * as LabelPrimitive from '@radix-ui/react-label';
import { forwardRef } from 'react';
import type { LabelProps } from './types';
import { useLabel } from './useLabel';

/** Native label with token-backed typography for field and choice pairings. */
export const Label = forwardRef<HTMLLabelElement, LabelProps>(function Label(props, ref) {
  const { rootProps } = useLabel(props);
  return <LabelPrimitive.Root {...rootProps} ref={ref} />;
});
