import { act, fireEvent, render } from '@testing-library/react';
import { type CSSProperties, createRef, type ReactNode, StrictMode } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { ScrollReveal } from './ScrollReveal';
import type { ScrollRevealProps } from './types';

/* ------------------------------------------------------------------ */
/* Shared fakes and helpers (public-interface driven)                  */
/* ------------------------------------------------------------------ */

class FakeIntersectionObserver {
  static instances: FakeIntersectionObserver[] = [];
  readonly observed = new Set<Element>();
  constructor(
    public callback: IntersectionObserverCallback,
    public options?: IntersectionObserverInit
  ) {
    FakeIntersectionObserver.instances.push(this);
  }
  observe(target: Element): void {
    this.observed.add(target);
  }
  unobserve(target: Element): void {
    this.observed.delete(target);
  }
  disconnect(): void {
    this.observed.clear();
  }
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
  intersect(targets: Element[], isIntersecting = true): void {
    this.callback(
      targets.map((target) => ({ isIntersecting, target, time: 0 })) as unknown as IntersectionObserverEntry[],
      this as unknown as IntersectionObserver
    );
  }
}

function stubIntersectionObserver(): void {
  FakeIntersectionObserver.instances = [];
  vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver as unknown as typeof IntersectionObserver);
}

function mockElementRect(top: number): void {
  vi.spyOn(Element.prototype, 'getBoundingClientRect').mockImplementation(() => {
    return {
      top,
      bottom: top + 40,
      left: 0,
      right: 120,
      width: 120,
      height: 40,
      x: 0,
      y: top,
      toJSON: () => ({})
    } as DOMRect;
  });
}

type MediaControl = { matches: boolean; listeners: Array<(event: { matches: boolean }) => void>; removed: boolean };
let mediaControl: MediaControl;

function stubMatchMedia(initialMatches: boolean): MediaControl {
  const control: MediaControl = { matches: initialMatches, listeners: [], removed: false };
  mediaControl = control;
  vi.stubGlobal(
    'matchMedia',
    (query: string) =>
      ({
        matches: control.matches,
        media: query,
        onchange: null,
        addEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
          control.listeners.push(listener);
        },
        removeEventListener: (_type: string, listener: (event: { matches: boolean }) => void) => {
          control.listeners = control.listeners.filter((candidate) => candidate !== listener);
          control.removed = true;
        },
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false
      }) as unknown as MediaQueryList
  );
  return control;
}

function firePreferenceChange(matches: boolean): void {
  const control = mediaControl;
  control.matches = matches;
  act(() => {
    for (const listener of control.listeners) {
      listener({ matches } as MediaQueryListEvent);
    }
  });
}

function mockComputedStyle(overrides: Record<string, string>): void {
  const real = window.getComputedStyle.bind(window);
  vi.spyOn(window, 'getComputedStyle').mockImplementation((element, pseudoElt) => {
    const style = real(element as Element, pseudoElt);
    return new Proxy(style, {
      get(target, property) {
        if (typeof property === 'string' && property in overrides) {
          return overrides[property];
        }
        const value: unknown = Reflect.get(target, property, target);
        return typeof value === 'function'
          ? (value as (this: unknown, ...args: unknown[]) => unknown).bind(target)
          : value;
      }
    });
  });
}

type RenderResult = ReturnType<typeof render>;

/** Below-the-fold render with observation and motion support stubbed in. */
function renderScroll(props: ScrollRevealProps = {}, children: ReactNode = <p>Reveal content</p>): RenderResult {
  stubIntersectionObserver();
  stubMatchMedia(false);
  mockElementRect(1200);
  return render(<ScrollReveal {...props}>{children}</ScrollReveal>);
}

function rootOf(result: RenderResult): HTMLElement {
  const root = result.container.firstElementChild;
  expect(root).not.toBeNull();
  return root as HTMLElement;
}

function intersectRoot(result: RenderResult): FakeIntersectionObserver {
  const observer = FakeIntersectionObserver.instances.at(-1);
  expect(observer).toBeDefined();
  act(() => {
    observer?.intersect([rootOf(result)]);
  });
  return observer as FakeIntersectionObserver;
}

