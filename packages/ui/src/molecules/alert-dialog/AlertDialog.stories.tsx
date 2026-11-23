import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef, useState } from 'react';
import { Button } from '../../atoms/button';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger
} from './AlertDialog';

/**
 * ## Description
 * A decision-required modal with a body portal or a ready custom host.
 *
 * ## Dependencies
 * Radix owns modality and focus, Surface supplies material, and Button composes the examples.
 *
 * ## Usage guidelines
 * A host must be connected, positioned, non-scrolling and have definite dimensions; it bounds
 * paint, not document-wide modality. Render after the host is ready and close before replacing it.
 * Viewport scope can be constrained by ancestor clipping and fixed containing blocks. Same-host
 * nesting requires a common stacking context without competing layers or clipping. Content
 * className merges last; reserved geometry, paint and focus overrides remain unsupported.
 * Pending locks owned decision controls, not arbitrary children or controlled state. A slotted
 * button must spread props and forward its ref; nested interactive children and consumer capture
 * or native handlers that run before the guard are unsupported. Prevent the initiating close and
 * duplicate starts synchronously, and provide visible progress and recovery. aria-busy is not an
 * announcement; the consumer owns accessible status and error messages.
 */
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
/** The default body portal and least-destructive initial focus. */
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
/** A destructive decision uses the danger icon without changing panel material. */
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
/** Supporting body content adds context without replacing the required consequence. */
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
/** A controlled consumer prevents the first close synchronously and supplies visible progress. */
export const PendingAction: Story = {
  render: function PendingStory() {
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const pendingRef = useRef(false);
    return (
      <AlertDialog
        open={open}
        pending={pending}
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
                  onClick={(event) => {
                    event.preventDefault();
                    if (pendingRef.current) {
                      return;
                    }
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
        >
          {pending && 'Disconnecting…'}
        </AlertDialogContent>
      </AlertDialog>
    );
  }
};

/** A consumer may own open state independently of the pending lock. */
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

function ContainerExample({ viewport = false }: { viewport?: boolean }) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild={true}>
        <Button variant='secondary'>Open hosted confirmation</Button>
      </AlertDialogTrigger>
      <div ref={setHost} className='relative w-full max-w-[calc(var(--space-24)*8)] h-[calc(var(--space-24)*6)]' />
      {host && (
        <AlertDialogContent
          title={viewport ? 'Viewport confirmation' : 'Contained confirmation'}
          description='Choose whether to continue.'
          container={host}
          overlayScope={viewport ? 'viewport' : undefined}
          actions={
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Continue</AlertDialogAction>
            </>
          }
        />
      )}
    </AlertDialog>
  );
}

/** A positioned host bounds paint while Radix modality remains document-wide. */
export const Container: Story = { render: () => <ContainerExample /> };

/** A ready mount may retain viewport layout when ancestors do not clip or transform it. */
export const ContainerViewport: Story = { render: () => <ContainerExample viewport={true} /> };

/** A sheet and a later confirmation share one 440px host; failure permits retry or cancellation. */
export const NestedDelete: Story = {
  render: function NestedDeleteStory() {
    const [host, setHost] = useState<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [pending, setPending] = useState(false);
    const [failed, setFailed] = useState(false);
    const inFlight = useRef(false);
    const attempts = useRef(0);
    return (
      <Dialog>
        <DialogTrigger asChild={true}>
          <Button variant='secondary'>Open note</Button>
        </DialogTrigger>
        <div ref={setHost} className='relative w-[calc(var(--space-1)*137.5)] h-[calc(var(--space-24)*8)]' />
        {host && (
          <DialogContent title='Note' variant='sheet' container={host}>
            <AlertDialog open={open} pending={pending} onOpenChange={setOpen}>
              <AlertDialogTrigger asChild={true}>
                <Button>Delete note</Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                title='Delete note?'
                description='This cannot be undone.'
                tone='danger'
                container={host}
                actions={
                  <>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={(event) => {
                        event.preventDefault();
                        if (inFlight.current) {
                          return;
                        }
                        inFlight.current = true;
                        setPending(true);
                        setFailed(false);
                        attempts.current += 1;
                        window.setTimeout(() => {
                          inFlight.current = false;
                          setPending(false);
                          if (attempts.current === 1) {
                            setFailed(true);
                          } else {
                            setOpen(false);
                          }
                        }, 800);
                      }}
                    >
                      Delete
                    </AlertDialogAction>
                  </>
                }
              >
                {pending && 'Deleting…'}
                {failed && 'Delete failed. Retry or cancel.'}
              </AlertDialogContent>
            </AlertDialog>
          </DialogContent>
        )}
      </Dialog>
    );
  }
};
