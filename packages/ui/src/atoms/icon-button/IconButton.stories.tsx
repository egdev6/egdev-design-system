import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Icon } from '../icon';
import { IconButton } from './IconButton';

/**
 * ## Description
 * One icon-only action with a required accessible name. Use Button for ambiguous glyphs or pending actions,
 * and Toggle for persistent pressed state. Ghost is the default toolbar treatment; outline is round.
 *
 * ## Dependencies
 * Radix Slot/Slottable compose an empty anchor or router-link host. Radix AccessibleIcon hides the glyph
 * and supplies the hidden name. Examples use the merged Icon atom; custom SVG is supported.
 *
 * ## Usage guidelines
 * Supply a non-empty label and a decorative icon without its own label. Refs reach the native button or
 * slotted host. Disabled links are removed from tab order and activation is prevented. Consumers own
 * target/rel and tooltips. className supports only root margin, alignment and placement; appearance
 * overrides are unsupported. Small controls are desktop-only; touch layouts provide a ≥44px hit area.
 */
const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { label: 'Search', icon: <Icon name='search' /> }
};
export default meta;
type Story = StoryObj<typeof IconButton>;

/** Required inputs only: native button, ghost treatment and md geometry remain runtime defaults. */
export const Default: Story = {};

/** All four approved treatments, without legacy modifier classes or local appearance overrides. */
export const Variants: Story = {
  render: (args) => (
    <div className='flex gap-4'>
      {(['ghost', 'outline', 'primary', 'secondary'] as const).map((variant) => (
        <IconButton {...args} key={variant} variant={variant} label={`${variant} action`} />
      ))}
    </div>
  )
};

/** Fixed 32/40/48px controls; glyphs use 16px at sm and the 20px icon token otherwise. */
export const Sizes: Story = {
  render: (args) => (
    <div className='flex items-center gap-4'>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <IconButton {...args} key={size} size={size} />
      ))}
    </div>
  )
};

/** Disabled controls retain treatment and opacity; native activation and focus are unavailable. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className='flex gap-4'>
      {(['ghost', 'outline', 'primary', 'secondary'] as const).map((variant) => (
        <IconButton {...args} key={variant} variant={variant} />
      ))}
    </div>
  )
};

/** Tab, hover and press to inspect native interaction and the reduced-motion preference separately. */
export const States: Story = { args: { onClick: action('onClick') } };

/** An empty anchor receives the icon and hidden name; external-link policy belongs to its consumer. */
export const AsChildLink: Story = {
  args: { asChild: true, variant: 'outline', label: 'GitHub', icon: <Icon name='github' /> },
  render: (args) => (
    <IconButton {...args}>
      <a href='https://github.com/egdev6' target='_blank' rel='noreferrer' />
    </IconButton>
  )
};

/** A custom SVG receives preset geometry and Radix decorative attributes, just like a system glyph. */
export const RawSvg: Story = {
  args: {
    label: 'Add',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
        <path d='M12 5v14M5 12h14' />
      </svg>
    )
  }
};
