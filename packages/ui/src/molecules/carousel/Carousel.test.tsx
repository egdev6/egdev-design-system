import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Carousel, type CarouselItem } from './index';
import { useCarousel } from './useCarousel.js';

const items: [CarouselItem, CarouselItem, CarouselItem] = [
  { value: 'a', label: 'Alpha', children: <p>First information</p> },
  { value: 'b', label: 'Beta', children: <p>Second information</p> },
  { value: 'c', label: 'Gamma', children: <p>Third information</p> }
];
const slides = () =>
  screen.getAllByRole('group').filter((node) => node.getAttribute('aria-roledescription') === 'slide');
const current = () => slides().find((node) => node.getAttribute('aria-current') === 'true');
const counterWith = (text: string) =>
  screen.getByText((_, node) => node?.getAttribute('aria-hidden') === 'true' && node.textContent === text);
const track = () =>
  document.getElementById(
    screen.getByRole('button', { name: 'Next slide' }).getAttribute('aria-controls') ?? ''
  ) as HTMLDivElement;

function geometry(rtl = false) {
  const viewport = track();
  let offset = 0;
  const rect = (left: number) => ({
    left,
    right: left + 100,
    width: 100,
    top: 0,
    bottom: 100,
    height: 100,
    x: left,
    y: 0,
    toJSON: () => ({})
  });
  vi.spyOn(viewport, 'getBoundingClientRect').mockImplementation(() => rect(0));
  slides().forEach((slide, index) => {
    vi.spyOn(slide, 'getBoundingClientRect').mockImplementation(() => rect((rtl ? -index : index) * 100 - offset));
  });
  const scrollBy = vi.fn((options: ScrollToOptions) => {
    offset += options.left ?? 0;
  });
  Object.defineProperty(viewport, 'scrollBy', { configurable: true, value: scrollBy });
  return {
    viewport,
    scrollBy,
    setOffset: (value: number) => {
      offset = value;
    }
  };
}

