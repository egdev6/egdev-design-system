import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { ChipGroup } from './ChipGroup';

const options = [
  { value: 'react', label: 'React' },
  { value: 'a11y', label: 'Accessibility' },
  { value: 'css', label: 'CSS' },
  { value: 'design', label: 'Design systems' }
];

/**
 * ## Description
 * A named collection of filter pills with single or multiple selection. The consumer filters
 * content and owns any result announcements; this component only coordinates selection.
 *
 * ## Dependencies
 * Radix ToggleGroup owns state, ARIA and looping horizontal roving focus. Items reuse Chip's
 * public appearance recipe, never a nested Chip Toggle. No stylesheet or surrounding panel.
 *
 * ## Usage guidelines
 * Choose a required type: single allows clearing and is not a mandatory form radio group.
 * Arrows move focus without selecting, including across wrapped rows; Space/Enter activate.
 * Provide unique non-empty values, meaningful labels and decorative non-interactive icons.
 * No form serialization, ref or asChild API. className supports root margins, width and parent
 * placement only, not item appearance. value/defaultValue controls are disabled because their
 * types depend on mode; Single and Multiple demonstrate the two shapes (approved amendment A1).
 */
const meta: Meta<typeof ChipGroup> = {
  title: 'Molecules/ChipGroup',
  component: ChipGroup,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof ChipGroup>;

/** Required inputs only: no initial selection or optional default overrides. */
export const Multiple: Story = { args: { type: 'multiple', label: 'Topics', options } };

/** One optional selection; clicking the selected pill emits an empty string. */
export const Single: Story = { args: { type: 'single', label: 'Topic', options, defaultValue: 'react' } };

/** Leading icons are decorative; visible labels remain the accessible names. */
export const WithIcons: Story = {
  args: {
    type: 'single',
    label: 'Screen edge',
    defaultValue: 'right',
    options: [
      { value: 'left', label: 'Left', icon: '←' },
      { value: 'right', label: 'Right', icon: '→' }
    ]
  }
};

/** The host accepts string updates and owns the selected value. */
export const ControlledSingle: Story = {
  args: { type: 'single', label: 'Topic', options, onValueChange: action('onValueChange') },
  render: function ControlledSingleExample() {
    const [value, setValue] = useState('react');
    return (
      <ChipGroup
        type='single'
        label='Topic'
        options={options}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          action('onValueChange')(next);
        }}
      />
    );
  }
};

/** The host accepts array updates in Radix activation order. */
export const ControlledMultiple: Story = {
  args: { type: 'multiple', label: 'Topics', options, onValueChange: action('onValueChange') },
  render: function ControlledMultipleExample() {
    const [value, setValue] = useState<string[]>(['react', 'a11y']);
    return (
      <ChipGroup
        type='multiple'
        label='Topics'
        options={options}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          action('onValueChange')(next);
        }}
      />
    );
  }
};

/** A disabled selected option retains its selection and is skipped by keyboard navigation. */
export const DisabledOption: Story = {
  args: {
    type: 'multiple',
    label: 'Topics',
    options: options.map((option) => ({ ...option, disabled: option.value === 'a11y' })),
    defaultValue: ['a11y']
  }
};

/** Every item dims once, but the unpainted group is never dimmed. */
export const DisabledGroup: Story = {
  args: { type: 'multiple', label: 'Topics', options, disabled: true, defaultValue: ['react', 'a11y'] }
};

/** Narrow root width wraps pills while arrows still follow logical DOM order, not rows. */
export const Wrapped: Story = {
  args: { type: 'multiple', label: 'Topics', options, className: 'max-w-48', defaultValue: ['react'] }
};

/** Logical horizontal arrow direction reverses; DOM order and selection semantics are unchanged. */
export const RTL: Story = { args: { type: 'single', label: 'Topic', options, dir: 'rtl' } };

/** Empty data still renders a named group, with no keyboard entry point or events. */
export const Empty: Story = { args: { type: 'multiple', label: 'Topics', options: [] } };
