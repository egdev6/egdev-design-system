import type { Meta, StoryObj } from '@storybook/react-vite';
import { Kbd } from './Kbd';

/**
 * ## Description
 * One keyboard key or shortcut glyph as native inline `kbd` text, for hints, SearchTrigger
 * and the command palette. It is passive: no focus, events or state.
 *
 * ## Dependencies
 * No Radix behavior base: the native `kbd` element carries the semantics. Radix
 * VisuallyHidden carries the optional spoken label; no stylesheet is required.
 *
 * ## Usage guidelines
 * Render one Kbd per key and compose combos with plain text separators (`Ctrl` + `K`).
 * Give symbol keys such as ⌘, ↵ or ← a label so screen readers announce a name instead of
 * the glyph. Keep the text short: it never wraps. The treatment is flat by design (hairline
 * border, small radius, secondary text); className supports root margin and alignment only.
 * Containing controls name OS-dependent shortcuts themselves.
 */
const meta: Meta<typeof Kbd> = {
  title: 'Atoms/Kbd',
  component: Kbd,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Kbd>;

/** A single named key read as-is. */
export const Default: Story = {
  args: { children: 'Esc' }
};

/** Common key hints; symbol keys carry a spoken label. */
export const Keys: Story = {
  render: () => (
    <div className='flex items-center gap-3'>
      <Kbd label='Command K'>⌘K</Kbd>
      <Kbd>Ctrl</Kbd>
      <Kbd>Esc</Kbd>
      <Kbd label='Enter'>↵</Kbd>
      <Kbd label='Left arrow'>←</Kbd>
      <Kbd label='Right arrow'>→</Kbd>
    </div>
  )
};

/** A symbol key whose visible glyph is hidden from assistive technology behind its label. */
export const SymbolWithLabel: Story = {
  args: { children: '⌘K', label: 'Command K' }
};

/** Keys inline in body text, composed per key with plain text separators. */
export const InText: Story = {
  render: () => (
    <p className='font-sans text-body-default text-fg-default'>
      Press <Kbd label='Command K'>⌘K</Kbd> or <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search.
    </p>
  )
};
