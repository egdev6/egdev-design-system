import { act, render, screen } from '@testing-library/react';
import { type CSSProperties, createRef, StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Isotipo3D } from './Isotipo3D';
import { type IsotipoInteraction, useIsotipo3D } from './useIsotipo3D';

const mocks = vi.hoisted(() => ({ create: vi.fn() }));
vi.mock('three', () => ({}));
vi.mock('./isotipoScene', async (importOriginal) => ({
  ...(await importOriginal<typeof import('./isotipoScene')>()),
  isotipoCreateScene: mocks.create
}));

const tokenStyle = {
  '--logo-red': '#e91b35',
  '--logo-red-shade': '#800c1d',
  '--color-primitive-red-neon': '#ff0036',
  '--color-primitive-red-light': '#ff335e'
} as CSSProperties;

function Harness({
  progress = 0,
  hidden = false,
  scene = 'hero',
  pointerTilt = true,
  onRender,
  interaction
}: {
  progress?: number;
  hidden?: boolean;
  scene?: 'hero' | 'lab';
  pointerTilt?: boolean;
  onRender?: () => void;
  interaction?: IsotipoInteraction;
}) {
  onRender?.();
  const { rootRef, canvasRef, state } = useIsotipo3D(scene, progress, 1, hidden, pointerTilt, undefined, interaction);
  return (
    <div ref={rootRef} style={tokenStyle} data-testid='root' data-state={state}>
      <canvas ref={canvasRef} />
    </div>
  );
}

