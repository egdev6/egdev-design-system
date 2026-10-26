import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'brand';
export type BadgeVariant = 'soft' | 'solid';

/** Static label; consumers provide short, non-empty, non-interactive text. No ref or asChild API. */
export type BadgeProps = Omit<ComponentPropsWithoutRef<'span'>, 'children'> & {
  /**
   * Visible non-empty word or short phrase. Do not supply interactive descendants.
   * @control false
   * @controlReason Non-serializable ReactNode; use Default and WithIcon for short text examples.
   */
  children: ReactNode;
  /**
   * Supplementary color family; the visible label carries the meaning.
   * @control select
   * @default neutral
   */
  tone?: BadgeTone;
  /**
   * Soft tinted fill and border or solid tone fill with on-status text.
   * @control select
   * @default soft
   */
  variant?: BadgeVariant;
  /**
   * Optional decorative leading visual, hidden from assistive technology. Omitted when absent.
   * Size supplied content to the 14px wrapper; never supply focusable content.
   * @control false
   * @controlReason Non-serializable ReactNode; use WithIcon for a decorative system Icon example.
   */
  icon?: ReactNode;
};

/** Public composition recipe; className supports outer margin/alignment/flex layout only. */
export const badgeVariants = cva(
  'eg-badge inline-flex items-center gap-1.5 py-1.5 px-2.5 rounded-full border whitespace-nowrap font-sans text-label-default',
  {
    variants: {
      tone: { neutral: '', info: '', success: '', warning: '', danger: '', brand: '' },
      variant: { soft: 'shadow-edge', solid: 'border-transparent shadow-none' }
    },
    compoundVariants: [
      { tone: 'neutral', variant: 'soft', className: 'text-fg-secondary border-fg-secondary/30 bg-fg-secondary/8' },
      { tone: 'info', variant: 'soft', className: 'text-status-info border-status-info/30 bg-status-info/8' },
      {
        tone: 'success',
        variant: 'soft',
        className: 'text-status-success border-status-success/30 bg-status-success/8'
      },
      {
        tone: 'warning',
        variant: 'soft',
        className: 'text-status-warning border-status-warning/30 bg-status-warning/8'
      },
      { tone: 'danger', variant: 'soft', className: 'text-status-danger border-status-danger/30 bg-status-danger/8' },
      { tone: 'brand', variant: 'soft', className: 'text-primitive-red-200 border-alpha-red-22 bg-alpha-red-12' },
      { tone: 'neutral', variant: 'solid', className: 'bg-fg-secondary text-fg-on-status' },
      { tone: 'info', variant: 'solid', className: 'bg-status-info text-fg-on-status' },
      { tone: 'success', variant: 'solid', className: 'bg-status-success text-fg-on-status' },
      { tone: 'warning', variant: 'solid', className: 'bg-status-warning text-fg-on-status' },
      { tone: 'danger', variant: 'solid', className: 'bg-status-danger text-fg-on-status' },
      { tone: 'brand', variant: 'solid', className: 'bg-action-primary-solid-bg text-action-primary-solid-fg' }
    ],
    defaultVariants: { tone: 'neutral', variant: 'soft' }
  }
);

/** Internal decorative part; not a public class override surface. */
export const badgeIconVariants = cva('size-3.5 shrink-0');
