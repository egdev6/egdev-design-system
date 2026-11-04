import { act, fireEvent, render } from '@testing-library/react';
import { StrictMode } from 'react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { isotipoCreateScene, isotipoPose } from '../atoms/isotipo3d/isotipoScene';
import { HomeTemplate } from './HomeTemplate';
import { HomeTemplateAnchor } from './HomeTemplateAnchor';
import type { HomeTemplateZone } from './types';

const ambient = vi.hoisted(() => ({
  ready: vi.fn(() => true),
  set: vi.fn(),
  resize: vi.fn(),
  start: vi.fn(),
  stop: vi.fn(),
  renderOnce: vi.fn(),
  dispose: vi.fn()
}));
vi.mock('../ambient-background/particleStreaks', async (original) => ({
  ...(await original<typeof import('../ambient-background/particleStreaks')>()),
  createParticleStreaks: vi.fn(() => ambient),
  resolveAmbientColors: vi.fn(() => ({
    backgroundColor: '#000',
    backgroundGlowColor: '#000',
    lineColor: '#000',
    lineGlowColor: '#000',
    squareColor: '#000',
    squareGlowColor: '#000'
  }))
}));
vi.mock('../atoms/isotipo3d/isotipoScene', async (original) => ({
  ...(await original<typeof import('../atoms/isotipo3d/isotipoScene')>()),
  isotipoCreateScene: vi.fn()
}));

type Scene = Awaited<ReturnType<typeof isotipoCreateScene>>;
const scene = () => ({ resize: vi.fn(), render: vi.fn(), dispose: vi.fn() }) as unknown as Scene;
const table: HomeTemplateZone[] = [{ id: 'a' }, { id: 'b', isotipo: true, scene: 'hero' }, { id: 'c' }];
const page = (zones: HomeTemplateZone[] = table) => (
  <HomeTemplate zoneTable={zones}>
    <section data-zone='a'>Content A</section>
    <section data-zone='b'>
      <HomeTemplateAnchor zone='b'>Fallback</HomeTemplateAnchor>
    </section>
    <section data-zone='c'>Content C</section>
  </HomeTemplate>
);
const tokens: Record<string, string> = {
  '--logo-red': '#123',
  '--logo-red-shade': '#123456',
  '--color-primitive-red-neon': '#abc',
  '--color-primitive-red-light': '#abcdef'
};
let valid = true;
let webgl = true;
beforeEach(() => {
  vi.clearAllMocks();
  valid = true;
  webgl = true;
  vi.stubGlobal('innerHeight', 900);
  vi.stubGlobal('innerWidth', 1000);
  Object.defineProperty(document.documentElement, 'scrollHeight', { configurable: true, value: 2700 });
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(function (this: Element) {
    const id = this.getAttribute('data-zone');
    const top = (id === 'a' ? 0 : id === 'b' ? 1 : 2) * 900;
    return { top, left: 0, right: 1000, bottom: top + 900, width: 1000, height: 900, x: 0, y: top, toJSON: () => ({}) };
  });
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  );
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {
        /* No layout observer. */
      }
      disconnect() {
        /* No resources. */
      }
    }
  );
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => (webgl ? {} : null) as never);
  const original = window.getComputedStyle;
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudo) => {
    const style = original(element, pseudo);
    if (element.classList.contains('eg-home-template')) {
      const get = style.getPropertyValue.bind(style);
      vi.spyOn(style, 'getPropertyValue').mockImplementation((name) =>
        name in tokens ? (valid ? (tokens[name] ?? '') : 'invalid') : get(name)
      );
    }
    return style;
  });
  vi.mocked(isotipoCreateScene).mockImplementation(async () => scene());
});
afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('creates one scene from root tokens and leaves opacity and fallback unchanged', async () => {
  const created = scene();
  vi.mocked(isotipoCreateScene).mockResolvedValue(created);
  const view = render(page());
  await act(async () => {
    /* Flush initialization. */
  });
  const canvas = view.container.querySelectorAll('canvas')[1];
  expect(isotipoCreateScene).toHaveBeenCalledOnce();
  expect(isotipoCreateScene).toHaveBeenCalledWith(
    canvas,
    { light: '#123', shade: '#123456', neon: '#abc', redLight: '#abcdef' },
    expect.any(AbortSignal)
  );
  expect(canvas?.style.getPropertyValue('--eg-home-isotipo-opacity')).toBe('0');
  expect(view.getByText('Fallback')).toBeVisible();
  expect(created.render).not.toHaveBeenCalled();
  view.unmount();
  expect(created.dispose).toHaveBeenCalledOnce();
});

