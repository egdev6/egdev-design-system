import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Slider } from './Slider';

/**
 * ## Description
 * Lets the user choose one number within a bounded range by dragging or with the keyboard:
 * ring size, alert thresholds or volume. The track is a Material well, the range fills with
 * the brand color and the thumb is raised.
 *
 * ## Dependencies
 * Radix Slider owns keyboard, pointer drag, the `slider` role and the hidden form input. No
 * stylesheet is required.
 *
 * ## Usage guidelines
 * `label` is the thumb's accessible name; the visible label, value readout, hint and error
 * belong to the Field molecule, which passes the same text. Use `valueText` when the number
 * alone is not meaningful (percentages, units). Use `onValueCommit` to defer expensive work
 * until the user releases the thumb. One thumb and horizontal orientation only; className
 * supports outer layout such as width and margin.
 */
const meta: Meta<typeof Slider> = {
  title: 'Atoms/Slider',
  component: Slider,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-72'>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof Slider>;

/** Uncontrolled slider starting at min (0) with the default 0–100 range. */
export const Default: Story = {
  args: { label: 'Volume' }
};

/** Consumer state drives the value; the readout stands in for the Field molecule's output. */
export const Controlled: Story = {
  args: { label: 'Ring size' },
  render: (args) => {
    const [value, setValue] = useState(40);
    return (
      <div className='flex flex-col gap-2'>
        <Slider
          {...args}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            action('onValueChange')(next);
          }}
          onValueCommit={action('onValueCommit')}
        />
        <output className='font-sans text-body-default text-fg-secondary'>{value} px</output>
      </div>
    );
  }
};

/** Custom bounds and a step of 5: keyboard and pointer snap to multiples of the step. */
export const Stepped: Story = {
  args: { label: 'Alert threshold', min: 0, max: 50, step: 5, defaultValue: 25 }
};

/** Announces a formatted value instead of the bare number. */
export const WithValueText: Story = {
  args: { label: 'Volume', defaultValue: 70, valueText: (value: number) => `${value} percent` }
};

/** Disabled: no keyboard or pointer changes, out of the Tab order and dimmed. */
export const Disabled: Story = {
  args: { label: 'Volume', defaultValue: 25, disabled: true }
};
