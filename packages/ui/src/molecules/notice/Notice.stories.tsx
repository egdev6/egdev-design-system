import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Link } from '../../atoms/link';
import { Stack } from '../../primitives/stack';
import { Notice } from './Notice';

/**
 * ## Description
 * Persistent inline view-level state with a bold lead, a decorative cue and optional actions.
 *
 * ## Dependencies
 * Surface's elevated recipe supplies Material; Icon supplies the default cue. Consumers
 * compose Button or Link actions without Notice taking ownership of their interactions.
 *
 * ## Usage guidelines
 * One announcement owner per message: never nest Notice in another live region or duplicate
 * it in an announcer/Toast. Keep a truthful non-empty status mounted for later polite updates.
 * A newly inserted populated status is readable, not guaranteed to speak. Inserted blocking
 * alerts are commonly announced, but neither page-load alerts nor exactly-once speech are
 * guaranteed across browser/assistive-technology combinations. Do not move focus to announce.
 * No dismissal. At most two actions. className supports only outer margin, width and alignment.
 */
const meta: Meta<typeof Notice> = {
  title: 'Molecules/Notice',
  component: Notice,
  tags: ['autodocs'],
  args: { summary: 'Queue ready.' }
};
export default meta;
type Story = StoryObj<typeof Notice>;

/** Required summary only; preserves neutral, md, status and bell defaults. */
export const Default: Story = {};

/** The five status families, including the four VIS-01 scenarios in English. */
export const Tones: Story = {
  render: () => (
    <Stack gap={3}>
      <Notice summary='Queue ready.'>Waiting for work.</Notice>
      <Notice
        tone='info'
        summary='Simulation mode.'
        icon={<Icon name='flask' />}
        actions={
          <Button size='sm' variant='secondary' onClick={action('leave-simulation')}>
            Leave simulation
          </Button>
        }
      >
        Changes will not be published.
      </Notice>
      <Notice
        tone='warning'
        summary='Queue paused.'
        icon={<Icon name='pause' />}
        actions={
          <Button size='sm' variant='ghost' onClick={action('resume-queue')}>
            Resume
          </Button>
        }
      >
        Resume when you are ready.
      </Notice>
      <Notice
        tone='danger'
        summary='Signed out.'
        actions={
          <Button size='sm' variant='secondary' onClick={action('sign-in')}>
            Sign in
          </Button>
        }
      >
        Sign in to reconnect.
      </Notice>
      <Notice tone='success' summary='Import complete.'>
        All items are ready.
      </Notice>
    </Stack>
  )
};

/** Compact text and glyph sizing for narrow panels; actions still wrap naturally. */
export const Small: Story = {
  args: { size: 'sm', tone: 'warning', summary: 'Queue paused.', children: 'Resume when ready.' }
};

/** Two consumer-owned actions retain their native handlers, routing and focus behavior. */
export const WithActions: Story = {
  args: {
    summary: 'Queue paused.',
    tone: 'warning',
    children: 'Review pending items before resuming.',
    actions: (
      <>
        <Button size='sm' variant='secondary' onClick={action('resume')}>
          Resume
        </Button>
        <Link href='#queue'>View queue</Link>
      </>
    )
  }
};

/** A system glyph replaces the derived bell inside the decorative wrapper. */
export const CustomIcon: Story = {
  args: { summary: 'Simulation mode.', tone: 'info', icon: <Icon name='flask' /> }
};

/** A genuine later update keeps the original non-empty status root mounted with a fixed role. */
export const MountedStatusUpdates: Story = {
  render: function MountedStatusUpdatesExample() {
    const [paused, setPaused] = useState(false);
    return (
      <Stack gap={3}>
        <Notice role='status' tone={paused ? 'warning' : 'neutral'} summary={paused ? 'Queue paused.' : 'Queue ready.'}>
          {paused ? 'Resume when ready.' : 'Waiting for work.'}
        </Notice>
        <Button size='sm' variant='secondary' onClick={() => setPaused(!paused)}>
          Toggle queue state
        </Button>
      </Stack>
    );
  }
};

/** First insertion is readable in flow; a mounted generic ancestor does not prime polite speech. */
export const InitialStatus: Story = {
  render: function InitialStatusExample() {
    const [visible, setVisible] = useState(false);
    return (
      <Stack gap={3}>
        <Button size='sm' variant='secondary' onClick={() => setVisible(!visible)}>
          Toggle status
        </Button>
        {visible && <Notice tone='success' summary='Import complete.' />}
      </Stack>
    );
  }
};

/** A later blocking alert insertion differs from both initial page load and polite status insertion. */
export const InsertedAlert: Story = {
  render: function InsertedAlertExample() {
    const [blocked, setBlocked] = useState(false);
    return (
      <Stack gap={3}>
        <Button size='sm' variant='secondary' onClick={() => setBlocked(!blocked)}>
          Toggle blocking condition
        </Button>
        {blocked && (
          <Notice tone='danger' summary='Sign in required.'>
            Reconnect to continue.
          </Notice>
        )}
      </Stack>
    );
  }
};
