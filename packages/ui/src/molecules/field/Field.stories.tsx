import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Input, Select, Slider, Switch, Textarea } from '../../index';
import { Field } from './Field';

/**
 * ## Description
 * A label, hint or error and optional counter/readout for one consumer-owned form control.
 *
 * ## Dependencies
 * Label and VisuallyHidden provide naming and hidden text. Radix Slot merges attributes onto
 * Input, Textarea, Select, Slider, Checkbox or Switch without duplicating their recipes.
 *
 * ## Usage guidelines
 * Validation and value state belong to the consumer. Error replaces hint, without a live region.
 * With an error, the child must omit aria-invalid entirely or supply true/'true'; explicit
 * undefined, null, false and other conflicts are unsupported and retain Slot child precedence.
 * Slider needs its own matching label. Choice omits readout/counter; groups need a fieldset.
 * className supports root width, margins and outer grid placement, not internal appearance.
 */
const meta: Meta<typeof Field> = {
  title: 'Molecules/Field',
  component: Field,
  tags: ['autodocs'],
  args: { label: 'Title', children: <Input /> }
};
export default meta;
type Story = StoryObj<typeof Field>;

/** Required inputs only; preserves stacked and visible-label defaults. */
export const WithInput: Story = {};

/** Persistent guidance becomes the control's accessible description. */
export const WithHint: Story = { args: { hint: 'Use a short, descriptive title.' } };

/** Error replaces the hint and accompanies, rather than follows from, an over-limit counter. */
export const Invalid: Story = {
  args: {
    label: 'Post',
    hint: 'Keep it brief.',
    error: 'Shorten the post to 280 characters.',
    counter: { value: 294, max: 280 },
    children: <Input defaultValue='A post that exceeds the limit' />
  }
};

/** The consumer derives length; an over-limit counter alone never marks the control invalid. */
export const Counter: Story = {
  args: {
    label: 'Comment',
    counter: { value: 36, max: 1250 },
    children: <Textarea defaultValue='A short comment for the release notes' />
  }
};

/** A real Select trigger is named by the label, not by its placeholder. */
export const WithSelect: Story = {
  args: {
    label: 'Visibility',
    hint: 'Choose who can see this.',
    children: (
      <Select
        options={[
          { value: 'public', label: 'Public' },
          { value: 'private', label: 'Private' }
        ]}
        defaultValue='public'
      />
    )
  }
};

/** A multiline control shares the same label and guidance rhythm as Input. */
export const WithTextarea: Story = {
  args: { label: 'Comment', hint: 'Plain text only.', children: <Textarea rows={4} /> }
};

/** Slider owns its accessible name; the linked output is a visible consumer-derived value. */
export const WithSlider: Story = {
  args: { label: 'Ring size', readout: '56 px', children: <Slider label='Ring size' defaultValue={56} /> }
};

/** Hidden text remains the accessible name through VisuallyHidden. */
export const HiddenLabel: Story = {
  args: { label: 'Search', hideLabel: true, children: <Input placeholder='Search' /> }
};

/** Checkbox comes before its clickable label; coarse pointers receive the larger row target. */
export const ChoiceCheckbox: Story = {
  args: { label: 'Remember this device', layout: 'choice', hint: 'Only on a private device.', children: <Checkbox /> }
};

/** Switch uses the same choice layout without inventing a group or an additional focus stop. */
export const ChoiceSwitch: Story = {
  args: { label: 'Notifications', layout: 'choice', hint: 'Receive release updates.', children: <Switch /> }
};

/** Field dims its own parts once; the disabled control owns its separate opacity. */
export const Disabled: Story = {
  args: {
    hint: 'Editing is unavailable.',
    readout: '0 characters',
    counter: { value: 0, max: 280 },
    children: <Input disabled={true} />
  }
};
