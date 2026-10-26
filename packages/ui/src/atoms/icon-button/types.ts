import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';

export type IconButtonVariant = 'ghost' | 'outline' | 'primary' | 'secondary';
export type IconButtonSize = 'sm' | 'md' | 'lg';

/** Icon-only action; native attributes pass through except the owned hidden-label mechanism. */
export type IconButtonProps = Omit<ComponentPropsWithoutRef<'button'>, 'children' | 'aria-label'> & {
  /**
   * Clear, non-empty accessible name rendered as Radix visually hidden text, not aria-label.
   * @control text
   */
  label: string;
  /**
   * One decorative Icon (without its own label) or SVG element, hidden from assistive technology.
   * @control false
   * @controlReason ReactElement; see the Variants story for system icons and RawSvg for a custom SVG.
   */
  icon: ReactElement;
  /**
   * Visual treatment. Outline is round; every other treatment uses radius-md.
   * @control select
   * @default ghost
   */
  variant?: IconButtonVariant;
  /**
   * Square control: sm 32px, md 40px, lg 48px. Glyph: sm 16px, otherwise 20px.
   * Use sm only for dense desktop toolbars; touch layouts provide a hit area of at least 44px.
   * @control select
   * @default md
   */
  size?: IconButtonSize;
  /**
   * Apply the control to one child through Radix Slot. The child accepts props and forwards refs.
   * Supply an empty anchor/router link; IconButton inserts its icon and hidden name.
   * @control boolean
   * @default false
   */
  asChild?: boolean;
  /**
   * Single host element when asChild is true; not visible label content. Omitted in native mode.
   * @control false
   * @controlReason ReactElement host cannot be edited as text; see AsChildLink.
   */
  children?: ReactElement;
};

// Every legacy root property is explicitly replaced in the utilities layer; no modifier classes.
export const iconButtonVariants = cva(
  'eg-icon-btn group/icon-button box-border inline-grid place-items-center flex-none p-0 border-solid border-transparent no-underline cursor-pointer transform-none translate-none scale-100 [transition:color_var(--duration-fast)_var(--ease-out),background-color_var(--duration-fast)_var(--ease-out),border-color_var(--duration-base)_var(--ease-out),transform_var(--duration-fast)_var(--ease-spring),translate_var(--duration-fast)_var(--ease-spring),scale_var(--duration-fast)_var(--ease-spring),box-shadow_var(--duration-base)_var(--ease-out)] motion-safe:[&:not([data-disabled]):active]:scale-94 [&:not([data-disabled]):active]:duration-(--duration-press) focus-visible:outline-none focus-visible:shadow-focus data-disabled:opacity-45 data-disabled:pointer-events-none data-disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:transform-none motion-reduce:translate-none motion-reduce:scale-100 motion-reduce:hover:translate-none motion-reduce:active:scale-100',
  {
    variants: {
      variant: {
        ghost:
          'border-0 rounded-md bg-transparent bg-none shadow-none text-fg-secondary [&:not([data-disabled]):hover]:text-fg-default [&:not([data-disabled]):hover]:bg-action-primary-bg-default',
        outline:
          'border rounded-full border-border-hairline-strong bg-surface-1 bg-[image:var(--gradient-sheen)] shadow-[var(--shadow-edge),var(--shadow-elev-1)] text-fg-secondary [&:not([data-disabled]):hover]:border-alpha-red-65 [&:not([data-disabled]):hover]:bg-surface-2 [&:not([data-disabled]):hover:not(:focus-visible)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] [&:not([data-disabled]):hover]:text-fg-default motion-safe:[&:not([data-disabled]):hover:not(:active)]:-translate-y-0.5',
        primary:
          'border rounded-md border-border-brand-strong bg-transparent bg-(image:--gradient-btn-primary) shadow-btn-primary text-action-primary-solid-fg [&:not([data-disabled]):hover:not(:active)]:bg-(image:--gradient-btn-primary-hover) [&:not([data-disabled]):hover:not(:focus-visible):not(:active)]:shadow-btn-primary-hover motion-safe:[&:not([data-disabled]):hover:not(:active)]:-translate-y-px [&:not([data-disabled]):active]:bg-none [&:not([data-disabled]):active]:bg-action-primary-solid-bg [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed',
        secondary:
          'border rounded-md border-border-brand bg-surface-1 bg-(image:--gradient-btn-secondary) shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] text-action-primary-fg [&:not([data-disabled]):hover:not(:active)]:bg-(image:--gradient-btn-secondary-hover) [&:not([data-disabled]):hover]:border-primitive-red-neon [&:not([data-disabled]):hover:not(:focus-visible):not(:active)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] motion-safe:[&:not([data-disabled]):hover:not(:active)]:-translate-y-px [&:not([data-disabled]):active]:bg-none [&:not([data-disabled]):active]:bg-alpha-red-15 [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed'
      },
      size: { sm: 'size-8', md: 'size-10', lg: 'size-12' }
    },
    defaultVariants: { variant: 'ghost', size: 'md' }
  }
);

export const iconButtonIconVariants = cva(
  'shrink-0 transition-colors duration-(--duration-fast) ease-(--ease-out) motion-reduce:transition-none',
  {
    variants: {
      size: { sm: 'size-4', md: 'size-(--icon-size)', lg: 'size-(--icon-size)' },
      variant: {
        ghost: '',
        outline: 'group-[:not([data-disabled]):hover]/icon-button:text-fg-brand-default',
        primary: '',
        secondary: ''
      }
    },
    defaultVariants: { size: 'md', variant: 'ghost' }
  }
);
