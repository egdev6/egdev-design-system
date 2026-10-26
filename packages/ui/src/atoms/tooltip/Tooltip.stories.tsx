import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tooltip } from './Tooltip';

const triggerClass =
  'inline-flex items-center justify-center rounded-sm border border-border-hairline bg-surface-1 px-3 py-2 font-sans text-label-default text-fg-default focus-visible:shadow-[var(--shadow-focus)] focus-visible:outline-none';

/**
 * ## Description
 * Short supplementary text that appears when a pointer rests on, or keyboard focus reaches, one
 * trigger: icon-only button names, ModuleRail module names or a Gauge's readable value.
 *
 * ## Dependencies
 * Radix Tooltip (`@radix-ui/react-tooltip`) owns the delays, hover/focus/Escape handling,
 * `aria-describedby`, `role="tooltip"`, collision flipping and the portal. Each Tooltip renders
 * its own provider, so no app setup is needed. No stylesheet is required.
 *
 * ## Usage guidelines
 * Wrap exactly one focusable element that forwards refs, spreads props and keeps its own
 * accessible name: the tooltip is a description, never the name. Content is plain,
 * non-interactive text and is unavailable on touch, so never put essential information in it.
 * Do not attach tooltips to disabled controls. The bubble uses the Material overlay recipe (solid
 * surface-2 under reduced transparency, no fade under reduced motion); className supports
 * layout-safe additions such as `text-center` only.
 */
const meta: Meta<typeof Tooltip> = {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

/** Hover the trigger for 700 ms, or focus it with Tab, to open the bubble on the top side. */
export const Default: Story = {
  args: {
    content: 'Search the catalogue',
    children: (
      <button type='button' className={triggerClass}>
        Search
      </button>
    )
  }
};

/** Every preferred side; Radix flips to the opposite side when there is no room. */
export const Sides: Story = {
  render: () => (
    <div className='flex items-center gap-6 p-12'>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Tooltip key={side} content={`Opens on the ${side}`} side={side}>
          <button type='button' className={triggerClass}>
            {side}
          </button>
        </Tooltip>
      ))}
    </div>
  )
};

/** An icon-only trigger keeps its own aria-label as the name; the tooltip adds the description. */
export const IconButtonTrigger: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      <Tooltip content='Close panel' side='bottom'>
        <button type='button' aria-label='Close' className={triggerClass}>
          <span aria-hidden='true'>×</span>
        </button>
      </Tooltip>
      <Tooltip content='egdev-publish, running' side='right'>
        <button type='button' aria-label='egdev-publish' className={triggerClass}>
          <span aria-hidden='true'>P</span>
        </button>
      </Tooltip>
    </div>
  )
};

/** Multi-line supplementary text centred through the layout-safe className surface. */
export const MultiLine: Story = {
  args: {
    content: 'Remaining publishing capacity for this week, refreshed every five minutes',
    className: 'text-center',
    children: (
      <button type='button' className={triggerClass}>
        Capacity
      </button>
    )
  }
};
