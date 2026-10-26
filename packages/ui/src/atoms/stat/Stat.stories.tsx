import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stat } from './Stat';

/**
 * ## Description
 * One large figure with its visible label and a short context line, for totals that change
 * live: stream totals rows and dashboard KPIs. It is passive: no focus, events or timers.
 *
 * ## Dependencies
 * No Radix primitive: the root is a native `div` with `role="group"` named by the visible
 * label through `aria-labelledby`. Appearance comes from token utilities; no stylesheet.
 *
 * ## Usage guidelines
 * Pass numbers or already formatted strings: the figure renders as given, so the consumer
 * owns locale formatting (`1,200` / `1.200`). Use `value={null}` for no data: a muted em
 * dash hidden from assistive technology plus readable `unavailableText`, with the reason in
 * `delta`; never fake a 0. `highlighted` is a brief, consumer-timed emphasis after a change;
 * keep one highlighted Stat at a time and state the change in `delta`, since the brand border
 * and glow are not the only signal. Announce changes through one shared polite live region
 * owned by the page, not per Stat. className supports outer layout (grid placement, width,
 * margin) only. The legacy `--glass` treatment is not part of this component.
 */
const meta: Meta<typeof Stat> = {
  title: 'Atoms/Stat',
  component: Stat,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Stat>;

/** A live total with its context line. */
export const Default: Story = {
  args: { label: 'Follows', value: 23, delta: '+5 in the last hour' }
};

/** Brief brand emphasis after a change; the delta states the change in text. */
export const Highlighted: Story = {
  args: { label: 'Subs', value: 4, delta: '+1 10 s ago', highlighted: true }
};

/** No data: hidden em dash with readable text, and the reason in the delta. */
export const NoData: Story = {
  args: { label: 'Superchats', value: null, delta: 'Not connected' }
};

/** Compact figure without a context line, for mobile and dense bars. */
export const Small: Story = {
  args: { label: 'Raids', value: 1, size: 'sm' }
};

/** A stream totals row: the consumer owns the grid, formatting and the single highlight. */
export const TotalsRow: Story = {
  render: () => (
    <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
      <Stat label='Follows' value={23} delta='+5 in the last hour' />
      <Stat label='Subs' value={4} delta='+1 10 s ago' highlighted={true} />
      <Stat label='Bits' value='1,200' delta='Last cheer 2 min ago' />
      <Stat label='Superchats' value={null} delta='Not connected' />
    </div>
  )
};
