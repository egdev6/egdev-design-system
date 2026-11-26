import type { Meta, StoryObj } from '@storybook/react-vite';
import { Cluster, Stack } from '../../primitives/stack';
import { Surface } from '../../primitives/surface';
import { Text } from '../../primitives/text';
import { StepMeter } from './StepMeter';

/**
 * ## Description
 * A passive, informative image of a coarse level: a short row of skewed steps, filled from the inline start and
 * empty afterwards, named in words by the consumer (for example "High progress"). It is not a measurement, a
 * percentage, an input, a rating or a live region.
 *
 * ## Usage guidelines
 * label is the only accessible name and is never rendered visibly: state the level in words so it stands alone when a
 * screen reader reaches it, and keep it coherent with value. The consumer owns the level, the wording and any
 * announcement when the level changes; the component never announces. A blank label or a non-finite value renders
 * nothing and warns in development. className supports outer placement only. For a true measurement use Gauge,
 * ProgressBar or MeterRow instead.
 */
const meta: Meta<typeof StepMeter> = {
  title: 'Atoms/StepMeter',
  component: StepMeter,
  tags: ['autodocs'],
  args: { label: 'High progress', value: 3 }
};
export default meta;
type Story = StoryObj<typeof StepMeter>;

const levels = [
  { label: 'No progress', value: 0 },
  { label: 'Low progress', value: 1 },
  { label: 'Medium progress', value: 2 },
  { label: 'High progress', value: 3 },
  { label: 'Full progress', value: 4 }
];

const scales = [
  { label: 'One of one step', value: 1, steps: 1 },
  { label: 'One of two steps', value: 1, steps: 2 },
  { label: 'Four of six steps', value: 4, steps: 6 },
  { label: 'Seven of ten steps', value: 7, steps: 10 }
];

const tones = ['surface-0', 'surface-1', 'surface-2', 'surface-3'] as const;

/** The default scale: only the required name and level are supplied, so Docs shows the constant steps default of 4. */
export const Default: Story = {};

/**
 * Every level of the default scale on the tone of the NowCard footer band (surface-0), each with the consumer's own
 * wording. A fractional value is floored and a value outside the scale is clamped, so the level is never overstated.
 * An invalid label or value renders nothing and warns in development. The component never announces a change: a
 * changing level needs the consumer's own live mechanism.
 */
export const Levels: Story = {
  render: () => (
    <Surface tone='surface-0' elevation={0} padding='md' radius='lg'>
      <Stack gap={3}>
        {levels.map(({ label, value }) => (
          <Cluster key={label} gap={3} alignItems='center'>
            <StepMeter label={label} value={value} />
            <Text variant='body' foreground='secondary'>
              {value} of 4
            </Text>
          </Cluster>
        ))}
      </Stack>
    </Surface>
  )
};

/** steps sets the total, from 1 to 10 whole steps; the value is clamped against it and the wording stays the consumer's. */
export const CustomSteps: Story = {
  render: () => (
    <Surface tone='surface-0' elevation={0} padding='md' radius='lg'>
      <Stack gap={3}>
        {scales.map(({ label, value, steps }) => (
          <Cluster key={label} gap={3} alignItems='center'>
            <StepMeter label={label} value={value} steps={steps} />
            <Text variant='body' foreground='secondary'>
              {steps} {steps === 1 ? 'step' : 'steps'}
            </Text>
          </Cluster>
        ))}
      </Stack>
    </Surface>
  )
};

/**
 * One meter on each tone of the Grafito ladder, from surface-0 to surface-3. The filled run is the informative
 * graphic; the empty remainder is a decorative track that is not held to a 3:1 contrast, and the level is also text
 * through the label.
 */
export const OnSurfaces: Story = {
  render: () => (
    <Cluster gap={4} alignItems='start'>
      {tones.map((tone) => (
        <Surface key={tone} tone={tone} elevation={0} padding='md' radius='lg'>
          <Stack gap={2} alignItems='start'>
            <StepMeter label={`High progress on ${tone}`} value={3} />
            <Text variant='body' foreground='muted'>
              {tone}
            </Text>
          </Stack>
        </Surface>
      ))}
    </Cluster>
  )
};
