import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Value ink family for one definition row; the term and the frame never change. */
export type TerminalCardTone = 'default' | 'success';

/** One ordered definition pair rendered as a `dt`/`dd` row. */
export type TerminalCardRow = {
  /**
   * The definition term, rendered as the `dt`.
   * @control text
   */
  term: string;
  /**
   * The definition value, rendered as the `dd`. Readable text; a decorative system atom such
   * as `StatusDot` may be composed inside it. The value never receives controls.
   * @control false
   * @controlReason Non-serializable ReactNode; see the Default and StatusPairs stories.
   */
  value: ReactNode;
  /**
   * Value ink family. `success` paints the value with the status ink; the row's visible text
   * must still state the condition, because colour is never the only cue.
   * @default default
   * @control select
   */
  tone?: TerminalCardTone;
  /**
   * Renders the decorative block cursor after the value. Never announced, never focusable,
   * and static under reduced motion. At most one row should carry it; the rule is documented,
   * not enforced.
   * @default false
   * @control boolean
   */
  caret?: boolean;
};

type TerminalCardNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'role'
  | 'tabIndex'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-pressed'
  | 'aria-selected'
  | 'style'
  | 'dangerouslySetInnerHTML'
>;

/**
 * Passive named key/value terminal card: a `role="group"` region with a title bar and a
 * definition list. className supports outer layout only; no ref or asChild API.
 */
export type TerminalCardProps = TerminalCardNativeProps & {
  /**
   * Accessible name of the `role="group"` region. Required and non-empty; a blank or
   * whitespace-only label renders nothing, because an unnamed group is never promised.
   * @control text
   */
  label: string;
  /**
   * `TerminalCardBar` and `TerminalCardList` in that order, as direct children.
   * @control false
   * @controlReason Non-serializable ReactNode composition; see the Default and WithShell stories.
   */
  children: ReactNode;
  /**
   * Outer layout only (width, margin, grid placement). The card has no built-in maximum
   * width; the consumer decides it here.
   * @control text
   */
  className?: string;
};

/**
 * Title bar showing the current path and, optionally, the shell name on the trailing edge.
 * No ref or asChild API; className supports local layout only.
 */
export type TerminalCardBarProps = {
  /**
   * The path text shown after the decorative glyph; plain text, `span` or `code`. Controls
   * are not acceptable bar content.
   * @control false
   * @controlReason Non-serializable ReactNode; see the Default and WithShell stories.
   */
  children: ReactNode;
  /**
   * Trailing shell name such as `zsh`. Rendered only when supplied; whitespace-only
   * renders nothing.
   * @control text
   */
  shell?: string;
  /**
   * Local layout only; merged last through `cn()`.
   * @control text
   */
  className?: string;
};

/**
 * Ordered definition pairs rendered as `dl` > `dt`/`dd`. No controls, no links and no nested
 * lists. No ref or asChild API; className supports local layout only.
 */
export type TerminalCardListProps = {
  /**
   * Ordered definition pairs. An empty array renders an empty list and should be omitted
   * instead.
   * @control false
   * @controlReason Structured row objects are not serializable as one control; see the Default
   * and StatusPairs stories.
   */
  items: TerminalCardRow[];
  /**
   * Local layout only; merged last through `cn()`.
   * @control text
   */
  className?: string;
};

/** Root frame layout; the Material surface recipe supplies tone, border, radius and shadow. */
export const terminalCardVariants = cva('eg-terminal-card flex flex-col min-w-0 overflow-hidden');

/** Banded-header geometry over the bar's `surface-2` Material band. */
export const terminalCardBarVariants = cva(
  'eg-terminal-card__bar border-b border-border-hairline rounded-t-xl flex items-center gap-2 px-4 py-2.5 min-w-0'
);

/** Trailing shell name; rendered only when a non-blank shell is supplied. */
export const terminalCardShellVariants = cva(
  'eg-terminal-card__shell font-sans text-label-default text-fg-secondary ms-auto shrink-0'
);

/** Two-column definition grid; long terms and values wrap instead of scrolling. */
export const terminalCardListVariants = cva(
  'eg-terminal-card__list grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 px-4 py-3 m-0 font-mono text-body-default min-w-0'
);

/** Definition term ink; the Material brand ink for text on raised surfaces. */
export const terminalCardTermVariants = cva(
  'eg-terminal-card__term min-w-0 [overflow-wrap:anywhere] text-fg-brand-raised'
);

/** Definition value ink; a success tone repaints the value only, through `data-tone`. */
export const terminalCardValueVariants = cva(
  'eg-terminal-card__value min-w-0 tabular-nums text-fg-default [overflow-wrap:anywhere]',
  {
    variants: {
      tone: {
        default: '',
        success: 'data-[tone=success]:text-status-success'
      }
    },
    defaultVariants: { tone: 'default' }
  }
);

/** Decorative block cursor; the existing pulse token, static under reduced motion. */
export const terminalCardCaretVariants = cva(
  'eg-terminal-card__caret inline-block w-2 h-4 bg-fg-brand-default align-text-bottom animate-pulse motion-reduce:animate-none'
);
