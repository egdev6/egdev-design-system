import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Control height preset: `md` 44px (touch minimum), `sm` 36px for dense pointer UIs. */
export type InputSize = 'md' | 'sm';

/** Visual treatment of the well. */
export type InputVariant = 'default' | 'code';

/** Text-entry input types; choice, range, file and date/time controls have their own components. */
export type InputType = 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number';

/** Native input attributes forwarded to the `<input>`; `size` and `type` are replaced by own props. */
export type InputNativeProps = Omit<ComponentPropsWithoutRef<'input'>, 'size' | 'type' | 'children'>;

/**
 * Bare single-line text control in the Material well. The visible label, hint, error text and
 * counter belong to the consumer (the future Field molecule). Native attributes and the ref go to
 * the `<input>`; `className` goes to the `eg-input` root wrapper for layout only.
 */
export type InputProps = InputNativeProps & {
  /**
   * Control height preset: `md` 44px, `sm` 36px for toolbars and dialog footers.
   * @control select
   * @default md
   */
  size?: InputSize;
  /**
   * Visual treatment; `code` uses the mono font on the darker well for code, URLs and commands.
   * @control select
   * @default default
   */
  variant?: InputVariant;
  /**
   * Text-entry input type, narrowed from the native attribute.
   * @control select
   * @default text
   */
  type?: InputType;
  /**
   * Optional decorative leading icon inside the well, hidden from assistive technology; its
   * meaning must also exist in the accessible name. No icon is rendered when omitted.
   * @control false
   * @controlReason Non-serializable ReactNode content; see the WithIcon story.
   */
  icon?: ReactNode;
};

/** Layout wrapper: public marker, icon positioning context and disabled dimming. */
export const inputVariants = cva(
  'eg-input relative flex w-full items-center has-[:disabled]:pointer-events-none has-[:disabled]:opacity-45'
);

/** Material well recipe with native hover, focus, read-only, invalid and disabled states. */
export const inputControlVariants = cva(
  'box-border w-full min-w-0 rounded-md border border-border-control bg-surface-0 shadow-[var(--shadow-well)] font-sans text-fg-default placeholder:text-fg-muted transition-[border-color,box-shadow] ease-out duration-[var(--duration-fast)] motion-reduce:transition-none hover:border-fg-muted read-only:hover:border-border-control focus-visible:outline-none focus-visible:border-border-brand-strong focus-visible:shadow-[var(--shadow-well),var(--shadow-ring-brand)] aria-invalid:border-status-danger aria-invalid:focus-visible:border-status-danger disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        md: 'min-h-11 px-3 py-2 text-body-default',
        sm: 'min-h-9 px-3 py-1.5 text-label-default'
      },
      variant: {
        default: '',
        code: 'font-mono text-code bg-primitive-neutral-950'
      },
      icon: {
        true: 'pl-9',
        false: ''
      }
    },
    compoundVariants: [
      // The sm sans text keeps the label size and line height with the body weight (D9).
      { size: 'sm', variant: 'default', className: 'font-[var(--text-body-default--font-weight)]' }
    ],
    defaultVariants: { size: 'md', variant: 'default', icon: false }
  }
);

/** Decorative leading icon slot, vertically centered inside the well. */
export const inputIconVariants = cva(
  'pointer-events-none absolute left-3 flex size-4 items-center justify-center text-fg-muted'
);
