import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Switch } from '../../atoms/switch';
import { ButtonGroup } from '../button-group';
import { Table } from './Table';
import type { TableColumn } from './types';

type Row = { id: string; name: string; count: number };
const rows: Row[] = [
  { id: 'a', name: 'First', count: 10 },
  { id: 'b', name: 'Second', count: 2 }
];
const columns: TableColumn<Row>[] = [
  { id: 'name', header: 'Name', cell: (row) => row.name, sortValue: (row) => row.name },
  { id: 'count', header: 'Count', cell: (row) => row.count, sortValue: (row) => row.count, format: 'number' }
];
const meta = {
  title: 'Molecules/Table',
  component: Table<Row>,
  tags: ['autodocs'],
  args: { label: 'Items', rows, columns }
} satisfies Meta<typeof Table<Row>>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const HiddenCaption: Story = { args: { hideLabel: true } };
export const Sorting: Story = { args: { defaultSort: { columnId: 'count', direction: 'ascending' } } };
export const Selection: Story = { args: { selectable: true } };
export const ActiveRow: Story = { args: { activeRowId: 'a' } };
export const Empty: Story = { args: { rows: [] } };
export const MaxHeight: Story = { args: { maxHeight: 'sm' } };
export const Compact: Story = { args: { size: 'sm' } };
export const Details: Story = { args: { variant: 'details' } };
export const ControlledSort: Story = {
  args: { sort: { columnId: 'count', direction: 'ascending' }, onSortChange: action('onSortChange') }
};
export const SelectionFiltered: Story = {
  args: { selectable: true, defaultValue: ['outside', 'a'], onValueChange: action('onValueChange') }
};
export const SortWithSelection: Story = {
  args: {
    selectable: true,
    defaultValue: ['a'],
    activeRowId: 'a',
    onSortChange: action('onSortChange'),
    onValueChange: action('onValueChange')
  }
};
export const Localized: Story = {
  args: {
    selectable: true,
    messages: { selectAll: 'Select every item', selectRow: 'Choose', empty: 'No items available' },
    rows: []
  }
};
export const Overflow: Story = { args: { className: 'max-w-48' } };
export const Touch: Story = { args: { selectable: true } };
export const Focus: Story = { args: { selectable: true } };
export const ConsumerLayout: Story = { args: { className: 'my-4 max-w-lg' } };
export const Formats: Story = {
  args: {
    columns: [
      { id: 'name', header: 'Name', cell: (row) => row.name, format: 'code' },
      { id: 'count', header: 'Count', cell: (row) => row.count, format: 'number' }
    ]
  }
};
export const ActionsColumn: Story = {
  args: {
    columns: [
      ...columns,
      {
        id: 'actions',
        header: 'Actions',
        format: 'actions',
        hideHeader: true,
        cell: (row) => <Button size='sm'>Edit {row.name}</Button>
      }
    ]
  }
};
export const Compositions: Story = {
  args: {
    columns: [
      ...columns,
      { id: 'status', header: 'Status', cell: () => <Badge>Ready</Badge> },
      { id: 'enabled', header: 'Enabled', cell: (row) => <Switch aria-label={`Enable ${row.name}`} /> },
      {
        id: 'actions',
        header: 'Actions',
        format: 'actions',
        cell: (row) => (
          <ButtonGroup label={`Actions for ${row.name}`}>
            <Button size='sm'>Edit {row.name}</Button>
            <IconButton size='md' label={`More actions for ${row.name}`} icon={<Icon name='chevron-down' />} />
          </ButtonGroup>
        )
      }
    ]
  }
};
