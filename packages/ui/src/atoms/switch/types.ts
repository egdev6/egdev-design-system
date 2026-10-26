import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Native button attributes forwarded to the root; Radix owns state, type and content.
 * disabled and name are re-declared below with their documented controls, so the native
 * declarations are omitted to keep a single documented source per prop.
 */
export type SwitchNativeProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'checked' | 'defaultChecked' | 'onChange' | 'value' | 'type' | 'children' | 'disabled' | 'name'
>;

export type SwitchProps = SwitchNativeProps & {
  /**
   * Controlled on/off state. When omitted the switch is uncontrolled and starts from defaultChecked.
   * @control boolean
   */
  checked?: boolean;
  /**
   * Initial on/off state when uncontrolled.
   * @control boolean
   * @default false
   */
  defaultChecked?: boolean;
  /**
   * Called with the next state when the user toggles the switch; apply the immediate effect here.
   * @control false
   * @controlReason Event handler with no serializable value; see the Controlled story.
   */
  onCheckedChange?: (checked: boolean) => void;
  /**
   * Removes the switch from the Tab order and blocks toggling; dims it to 45% opacity.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * Marks the switch as required for form validation.
   * @control boolean
   * @default false
   */
  required?: boolean;
  /**
   * Form field name submitted with the value while the switch is on. No field is submitted when omitted.
   * @control text
   */
  name?: string;
  /**
   * Value submitted with the form while the switch is on.
   * @control text
   * @default on
   */
  value?: string;
};

/** Track: Material well when off, primary bevel and halo when on, with the focus ring winning in both states. */
export const switchVariants = cva(
  'eg-switch relative inline-block shrink-0 box-border p-0 w-9 h-5 rounded-full border border-solid border-border-control bg-surface-0 shadow-[var(--shadow-well)] cursor-pointer transition-[background-color,border-color] ease-out duration-[var(--duration-fast)] motion-reduce:transition-none data-[state=checked]:bg-[image:var(--gradient-btn-primary)] data-[state=checked]:border-action-primary-solid-bg data-[state=checked]:shadow-[var(--shadow-btn-primary)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)] disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed'
);

/** Thumb: 14px knob inset 2px that travels 16px and turns black when on. */
export const switchThumbVariants = cva(
  'absolute top-0.5 left-0.5 size-3.5 rounded-full bg-fg-secondary transition-[translate,background-color] ease-out duration-[var(--duration-fast)] motion-reduce:transition-none data-[state=checked]:translate-x-4 data-[state=checked]:bg-action-primary-solid-fg'
);
