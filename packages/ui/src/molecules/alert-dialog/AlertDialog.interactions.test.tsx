import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useRef, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Dialog, DialogContent, DialogTrigger } from '../dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '.';

// Verifier regression probe: outside pointer must not dismiss, Escape must dismiss exactly once.
const closeRequests = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter(([open]) => open === false).length;

function Probe({ onOpenChange }: { onOpenChange: (open: boolean) => void }) {
  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger>Disconnect</AlertDialogTrigger>
      <AlertDialogContent
        title='Disconnect?'
        description='Access will be removed.'
        actions={
          <>
            <AlertDialogCancel>Keep connected</AlertDialogCancel>
            <AlertDialogAction>Disconnect</AlertDialogAction>
          </>
        }
      >
        You can reconnect later.
      </AlertDialogContent>
    </AlertDialog>
  );
}

describe('AlertDialog pending action', () => {
  it('preserves the slotted Trigger, its ref and ordinary callbacks while pending', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    const ref = createRef<HTMLButtonElement>();
    render(
      <AlertDialog pending={true} onOpenChange={(open) => calls.push(String(open))}>
        <AlertDialogTrigger asChild={true} ref={ref} onClickCapture={() => calls.push('capture')}>
          <button type='button' onClick={() => calls.push('child')}>
            Open
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent
          title='Delete?'
          description='Cannot undo.'
          actions={<AlertDialogCancel>Cancel</AlertDialogCancel>}
        />
      </AlertDialog>
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Open' }));
    await user.click(screen.getByRole('button', { name: 'Open' }));
    expect(calls).toEqual(['capture', 'child', 'true']);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  it.each([undefined, false, true] as const)(
    'passes consumer aria-busy %s through until pending overrides it',
    (busy) => {
      const change = vi.fn();
      const tree = (pending: boolean) => (
        <AlertDialog open={true} pending={pending} onOpenChange={change}>
          <AlertDialogContent
            title='Delete?'
            description='Cannot undo.'
            aria-busy={busy}
            actions={<AlertDialogCancel>Cancel</AlertDialogCancel>}
          />
        </AlertDialog>
      );
      const { rerender } = render(tree(false));
      const panel = screen.getByRole('alertdialog', { name: 'Delete?', description: 'Cannot undo.' });
      expect(panel).toHaveAttribute('aria-modal', 'true');
      if (busy === undefined) {
        expect(panel).not.toHaveAttribute('aria-busy');
      } else {
        expect(panel).toHaveAttribute('aria-busy', String(busy));
      }
      rerender(tree(true));
      expect(panel).toHaveAttribute('aria-busy', 'true');
      expect(panel).not.toHaveAttribute('pending');
      rerender(tree(false));
      if (busy === undefined) {
        expect(panel).not.toHaveAttribute('aria-busy');
      } else {
        expect(panel).toHaveAttribute('aria-busy', String(busy));
      }
      expect(change).not.toHaveBeenCalled();
    }
  );

  it.each([
    ['Cancel', false],
    ['Cancel', true],
    ['Action', false],
    ['Action', true]
  ] as const)(
    'locks %s (%s slotted) across pointer, keyboard and programmatic activation, then restores it',
    async (kind, slotted) => {
      const user = userEvent.setup();
      const change = vi.fn();
      const outer = vi.fn();
      const child = vi.fn();
      const ref = createRef<HTMLButtonElement>();
      const Decision = kind === 'Cancel' ? AlertDialogCancel : AlertDialogAction;
      const tree = (pending: boolean) => (
        <AlertDialog open={true} pending={pending} onOpenChange={change}>
          <AlertDialogContent
            title='Delete?'
            description='Cannot undo.'
            actions={
              <>
                {kind !== 'Cancel' && <AlertDialogCancel>Cancel</AlertDialogCancel>}
                {slotted ? (
                  <Decision asChild={true} ref={ref} onClick={outer}>
                    <button type='button' onClick={child}>
                      {kind}
                    </button>
                  </Decision>
                ) : (
                  <Decision ref={ref} onClick={outer}>
                    {kind}
                  </Decision>
                )}
              </>
            }
          />
        </AlertDialog>
      );
      const view = render(tree(true));
      const button = screen.getByRole('button', { name: kind });
      expect(ref.current).toBe(button);
      button.focus();
      expect(button).toHaveFocus();
      expect(button).toHaveAttribute('aria-disabled', 'true');
      expect(button).not.toBeDisabled();
      await user.click(button);
      await user.keyboard('{Enter}');
      await user.keyboard(' ');
      fireEvent.click(button);
      expect(button).toHaveFocus();
      expect(screen.getByRole('alertdialog')).toBeInTheDocument();
      expect(outer).not.toHaveBeenCalled();
      expect(child).not.toHaveBeenCalled();
      expect(change).not.toHaveBeenCalled();
      view.rerender(tree(false));
      expect(button).toHaveFocus();
      expect(button).not.toHaveAttribute('aria-disabled', 'true');
      await user.click(button);
      expect(outer).toHaveBeenCalledOnce();
      expect(child).toHaveBeenCalledTimes(slotted ? 1 : 0);
      expect(change).toHaveBeenCalledExactlyOnceWith(false);
    }
  );

  it('retains the focused Cancel, blocks Escape and outside, and restores uncontrolled dismissal after unlocking', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const tree = (pending: boolean) => (
      <AlertDialog defaultOpen={true} pending={pending} onOpenChange={change}>
        <AlertDialogContent
          title='Delete?'
          description='Cannot undo.'
          actions={
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </>
          }
        />
      </AlertDialog>
    );
    const view = render(tree(false));
    const cancel = screen.getByRole('button', { name: 'Cancel' });
    expect(cancel).toHaveFocus();
    view.rerender(tree(true));
    expect(cancel).toHaveFocus();
    const overlay = screen.getByRole('alertdialog').closest('.eg-alert-dialog-backdrop');
    if (!overlay) {
      throw new Error('Missing alert overlay');
    }
    fireEvent.pointerDown(overlay, { button: 0, pointerType: 'mouse' });
    fireEvent.click(overlay);
    await user.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
    expect(cancel).toHaveFocus();
    view.rerender(tree(false));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('owns unavailable semantics even if a compatible slotted button declares aria-disabled false', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const change = vi.fn();
    const tree = (pending: boolean) => (
      <AlertDialog open={true} pending={pending} onOpenChange={change}>
        <AlertDialogContent
          title='Delete?'
          description='Cannot undo.'
          actions={
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction asChild={true}>
                <button type='button' aria-disabled={false} onClick={click}>
                  Delete
                </button>
              </AlertDialogAction>
            </>
          }
        />
      </AlertDialog>
    );
    const view = render(tree(true));
    const action = screen.getByRole('button', { name: 'Delete' });
    expect(action).toHaveAttribute('aria-disabled', 'true');
    await user.click(action);
    expect(click).not.toHaveBeenCalled();
    expect(change).not.toHaveBeenCalled();
    view.rerender(tree(false));
    expect(action).toHaveAttribute('aria-disabled', 'false');
    await user.click(action);
    expect(click).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('preserves explicitly disabled decisions and permits forced controlled closure', () => {
    const change = vi.fn();
    const tree = (open: boolean, pending: boolean) => (
      <AlertDialog open={open} pending={pending} onOpenChange={change}>
        <AlertDialogContent
          title='Delete?'
          description='Cannot undo.'
          actions={
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={true}>Delete</AlertDialogAction>
            </>
          }
        />
      </AlertDialog>
    );
    const view = render(tree(true, true));
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    view.rerender(tree(true, false));
    expect(screen.getByRole('button', { name: 'Delete' })).toBeDisabled();
    view.rerender(tree(false, true));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
  });

  it('blocks one Escape at the nested alert without requesting the sheet to close and restores sheet focus', async () => {
    const user = userEvent.setup();
    const sheetChange = vi.fn();
    const alertChange = vi.fn();
    function Nested() {
      const [host, setHost] = useState<HTMLDivElement | null>(null);
      const [pending, setPending] = useState(true);
      return (
        <>
          <div ref={setHost} aria-label='Host' />
          <Dialog onOpenChange={sheetChange}>
            <DialogTrigger>Open sheet</DialogTrigger>
            {host && (
              <DialogContent title='Sheet' variant='sheet' container={host}>
                <AlertDialog pending={pending} onOpenChange={alertChange}>
                  <AlertDialogTrigger>Open alert</AlertDialogTrigger>
                  <AlertDialogContent
                    title='Delete?'
                    description='Cannot undo.'
                    container={host}
                    actions={
                      <>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction>Delete</AlertDialogAction>
                      </>
                    }
                  />
                </AlertDialog>
                <button type='button' onClick={() => setPending(false)}>
                  Unlock
                </button>
              </DialogContent>
            )}
          </Dialog>
        </>
      );
    }
    render(<Nested />);
    const host = screen.getByLabelText('Host');
    await user.click(screen.getByRole('button', { name: 'Open sheet' }));
    const trigger = screen.getByRole('button', { name: 'Open alert' });
    await user.click(trigger);
    const sheetOverlay = host.querySelector('.eg-dialog-backdrop');
    const alertOverlay = host.querySelector('.eg-alert-dialog-backdrop');
    if (!sheetOverlay || !alertOverlay) {
      throw new Error('Missing same-host overlays');
    }
    expect(Array.from(host.children).indexOf(alertOverlay)).toBeGreaterThan(
      Array.from(host.children).indexOf(sheetOverlay)
    );
    sheetChange.mockClear();
    alertChange.mockClear();
    await user.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(sheetChange).not.toHaveBeenCalled();
    expect(alertChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Unlock', hidden: true }));
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(alertChange).toHaveBeenCalledExactlyOnceWith(false);
    expect(sheetChange).not.toHaveBeenCalled();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('synchronously guards a deferred action, recovers from failure, and closes deliberately on success', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const operations: { resolve: () => void; reject: () => void }[] = [];
    function AsyncExample() {
      const [open, setOpen] = useState(true);
      const [pending, setPending] = useState(false);
      const [error, setError] = useState(false);
      const inFlight = useRef(false);
      return (
        <AlertDialog
          open={open}
          pending={pending}
          onOpenChange={(next) => {
            change(next);
            setOpen(next);
          }}
        >
          <AlertDialogContent
            title='Delete?'
            description='Cannot undo.'
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
                    setError(false);
                    setPending(true);
                    new Promise<void>((resolve, reject) =>
                      operations.push({ resolve, reject: () => reject(new Error('Failed')) })
                    )
                      .then(() => {
                        inFlight.current = false;
                        setPending(false);
                        setOpen(false);
                      })
                      .catch(() => {
                        inFlight.current = false;
                        setPending(false);
                        setError(true);
                      });
                  }}
                >
                  Delete
                </AlertDialogAction>
              </>
            }
          >
            {pending && <span>Deleting…</span>}
            {error && <span>Delete failed. Try again.</span>}
          </AlertDialogContent>
        </AlertDialog>
      );
    }
    render(<AsyncExample />);
    const action = screen.getByRole('button', { name: 'Delete' });
    act(() => {
      fireEvent.click(action);
      fireEvent.click(action);
    });
    expect(operations).toHaveLength(1);
    expect(screen.getByText('Deleting…')).toBeVisible();
    expect(screen.getByRole('alertdialog')).toHaveAttribute('aria-busy', 'true');
    expect(change).not.toHaveBeenCalled();
    const first = operations[0];
    if (!first) {
      throw new Error('Missing first operation');
    }
    await act(async () => first.reject());
    expect(screen.getByText('Delete failed. Try again.')).toBeVisible();
    expect(screen.getByRole('alertdialog')).not.toHaveAttribute('aria-busy');
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(operations).toHaveLength(2);
    const second = operations[1];
    if (!second) {
      throw new Error('Missing second operation');
    }
    await act(async () => second.resolve());
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
  });
});

describe('AlertDialog dismissal boundaries', () => {
  it('keeps the dialog and its focus when the backdrop receives a pointer', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Probe onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Disconnect' }));
    const cancel = screen.getByRole('button', { name: 'Keep connected' });
    expect(cancel).toHaveFocus();
    const backdrop = document.querySelector('.eg-alert-dialog-backdrop');
    expect(backdrop).not.toBeNull();
    if (!backdrop) {
      throw new Error('Missing alert dialog backdrop');
    }
    fireEvent.pointerDown(backdrop, { button: 0, pointerType: 'mouse' });
    fireEvent.pointerUp(backdrop, { button: 0, pointerType: 'mouse' });
    fireEvent.click(backdrop);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(closeRequests(onOpenChange)).toBe(0);
    expect(cancel).toHaveFocus();
  });
  it('closes once on Escape and restores trigger focus', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<Probe onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Disconnect' });
    await user.click(trigger);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(closeRequests(onOpenChange)).toBe(1);
    await waitFor(() => expect(trigger).toHaveFocus());
  });
});
