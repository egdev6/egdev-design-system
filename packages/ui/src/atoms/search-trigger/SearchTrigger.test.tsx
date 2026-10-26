import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import * as SlotPrimitive from '@radix-ui/react-slot';
import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type FormEvent } from 'react';
import { renderToString } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SearchTrigger } from './SearchTrigger';
import type { SearchTriggerProps } from './types';
import { useSearchTrigger } from './useSearchTrigger';

const classes = (element: Element | null) => (element?.getAttribute('class') ?? '').split(' ');

afterEach(() => {
  vi.restoreAllMocks();
});

describe('SearchTrigger v0.2', () => {
  it('renders one named native launcher with a decorative icon and no hint or popup claims by default', () => {
    const { container } = render(<SearchTrigger />);
    const button = screen.getByRole('button', { name: 'Search…' });
    expect(container.querySelectorAll('button')).toHaveLength(1);
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-label', 'Search…');
    expect(button).toHaveTextContent('Search…');
    expect(button.classList.contains('eg-search')).toBe(true);
    const icon = button.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(classes(icon)).toEqual(expect.arrayContaining(['eg-icon', 'size-4', 'shrink-0']));
    expect(button.querySelector('kbd')).toBeNull();
    for (const attribute of ['aria-haspopup', 'aria-expanded', 'aria-controls', 'aria-keyshortcuts', 'data-state']) {
      expect(button.hasAttribute(attribute), attribute).toBe(false);
    }
    expect(button.className).not.toMatch(/eg-search--|eg-search__|is-hover/);
  });

  it('forwards exactly one native click per pointer, Enter or Space activation without submitting a form', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <SearchTrigger onClick={onClick} />
      </form>
    );
    const button = screen.getByRole('button', { name: 'Search…' });
    const before = button.outerHTML;
    await user.click(button);
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
    expect(onClick.mock.calls[0]?.[0]).toMatchObject({ type: 'click' });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(button.outerHTML).toBe(before);
  });

  it('shows a supplied shortcut as hidden raw Kbd text and omits whitespace-only hints', () => {
    const { rerender } = render(<SearchTrigger shortcut='⌘K' />);
    const button = screen.getByRole('button', { name: 'Search…' });
    const kbd = button.querySelector('kbd');
    expect(kbd).toHaveTextContent('⌘K');
    expect(kbd?.classList.contains('eg-kbd')).toBe(true);
    const hint = kbd?.parentElement;
    expect(hint?.parentElement === button).toBe(true);
    expect(hint).toHaveAttribute('aria-hidden', 'true');
    expect(classes(hint ?? null)).toContain('ms-auto');
    expect(button.lastElementChild === hint).toBe(true);
    expect(button).not.toHaveAttribute('aria-keyshortcuts');
    rerender(<SearchTrigger shortcut=' Ctrl K ' />);
    expect(button.querySelector('kbd')?.textContent).toBe(' Ctrl K ');
    rerender(<SearchTrigger shortcut='   ' />);
    expect(button.querySelector('kbd')).toBeNull();
    rerender(<SearchTrigger shortcut='' />);
    expect(button.querySelector('kbd')).toBeNull();
  });

  it('keeps the same named button, ref and handler in compact mode while hiding label and hint', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(<SearchTrigger ref={ref} onClick={onClick} shortcut='Ctrl K' />);
    const button = screen.getByRole('button', { name: 'Search…' });
    expect(button.querySelector('span:not([aria-hidden])')).toHaveTextContent('Search…');
    rerender(<SearchTrigger ref={ref} onClick={onClick} shortcut='Ctrl K' compact={true} />);
    expect(screen.getByRole('button', { name: 'Search…' }) === button).toBe(true);
    expect(ref.current === button).toBe(true);
    expect(button.querySelector('kbd')).toBeNull();
    expect(button.querySelector('span')).toBeNull();
    expect(button.textContent).toBe('');
    expect(button.querySelector('svg')).not.toBeNull();
    await user.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('updates the visible text and name on rerender without moving focus or emitting callbacks', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { rerender } = render(<SearchTrigger onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Search…' });
    await user.tab();
    expect(button).toHaveFocus();
    rerender(<SearchTrigger onClick={onClick} label='Search docs…' />);
    expect(screen.getByRole('button', { name: 'Search docs…' }) === button).toBe(true);
    expect(button).toHaveTextContent('Search docs…');
    expect(button).toHaveFocus();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores Ctrl+K and Meta+K and registers no document or window listeners across several instances', async () => {
    const user = userEvent.setup();
    const documentListeners = vi.spyOn(document, 'addEventListener');
    const windowListeners = vi.spyOn(window, 'addEventListener');
    const onClick = vi.fn();
    const { unmount } = render(
      <>
        <SearchTrigger onClick={onClick} shortcut='Ctrl K' />
        <SearchTrigger onClick={onClick} shortcut='⌘K' compact={true} />
      </>
    );
    await user.keyboard('{Control>}k{/Control}{Meta>}k{/Meta}');
    expect(onClick).not.toHaveBeenCalled();
    expect(document.body).toHaveFocus();
    unmount();
    const keyboard = (spy: typeof documentListeners | typeof windowListeners) =>
      spy.mock.calls.filter(([type]) => String(type).startsWith('key'));
    expect(keyboard(documentListeners)).toEqual([]);
    expect(keyboard(windowListeners)).toEqual([]);
  });

  it('renders deterministic server markup with no platform detection, effects or listeners in source', () => {
    const element = <SearchTrigger shortcut='Ctrl K' />;
    const first = renderToString(element);
    expect(renderToString(element)).toBe(first);
    expect(first).toMatch(/^<button[^>]*type="button"[^>]*aria-label="Search…"/);
    expect(first).toContain('Ctrl K</kbd>');
    for (const file of ['types.ts', 'useSearchTrigger.ts', 'SearchTrigger.tsx']) {
      const code = readFileSync(resolve(import.meta.dirname, file), 'utf8');
      expect(code, file).not.toMatch(/navigator|addEventListener|useEffect|useLayoutEffect|useState|setTimeout/);
    }
  });

  it('disables native activation and focus, dimming once without a loading or gray treatment', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<SearchTrigger onClick={onClick} disabled={true} />);
    const button = screen.getByRole('button', { name: 'Search…' });
    expect(button).toBeDisabled();
    await user.tab();
    expect(button).not.toHaveFocus();
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
    const list = classes(button);
    expect(list.filter((name) => name.endsWith('opacity-45'))).toEqual(['disabled:opacity-45']);
    expect(button).not.toHaveAttribute('aria-busy');
    expect(button.className).not.toMatch(/(?:^|\s)(?:enabled:)?hover:[^\s]*opacity/);
  });

  it('lands a Radix-style Slot trigger on the same button with injected ARIA, data-state and handler', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const open = vi.fn();
    const { container } = render(
      <SlotPrimitive.Root
        ref={ref}
        aria-haspopup='dialog'
        aria-expanded={false}
        aria-controls='palette'
        data-state='closed'
        onClick={open}
      >
        <SearchTrigger shortcut='⌘K' />
      </SlotPrimitive.Root>
    );
    expect(container.querySelectorAll('button')).toHaveLength(1);
    const button = screen.getByRole('button', { name: 'Search…' });
    expect(ref.current === button).toBe(true);
    expect(button).toHaveAttribute('aria-haspopup', 'dialog');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(button).toHaveAttribute('aria-controls', 'palette');
    expect(button).toHaveAttribute('data-state', 'closed');
    expect(button).toHaveAttribute('type', 'button');
    expect(button.className).not.toMatch(/closed|open/);
    await user.click(button);
    expect(open).toHaveBeenCalledTimes(1);
  });

  it('preserves host shortcut metadata and descriptions without fabricating them from the hint', () => {
    render(
      <>
        <p id='search-help'>Press Control K to search</p>
        <SearchTrigger shortcut='Ctrl K' aria-keyshortcuts='Control+K' aria-describedby='search-help' id='launcher' />
      </>
    );
    const button = screen.getByRole('button', { name: 'Search…', description: 'Press Control K to search' });
    expect(button).toHaveAttribute('aria-keyshortcuts', 'Control+K');
    expect(button).toHaveAttribute('id', 'launcher');
  });

  it('protects owned type, role, name and content against untyped injection', () => {
    const injected = {
      type: 'submit',
      role: 'link',
      'aria-label': 'Injected',
      'aria-labelledby': 'other',
      'aria-pressed': true,
      children: 'Injected child'
    } as unknown as SearchTriggerProps;
    render(<SearchTrigger {...injected} />);
    const button = screen.getByRole('button', { name: 'Search…' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).not.toHaveAttribute('role');
    expect(button).not.toHaveAttribute('aria-labelledby');
    expect(button).not.toHaveAttribute('aria-pressed');
    expect(button).not.toHaveTextContent('Injected child');
  });
});

