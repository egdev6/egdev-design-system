import { composeStory } from '@storybook/react-vite';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogTrigger } from '.';
import meta, { PendingAction } from './AlertDialog.stories';
import type { AlertDialogContentProps, AlertDialogTriggerProps } from './types';

// @ts-expect-error Description is required.
const missingDescription: AlertDialogContentProps = { title: 'Title', actions: null };
// @ts-expect-error Content owns its role.
const role: AlertDialogContentProps = { title: 'Title', description: 'Description', actions: null, role: 'dialog' };
// @ts-expect-error Trigger always uses type button.
const triggerType: AlertDialogTriggerProps = { children: 'Open', type: 'submit' };
// @ts-expect-error Slotted controls require an element.
const slotted: AlertDialogTriggerProps = { asChild: true, children: 'Open' };
// @ts-expect-error Content requires actions.
const missingActions: AlertDialogContentProps = { title: 'Title', description: 'Description' };
// @ts-expect-error Content does not accept inline styles.
const style: AlertDialogContentProps = { title: 'Title', description: 'Description', actions: null, style: {} };
const describedBy: AlertDialogContentProps = {
  title: 'Title',
  description: 'Description',
  actions: null,
  // @ts-expect-error Content owns its description relationship.
  'aria-describedby': 'other'
};
// @ts-expect-error There is no size axis.
const size: AlertDialogContentProps = { title: 'Title', description: 'Description', actions: null, size: 'sm' };
// @ts-expect-error The root has no DOM props.
const rootId: import('./types').AlertDialogProps = { children: null, id: 'invalid' };
const variant: AlertDialogContentProps = {
  title: 'Title',
  description: 'Description',
  actions: null,
  // @ts-expect-error The content has no variant axis.
  variant: 'sheet'
};
// @ts-expect-error The trigger disallows inline styles.
const triggerStyle: AlertDialogTriggerProps = { children: 'Open', style: {} };
void [
  missingDescription,
  role,
  triggerType,
  slotted,
  missingActions,
  style,
  describedBy,
  size,
  rootId,
  variant,
  triggerStyle
];

