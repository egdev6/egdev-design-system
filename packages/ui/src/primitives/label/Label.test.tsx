import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode, useId } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Label } from './Label';
import type { LabelProps, LabelVariant } from './types';
import { useLabel } from './useLabel';

/** Harness rendering a Label and its native control paired through useId-based htmlFor. */
function PairedField() {
  const id = useId();
  return (
    <>
      <Label htmlFor={id}>Project name</Label>
      <input id={id} type='text' />
    </>
  );
}

describe('Label contract', () => {
  it('renders exactly one native label with the public marker and required text', () => {
    const { container } = render(<Label>Project name</Label>);
    const label = screen.getByText('Project name');
    expect(label.tagName).toBe('LABEL');
    expect(label).toHaveClass('eg-label');
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(label);
  });

  it('associates htmlFor with a native control using useId', () => {
    render(<PairedField />);
    expect(screen.getByRole('textbox', { name: 'Project name' })).toBeInTheDocument();
  });

  it('focuses the paired textbox when the label is clicked', async () => {
    const user = userEvent.setup();
    render(<PairedField />);
    await user.click(screen.getByText('Project name'));
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveFocus();
  });

  it('toggles a wrapped native checkbox when the label text is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Label>
        <input type='checkbox' /> Subscribe
      </Label>
    );
    const checkbox = screen.getByRole('checkbox', { name: 'Subscribe' });
    await user.click(screen.getByText('Subscribe'));
    expect(checkbox).toBeChecked();
  });

  it('prevents default only for multi-detail label mouse downs, preserving double-click semantics', () => {
    render(<Label htmlFor='target'>Terms</Label>);
    const label = screen.getByText('Terms');
    expect(fireEvent.mouseDown(label, { detail: 1 })).toBe(true);
    expect(fireEvent.mouseDown(label, { detail: 2 })).toBe(false);
  });

  it('never prevents mouse downs that start inside the wrapped control', () => {
    render(
      <Label>
        <input type='text' aria-label='Nickname' /> Nickname
      </Label>
    );
    const input = screen.getByRole('textbox', { name: 'Nickname' });
    expect(fireEvent.mouseDown(input, { detail: 2 })).toBe(true);
    expect(fireEvent.mouseDown(input, { detail: 1 })).toBe(true);
  });

  it('passes native aria and data attributes through to the label element', () => {
    render(
      <Label data-tracking='field-label' aria-describedby='hint' title='Shown above the input'>
        Project name
      </Label>
    );
    const label = screen.getByText('Project name');
    expect(label).toHaveAttribute('data-tracking', 'field-label');
    expect(label).toHaveAttribute('aria-describedby', 'hint');
    expect(label).toHaveAttribute('title', 'Shown above the input');
  });

  it('forwards the label element ref and cleans it up on unmount', () => {
    const ref = createRef<HTMLLabelElement>();
    const { unmount } = render(<Label ref={ref}>Project name</Label>);
    expect(ref.current?.tagName).toBe('LABEL');
    expect(ref.current).toBe(screen.getByText('Project name'));
    unmount();
    expect(ref.current).toBeNull();
  });

  it('keeps native semantics: the label is not focusable and tab order reaches only real controls', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <PairedField />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('textbox', { name: 'Project name' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('derives the field default with token typography and merges layout-only consumer classes last', () => {
    const { result } = renderHook(() => useLabel({ children: 'Project name', className: 'mt-2 mt-4' }));
    expect(result.current.variant).toBe('field');
    expect(result.current.rootProps.className).toContain('eg-label');
    expect(result.current.rootProps.className).toContain('font-sans');
    expect(result.current.rootProps.className).toContain('text-label-default');
    expect(result.current.rootProps.className).toContain('text-fg-secondary');
    expect(result.current.rootProps.className).toContain('mt-4');
    expect(result.current.rootProps.className).not.toContain('mt-2');
    expect(result.current.rootProps.className).not.toContain('font-[var(--text-body-default--font-weight)]');
  });

  it('derives the approved choice weight token without dropping the size recipe', () => {
    const { result } = renderHook(() => useLabel({ children: 'Subscribe', variant: 'choice' }));
    expect(result.current.variant).toBe('choice');
    expect(result.current.rootProps.className).toContain('font-[var(--text-body-default--font-weight)]');
    expect(result.current.rootProps.className).toContain('text-label-default');
    expect(result.current.rootProps.className).toContain('text-fg-secondary');
  });

  it('derives typed root props while preserving native label attributes', () => {
    const { result } = renderHook(() => useLabel({ children: 'Project name', htmlFor: 'name', id: 'name-label' }));
    expect(result.current.rootProps.htmlFor).toBe('name');
    expect(result.current.rootProps.id).toBe('name-label');
    expect(result.current.rootProps.children).toBe('Project name');
  });

  it('does not render the variant as a DOM attribute', () => {
    render(<Label variant='choice'>Subscribe</Label>);
    expect(screen.getByText('Subscribe')).not.toHaveAttribute('variant');
  });

  it('enforces required children and the excluded asChild API in the public type', () => {
    expectTypeOf<{ children: ReactNode }>().toExtend<LabelProps>();
    expectTypeOf<Extract<keyof LabelProps, 'asChild'>>().toEqualTypeOf<never>();
    expectTypeOf<LabelProps['variant']>().toEqualTypeOf<LabelVariant | undefined>();
  });
});
