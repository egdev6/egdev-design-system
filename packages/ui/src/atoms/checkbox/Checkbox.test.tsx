import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Checkbox } from './Checkbox.js';
import { useCheckbox } from './useCheckbox.js';

// jsdom has no layout observer; Radix uses it only to size the hidden form input.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {
        /* Layout is not evaluated in jsdom. */
      }
      unobserve() {
        /* No real observation was registered. */
      }
      disconnect() {
        /* No real observation was registered. */
      }
    }
  );
});
afterAll(() => vi.unstubAllGlobals());

describe('Checkbox public contract', () => {
  it('derives Radix defaults and per-part classes without owning checked state', () => {
    const { result } = renderHook(() => useCheckbox({ 'aria-label': 'Subscribe', className: 'ms-1 ms-2' }));
    expect(result.current.rootProps.defaultChecked).toBe(false);
    expect(result.current.rootProps.value).toBe('on');
    expect(result.current.rootProps.disabled).toBe(false);
    expect(result.current.rootProps.required).toBe(false);
    expect(result.current.rootProps.className).toContain('eg-checkbox');
    expect(result.current.rootProps.className).toContain('ms-2');
    expect(result.current.rootProps.className).not.toContain('ms-1');
    expect(result.current.indicatorProps.className).toContain('text-action-primary-solid-fg');
    expect(result.current.iconProps.className).toBe('size-3');
  });

  it('renders a bare unchecked checkbox button with a forwarded ref and native attributes', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Checkbox ref={ref} aria-label='Subscribe' aria-describedby='hint' data-owner='form' />);
    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' });
    expect(checkbox.tagName).toBe('BUTTON');
    expect(ref.current === checkbox).toBe(true);
    expect(checkbox).toHaveClass('eg-checkbox', 'size-4.5', 'box-border', 'p-0', 'border-solid');
    expect(checkbox).toHaveAttribute('type', 'button');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    expect(checkbox).toHaveAttribute('aria-describedby', 'hint');
    expect(checkbox).toHaveAttribute('data-owner', 'form');
    expect(checkbox.querySelector('svg')).toBeNull();
    expect(checkbox).not.toHaveClass('eg-check');
  });

  it('lets Radix toggle on click and Space, but not Enter', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label='Subscribe' onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' });
    await user.tab();
    expect(checkbox).toHaveFocus();
    await user.keyboard('[Space]');
    expect(checkbox).toBeChecked();
    await user.keyboard('[Enter]');
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(onCheckedChange.mock.calls).toEqual([[true], [false]]);
  });

  it('keeps controlled state authoritative and never notifies for incoming props', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    const { rerender } = render(<Checkbox aria-label='Subscribe' checked={false} onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
    expect(checkbox).not.toBeChecked();
    rerender(<Checkbox aria-label='Subscribe' checked='indeterminate' onCheckedChange={onCheckedChange} />);
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    rerender(<Checkbox aria-label='Subscribe' checked={true} onCheckedChange={onCheckedChange} />);
    expect(checkbox).toBeChecked();
    expect(onCheckedChange).toHaveBeenCalledTimes(1);
  });

  it.each(['click', 'Space'] as const)('moves an uncontrolled mixed state to true on %s', async (action) => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label='Select all' defaultChecked='indeterminate' onCheckedChange={onCheckedChange} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');
    const indicator = checkbox.querySelector('span');
    expect(indicator).toHaveAttribute('data-state', 'indeterminate');
    expect(indicator?.querySelectorAll('.eg-icon')).toHaveLength(2);
    for (const icon of checkbox.querySelectorAll('svg')) {
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon).toHaveClass('size-3');
    }
    if (action === 'click') {
      await user.click(checkbox);
    } else {
      await user.tab();
      await user.keyboard('[Space]');
    }
    expect(checkbox).toBeChecked();
    expect(indicator).toHaveAttribute('data-state', 'checked');
    expect(onCheckedChange).toHaveBeenCalledExactlyOnceWith(true);
  });

  it('supports checked initialization without turning it into controlled state', async () => {
    const user = userEvent.setup();
    render(<Checkbox aria-label='Subscribe' defaultChecked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
    await user.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('does not focus or activate when disabled', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <>
        <Checkbox aria-label='Subscribe' disabled={true} defaultChecked={true} onCheckedChange={onCheckedChange} />
        <button type='button'>Next</button>
      </>
    );
    const checkbox = screen.getByRole('checkbox');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    fireEvent.click(checkbox);
    expect(checkbox).toBeDisabled();
    expect(checkbox).toHaveAttribute('data-disabled');
    expect(checkbox).toBeChecked();
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(checkbox).toHaveClass('disabled:opacity-45', 'disabled:pointer-events-none', 'disabled:cursor-not-allowed');
  });

  it('uses a consumer label for naming and activation', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Checkbox id='subscription' aria-describedby='subscription-hint' />
        <label htmlFor='subscription'>Notify subscribers</label>
        <p id='subscription-hint'>Saved with the form</p>
      </>
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Notify subscribers' });
    expect(checkbox).toHaveAccessibleDescription('Saved with the form');
    await user.click(screen.getByText('Notify subscribers'));
    expect(checkbox).toBeChecked();
  });

  it('forwards invalid semantics with unchecked-only border and state-specific focus recipes', () => {
    render(<Checkbox aria-label='Accept terms' aria-invalid='true' />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-invalid', 'true');
    expect(checkbox).toHaveClass('aria-invalid:data-[state=unchecked]:border-status-danger');
    expect(checkbox).toHaveClass('focus-visible:shadow-[var(--shadow-focus)]');
    for (const state of ['checked', 'indeterminate']) {
      expect(checkbox).toHaveClass(`data-[state=${state}]:focus-visible:shadow-[var(--shadow-focus)]`);
    }
  });

  it('submits Radix form values only when checked, preserves required and resets', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form aria-label='Preferences'>
        <Checkbox aria-label='Subscription' name='subscription' value='yes' required={true} />
        <Checkbox aria-label='Default value' name='default' defaultChecked={true} />
        <Checkbox aria-label='Disabled value' name='disabled' disabled={true} defaultChecked={true} />
      </form>
    );
    const form = screen.getByRole('form') as HTMLFormElement;
    const checkbox = screen.getByRole('checkbox', { name: 'Subscription' });
    const input = container.querySelector('input[name="subscription"]');
    expect(input).toHaveAttribute('required');
    expect(new FormData(form).get('subscription')).toBeNull();
    expect(new FormData(form).get('default')).toBe('on');
    expect(new FormData(form).get('disabled')).toBeNull();
    await user.click(checkbox);
    expect(new FormData(form).get('subscription')).toBe('yes');
    act(() => form.reset());
    expect(checkbox).not.toBeChecked();
    expect(new FormData(form).get('subscription')).toBeNull();
  });
});
