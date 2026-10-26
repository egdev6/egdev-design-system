import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Countdown } from './Countdown';

// Example deadlines are relative to when Storybook loads; readable text is plain UTC.
const loadedAt = Date.now();
const at = (offset: number) => ({
  deadline: loadedAt + offset,
  deadlineText: new Date(loadedAt + offset).toUTCString()
});
const DAY = 86_400_000;
const pastDeadline = Date.UTC(2026, 0, 1, 18);

/**
 * ## Description
 * A passive readout of the time remaining until one absolute instant, in days, hours, minutes and
 * seconds, with the deadline as readable date text. Use it for event starts and live broadcasts.
 *
 * ## Dependencies
 * No Radix primitive applies: native `role="timer"` and `time` carry the semantics, and the hook
 * samples the client clock. No stylesheet; typography comes from token recipes.
 *
 * ## Usage guidelines
 * Pass the deadline as Unix epoch milliseconds and a deadlineText that includes its timezone; the
 * consumer owns localization. Server and first client renders show the initializing text, then the
 * client clock takes over. The timer is quiet (`aria-live="off"`): announce expiration yourself, once,
 * from onExpire in a separate live region. The host owns any flood field or panel; className
 * supports outer layout only.
 */
const meta: Meta<typeof Countdown> = {
  title: 'Atoms/Countdown',
  component: Countdown,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Countdown>;

/** Required deadline props only: every other prop keeps its runtime default. */
export const Default: Story = {
  args: at(2 * DAY + 4 * 3_600_000 + 37 * 60_000)
};

/** The md and sm digit scales side by side. */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <Countdown {...at(3 * DAY)} />
      <Countdown {...at(3 * DAY)} size='sm' />
    </div>
  )
};

/** Inherit keeps the host foreground (black on the flood field); canvas uses white digits and secondary text. */
export const Tones: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <div className='p-6 bg-bg-flood text-fg-on-flood'>
        <Countdown {...at(DAY)} label='Live in' />
      </div>
      <Countdown {...at(DAY)} label='Live in' tone='canvas' />
    </div>
  )
};

/** A reached deadline shows a genuine zero readout with the non-live expired text. */
export const Expired: Story = {
  args: { deadline: pastDeadline, deadlineText: new Date(pastDeadline).toUTCString(), tone: 'canvas' }
};

/** An invalid deadline shows the unavailable text, without digits, date metadata or a clock. */
export const InvalidDeadline: Story = {
  args: { deadline: Number.NaN, deadlineText: 'Date to be announced', tone: 'canvas' }
};

/** Consumer-localized label, unit names and status texts; no automatic pluralization. */
export const Localized: Story = {
  args: {
    ...at(DAY + 5 * 3_600_000),
    label: 'Directo en',
    units: ['días', 'horas', 'min', 'seg'],
    initializingText: 'Calculando el tiempo restante',
    expiredText: 'Hora alcanzada',
    tone: 'canvas'
  }
};

/** Days grow beyond two digits without truncation; the row wraps instead of clipping. */
export const LongDuration: Story = {
  args: { ...at(412 * DAY), tone: 'canvas' }
};

const targets = {
  tomorrow: at(DAY),
  soon: at(2 * 3_600_000),
  invalid: { deadline: Number.NaN, deadlineText: 'Unknown' }
};
const nextTarget = { tomorrow: 'soon', soon: 'invalid', invalid: 'tomorrow' } as const;

function DeadlineSwitcher() {
  const [key, setKey] = useState<keyof typeof targets>('tomorrow');
  const target = targets[key];
  return (
    <div className='flex flex-col gap-4'>
      <button type='button' className='self-start' onClick={() => setKey(nextTarget[key])}>
        Next deadline
      </button>
      <Countdown {...target} tone='canvas' />
    </div>
  );
}

/** Replacing the deadline shows the initializing or unavailable text first, never the old numbers. */
export const DeadlineChanges: Story = {
  render: () => <DeadlineSwitcher />
};

function ExpiringSoon() {
  const [target, setTarget] = useState(() => at(5000));
  return (
    <div className='flex flex-col gap-4'>
      <button type='button' className='self-start' onClick={() => setTarget(at(Date.now() - loadedAt + 5000))}>
        Restart in 5 seconds
      </button>
      <Countdown {...target} tone='canvas' onExpire={action('onExpire')} />
    </div>
  );
}

/** onExpire fires once per deadline episode; restarting supplies a new deadline and rearms it. */
export const WithExpiration: Story = {
  render: () => <ExpiringSoon />
};
