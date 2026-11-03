import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Pixel } from './Pixel';
import type { PixelProps, PixelState } from './types';
import { usePixel } from './usePixel';

const states: [PixelState, string][] = [
  ['idle', 'bg-fg-default/18'],
  ['past', 'bg-bg-deep'],
  ['active', 'bg-fg-brand-default']
];
const geometry = '[clip-path:polygon(0_0,100%_33.8%,100%_100%,0_66.2%)]';

function pixel(container: HTMLElement) {
  const element = container.querySelector('.eg-pixel');
  if (!element) {
    throw new Error('Missing Pixel root');
  }
  return element;
}

describe('Pixel', () => {
  it('excludes protected props and event handlers from the public type', () => {
    expectTypeOf<
      Extract<
        keyof PixelProps,
        | 'children'
        | 'dangerouslySetInnerHTML'
        | 'role'
        | 'aria-hidden'
        | 'aria-label'
        | 'aria-labelledby'
        | 'data-state'
        | 'tabIndex'
        | 'contentEditable'
        | 'onClick'
        | 'onKeyDown'
      >
    >().toEqualTypeOf<never>();
    expectTypeOf<PixelProps['state']>().toEqualTypeOf<PixelState | undefined>();
  });

  it('derives protected root props and classes in the hook', () => {
    const { result } = renderHook(() => usePixel({ state: 'past', id: 'marker' }));
    expect(result.current.rootProps).toMatchObject({ id: 'marker', 'aria-hidden': true, 'data-state': 'past' });
    expect(result.current.rootProps).not.toHaveProperty('state');
    expect(result.current.rootProps.className.split(' ')).toContain('bg-bg-deep');
  });
  it('renders one empty hidden idle span and updates each state with the exact utilities', () => {
    const { container, rerender } = render(<Pixel />);
    const root = pixel(container);
    expect(container.children).toHaveLength(1);
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-state', 'idle');
    expect(root.childNodes).toHaveLength(0);
    for (const [state, fill] of states) {
      rerender(<Pixel state={state} />);
      expect(root).toHaveAttribute('data-state', state);
      expect(root).toHaveClass(
        'eg-pixel',
        'inline-block',
        'flex-none',
        'w-2',
        'h-3',
        geometry,
        'filter-none',
        'transition-none',
        fill
      );
      for (const [, other] of states.filter(([candidate]) => candidate !== state)) {
        expect(root).not.toHaveClass(other);
      }
      expect(root).not.toHaveClass('is-active');
      expect(root).not.toHaveClass('is-past');
      expect(root.className).not.toMatch(/(?:drop-shadow|shadow-glow|animate-)/);
    }
  });

  it('discards injected semantics, content, focus, and event handlers while forwarding compatible attributes, including SSR', () => {
    const handler = vi.fn();
    const injected = {
      children: 'injected',
      dangerouslySetInnerHTML: { __html: 'injected' },
      role: 'button',
      'aria-hidden': false,
      'aria-label': 'injected',
      'aria-labelledby': 'other',
      'data-state': 'active',
      tabIndex: 0,
      contentEditable: true,
      onClick: handler,
      onKeyDown: handler,
      id: 'marker',
      title: 'placement',
      'data-source': 'host'
    };
    const { container } = render(<Pixel {...injected} state='past' />);
    const root = pixel(container);
    expect(root).toHaveAttribute('aria-hidden', 'true');
    expect(root).toHaveAttribute('data-state', 'past');
    expect(root).toHaveAttribute('id', 'marker');
    expect(root).toHaveAttribute('title', 'placement');
    expect(root).toHaveAttribute('data-source', 'host');
    for (const attr of ['role', 'aria-label', 'aria-labelledby', 'tabindex', 'contenteditable']) {
      expect(root).not.toHaveAttribute(attr);
    }
    expect(root.childNodes).toHaveLength(0);
    fireEvent.click(root);
    fireEvent.keyDown(root, { key: 'Enter' });
    expect(handler).not.toHaveBeenCalled();
    const html = renderToStaticMarkup(<Pixel {...injected} state='past' />);
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('data-state="past"');
    expect(html).not.toMatch(/injected|tabindex|contenteditable|role=/i);
  });

  it('preserves the marker and state when composing supported placement classes', () => {
    const { container } = render(<Pixel state='active' className='absolute top-1 consumer-marker' />);
    expect(pixel(container)).toHaveClass('eg-pixel', 'bg-fg-brand-default', 'absolute', 'top-1', 'consumer-marker');
  });

  it('leaves host text and current navigation meaningful and skips markers on tab', async () => {
    const user = userEvent.setup();
    render(
      <nav aria-label='Sections'>
        <a href='#one' aria-current='page'>
          <Pixel state='active' />
          Overview
        </a>
        <a href='#two'>
          <Pixel />
          Details
        </a>
      </nav>
    );
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveAttribute('aria-current', 'page');
    await user.tab();
    expect(screen.getByRole('link', { name: 'Overview' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('link', { name: 'Details' })).toHaveFocus();
  });
});
