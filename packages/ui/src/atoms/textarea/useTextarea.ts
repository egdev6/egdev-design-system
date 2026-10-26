import { cn } from '@/lib/cn';
import { type TextareaProps, type TextareaVariant, textareaVariants } from './types';

export type UseTextareaResult = {
  rootProps: Omit<TextareaProps, 'variant'> & { className: string };
  variant: TextareaVariant;
};

/** Resolve the default variant and compose the root classes with layout className last. */
export function useTextarea({ variant = 'default', className, ...rest }: TextareaProps): UseTextareaResult {
  return {
    rootProps: { ...rest, className: cn(textareaVariants({ variant }), className) },
    variant
  };
}
