import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Passive named group. className supports outer margin, width and parent placement only. */
export type NowStripProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'tabIndex'
  | 'dangerouslySetInnerHTML'
  | 'style'
> & {
  /**
   * Visible, non-empty localized group name. Blank labels warn in development and render nothing.
   * @control text
   */
  label: string;
  /**
   * Ordered direct NowCard children; consumers supply size="sm" and own their content.
   * @control false
   * @controlReason ReactNode cannot be represented by a scalar control; see Default and UnevenCards.
   */
  children: ReactNode;
};

/** Unpainted boundary on a host-owned Grafito reading surface. */
export const nowStripVariants = cva(
  'eg-now-strip m-0 pb-6 border-b-[length:var(--border-width)] [border-bottom-style:solid] border-b-border-hairline'
);
/** Visible group label. */
export const nowStripLabelVariants = cva(
  'm-0 mb-3 flex items-center gap-2 font-display text-meta uppercase text-fg-secondary'
);
/** Responsive, stretched direct-card layout. */
export const nowStripGridVariants = cva('grid grid-cols-3 gap-5 items-stretch [@media(width<=860px)]:grid-cols-1');
