import { act, createEvent, fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ComponentPropsWithoutRef, createRef, forwardRef, type MouseEvent, type ReactElement } from 'react';
import { afterEach, beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { useHoverCard, useHoverCardContent, useHoverCardTrigger } from '@/molecules/hover-card/useHoverCard';
import { Gauge } from '../../atoms/gauge';
import {
  HoverCard,
  HoverCardContent,
  type HoverCardContentProps,
  type HoverCardProps,
  HoverCardTrigger,
  type HoverCardTriggerProps
} from './index';

function Preview(props: Omit<HoverCardProps, 'children'>) {
  return (
    <>
      <HoverCard {...props}>
        <HoverCardTrigger href='#details'>Usage preview</HoverCardTrigger>
        <HoverCardContent>
          <h2>Provider A</h2>
          <p>Usage: 42%. Reset: tomorrow.</p>
        </HoverCardContent>
      </HoverCard>
      <a href='#details'>Persistent usage details</a>
    </>
  );
}

function elapse(ms: number) {
  act(() => {
    vi.advanceTimersByTime(ms);
  });
}

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = vi.fn();
      unobserve = vi.fn();
      disconnect = vi.fn();
    }
  );
  vi.spyOn(document.documentElement, 'clientWidth', 'get').mockReturnValue(1024);
  vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(768);
});
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe('HoverCard v0.1 + A1', () => {
  it('opens after 700ms in a body portal and closes after 300ms (D1/D7)', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const { container } = render(<Preview onOpenChange={change} />);
    const trigger = screen.getByRole('link', { name: 'Usage preview' });
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.queryByText('Provider A')).toBeNull();
    expect(change).not.toHaveBeenCalled();
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
    elapse(699);
    expect(screen.queryByText('Provider A')).toBeNull();
    elapse(1);
    const panel = screen.getByText('Provider A').closest<HTMLElement>('.eg-hover-card');
    expect(panel).toHaveClass('eg-surface', 'bg-surface-overlay', 'p-6', 'rounded-xl');
    expect(panel).toHaveAttribute('data-state', 'open');
    expect(document.body).toContainElement(panel);
    expect(container).not.toContainElement(panel);
    expect(change).toHaveBeenLastCalledWith(true);
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    elapse(299);
    expect(panel).toBeInTheDocument();
    elapse(1);
    expect(panel).not.toBeInTheDocument();
    expect(change).toHaveBeenLastCalledWith(false);
  });

  it('cancels opening on early leave and permits pointer travel into the panel', () => {
    vi.useFakeTimers();
    render(<Preview />);
    const trigger = screen.getByRole('link', { name: 'Usage preview' });
    fireEvent.pointerEnter(trigger, { pointerType: 'pen' });
    elapse(600);
    fireEvent.pointerLeave(trigger, { pointerType: 'pen' });
    elapse(700);
    expect(screen.queryByText('Provider A')).toBeNull();
    fireEvent.pointerEnter(trigger, { pointerType: 'mouse' });
    elapse(700);
    const panel = screen.getByText('Provider A').closest<HTMLElement>('.eg-hover-card');
    expect(panel).not.toBeNull();
    fireEvent.pointerLeave(trigger, { pointerType: 'mouse' });
    if (panel) {
      fireEvent.pointerEnter(panel, { pointerType: 'mouse' });
    }
    elapse(400);
    expect(panel).toBeInTheDocument();
    if (panel) {
      fireEvent.pointerLeave(panel, { pointerType: 'mouse' });
    }
    elapse(300);
    expect(panel).not.toBeInTheDocument();
  });

  it('retains the panel while pointer-down text selection is in progress', () => {
    vi.useFakeTimers();
    render(<Preview defaultOpen={true} />);
    const text = screen.getByText('Usage: 42%. Reset: tomorrow.');
    fireEvent.pointerDown(text, { pointerType: 'mouse' });
    fireEvent.pointerLeave(text.closest('.eg-hover-card') ?? text, { pointerType: 'mouse' });
    elapse(500);
    expect(text).toBeInTheDocument();
    fireEvent.pointerUp(document);
  });

  it('opens through delayed focus, keeps normal Tab order and closes on blur (D12)', async () => {
    const user = userEvent.setup();
    render(<Preview />);
    await user.tab();
    const trigger = screen.getByRole('link', { name: 'Usage preview' });
    expect(trigger).toHaveFocus();
    expect(screen.queryByText('Provider A')).toBeNull();
    expect(await screen.findByText('Provider A')).toBeInTheDocument();
    expect(trigger).toHaveFocus();
    for (const attribute of ['aria-describedby', 'aria-controls', 'aria-expanded']) {
      expect(trigger).not.toHaveAttribute(attribute);
    }
    expect(screen.queryByRole('tooltip')).toBeNull();
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.querySelector('[aria-live]')).toBeNull();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Persistent usage details' })).toHaveFocus();
    await vi.waitFor(() => expect(screen.queryByText('Provider A')).toBeNull());
  });

  it('Escape dismisses immediately without moving focus', async () => {
    const user = userEvent.setup();
    render(<Preview defaultOpen={true} />);
    await user.tab();
    await user.keyboard('{Escape}');
    expect(screen.queryByText('Provider A')).toBeNull();
    expect(screen.getByRole('link', { name: 'Usage preview' })).toHaveFocus();
  });

  it('requests controlled changes but does not echo mount or incoming updates (D6)', () => {
    vi.useFakeTimers();
    const change = vi.fn();
    const { rerender } = render(<Preview open={false} onOpenChange={change} />);
    expect(change).not.toHaveBeenCalled();
    fireEvent.pointerEnter(screen.getByRole('link', { name: 'Usage preview' }), { pointerType: 'mouse' });
    elapse(700);
    expect(change).toHaveBeenCalledWith(true);
    expect(screen.queryByText('Provider A')).toBeNull();
    change.mockClear();
    rerender(<Preview open={true} onOpenChange={change} />);
    expect(screen.getByText('Provider A')).toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
    rerender(<Preview open={false} onOpenChange={change} />);
    expect(screen.queryByText('Provider A')).toBeNull();
    expect(change).not.toHaveBeenCalled();
  });

  it('uses defaultOpen only for initialization', () => {
    const change = vi.fn();
    const { rerender } = render(<Preview defaultOpen={true} onOpenChange={change} />);
    expect(screen.getByText('Provider A')).toBeInTheDocument();
    rerender(<Preview defaultOpen={false} onOpenChange={change} />);
    expect(screen.getByText('Provider A')).toBeInTheDocument();
    expect(change).not.toHaveBeenCalled();
  });

  it('preserves native anchor attributes, ref and pointer/keyboard activation (D4/D14)', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLAnchorElement>();
    const click = vi.fn((event: MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <HoverCard>
        <HoverCardTrigger
          href='#details'
          ref={ref}
          onClick={click}
          id='preview'
          data-source='consumer'
          target='_self'
          rel='help'
        >
          Details
        </HoverCardTrigger>
        <HoverCardContent>Preview</HoverCardContent>
      </HoverCard>
    );
    const trigger = screen.getByRole('link', { name: 'Details' });
    expect(ref.current).toBe(trigger);
    expect(trigger).toHaveAttribute('href', '#details');
    expect(trigger).toHaveAttribute('id', 'preview');
    expect(trigger).toHaveAttribute('data-source', 'consumer');
    expect(trigger).toHaveAttribute('rel', 'help');
    await user.click(trigger);
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(2);
    expect(screen.queryByText('Preview')).toBeNull();
  });

  it('composes one ref-forwarding child link without an extra anchor', () => {
    const Child = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) => (
      <a {...props} ref={ref} />
    ));
    const ref = createRef<HTMLAnchorElement>();
    render(
      <HoverCard>
        <HoverCardTrigger asChild={true} ref={ref} aria-label='Provider details'>
          <Child href='#details'>Provider</Child>
        </HoverCardTrigger>
        <HoverCardContent>Preview</HoverCardContent>
      </HoverCard>
    );
    const link = screen.getByRole('link', { name: 'Provider details' });
    expect(ref.current).toBe(link);
    expect(document.querySelectorAll('a')).toHaveLength(1);
    expect(link).toHaveAttribute('href', '#details');
    expect(link).toHaveClass('focus-visible:shadow-[var(--shadow-focus)]', 'min-h-[var(--space-10)]');
  });

  it('rejects multiple slotted children through Radix rather than inventing a wrapper', () => {
    // @ts-expect-error Deliberately violate the single-element API to exercise Radix's runtime guard.
    const invalid: HoverCardTriggerProps = {
      asChild: true,
      children: [
        <a href='#first' key='first'>
          First
        </a>,
        <a href='#second' key='second'>
          Second
        </a>
      ]
    };
    expect(() =>
      render(
        <HoverCard>
          <HoverCardTrigger {...invalid} />
        </HoverCard>
      )
    ).toThrow(/single React element child/);
  });

  it('keeps Radix native touch cancellation and an independent persistent link (A1)', () => {
    vi.useFakeTimers();
    render(<Preview />);
    const trigger = screen.getByRole('link', { name: 'Usage preview' });
    fireEvent.pointerEnter(trigger, { pointerType: 'touch' });
    elapse(1000);
    expect(screen.queryByText('Provider A')).toBeNull();
    const touch = createEvent.touchStart(trigger, { cancelable: true });
    // React delegates touchstart passively: observe Radix's cancellation request, not a
    // browser navigation outcome or native defaultPrevented in jsdom.
    const cancel = vi.spyOn(touch, 'preventDefault');
    fireEvent(trigger, touch);
    expect(cancel).toHaveBeenCalledOnce();
    const persistent = screen.getByRole('link', { name: 'Persistent usage details' });
    const independentTouch = createEvent.touchStart(persistent, { cancelable: true });
    const independentCancel = vi.spyOn(independentTouch, 'preventDefault');
    fireEvent(persistent, independentTouch);
    expect(independentCancel).not.toHaveBeenCalled();
    expect(persistent).toHaveAttribute('href', trigger.getAttribute('href'));
  });

  it('keeps Gauge passive and named inside a separately named link (D5)', () => {
    render(
      <HoverCard defaultOpen={true}>
        <HoverCardTrigger asChild={true}>
          <a href='#details' aria-label='Provider A usage details'>
            <Gauge label='Provider A usage' value={42} />
          </a>
        </HoverCardTrigger>
        <HoverCardContent>Usage: 42%. Reset: tomorrow.</HoverCardContent>
      </HoverCard>
    );
    const meter = screen.getByRole('meter', { name: 'Provider A usage' });
    expect(screen.getByRole('link', { name: 'Provider A usage details' })).toContainElement(meter);
    expect(meter).toHaveAttribute('aria-valuenow', '42');
    expect(meter).not.toHaveAttribute('tabindex');
  });

  it('forwards compatible content props but protects read-only semantics and Radix state', () => {
    const injected = {
      role: 'dialog',
      tabIndex: 0,
      contentEditable: true,
      'aria-live': 'polite',
      'data-state': 'spoofed',
      asChild: false,
      sideOffset: 200
    };
    render(
      <HoverCard defaultOpen={true}>
        <HoverCardTrigger href='#details' data-state='spoofed'>
          Details
        </HoverCardTrigger>
        <HoverCardContent {...injected} id='preview' data-source='consumer' aria-label='Usage preview'>
          Usage
        </HoverCardContent>
      </HoverCard>
    );
    const content = screen.getByText('Usage');
    expect(content).toHaveAttribute('id', 'preview');
    expect(content).toHaveAttribute('data-source', 'consumer');
    expect(content).toHaveAttribute('aria-label', 'Usage preview');
    expect(content).toHaveAttribute('data-state', 'open');
    expect(screen.getByRole('link', { name: 'Details' })).toHaveAttribute('data-state', 'open');
    for (const name of ['role', 'tabindex', 'contenteditable', 'aria-live', 'sideoffset']) {
      expect(content).not.toHaveAttribute(name);
    }
  });

  it('merges supported content layout and forwards pointer events without cloning Material', () => {
    const enter = vi.fn();
    render(
      <HoverCard defaultOpen={true}>
        <HoverCardTrigger href='#details'>Details</HoverCardTrigger>
        <HoverCardContent className='w-full mt-2' onPointerEnter={enter}>
          Usage
        </HoverCardContent>
      </HoverCard>
    );
    const panel = screen.getByText('Usage');
    expect(panel).toHaveClass('eg-hover-card', 'eg-surface', 'w-full', 'mt-2', 'p-6', 'rounded-xl');
    expect(panel).toHaveClass('shadow-[var(--shadow-edge-strong),var(--shadow-elev-3)]');
    expect(panel).not.toHaveClass('w-[calc(var(--space-24)*4)]');
    fireEvent.pointerEnter(panel, { pointerType: 'mouse' });
    expect(enter).toHaveBeenCalledOnce();
  });

  it('bounds the public types without exposing Radix internals', () => {
    expectTypeOf<{ children: string }>().not.toExtend<HoverCardTriggerProps>();
    expectTypeOf<{ asChild: true; children: string }>().not.toExtend<HoverCardTriggerProps>();
    expectTypeOf<{ asChild: true; children: ReactElement; href: string }>().not.toExtend<HoverCardTriggerProps>();
    expectTypeOf<HoverCardProps>().not.toHaveProperty('openDelay');
    expectTypeOf<HoverCardProps>().not.toHaveProperty('closeDelay');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('role');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('tabIndex');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('aria-live');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('contentEditable');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('dangerouslySetInnerHTML');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('ref');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('asChild');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('forceMount');
    expectTypeOf<HoverCardContentProps>().not.toHaveProperty('sideOffset');
  });

  it('prepares defaults, positioning constants, bounds and supported class merges in hooks', () => {
    const root = renderHook(() => useHoverCard({ children: 'Pair' }));
    expect(root.result.current).toMatchObject({ defaultOpen: false, children: 'Pair' });
    const content = renderHook(() => useHoverCardContent({ children: 'Body', className: 'w-full mt-2' }));
    expect(content.result.current).toMatchObject({ side: 'top', align: 'start', sideOffset: 8, collisionPadding: 8 });
    expect(content.result.current.className).toContain('eg-hover-card');
    expect(content.result.current.className).toContain('w-full');
    expect(content.result.current.className).not.toContain('w-[calc(var(--space-24)*4)]');
    expect(content.result.current.className).toContain('max-w-[var(--radix-hover-card-content-available-width)]');
    expect(content.result.current.className).toContain('max-h-[var(--radix-hover-card-content-available-height)]');
    expect(content.result.current.className).toContain('motion-reduce:transition-none');
    const trigger = renderHook(() => useHoverCardTrigger({ href: '#details', children: 'Details', className: 'mt-2' }));
    expect(trigger.result.current.className).toContain('mt-2');
    expect(trigger.result.current.className).toContain('pointer-coarse:min-h-[var(--space-12)]');
  });

  it.each(['top', 'right', 'bottom', 'left'] as const)('passes side %s and all alignments through the hook', (side) => {
    for (const align of ['start', 'center', 'end'] as const) {
      const { result } = renderHook(() => useHoverCardContent({ children: 'Body', side, align }));
      expect(result.current).toMatchObject({ side, align, sideOffset: 8, collisionPadding: 8 });
    }
  });
});
