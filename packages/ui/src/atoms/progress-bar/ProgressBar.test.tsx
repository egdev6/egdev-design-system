import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarProps } from './types';
import { progressBarVariants } from './types';
import { useProgressBar } from './useProgressBar';

function parts(container: HTMLElement) {
  const root = container.querySelector('.eg-progress');
  const fill = root?.querySelector('.eg-progress-fill');
  if (!root || !fill) {
    throw new Error('Missing eg-progress root or eg-progress-fill');
  }
  return { root, fill };
}

describe('ProgressBar', () => {
  it('exposes a labelled progressbar with a 0–100 range and the current value (AC-01)', () => {
    const { container } = render(<ProgressBar label='Upload progress' value={45} />);
    const bar = screen.getByRole('progressbar', { name: 'Upload progress' });
    expect(bar).toBe(parts(container).root);
    expect(bar.tagName).toBe('DIV');
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', '45');
    expect(bar).toHaveAttribute('aria-valuetext', '45%');
    expect(bar).toHaveAttribute('data-state', 'loading');
    expect(bar).toHaveAttribute('data-value', '45');
    expect(bar).toHaveAttribute('data-max', '100');
    expect(bar).not.toHaveAttribute('aria-hidden');
  });

  it.each([
    [140, '100', 'complete', '1'],
    [-5, '0', 'loading', '0'],
    [100, '100', 'complete', '1'],
    [0, '0', 'loading', '0']
  ])('clamps %s to %s with data-state %s (AC-02)', (value, now, state, scale) => {
    const { container } = render(<ProgressBar label='Goal' value={value} />);
    const { root, fill } = parts(container);
    expect(root).toHaveAttribute('aria-valuenow', now);
    expect(root).toHaveAttribute('data-state', state);
    expect(fill).toHaveAttribute('data-state', state);
    expect((fill as HTMLElement).style.getPropertyValue('--eg-progress-value')).toBe(scale);
  });

  it.each([
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY]
  ])('treats %s as indeterminate with an empty fill and no value (AC-03)', (_case, value) => {
    const { container } = render(<ProgressBar label='Sync' value={value} valueText='Should not be announced' />);
    const { root, fill } = parts(container);
    expect(root).toHaveAttribute('role', 'progressbar');
    expect(root).not.toHaveAttribute('aria-valuenow');
    expect(root).not.toHaveAttribute('aria-valuetext');
    expect(root).not.toHaveAttribute('data-value');
    expect(root).toHaveAttribute('data-state', 'indeterminate');
    expect(fill).toHaveAttribute('data-state', 'indeterminate');
    expect((fill as HTMLElement).style.getPropertyValue('--eg-progress-value')).toBe('0');
    expect(fill.className).not.toMatch(/animate-/);
  });

  it.each([
    ['absent', undefined],
    ['empty', ''],
    ['whitespace-only', '   ']
  ])('is decorative and hidden from assistive technology when the label is %s (AC-04)', (_case, label) => {
    const { container } = render(<ProgressBar label={label} value={3} />);
    const { root } = parts(container);
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).not.toHaveAttribute('aria-label');
    expect(screen.queryByRole('progressbar')).toBeNull();
  });

  it('announces valueText as aria-valuetext (AC-05)', () => {
    render(<ProgressBar label='Subscriber goal' value={74} valueText='37 of 50 subscribers' />);
    expect(screen.getByRole('progressbar', { name: 'Subscriber goal' })).toHaveAttribute(
      'aria-valuetext',
      '37 of 50 subscribers'
    );
  });

  it('drives the fill only through the --eg-progress-value custom property (AC-06)', () => {
    const { container } = render(<ProgressBar label='Scroll' value={37.5} />);
    const fill = parts(container).fill as HTMLElement;
    expect(fill.style.getPropertyValue('--eg-progress-value')).toBe('0.375');
    expect(fill.style).toHaveLength(1);
    expect(fill).toHaveClass('origin-left', 'scale-x-[var(--eg-progress-value)]');
    expect(fill).not.toHaveAttribute('aria-hidden');
    expect(fill.childElementCount).toBe(0);
  });

  it('defaults to the sm hairline track with the brand fill (AC-07)', () => {
    const { container } = render(<ProgressBar value={45} />);
    const { root, fill } = parts(container);
    expect(root).toHaveClass('h-0.5', 'rounded-[var(--radius-sm)]', 'bg-border-subtle', 'relative', 'w-full');
    expect(root).not.toHaveClass('absolute', 'h-2.5', 'shadow-well');
    expect(fill).toHaveClass('bg-fg-brand-default');
    expect(fill).not.toHaveClass('shadow-edge-strong', 'bg-fg-muted');
  });

  it('renders the lg goal bar as a Material well with the gradient fill and token bevel (AC-07, D5, D6)', () => {
    const { container } = render(<ProgressBar size='lg' value={37} />);
    const { root, fill } = parts(container);
    expect(root).toHaveClass('h-2.5', 'rounded-full', 'bg-surface-0', 'shadow-well');
    expect(root).not.toHaveClass('h-0.5', 'bg-border-subtle');
    expect(fill).toHaveClass('bg-[image:var(--gradient-progress)]', 'shadow-edge-strong', 'rounded-[inherit]');
    expect(fill).not.toHaveClass('bg-fg-brand-default');
  });

  it.each([
    ['sm', 'bg-fg-brand-default'],
    ['lg', 'bg-[image:var(--gradient-progress)]']
  ] as const)('paints the muted %s series in fg-muted instead of %s (AC-07)', (size, brand) => {
    const { container } = render(<ProgressBar size={size} variant='muted' value={60} />);
    const { fill } = parts(container);
    expect(fill).toHaveClass('bg-fg-muted');
    expect(fill).not.toHaveClass(brand);
  });

  it('pins the sm edge strip flush to the container bottom without radius (AC-07, D7)', () => {
    const { container } = render(<ProgressBar edge={true} value={30} />);
    const { root } = parts(container);
    expect(root).toHaveClass(
      'absolute',
      'inset-x-0',
      'bottom-0',
      'w-auto',
      'rounded-none',
      'bg-bg-glass',
      'pointer-events-none',
      'h-0.5'
    );
    expect(root).not.toHaveClass('relative', 'w-full', 'bg-border-subtle', 'rounded-[var(--radius-sm)]');
  });

  it('rejects edge with the lg size at the type level and ignores it from untyped callers (AC-07, D7)', () => {
    // @ts-expect-error D7: edge placement is a 2px strip, so it only exists with size="sm".
    const invalid: ProgressBarProps = { value: 10, size: 'lg', edge: true };
    const { container } = render(<ProgressBar {...invalid} />);
    const { root } = parts(container);
    expect(root).toHaveClass('h-2.5', 'relative', 'w-full');
    expect(root).not.toHaveClass('absolute', 'bg-bg-glass');
  });

  it('keeps every CVA output free of conflicting utilities', () => {
    for (const size of ['sm', 'lg'] as const) {
      for (const edge of size === 'sm' ? [false, true] : [false]) {
        const classes = progressBarVariants({ size, edge }).split(' ');
        const positions = classes.filter((name) => name === 'relative' || name === 'absolute');
        expect(positions, `${size}/${edge}`).toHaveLength(1);
        expect(
          classes.filter((name) => name.startsWith('bg-')),
          `${size}/${edge}`
        ).toHaveLength(1);
        expect(
          classes.filter((name) => name.startsWith('rounded-')),
          `${size}/${edge}`
        ).toHaveLength(1);
      }
    }
  });

  it('keeps the eg-progress marker and merges consumer layout className last (AC-08)', () => {
    const { container } = render(<ProgressBar className='w-48 mt-2 consumer-progress' value={10} />);
    const { root, fill } = parts(container);
    expect(root.className.split(' ')[0]).toBe('eg-progress');
    expect(root).toHaveClass('w-48', 'mt-2', 'consumer-progress', 'h-0.5', 'bg-border-subtle');
    expect(root).not.toHaveClass('w-full');
    expect(root.className.split(' ').at(-1)).toBe('consumer-progress');
    expect(fill.className).not.toMatch(/w-48|consumer-progress/);
  });

  it('transitions the fill with motion tokens and drops the transition under reduced motion (AC-09)', () => {
    const { container } = render(<ProgressBar value={50} />);
    expect(parts(container).fill).toHaveClass(
      'transition-transform',
      'duration-[var(--duration-base)]',
      'ease-[var(--ease-out)]',
      'motion-reduce:transition-none'
    );
  });

  it('updates the value and state on rerender', () => {
    const { container, rerender } = render(<ProgressBar label='Alert time' value={20} />);
    rerender(<ProgressBar label='Alert time' value={100} />);
    const { root, fill } = parts(container);
    expect(root).toHaveAttribute('aria-valuenow', '100');
    expect(root).toHaveAttribute('data-state', 'complete');
    expect((fill as HTMLElement).style.getPropertyValue('--eg-progress-value')).toBe('1');
    rerender(<ProgressBar label='Alert time' value={Number.NaN} />);
    expect(root).toHaveAttribute('data-state', 'indeterminate');
  });

  it('forwards native div attributes to the root', () => {
    const { container } = render(
      <ProgressBar id='upload' title='Uploading' data-source='consumer' aria-describedby='upload-hint' value={5} />
    );
    const { root } = parts(container);
    expect(root).toHaveAttribute('id', 'upload');
    expect(root).toHaveAttribute('title', 'Uploading');
    expect(root).toHaveAttribute('data-source', 'consumer');
    expect(root).toHaveAttribute('aria-describedby', 'upload-hint');
  });

  it('keeps component-owned semantics against unsupported JavaScript prop spreads', () => {
    const unsupported = {
      role: 'meter',
      'aria-valuenow': 99,
      'aria-valuemax': 5,
      'aria-valuetext': 'Injected',
      'aria-label': 'Injected name',
      'aria-hidden': false,
      max: 50,
      getValueLabel: () => 'Injected',
      asChild: true,
      children: 'Injected'
    };
    const { container } = render(<ProgressBar {...unsupported} label='Owned' value={45} />);
    const { root } = parts(container);
    expect(root).toHaveAttribute('role', 'progressbar');
    expect(root).toHaveAttribute('aria-label', 'Owned');
    expect(root).toHaveAttribute('aria-valuenow', '45');
    expect(root).toHaveAttribute('aria-valuemax', '100');
    expect(root).toHaveAttribute('aria-valuetext', '45%');
    expect(root).not.toHaveAttribute('aria-hidden');
    expect(root).not.toHaveTextContent('Injected');
    const { container: decorative } = render(<ProgressBar {...unsupported} value={45} />);
    expect(parts(decorative).root).toHaveAttribute('aria-hidden', 'true');
    expect(parts(decorative).root).not.toHaveAttribute('aria-label');
  });

  it('is never focusable', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <ProgressBar label='Upload' value={45} />
        <button type='button'>Cancel</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    expect(parts(container).root).not.toHaveAttribute('tabindex');
  });

  it('derives value, labels and classes in the hook without leaking own props to the DOM', () => {
    const { result } = renderHook(() =>
      useProgressBar({ value: 140, label: 'Goal', valueText: 'Done', size: 'lg', variant: 'muted', id: 'goal' })
    );
    expect(result.current.rootProps).toMatchObject({ id: 'goal', value: 100, max: 100, 'aria-label': 'Goal' });
    expect(result.current.rootProps.getValueLabel?.(100, 100)).toBe('Done');
    for (const prop of ['label', 'valueText', 'size', 'variant', 'edge']) {
      expect(result.current.rootProps).not.toHaveProperty(prop);
    }
    expect(result.current.fillProps.style).toEqual({ '--eg-progress-value': 1 });
    const { result: indeterminate } = renderHook(() => useProgressBar({ value: Number.NaN }));
    expect(indeterminate.current.rootProps.value).toBeNull();
    expect(indeterminate.current.rootProps.getValueLabel).toBeUndefined();
    expect(indeterminate.current.rootProps).toMatchObject({ 'aria-hidden': true });
    expect(indeterminate.current.fillProps.style).toEqual({ '--eg-progress-value': 0 });
  });
});
