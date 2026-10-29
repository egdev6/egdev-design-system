import { render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type FormEvent } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { useGaugeDock, useGaugeDockItem, useGaugeDockSeparator } from '@/molecules/gauge-dock/useGaugeDock';
import {
  Button,
  Gauge,
  GaugeDock,
  GaugeDockItem,
  type GaugeDockItemProps,
  type GaugeDockProps,
  GaugeDockSeparator,
  type GaugeDockSeparatorProps,
  Icon,
  IconButton
} from '../../index';

const pair = (name: string, disabled = false, value = 25) => (
  <GaugeDockItem key={name}>
    <Gauge label={`${name} session usage`} value={value} />
    <Button disabled={disabled}>Open {name} session details</Button>
  </GaugeDockItem>
);

function dock(props: Partial<GaugeDockProps> = {}) {
  return (
    <GaugeDock label='Usage detail actions' {...props}>
      {props.children ?? [pair('A'), <GaugeDockSeparator key='separator' />, pair('B', true), pair('C')]}
    </GaugeDock>
  );
}

describe('GaugeDock v0.1 public composition', () => {
  it('renders a named Surface toolbar with separate passive meters and native actions', () => {
    const { container } = render(dock());
    const root = screen.getByRole('toolbar', { name: 'Usage detail actions' });
    expect(root).toHaveClass('eg-surface', 'eg-gauge-dock', 'bg-surface-overlay', 'p-3', 'rounded-full');
    expect(root).toHaveAttribute('aria-orientation', 'horizontal');
    expect(root).toHaveAttribute('dir', 'ltr');
    expect(root).toHaveAttribute('data-orientation', 'horizontal');
    expect(screen.getAllByRole('meter')).toHaveLength(3);
    expect(screen.getAllByRole('button')).toHaveLength(3);
    for (const meter of screen.getAllByRole('meter')) {
      expect(meter.closest('button')).toBeNull();
      expect(meter).not.toHaveAttribute('tabindex');
      expect(meter).not.toHaveAttribute('aria-hidden');
      expect(meter.parentElement).toHaveClass('eg-gauge-dock-item');
      expect(meter.nextElementSibling?.tagName).toBe('BUTTON');
    }
    expect(container.querySelector('.eg-gauge-strip')).toBeNull();
    for (const attr of ['aria-valuenow', 'aria-valuetext', 'aria-live', 'aria-pressed', 'data-state']) {
      expect(root).not.toHaveAttribute(attr);
    }
  });

  it('delegates bounded LTR navigation, disabled skipping, Home/End and Tab exit to Radix', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        {dock()}
        <button type='button'>After</button>
      </>
    );
    const first = screen.getByRole('button', { name: 'Open A session details' });
    const last = screen.getByRole('button', { name: 'Open C session details' });
    await user.tab();
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowLeft}');
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    await waitFor(() => expect(last).toHaveFocus());
    await user.keyboard('{ArrowRight}');
    expect(last).toHaveFocus();
    await user.keyboard('{Home}');
    await waitFor(() => expect(first).toHaveFocus());
    await user.keyboard('{End}');
    await waitFor(() => expect(last).toHaveFocus());
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(last).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
  });

  it.each([
    ['horizontal', 'rtl', '{ArrowLeft}', '{ArrowRight}'],
    ['vertical', 'ltr', '{ArrowDown}', '{ArrowUp}']
  ] as const)(
    'uses the %s %s Radix axis and perpendicular decorative separator',
    async (orientation, dir, next, previous) => {
      const user = userEvent.setup();
      const { container } = render(dock({ orientation, dir }));
      const first = screen.getByRole('button', { name: 'Open A session details' });
      const last = screen.getByRole('button', { name: 'Open C session details' });
      await user.tab();
      expect(first).toHaveFocus();
      await user.keyboard(next);
      await waitFor(() => expect(last).toHaveFocus());
      await user.keyboard(next);
      expect(last).toHaveFocus();
      await user.keyboard(previous);
      await waitFor(() => expect(first).toHaveFocus());
      const separator = container.querySelector('.eg-gauge-dock-separator');
      expect(separator).toHaveAttribute('aria-hidden', 'true');
      expect(separator).toHaveAttribute('data-orientation', orientation === 'horizontal' ? 'vertical' : 'horizontal');
      expect(separator).not.toHaveAttribute('tabindex');
      expect(screen.queryByRole('separator')).toBeNull();
    }
  );

  it('keeps child refs and handlers, Button state and IconButton hidden-text names without form submission', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    const submit = vi.fn((event: FormEvent) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <GaugeDock label='Detail actions'>
          <GaugeDockItem>
            <Gauge label='Provider A session' value={0} />
            <button type='button' ref={ref} onClick={click}>
              Open A
            </button>
          </GaugeDockItem>
          <GaugeDockItem>
            <Gauge label='Provider B session' value={100} />
            <IconButton label='Open B details' icon={<Icon name='arrow-right' />} size='lg' onClick={click} />
          </GaugeDockItem>
          {pair('C')}
        </GaugeDock>
      </form>
    );
    const native = screen.getByRole('button', { name: 'Open A' });
    expect(ref.current).toBe(native);
    await user.click(native);
    await user.keyboard('{Enter} ');
    expect(click).toHaveBeenCalledTimes(3);
    expect(submit).not.toHaveBeenCalled();
    const icon = screen.getByRole('button', { name: 'Open B details' });
    expect(icon).not.toHaveAttribute('aria-label');
    expect(icon).toHaveClass('eg-icon-btn', 'size-12');
    expect(screen.getByRole('button', { name: 'Open C session details' })).toHaveAttribute('data-state', 'idle');
    expect(screen.getAllByRole('button')).toHaveLength(3);
  });

  it('disables only explicit child actions, preserving undimmed readable measurements', async () => {
    const user = userEvent.setup();
    render(
      <>
        <GaugeDock label='Disabled actions'>
          {pair('A', true)}
          {pair('B', true)}
        </GaugeDock>
        <button type='button'>Next</button>
      </>
    );
    expect(screen.getByRole('toolbar')).toHaveAttribute('tabindex', '-1');
    for (const button of screen.getAllByRole('button').slice(0, 2)) {
      expect(button).toBeDisabled();
    }
    for (const meter of screen.getAllByRole('meter')) {
      expect(meter).not.toHaveAttribute('aria-disabled');
      expect(meter.parentElement?.className).not.toMatch(/opacity/);
    }
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('retains independent decimals, conditions, unavailable text and focus on measurement updates', async () => {
    const user = userEvent.setup();
    const readings = (value: number) => (
      <GaugeDock label='Independent actions'>
        <GaugeDockItem>
          <Gauge label='A hourly usage' value={value} state='warning' stateText='Hourly limit near' size='sm' />
          <Button>Open A hourly details</Button>
        </GaugeDockItem>
        <GaugeDockItem>
          <Gauge label='B daily usage' value={Infinity} unavailableText='Daily reading offline' />
          <Button>Open B daily details</Button>
        </GaugeDockItem>
        <GaugeDockItem>
          <Gauge label='C monthly usage' value={72.25} state='muted' stateText='Previous month' />
          <Button>Open C monthly details</Button>
        </GaugeDockItem>
      </GaugeDock>
    );
    const { rerender } = render(readings(-1));
    expect(screen.getByRole('meter', { name: 'A hourly usage' })).toHaveAttribute('aria-valuenow', '0');
    expect(screen.getByText('Hourly limit near')).toBeVisible();
    expect(screen.getByText('Daily reading offline')).toBeVisible();
    expect(screen.queryByRole('meter', { name: 'B daily usage' })).toBeNull();
    const last = screen.getByRole('meter', { name: 'C monthly usage' });
    expect(last).toHaveAttribute('aria-valuetext', '72.25 / 100');
    await user.click(screen.getByRole('button', { name: 'Open B daily details' }));
    rerender(readings(125));
    expect(screen.getByRole('meter', { name: 'A hourly usage' })).toHaveAttribute('aria-valuenow', '100');
    expect(last).toHaveAttribute('aria-valuenow', '72.25');
    expect(screen.getByRole('button', { name: 'Open B daily details' })).toHaveFocus();
    expect(screen.getByRole('button', { name: 'Open C monthly details' })).toBeEnabled();
  });

  it('updates orientation and direction without changing values or adding aggregate semantics', () => {
    const { rerender } = render(dock());
    rerender(dock({ orientation: 'vertical', dir: 'rtl' }));
    const root = screen.getByRole('toolbar');
    expect(root).toHaveAttribute('data-orientation', 'vertical');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(screen.getAllByRole('meter').map((meter) => meter.getAttribute('aria-valuenow'))).toEqual([
      '25',
      '25',
      '25'
    ]);
  });

  it.each([null, undefined, false, [], <></>])('renders no toolbar for empty composed content (%s)', (children) => {
    const { container } = render(<GaugeDock label='Empty actions'>{children}</GaugeDock>);
    expect(container).toBeEmptyDOMElement();
  });

  it('supports arrays and fragments with native attributes and per-part layout merges', () => {
    render(
      <GaugeDock label='Usage actions' className='w-full mt-2' id='dock' aria-describedby='help'>
        <>
          {[pair('A')]}
          <GaugeDockSeparator title='Group boundary' className='mx-2' />
        </>
      </GaugeDock>
    );
    expect(screen.getByRole('toolbar')).toHaveAttribute('id', 'dock');
    expect(screen.getByRole('toolbar')).toHaveAttribute('aria-describedby', 'help');
    expect(screen.getByRole('toolbar')).toHaveClass('w-full', 'mt-2', 'overflow-auto', 'flex-nowrap');
    expect(screen.getByTitle('Group boundary')).toHaveClass('mx-2');
  });

  it('protects Radix semantics against untyped root and part overrides', () => {
    const injected = { role: 'group', tabIndex: 4, 'aria-label': 'Wrong name', 'aria-labelledby': 'wrong' };
    const { container } = render(
      <GaugeDock label='Protected actions' {...(injected as unknown as Partial<GaugeDockProps>)}>
        <GaugeDockItem {...(injected as unknown as Partial<GaugeDockItemProps>)}>
          <Gauge label='Session usage' value={42} />
          <Button>Open details</Button>
        </GaugeDockItem>
        <GaugeDockSeparator
          {...({ role: 'separator', tabIndex: 0, 'aria-hidden': false } as unknown as GaugeDockSeparatorProps)}
        />
      </GaugeDock>
    );
    expect(screen.getByRole('toolbar', { name: 'Protected actions' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('toolbar')).not.toHaveAttribute('aria-labelledby');
    expect(container.querySelector('.eg-gauge-dock-item')).not.toHaveAttribute('tabindex');
    expect(container.querySelector('.eg-gauge-dock-separator')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('separator')).toBeNull();
  });

  it('keeps tuple cardinality and unsupported APIs out of the public types', () => {
    expectTypeOf<GaugeDockItemProps['children']['length']>().toEqualTypeOf<2>();
    expectTypeOf<Extract<keyof GaugeDockProps, 'value' | 'asChild' | 'ref' | 'role'>>().toEqualTypeOf<never>();
    expectTypeOf<GaugeDockProps['dir']>().toEqualTypeOf<'ltr' | 'rtl' | undefined>();
    expectTypeOf<Extract<keyof GaugeDockSeparatorProps, 'orientation' | 'children'>>().toEqualTypeOf<never>();
  });

  it('renders server-side independent meter and action semantics', () => {
    const html = renderToString(dock());
    expect(html).toContain('role="toolbar"');
    expect(html.match(/role="meter"/g)).toHaveLength(3);
    expect(html.match(/<button/g)).toHaveLength(3);
    expect(html).not.toContain('eg-gauge-strip');
  });
});

describe('GaugeDock preparation', () => {
  it('prepares public defaults, part layout and explicit disabled forwarding without mutating the Gauge', () => {
    const gauge = <Gauge label='Session usage' value={42} />;
    const action = <Button disabled={true}>Open details</Button>;
    const { result } = renderHook(() => ({
      root: useGaugeDock({ label: 'Usage actions', children: null }),
      item: useGaugeDockItem({ children: [gauge, action], className: 'mt-2', id: 'pair' }),
      separator: useGaugeDockSeparator({ className: 'mx-2' })
    }));
    expect(result.current.root.orientation).toBe('horizontal');
    expect(result.current.root.dir).toBe('ltr');
    expect(result.current.root.empty).toBe(true);
    expect(result.current.item.gauge).toBe(gauge);
    expect(result.current.item.action).toBe(action);
    expect(result.current.item.disabled).toBe(true);
    expect(result.current.item.itemProps).toMatchObject({ id: 'pair', className: expect.stringContaining('mt-2') });
    expect(result.current.separator.className).toContain('eg-gauge-dock-separator');
  });
});
