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
