import { createContext, useContext } from 'react';
import { cn } from '../../lib/cn';
import type { NotesBoardProps } from './types';
import { notesBoardListVariants, notesBoardSideVariants, notesBoardVariants } from './types';

export const NotesBoardStickyContext = createContext(false);

export function useNotesBoard(props: NotesBoardProps) {
  const {
    children,
    sticky = false,
    className,
    role: _role,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = props as NotesBoardProps & {
    role?: unknown;
    style?: unknown;
    dangerouslySetInnerHTML?: unknown;
  };
  return { children, sticky, rootProps: { ...rest, className: cn(notesBoardVariants(), className) } };
}

export function useNotesBoardSide() {
  const sticky = useContext(NotesBoardStickyContext);
  return { className: cn(notesBoardSideVariants({ sticky })) };
}

export function useNotesBoardList() {
  return { className: cn(notesBoardListVariants()) };
}
