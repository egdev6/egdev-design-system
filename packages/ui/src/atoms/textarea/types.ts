import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Visual treatment: `default` well, `code` mono well, `prose` raised long-form sheet. */
export type TextareaVariant = 'default' | 'code' | 'prose';

type TextareaNativeProps = Omit<ComponentPropsWithoutRef<'textarea'>, 'children'>;

/**
 * Bare multi-line plain-text control rendered as a native `textarea`. Label, hint, error and
 * counter belong to Field; the consumer supplies the accessible name.
 */
export type TextareaProps = TextareaNativeProps & {
  /**
   * Visual treatment: `default` well for general text, `code` mono well for CSS, URLs and
   * commands, `prose` raised sheet for long-form drafts.
   * @control select
   * @default default
   */
  variant?: TextareaVariant;
};

// Shared well for default and code (board field focus, D8); prose replaces it with its sheet.
// The invalid hover/focus utilities keep the danger border above the read-only hover reset.
const well =
  'min-h-30 px-3 py-2 border-border-control shadow-[var(--shadow-well)] hover:border-fg-muted read-only:hover:border-border-control focus-visible:border-border-brand-strong focus-visible:shadow-[var(--shadow-well),var(--shadow-ring-brand)]';

export const textareaVariants = cva(
  'eg-textarea box-border w-full resize-y rounded-md border text-fg-default placeholder:text-fg-muted focus-visible:outline-none transition-[border-color,box-shadow] ease-out duration-[var(--duration-fast)] motion-reduce:transition-none aria-invalid:border-status-danger aria-invalid:hover:border-status-danger aria-invalid:focus-visible:border-status-danger disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        default: [well, 'bg-surface-0 font-sans text-body-default'],
        code: [well, 'bg-primitive-neutral-950 font-mono text-code'],
        prose:
          'min-h-70 p-5 font-sans text-body-default border-border-hairline bg-surface-1 bg-[image:var(--gradient-sheen)] shadow-[var(--shadow-edge),var(--shadow-elev-1)] focus-visible:border-border-brand-strong focus-visible:shadow-[var(--shadow-edge),var(--shadow-elev-1),var(--shadow-glow-base)]'
      }
    },
    defaultVariants: { variant: 'default' }
  }
);
