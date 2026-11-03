import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';

type Protected =
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'style'
  | 'tabIndex'
  | 'contentEditable'
  | 'accessKey'
  | 'aria-hidden'
  | 'aria-live'
  | 'aria-pressed'
  | 'aria-selected'
  | 'aria-disabled';
type PassiveNative<T> = Omit<T, Protected | Extract<keyof T, `on${string}`>>;
/** Passive field; className is for outer width, margin and placement only. */
export type LiveBandFieldProps = PassiveNative<ComponentPropsWithoutRef<'div'>> & {
  /** Text and framed photo in source order.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and FieldOnly.
   */
  children: ReactNode;
};
/** Passive recordings grid; className is for outer layout only. */
export type LiveBandStreamsProps = PassiveNative<ComponentPropsWithoutRef<'div'>> & {
  /** Featured recording then list.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and StreamsOnly.
   */
  children: ReactNode;
};
/** One native recording link; consumers provide noninteractive named content and a valid destination. */
export type LiveBandVodProps = Omit<PassiveNative<ComponentPropsWithoutRef<'a'>>, 'className' | 'href'> & {
  /** Native destination supplied by the host.
   * @control text
   */
  href: string;
  /** Visible cover and metadata with decorative artwork hidden from accessibility.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and LongContent.
   */
  children: ReactNode;
};
/** Passive list column with heading, rows and optional independent archive. */
export type LiveBandListProps = {
  /** Heading, rows and optional archive in source order.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and EmptyRows.
   */
  children: ReactNode;
};
/** Semantic list, omitted for an ordinary empty collection. */
export type LiveBandRowsProps = PassiveNative<ComponentPropsWithoutRef<'ul'>> & {
  /** Zero or more keyed LiveBandRow parts.
   * @control false
   * @controlReason ReactNode composition is not serializable; see Default and EmptyRows.
   */
  children: ReactNode;
};
/** One list item containing an editorial-divided ListItem slotted onto an anchor. */
export type LiveBandRowProps = {
  /** A single non-nested editorial link composition.
   * @control false
   * @controlReason ReactElement composition is not serializable; see Default and Keyboard.
   */
  children: ReactElement;
};
export const liveBandFieldVariants = cva(
  'eg-live-band static grid min-w-0 items-center gap-10 grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] [@media(width<=860px)]:grid-cols-1'
);
export const liveBandStreamsVariants = cva(
  'grid min-w-0 items-start gap-7 grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] [@media(width<=1080px)]:grid-cols-1'
);
export const liveBandVodVariants = cva('block min-w-0 focus-visible:outline-none focus-visible:shadow-focus');
export const liveBandListVariants = cva('min-w-0');
export const liveBandRowsVariants = cva('min-w-0 m-0 p-0 list-none');
export const liveBandRowVariants = cva('min-w-0');
