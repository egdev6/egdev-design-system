import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/**
 * One keyboard key or shortcut glyph rendered as native inline `kbd` text. Combos are
 * composed by the consumer with text separators, one Kbd per key.
 */
export type KbdProps = Omit<ComponentPropsWithoutRef<'kbd'>, 'children' | 'dangerouslySetInnerHTML'> & {
  /**
   * Short key text, for example `⌘K`, `Ctrl` or `Esc`. Plain text only; it never wraps.
   * @control text
   */
  children: string;
  /**
   * Spoken key name for symbol keys, for example `Command K`. When set, the visible glyph is
   * hidden from assistive technology and this name is read instead. When omitted or empty,
   * the children are read as-is.
   * @control text
   */
  label?: string;
};

/** Flat inline key treatment: hairline subtle border, small radius and secondary label text. */
export const kbdVariants = cva(
  'eg-kbd inline-block whitespace-nowrap rounded-sm border border-border-subtle px-1.5 py-0.5 font-sans text-label-default text-fg-secondary'
);
