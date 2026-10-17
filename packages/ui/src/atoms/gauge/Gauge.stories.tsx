import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gauge } from './Gauge';

/**
 * ## Description
 * A passive circular meter for a magnitude normalized to 0–100, not task progress.
 *
 * The decorative circular frame is transparent; the unfilled track blends with the host background.
 *
 * ## Usage guidelines
 * Consumers choose states independently of values and provide visible stateText outside normal.
 * Centers must be decorative and non-interactive; put their meaning in label or valueText.
 * className supports outer margin/alignment only, not appearance overrides.
 */
const meta: Meta<typeof Gauge> = {
  title: 'Atoms/Gauge',
  component: Gauge,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Gauge>;

/** Uses only the required accessible name and measurement, preserving every component default. */
export const Default: Story = {
  args: { label: 'Capacity', value: 42 }
};

/** Empty/full endpoints and finite overflow use the same clamped geometry and accessible value. */
export const ValueLimits: Story = {
  args: { label: 'Capacity', value: 0 },
  render: (args) => (
    <div className='flex flex-wrap items-start gap-4'>
      <Gauge {...args} label='Empty capacity' value={0} />
      <Gauge {...args} label='Full capacity' value={100} />
      <Gauge {...args} label='Capacity below range' value={-1} />
      <Gauge {...args} label='Capacity above range' value={101} />
    </div>
  )
};

/** Fractional measurements remain decimal in both the arc and the accessible text equivalent. */
export const DecimalValue: Story = {
  args: { label: 'Capacity', value: 42.5, center: 42.5 }
};

/** Identical values show consumer-selected conditions, with visible text/icon cues rather than thresholds. */
export const States: Story = {
  args: { label: 'Capacity', value: 42 },
  render: (args) => (
    <div className='flex flex-wrap items-start gap-4'>
      <Gauge {...args} label='Normal capacity' state='normal' stateText='Within expected range' />
      <Gauge {...args} label='Warning capacity' state='warning' stateText='Review capacity' />
      <Gauge {...args} label='Critical capacity' state='critical' stateText='Capacity needs attention' />
      <Gauge {...args} label='Muted capacity' state='muted' stateText='Reference measurement' />
    </div>
  )
};

/** Absent, icon, numeric and short-text centers are decorative; equivalents belong to meter semantics. */
export const CenterContent: Story = {
  args: { label: 'Capacity', value: 42 },
  render: (args) => (
    <div className='flex flex-wrap items-start gap-4'>
      <Gauge {...args} label='Capacity without center' />
      <Gauge
        {...args}
        label='Capacity within expected range'
        center={
          <svg
            className='h-[var(--space-4)] w-[var(--space-4)]'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            aria-hidden='true'
            focusable='false'
          >
            <path d='M4 12l5 5L20 6' />
          </svg>
        }
      />
      <Gauge {...args} label='Capacity with numeric center' center={args.value} />
      <Gauge {...args} label='Capacity within expected range' center='OK' />
    </div>
  )
};

/** A consumer-supplied equivalent preserves the decimal while expressing its domain units. */
export const ContextualValue: Story = {
  args: { label: 'Storage capacity', value: 42.5, valueText: '42.5 of 100 capacity units' }
};

/** Non-finite inputs show readable fallback text, never a zero meter, center or condition cue. */
export const InvalidValue: Story = {
  args: { label: 'Capacity', value: Number.NaN },
  render: (args) => (
    <div className='flex flex-wrap items-start gap-4'>
      <Gauge {...args} label='Unknown capacity' value={Number.NaN} />
      <Gauge {...args} label='Disconnected sensor' value={Infinity} unavailableText='Sensor offline' />
      <Gauge
        {...args}
        label='Invalid sensor reading'
        value={-Infinity}
        state='critical'
        stateText='Review reading'
        center='!'
      />
    </div>
  )
};

/** Presets measure 40/56/80px; custom 64.5px stays fractional, while invalid size 0 falls back to 56px. */
export const Sizes: Story = {
  args: { label: 'Capacity', value: 42 },
  render: (args) => (
    <div className='flex flex-wrap items-start gap-4'>
      <Gauge {...args} label='Small capacity meter, 40 pixels' size='sm' />
      <Gauge {...args} label='Medium capacity meter, 56 pixels' size='md' />
      <Gauge {...args} label='Large capacity meter, 80 pixels' size='lg' />
      <Gauge {...args} label='Custom capacity meter, 64.5 pixels' size={64.5} />
      <Gauge {...args} label='Invalid diameter falls back to 56 pixels' size={0} />
    </div>
  )
};
