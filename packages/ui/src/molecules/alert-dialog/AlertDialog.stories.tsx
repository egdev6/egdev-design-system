import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Button } from '../../atoms/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger
} from './AlertDialog';

/** Content className merges last; reserved geometry, paint and focus overrides are unsupported. */
const meta = {
  title: 'Molecules/AlertDialog',
  component: AlertDialog,
  subcomponents: {
    alertDialogTrigger: AlertDialogTrigger,
    alertDialogContent: AlertDialogContent,
    alertDialogCancel: AlertDialogCancel,
    alertDialogAction: AlertDialogAction
  },
  tags: ['autodocs'],
  args: {
    children: (
      <>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Disconnect</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Disconnect?'
          description='Access will be removed.'
          actions={
            <>
              <AlertDialogCancel asChild={true}>
                <Button variant='secondary'>Keep connected</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild={true}>
                <Button>Disconnect</Button>
              </AlertDialogAction>
            </>
          }
        />
      </>
    )
  }
} satisfies Meta<typeof AlertDialog>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};

/** Inline places the title row and consequence side by side. */
export const InlineHeader: Story = {
  args: {
    children: (
      <>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Open inline confirmation</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Disconnect?'
          description='Access will be removed.'
          headerLayout='inline'
          actions={
            <>
              <AlertDialogCancel>Keep connected</AlertDialogCancel>
              <AlertDialogAction>Disconnect</AlertDialogAction>
            </>
          }
        />
      </>
    )
  }
};

/** Stacked is the existing default, with the consequence below the title row. */
export const StackedHeader: Story = {
  args: {
    children: (
      <>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Open stacked confirmation</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Disconnect?'
          description='Access will be removed.'
          headerLayout='stacked'
          actions={
            <>
              <AlertDialogCancel>Keep connected</AlertDialogCancel>
              <AlertDialogAction>Disconnect</AlertDialogAction>
            </>
          }
        />
      </>
    )
  }
};
/** A long title in the stacked header: the description reads as its subtitle. */
export const StackedLongTitle: Story = {
  args: {
    children: (
      <>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Open stacked long title</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Remove this application from the hub?'
          description='Its shortcut and custom settings will be deleted. The executable stays on disk.'
          headerLayout='stacked'
          actions={
            <>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction>Remove</AlertDialogAction>
            </>
          }
        />
      </>
    )
  }
};

/** The same long title in the inline header, for comparison. */
export const InlineLongTitle: Story = {
  args: {
    children: (
      <>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Open inline long title</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Remove this application from the hub?'
          description='Its shortcut and custom settings will be deleted. The executable stays on disk.'
          headerLayout='inline'
          actions={
            <>
              <AlertDialogCancel>Keep it</AlertDialogCancel>
              <AlertDialogAction>Remove</AlertDialogAction>
            </>
          }
        />
      </>
    )
  }
};
export const Danger: Story = {
  args: {
    children: (
      <>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Delete</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          tone='danger'
          title='Delete project?'
          description='This cannot be undone.'
          actions={
            <>
              <AlertDialogCancel asChild={true}>
                <Button variant='secondary'>Keep project</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild={true}>
                <Button>Delete project</Button>
              </AlertDialogAction>
            </>
          }
        />
      </>
    )
  }
};
export const WithBody: Story = {
  args: {
    children: (
      <>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Disconnect</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Disconnect?'
          description='Access will be removed.'
          actions={
            <>
              <AlertDialogCancel asChild={true}>
                <Button variant='secondary'>Keep connected</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild={true}>
                <Button>Disconnect</Button>
              </AlertDialogAction>
            </>
          }
        >
          You can reconnect later.
        </AlertDialogContent>
      </>
    )
  }
};
export const PendingAction: Story = {
  render: function PendingStory() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const pendingRef = useRef(false);
    return (
      <AlertDialog
        open={open}
        onOpenChange={(next) => {
          if (!pendingRef.current) {
            setOpen(next);
          }
        }}
      >
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Disconnect</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Disconnect?'
          description='Access will be removed.'
          actions={
            <>
              <AlertDialogCancel asChild={true}>
                <Button variant='secondary'>Keep connected</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild={true}>
                <Button
                  loading={pending}
                  onClick={() => {
                    pendingRef.current = true;
                    setPending(true);
                    window.setTimeout(() => {
                      pendingRef.current = false;
                      setPending(false);
                      setOpen(false);
                    }, 1500);
                  }}
                >
                  Disconnect
                </Button>
              </AlertDialogAction>
            </>
          }
        />
      </AlertDialog>
    );
  }
};
export const Controlled: Story = {
  render: function ControlledStory() {
    const [open, setOpen] = useState(false);
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild={true}>
          <Button variant='secondary'>Disconnect</Button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Disconnect?'
          description='Access will be removed.'
          actions={
            <>
              <AlertDialogCancel asChild={true}>
                <Button variant='secondary'>Keep connected</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild={true}>
                <Button>Disconnect</Button>
              </AlertDialogAction>
            </>
          }
        />
      </AlertDialog>
    );
  }
};
