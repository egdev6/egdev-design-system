import { forwardRef } from 'react';
import type { InputProps } from './types';
import { useInput } from './useInput';

/** Bare single-line text control in the Material well; the ref targets the native input. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(props, ref) {
  const input = useInput(props);
  return (
    <span {...input.rootProps}>
      {input.hasIcon ? (
        <span aria-hidden='true' className={input.iconClassName}>
          {input.icon}
        </span>
      ) : null}
      <input {...input.controlProps} ref={ref} />
    </span>
  );
});
