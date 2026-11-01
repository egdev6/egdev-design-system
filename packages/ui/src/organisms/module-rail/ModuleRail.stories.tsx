import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from '../../atoms/logo';
import { ModuleRail } from './ModuleRail';

const items = [
  { id: 'home', label: 'Home', href: '#home', icon: 'compass' as const },
  { id: 'tools', label: 'Tools', href: '#tools', icon: 'hammer' as const }
] as const;
const meta: Meta<typeof ModuleRail> = {
  title: 'Organisms/ModuleRail',
  component: ModuleRail,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='h-96'>
        <Story />
      </div>
    )
  ],
  args: {
    label: 'Modules',
    items: [...items],
    product: { name: 'Workspace', node: <Logo variant='mark' />, href: '#home' }
  }
};
export default meta;
type Story = StoryObj<typeof ModuleRail>;
export const Default: Story = {};
export const CurrentAndStates: Story = {
  args: {
    items: [
      { ...items[0], 'aria-current': 'page', state: 'running' },
      { ...items[1], state: 'warning' }
    ]
  }
};
export const Stopped: Story = { args: { items: [{ ...items[0], state: 'stopped' }] } };
export const WithAdd: Story = {
  args: {
    onAdd: () => {
      /* Consumer owns creation. */
    }
  }
};
export const EndItems: Story = {
  args: { endItems: [{ id: 'settings', label: 'Settings', href: '#settings', icon: 'settings' }] }
};
export const Separators: Story = { args: { items: [items[0], { kind: 'separator', id: 'separator' }, items[1]] } };
export const Minimal: Story = { args: { items: [], product: undefined } };
export const Overflow: Story = {
  args: {
    items: Array.from({ length: 30 }, (_, i) => ({
      id: `${i}`,
      label: `Module ${i + 1}`,
      href: `#${i}`,
      icon: 'compass'
    }))
  }
};
export const Localized: Story = {
  args: {
    items: [{ ...items[0], state: 'running' }],
    messages: { add: 'Create', states: { running: 'Active' } },
    onAdd: () => {
      /* Consumer owns creation. */
    }
  }
};
export const RTL: Story = { args: { dir: 'rtl' } };
