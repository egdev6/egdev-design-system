import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

export type TableRow = { id: string };
export type TableVariant = 'data' | 'details';
export type TableSize = 'sm' | 'md';
export type TableMaxHeight = 'sm' | 'md' | 'lg';
export type TableColumnFormat = 'text' | 'number' | 'code' | 'actions';
export type TableSortDirection = 'ascending' | 'descending';
export type TableSort = { columnId: string; direction: TableSortDirection };
export type TableColumn<TRow extends TableRow> = {
  id: string;
  header: string;
  cell: (row: TRow) => ReactNode;
  format?: TableColumnFormat;
  rowHeader?: boolean;
  hideHeader?: boolean;
  sortValue?: (row: TRow) => string | number;
};
export type TableMessages = { selectAll: string; selectRow: string; empty: string };
type TableNativeProps = Omit<
  ComponentPropsWithoutRef<'table'>,
  | 'children'
  | 'className'
  | 'role'
  | 'aria-label'
  | 'aria-labelledby'
  | 'dangerouslySetInnerHTML'
  | 'defaultValue'
  | 'onChange'
>;
type TableBaseProps<TRow extends TableRow> = TableNativeProps & {
  /**
   * Caption and accessible name.
   * @control text
   */
  label: string;
  /**
   * Hide the caption visually.
   * @default false
   * @control boolean
   */
  hideLabel?: boolean;
  /**
   * Ordered column definitions.
   * @control false
   * @controlReason Functions are not serializable; see Default.
   */
  columns: TableColumn<TRow>[];
  /**
   * Consumer-defined rows.
   * @control false
   * @controlReason Generic data is not serializable; see Default.
   */
  rows: TRow[];
  /**
   * Cell density.
   * @default md
   * @control select
   */
  size?: TableSize;
  /**
   * Optional scroll viewport cap.
   * @control select
   */
  maxHeight?: TableMaxHeight;
  /**
   * Current row, independent of selection.
   * @control text
   */
  activeRowId?: string;
  /**
   * Localized labels.
   * @control false
   * @controlReason Object values are not controlled; see Localized.
   */
  messages?: Partial<TableMessages>;
  /** Outer layout only. Native style is forwarded, but appearance overrides are unsupported. */
  className?: string;
};
type TableDataProps<TRow extends TableRow> = TableBaseProps<TRow> & {
  /**
   * Presentation.
   * @default data
   * @control select
   */
  variant?: 'data';
  /**
   * Controlled sort.
   * @control false
   * @controlReason Structured state; see ControlledSort.
   */
  sort?: TableSort | null;
  /**
   * Initial sort.
   * @control false
   * @controlReason Structured state; see Sorting.
   */
  defaultSort?: TableSort | null;
  /**
   * Sort request.
   * @control false
   * @controlReason Callback; see Sorting.
   */
  onSortChange?: (sort: TableSort) => void;
  /**
   * Enable row selection.
   * @default false
   * @control boolean
   */
  selectable?: boolean;
  /**
   * Controlled selected IDs.
   * @control false
   * @controlReason Array state; see Selection.
   */
  value?: string[];
  /**
   * Initial selected IDs.
   * @control false
   * @controlReason Array state; see Selection.
   */
  defaultValue?: string[];
  /**
   * Selection request.
   * @control false
   * @controlReason Callback; see Selection.
   */
  onValueChange?: (value: string[]) => void;
};
type TableDetailsProps<TRow extends TableRow> = TableBaseProps<TRow> & {
  /**
   * Presentation.
   * @control select
   */
  variant: 'details';
  sort?: never;
  defaultSort?: never;
  onSortChange?: never;
  selectable?: never;
  value?: never;
  defaultValue?: never;
  onValueChange?: never;
};
/** Native table. Native style is forwarded, but using it for appearance is unsupported. */
export type TableProps<TRow extends TableRow = TableRow> = TableDataProps<TRow> | TableDetailsProps<TRow>;

export const tableFrameVariants = cva('eg-table-wrap !overflow-hidden');
export const tableViewportVariants = cva(
  'w-full focus-visible:outline focus-visible:outline-(length:--focus-width) focus-visible:outline-focus-ring focus-visible:-outline-offset-2',
  {
    variants: {
      maxHeight: {
        sm: 'max-h-[calc(var(--space-24)*3)]',
        md: 'max-h-[calc(var(--space-24)*4)]',
        lg: 'max-h-[calc(var(--space-24)*6)]'
      }
    }
  }
);
export const tableVariants = cva('eg-table w-full border-collapse');
export const captionVariants = cva('text-label-default text-fg-muted text-start px-4 py-3');
export const headerVariants = cva(
  'bg-surface-2 border-b border-border-default font-display text-label-eyebrow uppercase text-fg-muted whitespace-nowrap text-start',
  { variants: { size: { md: 'py-2.5 px-4', sm: 'py-2 px-3' }, sticky: { true: 'sticky top-0 z-10' } } }
);
export const cellVariants = cva(
  'text-label-default [font-weight:var(--text-body-default--font-weight)] [line-height:var(--text-meta--line-height)] text-fg-secondary align-top border-b border-border-subtle group-last:border-b-0',
  {
    variants: {
      size: { md: 'py-3 px-4', sm: 'py-2 px-3' },
      format: {
        text: '',
        number: 'eg-table__num text-end tabular-nums whitespace-nowrap',
        code: '',
        actions: 'eg-table__acts text-end whitespace-nowrap w-[1%]'
      },
      rowHeader: { true: '!static !bg-transparent !normal-case !text-fg-default' },
      details: { true: '!text-fg-muted whitespace-nowrap w-[1%]' }
    }
  }
);
export const rowVariants = cva(
  'group hover:bg-fg-default/3 data-[state=selected]:bg-surface-3 aria-[current=true]:!bg-bg-brand-subtle aria-[current=true]:[&>:first-child]:relative aria-[current=true]:[&>:first-child]:before:absolute aria-[current=true]:[&>:first-child]:before:start-0 aria-[current=true]:[&>:first-child]:before:inset-y-0 aria-[current=true]:[&>:first-child]:before:w-[var(--focus-width)] aria-[current=true]:[&>:first-child]:before:bg-action-primary-solid-bg'
);
export const sortVariants = cva(
  'inline-flex items-center gap-1 bg-transparent border-0 p-0 font-inherit text-inherit cursor-pointer hover:text-fg-default focus-visible:shadow-focus pointer-coarse:min-h-11'
);
export const codeVariants = cva('eg-table__code font-mono text-code text-fg-brand-raised');
export const selectLabelVariants = cva(
  'inline-flex items-center justify-center pointer-coarse:min-h-11 pointer-coarse:min-w-11'
);
export const emptyVariants = cva('py-6 px-4 text-center text-fg-muted');
export const scrollbarVariants = cva(
  'flex touch-none select-none data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2'
);
export const thumbVariants = cva('relative flex-1 bg-border-control rounded-full');
