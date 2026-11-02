import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/button';
import { Logo } from '../../atoms/logo';
import { NavList } from '../../molecules/nav-list';
import { ModuleRail } from '../../organisms/module-rail';
import { Sidebar } from '../../organisms/sidebar';
import { TabBar } from '../../organisms/tab-bar';
import { Heading, Text } from '../../primitives/text';
import { AppShell } from './AppShell';

const pageContent = (
  <div className='flex flex-col items-start gap-4 p-6'>
    <Heading level={1}>Workspace</Heading>
    <Text>Placeholder page content: the shell places regions and never renders product data.</Text>
    <Button>Primary action</Button>
  </div>
);

const longContent = (
  <div className='flex flex-col items-start gap-4 p-6'>
    <Heading level={1}>Long content</Heading>
    {Array.from({ length: 40 }, (_, index) => (
      <Text key={index}>Row {index + 1}: the document scrolls while both navigation regions stay docked.</Text>
    ))}
  </div>
);

const sidebar = (
  <Sidebar product={{ name: 'Workspace', node: <Logo variant='mark' /> }}>
    <NavList
      label='Primary'
      items={[
        { id: 'home', label: 'Home', href: '#home', 'aria-current': 'page' },
        { id: 'activity', label: 'Activity', href: '#activity' },
        { id: 'settings', label: 'Settings', href: '#settings' }
      ]}
    />
  </Sidebar>
);

const moduleRail = (
  <ModuleRail
    label='Modules'
    product={{ name: 'Workspace', node: <Logo variant='mark' />, href: '#home' }}
    items={[
      { id: 'home', label: 'Home', href: '#home', icon: 'compass', 'aria-current': 'page' },
      { id: 'tools', label: 'Tools', href: '#tools', icon: 'hammer' }
    ]}
  />
);

const tabBar = (
  <TabBar
    label='Primary'
    items={[
      { id: 'home', label: 'Home', href: '#home', icon: 'compass', 'aria-current': 'page' },
      { id: 'activity', label: 'Activity', href: '#activity', icon: 'radio' },
      { id: 'settings', label: 'Settings', href: '#settings', icon: 'settings' }
    ]}
  />
);

/**
 * ## Description
 * Responsive application region layout: a docked side navigation region on wide viewports, a
 * docked bottom navigation region on narrow ones, one `main` landmark and a built-in skip link.
 *
 * ## Dependencies
 * Composes the supplied navigation organisms and the Button atom; it imports no navigation data
 * and no routing. The table below uses real Sidebar, ModuleRail and TabBar instances.
 *
 * ## Usage guidelines
 * Each story is the full-viewport host: the shell root fills the story viewport, so the iframe
 * scrollport is the document scrollport and docking stays realistic. Supply one view and one
 * `main` per AppShell, mark the current page in both navigations, and keep their destinations
 * equivalent. `className` supports outer sizing and margins only.
 */
const meta: Meta<typeof AppShell> = {
  title: 'Templates/AppShell',
  component: AppShell,
  tags: ['autodocs'],
  args: { children: pageContent, sideNavigation: sidebar, bottomNavigation: tabBar }
};
export default meta;
type Story = StoryObj<typeof AppShell>;

/** Both navigation slots: the side region at 56rem and above, the bottom region below it. */
export const SidebarAndTabBar: Story = {};

/** A compact rail as the wide-viewport region with the same bottom bar on narrow viewports. */
export const ModuleRailAndTabBar: Story = { args: { sideNavigation: moduleRail } };

/** A single side region is visible at every width and keeps the skip link. */
export const SideOnly: Story = { args: { bottomNavigation: undefined } };

/** A single bottom region is visible at every width; nothing precedes main, so no skip link renders. */
export const BottomOnly: Story = { args: { sideNavigation: undefined } };

/** No navigation slot: only the main landmark remains. */
export const ContentOnly: Story = { args: { sideNavigation: undefined, bottomNavigation: undefined } };

/** A document taller than the viewport: the page scrolls and the bottom region never covers the content end. */
export const LongContent: Story = { args: { children: longContent } };

/** Narrow viewport host: the bottom region is docked and the side region is removed from the accessibility tree. */
export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: 'mobile1' } }
};

/** Tab from the document start focuses the hidden-until-focused skip link, which then appears in flow. */
export const SkipLink: Story = {};

/** Localizable built-in text: only the skip link label is owned by the shell. */
export const Localized: Story = { args: { messages: { skipToContent: 'Saltar al contenido' } } };

/** Logical inline direction: the side region and skip link sit at the inline start. */
export const RTL: Story = { args: { dir: 'rtl' } };
