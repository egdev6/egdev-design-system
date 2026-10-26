import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { RadioGroup } from './RadioGroup';
import type { RadioGroupOption } from './types';

const visibility: RadioGroupOption[] = [
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private' }
];

const formats: RadioGroupOption[] = [
  { value: 'video', label: 'Video' },
  { value: 'short', label: 'Short' },
  { value: 'live', label: 'Live' }
];

/**
 * ## Description
 * An exclusive choice among a short, visible list of text options, such as the visibility of an
 * upload. Each option is a 20px circle with its label in a 40px row. Unchecked circles are
 * recessed wells; the checked one is raised with the primary gradient, bevel and halo and shows
 * a black dot, while its label brightens.
 *
 * ## Dependencies
 * Built on Radix RadioGroup, which owns `role="radiogroup"`/`radio`, roving focus, arrow-key
 * selection and the hidden form inputs. No stylesheet is required.
 *
 * ## Usage guidelines
 * `label` names the group; a Field legend can name it instead through `aria-labelledby`. Keep
 * option values unique and lists short: use Select for long lists, Checkbox for multiple
 * choices and SelectTile or ChipGroup for custom option visuals. Arrow keys follow
 * `orientation`, and the group never deselects by user action. className supports root layout
 * (margin, alignment) only.
 */
const meta: Meta<typeof RadioGroup> = {
  title: 'Atoms/RadioGroup',
  component: RadioGroup,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

/** Uncontrolled vertical group with nothing selected; only the required props and the change action are supplied. */
export const Default: Story = {
  args: { label: 'Visibility', options: visibility, onValueChange: action('onValueChange') }
};

/** Consumer-owned selection: the value is stored by the consumer from onValueChange. */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('unlisted');
    return (
      <div className='flex flex-col gap-3 font-sans text-body-default text-fg-default'>
        <RadioGroup
          label='Visibility'
          options={visibility}
          value={value}
          onValueChange={(next) => {
            setValue(next);
            action('onValueChange')(next);
          }}
        />
        <p>Selected: {value}</p>
      </div>
    );
  }
};

/** A wrapping row navigated with Left and Right arrows. */
export const Horizontal: Story = {
  args: { label: 'Format', options: formats, orientation: 'horizontal', defaultValue: 'video' }
};

/** A disabled option is skipped by the arrow keys, cannot be selected and dims its row to 45%. */
export const DisabledOption: Story = {
  args: {
    label: 'Visibility',
    options: [
      { value: 'public', label: 'Public' },
      { value: 'unlisted', label: 'Unlisted' },
      { value: 'private', label: 'Private', disabled: true }
    ],
    defaultValue: 'public'
  }
};

/** A disabled group leaves the Tab order and dims every row, keeping its current selection visible. */
export const DisabledGroup: Story = {
  args: { label: 'Visibility', options: visibility, defaultValue: 'public', disabled: true }
};
