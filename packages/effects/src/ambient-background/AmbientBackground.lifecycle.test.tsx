import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AmbientBackground } from '../index';
import * as particleStreaks from './particleStreaks';

describe('AmbientBackground lifecycle', () => {
  let width: number;
  let reduced: boolean;
  let hidden: boolean;
  let resize: () => void;
  let mediaChange: () => void;
  let raf: Map<number, FrameRequestCallback>;
  let nextFrame: number;
  let disconnect: ReturnType<typeof vi.fn<() => void>>;
  let fill: ReturnType<typeof vi.fn>;
  let createdCanvases: number;
  let draw: ReturnType<typeof vi.fn>;
  let translate: ReturnType<typeof vi.fn>;
  let transform: ReturnType<typeof vi.fn>;
  let context: CanvasRenderingContext2D;

  beforeEach(() => {
    width = 800;
    reduced = false;
    hidden = false;
    raf = new Map();
    nextFrame = 0;
    disconnect = vi.fn();
    fill = vi.fn();
    createdCanvases = 0;
    draw = vi.fn();
    translate = vi.fn();
    transform = vi.fn();
    const gradient = { addColorStop: vi.fn() };
    context = {
      clearRect: vi.fn(),
      createRadialGradient: vi.fn(() => gradient),
      createLinearGradient: vi.fn(() => gradient),
      fillRect: fill,
      beginPath: vi.fn(),
      arc: vi.fn(),
      fill: vi.fn(),
      save: vi.fn(),
      translate,
      rect: vi.fn(),
      restore: vi.fn(),
      ellipse: vi.fn(),
      rotate: vi.fn(),
      scale: vi.fn(),
      drawImage: draw,
      setTransform: transform
    } as unknown as CanvasRenderingContext2D;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => context);
    vi.spyOn(HTMLCanvasElement.prototype, 'getBoundingClientRect').mockImplementation(
      () => ({ width, height: 400 }) as DOMRect
    );
    vi.spyOn(window, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '#123456'
    } as unknown as CSSStyleDeclaration);
    vi.spyOn(document, 'createElement').mockImplementation(((...args: Parameters<Document['createElement']>) => {
      if (args[0] === 'canvas') {
        createdCanvases++;
      }
      return originalCreate(...args);
    }) as Document['createElement']);
    vi.spyOn(document, 'hidden', 'get').mockImplementation(() => hidden);
    vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
      const id = ++nextFrame;
      raf.set(id, callback);
      return id;
    });
    vi.stubGlobal('cancelAnimationFrame', (id: number) => {
      raf.delete(id);
    });
    vi.stubGlobal(
      'ResizeObserver',
      class {
        constructor(callback: () => void) {
          resize = callback;
        }
        observe() {
          // Notifications are delivered explicitly by the test.
        }
        disconnect() {
          disconnect();
        }
      }
    );
    vi.stubGlobal('matchMedia', () => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, callback: () => void) => {
        mediaChange = callback;
      },
      removeEventListener: vi.fn()
    }));
  });
  const originalCreate = document.createElement.bind(document);
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it.each([
    ['base', 70, 90, 1, 0.1],
    ['read', 20, 25, 0.6, 0.1],
    ['live', 110, 120, 1.4, 0.18]
  ] as const)('passes the %s profile and host colors at the 700px boundary', (profile, lines, squares, speed, glow) => {
    const set = vi.fn();
    const engine = {
      ready: () => true,
      set,
      setDirections: vi.fn(),
      resize: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      renderOnce: vi.fn(),
      dispose: vi.fn()
    };
    const create = vi.spyOn(particleStreaks, 'createParticleStreaks').mockReturnValue(engine);
    vi.mocked(window.getComputedStyle).mockImplementation(
      (element) =>
        ({
          getPropertyValue: () => (element === document.documentElement ? '#abcdef' : '#123456')
        }) as unknown as CSSStyleDeclaration
    );
    width = 699;
    const { container } = render(<AmbientBackground profile={profile} opacity={0.4} />);
    const root = container.firstElementChild;
    expect(window.getComputedStyle).toHaveBeenCalledWith(root);
    expect(create).toHaveBeenCalledWith(
      expect.any(HTMLCanvasElement),
      {
        backgroundColor: '#123456',
        backgroundGlowColor: '#123456',
        lineColor: '#123456',
        lineGlowColor: '#123456',
        squareColor: '#123456',
        squareGlowColor: '#123456'
      },
      { lineCount: lines, squareCount: squares, speedMultiplier: speed, backgroundGlowOpacity: glow },
      expect.any(Function)
    );
    expect(root?.getAttribute('style')).toContain('--eg-ambient-opacity: 0.4');
    expect(set).toHaveBeenLastCalledWith({
      lineCount: Math.round(lines * 0.6),
      squareCount: Math.round(squares * 0.6),
      speedMultiplier: speed,
      backgroundGlowOpacity: glow
    });
    act(() => {
      width = 700;
      resize();
    });
    expect(set).toHaveBeenLastCalledWith({
      lineCount: lines,
      squareCount: squares,
      speedMultiplier: speed,
      backgroundGlowOpacity: glow
    });
  });

  it.each(['base', 'read', 'live'] as const)(
    'keeps %s draw counts while changing independent directions',
    (profile) => {
      reduced = true;
      vi.spyOn(Math, 'random').mockReturnValue(0.5);
      const { container, rerender } = render(<AmbientBackground profile={profile} />);
      const baselineCount = draw.mock.calls.length;
      const baselinePositions = translate.mock.calls.slice();
      draw.mockClear();
      translate.mockClear();
      rerender(<AmbientBackground profile={profile} lineDirection='right' squareDirection='up' />);
      expect(draw).toHaveBeenCalledTimes(baselineCount);
      expect(translate.mock.calls).not.toEqual(baselinePositions);
      expect(container.firstElementChild?.getAttribute('data-state')).toBe('static');
      expect(container.querySelector('canvas')?.className).toContain('forced-colors:hidden');
      expect(raf.size).toBe(0);
    }
  );

  it.each([
    ['up', 270],
    ['up-right', 315],
    ['right', 0],
    ['down-right', 45],
    ['down', 90],
    ['down-left', 135],
    ['left', 180],
    ['up-left', 225]
  ] as const)('renders the line direction %s at %i degrees', (direction, degrees) => {
    reduced = true;
    render(<AmbientBackground lineDirection={direction} />);
    expect(context.rotate).toHaveBeenCalledWith(
      expect.closeTo(Math.atan2(Math.sin((degrees * Math.PI) / 180), Math.cos((degrees * Math.PI) / 180)))
    );
  });

  it.each([
    ['up', 0, -1],
    ['up-right', 1, -1],
    ['right', 1, 0],
    ['down-right', 1, 1],
    ['down', 0, 1],
    ['down-left', -1, 1],
    ['left', -1, 0],
    ['up-left', -1, -1]
  ] as const)('moves both families visibly %s between frames', (direction, signX, signY) => {
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.spyOn(performance, 'now').mockReturnValue(0);
    render(<AmbientBackground lineDirection={direction} squareDirection={direction} />);
    const frame = (time: number) => {
      translate.mockClear();
      act(() => {
        const callback = [...raf.values()][0];
        raf.clear();
        callback?.(time);
      });
      return translate.mock.calls.slice(-160);
    };
    const first = frame(100);
    const second = frame(200);
    for (const index of [0, 70]) {
      const before = first[index];
      const after = second[index];
      expect(before).toBeDefined();
      expect(after).toBeDefined();
      if (!before || !after) {
        throw new Error('Expected a rendered particle in each frame');
      }
      const dx = after[0] - before[0];
      const dy = after[1] - before[1];
      expect(Math.abs(dx) < 1e-8 ? 0 : Math.sign(dx)).toBe(signX);
      expect(Math.abs(dy) < 1e-8 ? 0 : Math.sign(dy)).toBe(signY);
    }
  });

  it('keeps every direction pair static, bounded and hidden in forced colors', () => {
    reduced = true;
    const directions = ['up', 'up-right', 'right', 'down-right', 'down', 'down-left', 'left', 'up-left'] as const;
    const { container, rerender } = render(<AmbientBackground />);
    for (const lineDirection of directions) {
      for (const squareDirection of directions) {
        draw.mockClear();
        rerender(<AmbientBackground lineDirection={lineDirection} squareDirection={squareDirection} />);
        expect(draw.mock.calls.length).toBeLessThanOrEqual(230);
        expect(container.firstElementChild?.getAttribute('data-state')).toBe('static');
        expect(container.querySelector('canvas')?.className).toContain('forced-colors:hidden');
        expect(raf.size).toBe(0);
      }
    }
  });

  it('changes each family without moving the other in a static frame', () => {
    reduced = true;
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { rerender } = render(<AmbientBackground />);
    const initial = translate.mock.calls.slice(-160);
    translate.mockClear();
    rerender(<AmbientBackground lineDirection='up' />);
    const linesChanged = translate.mock.calls.slice(-160);
    expect(linesChanged.slice(0, 70)).not.toEqual(initial.slice(0, 70));
    expect(linesChanged.slice(70)).toEqual(initial.slice(70));
    translate.mockClear();
    rerender(<AmbientBackground lineDirection='up' squareDirection='right' />);
    const squaresChanged = translate.mock.calls.slice(-160);
    expect(squaresChanged.slice(0, 70)).toEqual(linesChanged.slice(0, 70));
    expect(squaresChanged.slice(70)).not.toEqual(linesChanged.slice(70));
  });

  it('falls back from invalid directions and warns in development', () => {
    reduced = true;
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    const { unmount } = render(<AmbientBackground />);
    const baseline = translate.mock.calls.slice(-160);
    unmount();
    translate.mockClear();
    render(<AmbientBackground lineDirection={'invalid' as never} squareDirection={'invalid' as never} />);
    expect(translate.mock.calls.slice(-160)).toEqual(baseline);
    expect(warning).toHaveBeenCalledWith('AmbientBackground: invalid lineDirection; using up-left.');
    expect(warning).toHaveBeenCalledWith('AmbientBackground: invalid squareDirection; using up-left.');
  });

  it.each(['base', 'read', 'live'] as const)('keeps %s default geometry equal to explicit up-left', (profile) => {
    reduced = true;
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { unmount } = render(<AmbientBackground profile={profile} />);
    const baseline = translate.mock.calls.slice(1);
    unmount();
    translate.mockClear();
    render(<AmbientBackground profile={profile} lineDirection='up-left' squareDirection='up-left' />);
    expect(translate.mock.calls.slice(1)).toEqual(baseline);
  });

  it('forwards native event handlers to the root', () => {
    const onMouseMove = vi.fn();
    const { container } = render(<AmbientBackground onMouseMove={onMouseMove} />);
    const root = container.firstElementChild;
    expect(root).not.toBeNull();
    if (root) {
      fireEvent.mouseMove(root);
    }
    expect(onMouseMove).toHaveBeenCalledOnce();
  });

  it('defers sprite painting until the first frame', () => {
    render(<AmbientBackground />);
    expect(fill).not.toHaveBeenCalled();
    expect(raf.size).toBe(1);
    act(() => {
      const callback = [...raf.values()][0];
      raf.clear();
      callback?.(100);
    });
    expect(createdCanvases).toBe(4);
  });

  it('stops for hidden and zero opacity before reduced motion, then draws one static frame', () => {
    reduced = true;
    hidden = true;
    const { container, rerender } = render(<AmbientBackground opacity={0} />);
    const root = container.firstElementChild;
    expect(root?.getAttribute('data-state')).toBe('stopped');
    expect(fill).not.toHaveBeenCalled();
    hidden = false;
    act(() => document.dispatchEvent(new Event('visibilitychange')));
    expect(root?.getAttribute('data-state')).toBe('stopped');
    rerender(<AmbientBackground opacity={1} />);
    expect(root?.getAttribute('data-state')).toBe('static');
    expect(raf.size).toBe(0);
    expect(fill).toHaveBeenCalled();
    const count = fill.mock.calls.length;
    rerender(<AmbientBackground opacity={1} />);
    expect(fill).toHaveBeenCalledTimes(count);
    act(() => {
      reduced = false;
      mediaChange();
    });
    expect(root?.getAttribute('data-state')).toBe('running');
    expect(raf.size).toBe(1);
  });

  it('preserves survivors and patches profile counts without reinitialization', () => {
    reduced = true;
    const random = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    const { rerender } = render(<AmbientBackground />);
    expect(draw).toHaveBeenCalledTimes(230);
    const initial = translate.mock.calls.slice(-160);
    const randomCount = random.mock.calls.length;
    draw.mockClear();
    translate.mockClear();
    rerender(<AmbientBackground profile='read' />);
    expect(draw).toHaveBeenCalledTimes(65);
    expect(random).toHaveBeenCalledTimes(randomCount);
    expect(translate.mock.calls.slice(0, 20)).toEqual(initial.slice(0, 20));
    expect(translate.mock.calls.slice(20)).toEqual(initial.slice(70, 95));
    draw.mockClear();
    translate.mockClear();
    rerender(<AmbientBackground profile='live' />);
    expect(draw).toHaveBeenCalledTimes(340);
    expect(translate.mock.calls.slice(0, 20)).toEqual(initial.slice(0, 20));
    expect(translate.mock.calls.slice(110, 135)).toEqual(initial.slice(70, 95));
    expect(random.mock.calls.length - randomCount).toBe(645);
  });

  it.each(
    (['base', 'read', 'live'] as const).flatMap((profile) =>
      [699, 700, 701].flatMap((size) => [1, 2, 3].map((ratio) => [profile, size, ratio] as const))
    )
  )('uses %s counts at CSS width %i and DPR %i', (profile, size, ratio) => {
    width = size;
    reduced = true;
    vi.stubGlobal('devicePixelRatio', ratio);
    const { container } = render(<AmbientBackground profile={profile} />);
    const canvas = container.querySelector('canvas');
    const capped = Math.min(2, ratio);
    const counts = { base: [138, 230], read: [39, 65], live: [204, 340] } as const;
    expect(canvas?.width).toBe(size * capped);
    expect(canvas?.height).toBe(400 * capped);
    expect(transform).toHaveBeenCalledWith(capped, 0, 0, capped, 0, 0);
    expect(draw).toHaveBeenCalledTimes(counts[profile][size < 700 ? 0 : 1]);
  });

  it('stays stopped without a main context', () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null);
    const { container } = render(<AmbientBackground />);
    expect(container.firstElementChild?.getAttribute('data-state')).toBe('stopped');
    expect(raf.size).toBe(0);
    expect(draw).not.toHaveBeenCalled();
  });

  it.each([0, 1, 2])('never reports running when sprite context %i is absent', (index) => {
    const spy = vi.mocked(HTMLCanvasElement.prototype.getContext);
    spy.mockReturnValueOnce(context);
    for (let i = 0; i < index; i++) {
      spy.mockReturnValueOnce(context);
    }
    spy.mockReturnValueOnce(null);
    const { container } = render(<AmbientBackground />);
    expect(container.firstElementChild?.getAttribute('data-state')).toBe('stopped');
    expect(raf.size).toBe(0);
    expect(draw).not.toHaveBeenCalled();
  });

  it('cleans subscriptions if a sprite context fails after zero-size recovery', () => {
    width = 0;
    const { container, unmount } = render(<AmbientBackground />);
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null);
    act(() => {
      width = 800;
      resize();
    });
    expect(container.firstElementChild?.getAttribute('data-state')).toBe('stopped');
    expect(raf.size).toBe(0);
    expect(disconnect).toHaveBeenCalledOnce();
    unmount();
    expect(disconnect).toHaveBeenCalledOnce();
  });

  it('rejects an old cancelled callback after the animation restarts', () => {
    const { rerender } = render(<AmbientBackground />);
    const stale = [...raf.values()][0];
    rerender(<AmbientBackground opacity={0} />);
    rerender(<AmbientBackground />);
    expect(raf.size).toBe(1);
    act(() => stale?.(100));
    expect(draw).not.toHaveBeenCalled();
    expect(raf.size).toBe(1);
  });

  it('ignores a cancelled frame delivered after unmount', () => {
    const { unmount } = render(<AmbientBackground />);
    const stale = [...raf.values()][0];
    unmount();
    act(() => stale?.(100));
    expect(draw).not.toHaveBeenCalled();
    expect(raf.size).toBe(0);
  });

  it('survives StrictMode effect replay with one live frame', () => {
    const { unmount, container } = render(
      <StrictMode>
        <AmbientBackground />
      </StrictMode>
    );
    expect(container.firstElementChild?.getAttribute('data-state')).toBe('running');
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(raf.size).toBe(1);
    unmount();
    expect(disconnect).toHaveBeenCalledTimes(2);
    expect(raf.size).toBe(0);
  });

  it('keeps a second instance running when the first unmounts', () => {
    const first = render(<AmbientBackground />);
    const second = render(<AmbientBackground />);
    expect(raf.size).toBe(2);
    first.unmount();
    expect(raf.size).toBe(1);
    expect(second.container.firstElementChild?.getAttribute('data-state')).toBe('running');
    act(() => {
      const callback = [...raf.values()][0];
      raf.clear();
      callback?.(100);
    });
    expect(draw).toHaveBeenCalled();
    expect(raf.size).toBe(1);
    second.unmount();
    expect(raf.size).toBe(0);
  });

  it('stops at zero size and cleans up its frame and observer', () => {
    width = 0;
    const { container, unmount } = render(<AmbientBackground />);
    const root = container.firstElementChild;
    expect(root?.getAttribute('data-state')).toBe('stopped');
    expect(raf.size).toBe(0);
    act(() => {
      width = 800;
      resize();
    });
    expect(root?.getAttribute('data-state')).toBe('running');
    expect(raf.size).toBe(1);
    unmount();
    expect(raf.size).toBe(0);
    expect(disconnect).toHaveBeenCalledOnce();
  });
});
