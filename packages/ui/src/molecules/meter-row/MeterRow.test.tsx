import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { MeterRow } from './index';
import { useMeterRow } from './useMeterRow';

const base = { label: 'Import files', value: 45 };
const row = (container: HTMLElement) => container.firstElementChild as HTMLElement;

describe('MeterRow task progress', () => {
  it('omits edge entirely and passes only supported atom inputs from the real hook', () => {
    const { result, rerender } = renderHook(({ value }) => useMeterRow({ ...base, value, help: 'Context' }), {
      initialProps: { value: 142 }
    });
    expect(result.current.progressProps).toMatchObject({
      value: 100,
      valueText: '100%',
      label: base.label,
      size: 'lg',
      variant: 'default'
    });
    expect(result.current.progressProps).not.toHaveProperty('edge');
    expect(result.current.progressProps).not.toHaveProperty('className');
    expect(result.current.progressProps).not.toHaveProperty('role');
    expect(result.current.headerProps['aria-hidden']).toBe(true);
    rerender({ value: Infinity });
    expect(result.current.progressProps.value).toBe(Infinity);
    expect(result.current.progressProps.valueText).toBeUndefined();
    expect(result.current.progressProps['aria-describedby']).toBe(
      `${result.current.valueProps.id} ${result.current.helpProps.id}`
    );
  });
  it('coordinates one named progressbar with a hidden visible header and no extra semantic value', () => {
    const { container } = render(<MeterRow {...base} />);
    const bar = screen.getByRole('progressbar', { name: base.label });
    expect(screen.getAllByRole('progressbar')).toHaveLength(1);
    expect(screen.getByText(base.label)).toBeVisible();
    expect(screen.getByText('45%')).toBeVisible();
    expect(screen.getByText(base.label).closest('[aria-hidden]')).toHaveAttribute('aria-hidden', 'true');
    expect(row(container)).toHaveClass('eg-meter-row', 'flex', 'flex-col', 'min-w-0', 'gap-2', 'font-sans');
    expect(row(container)).not.toHaveAttribute('role');
    expect(row(container)).not.toHaveAttribute('data-state');
    expect(row(container)).toHaveAttribute('data-variant', 'default');
    expect(bar).toHaveAttribute('aria-valuetext', '45%');
    expect(bar).not.toHaveAttribute('aria-describedby');
    expect(container.querySelector('meter, output, [role="meter"], [role="status"], [aria-live]')).toBeNull();
    expect(container.querySelector('p')).toBeNull();
  });

  it.each([
    [-1, 0],
    [0, 0],
    [42.5, 42.5],
    [100, 100],
    [142, 100]
  ])('normalizes %s to %s before text and real atom geometry', (value, expected) => {
    const { container } = render(<MeterRow {...base} value={value} />);
    const bar = screen.getByRole('progressbar', { name: base.label });
    expect(bar).toHaveAttribute('aria-valuemin', '0');
    expect(bar).toHaveAttribute('aria-valuemax', '100');
    expect(bar).toHaveAttribute('aria-valuenow', String(expected));
    expect(bar).toHaveAttribute('aria-valuetext', `${expected}%`);
    expect(screen.getByText(`${expected}%`)).toBeVisible();
    expect(bar).toHaveAttribute('data-state', expected === 100 ? 'complete' : 'loading');
    expect(container.querySelector('.eg-progress-fill')).toHaveStyle({ '--eg-progress-value': String(expected / 100) });
  });

  it('shares the coherent count equivalent without a second announcer', () => {
    render(<MeterRow {...base} value={60} valueText='12 of 20 files imported' />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuetext', '12 of 20 files imported');
    expect(screen.getByText('12 of 20 files imported')).toBeVisible();
  });

  it.each([NaN, Infinity, -Infinity])(
    'describes non-finite %s without a current number or finite value text',
    (value) => {
      const { container } = render(<MeterRow {...base} value={value} valueText='Stale count' help='Preparing files' />);
      const bar = screen.getByRole('progressbar', { name: base.label });
      expect(bar).toHaveAttribute('data-state', 'indeterminate');
      expect(bar).not.toHaveAttribute('aria-valuenow');
      expect(bar).not.toHaveAttribute('aria-valuetext');
      expect(screen.queryByText('Stale count')).toBeNull();
      expect(screen.getByText('In progress')).toBeVisible();
      expect(bar).toHaveAccessibleDescription('In progress Preparing files');
      expect(bar.getAttribute('aria-describedby')?.split(' ')).toEqual([
        screen.getByText('In progress').id,
        screen.getByText('Preparing files').id
      ]);
      expect(container.querySelector('.eg-progress-fill')).toHaveStyle({ '--eg-progress-value': '0' });
    }
  );

  it('recovers across finite/indeterminate renders and clears obsolete description references', () => {
    const { rerender } = render(<MeterRow {...base} help='Keep this tab open' />);
    const bar = screen.getByRole('progressbar');
    const helpId = screen.getByText('Keep this tab open').id;
    rerender(<MeterRow {...base} value={NaN} help='Keep this tab open' messages={{ indeterminate: 'Preparing' }} />);
    expect(bar).toHaveAccessibleDescription('Preparing Keep this tab open');
    expect(bar.getAttribute('aria-describedby')?.split(' ')[1]).toBe(helpId);
    rerender(<MeterRow {...base} value={42.5} help='  ' />);
    expect(screen.getByRole('progressbar')).toBe(bar);
    expect(bar).toHaveAttribute('aria-valuetext', '42.5%');
    expect(bar).not.toHaveAttribute('aria-describedby');
    expect(screen.queryByText('Preparing')).toBeNull();
    expect(document.getElementById(helpId)).toBeNull();
  });

  it.each([undefined, '', ' \n '])('omits absent or blank help %j', (help) => {
    const { container } = render(<MeterRow {...base} help={help} />);
    expect(container.querySelector('p')).toBeNull();
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-describedby');
  });

  it('keeps help outside the indicator and generates independent description ids', () => {
    render(
      <>
        <MeterRow {...base} value={NaN} help='First help' />
        <MeterRow label='Build index' value={NaN} help='Second help' />
      </>
    );
    const bars = screen.getAllByRole('progressbar');
    const ids = bars.flatMap((bar) => bar.getAttribute('aria-describedby')?.split(' ') ?? []);
    expect(new Set(ids).size).toBe(4);
    for (const id of ids) {
      expect(document.getElementById(id)).not.toBeNull();
    }
    expect(screen.getByText('First help').tagName).toBe('P');
    expect(bars[0]?.contains(screen.getByText('First help'))).toBe(false);
    expect(bars[0]).toHaveAccessibleDescription('In progress First help');
  });

  it('uses defaults for omitted dictionary entries and ignores indeterminate copy while finite', () => {
    const { rerender } = render(<MeterRow {...base} value={NaN} messages={{}} />);
    expect(screen.getByText('In progress')).toBeVisible();
    rerender(<MeterRow {...base} value={NaN} messages={{ indeterminate: 'En cours' }} />);
    expect(screen.getByRole('progressbar')).toHaveAccessibleDescription('En cours');
    rerender(<MeterRow {...base} messages={{ indeterminate: 'En cours' }} />);
    expect(screen.queryByText('En cours')).toBeNull();
    expect(screen.getByText('45%')).toBeVisible();
  });

  it('composes the actual lg well, not Gauge, Surface, Text or an edge strip', () => {
    const { container } = render(<MeterRow {...base} variant='muted' />);
    expect(row(container)).toHaveAttribute('data-variant', 'muted');
    expect(screen.getByRole('progressbar')).toHaveClass(
      'eg-progress',
      'h-2.5',
      'w-full',
      'bg-surface-0',
      'shadow-well'
    );
    expect(container.querySelector('.eg-progress-fill')).toHaveClass(
      'bg-fg-muted',
      'shadow-edge-strong',
      'motion-reduce:transition-none'
    );
    expect(container.querySelector('.eg-meter-row__key')).toHaveClass('w-2', 'h-2', 'rounded-full', 'bg-fg-muted');
    expect(container.querySelector('.eg-gauge, .eg-surface, .eg-text')).toBeNull();
    expect(row(container)).not.toHaveAttribute('aria-disabled');
  });

  it('forwards compatible native metadata only to the root and merges supported layout last', () => {
    const { container } = render(
      <MeterRow
        {...base}
        id='import-row'
        title='Import completion'
        dir='rtl'
        data-task='import'
        className='w-48 w-full mt-2 col-span-2'
      />
    );
    expect(row(container)).toHaveAttribute('id', 'import-row');
    expect(row(container)).toHaveAttribute('title', 'Import completion');
    expect(row(container)).toHaveAttribute('dir', 'rtl');
    expect(row(container)).toHaveAttribute('data-task', 'import');
    expect(row(container)).toHaveClass('eg-meter-row', 'w-full', 'mt-2', 'col-span-2');
    expect(row(container)).not.toHaveClass('w-48');
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('id', 'import-row');
    expect(screen.getByText(base.label)).not.toHaveClass('mt-2', 'w-full');
  });

  it('does not permit untyped injection of semantic, activation or composition overrides', () => {
    const injected = {
      role: 'meter',
      tabIndex: 0,
      'aria-label': 'Other',
      'aria-describedby': 'elsewhere',
      'aria-live': 'polite',
      'aria-hidden': true,
      'data-state': 'complete',
      'data-variant': 'other',
      children: 'Injected',
      asChild: true
    } as unknown as Record<string, never>;
    const { container } = render(<MeterRow {...base} {...injected} />);
    expect(row(container)).not.toHaveAttribute('role');
    expect(row(container)).not.toHaveAttribute('tabindex');
    expect(row(container)).not.toHaveAttribute('aria-label');
    expect(row(container)).not.toHaveAttribute('aria-describedby');
    expect(row(container)).not.toHaveAttribute('aria-live');
    expect(row(container)).not.toHaveAttribute('aria-hidden');
    expect(row(container)).not.toHaveAttribute('data-state');
    expect(row(container)).toHaveAttribute('data-variant', 'default');
    expect(screen.queryByText('Injected')).toBeNull();
    expect(screen.getByRole('progressbar', { name: base.label })).toBeInTheDocument();
  });

  it('introduces no tab stop or live region on passive updates', async () => {
    const user = userEvent.setup();
    const { container, rerender } = render(
      <>
        <MeterRow {...base} />
        <button type='button'>Next</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    rerender(
      <>
        <MeterRow {...base} value={100} />
        <button type='button'>Next</button>
      </>
    );
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(container.querySelector('[aria-live], output, [role="status"], [role="alert"]')).toBeNull();
  });

  it('keeps long text wrapping without truncation or internal appearance overrides', () => {
    const { container } = render(
      <MeterRow {...base} valueText='A long completion equivalent' help='A long explanation' />
    );
    expect(screen.getByText(base.label)).toHaveClass(
      'text-label-default',
      'text-fg-default',
      'min-w-0',
      '[overflow-wrap:anywhere]'
    );
    expect(screen.getByText('A long completion equivalent')).toHaveClass(
      'text-label-default',
      'text-fg-default',
      'tabular-nums',
      '[overflow-wrap:anywhere]'
    );
    expect(screen.getByText('A long explanation')).toHaveClass(
      'm-0',
      'text-label-default',
      'text-fg-muted',
      'leading-[var(--text-body-default--line-height)]',
      'font-[var(--text-body-muted--font-weight)]'
    );
    expect(container.querySelector('.truncate, .overflow-hidden:not(.eg-progress)')).toBeNull();
  });
});
