import { forwardRef } from 'react';
import type { TextareaProps } from './types';
import { useTextarea } from './useTextarea';

/** Bare multi-line plain-text control; the ref targets the native textarea. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(props, ref) {
  const { rootProps } = useTextarea(props);
  return <textarea {...rootProps} ref={ref} />;
});
