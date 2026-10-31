import type { Meta, StoryObj } from '@storybook/react-vite';
import { GaugeGroup } from './GaugeGroup';
import type { GaugeGroupItems } from './types';

/** Independent measurements share only a decorative diagram, not a total or condition. */
const meta: Meta<typeof GaugeGroup> = {
  title: 'Molecules/GaugeGroup',
  component: GaugeGroup,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof GaugeGroup>;

const pair: GaugeGroupItems = [
  { label: 'Session quota', value: 42.5 },
  { label: 'Weekly quota', value: 18 }
];
const three: GaugeGroupItems = [
  { label: 'Session quota', value: 42.5 },
  { label: 'Daily quota', value: 65 },
  { label: 'Weekly quota', value: 18 }
];

/** Required inputs only; all optional defaults remain untouched. */
export const Default: Story = { args: { label: 'Usage limits', items: pair } };
/** Three independent slots keep outer-to-inner reading order. */
export const ThreeRings: Story = { args: { label: 'Usage limits', items: three } };
/** Finite endpoints and overflow clamp independently. */
export const ValueLimits: Story = {
  args: {
    label: 'Usage limits',
    items: [
      { label: 'Empty', value: -1 },
      { label: 'Full', value: 101 }
    ]
  }
};
/** Decimal values remain visible and unrounded. */
export const DecimalValue: Story = { args: { label: 'Usage limits', items: pair } };
/** Consumer-selected states have independent visible descriptions. */
export const Conditions: Story = {
  args: {
    label: 'Usage limits',
    items: [
      { label: 'Session quota', value: 42, state: 'warning', stateText: 'Review session' },
      { label: 'Daily quota', value: 42, state: 'critical', stateText: 'Review daily limit' },
      { label: 'Weekly quota', value: 42, state: 'muted', stateText: 'Reference only' }
    ]
  }
};
/** An unavailable reading keeps its slot and visible fallback. */
export const MixedUnavailable: Story = {
  args: { label: 'Usage limits', items: [three[0], { label: 'Daily quota', value: NaN }, three[2]] }
};
/** No fabricated zero, arc or center is shown when all readings are unavailable. */
export const AllUnavailable: Story = {
  args: {
    label: 'Usage limits',
    items: [
      { label: 'Session quota', value: NaN },
      { label: 'Weekly quota', value: Infinity }
    ],
    center: 'OK'
  }
};
/** Presets change diagram diameter, not the reading list. */
export const Sizes: Story = {
  args: { label: 'Usage limits', items: three },
  render: (args) => (
    <div className='flex flex-wrap gap-4'>
      <GaugeGroup {...args} size='sm' />
      <GaugeGroup {...args} size='md' />
      <GaugeGroup {...args} size='lg' />
    </div>
  )
};
/** Center content is decorative and has an equivalent in the readings. */
export const CenterContent: Story = { args: { label: 'Usage limits', items: pair, center: '42.5' } };
/** Transparent diagram frames reveal their actual host. */
export const TransparentHosts: Story = {
  args: { label: 'Usage limits', items: pair },
  render: (args) => (
    <div className='flex flex-wrap gap-4'>
      <div className='bg-surface-1 p-4'>
        <GaugeGroup {...args} />
      </div>
      <div className='bg-surface-2 p-4'>
        <GaugeGroup {...args} />
      </div>
    </div>
  )
};
/** Equal values do not imply shared meaning or condition. */
export const IndependentReadings: Story = {
  args: {
    label: 'Independent readings',
    items: [
      { label: 'First quota', value: 50 },
      { label: 'Second quota', value: 50, state: 'warning', stateText: 'Review second quota' }
    ]
  }
};
/** Constrained hosts retain a visible reading list. */
export const Narrow: Story = {
  args: { label: 'Usage limits', items: three },
  render: (args) => (
    <div className='w-40'>
      <GaugeGroup {...args} />
    </div>
  )
};
/** Long reading labels and descriptions remain outside the diagram. */
export const LongLabels: Story = {
  args: {
    label: 'Provider usage limits',
    items: [
      {
        label: 'Session quota for the current reporting period',
        value: 42,
        state: 'warning',
        stateText: 'Review the current session usage'
      },
      { label: 'Weekly quota for the current reporting period', value: 18 }
    ]
  }
};
