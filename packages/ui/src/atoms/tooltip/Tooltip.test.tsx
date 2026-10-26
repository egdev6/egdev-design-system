import { act, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Tooltip } from './Tooltip';
import { tooltipVariants } from './types';
import { TOOLTIP_SIDE_OFFSET, useTooltip } from './useTooltip';

// jsdom has no layout engine: Radix Popper measures through ResizeObserver and DOMRect.
class ResizeObserverStub {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

function placeTrigger(trigger: HTMLElement, top: number) {
  vi.spyOn(trigger, 'getBoundingClientRect').mockReturnValue(
    DOMRect.fromRect({ x: 480, y: top, width: 40, height: 40 })
  );
}

const recipe = [
  'eg-tooltip',
  'box-border',
  'px-2',
  'py-1',
  'rounded-sm',
  'bg-surface-overlay',
  'backdrop-blur-[var(--blur-overlay)]',
  'backdrop-saturate-150',
  'border',
  'border-border-hairline-strong',
  'shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]',
  'text-label-default',
  'font-sans',
  'text-fg-default',
  'max-w-[var(--radix-tooltip-content-available-width)]',
  '[@media(prefers-reduced-transparency:reduce)]:bg-surface-2',
  '[@media(prefers-reduced-transparency:reduce)]:backdrop-blur-none',
  '[@media(prefers-reduced-transparency:reduce)]:backdrop-saturate-100',
  'transition-opacity',
  'duration-[var(--duration-fast)]',
  'ease-[var(--ease-out)]',
  'starting:opacity-0',
  'motion-reduce:transition-none'
];

// Delay tests dispatch pointer events synchronously: user-event runs through Testing Library's
// async wrapper, which awaits a real setTimeout and deadlocks under Vitest fake timers.
type PointerKind = 'pointerMove' | 'pointerLeave' | 'pointerDown';
function pointer(target: Element, kind: PointerKind, init: PointerEventInit = {}) {
  act(() => {
    fireEvent[kind](target, { pointerType: 'mouse', ...init });
  });
}

function elapse(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.stubGlobal('ResizeObserver', ResizeObserverStub);
  // jsdom reports a 0x0 viewport, which makes floating-ui flip every side.
  vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
  vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('Tooltip', () => {
  it('opens on hover after the Radix default delay and describes the trigger (AC-01, AC-08)', () => {
    vi.useFakeTimers();
    // No app-level provider: each Tooltip renders its own (D3).
    render(
      <Tooltip content='Search'>
        <button type='button'>Find</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button', { name: 'Find' });
    pointer(trigger, 'pointerMove');
    expect(screen.queryByRole('tooltip')).toBeNull();
    elapse(700);
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Search');
    expect(tooltip).toHaveAttribute('data-state', 'delayed-open');
    expect(trigger).toHaveAttribute('aria-describedby', tooltip.id);
    expect(tooltip.id).not.toBe('');
  }, 10_000);

  it('stays closed before the open delay elapses (D6)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content='Search'>
        <button type='button'>Find</button>
      </Tooltip>
    );
    pointer(screen.getByRole('button', { name: 'Find' }), 'pointerMove');
    elapse(650);
    expect(screen.queryByRole('tooltip')).toBeNull();
    elapse(50);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
  }, 10_000);

  it('closes when the pointer leaves or the trigger is pressed (AC-03)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content='Search'>
        <button type='button'>Find</button>
      </Tooltip>
    );
    const trigger = screen.getByRole('button', { name: 'Find' });
    placeTrigger(trigger, 400);
    pointer(trigger, 'pointerMove');
    elapse(700);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    // Leaving the trigger away from the bubble, then moving on, ends the hover grace area.
    pointer(trigger, 'pointerLeave', { clientX: 900, clientY: 700 });
    pointer(document.body, 'pointerMove', { clientX: 900, clientY: 700 });
    expect(screen.queryByRole('tooltip')).toBeNull();

    pointer(trigger, 'pointerMove');
    elapse(700);
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    pointer(trigger, 'pointerDown');
    expect(screen.queryByRole('tooltip')).toBeNull();
  }, 10_000);

