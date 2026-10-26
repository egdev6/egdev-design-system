import type { ComponentPropsWithoutRef, RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import type { DropzoneProps } from './types';
import { dropzoneVariants } from './types';

type DropzoneResult = {
  rootProps: ComponentPropsWithoutRef<'button'> & { 'data-state': 'idle' | 'over' };
  inputProps: ComponentPropsWithoutRef<'input'>;
  inputRef: RefObject<HTMLInputElement | null>;
  text: string;
  iconClassName: string;
  textClassName: string;
};

/** Only file presence is checked: accept/size validation belongs to the consumer (#56 D6). */
const hasFiles = (data: DataTransfer) => Array.from(data.types).includes('Files') || data.files.length > 0;

/** Owns file delivery, nested drag depth, focus-scoped paste and picker reset; keyboard stays native. */
export function useDropzone({
  onFiles,
  label = 'Drag, paste or upload',
  dropLabel = 'Drop here',
  accept,
  multiple = false,
  disabled = false,
  variant = 'default',
  className,
  onClick,
  ...rest
}: DropzoneProps): DropzoneResult {
  const inputRef = useRef<HTMLInputElement>(null);
  const depth = useRef(0);
  const [over, setOver] = useState(false);
  const isOver = !disabled && over;

  useEffect(() => {
    if (disabled) {
      depth.current = 0;
      setOver(false);
    }
  }, [disabled]);

  const receive = (files: FileList | File[]) => {
    if (disabled || files.length === 0) {
      return;
    }
    onFiles(multiple ? Array.from(files) : Array.from(files).slice(0, 1));
  };

  return {
    rootProps: {
      ...rest,
      type: 'button',
      disabled,
      'data-state': isOver ? 'over' : 'idle',
      className: cn(dropzoneVariants({ variant }), className),
      onClick: (event) => {
        if (disabled) {
          return;
        }
        onClick?.(event);
        if (!event.defaultPrevented) {
          inputRef.current?.click();
        }
      },
      onDragEnter: (event) => {
        if (disabled || !hasFiles(event.dataTransfer)) {
          return;
        }
        event.preventDefault();
        depth.current += 1;
        setOver(true);
      },
      onDragOver: (event) => {
        if (!disabled && hasFiles(event.dataTransfer)) {
          event.preventDefault();
        }
      },
      onDragLeave: () => {
        if (!disabled) {
          depth.current = Math.max(0, depth.current - 1);
          if (depth.current === 0) {
            setOver(false);
          }
        }
      },
      onDrop: (event) => {
        depth.current = 0;
        setOver(false);
        if (disabled || !hasFiles(event.dataTransfer)) {
          return;
        }
        event.preventDefault();
        receive(event.dataTransfer.files);
      },
      onPaste: (event) => {
        if (
          disabled ||
          event.currentTarget.ownerDocument.activeElement !== event.currentTarget ||
          event.clipboardData.files.length === 0
        ) {
          return;
        }
        event.preventDefault();
        receive(event.clipboardData.files);
      }
    },
    inputRef,
    inputProps: {
      type: 'file',
      hidden: true,
      tabIndex: -1,
      accept,
      multiple,
      disabled,
      onChange: (event) => {
        // Snapshot File objects before reset can clear the input's selected-files list.
        const files = Array.from(event.currentTarget.files ?? []);
        // Reset before calling consumer code, including callbacks that throw or unmount the target.
        event.currentTarget.value = '';
        receive(files);
      }
    },
    text: isOver ? dropLabel : label,
    iconClassName: cn('shrink-0'),
    textClassName: cn('min-w-0')
  };
}
