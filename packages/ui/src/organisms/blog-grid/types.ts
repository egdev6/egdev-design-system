import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

/** Passive editorial layout; className supports outer placement only, not appearance overrides. */
export type BlogGridProps = Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'dangerouslySetInnerHTML'> & {
  /**
   * One feature and rows part, followed by an optional archive part.
   * @control false
   * @controlReason Non-serializable ReactNode composition; see the Default story.
   */
  children: ReactNode;
};

/** Feature slot: supply one whole-card ArticleFeature link. */
export type BlogGridFeatureProps = {
  /**
   * The consumer's featured article element.
   * @control false
   * @controlReason Non-serializable ReactElement composition; see the Default story.
   */
  children: ReactElement;
};

/** List slot: supply zero or more keyed BlogGridRow parts. */
export type BlogGridRowsProps = {
  /**
   * Editorial rows in reading order; an empty collection omits the list.
   * @control false
   * @controlReason Non-serializable ReactNode composition; see the EmptyRows story.
   */
  children: ReactNode;
};

/** Row slot: supply one editorial ListItem slotted onto an anchor. */
export type BlogGridRowProps = {
  /**
   * One editorial ListItem rendered as an anchor.
   * @control false
   * @controlReason Non-serializable ReactElement composition; see the ComposedLinks story.
   */
  children: ReactElement;
};

/** Archive slot: supply one independent named link. */
export type BlogGridArchiveProps = {
  /**
   * The standalone archive link.
   * @control false
   * @controlReason Non-serializable ReactElement composition; see the ComposedLinks story.
   */
  children: ReactElement;
};

export const blogGridVariants = cva(
  'eg-blog-grid grid grid-cols-[minmax(0,7fr)_minmax(0,5fr)] grid-rows-[minmax(0,1fr)_auto] gap-x-5 gap-y-0 items-stretch min-w-0 [@media(width<=1080px)]:grid-cols-1 [@media(width<=1080px)]:grid-rows-none'
);
export const blogGridFeatureVariants = cva(
  'min-w-0 col-start-1 row-start-1 row-span-2 [&>a]:h-full [@media(width<=1080px)]:col-auto [@media(width<=1080px)]:row-auto [@media(width<=1080px)]:[&>a]:h-auto'
);
export const blogGridRowsVariants = cva(
  'min-w-0 col-start-2 row-start-1 flex flex-col h-full gap-3 list-none m-0 p-0 [@media(width<=1080px)]:col-auto [@media(width<=1080px)]:row-auto [@media(width<=1080px)]:h-auto'
);
export const blogGridRowVariants = cva(
  'min-w-0 flex-1 [&>a]:h-full [@media(width<=1080px)]:flex-none [@media(width<=1080px)]:[&>a]:h-auto'
);
export const blogGridArchiveVariants = cva(
  'min-w-0 col-start-2 row-start-2 self-start mt-2 [@media(width<=1080px)]:col-auto [@media(width<=1080px)]:row-auto'
);
