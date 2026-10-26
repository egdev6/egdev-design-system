import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useId, useState } from 'react';
import { describe, expect, expectTypeOf, it, onTestFinished, vi } from 'vitest';
import { Switch } from './Switch';
import type { SwitchProps } from './types';
import { switchThumbVariants, switchVariants } from './types';
import { useSwitch } from './useSwitch';

function thumb(control: HTMLElement) {
  const part = control.querySelector('span');
  if (!part) {
    throw new Error('Missing Switch thumb');
  }
  return part;
}

/** Radix measures its hidden form input; jsdom has no ResizeObserver. Restored after the test. */
function stubResizeObserver() {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
  );
  onTestFinished(() => {
    vi.unstubAllGlobals();
  });
}

/** Harness pairing a Switch with a native label through useId, as Field composes it (AC-09). */
function LabelledSwitch(props: Omit<SwitchProps, 'id'>) {
  const id = useId();
  return (
    <>
      <label htmlFor={id}>Stream alerts</label>
      <Switch id={id} {...props} />
    </>
  );
}

/** Controlled harness whose consumer state drives the switch (AC-03). */
function ControlledSwitch({ onCheckedChange }: { onCheckedChange: (checked: boolean) => void }) {
  const [checked, setChecked] = useState(true);
  return (
    <Switch
      aria-label='Overlay visible'
      checked={checked}
      onCheckedChange={(next) => {
        setChecked(next);
        onCheckedChange(next);
      }}
    />
  );
}

