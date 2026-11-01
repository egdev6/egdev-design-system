import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabBar } from './TabBar';
import type { TabBarItem } from './types';

const items: TabBarItem[] = [
  { id: 'home', label: 'Home', href: '#home', icon: 'compass' },
  { id: 'activity', label: 'Activity', href: '#activity', icon: 'radio' },
  { id: 'settings', label: 'Settings', href: '#settings', icon: 'settings' }
];

/** Native navigation; the host owns fixed positioning, responsive visibility and content clearance. */
const meta: Meta<typeof TabBar> = {
  title: 'Organisms/TabBar',
  component: TabBar,
  tags: ['autodocs'],
  args: { label: 'Main navigation', items },
  decorators: [
    (Story) => (
      <div className='w-96 max-w-full min-h-96 flex flex-col justify-end bg-surface-0'>
        <Story />
      </div>
    )
  ]
};
export default meta;
type Story = StoryObj<typeof TabBar>;
export const Default: Story = {};
export const CurrentPage: Story = {
  args: { items: [{ ...items[0], 'aria-current': 'page' } as TabBarItem, ...items.slice(1)] }
};
export const PendingCount: Story = { args: { items: [{ ...items[0], count: 4 } as TabBarItem, ...items.slice(1)] } };
export const LargeCount: Story = { args: { items: [{ ...items[0], count: 250 } as TabBarItem, ...items.slice(1)] } };
export const FourItems: Story = {
  args: { items: [...items, { id: 'more', label: 'More', href: '#more', icon: 'plus' }] }
};
export const LongLabels: Story = {
  args: { items: [{ ...items[0], label: 'A very long destination label' } as TabBarItem, ...items.slice(1)] }
};
export const LocalizedMessages: Story = {
  args: {
    items: [{ ...items[0], count: 4 } as TabBarItem, ...items.slice(1)],
    messages: { pendingCount: (count) => `${count} waiting` }
  }
};
export const FixedInViewport: Story = {
  args: { className: 'fixed inset-x-0 bottom-0' },
  parameters: { viewport: { defaultViewport: 'mobile1' } }
};
