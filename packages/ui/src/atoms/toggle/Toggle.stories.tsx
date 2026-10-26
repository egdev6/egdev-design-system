import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Icon } from '../icon';
import { Toggle } from './Toggle';
import type { ToggleProps } from './types';

function ControlledToggle(props: ToggleProps) {
  const [pressed, setPressed] = useState(false);
  return (
    <Toggle
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
 * A persistent on/off button for conditions such as pinning or showing a layer.
 *
 * ## Dependencies
 * Radix Toggle owns keyboard, focus and pressed state. AccessibleIcon names icon-only
 * content; examples use the system Icon atom for decorative glyphs.
 *
 * ## Usage guidelines
 * Keep the name constant while toggling. Use Switch for form settings and separate actions
 * for one-shot operations. sm is for dense desktop layouts; use lg for 44px touch targets.
 * className supports outer layout only, not appearance overrides. No stylesheet.
 */
const meta = {
  title: 'Atoms/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  args: { children: 'Show grid', onPressedChange: action('onPressedChange') }
} satisfies Meta<typeof Toggle>;
export default meta;
type Story = StoryObj<typeof Toggle>;

/** Required text content only; runtime size and uncontrolled state defaults are preserved. */
export const Default: Story = {};

/** A leading decorative glyph supplements a constant visible condition name. */
export const WithText: Story = { args: { children: 'Pin', icon: <Icon name='bookmark' /> } };

/** A square toggle keeps its accessible name even though the visible content is only a glyph. */
export const IconOnly: Story = {
  args: { children: undefined, label: 'Pin', icon: <Icon name='bookmark' /> }
};

/** Initializes the uncontrolled selected treatment, without coordinating a group. */
export const DefaultPressed: Story = { args: { defaultPressed: true } };

/** Consumer state drives the pressed prop; activation is also reported in Actions. */
export const Controlled: Story = { render: (args) => <ControlledToggle {...args} /> };

/** Text and icon-only geometry at each approved preset size. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <div key={size} className='flex items-center gap-2'>
          <Toggle size={size}>Pin</Toggle>
          <Toggle size={size} label='Pin' icon={<Icon name='bookmark' />} />
        </div>
      ))}
    </div>
  )
};

/** Disabled controls retain both off and on appearance and are skipped by keyboard navigation. */
export const Disabled: Story = {
  render: () => (
    <div className='flex gap-3'>
      <Toggle disabled={true}>Show grid</Toggle>
      <Toggle disabled={true} defaultPressed={true}>
        Show grid
      </Toggle>
    </div>
  )
};

/** Off and selected treatments; use pointer hover and keyboard focus to inspect their real states. */
export const States: Story = {
  render: () => (
    <div className='flex gap-3'>
      <Toggle label='Pin' icon={<Icon name='bookmark' />} />
      <Toggle defaultPressed={true} label='Pin' icon={<Icon name='bookmark' />} />
      <Toggle>Show grid</Toggle>
      <Toggle defaultPressed={true}>Show grid</Toggle>
    </div>
  )
};
