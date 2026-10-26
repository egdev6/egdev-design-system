import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { describe, expect, expectTypeOf, it, onTestFinished, vi } from 'vitest';
import { RadioGroup } from './RadioGroup';
import type { RadioGroupOption, RadioGroupOrientation, RadioGroupProps } from './types';
import { radioGroupVariants } from './types';
import { useRadioGroup } from './useRadioGroup';

const visibility: RadioGroupOption[] = [
  { value: 'public', label: 'Public' },
  { value: 'unlisted', label: 'Unlisted' },
  { value: 'private', label: 'Private' }
];

const formats: RadioGroupOption[] = [
  { value: 'video', label: 'Video' },
  { value: 'short', label: 'Short', disabled: true },
  { value: 'live', label: 'Live' }
];

/**
 * Radix moves roving focus in a timeout and checks the newly focused radio only while an arrow
 * key is still held, as in a browser; press, let the focus move, then release.
 */
async function arrow(user: ReturnType<typeof userEvent.setup>, key: string) {
  await user.keyboard(`{${key}>}`);
  await user.keyboard(`{/${key}}`);
}

function radio(name: string) {
  return screen.getByRole('radio', { name });
}

function row(control: HTMLElement) {
  const part = control.parentElement;
  if (!part) {
    throw new Error('Missing RadioGroup row');
  }
  return part;
}

/** Radix measures its hidden form inputs; jsdom has no ResizeObserver. Restored after the test. */
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

/** Controlled harness whose consumer state drives the group (AC-04). */
function ControlledGroup({ onValueChange }: { onValueChange: (value: string) => void }) {
  const [value, setValue] = useState('unlisted');
  return (
    <RadioGroup
      label='Visibility'
      options={visibility}
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
    />
  );
}

