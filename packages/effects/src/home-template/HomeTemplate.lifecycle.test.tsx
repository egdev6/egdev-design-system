import { act, fireEvent, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { HomeTemplate } from './HomeTemplate';
import { HomeTemplateAnchor } from './HomeTemplateAnchor';

const engine = vi.hoisted(() => ({
  ready: vi.fn(() => true),
  set: vi.fn(),
  resize: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  renderOnce: vi.fn(),
  dispose: vi.fn()
}));
vi.mock('../ambient-background/particleStreaks', async (importOriginal) => ({
  ...(await importOriginal<typeof import('../ambient-background/particleStreaks')>()),
  createParticleStreaks: vi.fn(() => engine),
  resolveAmbientColors: vi.fn(() => ({
    backgroundColor: '#000',
    backgroundGlowColor: '#000',
    lineColor: '#000',
    lineGlowColor: '#000',
    squareColor: '#000',
    squareGlowColor: '#000'
  }))
}));

const table = [{ id: 'a' }, { id: 'b', profile: 'read' as const }, { id: 'c' }];
let height = 900;
let docHeight = 2700;
let scroll = 0;
let reduced = false;
let hidden = false;
let mediaListeners: (() => void)[] = [];
const originalFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
const page = (change = vi.fn(), duplicate = false) => (
  <HomeTemplate zoneTable={table} onZoneChange={change}>
    <section data-zone='a'>A</section>
    {duplicate && <section data-zone='a'>Duplicate</section>}
    <section data-zone='b'>B</section>
    <section data-zone='c'>C</section>
  </HomeTemplate>
);
const tick = () =>
  act(() => {
    vi.advanceTimersByTime(20);
  });
const resize = () => {
  fireEvent.resize(window);
  act(() => {
    vi.advanceTimersByTime(150);
  });
};
beforeEach(() => {
  vi.useFakeTimers();
  vi.clearAllMocks();
  height = 900;
  docHeight = 2700;
  scroll = 0;
  reduced = false;
  hidden = false;
  mediaListeners = [];
  vi.stubGlobal('innerHeight', 900);
  vi.stubGlobal('innerWidth', 1000);
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scroll });
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, get: () => docHeight });
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const id = this.getAttribute('data-zone');
    const index = id === 'a' ? 0 : id === 'b' ? 1 : 2;
    const measuredHeight = Number(this.getAttribute('data-height') ?? height);
    const top = Number(this.getAttribute('data-top') ?? index * height) - scroll;
    return {
      top,
      left: 0,
      right: 1000,
      bottom: top + measuredHeight,
      width: 1000,
      height: measuredHeight,
      x: 0,
      y: 0,
      toJSON: () => ({})
    };
  });
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({
      get matches() {
        return reduced;
      },
      addEventListener: (_: string, fn: () => void) => mediaListeners.push(fn),
      removeEventListener: (_: string, fn: () => void) => {
        mediaListeners = mediaListeners.filter((item) => item !== fn);
      }
    }))
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {
        /* No layout observer in this fixture. */
      }
      disconnect() {
        /* No resources in this fixture. */
      }
    }
  );
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  if (originalFonts) {
    Object.defineProperty(document, 'fonts', originalFonts);
  } else {
    Reflect.deleteProperty(document, 'fonts');
  }
});

