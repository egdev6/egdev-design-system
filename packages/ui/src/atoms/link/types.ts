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
     * Open in a new tab with safe rel tokens and a hidden notice; the arrow still points right.
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
     * Show the trailing decorative right arrow, independent of external.
     * @control boolean
     * @default true
     */
    arrow?: boolean;
    /**
     * Appearance axis. plain is the only treatment: link-coloured text with a text underline at rest that
     * is removed on hover, where the arrow still moves and the colour stays. `underlined` is deprecated:
     * it is an alias that renders exactly like plain, kept so existing consumers do not break, and it
     * will be removed in a later major. Omit the prop instead of requesting underlined.
     * @control select
     * @default plain
     */
    variant?: LinkVariant;
  };

/**
 * Appearance axis for the link root. `underlined` is a deprecated alias of `plain` (same classes), kept
 * for compatibility until a later major removes it.
 */
export type LinkVariant = 'plain' | 'underlined';

// Resets the retained legacy .eg-link bottom border and padding, so the text underline is the only line.
const plainLinkRecipe = 'pb-0 border-0';

// The text underline follows the link colour (currentColor) and is offset by a space token; hover removes
// it instead of changing the colour, so the hover change never relies on colour alone (WCAG 1.4.1).
export const linkVariants = cva(
  'eg-link group/link inline-flex items-center gap-2 font-sans text-label-default text-link-default underline underline-offset-(--space-1) cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:no-underline focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)] focus-visible:rounded-sm motion-reduce:transition-none',
  {
    variants: {
      variant: {
        plain: plainLinkRecipe,
        /** @deprecated Alias of plain; renders the same classes. Removed in a later major. */
        underlined: plainLinkRecipe
      }
    },
    defaultVariants: { variant: 'plain' }
  }
);

// Utilities override retained legacy width/height and transform, avoiding double movement from
// CSS translate plus the old transform. The named group scopes motion to this link only.
export const linkArrowVariants = cva(
  'self-center shrink-0 transform-none transition-[translate] duration-(--duration-fast) ease-(--ease-out) motion-safe:group-hover/link:translate-x-1 motion-reduce:translate-none motion-reduce:transition-none'
);