it('preserves ambient-only behavior and rejects invalid colors or unavailable WebGL', async () => {
  const view = render(page(table.map(({ id }) => ({ id }))));
  await act(async () => {
    /* Flush initialization. */
  });
  expect(isotipoCreateScene).not.toHaveBeenCalled();
  expect(ambient.start).toHaveBeenCalled();
  valid = false;
  view.rerender(page([...table]));
  await act(async () => {
    /* Flush initialization. */
  });
  expect(isotipoCreateScene).not.toHaveBeenCalled();
  valid = true;
  webgl = false;
  view.rerender(page([...table]));
  await act(async () => {
    /* Flush initialization. */
  });
  expect(isotipoCreateScene).not.toHaveBeenCalled();
});

it('isolates scene rejection from ambient and visible content', async () => {
  vi.mocked(isotipoCreateScene).mockRejectedValue(new Error('creation'));
  const view = render(page());
  await act(async () => {
    /* Flush initialization. */
  });
  expect(isotipoCreateScene).toHaveBeenCalledOnce();
  expect(ambient.start).toHaveBeenCalled();
  expect(view.getByText('Content A')).toBeVisible();
  expect(view.getByText('Fallback')).toBeVisible();
  expect(view.container.querySelectorAll('canvas')[1]?.style.getPropertyValue('--eg-home-isotipo-opacity')).toBe('0');
});

it('disposes on context loss without affecting ambient', async () => {
  const created = scene();
  vi.mocked(isotipoCreateScene).mockResolvedValue(created);
  const view = render(page());
  await act(async () => {
    /* Flush initialization. */
  });
  const canvas = view.container.querySelectorAll('canvas')[1] as HTMLCanvasElement;
  fireEvent(canvas, new Event('webglcontextlost', { cancelable: true }));
  expect(created.dispose).toHaveBeenCalledOnce();
  expect(ambient.start).toHaveBeenCalled();
  expect(canvas.style.getPropertyValue('--eg-home-isotipo-opacity')).toBe('0');
  view.unmount();
  expect(created.dispose).toHaveBeenCalledOnce();
});

it('disposes a scene resolved after unmount', async () => {
  const created = scene();
  let resolve!: (value: Scene) => void;
  vi.mocked(isotipoCreateScene).mockReturnValue(
    new Promise((done) => {
      resolve = done;
    })
  );
  const view = render(page());
  expect(isotipoCreateScene).toHaveBeenCalledOnce();
  const signal = vi.mocked(isotipoCreateScene).mock.calls[0]?.[2];
  view.unmount();
  expect(signal?.aborted).toBe(true);
  await act(async () => {
    resolve(created);
  });
  expect(created.dispose).toHaveBeenCalledOnce();
});

const travelTable: HomeTemplateZone[] = [
  { id: 'a', isotipo: true, scene: 'chapter' },
  { id: 'b', isotipo: true, scene: 'outro' },
  { id: 'c' }
];
const travelPage = (zones = travelTable, missing = false) => (
  <HomeTemplate zoneTable={zones}>
    <section data-zone='a'>
      <HomeTemplateAnchor zone='a'>A fallback</HomeTemplateAnchor>
    </section>
    <section data-zone='b'>{!missing && <HomeTemplateAnchor zone='b'>B fallback</HomeTemplateAnchor>}</section>
    <section data-zone='c'>C</section>
  </HomeTemplate>
);
const travelFixture = (reduced = false) => {
  vi.useFakeTimers();
  let scroll = 0;
  let hidden = false;
  Object.defineProperty(window, 'scrollY', { configurable: true, get: () => scroll });
  Object.defineProperty(document, 'hidden', { configurable: true, get: () => hidden });
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() }))
  );
  vi.mocked(Element.prototype.getBoundingClientRect).mockImplementation(function (this: Element) {
    const anchor = this.classList.contains('eg-home-template-anchor');
    const id = anchor ? this.closest('[data-zone]')?.getAttribute('data-zone') : this.getAttribute('data-zone');
    const top = anchor ? 100 : (id === 'a' ? 0 : id === 'b' ? 900 : 1800) - scroll;
    const left = anchor && id === 'b' ? 500 : 100;
    const width = anchor ? 200 : 1000;
    const height = anchor ? 200 : 900;
    return { top, left, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON: () => ({}) };
  });
  const tick = () =>
    act(() => {
      vi.advanceTimersByTime(20);
    });
  return {
    tick,
    scrollTo: (value: number) => {
      scroll = value;
      fireEvent.scroll(window);
      tick();
    },
    visibility: (value: boolean) => {
      hidden = value;
      fireEvent(document, new Event('visibilitychange'));
    }
  };
};

