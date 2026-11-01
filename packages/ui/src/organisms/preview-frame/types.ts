import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Named decorative guide in percentage coordinates. IDs are unique and labels non-empty. */
export type PreviewFrameZone = {
  id: string;
  label: string;
  x: number;
  y: number;
  width: number;
  height: number;
  tone?: 'info' | 'warning';
};

/** Passive preview figure. className supports outer layout only; canvas content must not be interactive. */
export type PreviewFrameProps = Omit<ComponentPropsWithoutRef<'figure'>, 'children' | 'dangerouslySetInnerHTML'> & {
  /** Decorative, non-interactive canvas content.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default.
   */
  children?: ReactNode;
  /** Width divided by height; values the canvas primitive cannot represent (non-positive, non-finite, or a non-finite reciprocal) fall back to 16:9.
   * @default 1.7777777777777777
   * @control number
   */
  ratio?: number;
  /** Grid currently uses the plain fallback until a grid token is approved.
   * @default grid
   * @control select
   */
  variant?: 'grid' | 'plain';
  /** Show the decorative five-percent inset guide.
   * @default true
   * @control boolean
   */
  safeArea?: boolean;
  /** Ordered decorative percentage guides.
   * @control false
   * @controlReason Structured zone arrays are not serializable in Controls; see Zones.
   */
  zones?: PreviewFrameZone[];
  /** Visible native figure caption.
   * @control text
   */
  figureCaption?: string;
  /** Consumer-owned trailing controls.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default.
   */
  actions?: ReactNode;
  /** Consumer-owned lower bar.
   * @control false
   * @controlReason ReactNode content is not serializable; see Default.
   */
  footer?: ReactNode;
};

export const rootVariants = cva('eg-stage m-0 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-3');
export const captionVariants = cva('min-w-0');
export const actionsVariants = cva('flex flex-wrap items-center justify-end gap-2');
export const canvasVariants = cva('col-span-2 isolate w-full overflow-hidden');
export const canvasInnerVariants = cva('relative size-full');
export const safeAreaVariants = cva(
  'pointer-events-none absolute inset-[5%] rounded-lg border border-dashed border-border-hairline-strong'
);
export const zoneVariants = cva(
  'pointer-events-none absolute left-[var(--eg-zone-x)] top-[var(--eg-zone-y)] w-[var(--eg-zone-w)] h-[var(--eg-zone-h)] border border-dashed',
  {
    variants: {
      tone: { info: 'border-status-info bg-status-info/10', warning: 'border-status-warning bg-status-warning/10' }
    },
    defaultVariants: { tone: 'info' }
  }
);
export const labelVariants = cva('bg-surface-0 px-1 font-sans text-label-default text-fg-default');
export const footerVariants = cva(
  'col-span-2 flex min-w-0 flex-wrap items-center gap-2 font-sans text-label-default text-fg-muted'
);
