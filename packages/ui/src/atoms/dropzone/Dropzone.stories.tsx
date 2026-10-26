import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Dropzone } from './Dropzone';

/**
 * ## Description
 * A dashed native button for dragging, pasting or picking files. No uploads or validation run here.
 *
 * ## Dependencies
 * Icon supplies the decorative upload glyph. Native button and file input own activation and picking.
 *
 * ## Usage guidelines
 * Consumers validate files and announce uploads/errors in their own live region. accept filters only
 * the picker; drop and paste preserve every file (or the first when multiple is false). Paste is
 * scoped to the focused button. className supports outer layout only, not appearance overrides.
 * Drag a file over either target to inspect the internal over state; it is not a public prop.
 */
const meta: Meta<typeof Dropzone> = {
  title: 'Atoms/Dropzone',
  component: Dropzone,
  tags: ['autodocs'],
  args: { onFiles: action('onFiles') }
};
export default meta;
type Story = StoryObj<typeof Dropzone>;

/** Preserves all runtime defaults; click, Enter, Space, drop or focused paste delivers files. */
export const Default: Story = {};

/** Full-width row for a compact target beneath existing media. */
export const Inline: Story = { args: { variant: 'inline' } };

/** Native disabled target ignores every file-delivery path and stays idle. */
export const Disabled: Story = { args: { disabled: true } };

/** Allows several files. The image filter affects only the picker, not drop or paste validation. */
export const MultipleFiles: Story = { args: { multiple: true, accept: 'image/*' } };

/** Drag a file over the target to see custom drop text; no mirrored class or forced state prop. */
export const DragOver: Story = { args: { label: 'Add attachments', dropLabel: 'Release attachments here' } };

/** Supported consumer layout classes merge last without granting internal appearance overrides. */
export const ConsumerLayout: Story = { args: { className: 'mt-2 w-full' } };
