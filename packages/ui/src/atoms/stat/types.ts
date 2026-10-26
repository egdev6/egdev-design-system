import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Figure scale: `md` 36px figure, `sm` 28px figure with tighter padding. */
export type StatSize = 'md' | 'sm';

/**
 * One live figure with its visible label and an optional one-line context, rendered as a
 * group named by the label. Passive: no focus, events, timers or announcements.
 */
export type StatProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role'> & {
  /**
   * Visible label of what is counted; it is also the accessible name of the group.
   * @control text
   */
  label: string;
  /**
   * The figure. Numbers render as `String(value)` and strings render as given, so the consumer
   * owns locale formatting. `null` means no data: a muted em dash hidden from assistive
   * technology plus the readable `unavailableText`; it never renders 0.
   * @control false
   * @controlReason Mixed text, number and null union; no single control represents it. See the Default and NoData stories.
   */
  value: string | number | null;
  /**
   * Short context under the figure, such as the latest change or why there is no data. When
   * omitted, no delta element is rendered.
   * @control text
   */
  delta?: string;
  /**
   * Brief emphasis after a change: brand border and glow. The consumer starts and ends it and
   * keeps one highlighted Stat at a time; the component never starts timers.
   * @control boolean
   * @default false
   */
  highlighted?: boolean;
  /**
   * Figure scale: `md` 36px, `sm` 28px with tighter padding and gap.
   * @control select
   * @default md
   */
  size?: StatSize;
  /**
   * Accessible replacement for the em dash, used only when `value` is `null`.
   * @control text
   * @default No data
   */
  unavailableText?: string;
};

/** Material elevated card: sheen over surface-1, hairline, light edge and two-layer elevation. */
export const statVariants = cva(
  'eg-stat group/stat flex flex-col min-w-0 border border-border-hairline rounded-lg bg-surface-1 bg-[image:var(--gradient-sheen)] shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-[border-color,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] motion-reduce:transition-none data-[state=highlighted]:border-border-brand data-[state=highlighted]:shadow-[var(--shadow-edge),var(--shadow-glow-base)]',
  {
    variants: {
      size: {
        md: 'gap-1.5 px-4 py-3',
        sm: 'gap-1 px-3 py-2.5'
      }
    },
    defaultVariants: { size: 'md' }
  }
);

/** Uppercase muted display label (D7: nearest `text-meta` recipe). */
export const statLabelVariants = cva('eg-stat-label font-display text-meta uppercase text-fg-muted');

/** Condensed heavy tabular figure; unavailable figures are muted. */
export const statValueVariants = cva(
  'eg-stat-value font-display tabular-nums text-fg-default data-[state=unavailable]:text-fg-muted',
  {
    variants: {
      size: {
        md: 'text-display-stat',
        sm: 'text-display-stat-sm'
      }
    },
    defaultVariants: { size: 'md' }
  }
);

/** Readable no-data replacement for the hidden em dash; visually hidden, still announced. */
export const statUnavailableTextVariants = cva('sr-only');

/** Secondary context line; brand-raised while the root is highlighted. */
export const statDeltaVariants = cva(
  'eg-stat-delta font-sans text-label-default text-fg-secondary group-data-[state=highlighted]/stat:text-fg-brand-raised'
);
