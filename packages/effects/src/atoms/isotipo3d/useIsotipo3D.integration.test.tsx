import { act, render, screen, waitFor } from '@testing-library/react';
import type { CSSProperties } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const colors = {
  '--logo-red': '#e91b35',
  '--logo-red-shade': '#800c1d',
  '--color-primitive-red-neon': '#ff0036',
  '--color-primitive-red-light': '#ff335e'
} as CSSProperties;

describe('Isotipo hook and actual lazy factory', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doUnmock('three');
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
        observe() {
          /* observation */
        }
        disconnect() {
          /* cleanup */
        }
      }
    );
    vi.stubGlobal(
      'matchMedia',
      vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
    );
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.doUnmock('three');
  });

  it.each(['import', 'renderer'])('selects fallback when %s fails', async (failure) => {
    const renderer = vi.fn(() => {
      throw new Error('renderer failed');
    });
    vi.doMock('three', () => {
      if (failure === 'import') {
        throw new Error('import failed');
      }
      return Object.fromEntries([['WebGLRenderer', renderer]]);
    });
    const { useIsotipo3D } = await import('./useIsotipo3D');
    function Harness() {
      const hook = useIsotipo3D('hero', 0, 1, false);
      return (
        <div ref={hook.rootRef} style={colors} data-testid='root' data-state={hook.state}>
          <canvas ref={hook.canvasRef} />
        </div>
      );
    }
    render(<Harness />);
    await waitFor(() => expect(screen.getByTestId('root').dataset.state).toBe('fallback'));
    expect(renderer).toHaveBeenCalledTimes(failure === 'renderer' ? 1 : 0);
  });

  it('does not construct a renderer when unmounted during the lazy import', async () => {
    let release: (() => void) | undefined;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    const renderer = vi.fn();
    const geometry = vi.fn();
    const material = vi.fn();
    vi.doMock('three', async () => {
      await pending;
      return Object.fromEntries([
        ['WebGLRenderer', renderer],
        ['ExtrudeGeometry', geometry],
        ['MeshStandardMaterial', material]
      ]);
    });
    const { useIsotipo3D } = await import('./useIsotipo3D');
    function Harness() {
      const hook = useIsotipo3D('hero', 0, 1, false);
      return (
        <div ref={hook.rootRef} style={colors}>
          <canvas ref={hook.canvasRef} />
        </div>
      );
    }
    const view = render(<Harness />);
    view.unmount();
    await act(async () => {
      release?.();
      await pending;
      await Promise.resolve();
    });
    expect(renderer).not.toHaveBeenCalled();
    expect(geometry).not.toHaveBeenCalled();
    expect(material).not.toHaveBeenCalled();
  });
});
