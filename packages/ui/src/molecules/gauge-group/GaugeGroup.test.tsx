import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { GaugeGroup } from './GaugeGroup';
import type { GaugeGroupItems, GaugeGroupProps } from './types';

const readings: GaugeGroupItems = [
  { label: 'Session', value: 42.5, state: 'warning', stateText: 'Review' },
  { label: 'Weekly', value: 101 }
];

describe('GaugeGroup', () => {
  it('renders independent named meters and a visible ordered list without aggregate semantics', () => {
    const { container } = render(<GaugeGroup label='Usage' items={readings} />);
    const group = screen.getByRole('group', { name: 'Usage' });
    const rows = within(group).getAllByRole('listitem');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveTextContent('Outer');
    expect(rows[1]).toHaveTextContent('Inner');
    expect(within(group).getByRole('meter', { name: 'Session' })).toHaveAttribute('aria-valuenow', '42.5');
    expect(within(group).getByRole('meter', { name: 'Session' })).toHaveAccessibleDescription('Review');
    expect(within(group).getByRole('meter', { name: 'Weekly' })).toHaveAttribute('aria-valuetext', '100 / 100');
    expect(group).not.toHaveAttribute('aria-valuenow');
    expect(group).not.toHaveAttribute('aria-live');
    expect(container.querySelectorAll('.eg-gauge-arc')).toHaveLength(2);
  });

  it('keeps unavailable slots and independently recovers them with stable descriptions', () => {
    const { container, rerender } = render(<GaugeGroup label='Usage' items={readings} center='OK' />);
    const id = screen.getByRole('meter', { name: 'Session' }).getAttribute('aria-describedby');
    const missing: GaugeGroupItems = [{ ...readings[0], value: NaN }, readings[1]];
    rerender(<GaugeGroup label='Usage' items={missing} center='OK' />);
    expect(screen.queryByRole('meter', { name: 'Session' })).not.toBeInTheDocument();
    expect(screen.getByText('Data unavailable')).toBeVisible();
    expect(container.querySelectorAll('.eg-gauge-group-slot')).toHaveLength(1);
    expect(screen.getByRole('meter', { name: 'Weekly' })).toHaveAttribute('aria-valuenow', '100');
    rerender(<GaugeGroup label='Usage' items={readings} center='OK' />);
    expect(screen.getByRole('meter', { name: 'Session' })).toHaveAttribute('aria-describedby', id);
    const allMissing: GaugeGroupItems = [
      { label: 'Session', value: Infinity },
      { label: 'Weekly', value: -Infinity }
    ];
    rerender(<GaugeGroup label='Usage' items={allMissing} center='OK' />);
    expect(screen.queryAllByRole('meter')).toHaveLength(0);
    expect(container.querySelectorAll('.eg-gauge-arc')).toHaveLength(0);
    expect(container.querySelector('.eg-gauge-group-center')).toBeNull();
    expect(screen.getAllByText('Data unavailable')).toHaveLength(2);
  });

  it('retains three radial positions when a middle value is unavailable', () => {
    const items: GaugeGroupItems = [readings[0], { label: 'Offline', value: NaN }, readings[1]];
    const { container } = render(<GaugeGroup label='Usage' items={items} />);
    const rows = screen.getAllByRole('listitem');
    expect(rows.map((row) => row.textContent)).toEqual([
      expect.stringContaining('Outer'),
      expect.stringContaining('Middle'),
      expect.stringContaining('Inner')
    ]);
    const slots = container.querySelectorAll('.eg-gauge-group-slot');
    expect(slots).toHaveLength(2);
    expect(slots[1]?.className).toContain('--eg-gauge-group-slot-inset');
    expect(slots[0]?.className).not.toBe(slots[1]?.className);
  });

  it.each([
    [-1, 0],
    [0, 0],
    [42.5, 42.5],
    [100, 100],
    [101, 100]
  ])('clamps %s to %s without changing its peer', (value, expected) => {
    const items: GaugeGroupItems = [
      { label: 'First', value },
      { label: 'Second', value: 25 }
    ];
    const { container } = render(<GaugeGroup label='Usage' items={items} />);
    expect(screen.getByRole('meter', { name: 'First' })).toHaveAttribute('aria-valuenow', String(expected));
    expect(screen.getByRole('meter', { name: 'First' })).toHaveAttribute('aria-valuetext', `${expected} / 100`);
    expect(screen.getByRole('meter', { name: 'Second' })).toHaveAttribute('aria-valuenow', '25');
    expect((container.querySelector('.eg-gauge-arc') as HTMLElement).style.getPropertyValue('--eg-gauge-value')).toBe(
      String(expected)
    );
  });

  it.each(['normal', 'warning', 'critical', 'muted'] as const)(
    'associates %s text with its own meter only',
    (state) => {
      const items: GaugeGroupItems = [
        { label: 'First', value: 20, state, stateText: 'Condition' },
        { label: 'Second', value: 20 }
      ];
      render(<GaugeGroup label='Usage' items={items} />);
      expect(screen.getByRole('meter', { name: 'First' })).toHaveAccessibleDescription('Condition');
      expect(screen.getByRole('meter', { name: 'Second' })).not.toHaveAccessibleDescription();
      expect(screen.getByText('Condition').parentElement?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByRole('meter', { name: 'First' })).not.toHaveAttribute('aria-disabled');
    }
  );

  it('protects the root, merges layout and retains only root external descriptions', () => {
    const hostile = {
      role: 'button',
      tabIndex: 0,
      'aria-hidden': true,
      'aria-live': 'assertive',
      'aria-valuenow': 2,
      style: { color: 'red' }
    };
    const { container } = render(
      <>
        <p id='external'>Context</p>
        <GaugeGroup
          {...hostile}
          label='Usage'
          items={readings}
          aria-describedby='external external'
          className='mt-2 mt-4'
        />
      </>
    );
    const group = screen.getByRole('group', { name: 'Usage' });
    expect(group).toHaveAccessibleDescription('Context');
    expect(group).toHaveAttribute('aria-describedby', 'external');
    expect(group).toHaveClass('eg-gauge-group', 'mt-4');
    expect(group).not.toHaveClass('mt-2');
    expect(group).not.toHaveAttribute('tabindex');
    expect(group).not.toHaveAttribute('aria-live');
    expect(group).not.toHaveAttribute('style');
    expect(container.querySelectorAll('button, a, input, [tabindex]')).toHaveLength(0);
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.getByRole('meter', { name: 'Weekly' })).not.toHaveAccessibleDescription();
  });

  it('keeps tuple and root public type boundaries', () => {
    expectTypeOf<{ label: string; items: GaugeGroupItems }>().toExtend<GaugeGroupProps>();
    expectTypeOf<{
      label: string;
      items: readonly [{ label: string; value: number }];
    }>().not.toExtend<GaugeGroupProps>();
    expectTypeOf<{ label: string; items: GaugeGroupItems; size: number }>().not.toExtend<GaugeGroupProps>();
    expectTypeOf<{ label: string; value: number; state: 'warning' }>().not.toExtend<GaugeGroupItems[number]>();
    expectTypeOf<
      Extract<keyof GaugeGroupProps, 'ref' | 'asChild' | 'children' | 'role' | 'style' | 'onClick'>
    >().toEqualTypeOf<never>();
  });

  it.each([
    ['sm', '14'],
    ['md', '20'],
    ['lg', '24']
  ] as const)('uses the %s diameter and stable three-slot geometry', (size, token) => {
    const items: GaugeGroupItems = [readings[0], { label: 'Daily', value: 40 }, readings[1]];
    const { container } = render(<GaugeGroup label='Usage' items={items} size={size} center='42' />);
    const frame = container.querySelector('[aria-hidden="true"]');
    expect(frame).toHaveClass(`w-[var(--space-${token})]`, `h-[var(--space-${token})]`);
    expect(frame).toHaveClass('[--eg-gauge-stroke:var(--space-1)]');
    const slots = container.querySelectorAll('.eg-gauge-group-slot');
    expect(slots).toHaveLength(3);
    expect(slots[0]?.className).toContain('[--eg-gauge-group-slot-inset:var(--space-0)]');
    expect(slots[1]?.className).toContain('[--eg-gauge-group-slot-inset:calc(var(--space-1)+var(--space-1))]');
    expect(slots[2]?.className).toContain('[--eg-gauge-group-slot-inset:calc((var(--space-1)+var(--space-1))*2)]');
    expect(container.querySelector('.eg-gauge-group-center')).toHaveClass(
      '[--eg-gauge-group-center-inset:var(--space-5)]'
    );
  });

  it('uses the two-slot center inset', () => {
    const { container } = render(<GaugeGroup label='Usage' items={readings} center='42' />);
    expect(container.querySelector('.eg-gauge-group-center')).toHaveClass(
      '[--eg-gauge-group-center-inset:var(--space-3)]'
    );
  });

  it('keeps cue relationships unique between instances', () => {
    render(
      <>
        <GaugeGroup label='One' items={readings} />
        <GaugeGroup label='Two' items={readings} />
      </>
    );
    const [one, two] = screen.getAllByRole('group');
    const first = within(one as HTMLElement).getByRole('meter', { name: 'Session' });
    const second = within(two as HTMLElement).getByRole('meter', { name: 'Session' });
    expect(first).toHaveAccessibleDescription('Review');
    expect(second).toHaveAccessibleDescription('Review');
    expect(first.getAttribute('aria-describedby')).not.toBe(second.getAttribute('aria-describedby'));
  });

  it('does not take focus or become actionable', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <GaugeGroup label='Usage' items={readings} />
        <button type='button'>After</button>
      </>
    );
    const group = screen.getByRole('group', { name: 'Usage' });
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.click(group);
    expect(group).not.toHaveFocus();
    expect(group.querySelector('button, a, input, [tabindex], [aria-live]')).toBeNull();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
  });

  it('rejects sparse reading arrays rather than silently omitting a slot', () => {
    const sparse = new Array(2);
    sparse[1] = readings[1];
    expect(() => render(<GaugeGroup label='Usage' items={sparse as unknown as GaugeGroupItems} />)).toThrow(TypeError);
  });

  it.each([
    { label: '', items: readings },
    { label: 'Usage', items: [] },
    { label: 'Usage', items: [null, readings[1]] },
    { label: 'Usage', items: [{ label: ' ', value: 1 }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X', value: '2' }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X', value: 2, state: 'warning' }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X', value: 2, valueText: ' ' }, readings[1]] },
    { label: 'Usage', items: readings, size: 'huge' },
    { label: 'Usage', items: null },
    { label: 'Usage', items: [readings[0]] },
    { label: 'Usage', items: [readings[0], readings[1], readings[0], readings[1]] },
    { label: 'Usage', items: [[], readings[1]] },
    { label: 'Usage', items: [{ value: 1 }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X' }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X', value: 1, state: 'unknown' }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X', value: NaN, state: 'critical' }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X', value: 1, stateText: ' ' }, readings[1]] },
    { label: 'Usage', items: [{ label: 'X', value: 1, unavailableText: '' }, readings[1]] }
  ])('rejects invalid input %j', (props) => {
    expect(() => render(<GaugeGroup {...(props as unknown as GaugeGroupProps)} />)).toThrow(TypeError);
  });
});
