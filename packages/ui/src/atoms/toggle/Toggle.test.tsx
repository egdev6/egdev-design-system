import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { useToggle } from '@/atoms/toggle/useToggle';
import { Slot } from '@/primitives/slot';
import { Icon } from '../icon';
import { Toggle, type ToggleProps } from './index';

describe('Toggle public contract', () => {
  it('derives defaults and separate icon geometry in the hook', () => {
    const { result } = renderHook(() => useToggle({ children: 'Show grid' }));
    expect(result.current.rootProps.className).toContain('eg-toggle');
    expect(result.current.rootProps.defaultPressed).toBe(false);
    expect(result.current.rootProps.className).toContain('h-10');
    expect(result.current.iconProps.className).toContain('size-5');
    expect(result.current.iconOnly).toBe(false);
  });

  it('renders an off button and toggles with click, Enter and Space', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Toggle onPressedChange={change}>Show grid</Toggle>);
    const button = screen.getByRole('button', { name: 'Show grid' });
    expect(button).toHaveClass('eg-toggle', 'box-border', 'border-solid', 'm-0', 'py-0');
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    expect(button).toHaveAttribute('data-state', 'off');
    await user.click(button);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(button).toHaveAttribute('data-state', 'on');
    await user.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard(' ');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(change.mock.calls).toEqual([[true], [false], [true]]);
  });

  it('keeps controlled state until incoming props change without emitting for prop updates', async () => {
    const change = vi.fn();
    const { rerender } = render(
      <Toggle pressed={false} onPressedChange={change}>
        Pin
      </Toggle>
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Pin' }));
    expect(change).toHaveBeenCalledExactlyOnceWith(true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    rerender(
      <Toggle pressed={true} onPressedChange={change}>
        Pin
      </Toggle>
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    expect(change).toHaveBeenCalledTimes(1);
  });

  it('initializes defaultPressed and retains the name while toggling', async () => {
    render(
      <Toggle defaultPressed={true} icon={<Icon name='bookmark' />}>
        Pin
      </Toggle>
    );
    const button = screen.getByRole('button', { name: 'Pin' });
    expect(button).toHaveAttribute('data-state', 'on');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    await userEvent.setup().click(button);
    expect(button).toHaveAccessibleName('Pin');
    expect(button).toHaveAttribute('data-state', 'off');
  });

  it('names icon-only content with AccessibleIcon and hides the glyph', () => {
    render(
      <Toggle
        icon={
          <svg>
            <title>Decorative pin</title>
          </svg>
        }
        label='Pin'
      />
    );
    const button = screen.getByRole('button', { name: 'Pin' });
    expect(button).toHaveClass('size-10', 'p-0');
    expect(button.querySelector('svg')?.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('uses the approved %s dimensions for both content forms', (size) => {
    const dimension = { sm: '8', md: '10', lg: '12' }[size];
    const { rerender } = render(<Toggle size={size}>Pin</Toggle>);
    expect(screen.getByRole('button')).toHaveClass(`h-${dimension}`);
    rerender(<Toggle size={size} icon={<Icon name='bookmark' />} label='Pin' />);
    expect(screen.getByRole('button')).toHaveClass(`size-${dimension}`);
    expect(screen.getByRole('button').querySelector('span')).toHaveClass(size === 'sm' ? 'size-4' : 'size-5');
  });

  it.each([false, true])('blocks disabled activation and keyboard focus with pressed=%s', async (pressed) => {
    const change = vi.fn();
    render(
      <>
        <Toggle disabled={true} defaultPressed={pressed} onPressedChange={change}>
          Pin
        </Toggle>
        <button type='button'>Next</button>
      </>
    );
    const button = screen.getByRole('button', { name: 'Pin' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled');
    const user = userEvent.setup();
    await user.click(button);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(button).toHaveAttribute('aria-pressed', String(pressed));
    expect(change).not.toHaveBeenCalled();
  });

  it('forwards native attributes, handlers and button refs; merges root layout last', async () => {
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    render(
      <Toggle ref={ref} id='pin' title='Pin layer' data-layer='one' className='self-start m-2' onClick={click}>
        Pin
      </Toggle>
    );
    const button = screen.getByRole('button');
    expect(ref.current === button).toBe(true);
    expect(button).toHaveAttribute('id', 'pin');
    expect(button).toHaveAttribute('data-layer', 'one');
    expect(button).toHaveClass('eg-toggle', 'self-start', 'm-2');
    expect(button).not.toHaveClass('m-0');
    await userEvent.setup().click(button);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('supports an outer Slot trigger forwarding props and ref to the native button', async () => {
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    render(
      <Slot ref={ref} onClick={click} aria-describedby='pin-help'>
        <Toggle>Pin</Toggle>
      </Slot>
    );
    const button = screen.getByRole('button', { name: 'Pin' });
    expect(ref.current === button).toBe(true);
    expect(button).toHaveAttribute('aria-describedby', 'pin-help');
    await userEvent.setup().click(button);
    expect(click).toHaveBeenCalledTimes(1);
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('respects prevented native activation without emitting a change or submitting its form', async () => {
    const change = vi.fn();
    const submit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Toggle onClick={(event) => event.preventDefault()} onPressedChange={change}>
          Pin
        </Toggle>
      </form>
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Pin' }));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    expect(change).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });

  it('protects Radix-owned state and always renders a button at the runtime boundary', () => {
    const unsafe = {
      children: 'Pin',
      asChild: true,
      'aria-pressed': 'mixed',
      'data-state': 'invented'
    } as unknown as ToggleProps;
    render(<Toggle {...unsafe} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button')).toHaveAttribute('data-state', 'off');
  });
});
