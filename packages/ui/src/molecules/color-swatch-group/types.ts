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
   * Nonblank localized visible and accessible color name.
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
   * Localized visible name for the separate native picker; absent or blank omits it.
   * @control text
   */
  customLabel?: string;
};

/** Private token-backed recipes. The sample color is confined to the decorative patch. */
export const colorSwatchGroupVariants = {
  root: cva('eg-color-swatch-group min-w-0 border-0 p-0 font-sans text-fg-default'),
  legend: cva('mb-2 text-label-default text-fg-default'),
  group: cva('flex flex-wrap items-stretch gap-2'),
  item: cva([
    'relative inline-flex min-h-14 min-w-14 items-center gap-2 px-2 py-1 text-start text-label-default text-fg-default',
    'border-border-control cursor-pointer focus-visible:outline-none focus-visible:shadow-focus',
    'forced-colors:focus-visible:outline-solid forced-colors:focus-visible:outline-(length:--focus-width)',
    'forced-colors:focus-visible:outline-[color:Highlight]',
    'data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-45',
    'motion-reduce:transition-none motion-reduce:transform-none'
  ]),
  patch: cva('size-10 shrink-0 bg-[color:var(--eg-swatch-color)]'),
  optionLabel: cva('min-w-0 wrap-anywhere text-fg-default'),
  indicator: cva(
    'absolute end-1 top-1 inline-flex size-5 items-center justify-center rounded-full bg-surface-0 text-fg-default'
  ),
  customFrame: cva([
    'mt-2 inline-flex items-center gap-2 border-border-control px-2',
    'has-[:disabled]:pointer-events-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-45'
  ]),
  customLabel: cva('text-label-default text-fg-default wrap-anywhere'),
  customInput: cva([
    'min-h-14 min-w-14 cursor-pointer focus-visible:outline-none focus-visible:shadow-focus',
    'forced-colors:focus-visible:outline-solid forced-colors:focus-visible:outline-(length:--focus-width)',
    'forced-colors:focus-visible:outline-[color:Highlight]',
    'disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:transform-none'
  ]),
  output: cva('mt-2 block text-label-default text-fg-default wrap-anywhere')
} as const;
