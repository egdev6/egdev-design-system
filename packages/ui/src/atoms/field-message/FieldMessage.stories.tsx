import type { Meta, StoryObj } from '@storybook/react-vite';
import { FieldMessage } from './FieldMessage';

/**
 * ## Description
 * One descriptive or semantic message, independent of form validation and announcements.
 *
 * ## Dependencies
 * Icon supplies decorative status glyphs. Field owns control relationships when composed.
 *
 * ## Usage guidelines
 * Supply meaningful plain text and connect the paragraph id through aria-describedby.
 * Description is neutral and icon-free; semantic tones derive a decorative glyph.
 * Icons can be overridden. Tone never implies aria-invalid, a live role or focus movement.
 * Use native role/aria-live only when the application intentionally owns an announcement.
 * Empty text renders nothing. Root className supports outer margins, width and placement,
 * not appearance overrides. No ref or asChild API. No stylesheet.
 */
const meta: Meta<typeof FieldMessage> = {
  title: 'Atoms/FieldMessage',
  component: FieldMessage,
  tags: ['autodocs'],
  args: { children: 'Additional context for this value.' }
};
export default meta;
type Story = StoryObj<typeof FieldMessage>;

export const Default: Story = {};
export const Info: Story = { args: { tone: 'info', children: 'Use your primary email.' } };
export const Warning: Story = { args: { tone: 'warning', children: 'Double-check this value.' } };
export const Success: Story = { args: { tone: 'success', children: 'Looks good.' } };
export const ErrorMessage: Story = { args: { tone: 'error', children: 'This field is required.' } };
export const IconOverride: Story = { args: { icon: 'info', children: 'Additional context in neutral gray.' } };
export const Wrapping: Story = {
  args: {
    tone: 'warning',
    children: 'Double-check the destination before continuing. This message wraps without reducing the icon size.',
    className: 'max-w-64'
  }
};
/** Native announcement opt-in belongs to the application; it is never derived from tone. */
export const Announcement: Story = { args: { tone: 'success', role: 'status', children: 'Changes saved.' } };
