/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import diagnostic from '../../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url';
import { Button } from '../../atoms/button';
import { Countdown } from '../../atoms/countdown';
import { Link } from '../../atoms/link';
import { PhotoFrame } from '../../atoms/photo-frame';
import { ListItem, ListItemBody, ListItemTitle } from '../../molecules/list-item';
import { SectionShell } from '../../templates/section-shell';
import { LiveBandField, LiveBandList, LiveBandRow, LiveBandRows, LiveBandStreams, LiveBandVod } from './index';

/** The host owns the named flood section, event data and recording links. */
const meta = { title: 'Organisms/LiveBand', component: LiveBandField, tags: ['autodocs'] } satisfies Meta<
  typeof LiveBandField
>;
export default meta;
type Story = StoryObj<typeof meta>;
const field = (
  <>
    <div>
      <h2>Next live event</h2>
      <p>Join the conversation.</p>
      <Countdown
        deadline={4102444800000}
        deadlineText='January 1, 2100 UTC'
        label='Next event'
        units={['days', 'hours', 'minutes', 'seconds']}
      />
      <Button variant='dark' asChild={true}>
        <Link href='#event'>Join event</Link>
      </Button>
    </div>
    <PhotoFrame src={diagnostic} alt='Diagnostic grid' variant='framed' ratio='landscape' />
  </>
);
const streams = (
  <LiveBandStreams>
    <LiveBandVod href='#recording'>
      <div className='relative aspect-16/9 overflow-hidden rounded-lg bg-surface-0 shadow-well'>
        <span className='absolute top-4 left-4'>Featured recording</span>
        <span className='absolute top-4 right-4 bg-surface-1 text-fg-default rounded-sm px-2 py-1 font-display text-meta'>
          30 minutes
        </span>
        <span
          aria-hidden='true'
          className='absolute bottom-4 right-4 bg-action-primary-solid-bg text-action-primary-solid-fg rounded-full size-16'
        >
          <svg viewBox='0 0 64 64' aria-hidden='true' focusable='false'>
            <path d='M26 19v26l20-13z' fill='currentColor' />
          </svg>
        </span>
        <span className='absolute bottom-4 left-4 right-24'>Building together</span>
      </div>
      <span className='block px-4 py-3'>
        Recorded <time dateTime='2026-01-01'>January 1, 2026</time>
      </span>
    </LiveBandVod>
    <LiveBandList>
      <h2>Past streams</h2>
      <LiveBandRows>
        <LiveBandRow>
          <ListItem variant='editorial-divided' asChild={true}>
            <Link href='#past'>
              <ListItemBody>
                <ListItemTitle>First stream</ListItemTitle>
                <time dateTime='2026-01-01'>January 1, 2026</time>
                <span>40 minutes</span>
              </ListItemBody>
            </Link>
          </ListItem>
        </LiveBandRow>
      </LiveBandRows>
      <Link href='#archive'>All recordings</Link>
    </LiveBandList>
  </LiveBandStreams>
);
/** Full host composition with a single flood wrapper. */
export const Default: Story = {
  args: { children: field },
  render: (args) => (
    <>
      <SectionShell register='flood' aria-label='Upcoming event'>
        <LiveBandField {...args} />
      </SectionShell>
      <SectionShell aria-label='Recordings'>{streams}</SectionShell>
    </>
  )
};
/** Field without archive. */
export const FieldOnly: Story = { args: { children: field } };
/** Recordings remain independently placeable. */
export const StreamsOnly: Story = { args: { children: field }, render: () => streams };
/** Empty rows leave the heading and archive. */
export const EmptyRows: Story = {
  args: {
    children: (
      <LiveBandList>
        <h2>Past streams</h2>
        <LiveBandRows>{[]}</LiveBandRows>
        <Link href='#archive'>All recordings</Link>
      </LiveBandList>
    )
  }
};
/** A future event with localized deadline. */
export const Running: Story = {
  args: { children: <Countdown deadline={4102444800000} deadlineText='January 1, 2100 UTC' label='Next event' /> }
};
/** A completed event. */
export const Expired: Story = {
  args: { children: <Countdown deadline={0} deadlineText='January 1, 1970 UTC' label='Next event' /> }
};
/** Invalid deadlines use the delivered fallback. */
export const Unavailable: Story = {
  args: { children: <Countdown deadline={Number.NaN} deadlineText='Unavailable' label='Next event' /> }
};
/** Inspect both viewport boundaries. */
export const Responsive: Story = { ...Default };
/** Long host copy remains in normal document flow. */
export const LongContent: Story = {
  args: {
    children: (
      <>
        <p>
          A long event description that can wrap across several lines when the host is narrow and the grid becomes a
          single column.
        </p>
        <PhotoFrame src={diagnostic} alt='Diagnostic grid' variant='framed' ratio='landscape' />
      </>
    )
  },
  render: (args) => (
    <>
      <LiveBandField {...args} />
      <LiveBandStreams>
        <LiveBandVod href='#long-recording'>
          <div className='relative aspect-16/9 overflow-hidden rounded-lg bg-surface-0 shadow-well'>
            <span className='absolute top-4 left-4'>Featured</span>
            <span className='absolute top-4 right-4 bg-surface-1 text-fg-default rounded-sm px-2 py-1 font-display text-meta'>
              2 hours 30 minutes
            </span>
            <span
              aria-hidden='true'
              className='absolute bottom-4 right-4 bg-action-primary-solid-bg text-action-primary-solid-fg rounded-full size-16'
            >
              <svg viewBox='0 0 64 64' aria-hidden='true' focusable='false'>
                <path d='M26 19v26l20-13z' fill='currentColor' />
              </svg>
            </span>
            <span className='absolute bottom-4 left-4 right-24'>
              A deliberately long recording title that exercises overlap and clipping in a narrow localized host
            </span>
          </div>
          <time className='block px-4 py-3' dateTime='2026-01-01'>
            January 1, 2026
          </time>
        </LiveBandVod>
        <LiveBandList>
          <h2>Past streams</h2>
          <LiveBandRows>{[]}</LiveBandRows>
          <Link href='#archive'>All recordings</Link>
        </LiveBandList>
      </LiveBandStreams>
    </>
  )
};
/** Native links retain keyboard operation. */
export const Keyboard: Story = { ...Default };
/** Inspect photo motion with the browser reduced-motion preference. */
export const ReducedMotion: Story = { ...Default };