function Example({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  return (
    <AlertDialog onOpenChange={onOpenChange}>
      <AlertDialogTrigger>Open</AlertDialogTrigger>
      <AlertDialogContent
        title='Disconnect'
        description='Access will be removed.'
        actions={
          <>
            <AlertDialogCancel>Keep connected</AlertDialogCancel>
            <AlertDialogAction>Disconnect</AlertDialogAction>
          </>
        }
      />
    </AlertDialog>
  );
}

describe('AlertDialog public behavior', () => {
  it.each(['{Enter}', ' '])('opens using keyboard %s and focuses Cancel', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    trigger.focus();
    await user.keyboard(key);
    expect(screen.getByRole('alertdialog', { name: 'Disconnect' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Keep connected' })).toHaveFocus();
  });
  it('keeps independent instances and unique accessible relationships', async () => {
    const user = userEvent.setup();
    function Item({ label }: { label: string }) {
      return (
        <AlertDialog>
          <AlertDialogTrigger>{`Open ${label}`}</AlertDialogTrigger>
          <AlertDialogContent
            title={label}
            description={`${label} description`}
            actions={
              <>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Proceed</AlertDialogAction>
              </>
            }
          />
        </AlertDialog>
      );
    }
    render(
      <>
        <Item label='First' />
        <Item label='Second' />
      </>
    );
    await user.click(screen.getByRole('button', { name: 'Open First' }));
    const first = screen.getByRole('alertdialog', { name: 'First', description: 'First description' });
    const firstTitle = first.getAttribute('aria-labelledby');
    const firstDescription = first.getAttribute('aria-describedby');
    await user.click(within(first).getByRole('button', { name: 'Cancel' }));
    await user.click(screen.getByRole('button', { name: 'Open Second' }));
    const second = screen.getByRole('alertdialog', { name: 'Second', description: 'Second description' });
    expect(second.getAttribute('aria-labelledby')).not.toBe(firstTitle);
    expect(second.getAttribute('aria-describedby')).not.toBe(firstDescription);
    expect(screen.queryByRole('alertdialog', { name: 'First' })).not.toBeInTheDocument();
  });
  it('uses defaultOpen only on initial mount', async () => {
    const user = userEvent.setup();
    const content = (
      <AlertDialogContent
        title='Question'
        description='Decide.'
        actions={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Proceed</AlertDialogAction>
          </>
        }
      />
    );
    const { rerender } = render(<AlertDialog defaultOpen={true}>{content}</AlertDialog>);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    rerender(<AlertDialog defaultOpen={true}>{content}</AlertDialog>);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
  it('keeps the PendingAction story open and loading until the operation completes', async () => {
    const user = userEvent.setup();
    const Story = composeStory(PendingAction, meta);
    render(<Story />);
    await user.click(screen.getByRole('button', { name: 'Disconnect' }));
    const modal = screen.getByRole('alertdialog');
    const action = within(modal).getByRole('button', { name: 'Disconnect' });
    await user.click(action);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    expect(action).toHaveAttribute('data-state', 'loading');
    await user.keyboard('{Escape}');
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument(), { timeout: 3000 });
  });
  it('preserves neutral and danger panel material, native attributes and action order', () => {
    const actions = (
      <>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction>Proceed</AlertDialogAction>
      </>
    );
    const { rerender } = render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent
          title='Question'
          description='Decide.'
          id='panel-id'
          data-testid='panel'
          actions={actions}
        />
      </AlertDialog>
    );
    const panel = screen.getByRole('alertdialog');
    expect(panel).toHaveAttribute('id', 'panel-id');
    expect(panel).toHaveClass('bg-surface-2');
    expect(panel.querySelector('header svg')).toBeNull();
    expect(
      within(panel)
        .getAllByRole('button')
        .map((button) => button.textContent)
    ).toEqual(['Cancel', 'Proceed']);
    rerender(
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent title='Question' description='Decide.' tone='danger' id='panel-id' actions={actions} />
      </AlertDialog>
    );
    expect(screen.getByRole('alertdialog')).toHaveClass('bg-surface-2');
    expect(screen.getByRole('alertdialog').querySelector('header svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('restores focus on Cancel and traps focus among actions', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    const cancel = screen.getByRole('button', { name: 'Keep connected' });
    const action = screen.getByRole('button', { name: 'Disconnect' });
    expect(cancel).toHaveFocus();
    await user.tab({ shift: true });
    expect(action).toHaveFocus();
    await user.tab();
    expect(cancel).toHaveFocus();
    await user.click(cancel);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it('requests controlled closure without echoing incoming visibility changes', async () => {
    const change = vi.fn();
    const content = (
      <AlertDialogContent
        title='Delete'
        description='Cannot undo.'
        actions={
          <>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Delete</AlertDialogAction>
          </>
        }
      />
    );
    const { rerender } = render(
      <AlertDialog open={true} onOpenChange={change}>
        {content}
      </AlertDialog>
    );
    await userEvent.setup().keyboard('{Escape}');
    expect(change).toHaveBeenCalledWith(false);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    change.mockClear();
    rerender(
      <AlertDialog open={false} onOpenChange={change}>
        {content}
      </AlertDialog>
    );
    expect(change).not.toHaveBeenCalled();
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
  });
  it('forwards native decision refs and prevents disabled activation', async () => {
    const cancelRef = createRef<HTMLButtonElement>();
    const actionRef = createRef<HTMLButtonElement>();
    const change = vi.fn();
    render(
      <AlertDialog defaultOpen={true} onOpenChange={change}>
        <AlertDialogContent
          title='Delete'
          description='Cannot undo.'
          actions={
            <>
              <AlertDialogCancel ref={cancelRef}>Cancel</AlertDialogCancel>
              <AlertDialogAction disabled={true} ref={actionRef}>
                Delete
              </AlertDialogAction>
            </>
          }
        />
      </AlertDialog>
    );
    expect(cancelRef.current).toBe(screen.getByRole('button', { name: 'Cancel' }));
    expect(actionRef.current).toBeDisabled();
    await userEvent.setup().click(actionRef.current as HTMLButtonElement);
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });
  it('gives plain decision controls the system Button target and focus treatment', () => {
    render(<Example />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    for (const name of ['Keep connected', 'Disconnect']) {
      const button = screen.getByRole('button', { name });
      expect(button).toHaveClass('eg-btn', 'min-h-12', 'focus-visible:[box-shadow:var(--shadow-focus)]');
      expect(button).toHaveAttribute('type', 'button');
    }
  });
  it('opens a labelled modal, focuses cancel, ignores outside pointer and restores focus on Escape', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { container } = render(<Example onOpenChange={change} />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    await user.click(trigger);
    const dialog = screen.getByRole('alertdialog', { name: 'Disconnect', description: 'Access will be removed.' });
    expect(container).not.toContainElement(dialog);
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Keep connected' })).toHaveFocus();
    change.mockClear();
    const overlay = document.querySelector('.eg-alert-dialog-backdrop');
    if (!overlay) {
      throw new Error('Missing overlay');
    }
    fireEvent.pointerDown(overlay, { button: 0, pointerType: 'mouse' });
    fireEvent.click(overlay);
    expect(change).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Keep connected' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(change).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it('runs action before close and composes slotted controls', async () => {
    const user = userEvent.setup();
    const calls: string[] = [];
    render(
      <AlertDialog defaultOpen={true} onOpenChange={() => calls.push('close')}>
        <AlertDialogContent
          title='Delete'
          description='Cannot undo.'
          actions={
            <>
              <AlertDialogCancel asChild={true}>
                <button type='button'>Cancel</button>
              </AlertDialogCancel>
              <AlertDialogAction asChild={true}>
                <button type='button' onClick={() => calls.push('action')}>
                  Delete
                </button>
              </AlertDialogAction>
            </>
          }
        />
      </AlertDialog>
    );
    expect(document.querySelector('button button')).toBeNull();
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(calls).toEqual(['action', 'close']);
  });
  it('uses danger icon, shared sm material and supported last-merged layout classes', () => {
    render(
      <AlertDialog defaultOpen={true}>
        <AlertDialogContent
          title='Delete'
          description='Cannot undo.'
          tone='danger'
          className='mt-2 mt-4'
          actions={
            <>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Delete</AlertDialogAction>
            </>
          }
        >
          Details
        </AlertDialogContent>
      </AlertDialog>
    );
    const panel = screen.getByRole('alertdialog');
    expect(panel).toHaveClass('eg-alert-dialog', 'bg-surface-2', 'max-w-[calc(var(--space-24)*5)]', 'mt-4');
    expect(panel).not.toHaveClass('mt-2', 'eg-dialog');
    expect(panel.querySelector('svg')).toBeInTheDocument();
    expect(panel.querySelector('.eg-alert-dialog__body')).toHaveTextContent('Details');
  });
});
