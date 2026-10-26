import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { SearchTrigger } from './SearchTrigger';

/**
 * ## Description
 * A recessed native button that requests search: decorative search icon, visible label and an
 * optional passive keyboard hint. It never renders an input, filters results or opens a palette.
 *
 * ## Dependencies
 * The Surface well recipe supplies the Material base. Icon draws the 16px search glyph and Kbd the
 * hint; both are decorative. No Radix primitive: a host Dialog Trigger can wrap it with asChild.
 *
 * ## Usage guidelines
 * Connect one launch route: onClick on a controlled host, or a host Radix Dialog Trigger with asChild,
 * never both. The host owns the single Ctrl+K/Meta+K registration, OS choice, focus and dialog
 * lifecycle; supply shortcut only for a binding it really registers, plus aria-keyshortcuts when
 * useful. className supports root width, margins and parent layout only, not appearance overrides.
 */
const meta: Meta<typeof SearchTrigger> = {
  title: 'Atoms/SearchTrigger',
  component: SearchTrigger,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof SearchTrigger>;

/** Runtime defaults only: “Search…” label, no shortcut hint and no palette relationship. */
export const Default: Story = {};

/** macOS hint for a host that registers Meta+K; the hint itself binds nothing. */
export const MacHint: Story = { args: { shortcut: '⌘K', 'aria-keyshortcuts': 'Meta+K' } };

/** Windows and Linux hint for a host that registers Control+K. */
export const WindowsHint: Story = { args: { shortcut: 'Ctrl K', 'aria-keyshortcuts': 'Control+K' } };

/** Icon-only face for narrow toolbars; the label stays the accessible name and the hint is hidden. */
export const Compact: Story = { args: { compact: true, shortcut: 'Ctrl K' } };

/** A consumer label is both the visible text and the button name. */
export const CustomLabel: Story = { args: { label: 'Search articles, tools and shows…' } };

/** Native disabled launcher: no focus or activation, dimmed once. */
export const Disabled: Story = { args: { disabled: true, shortcut: 'Ctrl K' } };

/** Supported layout className: the launcher fills its container. */
export const FullWidth: Story = { args: { className: 'w-full', shortcut: 'Ctrl K' } };

/** Logs the native click a host would use to request opening; no palette opens here. */
export const Activation: Story = { args: { onClick: action('onClick'), shortcut: 'Ctrl K' } };
