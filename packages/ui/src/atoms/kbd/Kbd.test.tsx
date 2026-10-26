import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Kbd } from './Kbd';
import { kbdVariants } from './types';
import { useKbd } from './useKbd';

function root(container: HTMLElement) {
  const kbd = container.querySelector('.eg-kbd');
  if (!kbd) {
    throw new Error('Missing eg-kbd root');
  }
  return kbd;
}

describe('Kbd', () => {
  it('renders one native kbd with the public marker and its key text (KB-01)', () => {
    const { container } = render(<Kbd>Esc</Kbd>);
    const kbd = root(container);
    expect(container.children).toHaveLength(1);
    expect(kbd.tagName).toBe('KBD');
    expect(kbd).toHaveClass('eg-kbd');
    expect(kbd).toHaveTextContent('Esc');
    expect(kbd.children).toHaveLength(0);
    expect(kbd).not.toHaveAttribute('role');
    expect(kbd).not.toHaveAttribute('aria-hidden');
    expect(kbd).not.toHaveAttribute('aria-label');
  });

  it('applies the flat token recipe from the CVA base (KB-06)', () => {
    const { container } = render(<Kbd>⌘K</Kbd>);
    expect(root(container)).toHaveClass(
      'inline-block',
      'whitespace-nowrap',
      'rounded-sm',
      'border',
      'border-border-subtle',
      'px-1.5',
      'py-0.5',
      'font-sans',
      'text-label-default',
      'text-fg-secondary'
    );
    expect(kbdVariants()).toContain('eg-kbd');
    expect(kbdVariants()).not.toMatch(/shadow|bg-|gradient|animate|transition/);
  });

  it('names a symbol key with a visually hidden label and hides the glyph (KB-03)', () => {
    const { container } = render(<Kbd label='Command K'>⌘K</Kbd>);
    const kbd = root(container);
    expect(kbd.tagName).toBe('KBD');
    const glyph = screen.getByText('⌘K');
    expect(glyph.tagName).toBe('SPAN');
    expect(glyph).toHaveAttribute('aria-hidden', 'true');
    expect(glyph.parentElement).toBe(kbd);
    const label = screen.getByText('Command K');
    expect(label.parentElement).toBe(kbd);
    expect(label).not.toHaveAttribute('aria-hidden');
    expect(label).toHaveStyle({ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden' });
    expect(kbd).not.toHaveAttribute('aria-label');
  });

  it('treats an empty label as absent and reads the children as-is (KB-03)', () => {
    const { container } = render(<Kbd label=''>Ctrl</Kbd>);
    const kbd = root(container);
    expect(kbd).toHaveTextContent('Ctrl');
    expect(kbd.children).toHaveLength(0);
    expect(kbd.querySelector('[aria-hidden]')).toBeNull();
  });

  it('is never focusable and has no state or interaction (KB-04)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <p>
        <button type='button'>Before</button>
        Press <Kbd>⌘K</Kbd> or <Kbd label='Enter'>↵</Kbd>
        <button type='button'>After</button>
      </p>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    for (const kbd of container.querySelectorAll('.eg-kbd')) {
      expect(kbd).not.toHaveAttribute('tabindex');
      expect(kbd).not.toHaveAttribute('data-state');
    }
  });

  it('merges root layout className last and forwards native attributes (KB-05)', () => {
    const { container } = render(
      <Kbd id='search-key' title='Search shortcut' data-source='consumer' className='ms-1 ms-2 align-middle'>
        Esc
      </Kbd>
    );
    const kbd = root(container);
    expect(kbd).toHaveClass('eg-kbd', 'ms-2', 'align-middle');
    expect(kbd).not.toHaveClass('ms-1');
    expect(kbd.className.split(' ').at(-1)).toBe('align-middle');
    expect(kbd).toHaveAttribute('id', 'search-key');
    expect(kbd).toHaveAttribute('title', 'Search shortcut');
    expect(kbd).toHaveAttribute('data-source', 'consumer');
  });

  it('derives labelled versus plain mode in the hook without leaking label to the DOM', () => {
    const { result } = renderHook(() => useKbd({ children: '⌘K', label: 'Command K', id: 'palette' }));
    expect(result.current.label).toBe('Command K');
    expect(result.current.children).toBe('⌘K');
    expect(result.current.rootProps).toMatchObject({ id: 'palette' });
    expect(result.current.rootProps.className).toContain('eg-kbd');
    expect(result.current.rootProps).not.toHaveProperty('label');
    expect(result.current.rootProps).not.toHaveProperty('children');
    const { result: plain } = renderHook(() => useKbd({ children: 'Esc', label: '' }));
    expect(plain.current.label).toBeUndefined();
  });
});
