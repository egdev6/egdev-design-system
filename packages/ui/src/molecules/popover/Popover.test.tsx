import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { usePopoverContent } from '@/molecules/popover/usePopover';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '.';
import type { PopoverContentProps, PopoverProps } from './types';

function Example(props: Omit<PopoverProps, 'children'>) {
  return (
    <Popover {...props}>
      <PopoverTrigger>Display settings</PopoverTrigger>
      <PopoverContent label='Display settings'>
        <label>
          Display name
          <input defaultValue='Desk' />
        </label>
        <button type='button'>Apply</button>
        <PopoverClose>Close settings</PopoverClose>
      </PopoverContent>
    </Popover>
  );
}

describe('Popover public contract', () => {
  it('excludes consumer Content id under A1', () => {
    expectTypeOf<PopoverContentProps>().not.toHaveProperty('id');
  });
  it('starts closed, ignores hover/focus and opens a named body portal with owned relationships', async () => {
    const user = userEvent.setup();
    const { container } = render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Display settings' });
    expect(trigger).toHaveAttribute('type', 'button');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.hover(trigger);
    trigger.focus();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Display settings' });
    expect(container).not.toContainElement(dialog);
    expect(document.body).toContainElement(dialog);
    expect(dialog).toHaveClass('eg-popover', 'eg-surface');
    expect(dialog).not.toHaveAttribute('aria-modal');
    expect(dialog).toHaveAttribute('data-side', 'bottom');
    expect(dialog).toHaveAttribute('data-align', 'start');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('data-state', 'open');
    expect(screen.getByRole('textbox', { name: 'Display name' })).toHaveFocus();
    await user.click(trigger);
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it.each(['{Enter}', ' '])('activates with %s and restores focus after Escape', async (key) => {
    const user = userEvent.setup();
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Display settings' });
    trigger.focus();
    await user.keyboard(key);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it.each([false, true])('cycles Tab in modal=%s, closes explicitly and restores trigger focus', async (modal) => {
    const user = userEvent.setup();
    render(<Example modal={modal} defaultOpen={true} />);
    const first = screen.getByRole('textbox');
    const close = screen.getByRole('button', { name: 'Close settings' });
    expect(first).toHaveFocus();
    await user.tab({ shift: true });
    expect(close).toHaveFocus();
    await user.tab();
    expect(first).toHaveFocus();
    await user.click(close);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Display settings' })).toHaveFocus());
  });

  it('focuses the Content container when there are no tabbable children', () => {
    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Details</PopoverTrigger>
        <PopoverContent label='Details'>Read-only explanation</PopoverContent>
      </Popover>
    );
    expect(screen.getByRole('dialog', { name: 'Details' })).toHaveFocus();
  });

  it('does not implicitly close for an ordinary action or form submission', async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Settings</PopoverTrigger>
        <PopoverContent label='Settings'>
          <form onSubmit={submit}>
            <button type='submit'>Apply</button>
            <PopoverClose>Close</PopoverClose>
          </form>
        </PopoverContent>
      </Popover>
    );
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(submit).toHaveBeenCalledOnce();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveAttribute('type', 'button');
  });

  it.each(['pointer', 'focus'])('non-modal outside %s dismisses without stealing outside focus', async (kind) => {
    const user = userEvent.setup();
    render(
      <>
        <Example defaultOpen={true} />
        <button type='button'>Outside</button>
      </>
    );
    const outside = screen.getByRole('button', { name: 'Outside' });
    if (kind === 'pointer') {
      await user.click(outside);
    } else {
      outside.focus();
    }
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    await waitFor(() => expect(outside).toHaveFocus());
  });

  it('modal derives aria-modal, hides outside content and contains attempted outside focus', async () => {
    render(
      <>
        <Example modal={true} defaultOpen={true} />
        <button type='button'>Outside</button>
      </>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.queryByRole('button', { name: 'Outside' })).not.toBeInTheDocument();
    const outside = screen.getByRole('button', { name: 'Outside', hidden: true });
    outside.focus();
    await waitFor(() => expect(screen.getByRole('dialog')).toContainElement(document.activeElement as HTMLElement));
    expect(document.body.style.pointerEvents).toBe('none');
  });

  it.each([0, 2])('modal outside pointer button=%s keeps Radix dismissal and restoration policy', async (button) => {
    render(
      <>
        <Example modal={true} defaultOpen={true} />
        <button type='button'>Outside</button>
      </>
    );
    // Radix 1.3.1 defers primary-pointer dismissal until click; context-menu dismissal is immediate.
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });
    const outside = screen.getByRole('button', { name: 'Outside', hidden: true });
    fireEvent.pointerDown(outside, { button, pointerType: 'mouse', ctrlKey: false });
    if (button === 0) {
      fireEvent.click(outside);
    }
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument());
    const trigger = screen.getByRole('button', { name: 'Display settings' });
    if (button === 0) {
      await waitFor(() => expect(trigger).toHaveFocus());
    } else {
      expect(trigger).not.toHaveFocus();
    }
  });

  it('keeps controlled requests separate from owner acknowledgement and incoming updates', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    const { rerender } = render(<Example open={false} onOpenChange={onOpenChange} />);
    await user.click(screen.getByRole('button', { name: 'Display settings' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    onOpenChange.mockClear();
    rerender(<Example open={true} onOpenChange={onOpenChange} />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Close settings' }));
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    onOpenChange.mockClear();
    rerender(<Example open={false} onOpenChange={onOpenChange} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(onOpenChange).not.toHaveBeenCalled();
  });

  it('initializes defaultOpen only once', () => {
    const { rerender } = render(<Example />);
    rerender(<Example defaultOpen={true} />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('preserves Button state while Radix exposes visibility through ARIA and Content under A2', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger asChild={true}>
          <Button>Display settings</Button>
        </PopoverTrigger>
        <PopoverContent label='Display settings'>
          <PopoverClose>Close settings</PopoverClose>
        </PopoverContent>
      </Popover>
    );
    const trigger = screen.getByRole('button', { name: 'Display settings' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger).toHaveAttribute('data-state', 'idle');
    await user.click(trigger);
    const content = screen.getByRole('dialog', { name: 'Display settings' });
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', content.id);
    expect(trigger).toHaveAttribute('data-state', 'idle');
    expect(content).toHaveAttribute('data-state', 'open');
    await user.click(trigger);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).not.toHaveAttribute('aria-controls');
    expect(trigger).toHaveAttribute('data-state', 'idle');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('composes Button and IconButton without nested buttons and forwards both actual button refs', async () => {
    const user = userEvent.setup();
    const triggerRef = createRef<HTMLButtonElement>();
    const closeRef = createRef<HTMLButtonElement>();
    render(
      <Popover>
        <PopoverTrigger asChild={true} ref={triggerRef}>
          <Button>Settings</Button>
        </PopoverTrigger>
        <PopoverContent label='Settings'>
          <PopoverClose asChild={true} ref={closeRef}>
            <IconButton label='Close settings' icon={<Icon name='close' />} />
          </PopoverClose>
        </PopoverContent>
      </Popover>
    );
    const trigger = screen.getByRole('button', { name: 'Settings' });
    expect(triggerRef.current).toBe(trigger);
    await user.click(trigger);
    const close = screen.getByRole('button', { name: 'Close settings' });
    expect(closeRef.current).toBe(close);
    expect(close).toHaveAccessibleName('Close settings');
    expect(close).not.toHaveAttribute('aria-label');
    expect(close.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(document.querySelector('button button')).toBeNull();
    await user.click(close);
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('forwards native attributes, native refs and layout merges without losing Material', () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger ref={ref} title='Open preferences'>
          Settings
        </PopoverTrigger>
        <PopoverContent label='Settings' aria-describedby='explanation' className='max-w-full'>
          <p id='explanation'>Display preferences</p>
          <PopoverClose title='Dismiss'>Close</PopoverClose>
        </PopoverContent>
      </Popover>
    );
    const dialog = screen.getByRole('dialog');
    expect(dialog.id).not.toBe('');
    expect(screen.getByRole('button', { name: 'Settings' })).toHaveAttribute('aria-controls', dialog.id);
    expect(dialog).toHaveAttribute('aria-describedby', 'explanation');
    expect(dialog).toHaveClass('max-w-full', 'bg-surface-overlay', 'p-6', 'rounded-xl');
    expect(dialog).not.toHaveClass('max-w-[var(--radix-popover-content-available-width)]');
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Settings' }));
  });

  it('uses unique Radix relationship ids across instances', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Example />
        <Example />
      </>
    );
    const triggers = screen.getAllByRole('button', { name: 'Display settings' });
    await user.click(triggers[0] as HTMLElement);
    const firstId = screen.getByRole('dialog').id;
    await user.keyboard('{Escape}');
    await user.click(triggers[1] as HTMLElement);
    expect(screen.getByRole('dialog').id).not.toBe(firstId);
  });

  it.each(['top', 'right', 'bottom', 'left'] as const)('accepts preferred side %s and end alignment', (side) => {
    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger>Settings</PopoverTrigger>
        <PopoverContent label='Settings' side={side} align='end'>
          Details
        </PopoverContent>
      </Popover>
    );
    expect(screen.getByRole('dialog')).toHaveAttribute('data-side', side);
    expect(screen.getByRole('dialog')).toHaveAttribute('data-align', 'end');
    expect(screen.getByRole('dialog')).toHaveClass('overflow-y-auto', 'break-words', 'motion-reduce:transition-none');
  });

  it('retains owned relationships and Content semantics even for untyped attribute injection', () => {
    const injected = {
      label: 'Settings',
      children: 'Details',
      id: 'wrong-id',
      role: 'alert',
      'aria-label': 'Wrong name',
      'aria-modal': true,
      tabIndex: 3,
      style: { color: 'red' }
    } as PopoverContentProps;
    render(
      <Popover defaultOpen={true}>
        <PopoverTrigger aria-controls='wrong-id' aria-expanded={false} aria-haspopup='menu'>
          Settings
        </PopoverTrigger>
        <PopoverContent {...injected} />
      </Popover>
    );
    const dialog = screen.getByRole('dialog', { name: 'Settings' });
    const trigger = screen.getByRole('button', { name: 'Settings' });
    expect(dialog.id).not.toBe('wrong-id');
    expect(dialog).not.toHaveAttribute('aria-modal');
    expect(dialog).toHaveAttribute('tabindex', '-1');
    expect(dialog.style.color).toBe('');
    expect(trigger).toHaveAttribute('aria-controls', dialog.id);
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-haspopup', 'dialog');
  });

  it('does not activate a native disabled trigger', async () => {
    const user = userEvent.setup();
    render(
      <Popover>
        <PopoverTrigger disabled={true}>Unavailable</PopoverTrigger>
        <PopoverContent label='Details'>Details</PopoverContent>
      </Popover>
    );
    await user.click(screen.getByRole('button', { name: 'Unavailable' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('reports Content outside its required Root descriptively', () => {
    expect(() => renderHook(() => usePopoverContent({ label: 'Settings', children: 'Details' }))).toThrow(
      'PopoverContent must be used within Popover'
    );
  });

  it('rejects a fragment as a slotted trigger instead of silently dropping behavior', () => {
    expect(() =>
      render(
        <Popover>
          <PopoverTrigger asChild={true}>
            <>Settings</>
          </PopoverTrigger>
          <PopoverContent label='Settings'>Details</PopoverContent>
        </Popover>
      )
    ).toThrow(/single.*button-compatible/i);
  });
});
