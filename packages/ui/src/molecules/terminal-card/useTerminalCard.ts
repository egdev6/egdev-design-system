import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type TerminalCardBarProps,
  type TerminalCardListProps,
  type TerminalCardProps,
  type TerminalCardRow,
  type TerminalCardTone,
  terminalCardBarVariants,
  terminalCardCaretVariants,
  terminalCardListVariants,
  terminalCardShellVariants,
  terminalCardTermVariants,
  terminalCardValueVariants,
  terminalCardVariants
} from './types';

/** Path text of the bar; the bar wraps like every card text, so nothing is truncated. */
const pathClasses = 'font-mono text-body-default text-fg-default min-w-0 [overflow-wrap:anywhere]';
/** Ink of the internal decorative terminal glyph. */
const glyphClasses = 'text-fg-brand-raised';

export type UseTerminalCardResult = {
  valid: boolean;
  rootProps: Omit<ComponentPropsWithoutRef<'div'>, 'children' | 'className' | 'role' | 'aria-label'> & {
    role: 'group';
    'aria-label': string;
    className: string;
  };
  children: ReactNode;
};

export type UseTerminalCardBarResult = {
  rootProps: ComponentPropsWithoutRef<'div'> & { className: string };
  glyphProps: { name: 'terminal'; className: string };
  pathProps: ComponentPropsWithoutRef<'span'> & { className: string };
  shellText: string | undefined;
  shellProps: ComponentPropsWithoutRef<'span'> & { className: string };
  children: ReactNode;
};

export type TerminalCardRowView = {
  key: string;
  term: string;
  value: ReactNode;
  tone: TerminalCardTone;
  termProps: ComponentPropsWithoutRef<'dt'> & { className: string };
  valueProps: ComponentPropsWithoutRef<'dd'> & { 'data-tone': TerminalCardTone; className: string };
  caretProps:
    | ({ 'aria-hidden': true; className: string } & Omit<ComponentPropsWithoutRef<'span'>, 'aria-hidden'>)
    | undefined;
};

export type UseTerminalCardListResult = {
  rootProps: ComponentPropsWithoutRef<'dl'> & { className: string };
  rows: TerminalCardRowView[];
};

/** Strip protected semantics/appearance even at JavaScript boundaries. */
function passiveNativeProps<T extends Record<string, unknown>>(native: T): T {
  const {
    role: _role,
    tabIndex: _tabIndex,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    'aria-pressed': _pressed,
    'aria-selected': _selected,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    asChild: _asChild,
    ...rest
  } = native;
  return rest as T;
}

/**
 * Name the group, reject a blank label with a development warning, protect the owned root
 * semantics and compose the root Material frame classes. Root semantics and naming are owned:
 * injected role, naming, style or HTML content never reach the DOM.
 */
export function useTerminalCard({ label, children, className, ...native }: TerminalCardProps): UseTerminalCardResult {
  const valid = typeof label === 'string' && label.trim().length > 0;
  if ((typeof process === 'undefined' || process.env.NODE_ENV !== 'production') && !valid) {
    console.warn('TerminalCard requires a non-empty label. Nothing was rendered.');
  }
  return {
    valid,
    rootProps: {
      ...passiveNativeProps(native as typeof native & Record<string, unknown>),
      role: 'group',
      'aria-label': label,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'xl' }),
        terminalCardVariants(),
        className
      )
    },
    children
  };
}

/** Resolve the bar band, the decorative glyph, the wrapped path text and the optional shell. */
export function useTerminalCardBar({ children, shell, className }: TerminalCardBarProps): UseTerminalCardBarResult {
  const shellText = typeof shell === 'string' && shell.trim().length > 0 ? shell : undefined;
  return {
    rootProps: {
      className: cn(
        surfaceVariants({ tone: 'surface-2', elevation: 0, padding: 'none', radius: 'none' }),
        terminalCardBarVariants(),
        className
      )
    },
    glyphProps: { name: 'terminal', className: glyphClasses },
    pathProps: { className: pathClasses },
    shellText,
    shellProps: { className: cn(terminalCardShellVariants()) },
    children
  };
}

/** Normalize each row's tone, name the decorative caret and compose the definition grid. */
export function useTerminalCardList({ items, className }: TerminalCardListProps): UseTerminalCardListResult {
  const rows: TerminalCardRowView[] = items.map((row: TerminalCardRow, index: number) => {
    const tone: TerminalCardTone = row.tone === 'success' ? 'success' : 'default';
    return {
      key: `row-${index}`,
      term: row.term,
      value: row.value,
      tone,
      termProps: { className: cn(terminalCardTermVariants()) },
      valueProps: {
        'data-tone': tone,
        className: cn(terminalCardValueVariants({ tone }))
      },
      caretProps: row.caret ? { 'aria-hidden': true, className: cn(terminalCardCaretVariants()) } : undefined
    };
  });
  return {
    rootProps: { className: cn(terminalCardListVariants(), className) },
    rows
  };
}
