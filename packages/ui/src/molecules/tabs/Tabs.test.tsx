import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Tabs } from './Tabs';
import { useTabs } from './useTabs';

const items = [
  { value: 'cola', label: 'Cola', count: 12, content: 'Panel cola' },
  { value: 'fallos', label: 'Fallos', count: 1, danger: true, content: 'Panel fallos' }
];

const range = [
  { value: '24h', label: '24 h' },
  { value: '7d', label: '7 d' },
  { value: '30d', label: '30 d' }
];

describe('useTabs — logic', () => {
  it('selects the first item when uncontrolled', () => {
    const { result } = renderHook(() => useTabs({ label: 'Vistas', items }));
    expect(result.current.rootProps.defaultValue).toBe('cola');
  });

  it('detects when there are no panels', () => {
    const { result } = renderHook(() => useTabs({ label: 'Rango', items: [{ value: '24h', label: '24 h' }] }));
    expect(result.current.hasPanels).toBe(false);
  });
});

describe('Tabs — component', () => {
  it('renders a labelled tablist', () => {
    render(<Tabs label='Vistas' items={items} />);
    expect(screen.getByRole('tablist', { name: 'Vistas' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Cola 12' })).toHaveAttribute('aria-selected', 'true');
  });

  it('changes panel on click and notifies', async () => {
    const onValueChange = vi.fn();
    render(<Tabs label='Vistas' items={items} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Fallos 1' }));
    expect(onValueChange).toHaveBeenCalledWith('fallos');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel fallos');
  });

  it('moves with the arrow keys', async () => {
    render(<Tabs label='Vistas' items={items} />);
    await userEvent.click(screen.getByRole('tab', { name: 'Cola 12' }));
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('tab', { name: 'Fallos 1' })).toHaveFocus();
  });

  it('works as a segmented selector without panels', async () => {
    const onValueChange = vi.fn();
    render(<Tabs label='Historial' variant='segmented' size='sm' defaultValue='7d' items={range} onValueChange={onValueChange} />);
    expect(screen.getByRole('tab', { name: '7 d' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.queryByRole('tabpanel')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('tab', { name: '30 d' }));
    expect(onValueChange).toHaveBeenCalledWith('30d');
  });
});
