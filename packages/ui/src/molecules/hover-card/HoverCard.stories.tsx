import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Gauge } from '../../atoms/gauge';
import { Link } from '../../atoms/link';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard';
import type { HoverCardProps } from './types';

const pair = (
  <>
    <HoverCardTrigger href='#usage-details'>Provider A preview</HoverCardTrigger>
    <HoverCardContent>
      <h2>Provider A</h2>
      <p>Usage: 42%. Reset: tomorrow.</p>
    </HoverCardContent>
  </>
);

/**
 * ## Description
 * Rich, read-only, supplementary link previews. Not a tooltip, dialog or action surface.
 *
 * ## Dependencies
 * Radix HoverCard owns timers, focus, dismissal and placement. Surface owns overlay Material.
 * Gauge and Link appear only in composition examples.
 *
 * ## Usage guidelines
 * Hover/focus opens after 700ms; leave/blur closes after 300ms. No focus trap or automatic
 * announcement. Every example supplies a separate persistent details link for touch users:
 * A1 retains Radix's touchstart cancellation; trigger tap navigation is not guaranteed.
 * The destination must repeat every preview detail. Content must never contain controls.
 * Content className supports layout only, not Material/padding/radius or state overrides.
 */
const meta: Meta<typeof HoverCard> = {
  title: 'Molecules/HoverCard',
  component: HoverCard,
  subcomponents: { hoverCardTrigger: HoverCardTrigger, hoverCardContent: HoverCardContent },
  tags: ['autodocs'],
  args: { children: pair },
  render: (args) => (
    <>
      <HoverCard {...args} />
      <p>
        <Link href='#usage-details'>Read all usage details</Link>
      </p>
      <section id='usage-details' aria-label='Persistent usage details'>
        <h2>Provider A</h2>
        <p>Usage: 42%. Reset: tomorrow.</p>
      </section>
    </>
  )
};
export default meta;
type Story = StoryObj<typeof HoverCard>;

/** Starts closed with untouched defaults; hover or focus the named preview link. */
export const Default: Story = {};

/** Inspect pointer travel and text selection without introducing interactive panel content. */
export const PointerRetention: Story = { args: { defaultOpen: true } };

/** Tab opens through the Radix delay; Escape dismisses and Tab continues to the separate link. */
export const Keyboard: Story = {};

function ControlledPreview(args: HoverCardProps) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <HoverCard
        {...args}
        open={open}
        onOpenChange={(next) => {
          action('onOpenChange')(next);
          setOpen(next);
        }}
      />
      <p>
        <Link href='#controlled-details'>Read all usage details</Link>
      </p>
      <section id='controlled-details' aria-label='Persistent usage details'>
        <h2>Provider A</h2>
        <p>Usage: 42%. Reset: tomorrow.</p>
      </section>
    </>
  );
}

/** The consumer acknowledges Radix visibility requests, rather than duplicating disclosure logic. */
export const Controlled: Story = {
  args: {
    children: (
      <>
        <HoverCardTrigger href='#controlled-details'>Provider A preview</HoverCardTrigger>
        <HoverCardContent>
          <h2>Provider A</h2>
          <p>Usage: 42%. Reset: tomorrow.</p>
        </HoverCardContent>
      </>
    )
  },
  render: (args) => <ControlledPreview {...args} />
};

/** Slot onto the existing system Link; its name, ref and destination remain link-owned. */
export const AsChildLink: Story = {
  args: {
    children: (
      <>
        <HoverCardTrigger asChild={true}>
          <Link href='#usage-details'>Provider A preview</Link>
        </HoverCardTrigger>
        <HoverCardContent>
          <h2>Provider A</h2>
          <p>Usage: 42%. Reset: tomorrow.</p>
        </HoverCardContent>
      </>
    )
  }
};

/** Gauge stays passive inside a named anchor; a second persistent link serves touch users. */
export const GaugePreview: Story = {
  args: {
    children: (
      <>
        <HoverCardTrigger asChild={true}>
          <a href='#usage-details' aria-label='Provider A usage details'>
            <Gauge label='Provider A usage' value={42} />
          </a>
        </HoverCardTrigger>
        <HoverCardContent>
          <h2>Provider A</h2>
          <p>Usage: 42%. Reset: tomorrow.</p>
        </HoverCardContent>
      </>
    )
  }
};

/** Radix may flip the requested side; this example asks for right/center rather than top/start. */
export const Placements: Story = {
  args: {
    children: (
      <>
        <HoverCardTrigger href='#usage-details'>Provider A preview</HoverCardTrigger>
        <HoverCardContent side='right' align='center'>
          <h2>Provider A</h2>
          <p>Usage: 42%. Reset: tomorrow.</p>
        </HoverCardContent>
      </>
    )
  }
};

/** Long unbroken text wraps; available-space limits and scrolling remain Radix-driven. */
export const LongContent: Story = {
  render: () => (
    <>
      <HoverCard>
        <HoverCardTrigger href='#long-details'>Measurement preview</HoverCardTrigger>
        <HoverCardContent>{'Measurement'.repeat(100)}</HoverCardContent>
      </HoverCard>
      <p>
        <Link href='#long-details'>Read the complete measurement</Link>
      </p>
      <section id='long-details' aria-label='Complete measurement'>
        {'Measurement'.repeat(100)}
      </section>
    </>
  )
};

/** Inspect with the real reduced-transparency preference; Surface owns the solid fallback. */
export const SolidFallback: Story = { args: { defaultOpen: true } };

/** Inspect with the real reduced-motion preference; the opacity enter transition is disabled. */
export const ReducedMotion: Story = { args: { defaultOpen: true } };
