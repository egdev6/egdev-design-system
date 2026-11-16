import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox, Input, Select, Slider, Switch, Textarea } from '../../index';
import { Field } from './Field';

/**
 * ## Description
 * A label, FieldMessage hint or error and optional counter/readout for one consumer-owned form control.
 *
 * ## Dependencies
 * Label and VisuallyHidden provide naming and hidden text. FieldMessage owns message appearance. Radix Slot merges attributes onto
 * Input, Textarea, Select, Slider, Checkbox or Switch without duplicating their recipes.
 *
 * ## Usage guidelines
 * Validation and value state belong to the consumer. Error replaces hint, without a live region.
 * hintTone changes only guidance presentation; semantic messages include decorative icons.
 * With an error, the child must omit aria-invalid entirely or supply true/'true'; explicit
 * undefined, null, false and other conflicts are unsupported and retain Slot child precedence.
 * Slider needs its own matching label. Both choice layouts omit readout/counter; groups need a fieldset.
 * Choice-trailing puts text first; its visible label is the coarse-pointer target. When hidden,
 * the consumer must provide an equivalent usable target. Blank root space does not toggle.
 * className supports root width, margins and outer grid placement. Only choice-trailing permits
 * a root-scoped eg-label/eg-field-message typography rule using font tokens; CSS cascade determines
 * its precedence, not cn. Control internals, geometry and colors are not override surfaces.
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

/** Error replaces the hint and accompanies, rather than follows from, an over-limit counter; both share the bottom row. */
export const Invalid: Story = {
  args: {
    label: 'Post',
    hint: 'Keep it brief.',
    error: 'Shorten the post to 280 characters.',
    counter: { value: 294, max: 280 },
    children: <Input defaultValue='A post that exceeds the limit' />
  }
};

/** The consumer derives length; with no message, the counter occupies the bottom row alone at the end. */
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

/** A text-first setting leaves the Switch's value and interaction with the consumer. */
export const TrailingSwitch: Story = {
  args: { label: 'Notifications', layout: 'choice-trailing', hint: 'Receive release updates.', children: <Switch /> }
};

/** A text-first Checkbox uses the same native label relationship. */
export const TrailingCheckbox: Story = {
  args: {
    label: 'Remember this device',
    layout: 'choice-trailing',
    hint: 'Only on a private device.',
    children: <Checkbox />
  }
};

/** Field text and the disabled Switch each retain their own single dimming treatment. */
export const TrailingDisabled: Story = {
  args: {
    label: 'Notifications',
    layout: 'choice-trailing',
    hint: 'Unavailable for this account.',
    children: <Switch disabled={true} />
  }
};

/** A narrow host exercises ordinary wrapping and a long unbroken label without resizing the control. */
export const TrailingLongText: Story = {
  args: {
    label: 'Notifications with an ExtraordinarilyLongUnbrokenPreferenceIdentifier',
    layout: 'choice-trailing',
    hint: 'Receive updates when this preference changes.',
    children: <Switch />
  },
  decorators: [
    (Story) => (
      <div className='w-48'>
        <Story />
      </div>
    )
  ]
};

/** The logical columns mirror in an RTL host; Switch thumb mirroring is tracked separately. */
export const TrailingRtl: Story = {
  args: { label: 'Updates', layout: 'choice-trailing', hint: 'Receive release updates.', children: <Switch /> },
  decorators: [
    (Story) => (
      <div dir='rtl'>
        <Story />
      </div>
    )
  ]
};

/** A consumer-scoped token typography rule targets only the two documented Field text roots. */
export const TrailingScopedTypography: Story = {
  args: {
    label: 'Notifications',
    layout: 'choice-trailing',
    hint: 'Receive release updates.',
    className: 'settings-choice',
    children: <Switch />
  },
  decorators: [
    (Story) => (
      <>
        <style>{`
        .settings-choice.eg-field .eg-label {
          font-family: var(--font-sans);
          font-size: var(--text-body-muted);
          font-weight: var(--text-body-muted--font-weight);
          line-height: var(--text-body-muted--line-height);
        }
        .settings-choice.eg-field .eg-field-message {
          font-family: var(--font-sans);
          font-size: var(--text-body-default);
          font-weight: var(--text-body-default--font-weight);
          line-height: var(--text-body-default--line-height);
        }
      `}</style>
        <Story />
      </>
    )
  ]
};

/** Field dims its own parts once; the disabled control owns its separate opacity. The hint and counter share the bottom row. */
export const Disabled: Story = {
  args: {
    hint: 'Editing is unavailable.',
    readout: '0 characters',
    counter: { value: 0, max: 280 },
    children: <Input disabled={true} />
  }
};

/** Informational guidance never marks the control invalid. */
export const InformationalHint: Story = { args: { label: 'Email', hint: 'Use your primary email.', hintTone: 'info' } };
/** Warning appearance is not a validation error. */
export const WarningHint: Story = { args: { hint: 'Double-check this value.', hintTone: 'warning' } };
/** Success guidance is consumer-authored, not inferred from a value. */
export const SuccessHint: Story = { args: { hint: 'Looks good.', hintTone: 'success' } };
