import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Icon } from '../icon';
import { Chip } from './Chip';
import type { ChipProps } from './types';

function ControlledChip(props: Extract<ChipProps, { mode?: 'toggle' }>) {
  const [pressed, setPressed] = useState(false);
  return (
    <Chip
      {...props}
      pressed={pressed}
      onPressedChange={(next) => {
        setPressed(next);
        action('onPressedChange')(next);
      }}
    />
  );
}

/**
 * ## Description
 * One compact pill with three modes. `toggle` (default) is a pressable option the user switches
 * on or off; `static` is a non-interactive topic label; `link` is the same pill as a real anchor.
 *
 * ## Dependencies
 * Radix Toggle owns keyboard, focus, aria-pressed and data-state in toggle mode only. Static
 * renders a native span and link a native anchor; neither exposes pressed state. WithIcon composes
 * the public Icon API as consumer content; Chip itself has no Icon dependency.
 *
 * ## Usage guidelines
 * Keep labels short; they never truncate. Use one mode per visual group, because a static chip and
 * an off toggle look identical. Status labels stay Badge and one-shot actions stay Button. The
 * consumer owns list semantics, `aria-current`, router interception (via `onClick`) and the link
 * destination. className supports outer layout only, not appearance overrides. No ref, asChild or
 * stylesheet.
 */
const meta = {
  title: 'Atoms/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Design', onPressedChange: action('onPressedChange') }
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof Chip>;

/** Required label only; the uncontrolled off toggle is the runtime default. */
export const Default: Story = {};

/** A decorative leading icon sized to the 14px wrapper, before the label that names the chip. */
export const WithIcon: Story = {
  args: { children: 'Saved', icon: <Icon name='bookmark' className='size-3.5' /> }
} as Story;

/** Off and on treatments side by side; hover with a pointer to inspect the hover tone. */
export const Pressed: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Chip>Design</Chip>
      <Chip defaultPressed={true}>Design</Chip>
      <Chip defaultPressed={true} icon={<Icon name='bookmark' className='size-3.5' />}>
        Saved
      </Chip>
    </div>
  )
};

/** Consumer state drives the pressed prop; each activation is also reported in Actions. */
export const Controlled: Story = {
  render: (args) => <ControlledChip {...(args as Extract<ChipProps, { mode?: 'toggle' }>)} />
};

/** Disabled chips keep their off or on treatment and are skipped by keyboard navigation. */
export const Disabled: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Chip disabled={true}>Design</Chip>
      <Chip disabled={true} defaultPressed={true}>
        Design
      </Chip>
    </div>
  )
} as Story;

/**
 * Static mode renders a plain span: no role, no pressed state, no Tab stop and no hover, active or
 * focus treatment. The consumer supplies the surrounding list or heading.
 */
export const Static: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Chip mode='static'>Open Source</Chip>
      <Chip mode='static'>TypeScript</Chip>
      <Chip mode='static' icon={<Icon name='bookmark' className='size-3.5' />}>
        Saved
      </Chip>
    </div>
  )
};

/** Link mode renders a native anchor to a real destination; Enter follows it, Space does not. */
export const Link: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Chip mode='link' href='#topics' onClick={action('onClick')}>
        Topics
      </Chip>
      <Chip mode='link' href='#archive' icon={<Icon name='bookmark' className='size-3.5' />}>
        Archive
      </Chip>
    </div>
  )
};

/**
 * `external` adds target and rel safety plus a visually hidden new-tab notice, localized through
 * `newTabText`; the notice is part of the anchor's accessible name.
 */
export const ExternalLink: Story = {
  render: () => (
    <div className='flex flex-wrap gap-2'>
      <Chip mode='link' href='https://example.com' external={true} onClick={action('onClick')}>
        Documentation
      </Chip>
      <Chip mode='link' href='https://example.com' external={true} newTabText='(new window)'>
        Examples
      </Chip>
    </div>
  )
};

/** The consumer owns list semantics: the `ul` is named and each chip contributes no role. */
export const StaticInList: Story = {
  render: () => (
    <ul aria-label='Topics' className='flex flex-wrap gap-2'>
      <li>
        <Chip mode='static'>Accessibility</Chip>
      </li>
      <li>
        <Chip mode='static'>Design systems</Chip>
      </li>
      <li>
        <Chip mode='static'>Testing</Chip>
      </li>
    </ul>
  )
};
