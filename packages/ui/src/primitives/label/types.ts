import type * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Visual treatment within the label's responsibility. */
export type LabelVariant = 'field' | 'choice';

export type LabelProps = Omit<ComponentPropsWithoutRef<typeof LabelPrimitive.Root>, 'asChild' | 'children'> & {
  /**
   * Required visible label text.
   * @control false
   * @controlReason Non-serializable ReactNode content; see the Default, WrappingControl and LongText stories.
   */
  children: ReactNode;
  /**
   * Visual treatment: field pairs with form controls, choice precedes checkbox-like controls.
   * @control select
   * @default field
   */
  variant?: LabelVariant;
};

export const labelVariants = cva('eg-label font-sans text-label-default text-fg-secondary', {
  variants: {
    variant: {
      field: '',
      choice: 'font-[var(--text-body-default--font-weight)]'
    }
  },
  defaultVariants: { variant: 'field' }
});
