import type { Meta, StoryObj } from '@storybook/react-vite';
import { Spinner } from './Spinner';

/**
 * ## Description
 * Indeterminate activity indicator: an open arc that turns once per second while work runs.
 * Use ProgressBar for known progress and Skeleton for content placeholders.
 *
 * ## Dependencies
 * No Radix primitive exists for a passive spinner. Radix VisuallyHidden carries the optional
 * status label. Rotation uses the canonical --animate-spin token; no stylesheet is required.
 *
 * ## Usage guidelines
 * Supply label when the spinner stands alone: the root becomes a polite status region.
 * Without a label it is decorative, for hosts that own their busy state (for example a
 * Button with aria-busy). Announce completion separately and avoid many simultaneous
 * labelled spinners. Color is inherited through currentColor; className supports layout
 * and inherited text color only, not size or animation overrides. Reduced-motion
 * preferences stop the rotation while the arc and label remain.
 */
const meta: Meta<typeof Spinner> = {
  title: 'Atoms/Spinner',
  component: Spinner,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Spinner>;

/** Standalone labelled spinner: a polite status region with visually hidden text. */
export const Default: Story = {
  args: { label: 'Loading results' }
};

/** Decorative spinner without a label, hidden from assistive technology. */
export const Decorative: Story = {};

/** The Icon scale: sm 16px, md 20px (default) and lg 28px. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-end gap-6'>
      <Spinner size='sm' label='Loading small' />
      <Spinner label='Loading medium' />
      <Spinner size='lg' label='Loading large' />
    </div>
  )
};

/** The arc inherits currentColor from its host; there is no color or tone prop. */
export const Colors: Story = {
  render: () => (
    <div className='flex items-end gap-6'>
      <span className='inline-flex items-center gap-2 text-fg-default'>
        <Spinner />
        Loading posts
      </span>
      <Spinner className='text-fg-secondary' label='Loading secondary' />
      <Spinner className='text-fg-muted' label='Loading muted' />
      {/* Material v2 edge plus elevation in the documented order (docs/MATERIAL.md). */}
      <span className='inline-flex p-3 rounded-md bg-[image:var(--gradient-sheen)] bg-surface-1 shadow-[var(--shadow-edge),var(--shadow-elev-1)] text-fg-brand-raised'>
        <Spinner label='Loading brand' />
      </span>
    </div>
  )
};

/**
 * Decorative spinners composed in loading buttons. These hosts use the legacy Foundation
 * button classes as a demo pending the React Button (#53), which owns aria-busy.
 */
export const InButton: Story = {
  render: () => (
    <div className='flex items-end gap-5'>
      <button className='eg-btn eg-btn--primary' type='button' aria-busy='true'>
        Saving
        <Spinner />
      </button>
      <button className='eg-btn eg-btn--secondary' type='button' aria-busy='true'>
        <Spinner />
        Publishing
      </button>
    </div>
  )
};
