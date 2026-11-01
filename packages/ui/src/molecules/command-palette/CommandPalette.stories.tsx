import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { SearchTrigger } from '../../atoms/search-trigger';
import { CommandPalette } from './CommandPalette';
import type { CommandPaletteItem } from './types';

const items: CommandPaletteItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    category: 'Navigation',
    icon: 'settings',
    shortcut: '⌘,',
    onSelect: action('settings')
  },
  { id: 'search', label: 'Search documentation', category: 'Actions', icon: 'search', onSelect: action('search') }
];
const meta = {
  title: 'Molecules/CommandPalette',
  component: CommandPalette,
  tags: ['autodocs'],
  args: { items, children: <Button variant='secondary'>Open commands</Button> }
} satisfies Meta<typeof CommandPalette>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  render: function DefaultStory(args) {
    const [open, setOpen] = useState(false);
    useEffect(() => {
      const handler = (event: KeyboardEvent) => {
        const target = event.target as HTMLElement | null;
        if (
          (event.metaKey || event.ctrlKey) &&
          event.key.toLowerCase() === 'k' &&
          !event.repeat &&
          !event.isComposing &&
          !target?.isContentEditable &&
          !['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')
        ) {
          event.preventDefault();
          setOpen(true);
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, []);
    return (
      <CommandPalette {...args} open={open} onOpenChange={setOpen}>
        <SearchTrigger shortcut='⌘K' />
      </CommandPalette>
    );
  }
};
export const WithSearchTrigger: Story = { args: { children: <SearchTrigger /> } };
export const Shortcuts: Story = {};
export const Empty: Story = { args: { items: [] } };
export const Busy: Story = { args: { busy: true } };
export const RemoteResults: Story = { args: { filtering: 'none', onQueryChange: action('query') } };
export const Localized: Story = {
  args: { label: 'Find actions', dismissLabel: 'Dismiss', messages: { empty: 'Nothing found.' } }
};
export const Controlled: Story = {
  render: function ControlledStory(args) {
    const [open, setOpen] = useState(false);
    return <CommandPalette {...args} open={open} onOpenChange={setOpen} />;
  }
};