it.each([
  { name: 'no travel', heights: [100, 100], tops: [0, 100], documentHeight: 900 },
  { name: 'successive collisions', heights: [300, 300, 300], tops: [0, 300, 600], documentHeight: 900 },
  { name: 'overlap with available scroll', heights: [300, 300, 300], tops: [0, 300, 600], documentHeight: 2700 }
])(
  'keeps all content visible for A1 $name and recovers with the valid fixture',
  ({ heights, tops, documentHeight }) => {
    docHeight = documentHeight;
    const change = vi.fn();
    const sections = (valid: boolean) =>
      (valid ? [0, 900, 1800] : tops).map((top, index) => (
        <section key={index} data-zone={table[index]?.id} data-top={top} data-height={valid ? 900 : heights[index]}>
          Content {index}
          <HomeTemplateAnchor zone={table[index]?.id ?? ''}>Fallback {index}</HomeTemplateAnchor>
        </section>
      ));
    const view = render(
      <HomeTemplate zoneTable={table} onZoneChange={change}>
        {sections(false)}
      </HomeTemplate>
    );
    const root = view.container.firstElementChild as HTMLElement;
    const [ambient, isotipo] = root.querySelectorAll('canvas');
    expect(root).not.toHaveAttribute('data-state');
    expect(change).not.toHaveBeenCalled();
    expect(engine.start).not.toHaveBeenCalled();
    expect(engine.stop).toHaveBeenCalled();
    expect(ambient?.style.getPropertyValue('--eg-home-ambient-opacity')).toBe('0');
    expect(isotipo?.style.getPropertyValue('--eg-home-isotipo-opacity')).toBe('0');
    expect(root.children[1]).toHaveClass('bg-[image:var(--gradient-vignette)]');
    for (let index = 0; index < tops.length; index++) {
      expect(view.getByText(`Content ${index}`)).toBeVisible();
      expect(view.getByText(`Fallback ${index}`)).toBeVisible();
    }
    docHeight = 2700;
    view.rerender(
      <HomeTemplate zoneTable={table} onZoneChange={change}>
        {sections(true)}
      </HomeTemplate>
    );
    expect(root).toHaveAttribute('data-state', 'a');
    expect(change).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledWith({ zone: 'a', previous: null });
  }
);

it('invalidates all targets and recovers with retained callback identity', () => {
  const change = vi.fn();
  height = 100;
  docHeight = 900;
  const view = render(page(change));
  const root = view.container.firstElementChild as HTMLElement;
  const canvas = root.querySelector('canvas') as HTMLCanvasElement;
  expect(root).not.toHaveAttribute('data-state');
  expect(change).not.toHaveBeenCalled();
  expect(canvas.style.getPropertyValue('--eg-home-ambient-opacity')).toBe('0');
  expect(engine.start).not.toHaveBeenCalled();
  height = 900;
  docHeight = 2700;
  resize();
  expect(root).toHaveAttribute('data-state', 'a');
  expect(change).toHaveBeenLastCalledWith({ zone: 'a', previous: null });
  height = 100;
  docHeight = 900;
  resize();
  expect(root).not.toHaveAttribute('data-state');
  expect(engine.stop).toHaveBeenCalled();
  height = 900;
  docHeight = 2700;
  resize();
  expect(change).toHaveBeenCalledTimes(1);
  height = 100;
  docHeight = 900;
  resize();
  scroll = 1800;
  height = 900;
  docHeight = 2700;
  resize();
  expect(change).toHaveBeenLastCalledWith({ zone: 'c', previous: 'a' });
  scroll = 0;
  fireEvent.scroll(window);
  tick();
  expect(change).toHaveBeenLastCalledWith({ zone: 'a', previous: 'c' });
  expect(change).toHaveBeenCalledTimes(3);
});

it('chooses the first duplicate and debounces resize for exactly 150ms', () => {
  const change = vi.fn();
  const view = render(page(change, true));
  const root = view.container.firstElementChild as HTMLElement;
  expect(root).toHaveAttribute('data-state', 'a');
  expect(view.getByText('Duplicate')).toBeVisible();
  expect(console.warn).toHaveBeenCalledWith(expect.stringMatching(/duplicate/i));
  height = 100;
  docHeight = 900;
  fireEvent.resize(window);
  act(() => {
    vi.advanceTimersByTime(149);
  });
  expect(root).toHaveAttribute('data-state', 'a');
  act(() => {
    vi.advanceTimersByTime(1);
  });
  expect(root).not.toHaveAttribute('data-state');
});

