import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider';
import type { SliderProps } from './types';
import { sliderRangeVariants, sliderThumbVariants, sliderTrackVariants, sliderVariants } from './types';
import { useSlider } from './useSlider';

/** Radix measures the thumb with ResizeObserver and captures the pointer; jsdom has neither. */
const pointerCapture = ['setPointerCapture', 'releasePointerCapture', 'hasPointerCapture'] as const;

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
  );
  const captured = new Set<number>();
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: (id: number) => captured.add(id),
    releasePointerCapture: (id: number) => captured.delete(id),
    hasPointerCapture: (id: number) => captured.has(id)
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  for (const method of pointerCapture) {
    Reflect.deleteProperty(HTMLElement.prototype, method);
  }
});

function root(container: HTMLElement) {
  const slider = container.querySelector('.eg-slider');
  if (!(slider instanceof HTMLElement)) {
    throw new Error('Missing eg-slider root');
  }
  return slider;
}

function parts(container: HTMLElement) {
  const slider = root(container);
  const track = slider.firstElementChild;
  const range = track?.firstElementChild;
  if (!(track instanceof HTMLElement) || !(range instanceof HTMLElement)) {
    throw new Error('Missing Slider track or range');
  }
  return { slider, track, range, thumb: screen.getByRole('slider') };
}

/** Lays the root out as a 200px track starting at x=0 so pointer positions map to values. */
function layOut(slider: HTMLElement) {
  vi.spyOn(slider, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ x: 0, y: 0, width: 200, height: 24 }));
}

/** Controlled harness whose consumer state drives the slider (AC-03). */
function ControlledSlider({ onValueChange }: { onValueChange: (value: number) => void }) {
  const [value, setValue] = useState(30);
  return (
    <Slider
      label='Ring size'
      value={value}
      onValueChange={(next) => {
        setValue(next);
        onValueChange(next);
      }}
    />
  );
}

