import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '../icon';
import { Badge } from './Badge';
import type { BadgeTone } from './types';

const labels: Record<BadgeTone, string> = {
  neutral: 'Draft',
  info: 'Testing',
  success: 'Published',
  warning: 'Paused',
  danger: 'Failed',
  brand: 'Featured'
};
const tones: BadgeTone[] = ['neutral', 'info', 'success', 'warning', 'danger', 'brand'];

/**
 * ## Description
 * Static category and condition labels. The visible word carries the meaning, not color alone.
 *
 * ## Dependencies
 * WithIcon composes the public Icon API as consumer content; Badge itself has no Icon or Radix dependency.
 *
 * ## Usage guidelines
 * Supply short, non-empty text and decorative, non-focusable icon content. Changes are not announced.
 * className supports outer margin, alignment and flex layout only, not appearance overrides.
 * The host must reserve space for the non-wrapping label. No ref, asChild, selection or action API.
 */
const meta: Meta<typeof Badge> = {
  title: 'Atoms/Badge',
  component: Badge,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Badge>;

/** Required text only, retaining neutral/soft runtime defaults. */
export const Default: Story = { args: { children: 'Draft' } };

/** All six soft color families retain one pill anatomy and sentence-case label recipe. */
export const Tones: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      {tones.map((tone) => (
        <Badge key={tone} tone={tone}>
          {labels[tone]}
        </Badge>
      ))}
    </div>
  )
};

/** Solid status and brand fills use their approved black foreground and no edge shadow. */
export const Solid: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      {tones.map((tone) => (
        <Badge key={tone} tone={tone} variant='solid'>
          {labels[tone]}
        </Badge>
      ))}
    </div>
  )
};

/** Consumers size a decorative system glyph to the 14px slot; the word remains the information. */
export const WithIcon: Story = {
  args: { children: 'Published', tone: 'success', icon: <Icon name='check' className='size-3.5' /> }
};
