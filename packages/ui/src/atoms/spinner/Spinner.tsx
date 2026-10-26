import * as VisuallyHiddenPrimitive from '@radix-ui/react-visually-hidden';
import type { FC } from 'react';
import type { SpinnerProps } from './types';
import { useSpinner } from './useSpinner';

/** Indeterminate activity indicator: a rotating open arc with an optional status label. */
export const Spinner: FC<SpinnerProps> = (props) => {
  const spinner = useSpinner(props);
  return (
    <span {...spinner.rootProps}>
      <svg
        className={spinner.arcClassName}
        aria-hidden='true'
        focusable='false'
        viewBox='0 0 24 24'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M21 12a9 9 0 1 1-6.219-8.56' />
      </svg>
      {spinner.label && <VisuallyHiddenPrimitive.Root>{spinner.label}</VisuallyHiddenPrimitive.Root>}
    </span>
  );
};
