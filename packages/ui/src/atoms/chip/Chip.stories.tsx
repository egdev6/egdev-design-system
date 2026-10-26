import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Icon } from '../icon';
import { Chip } from './Chip';
import type { ChipProps } from './types';

function ControlledChip(props: ChipProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <Chip
      {...props}
      pressed={pressed}
      onPressedChange={(next) => {
        setPressed(next);
        action('onPressedChange')(next);
      }}
    />
  );
}

/**
 * ## Description
 * A compact pill the user presses to switch one option on or off, such as a topic filter.
 *
 * ## Dependencies
 * Radix Toggle owns keyboard, focus, aria-pressed and data-state. WithIcon composes the public
 * Icon API as consumer content; Chip itself has no Icon dependency.
 *
 * ## Usage guidelines
 * Keep labels short; they never truncate. Use Badge for static labels, Link for navigation and
 * Button for one-shot actions. Group exclusivity belongs to a future ChipGroup, which reuses
 * chipVariants; never nest Chip inside another pressed control. className supports outer layout
 * only, not appearance overrides. No ref, asChild or stylesheet.
 */
const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Design', onPressedChange: action('onPressedChange') }
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof Chip>;

/** Required label only; the uncontrolled off state is the runtime default. */
export const Default: Story = {};

/** A decorative leading icon sized to the 14px wrapper, before the label that names the chip. */
export const WithIcon: Story = {
  args: { children: 'Saved', icon: <Icon name='bookmark' className='size-3.5' /> }
};

/** Off and on treatments side by side; hover with a pointer to inspect the hover tone. */
export const Pressed: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Chip>Design</Chip>
      <Chip defaultPressed={true}>Design</Chip>
      <Chip defaultPressed={true} icon={<Icon name='bookmark' className='size-3.5' />}>
        Saved
      </Chip>
    </div>
  )
};

/** Consumer state drives the pressed prop; each activation is also reported in Actions. */
export const Controlled: Story = { render: (args) => <ControlledChip {...args} /> };

/** Disabled chips keep their off or on treatment and are skipped by keyboard navigation. */
export const Disabled: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Chip disabled={true}>Design</Chip>
      <Chip disabled={true} defaultPressed={true}>
        Design
      </Chip>
    </div>
  )
};
