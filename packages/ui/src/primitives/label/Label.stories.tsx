import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId } from 'react';
import { Label } from './Label';

/**
 * ## Description
 * A native label with token-backed typography for naming form and choice controls.
 *
 * The public `eg-label` marker carries the field default (recipe weight 600); the choice variant
 * uses the approved body weight token. No surface paint, states or size API are provided.
 *
 * ## Usage guidelines
 * Pair with `htmlFor` plus a control `id`, or wrap a single native control so clicks activate it.
 * `variant="field"` labels text inputs; `variant="choice"` labels checkbox-like controls.
 * className supports layout-only additions; appearance stays component-owned.
 */
const meta: Meta<typeof Label> = {
  title: 'Primitives/Label',
  component: Label,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Label>;

/** Field default paired with a text input through useId-based htmlFor; no variant arg overwrites the default. */
export const Default: Story = {
  args: { children: 'Project name' },
  render: (args) => {
    const id = useId();
    return (
      <div className='flex flex-col items-start gap-2'>
        <Label {...args} htmlFor={id} />
        <input id={id} type='text' placeholder='egdev-design-system' />
      </div>
    );
  }
};

/** Choice variant preceding a native checkbox, associated through htmlFor and useId. */
export const Choice: Story = {
  args: { children: 'Notify me about updates', variant: 'choice' },
  render: (args) => {
    const id = useId();
    return (
      <div className='flex flex-col items-start gap-2'>
        <Label {...args} htmlFor={id} />
        <input id={id} type='checkbox' />
      </div>
    );
  }
};

/** A single native control wrapped by the label; clicking the text activates the control. */
export const WrappingControl: Story = {
  args: { children: 'Subscribe' },
  render: (args) => (
    <div className='flex flex-col items-start gap-2'>
      <Label {...args}>
        <input type='checkbox' /> Subscribe
      </Label>
    </div>
  )
};

/** Long readable text wraps inside the label without changing its typography contract. */
export const LongText: Story = {
  args: {
    children:
      'Public description of the repository, including its purpose, supported environments and any restrictions that reviewers should confirm before use.'
  },
  render: (args) => (
    <div className='flex flex-col items-start gap-2'>
      <Label {...args} />
    </div>
  )
};

/** Field label composing rest, focused and invalid native controls with a trailing output summary. */
export const Composition: Story = {
  args: { children: 'Email address' },
  render: (args) => {
    const emailId = useId();
    const aliasId = useId();
    const aliasTwoId = useId();
    return (
      <form className='flex flex-col items-start gap-4' onSubmit={(event) => event.preventDefault()}>
        <div className='flex flex-col items-start gap-2'>
          <Label {...args} htmlFor={emailId} />
          <input id={emailId} type='email' placeholder='you@example.com' />
        </div>
        <div className='flex flex-col items-start gap-2'>
          <Label {...args} htmlFor={aliasId}>
            Work alias
          </Label>
          <input id={aliasId} type='text' defaultValue='enrique' autoFocus={true} />
        </div>
        <div className='flex flex-col items-start gap-2'>
          <Label {...args} htmlFor={aliasTwoId}>
            Recovery address
          </Label>
          <input id={aliasTwoId} type='email' aria-invalid='true' placeholder='Recovery address' />
        </div>
        <output htmlFor={`${aliasId} ${aliasTwoId}`}>2 aliases configured</output>
      </form>
    );
  }
};
