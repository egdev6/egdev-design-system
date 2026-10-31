import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Indicator } from './Indicator.js';
import * as publicExports from './index.js';
import type { IndicatorProps } from './types.js';
import { useIndicator } from './useIndicator.js';

// These cases deliberately cross the untyped caller boundary, never the supported TypeScript API.
const untyped = (props: Record<string, unknown>): IndicatorProps => props as unknown as IndicatorProps;

describe('Indicator contract', () => {
  it('caps a valid supplementary count without changing the child name', () => {
    render(
      <Indicator variant='count' count={100}>
        <button type='button' aria-label='Inbox, 100 unread messages'>
          Inbox
        </button>
      </Indicator>
    );
    expect(screen.getByText('99+')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.getByRole('button', { name: 'Inbox, 100 unread messages' })).toBeInTheDocument();
  });

  it('derives danger/sm/top-right dot defaults and composes every part in the hook', () => {
    const { result } = renderHook(() => useIndicator({ children: 'Anchor' }));
    expect(result.current.rootProps).toMatchObject({
      'data-variant': 'dot',
      'data-tone': 'danger',
      'data-size': 'sm',
      'data-position': 'top-right'
    });
    expect(result.current.rootProps.className).toContain('eg-indicator');
    expect(result.current.showMarker).toBe(true);
    expect(result.current.markerProps['aria-hidden']).toBe(true);
    expect(result.current.markerProps.className.split(' ')).toEqual(
      expect.arrayContaining([
        'absolute',
        'size-2',
        '-top-1',
        '-right-1',
        'bg-status-danger',
        'text-fg-on-status',
        'pointer-events-none'
      ])
    );
    expect(result.current.countText).toBeUndefined();
    expect(result.current.glyphProps).toBeNull();
  });

  it('renders direct ordered children before an empty hidden marker, without extra semantics', () => {
    const { container } = render(
      <Indicator>
        <>
          <button type='button'>First</button>
          <section>Second</section>
        </>
      </Indicator>
    );
    const anchor = container.firstElementChild;
    expect(anchor?.tagName).toBe('DIV');
    expect(anchor).toHaveClass('eg-indicator', 'relative', 'inline-flex', 'align-middle', 'overflow-visible');
    expect(anchor?.children).toHaveLength(3);
    expect(anchor?.firstElementChild).toBe(screen.getByRole('button'));
    const marker = anchor?.lastElementChild;
    expect(marker?.tagName).toBe('SPAN');
    expect(marker).toHaveAttribute('aria-hidden', 'true');
    expect(marker).toBeEmptyDOMElement();
    for (const attribute of ['role', 'aria-hidden', 'aria-label', 'aria-live', 'tabindex', 'data-state', 'style']) {
      expect(anchor).not.toHaveAttribute(attribute);
    }
    expect(marker).not.toHaveAttribute('tabindex');
  });

  it.each([null, undefined, false, ''])('accepts empty child content %s without inventing meaning', (children) => {
    const { container } = render(<Indicator>{children}</Indicator>);
    expect(container.firstElementChild).toHaveClass('eg-indicator');
    expect(container.firstElementChild?.children).toHaveLength(1);
    expect(screen.queryByRole('img')).toBeNull();
  });

  it.each([
    [1, undefined, '1'],
    [99, undefined, '99'],
    [100, undefined, '99+'],
    [1, 1, '1'],
    [2, 1, '1+'],
    [9, 9, '9'],
    [10, 9, '9+'],
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER, '9007199254740991'],
    [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER - 1, '9007199254740990+']
  ] as const)('renders count %s with max %s as ASCII %s', (count, max, text) => {
    render(
      <Indicator variant='count' count={count} max={max}>
        Anchor
      </Indicator>
    );
    const marker = screen.getByText(text);
    expect(marker).toHaveAttribute('aria-hidden', 'true');
    expect(marker.textContent).toMatch(/^[0-9]+\+?$/);
    expect(marker).toHaveClass(
      'w-auto',
      'px-1',
      'py-0',
      'whitespace-nowrap',
      'font-sans',
      'text-label-default',
      'tabular-nums'
    );
    expect(marker).not.toHaveAttribute('style');
  });

  it.each([undefined, null, 0, -0, -1, 0.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1, '2', true, {}, 1n])(
    'suppresses only the marker for invalid/zero count %s',
    (count) => {
      const { container } = render(<Indicator {...untyped({ variant: 'count', count })}>Anchor</Indicator>);
      expect(container.firstElementChild).toHaveClass('eg-indicator');
      expect(container.firstElementChild).toHaveTextContent('Anchor');
      expect(container.firstElementChild?.querySelector('span')).toBeNull();
    }
  );

  it.each([undefined, null, 0, -0, -1, 0.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1, '1', true, {}, 1n])(
    'uses max99 without rejecting count100 for invalid threshold %s',
    (max) => {
      render(<Indicator {...untyped({ variant: 'count', count: 100, max })}>Anchor</Indicator>);
      expect(screen.getByText('99+')).toHaveAttribute('aria-hidden', 'true');
    }
  );

  it('preserves anchor, focused input and its content through suppression and branch changes', async () => {
    const user = userEvent.setup();
    const child = <input aria-label='Draft' defaultValue='Keep' />;
    const { container, rerender } = render(
      <Indicator variant='count' count={1}>
        {child}
      </Indicator>
    );
    const root = container.firstElementChild;
    const input = screen.getByRole('textbox', { name: 'Draft' });
    await user.type(input, ' me');
    for (const count of [0, NaN, 100]) {
      rerender(
        <Indicator variant='count' count={count}>
          {child}
        </Indicator>
      );
      expect(container.firstElementChild).toBe(root);
      expect(screen.getByRole('textbox')).toBe(input);
      expect(input).toHaveValue('Keep me');
      expect(input).toHaveFocus();
    }
    rerender(
      <Indicator variant='icon' badgeIcon='linkedin'>
        {child}
      </Indicator>
    );
    expect(screen.getByRole('textbox')).toBe(input);
    expect(input).toHaveFocus();
  });

  it.each([
    ['top-left', '-top-1', '-left-1'],
    ['top-right', '-top-1', '-right-1'],
    ['bottom-left', '-bottom-1', '-left-1'],
    ['bottom-right', '-bottom-1', '-right-1']
  ] as const)('keeps physical %s offsets unchanged in RTL', (position, vertical, horizontal) => {
    const { container, rerender } = render(
      <Indicator position={position} dir='ltr'>
        Anchor
      </Indicator>
    );
    const marker = container.firstElementChild?.lastElementChild;
    const classes = marker?.className;
    expect(marker).toHaveClass(vertical, horizontal);
    rerender(
      <Indicator position={position} dir='rtl'>
        Anchor
      </Indicator>
    );
    expect(container.firstElementChild).toHaveAttribute('dir', 'rtl');
    expect(container.firstElementChild?.lastElementChild).toBe(marker);
    expect(marker?.className).toBe(classes);
    expect(classes).not.toMatch(/translate|(?:start|end)-/);
  });

  it.each([
    ['sm', 'size-2', 'size-4.5', 'min-h-4.5', 'min-w-4.5', 'size-2.75'],
    ['md', 'size-2.5', 'size-5.5', 'min-h-5.5', 'min-w-5.5', 'size-3.25']
  ] as const)(
    'selects %s geometry and leaves count height as a text-zoom-safe minimum',
    (size, dot, icon, minHeight, minWidth, glyph) => {
      const { container, rerender } = render(<Indicator size={size}>Anchor</Indicator>);
      expect(container.firstElementChild?.lastElementChild).toHaveClass(dot);
      rerender(
        <Indicator variant='icon' badgeIcon='linkedin' size={size}>
          Anchor
        </Indicator>
      );
      const marker = container.firstElementChild?.lastElementChild;
      expect(marker).toHaveClass(icon);
      expect(marker?.querySelector('svg')).toHaveClass(glyph);
      expect(marker?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(marker?.querySelector('svg')).toHaveAttribute('focusable', 'false');
      rerender(
        <Indicator variant='count' count={12345} max={9999} size={size}>
          Anchor
        </Indicator>
      );
      expect(screen.getByText('9999+')).toHaveClass(minHeight, minWidth);
      expect(screen.getByText('9999+')).not.toHaveClass(icon);
    }
  );

  it.each([
    ['neutral', 'bg-bg-canvas', 'text-fg-default'],
    ['info', 'bg-status-info', 'text-fg-on-status'],
    ['success', 'bg-status-success', 'text-fg-on-status'],
    ['warning', 'bg-status-warning', 'text-fg-on-status'],
    ['danger', 'bg-status-danger', 'text-fg-on-status'],
    ['brand', 'bg-action-primary-solid-bg', 'text-action-primary-solid-fg']
  ] as const)('supports %s on every branch with the Indicator-only token recipe', (tone, fill, ink) => {
    const { container, rerender } = render(<Indicator tone={tone}>Anchor</Indicator>);
    const checkPaint = () => {
      const marker = container.firstElementChild?.lastElementChild;
      expect(marker).toHaveClass(fill, ink, 'box-border', 'rounded-full', 'pointer-events-none', 'select-none');
      expect(marker).toHaveClass('border-[length:var(--border-width)]', 'border-solid', 'border-border-hairline');
      expect(marker).toHaveClass(
        'bg-[image:var(--gradient-sheen)]',
        'outline-[length:var(--focus-width)]',
        'outline-solid',
        'outline-bg-surface',
        'outline-offset-0'
      );
      expect(container.firstElementChild?.className).not.toMatch(/bg-|shadow-|border-|outline-/);
      return marker;
    };
    expect(checkPaint()).toHaveClass('shadow-[var(--shadow-edge)]');
    rerender(
      <Indicator tone={tone} variant='count' count={1}>
        Anchor
      </Indicator>
    );
    expect(checkPaint()).toHaveClass('shadow-[var(--shadow-edge),var(--shadow-elev-1)]');
    rerender(
      <Indicator tone={tone} variant='icon' badgeIcon='user'>
        Anchor
      </Indicator>
    );
    expect(checkPaint()).toHaveClass('shadow-[var(--shadow-edge),var(--shadow-elev-1)]');
  });

  it('filters exactly the protected native surface and never alters the child', () => {
    const ref = createRef<HTMLDivElement>();
    const forbidden = {
      role: 'status',
      style: { opacity: 0 },
      tabIndex: 0,
      contentEditable: true,
      autoFocus: true,
      'aria-hidden': true,
      'aria-label': 'Wrong',
      'aria-labelledby': 'wrong',
      'aria-live': 'polite',
      'aria-atomic': true,
      'aria-relevant': 'all',
      dangerouslySetInnerHTML: { __html: '<b>Wrong</b>' },
      asChild: true,
      ref,
      'data-variant': 'icon',
      'data-tone': 'brand',
      'data-size': 'md',
      'data-position': 'bottom-left'
    };
    const { container } = render(
      <Indicator
        {...untyped(forbidden)}
        id='anchor'
        title='Details'
        aria-describedby='hint'
        data-owner='consumer'
        className='ms-1 ms-2'
      >
        <button type='button' aria-label='Original'>
          Child
        </button>
      </Indicator>
    );
    const anchor = container.firstElementChild;
    expect(anchor).toHaveAttribute('id', 'anchor');
    expect(anchor).toHaveAttribute('title', 'Details');
    expect(anchor).toHaveAttribute('aria-describedby', 'hint');
    expect(anchor).toHaveAttribute('data-owner', 'consumer');
    expect(anchor).toHaveAttribute('data-variant', 'dot');
    expect(anchor).toHaveAttribute('data-tone', 'danger');
    expect(anchor).toHaveAttribute('data-size', 'sm');
    expect(anchor).toHaveAttribute('data-position', 'top-right');
    expect(anchor).toHaveClass('eg-indicator', 'relative', 'inline-flex', 'overflow-visible', 'ms-2');
    expect(anchor).not.toHaveClass('ms-1');
    for (const key of [
      'role',
      'style',
      'tabindex',
      'contenteditable',
      'autofocus',
      'aria-hidden',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-atomic',
      'aria-relevant',
      'asChild',
      'count',
      'max',
      'badgeIcon',
      'variant',
      'tone',
      'size',
      'position'
    ]) {
      expect(anchor).not.toHaveAttribute(key);
    }
    expect(ref.current).toBeNull();
    expect(screen.queryByText('Wrong')).toBeNull();
    expect(screen.getByRole('button', { name: 'Original' })).not.toHaveAttribute('aria-hidden');
  });

  it('leaves click/keyboard/focus/disabled behavior with the original child and native bubbling', async () => {
    const user = userEvent.setup();
    const childClick = vi.fn();
    const anchorClick = vi.fn();
    const { rerender } = render(
      <>
        <Indicator variant='count' count={100} onClick={anchorClick}>
          <button type='button' onClick={childClick}>
            Inbox
          </button>
        </Indicator>
        <button type='button'>After</button>
      </>
    );
    const button = screen.getByRole('button', { name: 'Inbox' });
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter} ');
    await user.click(button);
    expect(childClick).toHaveBeenCalledTimes(3);
    expect(anchorClick).toHaveBeenCalledTimes(3);
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    rerender(
      <Indicator>
        <button type='button' disabled={true} onClick={childClick}>
          Inbox
        </button>
      </Indicator>
    );
    await user.click(screen.getByRole('button', { name: 'Inbox' }));
    expect(childClick).toHaveBeenCalledTimes(3);
  });

  it('keeps SSR passive and exposes only the named component as a runtime export', () => {
    const html = renderToString(
      <Indicator variant='count' count={100}>
        <button type='button'>Inbox</button>
      </Indicator>
    );
    expect(html).toContain('99+');
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toMatch(/aria-live|role=|tabindex=|style=/);
    expect(Object.keys(publicExports)).toEqual(['Indicator']);
  });

  it('retains the exact branch and native exclusions in its type contract', () => {
    expectTypeOf<{ children: string }>().toMatchTypeOf<IndicatorProps>();
    expectTypeOf<{ children: string; variant: 'count'; count: number; max: number }>().toMatchTypeOf<IndicatorProps>();
    expectTypeOf<{ children: string; variant: 'icon'; badgeIcon: 'linkedin' }>().toMatchTypeOf<IndicatorProps>();
    expectTypeOf<{ children: string; count: number }>().not.toMatchTypeOf<IndicatorProps>();
    expectTypeOf<{ children: string; variant: 'count' }>().not.toMatchTypeOf<IndicatorProps>();
    expectTypeOf<{
      children: string;
      variant: 'icon';
      badgeIcon: 'not-a-system-glyph';
    }>().not.toMatchTypeOf<IndicatorProps>();
    expectTypeOf<{
      children: string;
      variant: 'count';
      count: number;
      badgeIcon: 'user';
    }>().not.toMatchTypeOf<IndicatorProps>();
    expectTypeOf<{
      children: string;
      variant: 'icon';
      badgeIcon: 'user';
      max: number;
    }>().not.toMatchTypeOf<IndicatorProps>();
    expectTypeOf<IndicatorProps>().not.toHaveProperty('style');
    expectTypeOf<IndicatorProps>().not.toHaveProperty('ref');
    expectTypeOf<IndicatorProps>().not.toHaveProperty('asChild');
  });
});
