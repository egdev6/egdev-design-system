import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'dark';
export type ButtonSize = 'md' | 'sm';

/**
 * One labelled action. className supports root layout only (margin, alignment, placement,
 * width), merged last with cn; appearance overrides are unsupported. A slotted child must
 * spread props and forward its ref to a compatible link or button, without overriding state.
 */
export type ButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children'> & {
  /**
   * Non-empty visible action label; one compatible element when asChild is true.
   * @control false
   * @controlReason Non-serializable ReactNode; see Default and AsChildLink.
   */
  children: ReactNode;
  /**
   * Material treatment. Use dark only on flood backgrounds.
   * @control select
   * @default primary
   */
  variant?: ButtonVariant;
  /**
   * Desktop minimum height: md 48px or sm 40px. Prefer md in touch layouts.
   * @control select
   * @default md
   */
  size?: ButtonSize;
  /**
   * Optional decorative glyph, hidden from assistive technology. Button alone permits
   * start/end placement under its scoped leading-icon amendment; end is the default.
   * @control false
   * @controlReason ReactNode; see the WithIcon story.
   */
  icon?: ReactNode;
  /**
   * Side of the decorative icon slot, also used by the loading spinner.
   * @control select
   * @default end
   */
  iconPosition?: 'start' | 'end';
  /**
   * Pending operation: keeps focus, suppresses activation and replaces the icon with Spinner.
   * The consumer owns announcements. Explicit disabled takes precedence over focus retention.
   * @control boolean
   * @default false
   */
  loading?: boolean;
  /**
   * Compose onto one compatible child through Radix Slot. Native type is not forwarded.
   * Disabled children leave tab order; loading children remain focusable.
   * @control boolean
   * @default false
   */
  asChild?: boolean;
};

export const buttonVariants = cva(
  [
    'eg-btn group/button box-border m-0 inline-flex items-center justify-center border border-solid border-transparent rounded-md font-sans no-underline whitespace-nowrap cursor-pointer bg-transparent bg-none text-fg-default shadow-none [text-shadow:none] transform-none translate-none scale-100',
    '[transition-property:background,color,box-shadow,border-color,translate,scale] [transition-duration:var(--duration-fast),var(--duration-fast),var(--duration-base),var(--duration-base),var(--duration-fast),var(--duration-fast)] [transition-timing-function:var(--ease-out),var(--ease-out),var(--ease-out),var(--ease-out),var(--ease-spring),var(--ease-spring)]',
    '[&:not([aria-disabled=true]):active]:translate-y-px [&:not([aria-disabled=true]):active]:scale-97 [&:not([aria-disabled=true]):active]:duration-(--duration-press) [&:not([aria-disabled=true]):active]:ease-(--ease-snappy)',
    'focus-visible:outline-none focus-visible:[box-shadow:var(--shadow-focus)] focus-visible:ring-0',
    'data-disabled:opacity-45 data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:shadow-none data-disabled:translate-none data-disabled:scale-100',
    'data-[state=loading]:pointer-events-auto data-[state=loading]:opacity-100 data-[state=loading]:cursor-progress data-[state=loading]:translate-none data-[state=loading]:scale-100',
    'data-disabled:data-[state=loading]:pointer-events-none data-disabled:data-[state=loading]:opacity-45 data-disabled:data-[state=loading]:cursor-not-allowed',
    'motion-reduce:transition-none motion-reduce:transform-none motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:[&:not([aria-disabled=true]):not(:active):hover]:translate-none motion-reduce:[&:not([aria-disabled=true]):active]:translate-none motion-reduce:[&:not([aria-disabled=true]):active]:scale-100'
  ],
  {
    variants: {
      variant: {
        primary:
          '[background-image:var(--gradient-btn-primary)] border-border-brand-strong text-action-primary-solid-fg [box-shadow:var(--shadow-btn-primary)] [&:not([aria-disabled=true]):not(:active):hover]:[background-image:var(--gradient-btn-primary-hover)] [&:not([aria-disabled=true]):not(:active):not(:focus-visible):hover]:[box-shadow:var(--shadow-btn-primary-hover)] [&:not([aria-disabled=true]):not(:active):hover]:-translate-y-px [&:not([aria-disabled=true]):active]:bg-action-primary-solid-bg [&:not([aria-disabled=true]):active]:bg-none [&:not([aria-disabled=true]):not(:focus-visible):active]:[box-shadow:var(--shadow-btn-pressed)]',
        secondary:
          'bg-surface-1 [background-image:var(--gradient-btn-secondary)] border-border-brand text-action-primary-fg [box-shadow:var(--shadow-edge-strong),var(--shadow-elev-1)] [&:not([aria-disabled=true]):not(:active):hover]:[background-image:var(--gradient-btn-secondary-hover)] [&:not([aria-disabled=true]):not(:active):hover]:border-primitive-red-neon [&:not([aria-disabled=true]):not(:active):not(:focus-visible):hover]:[box-shadow:var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] [&:not([aria-disabled=true]):not(:active):hover]:-translate-y-px [&:not([aria-disabled=true]):active]:bg-alpha-red-15 [&:not([aria-disabled=true]):active]:bg-none [&:not([aria-disabled=true]):not(:focus-visible):active]:[box-shadow:var(--shadow-btn-pressed)]',
        ghost:
          'text-fg-secondary [&:not([aria-disabled=true]):hover]:bg-surface-2 [&:not([aria-disabled=true]):hover]:[background-image:var(--gradient-sheen)] [&:not([aria-disabled=true]):not(:focus-visible):hover]:shadow-(--shadow-edge) [&:not([aria-disabled=true]):not(:focus-visible):hover]:ring [&:not([aria-disabled=true]):not(:focus-visible):hover]:ring-border-hairline [&:not([aria-disabled=true]):hover]:text-fg-default',
        dark: 'bg-primitive-black text-primitive-white [&:not([aria-disabled=true]):hover]:bg-primitive-neutral-900 [&:not([aria-disabled=true]):not(:active):hover]:-translate-y-0.5'
      },
      size: {
        md: 'min-h-12 py-3 px-5.5 gap-2.5 text-cta-label',
        sm: 'min-h-10 py-2 px-4 gap-2 text-label-default [font-weight:var(--text-cta-label--font-weight)]'
      }
    },
    defaultVariants: { variant: 'primary', size: 'md' }
  }
);

export const buttonIconVariants = cva(
  'eg-btn__icon inline-flex flex-none items-center justify-center fill-none stroke-current stroke-(length:--icon-stroke) [stroke-linecap:round] [stroke-linejoin:round] transform-none translate-none transition-[translate] duration-(--duration-base) ease-(--ease-out) group-[:not([aria-disabled=true]):hover]/button:translate-x-0.5 motion-reduce:transition-none motion-reduce:transform-none motion-reduce:translate-none motion-reduce:group-[:not([aria-disabled=true]):hover]/button:translate-none [&>svg]:size-full',
  { variants: { size: { md: 'size-(--icon-size)', sm: 'size-4' } }, defaultVariants: { size: 'md' } }
);
