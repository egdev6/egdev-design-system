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
     * Appearance axis. plain is the default treatment: link-coloured text with a text underline at rest that
     * is removed on hover, where the arrow still moves and the colour stays. quiet is for links inside cards
     * and footer navigation: neutral text with a brand-coloured underline at rest, removed on hover the same
     * way; not for inline prose. `underlined` is deprecated: it is an alias that renders exactly like plain,
     * kept so existing consumers do not break, and it will be removed in a later major. Omit the prop instead
     * of requesting underlined.
     * @control select
     * @default plain
     */
    variant?: LinkVariant;
  };

/**
 * Appearance axis for the link root. `quiet` is neutral text with a brand underline for links in cards and
 * footer navigation. `underlined` is a deprecated alias of `plain` (same classes), kept for compatibility
 * until a later major removes it.
 */
export type LinkVariant = 'plain' | 'underlined' | 'quiet';

// The text underline is offset by a space token and hover removes it instead of changing the colour, so the
// hover change never relies on colour alone (WCAG 1.4.1). plain underlines in its link ink (currentColor);
// quiet keeps the neutral ink and paints the underline in the brand colour, its only non-colour cue at rest.
// Each variant owns its ink, so no branch emits two text-colour utilities and the result never relies on
// tailwind-merge to settle one. pb-0 border-0 resets the retained legacy .eg-link bottom border and padding,
// so the text underline is the only line. The recipes are inline literals on purpose: the system artifact
// builder reads string literals in `variants` but does not follow module-level constants.
export const linkVariants = cva(
  'eg-link group/link inline-flex items-center gap-2 font-sans text-label-default underline underline-offset-(--space-1) cursor-pointer transition-colors duration-(--duration-fast) ease-(--ease-out) hover:no-underline focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)] focus-visible:rounded-sm motion-reduce:transition-none',
  {
    variants: {
      variant: {
        plain: 'text-link-default pb-0 border-0',
        /** @deprecated Alias of plain; renders the same classes. Removed in a later major. */
        underlined: 'text-link-default pb-0 border-0',
        quiet: 'text-fg-default decoration-fg-brand-default pb-0 border-0'
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
