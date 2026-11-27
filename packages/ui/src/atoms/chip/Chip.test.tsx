import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { createAccentTheme } from '@egdev/tokens/accent';
import tailwindcss from '@tailwindcss/vite';
import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { build } from 'vite';
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
  // @ts-expect-error Link mode narrows aria-current to page or true: step is rejected.
  const stepLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': 'step' };
  // @ts-expect-error Link mode narrows aria-current to page or true: location is rejected.
  const locationLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': 'location' };
  // @ts-expect-error Link mode narrows aria-current to page or true: date is rejected.
  const dateLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': 'date' };
  // @ts-expect-error Link mode narrows aria-current to page or true: time is rejected.
  const timeLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': 'time' };
  // @ts-expect-error Link mode narrows aria-current to page or true: the string false is rejected.
  const falseStringLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': 'false' };
  // @ts-expect-error Link mode narrows aria-current to page or true: the boolean true is rejected.
  const trueBooleanLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': true };
  // @ts-expect-error Link mode narrows aria-current to page or true: the boolean false is rejected.
  const falseBooleanLink: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': false };
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
    unknownMode,
    stepLink,
    locationLink,
    dateLink,
    timeLink,
    falseStringLink,
    trueBooleanLink,
    falseBooleanLink
  ];
};

// Compile-time contract fixtures: every line below must stay accepted.
export const chipCurrentAccepted = () => {
  const page: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': 'page' };
  const current: ChipProps = { mode: 'link', href: '#topics', children: 'Design', 'aria-current': 'true' };
  // Toggle and static keep the full native union, so the narrowing is link-only.
  const toggleStep: ChipProps = { children: 'Design', 'aria-current': 'step' };
  const staticLocation: ChipProps = { mode: 'static', children: 'Design', 'aria-current': 'location' };
  return [page, current, toggleStep, staticLocation];
};

// The v0.2 link recipe, pinned: the base utilities followed by the 11 link-mode utilities, in order.
const chipLinkV02Classes = [
  'eg-chip',
  'box-border',
  'inline-flex',
  'items-center',
  'gap-1.5',
  'min-h-8',
  'px-2.5',
  'py-1.5',
  'rounded-full',
  'border',
  'border-border-hairline',
  '[background:var(--gradient-sheen),var(--color-surface-1)]',
  'shadow-edge',
  'font-sans',
  'text-label-default',
  'text-fg-secondary',
  'whitespace-nowrap',
  'pointer-coarse:min-h-14',
  'cursor-pointer',
  'no-underline',
  'transition-colors',
  'duration-[var(--duration-fast)]',
  'ease-[var(--ease-out)]',
  'hover:border-border-hairline-strong',
  'hover:[background:var(--gradient-sheen),var(--color-surface-2)]',
  'hover:text-fg-default',
  'focus-visible:outline-none',
  'focus-visible:shadow-focus'
];

