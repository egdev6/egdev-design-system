import type { Meta, StoryObj } from '@storybook/react-vite';
import { Indicator } from '../indicator/Indicator';
import { Avatar } from './Avatar';

/**
 * ## Description
 * A passive user or channel identity: a photo when loaded, otherwise a user glyph on the brand disc.
 *
 * ## Dependencies
 * Radix Avatar owns image loading and fallback swapping; Icon supplies decorative system glyphs.
 *
 * ## Usage guidelines
 * Omit label beside an equivalent visible name. Include network and paused meaning in label or
 * adjacent text. Origin or network glyphs compose the public Indicator wrapper around the Avatar,
 * not a badge prop. Root className supports outer margin/alignment and a token-valued
 * --eg-avatar-ring, not appearance overrides. Avatar has no ref or asChild: wrap it inside the
 * consumer's trigger.
 */
const meta: Meta<typeof Avatar> = {
  title: 'Atoms/Avatar',
  component: Avatar,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Avatar>;

/** Named fallback using the default md size without replacing optional runtime defaults. */
export const Default: Story = { args: { label: 'Example channel' } };

/** Every approved disc and fallback-glyph size, including the compact sm and larger xl. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      {(['sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Avatar key={size} size={size} label={`Example channel, ${size}`} />
      ))}
    </div>
  )
};

/** A self-contained image fixture exercises loaded media without a network dependency. */
export const WithImage: Story = {
  args: {
    label: 'Example illustrated channel',
    src: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 64"%3E%3Cpath d="M0 0h96v64H0z"/%3E%3Ccircle cx="48" cy="32" r="20" fill="white"/%3E%3C/svg%3E'
  }
};

/** Invalid image bytes keep Radix's immediate user fallback visible. */
export const BrokenImage: Story = { args: { label: 'Unavailable channel image', src: 'data:image/png,invalid' } };

/** Replaces the removed badgeIcon prop: the public Indicator wrapper supplies the corner glyph. */
export const WithIndicator: Story = {
  render: () => (
    <div className='flex items-center gap-6 p-4'>
      <Indicator variant='icon' badgeIcon='linkedin' tone='neutral' position='bottom-right'>
        <Avatar size='lg' label='Example channel on LinkedIn' className='[--eg-avatar-ring:var(--color-bg-canvas)]' />
      </Indicator>
      <Indicator variant='icon' badgeIcon='youtube' tone='neutral' position='bottom-right'>
        <Avatar size='xl' label='Example channel on YouTube' className='[--eg-avatar-ring:var(--color-bg-canvas)]' />
      </Indicator>
    </div>
  )
};

/** The accessible label includes paused meaning rather than relying only on de-emphasis. */
export const Paused: Story = { args: { label: 'Example channel on LinkedIn, paused', paused: true } };

/** Adjacent text supplies the name; the whole avatar stays decorative. */
export const Decorative: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <Avatar />
      <span>Example channel on YouTube</span>
    </div>
  )
};
