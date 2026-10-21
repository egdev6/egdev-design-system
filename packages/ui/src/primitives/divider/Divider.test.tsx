import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Divider } from './Divider';
import { useDivider } from './useDivider';

const divider = () => document.querySelector('.eg-divider');

describe('Divider public contract', () => {
  it('renders one empty decorative horizontal span by default', () => {
    const { container } = render(<Divider />);
    const root = divider();
    expect(container.children).toHaveLength(1);
    expect(root?.tagName).toBe('SPAN');
    expect(root).toBeEmptyDOMElement();
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(root).toHaveAttribute('role', 'none');
    expect(root).not.toHaveAttribute('aria-hidden');
    expect(root).not.toHaveAttribute('tabindex');
    expect(root).not.toHaveAttribute('data-state');
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
    expect(root).not.toHaveClass('eg-rule', 'eg-rule--vertical');
  });

  it.each(['horizontal', 'vertical'] as const)('delegates meaningful %s semantics to Radix', (orientation) => {
    render(<Divider orientation={orientation} decorative={false} aria-label='Content boundary' />);
    const root = screen.getByRole('separator', { name: 'Content boundary' });
    expect(root.tagName).toBe('SPAN');
    expect(root).toHaveAttribute('data-orientation', orientation);
    if (orientation === 'vertical') {
      expect(root).toHaveAttribute('aria-orientation', 'vertical');
    } else {
      expect(root).not.toHaveAttribute('aria-orientation');
    }
    expect(root).not.toHaveAttribute('tabindex');
  });

  it('updates Radix semantics and orientation together without mirroring state classes', () => {
    const { rerender } = render(<Divider decorative={false} />);
    const root = screen.getByRole('separator');
    const recipe = root.className;
    rerender(<Divider decorative={false} orientation='vertical' />);
    expect(root).toHaveAttribute('aria-orientation', 'vertical');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root.className).toBe(recipe);
    rerender(<Divider orientation='vertical' />);
    expect(root).toHaveAttribute('role', 'none');
    expect(root).not.toHaveAttribute('aria-orientation');
    expect(root.className).toBe(recipe);
    expect(screen.queryByRole('separator')).not.toBeInTheDocument();
  });

  it('forwards compatible native attributes and supported margins without losing its marker', () => {
    render(<Divider id='consumer-boundary' title='Decorative rule' dir='rtl' className='m-2 m-6' />);
    const root = screen.getByTitle('Decorative rule');
    expect(root).toHaveClass('eg-divider', 'm-6');
    expect(root).not.toHaveClass('m-2');
    expect(root).toHaveAttribute('id', 'consumer-boundary');
    expect(root).toHaveAttribute('dir', 'rtl');
  });

  it('derives explicit defaults and supported layout through the hook without handmade ARIA', () => {
    const { result } = renderHook(() => useDivider({ className: 'col-span-2' }));
    expect(result.current).toMatchObject({ orientation: 'horizontal', decorative: true });
    expect(result.current.className).toContain('eg-divider');
    expect(result.current.className).toContain('col-span-2');
    expect(result.current).not.toHaveProperty('role');
    expect(result.current).not.toHaveProperty('aria-orientation');
    expect(result.current).not.toHaveProperty('data-state');
  });

  it('adds no Tab stop and preserves valid decorative phrasing inside a named control', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <button type='button'>Before</button>
        <Divider decorative={false} />
        <button type='button' onClick={onClick}>
          Open section
          <Divider orientation='vertical' />
        </button>
        <button type='button'>After</button>
      </>
    );
    const control = screen.getByRole('button', { name: 'Open section' });
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(control).toHaveFocus();
    expect(control.querySelector('.eg-divider')?.tagName).toBe('SPAN');
    await user.keyboard('{Enter}');
    expect(onClick).toHaveBeenCalledOnce();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
  });
});
