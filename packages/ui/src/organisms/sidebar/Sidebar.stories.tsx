import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '../../atoms/avatar';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Logo } from '../../atoms/logo';
import { NavList } from '../../molecules/nav-list';
import { Sidebar } from './Sidebar';

const navigation = (
  <NavList
    label='Workspace'
    items={[
      { id: 'home', label: 'Home', href: '#home', icon: 'compass', 'aria-current': 'page' },
      { id: 'activity', label: 'Activity', href: '#activity', icon: 'radio' },
      {
        kind: 'collapsible-group',
        id: 'archive',
        label: 'Archive',
        items: [{ id: 'saved', label: 'Saved', href: '#saved' }]
      }
    ]}
  />
);
const product = { name: 'Workspace', node: <Logo variant='mark' /> };
const footer = <IconButton label='Account' icon={<Icon name='user' />} />;

/** A host-sized panel. The host owns responsive visibility and routing; NavList owns its landmark. */
const meta: Meta<typeof Sidebar> = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='h-96'>
        <Story />
      </div>
    )
  ],
  args: { children: navigation, product }
};
export default meta;
type Story = StoryObj<typeof Sidebar>;

/** Default width with a current link, an inactive link and an independent disclosure. */
export const Default: Story = {};

/** Product artwork links home under the supplied accessible product name. */
export const LinkedProduct: Story = { args: { product: { ...product, href: '#home' } } };

/** The optional footer stays outside the scrolling navigation body. */
export const WithFooter: Story = { args: { footer, product: { name: 'Community', node: <Avatar /> } } };
/** The body scrolls independently while the product and footer remain pinned. */
export const Overflow: Story = {
  args: {
    footer,
    children: (
      <NavList
        label='Long navigation'
        items={Array.from({ length: 30 }, (_, i) => ({
          id: String(i),
          label: `Long navigation destination ${i + 1}`,
          href: `#item-${i}`
        }))}
      />
    )
  }
};
/** Omitting product identity leaves the navigation as the first content. */
export const WithoutProduct: Story = { args: { product: undefined } };

/** Long product names truncate without changing the supplied name. */
export const LongProductName: Story = {
  args: { product: { ...product, name: 'A very long product name that exceeds the available space' } }
};

/** The host direction reaches the navigation and its logical current marker. */
export const RTL: Story = { args: { dir: 'rtl' } };
