import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';

/** One native page destination; the host owns uniqueness and the current page. */
export type TopBarItem = {
  /** Stable, non-empty key. @control text */
  id: string;
  /** Visible, non-empty destination name. @control text */
  label: string;
  /** Non-empty native destination URL. @control text */
  href: string;
  /** The host marks at most one current page. @control select */
  'aria-current'?: 'page';
};

/** A fixed site header; className supports outer placement and stacking only. */
export type TopBarProps = Omit<
  ComponentPropsWithoutRef<'header'>,
  'children' | 'role' | 'dangerouslySetInnerHTML' | 'label' | 'items' | 'onNavigate'
> & {
  /** Host-selected native presentation state; absence is transparent. */
  'data-state'?: 'transparent' | 'glass';
} & {
  /** Non-empty localized page navigation landmark name. @control text */
  label: string;
  /** Ordered destinations, including an empty list when appropriate. @control false
   * @controlReason Structured items cannot be edited as a scalar; see CurrentPage.
   */
  items: TopBarItem[];
  /** Notifies a native link click; the host may prevent default. @control false
   * @controlReason Callbacks cannot be serialized; see CurrentPage.
   */
  onNavigate?: (item: TopBarItem, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Direct TopBar parts, optionally wrapped in fragments; one brand is required. @control false
   * @controlReason React elements cannot be represented by a scalar control; see ComposedControls.
   */
  children: ReactNode;
};

/** Each part accepts a single consumer-owned named link or control. */
export type TopBarPartProps = {
  /** Consumer-supplied content. @control false
   * @controlReason React elements cannot be represented by a scalar control; see ComposedControls.
   */
  children: ReactNode;
};

export const topBarVariants = cva([
  'eg-topbar fixed inset-x-0 top-0 z-10 box-border w-full [container-type:normal] [container-name:none] transition-none',
  'border-0 border-b border-solid border-transparent bg-transparent bg-none shadow-none [backdrop-filter:none] [-webkit-backdrop-filter:none]',
  'data-[state=glass]:bg-surface-overlay data-[state=glass]:border-border-hairline-strong data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]',
  'data-[state=glass]:[backdrop-filter:blur(var(--blur-overlay))_saturate(150%)] data-[state=glass]:[-webkit-backdrop-filter:blur(var(--blur-overlay))_saturate(150%)]',
  '[@media(prefers-reduced-transparency:reduce)]:data-[state=glass]:bg-surface-2 [@media(prefers-reduced-transparency:reduce)]:data-[state=glass]:[backdrop-filter:none] [@media(prefers-reduced-transparency:reduce)]:data-[state=glass]:[-webkit-backdrop-filter:none] motion-reduce:transition-none'
]);
export const topBarContainerVariants = cva('@container w-full');
export const topBarRowVariants = cva(
  'box-border mx-auto flex h-[var(--nav-height)] w-full max-w-[var(--content-max)] items-center gap-4 px-[var(--gutter)]'
);
export const topBarNavVariants = cva('min-w-0 flex-1 @max-[900px]:hidden [@container_(width=900px)]:hidden');
export const topBarListVariants = cva('m-0 flex list-none items-center gap-4 p-0');
export const topBarLinkVariants = cva(
  'text-label-default text-fg-secondary no-underline hover:text-fg-default aria-[current=page]:text-fg-default aria-[current=page]:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring'
);
export const topBarBrandVariants = cva('shrink-0');
export const topBarFullVariants = cva('@max-[900px]:hidden [@container_(width=900px)]:hidden');
export const topBarCompactVariants = cva('hidden @max-[900px]:block [@container_(width=900px)]:block');
export const topBarUserVariants = cva('shrink-0');
