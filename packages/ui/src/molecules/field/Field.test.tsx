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
    const messageId = screen.getByText('Short title').closest('.eg-field-message')?.id;
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
    expect(screen.getByText('Receive updates').closest('.eg-field-message')?.parentElement).toHaveClass('col-start-2');
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
    for (const part of [
      label.parentElement,
      screen.getByText('Unavailable').closest('.eg-field-message')?.parentElement,
      screen.getByText('0 / 10')
    ]) {
      expect(part).toHaveClass('group-has-[:disabled]:opacity-45', 'group-has-[[data-disabled]]:opacity-45');
    }
    for (const part of [
      rootFor(input),
      label,
      screen.getByText('Read only'),
      screen.getByText('Unavailable').closest('.eg-field-message')
    ]) {
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

describe('Field bottom row', () => {
  it('shares one horizontal bottom row between the message and the counter, mirroring the label/readout row', () => {
    render(
      <Field label='Post' hint='Keep it brief.' counter={{ value: 12, max: 280 }}>
        <Textarea />
      </Field>
    );
    const input = screen.getByRole('textbox', { name: 'Post' });
    const message = screen.getByText('Keep it brief.').closest('.eg-field-message');
    const counter = screen.getByText('12 / 280');
    const row = counter.parentElement;
    expect(row).toHaveClass('flex', 'justify-between', 'gap-2');
    expect(row?.firstElementChild).toBe(message?.parentElement);
    expect(row?.lastElementChild).toBe(counter);
    expect(message?.parentElement).toHaveClass('min-w-0');
    expect(counter).toHaveClass('shrink-0');
    expect(input).toHaveAccessibleDescription('Keep it brief. 12 / 280');
  });

  it('lets the counter occupy the row alone, still aligned to the end', () => {
    render(
      <Field label='Comment' counter={{ value: 36, max: 1250 }}>
        <Textarea />
      </Field>
    );
    const counter = screen.getByText('36 / 1250');
    const row = counter.parentElement;
    expect(row).toHaveClass('flex', 'justify-between', 'gap-2');
    expect(row?.children).toHaveLength(1);
    expect(counter).toHaveClass('ml-auto', 'shrink-0');
  });

  it('lets the message occupy the row alone', () => {
    render(
      <Field label='Title' hint='Short title'>
        <Input />
      </Field>
    );
    const wrapper = screen.getByText('Short title').closest('.eg-field-message')?.parentElement;
    const row = wrapper?.parentElement;
    expect(row).toHaveClass('flex', 'justify-between', 'gap-2');
    expect(row?.children).toHaveLength(1);
    expect(wrapper).toHaveClass('min-w-0');
  });

  it('keeps the choice message as a direct grid child without a bottom row', () => {
    render(
      <Field
        label='Remember this device'
        layout='choice'
        hint='Only on a private device.'
        counter={{ value: 1, max: 2 }}
      >
        <Checkbox />
      </Field>
    );
    const wrapper = screen.getByText('Only on a private device.').closest('.eg-field-message')?.parentElement;
    expect(wrapper).toHaveClass('col-start-2');
    expect(wrapper?.parentElement).toHaveClass('grid');
    expect(screen.queryByText('1 / 2')).not.toBeInTheDocument();
  });
});

describe('Field choice-trailing amendment', () => {
  const choices = [
    { name: 'Checkbox', role: 'checkbox', component: Checkbox, marker: 'eg-checkbox' },
    { name: 'Switch', role: 'switch', component: Switch, marker: 'eg-switch' }
  ] as const;

  it.each(choices)(
    'AC-01: $name keeps its placement inside a form, beside the hidden native input',
    ({ component: Control, role }) => {
      render(
        <form>
          <Field label='Updates' layout='choice-trailing' hint='Receive news'>
            <Control />
          </Field>
        </form>
      );
      const control = screen.getByRole(role, { name: 'Updates' });
      const root = rootFor(control);
      // Radix adds a hidden native input after the control inside forms, so the control is not the
      // last child; placement must target the control element, not the last child.
      expect(root?.lastElementChild).not.toBe(control);
      expect(root?.lastElementChild?.tagName).toBe('INPUT');
      expect(control.tagName).toBe('BUTTON');
      expect(root).toHaveClass('[&>button]:row-start-1', '[&>button]:col-start-2');
      expect(root?.className).not.toContain('last-child');
    }
  );

  it.each(choices)('AC-01: $name order and grid', ({ component: Control, role, marker }) => {
    render(
      <Field label='Updates' layout='choice-trailing' hint='Receive news'>
        <Control />
      </Field>
    );
    const control = screen.getByRole(role, { name: 'Updates', description: 'Receive news' });
    const root = rootFor(control);
    const label = screen.getByText('Updates');
    const message = screen.getByText('Receive news').closest('.eg-field-message');
    expect(root).toHaveClass(
      'eg-field',
      'grid',
      'grid-cols-[minmax(0,1fr)_auto]',
      'items-center',
      'gap-x-4',
      'gap-y-1',
      'min-h-9',
      // The root places the control (a Radix button) beside the label row; auto-placement would
      // otherwise put it beside the message row.
      '[&>button]:row-start-1',
      '[&>button]:col-start-2'
    );
    expect(control).not.toHaveClass('row-start-1', 'col-start-2');
    expect(label).toHaveClass('eg-label');
    expect(message).toHaveClass('eg-field-message');
    expect(control).toHaveClass(marker);
    expect(Array.from(root?.children ?? [])).toEqual([label.parentElement, message?.parentElement, control]);
    expect(label.parentElement).toHaveClass('col-start-1', 'row-start-1', 'cursor-pointer', 'min-w-0');
    expect(message?.parentElement).toHaveClass('col-start-1');
  });

  it.each(choices)('AC-02: $name activation and controlled/disabled values', async ({ component: Control, role }) => {
    const user = userEvent.setup();
    const changed = vi.fn();
    const view = (checked?: boolean, disabled = false) => (
      <Field label='Updates' layout='choice-trailing'>
        <Control {...(checked === undefined ? {} : { checked })} disabled={disabled} onCheckedChange={changed} />
      </Field>
    );
    const { rerender } = render(view());
    const control = screen.getByRole(role, { name: 'Updates' });
    await user.click(screen.getByText('Updates'));
    expect(control).toBeChecked();
    expect(changed.mock.calls).toEqual([[true]]);
    const root = rootFor(control);
    if (!root) {
      throw new Error('Field root is missing');
    }
    await user.click(root);
    expect(changed).toHaveBeenCalledTimes(1);
    rerender(view(false));
    await user.click(screen.getByText('Updates'));
    expect(control).not.toBeChecked();
    expect(changed.mock.calls).toEqual([[true], [true]]);
    rerender(view(true));
    await user.click(screen.getByText('Updates'));
    expect(control).toBeChecked();
    expect(changed.mock.calls).toEqual([[true], [true], [false]]);
    rerender(view(true, true));
    await user.click(screen.getByText('Updates'));
    expect(control).toBeChecked();
    expect(changed).toHaveBeenCalledTimes(3);
  });

  it.each(choices)('AC-03: $name names, descriptions, error and refs', ({ component: Control, role }) => {
    const ref = createRef<HTMLButtonElement>();
    const view = (describedBy: string, error = '', hideLabel = false, disabled = false) => (
      <>
        <p id='external-trailing'>External guidance</p>
        <Field label='Updates' layout='choice-trailing' hint='Receive news' error={error} hideLabel={hideLabel}>
          <Control id='supplied-trailing' ref={ref} aria-describedby={describedBy} checked={true} disabled={disabled} />
        </Field>
      </>
    );
    const { rerender, unmount } = render(view('external-trailing external-trailing'));
    const control = screen.getByRole(role, { name: 'Updates', description: 'External guidance Receive news' });
    const message = screen.getByText('Receive news').closest('.eg-field-message');
    expect(control).toHaveAttribute('id', 'supplied-trailing');
    expect(screen.getByText('Updates')).toHaveAttribute('for', 'supplied-trailing');
    expect(ref.current).toBe(control);
    expect(control).toHaveAttribute('aria-describedby', `external-trailing ${message?.id}`);
    rerender(view(`external-trailing ${message?.id} external-trailing`, 'Unavailable', true, true));
    expect(screen.getByRole(role, { name: 'Updates', description: 'External guidance Unavailable' })).toBe(control);
    expect(control).toHaveAttribute('aria-describedby', `external-trailing ${message?.id}`);
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toBeDisabled();
    expect(control).toBeChecked();
    expect(ref.current).toBe(control);
    expect(screen.queryByText('Receive news')).not.toBeInTheDocument();
    expect(screen.getByText('Updates').parentElement?.style.position).toBe('absolute');
    rerender(view('external-trailing', '', false));
    expect(control).not.toHaveAttribute('aria-invalid');
    expect(control).toHaveAccessibleDescription('External guidance Receive news');
    expect(ref.current).toBe(control);
    unmount();
    expect(ref.current).toBeNull();
  });

  it.each(choices)('AC-03: $name generated ids remain distinct and stable', ({ component: Control, role }) => {
    const view = (hint: string) => (
      <>
        <Field label='First' layout='choice-trailing' hint={hint}>
          <Control />
        </Field>
        <Field label='Second' layout='choice-trailing'>
          <Control />
        </Field>
      </>
    );
    const { rerender } = render(view('Details'));
    const control = screen.getByRole(role, { name: 'First', description: 'Details' });
    const id = control.id;
    expect(id).toBeTruthy();
    expect(id).not.toBe(screen.getByRole(role, { name: 'Second' }).id);
    rerender(view('Changed details'));
    expect(control.id).toBe(id);
    expect(control).toHaveAccessibleDescription('Changed details');
  });

  it.each(choices)('AC-04: $name tab stop and keyboard', async ({ component: Control, role }) => {
    const user = userEvent.setup();
    const changed = vi.fn();
    render(
      <>
        <Field label='Updates' layout='choice-trailing' hint='Receive news'>
          <Control onCheckedChange={changed} />
        </Field>
        <button type='button'>Next</button>
      </>
    );
    const control = screen.getByRole(role, { name: 'Updates' });
    await user.tab();
    expect(control).toHaveFocus();
    await user.keyboard('[Space]');
    expect(control).toBeChecked();
    await user.keyboard('[Enter]');
    expect(control).toHaveAttribute('aria-checked', role === 'switch' ? 'false' : 'true');
    expect(changed.mock.calls).toEqual(role === 'switch' ? [[true], [false]] : [[true]]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it.each(choices)('AC-05: $name coarse target and logical wrapping', ({ component: Control, role }) => {
    render(
      <Field label='AnExtraordinarilyLongUnbrokenLabel' layout='choice-trailing' hint='A long message' dir='rtl'>
        <Control />
      </Field>
    );
    const control = screen.getByRole(role, { name: 'AnExtraordinarilyLongUnbrokenLabel' });
    const root = rootFor(control);
    const label = screen.getByText('AnExtraordinarilyLongUnbrokenLabel');
    const message = screen.getByText('A long message').closest('.eg-field-message');
    expect(root).toHaveAttribute('dir', 'rtl');
    // The label text is an anonymous flex item: only wrap-anywhere lowers its min-content, so an
    // unbroken word breaks inside the text column instead of running under the control.
    expect(label).toHaveClass('grow', 'flex', 'items-center', 'pointer-coarse:min-h-14', 'wrap-anywhere', 'min-w-0');
    expect(label).not.toHaveClass('wrap-break-word');
    for (const part of [root, label.parentElement, label, message?.parentElement]) {
      expect(part?.className).not.toMatch(/(?:^|\s)(?:left|right|ml|mr|pl|pr|text-left|text-right)-/);
    }
  });

  it.each(choices)('AC-06: $name control classes and disabled dimming', ({ component: Control, role }) => {
    const baseline = render(<Control disabled={true} className='consumer-control' />);
    const originalClasses = screen.getByRole(role).className;
    baseline.unmount();
    render(
      <Field label='Updates' layout='choice-trailing' hint='Unavailable'>
        <Control disabled={true} className='consumer-control' />
      </Field>
    );
    const control = screen.getByRole(role, { name: 'Updates' });
    const label = screen.getByText('Updates');
    const message = screen.getByText('Unavailable').closest('.eg-field-message');
    expect(control.className).toBe(originalClasses);
    for (const part of [label.parentElement, message?.parentElement]) {
      expect(part).toHaveClass('group-has-[:disabled]:opacity-45', 'group-has-[[data-disabled]]:opacity-45');
      expect(Array.from(part?.classList ?? []).filter((name) => name.includes('opacity-45'))).toHaveLength(2);
    }
    for (const part of [rootFor(control), label, message]) {
      expect(part?.className).not.toContain('opacity-45');
    }
  });

  it.each(choices)('AC-07: $name omissions and root attributes', ({ component: Control, role }) => {
    render(
      <Field
        label='Updates'
        layout='choice-trailing'
        id='field-root-trailing'
        title='Preferences'
        data-owner='consumer'
        className='w-full mt-2'
        readout='Omitted readout'
        counter={{ value: 1, max: 2 }}
        hint='Receive news'
      >
        <Control />
      </Field>
    );
    const control = screen.getByRole(role, { name: 'Updates', description: 'Receive news' });
    const root = rootFor(control);
    expect(root).toHaveAttribute('id', 'field-root-trailing');
    expect(root).toHaveAttribute('title', 'Preferences');
    expect(root).toHaveAttribute('data-owner', 'consumer');
    expect(root).toHaveClass('w-full', 'mt-2');
    expect(control).not.toHaveClass('w-full', 'mt-2');
    expect(screen.queryByText('Omitted readout')).not.toBeInTheDocument();
    expect(screen.queryByText('1 / 2')).not.toBeInTheDocument();
    expect(control.getAttribute('aria-describedby')?.split(' ')).toHaveLength(1);
  });
});

describe('FieldMessage composition', () => {
  it.each([
    ['description', 'text-fg-muted'],
    ['info', 'text-status-info'],
    ['warning', 'text-status-warning'],
    ['success', 'text-status-success']
  ] as const)('uses %s guidance without changing validity or announcements', (hintTone, color) => {
    const { container } = render(
      <Field label='Title' hint='Check this value' hintTone={hintTone}>
        <Input />
      </Field>
    );
    const control = screen.getByRole('textbox', { name: 'Title', description: 'Check this value' });
    const message = container.querySelector('.eg-field-message');
    expect(message).toHaveClass(color);
    expect(message?.id).toBe(control.getAttribute('aria-describedby'));
    expect(control).not.toHaveAttribute('aria-invalid');
    expect(rootFor(control)).not.toHaveAttribute('data-state');
    expect(rootFor(control)).not.toHaveAttribute('hintTone');
    expect(container.querySelector('[role="alert"], [role="status"], [aria-live]')).toBeNull();
    expect(message?.querySelector('svg') === null).toBe(hintTone === 'description');
  });

  it('keeps error precedence, identity and focus while hint tone changes and recovers', () => {
    const view = (error: string, hintTone: 'info' | 'success') => (
      <Field label='Title' hint='Available name' error={error} hintTone={hintTone}>
        <Input />
      </Field>
    );
    const { container, rerender } = render(view('Required', 'info'));
    const control = screen.getByRole('textbox', { name: 'Title' });
    const id = control.getAttribute('aria-describedby');
    control.focus();
    rerender(view('Required', 'success'));
    expect(container.querySelector('.eg-field-message')).toHaveClass('text-status-danger');
    expect(control).toHaveAccessibleDescription('Required');
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toHaveFocus();
    rerender(view('', 'success'));
    expect(control).toHaveAccessibleDescription('Available name');
    expect(control).toHaveAttribute('aria-describedby', id);
    expect(control).not.toHaveAttribute('aria-invalid');
    expect(container.querySelector('.eg-field-message')).toHaveClass('text-status-success');
  });
});
