import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type OwnedNativeProps =
  | 'children'
  | 'style'
  | 'dangerouslySetInnerHTML'
  | 'contentEditable'
  | 'suppressContentEditableWarning'
  | 'aria-expanded'
  | 'aria-controls';

type ControlledDisclosure = {
  /**
   * Owner-supplied visibility; do not switch control mode while mounted.
   * @control boolean
   */
  open: boolean;
  /**
   * Initial visibility only; unavailable in controlled mode, where open is authoritative.
   * @control boolean
   */
  defaultOpen?: never;
  /**
   * Requests the next visibility without echoing mount or incoming prop updates.
   * @control false
   * @controlReason Non-serializable callback; see Controlled and CanceledActivation.
   */
  onOpenChange: (open: boolean) => void;
};

type UncontrolledDisclosure = {
  /**
   * Owner-supplied visibility; omit in uncontrolled mode and do not switch mode while mounted.
   * @control boolean
   */
  open?: never;
  /**
   * Initial visibility only; later changes do not reset the native state.
   * @default false
   * @control boolean
   */
  defaultOpen?: boolean;
  /**
   * Requests the next visibility without echoing mount or incoming prop updates.
   * @control false
   * @controlReason Non-serializable callback; see Controlled and CanceledActivation.
   */
  onOpenChange?: (open: boolean) => void;
};

/**
 * One in-flow disclosure. Supply one Trigger/Content pair, optionally with a heading.
 * className supports outer margin, width/max-width and grid/flex placement, merged last.
 * Paint, padding, state and presence overrides are unsupported; no Root ref or asChild API.
 */
export type CollapsibleProps = Omit<ComponentPropsWithoutRef<'div'>, OwnedNativeProps | 'role' | 'tabIndex'> &
  (ControlledDisclosure | UncontrolledDisclosure) & {
    /**
     * One named Trigger/Content pair; nested Roots are independent.
     * @control false
     * @controlReason Non-serializable ReactNode; see Default, Heading and Nested.
     */
    children: ReactNode;
    /**
     * Disable only Trigger activation, retaining visibility and enabled body controls.
     * @default false
     * @control boolean
     */
    disabled?: boolean;
  };

/**
 * Native disclosure button with a React 18-compatible HTMLButtonElement ref.
 * className supports outer margin/self-alignment only, merged last; target, paint,
 * wrapping and caret overrides are unsupported. preventDefault onClick cancels toggling.
 */
export type CollapsibleTriggerProps = Omit<
  ComponentPropsWithoutRef<'button'>,
  OwnedNativeProps | 'type' | 'disabled' | 'role' | 'tabIndex' | 'aria-disabled' | 'aria-pressed'
> & {
  /**
   * Required non-empty visible inline label; no focusable descendants.
   * @control false
   * @controlReason Non-serializable ReactNode; see Default and LongLabel.
   */
  children: ReactNode;
};

/**
 * In-flow body; the native hidden shell/id remains closed while children unmount.
 * Lift persistent form state outside it. className supports outer margin/self-alignment
 * only, merged last; no id, hidden, ref, forceMount or asChild API. Opt-in regions need a name.
 */
export type CollapsibleContentProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  OwnedNativeProps | 'id' | 'hidden' | 'tabIndex'
> & {
  /**
   * Meaningful flow content; children remount on reopening and local state may reset.
   * @control false
   * @controlReason Non-serializable ReactNode; see WithFormContent, Remount and NamedRegion.
   */
  children: ReactNode;
};

// Internal recipes: native state attributes select appearance, never mirrored state classes.
export const collapsibleVariants = cva('eg-collapsible overflow-visible');
export const collapsibleTriggerVariants = cva(
  'eg-collapsible__trigger group/collapsible w-full justify-between text-start whitespace-normal'
);
export const collapsibleContentVariants = cva(
  'eg-collapsible__content border-t-(length:--border-width) border-solid border-border-hairline p-4 font-sans text-body-default text-fg-default'
);
export const collapsibleLabelVariants = cva('min-w-0 [overflow-wrap:anywhere]');
export const collapsibleCaretVariants = cva(
  'inline-flex shrink-0 transition-transform duration-(--duration-fast) ease-(--ease-out) group-data-[state=open]/collapsible:rotate-180 motion-reduce:transition-none motion-reduce:transform-none motion-reduce:rotate-0 motion-reduce:group-data-[state=open]/collapsible:rotate-0'
);
