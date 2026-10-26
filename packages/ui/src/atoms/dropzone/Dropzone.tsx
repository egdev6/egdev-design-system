import type { FC } from 'react';
import { Icon } from '../icon';
import type { DropzoneProps } from './types';
import { useDropzone } from './useDropzone';

/** Native drag, paste or pick target; consumers validate files and announce upload results. */
export const Dropzone: FC<DropzoneProps> = (props) => {
  const { rootProps, inputProps, inputRef, text, iconClassName, textClassName } = useDropzone(props);
  return (
    <>
      <button {...rootProps}>
        <Icon name='upload' className={iconClassName} />
        <span className={textClassName}>{text}</span>
      </button>
      <input {...inputProps} ref={inputRef} />
    </>
  );
};
