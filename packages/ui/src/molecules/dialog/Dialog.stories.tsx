import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../atoms/button';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from './Dialog';

/** Modal dialog. Content className merges last; overriding reserved panel geometry, paint, focus or positioning is unsupported. */
const meta = {
  title: 'Molecules/Dialog',
  component: Dialog,
  subcomponents: { dialogTrigger: DialogTrigger, dialogContent: DialogContent, dialogClose: DialogClose },
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open settings</Button>
        </DialogTrigger>
        <DialogContent title='Settings' description='Adjust preferences.'>
          Settings content
        </DialogContent>
      </>
    )
  }
} satisfies Meta<typeof Dialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const WithSplitAction: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open settings</Button>
        </DialogTrigger>
        <DialogContent
          title='Settings'
          actions={
            <>
              <Button size='sm'>Apply</Button>
              <DialogClose asChild={true}>
                <Button variant='neutral' size='sm'>
                  Cancel
                </Button>
              </DialogClose>
            </>
          }
        >
          Settings content
        </DialogContent>
      </>
    )
  }
};
export const Sizes: Story = {
  render: () => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild={true}>
            <Button variant='secondary'>{size}</Button>
          </DialogTrigger>
          <DialogContent title={`${size} dialog`} size={size}>
            Content
          </DialogContent>
        </Dialog>
      ))}
    </>
  )
};
export const Full: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open full dialog</Button>
        </DialogTrigger>
        <DialogContent title='Full dialog' size='full'>
          Content
        </DialogContent>
      </>
    )
  }
};
export const Sheet: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open sheet</Button>
        </DialogTrigger>
        <DialogContent title='Sheet' variant='sheet'>
          Content
        </DialogContent>
      </>
    )
  }
};
export const LongContent: Story = {
  args: {
    children: (
      <>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open long dialog</Button>
        </DialogTrigger>
        <DialogContent title='Long content'>
          {Array.from({ length: 30 }, (_, i) => (
            <p key={i}>Paragraph {i + 1}</p>
          ))}
        </DialogContent>
      </>
    )
  }
};
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open controlled dialog</Button>
        </DialogTrigger>
        <DialogContent title='Controlled'>Content</DialogContent>
      </Dialog>
    );
  }
};
export const WithoutTrigger: Story = {
  render: function WithoutTriggerStory() {
    const [open, setOpen] = useState(false);
    return (
      <>
        <Button variant='secondary' onClick={() => setOpen(true)}>
          Open externally
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent title='External trigger'>The consumer owns focus restoration.</DialogContent>
        </Dialog>
      </>
    );
  }
};
