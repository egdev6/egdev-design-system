import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { action } from 'storybook/actions';
import { Select } from './Select';

const options = [
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private' }
];

/**
 * ## Description
 * A single-choice form control for a short known list. Use RadioGroup for always-visible
 * choices and a combobox pattern for search; groups, descriptions and multi-select are not supported.
 *
 * ## Dependencies
 * Radix Select owns forms, portals, focus, keyboard and ARIA. Icon draws the decorative chevron and check.
 *
 * ## Usage guidelines
 * Supply a label, aria-label or aria-labelledby independently of placeholder text. Values must be
 * non-empty and unique. The button ref targets the trigger. className supports trigger width and
 * margin only; content/items have no public class props. cn resolves recognized utility conflicts,
 * not arbitrary CSS. There is no open-state API or asChild. No stylesheet.
 */
const meta: Meta<typeof Select> = {
  title: 'Atoms/Select',
  component: Select,
  tags: ['autodocs'],
  args: { options, 'aria-label': 'Visibility' }
};
export default meta;
type Story = StoryObj<typeof Select>;

/** Leaves the selection empty without overriding the md size or other defaults. */
export const Default: Story = {};

/** Placeholder text is a hint, not the accessible name. */
export const WithPlaceholder: Story = { args: { placeholder: 'Choose visibility' } };

/** Radix manages open state internally; open this story by pointer or keyboard to inspect the overlay. */
export const Open: Story = { args: { defaultValue: 'public' } };

/** Demonstrates the only height axis; content and item sizing do not change. */
export const Sizes: Story = {
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <Select {...args} size='md' aria-label='Default visibility' defaultValue='public' />
      <Select {...args} size='sm' aria-label='Compact visibility' defaultValue='public' />
    </div>
  )
};

/** A disabled trigger stays out of the Tab order and cannot open. */
export const Disabled: Story = { args: { disabled: true, defaultValue: 'public' } };

/** A disabled item is retained as text but skipped by Radix navigation and selection. */
export const DisabledOption: Story = {
  args: { options: [...options, { value: 'archived', label: 'Archived', disabled: true }], defaultValue: 'public' }
};

/** The consumer owns invalid meaning and readable error text through Field composition. */
export const Invalid: Story = { args: { 'aria-invalid': true, defaultValue: 'private' } };

function ControlledExample(args: React.ComponentProps<typeof Select>) {
  const [value, setValue] = useState('public');
  return (
    <Select
      {...args}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        action('onValueChange')(next);
      }}
    />
  );
}

/** Controlled selection reports user changes through an action; incoming values emit no event. */
export const Controlled: Story = { render: (args) => <ControlledExample {...args} /> };

function LabelledExample(args: React.ComponentProps<typeof Select>) {
  const id = useId();
  return (
    <div className='flex flex-col gap-2'>
      <label htmlFor={id}>Visibility</label>
      <Select
        {...args}
        aria-label={undefined}
        id={id}
        name='visibility'
        required={true}
        aria-describedby={`${id}-hint`}
      />
      <p id={`${id}-hint`}>Who can read this page</p>
    </div>
  );
}

/** Native label association and described-by composition, without importing a future Field. */
export const WithLabel: Story = { render: (args) => <LabelledExample {...args} /> };

/** A long list scrolls inside the Radix viewport; browser geometry still needs manual review. */
export const LongList: Story = {
  args: {
    options: Array.from({ length: 40 }, (_, index) => ({ value: `channel-${index}`, label: `Channel ${index + 1}` }))
  }
};