const clipTiming = { transitionProperty: 'clip-path', transitionDuration: '0.8s', transitionDelay: '0s' };

function renderWipeRevealed(): RenderResult {
  mockComputedStyle(clipTiming);
  const result = renderScroll({ variant: 'wipe' });
  intersectRoot(result);
  return result;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  vi.useRealTimers();
});

/* ------------------------------------------------------------------ */
/* AC-01 — SSR / no JS / observer failure: content always visible      */
/* ------------------------------------------------------------------ */

describe('AC-01 fail-open visibility', () => {
  it.each(['reveal', 'wipe'] as const)('keeps the %s server render visible, unhidden and clip-free', (variant) => {
    const html = renderToStaticMarkup(
      <ScrollReveal variant={variant}>
        <p>The reveal content</p>
      </ScrollReveal>
    );
    expect(html).toContain('eg-scroll-reveal');
    expect(html).toContain('The reveal content');
    expect(html).toContain('data-state="revealed"');
    expect(html).not.toContain('data-state="hidden"');
    if (variant === 'wipe') {
      expect(html).toContain(' data-done=');
    } else {
      expect(html).not.toContain(' data-done=');
    }
  });

  it('keeps content visible and skips the entrance when IntersectionObserver is missing', () => {
    stubMatchMedia(false);
    mockElementRect(1200);
    const { container } = render(
      <ScrollReveal>
        <p>The reveal content</p>
      </ScrollReveal>
    );
    expect(container.firstElementChild).toHaveAttribute('data-state', 'revealed');
  });

  it.each([
    [
      'the observer constructor throws',
      class {
        constructor() {
          throw new Error('observer construction refused');
        }
      }
    ],
    [
      'observing throws',
      class {
        observe(): void {
          throw new Error('observe refused');
        }
        disconnect(): void {
          // This failure stub allocates no observer resources to release.
        }
      }
    ]
  ])('keeps content visible when %s', (_label, Observer) => {
    vi.stubGlobal('IntersectionObserver', Observer as unknown as typeof IntersectionObserver);
    stubMatchMedia(false);
    mockElementRect(1200);
    const { container } = render(
      <ScrollReveal>
        <p>The reveal content</p>
      </ScrollReveal>
    );
    expect(container.firstElementChild).toHaveAttribute('data-state', 'revealed');
  });

  it('disconnects the partially initialized observer when observing throws', () => {
    const disconnectSpy = vi.fn();
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        observe(): void {
          throw new Error('observe refused');
        }
        disconnect(): void {
          disconnectSpy();
        }
      } as unknown as typeof IntersectionObserver
    );
    stubMatchMedia(false);
    mockElementRect(1200);
    const { container } = render(
      <ScrollReveal>
        <p>The reveal content</p>
      </ScrollReveal>
    );
    expect(container.firstElementChild).toHaveAttribute('data-state', 'revealed');
    expect(disconnectSpy).toHaveBeenCalledTimes(1);
  });

  it('never observes when reduced motion is requested at mount', () => {
    stubIntersectionObserver();
    stubMatchMedia(true);
    mockElementRect(1200);
    const { container } = render(
      <ScrollReveal>
        <p>The reveal content</p>
      </ScrollReveal>
    );
    expect(container.firstElementChild).toHaveAttribute('data-state', 'revealed');
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/* AC-02 — intersection reveal with the variant transition             */
/* ------------------------------------------------------------------ */

describe('AC-02 intersection reveal', () => {
  it.each(['reveal', 'wipe'] as const)('shares the static root utilities for %s', (variant) => {
    const root = rootOf(renderScroll({ variant }));
    for (const utility of [
      'eg-scroll-reveal',
      'box-border',
      'ease-[var(--ease-out)]',
      'delay-[var(--eg-scroll-reveal-delay)]',
      'motion-reduce:transition-none',
      'focus-within:transition-none'
    ]) {
      expect(root.classList.contains(utility)).toBe(true);
    }
  });

  it('hides below the line, then reveals on intersection with the reveal classes', () => {
    const result = renderScroll();
    const root = rootOf(result);
    expect(root).toHaveAttribute('data-state', 'hidden');
    expect(root).toHaveAttribute('data-reveal');
    expect(root).not.toHaveAttribute('data-wipe');
    for (const utility of [
      'transition-[opacity,translate]',
      'duration-[var(--duration-reveal)]',
      'data-[state=hidden]:opacity-0',
      'data-[state=hidden]:translate-y-7'
    ]) {
      expect(root.classList.contains(utility)).toBe(true);
    }

    const observer = FakeIntersectionObserver.instances.at(-1);
    expect(observer?.options).toEqual({ rootMargin: '0px 0px -8% 0px', threshold: 0 });
    expect(observer?.observed.has(root)).toBe(true);

    intersectRoot(result);
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(observer?.observed.has(root)).toBe(false);
    expect(root.classList.contains('transition-[opacity,translate]')).toBe(true);
  });

  it('applies the wipe classes and marker, unclipped while armed hidden', () => {
    const result = renderScroll({ variant: 'wipe' });
    const root = rootOf(result);
    expect(root).toHaveAttribute('data-wipe');
    expect(root).not.toHaveAttribute('data-reveal');
    expect(root).toHaveAttribute('data-state', 'hidden');
    expect(root).not.toHaveAttribute('data-done');
    for (const utility of [
      'transition-[clip-path]',
      'duration-[var(--duration-wipe)]',
      'data-[state=hidden]:[clip-path:inset(-10%_100%_-10%_0)]',
      'data-[state=revealed]:[clip-path:inset(-10%_-2%_-10%_0)]',
      '[&[data-done]]:[clip-path:none]'
    ]) {
      expect(root.classList.contains(utility)).toBe(true);
    }
  });
});

/* ------------------------------------------------------------------ */
/* AC-03 — pre-pass above the 92% line                                 */
/* ------------------------------------------------------------------ */

describe('AC-03 pre-pass reveal', () => {
  it('reveals above-fold elements immediately without observing', () => {
    stubIntersectionObserver();
    stubMatchMedia(false);
    mockElementRect(100);
    const { container } = render(
      <ScrollReveal>
        <p>Above the fold</p>
      </ScrollReveal>
    );
    expect(container.firstElementChild).toHaveAttribute('data-state', 'revealed');
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it('keeps the 92% viewport-line boundary exact', () => {
    stubIntersectionObserver();
    stubMatchMedia(false);
    // 768 * 0.92 = 706.56: 706 is above the line, 707 is below it.
    mockElementRect(706);
    const above = render(
      <ScrollReveal>
        <p>Above</p>
      </ScrollReveal>
    );
    expect(above.container.firstElementChild).toHaveAttribute('data-state', 'revealed');
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
    above.unmount();

    mockElementRect(707);
    const below = render(
      <ScrollReveal>
        <p>Below</p>
      </ScrollReveal>
    );
    expect(below.container.firstElementChild).toHaveAttribute('data-state', 'hidden');
    expect(FakeIntersectionObserver.instances).toHaveLength(1);
  });
});

/* ------------------------------------------------------------------ */
/* AC-04 — once-only invariant                                         */
/* ------------------------------------------------------------------ */

describe('AC-04 once-only invariant', () => {
  it('never re-hides on later intersections and unobserves after reveal', () => {
    const result = renderScroll();
    const root = rootOf(result);
    const observer = intersectRoot(result);
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(observer.observed.has(root)).toBe(false);

    act(() => {
      observer.intersect([root]);
    });
    act(() => {
      observer.intersect([root]);
    });
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(root).not.toHaveAttribute('data-state', 'hidden');
  });

  it('exposes no once replay prop', () => {
    type HasOnce = 'once' extends keyof ScrollRevealProps ? true : false;
    expectTypeOf<HasOnce>().toEqualTypeOf<false>();
  });
});

/* ------------------------------------------------------------------ */
/* AC-05 — wipe terminal state and bounded cleanup                     */
/* ------------------------------------------------------------------ */

describe('AC-05 wipe terminal state', () => {
  it('finalizes through transitionend for clip-path and clears the cleanup listeners', () => {
    vi.useFakeTimers();
    const removeSpy = vi.spyOn(EventTarget.prototype, 'removeEventListener');
    const result = renderWipeRevealed();
    const root = rootOf(result);
    fireEvent.transitionEnd(root, { propertyName: 'clip-path' });
    expect(root).toHaveAttribute('data-done');
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(root).toHaveAttribute('data-done');
    expect(removeSpy).toHaveBeenCalledWith('transitionend', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('transitioncancel', expect.any(Function));
  });

  it('ignores transitionend for other properties and finishes through the bounded timer', () => {
    vi.useFakeTimers();
    const result = renderWipeRevealed();
    const root = rootOf(result);
    fireEvent.transitionEnd(root, { propertyName: 'opacity' });
    expect(root).not.toHaveAttribute('data-done');
    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(root).not.toHaveAttribute('data-done');
    act(() => {
      vi.advanceTimersByTime(700);
    });
    expect(root).toHaveAttribute('data-done');
  });

  it('ignores transitioncancel for other root properties and finishes through the bounded timer', () => {
    vi.useFakeTimers();
    const result = renderWipeRevealed();
    const root = rootOf(result);
    fireEvent.transitionCancel(root, { propertyName: 'opacity' });
    expect(root).not.toHaveAttribute('data-done');
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(root).toHaveAttribute('data-done');
  });

  it('ignores transition events bubbling up from descendant elements', () => {
    vi.useFakeTimers();
    const result = renderWipeRevealed();
    const root = rootOf(result);
    const child = root.firstElementChild as HTMLElement;
    fireEvent.transitionEnd(child, { propertyName: 'clip-path' });
    fireEvent.transitionCancel(child);
    expect(root).not.toHaveAttribute('data-done');
    fireEvent.transitionEnd(root, { propertyName: 'clip-path' });
    expect(root).toHaveAttribute('data-done');
  });

  it('finalizes through transitioncancel for clip-path on the element itself', () => {
    vi.useFakeTimers();
    const result = renderWipeRevealed();
    const root = rootOf(result);
    fireEvent.transitionCancel(root, { propertyName: 'clip-path' });
    expect(root).toHaveAttribute('data-done');
  });

  it('still finalizes when no transition event ever fires (missed transitionend)', () => {
    vi.useFakeTimers();
    const result = renderWipeRevealed();
    const root = rootOf(result);
    expect(root).not.toHaveAttribute('data-done');
    act(() => {
      vi.advanceTimersByTime(799);
    });
    expect(root).not.toHaveAttribute('data-done');
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(root).toHaveAttribute('data-done');
  });

  it('finalizes immediately when computed transition timing is unreadable', () => {
    mockComputedStyle({ transitionProperty: '', transitionDuration: '', transitionDelay: '' });
    const result = renderScroll({ variant: 'wipe' });
    intersectRoot(result);
    expect(rootOf(result)).toHaveAttribute('data-done');
  });

  it('finalizes the above-fold wipe pre-pass without a transition', () => {
    stubIntersectionObserver();
    stubMatchMedia(false);
    mockElementRect(100);
    const { container } = render(
      <ScrollReveal variant='wipe'>
        <p>Above the fold</p>
      </ScrollReveal>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(root).toHaveAttribute('data-done');
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });

  it('never sets the terminal marker on the reveal variant', () => {
    const result = renderScroll();
    const root = rootOf(result);
    intersectRoot(result);
    fireEvent.transitionEnd(root, { propertyName: 'clip-path' });
    expect(root).not.toHaveAttribute('data-done');
  });
});

/* ------------------------------------------------------------------ */
/* AC-06 — reduced motion                                              */
/* ------------------------------------------------------------------ */

describe('AC-06 reduced motion', () => {
  it('reveals a hidden element immediately when the preference toggles to reduce', () => {
    const result = renderScroll();
    const root = rootOf(result);
    expect(root).toHaveAttribute('data-state', 'hidden');

    firePreferenceChange(true);
    expect(root).toHaveAttribute('data-state', 'revealed');
  });

  it('does not re-hide when the preference changes back after reveal', () => {
    const root = rootOf(renderScroll());
    firePreferenceChange(true);
    expect(root).toHaveAttribute('data-state', 'revealed');

    firePreferenceChange(false);
    expect(root).toHaveAttribute('data-state', 'revealed');
  });

  it('does not re-hide after a scroll reveal when motion is later reduced', () => {
    const result = renderScroll();
    const root = rootOf(result);
    intersectRoot(result);
    expect(root).toHaveAttribute('data-state', 'revealed');

    stubMatchMedia(false);
    firePreferenceChange(true);
    expect(root).toHaveAttribute('data-state', 'revealed');
  });

  it('treats a live preference change to reduce as the immediate-reveal path for wipe', () => {
    mockComputedStyle(clipTiming);
    const result = renderScroll({ variant: 'wipe' });
    const root = rootOf(result);
    expect(root).toHaveAttribute('data-state', 'hidden');

    firePreferenceChange(true);
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(root).toHaveAttribute('data-done');
  });

  it('treats the reduced-motion mount reveal as final for wipe', () => {
    stubIntersectionObserver();
    stubMatchMedia(true);
    mockElementRect(1200);
    const { container } = render(
      <ScrollReveal variant='wipe'>
        <p>The wipe content</p>
      </ScrollReveal>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(root).toHaveAttribute('data-done');
    expect(FakeIntersectionObserver.instances).toHaveLength(0);
  });
});

/* ------------------------------------------------------------------ */
/* AC-07 — delay validation and inline custom property                 */
/* ------------------------------------------------------------------ */

describe('AC-07 delay validation', () => {
  it.each([
    [300, '300ms'],
    [0, '0ms']
  ])('applies the finite nonnegative delay %s as %s', (delay, expected) => {
    const { container } = render(
      <ScrollReveal delay={delay}>
        <p>Staggered</p>
      </ScrollReveal>
    );
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--eg-scroll-reveal-delay')).toBe(
      expected
    );
  });

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY, -1])(
    'ignores the invalid delay %s without changing anything else',
    (delay) => {
      const baseline = render(
        <ScrollReveal>
          <p>Staggered</p>
        </ScrollReveal>
      );
      const baselineRoot = baseline.container.firstElementChild as HTMLElement;
      const baselineClassName = baselineRoot.className;
      const baselineAttributes = [...baselineRoot.attributes].map((attribute) => attribute.name).sort();
      baseline.unmount();

      const { container } = render(
        <ScrollReveal delay={delay}>
          <p>Staggered</p>
        </ScrollReveal>
      );
      const root = container.firstElementChild as HTMLElement;
      expect(root.style.getPropertyValue('--eg-scroll-reveal-delay')).toBe('');
      expect(root.className).toBe(baselineClassName);
      expect([...root.attributes].map((attribute) => attribute.name).sort()).toEqual(baselineAttributes);
    }
  );

  it('keeps the internal delay property when the consumer style conflicts', () => {
    const { container } = render(
      <ScrollReveal delay={300} style={{ '--eg-scroll-reveal-delay': '999ms' } as CSSProperties}>
        <p>Staggered</p>
      </ScrollReveal>
    );
    expect((container.firstElementChild as HTMLElement).style.getPropertyValue('--eg-scroll-reveal-delay')).toBe(
      '300ms'
    );
  });
});

/* ------------------------------------------------------------------ */
/* AC-08 — focus reveal and lifecycle cleanup                          */
/* ------------------------------------------------------------------ */

describe('AC-08 focus reveal and lifecycle', () => {
  it('reveals immediately when focus enters a hidden subtree', () => {
    const result = renderScroll();
    const root = rootOf(result);
    expect(root).toHaveAttribute('data-state', 'hidden');

    fireEvent.focusIn(root.firstElementChild as HTMLElement);
    expect(root).toHaveAttribute('data-state', 'revealed');
  });

  it('finalizes the focus reveal immediately for wipe without waiting for the transition', () => {
    mockComputedStyle(clipTiming);
    const result = renderScroll({ variant: 'wipe' });
    const root = rootOf(result);
    expect(root).toHaveAttribute('data-state', 'hidden');

    fireEvent.focusIn(root.firstElementChild as HTMLElement);
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(root).toHaveAttribute('data-done');
  });

  it('still reveals when the observer unobserve call throws', () => {
    class EvilUnobserve {
      static instance: EvilUnobserve | undefined;
      constructor(public callback: IntersectionObserverCallback) {
        EvilUnobserve.instance = this;
      }
      observe(): void {
        // Observation succeeds; only unobserve is poisoned.
      }
      unobserve(): void {
        throw new Error('unobserve refused');
      }
      disconnect(): void {
        // Nothing tracked.
      }
      takeRecords(): IntersectionObserverEntry[] {
        return [];
      }
    }
    vi.stubGlobal('IntersectionObserver', EvilUnobserve as unknown as typeof IntersectionObserver);
    stubMatchMedia(false);
    mockElementRect(1200);
    const { container } = render(
      <ScrollReveal>
        <p>The reveal content</p>
      </ScrollReveal>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-state', 'hidden');

    const observer = EvilUnobserve.instance;
    act(() => {
      observer?.callback(
        [{ isIntersecting: true, target: root, time: 0 }] as unknown as IntersectionObserverEntry[],
        observer as unknown as IntersectionObserver
      );
    });
    expect(root).toHaveAttribute('data-state', 'revealed');
  });

  it('detaches focus and media listeners once revealed, not only on unmount', () => {
    const removeSpy = vi.spyOn(EventTarget.prototype, 'removeEventListener');
    const result = renderScroll();
    const root = rootOf(result);
    intersectRoot(result);
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(removeSpy).toHaveBeenCalledWith('focusin', expect.any(Function), true);
    expect(mediaControl.removed).toBe(true);
  });

  it('disconnects the observer on unmount', () => {
    const result = renderScroll();
    const disconnectSpy = vi.spyOn(FakeIntersectionObserver.prototype, 'disconnect');
    result.unmount();
    expect(disconnectSpy).toHaveBeenCalled();
  });

  it('stays idempotent under StrictMode double invocation', () => {
    stubIntersectionObserver();
    stubMatchMedia(false);
    mockElementRect(1200);
    const { container } = render(
      <StrictMode>
        <ScrollReveal>
          <p>Strict content</p>
        </ScrollReveal>
      </StrictMode>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root).toHaveAttribute('data-state', 'hidden');

    const observer = FakeIntersectionObserver.instances.at(-1) as FakeIntersectionObserver;
    act(() => {
      observer.intersect([root]);
    });
    expect(root).toHaveAttribute('data-state', 'revealed');
    expect(observer.observed.has(root)).toBe(false);
  });

  it('keeps one stable composed ref across re-renders', () => {
    stubIntersectionObserver();
    stubMatchMedia(false);
    mockElementRect(1200);
    const calls: Array<HTMLElement | null> = [];
    const { container } = render(
      <ScrollReveal
        ref={(node: HTMLElement | null) => {
          calls.push(node);
        }}
      >
        <p>Reveal content</p>
      </ScrollReveal>
    );
    const root = container.firstElementChild as HTMLElement;
    intersectRoot({ container } as unknown as RenderResult);
    expect(calls).toEqual([root]);
  });
});

/* ------------------------------------------------------------------ */
/* AC-09 — wrapper composition and reserved-marker protection          */
/* ------------------------------------------------------------------ */

describe('AC-09 wrapper composition', () => {
  it('renders the public root and preserves a stateful child untouched', () => {
    const { container } = render(
      <ScrollReveal className='p-4' style={{ color: 'red' }}>
        <span data-state='open' className='translate-x-2 transition-transform'>
          Child content
        </span>
      </ScrollReveal>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.tagName).toBe('DIV');
    expect(root.classList.contains('eg-scroll-reveal')).toBe(true);
    expect(root.classList.contains('p-4')).toBe(true);
    expect(root.style.color).toBe('red');

    const child = root.firstElementChild as HTMLElement;
    expect(child.tagName).toBe('SPAN');
    expect(child.getAttribute('data-state')).toBe('open');
    expect(child.className).toBe('translate-x-2 transition-transform');
    expect(child.classList.contains('eg-scroll-reveal')).toBe(false);
  });

  it('lets consumer classes keep layout precedence through cn()', () => {
    const { container } = render(
      <ScrollReveal className='box-content'>
        <p>Content</p>
      </ScrollReveal>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.classList.contains('box-content')).toBe(true);
    expect(root.classList.contains('box-border')).toBe(false);
  });

  it('protects internal markers, state and delay from consumer overrides', () => {
    const { container } = render(
      <ScrollReveal
        data-state='closed'
        data-reveal='x'
        data-wipe='y'
        data-done={true}
        data-foo='keep'
        style={{ '--eg-scroll-reveal-delay': '999ms' } as CSSProperties}
      >
        <p>Content</p>
      </ScrollReveal>
    );
    const root = container.firstElementChild as HTMLElement;
    expect(root.getAttribute('data-state')).toBe('revealed');
    expect(root.getAttribute('data-reveal')).toBe('');
    expect(root).not.toHaveAttribute('data-wipe');
    expect(root).not.toHaveAttribute('data-done');
    expect(root.style.getPropertyValue('--eg-scroll-reveal-delay')).toBe('');
    expect(root.getAttribute('data-foo')).toBe('keep');
  });

  it('forwards the public ref to the wrapper element', () => {
    const ref = createRef<HTMLDivElement>();
    const { container } = render(
      <ScrollReveal ref={ref}>
        <p>Content</p>
      </ScrollReveal>
    );
    expect(ref.current).toBe(container.firstElementChild);
  });
});

/* ------------------------------------------------------------------ */
/* AC-10 — restricted asChild composition through the public Slot      */
/* ------------------------------------------------------------------ */

describe('AC-10 asChild composition', () => {
  it('merges onto the native child without rendering a wrapper', () => {
    const { container } = render(
      <ScrollReveal asChild={true} className='p-4'>
        <li data-foo='bar' className='p-2'>
          Item content
        </li>
      </ScrollReveal>
    );
    expect(container.querySelector('div.eg-scroll-reveal')).toBeNull();
    const item = container.firstElementChild as HTMLElement;
    expect(item.tagName).toBe('LI');
    expect(item.classList.contains('eg-scroll-reveal')).toBe(true);
    expect(item.className).toContain('p-4');
    expect(item.className.indexOf('p-2')).toBeGreaterThan(item.className.indexOf('p-4'));
    expect(item.getAttribute('data-foo')).toBe('bar');
    expect(item).toHaveAttribute('data-state');
    expect(item).toHaveAttribute('data-reveal');
  });

  it('composes the forwarded ref, the internal observation ref and the child ref', () => {
    const externalRef = createRef<HTMLLIElement>();
    const childRef = createRef<HTMLLIElement>();
    const { container } = render(
      <ScrollReveal asChild={true} ref={externalRef}>
        <li ref={childRef}>Item content</li>
      </ScrollReveal>
    );
    const item = container.firstElementChild as HTMLElement;
    expect(externalRef.current).toBe(item);
    expect(childRef.current).toBe(item);
  });

  it('composes event handlers so both the consumer and child handlers run', () => {
    const childClick = vi.fn();
    const consumerClick = vi.fn();
    const { getByText } = render(
      <ScrollReveal asChild={true} onClick={consumerClick}>
        <button type='button' onClick={childClick}>
          Click me
        </button>
      </ScrollReveal>
    );
    fireEvent.click(getByText('Click me'));
    expect(childClick).toHaveBeenCalledTimes(1);
    expect(consumerClick).toHaveBeenCalledTimes(1);
  });

  it('merges style with the child winning conflicts and the delay property preserved', () => {
    const { container } = render(
      <ScrollReveal asChild={true} delay={300} style={{ color: 'red' }}>
        <li style={{ color: 'blue', margin: '2px' }}>Item content</li>
      </ScrollReveal>
    );
    const item = container.firstElementChild as HTMLElement;
    expect(item.style.color).toBe('blue');
    expect(item.style.margin).toBe('2px');
    expect(item.style.getPropertyValue('--eg-scroll-reveal-delay')).toBe('300ms');
  });

  it('throws on multiple children', () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() =>
      render(
        <ScrollReveal asChild={true}>
          <span>First</span>
          <span>Second</span>
        </ScrollReveal>
      )
    ).toThrow();
    errorSpy.mockRestore();
  });

  it('warns in development when the child is not a native element', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    function CustomChild() {
      return <span>Component child</span>;
    }
    render(
      <ScrollReveal asChild={true}>
        <CustomChild />
      </ScrollReveal>
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(String(warnSpy.mock.calls[0]?.[0])).toContain('native');
    warnSpy.mockRestore();
  });

  it('warns in development when the child already carries a conflicting state marker', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <ScrollReveal asChild={true}>
        <li data-state='open'>Item content</li>
      </ScrollReveal>
    );
    expect(warnSpy).toHaveBeenCalledTimes(1);
    warnSpy.mockRestore();
  });
});

/* ------------------------------------------------------------------ */
/* AC-11 — accessibility transparency                                  */
/* ------------------------------------------------------------------ */

describe('AC-11 accessibility transparency', () => {
  it('adds no role, ARIA attribute, or display/visibility hiding in any state', () => {
    const result = renderScroll();
    const root = rootOf(result);

    const assertTransparent = (element: HTMLElement) => {
      expect(element.getAttribute('role')).toBeNull();
      expect(element).not.toHaveAttribute('aria-hidden');
      expect(element).not.toHaveAttribute('aria-label');
      expect(element).not.toHaveAttribute('aria-live');
      expect(element).not.toHaveAttribute('tabindex');
      expect(element.style.display).toBe('');
      expect(element.style.visibility).toBe('');
      expect(/display|visibility|invisible/.test(element.className)).toBe(false);
    };

    assertTransparent(root);
    expect(root).toHaveAttribute('data-state', 'hidden');
    intersectRoot(result);
    assertTransparent(root);
    expect(root).toHaveAttribute('data-state', 'revealed');
  });

  it('keeps the wipe terminal state out of the accessibility tree untouched', () => {
    const result = renderWipeRevealed();
    const root = rootOf(result);
    fireEvent.transitionEnd(root, { propertyName: 'clip-path' });
    expect(root).not.toHaveAttribute('aria-hidden');
    expect(root.getAttribute('role')).toBeNull();
    expect(root).toHaveAttribute('data-done');
  });
});

it.each([false, true])('reassigns a changed forwarded ref and cleans the previous ref (asChild=%s)', (asChild) => {
  stubIntersectionObserver();
  stubMatchMedia(false);
  mockElementRect(1200);
  const first = createRef<HTMLElement>();
  const second = createRef<HTMLElement>();
  const view = render(
    <ScrollReveal asChild={asChild} ref={first}>
      <div>Content</div>
    </ScrollReveal>
  );
  const node = view.container.firstElementChild;
  expect(first.current).toBe(node);
  view.rerender(
    <ScrollReveal asChild={asChild} ref={second}>
      <div>Content</div>
    </ScrollReveal>
  );
  expect(first.current).toBeNull();
  expect(second.current).toBe(node);
  view.unmount();
  expect(second.current).toBeNull();
});

it.each([false, true])('preserves React 19 callback-ref cleanup on replacement and unmount (asChild=%s)', (asChild) => {
  stubIntersectionObserver();
  stubMatchMedia(false);
  mockElementRect(1200);
  const firstCleanup = vi.fn();
  const secondCleanup = vi.fn();
  const first = (node: HTMLElement | null) => (node ? firstCleanup : undefined);
  const second = (node: HTMLElement | null) => (node ? secondCleanup : undefined);
  const view = render(
    <ScrollReveal asChild={asChild} ref={first}>
      <div>Content</div>
    </ScrollReveal>
  );
  view.rerender(
    <ScrollReveal asChild={asChild} ref={second}>
      <div>Content</div>
    </ScrollReveal>
  );
  expect(firstCleanup).toHaveBeenCalledTimes(1);
  view.unmount();
  expect(secondCleanup).toHaveBeenCalledTimes(1);
});
