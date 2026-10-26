import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { StatusDot } from './StatusDot';
import type { StatusDotState } from './types';
import { statusDotVariants } from './types';
import { useStatusDot } from './useStatusDot';

const PULSE = 'motion-safe:animate-[eg-status-dot-pulse_2.4s_var(--ease-out)_infinite]';

const statusStates: [StatusDotState, string][] = [
  ['running', 'bg-status-success'],
  ['idle', 'bg-status-info'],
  ['warning', 'bg-status-warning'],
  ['error', 'bg-status-danger'],
  ['stopped', 'bg-primitive-neutral-600']
];
const signalStates: [StatusDotState, string][] = [
  ['live', 'bg-fg-brand-default'],
  ['standby', 'bg-primitive-white']
];
const fills = [...statusStates, ...signalStates].map(([, fill]) => fill);

function root(container: HTMLElement) {
  const dot = container.querySelector('.eg-status-dot');
  if (!dot) {
    throw new Error('Missing eg-status-dot root');
  }
  return dot;
}

function classes(state?: StatusDotState, pulse?: boolean) {
  return statusDotVariants({ state, pulse }).split(' ');
}

describe('StatusDot', () => {
  it('renders an empty, hidden span.eg-status-dot in the stopped state by default (AC-01)', () => {
    const { container } = render(<StatusDot />);
    const dot = root(container);
    expect(dot.tagName).toBe('SPAN');
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot).toHaveAttribute('data-state', 'stopped');
    expect(dot).not.toHaveAttribute('role');
    expect(dot.childNodes).toHaveLength(0);
    expect(dot).toHaveClass('inline-block', 'shrink-0', 'rounded-full', 'bg-primitive-neutral-600');
  });

  it.each(statusStates)('resolves %s to an 8px ringed %s dot without glow (AC-02)', (state, fill) => {
    const resolved = classes(state);
    expect(resolved).toEqual(expect.arrayContaining(['size-2', 'ring-2', 'ring-bg-surface', fill]));
    expect(resolved).not.toContain('size-2.5');
    expect(resolved).not.toContain('shadow-glow-hot');
    for (const other of fills.filter((candidate) => candidate !== fill)) {
      expect(resolved).not.toContain(other);
    }
  });

  it.each(signalStates)('resolves %s to a 10px glowing %s dot without ring (AC-02)', (state, fill) => {
    const resolved = classes(state);
    expect(resolved).toEqual(expect.arrayContaining(['size-2.5', 'shadow-glow-hot', fill]));
    expect(resolved).not.toContain('size-2');
    expect(resolved.some((utility) => utility.startsWith('ring-'))).toBe(false);
    for (const other of fills.filter((candidate) => candidate !== fill)) {
      expect(resolved).not.toContain(other);
    }
  });

  it.each([...statusStates, ...signalStates])('keeps every %s variant utility through cn() merging', (state) => {
    const { container } = render(<StatusDot state={state} />);
    const dot = root(container);
    expect(dot.className.split(' ').sort()).toEqual(classes(state).sort());
    expect(dot).toHaveAttribute('data-state', state);
  });

  it.each(['live', 'standby'] as const)('pulses %s by default and stays static with pulse={false} (AC-03)', (state) => {
    expect(classes(state)).toContain(PULSE);
    expect(classes(state, true)).toContain(PULSE);
    expect(classes(state, false)).not.toContain(PULSE);
    const { container } = render(<StatusDot state={state} pulse={false} />);
    expect(root(container).className).not.toMatch(/animate/);
  });

  it.each(statusStates)('ignores pulse for the %s status state (AC-03)', (state) => {
    for (const pulse of [undefined, true, false]) {
      expect(statusDotVariants({ state, pulse })).not.toMatch(/animate/);
    }
  });

  it('only animates through a motion-safe utility, so reduced motion stays static (AC-04)', () => {
    const { container } = render(<StatusDot state='live' />);
    const animations = root(container)
      .className.split(' ')
      .filter((utility) => utility.includes('animate'));
    expect(animations).toEqual([PULSE]);
  });

  it('stays out of the accessibility tree while adjacent text supplies the meaning (AC-06)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <span>
          <StatusDot state='running' />
          egdev-publish, running
        </span>
        <button type='button'>Next</button>
      </>
    );
    expect(screen.getByText('egdev-publish, running')).toBeInTheDocument();
    expect(screen.queryByRole('img')).toBeNull();
    expect(screen.queryByRole('status')).toBeNull();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(document.querySelector('.eg-status-dot')).not.toHaveAttribute('tabindex');
  });

  it('merges outer layout className last and keeps the eg-status-dot marker (AC-07)', () => {
    const { container } = render(<StatusDot state='error' className='absolute top-1 right-1 consumer-dot' />);
    const dot = root(container);
    expect(dot).toHaveClass('eg-status-dot', 'bg-status-danger', 'absolute', 'top-1', 'right-1', 'consumer-dot');
    expect(dot.className.split(' ').at(-1)).toBe('consumer-dot');
  });

  it('forwards native span attributes to the root (AC-07)', () => {
    const { container } = render(<StatusDot id='publish-dot' title='Running' data-source='consumer' lang='en' />);
    const dot = root(container);
    expect(dot).toHaveAttribute('id', 'publish-dot');
    expect(dot).toHaveAttribute('title', 'Running');
    expect(dot).toHaveAttribute('data-source', 'consumer');
    expect(dot).toHaveAttribute('lang', 'en');
  });

  it('keeps component-owned semantics against unsupported JavaScript prop spreads', () => {
    const unsupported = {
      children: 'Injected',
      role: 'status',
      'aria-hidden': false,
      'aria-label': 'Running',
      'aria-labelledby': 'elsewhere',
      'data-state': 'overridden'
    };
    const { container } = render(<StatusDot {...unsupported} state='idle' />);
    const dot = root(container);
    expect(dot).toHaveAttribute('aria-hidden', 'true');
    expect(dot).toHaveAttribute('data-state', 'idle');
    for (const attribute of ['role', 'aria-label', 'aria-labelledby']) {
      expect(dot).not.toHaveAttribute(attribute);
    }
    expect(dot).toHaveTextContent('');
  });

  it('derives data-state, hiddenness and classes in the hook without leaking own props', () => {
    const { result } = renderHook(() => useStatusDot({ state: 'standby', pulse: false, id: 'next-live' }));
    expect(result.current.rootProps).toMatchObject({
      id: 'next-live',
      'aria-hidden': true,
      'data-state': 'standby'
    });
    expect(result.current.rootProps).not.toHaveProperty('state');
    expect(result.current.rootProps).not.toHaveProperty('pulse');
    expect(result.current.rootProps.className).toContain('bg-primitive-white');
    expect(result.current.rootProps.className).not.toContain('animate');
  });
});
