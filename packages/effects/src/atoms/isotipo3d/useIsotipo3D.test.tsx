import { act, render, screen } from '@testing-library/react';
import { type CSSProperties, createRef, StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Isotipo3D } from './Isotipo3D';
import { useIsotipo3D } from './useIsotipo3D';

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
  onRender
}: {
  progress?: number;
  hidden?: boolean;
  scene?: 'hero' | 'lab';
  pointerTilt?: boolean;
  onRender?: () => void;
}) {
  onRender?.();
  const { rootRef, canvasRef, state } = useIsotipo3D(scene, progress, 1, hidden, pointerTilt);
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
