import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { ProductIdentity } from '../../types/product-identity';

/** Passive host-sized panel; className is for outer layout only. The host owns responsive visibility. */
export type SidebarProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'role' | 'dangerouslySetInnerHTML'> & {
  /**
   * Optional product name and consumer artwork, optionally linked to its home. Blank names omit the header.
   * @control false
   * @controlReason Structured ReactNode identity is not serializable; see LinkedProduct and WithoutProduct.
   */
  product?: ProductIdentity;
  /**
   * In-flow content, including independently labelled NavLists.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and Overflow.
   */
  children: ReactNode;
  /**
   * Optional pinned utility and metadata content, not navigation.
   * @control false
   * @controlReason ReactNode composition is not serializable; see WithFooter.
   */
  footer?: ReactNode;
};

export const sidebarVariants = cva('eg-sidebar box-border flex h-full w-64 min-h-0 flex-col');
export const sidebarHeaderVariants = cva('flex items-center gap-3 px-4 pt-5 pb-4');
export const sidebarNameVariants = cva('min-w-0 truncate font-display text-heading-small text-fg-default');
export const sidebarBodyVariants = cva('relative min-h-0 flex-1 overflow-hidden');
export const sidebarViewportVariants = cva('size-full');
export const sidebarContentVariants = cva('px-3 pb-4', { variants: { header: { true: '', false: 'pt-4' } } });
export const sidebarScrollbarVariants = cva('flex w-2 touch-none select-none p-0.5 data-[state=hidden]:hidden');
export const sidebarThumbVariants = cva('relative flex-1 rounded-full bg-border-hairline-strong');
export const sidebarFooterVariants = cva(
  'flex items-center gap-2 px-4 py-3 font-sans text-label-default text-fg-muted'
);
