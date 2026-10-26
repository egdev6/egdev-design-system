import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Binary or consumer-computed mixed state; Radix never cycles through three states. */
export type CheckboxCheckedState = boolean | 'indeterminate';

type CheckboxNativeProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'checked' | 'defaultChecked' | 'onChange' | 'value' | 'type' | 'children' | 'disabled' | 'name'
>;

/**
 * Bare 18px form checkbox. Consumers supply an accessible name and a 44px touch target
 * through the composing label row. className supports outer margin and self-alignment only;
 * appearance, geometry and internal parts are not consumer override surfaces. No asChild.
 */
export type CheckboxProps = CheckboxNativeProps & {
  /**
   * Controlled state. When omitted, Radix manages state internally.
   * @control false
   * @controlReason Mixed boolean and indeterminate union; see Controlled and Indeterminate stories.
   */
  checked?: CheckboxCheckedState;
  /**
   * Initial state for an uncontrolled checkbox.
   * @default false
   * @control false
   * @controlReason Mixed boolean and indeterminate union; see Default and Indeterminate stories.
   */
  defaultChecked?: CheckboxCheckedState;
  /**
   * Notifies a user-driven toggle with the next checked state, never incoming prop changes.
   * From indeterminate the next state is true.
   * @control false
   * @controlReason Non-serializable callback; see the Controlled story and its action log.
   */
  onCheckedChange?: (checked: CheckboxCheckedState) => void;
  /**
   * Prevents focus and activation without replacing the checked state.
   * @default false
   * @control boolean
   */
  disabled?: boolean;
  /**
   * Requires a checked value for native form validation through Radix's hidden input.
   * @default false
   * @control boolean
   */
  required?: boolean;
  /**
   * Form field name; omitted fields are not included in submission.
   * @control text
   */
  name?: string;
  /**
   * Value submitted when checked.
   * @default on
   * @control text
   */
  value?: string;
};

// Native button resets are necessary because the published stylesheet has no preflight.
export const checkboxVariants = cva([
  'eg-checkbox box-border p-0 border-solid bg-none appearance-none',
  'inline-grid place-items-center shrink-0 size-4.5 rounded-sm border border-border-control',
  'bg-surface-0 shadow-[var(--shadow-well)] cursor-pointer',
  'data-[state=checked]:bg-[image:var(--gradient-btn-primary)]',
  'data-[state=checked]:border-action-primary-solid-bg data-[state=checked]:shadow-[var(--shadow-btn-primary)]',
  'data-[state=indeterminate]:bg-[image:var(--gradient-btn-primary)]',
  'data-[state=indeterminate]:border-action-primary-solid-bg data-[state=indeterminate]:shadow-[var(--shadow-btn-primary)]',
  'focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)]',
  'data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)]',
  'data-[state=indeterminate]:focus-visible:shadow-[var(--shadow-focus)]',
  'aria-invalid:data-[state=unchecked]:border-status-danger',
  'disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed'
]);

// Both decorative glyphs follow Radix's actual Indicator state, including uncontrolled changes.
// No local checked state, callback mirroring, effect or public part selector is needed.
export const checkboxIndicatorVariants = cva([
  'inline-grid place-items-center text-action-primary-solid-fg',
  'data-[state=checked]:[&>svg:last-child]:hidden',
  'data-[state=indeterminate]:[&>svg:first-child]:hidden'
]);

export const checkboxIconVariants = cva('size-3');
