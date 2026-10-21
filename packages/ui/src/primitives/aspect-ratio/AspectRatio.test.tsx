import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, useEffect } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { AspectRatio } from './AspectRatio';
import { useAspectRatio } from './useAspectRatio';

const invalid = [0, -1, NaN, Infinity, -Infinity, Number.MIN_VALUE];
const valid = [1, 16 / 9, 4 / 5, 4 / 3, 9 / 16, 3, 4, Number.MAX_VALUE, 1e-300];

describe('AspectRatio hook', () => {
  it('defaults to a square and composes supported alignment on the inner root', () => {
    const { result } = renderHook(() => useAspectRatio({ className: 'flex grid place-items-center' }, null));
    expect(result.current.rootProps.ratio).toBe(1);
    expect(result.current.rootProps.className).toContain('eg-aspect-ratio');
    expect(result.current.rootProps.className).toContain('place-items-center');
    expect(result.current.rootProps.className).toContain('min-w-0');
    expect(result.current.rootProps.className).toContain('grid');
    expect(result.current.rootProps.className?.split(' ')).not.toContain('flex');
  });

  it.each(invalid)('normalizes invalid ratio %s', (ratio) => {
    const { result } = renderHook(() => useAspectRatio({ ratio }, null));
    expect(result.current.rootProps.ratio).toBe(1);
  });

  it.each(valid)('preserves representable ratio %s', (ratio) => {
    const { result } = renderHook(() => useAspectRatio({ ratio }, null));
    expect(result.current.rootProps.ratio).toBe(ratio);
  });
});

describe('AspectRatio public contract', () => {
  it('forwards the marker, ref and native attributes to the inner generic div only', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <AspectRatio
        ref={ref}
        data-testid='region'
        aria-describedby='caption'
        id='media'
        className='grid place-items-center'
      >
        Content
      </AspectRatio>
    );
    const root = screen.getByTestId('region');
    expect(ref.current).toBe(root);
    expect(root.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-aspect-ratio', 'min-w-0', 'grid', 'place-items-center');
    expect(root).toHaveAttribute('aria-describedby', 'caption');
    expect(root).toHaveAttribute('id', 'media');
    expect(root).toHaveTextContent('Content');
    for (const attribute of ['role', 'aria-hidden', 'aria-live', 'tabindex', 'data-state']) {
      expect(root).not.toHaveAttribute(attribute);
    }
    expect(root.parentElement).not.toHaveAttribute('id');
    expect(root.parentElement).not.toHaveClass('eg-aspect-ratio');
    expect(root).toHaveStyle({ position: 'absolute' });
  });

  it('lets Radix reserve a square with no children and no authored appearance', () => {
    render(<AspectRatio data-testid='empty' />);
    const root = screen.getByTestId('empty');
    expect(root).toBeEmptyDOMElement();
    expect(root.parentElement).toHaveStyle({ position: 'relative', width: '100%', paddingBottom: '100%' });
    for (const property of [
      'background',
      'border',
      'box-shadow',
      'border-radius',
      'overflow',
      'animation',
      'object-fit'
    ]) {
      expect(root.style.getPropertyValue(property)).toBe('');
    }
  });

  it.each(invalid)('renders finite square padding for invalid ratio %s', (ratio) => {
    render(<AspectRatio ratio={ratio} data-testid='invalid' />);
    expect(screen.getByTestId('invalid').parentElement).toHaveStyle({ paddingBottom: '100%' });
  });

  it.each(valid.slice(0, 7))('delegates percentage geometry for ratio %s', (ratio) => {
    render(<AspectRatio ratio={ratio} data-testid='ratio' />);
    expect(Number.parseFloat(screen.getByTestId('ratio').parentElement?.style.paddingBottom ?? '')).toBeCloseTo(
      100 / ratio
    );
  });

  it('updates geometry without remounting descendants or synthesizing events', () => {
    const mounted = vi.fn();
    const changed = vi.fn();
    function Child() {
      useEffect(mounted, []);
      return <span>Persistent child</span>;
    }
    const { rerender } = render(
      <AspectRatio onChange={changed}>
        <Child />
      </AspectRatio>
    );
    const child = screen.getByText('Persistent child');
    rerender(
      <AspectRatio ratio={4 / 5} onChange={changed}>
        <Child />
      </AspectRatio>
    );
    expect(screen.getByText('Persistent child')).toBe(child);
    expect(child.parentElement?.parentElement).toHaveStyle({ paddingBottom: '125%' });
    expect(mounted).toHaveBeenCalledTimes(1);
    expect(changed).not.toHaveBeenCalled();
  });

  it('preserves media semantics, native events and descendant keyboard focus', async () => {
    const user = userEvent.setup();
    const clicked = vi.fn();
    render(
      <>
        <button type='button'>Before</button>
        <AspectRatio onClick={clicked}>
          <img alt='Mountain preview' src='preview.svg' />
          <button type='button'>Play preview</button>
        </AspectRatio>
        <button type='button'>After</button>
      </>
    );
    expect(screen.getByRole('img', { name: 'Mountain preview' })).toBeVisible();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Play preview' })).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(clicked).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});
