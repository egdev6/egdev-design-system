import type { Meta, StoryObj } from '@storybook/react-vite';
import { NavList } from '../../molecules/nav-list';
import { Sidebar } from './Sidebar';

const navigation = <NavList label='Workspace' items={[{ id: 'home', label: 'Home', href: '#home' }]} />;
const product = { name: 'Workspace', node: <span aria-hidden='true'>W</span> };

/** A host-sized panel. The host owns responsive visibility and routing; NavList owns its landmark. */
const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  args: { children: navigation, product }
};
export default meta;
type Story = StoryObj<typeof Sidebar>;
export const Default: Story = {};
export const LinkedProduct: Story = { args: { product: { ...product, href: '#home' } } };
export const WithFooter: Story = { args: { footer: <button type='button'>Account</button> } };
export const Overflow: Story = {
  args: {
    children: (
      <NavList
        label='Long navigation'
        items={Array.from({ length: 30 }, (_, i) => ({ id: String(i), label: `Item ${i + 1}`, href: `#item-${i}` }))}
      />
    )
  }
};
export const WithoutProduct: Story = { args: { product: undefined } };
export const LongProductName: Story = {
  args: { product: { ...product, name: 'A very long product name that exceeds the available space' } }
};
export const RTL: Story = { args: { dir: 'rtl' } };
