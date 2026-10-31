import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type { FieldMessageTone } from '../../atoms/field-message';

/** Placement of one control relative to its label; not a keyboard orientation. */
export type FieldLayout = 'stacked' | 'choice';

/** Consumer-derived text length and limit; Field never validates the control value. */
export type FieldCounter = {
  /** Current text length.
   * @control number
   */
  value: number;
  /** Maximum text length; exceeding it changes counter tone only.
   * @control number
   */
  max: number;
};

/**
 * Coordinates one compatible control with its name and descriptions, without owning its value.
 * Root className supports outer grid placement, margins and width only, merged last with cn.
 * No Field ref or asChild API; the child keeps its own ref through Radix Slot.
 */
export type FieldProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Required control name, even when visually hidden.
   * @control text
   */
  label: string;
  /**
   * Exactly one Input, Textarea, Select, Slider, Checkbox or Switch element; no Fragment.
   * Slot preserves child-first description ids and explicit child aria-invalid precedence.
   * With an error, omit aria-invalid entirely or supply true/'true'; explicit undefined,
   * null, false and other conflicting values are unsupported. Slider also needs its own label.
   * @control false
   * @controlReason ReactElement is not serializable; see WithInput, WithSelect, WithTextarea, WithSlider and choice stories.
   */
  children: ReactElement;
  /** Help text; replaced by a non-empty error. Omitted when absent or empty.
   * @control text
   */
  hint?: string;
  /** Presentation of the hint only; a non-empty error always takes precedence.
   * No tone changes control validity or creates a live region.
   * @default description
   * @control select
   */
  hintTone?: Exclude<FieldMessageTone, 'error'>;
  /** Consumer validation message; a non-empty string marks the compatible control invalid.
   * No live announcement or validation logic; an empty string is treated as absent.
   * @control text
   */
  error?: string;
  /** Consumer-derived length and limit, shown only in stacked layout; never invents an error.
   * @control false
   * @controlReason Structured FieldCounter is not a scalar control; see Counter and Invalid.
   */
  counter?: FieldCounter;
  /** Visible current value in a linked output; omitted in choice layout or when absent.
   * @control text
   */
  readout?: string;
  /** Keep the required label accessible while removing it from visual layout.
   * @default false
   * @control boolean
   */
  hideLabel?: boolean;
  /** Label above the control, or beside a Checkbox/Switch. Choice omits readout and counter.
   * @default stacked
   * @control select
   */
  layout?: FieldLayout;
};

/** No surface paint: the control atom owns its Material treatment. */
export const fieldVariants = cva('eg-field group min-w-0 font-sans', {
  variants: {
    layout: {
      stacked: 'flex flex-col gap-1.5',
      choice: 'grid grid-cols-[auto_1fr] items-center gap-x-2 gap-y-1 min-h-9 pointer-coarse:min-h-11'
    }
  },
  defaultVariants: { layout: 'stacked' }
});

/** Dim each Field-owned part once, never its Label/readout descendants or the control. */
const disabledPart = 'group-has-[:disabled]:opacity-45 group-has-[[data-disabled]]:opacity-45';

/** Label owns typography; this wrapper owns alignment, choice cursor and disabled opacity. */
export const fieldLabelRowVariants = cva(['flex justify-between gap-2', disabledPart], {
  variants: { layout: { stacked: '', choice: 'col-start-2 row-start-1 cursor-pointer' } },
  defaultVariants: { layout: 'stacked' }
});

/** Field owns layout and disabled dimming; FieldMessage owns paragraph appearance. */
export const fieldMessageVariants = cva(disabledPart, {
  variants: { layout: { stacked: '', choice: 'col-start-2' } },
  defaultVariants: { layout: 'stacked' }
});

/** Over-limit tone does not create error semantics. */
export const fieldCounterVariants = cva([
  'self-end text-label-default tabular-nums text-fg-muted data-[state=over]:text-status-danger',
  disabledPart
]);

/** Visible readout inherits disabled opacity from the label-row wrapper only. */
export const fieldReadoutVariants = cva('text-label-default tabular-nums text-fg-default');
