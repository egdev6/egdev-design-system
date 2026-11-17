import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { RadioGroup } from '@/atoms/radio-group';
import { SelectTile } from '@/molecules/select-tile';
import { Surface } from '@/primitives/surface';
import { ColorSwatchGroup } from './ColorSwatchGroup';
import type { ColorSwatchGroupOption } from './types';

const options: ColorSwatchGroupOption[] = [
  { value: '#ff0036', label: 'Red' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#a855f7', label: 'Purple', disabled: true }
];

/**
 * ## Description
 * Coordinate named preset radios and an optional separately labelled native color picker.
 * A polite output shows only the value accepted by the consumer.
 *
 * ## Dependencies
 * Radix RadioGroup owns selection, horizontal roving focus and keyboard interaction.
 * Surface recipes supply neutral Material frames; the browser owns the native picker.
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

function AcceptingExample({ initial = '#ff0036', dir = 'ltr' }: { initial?: string; dir?: 'ltr' | 'rtl' }) {
  const [value, setValue] = useState(initial);
  return (
    <ColorSwatchGroup
      label='Accent color'
      options={options}
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

/** Named presets with the current choice controlled by the supplied args. */
export const Presets: Story = {};

/** A non-preset value leaves every radio unchecked and remains visible in the native picker. */
export const Custom: Story = { args: { value: '#8233cc', customLabel: 'Custom color' } };

/** Horizontal arrows loop and skip the disabled preset; Tab moves to the native picker. */
export const Keyboard: Story = { render: () => <AcceptingExample /> };

/** Narrow placement wraps named choices while keyboard navigation remains horizontal. */
export const Wrapped: Story = {
  args: {
    className: 'w-48',
    customLabel: 'Custom color',
    options: [
      { value: '#ff0036', label: 'A very long localized red color name' },
      { value: '#3b82f6', label: 'A very long localized blue color name' },
      { value: '#10b981', label: 'Green' }
    ]
  }
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

/** Dark, bright and matching-host samples use the same neutral frame and selected check. */
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
        options={options}
        value='#a855f7'
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