it('travels between two 3D anchors with interpolated projection and pose', async () => {
  const fixture = travelFixture();
  const created = scene();
  vi.mocked(isotipoCreateScene).mockResolvedValue(created);
  render(travelPage());
  await act(async () => {
    /* Resolve the scene. */
  });
  for (const [scroll, t] of [
    [0, 0],
    [337.5, 0.5],
    [675, 1]
  ] as const) {
    fixture.scrollTo(scroll);
    fixture.tick();
    const call = vi.mocked(created.render).mock.lastCall;
    expect(call?.[0]).toBe('chapter');
    expect(call?.[2]).toBe(false);
    expect(call?.[4]?.anchor.left).toBeCloseTo(100 + 400 * t);
    const a = isotipoPose('chapter', (scroll + 900) / 1800, false);
    const b = isotipoPose('outro', scroll / 900, false);
    expect(call?.[3]?.pose?.az).toBeCloseTo(a.az + (b.az - a.az) * t);
  }
});

it('holds the 3D anchor across a one-sided band and suppresses missing travel', async () => {
  const fixture = travelFixture();
  const created = scene();
  vi.mocked(isotipoCreateScene).mockResolvedValue(created);
  const view = render(travelPage([{ id: 'a' }, travelTable[1] as HomeTemplateZone, { id: 'c' }]));
  await act(async () => {
    /* Resolve the scene. */
  });
  fixture.scrollTo(500);
  fixture.tick();
  expect(vi.mocked(created.render).mock.lastCall?.[4]?.anchor.left).toBe(500);
  view.rerender(travelPage(travelTable, true));
  fixture.scrollTo(337.5);
  const count = vi.mocked(created.render).mock.calls.length;
  fixture.tick();
  expect(vi.mocked(created.render)).toHaveBeenCalledTimes(count);
  expect(view.container.querySelectorAll('canvas')[1]?.style.getPropertyValue('--eg-home-isotipo-opacity')).toBe('0');
});

it('suppresses mobile-disabled zones', async () => {
  const fixture = travelFixture();
  vi.stubGlobal('innerWidth', 760);
  const created = scene();
  vi.mocked(isotipoCreateScene).mockResolvedValue(created);
  const view = render(
    travelPage([{ id: 'a', isotipo: true, scene: 'chapter', mobileIsotipo: false }, { id: 'b' }, { id: 'c' }])
  );
  await act(async () => {
    /* Resolve the scene. */
  });
  fixture.tick();
  expect(created.render).not.toHaveBeenCalled();
  expect(view.container.querySelectorAll('canvas')[1]?.style.getPropertyValue('--eg-home-isotipo-opacity')).toBe('0');
});

it('renders reduced motion once per effective change without pose override', async () => {
  const fixture = travelFixture(true);
  const created = scene();
  vi.mocked(isotipoCreateScene).mockResolvedValue(created);
  render(travelPage());
  await act(async () => {
    /* Resolve the scene. */
  });
  fixture.scrollTo(500);
  const call = vi.mocked(created.render).mock.lastCall;
  expect(call?.[0]).toBe('outro');
  expect(call?.[2]).toBe(true);
  expect(call?.[3]).toEqual({ time: 0, intro: 1 });
  const count = vi.mocked(created.render).mock.calls.length;
  fixture.tick();
  fixture.tick();
  expect(created.render).toHaveBeenCalledTimes(count);
});

it('stops when hidden and resumes with one animation loop', async () => {
  const fixture = travelFixture();
  const created = scene();
  vi.mocked(isotipoCreateScene).mockResolvedValue(created);
  render(travelPage());
  await act(async () => {
    /* Resolve the scene. */
  });
  fixture.tick();
  fixture.visibility(true);
  const count = vi.mocked(created.render).mock.calls.length;
  fixture.tick();
  expect(created.render).toHaveBeenCalledTimes(count);
  fixture.visibility(false);
  fixture.visibility(false);
  fixture.tick();
  expect(created.render).toHaveBeenCalledTimes(count + 1);
});

it('leaves exactly one live scene in StrictMode', async () => {
  const created: Scene[] = [];
  vi.mocked(isotipoCreateScene).mockImplementation(async () => {
    const item = scene();
    created.push(item);
    return item;
  });
  const view = render(<StrictMode>{page()}</StrictMode>);
  await act(async () => {
    /* Flush initialization. */
  });
  expect(created.length - created.filter((item) => vi.mocked(item.dispose).mock.calls.length > 0).length).toBe(1);
  view.unmount();
  expect(created.every((item) => vi.mocked(item.dispose).mock.calls.length === 1)).toBe(true);
});