describe('useIsotipo3D lifecycle', () => {
  let frame: FrameRequestCallback | undefined;
  let observer: { disconnect: ReturnType<typeof vi.fn>; callback: ResizeObserverCallback };
  let reduced: boolean;
  let coarse: boolean;
  let mediaListeners: Set<() => void>;
  const engine = { resize: vi.fn(), render: vi.fn(), dispose: vi.fn() };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    reduced = false;
    coarse = false;
    mediaListeners = new Set();
    frame = undefined;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 320,
      height: 200,
      left: 0,
      top: 0,
      right: 320,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({})
    });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect = vi.fn();
        constructor(callback: ResizeObserverCallback) {
          observer = { disconnect: this.disconnect, callback };
        }
        observe() {
          /* root observation */
        }
      }
    );
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frame = callback;
        return 1;
      })
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn(() => {
        frame = undefined;
      })
    );
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        get matches() {
          return (query.includes('reduced-motion') && reduced) || (query.includes('pointer: coarse') && coarse);
        },
        addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
        removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener)
      }))
    );
    mocks.create.mockResolvedValue(engine);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('forwards size, schedules active-time frames, and cleans up', async () => {
    const view = render(<Harness />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(engine.resize).toHaveBeenCalledWith(320, 200, expect.any(Number), false);
    expect(mocks.create).toHaveBeenCalledWith(
      expect.any(HTMLCanvasElement),
      {
        light: '#e91b35',
        shade: '#800c1d',
        neon: '#ff0036',
        redLight: '#ff335e'
      },
      expect.any(AbortSignal)
    );
    expect(frame).toBeDefined();
    act(() => {
      frame?.(100);
    });
    act(() => {
      frame?.(150);
    });
    expect(engine.render).toHaveBeenLastCalledWith('hero', 0, false, {
      time: 0.05,
      intro: 0.05 / 1.2,
      pose: expect.any(Object)
    });
    expect(screen.getByTestId('root').dataset.state).toBe('running');
    act(() => {
      observer.callback([], {} as ResizeObserver);
    });
    expect(engine.resize).toHaveBeenCalledTimes(2);
    view.unmount();
    expect(observer.disconnect).toHaveBeenCalledOnce();
    expect(engine.dispose).toHaveBeenCalledOnce();
    expect(cancelAnimationFrame).toHaveBeenCalled();
  });

  it('does not rerender on unchanged running frames', async () => {
    const onRender = vi.fn();
    render(<Harness onRender={onRender} />);
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      frame?.(100);
    });
    const count = onRender.mock.calls.length;
    for (let index = 0; index < 5; index++) {
      act(() => {
        frame?.(150 + index * 50);
      });
    }
    expect(onRender).toHaveBeenCalledTimes(count);
  });

  it('draws a static reduced-motion pose and does not schedule a loop', async () => {
    reduced = true;
    render(<Harness />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(engine.render).toHaveBeenCalledWith('hero', 0, true, { time: 0, intro: 1 });
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(screen.getByTestId('root').dataset.state).toBe('static');
  });

  it('tracks mouse tilt inside the root and resets it outside', async () => {
    render(<Harness />);
    await act(async () => {
      await Promise.resolve();
    });
    const pointer = (x: number, y: number) => {
      const event = new MouseEvent('pointermove', { clientX: x, clientY: y });
      Object.defineProperty(event, 'pointerType', { value: 'mouse' });
      window.dispatchEvent(event);
    };
    act(() => {
      pointer(320, 200);
      frame?.(100);
      frame?.(150);
    });
    expect(engine.render).toHaveBeenLastCalledWith('hero', 0, false, {
      time: 0.05,
      intro: 0.05 / 1.2,
      pose: expect.any(Object),
      tiltX: 0.05 * 3,
      tiltY: 0.05 * 3
    });
    act(() => {
      pointer(321, 201);
      frame?.(200);
    });
    expect(engine.render).toHaveBeenLastCalledWith('hero', 0, false, {
      time: 0.1,
      intro: 0.1 / 1.2,
      pose: expect.any(Object)
    });
  });

  it.each(['coarse', 'disabled', 'lab'])('does not apply pointer tilt for %s', async (mode) => {
    coarse = mode === 'coarse';
    render(<Harness scene={mode === 'lab' ? 'lab' : 'hero'} pointerTilt={mode !== 'disabled'} />);
    await act(async () => {
      await Promise.resolve();
    });
    const event = new MouseEvent('pointermove', { clientX: 320, clientY: 200 });
    Object.defineProperty(event, 'pointerType', { value: 'mouse' });
    act(() => {
      window.dispatchEvent(event);
      frame?.(100);
      frame?.(150);
    });
    expect(engine.render.mock.lastCall?.[3]).not.toHaveProperty('tiltX');
  });

  it('rearms its DPR media query and resizes when DPR changes', async () => {
    vi.stubGlobal('devicePixelRatio', 1);
    const view = render(<Harness />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(matchMedia).toHaveBeenCalledWith('(resolution: 1dppx)');
    vi.stubGlobal('devicePixelRatio', 2);
    act(() => {
      for (const listener of [...mediaListeners]) {
        listener();
      }
    });
    expect(matchMedia).toHaveBeenCalledWith('(resolution: 2dppx)');
    expect(engine.resize).toHaveBeenLastCalledWith(320, 200, 2, false);
    view.unmount();
    expect(mediaListeners.size).toBe(0);
  });

  it('smooths progress changes and snaps when the scene family changes', async () => {
    const view = render(<Harness />);
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      frame?.(100);
    });
    view.rerender(<Harness progress={0.4} />);
    act(() => {
      frame?.(150);
    });
    const animation = engine.render.mock.lastCall?.[3];
    expect(animation.pose.az).toBeCloseTo(-16 + 61 * (1 - Math.exp(-1)));
    view.rerender(<Harness scene='lab' progress={0.5} />);
    act(() => {
      frame?.(200);
    });
    expect(engine.render.mock.lastCall?.[3].pose.az).toBeCloseTo(8);
  });

  it('prioritizes stopped over pending, then restores loading when eligible', () => {
    mocks.create.mockReturnValue(
      new Promise(() => {
        // Keep initialization pending for the duration of the test.
      })
    );
    const view = render(<Harness />);
    expect(screen.getByTestId('root').dataset.state).toBe('loading');
    view.rerender(<Harness hidden={true} />);
    expect(screen.getByTestId('root').dataset.state).toBe('stopped');
    view.rerender(<Harness hidden={false} />);
    expect(screen.getByTestId('root').dataset.state).toBe('loading');
  });

  it.each(['matchMedia', 'ResizeObserver'])('falls back when %s subscription is unavailable', (missing) => {
    if (missing === 'matchMedia') {
      vi.stubGlobal('matchMedia', undefined);
    } else {
      vi.stubGlobal(
        'ResizeObserver',
        class {
          constructor() {
            throw new Error('observer unavailable');
          }
        }
      );
    }
    expect(() => render(<Harness />)).not.toThrow();
    expect(screen.getByTestId('root').dataset.state).toBe('fallback');
    expect(mocks.create).not.toHaveBeenCalled();
  });

  it('disposes a late engine without rendering it after unmount', async () => {
    let resolve: ((value: typeof engine) => void) | undefined;
    mocks.create.mockReturnValue(
      new Promise<typeof engine>((done) => {
        resolve = done;
      })
    );
    const view = render(<Harness />);
    const signal = mocks.create.mock.calls[0]?.[2] as AbortSignal;
    expect(signal.aborted).toBe(false);
    view.unmount();
    expect(signal.aborted).toBe(true);
    await act(async () => {
      resolve?.(engine);
      await Promise.resolve();
    });
    expect(engine.dispose).toHaveBeenCalledOnce();
    expect(engine.render).not.toHaveBeenCalled();
  });

  it.each(['import failure', 'WebGL failure'])('shows terminal fallback for %s', async (reason) => {
    mocks.create.mockRejectedValue(new Error(reason));
    render(<Harness />);
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
    });
    expect(screen.getByTestId('root').dataset.state).toBe('fallback');
    expect(requestAnimationFrame).not.toHaveBeenCalled();
  });

  it('ignores a previously queued frame after suspension', async () => {
    const view = render(<Harness />);
    await act(async () => {
      await Promise.resolve();
    });
    const stale = frame;
    view.rerender(<Harness hidden={true} />);
    act(() => {
      stale?.(100);
    });
    expect(engine.render).not.toHaveBeenCalled();
    expect(screen.getByTestId('root').dataset.state).toBe('stopped');
  });

  it('enters fallback even when disposal throws after a render failure', async () => {
    engine.render.mockImplementationOnce(() => {
      throw new Error('render');
    });
    engine.dispose.mockImplementationOnce(() => {
      throw new Error('dispose');
    });
    render(<Harness />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(() =>
      act(() => {
        frame?.(100);
      })
    ).not.toThrow();
    expect(screen.getByTestId('root').dataset.state).toBe('fallback');
  });

  it('selects the real canvas after the first frame and restores the SVG on context loss', async () => {
    const tokenValues: Record<string, string> = {
      '--logo-red': '#e91b35',
      '--logo-red-shade': '#800c1d',
      '--color-primitive-red-neon': '#ff0036',
      '--color-primitive-red-light': '#ff335e'
    };
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: (key: string) => tokenValues[key] ?? ''
    } as CSSStyleDeclaration);
    const ref = createRef<HTMLDivElement>();
    const view = render(<Isotipo3D ref={ref} id='brand' title='Decoration' />);
    const root = view.container.querySelector('div');
    const canvas = root?.querySelector('canvas');
    const svg = root?.querySelector('svg');
    expect(ref.current).toBe(root);
    expect(canvas?.hidden).toBe(true);
    expect(svg?.hasAttribute('hidden')).toBe(false);
    await act(async () => {
      await Promise.resolve();
    });
    act(() => {
      frame?.(100);
    });
    expect(root?.dataset.state).toBe('running');
    expect(canvas?.hidden).toBe(false);
    expect(svg?.hasAttribute('hidden')).toBe(true);
    const loss = new Event('webglcontextlost', { cancelable: true });
    act(() => {
      canvas?.dispatchEvent(loss);
    });
    expect(loss.defaultPrevented).toBe(true);
    expect(root?.dataset.state).toBe('fallback');
    expect(canvas?.hidden).toBe(true);
    expect(svg?.hasAttribute('hidden')).toBe(false);
    view.unmount();
    expect(ref.current).toBeNull();
  });

  it('keeps StrictMode stale initialization from rendering', async () => {
    let resolve: ((value: typeof engine) => void) | undefined;
    mocks.create.mockReturnValueOnce(
      new Promise<typeof engine>((done) => {
        resolve = done;
      })
    );
    const view = render(
      <StrictMode>
        <Harness />
      </StrictMode>
    );
    await act(async () => {
      resolve?.(engine);
      await Promise.resolve();
    });
    expect(engine.dispose).toHaveBeenCalledOnce();
    view.unmount();
  });
});

