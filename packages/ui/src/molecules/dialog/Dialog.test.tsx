import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode, useState } from 'react';
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
const dialogFullSheet: DialogContentProps = {
  title: 'Title',
  children: null,
  variant: 'sheet',
  size: 'full',
  titleOverflow: 'clamp',
  actionsPlacement: 'header'
};
// @ts-expect-error Sheet size accepts full, not the centered md preset.
const dialogMediumSheet: DialogContentProps = { title: 'Title', children: null, variant: 'sheet', size: 'md' };
// @ts-expect-error Sheet size accepts full, not the centered lg preset.
const dialogLargeSheet: DialogContentProps = { title: 'Title', children: null, variant: 'sheet', size: 'lg' };
// @ts-expect-error Title clamping is a sheet-only option.
const dialogCenteredClamp: DialogContentProps = { title: 'Title', children: null, titleOverflow: 'clamp' };
// @ts-expect-error Action placement is a sheet-only option.
const dialogCenteredHeader: DialogContentProps = { title: 'Title', children: null, actionsPlacement: 'header' };
const dialogContainer: DialogContentProps = { title: 'Title', children: null, container: document.body };
const dialogViewportHost: DialogContentProps = {
  title: 'Title',
  children: null,
  container: document.body,
  overlayScope: 'viewport',
  bodyPadding: 'compact'
};
const dialogContainerHost: DialogContentProps = {
  title: 'Title',
  children: null,
  container: document.body,
  overlayScope: 'container',
  variant: 'sheet'
};
const dialogNullHost: DialogContentProps = {
  title: 'Title',
  children: null,
  container: null,
  overlayScope: 'viewport'
};
// @ts-expect-error Container scope requires a non-null host.
const dialogMissingHost: DialogContentProps = { title: 'Title', children: null, overlayScope: 'container' };
// @ts-expect-error Null is not a host for container scope.
const dialogInvalidNullHost: DialogContentProps = {
  title: 'Title',
  children: null,
  container: null,
  overlayScope: 'container'
};
// @ts-expect-error Body padding accepts only the documented presets.
const dialogInvalidPadding: DialogContentProps = { title: 'Title', children: null, bodyPadding: 'small' };
// @ts-expect-error Trigger is always a type=button control.
const dialogTriggerType: DialogTriggerProps = { children: 'Open', type: 'submit' };
// @ts-expect-error Slotted close requires an element.
const dialogCloseText: DialogCloseProps = { asChild: true, children: 'Close' };
void [
  dialogRootId,
  dialogSheetSize,
  dialogFullSheet,
  dialogMediumSheet,
  dialogLargeSheet,
  dialogCenteredClamp,
  dialogCenteredHeader,
  dialogMissingTitle,
  dialogStyle,
  dialogRole,
  dialogDescription,
  dialogContainer,
  dialogViewportHost,
  dialogContainerHost,
  dialogNullHost,
  dialogMissingHost,
  dialogInvalidNullHost,
  dialogInvalidPadding,
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

function HostedExample({
  overlayScope,
  onOpenChange
}: {
  overlayScope?: 'viewport' | 'container';
  onOpenChange?: (open: boolean) => void;
}) {
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  return (
    <>
      <div aria-label='Outside content'>Outside content</div>
      <div ref={setHost} className='relative' aria-label='Dialog host' />
      <Dialog onOpenChange={onOpenChange}>
        <DialogTrigger>Open hosted dialog</DialogTrigger>
        {host && (
          <DialogContent title='Hosted' container={host} overlayScope={overlayScope}>
            <input aria-label='Hosted input' />
          </DialogContent>
        )}
      </Dialog>
    </>
  );
}

describe('Dialog sheet layout opt-ins', () => {
  const title = 'A long complete title for a sheet that stays available as its accessible name';

  function content(options: Record<string, unknown>, actions: ReactNode = <button type='button'>Apply</button>) {
    const props = {
      title,
      children: (
        <>
          <p>{title}</p>
          <input aria-label='Body field' />
        </>
      ),
      variant: 'sheet',
      actions,
      ...options
    };
    return <DialogContent {...(props as unknown as DialogContentProps)} />;
  }

  it('fills a sheet only when full is selected and preserves the omitted sheet cap', () => {
    const { rerender } = render(<Dialog defaultOpen={true}>{content({})}</Dialog>);
    expect(screen.getByRole('dialog')).toHaveClass('max-w-[calc(var(--space-24)*4)]');
    rerender(<Dialog defaultOpen={true}>{content({ size: 'full' })}</Dialog>);
    const panel = screen.getByRole('dialog', { name: title });
    expect(panel).toHaveClass('max-w-none');
    expect(panel).not.toHaveClass('max-w-[calc(var(--space-24)*4)]');
    expect(panel.querySelector('footer')).toContainElement(screen.getByRole('button', { name: 'Apply' }));
    expect(panel.querySelector('h2')).not.toHaveClass('line-clamp-2');
  });

  it('clamps only the title while keeping its complete name and the consumer-owned visible route', () => {
    render(<Dialog defaultOpen={true}>{content({ titleOverflow: 'clamp' })}</Dialog>);
    const panel = screen.getByRole('dialog', { name: title });
    const heading = screen.getByRole('heading', { name: title });
    expect(heading).toHaveTextContent(title);
    expect(heading).toHaveClass('line-clamp-2');
    expect(panel.querySelector('.eg-dialog__body')).toHaveTextContent(title);
    expect(panel.querySelector('footer')).toContainElement(screen.getByRole('button', { name: 'Apply' }));
    expect(panel).not.toHaveAttribute('titleoverflow');
    expect(panel).not.toHaveClass('max-w-none');
  });

  it('moves actions once ahead of the body without changing their activation or the final close', async () => {
    const click = vi.fn();
    render(
      <Dialog defaultOpen={true}>
        {content(
          { actionsPlacement: 'header' },
          <button type='button' onClick={click}>
            Apply
          </button>
        )}
      </Dialog>
    );
    const panel = screen.getByRole('dialog', { name: title });
    const action = screen.getByRole('button', { name: 'Apply' });
    const header = panel.querySelector('header');
    const part = action.closest<HTMLElement>('.eg-dialog__foot');
    expect(header).toContainElement(part);
    expect(part?.tagName).toBe('DIV');
    expect(part).not.toHaveAttribute('role');
    expect(panel.querySelector('footer')).toBeNull();
    expect(screen.getAllByRole('button', { name: 'Apply' })).toHaveLength(1);
    expect(
      action.compareDocumentPosition(screen.getByRole('textbox', { name: 'Body field' })) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
    expect(panel.lastElementChild).toBe(screen.getByRole('button', { name: 'Close' }));
    expect(panel).not.toHaveAttribute('actionsplacement');
    const user = userEvent.setup();
    expect(action).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Body field' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab();
    expect(action).toHaveFocus();
    await user.click(action);
    expect(click).toHaveBeenCalledOnce();
  });

  it.each([null, undefined])('omits a header action part for nullish value %s', (actions) => {
    render(<Dialog defaultOpen={true}>{content({ actionsPlacement: 'header', actions })}</Dialog>);
    expect(screen.getByRole('dialog').querySelector('.eg-dialog__foot')).toBeNull();
  });

  it.each([false, 0, ''])('retains the existing non-nullish action part for %j', (actions) => {
    render(<Dialog defaultOpen={true}>{content({ actionsPlacement: 'header', actions })}</Dialog>);
    const panel = screen.getByRole('dialog');
    expect(panel.querySelector('header .eg-dialog__foot')).toBeInTheDocument();
    expect(panel.querySelector('footer')).toBeNull();
  });

  it('gives opt-in sheets a bounded body basis without changing default or full-only sheets', () => {
    const { rerender } = render(<Dialog defaultOpen={true}>{content({})}</Dialog>);
    expect(screen.getByRole('dialog').querySelector('.eg-dialog__body')).not.toHaveClass('basis-0');
    rerender(<Dialog defaultOpen={true}>{content({ size: 'full' })}</Dialog>);
    expect(screen.getByRole('dialog').querySelector('.eg-dialog__body')).not.toHaveClass('basis-0');
    for (const options of [{ titleOverflow: 'clamp' }, { actionsPlacement: 'header' }]) {
      rerender(<Dialog defaultOpen={true}>{content(options)}</Dialog>);
      expect(screen.getByRole('dialog').querySelector('.eg-dialog__body')).toHaveClass('basis-0');
    }
  });

  it('combines the independent options and rerenders without emitting open-change requests or leaking props', () => {
    const change = vi.fn();
    const { rerender } = render(
      <Dialog open={true} onOpenChange={change}>
        {content({})}
      </Dialog>
    );
    rerender(
      <Dialog open={true} onOpenChange={change}>
        {content({ size: 'full', titleOverflow: 'clamp', actionsPlacement: 'header' })}
      </Dialog>
    );
    const panel = screen.getByRole('dialog', { name: title });
    expect(panel).toHaveClass('max-w-none');
    expect(screen.getByRole('heading', { name: title })).toHaveClass('line-clamp-2');
    expect(panel.querySelector('header')).toContainElement(screen.getByRole('button', { name: 'Apply' }));
    for (const node of [panel, ...panel.querySelectorAll('*')]) {
      for (const attribute of ['titleoverflow', 'actionsplacement', 'size']) {
        expect(node).not.toHaveAttribute(attribute);
      }
    }
    expect(change).not.toHaveBeenCalled();
  });

  it('falls back for invalid untyped sheet inputs and ignores sheet-only inputs for centered dialogs', () => {
    const { rerender } = render(
      <Dialog defaultOpen={true}>
        {content({ size: 'sm', titleOverflow: 'unknown', actionsPlacement: 'unknown' })}
      </Dialog>
    );
    let panel = screen.getByRole('dialog', { name: title });
    expect(panel).toHaveClass('max-w-[calc(var(--space-24)*4)]');
    expect(panel.querySelector('h2')).not.toHaveClass('line-clamp-2');
    expect(panel.querySelector('footer')).toContainElement(screen.getByRole('button', { name: 'Apply' }));
    expect(panel).not.toHaveAttribute('titleoverflow');
    expect(panel).not.toHaveAttribute('actionsplacement');
    rerender(
      <Dialog defaultOpen={true}>
        {content({ variant: 'centered', size: 'lg', titleOverflow: 'clamp', actionsPlacement: 'header' })}
      </Dialog>
    );
    panel = screen.getByRole('dialog', { name: title });
    expect(panel).toHaveClass('max-w-[calc(var(--space-24)*10)]');
    expect(panel.querySelector('h2')).not.toHaveClass('line-clamp-2');
    expect(panel.querySelector('footer')).toContainElement(screen.getByRole('button', { name: 'Apply' }));
    expect(panel).not.toHaveAttribute('titleoverflow');
    expect(panel).not.toHaveAttribute('actionsplacement');
  });
});

describe('Dialog placement and compact body', () => {
  it.each(['omitted', 'null'] as const)('keeps %s host in the body with viewport defaults', (host) => {
    render(
      <Dialog defaultOpen={true}>
        <DialogContent title='Defaults' {...(host === 'null' ? { container: null } : {})}>
          Body
        </DialogContent>
      </Dialog>
    );
    const panel = screen.getByRole('dialog', { name: 'Defaults' });
    const overlay = panel.closest('.eg-dialog-backdrop');
    expect(overlay?.parentElement).toBe(document.body);
    expect(overlay).toHaveClass('fixed', 'inset-0');
    expect(overlay).not.toHaveClass('absolute');
    expect(panel.querySelector('.eg-dialog__body')).toHaveClass('min-h-0', 'overflow-y-auto', 'p-[var(--space-6)]');
    expect(panel).toHaveClass('eg-dialog', 'bg-surface-2');
  });

  it.each(['derived', 'container'] as const)('mounts %s container scope in the host', async (scope) => {
    const user = userEvent.setup();
    render(<HostedExample overlayScope={scope === 'container' ? 'container' : undefined} />);
    await user.click(screen.getByRole('button', { name: 'Open hosted dialog' }));
    const panel = screen.getByRole('dialog', { name: 'Hosted' });
    const overlay = panel.closest('.eg-dialog-backdrop');
    expect(overlay?.parentElement).toBe(screen.getByLabelText('Dialog host', { selector: 'div' }));
    expect(overlay).toContainElement(panel);
    expect(overlay).toHaveClass('absolute', 'inset-0');
    expect(overlay).not.toHaveClass('fixed');
    for (const node of [overlay, panel, ...panel.querySelectorAll('*')]) {
      for (const attribute of ['container', 'overlayscope', 'bodypadding']) {
        expect(node).not.toHaveAttribute(attribute);
      }
    }
  });

  it('keeps a custom viewport-scoped portal fixed', async () => {
    const user = userEvent.setup();
    render(<HostedExample overlayScope='viewport' />);
    await user.click(screen.getByRole('button', { name: 'Open hosted dialog' }));
    const overlay = screen.getByRole('dialog').closest('.eg-dialog-backdrop');
    expect(overlay?.parentElement).toBe(screen.getByLabelText('Dialog host', { selector: 'div' }));
    expect(overlay).toHaveClass('fixed', 'inset-0');
    expect(overlay).not.toHaveClass('absolute');
  });

  it('blocks untyped container scope with a null host instead of portalling into body', () => {
    const invalid = {
      title: 'Blocked',
      children: 'Body',
      container: null,
      overlayScope: 'container'
    } as unknown as DialogContentProps;
    render(
      <Dialog defaultOpen={true}>
        <DialogContent {...invalid} />
      </Dialog>
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(document.querySelector('.eg-dialog-backdrop')).toBeNull();
  });

  it('changes only body padding and keeps header, footer and scrolling classes', () => {
    const { rerender } = render(
      <Dialog defaultOpen={true}>
        <DialogContent title='Form' actions={<button type='button'>Save</button>}>
          Body
        </DialogContent>
      </Dialog>
    );
    const panel = screen.getByRole('dialog');
    const header = panel.querySelector('header')?.className;
    const footer = panel.querySelector('footer')?.className;
    expect(panel.querySelector('.eg-dialog__body')).toHaveClass('p-[var(--space-6)]');
    rerender(
      <Dialog defaultOpen={true}>
        <DialogContent title='Form' bodyPadding='compact' actions={<button type='button'>Save</button>}>
          Body
        </DialogContent>
      </Dialog>
    );
    const compact = screen.getByRole('dialog');
    expect(compact.querySelector('header')?.className).toBe(header);
    expect(compact.querySelector('footer')?.className).toBe(footer);
    expect(compact.querySelector('.eg-dialog__body')).toHaveClass('min-h-0', 'overflow-y-auto', 'p-[var(--space-3)]');
    expect(compact.querySelector('.eg-dialog__body')).not.toHaveClass('p-[var(--space-6)]');
    expect(compact).not.toHaveAttribute('bodypadding');
    expect(compact.querySelector('footer')).toContainElement(screen.getByRole('button', { name: 'Save' }));
  });

  it('traps focus, hides the outside sibling, and restores focus and background after Escape', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<HostedExample onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Open hosted dialog' });
    const outside = screen.getByText('Outside content');
    await user.click(trigger);
    expect(outside).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('textbox', { name: 'Hosted input' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Hosted input' })).toHaveFocus();
    onOpenChange.mockClear();
    await user.keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
    expect(outside).not.toHaveAttribute('aria-hidden');
  });

  it('dismisses a hosted scrim click', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(<HostedExample onOpenChange={onOpenChange} />);
    const trigger = screen.getByRole('button', { name: 'Open hosted dialog' });
    await user.click(trigger);
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const scrim = screen.getByRole('dialog').closest('.eg-dialog-backdrop');
    if (!scrim) {
      throw new Error('Missing hosted scrim');
    }
    onOpenChange.mockClear();
    fireEvent.pointerDown(scrim, { button: 0, pointerType: 'mouse' });
    fireEvent.click(scrim);
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('requests a controlled hosted close once without changing open state', async () => {
    const host = document.createElement('div');
    const { container } = render(<div />);
    container.append(host);
    const change = vi.fn();
    const content = (
      <DialogContent title='Controlled host' container={host}>
        Body
      </DialogContent>
    );
    const { rerender } = render(
      <Dialog open={true} onOpenChange={change}>
        {content}
      </Dialog>
    );
    await userEvent.setup().keyboard('{Escape}');
    expect(change).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    change.mockClear();
    rerender(
      <Dialog open={false} onOpenChange={change}>
        {content}
      </Dialog>
    );
    expect(change).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});

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
      'top-[calc(var(--space-4)+(var(--text-heading-small)*var(--text-heading-small--line-height)-var(--space-12))/2)]',
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
  it('requests controlled Escape while retaining the modal and updates description on rerender', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent title='Account' description='First'>
          Body
        </DialogContent>
      </Dialog>
    );
    const modal = screen.getByRole('dialog', { name: 'Account', description: 'First' });
    await userEvent.setup().keyboard('{Escape}');
    expect(onOpenChange).toHaveBeenCalledOnce();
    expect(onOpenChange).toHaveBeenCalledWith(false);
    expect(modal).toBeInTheDocument();
    rerender(
      <Dialog open={true} onOpenChange={onOpenChange}>
        <DialogContent title='Account'>Body</DialogContent>
      </Dialog>
    );
    expect(screen.getByRole('dialog', { name: 'Account' })).not.toHaveAttribute('aria-describedby');
  });
});
