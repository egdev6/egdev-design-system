import { createAccentTheme } from '@egdev/tokens/accent';
import { DirectionProvider } from '@radix-ui/react-direction';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { type CSSProperties, useState } from 'react';
import { action } from 'storybook/actions';
import { Tabs } from './Tabs';
import type { TabsItem } from './types';

const items: TabsItem[] = [
  { value: 'queue', label: 'Queue', content: 'Queued posts' },
  { value: 'drafts', label: 'Drafts', content: 'Draft posts' },
  { value: 'published', label: 'Published', content: 'Published posts' }
];

/**
 * ## Description
 * Horizontal sibling views inside a page, with optional counters and underline, segmented or outline treatment.
 *
 * ## Dependencies
 * Radix Tabs owns automatic activation, roving focus and tab/panel relationships. The existing
 * Surface well recipe paints the segmented and outline lists; compact counters are owned parts, not Badge overrides.
 * The outline selected tab reads the accent roles (selected border and chip sheen), so a host accent map recolors it.
 *
 * ## Usage guidelines
 * Supply unique, non-empty item values and at least one enabled item. Inactive panel contents unmount;
 * lift persistent state into the host. Counts are raw numbers and included in accessible tab names.
 * Use meaningful labels for danger counters. Dense small/segmented sizes target pointer devices.
 * Segmented and outline fullWidth distribute tabs equally when they fit; labelWrap permits long labels to wrap at
 * logical start.
 * The options are independent, do not affect underline and preserve the visible overflow scrollbar.
 * fill makes Tabs fill a host that owns a definite height: the tab list stays fixed and only the active panel
 * scrolls, and the root carries a bare data-fill marker. Inactive panels unmount, so scroll position is not kept.
 * className supports root margin, width and grid placement only, not internal appearance overrides.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: { items, label: 'Post views' }
};
export default meta;
type Story = StoryObj<typeof Tabs>;

/** Required inputs only: first enabled view, medium underline and no counters. */
export const Default: Story = {};

/** Raw counters, including zero and an uncapped value; danger is reinforced by the label. */
export const WithCounts: Story = {
  args: {
    items: [
      { ...items[0], value: 'queue', label: 'Queue', count: 4, content: 'Queued posts' },
      { ...items[1], value: 'drafts', label: 'Drafts', count: 0, content: 'Draft posts' },
      { ...items[2], value: 'published', label: 'Published', count: 312, content: 'Published posts' },
      { value: 'errors', label: 'With errors', count: 1, tone: 'danger', content: 'Posts requiring attention' }
    ]
  }
};

/** Compact underline row for cheap, automatically activated network-specific views. */
export const Small: Story = {
  args: {
    size: 'sm',
    label: 'Network text',
    items: [
      { value: 'common', label: 'Common text', content: 'Text shared across networks' },
      { value: 'linkedin', label: 'LinkedIn', content: 'LinkedIn text' },
      { value: 'x', label: 'X', content: 'X text' }
    ]
  }
};

/** The middle option is raised inside the shared well; panels contain each filtered view. */
export const Segmented: Story = {
  args: {
    variant: 'segmented',
    defaultValue: 'week',
    label: 'Report period',
    items: [
      { value: 'day', label: '24 h', content: 'Results for the last 24 hours' },
      { value: 'week', label: '7 days', content: 'Results for the last 7 days' },
      { value: 'month', label: '30 days', content: 'Results for the last 30 days' }
    ]
  }
};

/** A host acknowledges selection requests; Radix still handles all interaction and ARIA. */
export const Controlled: Story = {
  args: { onValueChange: action('onValueChange') },
  render: function ControlledTabs(args) {
    const [value, setValue] = useState('drafts');
    return (
      <Tabs
        {...args}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          args.onValueChange?.(next);
        }}
      />
    );
  }
};

/** The initial disabled item is skipped both by the derived default and arrow navigation. */
export const Disabled: Story = {
  args: { items: items.map((item) => ({ ...item, disabled: item.value === 'queue' })) }
};

/** The segmented well fills the host; short labels are equal when they fit and scroll when they do not. */
export const FullWidth: Story = {
  args: { variant: 'segmented', fullWidth: true }
};

