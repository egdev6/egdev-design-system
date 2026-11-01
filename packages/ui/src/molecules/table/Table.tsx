import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { Checkbox } from '../../atoms/checkbox';
import { Icon } from '../../atoms/icon';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { TableProps, TableRow } from './types';
import { useTable } from './useTable';

/** Generic native table with optional local sorting and multiple selection. */
export function Table<TRow extends TableRow>(props: TableProps<TRow>) {
  const t = useTable(props);
  return (
    <ScrollAreaPrimitive.Root className={t.classes.frame} data-variant={t.variant} data-size={t.size}>
      <ScrollAreaPrimitive.Viewport
        className={t.classes.viewport}
        role='group'
        aria-labelledby={`${t.baseId}-caption`}
        tabIndex={0}
      >
        <table
          {...t.native}
          role={undefined}
          aria-label={undefined}
          aria-labelledby={undefined}
          className={t.classes.table}
        >
          <caption id={`${t.baseId}-caption`} className={t.hideLabel ? undefined : t.classes.caption}>
            {t.hideLabel ? <VisuallyHidden>{t.label}</VisuallyHidden> : t.label}
          </caption>
          {t.variant === 'data' && (
            <thead>
              <tr>
                {t.selectable && (
                  <th scope='col' className={t.classes.header(Boolean(t.maxHeight))}>
                    <Checkbox
                      aria-label={t.messages.selectAll}
                      checked={t.allChecked ? true : t.selectedCount > 0 ? 'indeterminate' : false}
                      disabled={t.displayRows.length === 0}
                      onCheckedChange={t.toggleAll}
                    />
                  </th>
                )}
                {t.columns.map((column) => (
                  <th
                    key={column.id}
                    scope='col'
                    className={t.classes.header(Boolean(t.maxHeight))}
                    aria-sort={t.currentSort?.columnId === column.id ? t.currentSort.direction : undefined}
                    data-format={column.format ?? 'text'}
                  >
                    {column.sortValue && column.format !== 'actions' ? (
                      <button type='button' className={t.classes.sort} onClick={() => t.updateSort(column)}>
                        {column.hideHeader ? <VisuallyHidden>{column.header}</VisuallyHidden> : column.header}
                        {t.currentSort?.columnId === column.id && (
                          <Icon
                            name='arrow-down'
                            className={t.currentSort.direction === 'ascending' ? 'size-3 rotate-180' : 'size-3'}
                          />
                        )}
                      </button>
                    ) : column.hideHeader ? (
                      <VisuallyHidden>{column.header}</VisuallyHidden>
                    ) : (
                      column.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {t.displayRows.length === 0 ? (
              <tr>
                <td className={t.classes.empty} colSpan={t.columns.length + (t.selectable ? 1 : 0)}>
                  {t.messages.empty}
                </td>
              </tr>
            ) : (
              t.displayRows.map((row, index) => (
                <tr
                  key={row.id}
                  className={t.classes.row}
                  data-state={t.selectable && t.selected.includes(row.id) ? 'selected' : undefined}
                  aria-current={t.activeRowId === row.id ? 'true' : undefined}
                >
                  {t.selectable && (
                    <td className={t.classes.cell('text')}>
                      <label className={t.classes.selectLabel} htmlFor={`${t.baseId}-check-${index}`}>
                        <VisuallyHidden id={`${t.baseId}-select-${index}`}>{t.messages.selectRow}</VisuallyHidden>
                        <Checkbox
                          id={`${t.baseId}-check-${index}`}
                          aria-labelledby={`${t.baseId}-select-${index} ${t.baseId}-row-${index}`}
                          checked={t.selected.includes(row.id)}
                          onCheckedChange={() => t.toggleRow(row.id)}
                        />
                      </label>
                    </td>
                  )}
                  {t.columns.map((column, columnIndex) => {
                    const content =
                      column.format === 'code' ? (
                        <span key={column.id} className={t.classes.code}>
                          {column.cell(row)}
                        </span>
                      ) : (
                        column.cell(row)
                      );
                    return columnIndex === t.rowHeaderIndex ? (
                      <th
                        key={column.id}
                        scope='row'
                        id={`${t.baseId}-row-${index}`}
                        data-format={column.format ?? 'text'}
                        className={t.classes.cell(column.format, true)}
                      >
                        {content}
                      </th>
                    ) : (
                      <td
                        key={column.id}
                        data-format={column.format ?? 'text'}
                        className={t.classes.cell(column.format)}
                      >
                        {content}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar orientation='horizontal' className={t.classes.scrollbar}>
        <ScrollAreaPrimitive.Thumb className={t.classes.thumb} />
      </ScrollAreaPrimitive.Scrollbar>
      {t.maxHeight && (
        <ScrollAreaPrimitive.Scrollbar orientation='vertical' className={t.classes.scrollbar}>
          <ScrollAreaPrimitive.Thumb className={t.classes.thumb} />
        </ScrollAreaPrimitive.Scrollbar>
      )}
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  );
}