describe('Slider', () => {
  it('renders the public root and one horizontal thumb named by label with default bounds (AC-01)', () => {
    const { container } = render(<Slider label='Volume' />);
    const { slider, track, range, thumb } = parts(container);
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(slider);
    expect(slider.tagName).toBe('SPAN');
    expect(slider).toHaveAttribute('data-orientation', 'horizontal');
    expect(slider).not.toHaveAttribute('data-state');
    expect(track.tagName).toBe('SPAN');
    expect(range.tagName).toBe('SPAN');
    expect(screen.getAllByRole('slider')).toHaveLength(1);
    expect(thumb).toBe(screen.getByRole('slider', { name: 'Volume' }));
    expect(thumb).toHaveAttribute('aria-label', 'Volume');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '100');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    expect(thumb).toHaveAttribute('aria-orientation', 'horizontal');
    expect(thumb).not.toHaveAttribute('aria-valuetext');
    expect(thumb).toHaveAttribute('tabindex', '0');
    expect(container.querySelector('input')).toBeNull();
  });

  it('steps with arrows, pages, Shift+arrows and Home/End, clamped, emitting scalars (AC-02)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    render(<Slider label='Threshold' defaultValue={50} onValueChange={onValueChange} onValueCommit={onValueCommit} />);
    const thumb = screen.getByRole('slider', { name: 'Threshold' });
    await user.tab();
    expect(thumb).toHaveFocus();
    const steps: [string, number][] = [
      ['{ArrowRight}', 51],
      ['{ArrowUp}', 52],
      ['{ArrowLeft}', 51],
      ['{ArrowDown}', 50],
      ['{PageUp}', 60],
      ['{PageDown}', 50],
      ['{Shift>}{ArrowRight}{/Shift}', 60],
      ['{End}', 100],
      ['{Home}', 0]
    ];
    for (const [keys, value] of steps) {
      await user.keyboard(keys);
      expect(thumb, keys).toHaveAttribute('aria-valuenow', String(value));
      expect(onValueChange, keys).toHaveBeenLastCalledWith(value);
      expect(onValueCommit, keys).toHaveBeenLastCalledWith(value);
    }
    expect(onValueChange).toHaveBeenCalledTimes(steps.length);
    expect(onValueCommit).toHaveBeenCalledTimes(steps.length);
    await user.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    expect(onValueChange).toHaveBeenCalledTimes(steps.length);
    await user.keyboard('{End}{ArrowRight}{PageUp}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
    expect(onValueChange).toHaveBeenCalledTimes(steps.length + 1);
  });

  it('snaps keyboard steps to step and clamps them to custom bounds (AC-02)', async () => {
    const user = userEvent.setup();
    const onValueCommit = vi.fn();
    render(<Slider label='Ring size' min={20} max={95} step={5} defaultValue={90} onValueCommit={onValueCommit} />);
    const thumb = screen.getByRole('slider');
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '95');
    await user.keyboard('{PageDown}');
    expect(thumb).toHaveAttribute('aria-valuenow', '45');
    await user.keyboard('{PageDown}');
    expect(thumb).toHaveAttribute('aria-valuenow', '20');
    expect(onValueCommit.mock.calls).toEqual([[95], [45], [20]]);
    expect(thumb).toHaveAttribute('aria-valuemin', '20');
    expect(thumb).toHaveAttribute('aria-valuemax', '95');
  });

  it('follows the pointer while dragging and commits once on release (AC-02)', () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const { container } = render(
      <Slider label='Volume' step={10} onValueChange={onValueChange} onValueCommit={onValueCommit} />
    );
    const { slider, track, thumb } = parts(container);
    layOut(slider);
    fireEvent.pointerDown(track, { pointerId: 1, clientX: 100, button: 0 });
    expect(thumb).toHaveAttribute('aria-valuenow', '50');
    fireEvent.pointerMove(track, { pointerId: 1, clientX: 152 });
    expect(thumb).toHaveAttribute('aria-valuenow', '80');
    expect(onValueChange.mock.calls).toEqual([[50], [80]]);
    expect(onValueCommit).not.toHaveBeenCalled();
    fireEvent.pointerUp(track, { pointerId: 1, clientX: 152 });
    expect(onValueCommit.mock.calls).toEqual([[80]]);
  });

  it('keeps the controlled value authoritative and follows consumer state (AC-03)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Slider label='Volume' value={30} onValueChange={onValueChange} />);
    const thumb = screen.getByRole('slider');
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(onValueChange).toHaveBeenLastCalledWith(31);
    expect(thumb).toHaveAttribute('aria-valuenow', '30');
    rerender(<Slider label='Volume' value={64} onValueChange={onValueChange} />);
    expect(thumb).toHaveAttribute('aria-valuenow', '64');

    const consumer = vi.fn();
    render(<ControlledSlider onValueChange={consumer} />);
    const controlled = screen.getByRole('slider', { name: 'Ring size' });
    controlled.focus();
    await user.keyboard('{ArrowRight}{ArrowRight}');
    expect(controlled).toHaveAttribute('aria-valuenow', '32');
    expect(consumer.mock.calls).toEqual([[31], [32]]);
  });

  it('starts uncontrolled at defaultValue, or at min when absent (AC-03)', () => {
    render(
      <>
        <Slider label='Explicit' defaultValue={40} />
        <Slider label='Fallback' min={10} />
      </>
    );
    expect(screen.getByRole('slider', { name: 'Explicit' })).toHaveAttribute('aria-valuenow', '40');
    expect(screen.getByRole('slider', { name: 'Fallback' })).toHaveAttribute('aria-valuenow', '10');
  });

  it('renders out-of-bounds values clamped to [min, max] without emitting (AC-03)', () => {
    const onValueChange = vi.fn();
    const { container, rerender } = render(<Slider label='Volume' value={150} onValueChange={onValueChange} />);
    const { thumb, range } = parts(container);
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
    expect(range.style.right).toBe('0%');
    rerender(<Slider label='Volume' value={-5} onValueChange={onValueChange} />);
    expect(thumb).toHaveAttribute('aria-valuenow', '0');
    expect(range.style.right).toBe('100%');
    rerender(<Slider label='Volume' defaultValue={500} key='uncontrolled' />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '100');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('blocks keyboard and pointer changes when disabled and leaves the Tab order (AC-04)', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const { container } = render(
      <>
        <Slider
          label='Volume'
          defaultValue={25}
          disabled={true}
          onValueChange={onValueChange}
          onValueCommit={onValueCommit}
        />
        <button type='button'>After</button>
      </>
    );
    const { slider, track, range, thumb } = parts(container);
    for (const part of [slider, track, range, thumb]) {
      expect(part).toHaveAttribute('data-disabled', '');
    }
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(thumb).not.toHaveAttribute('tabindex');
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    fireEvent.keyDown(thumb, { key: 'ArrowRight' });
    fireEvent.keyDown(thumb, { key: 'End' });
    layOut(slider);
    fireEvent.pointerDown(track, { pointerId: 1, clientX: 180, button: 0 });
    fireEvent.pointerUp(track, { pointerId: 1, clientX: 180 });
    expect(thumb).toHaveAttribute('aria-valuenow', '25');
    expect(onValueChange).not.toHaveBeenCalled();
    expect(onValueCommit).not.toHaveBeenCalled();
    expect(slider).toHaveClass('data-[disabled]:opacity-45', 'data-[disabled]:pointer-events-none');
  });

  it('maps valueText to aria-valuetext on the current value and omits an empty result (AC-05)', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Slider label='Volume' defaultValue={40} valueText={(value) => `${value}%`} />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuetext', '40%');
    await user.tab();
    await user.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuetext', '41%');
    rerender(<Slider label='Volume' defaultValue={40} valueText={() => ''} />);
    expect(thumb).not.toHaveAttribute('aria-valuetext');

    rerender(<Slider label='Volume' value={120} valueText={(value) => `${value} px`} />);
    expect(thumb).toHaveAttribute('aria-valuetext', '100 px');
  });

  it('routes aria-describedby to the focusable thumb and forwards other native props to the root (AC-05)', () => {
    const { container } = render(
      <>
        <p id='volume-hint'>Applies to every overlay</p>
        <Slider label='Volume' id='volume' title='Overlay volume' data-field='volume' aria-describedby='volume-hint' />
      </>
    );
    const { slider, thumb } = parts(container);
    expect(thumb).toHaveAttribute('aria-describedby', 'volume-hint');
    expect(thumb).toHaveAccessibleDescription('Applies to every overlay');
    expect(slider).not.toHaveAttribute('aria-describedby');
    expect(slider).toHaveAttribute('id', 'volume');
    expect(slider).toHaveAttribute('title', 'Overlay volume');
    expect(slider).toHaveAttribute('data-field', 'volume');
    expect(thumb).not.toHaveAttribute('id');
  });

  it('resolves the documented token utilities per part (AC-06)', () => {
    const { container } = render(<Slider label='Volume' defaultValue={40} />);
    const { slider, track, range, thumb } = parts(container);
    expect(slider).toHaveClass(
      'eg-slider',
      'relative',
      'flex',
      'w-full',
      'items-center',
      'h-6',
      'pointer-coarse:h-11',
      'touch-none',
      'select-none'
    );
    expect(track).toHaveClass(
      'relative',
      'h-1',
      'grow',
      'overflow-hidden',
      'rounded-full',
      'bg-surface-0',
      'shadow-[var(--shadow-well)]'
    );
    expect(range).toHaveClass('absolute', 'h-full', 'bg-fg-brand-default');
    expect(range.style.left).toBe('0%');
    expect(range.style.right).toBe('60%');
    expect(thumb).toHaveClass(
      'block',
      'size-4',
      'rounded-full',
      'bg-fg-default',
      'shadow-[var(--shadow-elev-1)]',
      'cursor-grab',
      'active:cursor-grabbing',
      'focus-visible:outline-none',
      'focus-visible:shadow-[var(--shadow-focus)]',
      'transition-shadow',
      'motion-reduce:transition-none'
    );
    // Parts carry no public markers and no hand-written colors, gradients or animations.
    for (const recipe of [sliderTrackVariants(), sliderRangeVariants(), sliderThumbVariants()]) {
      expect(recipe).not.toMatch(/eg-|#|rgb|gradient|animate-/);
    }
    expect(sliderVariants()).toMatch(/^eg-slider /);
  });

  it('submits the current value through a hidden input named by name inside a form (AC-07)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <form aria-label='Overlay settings'>
        <Slider label='Volume' name='volume' defaultValue={40} />
        <Slider label='Unnamed' defaultValue={10} />
      </form>
    );
    const form = screen.getByRole('form');
    if (!(form instanceof HTMLFormElement)) {
      throw new Error('Missing form');
    }
    expect([...new FormData(form).entries()]).toEqual([['volume', '40']]);
    const input = container.querySelector('input[name="volume"]');
    expect(input).toHaveStyle({ display: 'none' });
    screen.getByRole('slider', { name: 'Volume' }).focus();
    await user.keyboard('{ArrowRight}');
    expect(new FormData(form).get('volume')).toBe('41');
  });

  it('merges consumer layout classes last without dropping the public root (AC-08)', () => {
    const { container } = render(<Slider label='Volume' className='w-48 w-64 mx-auto' />);
    const { slider, thumb } = parts(container);
    expect(slider).toHaveClass('eg-slider', 'w-64', 'mx-auto');
    expect(slider).not.toHaveClass('w-48');
    expect(slider).not.toHaveClass('w-full');
    expect(slider.className.endsWith('w-64 mx-auto')).toBe(true);
    expect(thumb).not.toHaveClass('w-64');
  });
});

