import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ComponentPropsWithoutRef } from 'react';
import { describe, expect, expectTypeOf, it } from 'vitest';
import { Gauge } from './Gauge';
import type { GaugeProps, GaugeState } from './types';
import { useGauge } from './useGauge';

const base = { label: 'Capacity', value: 42.5 };

describe('Gauge contract', () => {
  it('owns a transparent native geometry frame without Surface identity', () => {
    const { container } = render(<Gauge {...base} center='42.5' />);
    const meter = screen.getByRole('meter', { name: base.label });
    const well = meter.querySelector('.eg-gauge-well');
    expect(meter).toHaveClass('eg-gauge');
    expect(well?.tagName).toBe('DIV');
    expect(well).toHaveAttribute('aria-hidden', 'true');
    // cn() must retain independent zero-width, solid-style and token-color border utilities.
    expect(well).toHaveClass('box-border', 'p-0', 'border-0', 'border-solid', 'border-[var(--color-border-hairline)]');
    expect(well).toHaveClass('rounded-[var(--radius-full)]', 'bg-transparent', 'bg-none', '[box-shadow:none]');
    expect(well).not.toHaveClass('bg-[var(--color-surface-0)]', '[box-shadow:var(--shadow-well)]');
    expect(well?.parentElement).toBe(meter);
    expect(well?.querySelector('.eg-gauge-arc')).not.toBeNull();
    expect(well?.querySelector('.eg-gauge-center')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('[class*="eg-surface"]')).toBeNull();
  });

  it.each([
    [-1, 0],
    [0, 0],
    [42.5, 42.5],
    [100, 100],
    [101, 100]
  ])('normalizes %s to %s', (value, normalized) => {
    render(<Gauge {...base} value={value} />);
    const meter = screen.getByRole('meter', { name: base.label });
    expect(meter).toHaveAttribute('aria-valuenow', String(normalized));
    expect(meter).toHaveAttribute('aria-valuemin', '0');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(meter).toHaveAttribute('aria-valuetext', `${normalized} / 100`);
    expect(meter.style.getPropertyValue('--eg-gauge-value')).toBe(String(normalized));
  });

  it('derives defaults and supports only outer layout merging', () => {
    const { result } = renderHook(() => useGauge({ ...base, className: 'mt-2 mt-4 self-start' }));
    expect(result.current.rootProps.className).toContain('eg-gauge');
    expect(result.current.rootProps.className).toContain('mt-4');
    expect(result.current.rootProps.className).not.toContain('mt-2');
    expect(result.current.rootProps['data-state']).toBe('normal');
    expect(result.current.circleClassName).toContain('w-[var(--space-14)]');
    expect(result.current.circleClassName).not.toContain('mt-4');
    expect(result.current.showCenter).toBe(false);
    expect(result.current.showCue).toBe(false);
  });

  it.each(['sm', 'md', 'lg'] as const)('selects the %s preset', (size) => {
    const { result } = renderHook(() => useGauge({ ...base, size }));
    expect(result.current.circleClassName).toContain(`w-[var(--space-${{ sm: 10, md: 14, lg: 20 }[size]})]`);
    expect(result.current.rootProps.style['--eg-gauge-size']).toBeUndefined();
  });

  it.each([0.5, 64, 64.5, 1000])('preserves positive numeric diameter %s', (size) => {
    const { result } = renderHook(() => useGauge({ ...base, size }));
    expect(result.current.rootProps.style).toEqual({ '--eg-gauge-size': `${size}px`, '--eg-gauge-value': 42.5 });
    expect(result.current.circleClassName).toContain('w-[var(--eg-gauge-size)]');
    expect(result.current.circleClassName).toContain('[--eg-gauge-stroke:calc(var(--eg-gauge-size)/14)]');
  });

  it.each([0, -1, NaN, Infinity, -Infinity])('falls back independently for diameter %s', (size) => {
    const { result } = renderHook(() => useGauge({ ...base, size }));
    expect(result.current.circleClassName).toContain('w-[var(--space-14)]');
    expect(result.current.rootProps.style).toEqual({ '--eg-gauge-value': 42.5 });
  });

  it.each([NaN, Infinity, -Infinity])('renders readable unavailable data for %s', (value) => {
    const { container } = render(<Gauge {...base} value={value} state='critical' stateText='High' center='42' />);
    expect(screen.queryByRole('meter')).not.toBeInTheDocument();
    expect(screen.getByText('Capacity')).toBeVisible();
    expect(screen.getByText('Data unavailable')).toBeVisible();
    expect(screen.queryByText('High')).not.toBeInTheDocument();
    expect(screen.queryByText('42')).not.toBeInTheDocument();
    expect(container.querySelector('[aria-valuenow], [aria-valuemin], [aria-valuemax], [aria-valuetext]')).toBeNull();
    expect(container.querySelector('[style]')?.getAttribute('style') ?? '').not.toContain('--eg-gauge-value');
    expect(container.querySelector('.eg-gauge-arc')).toBeNull();
    expect(container.querySelector('.eg-gauge-well')).toBeNull();
  });

  it('updates decimals, unavailable wording and recovery without retaining stale geometry', () => {
    const { rerender } = render(<Gauge {...base} />);
    rerender(<Gauge {...base} value={88.25} valueText='88.25 units' />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuetext', '88.25 units');
    expect(screen.getByRole('meter').style.getPropertyValue('--eg-gauge-value')).toBe('88.25');
    rerender(<Gauge {...base} value={NaN} unavailableText='Sensor offline' />);
    expect(screen.getByText('Sensor offline')).toBeVisible();
    rerender(<Gauge {...base} value={0} />);
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '0');
    expect(screen.queryByText('Sensor offline')).not.toBeInTheDocument();
  });

  it.each(['normal', 'warning', 'critical', 'muted'] as const)(
    'connects visible %s cues with unique descriptions',
    (state) => {
      render(
        <>
          <p id='external'>External context</p>
          <Gauge {...base} state={state} stateText='Condition' aria-describedby='external external' />
          <Gauge {...base} state={state} stateText='Other condition' />
        </>
      );
      const [first, second] = screen.getAllByRole('meter');
      expect(first).toHaveAccessibleDescription('External context Condition');
      expect(second).toHaveAccessibleDescription('Other condition');
      expect(first?.getAttribute('aria-describedby')?.split(' ')).toHaveLength(2);
      expect(first?.getAttribute('aria-describedby')).not.toBe(second?.getAttribute('aria-describedby'));
      expect(first).toHaveAttribute('data-state', state);
      expect(first).not.toHaveAttribute('aria-disabled');
      expect(screen.getByText('Condition').parentElement?.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    }
  );

  it.each([{ center: 0 }, { center: 'Ready' }, { center: <svg aria-label='Decorative icon' /> }])(
    'keeps center decorative: $center',
    ({ center }) => {
      const { container } = render(<Gauge {...base} center={center} />);
      expect(screen.getByRole('meter')).toHaveAccessibleName('Capacity');
      expect(container.querySelector('.eg-gauge-center')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.queryByRole('img')).not.toBeInTheDocument();
    }
  );

  it('protects semantics after native spreading and remains passive to pointer and keyboard', async () => {
    const user = userEvent.setup();
    const hostile: ComponentPropsWithoutRef<'div'> = {
      role: 'button',
      'aria-label': 'Wrong',
      'aria-labelledby': 'wrong',
      'aria-valuenow': 900,
      'aria-valuemin': -1,
      'aria-valuemax': 900,
      'aria-valuetext': 'Wrong',
      'aria-hidden': true,
      'aria-live': 'assertive',
      'aria-disabled': true,
      tabIndex: 0,
      contentEditable: true,
      accessKey: 'g'
    };
    render(
      <>
        <button type='button'>Before</button>
        <Gauge {...hostile} {...base} id='capacity' title='Details' data-owner='host' />
        <button type='button'>After</button>
      </>
    );
    const meter = screen.getByRole('meter', { name: 'Capacity' });
    expect(meter).toHaveAttribute('id', 'capacity');
    expect(meter).toHaveAttribute('title', 'Details');
    expect(meter).toHaveAttribute('data-owner', 'host');
    for (const attribute of [
      'tabindex',
      'contenteditable',
      'accesskey',
      'aria-live',
      'aria-hidden',
      'aria-labelledby',
      'aria-disabled'
    ]) {
      expect(meter).not.toHaveAttribute(attribute);
    }
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.click(meter);
    expect(meter).not.toHaveFocus();
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(meter.querySelector('button, a, input, [tabindex]')).toBeNull();
  });

  it('enforces required names, values, condition text and excluded APIs in the public type', () => {
    expectTypeOf<{ label: string; value: number }>().toExtend<GaugeProps>();
    expectTypeOf<{ label: string }>().not.toExtend<GaugeProps>();
    expectTypeOf<{ value: number }>().not.toExtend<GaugeProps>();
    expectTypeOf<{ label: string; value: number; state: Exclude<GaugeState, 'normal'> }>().not.toExtend<GaugeProps>();
    expectTypeOf<
      Extract<
        keyof GaugeProps,
        'ref' | 'asChild' | 'children' | 'onClick' | 'onChange' | 'defaultValue' | 'role' | 'tabIndex'
      >
    >().toEqualTypeOf<never>();
  });
});
