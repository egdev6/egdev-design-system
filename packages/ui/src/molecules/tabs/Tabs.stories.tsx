import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
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
 * Horizontal sibling views inside a page, with optional counters and underline or segmented treatment.
 *
 * ## Dependencies
 * Radix Tabs owns automatic activation, roving focus and tab/panel relationships. The existing
 * Surface well recipe paints the segmented list; compact counters are owned parts, not Badge overrides.
 *
 * ## Usage guidelines
 * Supply unique, non-empty item values and at least one enabled item. Inactive panel contents unmount;
 * lift persistent state into the host. Counts are raw numbers and included in accessible tab names.
 * Use meaningful labels for danger counters. Dense small/segmented sizes target pointer devices.
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
