import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { Indicator } from './Indicator';

/**
 * ## Description
 * A passive supplementary dot, count or origin glyph anchored to direct consumer content.
 *
 * ## Dependencies
 * Icon supplies the closed system glyph set. Button provides real consumer controls in examples.
 *
 * ## Usage guidelines
 * Put actual count/network meaning in child text or its accessible name. The marker never
 * announces changes. Physical corners do not flip in RTL; consumers own surrounding clearance,
 * valid div placement and ancestor overflow. className supports outer layout, not marker paint.
 */
const meta: Meta<typeof Indicator> = {
  title: 'Atoms/Indicator',
  component: Indicator,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Indicator>;

/** Required anchor content only: danger sm dot at the physical top-right, with no default overrides. */
export const Default: Story = {
  args: { children: <Button aria-label='Inbox, new messages available'>Inbox</Button> }
};

/** Dot, capped total and origin glyph share geometry, not accessible meaning or a status lifecycle. */
export const Branches: Story = {
  args: { children: <Button>Inbox</Button> },
  render: () => (
    <div className='flex flex-wrap items-center gap-8 p-8'>
      <Indicator>
        <Button aria-label='Inbox, new messages available'>Inbox</Button>
      </Indicator>
      <Indicator variant='count' count={120}>
        <Button aria-label='Inbox, 120 unread messages'>Inbox</Button>
      </Indicator>
      <Indicator variant='icon' badgeIcon='linkedin' tone='neutral'>
        <Button aria-label='Profile on LinkedIn'>Profile</Button>
      </Indicator>
    </div>
  )
};

/** Marker presets are independent of the consumer control dimensions. */
export const Sizes: Story = {
  args: { variant: 'count', count: 120, children: <Button aria-label='Inbox, 120 unread messages'>Inbox</Button> },
  render: (args) => (
    <div className='flex flex-wrap items-center gap-8 p-8'>
      <Indicator {...args} size='sm' />
      <Indicator {...args} size='md' />
    </div>
  )
};

/** Physical corners keep the same sides in both text directions; host padding supplies clearance. */
export const Corners: Story = {
  args: { children: <Button>Inbox</Button> },
  render: () => (
    <div className='flex flex-col gap-8 p-8'>
      {(['ltr', 'rtl'] as const).map((dir) => (
        <div key={dir} dir={dir} className='flex flex-wrap gap-8'>
          {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((position) => (
            <Indicator key={position} position={position} dir={dir}>
              <Button>
                {position} ({dir})
              </Button>
            </Indicator>
          ))}
        </div>
      ))}
    </div>
  )
};

/** Readable consumer labels accompany all six supplementary tone families. */
export const Tones: Story = {
  args: { children: <Button>Inbox</Button> },
  render: () => (
    <div className='flex flex-wrap gap-8 p-8'>
      {(['neutral', 'info', 'success', 'warning', 'danger', 'brand'] as const).map((tone) => (
        <Indicator key={tone} tone={tone}>
          <Button>{tone}</Button>
        </Indicator>
      ))}
    </div>
  )
};

/** Counts use ASCII totals through the threshold, cap above it, and remove only the zero marker. */
export const Counts: Story = {
  args: { variant: 'count', count: 100, children: <Button aria-label='Inbox, 100 unread messages'>Inbox</Button> },
  render: () => (
    <div className='flex flex-wrap gap-8 p-8'>
      {[0, 1, 99, 100].map((count) => (
        <Indicator key={count} variant='count' count={count}>
          <Button aria-label={`Inbox, ${count} unread messages`}>Inbox ({count})</Button>
        </Indicator>
      ))}
      <Indicator variant='count' count={10} max={9}>
        <Button aria-label='Tasks, 10 remaining'>Tasks</Button>
      </Indicator>
    </div>
  )
};

/** Invalid totals suppress decoration without discarding the anchor or coercing the data. */
export const InvalidCounts: Story = {
  args: { variant: 'count', count: NaN, children: <Button>Reading unavailable</Button> },
  render: () => (
    <div className='flex flex-wrap gap-8 p-8'>
      <Indicator variant='count' count={NaN}>
        <Button>Unavailable total</Button>
      </Indicator>
      <Indicator variant='count' count={1.5}>
        <Button>Fractional total</Button>
      </Indicator>
      <Indicator variant='count' count={Number.MAX_SAFE_INTEGER + 1}>
        <Button>Unsafe total</Button>
      </Indicator>
    </div>
  )
};

/** The original Button retains keyboard, focus and disabled behavior; Indicator adds no handler or live region. */
export const OnButton: Story = {
  args: { variant: 'count', count: 120, children: <Button aria-label='Inbox, 120 unread messages'>Inbox</Button> },
  render: (args) => (
    <div className='flex flex-wrap gap-8 p-8'>
      <Indicator {...args} />
      <Indicator variant='count' count={120}>
        <Button disabled={true} aria-label='Inbox, 120 unread messages'>
          Inbox
        </Button>
      </Indicator>
    </div>
  )
};

/** Large chosen thresholds allow long decimal text; review actual text zoom and neighboring host clearance separately. */
export const LongCount: Story = {
  args: {
    variant: 'count',
    count: Number.MAX_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER,
    children: <Button aria-label='Archive, 9007199254740991 items'>Archive</Button>
  },
  render: (args) => (
    <div className='flex flex-wrap justify-center p-8'>
      <Indicator {...args} />
    </div>
  )
};
