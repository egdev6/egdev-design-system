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
  /** Host-selected presentation; when absent, scroll selects glass over the initial background. */
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
  /**
   * Unscrolled backing; glass or an explicit data-state takes precedence.
   * @control select
   * @default transparent
   */
  initialBackground?: 'transparent' | 'solid';
  /**
   * Width of the inner row; the background remains full width in both modes.
   * @control select
   * @default content
   */
  contentWidth?: 'content' | 'full';
  /** Direct TopBar parts, optionally wrapped in fragments; one brand is required. @control false
   * @controlReason React elements cannot be represented by a scalar control; see ComposedControls.
   */
  children: ReactNode;
};

/** Consumer-owned part content; the end accepts arbitrary nodes, while controls retain their own semantics. */
export type TopBarPartProps = {
  /** Consumer-supplied content. @control false
   * @controlReason React elements cannot be represented by a scalar control; see ComposedControls.
   */
  children: ReactNode;
};

export const topBarVariants = cva(
  [
    'eg-topbar fixed inset-x-0 top-0 z-10 box-border w-full [container-type:normal] [container-name:none] transition-none',
    'border-0 border-b border-solid [backdrop-filter:none] [-webkit-backdrop-filter:none]',
    'data-[state=transparent]:border-transparent data-[state=transparent]:bg-transparent data-[state=transparent]:bg-none data-[state=transparent]:shadow-none',
    'data-[state=glass]:bg-none data-[state=glass]:bg-surface-overlay data-[state=glass]:border-border-hairline-strong data-[state=glass]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]',
    'data-[state=glass]:[backdrop-filter:blur(var(--blur-overlay))_saturate(150%)] data-[state=glass]:[-webkit-backdrop-filter:blur(var(--blur-overlay))_saturate(150%)]',
    '[@media(prefers-reduced-transparency:reduce)]:data-[state=glass]:bg-surface-2 [@media(prefers-reduced-transparency:reduce)]:data-[state=glass]:[backdrop-filter:none] [@media(prefers-reduced-transparency:reduce)]:data-[state=glass]:[-webkit-backdrop-filter:none] motion-reduce:transition-none'
  ],
  {
    variants: {
      initialBackground: {
        transparent: 'border-transparent bg-transparent bg-none shadow-none',
        solid: 'border-border-hairline'
      }
    },
    defaultVariants: { initialBackground: 'transparent' }
  }
);
export const topBarContainerVariants = cva('@container w-full');
export const topBarRowVariants = cva(
  'box-border mx-auto flex h-[var(--nav-height)] w-full items-center gap-4 px-[var(--gutter)]',
  {
    variants: { contentWidth: { content: 'max-w-[var(--content-max)]', full: '' } },
    defaultVariants: { contentWidth: 'content' }
  }
);
export const topBarNavVariants = cva('h-full min-w-0 flex-1 @max-[900px]:hidden [@container_(width=900px)]:hidden');
export const topBarListVariants = cva('m-0 flex h-full list-none items-stretch gap-8 p-0');
export const topBarItemVariants = cva('h-full');
export const topBarLinkVariants = cva(
  'relative inline-flex h-full min-h-14 items-center font-sans text-body-large text-fg-secondary no-underline hover:text-fg-default aria-[current=page]:text-fg-default aria-[current=page]:font-[var(--text-label-default--font-weight)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus-ring after:absolute after:-bottom-px after:h-[calc(var(--space-1)*0.625)] after:w-full after:bg-transparent after:transition-colors motion-reduce:after:transition-none aria-[current=page]:after:bg-bg-flood'
);
export const topBarBrandVariants = cva('shrink-0');
export const topBarEndVariants = cva('ms-auto shrink-0');
export const topBarFullVariants = cva('@max-[900px]:hidden [@container_(width=900px)]:hidden');
export const topBarCompactVariants = cva('hidden @max-[900px]:block [@container_(width=900px)]:block');
export const topBarUserVariants = cva('shrink-0');
