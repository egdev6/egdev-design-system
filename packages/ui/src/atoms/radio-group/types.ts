import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** One selectable text option. Values must be unique and non-empty within a group. */
export type RadioGroupOption = {
  /** Value reported by onValueChange and submitted with the form. */
  value: string;
  /** Visible option text; it also names the radio. */
  label: string;
  /** Skips the option in arrow navigation and blocks its selection. */
  disabled?: boolean;
};

/** Layout axis of the options, which also sets the arrow-key axis. */
export type RadioGroupOrientation = 'vertical' | 'horizontal';

/**
 * Native div attributes forwarded to the group root; Radix owns the role, direction and
 * selection, and the group name comes from label.
 */
export type RadioGroupProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'defaultValue' | 'dir' | 'onChange' | 'role' | 'aria-label'
> & {
  /**
   * Accessible name of the group, applied as its aria-label. A consumer aria-labelledby, for
   * example a Field legend, takes precedence.
   * @control text
   */
  label: string;
  /**
   * Options rendered in order as a radio and its visible label. Values must be unique.
   * @control false
   * @controlReason Array of option objects with no serializable control; see the Default and DisabledOption stories.
   */
  options: RadioGroupOption[];
  /**
   * Controlled selected value. When omitted the group is uncontrolled; a value that matches no
   * option checks nothing.
   * @control text
   */
  value?: string;
  /**
   * Initial selected value when uncontrolled. Nothing is selected when omitted.
   * @control text
   */
  defaultValue?: string;
  /**
   * Called with the newly selected value after user interaction only.
   * @control false
   * @controlReason Event handler with no serializable value; see the Controlled story.
   */
  onValueChange?: (value: string) => void;
  /**
   * Layout and arrow-key axis: a column navigated with Up/Down or a wrapping row navigated with Left/Right.
   * @control select
   * @default vertical
   */
  orientation?: RadioGroupOrientation;
  /**
   * Disables every option: none can be focused or selected and every row dims to 45% opacity.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * Requires a selection for form validity and sets aria-required on the group.
   * @control boolean
   * @default false
   */
  required?: boolean;
  /**
   * Form field name submitted with the checked value through hidden radio inputs. No field is submitted when omitted.
   * @control text
   */
  name?: string;
};

/** Group root: a column or a wrapping row of options. */
const radioGroupRootVariants = cva('eg-radio-group flex', {
  variants: {
    orientation: {
      vertical: 'flex-col gap-1',
      horizontal: 'flex-wrap gap-x-6 gap-y-1'
    }
  },
  defaultVariants: { orientation: 'vertical' }
});

/** Option row: 40px control plus label; the label brightens when checked and the row dims when disabled. */
const radioGroupRowVariants = cva(
  'flex items-center gap-2 min-h-10 font-sans text-label-default text-fg-secondary has-[[data-state=checked]]:text-fg-default has-[[data-disabled]]:opacity-45'
);

/** Radio circle: Material well when unchecked, primary bevel and halo when checked, focus ring winning in both. */
const radioGroupItemVariants = cva(
  'grid place-items-center box-border p-0 size-5 shrink-0 rounded-full border border-solid border-border-control bg-surface-0 shadow-[var(--shadow-well)] cursor-pointer transition-[border-color,box-shadow] ease-out duration-[var(--duration-fast)] motion-reduce:transition-none hover:border-fg-muted data-[state=checked]:border-action-primary-solid-bg data-[state=checked]:bg-[image:var(--gradient-btn-primary)] data-[state=checked]:shadow-[var(--shadow-btn-primary)] focus-visible:outline-none focus-visible:shadow-[var(--shadow-focus)] data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)] disabled:pointer-events-none'
);

/** Checked dot: 8px black circle centred in the raised control. */
const radioGroupIndicatorVariants = cva('size-2 rounded-full bg-action-primary-solid-fg');

/** Visible option text; clicking it selects the associated radio. */
const radioGroupLabelVariants = cva('cursor-pointer');

/**
 * Per-part recipes, exported so compositions such as SelectTile can match the root, row, radio
 * circle, indicator and label treatments.
 */
export const radioGroupVariants = {
  root: radioGroupRootVariants,
  row: radioGroupRowVariants,
  item: radioGroupItemVariants,
  indicator: radioGroupIndicatorVariants,
  label: radioGroupLabelVariants
} as const;
