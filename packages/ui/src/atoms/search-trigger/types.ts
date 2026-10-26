import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * Native search launcher. Activation only requests search: the host owns the palette, its
 * shortcut registration and its dialog lifecycle. className supports root width, margins and
 * parent layout only, merged last with cn; appearance overrides are unsupported.
 */
export type SearchTriggerProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'type' | 'role' | 'aria-label' | 'aria-labelledby' | 'aria-pressed' | 'dangerouslySetInnerHTML'
> & {
  /**
   * Visible search label and accessible button name, also used in compact mode. A supplied
   * value must be non-empty.
   * @default Search…
   * @control text
   */
  label?: string;
  /**
   * Display-only keyboard hint shown in a decorative Kbd. Omitted unless the host supplies a
   * real binding; whitespace-only text is omitted too. It never registers a shortcut.
   * @control text
   */
  shortcut?: string;
  /**
   * Show only the search icon without changing the accessible name.
   * @default false
   * @control boolean
   */
  compact?: boolean;
};

/** Launcher layout over the Surface well recipe; resets every legacy .eg-search default. */
export const searchTriggerVariants = cva(
  [
    'eg-search inline-flex items-center gap-3 h-auto min-h-10 pointer-coarse:min-h-11 border-border-hairline-strong ps-3 pe-2 py-0 text-fg-muted font-sans text-label-default font-[var(--text-body-default--font-weight)] cursor-pointer',
    'transition-[border-color,color] duration-(--duration-fast) ease-(--ease-out) motion-reduce:transition-none',
    'enabled:hover:border-border-brand enabled:hover:text-fg-secondary focus-visible:outline-none focus-visible:shadow-focus',
    'disabled:opacity-45 disabled:pointer-events-none disabled:cursor-not-allowed'
  ],
  {
    variants: {
      compact: {
        false: 'min-w-48',
        true: 'min-w-0 w-10 pointer-coarse:w-11 p-0 justify-center'
      }
    },
    defaultVariants: { compact: false }
  }
);

/** Visible label part: never wraps. */
export const searchTriggerLabelVariants = cva('whitespace-nowrap');

/** Decorative trailing hint wrapper: logical margin pushes the unmodified Kbd to the end. */
export const searchTriggerHintVariants = cva('ms-auto');
