import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../atoms/button';
import { Link } from '../../atoms/link';
import { Logo } from '../../atoms/logo';
import { StatusDot } from '../../atoms/status-dot';
import { Dialog, DialogContent, DialogTrigger } from '../../molecules/dialog';
import { Menu } from '../../molecules/menu';
import {
  TopBar,
  TopBarBrand,
  TopBarEnd,
  TopBarMobileTrigger,
  TopBarSearchCompact,
  TopBarSearchFull,
  TopBarUserMenu
} from './TopBar';
import type { TopBarItem } from './types';

const items: TopBarItem[] = [
  { id: 'home', label: 'Home', href: '#home', 'aria-current': 'page' },
  { id: 'about', label: 'About', href: '#about' }
];
const brand = (
  <TopBarBrand>
    <span className='inline-flex items-center'>
      <Link href='#home' aria-label='Studio home' arrow={false}>
        <Logo variant='mark' size='sm' />
        <span className='flex flex-col'>
          <span className='font-display text-heading-small uppercase text-fg-default'>Studio</span>
          <span className='text-label-default font-[var(--text-body-muted--font-weight)] text-fg-secondary'>
            Design system
          </span>
        </span>
      </Link>
      <span aria-hidden='true' className='w-10 shrink-0' />
    </span>
  </TopBarBrand>
);
const status = (
  <TopBarEnd>
    <span className='inline-flex items-center gap-2 text-label-default font-[var(--text-body-muted--font-weight)] text-fg-secondary'>
      <StatusDot state='running' /> Online
    </span>
  </TopBarEnd>
);
/**
 * ## Description
 * Fixed site navigation with consumer-owned brand, destinations and controls.
 *
 * ## Dependencies
 * The examples compose Link, Logo, StatusDot, Button, Dialog and Menu.
 *
 * ## Usage guidelines
 * Supply direct parts or fragments; one brand is required, but a home link is optional.
 * Transparent and content are the runtime defaults. Scroll selects glass unless the host supplies
 * data-state. Reserve nav-height once, ensure backdrop contrast and manage dialog focus on resize.
 */
const meta = {
  title: 'Organisms/TopBar',
  component: TopBar,
  tags: ['autodocs'],
  args: { label: 'Main navigation', items, children: brand }
} satisfies Meta<typeof TopBar>;
export default meta;
type Story = StoryObj<typeof TopBar>;

/** A reference-style solid header with a current page and passive status in its end slot. */
export const Default: Story = {
  args: {
    initialBackground: 'solid',
    children: (
      <>
        {brand}
        {status}
      </>
    )
  }
};
/** Scroll the page to see the transparent backing become glass, then return to the top. */
export const ScrollGlass: Story = {
  render: (args) => (
    <>
      <TopBar {...args} />
      <div className='h-dvh' />
      <div className='h-dvh' />
    </>
  )
};
/** Full width retains the same gutters while the background remains full-bleed. */
export const FullWidth: Story = {
  args: {
    contentWidth: 'full',
    children: (
      <>
        {brand}
        {status}
      </>
    )
  }
};
/** The free end slot can contain passive content without any other utility parts. */
export const TrailingSlot: Story = {
  args: {
    items: [],
    children: (
      <>
        {brand}
        {status}
      </>
    )
  }
};
/** The host marks the current destination while native navigation remains unchanged. */
export const CurrentPage: Story = {
  args: { items: [{ id: 'about', label: 'About', href: '#about', 'aria-current': 'page' }] }
};
/** The host may explicitly select the overlay regardless of scroll. */
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
/** The host owns the dialog and must handle resize while its trigger is hidden. */
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
          <Link href='#home' arrow={false}>
            Home
          </Link>
          <Link href='#about' arrow={false}>
            About
          </Link>
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
