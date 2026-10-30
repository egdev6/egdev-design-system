import { type ComponentPropsWithoutRef, Fragment, isValidElement, type ReactElement, useId } from 'react';
import { cn } from '@/lib/cn';
import type { FieldMessageTone } from '../../atoms/field-message';
import type { LabelProps } from '../../primitives/label';
import {
  type FieldProps,
  fieldCounterVariants,
  fieldLabelRowVariants,
  fieldMessageVariants,
  fieldReadoutVariants,
  fieldVariants
} from './types';

type ControlAttributes = { id?: string; 'aria-describedby'?: string; 'aria-invalid'?: true };

export type UseFieldResult = {
  rootProps: ComponentPropsWithoutRef<'div'> & { 'data-state': 'invalid' | undefined; className: string };
  controlProps: ControlAttributes;
  children: ReactElement;
  labelProps: Pick<LabelProps, 'htmlFor' | 'variant'>;
  label: string;
  hideLabel: boolean;
  choice: boolean;
  labelRowProps: { className: string };
  message: string | undefined;
  messageProps: { id: string; tone: FieldMessageTone };
  messageWrapperProps: { className: string };
  counter: FieldProps['counter'];
  counterProps: { id: string; className: string; 'data-state': 'over' | undefined };
  readout: string | undefined;
  readoutProps: { htmlFor: string; className: string };
};

/** Derive relationships and part recipes; let Slot, Label and the control own native behavior. */
export function useField({
  label,
  children,
  hint,
  hintTone = 'description',
  error,
  counter,
  readout,
  hideLabel = false,
  layout = 'stacked',
  className,
  ...rest
}: FieldProps): UseFieldResult {
  const generatedId = useId();
  const messageId = useId();
  const counterId = useId();
  if (!isValidElement(children) || children.type === Fragment) {
    throw new Error('Field requires a single compatible control element, not a Fragment or other content.');
  }
  const controlId = (children.props as ControlAttributes).id ?? generatedId;
  const invalid = Boolean(error);
  const message = error || hint || undefined;
  const choice = layout === 'choice';
  const visibleCounter = choice ? undefined : counter;
  const description =
    [message ? messageId : undefined, visibleCounter ? counterId : undefined].filter(Boolean).join(' ') || undefined;
  return {
    rootProps: {
      ...rest,
      className: cn(fieldVariants({ layout }), className),
      'data-state': invalid ? 'invalid' : undefined
    },
    controlProps: { id: controlId, 'aria-describedby': description, 'aria-invalid': invalid ? true : undefined },
    children,
    labelProps: { htmlFor: controlId, variant: choice ? 'choice' : 'field' },
    label,
    hideLabel,
    choice,
    labelRowProps: { className: cn(fieldLabelRowVariants({ layout })) },
    message,
    messageProps: { id: messageId, tone: invalid ? 'error' : hintTone },
    messageWrapperProps: { className: cn(fieldMessageVariants({ layout })) },
    counter: visibleCounter,
    counterProps: {
      id: counterId,
      className: cn(fieldCounterVariants()),
      'data-state': visibleCounter && visibleCounter.value > visibleCounter.max ? 'over' : undefined
    },
    readout: choice ? undefined : readout,
    readoutProps: { htmlFor: controlId, className: cn(fieldReadoutVariants()) }
  };
}
