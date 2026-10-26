import { act, render, renderHook, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Countdown } from './Countdown';
import type { CountdownProps, CountdownUnits } from './types';
import { useCountdown } from './useCountdown';

// 2030-01-01T00:00:00.000Z, a fixed fake wall clock so every case is deterministic.
const NOW = Date.UTC(2030, 0, 1);
// Date.UTC maps years 0–99 to 1900–1999, so bounds use setUTCFullYear.
const utcYearStart = (year: number) => new Date(0).setUTCFullYear(year, 0, 1);
const base = { deadline: NOW + 90_061_000, deadlineText: 'Jan 2, 2030, 01:01:01 UTC' };

const timer = (name = 'Next event in') => screen.getByRole('timer', { name });
const values = () => [...document.querySelectorAll('.eg-countdown__value')].map((node) => node.textContent);
const row = () => document.querySelector('.eg-countdown__row');
const visibilityListeners = (spy: { mock: { calls: unknown[][] } }) =>
  spy.mock.calls.filter(([event]) => event === 'visibilitychange').length;
const setVisibility = (state: DocumentVisibilityState) => {
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => state });
  document.dispatchEvent(new Event('visibilitychange'));
};

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout', 'Date'] });
  vi.setSystemTime(NOW);
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' });
});

describe('useCountdown derivation', () => {
  it('renders deterministic initializing defaults before any client sample', () => {
    const { result } = renderHook(() => useCountdown(base), {
      // Inspect the first render only: the result object is captured before effects run.
      wrapper: ({ children }) => children
    });
    expect(result.current.rootProps.role).toBe('timer');
    expect(result.current.rootProps['aria-live']).toBe('off');
    expect(result.current.labelProps.children).toBe('Next event in');
    expect(result.current.time?.dateTime).toBe('2030-01-02T01:01:01.000Z');
  });

  it.each([
    ['NaN', Number.NaN],
    ['infinity', Number.POSITIVE_INFINITY],
    ['fraction', NOW + 0.5],
    ['unsafe integer', 2 ** 53],
    ['beyond Date range', 8.64e15 + 1],
    ['year 0', utcYearStart(1) - 1],
    ['year 10000', utcYearStart(10000)],
    ['string', '2030-01-02T00:00:00Z'],
    ['Date object', new Date(NOW + 1000)]
  ])('treats a %s deadline as unavailable without resources or callback', (_name, deadline) => {
    const onExpire = vi.fn();
    const add = vi.spyOn(document, 'addEventListener');
    render(<Countdown {...base} deadline={deadline as number} onExpire={onExpire} />);
    expect(timer()).toHaveAttribute('data-state', 'unavailable');
    expect(screen.getByText('Time unavailable')).toBeVisible();
    expect(row()).toBeNull();
    expect(document.querySelector('time')).toBeNull();
    expect(visibilityListeners(add)).toBe(0);
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(10_000));
    expect(onExpire).not.toHaveBeenCalled();
  });

  it('accepts epoch zero, negative past instants and the year bounds', () => {
    for (const deadline of [0, -0, -86_400_000, utcYearStart(1), utcYearStart(10000) - 1]) {
      const onExpire = vi.fn();
      const { unmount } = render(<Countdown {...base} deadline={deadline} onExpire={onExpire} />);
      const state = timer().getAttribute('data-state');
      expect(['expired', 'running']).toContain(state);
      expect(document.querySelector('time')).not.toBeNull();
      unmount();
    }
    const onExpire = vi.fn();
    render(<Countdown {...base} deadline={-0} onExpire={onExpire} />);
    expect(onExpire).toHaveBeenCalledWith(0);
    expect(Object.is(onExpire.mock.calls[0]?.[0], -0)).toBe(false);
    expect(document.querySelector('time')).toHaveAttribute('datetime', '1970-01-01T00:00:00.000Z');
  });
});

