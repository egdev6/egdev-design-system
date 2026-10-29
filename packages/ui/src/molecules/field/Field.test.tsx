import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentProps, createRef, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useField } from '@/molecules/field/useField';
import { Checkbox, Field, Input, Select, Slider, Switch, Textarea } from '../../index';

// Radix measures its Slider thumb; jsdom has no layout observer. Behavior remains real Radix.
beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
  );
});
afterEach(() => vi.unstubAllGlobals());

const rootFor = (control: HTMLElement) => control.closest('.eg-field');

describe('Field public contract', () => {
  it('derives stacked defaults without optional content', () => {
    const { result } = renderHook(() => useField({ label: 'Title', children: <Input /> }));
    expect(result.current.rootProps.className).toContain('eg-field');
    expect(result.current.rootProps['data-state']).toBeUndefined();
    expect(result.current.labelProps.variant).toBe('field');
    expect(result.current.controlProps['aria-describedby']).toBeUndefined();
    expect(result.current.controlProps['aria-invalid']).toBeUndefined();
  });

  it('generates distinct control ids and keeps root attributes separate', () => {
    render(
      <>
        <Field label='Title' id='field-root' className='col-span-full' data-source='consumer' title='Editor'>
          <Input required={true} />
        </Field>
        <Field label='Summary'>
          <Input />
        </Field>
      </>
    );
    const input = screen.getByRole('textbox', { name: 'Title' });
    const summary = screen.getByRole('textbox', { name: 'Summary' });
    expect(input.id).toBeTruthy();
    expect(input.id).not.toBe(summary.id);
    expect(screen.getByText('Title')).toHaveAttribute('for', input.id);
    expect(input).toBeRequired();
    expect(rootFor(input)).toHaveAttribute('id', 'field-root');
    expect(rootFor(input)).toHaveAttribute('data-source', 'consumer');
    expect(rootFor(input)).toHaveAttribute('title', 'Editor');
    expect(rootFor(input)).toHaveClass('eg-field', 'col-span-full', 'flex', 'flex-col', 'min-w-0', 'gap-1.5');
    expect(input).not.toHaveClass('eg-field', 'col-span-full');
  });

  it('retains a supplied control id, its ref and native label focus', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLInputElement>();
    const { unmount } = render(
      <Field label='Title'>
        <Input id='title' ref={ref} />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: 'Title' });
    expect(input).toHaveAttribute('id', 'title');
    expect(ref.current).toBe(input);
    await user.click(screen.getByText('Title'));
    expect(input).toHaveFocus();
    unmount();
    expect(ref.current).toBeNull();
  });

  it.each([
    { name: 'Input', child: <Input />, role: 'textbox' },
    { name: 'Textarea', child: <Textarea />, role: 'textbox' },
    { name: 'Select', child: <Select options={[{ value: 'public', label: 'Public' }]} />, role: 'combobox' }
  ])('names and describes a real $name control', ({ child, role }) => {
    render(
      <Field label='Visibility' hint='Who can see this'>
        {child}
      </Field>
    );
    expect(screen.getByRole(role, { name: 'Visibility', description: 'Who can see this' })).toBeInTheDocument();
  });

  it('replaces the hint with an error, recovers and ignores an empty error', () => {
    const { rerender, container } = render(
      <Field label='Title' hint='Short title'>
        <Input />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: 'Title' });
    const id = input.id;
    rerender(
      <Field label='Title' hint='Short title' error='Title is required'>
        <Input />
      </Field>
    );
    expect(input).toHaveAccessibleDescription('Title is required');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(rootFor(input)).toHaveAttribute('data-state', 'invalid');
    expect(screen.queryByText('Short title')).not.toBeInTheDocument();
    expect(container.querySelector('[role="alert"], [aria-live]')).toBeNull();
    rerender(
      <Field label='Title' hint='Short title' error=''>
        <Input />
      </Field>
    );
    expect(input.id).toBe(id);
    expect(input).toHaveAccessibleDescription('Short title');
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(rootFor(input)).not.toHaveAttribute('data-state');
    rerender(
      <Field label='Title'>
        <Input />
      </Field>
    );
    expect(input).not.toHaveAttribute('aria-describedby');
  });

  it('uses actual Slot child-first description merging with stable generated ids and deduplication', () => {
    const renderField = (describedBy: string) => (
      <>
        <p id='external'>External guidance</p>
        <Field label='Title' hint='Short title' counter={{ value: 3, max: 10 }}>
          <Input aria-describedby={describedBy} />
        </Field>
      </>
    );
    const { rerender } = render(renderField('external external'));
    const input = screen.getByRole('textbox', { name: 'Title' });
    const messageId = screen.getByText('Short title').id;
    const counterId = screen.getByText('3 / 10').id;
    expect(input).toHaveAttribute('aria-describedby', `external ${messageId} ${counterId}`);
    rerender(renderField(` external ${messageId} external ${counterId} `));
    expect(input).toHaveAttribute('aria-describedby', `external ${messageId} ${counterId}`);
    expect(input).toHaveAccessibleDescription('External guidance Short title 3 / 10');
    rerender(renderField('  '));
    expect(input).toHaveAttribute('aria-describedby', `${messageId} ${counterId}`);
  });

  it.each([undefined, true, 'true'] as const)('supports an omitted or true child invalid flag: %s', (invalid) => {
    // An absent property, not an explicitly undefined one, is the supported omitted case.
    const child = invalid === undefined ? <Input /> : <Input aria-invalid={invalid} />;
    render(
      <Field label='Title' error='Required'>
        {child}
      </Field>
    );
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveAttribute('aria-invalid', 'true');
  });

  it.each([false, undefined, null, 'grammar'] as const)(
    'does not repair unsupported explicit child invalid conflicts: %s',
    (invalid) => {
      const childProps = { 'aria-invalid': invalid } as ComponentProps<typeof Input>;
      render(
        <Field label='Title' error='Required'>
          <Input {...childProps} />
        </Field>
      );
      const input = screen.getByRole('textbox', { name: 'Title' });
      if (invalid == null) {
        expect(input).not.toHaveAttribute('aria-invalid');
      } else {
        expect(input).toHaveAttribute('aria-invalid', String(invalid));
      }
      expect(input).toHaveAccessibleDescription('Required');
    }
  );

  it.each([0, 279, 280, 294])('shows counter boundary %s without inventing an error', (value) => {
    render(
      <Field label='Post' counter={{ value, max: 280 }}>
        <Textarea />
      </Field>
    );
    const counter = screen.getByText(`${value} / 280`);
    expect(counter.tagName).toBe('SPAN');
    if (value > 280) {
      expect(counter).toHaveAttribute('data-state', 'over');
    } else {
      expect(counter).not.toHaveAttribute('data-state');
    }
    const input = screen.getByRole('textbox', { name: 'Post' });
    expect(input).toHaveAccessibleDescription(`${value} / 280`);
    expect(input).not.toHaveAttribute('aria-invalid');
    expect(rootFor(input)).not.toHaveAttribute('data-state');
  });

  it('keeps a hidden label as the accessible name via VisuallyHidden', () => {
    render(
      <Field label='Search' hideLabel={true}>
        <Input />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: 'Search' });
    const label = screen.getByText('Search');
    expect(label).toHaveAttribute('for', input.id);
    expect(label.parentElement?.style.position).toBe('absolute');
    expect(label.parentElement).toHaveStyle({ width: '1px', height: '1px', overflow: 'hidden' });
  });

  it('links the Slider readout and routes invalid semantics and error description to the focusable slider', () => {
    render(
      <Field label='Ring size' readout='56 px' hint='Choose a size' error='Size must be smaller'>
        <Slider label='Ring size' defaultValue={56} id='ring-size' />
      </Field>
    );
    const slider = screen.getByRole('slider', { name: 'Ring size', description: 'Size must be smaller' });
    expect(slider).toHaveAttribute('aria-invalid', 'true');
    const output = screen.getByText('56 px');
    expect(output.tagName).toBe('OUTPUT');
    expect(output).toHaveAttribute('for', 'ring-size');
    expect(output.parentElement?.lastElementChild).toBe(output);
    expect(screen.getByText('Ring size')).toHaveAttribute('for', 'ring-size');
  });

  it.each([
    { child: <Checkbox />, role: 'checkbox' },
    { child: <Switch />, role: 'switch' }
  ])('orders and toggles the real choice $role without rendering stacked-only content', async ({ child, role }) => {
    const user = userEvent.setup();
    render(
      <Field
        label='Notifications'
        layout='choice'
        hint='Receive updates'
        readout='Ignored'
        counter={{ value: 1, max: 2 }}
      >
        {child}
      </Field>
    );
    const control = screen.getByRole(role, { name: 'Notifications', description: 'Receive updates' });
    const root = rootFor(control);
    expect(root?.firstElementChild).toBe(control);
    expect(root).toHaveClass('grid', 'min-h-9', 'pointer-coarse:min-h-11');
    const label = screen.getByText('Notifications');
    expect(label).toHaveClass('font-[var(--text-body-default--font-weight)]');
    expect(label.parentElement).toHaveClass('cursor-pointer');
    expect(screen.getByText('Receive updates')).toHaveClass('col-start-2');
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument();
    expect(screen.queryByText('1 / 2')).not.toBeInTheDocument();
    await user.click(label);
    expect(control).toBeChecked();
    await user.tab();
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('dims only the Field-owned row, message and counter, not the root or Label/readout descendants', async () => {
    const user = userEvent.setup();
    render(
      <Field label='Title' hint='Unavailable' readout='Read only' counter={{ value: 0, max: 10 }}>
        <Input disabled={true} />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: 'Title' });
    const label = screen.getByText('Title');
    for (const part of [label.parentElement, screen.getByText('Unavailable'), screen.getByText('0 / 10')]) {
      expect(part).toHaveClass('group-has-[:disabled]:opacity-45', 'group-has-[[data-disabled]]:opacity-45');
    }
    for (const part of [rootFor(input), label, screen.getByText('Read only')]) {
      expect(part?.className).not.toContain('opacity-45');
    }
    expect(label).toHaveClass('eg-label');
    expect(label).not.toHaveClass('font-[var(--text-body-default--font-weight)]');
    await user.click(label);
    expect(input).not.toHaveFocus();
  });

  it('adds no classes to a slotted control', () => {
    render(
      <Field label='Title'>
        <input className='consumer-control' />
      </Field>
    );
    expect(screen.getByRole('textbox', { name: 'Title' })).toHaveAttribute('class', 'consumer-control');
  });

  it.each([
    {
      name: 'fragment',
      child: (
        <>
          <Input />
        </>
      )
    },
    { name: 'text', child: 'Invalid' },
    { name: 'multiple controls', child: [<Input key='a' />, <Input key='b' />] },
    { name: 'missing control', child: null }
  ])('rejects $name rather than silently losing the accessibility wiring', ({ child }) => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() => render(<Field label='Title'>{child as ReactElement}</Field>)).toThrow(/single.*control/i);
    } finally {
      error.mockRestore();
    }
  });
});
