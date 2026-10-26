import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Icon } from '../icon';
import { Button } from './Button';

/**
 * ## Description
 * One labelled Material action. Prefer one primary per group; icon-only actions belong to IconButton.
 *
 * ## Dependencies
 * Radix Slot/Slottable preserve composed child semantics and refs. Spinner provides decorative
 * pending feedback; Icon supplies glyphs in these examples.
 *
 * ## Usage guidelines
 * Loading retains focus but suppresses activation; consumers announce pending operations separately.
 * Disabled takes precedence. Use md for touch layouts (48px); sm is a 40px desktop control.
 * asChild requires one compatible prop-spreading, ref-forwarding link or button, without overriding
 * disabled/busy/tabIndex state. className supports outer layout only; appearance overrides and
 * interactive descendants are unsupported. Native type defaults to button and is omitted for asChild.
 */
const meta = {
  title: 'Atoms/Button',
  component: Button,
  tags: ['autodocs']
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof Button>;

/** Required visible content only; all optional component defaults remain unchanged. */
export const Default: Story = { args: { children: 'Save draft' } };

/** Four approved Material treatments; dark is shown on its required flood host. */
export const Variants: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      <Button>Primary action</Button>
      <Button variant='secondary'>Secondary action</Button>
      <Button variant='ghost'>Quiet action</Button>
      <div className='bg-bg-flood p-3'>
        <Button variant='dark'>Flood action</Button>
      </div>
    </div>
  )
};

/** Both desktop control sizes, with matching icon scale rather than the legacy 18px glyph. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Button icon={<Icon name='arrow-right' />}>Standard action</Button>
      <Button size='sm' icon={<Icon name='arrow-right' size='sm' />}>
        Small action
      </Button>
    </div>
  )
};

/** Button's scoped naming exception allows decorative icons before or after visible copy. */
export const WithIcon: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Button icon={<Icon name='arrow-right' />}>Continue</Button>
      <Button variant='secondary' icon={<Icon name='users' />} iconPosition='start'>
        Join group
      </Button>
      <Button
        icon={
          <svg viewBox='0 0 24 24' aria-hidden='true'>
            <path d='M5 12h14m-5-5 5 5-5 5' />
          </svg>
        }
      >
        Custom glyph
      </Button>
    </div>
  )
};

/** Native disabled semantics remove the action from tab order and prevent activation. */
export const Disabled: Story = { args: { children: 'Unavailable action', disabled: true } };

/** Pending slots on either side; visible labels remain and no nested status region is created. */
export const Loading: Story = {
  render: () => (
    <div className='flex flex-wrap items-center gap-4'>
      <Button loading={true}>Saving draft</Button>
      <Button loading={true} variant='secondary' iconPosition='start'>
        Uploading files
      </Button>
      <Button loading={true} size='sm'>
        Saving
      </Button>
      <Button loading={true} size='sm' variant='secondary' iconPosition='start'>
        Uploading
      </Button>
    </div>
  )
};

/** Slot places the icon inside the anchor; the child retains native navigation semantics. */
export const AsChildLink: Story = {
  render: () => (
    <Button asChild={true} icon={<Icon name='arrow-right' />}>
      <a href='#projects'>View projects</a>
    </Button>
  )
};

/** Hover, press and keyboard focus use real pseudo-states, never simulated legacy state classes. */
export const States: Story = {
  args: { children: 'Activate action', onClick: action('button-activated') }
};

/** Layout-only width and margin utilities merge at the public root, not inside the icon slot. */
export const Layout: Story = { args: { children: 'Full width action', className: 'w-full ms-1 ms-2' } };
