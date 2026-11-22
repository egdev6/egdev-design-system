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
   * Visual treatment. Outline is the round treatment; it is the web social-row treatment used at lg.
   * Every other treatment uses radius-md. Secondary alone retains the approved alpha-red-15 pressed background.
   * @control select
   * @default ghost
   */
  variant?: IconButtonVariant;
  /**
   * Visible square: sm 25.6px, md 32px, lg 38.4px; glyph: sm 12.8px, otherwise 16px.
   * Enabled controls have a centered 44.8px invisible square under default tokens for all pointers.
   * Reserve an unclipped visible gap at least one spacing token above the sum of adjacent target outsets.
   * Under default tokens use gap-7 for sm/sm, gap-6 for sm/md, gap-5 for sm/lg or md/md,
   * gap-4 for md/lg and gap-3 for lg/lg. Local token overrides and ancestor transforms may reduce targets.
   * ButtonGroup and Tabs scroll controls deliberately disable the extension.
   * @control select
   * @default md
   */
  size?: IconButtonSize;
  /**
   * Apply the control to one child through Radix Slot. Supply one empty anchor/router host that spreads
   * props and forwards refs. The host must provide an unclipped positioning context, no competing ::after,
   * overlay or stacking conflict, and no ancestor scaling. IconButton inserts its icon and hidden name.
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
  "eg-icon-btn group/icon-button relative box-border inline-grid place-items-center flex-none p-0 border-solid border-transparent no-underline cursor-pointer transform-none translate-none scale-100 after:content-[''] after:absolute after:left-[calc(50%_-_var(--space-14)_/_2)] after:top-[calc(50%_-_var(--space-14)_/_2)] after:size-14 [[data-icon-button-target=compact]>&]:after:content-none [transition:color_var(--duration-fast)_var(--ease-out),background-color_var(--duration-fast)_var(--ease-out),border-color_var(--duration-base)_var(--ease-out),box-shadow_var(--duration-base)_var(--ease-out)] motion-safe:[&:not([data-disabled]):active]:[transition:color_var(--duration-press)_var(--ease-out),background-color_var(--duration-press)_var(--ease-out),border-color_var(--duration-press)_var(--ease-out),box-shadow_var(--duration-press)_var(--ease-out)] focus-visible:outline-none focus-visible:shadow-focus data-disabled:opacity-45 data-disabled:pointer-events-none data-disabled:cursor-not-allowed motion-reduce:transition-none motion-reduce:transform-none motion-reduce:translate-none motion-reduce:scale-100",
  {
    variants: {
      variant: {
        ghost:
          'border-0 rounded-md bg-transparent bg-none shadow-none text-fg-secondary [&:not([data-disabled]):hover]:text-fg-default [&:not([data-disabled]):hover:not(:active)]:bg-action-primary-bg-default [&:not([data-disabled]):active]:bg-surface-3 [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed',
        outline:
          'border rounded-full border-border-hairline-strong bg-surface-1 bg-[image:var(--gradient-sheen)] shadow-[var(--shadow-edge),var(--shadow-elev-1)] text-fg-secondary [&:not([data-disabled]):hover]:border-border-brand [&:not([data-disabled]):hover:not(:active)]:bg-surface-2 [&:not([data-disabled]):hover:not(:focus-visible):not(:active)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] [&:not([data-disabled]):hover]:text-fg-default [&:not([data-disabled]):active]:bg-surface-3 [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed',
        primary:
          'border rounded-md border-border-brand-strong bg-transparent bg-(image:--gradient-btn-primary) shadow-btn-primary text-action-primary-solid-fg [&:not([data-disabled]):hover:not(:active)]:bg-(image:--gradient-btn-primary-hover) [&:not([data-disabled]):hover:not(:focus-visible):not(:active)]:shadow-btn-primary-hover [&:not([data-disabled]):active]:bg-none [&:not([data-disabled]):active]:bg-action-primary-solid-bg [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed',
        // The alpha-red-15 background is approved only for IconButton secondary press (v0.5).
        secondary:
          'border rounded-md border-border-brand bg-surface-1 bg-(image:--gradient-btn-secondary) shadow-[var(--shadow-edge-strong),var(--shadow-elev-1)] text-action-primary-fg [&:not([data-disabled]):hover:not(:active)]:bg-(image:--gradient-btn-secondary-hover) [&:not([data-disabled]):hover]:border-primitive-red-neon [&:not([data-disabled]):hover:not(:focus-visible):not(:active)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)] [&:not([data-disabled]):active]:bg-none [&:not([data-disabled]):active]:bg-alpha-red-15 [&:not([data-disabled]):active:not(:focus-visible)]:shadow-btn-pressed'
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
