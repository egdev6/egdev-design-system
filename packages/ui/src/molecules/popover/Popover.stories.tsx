import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Input } from '../../atoms/input';
import { Label } from '../../primitives/label';
import { Stack } from '../../primitives/stack';
import { Text } from '../../primitives/text';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from './Popover';

function SettingsBody() {
  const id = useId();
  return (
    <Stack gap={3}>
      <Label htmlFor={id}>Display name</Label>
      <Input id={id} defaultValue='Desk' />
      <PopoverClose>Close settings</PopoverClose>
    </Stack>
  );
}

/**
 * ## Description
 * A click-open, named dialog for compact contextual settings and interactive content.
 *
 * ## Dependencies
 * Radix Popover owns state, focus, dismissal and positioning. Surface supplies overlay Material.
 * Button, IconButton, Input, Label, Stack and Text demonstrate consumer-owned body composition.
 *
 * ## Usage guidelines
 * Use one named Trigger and one named Content. Include a reachable Close action. Tab cycles in
 * both modes; outside interaction dismisses non-modal content without stealing outside focus.
 * Modal hides and blocks the page without a scrim. Do not change modality while open.
 * Content ids belong to Radix (A1); describe the dialog through label, not aria-labelledby.
 * Button triggers retain idle/loading data-state (A2); use aria-expanded variants for open-state styling.
 * Content className supports outer layout only. Subtree themes/custom portal containers and nested
 * overlays are outside this contract. Review solid fallback and reduced motion through real OS preferences.
 */
const meta = {
  title: 'Molecules/Popover',
  component: Popover,
  subcomponents: { popoverTrigger: PopoverTrigger, popoverContent: PopoverContent, popoverClose: PopoverClose },
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <PopoverTrigger>Display settings</PopoverTrigger>
        <PopoverContent label='Display settings'>
          <SettingsBody />
        </PopoverContent>
      </>
    )
  }
} satisfies Meta<typeof Popover>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Closed by default; activation opens the labelled interactive body with a visible Close action. */
export const Default: Story = {};

/** Opening moves focus into the body; Escape/Close restore it, while Tab cycles among controls. */
export const Keyboard: Story = { args: { defaultOpen: true } };

/** Modal mode contains focus and hides outside content without inventing a visual scrim. */
export const Modal: Story = { args: { modal: true } };

/** A native form keeps its own submission behavior and does not implicitly dismiss the panel. */
export const WithForm: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>Rename display</PopoverTrigger>
        <PopoverContent label='Rename display'>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              action('submit')(event);
            }}
          >
            <SettingsBody />
            <Button type='submit'>Apply name</Button>
          </form>
        </PopoverContent>
      </>
    )
  }
};

/** With no tabbable descendants, Radix focuses the Content container; Escape remains available. */
export const ReadOnly: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>Display information</PopoverTrigger>
        <PopoverContent label='Display information'>
          <Text>This display uses the system color profile.</Text>
        </PopoverContent>
      </>
    )
  }
};

/** A compatible Button is the actual Trigger; A2 keeps its idle/loading state and Radix-owned aria-expanded. */
export const ButtonTrigger: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger asChild={true}>
          <Button>Display settings</Button>
        </PopoverTrigger>
        <PopoverContent label='Display settings'>
          <SettingsBody />
        </PopoverContent>
      </>
    )
  }
};

/** A labelled IconButton composes the explicit Close action and retains its actual button ref. */
export const IconButtonClose: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>Display settings</PopoverTrigger>
        <PopoverContent label='Display settings'>
          <Text>Changes apply immediately.</Text>
          <PopoverClose asChild={true}>
            <IconButton label='Close settings' icon={<Icon name='close' />} />
          </PopoverClose>
        </PopoverContent>
      </>
    )
  }
};

/** The owner acknowledges each request; incoming state updates do not generate callback echoes. */
export const Controlled: Story = {
  render: function ControlledExample(args) {
    const [open, setOpen] = useState(false);
    return (
      <Popover
        {...args}
        open={open}
        onOpenChange={(next) => {
          action('onOpenChange')(next);
          setOpen(next);
        }}
      />
    );
  }
};

/** Preferred sides can flip near viewport edges; each instance keeps independent Radix ids. */
export const Placements: Story = {
  render: () => (
    <Stack gap={3}>
      {(['top', 'right', 'bottom', 'left'] as const).map((side) => (
        <Popover key={side}>
          <PopoverTrigger>{side} settings</PopoverTrigger>
          <PopoverContent label={`${side} settings`} side={side} align='end'>
            <SettingsBody />
          </PopoverContent>
        </Popover>
      ))}
    </Stack>
  )
};

/** Available-height scrolling and word wrapping keep a long body reachable in narrow viewports. */
export const LongContent: Story = {
  args: {
    children: (
      <>
        <PopoverTrigger>Display profiles</PopoverTrigger>
        <PopoverContent label='Display profiles'>
          <Stack gap={3}>
            {Array.from({ length: 24 }, (_, index) => (
              <Text key={`profile-${index}`}>Display profile {index + 1}</Text>
            ))}
            <PopoverClose>Close profiles</PopoverClose>
          </Stack>
        </PopoverContent>
      </>
    )
  }
};