/** Natural and unbroken long labels reflow independently of the full-width option in a narrow host. */
export const LabelWrap: Story = {
  args: {
    variant: 'segmented',
    labelWrap: true,
    items: [
      { value: 'reviews', label: 'Posts awaiting editorial review', content: 'Posts awaiting review' },
      { value: 'archive', label: 'ExtraordinarilyLongUnbrokenArchiveLabel', content: 'Archived posts' }
    ]
  },
  render: (args) => (
    <div className='w-48'>
      <Tabs {...args} />
    </div>
  )
};

/** Full-width segmented tabs combine start-aligned wrapping with visible counters in a narrow host. */
export const FullWidthLabelWrap: Story = {
  args: {
    variant: 'segmented',
    fullWidth: true,
    labelWrap: true,
    items: [
      { value: 'reviews', label: 'Posts awaiting review', count: 12, content: 'Posts awaiting review' },
      { value: 'archive', label: 'LongUnbrokenArchiveLabel', count: 312, content: 'Archived posts' }
    ]
  },
  render: (args) => (
    <div className='w-48'>
      <Tabs {...args} />
    </div>
  )
};

const appItems: TabsItem[] = [
  { value: 'apps', label: 'My apps', content: 'Installed apps' },
  { value: 'catalog', label: 'Catalog', content: 'Available apps' }
];

/** Bordered well whose selected tab shows the accent border and chip sheen over surface-1 with an edge highlight. */
export const Outline: Story = {
  args: { variant: 'outline', label: 'App views', items: appItems }
};

/** The outline well fills the host; equal tabs when they fit, scrolling with focus reveal when they do not. */
export const OutlineFullWidth: Story = {
  args: { variant: 'outline', fullWidth: true, label: 'App views', items: appItems }
};

/** A consumer-owned host applies a complete accent map; the selected border and sheen follow it. */
export const OutlineCustomAccent: Story = {
  args: { variant: 'outline', label: 'App views', items: appItems },
  render: function OutlineCustomAccentExample(args) {
    const theme = createAccentTheme('#3b82f6');
    const red = createAccentTheme(null);
    return (
      <div className='grid gap-6'>
        <div style={theme.variables as CSSProperties}>
          <Tabs {...args} />
        </div>
        <div style={red.variables as CSSProperties}>
          <Tabs {...args} label='App views with the default accent' />
        </div>
      </div>
    );
  }
};

const manyItems: TabsItem[] = [
  'Overview',
  'Activity',
  'Schedule',
  'Drafts',
  'Published',
  'Analytics',
  'Comments',
  'Settings',
  'Integrations',
  'Archive'
].map((label) => ({ value: label.toLowerCase(), label, content: `${label} view` }));

/**
 * Overflowing lists fade only the edges that hide more tabs, driven by the list's own scroll position.
 * With a mouse or other fine pointer, arrow buttons over the faded edges scroll one page; each hides at its
 * extreme and stays inert while the pointer rests on it. Touch keeps the fade only. Keyboard focus scrolls
 * each tab past the fade. Browsers without scroll timelines show no fade. Right to left comes from a Radix
 * DirectionProvider; a bare dir attribute is ignored.
 */
export const EdgeFade: Story = {
  args: { items: manyItems, label: 'Project views' },
  render: function EdgeFadeExample(args) {
    return (
      <div className='flex w-48 flex-col gap-6'>
        <Tabs {...args} />
        <DirectionProvider dir='rtl'>
          <div dir='rtl'>
            <Tabs {...args} label='Project views, right to left' />
          </div>
        </DirectionProvider>
        <Tabs {...args} variant='segmented' fullWidth={true} label='Project views, segmented' />
      </div>
    );
  }
};

const fillItems: TabsItem[] = manyItems.map((item) => ({
  ...item,
  content: Array.from({ length: 40 }, (_, index) => (
    <p key={index}>
      {item.label} entry {index + 1}: the list stays fixed while this panel scrolls.
    </p>
  ))
}));

/**
 * A fixed 440 × 640 host owns the definite height. The overflowing tab list keeps its fade, buttons and focus
 * reveal inside the fixed region while the active panel scrolls; for a Panel host see Molecules/Panel FillWithTabs.
 * The scrolling panel clips its content, so content that starts at its edge must keep its own inset (for example
 * a wrapper with `p-1`) to leave room for the focus rings of the controls inside it.
 */
export const FillHost: Story = {
  args: { fill: true, variant: 'outline', items: fillItems, label: 'Project views' },
  render: (args) => (
    <div className='h-[640px] w-[440px]'>
      <Tabs {...args} />
    </div>
  )
};
