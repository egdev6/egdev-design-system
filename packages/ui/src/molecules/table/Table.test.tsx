import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import type { TableColumn, TableProps } from './index';
import { Table } from './index';

beforeAll(() =>
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {
        /* jsdom has no layout */
      }
      unobserve() {
        /* no subscription */
      }
      disconnect() {
        /* no subscription */
      }
    }
  )
);
afterAll(() => vi.unstubAllGlobals());

const rows = [
  { id: 'a', name: 'Item 10', amount: 10 },
  { id: 'b', name: 'Item 2', amount: 2 }
];
const columns: TableColumn<(typeof rows)[number]>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name, sortValue: (row) => row.name },
  { id: 'amount', header: 'Amount', cell: (row) => row.amount, sortValue: (row) => row.amount }
];

// Type-level rejection checks: details does not offer interactive state or a replacement role.
function typeRejectionFixtures() {
  // @ts-expect-error Details cannot enable row selection.
  const detailsSelection: TableProps = {
    label: 'Details',
    columns: [],
    rows: [],
    variant: 'details',
    selectable: true
  };
  // @ts-expect-error Details cannot sort.
  const detailsSort: TableProps = { label: 'Details', columns: [], rows: [], variant: 'details', sort: null };
  // @ts-expect-error Table owns its semantic role.
  const invalidRole: TableProps = { label: 'Items', columns: [], rows: [], role: 'grid' };
  // @ts-expect-error Table owns its caption content.
  const invalidChildren: TableProps = { label: 'Items', columns: [], rows: [], children: 'Wrong' };
  void [detailsSelection, detailsSort, invalidRole, invalidChildren];
}

void typeRejectionFixtures;

describe('Table', () => {
  it('renders native semantics and a named keyboard viewport', () => {
    render(<Table label='Items' columns={columns} rows={rows} hideLabel={true} maxHeight='sm' />);
    expect(screen.getByRole('table', { name: 'Items' })).toHaveClass('eg-table');
    expect(screen.getByRole('group', { name: 'Items' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('scope', 'col');
    expect(screen.getByRole('rowheader', { name: 'Item 10' })).toHaveAttribute('scope', 'row');
  });
  it('sorts and toggles while notifying', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<Table label='Items' columns={columns} rows={rows} onSortChange={onSortChange} />);
    const button = screen.getByRole('button', { name: 'Name' });
    await user.click(button);
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending');
    expect(screen.getAllByRole('rowheader').map((el) => el.textContent)).toEqual(['Item 2', 'Item 10']);
    await user.click(button);
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'descending' });
  });
  it('requests controlled sorting without changing the rendered order', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(<Table label='Items' columns={columns} rows={rows} sort={null} onSortChange={onSortChange} />);
    await user.click(screen.getByRole('button', { name: 'Name' }));
    expect(onSortChange).toHaveBeenCalledWith({ columnId: 'name', direction: 'ascending' });
    expect(screen.getAllByRole('rowheader').map((el) => el.textContent)).toEqual(['Item 10', 'Item 2']);
  });
  it('selects rows, reports mixed state, and preserves off-row ids on select all', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <Table
        label='Items'
        columns={columns}
        rows={rows}
        selectable={true}
        defaultValue={['outside']}
        onValueChange={onValueChange}
        activeRowId='a'
      />
    );
    await user.click(screen.getByRole('checkbox', { name: 'Select Item 10' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['outside', 'a']);
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toHaveAttribute('aria-checked', 'mixed');
    expect(screen.getByRole('rowheader', { name: 'Item 10' }).closest('tr')).toHaveAttribute('aria-current', 'true');
    await user.click(screen.getByRole('checkbox', { name: 'Select all rows' }));
    expect(onValueChange).toHaveBeenLastCalledWith(['outside', 'a', 'b']);
  });
  it('keeps native semantics protected while forwarding allowed attributes and style', () => {
    const unsafe = {
      role: 'grid',
      'aria-label': 'Wrong',
      'aria-labelledby': 'wrong',
      dangerouslySetInnerHTML: { __html: 'bad' }
    };
    render(
      <Table
        {...unsafe}
        label='Items'
        columns={columns}
        rows={rows}
        id='items'
        title='Listing'
        aria-describedby='help'
        style={{ width: '100%' }}
      />
    );
    const table = screen.getByRole('table', { name: 'Items' });
    expect(table).toHaveAttribute('id', 'items');
    expect(table).toHaveAttribute('title', 'Listing');
    expect(table).toHaveAttribute('aria-describedby', 'help');
    expect(table).toHaveStyle({ width: '100%' });
    expect(table).not.toHaveAttribute('role');
    expect(table).not.toHaveAttribute('aria-label');
    expect(table).not.toHaveAttribute('aria-labelledby');
  });
  it('uses keyboard activation without moving focus, selection or the active row', async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();
    render(
      <Table
        label='Items'
        columns={columns}
        rows={rows}
        selectable={true}
        defaultValue={['a']}
        activeRowId='a'
        onSortChange={onSortChange}
      />
    );
    await user.tab();
    expect(screen.getByRole('group', { name: 'Items' })).toHaveFocus();
    await user.tab();
    await user.tab();
    const header = screen.getByRole('button', { name: 'Name' });
    expect(header).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(header).toHaveFocus();
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'ascending' });
    await user.keyboard(' ');
    expect(onSortChange).toHaveBeenLastCalledWith({ columnId: 'name', direction: 'descending' });
    expect(screen.getByRole('checkbox', { name: 'Select Item 10' })).toBeChecked();
    expect(screen.getByRole('rowheader', { name: 'Item 10' }).closest('tr')).toHaveAttribute('aria-current', 'true');
  });
  it('exposes caps, sticky headers and frame-only layout classes', () => {
    const { rerender } = render(
      <Table label='Items' columns={columns} rows={rows} maxHeight='sm' className='w-32 w-64' />
    );
    const viewport = screen.getByRole('group', { name: 'Items' });
    expect(viewport).toHaveClass('max-h-[calc(var(--space-24)*3)]');
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveClass('sticky');
    const frame = viewport.parentElement;
    expect(frame).toHaveClass('eg-table-wrap', 'w-64');
    expect(frame).not.toHaveClass('w-32');
    expect(screen.getByRole('table')).not.toHaveClass('w-64');
    rerender(<Table label='Items' columns={columns} rows={rows} maxHeight='lg' />);
    expect(viewport).toHaveClass('max-h-[calc(var(--space-24)*6)]');
  });
  it('renders empty messages and details without a header', () => {
    const { rerender } = render(
      <Table label='Items' columns={columns} rows={[]} selectable={true} messages={{ empty: 'Nothing' }} />
    );
    expect(screen.getByText('Nothing')).toHaveAttribute('colspan', '3');
    expect(screen.getByRole('checkbox', { name: 'Select all rows' })).toBeDisabled();
    rerender(<Table variant='details' label='Items' columns={columns} rows={rows} />);
    expect(within(screen.getByRole('table')).queryAllByRole('columnheader')).toHaveLength(0);
  });
});