// Recipe R1 of the link mode (spec v0.3 section 6): the 19 static utilities that paint the current item.
const chipCurrentUtilities = [
  'aria-[current=page]:border-state-selected',
  'aria-[current=true]:border-state-selected',
  'aria-[current=page]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
  'aria-[current=true]:[background:var(--gradient-chip-active),var(--color-surface-1)]',
  'aria-[current=page]:shadow-[var(--shadow-edge-strong)]',
  'aria-[current=true]:shadow-[var(--shadow-edge-strong)]',
  'aria-[current=page]:text-fg-default',
  'aria-[current=true]:text-fg-default',
  'aria-[current=page]:focus-visible:shadow-focus',
  'aria-[current=true]:focus-visible:shadow-focus',
  'forced-colors:focus-visible:outline-solid',
  'forced-colors:focus-visible:outline-(length:--focus-width)',
  'forced-colors:focus-visible:outline-[color:Highlight]',
  'forced-colors:aria-[current=page]:outline-solid',
  'forced-colors:aria-[current=page]:outline-(length:--focus-width)',
  'forced-colors:aria-[current=page]:outline-[color:Highlight]',
  'forced-colors:aria-[current=true]:outline-solid',
  'forced-colors:aria-[current=true]:outline-(length:--focus-width)',
  'forced-colors:aria-[current=true]:outline-[color:Highlight]'
];

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
      'pointer-coarse:min-h-14',
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
      'data-[state=on]:border-state-selected/60',
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

  it('derives the selected border and sheen from accent roles that default to the previous red', () => {
    const classes = chipVariants().split(' ');
    expect(classes).not.toContain('data-[state=on]:border-primitive-red-neon/60');
    expect(classes.filter((utility) => utility.includes('primitive-red'))).toEqual([]);
    const theme = readFileSync(resolve('packages/tokens/src/theme.css'), 'utf8');
    const declared = (name: string) => new RegExp(`^\\s*${name}:\\s*([^;]+);`, 'm').exec(theme)?.[1];
    // Default chain: state-selected -> primary solid background -> the red neon the border used before.
    expect(declared('--color-state-selected')).toBe('var(--color-action-primary-solid-bg)');
    expect(declared('--color-action-primary-solid-bg')).toBe('var(--color-primitive-red-neon)');
    const red = createAccentTheme(null).variables;
    expect(red['--color-state-selected']).toBe('var(--color-action-primary-solid-bg)');
    expect(red['--color-action-primary-solid-bg']).toBe('var(--color-primitive-red-neon)');
    expect(red['--gradient-chip-active']).toBe(declared('--gradient-chip-active'));
    const blue = createAccentTheme('#3b82f6').variables;
    expect(blue['--color-state-selected']).not.toContain('red');
    expect(blue['--gradient-chip-active']).not.toBe(red['--gradient-chip-active']);
  });

  it('compiles the selected border to the same 60% mix, now of the accent-following role', async () => {
    const entry = resolve('packages/ui/src/styles/compiled.css');
    const result = await build({
      configFile: false,
      envDir: false,
      plugins: [tailwindcss({ optimize: false })],
      logLevel: 'warn',
      build: { write: false, minify: false, cssMinify: false, rolldownOptions: { input: entry } }
    });
    const outputs = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const asset = outputs.find((output) => output.type === 'asset' && output.fileName.endsWith('.css'));
    if (asset?.type !== 'asset') {
      throw new Error('Missing production CSS output');
    }
    const css = String(asset.source);
    const selector = String.raw`.data-\[state\=on\]\:border-state-selected\/60`;
    const start = css.indexOf(selector);
    expect(start, selector).toBeGreaterThan(-1);
    const rule = css.slice(start, css.indexOf('}', css.indexOf('}', start) + 1) + 1);
    // The static fallback is the default red; modern engines mix the inherited, accent-following role.
    expect(rule).toMatch(/border-color:\s*color-mix\(in srgb,\s*#FF0036 60%, transparent\)/i);
    expect(rule).toMatch(
      /border-color:\s*color-mix\(in oklab,\s*var\(--color-state-selected, var\(--color-action-primary-solid-bg\)\) 60%, transparent\)/
    );
  }, 30_000);

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
    for (const utility of ['cursor-pointer', 'transition-colors', 'pointer-coarse:min-h-14', 'disabled:opacity-45']) {
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

  it('sizes every rendered element border-box so span and anchor chips match the button height', () => {
    for (const mode of ['toggle', 'static', 'link'] as const) {
      expect(chipVariants({ mode }).split(' ')).toContain('box-border');
    }
    render(
      <>
        <Chip mode='static'>Static</Chip>
        <Chip mode='link' href='#topics'>
          Topics
        </Chip>
      </>
    );
    expect(screen.getByText('Static').closest('.eg-chip')).toHaveClass('box-border');
    expect(screen.getByRole('link', { name: 'Topics' })).toHaveClass('box-border');
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

describe('Chip link current state (v0.3)', () => {
  it.each(['page', 'true'] as const)(
    'exposes aria-current=%s natively on the one link and adds nothing else (AC-03)',
    (value) => {
      render(
        <Chip mode='link' href='#react' aria-current={value}>
          React
        </Chip>
      );
      const chip = screen.getByRole('link', { name: 'React' });
      expect(chip.tagName).toBe('A');
      expect(chip).toHaveAttribute('aria-current', value);
      expect(chip).toHaveAttribute('href', '#react');
      expect(chip).toHaveClass('eg-chip');
      for (const name of ['data-state', 'role', 'aria-pressed', 'aria-selected', 'style']) {
        expect(chip, name).not.toHaveAttribute(name);
      }
      expect(chip.className).not.toMatch(/(?:^|\s)(?:is-|eg-chip--)/);
      expect(chip.querySelector('*'), 'no extra element inside the anchor').toBeNull();
      expect(chip.parentElement?.children).toHaveLength(1);
    }
  );

  it.each(['page', 'true'] as const)(
    'keeps the external notice in the name of a current link, aria-current=%s (AC-03)',
    (value) => {
      render(
        <Chip mode='link' href='https://example.com' external={true} aria-current={value}>
          Docs
        </Chip>
      );
      const chip = screen.getByRole('link', { name: 'Docs (opens in a new tab)' });
      expect(chip).toHaveAttribute('aria-current', value);
      expect(chip).toHaveAttribute('target', '_blank');
      expect(chip).toHaveAttribute('rel', 'noopener noreferrer');
      expect(chip).toHaveClass('eg-chip');
      for (const name of ['data-state', 'role', 'aria-pressed', 'aria-selected', 'style']) {
        expect(chip, name).not.toHaveAttribute(name);
      }
    }
  );

  it('adds exactly the 19 static current-state utilities to the link recipe, each once (AC-04)', () => {
    const link = chipVariants({ mode: 'link' }).split(' ');
    expect(new Set(link).size, 'no class appears twice').toBe(link.length);
    const added = link.filter((utility) => !chipLinkV02Classes.includes(utility));
    expect(chipCurrentUtilities).toHaveLength(19);
    expect(new Set(added)).toEqual(new Set(chipCurrentUtilities));
    expect(added).toHaveLength(19);
    for (const utility of added) {
      // Token references and system-colour keywords only: no literal colour, shadow or gradient, no motion or transform.
      expect(utility, utility).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|oklch\(|\bgradient\(/i);
      expect(utility, utility).not.toMatch(/(?:^|:)(?:opacity-|animate-|translate|scale|rotate|skew|transform)/);
      expect(utility, utility).not.toMatch(/(?:^|:)is-/);
    }
  });

  it('keeps all 19 current-state utilities through cn() with the consumer className last (AC-04)', () => {
    render(
      <Chip mode='link' href='#react' aria-current='page' className='m-2'>
        React
      </Chip>
    );
    const chip = screen.getByRole('link', { name: 'React' });
    const classes = chip.className.split(' ');
    for (const utility of chipCurrentUtilities) {
      expect(classes, utility).toContain(utility);
    }
    expect(classes).toContain('eg-chip');
    expect(chip.className.trim().endsWith('m-2')).toBe(true);
  });

  it('keeps the pinned v0.2 link recipe, in order, and leaves toggle and static without a current utility (AC-01, AC-02)', () => {
    const link = chipVariants({ mode: 'link' }).split(' ');
    expect(link.slice(0, chipLinkV02Classes.length), 'the v0.2 link set is unchanged and first').toEqual(
      chipLinkV02Classes
    );
    expect(link.slice(chipLinkV02Classes.length)).toEqual(chipCurrentUtilities);
    expect(chipVariants()).toBe(chipVariants({ mode: 'toggle' }));
    for (const mode of ['toggle', 'static'] as const) {
      expect(chipVariants({ mode }), `${mode} recipe`).not.toContain('aria-[current');
    }
    expect(chipVariants()).not.toContain('forced-colors:');
  });

  it('renders a link chip without aria-current exactly as in v0.2 (AC-02)', () => {
    render(
      <Chip mode='link' href='#react'>
        React
      </Chip>
    );
    const chip = screen.getByRole('link', { name: 'React' });
    expect(chip).not.toHaveAttribute('aria-current');
    expect(chip).not.toHaveAttribute('aria-pressed');
    expect(chip).not.toHaveAttribute('data-state');
    expect(chip).not.toHaveAttribute('role');
    expect(chip.className.split(' ').slice(0, chipLinkV02Classes.length)).toEqual(chipLinkV02Classes);
  });

  it.each(['toggle', 'static', 'link'] as const)(
    'forwards an out-of-union aria-current unchanged in %s mode and never varies the classes (AC-10)',
    (mode) => {
      const unsafe = (props: object) => props as unknown as ChipProps;
      const base = mode === 'link' ? { mode, href: '#react' } : { mode };
      const { container, unmount } = render(<Chip {...unsafe({ ...base, children: 'React' })} />);
      const plain = container.firstElementChild?.className;
      unmount();
      for (const value of ['step', 'false']) {
        const { container: current, unmount: remove } = render(
          <Chip {...unsafe({ ...base, children: 'React', 'aria-current': value })} />
        );
        const chip = current.firstElementChild;
        expect(chip, `${mode} ${value}`).toHaveAttribute('aria-current', value);
        expect(chip?.className, `${mode} ${value} classes`).toBe(plain);
        remove();
      }
    }
  );

  it('hides a consumer icon on the current chip and keeps the label as the accessible name (AC-12)', () => {
    render(
      <Chip mode='link' href='#react' aria-current='page' icon={<Icon name='check' className='size-3.5' />}>
        React
      </Chip>
    );
    const chip = screen.getByRole('link', { name: 'React' });
    const wrapper = chip.firstElementChild;
    expect(wrapper?.tagName).toBe('SPAN');
    expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    expect(wrapper?.querySelector('svg')).not.toBeNull();
    expect(chip).toHaveAttribute('aria-current', 'page');
    expect(chip).toHaveTextContent(/^React$/);
  });
});

// Emission and cascade proofs run on the production UI stylesheet, built once with the settings of
// vite.styles.config.ts, so the rules are the ones the package ships (spec AC-05 to AC-08, plan G6).
let emittedCssBuild: Promise<string> | undefined;
const emittedCss = (): Promise<string> => {
  emittedCssBuild ??= build({
    configFile: false,
    envDir: false,
    plugins: [tailwindcss({ optimize: false })],
    logLevel: 'warn',
    build: {
      write: false,
      minify: false,
      cssMinify: false,
      rolldownOptions: { input: resolve('packages/ui/src/styles/compiled.css') }
    }
  }).then((result) => {
    const outputs = (Array.isArray(result) ? result : [result]).flatMap((output) =>
      'output' in output ? output.output : []
    );
    const asset = outputs.find((output) => output.type === 'asset' && output.fileName.endsWith('.css'));
    if (asset?.type !== 'asset') {
      throw new Error('Missing production CSS output');
    }
    return String(asset.source);
  });
  return emittedCssBuild;
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// How the flattened stylesheet serializes each variant of the current-state utilities.
const variantSuffix: Record<string, string> = {
  'aria-[current=page]:': '[aria-current="page"]',
  'aria-[current=true]:': '[aria-current="true"]',
  'focus-visible:': ':focus-visible',
  'forced-colors:': ''
};

// The escaped class and the flat selector suffix the stylesheet emits for a utility with these variants.
const emittedParts = (token: string) => {
  let rest = token;
  let suffix = '';
  for (let found = true; found; ) {
    found = false;
    for (const [prefix, text] of Object.entries(variantSuffix)) {
      if (rest.startsWith(prefix)) {
        rest = rest.slice(prefix.length);
        suffix += text;
        found = true;
      }
    }
  }
  return { className: `.${token.replace(/[^\w-]/g, '\\$&')}`, suffix };
};
const emittedSelector = (token: string) => {
  const { className, suffix } = emittedParts(token);
  return `${className}${suffix}`;
};

// Text of every block that opens with this at-rule prelude, by brace matching.
const blocksOf = (css: string, prelude: string) => {
  const blocks: string[] = [];
  for (let start = css.indexOf(prelude); start >= 0; start = css.indexOf(prelude, start + prelude.length)) {
    let depth = 1;
    let end = css.indexOf('{', start) + 1;
    const open = end;
    while (depth > 0 && end < css.length) {
      depth += css[end] === '{' ? 1 : css[end] === '}' ? -1 : 0;
      end += 1;
    }
    blocks.push(css.slice(open, end - 1));
  }
  return blocks.join('\n');
};

// Declarations of every flat rule that carries exactly this selector.
const declarationsOf = (css: string, selector: string) =>
  [...css.matchAll(new RegExp(`(?<=^|[\\s{},])${escapeRegExp(selector)}\\s*\\{([^{}]*)\\}`, 'g'))]
    .map((match) => match[1])
    .join('\n');

// Offset of the first rule that carries exactly this selector, or -1.
const positionOf = (css: string, selector: string) =>
  css.search(new RegExp(`(?<=^|[\\s{},])${escapeRegExp(selector)}\\s*\\{`));

// Classes, attributes and pseudo-classes of one compound selector, escaped characters excluded.
const specificityOf = (selector: string) => {
  const bare = selector.replace(/\\./g, '_');
  const attributes = bare.match(/\[[^\]]*\]/g)?.length ?? 0;
  const withoutAttributes = bare.replace(/\[[^\]]*\]/g, '');
  const pseudoClasses = withoutAttributes.match(/(?<!:):[a-z-]+/g)?.length ?? 0;
  const classes = withoutAttributes.match(/\.[A-Za-z_][\w-]*/g)?.length ?? 0;
  return attributes + pseudoClasses + classes;
};

const currentValues = ['page', 'true'] as const;
type CurrentValue = (typeof currentValues)[number];
const ringSelector = emittedSelector('focus-visible:shadow-focus');
const edgeToken = (value: CurrentValue) => `aria-[current=${value}]:shadow-[var(--shadow-edge-strong)]`;
const compoundToken = (value: CurrentValue) => `aria-[current=${value}]:focus-visible:shadow-focus`;
const ruleOf = (selector: string) => new RegExp(`(?<=^|[\\s{},])${escapeRegExp(selector)}\\s*\\{[^{}]*\\}`);

// The focus ring wins on a focused current chip: its compound rule is emitted after the plain ring and after the
// edge shadow, is strictly more specific than the edge shadow and declares the ring itself.
const focusRingWins = (css: string, value: CurrentValue) => {
  const edge = emittedSelector(edgeToken(value));
  const compound = emittedSelector(compoundToken(value));
  const ring = positionOf(css, ringSelector);
  const edgeAt = positionOf(css, edge);
  const compoundAt = positionOf(css, compound);
  return (
    ring > -1 &&
    edgeAt > ring &&
    compoundAt > edgeAt &&
    specificityOf(compound) > specificityOf(edge) &&
    declarationsOf(css, compound) === declarationsOf(css, ringSelector)
  );
};

describe('Chip link current state emission and cascade (v0.3)', () => {
  it.each(currentValues)(
    'emits each current utility under aria-current=%s only, from its token (E1, AC-05)',
    async (value) => {
      const css = await emittedCss();
      const ring = declarationsOf(css, ringSelector);
      expect(ring, 'the plain focus ring is emitted').toMatch(/--tw-shadow:\s*\S/);
      const rows: [string, RegExp[]][] = [
        [`aria-[current=${value}]:border-state-selected`, [/border-color:\s*var\(--color-state-selected[,)]/]],
        [
          `aria-[current=${value}]:[background:var(--gradient-chip-active),var(--color-surface-1)]`,
          [/background:\s*var\(--gradient-chip-active\),\s*var\(--color-surface-1\)/]
        ],
        [edgeToken(value), [/--tw-shadow:\s*var\(--shadow-edge-strong\)/, /box-shadow:[^;}]*var\(--tw-shadow\)/]],
        [`aria-[current=${value}]:text-fg-default`, [/color:\s*var\(--color-fg-default[,)]/]],
        [compoundToken(value), [/box-shadow:[^;}]*var\(--tw-shadow\)/]]
      ];
      for (const [token, declarations] of rows) {
        const { className, suffix } = emittedParts(token);
        const emitted = declarationsOf(css, `${className}${suffix}`);
        expect(emitted, token).not.toBe('');
        for (const declaration of declarations) {
          expect(emitted, token).toMatch(declaration);
        }
        // Strictness: every rule of this class carries the attribute value it names, never a bare attribute.
        const suffixes = [
          ...css.matchAll(new RegExp(`(?<=^|[\\s{},])${escapeRegExp(className)}(?![\\w\\\\-])([^\\s{,]*)`, 'g'))
        ].map((match) => match[1]);
        expect(suffixes.length, `${token} is emitted`).toBeGreaterThan(0);
        expect(new Set(suffixes), `${token} selectors`).toEqual(new Set([suffix]));
      }
      // The compound ring declares exactly what the plain ring does.
      expect(declarationsOf(css, emittedSelector(compoundToken(value)))).toBe(ring);
    },
    60_000
  );

  it('emits the forced-colours outline rules inside the forced-colors media block only (E1, AC-08)', async () => {
    const css = await emittedCss();
    const forced = blocksOf(css, '@media (forced-colors: active)');
    expect(forced, 'a forced-colors media block exists').not.toBe('');
    const outline: [string, RegExp][] = [
      ['outline-solid', /outline-style:\s*solid/],
      ['outline-(length:--focus-width)', /outline-width:\s*var\(--focus-width\)/],
      ['outline-[color:Highlight]', /outline-color:\s*highlight/i]
    ];
    for (const prefix of [
      'forced-colors:focus-visible:',
      ...currentValues.map((v) => `forced-colors:aria-[current=${v}]:`)
    ]) {
      for (const [utility, declaration] of outline) {
        const selector = emittedSelector(`${prefix}${utility}`);
        expect(declarationsOf(forced, selector), selector).toMatch(declaration);
        expect(css.split(selector).length, `${selector} appears only inside the media block`).toBe(
          forced.split(selector).length
        );
      }
    }
    expect(blocksOf(css, '@layer utilities')).not.toMatch(/(?<=^|[\s{},])\.eg-chip(?![\w-])[^{]*\{/);
  }, 60_000);

  it.each(currentValues)(
    'orders the rules so a hovered current chip keeps its paint, aria-current=%s (E2, AC-06)',
    async (value) => {
      const css = await emittedCss();
      const pairs: [string, string][] = [
        ['hover:border-border-hairline-strong', `aria-[current=${value}]:border-state-selected`],
        [
          'hover:[background:var(--gradient-sheen),var(--color-surface-2)]',
          `aria-[current=${value}]:[background:var(--gradient-chip-active),var(--color-surface-1)]`
        ],
        ['hover:text-fg-default', `aria-[current=${value}]:text-fg-default`]
      ];
      for (const [hover, current] of pairs) {
        const hoverSelector = `${emittedSelector(hover)}:hover`;
        const hoverAt = positionOf(css, hoverSelector);
        const currentAt = positionOf(css, emittedSelector(current));
        expect(hoverAt, hover).toBeGreaterThan(-1);
        expect(currentAt, `${current} follows ${hover}`).toBeGreaterThan(hoverAt);
        expect(
          specificityOf(emittedSelector(current)),
          `${current} is at least as specific as ${hover}`
        ).toBeGreaterThanOrEqual(specificityOf(hoverSelector));
      }
    },
    60_000
  );

  it.each(currentValues)(
    'lets the focus ring win over the current edge shadow, aria-current=%s (E2, AC-07)',
    async (value) => {
      expect(focusRingWins(await emittedCss(), value)).toBe(true);
    },
    60_000
  );

  it.each(currentValues)(
    'shows the focus predicate able to fail without the compound ring or with the edge shadow after it, aria-current=%s (G6)',
    async (value) => {
      const css = await emittedCss();
      expect(focusRingWins(css, value)).toBe(true);
      const withoutCompound = css.replace(ruleOf(emittedSelector(compoundToken(value))), '');
      expect(withoutCompound, 'the compound rule was found and removed').not.toBe(css);
      expect(focusRingWins(withoutCompound, value)).toBe(false);
      const edge = ruleOf(emittedSelector(edgeToken(value)));
      const edgeRule = edge.exec(css)?.[0] ?? '';
      expect(edgeRule, 'the edge shadow rule was found').not.toBe('');
      expect(focusRingWins(`${css.replace(edge, '')}\n${edgeRule}`, value), 'edge shadow emitted last').toBe(false);
    },
    60_000
  );

  it('orders each forced-colours outline rule after the plain outline-none rule (E2, AC-08)', async () => {
    const css = await emittedCss();
    const none = positionOf(css, emittedSelector('focus-visible:outline-none'));
    expect(none, 'focus-visible:outline-none is emitted').toBeGreaterThan(-1);
    for (const token of chipCurrentUtilities.filter((utility) => utility.startsWith('forced-colors:'))) {
      expect(positionOf(css, emittedSelector(token)), token).toBeGreaterThan(none);
    }
  }, 60_000);
});
