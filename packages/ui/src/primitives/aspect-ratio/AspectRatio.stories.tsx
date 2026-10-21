import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { AspectRatio } from './AspectRatio';

/**
 * ## Description
 * Reserves width-to-height proportions using Radix geometry, without paint or clipping.
 * Visible wells in these examples are illustrative consumer content, not primitive styling.
 *
 * ## Usage guidelines
 * Put width constraints, margins and grid/flex placement on a parent wrapper.
 * The ref, native attributes and className target the inner div, not the private spacer.
 * className supports child alignment only; geometry overrides, paint and clipping are unsupported.
 * Consumers own media alt text, titles, captions, object-fit and any approved Material recipe.
 * No asChild, selection, loading state or ratio-change event is exposed.
 */
const meta: Meta<typeof AspectRatio> = {
  title: 'Primitives/AspectRatio',
  component: AspectRatio,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof AspectRatio>;

const bounded: Decorator = (Story) => (
  <div className='w-[calc(var(--space-16)*3)] max-w-full'>
    <Story />
  </div>
);

const well =
  'grid h-full w-full place-items-center rounded-md border border-border-control bg-surface-0 shadow-well text-fg-muted';

/** Omitting ratio preserves the square default; the visible well belongs to the child. */
export const Default: Story = {
  decorators: [bounded],
  args: { children: <div className={well}>Square</div> }
};

/** Empty content still reserves height; the caption sits outside the unpainted region. */
export const Empty: Story = {
  decorators: [bounded],
  render: (args) => (
    <>
      <AspectRatio {...args} />
      <p className='m-0 text-fg-muted'>The empty square above reserves space.</p>
    </>
  )
};

/** Equal-width hosts expose the approved specimen proportions, not product-format props. */
export const Ratios: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-start gap-6'>
      {[
        ['Square · 1:1', 1],
        ['Landscape · 16:9', 16 / 9],
        ['Portrait · 4:5', 4 / 5],
        ['Photo · 4:3', 4 / 3],
        ['Story · 9:16', 9 / 16],
        ['Wide · 3:1', 3],
        ['Banner · 4:1', 4]
      ].map(([label, ratio]) => (
        <div className='w-[calc(var(--space-16)*3)] max-w-full' key={label}>
          <AspectRatio {...args} ratio={Number(ratio)}>
            <div className={well}>{label}</div>
          </AspectRatio>
        </div>
      ))}
    </div>
  )
};

/** Two token-sized hosts keep 16:9 geometry; resize the viewport to see both shrink. */
export const Responsive: Story = {
  decorators: [bounded],
  args: { ratio: 16 / 9 },
  render: (args) => (
    <div className='flex flex-col items-start gap-6'>
      <div className='w-full'>
        <AspectRatio {...args}>
          <div className={well}>Full host width</div>
        </AspectRatio>
      </div>
      <div className='w-[calc(var(--space-16)*2)] max-w-full'>
        <AspectRatio {...args}>
          <div className={well}>Narrower host</div>
        </AspectRatio>
      </div>
    </div>
  )
};

/** Unrepresentable geometry falls back to a square rather than an invalid percentage. */
export const InvalidRatio: Story = {
  decorators: [bounded],
  args: { ratio: 0, children: <div className={well}>Invalid ratio → square</div> }
};

function ChangingRatioExample() {
  const [portrait, setPortrait] = useState(false);
  return (
    <div className='flex flex-col gap-4'>
      <button type='button' onClick={() => setPortrait(!portrait)}>
        Change to {portrait ? 'square' : 'portrait'}
      </button>
      <AspectRatio ratio={portrait ? 4 / 5 : 1}>
        <div className={well}>Persistent content</div>
      </AspectRatio>
    </div>
  );
}

/** Updating the rendering input changes proportions without remounting the content. */
export const ChangingRatio: Story = { decorators: [bounded], render: () => <ChangingRatioExample /> };

/** Supported inner-root alignment composes without exposing spacer layout controls. */
export const CenteredContent: Story = {
  decorators: [bounded],
  args: { ratio: 16 / 9, className: 'grid place-items-center', children: <span>Centered content</span> }
};

/** Image semantics and a focusable descendant remain consumer-owned and keyboard accessible. */
export const Media: Story = {
  decorators: [bounded],
  args: { ratio: 16 / 9 },
  render: (args) => (
    <figure className='m-0'>
      <AspectRatio {...args}>
        <div className='flex h-full flex-col items-center justify-center gap-2'>
          <img
            alt='A geometric mountain preview'
            className='h-[var(--space-10)] w-[var(--space-16)]'
            src='data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 40"%3E%3Cpath fill="currentColor" d="M0 40L24 8l16 20 8-12 16 24Z"/%3E%3C/svg%3E'
          />
          <button type='button'>Play preview</button>
        </div>
      </AspectRatio>
      <figcaption className='text-fg-muted'>The caption is outside the reserved region.</figcaption>
    </figure>
  )
};

/** A wide child visibly overflows a short region because the primitive never clips it. */
export const Overflow: Story = {
  decorators: [bounded],
  args: { ratio: 4 },
  render: (args) => (
    <AspectRatio {...args}>
      <div className='w-[calc(var(--space-16)*4)] text-fg-muted'>
        Consumer content can extend beyond the host. Add clipping only in the owning composition.
      </div>
    </AspectRatio>
  )
};
