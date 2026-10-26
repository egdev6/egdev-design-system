import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { action } from 'storybook/actions';
import { Switch } from './Switch';

/**
 * ## Description
 * A bare 36×20 on/off switch for settings with immediate effect, such as enabling alerts or
 * showing a layer. Off is a recessed well with a grey thumb; on fills the track with the primary
 * gradient, bevel and halo and moves the black thumb to the end.
 *
 * ## Dependencies
 * Built on Radix Switch, which owns `role="switch"`, `aria-checked`, Space/Enter activation and
 * the hidden form input. No stylesheet is required.
 *
 * ## Usage guidelines
 * Always give it an accessible name: a native `<label htmlFor>`, `aria-labelledby` or `aria-label`.
 * Apply the effect in `onCheckedChange`; if it fails, revert the controlled `checked` value. Use
 * Checkbox for options saved later with a form and Toggle for pressed toolbar buttons. The
 * composing row owns the 44px touch target. className supports root layout (margin, alignment) only.
 */
const meta: Meta<typeof Switch> = {
  title: 'Atoms/Switch',
  component: Switch,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Switch>;

/** Uncontrolled switch starting off; only the accessible name and the change action are supplied. */
export const Default: Story = {
  args: { 'aria-label': 'Stream alerts', onCheckedChange: action('onCheckedChange') }
};

/** Consumer-owned state: the immediate effect is applied in onCheckedChange. */
export const Controlled: Story = {
  render: () => {
    const [visible, setVisible] = useState(true);
    const id = useId();
    return (
      <div className='flex items-center gap-3 font-sans text-body-default text-fg-default'>
        <Switch
          id={id}
          checked={visible}
          onCheckedChange={(next) => {
            setVisible(next);
            action('onCheckedChange')(next);
          }}
        />
        <label htmlFor={id}>Overlay {visible ? 'visible' : 'hidden'}</label>
      </div>
    );
  }
};

/** Disabled switches leave the Tab order, ignore clicks and dim to 45% in both states. */
export const Disabled: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Switch aria-label='Disabled off' disabled={true} />
      <Switch aria-label='Disabled on' disabled={true} defaultChecked={true} />
    </div>
  )
};

/** Off and on side by side, matching the specimen; Tab onto either to see the focus ring. */
export const States: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Switch aria-label='Off' />
      <Switch aria-label='On' defaultChecked={true} />
    </div>
  )
};

/** A native label names the switch and toggles it when clicked, as Field's choice layout composes it. */
export const WithLabel: Story = {
  render: () => {
    const id = useId();
    return (
      <div className='flex items-center gap-3 font-sans text-body-default text-fg-default'>
        <Switch id={id} />
        <label htmlFor={id}>Play a sound on new followers</label>
      </div>
    );
  }
};
