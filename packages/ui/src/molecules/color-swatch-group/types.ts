import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** One named preset color. Values are unique opaque six-digit hexadecimal sRGB colors. */
export type ColorSwatchGroupOption = {
  /**
   * Preset color in #RRGGBB form; emitted unchanged when selected.
   * @control text
   */
  value: string;
  /**
   * Nonblank localized accessible color name, visually hidden in the circular swatch.
   * @control text
   */
  label: string;
  /**
   * Disables this preset while preserving an existing selection.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
};

type ColorSwatchGroupNativeProps = Omit<
  ComponentPropsWithoutRef<'fieldset'>,
  | 'children'
  | 'style'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'onChange'
  | 'name'
  | 'dangerouslySetInnerHTML'
  | 'defaultValue'
  | 'required'
>;

/**
 * Consumer-controlled color choice. Only opaque #RRGGBB values are accepted; malformed
 * options are skipped and malformed current values show an em dash. The consumer owns
 * localization, persistence, normalization, reset and form serialization. Root className
 * merges last for margins, width and parent placement only, not appearance or part overrides.
 * There is no uncontrolled state, ref, asChild, custom renderer or native form API.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
export type ColorSwatchGroupProps = ColorSwatchGroupNativeProps & {
  /**
   * Nonblank localized visible legend, radio-group name and current-value prefix.
   * @control text
   */
  label: string;
  /**
   * Ordered named presets. Invalid colors, blank labels and later case-insensitive duplicates are skipped.
   * @control false
   * @controlReason Structured option data is not a scalar control; see Presets and InvalidInput.
   */
  options: ColorSwatchGroupOption[];
  /**
   * Authoritative #RRGGBB color, including colors not present among the presets.
   * @control text
   */
  value: string;
  /**
   * Requests a user-driven color change without normalizing or persisting it.
   * @control false
   * @controlReason Callback functions are not serializable; see Controlled and ConsumerControlled.
   */
  onValueChange: (value: string) => void;
  /**
   * Localized accessible name for the separate native picker, visually hidden in the
   * spectrum control; absent or blank omits it.
   * @control text
   */
  customLabel?: string;
};

/**
 * Private token-backed recipes for the circular accent-picker look. The sample color is
 * confined to the decorative patch; the spectrum is a static token gradient.
 */
export const colorSwatchGroupVariants = {
  root: cva('eg-color-swatch-group min-w-0 border-0 p-0 font-sans text-fg-default'),
  legend: cva('mb-2 text-label-default text-fg-default'),
  row: cva('flex flex-wrap items-center gap-3'),
  group: cva('flex flex-wrap items-center gap-3'),
  item: cva([
    'group relative inline-flex size-14 shrink-0 items-center justify-center rounded-full border-0 bg-transparent p-0',
    // Focus is a distinct focus-ring outline offset beyond the selection ring.
    'cursor-pointer focus-visible:outline-solid focus-visible:outline-(length:--focus-width)',
    'focus-visible:outline-focus-ring focus-visible:outline-offset-(--focus-offset)',
    'forced-colors:focus-visible:outline-[color:Highlight]',
    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-45',
    'motion-reduce:transition-none motion-reduce:transform-none'
  ]),
  patch: cva('size-12 shrink-0 rounded-full bg-[color:var(--eg-swatch-color)] forced-colors:forced-color-adjust-none'),
  /**
   * Shared decorative ring of presets and the custom control: an inset token hairline on
   * every circle and, when the owning target is checked, a 2px fg-default outline separated
   * from the circle by a surface gap of the same focus-width geometry.
   */
  ring: cva([
    'pointer-events-none absolute inset-0 m-auto size-12 rounded-full',
    'border-solid border-(length:--border-width) border-border-hairline-strong',
    'group-data-[state=checked]:outline-solid group-data-[state=checked]:outline-(length:--focus-width)',
    'group-data-[state=checked]:outline-fg-default group-data-[state=checked]:outline-offset-(--focus-width)',
    'forced-colors:group-data-[state=checked]:outline-[color:CanvasText]'
  ]),
  optionLabel: cva('sr-only'),
  customFrame: cva([
    'group relative inline-flex size-14 shrink-0 items-center justify-center rounded-full',
    // The transparent native input keeps focus; the frame shows it like a preset target.
    'has-[:focus-visible]:outline-solid has-[:focus-visible]:outline-(length:--focus-width)',
    'has-[:focus-visible]:outline-focus-ring has-[:focus-visible]:outline-offset-(--focus-offset)',
    'forced-colors:has-[:focus-visible]:outline-[color:Highlight]',
    'has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45'
  ]),
  spectrum: cva('pointer-events-none absolute inset-0 m-auto size-12 rounded-full bg-[image:var(--gradient-spectrum)]'),
  badge: cva(
    'pointer-events-none relative inline-flex size-5 items-center justify-center rounded-full bg-surface-0 text-fg-default'
  ),
  customLabel: cva('sr-only'),
  customInput: cva([
    'absolute inset-0 size-full cursor-pointer rounded-full opacity-0 focus-visible:outline-none',
    'disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:transform-none'
  ]),
  output: cva('mt-2 block text-label-default text-fg-default wrap-anywhere')
} as const;
