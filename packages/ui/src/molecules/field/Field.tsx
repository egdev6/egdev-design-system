import * as SlotPrimitive from '@radix-ui/react-slot';
import type { FC } from 'react';
import { Label } from '../../primitives/label';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { FieldProps } from './types';
import { useField } from './useField';

/** Label and descriptions for one consumer-owned control, independent of any form library. */
export const Field: FC<FieldProps> = (props) => {
  const field = useField(props);
  return (
    <div {...field.rootProps}>
      {field.choice ? <SlotPrimitive.Root {...field.controlProps}>{field.children}</SlotPrimitive.Root> : null}
      <div {...field.labelRowProps}>
        {field.hideLabel ? (
          <VisuallyHidden>
            <Label {...field.labelProps}>{field.label}</Label>
          </VisuallyHidden>
        ) : (
          <Label {...field.labelProps}>{field.label}</Label>
        )}
        {field.readout !== undefined ? <output {...field.readoutProps}>{field.readout}</output> : null}
      </div>
      {field.choice ? null : <SlotPrimitive.Root {...field.controlProps}>{field.children}</SlotPrimitive.Root>}
      {field.message ? <p {...field.messageProps}>{field.message}</p> : null}
      {field.counter ? (
        <span {...field.counterProps}>
          {field.counter.value} / {field.counter.max}
        </span>
      ) : null}
    </div>
  );
};
