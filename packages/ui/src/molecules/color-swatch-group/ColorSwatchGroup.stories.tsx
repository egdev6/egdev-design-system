import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { RadioGroup } from '@/atoms/radio-group';
import { SelectTile } from '@/molecules/select-tile';
import { Surface } from '@/primitives/surface';
import { ColorSwatchGroup } from './ColorSwatchGroup';
import type { ColorSwatchGroupOption } from './types';

/** Consumer-supplied example accent presets (Quorb/Nexo); not built-in defaults. */
const options: ColorSwatchGroupOption[] = [
  { value: '#ff0036', label: 'Red' },
  { value: '#ff7a00', label: 'Orange' },
  { value: '#ffd400', label: 'Yellow' },
  { value: '#22c55e', label: 'Green' },
  { value: '#00c2ff', label: 'Cyan' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#ff3fb4', label: 'Pink' }
];

/** The same presets with one disabled choice for keyboard and disabled-state examples. */
const withDisabled: ColorSwatchGroupOption[] = options.map((option) =>
  option.value === '#8b5cf6' ? { ...option, disabled: true } : option
);

/**
 * ## Description
 * Coordinate circular preset radios and an optional native color picker shown as a spectrum
 * circle with a plus badge in the same row. Option and picker names are visually hidden but
 * remain accessible. A polite output shows only the value accepted by the consumer.
 *
 * ## Dependencies
 * Radix RadioGroup owns selection, horizontal roving focus and keyboard interaction.
 * A decorative hairline ring marks every circle; the selected circle adds a surface gap and a
 * 2px fg-default ring, and focus is a separate offset focus-ring outline. The browser owns the
 * native picker.
 *
 * ## Usage guidelines
 * Supply localized nonblank names and unique opaque six-digit #RRGGBB colors. Invalid
 * options are omitted; an invalid current value shows an em dash and disables the picker.
 * Values and callback payloads are not normalized. The consumer owns persistence, reset,
 * form serialization and color contrast. `className` supports root margins, width and parent
 * placement only, not part appearance. No ref, asChild, stylesheet or custom renderer.
 */
const meta: Meta<typeof ColorSwatchGroup> = {
  title: 'Molecules/ColorSwatchGroup',
  component: ColorSwatchGroup,
  tags: ['autodocs'],
  args: { label: 'Accent color', options, value: '#ff0036', onValueChange: action('color-change') }
};
export default meta;
type Story = StoryObj<typeof ColorSwatchGroup>;

function AcceptingExample({
  initial = '#ff0036',
  dir = 'ltr',
  label = 'Accent color',
  choices = withDisabled
}: {
  initial?: string;
  dir?: 'ltr' | 'rtl';
  label?: string;
  choices?: ColorSwatchGroupOption[];
}) {
  const [value, setValue] = useState(initial);
  return (
    <ColorSwatchGroup
      label={label}
      options={choices}
      value={value}
      customLabel='Custom color'
      dir={dir}
      onValueChange={(next) => {
        action('accepted-color')(next);
        setValue(next);
      }}
    />
  );
}

/** Eight circular presets with the selected red ring and the spectrum custom control last. */
export const Presets: Story = { args: { customLabel: 'Custom color' } };

/** A non-preset value leaves every radio unchecked and rings the spectrum custom control. */
export const Custom: Story = { args: { value: '#8233cc', customLabel: 'Custom color' } };

/** Horizontal arrows loop and skip the disabled preset; Tab moves to the native picker. */
export const Keyboard: Story = { render: () => <AcceptingExample /> };

/** Narrow placement wraps the circles in order while keyboard navigation remains horizontal. */
export const Wrapped: Story = { args: { className: 'w-48', customLabel: 'Custom color' } };

/**
 * Tab into each group to compare states: the focused circle shows an offset focus-ring outline
 * outside the neutral selection ring. The second group selects a custom color.
 */
export const FocusAndSelection: Story = {
  render: () => (
    <>
      <AcceptingExample label='Preset selected' choices={options} />
      <AcceptingExample label='Custom selected' initial='#123456' choices={options} />
    </>
  )
};

/** Requests are logged but the unchanged value prop rejects them. */
export const Controlled: Story = { args: { customLabel: 'Custom color' } };

/** Consumer state explicitly accepts and stores each requested value. */
export const ConsumerControlled: Story = { render: () => <AcceptingExample /> };

/** With no presets, the separately named native input and accepted output remain available. */
export const EmptyOptions: Story = { args: { options: [], customLabel: 'Custom color', value: '#123456' } };

/** Without a custom label, only the named preset collection and current value are shown. */
export const NoCustom: Story = {};

/** The selected preset and current output remain readable while every control is disabled. */
export const Disabled: Story = { args: { disabled: true, customLabel: 'Custom color' } };

/** Malformed options and duplicates are skipped; an invalid current value disables the picker. */
export const InvalidInput: Story = {
  args: {
    options: [
      { value: '#ff0036', label: 'Red' },
      { value: '#FF0036', label: 'Duplicate red' },
      { value: 'var(--untrusted)', label: 'Invalid color' },
      { value: '#123456', label: ' ' }
    ],
    value: 'invalid',
    customLabel: 'Custom color'
  }
};

/** Dark, bright and matching-host samples use the same hairline and neutral selection ring. */
export const ColorExtremes: Story = {
  args: {
    options: [
      { value: '#000000', label: 'Black' },
      { value: '#ffffff', label: 'White' },
      { value: '#1b1c20', label: 'Graphite' }
    ],
    value: '#ffffff',
    customLabel: 'Custom color'
  }
};

/** Compare enabled, disabled and custom values on a token-backed Surface. */
export const States: Story = {
  render: () => (
    <Surface tone='surface-1' elevation={1} radius='md' padding='md'>
      <AcceptingExample initial='#123456' />
      <ColorSwatchGroup
        label='Unavailable accent'
        options={withDisabled}
        value='#8b5cf6'
        customLabel='Unavailable custom color'
        disabled={true}
        onValueChange={action('disabled-color')}
      />
    </Surface>
  )
};

/** Existing text RadioGroup and SelectTile remain independent public controls. */
export const Comparison: Story = {
  render: () => (
    <>
      <AcceptingExample />
      <RadioGroup
        label='Text choices'
        options={[
          { value: 'one', label: 'One' },
          { value: 'two', label: 'Two' }
        ]}
      />
      <SelectTile
        type='single'
        label='Visual choices'
        options={[
          { value: 'first', label: 'First' },
          { value: 'second', label: 'Second' }
        ]}
      />
    </>
  )
};

/** RTL reverses horizontal arrow direction without changing supplied option order. */
export const RTL: Story = { render: () => <AcceptingExample dir='rtl' /> };
