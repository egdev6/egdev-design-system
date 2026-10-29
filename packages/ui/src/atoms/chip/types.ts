import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** A pressable pill that switches one option on or off. No ref, asChild or group coordination. */
export type ChipProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'aria-pressed' | 'disabled'
> & {
  /**
   * Visible short label and accessible name.
   * @control false
   * @controlReason Non-serializable ReactNode; see the Default and WithIcon stories.
   */
  children: ReactNode;
  /**
   * Controlled pressed state; the chip is uncontrolled when omitted. Incoming updates emit no event.
   * @control boolean
   */
  pressed?: boolean;
  /**
   * Initial pressed state when uncontrolled.
   * @control boolean
   * @default false
   */
  defaultPressed?: boolean;
  /**
   * Called with the next pressed state after user interaction only.
   * @control false
   * @controlReason Non-serializable event callback; see the Controlled story.
   */
  onPressedChange?: (pressed: boolean) => void;
  /**
   * Optional decorative leading visual, hidden from assistive technology. Omitted when absent.
   * Size supplied content to the 14px wrapper; never supply focusable content.
   * @control false
   * @controlReason Non-serializable ReactNode; see the WithIcon story.
   */
  icon?: ReactNode;
  /**
   * Removes the chip from the Tab order and blocks toggling; dims it to 45% opacity.
   * @control boolean
   * @default false
   */
  disabled?: boolean;
};

/** Public pill recipe, shared with the future ChipGroup; className supports outer layout only. */
export const chipVariants = cva(
  'eg-chip inline-flex items-center gap-1.5 min-h-8 pointer-coarse:min-h-11 px-2.5 py-1.5 rounded-full border border-border-hairline [background:var(--gradient-sheen),var(--color-surface-1)] shadow-edge font-sans text-label-default text-fg-secondary whitespace-nowrap cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default data-[state=on]:border-primitive-red-neon/60 data-[state=on]:[background:var(--gradient-chip-active),var(--color-surface-1)] data-[state=on]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] data-[state=on]:text-fg-default active:translate-y-px active:scale-[.97] active:duration-[var(--duration-press)] active:ease-[var(--ease-snappy)] motion-reduce:active:transform-none motion-reduce:active:translate-none motion-reduce:active:scale-none focus-visible:outline-none focus-visible:shadow-focus data-[state=on]:focus-visible:shadow-focus disabled:opacity-45 disabled:pointer-events-none'
);

/** Internal decorative part; not a public class override surface. */
export const chipIconVariants = cva(
  'inline-flex items-center justify-center size-3.5 shrink-0 [&>svg]:block [&>svg]:size-full'
);
