import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Dialog, DialogClose, DialogContent, DialogTrigger } from '.';
import type { DialogCloseProps, DialogContentProps, DialogProps, DialogTriggerProps } from './types';
import { dialogPanelVariants, dialogScrimVariants } from './types';

// Compile-time fixtures protect the public boundary; these are never rendered.
// @ts-expect-error Modal root does not accept native DOM attributes.
const dialogRootId: DialogProps = { children: null, id: 'invalid' };
// @ts-expect-error Sheet does not accept centered size presets.
const dialogSheetSize: DialogContentProps = { title: 'Title', children: null, variant: 'sheet', size: 'sm' };
// @ts-expect-error Content requires a title.
const dialogMissingTitle: DialogContentProps = { children: null };
// @ts-expect-error Content does not accept inline appearance styles.
const dialogStyle: DialogContentProps = { title: 'Title', children: null, style: {} };
// @ts-expect-error Content owns its dialog role.
const dialogRole: DialogContentProps = { title: 'Title', children: null, role: 'alert' };
// @ts-expect-error Content owns its description relationship.
const dialogDescription: DialogContentProps = { title: 'Title', children: null, 'aria-describedby': 'other' };
// @ts-expect-error Content does not expose a portal container.
const dialogContainer: DialogContentProps = { title: 'Title', children: null, container: document.body };
// @ts-expect-error Trigger is always a type=button control.
const dialogTriggerType: DialogTriggerProps = { children: 'Open', type: 'submit' };
// @ts-expect-error Slotted close requires an element.
const dialogCloseText: DialogCloseProps = { asChild: true, children: 'Close' };
void [
  dialogRootId,
  dialogSheetSize,
  dialogMissingTitle,
  dialogStyle,
  dialogRole,
  dialogDescription,
  dialogContainer,
  dialogTriggerType,
  dialogCloseText
];

function Example() {
  return (
    <Dialog>
      <DialogTrigger>Open settings</DialogTrigger>
      <DialogContent
        title='Settings'
        description='Adjust preferences'
        statusText='Saved'
        actions={<DialogClose>Done</DialogClose>}
      >
        <input aria-label='Name' />
      </DialogContent>
    </Dialog>
  );
}

