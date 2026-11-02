import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from '../icon';
import { Chip, type ChipProps, chipVariants } from './index';
import { useChip } from './useChip';

// Compile-time contract fixtures: every line below must stay rejected.
export const chipRejectedInputs = () => {
  // @ts-expect-error Chip always requires its visible label.
  const unlabelled: ChipProps = {};
  // @ts-expect-error asChild is not public in any mode.
  const slotted: ChipProps = { children: 'Design', asChild: true };
  // @ts-expect-error aria-pressed is owned by Radix, not an incoming override.
  const overridden: ChipProps = { children: 'Design', 'aria-pressed': true };
  // @ts-expect-error The toggle button type is always button.
  const submit: ChipProps = { children: 'Design', type: 'submit' };
  // @ts-expect-error Pressed state is boolean, not value selection.
  const valued: ChipProps = { children: 'Design', value: 'design' };
  // @ts-expect-error Chip has no size axis.
  const sized: ChipProps = { children: 'Design', size: 'sm' };
  // @ts-expect-error No mode offers a public ref API.
  const referenced: ChipProps = { children: 'Design', ref: createRef<HTMLButtonElement>() };
  // @ts-expect-error pressed is a boolean, not a string state.
  const stringPressed: ChipProps = { children: 'Design', pressed: 'on' };
  // @ts-expect-error Static mode rejects pressed state.
  const pressedStatic: ChipProps = { mode: 'static', children: 'Design', pressed: true };
  // @ts-expect-error Static mode rejects a disabled flag.
  const disabledStatic: ChipProps = { mode: 'static', children: 'Design', disabled: true };
  // @ts-expect-error Static mode rejects a destination.
  const linkedStatic: ChipProps = { mode: 'static', children: 'Design', href: '#topics' };
  // @ts-expect-error Link mode requires its destination.
  const hrefLessLink: ChipProps = { mode: 'link', children: 'Design' };
  // @ts-expect-error Link mode rejects pressed state.
  const pressedLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', pressed: true };
  // @ts-expect-error Toggle mode rejects a destination.
  const hrefToggle: ChipProps = { children: 'Design', href: '#topics' };
  // @ts-expect-error mode is a closed union of the three roles.
  const unknownMode: ChipProps = { mode: 'button', children: 'Design' };
  return [
    unlabelled,
    slotted,
    overridden,
    submit,
    valued,
    sized,
    referenced,
    stringPressed,
    pressedStatic,
    disabledStatic,
    linkedStatic,
    hrefLessLink,
    pressedLink,
    hrefToggle,
    unknownMode
  ];
};