describe('RadioGroup', () => {
  it('renders a named radiogroup with one named radio per option and the public marker (AC-01)', () => {
    const { container } = render(<RadioGroup label='Visibility' options={visibility} />);
    const group = screen.getByRole('radiogroup', { name: 'Visibility' });
    expect(container.firstElementChild).toBe(group);
    expect(group).toHaveClass('eg-radio-group');
    expect(group).toHaveAttribute('aria-orientation', 'vertical');
    expect(group).toHaveAttribute('data-orientation', 'vertical');
    const radios = screen.getAllByRole('radio');
    expect(radios.map((item) => item.textContent)).toEqual(['', '', '']);
    expect(radios.map((item) => item.tagName)).toEqual(['BUTTON', 'BUTTON', 'BUTTON']);
    for (const option of visibility) {
      const control = radio(option.label);
      expect(control).toHaveAttribute('type', 'button');
      expect(control).toHaveAttribute('value', option.value);
      expect(row(control).parentElement).toBe(group);
    }
  });

  it('starts with nothing checked and no indicator when uncontrolled without defaultValue (AC-04)', () => {
    render(<RadioGroup label='Visibility' options={visibility} />);
    for (const control of screen.getAllByRole('radio')) {
      expect(control).toHaveAttribute('aria-checked', 'false');
      expect(control).toHaveAttribute('data-state', 'unchecked');
      expect(control.children).toHaveLength(0);
    }
  });

  it('starts from defaultValue and shows the indicator only on the checked item (AC-03, AC-04)', () => {
    render(<RadioGroup label='Visibility' options={visibility} defaultValue='public' />);
    const checked = radio('Public');
    expect(checked).toHaveAttribute('aria-checked', 'true');
    expect(checked).toHaveAttribute('data-state', 'checked');
    expect(checked.children).toHaveLength(1);
    expect(checked.firstElementChild?.tagName).toBe('SPAN');
    expect(checked.firstElementChild).toHaveAttribute('data-state', 'checked');
    expect(radio('Private').children).toHaveLength(0);
  });

  it('selects on item click and on label click, without re-emitting for the checked item (AC-03)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroup label='Visibility' options={visibility} onValueChange={onValueChange} />);
    await user.click(radio('Unlisted'));
    expect(radio('Unlisted')).toHaveAttribute('aria-checked', 'true');
    await user.click(screen.getByText('Private'));
    expect(radio('Private')).toHaveAttribute('aria-checked', 'true');
    expect(radio('Unlisted')).toHaveAttribute('aria-checked', 'false');
    await user.click(radio('Private'));
    expect(onValueChange.mock.calls).toEqual([['unlisted'], ['private']]);
  });

  it('enters on the checked item, moves selection with vertical arrows, wraps and leaves on Tab (AC-02)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <>
        <button type='button'>Before</button>
        <RadioGroup label='Visibility' options={visibility} defaultValue='unlisted' onValueChange={onValueChange} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    await user.tab();
    expect(radio('Unlisted')).toHaveFocus();
    await arrow(user, 'ArrowDown');
    expect(radio('Private')).toHaveFocus();
    expect(radio('Private')).toHaveAttribute('aria-checked', 'true');
    await arrow(user, 'ArrowDown');
    expect(radio('Public')).toHaveFocus();
    await arrow(user, 'ArrowUp');
    expect(radio('Private')).toHaveFocus();
    expect(onValueChange.mock.calls).toEqual([['private'], ['public'], ['private']]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('enters on the first enabled item when nothing is checked and Space selects it', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label='Format'
        options={[{ value: 'clip', label: 'Clip', disabled: true }, ...visibility]}
        onValueChange={onValueChange}
      />
    );
    await user.tab();
    expect(radio('Public')).toHaveFocus();
    expect(radio('Public')).toHaveAttribute('aria-checked', 'false');
    await user.keyboard(' ');
    expect(radio('Public')).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenCalledWith('public');
  });

  it('follows the horizontal axis and skips disabled options (AC-02, AC-05)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <RadioGroup
        label='Format'
        options={formats}
        orientation='horizontal'
        defaultValue='video'
        onValueChange={onValueChange}
      />
    );
    const group = screen.getByRole('radiogroup', { name: 'Format' });
    expect(group).toHaveAttribute('aria-orientation', 'horizontal');
    expect(group).toHaveClass('flex-wrap', 'gap-x-6', 'gap-y-1');
    await user.tab();
    expect(radio('Video')).toHaveFocus();
    await arrow(user, 'ArrowRight');
    expect(radio('Live')).toHaveFocus();
    expect(radio('Live')).toHaveAttribute('aria-checked', 'true');
    await arrow(user, 'ArrowLeft');
    expect(radio('Video')).toHaveFocus();
    expect(onValueChange.mock.calls).toEqual([['live'], ['video']]);
  });

  it('cannot select a disabled option, which stays dimmed through its row (AC-05)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<RadioGroup label='Format' options={formats} onValueChange={onValueChange} />);
    const short = radio('Short');
    expect(short).toBeDisabled();
    expect(short).toHaveAttribute('data-disabled');
    await user.click(short);
    await user.click(screen.getByText('Short'));
    expect(short).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(row(short)).toHaveClass('has-[[data-disabled]]:opacity-45');
  });

  it('disables every option of a disabled group and keeps it out of the Tab order (AC-05)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <>
        <button type='button'>Before</button>
        <RadioGroup
          label='Visibility'
          options={visibility}
          defaultValue='public'
          disabled={true}
          onValueChange={onValueChange}
        />
        <button type='button'>After</button>
      </>
    );
    const group = screen.getByRole('radiogroup');
    expect(group).toHaveAttribute('data-disabled');
    for (const control of screen.getAllByRole('radio')) {
      expect(control).toBeDisabled();
    }
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.click(radio('Private'));
    expect(radio('Public')).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('follows the consumer-owned value in controlled mode (AC-04)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ControlledGroup onValueChange={onValueChange} />);
    expect(radio('Unlisted')).toHaveAttribute('aria-checked', 'true');
    await user.click(radio('Public'));
    expect(radio('Public')).toHaveAttribute('aria-checked', 'true');
    expect(onValueChange).toHaveBeenCalledWith('public');
  });

  it('keeps a controlled value that the consumer does not update, and an unknown value checks nothing (AC-04)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(
      <RadioGroup label='Visibility' options={visibility} value='public' onValueChange={onValueChange} />
    );
    await user.click(radio('Private'));
    expect(onValueChange).toHaveBeenCalledWith('private');
    expect(radio('Public')).toHaveAttribute('aria-checked', 'true');
    expect(radio('Private')).toHaveAttribute('aria-checked', 'false');
    rerender(<RadioGroup label='Visibility' options={visibility} value='archived' onValueChange={onValueChange} />);
    for (const control of screen.getAllByRole('radio')) {
      expect(control).toHaveAttribute('aria-checked', 'false');
    }
  });

  it('submits the checked value under name and marks the group required (AC-07)', async () => {
    stubResizeObserver();
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <RadioGroup label='Visibility' options={visibility} name='visibility' required={true} />
      </form>
    );
    const form = container.querySelector('form');
    if (!form) {
      throw new Error('Missing form');
    }
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'true');
    const inputs = [...form.querySelectorAll('input[type="radio"]')];
    expect(inputs).toHaveLength(3);
    for (const input of inputs) {
      expect(input).toHaveAttribute('name', 'visibility');
      expect(input).toBeRequired();
      expect(input).toHaveAttribute('aria-hidden', 'true');
    }
    expect(new FormData(form).get('visibility')).toBeNull();
    await user.click(radio('Unlisted'));
    expect(new FormData(form).get('visibility')).toBe('unlisted');
  });

  it('restores the initial value when its form is reset', async () => {
    stubResizeObserver();
    const user = userEvent.setup();
    const { container } = render(
      <form>
        <RadioGroup label='Visibility' options={visibility} name='visibility' defaultValue='public' />
      </form>
    );
    await user.click(radio('Private'));
    expect(radio('Private')).toHaveAttribute('aria-checked', 'true');
    container.querySelector('form')?.reset();
    await waitFor(() => expect(radio('Public')).toHaveAttribute('aria-checked', 'true'));
  });

  it('is not required and renders no hidden inputs outside a form by default', () => {
    render(<RadioGroup label='Visibility' options={visibility} />);
    expect(screen.getByRole('radiogroup')).toHaveAttribute('aria-required', 'false');
    expect(document.querySelectorAll('input')).toHaveLength(0);
  });

  it('derives unique item ids per instance through useId, used only for label association (AC-08)', () => {
    render(
      <>
        <RadioGroup label='Visibility' options={visibility} />
        <RadioGroup label='Archive visibility' options={visibility} />
      </>
    );
    const ids = screen.getAllByRole('radio').map((control) => control.id);
    expect(ids.every(Boolean)).toBe(true);
    expect(new Set(ids).size).toBe(6);
    for (const control of screen.getAllByRole('radio')) {
      const label = row(control).querySelector('label');
      expect(label).toHaveAttribute('for', control.id);
      expect(control.className).not.toContain(control.id);
    }
  });

  it('lets a consumer aria-labelledby name the group and forwards native attributes to the root', () => {
    render(
      <>
        <h2 id='visibility-legend'>Who can see this?</h2>
        <p id='visibility-hint'>Applies to new uploads.</p>
        <RadioGroup
          label='Visibility'
          options={visibility}
          id='visibility'
          aria-labelledby='visibility-legend'
          aria-describedby='visibility-hint'
          data-tracking='visibility'
        />
      </>
    );
    const group = screen.getByRole('radiogroup', { name: 'Who can see this?' });
    expect(group).toHaveAttribute('aria-label', 'Visibility');
    expect(group).toHaveAttribute('id', 'visibility');
    expect(group).toHaveAttribute('data-tracking', 'visibility');
    expect(group).toHaveAccessibleDescription('Applies to new uploads.');
  });

  it('renders an empty named group for empty options', () => {
    render(<RadioGroup label='Visibility' options={[]} />);
    expect(screen.getByRole('radiogroup', { name: 'Visibility' })).toBeEmptyDOMElement();
  });

  it('applies the documented row, item, indicator and label token utilities (AC-06)', () => {
    render(<RadioGroup label='Visibility' options={visibility} defaultValue='public' />);
    const control = radio('Public');
    expect(screen.getByRole('radiogroup')).toHaveClass('flex', 'flex-col', 'gap-1');
    expect(row(control)).toHaveClass(
      'flex',
      'items-center',
      'gap-2',
      'min-h-10',
      'font-sans',
      'text-label-default',
      'text-fg-secondary',
      'has-[[data-state=checked]]:text-fg-default',
      'has-[[data-disabled]]:opacity-45'
    );
    expect(control).toHaveClass(
      'box-border',
      'p-0',
      'grid',
      'place-items-center',
      'size-5',
      'shrink-0',
      'rounded-full',
      'border',
      'border-solid',
      'border-border-control',
      'bg-surface-0',
      'shadow-[var(--shadow-well)]',
      'hover:border-fg-muted',
      'data-[state=checked]:border-action-primary-solid-bg',
      'data-[state=checked]:bg-[image:var(--gradient-btn-primary)]',
      'data-[state=checked]:shadow-[var(--shadow-btn-primary)]',
      'focus-visible:outline-none',
      'focus-visible:shadow-[var(--shadow-focus)]',
      'data-[state=checked]:focus-visible:shadow-[var(--shadow-focus)]',
      'disabled:pointer-events-none',
      'motion-reduce:transition-none'
    );
    expect(control.firstElementChild).toHaveClass('size-2', 'rounded-full', 'bg-action-primary-solid-fg');
    expect(row(control).querySelector('label')).toHaveClass('cursor-pointer');
  });

  it('never mirrors Radix state into classes', async () => {
    const user = userEvent.setup();
    render(<RadioGroup label='Visibility' options={visibility} />);
    const control = radio('Public');
    const before = [control.className, row(control).className];
    await user.click(control);
    expect([control.className, row(control).className]).toEqual(before);
  });

  it('merges layout-only consumer classes last on the root and never on rows or items (AC-09)', () => {
    const { result } = renderHook(() =>
      useRadioGroup({ label: 'Visibility', options: visibility, className: 'ms-1 ms-2 consumer-group' })
    );
    const root = result.current.rootProps.className.split(' ');
    expect(root[0]).toBe('eg-radio-group');
    expect(root.slice(-2)).toEqual(['ms-2', 'consumer-group']);
    expect(root).not.toContain('ms-1');
    for (const item of result.current.items) {
      expect(item.rowProps.className).toBe(radioGroupVariants.row());
      expect(item.itemProps.className).toBe(radioGroupVariants.item());
      expect(item.indicatorProps.className).toBe(radioGroupVariants.indicator());
      expect(item.labelProps.className).toBe(radioGroupVariants.label());
    }
  });

  it('derives the documented constant defaults and maps label and options through the hook', () => {
    const onValueChange = vi.fn();
    const { result } = renderHook(() =>
      useRadioGroup({ label: 'Format', options: formats, name: 'format', onValueChange })
    );
    expect(result.current.rootProps).toMatchObject({
      'aria-label': 'Format',
      orientation: 'vertical',
      disabled: false,
      required: false,
      name: 'format',
      onValueChange
    });
    expect(result.current.rootProps).not.toHaveProperty('label');
    expect(result.current.rootProps).not.toHaveProperty('options');
    expect(result.current.rootProps.className).toBe(radioGroupVariants.root({ orientation: 'vertical' }));
    expect(result.current.items.map((item) => [item.key, item.itemProps.value, item.itemProps.disabled])).toEqual([
      ['video', 'video', false],
      ['short', 'short', true],
      ['live', 'live', false]
    ]);
    expect(result.current.items.map((item) => item.labelProps.children)).toEqual(['Video', 'Short', 'Live']);
    for (const item of result.current.items) {
      expect(item.labelProps.htmlFor).toBe(item.itemProps.id);
    }
  });

  it('exposes the documented API without children, asChild, ref or size', () => {
    expectTypeOf<RadioGroupProps['label']>().toEqualTypeOf<string>();
    expectTypeOf<RadioGroupProps['options']>().toEqualTypeOf<RadioGroupOption[]>();
    expectTypeOf<RadioGroupProps['onValueChange']>().toEqualTypeOf<((value: string) => void) | undefined>();
    expectTypeOf<RadioGroupProps['orientation']>().toEqualTypeOf<RadioGroupOrientation | undefined>();
    expectTypeOf<RadioGroupOrientation>().toEqualTypeOf<'vertical' | 'horizontal'>();
    expectTypeOf<
      Extract<keyof RadioGroupProps, 'children' | 'asChild' | 'ref' | 'size' | 'onChange' | 'dir' | 'role'>
    >().toEqualTypeOf<never>();
  });
});
