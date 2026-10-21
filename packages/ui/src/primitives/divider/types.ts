import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type DividerOrientation = 'horizontal' | 'vertical';

/** Internal recipe: orientation comes from Radix attributes, not mirrored classes. */
export const dividerVariants = cva([
  'eg-divider block m-0 p-0 border-0',
  'data-[orientation=horizontal]:flex-auto',
  'data-[orientation=horizontal]:h-[var(--border-width)]',
  'data-[orientation=horizontal]:min-w-6',
  'data-[orientation=horizontal]:bg-linear-to-r',
  'data-[orientation=horizontal]:from-border-brand',
  'data-[orientation=horizontal]:to-border-brand/0',
  'data-[orientation=vertical]:flex-none',
  'data-[orientation=vertical]:w-[var(--border-width)]',
  'data-[orientation=vertical]:min-w-0',
  'data-[orientation=vertical]:h-4.5',
  'data-[orientation=vertical]:self-center',
  'data-[orientation=vertical]:bg-border-brand'
]);

export type DividerProps = Omit<
  ComponentPropsWithoutRef<'span'>,
  'children' | 'dangerouslySetInnerHTML' | 'role' | 'aria-orientation' | 'aria-hidden' | 'tabIndex'
> & {
  /**
   * Rule axis, shared with Radix semantic orientation. Horizontal fades physically left to right,
   * including in RTL. Parent layout supplies the available horizontal length.
   * @control select
   * @default horizontal
   */
  orientation?: DividerOrientation;
  /**
   * Whether the rule is decoration rather than a meaningful content boundary.
   * Changes semantics only, never paint. Set false for a semantic separator.
   * @control boolean
   * @default true
   */
  decorative?: boolean;
};
