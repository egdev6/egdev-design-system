import { act, fireEvent, render, renderHook, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useState } from 'react';
import { renderToString } from 'react-dom/server';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Select } from './index';
import { useSelect } from './useSelect';

const options = [
  { value: 'public', label: 'Public' },
  { value: 'private', label: 'Private' }
];

// Geometry-only jsdom gaps; never mock Radix interaction, focus or ARIA.
beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', { configurable: true, value: () => false });
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', { configurable: true, value: vi.fn() });
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', { configurable: true, value: vi.fn() });
});
afterAll(() => {
  vi.unstubAllGlobals();
});

const trigger = () => screen.getByRole('combobox', { name: 'Visibility' });
const open = async (key = '{Enter}') => {
  const user = userEvent.setup();
  trigger().focus();
  await user.keyboard(key);
  await screen.findByRole('listbox');
  return user;
};

describe('Select public contract', () => {
  it('renders a named combobox button with its public marker and forwarded ref', () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Select options={options} aria-label='Visibility' ref={ref} />);
    const trigger = screen.getByRole('combobox', { name: 'Visibility' });
    expect(trigger.tagName).toBe('BUTTON');
    expect(trigger).toHaveClass('eg-select');
    expect(ref.current === trigger).toBe(true);
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('splits form/value props from native trigger attributes and preserves supported layout merges', () => {
    const onValueChange = vi.fn();
    const onFocus = vi.fn();
    const { result } = renderHook(() =>
      useSelect({
        options,
        name: 'visibility',
        required: true,
        disabled: true,
        value: 'public',
        defaultValue: 'private',
        onValueChange,
        'aria-label': 'Visibility',
        onFocus,
        className: 'w-auto mb-3'
      })
    );
    expect(result.current.rootProps).toMatchObject({
      name: 'visibility',
      required: true,
      disabled: true,
      value: 'public',
      defaultValue: 'private',
      onValueChange
    });
    expect(result.current.triggerProps).not.toHaveProperty('name');
    expect(result.current.triggerProps).not.toHaveProperty('value');
    expect(result.current.triggerProps).toMatchObject({ 'aria-label': 'Visibility', onFocus, disabled: true });
    expect(result.current.triggerProps.className).toContain('w-auto');
    expect(result.current.triggerProps.className).not.toMatch(/\bw-full\b/);
    expect(result.current.contentClassName).toContain('eg-select-content');
    expect(result.current.itemClassName).toContain('data-highlighted:bg-fg-default/6');
    expect(result.current.chevronClassName).toContain('right-3');
    expect(result.current.indicatorClassName).toContain('text-fg-brand-default');
  });

  it('uses md by default, sm on request and retains the well, invalid and focus recipes', () => {
    const { rerender } = render(<Select options={options} aria-label='Visibility' aria-invalid='true' />);
    expect(trigger()).toHaveClass('min-h-11', 'text-body-default', 'bg-surface-0', 'bg-none', 'border-solid');
    expect(trigger()).toHaveAttribute('aria-invalid', 'true');
    expect(trigger()).toHaveClass('aria-invalid:border-status-danger', 'data-[state=open]:border-border-brand-strong');
    rerender(<Select options={options} aria-label='Visibility' size='sm' className='w-auto mt-2' />);
    expect(trigger()).toHaveClass('min-h-9', 'text-label-default', 'w-auto', 'mt-2');
    expect(trigger()).not.toHaveClass('min-h-11', 'w-full');
    expect(trigger().querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(trigger().querySelector('svg')).toHaveClass('eg-icon', 'size-4');
  });

  it.each(['md', 'sm'] as const)('centers the %s trigger chevron independently of inline SVG baselines', (size) => {
    render(<Select options={options} aria-label='Visibility' size={size} placeholder='Choose visibility' />);
    const chevron = trigger().querySelector('svg')?.parentElement;
    expect(chevron).toHaveAttribute('aria-hidden', 'true');
    expect(chevron).toHaveClass(
      'absolute',
      'right-3',
      'size-4',
      'inline-flex',
      'items-center',
      'justify-center',
      '[&>svg]:block',
      '[&>svg]:size-full'
    );
    expect(trigger()).toHaveClass('items-center');
    expect(trigger()).toHaveTextContent('Choose visibility');
  });

  it('shows a placeholder separately from its accessible name and associates label and description', () => {
    render(
      <>
        <label htmlFor='visibility'>Visibility</label>
        <p id='visibility-hint'>Who can read this page</p>
        <Select id='visibility' options={options} placeholder='Choose visibility' aria-describedby='visibility-hint' />
      </>
    );
    expect(trigger()).toHaveAccessibleDescription('Who can read this page');
    expect(trigger()).toHaveTextContent('Choose visibility');
    expect(trigger()).toHaveAttribute('data-placeholder');
  });

  it('renders uncontrolled initial values and controlled updates without emitting a selection', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Select options={options} aria-label='Visibility' defaultValue='private' />);
    expect(trigger()).toHaveTextContent('Private');
    rerender(
      <Select key='controlled' options={options} aria-label='Visibility' value='public' onValueChange={onValueChange} />
    );
    expect(trigger()).toHaveTextContent('Public');
    rerender(
      <Select
        key='controlled'
        options={options}
        aria-label='Visibility'
        value='private'
        onValueChange={onValueChange}
      />
    );
    expect(trigger()).toHaveTextContent('Private');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each(['{Enter}', ' ', '{ArrowDown}', '{ArrowUp}'])('opens with %s into a portalled listbox', async (key) => {
    const { container } = render(<Select options={options} aria-label='Visibility' />);
    const button = trigger();
    await open(key);
    const listbox = screen.getByRole('listbox');
    expect(container.contains(listbox)).toBe(false);
    expect(listbox).toHaveClass('eg-select-content');
    expect(within(listbox).getAllByRole('option')).toHaveLength(2);
    expect(button).toHaveAttribute('aria-expanded', 'true');
  });

  it('opens on pointer click and closes on Escape without changing the value', async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} aria-label='Visibility' onValueChange={onValueChange} />);
    const user = userEvent.setup();
    await user.click(trigger());
    expect(await screen.findByRole('listbox')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('selects once, closes and restores focus, with a non-color check when reopened', async () => {
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('public');
      return (
        <Select
          options={options}
          aria-label='Visibility'
          value={value}
          onValueChange={(next: string) => {
            setValue(next);
            onValueChange(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const user = await open();
    await user.keyboard('{End}{Enter}');
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger()).toHaveTextContent('Private');
    expect(trigger()).toHaveFocus();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('private');
    await open();
    const selected = screen.getByRole('option', { name: 'Private' });
    expect(selected).toHaveAttribute('data-state', 'checked');
    expect(selected.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await user.keyboard('{Enter}');
    expect(onValueChange).toHaveBeenCalledTimes(1);
  });

  it('supports pointer selection and uncontrolled value changes', async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} aria-label='Visibility' onValueChange={onValueChange} />);
    const user = await open();
    await user.click(screen.getByRole('option', { name: 'Private' }));
    expect(trigger()).toHaveTextContent('Private');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('private');
  });

  it('skips disabled options with arrows, Home/End and typeahead', async () => {
    render(
      <Select
        options={[
          { value: 'hidden', label: 'Hidden', disabled: true },
          ...options,
          { value: 'archived', label: 'Archived', disabled: true }
        ]}
        aria-label='Visibility'
      />
    );
    const user = await open();
    expect(screen.getByRole('option', { name: 'Hidden' })).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{End}');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Private' })).toHaveFocus());
    await user.keyboard('{Home}');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Public' })).toHaveFocus());
    await user.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Private' })).toHaveFocus());
    await user.keyboard('pu');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Public' })).toHaveFocus());
  });

  it('cannot select a disabled option or open a disabled trigger', async () => {
    const onValueChange = vi.fn();
    const disabledOptions = [{ value: 'hidden', label: 'Hidden', disabled: true }, ...options];
    const { rerender } = render(
      <Select options={disabledOptions} aria-label='Visibility' onValueChange={onValueChange} />
    );
    const user = await open();
    fireEvent.click(screen.getByRole('option', { name: 'Hidden' }));
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard('{Escape}');
    rerender(<Select options={options} aria-label='Visibility' disabled={true} />);
    expect(trigger()).toBeDisabled();
    await user.click(trigger());
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('submits name/value through the required native select and omits disabled fields', async () => {
    const { container, rerender } = render(
      <form aria-label='Settings'>
        <Select options={options} aria-label='Visibility' name='visibility' required={true} defaultValue='private' />
      </form>
    );
    const form = screen.getByRole('form', { name: 'Settings' });
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Missing form');
    }
    expect(container.querySelector('select')).toBeRequired();
    expect(new FormData(form).get('visibility')).toBe('private');
    const user = await open();
    await user.keyboard('{Home}{Enter}');
    expect(new FormData(form).get('visibility')).toBe('public');
    rerender(
      <form aria-label='Settings'>
        <Select options={options} aria-label='Visibility' name='visibility' disabled={true} defaultValue='private' />
      </form>
    );
    expect(new FormData(form).has('visibility')).toBe(false);
  });

  it('requires a selection when empty and supports multiple independent instances', () => {
    render(
      <form aria-label='Settings'>
        <Select
          options={options}
          aria-label='Visibility'
          name='visibility'
          required={true}
          placeholder='Choose visibility'
        />
        <Select options={options} aria-label='Language' name='language' defaultValue='private' />
      </form>
    );
    const form = screen.getByRole('form', { name: 'Settings' });
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Missing form');
    }
    expect(form.checkValidity()).toBe(false);
    expect(new FormData(form).get('visibility')).toBe('');
    expect(new FormData(form).get('language')).toBe('private');
  });

  it('does not emit controlled prop updates inside a form', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <form>
        <Select
          options={options}
          aria-label='Visibility'
          name='visibility'
          value='public'
          onValueChange={onValueChange}
        />
      </form>
    );
    rerender(
      <form>
        <Select
          options={options}
          aria-label='Visibility'
          name='visibility'
          value='private'
          onValueChange={onValueChange}
        />
      </form>
    );
    expect(trigger()).toHaveTextContent('Private');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('selects with Space and skips disabled controls in the closed Tab order', async () => {
    const onValueChange = vi.fn();
    render(
      <>
        <Select options={options} aria-label='Visibility' onValueChange={onValueChange} />
        <Select options={options} aria-label='Disabled visibility' disabled={true} />
        <button type='button'>Continue</button>
      </>
    );
    const user = userEvent.setup();
    await user.tab();
    expect(trigger()).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
    await open();
    await user.keyboard('{End} ');
    expect(trigger()).toHaveTextContent('Private');
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('private');
  });

  it('renders an SSR combobox without accessing browser geometry', () => {
    const html = renderToString(<Select options={options} aria-label='Visibility' placeholder='Choose visibility' />);
    expect(html).toContain('role="combobox"');
    expect(html).toContain('eg-select');
    expect(html).toContain('Choose visibility');
  });

  it('closes on an outside pointer without selecting', async () => {
    const onValueChange = vi.fn();
    render(<Select options={options} aria-label='Visibility' onValueChange={onValueChange} />);
    await open();
    await act(async () => {
      fireEvent.pointerDown(document.body, { pointerType: 'mouse', button: 0 });
    });
    await waitFor(() => expect(screen.queryByRole('listbox')).not.toBeInTheDocument());
    expect(trigger()).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
