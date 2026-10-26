import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Surface } from '../../primitives/surface';
import { ProgressBar } from './ProgressBar';

/**
 * ## Description
 * One horizontal bar that shows how far a bounded task or sequence has advanced: scroll
 * position, a step in a slider, remaining alert time, live goals and comparison series.
 * Use Gauge for arbitrary magnitudes and Spinner for indeterminate activity.
 *
 * ## Dependencies
 * Radix Progress (`@radix-ui/react-progress`) supplies the progressbar role, the
 * aria-value attributes and data-state. No stylesheet is required.
 *
 * ## Usage guidelines
 * value is a percentage: finite values clamp to 0–100, non-finite values are indeterminate
 * with an empty fill and no animation. Supply label to announce the bar; without it the bar
 * is decorative and the progress must be readable as text (for example "03/12"). Width comes
 * from the container; className supports outer layout only. edge needs a positioned,
 * overflow-clipping container and only exists with the sm size. Reduced-motion preferences
 * remove the fill transition.
 */
const meta: Meta<typeof ProgressBar> = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='w-80'>
        <Story />
      </div>
    )
  ]
};

export default meta;
type Story = StoryObj<typeof ProgressBar>;

/** Announced 2px hairline bar at 45%. */
export const Default: Story = {
  args: { label: 'Upload progress', value: 45 }
};

/** Decorative bar without a label: the visible counter carries the progress as text. */
export const Decorative: Story = {
  render: () => (
    <div className='flex items-center gap-3 font-sans text-label-default text-fg-muted'>
      <span>03/12</span>
      <ProgressBar value={25} />
    </div>
  )
};

/** Values 10, 45 and 100 (complete), as on the Foundation board. */
export const Values: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <ProgressBar label='Ten percent' value={10} />
      <ProgressBar label='Forty-five percent' value={45} />
      <ProgressBar label='Complete' value={100} />
    </div>
  )
};

/** sm hairline bar versus the lg goal bar: a Material well with the gradient fill and token bevel. */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <ProgressBar label='Hairline' value={37} />
      <ProgressBar size='lg' label='Subscriber goal' value={37} valueText='37 of 100 subscribers' />
      <ProgressBar size='lg' label='Goal reached' value={100} />
    </div>
  )
};

/** Muted comparison series next to the default series, in both sizes. */
export const Muted: Story = {
  render: () => (
    <div className='flex flex-col gap-4'>
      <ProgressBar label='This week' value={80} />
      <ProgressBar variant='muted' label='Last week' value={60} />
      <ProgressBar size='lg' variant='muted' label='Previous goal' value={45} />
    </div>
  )
};

/** Edge strip pinned to the bottom of a positioned, overflow-clipping pill, as in SectionNav. */
export const Edge: Story = {
  render: () => (
    <Surface
      radius='full'
      padding='sm'
      className='relative inline-flex overflow-hidden px-4 font-sans text-label-default'
    >
      03 Think
      <ProgressBar edge={true} label='Section progress' value={40} />
    </Surface>
  )
};

function ValueTransitionDemo() {
  const [value, setValue] = useState(30);
  return (
    <div className='flex flex-col gap-4'>
      <ProgressBar label='Scroll progress' value={value} />
      <input
        type='range'
        min={0}
        max={100}
        value={value}
        aria-label='Progress value'
        onChange={(event) => setValue(Number(event.target.value))}
      />
    </div>
  );
}

/** Value changes transition the fill with the motion tokens; instant under reduced motion. */
export const ValueTransition: Story = {
  render: () => <ValueTransitionDemo />
};

/** A non-finite value is indeterminate: no aria-valuenow and an empty, static fill. */
export const Indeterminate: Story = {
  args: { label: 'Waiting for data', value: Number.NaN }
};