const mouseDown = { pointerType: 'mouse', button: 0, isPrimary: true, pointerId: 1, clientX: 100, clientY: 0 };
const mouseMove = { pointerType: 'mouse', pointerId: 1, clientX: 0, clientY: 0 };

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('Carousel public contract v0.1', () => {
  it('derives hook defaults without a fabricated initial identity', () => {
    const { result } = renderHook(() => useCarousel({ label: 'Highlights', items }));
    expect(result.current.rootProps['data-state']).toBe('idle');
    expect(result.current.progress).toBeCloseTo(100 / 3);
    expect(result.current.counter).toBe('01 / 03');
  });

  it('names the collection and slides, composes atoms, and keeps all content readable', () => {
    render(
      <Carousel
        label='Highlights'
        items={items}
        className='w-full mt-4'
        data-example='pass'
        aria-describedby='external'
      />
    );
    const root = screen.getByRole('group', { name: 'Highlights' });
    expect(root).toHaveClass('eg-carousel', 'w-full', 'mt-4');
    expect(root).toHaveAttribute('data-example', 'pass');
    expect(root.getAttribute('aria-describedby')).toContain('external');
    expect(root).toHaveAttribute('aria-roledescription', 'carousel');
    expect(slides()).toHaveLength(3);
    expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    expect(slides().map((slide) => slide.tabIndex)).toEqual([0, -1, -1]);
    expect(screen.getByText('Third information')).toBeVisible();
    expect(counterWith('01 / 03')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(root.querySelector('.eg-progress')).toHaveAttribute('aria-hidden', 'true');
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('eg-icon-btn', 'size-12');
    }
    expect(screen.getByRole('button', { name: 'Previous slide' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Next slide' })).toBeEnabled();
    expect(track()).not.toHaveAttribute('tabindex');
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('uses a valid defaultValue only initially and falls back silently for unknown identities', () => {
    const onValueChange = vi.fn();
    const { rerender, unmount } = render(
      <Carousel label='Highlights' items={items} defaultValue='b' onValueChange={onValueChange} />
    );
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    rerender(<Carousel label='Highlights' items={items} defaultValue='c' onValueChange={onValueChange} />);
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    unmount();
    render(<Carousel label='Highlights' items={items} value='missing' onValueChange={onValueChange} />);
    expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('navigates native controls once and repairs focus only when a control becomes disabled', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<Carousel label='Highlights' items={items} onValueChange={onValueChange} />);
    const next = screen.getByRole('button', { name: 'Next slide' });
    await user.click(next);
    expect(next).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('2 of 3: Beta');
    await user.keyboard('{Enter}');
    expect(current()).toHaveFocus();
    expect(next).toBeDisabled();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    const previous = screen.getByRole('button', { name: 'Previous slide' });
    await user.click(previous);
    await user.keyboard(' ');
    expect(current()).toHaveFocus();
    expect(previous).toBeDisabled();
    expect(onValueChange.mock.calls).toEqual([['b'], ['c'], ['b'], ['a']]);
  });

  it.each(['ltr', 'rtl'] as const)('bounds slide keyboard navigation and native Tab order in %s', async (dir) => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <>
        <Carousel label='Highlights' items={items} dir={dir} onValueChange={onValueChange} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next slide' })).toHaveFocus();
    await user.tab();
    expect(current()).toHaveFocus();
    await user.keyboard(dir === 'ltr' ? '{ArrowLeft}' : '{ArrowRight}');
    expect(onValueChange).not.toHaveBeenCalled();
    await user.keyboard(dir === 'ltr' ? '{ArrowRight}' : '{ArrowLeft}');
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    expect(current()).toHaveFocus();
    await user.keyboard('{End}{End}');
    expect(current()).toHaveAccessibleName('3 of 3: Gamma');
    await user.keyboard('{Home}{Home}');
    expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    await user.keyboard(' {Enter}');
    expect(onValueChange.mock.calls).toEqual([['b'], ['c'], ['a']]);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });

  it('respects prevented native events and leaves descendant keyboard events alone', () => {
    const onValueChange = vi.fn();
    const onKeyDown = vi.fn((event: React.KeyboardEvent<HTMLDivElement>) => event.preventDefault());
    const { rerender } = render(
      <Carousel label='Highlights' items={items} onValueChange={onValueChange} onKeyDown={onKeyDown} />
    );
    fireEvent.keyDown(current() as HTMLElement, { key: 'ArrowRight' });
    expect(onKeyDown).toHaveBeenCalledOnce();
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(<Carousel label='Highlights' items={items} onValueChange={onValueChange} />);
    fireEvent.keyDown(screen.getByText('First information'), { key: 'ArrowRight' });
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('waits for controlled acceptance before committing counter, focus and status', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const { rerender } = render(<Carousel label='Highlights' items={items} value='a' onValueChange={onValueChange} />);
    (current() as HTMLElement).focus();
    await user.keyboard('{ArrowRight}');
    expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    expect(current()).toHaveFocus();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    rerender(<Carousel label='Highlights' items={items} value='b' onValueChange={onValueChange} />);
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    expect(current()).toHaveFocus();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('preserves the initial fallback identity across reorder and forgets removed uncontrolled identities', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Carousel label='Highlights' items={items} onValueChange={onValueChange} />);
    rerender(<Carousel label='Highlights' items={[items[1], items[0], items[2]]} onValueChange={onValueChange} />);
    expect(current()).toHaveAccessibleName('2 of 3: Alpha');
    rerender(<Carousel label='Highlights' items={[items[1], items[2]]} onValueChange={onValueChange} />);
    expect(current()).toHaveAccessibleName('1 of 2: Beta');
    rerender(<Carousel label='Highlights' items={items} onValueChange={onValueChange} />);
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('preserves identity across reorder; removal repairs stranded focus including the empty root', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <Carousel label='Highlights' items={items} defaultValue='b' onValueChange={onValueChange} />
    );
    (current() as HTMLElement).focus();
    rerender(<Carousel label='Highlights' items={[items[1], items[0], items[2]]} onValueChange={onValueChange} />);
    expect(current()).toHaveAccessibleName('1 of 3: Beta');
    expect(current()).toHaveFocus();
    rerender(<Carousel label='Highlights' items={[items[0]]} onValueChange={onValueChange} />);
    expect(current()).toHaveFocus();
    expect(current()).toHaveAccessibleName('1 of 1: Alpha');
    rerender(<Carousel label='Highlights' items={[]} onValueChange={onValueChange} />);
    expect(screen.getByRole('group', { name: 'Highlights' })).toHaveFocus();
    expect(screen.getByRole('group', { name: 'Highlights' })).toHaveAttribute('tabindex', '-1');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not steal focus after a delayed controlled request if the user has moved to another control', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Carousel label='Highlights' items={items} value='a' />);
    (current() as HTMLElement).focus();
    await user.keyboard('{ArrowRight}');
    const next = screen.getByRole('button', { name: 'Next slide' });
    next.focus();
    rerender(<Carousel label='Highlights' items={items} value='b' />);
    expect(next).toHaveFocus();
  });

  it('repairs focus when the browser blurs a newly disabled navigation button to the body', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Carousel label='Highlights' items={items} value='b' />);
    const next = screen.getByRole('button', { name: 'Next slide' }) as HTMLButtonElement;
    await user.click(next);
    // Model browsers that blur the button as soon as React applies its disabled attribute.
    next.disabled = true;
    document.body.tabIndex = -1;
    document.body.focus();
    document.body.removeAttribute('tabindex');
    expect(document.body).toHaveFocus();
    rerender(<Carousel label='Highlights' items={items} value='c' />);
    expect(current()).toHaveFocus();
  });

  it('does not repair intentionally blurred slide focus when that slide is later removed', () => {
    const { rerender } = render(<Carousel label='Highlights' items={items} />);
    const slide = current() as HTMLElement;
    slide.focus();
    slide.blur();
    rerender(<Carousel label='Highlights' items={items.slice(1)} />);
    expect(document.body).toHaveFocus();
  });

  it('protects owned semantics from untyped props and composes root focus handlers', () => {
    const onFocusCapture = vi.fn();
    const onBlurCapture = vi.fn();
    const injected = {
      role: 'tablist',
      'aria-label': 'Override',
      'aria-labelledby': 'override',
      'aria-roledescription': 'tabs',
      tabIndex: 7,
      'data-state': 'broken'
    };
    render(
      <Carousel
        {...injected}
        label='Highlights'
        items={items}
        onFocusCapture={onFocusCapture}
        onBlurCapture={onBlurCapture}
      />
    );
    const root = screen.getByRole('group', { name: 'Highlights' });
    expect(root).toHaveAttribute('data-state', 'idle');
    expect(root).toHaveAttribute('aria-roledescription', 'carousel');
    expect(root).not.toHaveAttribute('aria-label');
    expect(root).not.toHaveAttribute('tabindex');
    (current() as HTMLElement).focus();
    expect(onFocusCapture).toHaveBeenCalledOnce();
    screen.getByRole('button', { name: 'Next slide' }).focus();
    expect(onBlurCapture).toHaveBeenCalledOnce();
  });

  it('does not steal outside focus or announce prop updates, and silently realigns on resize', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <>
        <button type='button'>Outside</button>
        <Carousel label='Highlights' items={items} value='a' onValueChange={onValueChange} />
      </>
    );
    screen.getByRole('button', { name: 'Outside' }).focus();
    const { scrollBy } = geometry();
    rerender(
      <>
        <button type='button'>Outside</button>
        <Carousel label='Highlights' items={items} value='c' onValueChange={onValueChange} />
      </>
    );
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(scrollBy).toHaveBeenCalledWith({ left: 200, behavior: 'instant' });
    fireEvent(window, new Event('resize'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    { input: [] },
    { input: [{ ...items[0], value: '' }] },
    { input: [{ ...items[0], value: '  ' }] },
    { input: [{ ...items[0], label: '  ' }] },
    { input: [items[0], items[0]] }
  ])('renders safe empty state for empty or invalid collections %#', ({ input }) => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    render(<Carousel label='Highlights' items={input} />);
    expect(counterWith('00 / 00')).toBeVisible();
    expect(screen.getByText('No slides')).toBeVisible();
    expect(screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    expect(slides()).toHaveLength(0);
    expect(screen.getByRole('group', { name: 'Highlights' })).toHaveAttribute('data-state', 'empty');
    expect(warning).toHaveBeenCalledTimes(input.length ? 1 : 0);
  });

  it('handles a single item and totals wider than two digits', () => {
    const { rerender } = render(<Carousel label='Highlights' items={[items[0]]} />);
    expect(counterWith('01 / 01')).toBeVisible();
    expect(current()).toHaveAttribute('tabindex', '0');
    expect(screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
    const manyItems = Array.from({ length: 101 }, (_, index) => ({
      value: String(index),
      label: `Item ${index}`,
      children: 'Information'
    }));
    rerender(<Carousel label='Highlights' items={manyItems} />);
    expect(counterWith('01 / 101')).toBeVisible();
  });

  it('merges localization, validates text and formatter results, and generates unique ids', () => {
    render(
      <>
        <Carousel
          label='One'
          items={items}
          messages={{
            nextSlide: 'Continue',
            previousSlide: ' ',
            carousel: 'sequence',
            position: (index: number, total: number, name: string) => `${name}: ${index}/${total}`
          }}
        />
        <Carousel label='Two' items={items} messages={{ position: () => ' ' }} />
      </>
    );
    const one = screen.getByRole('group', { name: 'One' });
    const two = screen.getByRole('group', { name: 'Two' });
    expect(one).toHaveAttribute('aria-roledescription', 'sequence');
    expect(within(one).getByRole('button', { name: 'Continue' })).toBeEnabled();
    expect(within(one).getByRole('button', { name: 'Previous slide' })).toBeDisabled();
    expect(within(one).getByRole('group', { name: 'Alpha: 1/3' })).toBeVisible();
    expect(within(two).getByRole('group', { name: '1 of 3: Alpha' })).toBeVisible();
    expect(one.getAttribute('aria-labelledby')).not.toBe(two.getAttribute('aria-labelledby'));
    const description = one.getAttribute('aria-describedby') ?? '';
    expect(document.getElementById(description)).toHaveTextContent('Use Left and Right Arrow keys');
    expect(within(one).getByRole('group', { name: 'Alpha: 1/3' })).toHaveAttribute('aria-describedby', description);
  });

  it.each([false, true])('settles native scrolling once using physical geometry (RTL %s)', (rtl) => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    render(<Carousel label='Highlights' items={items} dir={rtl ? 'rtl' : 'ltr'} onValueChange={onValueChange} />);
    const { viewport, setOffset } = geometry(rtl);
    setOffset(rtl ? -100 : 100);
    fireEvent.scroll(viewport);
    expect(onValueChange).not.toHaveBeenCalled();
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    expect(screen.getByRole('status')).toHaveTextContent('2 of 3: Beta');
    fireEvent(viewport, new Event('scrollend'));
    expect(onValueChange).toHaveBeenCalledOnce();
  });

  it('restores a rejected controlled scroll and follows slide focus without duplicate live announcements', () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    const { rerender } = render(<Carousel label='Highlights' items={items} value='a' onValueChange={onValueChange} />);
    const { viewport, scrollBy, setOffset } = geometry();
    (current() as HTMLElement).focus();
    setOffset(100);
    fireEvent.scroll(viewport);
    fireEvent(viewport, new Event('scrollend'));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(scrollBy).toHaveBeenLastCalledWith({ left: -100, behavior: 'instant' });
    expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    rerender(<Carousel label='Highlights' items={items} value='b' onValueChange={onValueChange} />);
    expect(current()).toHaveFocus();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('does not request a change for a hidden viewport or an unsolicited scrollend after resize', () => {
    const onValueChange = vi.fn();
    render(<Carousel label='Highlights' items={items} value='b' onValueChange={onValueChange} />);
    fireEvent(window, new Event('resize'));
    fireEvent(track(), new Event('scrollend'));
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.scroll(track());
    fireEvent(track(), new Event('scrollend'));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it.each([
    { pointerType: 'touch', button: 0 },
    { pointerType: 'pen', button: 0 },
    { pointerType: 'mouse', button: 2 }
  ])('does not capture native $pointerType input with button $button', (input) => {
    render(<Carousel label='Highlights' items={items} />);
    const { viewport } = geometry();
    const capture = vi.fn();
    Object.assign(viewport, { setPointerCapture: capture });
    fireEvent.pointerDown(viewport, { ...mouseDown, ...input });
    fireEvent.pointerMove(viewport, mouseMove);
    expect(capture).not.toHaveBeenCalled();
  });

  it('allows background dragging without taking text selection and never steals outside focus', () => {
    const onValueChange = vi.fn();
    render(
      <>
        <button type='button'>Outside</button>
        <Carousel label='Highlights' items={items} onValueChange={onValueChange} />
      </>
    );
    screen.getByRole('button', { name: 'Outside' }).focus();
    const { viewport } = geometry();
    const capture = vi.fn();
    Object.assign(viewport, {
      setPointerCapture: capture,
      releasePointerCapture: vi.fn(),
      hasPointerCapture: () => true
    });
    const selection = window.getSelection();
    selection?.removeAllRanges();
    const range = document.createRange();
    range.selectNodeContents(screen.getByText('First information'));
    selection?.addRange(range);
    expect(selection?.isCollapsed).toBe(false);
    fireEvent.pointerDown(viewport, mouseDown);
    fireEvent.pointerMove(viewport, mouseMove);
    expect(capture).not.toHaveBeenCalled();
    selection?.removeAllRanges();
    fireEvent.pointerDown(viewport, mouseDown);
    fireEvent.pointerMove(viewport, mouseMove);
    fireEvent.pointerUp(viewport, { pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  });

  it('captures mouse media drag only after threshold, suppresses frame callbacks, and releases on cancellation', () => {
    const onValueChange = vi.fn();
    const mediaItems = items.map((item) => ({ ...item, children: <img alt={item.label} src='data:,' /> }));
    render(<Carousel label='Highlights' items={mediaItems} onValueChange={onValueChange} />);
    const { viewport, scrollBy } = geometry();
    const capture = vi.fn();
    const release = vi.fn();
    Object.assign(viewport, {
      setPointerCapture: capture,
      releasePointerCapture: release,
      hasPointerCapture: () => true
    });
    fireEvent.pointerDown(screen.getByRole('img', { name: 'Alpha' }), mouseDown);
    fireEvent.pointerMove(viewport, { ...mouseMove, clientX: 97 });
    expect(capture).not.toHaveBeenCalled();
    fireEvent.pointerMove(viewport, { ...mouseMove, clientX: 40 });
    expect(capture).toHaveBeenCalledWith(1);
    expect(screen.getByRole('group', { name: 'Highlights' })).toHaveAttribute('data-state', 'dragging');
    expect(scrollBy).toHaveBeenCalledWith({ left: 60, behavior: 'instant' });
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.pointerCancel(viewport, { pointerId: 1 });
    expect(release).toHaveBeenCalledWith(1);
    expect(screen.getByRole('group', { name: 'Highlights' })).toHaveAttribute('data-state', 'idle');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('commits a completed drag once and releases captured pointers on unmount', () => {
    const onValueChange = vi.fn();
    const mediaItems = items.map((item) => ({ ...item, children: <img alt={item.label} src='data:,' /> }));
    const { unmount } = render(<Carousel label='Highlights' items={mediaItems} onValueChange={onValueChange} />);
    const { viewport } = geometry();
    const release = vi.fn();
    Object.assign(viewport, {
      setPointerCapture: vi.fn(),
      releasePointerCapture: release,
      hasPointerCapture: () => true
    });
    const down = () => fireEvent.pointerDown(screen.getByRole('img', { name: 'Alpha' }), mouseDown);
    down();
    fireEvent.pointerMove(viewport, mouseMove);
    fireEvent.pointerUp(viewport, { pointerId: 1 });
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    down();
    fireEvent.pointerMove(viewport, mouseMove);
    unmount();
    expect(release).toHaveBeenCalledTimes(2);
  });

  it('does not drag selectable text and never advances on idle, hover, focus or visibility changes', () => {
    vi.useFakeTimers();
    const onValueChange = vi.fn();
    const { unmount } = render(<Carousel label='Highlights' items={items} onValueChange={onValueChange} />);
    const { viewport } = geometry();
    const capture = vi.fn();
    Object.assign(viewport, { setPointerCapture: capture });
    fireEvent.pointerDown(screen.getByText('First information'), mouseDown);
    fireEvent.pointerMove(viewport, mouseMove);
    fireEvent.pointerUp(viewport, { pointerId: 1 });
    fireEvent.mouseEnter(viewport);
    (current() as HTMLElement).focus();
    fireEvent(document, new Event('visibilitychange'));
    act(() => {
      vi.advanceTimersByTime(60_000);
    });
    expect(capture).not.toHaveBeenCalled();
    expect(onValueChange).not.toHaveBeenCalled();
    fireEvent.scroll(viewport);
    unmount();
    act(() => {
      vi.runAllTimers();
    });
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
