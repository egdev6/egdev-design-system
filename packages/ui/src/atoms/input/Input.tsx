import { forwardRef } from 'react';
import { Spinner } from '../spinner';
import type { InputProps } from './types';
import { useInput } from './useInput';

/** Native text control with optional decorative slots; loading stays editable and announcements are consumer-owned. */
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
      {input.loading ? (
        <span aria-hidden='true' className={input.spinnerClassName}>
          <Spinner size='sm' />
        </span>
      ) : null}
    </span>
  );
});