describe('Chip public contract', () => {
  it('derives the uncontrolled default and per-part classes in the hook', () => {
    const { result } = renderHook(() => useChip({ children: 'Design' }));
    expect(result.current.mode).toBe('toggle');
    if (result.current.mode !== 'toggle') {
      throw new Error('expected the default toggle branch');
    }
    expect(result.current.rootProps.defaultPressed).toBe(false);
    expect(result.current.rootProps.className).toContain('eg-chip');
    expect(result.current.iconProps['aria-hidden']).toBe(true);
    expect(result.current.iconProps.className.split(' ')).toEqual(
      expect.arrayContaining(['size-3.5', 'shrink-0', 'inline-flex', 'items-center', 'justify-center', '[&>svg]:block'])
    );
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

  it('lets controlled pressed win and emits only for user interaction (AC-03)', async () => {
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

  it.each([false, true])('blocks focus and toggling when disabled with pressed=%s (AC-04)', async (pressed) => {
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

  it('hides the leading icon and names the chip by its label only (AC-10 toggle)', () => {
    render(<Chip icon={<Icon name='bookmark' className='size-3.5' />}>Saved</Chip>);
    const chip = screen.getByRole('button', { name: 'Saved' });
    const wrapper = chip.firstElementChild;
    expect(wrapper?.tagName).toBe('SPAN');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper).toHaveClass(
      'size-3.5',
      'shrink-0',
      'inline-flex',
      'items-center',
      'justify-center',
      '[&>svg]:block',
      '[&>svg]:size-full'
    );
    expect(wrapper?.querySelector('svg')).not.toBeNull();
    expect(chip).toHaveTextContent(/^Saved$/);
  });

  it.each([null, false, undefined])('renders no icon wrapper for empty icon %s', (icon) => {
    render(<Chip icon={icon}>Design</Chip>);
    expect(screen.getByRole('button').querySelector('[aria-hidden]')).toBeNull();
  });

  it('resolves the documented off, hover, on, press, focus and disabled utilities (AC-12 toggle)', () => {
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

  it('merges consumer layout last and forwards native attributes without dropping eg-chip (AC-11 toggle)', async () => {
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

describe('Chip mode contract', () => {
  it('renders one span with no control semantics and skips the Tab order in static mode (AC-05)', async () => {
    const user = userEvent.setup();
    render(
      <>
        <Chip mode='static'>Open Source</Chip>
        <button type='button'>Next</button>
      </>
    );
    const chip = screen.getByText('Open Source');
    expect(chip.tagName).toBe('SPAN');
    expect(chip).toHaveClass('eg-chip');
    expect(chip).not.toHaveAttribute('role');
    expect(chip).not.toHaveAttribute('tabindex');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(chip).not.toHaveAttribute('data-state');
    expect(screen.queryByRole('button', { name: 'Open Source' })).toBeNull();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
  });

  it('keeps the shared pill utilities and resolves no interactive utility in static mode (AC-06)', () => {
    const classes = chipVariants({ mode: 'static' }).split(' ');
    for (const utility of [
      'eg-chip',
      'inline-flex',
      'items-center',
      'gap-1.5',
      'min-h-8',
      'px-2.5',
      'py-1.5',
      'rounded-full',
      'border-border-hairline',
      '[background:var(--gradient-sheen),var(--color-surface-1)]',
      'shadow-edge',
      'text-label-default',
      'text-fg-secondary',
      'whitespace-nowrap'
    ]) {
      expect(classes, utility).toContain(utility);
    }
    for (const utility of ['cursor-pointer', 'transition-colors', 'pointer-coarse:min-h-11', 'disabled:opacity-45']) {
      expect(classes, utility).not.toContain(utility);
    }
    expect(
      classes.filter((utility) => /^(hover:|active:|focus-visible:|disabled:|data-\[state)/.test(utility)),
      'no interactive state utility'
    ).toEqual([]);
  });

  it('renders a native anchor with native keyboard behavior in link mode (AC-07)', async () => {
    const user = userEvent.setup();
    const click = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => event.preventDefault());
    render(
      <Chip mode='link' href='#topics' onClick={click}>
        Topics
      </Chip>
    );
    const chip = screen.getByRole('link', { name: 'Topics' });
    expect(chip.tagName).toBe('A');
    expect(chip).toHaveAttribute('href', '#topics');
    expect(chip).toHaveClass('eg-chip', 'no-underline');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(chip).not.toHaveAttribute('data-state');
    await user.tab();
    expect(chip).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
    await user.keyboard(' ');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('adds target, safe rel and the hidden notice only when external (AC-08)', () => {
    const { unmount } = render(
      <Chip mode='link' href='https://example.com' external={true} newTabText='(new window)'>
        Docs
      </Chip>
    );
    const external = screen.getByRole('link', { name: 'Docs (new window)' });
    expect(external).toHaveAttribute('target', '_blank');
    expect(external).toHaveAttribute('rel', 'noopener noreferrer');
    expect(external).toContainElement(screen.getByText('(new window)'));
    unmount();
    render(
      <Chip mode='link' href='#docs'>
        Docs
      </Chip>
    );
    const sameTab = screen.getByRole('link', { name: 'Docs' });
    expect(sameTab).not.toHaveAttribute('target');
    expect(sameTab).not.toHaveAttribute('rel');
    expect(screen.queryByText('(opens in a new tab)')).toBeNull();
  });

  it('ignores cross-mode props at runtime in every mode (AC-09)', async () => {
    const submit = vi.fn((event: React.FormEvent<HTMLFormElement>) => event.preventDefault());
    const unsafe = (props: object) => props as unknown as ChipProps;
    const { unmount } = render(
      <form onSubmit={submit}>
        <Chip {...unsafe({ mode: 'static', children: 'Static', pressed: true, disabled: true, href: '/wrong' })} />
        <button type='submit'>Send</button>
      </form>
    );
    const stat = screen.getByText('Static');
    expect(stat.tagName).toBe('SPAN');
    expect(stat).not.toHaveAttribute('aria-pressed');
    expect(stat).not.toHaveAttribute('href');
    await userEvent.setup().click(stat);
    expect(submit).not.toHaveBeenCalled();
    unmount();
    const { unmount: unmountLink } = render(
      <form onSubmit={submit}>
        <Chip
          {...unsafe({
            mode: 'link',
            href: '#target',
            children: 'Link',
            pressed: true,
            disabled: true,
            type: 'submit'
          })}
        />
        <button type='submit'>Send</button>
      </form>
    );
    const link = screen.getByRole('link', { name: 'Link' });
    expect(link.tagName).toBe('A');
    expect(link).not.toHaveAttribute('aria-pressed');
    await userEvent.setup().click(link);
    expect(submit).not.toHaveBeenCalled();
    unmountLink();
    render(
      <form onSubmit={submit}>
        <Chip
          {...unsafe({
            children: 'Toggle',
            href: '#elsewhere',
            external: true,
            newTabText: '(new window)',
            asChild: true,
            type: 'submit'
          })}
        />
        <button type='submit'>Send</button>
      </form>
    );
    const toggle = screen.getByRole('button', { name: 'Toggle' });
    expect(toggle.tagName).toBe('BUTTON');
    expect(toggle).not.toHaveAttribute('href');
    expect(toggle).not.toHaveAttribute('target');
    expect(toggle).toHaveAttribute('type', 'button');
    expect(screen.queryByText('(new window)')).toBeNull();
    await userEvent.setup().click(toggle);
    expect(submit).not.toHaveBeenCalled();
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
  });

  it('hides the icon and keeps the label as the accessible name in every mode (AC-10)', () => {
    render(
      <>
        <Chip icon={<Icon name='bookmark' className='size-3.5' />}>Toggle</Chip>
        <Chip mode='static' icon={<Icon name='bookmark' className='size-3.5' />}>
          Static
        </Chip>
        <Chip mode='link' href='#saved' icon={<Icon name='bookmark' className='size-3.5' />}>
          Link
        </Chip>
      </>
    );
    for (const [role, name] of [
      ['button', 'Toggle'],
      ['link', 'Link']
    ] as const) {
      const chip = screen.getByRole(role, { name });
      const wrapper = chip.querySelector('[aria-hidden="true"]');
      expect(wrapper?.tagName, name).toBe('SPAN');
      expect(chip).toHaveTextContent(new RegExp(`^${name}$`));
    }
    const stat = screen.getByText('Static');
    expect(stat.querySelector('[aria-hidden="true"]')?.tagName).toBe('SPAN');
    expect(stat).toHaveTextContent(/^Static$/);
  });

  it('merges className last and keeps eg-chip in every mode (AC-11)', () => {
    render(
      <>
        <Chip className='m-2'>Toggle</Chip>
        <Chip mode='static' className='m-3'>
          Static
        </Chip>
        <Chip mode='link' href='#layout' className='m-4'>
          Link
        </Chip>
      </>
    );
    const toggle = screen.getByRole('button', { name: 'Toggle' });
    const stat = screen.getByText('Static');
    const link = screen.getByRole('link', { name: 'Link' });
    expect(toggle).toHaveClass('eg-chip', 'm-2');
    expect(stat).toHaveClass('eg-chip', 'm-3');
    expect(link).toHaveClass('eg-chip', 'm-4');
    for (const [chip, utility] of [
      [toggle, 'm-2'],
      [stat, 'm-3'],
      [link, 'm-4']
    ] as const) {
      expect(chip.className.trim().endsWith(utility), utility).toBe(true);
    }
  });

  it('keeps chipVariants() equal to the explicit toggle mode for ChipGroup (AC-12)', () => {
    expect(chipVariants()).toBe(chipVariants({ mode: 'toggle' }));
    expect(chipVariants({ mode: 'toggle' }).split(' ')).toEqual(chipVariants().split(' '));
  });

  it('adds no list semantics around static chips (AC-13)', () => {
    render(
      <ul aria-label='Topics'>
        <li>
          <Chip mode='static'>React</Chip>
        </li>
        <li>
          <Chip mode='static'>CSS</Chip>
        </li>
      </ul>
    );
    const list = screen.getByRole('list', { name: 'Topics' });
    expect(list.tagName).toBe('UL');
    expect(within(list).getAllByRole('listitem')).toHaveLength(2);
    expect(within(list).queryAllByRole('button')).toHaveLength(0);
    expect(within(list).queryAllByRole('link')).toHaveLength(0);
  });
});