describe('useSlider', () => {
  it('applies the documented constant defaults and wraps scalars for Radix', () => {
    const { result } = renderHook(() => useSlider({ label: 'Volume' }));
    expect(result.current.rootProps).toMatchObject({ min: 0, max: 100, step: 1, disabled: false });
    expect(result.current.rootProps.value).toBeUndefined();
    expect(result.current.rootProps.defaultValue).toBeUndefined();
    expect(result.current.thumbProps).toMatchObject({ 'aria-label': 'Volume' });
    expect(result.current.thumbProps['aria-valuetext']).toBeUndefined();
    expect(result.current.rootProps.className).toBe(sliderVariants());
    expect(result.current.trackProps.className).toBe(sliderTrackVariants());
    expect(result.current.rangeProps.className).toBe(sliderRangeVariants());
    expect(result.current.thumbProps.className).toBe(sliderThumbVariants());
  });

  it('clamps scalars, unwraps callbacks and keeps own props off the root', () => {
    const onValueChange = vi.fn();
    const onValueCommit = vi.fn();
    const props: SliderProps = {
      label: 'Volume',
      value: 140,
      min: 10,
      max: 90,
      valueText: (value) => `${value} dB`,
      onValueChange,
      onValueCommit,
      'aria-describedby': 'hint'
    };
    const { result } = renderHook(() => useSlider(props));
    const { rootProps, thumbProps } = result.current;
    expect(rootProps.value).toEqual([90]);
    expect(thumbProps).toMatchObject({ 'aria-valuetext': '90 dB', 'aria-describedby': 'hint' });
    for (const prop of ['label', 'valueText', 'aria-describedby']) {
      expect(rootProps, prop).not.toHaveProperty(prop);
    }
    rootProps.onValueChange?.([30]);
    rootProps.onValueCommit?.([30]);
    expect(onValueChange).toHaveBeenCalledWith(30);
    expect(onValueCommit).toHaveBeenCalledWith(30);
    const uncontrolled = renderHook(() => useSlider({ label: 'Volume', defaultValue: -3 }));
    expect(uncontrolled.result.current.rootProps.defaultValue).toEqual([0]);
  });
});
