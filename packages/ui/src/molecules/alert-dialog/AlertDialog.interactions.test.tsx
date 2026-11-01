import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
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
