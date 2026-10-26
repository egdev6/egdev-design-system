import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Stat } from './Stat';
import { statVariants } from './types';
import { useStat } from './useStat';

function root(container: HTMLElement) {
  const stat = container.querySelector('.eg-stat');
  if (!stat) {
    throw new Error('Missing eg-stat root');
  }
  return stat;
}

function part(container: HTMLElement, name: 'label' | 'value' | 'delta') {
  return container.querySelector(`.eg-stat-${name}`);
}

describe('Stat', () => {
  it('renders a group named by the visible label with label → value → delta order (AC-01)', () => {
    const { container } = render(<Stat label='Follows' value={23} delta='+5 in the last hour' />);
    const group = screen.getByRole('group', { name: 'Follows' });
    expect(group === root(container)).toBe(true);
    expect(container.children).toHaveLength(1);
    expect(group.tagName).toBe('DIV');
    const label = part(container, 'label');
    expect(label?.tagName).toBe('SPAN');
    expect(label?.id).toBeTruthy();
    expect(group).toHaveAttribute('aria-labelledby', label?.id);
    expect([...group.children].map((child) => child.className.split(' ')[0])).toEqual([
      'eg-stat-label',
      'eg-stat-value',
      'eg-stat-delta'
    ]);
    expect(group).toHaveTextContent('Follows23+5 in the last hour');
    expect(group).not.toHaveAttribute('tabindex');
    expect(group).not.toHaveAttribute('aria-live');
  });

  it('gives each Stat its own label id', () => {
    const { container } = render(
      <>
        <Stat label='Follows' value={23} />
        <Stat label='Subs' value={4} />
      </>
    );
    const ids = [...container.querySelectorAll('.eg-stat-label')].map((label) => label.id);
    expect(new Set(ids).size).toBe(2);
    expect(screen.getByRole('group', { name: 'Subs' })).toHaveTextContent('Subs4');
  });

  it.each([
    [0, '0'],
    [1200, '1200'],
    [-3.5, '-3.5'],
    ['1.200', '1.200'],
    ['1,200', '1,200'],
    ['', '']
  ] as const)('renders %j unchanged without formatting (AC-02)', (value, text) => {
    const { container } = render(<Stat label='Bits' value={value} />);
    const figure = part(container, 'value');
    expect(figure?.textContent).toBe(text);
    expect(figure).not.toHaveAttribute('data-state');
    expect(figure?.children).toHaveLength(0);
  });

  it('renders a hidden em dash and the default readable text for null (AC-03)', () => {
    const { container } = render(<Stat label='Superchats' value={null} delta='Not connected' />);
    const figure = part(container, 'value');
    expect(figure).toHaveAttribute('data-state', 'unavailable');
    expect(figure).toHaveClass('text-fg-default', 'data-[state=unavailable]:text-fg-muted');
    const [dash, text] = [...(figure?.children ?? [])];
    expect(dash?.textContent).toBe('—');
    expect(dash).toHaveAttribute('aria-hidden', 'true');
    expect(text?.textContent).toBe('No data');
    expect(text).toHaveClass('sr-only');
    expect(text).not.toHaveAttribute('aria-hidden');
    expect(figure?.textContent).not.toContain('0');
    expect(part(container, 'delta')?.textContent).toBe('Not connected');
  });

  it('replaces the default unavailable text and ignores it while a value exists (AC-03)', () => {
    const { container, rerender } = render(<Stat label='Superchats' value={null} unavailableText='Unavailable' />);
    expect(part(container, 'value')?.textContent).toBe('—Unavailable');
    rerender(<Stat label='Superchats' value={7} unavailableText='Unavailable' />);
    const figure = part(container, 'value');
    expect(figure?.textContent).toBe('7');
    expect(figure).not.toHaveAttribute('data-state');
  });

  it('reflects highlighted as root data-state and clears it on removal (AC-04)', () => {
    const { container, rerender } = render(<Stat label='Subs' value={4} delta='+1 10 s ago' highlighted={true} />);
    const stat = root(container);
    expect(stat).toHaveAttribute('data-state', 'highlighted');
    expect(stat).toHaveClass(
      'data-[state=highlighted]:border-border-brand',
      'data-[state=highlighted]:shadow-[var(--shadow-edge),var(--shadow-glow-base)]'
    );
    expect(part(container, 'delta')).toHaveClass('group-data-[state=highlighted]/stat:text-fg-brand-raised');
    rerender(<Stat label='Subs' value={4} delta='+1 10 s ago' />);
    expect(root(container) === stat).toBe(true);
    expect(stat).not.toHaveAttribute('data-state');
    rerender(<Stat label='Subs' value={4} highlighted={false} />);
    expect(stat).not.toHaveAttribute('data-state');
  });

  it('applies the Material elevated card recipe at the default md size', () => {
    const { container } = render(<Stat label='Follows' value={23} />);
    expect(root(container)).toHaveClass(
      'flex',
      'flex-col',
      'min-w-0',
      'border',
      'border-border-hairline',
      'rounded-lg',
      'bg-surface-1',
      'bg-[image:var(--gradient-sheen)]',
      'shadow-[var(--shadow-edge),var(--shadow-elev-1)]',
      'gap-1.5',
      'px-4',
      'py-3'
    );
    expect(part(container, 'label')).toHaveClass('font-display', 'text-meta', 'uppercase', 'text-fg-muted');
    expect(part(container, 'value')).toHaveClass(
      'font-display',
      'text-display-stat',
      'tabular-nums',
      'text-fg-default'
    );
    expect(part(container, 'value')).not.toHaveClass('text-display-stat-sm');
  });

  it('keeps the figure size beside its colors through per-part cn() merging', () => {
    for (const size of ['md', 'sm'] as const) {
      const { container, unmount } = render(<Stat label='Bits' value={null} size={size} />);
      const figure = part(container, 'value');
      expect(figure).toHaveClass(size === 'md' ? 'text-display-stat' : 'text-display-stat-sm', 'text-fg-default');
      expect(part(container, 'label')).toHaveClass('text-meta', 'text-fg-muted');
      unmount();
    }
    const { container } = render(<Stat label='Subs' value={4} delta='+1' />);
    expect(part(container, 'delta')).toHaveClass('text-label-default', 'text-fg-secondary');
  });

  it('selects the compact classes and the small figure recipe for size="sm" (AC-05)', () => {
    const { container } = render(<Stat label='Raids' value={1} size='sm' />);
    const stat = root(container);
    expect(stat).toHaveClass('gap-1', 'px-3', 'py-2.5');
    expect(stat).not.toHaveClass('gap-1.5', 'px-4', 'py-3');
    expect(part(container, 'value')).toHaveClass('text-display-stat-sm');
    expect(part(container, 'value')).not.toHaveClass('text-display-stat');
    expect(statVariants({ size: 'sm' }).split(' ')).toEqual(expect.arrayContaining(['gap-1', 'px-3', 'py-2.5']));
  });

  it.each([undefined, ''])('omits the delta element when delta is %j (AC-06)', (delta) => {
    const { container } = render(<Stat label='Raids' value={1} size='sm' delta={delta} />);
    expect(part(container, 'delta')).toBeNull();
    expect(root(container).children).toHaveLength(2);
  });

  it('keeps eg-stat, forwards native props and merges layout className last (AC-07)', () => {
    const { container } = render(
      <Stat
        label='Follows'
        value={23}
        id='follows'
        title='Total follows'
        data-testid='stat'
        className='col-span-2 mt-4'
      />
    );
    const stat = root(container);
    expect(stat).toHaveClass('eg-stat', 'col-span-2', 'mt-4', 'flex');
    expect(stat).toHaveAttribute('id', 'follows');
    expect(stat).toHaveAttribute('title', 'Total follows');
    expect(stat).toHaveAttribute('data-testid', 'stat');
    expect(stat.className.split(' ').slice(-2)).toEqual(['col-span-2', 'mt-4']);
  });

  it('owns group role, naming and state over injected native attributes', () => {
    const injected = {
      role: 'region',
      'aria-labelledby': 'elsewhere',
      'data-state': 'forced',
      dangerouslySetInnerHTML: { __html: '<b>x</b>' }
    } as unknown as Record<string, never>;
    const { container } = render(<Stat label='Follows' value={23} {...injected} />);
    const stat = root(container);
    expect(stat).toHaveAttribute('role', 'group');
    expect(stat).toHaveAttribute('aria-labelledby', part(container, 'label')?.id);
    expect(stat).not.toHaveAttribute('data-state');
    expect(stat.querySelector('b')).toBeNull();
  });

  it('declares the highlight transition and removes it under reduced motion (AC-08)', () => {
    const { container } = render(<Stat label='Subs' value={4} highlighted={true} />);
    expect(root(container)).toHaveClass(
      'transition-[border-color,box-shadow]',
      'duration-[var(--duration-base)]',
      'ease-[var(--ease-out)]',
      'motion-reduce:transition-none'
    );
  });

  it('resolves ids, null handling, data-state and part classes in the hook', () => {
    const { result } = renderHook(() =>
      useStat({ label: 'Superchats', value: null, highlighted: true, size: 'sm', className: 'w-full' })
    );
    expect(result.current.rootProps).toMatchObject({
      role: 'group',
      'aria-labelledby': result.current.labelProps.id,
      'data-state': 'highlighted'
    });
    expect(result.current.rootProps.className).toContain('w-full');
    expect(result.current.value).toEqual({ unavailable: true, text: 'No data' });
    expect(result.current.valueProps).toMatchObject({ 'data-state': 'unavailable' });
    expect(result.current.valueProps.className).toContain('text-display-stat-sm');
    expect(result.current.delta).toBeUndefined();
    expect(result.current.labelText).toBe('Superchats');
  });
});
