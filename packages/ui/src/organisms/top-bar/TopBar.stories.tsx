import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../atoms/button';
import { Dialog, DialogContent, DialogTrigger } from '../../molecules/dialog';
import { Menu } from '../../molecules/menu';
import {
  TopBar,
  TopBarBrand,
  TopBarMobileTrigger,
  TopBarSearchCompact,
  TopBarSearchFull,
  TopBarUserMenu
} from './TopBar';
import type { TopBarItem } from './types';

const items: TopBarItem[] = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' }
];
const brand = (
  <TopBarBrand>
    <a href='/'>Studio</a>
  </TopBarBrand>
);
/** Fixed site navigation. Supply direct parts (fragments are allowed); missing brand, duplicate parts and non-part children are composition errors. The host reserves nav-height once, provides a legible backdrop and manages dialog focus on resize. */
const meta = {
  title: 'Organisms/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  args: { label: 'Main navigation', items, children: brand }
} satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof TopBar>;
/** Required inputs with transparent host-owned state. */
export const Default: Story = {};
/** The host marks the current destination; its brand indicator resembles Tabs without changing native navigation. */
export const CurrentPage: Story = {
  args: {
    items: [
      { id: 'home', label: 'Home', href: '#home', 'aria-current': 'page' },
      { id: 'about', label: 'About', href: '#about' }
    ]
  }
};
/** The host explicitly selects the overlay. */
export const Glass: Story = { render: (args) => <TopBar {...args} data-state='glass' /> };
/** Compact controls appear when the bar container is at most 900px wide. */
export const Compact: Story = {
  args: {
    children: (
      <>
        {brand}
        <TopBarSearchCompact>
          <Button variant='neutral' size='lg'>
            Search
          </Button>
        </TopBarSearchCompact>
        <TopBarMobileTrigger>
          <Button variant='neutral' size='lg'>
            Menu
          </Button>
        </TopBarMobileTrigger>
      </>
    )
  }
};
/** The full and compact launchers must provide equivalent actions. */
export const ComposedControls: Story = {
  args: {
    children: (
      <>
        {brand}
        <TopBarSearchFull>
          <Button variant='neutral' size='lg'>
            Search
          </Button>
        </TopBarSearchFull>
        <TopBarSearchCompact>
          <Button variant='neutral' size='lg'>
            Search
          </Button>
        </TopBarSearchCompact>
        <TopBarUserMenu>
          <Button variant='neutral' size='lg'>
            Account
          </Button>
        </TopBarUserMenu>
        <TopBarMobileTrigger>
          <Button variant='neutral' size='lg'>
            Menu
          </Button>
        </TopBarMobileTrigger>
      </>
    )
  }
};
/** The host owns glass state and must handle resize while the dialog trigger is hidden. */
export const MobileDialog: Story = {
  render: function MobileDialogStory(args) {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <TopBar {...args} data-state={open ? 'glass' : 'transparent'}>
          {brand}
          <TopBarMobileTrigger>
            <DialogTrigger asChild={true}>
              <Button variant='neutral' size='lg'>
                Menu
              </Button>
            </DialogTrigger>
          </TopBarMobileTrigger>
        </TopBar>
        <DialogContent title='Mobile navigation'>
          <a href='#home'>Home</a>
          <a href='#about'>About</a>
        </DialogContent>
      </Dialog>
    );
  }
};
/** Menu owns its portal, focus and dismissal. */
export const UserMenu: Story = {
  args: {
    children: (
      <>
        {brand}
        <TopBarUserMenu>
          <Menu items={[{ id: 'profile', kind: 'link', label: 'Profile', href: '#profile' }]}>
            <Button variant='neutral' size='lg'>
              Account
            </Button>
          </Menu>
        </TopBarUserMenu>
      </>
    )
  }
};
/** Long destination labels are consumer-owned and require real reflow testing. */
export const LongLabels: Story = {
  args: { items: [{ id: 'long', label: 'A longer destination label for localization', href: '#long' }] }
};
/** Change the fixed header width to exercise the container boundary. */
export const Widths: Story = {
  args: {
    className: 'w-[900px]',
    children: (
      <>
        {brand}
        <TopBarSearchFull>
          <Button variant='neutral' size='lg'>
            Full search
          </Button>
        </TopBarSearchFull>
        <TopBarSearchCompact>
          <Button variant='neutral' size='lg'>
            Compact search
          </Button>
        </TopBarSearchCompact>
      </>
    )
  }
};
