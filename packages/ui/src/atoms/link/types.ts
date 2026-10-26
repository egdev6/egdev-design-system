import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type LinkTargetProps =
  | {
      /**
       * Use the native anchor; href supplies its destination.
       * @control boolean
       * @default false
       */
      asChild?: false;
      /**
       * Native destination, required unless asChild is true.
       * @control text
       */
      href: string;
    }
  | {
      /**
       * Render onto one prop-spreading, ref-forwarding anchor child through Radix Slot.
       * The child owns href and must preserve anchor navigation semantics.
       * @control boolean
       */
      asChild: true;
      /**
       * Not available with asChild: the child supplies its destination.
       * @control text
       */
      href?: never;
    };

/** Standalone text navigation. className supports outer margin/alignment only, not appearance overrides. */
export type LinkProps = Omit<ComponentPropsWithoutRef<'a'>, 'href' | 'children'> &
  LinkTargetProps & {
    /**
     * Descriptive visible link text; exactly one anchor element when asChild is true.
     * @control false
     * @controlReason Non-serializable ReactNode content; see Default and AsChild stories.
     */
    children: ReactNode;
    /**
     * Open in a new tab with safe rel tokens, an up-right arrow and a hidden notice.
     * @control boolean
     * @default false
     */
    external?: boolean;
    /**
     * Localized screen-reader notice appended only when external is true.
     * @control text
     * @default (opens in a new tab)
     */
    newTabText?: string;
    /**
     * Show the trailing decorative direction arrow, derived from external.
     * @control boolean
     * @default true
     */
    arrow?: boolean;
  };

export const linkVariants = cva(
  'eg-link group/link inline-flex items-center gap-2 pb-0.5 border-b border-solid border-border-brand font-sans text-label-default text-fg-default no-underline cursor-pointer transition-[border-color,color] duration-(--duration-fast) ease-out hover:border-fg-brand-default hover:text-primitive-red-200 focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)] focus-visible:rounded-sm motion-reduce:transition-none'
);

// Utilities override retained legacy width/height and transform, avoiding double movement from
// CSS translate plus the old transform. The named group scopes motion to this link only.
export const linkArrowVariants = cva(
  'transform-none transition-[translate] duration-(--duration-base) ease-out group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 motion-reduce:translate-none motion-reduce:transition-none'
);