describe('useIsotipo3D gestures', () => {
  let frame: FrameRequestCallback | undefined;
  let reduced: boolean;
  let coarse: boolean;
  let mediaListeners: Set<() => void>;
  const engine = { resize: vi.fn(), render: vi.fn(), dispose: vi.fn() };

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    reduced = false;
    coarse = false;
    mediaListeners = new Set();
    frame = undefined;
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
      width: 320,
      height: 200,
      left: 0,
      top: 0,
      right: 320,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({})
    });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        disconnect = vi.fn();
        observe() {
          /* root observation */
        }
      }
    );
    vi.stubGlobal(
      'requestAnimationFrame',
      vi.fn((callback: FrameRequestCallback) => {
        frame = callback;
        return 1;
      })
    );
    vi.stubGlobal(
      'cancelAnimationFrame',
      vi.fn(() => {
        frame = undefined;
      })
    );
    vi.stubGlobal(
      'matchMedia',
      vi.fn((query: string) => ({
        get matches() {
          return (query.includes('reduced-motion') && reduced) || (query.includes('pointer: coarse') && coarse);
        },
        addEventListener: (_: string, listener: () => void) => mediaListeners.add(listener),
        removeEventListener: (_: string, listener: () => void) => mediaListeners.delete(listener)
      }))
    );
    mocks.create.mockResolvedValue(engine);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  const pointerEvent = (type: string, x: number, y: number, { pointerType = 'mouse', pointerId = 1 } = {}) => {
    const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    Object.defineProperty(event, 'pointerId', { value: pointerId });
    return event;
  };
  const mount = async (interaction?: IsotipoInteraction) => {
    const view = render(<Harness interaction={interaction} />);
    await act(async () => {
      await Promise.resolve();
    });
    return { view, root: screen.getByTestId('root') };
  };
  const animation = () => engine.render.mock.lastCall?.[3] as Record<string, unknown>;
  const runFrames = (start: number, until: () => boolean, limit = 120) => {
    let now = start;
    for (let index = 0; index < limit && !until(); index++) {
      const next = now + 16;
      now = next;
      act(() => {
        frame?.(next);
      });
    }
    return now;
  };
  const settledPayload = () => {
    const payload = animation();
    return payload === undefined ? false : !('yawOffset' in payload);
  };
  const captureSpies = (root: HTMLElement) => {
    const capture = vi.fn();
    const release = vi.fn();
    Object.defineProperty(root, 'setPointerCapture', { value: capture, configurable: true });
    Object.defineProperty(root, 'releasePointerCapture', { value: release, configurable: true });
    return { capture, release };
  };

  it('keeps the v0.4 engine payload when no gesture prop is set', async () => {
    await mount();
    act(() => {
      frame?.(100);
      frame?.(150);
    });
    expect(Object.keys(animation())).toEqual(['time', 'intro', 'pose']);
  });

  it('applies drag offsets, emits degree poses and captures the pointer', async () => {
    const onPoseChange = vi.fn();
    const { root } = await mount({ dragRotate: true, onPoseChange });
    const spies = captureSpies(root);
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 10, 100));
      root.dispatchEvent(pointerEvent('pointermove', 60, 140));
      frame?.(100);
    });
    expect(spies.capture).toHaveBeenCalledWith(1);
    expect(animation().yawOffset).toBeCloseTo(50 * (180 / 320));
    expect(animation().pitchOffset).toBeCloseTo(-40 * (180 / 320));
    expect(onPoseChange).toHaveBeenLastCalledWith({
      yaw: expect.closeTo(50 * (180 / 320)),
      pitch: expect.closeTo(-40 * (180 / 320)),
      flipped: false
    });
  });

  it('clamps drag offsets to ±90 yaw and ±30 pitch', async () => {
    const onPoseChange = vi.fn();
    const { root } = await mount({ dragRotate: true, onPoseChange });
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 160, 100));
      root.dispatchEvent(pointerEvent('pointermove', 2160, -1900));
      frame?.(100);
    });
    expect(animation().yawOffset).toBe(90);
    expect(animation().pitchOffset).toBe(30);
    expect(onPoseChange).toHaveBeenLastCalledWith({ yaw: 90, pitch: 30, flipped: false });
  });

  it('springs back to the scene pose after release and settles the pose', async () => {
    const onPoseChange = vi.fn();
    const { root } = await mount({ dragRotate: true, onPoseChange });
    const spies = captureSpies(root);
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 10, 100));
      root.dispatchEvent(pointerEvent('pointermove', 70, 100));
    });
    act(() => {
      root.dispatchEvent(pointerEvent('pointerup', 70, 100));
    });
    expect(spies.release).toHaveBeenCalledWith(1);
    const settled = { done: false };
    runFrames(200, () => {
      settled.done = settledPayload();
      return settled.done;
    });
    expect(settled.done).toBe(true);
    expect(onPoseChange).toHaveBeenLastCalledWith({ yaw: 0, pitch: 0, flipped: false });
  });

  it('flips on a drag released past the threshold and toggles back on double-click', async () => {
    const onPoseChange = vi.fn();
    const { root } = await mount({ dragRotate: true, flip: true, onPoseChange });
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 10, 100));
      root.dispatchEvent(pointerEvent('pointermove', 140, 100));
      root.dispatchEvent(pointerEvent('pointermove', 260, 100));
      root.dispatchEvent(pointerEvent('pointerup', 260, 100));
      frame?.(200);
    });
    expect(animation().flipped).toBe(true);
    expect(onPoseChange).toHaveBeenLastCalledWith(expect.objectContaining({ flipped: true }));
    act(() => {
      root.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      frame?.(220);
    });
    expect(animation()).not.toHaveProperty('flipped');
  });

  it('ignores flip triggers when flip is disabled', async () => {
    const { root } = await mount({ dragRotate: true });
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 10, 100));
      root.dispatchEvent(pointerEvent('pointermove', 260, 100));
      root.dispatchEvent(pointerEvent('pointerup', 260, 100));
      root.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
      frame?.(200);
    });
    expect(animation()).not.toHaveProperty('flipped');
  });

  it('ignores drag when no gesture prop is enabled', async () => {
    const { root } = await mount();
    const spies = captureSpies(root);
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 10, 100));
      root.dispatchEvent(pointerEvent('pointermove', 260, 100));
      root.dispatchEvent(pointerEvent('pointerup', 260, 100));
      frame?.(200);
    });
    expect(spies.capture).not.toHaveBeenCalled();
    expect(animation()).not.toHaveProperty('yawOffset');
  });

  it('rejects touch drag in decorative mode and accepts it in interactive mode', async () => {
    const decorative = await mount({ dragRotate: true });
    const spies = captureSpies(decorative.root);
    act(() => {
      decorative.root.dispatchEvent(pointerEvent('pointerdown', 10, 100, { pointerType: 'touch' }));
      decorative.root.dispatchEvent(pointerEvent('pointermove', 160, 100, { pointerType: 'touch' }));
      frame?.(100);
    });
    expect(spies.capture).not.toHaveBeenCalled();
    expect(animation()).not.toHaveProperty('yawOffset');
    decorative.view.unmount();

    const onPoseChange = vi.fn();
    const interactive = await mount({ interactive: true, label: 'EGDEV isotype', onPoseChange });
    const interactiveSpies = captureSpies(interactive.root);
    act(() => {
      interactive.root.dispatchEvent(pointerEvent('pointerdown', 10, 100, { pointerType: 'touch' }));
      interactive.root.dispatchEvent(pointerEvent('pointermove', 160, 100, { pointerType: 'touch' }));
      frame?.(120);
    });
    expect(interactiveSpies.capture).toHaveBeenCalledWith(1);
    expect(animation().yawOffset).toBeCloseTo(150 * (180 / 320));
    expect(onPoseChange).toHaveBeenCalled();
  });

  it('applies reduced-motion drags immediately without scheduling frames', async () => {
    reduced = true;
    const onPoseChange = vi.fn();
    const { root } = await mount({ dragRotate: true, flip: true, onPoseChange });
    await act(async () => {
      await Promise.resolve();
    });
    const renders = engine.render.mock.calls.length;
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 10, 100));
      root.dispatchEvent(pointerEvent('pointermove', 70, 100));
    });
    expect(engine.render.mock.calls.length).toBeGreaterThan(renders);
    expect(engine.render.mock.lastCall?.[2]).toBe(true);
    expect(engine.render.mock.lastCall?.[3]).toMatchObject({ yawOffset: expect.closeTo(60 * (180 / 320)) });
    expect(requestAnimationFrame).not.toHaveBeenCalled();
    expect(onPoseChange).toHaveBeenCalled();
    act(() => {
      root.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }));
    });
    expect(engine.render.mock.lastCall?.[3]).toMatchObject({ flipped: true });
  });

  it('provides keyboard parity in interactive mode and resets on blur', async () => {
    const onPoseChange = vi.fn();
    const { root } = await mount({ interactive: true, label: 'EGDEV isotype', flip: true, onPoseChange });
    act(() => {
      root.focus();
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      frame?.(100);
    });
    expect(animation().yawOffset).toBe(15);
    expect(animation().pitchOffset).toBe(15);
    act(() => {
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      frame?.(120);
    });
    expect(animation().flipped).toBe(true);
    act(() => {
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    });
    act(() => {
      root.dispatchEvent(new FocusEvent('focusout'));
    });
    runFrames(200, () => settledPayload());
    expect('yawOffset' in animation()).toBe(false);
    expect(onPoseChange).toHaveBeenLastCalledWith({ yaw: 0, pitch: 0, flipped: false });
  });

  it('warns and keeps the decorative fallback posture without an interactive label', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {
      /* silenced for the assertion */
    });
    const onPoseChange = vi.fn();
    const { root } = await mount({ interactive: true, onPoseChange });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('label'));
    act(() => {
      root.focus();
      root.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      frame?.(100);
    });
    expect(animation()).not.toHaveProperty('yawOffset');
    expect(onPoseChange).not.toHaveBeenCalled();
  });

  it('freezes the idle loop while paused and resumes when unpaused', async () => {
    const { view } = await mount({ paused: true });
    expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBe(1);
    act(() => {
      frame?.(100);
    });
    expect(engine.render).toHaveBeenCalledTimes(1);
    expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBe(1);
    view.rerender(<Harness interaction={{ paused: false }} />);
    await act(async () => {
      await Promise.resolve();
    });
    expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBe(2);
    act(() => {
      frame?.(150);
    });
    expect(engine.render).toHaveBeenCalledTimes(2);
    act(() => {
      frame?.(200);
    });
    expect(engine.render).toHaveBeenCalledTimes(3);
    expect(vi.mocked(requestAnimationFrame).mock.calls.length).toBe(4);
  });

  it('releases capture and gesture listeners on stop and unmount', async () => {
    const { view, root } = await mount({ dragRotate: true });
    const spies = captureSpies(root);
    act(() => {
      root.dispatchEvent(pointerEvent('pointerdown', 10, 100));
    });
    expect(spies.capture).toHaveBeenCalledWith(1);
    view.rerender(<Harness hidden={true} interaction={{ dragRotate: true }} />);
    expect(spies.release).toHaveBeenCalledWith(1);
    const renders = engine.render.mock.calls.length;
    act(() => {
      root.dispatchEvent(pointerEvent('pointermove', 160, 100));
    });
    expect(engine.render.mock.calls.length).toBe(renders);
    view.unmount();
    expect(() => root.dispatchEvent(pointerEvent('pointermove', 200, 100))).not.toThrow();
  });
});
