import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';

/**
 * ## Description
 * Decorative placeholder that reserves approximate space for unavailable content.
 *
 * ## Dependencies
 * No Radix primitive exists for this passive shape; it is a static token-backed silhouette.
 *
 * ## Usage guidelines
 * Mount placeholders for unavailable content and replace them with real content.
 * Communicate loading once at the host level, e.g. a status message outside a labelled
 * aria-busy region, then clear busy when ready or on error. Never wrap already available
 * interactive content. Height and circle dimensions are preset-owned; className may add
 * outer margins, placement and token-backed/static percentage widths on line/block.
 * Static by design: no pulse, shimmer or timing.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Primitives/Skeleton',
  component: Skeleton,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

/** Default line at md size, filling the available width. */
export const Default: Story = {};

/** Every silhouette at each token preset. */
export const VariantsAndSizes: Story = {
  render: () => (
    <>
      {(['line', 'block'] as const).map((variant) => (
        <div key={variant} className='flex flex-col gap-3'>
          {(['sm', 'md', 'lg'] as const).map((size) => (
            <Skeleton key={size} variant={variant} size={size} />
          ))}
        </div>
      ))}
      <div className='flex items-center gap-6'>
        {(['sm', 'md', 'lg'] as const).map((size) => (
          <Skeleton key={size} variant='circle' size={size} />
        ))}
      </div>
    </>
  )
};

/** Staggered line widths arranged by the consumer layout. */
export const ShortLines: Story = {
  render: () => (
    <div className='flex flex-col gap-3'>
      <Skeleton />
      <Skeleton className='w-3/4' />
      <Skeleton className='w-1/2' />
    </div>
  )
};

/**
 * Host-owned loading state. This inline host is a demo pending the future Surface primitive
 * (#106); it reproduces the approved specimen tokens and is not an extractable recipe.
 */
export const InLoadingCard: Story = {
  render: () => (
    <>
      <p role='status'>Loading account details</p>
      {/* Material v2 edge plus elevation in the documented order (docs/MATERIAL.md:52). */}
      <article
        aria-busy='true'
        className='flex flex-col gap-4 p-6 border border-border-hairline rounded-xl bg-[image:var(--gradient-sheen)] bg-surface-1 shadow-[var(--shadow-edge),var(--shadow-elev-1)]'
      >
        <div className='flex items-center gap-4'>
          <Skeleton variant='circle' size='md' />
          <div className='flex w-full min-w-0 flex-col gap-3'>
            <Skeleton className='w-3/4' size='lg' />
            <Skeleton className='w-1/2' size='sm' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton />
          <Skeleton className='w-3/4' />
        </div>
        <Skeleton variant='block' />
      </article>
    </>
  )
};

/** No animated presentation exists; the placeholder stays static. */
export const StaticReducedMotion: Story = {
  render: () => (
    <div className='flex flex-col gap-3'>
      <Skeleton />
      <Skeleton variant='block' size='sm' />
    </div>
  )
};

/** Consumer placement through supported outer-margin/alignment hooks. */
export const ConsumerLayout: Story = {
  render: () => (
    <div className='grid grid-cols-3 items-center gap-6'>
      <Skeleton />
      <Skeleton className='col-span-2 mt-2' variant='block' size='sm' />
      <Skeleton className='justify-self-center' variant='circle' size='sm' />
    </div>
  )
};