describe('Countdown clock sampling', () => {
  it('derives ceil-based padded fields after the first client sample', () => {
    render(<Countdown {...base} />);
    expect(timer()).toHaveAttribute('data-state', 'running');
    expect(values()).toEqual(['1', '01', '01', '01']);
    expect(row()?.textContent?.replace(/\s+/g, ' ').trim()).toBe('1 days 01 hours 01 minutes 01 seconds');
  });

  it.each([1, 999, 1000])('shows one second for %ims remaining, never a premature zero', (remaining) => {
    render(<Countdown {...base} deadline={NOW + remaining} />);
    expect(values()).toEqual(['0', '00', '00', '01']);
    expect(timer()).toHaveAttribute('data-state', 'running');
  });

  it('expires exactly at the deadline and keeps long durations untruncated', () => {
    const { rerender } = render(<Countdown {...base} deadline={NOW} />);
    expect(timer()).toHaveAttribute('data-state', 'expired');
    expect(values()).toEqual(['0', '00', '00', '00']);
    expect(screen.getByText('Time reached')).toBeVisible();
    rerender(<Countdown {...base} deadline={NOW + 123 * 86_400_000 + 3_600_000} />);
    expect(values()).toEqual(['123', '01', '00', '00']);
  });

  it('recomputes from the wall clock after delayed ticks without replaying seconds', () => {
    const onExpire = vi.fn();
    render(<Countdown {...base} deadline={NOW + 5000} onExpire={onExpire} />);
    expect(values()).toEqual(['0', '00', '00', '05']);
    act(() => vi.advanceTimersByTime(1000));
    expect(values()).toEqual(['0', '00', '00', '04']);
    // A throttled tab: the wall clock jumps past the deadline while the timeout is pending.
    vi.setSystemTime(NOW + 60_000);
    act(() => vi.advanceTimersByTime(1000));
    expect(timer()).toHaveAttribute('data-state', 'expired');
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('runs at most one timeout and one visibility listener, then releases both at expiry', () => {
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    render(<Countdown {...base} deadline={NOW + 2500} />);
    expect(vi.getTimerCount()).toBe(1);
    expect(visibilityListeners(add)).toBe(1);
    act(() => vi.advanceTimersByTime(1000));
    expect(vi.getTimerCount()).toBe(1);
    act(() => vi.advanceTimersByTime(2000));
    expect(timer()).toHaveAttribute('data-state', 'expired');
    expect(vi.getTimerCount()).toBe(0);
    expect(visibilityListeners(add)).toBe(1);
    expect(visibilityListeners(remove)).toBe(1);
  });

  it('catches up immediately when the document becomes visible again', () => {
    render(<Countdown {...base} deadline={NOW + 10_000} />);
    vi.setSystemTime(NOW + 7_200);
    act(() => setVisibility('hidden'));
    expect(values()).toEqual(['0', '00', '00', '10']);
    act(() => setVisibility('visible'));
    expect(values()).toEqual(['0', '00', '00', '03']);
    expect(vi.getTimerCount()).toBe(1);
  });

  it('lets a pre-expiry clock rollback increase the remainder but keeps an expired episode latched', () => {
    const onExpire = vi.fn();
    render(<Countdown {...base} deadline={NOW + 3000} onExpire={onExpire} />);
    vi.setSystemTime(NOW - 10_000);
    act(() => vi.advanceTimersByTime(1000));
    // The wall clock now reads NOW - 9000: 12 seconds remain, more than before the rollback.
    expect(values()).toEqual(['0', '00', '00', '12']);
    vi.setSystemTime(NOW + 3000);
    act(() => vi.advanceTimersByTime(1000));
    expect(timer()).toHaveAttribute('data-state', 'expired');
    vi.setSystemTime(NOW - 60_000);
    act(() => setVisibility('visible'));
    act(() => vi.advanceTimersByTime(5000));
    expect(timer()).toHaveAttribute('data-state', 'expired');
    expect(values()).toEqual(['0', '00', '00', '00']);
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('clears its timeout and listener on unmount so obsolete work never updates or notifies', () => {
    const onExpire = vi.fn();
    const remove = vi.spyOn(document, 'removeEventListener');
    const { unmount } = render(<Countdown {...base} deadline={NOW + 1500} onExpire={onExpire} />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
    expect(visibilityListeners(remove)).toBe(1);
    vi.setSystemTime(NOW + 5000);
    act(() => setVisibility('visible'));
    act(() => vi.advanceTimersByTime(5000));
    expect(onExpire).not.toHaveBeenCalled();
  });
});

describe('Countdown expiration episodes', () => {
  it('notifies once for a past deadline at mount and keeps zero plus the expired text', () => {
    const onExpire = vi.fn();
    render(<Countdown {...base} deadline={NOW - 1} onExpire={onExpire} />);
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(onExpire).toHaveBeenCalledWith(NOW - 1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('uses the latest handler without rearming on rerenders or cosmetic changes', () => {
    const first = vi.fn();
    const second = vi.fn();
    const { rerender } = render(<Countdown {...base} deadline={NOW + 1000} onExpire={first} />);
    rerender(
      <Countdown {...base} deadline={NOW + 1000} onExpire={second} size='sm' tone='canvas' label='Doors open in' />
    );
    act(() => vi.advanceTimersByTime(1000));
    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledTimes(1);
    rerender(<Countdown {...base} deadline={NOW + 1000} onExpire={second} expiredText='Started' />);
    act(() => setVisibility('visible'));
    expect(second).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Started')).toBeVisible();
  });

  it('does not replay a consumed expiration when a handler is added later', () => {
    const late = vi.fn();
    const { rerender } = render(<Countdown {...base} deadline={NOW - 5} />);
    rerender(<Countdown {...base} deadline={NOW - 5} onExpire={late} />);
    act(() => vi.advanceTimersByTime(2000));
    expect(late).not.toHaveBeenCalled();
    expect(timer()).toHaveAttribute('data-state', 'expired');
  });

  it('rearms for A→B→A and for an intervening invalid deadline', () => {
    const onExpire = vi.fn();
    const a = NOW - 10;
    const b = NOW - 20;
    const { rerender } = render(<Countdown {...base} deadline={a} onExpire={onExpire} />);
    rerender(<Countdown {...base} deadline={b} onExpire={onExpire} />);
    rerender(<Countdown {...base} deadline={a} onExpire={onExpire} />);
    expect(onExpire.mock.calls).toEqual([[a], [b], [a]]);
    rerender(<Countdown {...base} deadline={Number.NaN} onExpire={onExpire} />);
    expect(timer()).toHaveAttribute('data-state', 'unavailable');
    rerender(<Countdown {...base} deadline={a} onExpire={onExpire} />);
    expect(onExpire.mock.calls).toEqual([[a], [b], [a], [a]]);
  });

  it('never shows the previous numbers under a replaced deadline', () => {
    const seen: (string | null)[] = [];
    const Probe = (props: CountdownProps) => {
      const countdown = useCountdown(props);
      seen.push(`${countdown.rootProps['data-state']}:${countdown.time?.dateTime ?? ''}`);
      return null;
    };
    const { rerender } = render(<Probe {...base} />);
    seen.length = 0;
    rerender(<Probe {...base} deadline={NOW + 5000} />);
    expect(seen[0]).toBe('initializing:2030-01-01T00:00:05.000Z');
    expect(seen.at(-1)).toBe('running:2030-01-01T00:00:05.000Z');
  });

  it('keeps one scheduler and one notification under Strict Mode effect replay', () => {
    const onExpire = vi.fn();
    const add = vi.spyOn(document, 'addEventListener');
    const remove = vi.spyOn(document, 'removeEventListener');
    render(
      <StrictMode>
        <Countdown {...base} deadline={NOW + 2000} onExpire={onExpire} />
      </StrictMode>
    );
    expect(vi.getTimerCount()).toBe(1);
    expect(visibilityListeners(add) - visibilityListeners(remove)).toBe(1);
    act(() => vi.advanceTimersByTime(2000));
    expect(onExpire).toHaveBeenCalledTimes(1);
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not renotify a past deadline when Strict Mode replays the mount effect', () => {
    const onExpire = vi.fn();
    render(
      <StrictMode>
        <Countdown {...base} deadline={NOW - 1} onExpire={onExpire} />
      </StrictMode>
    );
    expect(onExpire).toHaveBeenCalledTimes(1);
  });

  it('notifies again after a true remount, as a new instance', () => {
    const onExpire = vi.fn();
    const { unmount } = render(<Countdown {...base} deadline={NOW - 1} onExpire={onExpire} />);
    unmount();
    render(<Countdown {...base} deadline={NOW - 1} onExpire={onExpire} />);
    expect(onExpire).toHaveBeenCalledTimes(2);
  });
});

describe('Countdown server rendering and hydration', () => {
  it('renders the initializing placeholder on the server without reading the clock', () => {
    const now = vi.spyOn(Date, 'now');
    const html = renderToString(<Countdown {...base} id='launch' />);
    expect(now).not.toHaveBeenCalled();
    expect(html).toMatch(/^<div id="launch" role="timer" aria-labelledby="[^"]+" aria-live="off"/);
    expect(html).toMatch(/class="eg-countdown min-w-0 text-inherit"/);
    expect(html).toContain('data-state="initializing"');
    expect(html).toContain('aria-live="off"');
    expect(html).toContain('Calculating time remaining');
    expect(html).toMatch(/datetime="2030-01-02T01:01:01.000Z"/i);
    expect(html).not.toContain('eg-countdown__row');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('renders the same unavailable markup on the server for an invalid deadline', () => {
    const html = renderToString(<Countdown {...base} deadline={Number.NaN} />);
    expect(html).toContain('data-state="unavailable"');
    expect(html).toContain('Time unavailable');
    expect(html).not.toContain('<time');
  });

  it('hydrates without mismatch after a delayed client start, then samples the clock', () => {
    const html = renderToString(<Countdown {...base} deadline={NOW + 4000} />);
    const host = document.createElement('div');
    // Parse the trusted server output from this test instead of assigning markup directly.
    host.append(...new DOMParser().parseFromString(html, 'text/html').body.childNodes);
    document.body.append(host);
    // The client hydrates later than the server rendered: still no mismatch.
    vi.setSystemTime(NOW + 2500);
    const onRecoverableError = vi.fn();
    const consoleError = vi.spyOn(console, 'error');
    let root: ReturnType<typeof hydrateRoot> | undefined;
    act(() => {
      root = hydrateRoot(host, <Countdown {...base} deadline={NOW + 4000} />, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(host.querySelector('.eg-countdown')).toHaveAttribute('data-state', 'running');
    expect(values()).toEqual(['0', '00', '00', '02']);
    act(() => root?.unmount());
    host.remove();
  });
});

describe('Countdown accessibility and text fallbacks', () => {
  it('names the quiet timer and describes it with the deadline and state message', () => {
    render(<Countdown {...base} deadline={NOW - 1} aria-describedby='hint hint' />);
    const node = timer();
    expect(node).toHaveAttribute('aria-live', 'off');
    const time = document.querySelector('time');
    const status = screen.getByText('Time reached');
    expect(node.getAttribute('aria-describedby')?.split(' ')).toEqual(['hint', time?.id, status.id]);
    expect(time).toHaveTextContent(base.deadlineText);
    expect(row()).not.toHaveAttribute('aria-hidden');
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('describes a running timer with the deadline only and an invalid one with its message only', () => {
    const { rerender } = render(<Countdown {...base} />);
    expect(timer().getAttribute('aria-describedby')).toBe(document.querySelector('time')?.id);
    rerender(<Countdown {...base} deadline={Number.NaN} />);
    expect(timer().getAttribute('aria-describedby')).toBe(screen.getByText('Time unavailable').id);
  });

  it('generates unique relationship ids per instance', () => {
    render(
      <>
        <Countdown {...base} label='First' />
        <Countdown {...base} label='Second' />
      </>
    );
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(timer('First')).not.toBe(timer('Second'));
  });

  it('is a passive readout without a tab stop', async () => {
    // Keyboard simulation needs real timers; passivity does not depend on the clock.
    vi.useRealTimers();
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Countdown {...base} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(timer()).not.toHaveAttribute('tabindex');
  });

  it('protects timer semantics from untyped native overrides and keeps compatible native props', () => {
    const unsafe = {
      role: 'alert',
      'aria-label': 'Override',
      'aria-labelledby': 'elsewhere',
      'aria-live': 'assertive',
      'aria-atomic': true,
      'aria-hidden': true,
      tabIndex: 0,
      accessKey: 'c',
      contentEditable: true,
      children: 'Injected',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' },
      'data-state': 'forced'
    } as unknown as Partial<CountdownProps>;
    render(<Countdown {...base} {...unsafe} id='countdown' dir='ltr' lang='en' data-testing='kept' title='Launch' />);
    const node = timer();
    expect(node).toHaveAttribute('role', 'timer');
    expect(node).toHaveAttribute('aria-live', 'off');
    expect(node).toHaveAttribute('data-state', 'running');
    for (const attribute of ['aria-label', 'aria-atomic', 'aria-hidden', 'tabindex', 'accesskey', 'contenteditable']) {
      expect(node, attribute).not.toHaveAttribute(attribute);
    }
    expect(node.getAttribute('aria-labelledby')).toBe(screen.getByText('Next event in').id);
    expect(node).not.toHaveTextContent('Injected');
    expect(node).toHaveAttribute('id', 'countdown');
    expect(node).toHaveAttribute('dir', 'ltr');
    expect(node).toHaveAttribute('data-testing', 'kept');
  });

  it('renders localized text and units as plain text, never HTML', () => {
    const units: CountdownUnits = ['días', 'horas', 'min', 's'];
    render(
      <Countdown
        {...base}
        label='<b>Directo en</b>'
        units={units}
        deadlineText='2 ene 2030, 01:01 UTC'
        initializingText='Calculando'
      />
    );
    expect(timer('<b>Directo en</b>')).toBeInTheDocument();
    expect(document.querySelector('b')).toBeNull();
    expect([...document.querySelectorAll('.eg-countdown__name')].map((node) => node.textContent)).toEqual(units);
  });

  it('warns and falls back for blank text, invalid units and a blank deadline text', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(
      <Countdown
        deadline={NOW - 1}
        deadlineText=' '
        label=''
        units={['d', '', 'm', 's'] as CountdownUnits}
        expiredText='  '
      />
    );
    expect(timer('Next event in')).toBeInTheDocument();
    expect(document.querySelector('time')).toHaveTextContent('2029-12-31T23:59:59.999Z');
    expect([...document.querySelectorAll('.eg-countdown__name')].map((node) => node.textContent)).toEqual([
      'days',
      'hours',
      'minutes',
      'seconds'
    ]);
    expect(screen.getByText('Time reached')).toBeVisible();
    const messages = warn.mock.calls.map(([message]) => String(message)).join('\n');
    for (const prop of ['label', 'units', 'expiredText', 'deadlineText']) {
      expect(messages).toContain(prop);
    }
  });

  it('falls back from an untyped short units tuple', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Countdown {...base} units={['d', 'h'] as unknown as CountdownUnits} />);
    expect([...document.querySelectorAll('.eg-countdown__name')].map((node) => node.textContent)).toEqual([
      'days',
      'hours',
      'minutes',
      'seconds'
    ]);
  });
});

describe('Countdown appearance contract', () => {
  it('keeps the public markers and composes prop-owned recipes per part', () => {
    render(<Countdown {...base} className='mt-4 mt-6 consumer-layout' />);
    const node = timer();
    expect(node).toHaveClass('eg-countdown', 'min-w-0', 'text-inherit', 'mt-6', 'consumer-layout');
    expect(node).not.toHaveClass('mt-4');
    expect(screen.getByText('Next event in')).toHaveClass('eg-countdown__label', 'text-label-eyebrow', 'text-inherit');
    expect(row()).toHaveClass('eg-countdown__row', 'gap-x-countdown-column');
    const value = document.querySelector('.eg-countdown__value');
    expect(value).toHaveClass('text-countdown-md', 'text-inherit', 'tabular-nums', 'min-w-countdown-unit');
    expect(document.querySelector('.eg-countdown__unit')).toHaveClass('flex', 'flex-col');
    expect(document.querySelector('.eg-countdown__name')).toHaveClass('not-italic', 'text-label-eyebrow');
    expect(node.className).not.toMatch(/--sm|--on-dark|is-/);
  });

  it('switches the digit scale and canvas tone without legacy modifiers', () => {
    render(<Countdown {...base} deadline={NOW - 1} size='sm' tone='canvas' />);
    const node = timer();
    expect(node).toHaveClass('text-fg-default');
    expect(node).not.toHaveClass('eg-countdown--sm', 'eg-countdown--on-dark');
    const value = document.querySelector('.eg-countdown__value');
    expect(value).toHaveClass('text-countdown-sm', 'text-fg-default');
    expect(value).not.toHaveClass('text-countdown-md');
    expect(screen.getByText('Next event in')).toHaveClass('text-fg-secondary');
    expect(document.querySelector('time')).toHaveClass('text-fg-secondary');
    expect(screen.getByText('Time reached')).toHaveClass('text-fg-secondary');
  });
});
