import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderToString } from 'react-dom/server';
import { describe, expect, expectTypeOf, it, vi } from 'vitest';
import { useChipGroup } from '@/molecules/chip-group/useChipGroup';
import { ChipGroup, type ChipGroupProps } from './index';

const options = [
  { value: 'react', label: 'React' },
  { value: 'a11y', label: 'Accessibility' },
  { value: 'css', label: 'CSS' }
];
const named = (name: string, single = false) => screen.getByRole(single ? 'radio' : 'button', { name });

describe('ChipGroup v0.1 + A1', () => {
  it('renders an ordered named group with decorative icons and one button per choice', () => {
    render(
      <ChipGroup
        type='multiple'
        label='Topics'
        options={[
          { ...options[0], value: 'react', label: 'React', icon: <span>Decoration</span> },
          ...options.slice(1)
        ]}
      />
    );
    const group = screen.getByRole('group', { name: 'Topics' });
    expect(group).toHaveClass('eg-chip-group');
    expect(screen.getAllByRole('button').map((button) => button.textContent)).toEqual([
      'DecorationReact',
      'Accessibility',
      'CSS'
    ]);
    expect(screen.getByText('Decoration').parentElement).toHaveAttribute('aria-hidden', 'true');
    for (const button of screen.getAllByRole('button')) {
      expect(button).toHaveClass('eg-chip');
      expect(button).toHaveAttribute('type', 'button');
      expect(button).toHaveAttribute('aria-pressed', 'false');
      expect(button.querySelector('button')).toBeNull();
    }
  });

  it('starts single mode empty, replaces selection and clears the selected option', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ChipGroup type='single' label='Topics' options={options} onValueChange={onValueChange} />);
    const react = named('React', true);
    expect(react).toHaveAttribute('aria-checked', 'false');
    expect(react).not.toHaveAttribute('aria-pressed');
    await user.click(react);
    await user.click(named('CSS', true));
    expect(react).toHaveAttribute('aria-checked', 'false');
    expect(named('CSS', true)).toHaveAttribute('data-state', 'on');
    await user.click(named('CSS', true));
    expect(named('CSS', true)).toHaveAttribute('aria-checked', 'false');
    expect(onValueChange.mock.calls).toEqual([['react'], ['css'], ['']]);
  });

  it('adds and removes multiple choices in activation order, including the final empty array', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipGroup
        type='multiple'
        label='Topics'
        options={options}
        defaultValue={['react']}
        onValueChange={onValueChange}
      />
    );
    await user.click(named('Accessibility'));
    await user.click(named('React'));
    await user.click(named('Accessibility'));
    expect(onValueChange.mock.calls).toEqual([[['react', 'a11y']], [['a11y']], [[]]]);
    expect(named('React')).toHaveAttribute('aria-pressed', 'false');
  });

  for (const type of ['single', 'multiple'] as const) {
    it(`keeps ${type} controlled until a prop update; defaults never override value`, async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      const initial: ChipGroupProps =
        type === 'single'
          ? { type, label: 'Topics', options, value: 'react', defaultValue: 'css', onValueChange }
          : { type, label: 'Topics', options, value: ['react'], defaultValue: ['css'], onValueChange };
      const { rerender } = render(<ChipGroup {...initial} />);
      await user.click(named('CSS', type === 'single'));
      expect(named('CSS', type === 'single')).toHaveAttribute('data-state', 'off');
      expect(named('React', type === 'single')).toHaveAttribute('data-state', 'on');
      expect(onValueChange).toHaveBeenCalledExactlyOnceWith(type === 'single' ? 'css' : ['react', 'css']);
      rerender(
        <ChipGroup {...(initial.type === 'single' ? { ...initial, value: 'css' } : { ...initial, value: ['css'] })} />
      );
      expect(named('CSS', type === 'single')).toHaveAttribute('data-state', 'on');
      expect(named('React', type === 'single')).toHaveAttribute('data-state', 'off');
      rerender(<ChipGroup {...(initial.type === 'single' ? { ...initial, value: '' } : { ...initial, value: [] })} />);
      expect(named('React', type === 'single')).toHaveAttribute('data-state', 'off');
      expect(onValueChange).toHaveBeenCalledTimes(1);
    });

    it(`does not reset ${type} uncontrolled selection when defaultValue changes`, () => {
      const onValueChange = vi.fn();
      const { rerender } = render(
        type === 'single' ? (
          <ChipGroup type={type} label='Topics' options={options} defaultValue='react' onValueChange={onValueChange} />
        ) : (
          <ChipGroup
            type={type}
            label='Topics'
            options={options}
            defaultValue={['react']}
            onValueChange={onValueChange}
          />
        )
      );
      rerender(
        type === 'single' ? (
          <ChipGroup type={type} label='Topics' options={options} defaultValue='css' onValueChange={onValueChange} />
        ) : (
          <ChipGroup
            type={type}
            label='Topics'
            options={options}
            defaultValue={['css']}
            onValueChange={onValueChange}
          />
        )
      );
      expect(named('React', type === 'single')).toHaveAttribute('data-state', 'on');
      expect(named('CSS', type === 'single')).toHaveAttribute('data-state', 'off');
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it(`delegates ${type} roving focus, looping and activation to Radix`, async () => {
      const user = userEvent.setup();
      const onValueChange = vi.fn();
      render(
        <>
          <button type='button'>Before</button>
          <ChipGroup type={type} label='Topics' options={options} onValueChange={onValueChange} />
          <button type='button'>After</button>
        </>
      );
      await user.tab();
      await user.tab();
      expect(named('React', type === 'single')).toHaveFocus();
      await user.keyboard('{ArrowLeft}');
      expect(named('CSS', type === 'single')).toHaveFocus();
      await user.keyboard('{Home}');
      expect(named('React', type === 'single')).toHaveFocus();
      await user.keyboard('{End}');
      expect(named('CSS', type === 'single')).toHaveFocus();
      await user.keyboard('{ArrowRight}');
      expect(named('React', type === 'single')).toHaveFocus();
      await user.keyboard('{ArrowDown}{ArrowUp}');
      expect(named('React', type === 'single')).toHaveFocus();
      expect(onValueChange).not.toHaveBeenCalled();
      await user.keyboard(' {Enter}');
      expect(onValueChange.mock.calls).toEqual(type === 'single' ? [['react'], ['']] : [[['react']], [[]]]);
      await user.tab();
      expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
      await user.tab({ shift: true });
      expect(named('React', type === 'single')).toHaveFocus();
      await user.tab({ shift: true });
      expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    });
  }

  it('reverses horizontal arrows in RTL without selecting', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(<ChipGroup type='single' label='Topics' options={options} dir='rtl' onValueChange={onValueChange} />);
    await user.tab();
    await user.keyboard('{ArrowLeft}');
    expect(named('Accessibility', true)).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(named('React', true)).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('skips disabled options, preserves their selection and disables the whole group without dimming its root', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    const choices = options.map((option) => ({ ...option, disabled: option.value === 'a11y' }));
    const { rerender } = render(
      <ChipGroup
        type='multiple'
        label='Topics'
        options={choices}
        defaultValue={['a11y']}
        onValueChange={onValueChange}
      />
    );
    const disabled = named('Accessibility');
    expect(disabled).toBeDisabled();
    expect(disabled).toHaveAttribute('data-state', 'on');
    await user.tab();
    expect(named('React')).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    expect(named('CSS')).toHaveFocus();
    await user.click(disabled);
    expect(onValueChange).not.toHaveBeenCalled();
    rerender(
      <ChipGroup
        type='multiple'
        label='Topics'
        options={choices}
        disabled={true}
        defaultValue={['a11y']}
        onValueChange={onValueChange}
      />
    );
    expect(screen.getByRole('group').className).not.toMatch(/opacity/);
    for (const button of screen.getAllByRole('button')) {
      expect(button).toBeDisabled();
      expect(button.className.split(' ').filter((name) => name.endsWith('opacity-45'))).toEqual([
        'disabled:opacity-45'
      ]);
    }
    await user.click(named('React'));
    expect(onValueChange).not.toHaveBeenCalled();
    expect(disabled).toHaveAttribute('data-state', 'on');
  });

  it('retains disabled single-mode selection and skips it during keyboard navigation', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <ChipGroup
        type='single'
        label='Topics'
        options={options.map((option) => ({ ...option, disabled: option.value === 'react' }))}
        defaultValue='react'
        onValueChange={onValueChange}
      />
    );
    await user.tab();
    expect(named('Accessibility', true)).toHaveFocus();
    expect(named('React', true)).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{End}{ArrowRight}');
    expect(named('Accessibility', true)).toHaveFocus();
    await user.click(named('React', true));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('renders empty and fully disabled groups without an entry tab stop or events', async () => {
    const user = userEvent.setup();
    const onValueChange = vi.fn();
    render(
      <>
        <ChipGroup type='single' label='Empty' options={[]} onValueChange={onValueChange} />
        <ChipGroup type='multiple' label='Unavailable' options={options} disabled={true} />
        <button type='button'>Next</button>
      </>
    );
    expect(screen.getByRole('group', { name: 'Empty' }).children).toHaveLength(0);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('does not repair unknown selections or reset when options are removed', () => {
    const onValueChange = vi.fn();
    const { rerender } = render(
      <ChipGroup
        type='multiple'
        label='Topics'
        options={options}
        value={['unknown', 'react']}
        onValueChange={onValueChange}
      />
    );
    expect(named('React')).toHaveAttribute('data-state', 'on');
    rerender(
      <ChipGroup
        type='multiple'
        label='Topics'
        options={options.slice(1)}
        value={['unknown', 'react']}
        onValueChange={onValueChange}
      />
    );
    expect(screen.getAllByRole('button').every((button) => button.dataset.state === 'off')).toBe(true);
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('forwards native attributes and handlers, isolates layout classes and never submits a form', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const onSubmit = vi.fn((event) => event.preventDefault());
    const { container } = render(
      <form onSubmit={onSubmit}>
        <p id='hint'>Choose filters</p>
        <ChipGroup
          type='multiple'
          label='Topics'
          options={options}
          id='topics'
          title='Filter topics'
          aria-describedby='hint'
          data-context='notes'
          className='mt-2 w-full'
          onClick={onClick}
        />
      </form>
    );
    const group = screen.getByRole('group', { name: 'Topics', description: 'Choose filters' });
    expect(group).toHaveAttribute('id', 'topics');
    expect(group).toHaveAttribute('data-context', 'notes');
    expect(group).toHaveClass('mt-2', 'w-full');
    expect(named('React')).not.toHaveClass('mt-2', 'w-full');
    await user.click(named('React'));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onSubmit).not.toHaveBeenCalled();
    expect(container.querySelector('input')).toBeNull();
  });

  it('protects owned semantics against untyped composition and keyboard overrides', () => {
    const injected = {
      role: 'radiogroup',
      'aria-label': 'Injected',
      'aria-labelledby': 'other',
      tabIndex: 9,
      asChild: true,
      orientation: 'vertical',
      loop: false,
      rovingFocus: false,
      name: 'topic',
      required: true,
      children: 'Injected'
    } as unknown as Extract<ChipGroupProps, { type: 'single' }>;
    render(<ChipGroup {...injected} type='single' label='Topics' options={options} />);
    const group = screen.getByRole('group', { name: 'Topics' });
    expect(group).not.toHaveAttribute('aria-labelledby');
    expect(group).not.toHaveAttribute('name');
    expect(group).not.toHaveAttribute('required');
    expect(group).not.toHaveTextContent('Injected');
    expect(group).toHaveAttribute('data-orientation', 'horizontal');
    expect(group).not.toHaveAttribute('tabindex', '9');
  });

  it('renders deterministic SSR selection without hidden inputs or legacy state classes', () => {
    const element = <ChipGroup type='single' label='Topics' options={options} defaultValue='css' />;
    const html = renderToString(element);
    expect(renderToString(element)).toBe(html);
    expect(html).toContain('aria-checked="true"');
    expect(html).not.toMatch(/is-active|eg-surface|<input|aria-pressed/);
  });
});

describe('ChipGroup public types', () => {
  it('keeps value, default and callback shapes tied to the required discriminator', () => {
    type Single = Extract<ChipGroupProps, { type: 'single' }>;
    type Multiple = Extract<ChipGroupProps, { type: 'multiple' }>;
    expectTypeOf<Single['value']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Single['defaultValue']>().toEqualTypeOf<string | undefined>();
    expectTypeOf<Single['onValueChange']>().toEqualTypeOf<((value: string) => void) | undefined>();
    expectTypeOf<Multiple['value']>().toEqualTypeOf<string[] | undefined>();
    expectTypeOf<Multiple['defaultValue']>().toEqualTypeOf<string[] | undefined>();
    expectTypeOf<Multiple['onValueChange']>().toEqualTypeOf<((value: string[]) => void) | undefined>();
    expectTypeOf<ChipGroupProps['type']>().toEqualTypeOf<'single' | 'multiple'>();
    type Forbidden =
      | 'name'
      | 'required'
      | 'ref'
      | 'asChild'
      | 'children'
      | 'role'
      | 'aria-label'
      | 'aria-labelledby'
      | 'onChange'
      | 'tabIndex'
      | 'orientation'
      | 'loop'
      | 'size'
      | 'variant';
    expectTypeOf<Extract<keyof ChipGroupProps, Forbidden>>().toEqualTypeOf<never>();
  });
});

describe('useChipGroup composition', () => {
  it('composes shared Chip appearance and token selected cues with no root paint or item override API', () => {
    const { result } = renderHook(() =>
      useChipGroup({ type: 'multiple', label: 'Topics', options, className: 'w-40 w-full mt-2' })
    );
    expect(result.current.rootProps).toMatchObject({
      type: 'multiple',
      orientation: 'horizontal',
      loop: true,
      rovingFocus: true,
      dir: 'ltr',
      disabled: false,
      'aria-label': 'Topics'
    });
    expect(result.current.rootProps.className?.split(' ')).toEqual([
      'eg-chip-group',
      'flex',
      'flex-wrap',
      'items-center',
      'gap-2',
      'w-full',
      'mt-2'
    ]);
    expect(result.current.itemClassName.split(' ')).toEqual(
      expect.arrayContaining([
        'eg-chip',
        'min-h-8',
        'pointer-coarse:min-h-11',
        'text-label-default',
        'data-[state=on]:underline',
        'decoration-[length:var(--border-width)]',
        'underline-offset-[var(--space-1)]',
        'focus-visible:shadow-focus',
        'data-[state=on]:focus-visible:shadow-focus',
        'motion-reduce:transition-none',
        'disabled:cursor-not-allowed'
      ])
    );
    expect(result.current.itemClassName).not.toMatch(/w-full|mt-2|is-active/);
    expect(result.current.iconProps).toMatchObject({ 'aria-hidden': true });
  });
});
