import { act, fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Button, Icon, type ToastApi, ToastProvider, type ToastProviderProps, useToast } from '../../index';
import { toastStore } from './toastStore';
import { toastIconName } from './useToast';

const pointerCapture = ['setPointerCapture', 'releasePointerCapture', 'hasPointerCapture'] as const;

beforeEach(() => {
  // Radix checks capture even on ordinary clicks; jsdom has no implementation.
  const captured = new Set<number>();
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: (id: number) => captured.add(id),
    releasePointerCapture: (id: number) => captured.delete(id),
    hasPointerCapture: (id: number) => captured.has(id)
  });
  toastStore.clear();
  toastStore.configure({ mounted: false });
});

afterEach(() => {
  for (const method of pointerCapture) {
    Reflect.deleteProperty(HTMLElement.prototype, method);
  }
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

let api: ToastApi | undefined;

function Probe(): null {
  api = useToast();
  return null;
}

function mount(providerProps: Partial<ToastProviderProps> = {}, children?: React.ReactNode) {
  return render(
    <ToastProvider {...providerProps}>
      <Probe />
      {children}
    </ToastProvider>
  );
}

function toast() {
  return screen.getByRole('listitem');
}

function viewport() {
  return within(screen.getByRole('region', { name: 'Notifications (F8)' })).getByRole('list');
}

function titles() {
  return screen.queryAllByRole('listitem').map((item) => item.querySelector('strong')?.textContent);
}

describe('Toast public contract', () => {
  it('renders a store-driven toast with bold title and description in the portalled list', () => {
    const { container } = mount(undefined, <main>Application</main>);
    act(() => api?.show({ title: 'Post published', description: 'Ready to share.' }));
    const root = toast();
    expect(container.querySelector('main')).toHaveTextContent('Application');
    expect(root.parentElement).toBe(viewport());
    expect(root).toHaveClass('eg-toast', 'eg-surface', 'flex-wrap');
    expect(root).not.toHaveClass('eg-notice');
    expect(root.querySelector('[class*="eg-notice"]')).toBeNull();
    expect(root).toHaveAttribute('data-state', 'open');
    expect(root).toHaveAttribute('data-tone', 'neutral');
    expect(within(root).getByText('Post published').tagName).toBe('STRONG');
    expect(within(root).getByText('Ready to share.')).toBeVisible();
    expect(root).not.toHaveAttribute('aria-live');
    expect(root.querySelector('[role="status"], [role="alert"]')).toBeNull();
    expect(root).toHaveClass('shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]');
    expect(root).toHaveClass('motion-reduce:transition-none');
    expect(document.activeElement).toBe(document.body);
  });

  it('returns a stable string id and updates an already-visible caller id in place', () => {
    mount();
    let id = '';
    act(() => {
      id = api?.show({ title: 'Link copied' }) ?? '';
    });
    expect(typeof id).toBe('string');
    expect(id).not.toBe('');
    const first = toast().id;
    act(() => api?.show({ id, title: 'Renamed' }));
    expect(titles()).toEqual(['Renamed']);
    expect(toast().id).toBe(first);
    act(() => api?.update(id, { description: 'Updated in place.' }));
    expect(within(toast()).getByText('Updated in place.')).toBeVisible();
  });

  it.each(['neutral', 'info', 'success', 'warning', 'danger'] as const)(
    'maps the %s helper to its tone, urgency and decorative glyph',
    (tone) => {
      mount();
      const calls = {
        neutral: () => api?.show({ title: 'Current state' }),
        info: () => api?.info('Current state'),
        success: () => api?.success('Current state'),
        warning: () => api?.warning('Current state'),
        danger: () => api?.error('Current state')
      } as const;
      act(calls[tone]);
      expect(toast()).toHaveAttribute('data-tone', tone);
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', tone === 'danger' ? 'assertive' : 'polite');
      expect(toast().querySelector('svg')?.parentElement).toHaveAttribute('aria-hidden', 'true');
    }
  );

  it('keeps the same glyph derivation used by the mounted records', () => {
    expect(toastIconName('neutral')).toBe('bell');
    expect(toastIconName('info')).toBe('bell');
    expect(toastIconName('success')).toBe('check');
    expect(toastIconName('warning')).toBe('alert');
    expect(toastIconName('danger')).toBe('alert');
  });

  it('renders a decorative spinner for the loading tone and never auto-dismisses it', () => {
    vi.useFakeTimers();
    mount();
    act(() => api?.loading('Uploading file…'));
    expect(toast()).toHaveAttribute('data-tone', 'loading');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    expect(toast().querySelector('.eg-spinner')).not.toBeNull();
    act(() => vi.advanceTimersByTime(60000));
    expect(titles()).toEqual(['Uploading file…']);
  });

  it('lets a consumer icon replace the default glyph without a second announcement', () => {
    mount();
    act(() => api?.show({ title: 'Link copied', icon: <Icon name='copy' /> }));
    // One replaced glyph plus the unchanged close icon; never a spinner.
    expect(toast().querySelectorAll('svg')).toHaveLength(2);
    expect(toast().querySelector('.eg-spinner')).toBeNull();
  });

  it('localizes region, announcement prefix and close name', async () => {
    mount({ label: 'Messages ({hotkey})', announcementLabel: 'Message' }, undefined);
    act(() => api?.show({ title: 'Link copied', dismissLabel: 'Close message' }));
    expect(screen.getByRole('region', { name: 'Messages (F8)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close message' })).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Message Link copied'));
  });

  it('uses the unchanged ghost/lg IconButton close and removes the record on dismissal', async () => {
    const user = userEvent.setup();
    mount();
    act(() => api?.show({ title: 'Link copied' }));
    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close).toHaveClass('eg-icon-btn', 'size-12', 'bg-transparent');
    expect(close).not.toHaveAttribute('aria-label');
    await user.click(close);
    expect(screen.queryByRole('listitem')).toBeNull();
    expect(viewport()).toHaveFocus();
  });

  it('runs a Button md action, supports onAction and closes with native viewport focus (A1)', async () => {
    const user = userEvent.setup();
    const onAction = vi.fn();
    mount();
    act(() =>
      api?.show({
        title: 'Post published',
        actions: (
          <Button size='md' onClick={() => undefined}>
            Undo
          </Button>
        ),
        actionAltText: 'Undo from post history',
        onAction
      })
    );
    const button = screen.getByRole('button', { name: 'Undo' });
    expect(button).toHaveClass('eg-btn', 'min-h-12');
    expect(button).toHaveAttribute('data-radix-toast-announce-alt', 'Undo from post history');
    await user.click(button);
    expect(onAction).toHaveBeenCalledOnce();
    expect(screen.queryByRole('listitem')).toBeNull();
    expect(viewport()).toHaveFocus();
  });

  it('lets an action prevent dismissal using native event cancellation', async () => {
    const user = userEvent.setup();
    mount();
    act(() =>
      api?.show({
        title: 'Could not publish',
        actions: <Button onClick={(event) => event.preventDefault()}>Retry</Button>,
        actionAltText: 'Retry from the editor'
      })
    );
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(toast()).toBeInTheDocument();
  });

  it('F8 focuses the viewport; Tab reaches controls; Escape closes with viewport focus (A1)', async () => {
    const user = userEvent.setup();
    mount();
    act(() => api?.show({ title: 'Link copied' }));
    // Radix matches KeyboardEvent.code for F8.
    fireEvent.keyDown(document, { key: 'F8', code: 'F8' });
    expect(viewport()).toHaveFocus();
    await user.tab();
    expect(toast()).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('listitem')).toBeNull();
    expect(viewport()).toHaveFocus();
  });

  it('forwards onEscapeKeyDown and respects its cancellation', async () => {
    const user = userEvent.setup();
    const escapeHandler = vi.fn((event: KeyboardEvent) => event.preventDefault());
    mount();
    act(() => api?.show({ title: 'Link copied', onEscapeKeyDown: escapeHandler }));
    act(() => toast().focus());
    await user.keyboard('{Escape}');
    expect(escapeHandler).toHaveBeenCalledOnce();
    expect(toast()).toBeInTheDocument();
  });

  it('applies the provider defaultDuration and per-call duration overrides', () => {
    vi.useFakeTimers();
    mount({ defaultDuration: 1000 });
    act(() => api?.show({ title: 'Provider default' }));
    act(() => api?.show({ title: 'Call override', duration: 200 }));
    act(() => vi.advanceTimersByTime(200));
    expect(titles()).toEqual(['Provider default']);
    act(() => vi.advanceTimersByTime(800));
    expect(screen.queryByRole('listitem')).toBeNull();
  });

  it('auto-dismisses after the default 5000 ms without stealing outside focus', () => {
    vi.useFakeTimers();
    mount(undefined, <button type='button'>Editor</button>);
    act(() => screen.getByRole('button', { name: 'Editor' }).focus());
    act(() => api?.show({ title: 'Link copied' }));
    act(() => vi.advanceTimersByTime(4999));
    expect(titles()).toEqual(['Link copied']);
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('listitem')).toBeNull();
    expect(screen.getByRole('button', { name: 'Editor' })).toHaveFocus();
  });

  it('never auto-dismisses with Infinity', () => {
    vi.useFakeTimers();
    mount();
    act(() => api?.show({ title: 'Action required', duration: Infinity }));
    act(() => vi.advanceTimersByTime(60000));
    expect(titles()).toEqual(['Action required']);
  });

  it('keeps Radix zero-duration fallback instead of introducing numeric validation', () => {
    vi.useFakeTimers();
    mount();
    act(() => api?.show({ title: 'Link copied', duration: 0 }));
    act(() => vi.advanceTimersByTime(4999));
    expect(titles()).toEqual(['Link copied']);
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('listitem')).toBeNull();
  });

  it('does not pause on window blur by default (OQ6) and pauses when opted in', () => {
    vi.useFakeTimers();
    const { unmount } = mount();
    act(() => api?.show({ title: 'Default keeps counting', duration: 1000 }));
    act(() => fireEvent(window, new Event('blur')));
    act(() => vi.advanceTimersByTime(1000));
    expect(screen.queryByRole('listitem')).toBeNull();
    unmount();

    toastStore.clear();
    const opted = mount({ pauseOnWindowBlur: true });
    act(() => api?.show({ title: 'Opted-in pauses', duration: 1000 }));
    act(() => fireEvent(window, new Event('blur')));
    act(() => vi.advanceTimersByTime(2000));
    expect(titles()).toEqual(['Opted-in pauses']);
    act(() => fireEvent(window, new Event('focus')));
    act(() => vi.advanceTimersByTime(999));
    expect(titles()).toEqual(['Opted-in pauses']);
    act(() => vi.advanceTimersByTime(1));
    expect(screen.queryByRole('listitem')).toBeNull();
    opted.unmount();
  });

  it('closes, updates and clears programmatically through the store', () => {
    mount();
    const first = api?.show({ title: 'First' }) as string;
    api?.show({ title: 'Second' });
    act(() => api?.close(first));
    expect(titles()).toEqual(['Second']);
    act(() => api?.clear());
    expect(screen.queryByRole('listitem')).toBeNull();
  });

  it('resolves toast.promise through loading into success content without rethrowing', async () => {
    let resolveFn: ((value: string) => void) | undefined;
    const tracked = {
      promise: new Promise<string>((resolve) => {
        resolveFn = resolve;
      })
    };
    mount();
    let trackedPromise: Promise<string> | undefined;
    act(() => {
      trackedPromise = api?.promise(tracked.promise, {
        loading: 'Saving…',
        success: 'Saved',
        error: (reason: unknown) => `Save failed: ${String(reason)}`
      });
    });
    expect(titles()).toEqual(['Saving…']);
    expect(toast()).toHaveAttribute('data-tone', 'loading');
    await act(async () => resolveFn?.('ok'));
    await expect(trackedPromise).resolves.toBe('ok');
    expect(titles()).toEqual(['Saved']);
    expect(toast()).toHaveAttribute('data-tone', 'success');
  });

  it('rejects toast.promise through loading into danger content and rethrows', async () => {
    let rejectFn: ((reason: Error) => void) | undefined;
    const tracked = {
      promise: new Promise<string>((_resolve, reject) => {
        rejectFn = reject;
      })
    };
    mount();
    let trackedPromise: Promise<string> | undefined;
    act(() => {
      trackedPromise = api?.promise(tracked.promise, {
        loading: 'Saving…',
        success: 'Saved',
        error: (reason: unknown) => `Save failed: ${reason instanceof Error ? reason.message : String(reason)}`
      });
    });
    expect(titles()).toEqual(['Saving…']);
    expect(toast()).toHaveAttribute('data-tone', 'loading');
    const expectation = expect(trackedPromise).rejects.toThrow('disk full');
    await act(async () => rejectFn?.(new Error('disk full')));
    await expectation;
    expect(titles()).toEqual(['Save failed: disk full']);
    expect(toast()).toHaveAttribute('data-tone', 'danger');
    expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'assertive');
  });

  it('warns and no-ops when the imperative API is used before the provider mounts', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    expect(() => api?.show({ title: 'Too early' })).not.toThrow();
    expect(warning).toHaveBeenCalledOnce();
    mount();
    expect(screen.queryByRole('listitem')).toBeNull();
    act(() => api?.show({ title: 'Mounted now' }));
    expect(titles()).toEqual(['Mounted now']);
  });

  it('caps mounted toasts at maxVisible, queues overflow and promotes on close', () => {
    mount({ maxVisible: 2 });
    const ids: string[] = [];
    act(() => {
      ids.push(api?.show({ title: 'First' }) ?? '');
      ids.push(api?.show({ title: 'Second' }) ?? '');
      ids.push(api?.show({ title: 'Third' }) ?? '');
      ids.push(api?.show({ id: 'fourth', title: 'Fourth' }) ?? '');
    });
    // Overflow (newer records) queues; the mounted list keeps insertion order, newest last (D9).
    expect(titles()).toEqual(['First', 'Second']);
    act(() => api?.close(ids[0] as string));
    expect(titles()).toEqual(['Second', 'Third']);
    act(() => api?.close(ids[1] as string));
    expect(titles()).toEqual(['Third', 'Fourth']);
  });

  it('renders records only in the active (most recently mounted) provider viewport', () => {
    const first = mount();
    act(() => api?.show({ title: 'Active viewport' }));
    expect(titles()).toEqual(['Active viewport']);
    const second = render(
      <ToastProvider>
        <span>Other story</span>
      </ToastProvider>
    );
    expect(screen.getAllByRole('list')).toHaveLength(2);
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
    second.unmount();
    // The active provider unmounted; no viewport keeps rendering records.
    expect(screen.queryByRole('listitem')).toBeNull();
    first.unmount();
  });

  it('retains stack insertion order, with the newest toast last', () => {
    mount();
    act(() => {
      api?.show({ title: 'First' });
      api?.show({ title: 'Second' });
      api?.show({ title: 'Third' });
    });
    expect(titles()).toEqual(['First', 'Second', 'Third']);
    expect(viewport()).toHaveClass('eg-toast-viewport', 'fixed', 'bottom-6', 'end-6', 'gap-2', 'flex-col');
  });

  it.each([
    ['top-start', 'top-6', 'start-6', 'up'],
    ['top-end', 'top-6', 'end-6', 'up'],
    ['bottom-start', 'bottom-6', 'start-6', 'down'],
    ['bottom-end', 'bottom-6', 'end-6', 'right']
  ] as const)('re-anchors the viewport to %s and swipes %s', (placement, edge, inline, swipe) => {
    mount({ placement });
    act(() => api?.show({ title: 'Link copied' }));
    expect(viewport()).toHaveClass('eg-toast-viewport', 'fixed', edge, inline);
    expect(viewport()).not.toHaveClass(edge === 'top-6' ? 'bottom-6' : 'top-6');
    expect(toast()).toHaveAttribute('data-swipe-direction', swipe);
  });

  it.each([30, 80])('handles a right swipe of %i px through Radix', (distance) => {
    // Supply the missing platform event constructor, never mock Radix behavior.
    vi.stubGlobal('PointerEvent', MouseEvent);
    const end = vi.fn();
    mount();
    act(() => api?.show({ title: 'Link copied', onSwipeEnd: end }));
    const root = toast();
    fireEvent.pointerDown(root, { button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(root, { clientX: 15, clientY: 0 });
    fireEvent.pointerMove(root, { clientX: distance, clientY: 0 });
    expect(root).toHaveAttribute('data-swipe', 'move');
    expect(root.style.getPropertyValue('--radix-toast-swipe-move-x')).toBe(`${distance}px`);
    fireEvent.pointerUp(root, { clientX: distance, clientY: 0 });
    if (distance > 50) {
      expect(end).toHaveBeenCalledOnce();
      expect(screen.queryByRole('listitem')).toBeNull();
    } else {
      expect(root).toHaveAttribute('data-swipe', 'cancel');
      expect(titles()).toEqual(['Link copied']);
    }
  });

  it('preserves className root-layout additions merged last and native passthrough', () => {
    mount();
    act(() =>
      api?.show({ title: 'Link copied', className: 'w-full self-start', 'aria-describedby': 'help', id: 'copied' })
    );
    const root = toast();
    expect(root).toHaveClass('eg-toast', 'w-full', 'self-start');
    expect(root).toHaveAttribute('aria-describedby', 'help');
    expect(root).toHaveAttribute('id', 'copied');
  });

  it('keeps Radix validation of a blank action alternative', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    mount();
    act(() => api?.show({ title: 'Post published', actions: <Button>Undo</Button>, actionAltText: ' ' }));
    expect(error).toHaveBeenCalledWith(expect.stringMatching(/altText.*ToastAction/));
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });
});
