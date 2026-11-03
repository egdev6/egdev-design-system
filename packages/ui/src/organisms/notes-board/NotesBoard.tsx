import type { NotesBoardListProps, NotesBoardProps, NotesBoardSideProps } from './types';
import { NotesBoardStickyContext, useNotesBoard, useNotesBoardList, useNotesBoardSide } from './useNotesBoard';

/** Passive editorial board; the host supplies the side and ordered list. */
export function NotesBoard(props: NotesBoardProps) {
  const { children, sticky, rootProps } = useNotesBoard(props);
  return (
    <NotesBoardStickyContext.Provider value={sticky}>
      <div {...rootProps}>{children}</div>
    </NotesBoardStickyContext.Provider>
  );
}

/** Introduction and optional static topics. */
export function NotesBoardSide({ children }: NotesBoardSideProps) {
  const props = useNotesBoardSide();
  return <div {...props}>{children}</div>;
}

/** Consumer-ordered list of linked notes. */
export function NotesBoardList({ children }: NotesBoardListProps) {
  const props = useNotesBoardList();
  return <ol {...props}>{children}</ol>;
}
