import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useToast } from '@/molecules/toast/useToast';
import { Button, Icon, Toast, type ToastProps, ToastProvider } from '../../index';

const pointerCapture = ['setPointerCapture', 'releasePointerCapture', 'hasPointerCapture'] as const;

beforeEach(() => {
  // Radix checks capture even on ordinary clicks; jsdom has no implementation.
  const captured = new Set<number>();
  Object.assign(HTMLElement.prototype, {
    setPointerCapture: (id: number) => captured.add(id),
    releasePointerCapture: (id: number) => captured.delete(id),
    hasPointerCapture: (id: number) => captured.has(id)
  });
});

afterEach(() => {
  for (const method of pointerCapture) {
    Reflect.deleteProperty(HTMLElement.prototype, method);
  }
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

function show(props: ToastProps = { summary: 'Post published' }) {
  return render(
    <ToastProvider>
      <Toast {...props} />
    </ToastProvider>
  );
}

function viewport() {
  return within(screen.getByRole('region', { name: 'Notifications (F8)' })).getByRole('list');
}

describe('Toast public contract', () => {
  it('renders a bold summary and detail in the portalled list without Notice semantics', () => {
    const change = vi.fn();
    const { container } = show({
      summary: 'Post published',
      children: 'Ready to share.',
      onOpenChange: change,
      id: 'published',
      className: 'w-full self-start',
      'aria-describedby': 'help'
    });
    const root = screen.getByRole('listitem');
    expect(container).toBeEmptyDOMElement();
    expect(root.parentElement).toBe(viewport());
    expect(root).toHaveClass('eg-toast', 'eg-surface', 'w-full', 'self-start', 'flex-wrap');
    expect(root).not.toHaveClass('eg-notice');
    expect(root.querySelector('[class*="eg-notice"]')).toBeNull();
    expect(root).toHaveAttribute('data-state', 'open');
    expect(root).toHaveAttribute('data-tone', 'neutral');
    expect(root).toHaveAttribute('id', 'published');
    expect(root).toHaveAttribute('aria-describedby', 'help');
    expect(within(root).getByText('Post published').tagName).toBe('STRONG');
    expect(within(root).getByText('Ready to share.')).toBeVisible();
    expect(root).not.toHaveAttribute('aria-live');
    expect(root.querySelector('[role="status"], [role="alert"]')).toBeNull();
    expect(root).toHaveClass('shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]');
    expect(root).not.toHaveClass('shadow-[var(--shadow-edge),var(--shadow-elev-1)]');
    expect(root).toHaveClass('motion-reduce:transition-none');
    expect(change).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(document.body);
  });

  it.each(['neutral', 'info', 'success', 'warning', 'danger'] as const)(
    'derives %s urgency and its decorative default glyph',
    (tone) => {
      show({ summary: 'Current state', tone });
      expect(screen.getByRole('status')).toHaveAttribute('aria-live', tone === 'danger' ? 'assertive' : 'polite');
      const { result } = renderHook(() => useToast({ summary: 'Current state', tone }));
      expect(result.current.iconName).toBe(
        tone === 'success' ? 'check' : tone === 'warning' || tone === 'danger' ? 'alert' : 'bell'
      );
      expect(screen.getByRole('listitem').querySelector('svg')?.parentElement).toHaveAttribute('aria-hidden', 'true');
    }
  );

  it('supports a custom decorative icon and localizes region, prefix and close name', async () => {
    render(
      <ToastProvider label='Messages ({hotkey})' announcementLabel='Message'>
        <Toast summary='Link copied' dismissLabel='Close message' icon={<Icon name='copy' />} />
      </ToastProvider>
    );
    expect(screen.getByRole('region', { name: 'Messages (F8)' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close message' })).toBeInTheDocument();
    await vi.waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Message Link copied'));
    expect(screen.getByRole('listitem').querySelectorAll('svg')).toHaveLength(2);
  });

  it('uses the unchanged ghost/lg IconButton and closes on activation', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    show({ summary: 'Link copied', onOpenChange: change });
    const close = screen.getByRole('button', { name: 'Dismiss' });
    expect(close).toHaveClass('eg-icon-btn', 'size-12', 'bg-transparent');
    expect(close).not.toHaveAttribute('aria-label');
    await user.click(close);
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.queryByRole('listitem')).toBeNull();
    expect(viewport()).toHaveFocus();
  });

  it('runs a Button md action and closes with native viewport focus (A1)', async () => {
    const user = userEvent.setup();
    const action = vi.fn();
    const change = vi.fn();
    show({
      summary: 'Post published',
      actions: (
        <Button size='md' onClick={action}>
          Undo
        </Button>
      ),
      actionAltText: 'Undo from post history',
      onOpenChange: change
    });
    const button = screen.getByRole('button', { name: 'Undo' });
    expect(button).toHaveClass('eg-btn', 'min-h-12');
    expect(button).toHaveAttribute('data-radix-toast-announce-alt', 'Undo from post history');
    await user.click(button);
    expect(action).toHaveBeenCalledOnce();
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(viewport()).toHaveFocus();
  });

  it('lets an action prevent dismissal using native event cancellation', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    show({
      summary: 'Could not publish',
      actions: <Button onClick={(event) => event.preventDefault()}>Retry</Button>,
      actionAltText: 'Retry from the editor',
      onOpenChange: change
    });
    await user.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
  });

  it('F8 focuses the viewport; Tab reaches controls; Escape closes with viewport focus (A1)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    show({ summary: 'Link copied', onOpenChange: change });
    // Radix matches KeyboardEvent.code for F8.
    fireEvent.keyDown(document, { key: 'F8', code: 'F8' });
    expect(viewport()).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('listitem')).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(viewport()).toHaveFocus();
  });

  it('forwards onEscapeKeyDown and respects its cancellation', async () => {
    const user = userEvent.setup();
    const escapeHandler = vi.fn((event: KeyboardEvent) => event.preventDefault());
    show({ summary: 'Link copied', onEscapeKeyDown: escapeHandler });
    act(() => screen.getByRole('listitem').focus());
    await user.keyboard('{Escape}');
    expect(escapeHandler).toHaveBeenCalledOnce();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('respects controlled visibility without echoing incoming changes or mounting', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    const { rerender } = render(
      <ToastProvider>
        <Toast summary='Link copied' open={true} onOpenChange={change} />
      </ToastProvider>
    );
    expect(change).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.getByRole('listitem')).toHaveAttribute('data-state', 'open');
    rerender(
      <ToastProvider>
        <Toast summary='Link copied' open={false} onOpenChange={change} />
      </ToastProvider>
    );
    expect(screen.queryByRole('listitem')).toBeNull();
    rerender(
      <ToastProvider>
        <Toast summary='Link copied' open={true} onOpenChange={change} />
      </ToastProvider>
    );
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(change).toHaveBeenCalledOnce();
  });

  it('honors defaultOpen=false and forceMount without initial notifications', () => {
    const change = vi.fn();
    const { rerender } = render(
      <ToastProvider>
        <Toast summary='Hidden' defaultOpen={false} onOpenChange={change} />
      </ToastProvider>
    );
    expect(screen.queryByRole('listitem')).toBeNull();
    rerender(
      <ToastProvider>
        <Toast summary='Hidden' defaultOpen={false} forceMount={true} onOpenChange={change} />
      </ToastProvider>
    );
    expect(screen.getByRole('listitem')).toHaveAttribute('data-state', 'closed');
    expect(change).not.toHaveBeenCalled();
  });

  it.each([5000, 100])('auto-dismisses after %i ms without stealing outside focus', (duration) => {
    vi.useFakeTimers();
    const change = vi.fn();
    render(
      <ToastProvider>
        <button type='button'>Editor</button>
        <Toast summary='Link copied' {...(duration === 5000 ? {} : { duration })} onOpenChange={change} />
      </ToastProvider>
    );
    act(() => screen.getByRole('button', { name: 'Editor' }).focus());
    act(() => vi.advanceTimersByTime(duration - 1));
    expect(change).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(screen.getByRole('button', { name: 'Editor' })).toHaveFocus();
  });

  it('never auto-dismisses with Infinity', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    show({ summary: 'Action required', duration: Infinity, onOpenChange: change });
    act(() => vi.advanceTimersByTime(60000));
    expect(screen.getByRole('listitem')).toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
  });

  it.each(['pointer', 'focus', 'window'] as const)('pauses and resumes the remaining timer on %s', (source) => {
    vi.useFakeTimers();
    const pause = vi.fn();
    const resume = vi.fn();
    const change = vi.fn();
    show({ summary: 'Link copied', duration: 1000, onPause: pause, onResume: resume, onOpenChange: change });
    act(() => vi.advanceTimersByTime(400));
    const list = viewport();
    if (source === 'pointer') {
      fireEvent.pointerMove(list);
    } else if (source === 'focus') {
      act(() => list.focus());
    } else {
      fireEvent(window, new Event('blur'));
    }
    act(() => vi.advanceTimersByTime(2000));
    expect(change).not.toHaveBeenCalled();
    expect(pause).toHaveBeenCalledOnce();
    if (source === 'pointer') {
      fireEvent.pointerLeave(list.parentElement ?? list);
    } else if (source === 'focus') {
      act(() => list.blur());
    } else {
      fireEvent(window, new Event('focus'));
    }
    expect(resume).toHaveBeenCalledOnce();
    act(() => vi.advanceTimersByTime(599));
    expect(change).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
  });

  it.each([30, 80])('handles a right swipe of %i px through Radix', (distance) => {
    // Supply the missing platform event constructor, never mock Radix behavior.
    vi.stubGlobal('PointerEvent', MouseEvent);
    const change = vi.fn();
    const cancel = vi.fn();
    const end = vi.fn();
    show({ summary: 'Link copied', onOpenChange: change, onSwipeCancel: cancel, onSwipeEnd: end });
    const root = screen.getByRole('listitem');
    fireEvent.pointerDown(root, { button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(root, { clientX: 15, clientY: 0 });
    fireEvent.pointerMove(root, { clientX: distance, clientY: 0 });
    expect(root).toHaveAttribute('data-swipe', 'move');
    expect(root.style.getPropertyValue('--radix-toast-swipe-move-x')).toBe(`${distance}px`);
    fireEvent.pointerUp(root, { clientX: distance, clientY: 0 });
    if (distance > 50) {
      expect(end).toHaveBeenCalledOnce();
      expect(change).toHaveBeenCalledExactlyOnceWith(false);
    } else {
      expect(cancel).toHaveBeenCalledOnce();
      expect(change).not.toHaveBeenCalled();
      expect(root).toHaveAttribute('data-swipe', 'cancel');
    }
  });

  it('keeps stack insertion order, with the newest toast last', () => {
    render(
      <ToastProvider>
        <Toast summary='First' />
        <Toast summary='Second' />
        <Toast summary='Third' />
      </ToastProvider>
    );
    expect(screen.getAllByRole('listitem').map((item) => item.querySelector('strong')?.textContent)).toEqual([
      'First',
      'Second',
      'Third'
    ]);
    expect(viewport()).toHaveClass('eg-toast-viewport', 'fixed', 'bottom-6', 'end-6', 'gap-2', 'flex-col');
  });

  it('retains native Escape dismissal outside the toast without moving outside focus', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(
      <ToastProvider>
        <button type='button'>Editor</button>
        <Toast summary='Link copied' onOpenChange={change} />
      </ToastProvider>
    );
    const editor = screen.getByRole('button', { name: 'Editor' });
    act(() => editor.focus());
    await user.keyboard('{Escape}');
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
    expect(editor).toHaveFocus();
  });

  it('preserves Radix validation of a blank action alternative', () => {
    const error = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    show({ summary: 'Post published', actions: <Button>Undo</Button>, actionAltText: ' ' });
    expect(error).toHaveBeenCalledWith(expect.stringMatching(/altText.*ToastAction/));
    expect(screen.queryByRole('button', { name: 'Undo' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Dismiss' })).toBeInTheDocument();
  });

  it('keeps Radix zero-duration fallback instead of introducing numeric validation', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    show({ summary: 'Link copied', duration: 0, onOpenChange: change });
    act(() => vi.advanceTimersByTime(4999));
    expect(change).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(change).toHaveBeenCalledExactlyOnceWith(false);
  });

  it('retains Radix missing-provider errors', () => {
    vi.spyOn(console, 'error').mockImplementation(() => undefined);
    expect(() => render(<Toast summary='Outside provider' />)).toThrow(/Toast.*ToastProvider/);
  });
});
