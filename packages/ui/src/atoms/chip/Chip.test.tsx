import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from '../icon';
import { Chip, type ChipProps, chipVariants } from './index';
import { useChip } from './useChip';

describe('Chip public contract', () => {
  it('derives the uncontrolled default and per-part classes in the hook', () => {
    const { result } = renderHook(() => useChip({ children: 'Design' }));
    expect(result.current.rootProps.defaultPressed).toBe(false);
    expect(result.current.rootProps.className).toContain('eg-chip');
    expect(result.current.iconProps).toEqual({ className: 'size-3.5 shrink-0', 'aria-hidden': true });
    expect(result.current.showIcon).toBe(false);
  });

  it('renders an off button with its stable marker by default (AC-01)', () => {
    render(<Chip>Design</Chip>);
    const chip = screen.getByRole('button', { name: 'Design' });
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveClass('eg-chip');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(chip).toHaveAttribute('data-state', 'off');
  });

  it('toggles with click, Enter and Space and reports the next boolean (AC-02)', async () => {
    const user = userEvent.setup();
    const change = vi.fn();
    render(<Chip onPressedChange={change}>Design</Chip>);
    const chip = screen.getByRole('button', { name: 'Design' });
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(chip).toHaveAttribute('data-state', 'on');
    await user.keyboard('{Enter}');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.keyboard(' ');
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(change.mock.calls).toEqual([[true], [false], [true]]);
  });

  it('starts on with defaultPressed', () => {
    render(<Chip defaultPressed={true}>Design</Chip>);
    expect(screen.getByRole('button', { name: 'Design' })).toHaveAttribute('data-state', 'on');
  });

  it('lets controlled pressed win and emits only for user interaction (AC-04)', async () => {
    const change = vi.fn();
    const { rerender } = render(
      <Chip pressed={false} onPressedChange={change}>
        Design
      </Chip>
    );
    const chip = screen.getByRole('button', { name: 'Design' });
    await userEvent.setup().click(chip);
    expect(change).toHaveBeenCalledExactlyOnceWith(true);
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    rerender(
      <Chip pressed={true} onPressedChange={change}>
        Design
      </Chip>
    );
    expect(chip).toHaveAttribute('aria-pressed', 'true');
    expect(change).toHaveBeenCalledTimes(1);
  });

  it.each([false, true])('blocks focus and toggling when disabled with pressed=%s (AC-05)', async (pressed) => {
    const change = vi.fn();
    render(
      <>
        <Chip disabled={true} defaultPressed={pressed} onPressedChange={change}>
          Design
        </Chip>
        <button type='button'>Next</button>
      </>
    );
    const chip = screen.getByRole('button', { name: 'Design' });
    expect(chip).toBeDisabled();
    expect(chip).toHaveAttribute('data-disabled');
    const user = userEvent.setup();
    await user.click(chip);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(chip).toHaveAttribute('aria-pressed', String(pressed));
    expect(change).not.toHaveBeenCalled();
  });

  it('hides the leading icon and names the chip by its label only (AC-06)', () => {
    render(<Chip icon={<Icon name='bookmark' className='size-3.5' />}>Saved</Chip>);
    const chip = screen.getByRole('button', { name: 'Saved' });
    const wrapper = chip.firstElementChild;
    expect(wrapper?.tagName).toBe('SPAN');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveClass('size-3.5', 'shrink-0');
    expect(wrapper?.querySelector('svg')).not.toBeNull();
    expect(chip).toHaveTextContent(/^Saved$/);
  });

  it.each([null, false, undefined])('renders no icon wrapper for empty icon %s', (icon) => {
    render(<Chip icon={icon}>Design</Chip>);
    expect(screen.getByRole('button').querySelector('[aria-hidden]')).toBeNull();
  });

  it('resolves the documented off, hover, on, press, focus and disabled utilities (AC-03, AC-07)', () => {
    const classes = chipVariants().split(' ');
    for (const utility of [
      'eg-chip',
      'min-h-8',
      'pointer-coarse:min-h-11',
      'rounded-full',
      'border-border-hairline',
      '[background:var(--gradient-sheen),var(--color-surface-1)]',
      'shadow-edge',
      'text-label-default',
      'text-fg-secondary',
      'transition-colors',
      'hover:border-border-hairline-strong',
      'hover:[background:var(--gradient-sheen),var(--color-surface-2)]',
      'hover:text-fg-default',
      'data-[state=on]:border-primitive-red-neon/60',
      'data-[state=on]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
      'data-[state=on]:shadow-[var(--shadow-edge-strong),var(--shadow-glow-base)]',
      'data-[state=on]:text-fg-default',
      'active:translate-y-px',
      'active:scale-[.97]',
      'motion-reduce:active:transform-none',
      'motion-reduce:active:translate-none',
      'motion-reduce:active:scale-none',
      'focus-visible:outline-none',
      'focus-visible:shadow-focus',
      'data-[state=on]:focus-visible:shadow-focus',
      'disabled:opacity-45',
      'disabled:pointer-events-none'
    ]) {
      expect(classes, utility).toContain(utility);
    }
  });

  it('merges consumer layout last and forwards native attributes without dropping eg-chip (AC-08)', async () => {
    const click = vi.fn();
    render(
      <Chip id='topic' title='Design topic' name='topic' data-topic='design' className='m-2 self-start' onClick={click}>
        Design
      </Chip>
    );
    const chip = screen.getByRole('button', { name: 'Design' });
    expect(chip).toHaveClass('eg-chip', 'm-2', 'self-start');
    expect(chip).toHaveAttribute('id', 'topic');
    expect(chip).toHaveAttribute('title', 'Design topic');
    expect(chip).toHaveAttribute('name', 'topic');
    expect(chip).toHaveAttribute('data-topic', 'design');
    await userEvent.setup().click(chip);
    expect(click).toHaveBeenCalledTimes(1);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });

  it('respects prevented activation without toggling or submitting its form', async () => {
    const change = vi.fn();
    const submit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <Chip onClick={(event) => event.preventDefault()} onPressedChange={change}>
          Design
        </Chip>
      </form>
    );
    await userEvent.setup().click(screen.getByRole('button', { name: 'Design' }));
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    expect(change).not.toHaveBeenCalled();
    expect(submit).not.toHaveBeenCalled();
  });

  it('keeps Radix-owned state and the button type at the runtime boundary', async () => {
    const submit = vi.fn((event: React.SubmitEvent<HTMLFormElement>) => event.preventDefault());
    const unsafe = {
      children: 'Design',
      asChild: true,
      type: 'submit',
      'aria-pressed': 'mixed',
      'data-state': 'invented'
    } as unknown as ChipProps;
    render(
      <form onSubmit={submit}>
        <Chip {...unsafe} />
      </form>
    );
    const chip = screen.getByRole('button', { name: 'Design' });
    expect(chip.tagName).toBe('BUTTON');
    expect(chip).toHaveAttribute('type', 'button');
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    expect(chip).toHaveAttribute('data-state', 'off');
    await userEvent.setup().click(chip);
    expect(submit).not.toHaveBeenCalled();
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });
});
