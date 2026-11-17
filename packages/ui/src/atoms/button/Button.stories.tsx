import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ButtonGroup } from '../../molecules/button-group';
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
 * Disabled takes precedence. Use lg when a 44px minimum touch target is required.
 * asChild requires one compatible prop-spreading, ref-forwarding link or button, without overriding
 * disabled/busy/tabIndex state. className supports outer layout only; appearance overrides and
 * interactive descendants are unsupported. Native type defaults to button and is omitted for asChild.
 * labelWrap supports plain text and compatible slotted links with plain text; other children are
 * best effort. Avoid it in attached ButtonGroups, which require matching heights.
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
      <Button variant='neutral'>Neutral action</Button>
      <div className='bg-bg-flood p-3'>
        <Button variant='dark'>Flood action</Button>
      </div>
    </div>
  )
};

/** Three control sizes, with lg sharing the standard icon scale. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      <Button size='lg' icon={<Icon name='arrow-right' />}>
        Large action
      </Button>
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

/** Constrained spaced and unbroken labels wrap at every size with icons on either side. */
export const LabelWrap: Story = {
  render: () => (
    <div className='flex w-48 flex-col items-start gap-3'>
      <Button className='w-full' size='sm' labelWrap={true} icon={<Icon name='check' />} iconPosition='start'>
        Save changes to this document
      </Button>
      <Button className='w-full' size='md' labelWrap={true}>
        Extraordinarilylongunbrokenlocalizedactionlabel
      </Button>
      <Button className='w-full' size='lg' labelWrap={true} icon={<Icon name='arrow-right' />}>
        Continue to project settings
      </Button>
    </div>
  )
};

/** Wrapping also applies to loading, a slotted link and separately spaced group actions. */
export const LabelWrapStates: Story = {
  render: () => (
    <div className='flex w-48 flex-col items-start gap-3'>
      <Button className='w-full' labelWrap={true} loading={true} iconPosition='start'>
        Saving changes to this document
      </Button>
      <Button className='w-full' labelWrap={true} asChild={true}>
        <a href='#projects'>View all project details</a>
      </Button>
      <ButtonGroup variant='spaced' label='Document actions'>
        <Button labelWrap={true} variant='secondary'>
          Review document details
        </Button>
        <Button labelWrap={true}>Publish the document now</Button>
      </ButtonGroup>
    </div>
  )
};

/** Layout-only width and margin utilities merge at the public root, not inside the icon slot. */
export const Layout: Story = { args: { children: 'Full width action', className: 'w-full ms-1 ms-2' } };
