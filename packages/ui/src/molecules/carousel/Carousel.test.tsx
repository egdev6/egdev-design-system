import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
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
  const scrollTo = vi.fn((options: ScrollToOptions) => {
    offset = options.left ?? offset;
  });
  Object.defineProperty(viewport, 'scrollBy', { configurable: true, value: scrollBy });
  Object.defineProperty(viewport, 'scrollTo', { configurable: true, value: scrollTo });
  Object.defineProperty(viewport, 'scrollLeft', { configurable: true, get: () => offset });
  return {
    viewport,
    scrollBy,
    scrollTo,
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

  it('repairs focus without relying on a global HTMLButtonElement constructor', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Carousel label='Highlights' items={items} value='b' />);
    const next = screen.getByRole('button', { name: 'Next slide' }) as HTMLButtonElement;
    await user.click(next);
    next.disabled = true;
    document.body.tabIndex = -1;
    document.body.focus();
    document.body.removeAttribute('tabindex');
    // Consumers may run in realms (packed SSR/CSR harnesses, iframes) without this global.
    vi.stubGlobal('HTMLButtonElement', undefined);
    try {
      rerender(<Carousel label='Highlights' items={items} value='c' />);
      expect(current()).toHaveFocus();
    } finally {
      vi.unstubAllGlobals();
    }
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
    const { scrollTo } = geometry();
    rerender(
      <>
        <button type='button'>Outside</button>
        <Carousel label='Highlights' items={items} value='c' onValueChange={onValueChange} />
      </>
    );
    expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
    expect(scrollTo).toHaveBeenCalledWith({ left: 200, behavior: 'instant' });
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
    const { viewport, scrollTo, setOffset } = geometry();
    (current() as HTMLElement).focus();
    setOffset(100);
    fireEvent.scroll(viewport);
    fireEvent(viewport, new Event('scrollend'));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'instant' });
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

  it('keeps a controlled selection when native scroll events arrive before passive effects re-run', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('c');
      return (
        <Carousel
          label='Highlights'
          items={items}
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const { viewport, scrollBy, scrollTo } = geometry();
    act(() => {
      fireEvent(window, new Event('resize'));
    });
    // Emulate WebView2: the programmatic scroll dispatches scroll and scrollend synchronously,
    // before React re-runs the passive effect that registers the native listeners.
    let dispatching = false;
    scrollTo.mockClear();
    const move = scrollTo.getMockImplementation();
    scrollTo.mockImplementation((options: ScrollToOptions) => {
      move?.(options);
      if (dispatching) {
        return;
      }
      dispatching = true;
      fireEvent.scroll(viewport);
      fireEvent(viewport, new Event('scrollend'));
      dispatching = false;
    });
    await userEvent
      .setup({ advanceTimers: vi.advanceTimersByTime })
      .click(screen.getByRole('button', { name: 'Previous slide' }));
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(onValueChange).not.toHaveBeenCalledWith('c');
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    // Only the centering toward Beta; a stale listener used to bounce the track back to Gamma.
    expect(scrollTo.mock.calls).toEqual([[{ left: 100, behavior: 'instant' }]]);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it('ignores sub-pixel alignment drift instead of nudging a mandatory snap track', () => {
    const onValueChange = vi.fn();
    render(<Carousel label='Highlights' items={items} value='a' onValueChange={onValueChange} />);
    const { scrollBy, scrollTo, setOffset } = geometry();
    // WebView2 measured a +0.0000057 px drift at 125 % scale; a relative scrollBy that small
    // made the snap track jump to the next slide.
    setOffset(-0.0000057);
    scrollBy.mockImplementation((options: ScrollToOptions) => {
      setOffset(Math.sign(options.left ?? 0) * 100);
    });
    act(() => {
      fireEvent(window, new Event('resize'));
    });
    expect(scrollBy).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});

describe('Carousel v0.2 track layout', () => {
  it.each([undefined, 'default'] as const)('preserves the padded default track and outward focus with %s', (layout) => {
    render(<Carousel label='Highlights' items={items} trackLayout={layout} />);
    expect(track()).toHaveClass('gap-7', 'p-2', 'overflow-x-auto', 'snap-x', 'snap-mandatory');
    expect(track()).not.toHaveClass('gap-0', 'p-0', '[scrollbar-width:none]', '[&::-webkit-scrollbar]:hidden');
    for (const slide of slides()) {
      expect(slide).toHaveClass('basis-full', 'snap-center', 'focus-visible:shadow-[var(--shadow-focus)]');
      expect(slide).not.toHaveClass('focus-visible:-outline-offset-(--focus-width)');
    }
  });

  it('uses a scrollable edge-to-edge viewport with hidden scrollbars and an inset slide focus indicator', () => {
    const errors = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    render(<Carousel label='Highlights' items={items} trackLayout='full-width' data-example='retained' />);
    const root = screen.getByRole('group', { name: 'Highlights' });
    expect(root).not.toHaveAttribute('tracklayout');
    expect(root).toHaveAttribute('data-example', 'retained');
    expect(errors).not.toHaveBeenCalled();
    expect(track()).toHaveClass(
      'gap-0',
      'p-0',
      'overflow-x-auto',
      'snap-x',
      'snap-mandatory',
      '[scrollbar-width:none]',
      '[&::-webkit-scrollbar]:hidden'
    );
    expect(track()).not.toHaveClass('gap-7', 'p-2');
    for (const slide of slides()) {
      expect(slide).toHaveClass(
        'basis-full',
        'snap-center',
        'focus-visible:outline-solid',
        'focus-visible:outline-(length:--focus-width)',
        'focus-visible:outline-focus-ring',
        'focus-visible:-outline-offset-(--focus-width)'
      );
      expect(slide).not.toHaveClass('focus-visible:shadow-[var(--shadow-focus)]');
    }
  });

  it('updates both parts when the layout changes without changing the accepted slide', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(<Carousel label='Highlights' items={items} value='b' onValueChange={onValueChange} />);
    rerender(
      <Carousel label='Highlights' items={items} value='b' trackLayout='full-width' onValueChange={onValueChange} />
    );
    expect(track()).toHaveClass('gap-0', 'p-0');
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    expect(current()).toHaveClass('focus-visible:-outline-offset-(--focus-width)');
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(
      <Carousel label='Highlights' items={items} value='b' trackLayout='default' onValueChange={onValueChange} />
    );
    expect(track()).toHaveClass('gap-7', 'p-2');
    expect(current()).toHaveClass('focus-visible:shadow-[var(--shadow-focus)]');
    expect(onValueChange).not.toHaveBeenCalled();
  });

  describe.each(['default', 'full-width'] as const)('%s interaction preservation', (layout) => {
    it.each(['ltr', 'rtl'] as const)('keeps bounded directional keys, focus and Tab order in %s', async (dir) => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <>
          <Carousel label='Highlights' items={items} trackLayout={layout} dir={dir} onValueChange={onValueChange} />
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
      await user.keyboard('{End}{End}{Home}{Home}');
      expect(current()).toHaveAccessibleName('1 of 3: Alpha');
      expect(onValueChange.mock.calls).toEqual([['b'], ['c'], ['a']]);
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    });

    it.each([false, true])('settles physical scrolling once in RTL %s', (rtl) => {
      vi.useFakeTimers();
      const onValueChange = vi.fn();
      render(
        <Carousel
          label='Highlights'
          items={items}
          trackLayout={layout}
          dir={rtl ? 'rtl' : 'ltr'}
          onValueChange={onValueChange}
        />
      );
      const { viewport, setOffset } = geometry(rtl);
      setOffset(rtl ? -100 : 100);
      fireEvent.scroll(viewport);
      act(() => vi.advanceTimersByTime(200));
      fireEvent(viewport, new Event('scrollend'));
      expect(current()).toHaveAccessibleName('2 of 3: Beta');
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    });

    it('realigns a rejected controlled scroll without duplicate requests or focus changes', () => {
      const onValueChange = vi.fn();
      render(
        <Carousel label='Highlights' items={items} trackLayout={layout} value='a' onValueChange={onValueChange} />
      );
      const { viewport, scrollTo, setOffset } = geometry();
      (current() as HTMLElement).focus();
      setOffset(100);
      fireEvent.scroll(viewport);
      fireEvent(viewport, new Event('scrollend'));
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
      expect(scrollTo).toHaveBeenLastCalledWith({ left: 0, behavior: 'instant' });
      expect(current()).toHaveAccessibleName('1 of 3: Alpha');
      expect(current()).toHaveFocus();
      expect(screen.getByRole('status')).toBeEmptyDOMElement();
    });

    it('cancels and commits mouse drags without extra requests', () => {
      const onValueChange = vi.fn();
      render(<Carousel label='Highlights' items={items} trackLayout={layout} onValueChange={onValueChange} />);
      const { viewport, scrollBy, scrollTo } = geometry();
      const release = vi.fn();
      Object.assign(viewport, {
        setPointerCapture: vi.fn(),
        releasePointerCapture: release,
        hasPointerCapture: () => true
      });
      fireEvent.pointerDown(viewport, mouseDown);
      fireEvent.pointerMove(viewport, mouseMove);
      fireEvent.pointerCancel(viewport, { pointerId: 1 });
      expect(scrollBy).toHaveBeenCalledWith({ left: 100, behavior: 'instant' });
      expect(scrollTo).toHaveBeenCalledWith({ left: 0, behavior: 'instant' });
      expect(onValueChange).not.toHaveBeenCalled();
      expect(current()).toHaveAccessibleName('1 of 3: Alpha');
      fireEvent.pointerDown(viewport, mouseDown);
      fireEvent.pointerMove(viewport, mouseMove);
      fireEvent.pointerUp(viewport, { pointerId: 1 });
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
      expect(current()).toHaveAccessibleName('2 of 3: Beta');
      expect(release).toHaveBeenCalledTimes(2);
    });

    it('retains safe empty, invalid and single-item boundaries', () => {
      const warning = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
      const onValueChange = vi.fn();
      const { rerender } = render(
        <Carousel label='Highlights' items={[]} trackLayout={layout} onValueChange={onValueChange} />
      );
      expect(counterWith('00 / 00')).toBeVisible();
      expect(screen.getByText('No slides')).toBeVisible();
      expect(screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
      rerender(
        <Carousel label='Highlights' items={[items[0], items[0]]} trackLayout={layout} onValueChange={onValueChange} />
      );
      expect(screen.getByText('No slides')).toBeVisible();
      expect(warning).toHaveBeenCalledOnce();
      rerender(<Carousel label='Highlights' items={[items[0]]} trackLayout={layout} onValueChange={onValueChange} />);
      expect(counterWith('01 / 01')).toBeVisible();
      expect(current()).toHaveAttribute('tabindex', '0');
      expect(screen.getAllByRole('button').every((button) => (button as HTMLButtonElement).disabled)).toBe(true);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('preserves identity on reorder and repairs focus when the selected item is removed', () => {
      const onValueChange = vi.fn();
      const { rerender } = render(
        <Carousel
          label='Highlights'
          items={items}
          defaultValue='b'
          trackLayout={layout}
          onValueChange={onValueChange}
        />
      );
      (current() as HTMLElement).focus();
      rerender(
        <Carousel
          label='Highlights'
          items={[items[1], items[0], items[2]]}
          trackLayout={layout}
          onValueChange={onValueChange}
        />
      );
      expect(current()).toHaveAccessibleName('1 of 3: Beta');
      expect(current()).toHaveFocus();
      rerender(<Carousel label='Highlights' items={[items[0]]} trackLayout={layout} onValueChange={onValueChange} />);
      expect(current()).toHaveAccessibleName('1 of 1: Alpha');
      expect(current()).toHaveFocus();
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it.each(['touch', 'pen'] as const)('leaves native %s input uncaptured', (pointerType) => {
      render(<Carousel label='Highlights' items={items} trackLayout={layout} />);
      const { viewport } = geometry();
      const capture = vi.fn();
      Object.assign(viewport, { setPointerCapture: capture });
      fireEvent.pointerDown(viewport, { ...mouseDown, pointerType });
      fireEvent.pointerMove(viewport, { ...mouseMove, pointerType });
      expect(capture).not.toHaveBeenCalled();
      expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    });

    it('never advances on idle, hover, focus or visibility changes', () => {
      vi.useFakeTimers();
      const onValueChange = vi.fn();
      render(<Carousel label='Highlights' items={items} trackLayout={layout} onValueChange={onValueChange} />);
      fireEvent.mouseEnter(track());
      (current() as HTMLElement).focus();
      fireEvent(document, new Event('visibilitychange'));
      act(() => vi.advanceTimersByTime(60_000));
      expect(current()).toHaveAccessibleName('1 of 3: Alpha');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it('silently realigns accepted geometry on resize', () => {
      const onValueChange = vi.fn();
      render(
        <Carousel label='Highlights' items={items} trackLayout={layout} value='b' onValueChange={onValueChange} />
      );
      const { scrollTo } = geometry();
      fireEvent(window, new Event('resize'));
      expect(scrollTo).toHaveBeenCalledWith({ left: 100, behavior: 'instant' });
      expect(current()).toHaveAccessibleName('2 of 3: Beta');
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  it('keeps a full-width controlled selection with synchronous WebView2 scroll listeners', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const onValueChange = vi.fn();
    function Controlled() {
      const [value, setValue] = useState('c');
      return (
        <Carousel
          label='Highlights'
          items={items}
          trackLayout='full-width'
          value={value}
          onValueChange={(next) => {
            onValueChange(next);
            setValue(next);
          }}
        />
      );
    }
    render(<Controlled />);
    const { viewport, scrollBy, scrollTo } = geometry();
    act(() => {
      fireEvent(window, new Event('resize'));
    });
    let dispatching = false;
    scrollTo.mockClear();
    const move = scrollTo.getMockImplementation();
    scrollTo.mockImplementation((options: ScrollToOptions) => {
      move?.(options);
      if (dispatching) {
        return;
      }
      dispatching = true;
      fireEvent.scroll(viewport);
      fireEvent(viewport, new Event('scrollend'));
      dispatching = false;
    });
    await userEvent
      .setup({ advanceTimers: vi.advanceTimersByTime })
      .click(screen.getByRole('button', { name: 'Previous slide' }));
    act(() => vi.advanceTimersByTime(500));
    expect(onValueChange).toHaveBeenCalledExactlyOnceWith('b');
    expect(current()).toHaveAccessibleName('2 of 3: Beta');
    expect(scrollTo.mock.calls).toEqual([[{ left: 100, behavior: 'instant' }]]);
    expect(scrollBy).not.toHaveBeenCalled();
  });

  it('ignores full-width sub-pixel WebView2 alignment drift', () => {
    const onValueChange = vi.fn();
    render(
      <Carousel label='Highlights' items={items} trackLayout='full-width' value='a' onValueChange={onValueChange} />
    );
    const { scrollBy, scrollTo, setOffset } = geometry();
    setOffset(-0.0000057);
    scrollBy.mockImplementation((options: ScrollToOptions) => setOffset(Math.sign(options.left ?? 0) * 100));
    act(() => {
      fireEvent(window, new Event('resize'));
    });
    expect(scrollBy).not.toHaveBeenCalled();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(current()).toHaveAccessibleName('1 of 3: Alpha');
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