describe('Dialog public behavior', () => {
  it.each(['{Enter}', ' '])('opens and closes with keyboard %s and restores focus', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open settings' });
    trigger.focus();
    await user.keyboard(key);
    const close = screen.getByRole('button', { name: 'Done' });
    close.focus();
    await user.keyboard(key);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it('dismisses on scrim interaction and restores focus', async () => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open settings' });
    await user.click(trigger);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const scrim = document.querySelector('.eg-dialog-backdrop');
    expect(scrim).not.toBeNull();
    if (!scrim) {
      throw new Error('Missing scrim');
    }
    fireEvent.pointerDown(scrim, { button: 0, pointerType: 'mouse' });
    fireEvent.click(scrim);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it('forwards refs through slotted controls and keeps one button per control', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const closeRef = createRef<HTMLButtonElement>();
    render(
      <Dialog>
        <DialogTrigger asChild={true} ref={triggerRef}>
          <button type='button'>Open</button>
        </DialogTrigger>
        <DialogContent title='Settings'>
          <DialogClose asChild={true} ref={closeRef}>
            <button type='button'>Done</button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
    expect(triggerRef.current).toBe(screen.getByRole('button', { name: 'Open' }));
    await user.click(triggerRef.current as HTMLButtonElement);
    expect(closeRef.current).toBe(screen.getByRole('button', { name: 'Done' }));
    expect(document.querySelector('button button')).toBeNull();
    await user.click(closeRef.current as HTMLButtonElement);
    await waitFor(() => expect(triggerRef.current).toHaveFocus());
  });
  it.each([
    ['sm', 'max-w-[calc(var(--space-24)*5)]'],
    ['md', 'max-w-[calc(var(--space-20)*8)]'],
    ['lg', 'max-w-[calc(var(--space-24)*10)]'],
    ['full', 'max-w-none']
  ] as const)('uses centered size %s', (size, width) => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent title='Size' size={size}>
          Body
        </DialogContent>
      </Dialog>
    );
    expect(screen.getByRole('dialog')).toHaveClass(width);
  });
  it('places passive status and description in the header and actions in the footer', async () => {
    render(<Example />);
    await userEvent.setup().click(screen.getByRole('button', { name: 'Open settings' }));
    const dialog = screen.getByRole('dialog', { description: 'Adjust preferences' });
    expect(dialog.querySelector('header')).toHaveClass('border-b-0');
    expect(dialog.querySelector('header')).toContainElement(screen.getByText('Saved'));
    expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
      'absolute',
      'top-[var(--space-4)]',
      'end-[var(--space-4)]'
    );
    expect(dialog.querySelector('header')).toContainElement(screen.getByText('Adjust preferences'));
    expect(dialog.querySelector('footer')).toContainElement(screen.getByRole('button', { name: 'Done' }));
  });
  it('merges recognized caller classes last while retaining unrelated material', () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent title='Merge' className='mt-2 mt-4'>
          Body
        </DialogContent>
      </Dialog>
    );
    const panel = screen.getByRole('dialog');
    expect(panel).toHaveClass('mt-4', 'bg-surface-2', 'eg-dialog');
    expect(panel).not.toHaveClass('mt-2');
  });
  it('keeps shared recipes marker-free and rejects unsupported native types', () => {
    expect(dialogScrimVariants()).not.toContain('eg-dialog');
    expect(dialogPanelVariants({ variant: 'sheet' })).not.toContain('eg-dialog');
    expectTypeOf<DialogContentProps>().not.toHaveProperty('style');
    expectTypeOf<DialogContentProps>().not.toHaveProperty('role');
    expectTypeOf<DialogTriggerProps>().not.toHaveProperty('type');
  });
  it('opens a labelled body portal and restores focus after Escape', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open settings' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Settings', description: 'Adjust preferences' });
    expect(container).not.toContainElement(dialog);
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByText('Saved')).not.toHaveAttribute('aria-live');
    expect(screen.getByRole('textbox')).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });
  it('traps focus and dismisses with the built-in close', async () => {
    const user = userEvent.setup();
    render(<Example />);
    await user.click(screen.getByRole('button', { name: 'Open settings' }));
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('textbox')).toHaveFocus();
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
  it('omits description and footer and preserves supported layout merges', () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent title='Info' className='mt-4'>
          Body
        </DialogContent>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog', { name: 'Info' });
    expect(dialog).not.toHaveAttribute('aria-describedby');
    expect(dialog).toHaveClass('mt-4', 'eg-dialog', 'bg-surface-2');
    expect(dialog.querySelector('.eg-dialog__foot')).toBeNull();
  });
  it('requests controlled closure without echoing prop updates', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(
      <Dialog open={true} onOpenChange={change}>
        <DialogContent title='Info'>Body</DialogContent>
      </Dialog>
    );
    await user.click(screen.getByRole('button', { name: 'Close' }));
    expect(change).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    change.mockClear();
    rerender(
      <Dialog open={false} onOpenChange={change}>
        <DialogContent title='Info'>Body</DialogContent>
      </Dialog>
    );
    expect(change).not.toHaveBeenCalled();
  });
  it('exposes sheet and reduced-motion classes', () => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent title='Sheet' variant='sheet'>
          Body
        </DialogContent>
      </Dialog>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('motion-reduce:transition-none');
    expect(dialog).toHaveClass('rounded-none');
    expectTypeOf<{
      variant: 'sheet';
      size: 'sm';
      title: string;
      children: string;
    }>().not.toMatchTypeOf<DialogContentProps>();
  });
});
