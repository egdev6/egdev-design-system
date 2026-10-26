import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from './Surface';

/**
 * ## Description
 * The single Material v2 box: Grafito tonal levels with a light top edge, two-layer
 * shadows and a hairline border, a recessed well, and a translucent overlay with a
 * solid fallback. Surface is static: it adds no role, focus, state or motion.
 *
 * ## Usage guidelines
 * Compose Surface for material instead of re-creating backgrounds, borders or shadows.
 * Bands are compositions: stack Surfaces such as `tone="surface-2" elevation={0} radius="none"`.
 * className supports layout only (margin, size, placement, overflow, position); tone, border,
 * shadow, background, padding and radius come from props. Brand text inside raised tones uses
 * `--color-fg-brand-raised`. `asChild` merges onto one HTMLElement child that spreads props and
 * forwards its ref; give a slotted section its own accessible name.
 */
const meta: Meta<typeof Surface> = {
  title: 'Primitives/Surface',
  component: Surface,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Surface>;

const caption = 'm-0 text-fg-secondary';
const panel = 'w-[calc(var(--space-16)*3)] max-w-full';

/** Omitting every prop preserves the surface-1, elevation 1, md padding and xl radius defaults. */
export const Default: Story = {
  args: { children: <p className='m-0'>Card content</p> }
};

/** The Grafito ladder, step by step, at the default elevation. */
export const Tones: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-start gap-6'>
      {(['surface-0', 'surface-1', 'surface-2', 'surface-3'] as const).map((tone) => (
        <Surface {...args} tone={tone} className={panel} key={tone}>
          <p className={caption}>{tone}</p>
        </Surface>
      ))}
    </div>
  )
};

/** Edge-only band, card, hover/featured and floating levels on surface-1. */
export const Elevations: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-start gap-8'>
      {([0, 1, 2, 3] as const).map((elevation) => (
        <Surface {...args} tone='surface-1' elevation={elevation} className={panel} key={elevation}>
          <p className={caption}>elevation {elevation}</p>
        </Surface>
      ))}
    </div>
  )
};

/** surface-0 keeps the sheen at elevation 1–3 and drops it only at explicit elevation 0. */
export const SurfaceZeroElevations: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-start gap-8'>
      {([0, 1, 2, 3] as const).map((elevation) => (
        <Surface {...args} tone='surface-0' elevation={elevation} className={panel} key={elevation}>
          <p className={caption}>surface-0 · elevation {elevation}</p>
        </Surface>
      ))}
    </div>
  )
};

/** A recessed well inside a card: what gets filled in sinks. */
export const Well: Story = {
  args: {
    className: panel,
    children: (
      <>
        <p className='m-0 mb-3'>Card</p>
        <Surface tone='well' padding='sm' radius='md'>
          <p className={caption}>Recessed well</p>
        </Surface>
      </>
    )
  }
};

/**
 * Floating glass over busy content. Under prefers-reduced-transparency: reduce, or without
 * backdrop-filter support, it becomes solid surface-2 with no backdrop filter.
 */
export const Overlay: Story = {
  args: {
    tone: 'overlay',
    className: `relative ${panel}`,
    children: <p className={caption}>Translucent overlay</p>
  },
  decorators: [
    (Story) => (
      <div className='relative overflow-hidden rounded-xl p-8'>
        <div aria-hidden={true} className='absolute inset-0 flex'>
          {Array.from({ length: 12 }, (_, index) => (
            <span
              className={index % 2 === 0 ? 'flex-1 bg-action-primary-solid-bg' : 'flex-1 bg-surface-3'}
              key={index}
            />
          ))}
        </div>
        <Story />
      </div>
    )
  ]
};

/** The section stays the root and keeps its landmark semantics; no wrapper div. */
export const AsChild: Story = {
  render: (args) => (
    <Surface {...args} asChild={true} tone='surface-2' className={panel}>
      <section aria-labelledby='surface-as-child-title'>
        <h3 className='m-0' id='surface-as-child-title'>
          Section surface
        </h3>
        <p className={caption}>Classes and props merge onto the section.</p>
      </section>
    </Surface>
  )
};
