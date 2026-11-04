import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type NotesBoardNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'style' | 'dangerouslySetInnerHTML'
>;

/** Passive editorial layout. className supports outer margin, width and parent placement only. */
export type NotesBoardProps = NotesBoardNativeProps & {
  /**
   * One NotesBoardSide followed by one NotesBoardList; the consumer owns their contents.
   * @control false
   * @controlReason ReactNode is not serializable; see Default and DatedNotes for compositions.
   */
  children: ReactNode;
  /**
   * Stick the side above 1080px, subject to the host scroll container and navigation clearance.
   * @default false
   * @control boolean
   */
  sticky?: boolean;
};

/** Introductory content supplied by the host, including any named static topic list. */
export type NotesBoardSideProps = {
  /**
   * Consumer introduction and optional named list of static Chips.
   * @control false
   * @controlReason ReactNode is not serializable; see Topics for a composition.
   */
  children: ReactNode;
};

/** Ordered notes supplied as direct list items, including an empty list. */
export type NotesBoardListProps = {
  /**
   * Consumer-ordered li elements containing linked editorial rows.
   * @control false
   * @controlReason ReactNode is not serializable; see DatedNotes for a composition.
   */
  children: ReactNode;
};

export const notesBoardVariants = cva(
  'eg-notes grid grid-cols-[minmax(0,4fr)_minmax(0,7fr)] gap-10 items-start [@media(width<=1080px)]:grid-cols-1 [@media(width<=1080px)]:gap-8'
);
export const notesBoardSideVariants = cva('flex flex-col items-start gap-4 min-w-0', {
  variants: {
    sticky: {
      true: 'sticky self-start top-[calc(var(--nav-height)+var(--space-10))] [@media(width<=1080px)]:static [@media(width<=1080px)]:self-auto',
      false: ''
    }
  },
  defaultVariants: { sticky: false }
});
export const notesBoardListVariants = cva('list-none m-0 p-0 flex flex-col gap-2 min-w-0');
