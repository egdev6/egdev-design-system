import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { ButtonGroup } from './ButtonGroup';

/**
 * ## Description
 * Groups related actions with wrapping spacing or attached logical inner corners.
 * Each enabled action remains a native tab stop; this is not an arrow-key toolbar.
 *
 * ## Dependencies
 * Button and IconButton keep their own Material, focus, disabled state and sizing.
 * Icon supplies the decorative chevron in split-action examples.
 *
 * ## Usage guidelines
 * Pass direct element children. Match Button md with IconButton lg (48px), or Button
 * sm with IconButton md (40px). className supports outer margins and parent alignment.
 * A popup remains consumer-owned: compose its trigger asChild onto the IconButton.
 * Menu is not available on this base, so SplitButton demonstrates only the action pair,
 * not popup opening, ARIA or focus management. No built-in menu is promised.
 */
const meta: Meta<typeof ButtonGroup> = {
  title: 'Molecules/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof ButtonGroup>;

/** Related actions preserve the default spaced treatment and wrap when the host narrows. */
export const Spaced: Story = {
  args: {
    children: [
      <Button key='cancel' variant='ghost' onClick={action('cancel')}>
        Cancel
      </Button>,
      <Button key='save' onClick={action('save')}>
        Save idea
      </Button>
    ]
  }
};

/** A 48px action pair; the host supplies the real popup, its trigger ARIA and lifecycle. */
export const SplitButton: Story = {
  args: {
    variant: 'attached',
    label: 'Save options',
    children: [
      <Button key='save' size='md' onClick={action('save')}>
        Save idea
      </Button>,
      <IconButton
        key='options'
        label='More save options'
        icon={<Icon name='chevron-down' />}
        variant='primary'
        size='lg'
        onClick={action('request-save-options')}
      />
    ]
  }
};

/** The compact 40px pairing uses independent size scales, not a group size prop. */
export const SmallSplitButton: Story = {
  args: {
    variant: 'attached',
    label: 'Export options',
    children: [
      <Button key='export' variant='secondary' size='sm' onClick={action('export')}>
        Export
      </Button>,
      <IconButton
        key='options'
        label='More export options'
        icon={<Icon name='chevron-down' />}
        variant='secondary'
        size='md'
        onClick={action('request-export-options')}
      />
    ]
  }
};

/** Both logical sides of the middle action receive the small inner radius. */
export const AttachedThree: Story = {
  args: {
    variant: 'attached',
    label: 'Document actions',
    children: ['Copy', 'Move', 'Archive'].map((label) => (
      <Button key={label} variant='secondary' onClick={action(label.toLowerCase())}>
        {label}
      </Button>
    ))
  }
};

/** Disabling one child leaves the other actions enabled and individually focusable. */
export const WithDisabledItem: Story = {
  args: {
    variant: 'attached',
    label: 'Document actions',
    children: [
      <Button key='copy' variant='secondary' onClick={action('copy')}>
        Copy
      </Button>,
      <Button key='move' variant='secondary' disabled={true}>
        Move
      </Button>,
      <Button key='archive' variant='secondary' onClick={action('archive')}>
        Archive
      </Button>
    ]
  }
};

/** Logical corners keep the attached group correct when direction is inherited as RTL. */
export const RightToLeft: Story = { args: { ...AttachedThree.args, dir: 'rtl' } };
