import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useId, useState } from 'react';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Textarea } from './Textarea';
import type { TextareaProps, TextareaVariant } from './types';
import { useTextarea } from './useTextarea';

const classes = (variant?: TextareaVariant, className?: string) =>
  renderHook(() => useTextarea({ variant, className })).result.current.rootProps.className.split(' ');

/** Field-like harness: a native label, a hint and an error relate to the control as Field will. */
function FieldHarness() {
  const id = useId();
  const hintId = useId();
  return (
    <>
      <label htmlFor={id}>First comment</label>
      <Textarea id={id} aria-describedby={hintId} />
      <p id={hintId}>Shown below the post</p>
    </>
  );
}

function ControlledHarness({ onValue }: { onValue: (value: string) => void }) {
  const [value, setValue] = useState('Draft');
  return (
    <Textarea
      aria-label='Notes'
      value={value}
      onChange={(event) => {
        setValue(event.target.value);
        onValue(event.target.value);
      }}
    />
  );
}

describe('Textarea contract', () => {
  it('renders exactly one native textarea root with the public marker and targets the ref at it (AC-01)', () => {
    const ref = createRef<HTMLTextAreaElement>();
    const { container, unmount } = render(<Textarea aria-label='Notes' ref={ref} />);
    const textbox = screen.getByRole('textbox', { name: 'Notes' });
    expect(textbox.tagName).toBe('TEXTAREA');
    expect(textbox).toHaveClass('eg-textarea');
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild === textbox).toBe(true);
    expect(ref.current === textbox).toBe(true);
    unmount();
    expect(ref.current).toBeNull();
  });

  it('forwards native attributes and aria to the root without leaking the variant (AC-02)', () => {
    render(
      <Textarea
        aria-label='Notes'
        aria-describedby='notes-hint'
        data-tracking='notes'
        id='notes'
        name='notes'
        rows={3}
        maxLength={1250}
        placeholder='Write a note'
        required={true}
        spellCheck={false}
        variant='code'
      />
    );
    const textbox = screen.getByRole('textbox', { name: 'Notes' });
    expect(textbox).toHaveAttribute('aria-describedby', 'notes-hint');
    expect(textbox).toHaveAttribute('data-tracking', 'notes');
    expect(textbox).toHaveAttribute('id', 'notes');
    expect(textbox).toHaveAttribute('name', 'notes');
    expect(textbox).toHaveAttribute('rows', '3');
    expect(textbox).toHaveAttribute('maxlength', '1250');
    expect(textbox).toHaveAttribute('placeholder', 'Write a note');
    expect(textbox).toHaveAttribute('spellcheck', 'false');
    expect(textbox).toBeRequired();
    expect(textbox).not.toHaveAttribute('variant');
    expect(textbox).not.toHaveAttribute('data-state');
  });

  it('merges layout className last through cn() and keeps the public marker first (AC-02)', () => {
    const merged = classes(undefined, 'mt-2 mt-4 min-h-40');
    expect(merged[0]).toBe('eg-textarea');
    expect(merged).toContain('mt-4');
    expect(merged).not.toContain('mt-2');
    expect(merged.at(-1)).toBe('min-h-40');
    expect(merged).not.toContain('min-h-30');
  });

  it('inserts text and new lines natively and fires onChange in uncontrolled mode (AC-03)', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Textarea aria-label='Notes' defaultValue='' onChange={onChange} />);
    const textbox = screen.getByRole('textbox', { name: 'Notes' });
    await user.type(textbox, 'First{Enter}Second');
    expect(textbox).toHaveValue('First\nSecond');
    expect(onChange).toHaveBeenCalledTimes('First\nSecond'.length);
  });

  it('supports controlled value with onChange (AC-03)', async () => {
    const user = userEvent.setup();
    const values: string[] = [];
    render(<ControlledHarness onValue={(value) => values.push(value)} />);
    const textbox = screen.getByRole('textbox', { name: 'Notes' });
    await user.type(textbox, '{Enter}!');
    expect(textbox).toHaveValue('Draft\n!');
    expect(values).toEqual(['Draft\n', 'Draft\n!']);
  });

  it('is a single tab stop that Tab leaves without capturing (AC-04)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Textarea aria-label='Notes' />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(screen.getByRole('textbox', { name: 'Notes' })).toHaveValue('');
  });

  it('removes disabled from the tab order and keeps its value (AC-04)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Textarea aria-label='Notes' defaultValue='Locked' disabled={true} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    const textbox = screen.getByRole('textbox', { name: 'Notes' });
    expect(textbox).toBeDisabled();
    await user.type(textbox, 'More');
    expect(textbox).toHaveValue('Locked');
  });

  it('keeps read-only focusable but not editable (AC-04)', async () => {
    const user = userEvent.setup();
    render(<Textarea aria-label='Notes' defaultValue='Published' readOnly={true} />);
    await user.tab();
    const textbox = screen.getByRole('textbox', { name: 'Notes' });
    expect(textbox).toHaveFocus();
    await user.type(textbox, 'More');
    expect(textbox).toHaveValue('Published');
  });

  it('defaults the variant to default and maps each variant to its treatment (AC-05)', () => {
    const { result } = renderHook(() => useTextarea({}));
    expect(result.current.variant).toBe('default');
    expect(classes()).toEqual(classes('default'));
    const base = classes('default');
    for (const utility of [
      'bg-surface-0',
      'shadow-[var(--shadow-well)]',
      'min-h-30',
      'font-sans',
      'text-body-default'
    ]) {
      expect(base, utility).toContain(utility);
    }
    const code = classes('code');
    for (const utility of [
      'font-mono',
      'text-code',
      'bg-primitive-neutral-950',
      'min-h-30',
      'shadow-[var(--shadow-well)]'
    ]) {
      expect(code, utility).toContain(utility);
    }
    expect(code).not.toContain('bg-surface-0');
    const prose = classes('prose');
    for (const utility of [
      'bg-surface-1',
      'bg-[image:var(--gradient-sheen)]',
      'border-border-hairline',
      'shadow-[var(--shadow-edge),var(--shadow-elev-1)]',
      'min-h-70',
      'p-5',
      'text-body-default'
    ]) {
      expect(prose, utility).toContain(utility);
    }
    for (const utility of [
      'bg-surface-0',
      'shadow-[var(--shadow-well)]',
      'border-border-control',
      'hover:border-fg-muted'
    ]) {
      expect(prose, utility).not.toContain(utility);
    }
  });

  it('resizes vertically only with a rounded bordered box on every variant (AC-06)', () => {
    for (const variant of ['default', 'code', 'prose'] as const) {
      const list = classes(variant);
      for (const utility of ['resize-y', 'box-border', 'w-full', 'rounded-md', 'border', 'text-fg-default']) {
        expect(list, `${variant} ${utility}`).toContain(utility);
      }
    }
  });

  it('declares focus, hover, invalid, disabled and motion treatments per variant (AC-07, AC-08)', () => {
    for (const variant of ['default', 'code'] as const) {
      const list = classes(variant);
      for (const utility of [
        'border-border-control',
        'hover:border-fg-muted',
        'read-only:hover:border-border-control',
        'focus-visible:border-border-brand-strong',
        'focus-visible:shadow-[var(--shadow-well),var(--shadow-ring-brand)]'
      ]) {
        expect(list, `${variant} ${utility}`).toContain(utility);
      }
    }
    expect(classes('prose')).toContain('focus-visible:border-border-brand-strong');
    expect(classes('prose')).toContain(
      'focus-visible:shadow-[var(--shadow-edge),var(--shadow-elev-1),var(--shadow-glow-base)]'
    );
    for (const variant of ['default', 'code', 'prose'] as const) {
      const list = classes(variant);
      for (const utility of [
        'focus-visible:outline-none',
        'aria-invalid:border-status-danger',
        'aria-invalid:hover:border-status-danger',
        'aria-invalid:focus-visible:border-status-danger',
        'disabled:opacity-45',
        'disabled:pointer-events-none',
        'disabled:cursor-not-allowed',
        'transition-[border-color,box-shadow]',
        'ease-out',
        'duration-[var(--duration-fast)]',
        'motion-reduce:transition-none'
      ]) {
        expect(list, `${variant} ${utility}`).toContain(utility);
      }
    }
  });

  it('uses native aria-invalid without an own state attribute (AC-07)', () => {
    render(<Textarea aria-label='Notes' aria-invalid='true' />);
    const textbox = screen.getByRole('textbox', { name: 'Notes' });
    expect(textbox).toBeInvalid();
    expect(textbox).not.toHaveAttribute('data-state');
  });

  it('composes with a label and aria-describedby as Field will (AC-11)', () => {
    render(<FieldHarness />);
    expect(
      screen.getByRole('textbox', { name: 'First comment', description: 'Shown below the post' })
    ).toBeInTheDocument();
  });

  it('exposes the variant union, a textarea ref and no children or asChild in the public type', () => {
    expectTypeOf<TextareaProps['variant']>().toEqualTypeOf<TextareaVariant | undefined>();
    expectTypeOf<TextareaVariant>().toEqualTypeOf<'default' | 'code' | 'prose'>();
    expectTypeOf<Extract<keyof TextareaProps, 'children' | 'asChild' | 'ref'>>().toEqualTypeOf<never>();
  });
});
