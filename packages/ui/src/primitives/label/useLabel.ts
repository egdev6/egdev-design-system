import { cn } from '@/lib/cn';
import { type LabelProps, type LabelVariant, labelVariants } from './types';

type UseLabelReturn = {
  rootProps: Omit<LabelProps, 'variant'>;
  variant: LabelVariant;
};

/** Derives the public root typography with the field default and merges layout-only consumer classes last. */
export function useLabel({ variant = 'field', className, ...rest }: LabelProps): UseLabelReturn {
  return {
    rootProps: { ...rest, className: cn(labelVariants({ variant }), className) },
    variant
  };
}
