import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonGroupVariant = 'spaced' | 'attached';

/**
 * Related independent actions with native tab stops, not a roving-focus toolbar.
 * Supply direct Button/IconButton elements; attached items must have matching heights:
 * Button md + IconButton lg (48px), or Button sm + IconButton md (40px).
 * className supports root outer margins and parent alignment only, merged last with cn.
 * Child appearance remains owned by the atoms, except attached logical inner corners.
 * No root ref, size propagation, child cloning or built-in menu is provided.
 */
export type ButtonGroupProps = Omit<ComponentPropsWithoutRef<'div'>, 'role' | 'aria-label' | 'children'> & {
  /**
   * Accessible group name, recommended for split actions. Absent or empty means unnamed;
   * aria-labelledby is also supported through native attributes.
   * @control text
   */
  label?: string;
  /**
   * Spaced wrapping actions or attached non-wrapping items with logical inner corners.
   * @default spaced
   * @control select
   */
  variant?: ButtonGroupVariant;
  /**
   * Direct Button and IconButton elements in visual order; two or three recommended.
   * A consumer-owned popup trigger must keep its button as a direct DOM child.
   * @control false
   * @controlReason Non-serializable ReactNode; see Spaced, SplitButton and AttachedThree.
   */
  children: ReactNode;
};

/** Layout only: Material, disabled appearance and focus rings belong to the children. */
export const buttonGroupVariants = cva('eg-button-group inline-flex items-center', {
  variants: {
    variant: {
      spaced: 'flex-wrap gap-3',
      attached:
        'flex-nowrap items-stretch gap-0.5 *:not-first:rounded-s-sm *:not-last:rounded-e-sm *:focus-visible:relative *:focus-visible:z-10'
    }
  },
  defaultVariants: { variant: 'spaced' }
});
