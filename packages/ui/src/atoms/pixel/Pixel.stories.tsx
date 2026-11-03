import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pixel } from './Pixel';

/**
 * A decorative position marker. The host supplies visible text and accessible meaning;
 * Pixel is neither a control nor a meter. Use className only for outer placement.
 * The token-scaled shape is smaller than the legacy marker and has no glow.
 */
const meta: Meta<typeof Pixel> = {
  title: 'Atoms/Pixel',
  component: Pixel,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Pixel>;

/** The default idle marker. */
export const Default: Story = {};

/** The three consumer-selected position states. */
export const AllStates: Story = {
  render: () => (
    <div className='flex gap-3'>
      <span>
        <Pixel /> Idle
      </span>
      <span>
        <Pixel state='past' /> Past
      </span>
      <span>
        <Pixel state='active' /> Active
      </span>
    </div>
  )
};

/** Adjacent text conveys the meaning independently of the marker. */
export const WithText: Story = {
  render: () => (
    <span>
      <Pixel state='active' /> Current section
    </span>
  )
};

/** The navigation link owns its current state and keyboard interaction. */
export const Navigation: Story = {
  render: () => (
    <nav aria-label='Sections'>
      <a href='#overview' aria-current='page'>
        <Pixel state='active' /> Overview
      </a>{' '}
      <a href='#details'>
        <Pixel /> Details
      </a>
    </nav>
  )
};

/** The host meter owns the accessible name and value. */
export const LabelledMeter: Story = {
  render: () => (
    <div role='meter' aria-label='Progress' aria-valuemin={0} aria-valuemax={3} aria-valuenow={2}>
      <Pixel state='past' /> <Pixel state='active' /> <Pixel /> 2 of 3
    </div>
  )
};
