import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';
import type { SpinnerSize } from './types';
import { useSpinner } from './useSpinner';

const sizes: [SpinnerSize, string][] = [
  ['sm', 'size-4'],
  ['md', 'size-(--icon-size)'],
  ['lg', 'size-7']
];

function root(container: HTMLElement) {
  const spinner = container.querySelector('.eg-spinner');
  if (!spinner) {
    throw new Error('Missing eg-spinner root');
  }
  return spinner;
}

describe('Spinner', () => {
  it('exposes a labelled spinner as a polite status with visually hidden text (AC-01)', () => {
    const { container } = render(<Spinner label='Loading results' />);
    const status = screen.getByRole('status');
    expect(status).toBe(root(container));
    expect(status.tagName).toBe('SPAN');
    expect(status).toHaveClass('eg-spinner');
    expect(status).toHaveTextContent('Loading results');
    expect(status).not.toHaveAttribute('aria-hidden');
    const text = screen.getByText('Loading results');
    expect(text).toHaveStyle({ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' });
    expect(text).not.toHaveAttribute('aria-hidden');
  });

  it.each([
    ['absent', undefined],
    ['empty', ''],
    ['whitespace-only', '   ']
  ])('is decorative and hidden from assistive technology when the label is %s (AC-02)', (_case, label) => {
    const { container } = render(<Spinner label={label} />);
    const spinner = root(container);
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).not.toHaveAttribute('role');
    expect(screen.queryByRole('status')).toBeNull();
    expect(spinner).toHaveTextContent('');
    expect(spinner.querySelectorAll('svg')).toHaveLength(1);
  });

  it('always hides the single-path arc glyph, which never receives focus', () => {
    const { container } = render(<Spinner label='Loading' />);
    const svg = root(container).querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
    expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    expect(svg?.querySelectorAll('path')).toHaveLength(1);
    expect(svg?.querySelector('path')).toHaveAttribute('d', 'M21 12a9 9 0 1 1-6.219-8.56');
    expect(svg).toHaveAttribute('stroke-linecap', 'round');
    expect(svg).toHaveAttribute('stroke-linejoin', 'round');
  });

  it('rotates with the canonical spin token and stops under reduced motion (AC-04)', () => {
    const { container } = render(<Spinner />);
    const svg = root(container).querySelector('svg');
    expect(svg).toHaveClass(
      'size-full',
      'fill-none',
      'stroke-current',
      'stroke-(length:--icon-stroke)',
      'animate-spin',
      'motion-reduce:animate-none'
    );
  });

  it('defaults to the md icon-size square and inherits currentColor without a tone class', () => {
    const { container } = render(<Spinner />);
    const spinner = root(container);
    expect(spinner).toHaveClass('inline-flex', 'shrink-0', 'size-(--icon-size)');
    expect(spinner.className).not.toMatch(/\b(text|bg|fill)-/);
  });

  it.each(sizes)('resolves the %s preset to %s on the root (AC-03)', (size, utility) => {
    const { result } = renderHook(() => useSpinner({ size }));
    const classes = result.current.rootProps.className.split(' ');
    expect(classes).toContain(utility);
    for (const [, other] of sizes.filter(([candidate]) => candidate !== size)) {
      expect(classes).not.toContain(other);
    }
  });

  it('merges supported layout and color className last on the root, keeping the marker (AC-06)', () => {
    const { container } = render(<Spinner className='ms-2 self-center text-fg-muted consumer-hook' size='sm' />);
    const spinner = root(container);
    expect(spinner).toHaveClass('eg-spinner', 'size-4', 'ms-2', 'self-center', 'text-fg-muted', 'consumer-hook');
    expect(spinner.className.split(' ').at(-1)).toBe('consumer-hook');
    expect(spinner.querySelector('svg')?.className.baseVal).not.toMatch(/ms-2|text-fg-muted|consumer-hook/);
  });

  it('forwards native span attributes to the root', () => {
    const { container } = render(
      <Spinner id='upload-spinner' title='Uploading' lang='en' data-source='consumer' label='Uploading' />
    );
    const spinner = root(container);
    expect(spinner).toHaveAttribute('id', 'upload-spinner');
    expect(spinner).toHaveAttribute('title', 'Uploading');
    expect(spinner).toHaveAttribute('lang', 'en');
    expect(spinner).toHaveAttribute('data-source', 'consumer');
  });

  it('keeps component-owned semantics against unsupported JavaScript prop spreads', () => {
    const unsupported = { role: 'alert', 'aria-hidden': false, 'aria-live': 'assertive', children: 'Injected' };
    const { container: labelled } = render(<Spinner {...unsupported} label='Loading' />);
    const status = root(labelled);
    expect(status).toHaveAttribute('role', 'status');
    expect(status).not.toHaveAttribute('aria-hidden');
    expect(status).not.toHaveAttribute('aria-live');
    expect(status).toHaveTextContent('Loading');
    expect(status).not.toHaveTextContent('Injected');
    const { container: decorative } = render(<Spinner {...unsupported} />);
    const hidden = root(decorative);
    expect(hidden).toHaveAttribute('aria-hidden', 'true');
    expect(hidden).not.toHaveAttribute('role');
    expect(hidden).not.toHaveAttribute('aria-live');
    expect(hidden).toHaveTextContent('');
  });

  it('is never focusable and has no own state', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <Spinner label='Loading' />
        <button type='button'>Cancel</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    const spinner = root(container);
    expect(spinner).not.toHaveAttribute('tabindex');
    expect(spinner).not.toHaveAttribute('data-state');
  });

  it('lets the host own busy state and disappears on unmount without a completion announcement', () => {
    function Host({ loading }: { loading: boolean }) {
      return (
        <button type='button' aria-busy={loading}>
          {loading && <Spinner size='sm' />}
          Save
        </button>
      );
    }
    const { container, rerender } = render(<Host loading={true} />);
    expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-busy', 'true');
    expect(screen.queryByRole('status')).toBeNull();
    rerender(<Host loading={false} />);
    expect(container.querySelector('.eg-spinner')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('derives roles in the hook and never leaks the label or size to the DOM', () => {
    const { result } = renderHook(() => useSpinner({ label: 'Syncing', size: 'lg', id: 'sync' }));
    expect(result.current.label).toBe('Syncing');
    expect(result.current.rootProps).toMatchObject({ id: 'sync', role: 'status' });
    expect(result.current.rootProps).not.toHaveProperty('label');
    expect(result.current.rootProps).not.toHaveProperty('size');
    expect(result.current.rootProps).not.toHaveProperty('aria-hidden');
    const { result: decorative } = renderHook(() => useSpinner({}));
    expect(decorative.current.label).toBeUndefined();
    expect(decorative.current.rootProps).toMatchObject({ 'aria-hidden': true });
    expect(decorative.current.rootProps).not.toHaveProperty('role');
  });
});
