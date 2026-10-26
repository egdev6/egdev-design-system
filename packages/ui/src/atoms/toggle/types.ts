import type * as TogglePrimitive from '@radix-ui/react-toggle';
import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

export type ToggleSize = 'sm' | 'md' | 'lg';

type ToggleContentProps =
  | {
      /**
       * Visible short text naming the condition; keep the name constant while toggling.
       * @control false
       * @controlReason Non-serializable ReactNode; see WithText and Controlled stories.
       */
      children: ReactNode;
      /**
       * Optional leading decorative glyph; omitted when absent.
       * @control false
       * @controlReason ReactElement cannot be serialized; see WithText and IconOnly stories.
       */
      icon?: ReactElement;
      /**
       * Not used with visible text; the text supplies the accessible name.
       * @control text
       */
      label?: never;
    }
  | {
      /**
       * No visible text in the icon-only form.
       * @control false
       * @controlReason Non-serializable ReactNode; see WithText and Controlled stories.
       */
      children?: never;
      /**
       * Required decorative glyph in the icon-only form, named separately by label.
       * @control false
       * @controlReason ReactElement cannot be serialized; see WithText and IconOnly stories.
       */
      icon: ReactElement;
      /**
       * Required non-empty accessible name describing the condition, not its next action.
       * @control text
       */
      label: string;
    };

/** A persistent two-state button, not a switch or a coordinated selection group. */
export type ToggleProps = Omit<
  ComponentPropsWithoutRef<typeof TogglePrimitive.Root>,
  'asChild' | 'children' | 'aria-pressed' | 'pressed' | 'defaultPressed' | 'onPressedChange'
> &
  ToggleContentProps & {
    /**
     * Controlled pressed state; uncontrolled when absent. Incoming updates emit no event.
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
     * Called with the next boolean after user activation.
     * @control false
     * @controlReason Non-serializable event callback; see the Controlled story.
     */
    onPressedChange?: (pressed: boolean) => void;
    /**
     * Control height: sm 32px, md 40px, lg 48px. Icon-only controls are square.
     * @control select
     * @default md
     */
    size?: ToggleSize;
  };

// Private recipes: only Toggle and its public types are exported from the component barrel.
export const toggleVariants = cva(
  'eg-toggle group/toggle box-border inline-flex shrink-0 items-center justify-center m-0 py-0 border border-solid border-transparent rounded-md bg-transparent bg-none [box-shadow:none] font-sans text-label-default text-fg-secondary text-center no-underline appearance-none cursor-pointer gap-2 outline-none transition-[color,background-color,border-color,box-shadow,scale] duration-(--duration-fast) ease-(--ease-out) data-[state=off]:hover:text-fg-default data-[state=off]:hover:bg-action-primary-bg-default data-[state=on]:bg-surface-3 data-[state=on]:bg-[image:var(--gradient-sheen)] data-[state=on]:border-border-hairline-strong data-[state=on]:[box-shadow:var(--shadow-edge-strong),var(--shadow-elev-1)] data-[state=on]:text-fg-default focus-visible:[box-shadow:var(--shadow-focus)] data-[state=on]:focus-visible:[box-shadow:var(--shadow-focus)] active:scale-97 active:duration-(--duration-press) active:ease-(--ease-snappy) data-disabled:opacity-45 data-disabled:pointer-events-none data-disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:transform-none motion-reduce:scale-100 motion-reduce:active:scale-100',
  {
    variants: {
      size: { sm: 'h-8 px-2', md: 'h-10 px-3', lg: 'h-12 px-3' },
      iconOnly: { true: 'p-0', false: '' }
    },
    compoundVariants: [
      { size: 'sm', iconOnly: true, className: 'size-8' },
      { size: 'md', iconOnly: true, className: 'size-10' },
      { size: 'lg', iconOnly: true, className: 'size-12' }
    ],
    defaultVariants: { size: 'md', iconOnly: false }
  }
);

export const toggleIconVariants = cva(
  'inline-flex shrink-0 items-center justify-center [&>svg]:size-full group-data-[state=on]/toggle:text-fg-brand-raised',
  { variants: { size: { sm: 'size-4', md: 'size-5', lg: 'size-5' } }, defaultVariants: { size: 'md' } }
);
