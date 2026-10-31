import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import type { IconName } from '../icon';

/** Message presentation, independent of validation and announcement priority. */
export type FieldMessageTone = 'description' | 'info' | 'warning' | 'success' | 'error';

/** One passive plain-text annotation; id and native attributes reach its paragraph. */
export type FieldMessageProps = Omit<ComponentPropsWithoutRef<'p'>, 'children'> & {
  /**
   * Consumer-authored message; an empty string renders nothing.
   * @control text
   */
  children: string;
  /**
   * Semantic text treatment; does not set control validity or a live-region role.
   * @control select
   * @default description
   */
  tone?: FieldMessageTone;
  /**
   * Optional decorative glyph override. When omitted, semantic tones derive their
   * status glyph; description has no glyph. No accessible label is added to the icon.
   * @control select
   */
  icon?: IconName;
};

/** Plain annotation, not a surfaced notification; controls retain their own Material. */
export const fieldMessageVariants = cva(
  'eg-field-message m-0 flex items-start gap-1.5 min-w-0 font-sans text-label-default font-[var(--text-body-muted--font-weight)]',
  {
    variants: {
      tone: {
        description: 'text-fg-muted',
        info: 'text-status-info',
        warning: 'text-status-warning',
        success: 'text-status-success',
        error: 'text-status-danger'
      }
    },
    defaultVariants: { tone: 'description' }
  }
);
export const fieldMessageIconVariants = cva('size-4 shrink-0');
export const fieldMessageTextVariants = cva('min-w-0');
