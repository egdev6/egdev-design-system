import { useId, useState } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface/types';
import type { TableColumn, TableProps, TableRow, TableSort } from './types';
import {
  captionVariants,
  cellVariants,
  codeVariants,
  emptyVariants,
  headerVariants,
  rowVariants,
  scrollbarVariants,
  selectLabelVariants,
  sortVariants,
  tableFrameVariants,
  tableVariants,
  tableViewportVariants,
  thumbVariants
} from './types';

export function useTable<TRow extends TableRow>(props: TableProps<TRow>) {
  const {
    label,
    hideLabel = false,
    columns,
    rows,
    variant = 'data',
    size = 'md',
    maxHeight,
    activeRowId,
    messages,
    className,
    sort,
    defaultSort = null,
    onSortChange,
    selectable = false,
    value,
    defaultValue = [],
    onValueChange,
    dangerouslySetInnerHTML: ignoredHtml,
    ...native
  } = props as TableProps<TRow> & { dangerouslySetInnerHTML?: unknown };
  void ignoredHtml;
  const baseId = useId();
  const [internalSort, setSort] = useState<TableSort | null>(defaultSort);
  const [internalValue, setValue] = useState<string[]>(defaultValue);
  const selected = value === undefined ? internalValue : value;
  const requestedSort = sort === undefined ? internalSort : sort;
  const sortedColumn =
    variant === 'data' && requestedSort
      ? columns.find(
          (column) => column.id === requestedSort.columnId && column.sortValue && column.format !== 'actions'
        )
      : undefined;
  const currentSort = sortedColumn ? requestedSort : null;
  const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });
  const displayRows =
    sortedColumn?.sortValue && currentSort
      ? [...rows].sort((a, b) => {
          const left = sortedColumn.sortValue?.(a);
          const right = sortedColumn.sortValue?.(b);
          const comparison =
            typeof left === 'number' && typeof right === 'number'
              ? left - right
              : collator.compare(String(left), String(right));
          return currentSort.direction === 'descending' ? -comparison : comparison;
        })
      : rows;
  const rowHeader = columns.findIndex((column) => column.rowHeader && column.format !== 'actions');
  const rowHeaderIndex = rowHeader < 0 ? 0 : rowHeader;
  const selectedCount = displayRows.filter((row) => selected.includes(row.id)).length;
  const allChecked = displayRows.length > 0 && selectedCount === displayRows.length;
  function updateSort(column: TableColumn<TRow>) {
    const next: TableSort = {
      columnId: column.id,
      direction:
        currentSort?.columnId === column.id && currentSort.direction === 'ascending' ? 'descending' : 'ascending'
    };
    if (sort === undefined) {
      setSort(next);
    }
    onSortChange?.(next);
  }
  function updateValue(next: string[]) {
    if (value === undefined) {
      setValue(next);
    }
    onValueChange?.(next);
  }
  function toggleRow(id: string) {
    updateValue(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  }
  function toggleAll() {
    const ids = displayRows.map((row) => row.id);
    updateValue(
      allChecked
        ? selected.filter((id) => !ids.includes(id))
        : [...selected, ...ids.filter((id) => !selected.includes(id))]
    );
  }
  return {
    label,
    hideLabel,
    columns,
    variant,
    size,
    maxHeight,
    activeRowId,
    selectable: variant === 'data' && selectable,
    native,
    baseId,
    displayRows,
    selected,
    currentSort,
    rowHeaderIndex,
    allChecked,
    selectedCount,
    updateSort,
    toggleRow,
    toggleAll,
    messages: { selectAll: 'Select all rows', selectRow: 'Select', empty: 'No rows', ...messages },
    classes: {
      frame: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 1, padding: 'none', radius: 'lg' }),
        tableFrameVariants(),
        className
      ),
      viewport: cn(tableViewportVariants({ maxHeight })),
      table: cn(tableVariants()),
      caption: cn(captionVariants()),
      header: (sticky: boolean) => cn(headerVariants({ size, sticky })),
      cell: (format: TableColumn<TRow>['format'], rowHeader = false) =>
        cn(cellVariants({ size, format: format ?? 'text', rowHeader, details: rowHeader && variant === 'details' })),
      row: cn(rowVariants()),
      sort: cn(sortVariants()),
      code: cn(codeVariants()),
      selectLabel: cn(selectLabelVariants()),
      empty: cn(emptyVariants()),
      scrollbar: cn(surfaceVariants({ tone: 'well', padding: 'none', radius: 'none' }), scrollbarVariants()),
      thumb: cn(thumbVariants())
    }
  };
}