describe('Switch', () => {
  it('renders one switch button with the public marker and a thumb (AC-01)', () => {
    const { container } = render(<Switch aria-label='Stream alerts' />);
    const control = screen.getByRole('switch', { name: 'Stream alerts' });
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(control);
    expect(control.tagName).toBe('BUTTON');
    expect(control).toHaveAttribute('type', 'button');
    expect(control).toHaveClass('eg-switch');
    expect(control.children).toHaveLength(1);
    expect(thumb(control).tagName).toBe('SPAN');
  });

  it('forwards the ref to the root button and cleans it up on unmount (AC-01, D9)', () => {
    const ref = createRef<HTMLButtonElement>();
    const { unmount } = render(<Switch ref={ref} aria-label='Stream alerts' />);
    expect(ref.current).toBe(screen.getByRole('switch'));
    unmount();
    expect(ref.current).toBeNull();
  });

  it('starts unchecked by default and exposes Radix state on root and thumb (AC-03)', () => {
    render(<Switch aria-label='Stream alerts' />);
    const control = screen.getByRole('switch');
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(control).toHaveAttribute('data-state', 'unchecked');
    expect(thumb(control)).toHaveAttribute('data-state', 'unchecked');
  });

  it('honours defaultChecked when uncontrolled', () => {
    render(<Switch aria-label='Stream alerts' defaultChecked={true} />);
    const control = screen.getByRole('switch');
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(thumb(control)).toHaveAttribute('data-state', 'checked');
  });

  it('toggles on click, Space and Enter and reports the next boolean (AC-02)', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label='Stream alerts' onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch');
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    await user.keyboard(' ');
    expect(control).toHaveAttribute('aria-checked', 'false');
    await user.keyboard('{Enter}');
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange.mock.calls).toEqual([[true], [false], [true]]);
  });

  it('follows the consumer-owned checked prop in controlled mode (AC-03)', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<ControlledSwitch onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Overlay visible' });
    expect(control).toHaveAttribute('aria-checked', 'true');
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(onCheckedChange).toHaveBeenCalledWith(false);
  });

  it('keeps a controlled value when the consumer does not update it', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<Switch aria-label='Stream alerts' checked={false} onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch');
    await user.click(control);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('cannot be focused or toggled while disabled (AC-04)', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(
      <>
        <button type='button'>Before</button>
        <Switch aria-label='Stream alerts' disabled={true} onCheckedChange={onCheckedChange} />
        <button type='button'>After</button>
      </>
    );
    const control = screen.getByRole('switch');
    expect(control).toBeDisabled();
    expect(control).toHaveAttribute('data-disabled');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.click(control);
    expect(onCheckedChange).not.toHaveBeenCalled();
    expect(control).toHaveAttribute('aria-checked', 'false');
  });

  it('is a single Tab stop between real controls', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Switch aria-label='Stream alerts' />
      </>
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('switch', { name: 'Stream alerts' })).toHaveFocus();
  });

  it('is named and toggled by an associated native label (AC-09)', async () => {
    const user = userEvent.setup();
    const onCheckedChange = vi.fn();
    render(<LabelledSwitch onCheckedChange={onCheckedChange} />);
    const control = screen.getByRole('switch', { name: 'Stream alerts' });
    await user.click(screen.getByText('Stream alerts'));
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('submits name and value inside a form only when on, and marks the input required (AC-08)', async () => {
    stubResizeObserver();
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Switch aria-label='Stream alerts' name='alerts' required={true} />
        <Switch aria-label='Overlay' name='overlay' value='visible' defaultChecked={true} />
      </form>
    );
    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Missing form');
    }
    expect(new FormData(form).get('alerts')).toBeNull();
    expect(new FormData(form).get('overlay')).toBe('visible');
    const alerts = screen.getByRole('switch', { name: 'Stream alerts' });
    expect(alerts).toHaveAttribute('aria-required', 'true');
    expect(form.querySelector('input[name="alerts"]')).toBeRequired();
    await user.click(alerts);
    expect(new FormData(form).get('alerts')).toBe('on');
  });

  it('restores the initial state when its form is reset', async () => {
    stubResizeObserver();
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <Switch aria-label='Stream alerts' />
      </form>
    );
    const control = screen.getByRole('switch');
    await user.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    container.querySelector('form')?.reset();
    await waitFor(() => expect(control).toHaveAttribute('aria-checked', 'false'));
  });

  it('passes native aria, data and id attributes through to the root button', () => {
    render(
      <>
        <p id='alerts-hint'>Plays a sound on new followers.</p>
        <Switch aria-label='Stream alerts' aria-describedby='alerts-hint' data-tracking='alerts' id='alerts' />
      </>
    );
    const control = screen.getByRole('switch', { name: 'Stream alerts' });
    expect(control).toHaveAttribute('id', 'alerts');
    expect(control).toHaveAttribute('data-tracking', 'alerts');
    expect(control).toHaveAccessibleDescription('Plays a sound on new followers.');
  });

  it('applies the Material well, checked fill, focus and disabled utilities to the track (AC-05, AC-06)', () => {
    render(<Switch aria-label='Stream alerts' />);
    const control = screen.getByRole('switch');
    expect(control).toHaveClass(
      'box-border',
      'p-0',
      'w-9',
      'h-5',
      'rounded-full',
      'border',
      'border-solid',
      'border-border-control',
      'bg-surface-0',
      'shadow-[var(--shadow-well)]',
      'data-[state=checked]:bg-[image:var(--gradient-btn-primary)]',
      'data-[state=checked]:border-action-primary-solid-bg',
      'data-[state=checked]:shadow-[var(--shadow-btn-primary)]',
      'focus-visible:outline-none',
      'focus-visible:shadow-[var(--shadow-focus)]',
      'data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)]',
      'disabled:opacity-45',
      'disabled:pointer-events-none',
      'motion-reduce:transition-none'
    );
    expect(thumb(control)).toHaveClass(
      'absolute',
      'top-0.5',
      'left-0.5',
      'size-3.5',
      'rounded-full',
      'bg-fg-secondary',
      'data-[state=checked]:translate-x-4',
      'data-[state=checked]:bg-action-primary-solid-fg',
      'motion-reduce:transition-none'
    );
  });

  it('never mirrors Radix state into classes', async () => {
    const user = userEvent.setup();
    render(<Switch aria-label='Stream alerts' />);
    const control = screen.getByRole('switch');
    const before = control.className;
    const thumbBefore = thumb(control).className;
    await user.click(control);
    expect(control.className).toBe(before);
    expect(thumb(control).className).toBe(thumbBefore);
  });

  it('merges layout-only consumer classes last on the root, never on the thumb', () => {
    const { result } = renderHook(() => useSwitch({ className: 'ms-1 ms-2 consumer-switch' }));
    const root = result.current.rootProps.className.split(' ');
    expect(root[0]).toBe('eg-switch');
    expect(root.slice(-2)).toEqual(['ms-2', 'consumer-switch']);
    expect(root).not.toContain('ms-1');
    expect(result.current.thumbProps.className).toBe(switchThumbVariants());
  });

  it('derives the documented constant defaults and passes Radix props through the hook', () => {
    const onCheckedChange = vi.fn();
    const { result } = renderHook(() => useSwitch({ name: 'alerts', onCheckedChange, required: true }));
    expect(result.current.rootProps).toMatchObject({
      defaultChecked: false,
      value: 'on',
      name: 'alerts',
      required: true,
      onCheckedChange
    });
    expect(result.current.rootProps.className).toBe(switchVariants());
  });

  it('exposes a ref-capable button API without children, asChild or variants', () => {
    expectTypeOf<SwitchProps['checked']>().toEqualTypeOf<boolean | undefined>();
    expectTypeOf<SwitchProps['onCheckedChange']>().toEqualTypeOf<((checked: boolean) => void) | undefined>();
    expectTypeOf<SwitchProps['value']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<
      Extract<keyof SwitchProps, 'children' | 'asChild' | 'onChange' | 'type' | 'size'>
    >().toEqualTypeOf<never>();
  });
});