describe('useSearchTrigger', () => {
  it('composes the Surface well recipe with owned launcher classes and layout className last', () => {
    const { result } = renderHook(() => useSearchTrigger({ className: 'w-full mt-2' }));
    const list = result.current.rootProps.className?.split(' ') ?? [];
    expect(list).toEqual(
      expect.arrayContaining([
        'eg-surface',
        'eg-search',
        'bg-surface-0',
        'shadow-[var(--shadow-well)]',
        'rounded-md',
        'border',
        'border-border-hairline-strong',
        'text-fg-muted',
        'min-w-48',
        'min-h-10',
        'pointer-coarse:min-h-11',
        'ps-3',
        'pe-2',
        'focus-visible:shadow-focus',
        'motion-reduce:transition-none'
      ])
    );
    expect(list).not.toContain('border-border-hairline');
    expect(list).not.toContain('text-fg-default');
    expect(list.slice(-2)).toEqual(['w-full', 'mt-2']);
    expect(result.current.rootProps.type).toBe('button');
    expect(result.current.rootProps['aria-label']).toBe('Search…');
    expect(result.current.label).toBe('Search…');
    expect(result.current.shortcut).toBeUndefined();
    expect(result.current.labelClassName).toBe('whitespace-nowrap');
    expect(result.current.hintClassName).toBe('ms-auto');
  });

  it('switches to compact geometry, drops visible parts and lets layout width win', () => {
    const { result } = renderHook(() => useSearchTrigger({ compact: true, shortcut: '⌘K', className: 'w-full' }));
    const list = result.current.rootProps.className?.split(' ') ?? [];
    expect(list).toEqual(expect.arrayContaining(['min-w-0', 'p-0', 'justify-center', 'pointer-coarse:w-11']));
    expect(list).not.toContain('min-w-48');
    expect(list).not.toContain('ps-3');
    expect(list).not.toContain('w-10');
    expect(list.at(-1)).toBe('w-full');
    expect(result.current.label).toBeUndefined();
    expect(result.current.shortcut).toBeUndefined();
    expect(result.current.rootProps['aria-label']).toBe('Search…');
  });
});
