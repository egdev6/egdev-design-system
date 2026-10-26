import * as SwitchPrimitive from '@radix-ui/react-switch';
import { forwardRef } from 'react';
import type { SwitchProps } from './types';
import { useSwitch } from './useSwitch';

/** On/off setting with immediate effect over Radix Switch; the ref targets the root button. */
export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(function Switch(props, ref) {
  const { rootProps, thumbProps } = useSwitch(props);
  return (
    <SwitchPrimitive.Root {...rootProps} ref={ref}>
      <SwitchPrimitive.Thumb {...thumbProps} />
    </SwitchPrimitive.Root>
  );
});