it('rejects later-band collisions and out-of-order sections without publishing a prefix', () => {
  height = 300;
  docHeight = 2700;
  const change = vi.fn();
  const view = render(page(change));
  const root = view.container.firstElementChild as HTMLElement;
  expect(root).not.toHaveAttribute('data-state');
  expect(change).not.toHaveBeenCalled();
  expect(engine.start).not.toHaveBeenCalled();
  expect(root.querySelectorAll('canvas')[0]?.style.getPropertyValue('--eg-home-ambient-opacity')).toBe('0');
  height = 900;
  view.rerender(
    <HomeTemplate zoneTable={table} onZoneChange={change}>
      <section data-zone='b'>B</section>
      <section data-zone='a'>A</section>
      <section data-zone='c'>C</section>
    </HomeTemplate>
  );
  expect(root).not.toHaveAttribute('data-state');
  expect(change).not.toHaveBeenCalled();
});

it('uses the first duplicate geometry and re-resolves when it is removed', () => {
  scroll = 550;
  const change = vi.fn();
  const content = (first: boolean) => (
    <>
      {first && (
        <section key='first' data-zone='a' data-top='0' data-height='100'>
          First section
        </section>
      )}
      <section key='later' data-zone='a' data-top='0' data-height='900'>
        Later section
      </section>
      <section key='b' data-zone='b' data-top='900' data-height='900'>
        B section
      </section>
    </>
  );
  const two = table.slice(0, 2);
  const view = render(
    <HomeTemplate zoneTable={two} onZoneChange={change}>
      {content(true)}
    </HomeTemplate>
  );
  const root = view.container.firstElementChild as HTMLElement;
  const later = view.getByText('Later section');
  expect(root).toHaveAttribute('data-state', 'a');
  expect(change).toHaveBeenCalledWith({ zone: 'a', previous: null });
  expect(console.warn).toHaveBeenCalledWith('HomeTemplate: duplicate section: a');
  expect(later).toBeVisible();
  view.rerender(
    <HomeTemplate zoneTable={two} onZoneChange={change}>
      {content(false)}
    </HomeTemplate>
  );
  expect(view.getByText('Later section')).toBe(later);
  expect(later).toBeVisible();
  expect(root).toHaveAttribute('data-state', 'b');
  expect(change).toHaveBeenLastCalledWith({ zone: 'b', previous: 'a' });
});

it('remeasures on load, font readiness and body resize observation', async () => {
  let resolveFonts: (() => void) | undefined;
  const ready = new Promise<void>((resolve) => {
    resolveFonts = resolve;
  });
  Object.defineProperty(document, 'fonts', { configurable: true, value: { ready } });
  let notify: ResizeObserverCallback | undefined;
  const observe = vi.fn();
  const disconnect = vi.fn();
  vi.stubGlobal(
    'ResizeObserver',
    class {
      constructor(callback: ResizeObserverCallback) {
        notify = callback;
      }
      observe = observe;
      disconnect = disconnect;
    }
  );
  height = 100;
  docHeight = 900;
  const change = vi.fn();
  const view = render(page(change));
  const root = view.container.firstElementChild as HTMLElement;
  expect(observe).toHaveBeenCalledWith(document.body);
  expect(root).not.toHaveAttribute('data-state');
  height = 900;
  docHeight = 2700;
  fireEvent.load(window);
  expect(root).toHaveAttribute('data-state', 'a');
  height = 100;
  docHeight = 900;
  await act(async () => {
    resolveFonts?.();
    await ready;
  });
  expect(root).not.toHaveAttribute('data-state');
  height = 900;
  docHeight = 2700;
  act(() => {
    notify?.([], {} as ResizeObserver);
  });
  expect(root).toHaveAttribute('data-state', 'a');
  expect(change).toHaveBeenCalledOnce();
  view.unmount();
  expect(disconnect).toHaveBeenCalled();
});

