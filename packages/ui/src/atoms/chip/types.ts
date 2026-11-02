import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** The semantic role and rendered element of one Chip instance. */
export type ChipMode = 'toggle' | 'static' | 'link';

type ChipCommonProps = {
  /**
   * Visible short label and accessible name in every mode.
   * @control false
   * @controlReason Non-serializable ReactNode; see the Default, Static and Link stories.
   */
  children: ReactNode;
  /**
   * Optional decorative leading visual, hidden from assistive technology. Omitted when absent.
   * Size supplied content to the 14px wrapper; never supply focusable content.
   * @control false
   * @controlReason Non-serializable ReactNode; see the WithIcon story.
   */
  icon?: ReactNode;
};

type ChipPressedProps = {
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
};

export type ChipToggleProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  'children' | 'type' | 'value' | 'defaultValue' | 'onChange' | 'aria-pressed' | 'disabled'
> &
  ChipCommonProps &
  ChipPressedProps & {
    /**
     * Selects the semantic role and rendered element. Toggle is the pressable default;
     * static renders a plain span and link renders a native anchor.
     * @control select
     * @default toggle
     */
    mode?: 'toggle';
    /**
     * Removes the chip from the Tab order and blocks toggling; dims it to 45% opacity.
     * @control boolean
     * @default false
     */
    disabled?: boolean;
    href?: never;
    type?: never;
    'aria-pressed'?: never;
  };

export type ChipStaticProps = Omit<ComponentPropsWithoutRef<'span'>, 'children' | 'role'> &
  ChipCommonProps & {
    /**
     * Selects the static role: a non-interactive label pill with no pressed state.
     */
    mode: 'static';
    href?: never;
    pressed?: never;
    defaultPressed?: never;
    onPressedChange?: never;
    disabled?: never;
  };

export type ChipLinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'children' | 'href'> &
  ChipCommonProps & {
    /**
     * Selects the link role: the same pill rendered as a native anchor for a real destination.
     */
    mode: 'link';
    /**
     * Destination of the anchor; required in link mode and rejected in every other mode.
     * @control text
     */
    href: string;
    /**
     * Opens the destination in a new browsing context with safe rel values and a hidden notice.
     * @control boolean
     * @default false
     */
    external?: boolean;
    /**
     * Localized notice appended for assistive technology when external is true.
     * @control text
     * @default (opens in a new tab)
     */
    newTabText?: string;
    pressed?: never;
    defaultPressed?: never;
    onPressedChange?: never;
    disabled?: never;
  };

/** One pill with three roles: a pressable toggle (default), a static label or a navigation link. */
export type ChipProps = ChipToggleProps | ChipStaticProps | ChipLinkProps;

/**
 * Public pill recipe, shared with ChipGroup; the mode variant keeps the toggle recipe when omitted.
 * className supports outer layout only.
 */
export const chipVariants = cva(
  'eg-chip inline-flex items-center gap-1.5 min-h-8 px-2.5 py-1.5 rounded-full border border-border-hairline [background:var(--gradient-sheen),var(--color-surface-1)] shadow-edge font-sans text-label-default text-fg-secondary whitespace-nowrap',
  {
    variants: {
      mode: {
        toggle:
          'pointer-coarse:min-h-11 cursor-pointer transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default data-[state=on]:border-primitive-red-neon/60 data-[state=on]:[background:var(--gradient-chip-active),var(--color-surface-1)] data-[state=on]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)] data-[state=on]:text-fg-default active:translate-y-px active:scale-[.97] active:duration-[var(--duration-press)] active:ease-[var(--ease-snappy)] motion-reduce:active:transform-none motion-reduce:active:translate-none motion-reduce:active:scale-none focus-visible:outline-none focus-visible:shadow-focus data-[state=on]:focus-visible:shadow-focus disabled:opacity-45 disabled:pointer-events-none',
        static: '',
        link: 'pointer-coarse:min-h-11 cursor-pointer no-underline transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-hairline-strong hover:[background:var(--gradient-sheen),var(--color-surface-2)] hover:text-fg-default focus-visible:outline-none focus-visible:shadow-focus'
      }
    },
    defaultVariants: { mode: 'toggle' }
  }
);

/** Internal decorative part; not a public class override surface. */
export const chipIconVariants = cva(
  'inline-flex items-center justify-center size-3.5 shrink-0 [&>svg]:block [&>svg]:size-full'
);
