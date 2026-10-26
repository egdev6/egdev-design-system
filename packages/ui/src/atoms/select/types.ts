import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type SelectSize = 'md' | 'sm';

/** One text-only choice; values must be non-empty and unique within the list. */
export type SelectOption = {
  /** Non-empty unique choice value.
   * @control text
   */
  value: string;
  /** Visible text used by Radix typeahead.
   * @control text
   */
  label: string;
  /** Prevents selection and skips this option during keyboard navigation.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
};

type SelectTriggerNativeProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'value' | 'defaultValue' | 'onChange' | 'children' | 'type' | 'dir' | 'placeholder' | 'name' | 'required' | 'disabled'
>;

/** Single-choice form control. Supply an accessible name independently of the placeholder. */
export type SelectProps = SelectTriggerNativeProps & {
  /** Options in display order; each value must be a non-empty unique string.
   * @control false
   * @controlReason Structured option data is not a scalar control; use Default and DisabledOption stories.
   */
  options: SelectOption[];
  /** Controlled selected value; omitted for uncontrolled use.
   * @control text
   */
  value?: string;
  /** Initial uncontrolled value; omitted means no selection.
   * @control text
   */
  defaultValue?: string;
  /** Called on user selection, not incoming prop updates.
   * @control false
   * @controlReason Callbacks are not serializable; use the Controlled story.
   */
  onValueChange?: (value: string) => void;
  /** Text shown without a selection; never the accessible name. Omitted means an empty value area.
   * @control text
   */
  placeholder?: string;
  /** Trigger height: md 44px or sm 36px. Content sizing is unchanged.
   * @control select
   * @default md
   */
  size?: SelectSize;
  /** Native-equivalent form field name, routed to the Radix hidden select.
   * @control text
   */
  name?: string;
  /** Native-equivalent required selection for form participation.
   * @control boolean
   * @default false
   */
  required?: boolean;
  /** Native-equivalent disabled state for the trigger and hidden select.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
};

export const selectTriggerVariants = cva(
  'eg-select relative inline-flex items-center w-full box-border m-0 border-solid border-(length:--border-width) bg-surface-0 bg-none shadow-[var(--shadow-well)] border-border-control rounded-md font-sans text-fg-default text-left data-placeholder:text-fg-muted hover:border-fg-muted focus-visible:outline-none focus-visible:border-border-brand-strong focus-visible:shadow-[var(--shadow-well),var(--shadow-ring-brand)] data-[state=open]:outline-none data-[state=open]:border-border-brand-strong data-[state=open]:shadow-[var(--shadow-well),var(--shadow-ring-brand)] aria-invalid:border-status-danger disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed transition-colors ease-out duration-[var(--duration-fast)] motion-reduce:transition-none',
  {
    variants: {
      size: {
        md: 'min-h-11 pl-3 pr-10 py-2 text-body-default',
        sm: 'min-h-9 pl-3 pr-10 py-1.5 text-label-default font-(weight:--text-body-default--font-weight)'
      }
    },
    defaultVariants: { size: 'md' }
  }
);

export const selectContentVariants = cva(
  'eg-select-content box-border min-w-[var(--radix-select-trigger-width)] max-h-[var(--radix-select-content-available-height)] overflow-hidden p-2 rounded-lg bg-surface-overlay backdrop-blur-[var(--blur-overlay)] backdrop-saturate-150 border-solid border-(length:--border-width) border-border-hairline-strong shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)] [@media(prefers-reduced-transparency:reduce)]:bg-surface-2 [@media(prefers-reduced-transparency:reduce)]:backdrop-filter-none data-[side=bottom]:mt-1 data-[side=top]:mb-1'
);

export const selectItemVariants = cva(
  'relative flex items-center gap-3 rounded-md px-3 py-2 pr-8 font-sans text-body-default text-fg-secondary cursor-pointer outline-none data-highlighted:bg-fg-default/6 data-highlighted:text-fg-default focus-visible:ring-[length:var(--focus-width)] focus-visible:ring-inset focus-visible:ring-focus-ring-inverse data-[state=checked]:text-fg-default data-disabled:opacity-45 data-disabled:pointer-events-none transition-colors ease-out duration-[var(--duration-fast)] motion-reduce:transition-none'
);

export const selectChevronVariants = cva('absolute right-3 size-4 text-fg-muted');
export const selectIndicatorVariants = cva('absolute right-3 size-4 text-fg-brand-default');
export const selectViewportVariants = cva('max-h-[var(--radix-select-content-available-height)]');