it.each(['absent', 'throwing'] as const)('fails open when platform services are %s', (mode) => {
  vi.stubGlobal(
    'ResizeObserver',
    mode === 'absent'
      ? undefined
      : class {
          constructor() {
            throw new Error('observer');
          }
        }
  );
  vi.stubGlobal(
    'matchMedia',
    mode === 'absent'
      ? undefined
      : () => {
          throw new Error('media');
        }
  );
  if (mode === 'absent') {
    Object.defineProperty(document, 'fonts', { configurable: true, value: undefined });
  } else {
    Object.defineProperty(document, 'fonts', {
      configurable: true,
      get: () => {
        throw new Error('fonts');
      }
    });
  }
  const view = render(page());
  expect(view.getByText('A')).toBeVisible();
  expect(view.container.firstElementChild).toHaveAttribute('data-state', 'a');
  expect(() => {
    fireEvent.load(window);
    view.unmount();
  }).not.toThrow();
});

it('does not write window keys or html/body attributes and styles throughout its lifecycle', () => {
  const snapshot = () => ({
    keys: Object.getOwnPropertyNames(window).sort(),
    html: Array.from(document.documentElement.attributes, ({ name, value }) => [name, value]).sort(),
    body: Array.from(document.body.attributes, ({ name, value }) => [name, value]).sort(),
    htmlStyle: document.documentElement.style.cssText,
    bodyStyle: document.body.style.cssText
  });
  const before = snapshot();
  const view = render(page());
  expect(snapshot()).toEqual(before);
  scroll = 1800;
  fireEvent.scroll(window);
  tick();
  reduced = true;
  act(() => {
    mediaListeners.forEach((listener) => listener());
  });
  expect(snapshot()).toEqual(before);
  view.unmount();
  expect(snapshot()).toEqual(before);
});

it('does not notify on callback replacement or patch an unchanged profile', () => {
  const first = vi.fn();
  const second = vi.fn();
  const view = render(page(first));
  expect(first).toHaveBeenCalledTimes(1);
  const sets = engine.set.mock.calls.length;
  view.rerender(page(second));
  scroll = 0;
  fireEvent.scroll(window);
  tick();
  expect(second).not.toHaveBeenCalled();
  expect(engine.set).toHaveBeenCalledTimes(sets);
  scroll = 1800;
  fireEvent.scroll(window);
  tick();
  expect(second).toHaveBeenCalledWith({ zone: 'c', previous: 'a' });
});

it('pauses while hidden, handles live reduced motion and cleans up without global writes', () => {
  const keys = Object.keys(window).sort();
  const html = document.documentElement.getAttributeNames();
  const body = document.body.getAttributeNames();
  const view = render(<StrictMode>{page()}</StrictMode>);
  const root = view.container.firstElementChild as HTMLElement;
  expect(engine.start).toHaveBeenCalled();
  hidden = true;
  fireEvent(document, new Event('visibilitychange'));
  expect(engine.stop).toHaveBeenCalled();
  hidden = false;
  fireEvent(document, new Event('visibilitychange'));
  expect(engine.start.mock.calls.length).toBeGreaterThan(1);
  reduced = true;
  act(() => {
    mediaListeners.forEach((listener) => listener());
  });
  expect(root).toHaveAttribute('data-motion', 'reduced');
  expect(engine.renderOnce).toHaveBeenCalled();
  reduced = false;
  act(() => {
    mediaListeners.forEach((listener) => listener());
  });
  expect(root).not.toHaveAttribute('data-motion');
  view.unmount();
  expect(engine.dispose).toHaveBeenCalled();
  expect(mediaListeners).toHaveLength(0);
  expect(Object.keys(window).sort()).toEqual(keys);
  expect(document.documentElement.getAttributeNames()).toEqual(html);
  expect(document.body.getAttributeNames()).toEqual(body);
});
