import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { NavList } from './NavList';
import type { NavListLink, NavListProps } from './types';

const destinations: NavListLink[] = [
  { id: 'overview', label: 'Overview', href: '#overview', icon: 'compass' },
  { id: 'activity', label: 'Activity', href: '#activity', icon: 'radio' }
];

function ControlledExample(props: NavListProps) {
  const [open, setOpen] = useState(false);
  return (
    <NavList
      {...props}
      items={[
        {
          kind: 'collapsible-group',
          id: 'controlled',
          label: 'Content',
          items: destinations,
          open,
          onOpenChange: (next) => {
            action('onOpenChange')(next);
            setOpen(next);
          }
        }
      ]}
    />
  );
}

/**
 * ## Description
 * Named in-flow destinations with optional static groups and independent disclosures.
 *
 * ## Dependencies
 * Radix Collapsible owns disclosure state and relationships. Icon, Badge, StatusDot and
 * VisuallyHidden provide decorative metadata; Surface's public recipe raises the current row.
 *
 * ## Usage guidelines
 * The host owns the panel and routing. Mark at most one current page and omit unavailable links.
 * Keep ids stable; groups contain links only. className supports outer layout, not appearance.
 * Intercept only unmodified primary clicks for client routing. External closure while a child
 * is focused requires application-owned focus restoration before hiding it.
 */
const meta: Meta<typeof NavList> = {
  title: 'Molecules/NavList',
  component: NavList,
  tags: ['autodocs'],
  args: { label: 'Workspace', items: destinations }
};
export default meta;
type Story = StoryObj<typeof NavList>;

/** Native anchors with no current route or fabricated groups. */
export const Default: Story = {};

/** Current-page Material is supplied by Surface, not a copied row recipe. */
export const CurrentPage: Story = {
  args: {
    items: [{ id: 'overview', label: 'Overview', href: '#overview', icon: 'compass', 'aria-current': 'page' }],
    onNavigate: action('onNavigate')
  }
};

/** Non-interactive captions label their nested lists. */
export const StaticGroups: Story = {
  args: { items: [{ kind: 'group', id: 'tools', label: 'Tools', items: destinations }] }
};

/** Groups open independently; the closed current child does not mark its trigger current. */
export const CollapsibleGroups: Story = {
  args: {
    items: [
      { kind: 'collapsible-group', id: 'content', label: 'Content', defaultOpen: true, items: destinations },
      {
        kind: 'collapsible-group',
        id: 'archive',
        label: 'Archive',
        items: [{ id: 'saved', label: 'Saved', href: '#saved', 'aria-current': 'page' }]
      }
    ]
  }
};

/** The owner acknowledges each requested state rather than mirroring incoming updates. */
export const ControlledGroups: Story = { render: ControlledExample };

/** Zero and raw counters alongside full-size neutral and brand Badge tags. */
export const CountsAndTags: Story = {
  args: {
    items: [
      { id: 'inbox', label: 'Inbox', href: '#inbox', count: 0, tag: { children: 'Beta' } },
      { id: 'projects', label: 'Projects', href: '#projects', count: 1200, tag: { children: 'New', tone: 'brand' } }
    ]
  }
};

/** Closed groups retain both the activity signal and supplied group count. */
export const GroupSignals: Story = {
  args: {
    items: [
      {
        kind: 'collapsible-group',
        id: 'live',
        label: 'Live',
        count: 4,
        signal: { state: 'live', text: 'Voting live' },
        items: destinations
      },
      { kind: 'group', id: 'queue', label: 'Queue', signal: { state: 'standby', text: 'Waiting for votes' }, items: [] }
    ]
  }
};

/** A decorative warning glyph has a readable equivalent in the link name. */
export const Warning: Story = {
  args: { items: [{ id: 'connection', label: 'Connection', href: '#connection', warning: 'Needs reconnection' }] }
};

/** Only the label truncates; the full accessible name and quantities remain available. */
export const LongLabels: Story = {
  args: {
    className: 'w-64',
    items: [
      { id: 'long', label: 'A very long destination name that exceeds its available width', href: '#long', count: 2 }
    ]
  }
};

/** Empty data has no fabricated destination or empty-state copy. */
export const Empty: Story = { args: { items: [] } };