  it('closes when the focused trigger blurs (AC-03)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Tooltip content='Search'>
          <button type='button'>Find</button>
        </Tooltip>
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Find' })).toHaveFocus();
    expect(await screen.findByRole('tooltip')).toBeInTheDocument();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    expect(screen.queryByRole('tooltip')).toBeNull();
  }, 10_000);

  it('ignores touch pointers (Behavior: touch tap)', () => {
    vi.useFakeTimers();
    render(
      <Tooltip content='Search'>
        <button type='button'>Find</button>
      </Tooltip>
    );
    pointer(screen.getByRole('button', { name: 'Find' }), 'pointerMove', { pointerType: 'touch' });
    elapse(1000);
    expect(screen.queryByRole('tooltip')).toBeNull();
  }, 10_000);

  it('opens instantly on keyboard focus and closes on Escape without moving focus (AC-02)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content='Close panel'>
        <button type='button' aria-label='Close'>
          ×
        </button>
      </Tooltip>
    );
    await user.tab();
    const trigger = screen.getByRole('button', { name: 'Close' });
    expect(trigger).toHaveFocus();
    const tooltip = await screen.findByRole('tooltip');
    expect(tooltip).toHaveAttribute('data-state', 'instant-open');
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(trigger).toHaveFocus();
    expect(trigger).not.toHaveAttribute('aria-describedby');
  }, 10_000);

  it("keeps the trigger's own accessible name and props (AC-04)", async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content='Search the catalogue'>
        <button type='button' aria-label='Search' id='search-trigger' data-source='consumer'>
          ⌕
        </button>
      </Tooltip>
    );
    await user.tab();
    await screen.findByRole('tooltip');
    const trigger = screen.getByRole('button', { name: 'Search' });
    expect(trigger).toHaveAccessibleName('Search');
    expect(trigger).toHaveAccessibleDescription('Search the catalogue');
    expect(trigger).toHaveAttribute('id', 'search-trigger');
    expect(trigger).toHaveAttribute('data-source', 'consumer');
    // asChild: the consumer element is the trigger itself, with no wrapper.
    expect(trigger.parentElement).toBe(document.body.firstElementChild);
  }, 10_000);

  it('places the content on the top side by default, 8px away (AC-05)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content='Search'>
        <button type='button'>Find</button>
      </Tooltip>
    );
    placeTrigger(screen.getByRole('button', { name: 'Find' }), 400);
    await user.tab();
    expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', 'top');
    expect(TOOLTIP_SIDE_OFFSET).toBe(8);
  }, 10_000);

  it.each(['right', 'bottom', 'left'] as const)(
    'passes side=%s to Radix (AC-05)',
    async (side) => {
      const user = userEvent.setup();
      render(
        <Tooltip content='egdev-publish, running' side={side}>
          <button type='button'>Module</button>
        </Tooltip>
      );
      placeTrigger(screen.getByRole('button', { name: 'Module' }), 400);
      await user.tab();
      expect(await screen.findByRole('tooltip')).toHaveAttribute('data-side', side);
    },
    10_000
  );

  it('flips to the opposite side when the preferred side has no room (Behavior: collision)', async () => {
    const user = userEvent.setup();
    render(
      <Tooltip content='Search'>
        <button type='button'>Find</button>
      </Tooltip>
    );
    placeTrigger(screen.getByRole('button', { name: 'Find' }), 0);
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    await vi.waitFor(() => expect(tooltip).toHaveAttribute('data-side', 'bottom'));
  }, 10_000);

  it('portals the overlay recipe under document.body and merges consumer className last (AC-06, AC-07)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <Tooltip content='Two lines of supplementary text' className='text-center'>
        <button type='button'>Info</button>
      </Tooltip>
    );
    await user.tab();
    const tooltip = await screen.findByRole('tooltip');
    expect(container).not.toContainElement(tooltip);
    expect(tooltip.closest('[data-radix-popper-content-wrapper]')?.parentElement).toBe(document.body);
    expect(tooltip).toHaveClass(...recipe, 'text-center');
    expect(tooltip.className.split(' ').at(-1)).toBe('text-center');
    expect(tooltip.className.split(' ')[0]).toBe('eg-tooltip');
  }, 10_000);

  it('declares the overlay recipe in a static CVA base without arrow, z-index or transforms (D8-D12)', () => {
    const classes = tooltipVariants().split(' ');
    expect(classes).toEqual(recipe);
    expect(tooltipVariants()).not.toMatch(/\bz-|translate|scale|animate-|arrow/);
  });

  it('derives Radix content props in the hook and leaves the trigger untouched', () => {
    const trigger = <button type='button'>Find</button>;
    const { result } = renderHook(() => useTooltip({ content: 'Search', children: trigger, className: 'text-center' }));
    expect(result.current.trigger).toBe(trigger);
    expect(result.current.content).toBe('Search');
    expect(result.current.contentProps).toEqual({
      side: 'top',
      align: 'center',
      sideOffset: 8,
      className: `${tooltipVariants()} text-center`
    });
    const { result: left } = renderHook(() => useTooltip({ content: 'Search', children: trigger, side: 'left' }));
    expect(left.current.contentProps.side).toBe('left');
    expect(left.current.contentProps.className).toBe(tooltipVariants());
  });
});
