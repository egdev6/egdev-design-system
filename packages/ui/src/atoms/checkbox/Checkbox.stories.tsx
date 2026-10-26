import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { action } from 'storybook/actions';
import { Checkbox } from './Checkbox';
import type { CheckboxCheckedState } from './types';

/**
 * ## Description
 * A bare 18px checkbox for form options saved later, including consumer-computed mixed state.
 *
 * ## Dependencies
 * Radix Checkbox owns keyboard, focus, checked semantics and the hidden form input.
 * Icon supplies decorative check and minus glyphs.
 *
 * ## Usage guidelines
 * Supply a name with aria-label, aria-labelledby or a label. The composing label row owns the
 * 44px touch target; the bare box is not a standalone touch target. No label, size or asChild API.
 * className supports outer margin and self-alignment only. No stylesheet; appearance uses CVA
 * token utilities. Browser focus, Controls and visual comparison are separate from unit tests.
 */
const meta: Meta<typeof Checkbox> = {
  title: 'Atoms/Checkbox',
  component: Checkbox,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Checkbox>;

/** Only the accessible name is supplied; every runtime default remains intact. */
export const Default: Story = { args: { 'aria-label': 'Notify subscribers' } };

function ControlledExample() {
  const [checked, setChecked] = useState<CheckboxCheckedState>(false);
  return (
    <Checkbox
      aria-label='Notify subscribers'
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next);
        action('onCheckedChange')(next);
      }}
    />
  );
}

/** The consumer commits Radix's next state; each user toggle is logged as an action. */
export const Controlled: Story = { render: () => <ControlledExample /> };

/** The consumer initializes mixed state; the next click or Space selects true, not a tri-state cycle. */
export const Indeterminate: Story = {
  args: { 'aria-label': 'Select all rows', defaultChecked: 'indeterminate', onCheckedChange: action('onCheckedChange') }
};

/** Disabled preserves the checked value but removes focus and activation, with 45% opacity. */
export const Disabled: Story = {
  args: { 'aria-label': 'Unavailable option', disabled: true, defaultChecked: true }
};

/** Unchecked well, checked fill, mixed glyph and unchecked invalid border; Tab checks focus on each. */
export const States: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Checkbox aria-label='Unchecked option' />
      <Checkbox aria-label='Checked option' defaultChecked={true} />
      <Checkbox aria-label='Mixed option' defaultChecked='indeterminate' />
      <Checkbox aria-label='Invalid option' aria-invalid='true' />
    </div>
  )
};

function LabelExample() {
  const id = useId();
  return (
    <label htmlFor={id} className='inline-flex min-h-11 cursor-pointer items-center gap-2'>
      <Checkbox id={id} />
      Notify subscribers
    </label>
  );
}

/** A consumer label supplies naming, activation and the 44px target without adding atom label props. */
export const WithLabel: Story = { render: () => <LabelExample /> };
