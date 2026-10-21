import * as SlotPrimitive from '@radix-ui/react-slot';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import * as Ui from '../../index';
import { Slot, Slottable } from './index';

describe('Slot public contract', () => {
  it('re-exports only the approved Radix composition entry points', () => {
    expect(Ui.Slot).toBe(SlotPrimitive.Slot);
    expect(Ui.Slottable).toBe(SlotPrimitive.Slottable);
    expect(Slot).toBe(Ui.Slot);
    expect(Slottable).toBe(Ui.Slottable);
    for (const name of ['Root', 'createSlot', 'createSlottable']) {
      expect(Ui).not.toHaveProperty(name);
    }
  });

  it('preserves one native target, its semantics and attributes without a marker', () => {
    const { container } = render(
      <Slot aria-label='Documentation' data-source='slot'>
        <a href='#documentation'>Read more</a>
      </Slot>
    );
    const link = screen.getByRole('link', { name: 'Documentation' });
    expect(link).toHaveAttribute('href', '#documentation');
    expect(link).toHaveAttribute('data-source', 'slot');
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(link);
    expect(link).not.toHaveAttribute('class');
  });

  it('concatenates classes without utility conflict resolution and merges child props last', () => {
    render(
      <Slot className='p-2' title='Slot title' style={{ color: 'red', display: 'inline' }}>
        <button type='button' className='p-4' title='Child title' style={{ color: 'blue' }}>
          Merge props
        </button>
      </Slot>
    );
    const button = screen.getByRole('button', { name: 'Merge props' });
    expect(button).toHaveClass('p-2', 'p-4');
    expect(button).toHaveAttribute('title', 'Child title');
    expect(button.style.color).toBe('blue');
    expect(button.style.display).toBe('inline');
  });

  it('chains child handlers before Slot handlers, even when default is prevented', async () => {
    const calls: string[] = [];
    const user = userEvent.setup();
    render(
      <Slot onClick={(event) => calls.push(`slot:${event.defaultPrevented}`)}>
        <button
          type='button'
          onClick={(event) => {
            calls.push('child');
            event.preventDefault();
          }}
        >
          Activate
        </button>
      </Slot>
    );
    await user.click(screen.getByRole('button', { name: 'Activate' }));
    expect(calls).toEqual(['child', 'slot:true']);
  });

  it('composes the forwarded ref with the child ref and clears both on unmount', () => {
    const slotRef = createRef<HTMLElement>();
    const childRef = createRef<HTMLAnchorElement>();
    const { unmount } = render(
      <Slot ref={slotRef}>
        <a ref={childRef} href='#target'>
          Target
        </a>
      </Slot>
    );
    const link = screen.getByRole('link', { name: 'Target' });
    expect(slotRef.current).toBe(link);
    expect(childRef.current).toBe(link);
    unmount();
    expect(slotRef.current).toBeNull();
    expect(childRef.current).toBeNull();
  });

  it('places siblings inside the single target marked by Slottable', () => {
    const { container } = render(
      <Slot aria-label='Read documentation'>
        <span aria-hidden='true'>→</span>
        <Slottable>
          <a href='#documentation'>Documentation</a>
        </Slottable>
        <span aria-hidden='true'>↗</span>
      </Slot>
    );
    const link = screen.getByRole('link', { name: 'Read documentation' });
    expect(container.children).toHaveLength(1);
    expect(container.firstElementChild).toBe(link);
    expect(link.textContent).toBe('→Documentation↗');
    expect(link.children).toHaveLength(2);
    expect(link).not.toHaveAttribute('class');
  });

  it.each<{ name: string; children: ReactNode }>([
    { name: 'text', children: 'Invalid target' },
    { name: 'zero', children: 0 },
    { name: 'multiple elements', children: [<span key='a'>A</span>, <span key='b'>B</span>] }
  ])('rejects invalid direct targets: $name', ({ children }) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() => render(<Slot>{children}</Slot>)).toThrow(
        'Slot failed to slot onto its children. Expected a single React element child or `Slottable`.'
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it.each<{ name: string; children: ReactNode }>([
    { name: 'text', children: 'Invalid target' },
    { name: 'zero', children: 0 },
    { name: 'multiple elements', children: [<span key='a'>A</span>, <span key='b'>B</span>] }
  ])('rejects invalid Slottable targets: $name', ({ children }) => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined);
    try {
      expect(() =>
        render(
          <Slot>
            <Slottable>{children}</Slottable>
          </Slot>
        )
      ).toThrow(
        'Slot failed to slot onto its `Slottable`. Expected `Slottable` to receive a single React element child.'
      );
    } finally {
      consoleError.mockRestore();
    }
  });

  it.each([undefined, null, false, ''])('adds no host element for empty input %s', (children) => {
    const { container } = render(<Slot>{children}</Slot>);
    expect(container).toBeEmptyDOMElement();
  });
});
