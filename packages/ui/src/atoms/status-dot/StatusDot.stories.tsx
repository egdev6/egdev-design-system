import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from './StatusDot';
import type { StatusDotState } from './types';

/**
 * ## Description
 * Small decorative dot that reinforces a module or service condition next to its name, or
 * signals "live now" / "live soon". It fuses the Foundation StatusDot and LiveDot atoms.
 *
 * ## Dependencies
 * No Radix primitive: the dot is purely decorative and has no behavior. `status-dot.css`
 * only defines the live/standby pulse keyframes; every appearance comes from token utilities.
 *
 * ## Usage guidelines
 * The dot is always hidden from assistive technology: pair it with visible text or put the
 * state word in the containing control's accessible name. Color never carries the meaning
 * alone. Status states use an 8px dot with a surface ring; live and standby use a 10px
 * glowing dot that pulses unless `pulse={false}`. Keep one pulsing signal per screen.
 * Reduced-motion preferences always stop the pulse. className supports outer layout and
 * positioning only. Migration: LiveDot → `state="live"`, LiveDot static → `pulse={false}`,
 * LiveDot waiting → `state="standby"`.
 */
const meta: Meta<typeof StatusDot> = {
  title: 'Atoms/StatusDot',
  component: StatusDot,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof StatusDot>;

const statusStates: StatusDotState[] = ['running', 'idle', 'warning', 'error', 'stopped'];

/** Default stopped status dot with its surface ring. */
export const Default: Story = {};

/** Every state with its word: five ringed status dots, then the live and standby signals. */
export const AllStates: Story = {
  render: () => (
    <div className='flex flex-col gap-4 p-4 rounded-md bg-surface-1 text-fg-default'>
      <div className='flex flex-wrap items-center gap-6'>
        {statusStates.map((state) => (
          <span key={state} className='inline-flex items-center gap-2'>
            <StatusDot state={state} />
            {state}
          </span>
        ))}
      </div>
      <div className='flex flex-wrap items-center gap-6'>
        <span className='inline-flex items-center gap-2'>
          <StatusDot state='live' pulse={false} />
          live
        </span>
        <span className='inline-flex items-center gap-2'>
          <StatusDot state='standby' pulse={false} />
          standby
        </span>
      </div>
    </div>
  )
};

/** Pulsing live signal; reduced-motion preferences render it static. */
export const Live: Story = {
  args: { state: 'live' }
};

/** Live signal without the pulse (formerly LiveDot static). */
export const LiveStatic: Story = {
  args: { state: 'live', pulse: false }
};

/** The dot is hidden from assistive technology; adjacent text carries the meaning. */
export const WithText: Story = {
  render: () => (
    <div className='flex flex-col gap-3 text-fg-default'>
      <span className='inline-flex items-center gap-2'>
        <StatusDot state='running' />
        egdev-publish, running
      </span>
      <span className='inline-flex items-center gap-2'>
        <StatusDot state='error' />
        egdev-sync, error
      </span>
      <span className='inline-flex items-center gap-2'>
        <StatusDot state='live' />
        Live now
      </span>
      <span className='inline-flex items-center gap-2'>
        <StatusDot state='standby' />
        Upcoming live
      </span>
    </div>
  )
};
