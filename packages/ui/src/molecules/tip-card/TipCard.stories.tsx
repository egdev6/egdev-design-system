/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import cover from '../../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url';
import { TipCard } from './TipCard';

/**
 * ## Description
 * A passive 2:3 tip poster for short technical tips, quick posts or cover cards in web views.
 * It carries a fixed-proportion cover image, an optional category badge and one mono technical
 * label that wraps below the cover on the raised Material frame.
 *
 * ## Dependencies
 * - PhotoFrame: renders the cover and reserves the 2:3 proportion through its numeric ratio.
 * - Badge (solid brand): renders the optional category word in the caption row.
 * - Surface recipes: the raised frame composes `surfaceVariants` internally.
 *
 * ## Usage guidelines
 * The poster is passive: no tab stop, no hover zoom, no active glow and no coverflow offsets;
 * moving through a collection belongs to the host (a Carousel or the documented TipsSlider
 * recipe). The 2:3 proportion is fixed by the component — consumers set the width through
 * `className`, which supports outer layout only. Labels wrap at word boundaries and are never
 * truncated; the caption sits below the cover, never over it.
 */
const meta: Meta<typeof TipCard> = {
  title: 'Molecules/TipCard',
  component: TipCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
};

export default meta;

type Story = StoryObj<typeof TipCard>;

const args = {
  title: 'Ship faster with agents',
  badge: 'Tip',
  src: cover,
  alt: 'Diagnostic grid cover of the ship-faster tip'
};

/** Required cover and label plus the solid brand category badge, preserving every default. */
export const Default: Story = { args };

/** The caption row keeps the mono label alone when no badge is supplied. */
export const WithoutBadge: Story = { args: { ...args, badge: undefined } };

/** The native heading rank changes the outline position, never the mono label typography. */
export const HeadingRanks: Story = {
  render: () => (
    <div className='flex max-w-xl flex-row flex-wrap gap-6'>
      <div className='w-56'>
        <TipCard {...args} title='Section child' level={3} />
      </div>
      <div className='w-56'>
        <TipCard {...args} title='Nested group' level={4} />
      </div>
    </div>
  )
};

/** The card fixes the 2:3 cover proportion; only the consumer-supplied width changes. */
export const Ratios: Story = {
  render: () => (
    <div className='flex max-w-3xl flex-row flex-wrap items-start gap-6'>
      <div className='w-48'>
        <TipCard {...args} title='Narrow poster' />
      </div>
      <div className='w-72'>
        <TipCard {...args} title='Wide poster' />
      </div>
    </div>
  )
};

/** The nine cover crop alignments; the crop never mirrors the image. */
export const FocalPoints: Story = {
  render: () => (
    <div className='grid max-w-4xl grid-cols-3 gap-6'>
      {(
        ['center', 'top', 'bottom', 'left', 'right', 'left-top', 'right-top', 'left-bottom', 'right-bottom'] as const
      ).map((focalPoint) => (
        <TipCard key={focalPoint} {...args} title={`Crop: ${focalPoint}`} focalPoint={focalPoint} />
      ))}
    </div>
  )
};

/** A long technical label wraps at word boundaries; it is never ellipsised or clamped. */
export const LongLabel: Story = {
  args: {
    ...args,
    title: 'A deliberately long technical label that wraps across several lines in a narrow poster'
  },
  render: (props) => (
    <div className='w-48'>
      <TipCard {...props} />
    </div>
  )
};

/** Two consumer widths keep the same reserved 2:3 cover and caption row. */
export const Widths: Story = {
  render: () => (
    <div className='flex max-w-2xl flex-row flex-wrap items-start gap-6'>
      <div className='w-48'>
        <TipCard {...args} title='Poster at 12rem' />
      </div>
      <div className='w-80'>
        <TipCard {...args} title='Poster at 20rem' />
      </div>
    </div>
  )
};
