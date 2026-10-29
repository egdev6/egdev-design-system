import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { type ChangeEvent, createRef, useId, useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';
import { inputControlVariants, inputIconVariants, inputVariants } from './types';
import { useInput } from './useInput';

function root(container: HTMLElement) {
  const wrapper = container.querySelector('.eg-input');
  if (!wrapper) {
    throw new Error('Missing eg-input root');
  }
  return wrapper;
}

function Controlled({ onChange, loading = false }: { onChange: (value: string) => void; loading?: boolean }) {
  const [value, setValue] = useState('');
  return (
    <Input
      aria-label='Title'
      loading={loading}
      value={value}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
        onChange(event.target.value);
      }}
    />
  );
}

function Labelled() {
  const id = useId();
  const hint = useId();
  return (
    <div>
      <label htmlFor={id}>Project title</label>
      <Input id={id} aria-describedby={hint} required={true} />
      <p id={hint}>Shown on the dashboard.</p>
    </div>
  );
}

describe('Input', () => {
  it('composes a decorative trailing Spinner while loading and stays editable', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { container, rerender } = render(
      <Input aria-label='Search' loading={true} icon={<svg />} onChange={onChange} />
    );
    const control = screen.getByRole('textbox', { name: 'Search' });
    expect(control).toHaveAttribute('aria-busy', 'true');
    expect(control).not.toBeDisabled();
    expect(control).not.toHaveAttribute('readonly');
    expect(control).not.toHaveAttribute('loading');
    expect(control).toHaveClass('pl-9', 'pr-9');
    const spinner = root(container).querySelector('.eg-spinner');
    expect(spinner).toHaveAttribute('aria-hidden', 'true');
    expect(spinner).toHaveClass('size-4');
    expect(spinner?.parentElement).toHaveClass('absolute', 'right-3', 'pointer-events-none');
    expect(control.nextElementSibling).toBe(spinner?.parentElement);
    expect(screen.queryByRole('status')).toBeNull();
    await user.type(control, 'abc');
    expect(control).toHaveValue('abc');
    expect(onChange).toHaveBeenCalledTimes(3);
    rerender(<Input aria-label='Search' loading={false} />);
    expect(control).not.toHaveAttribute('aria-busy');
    expect(control).not.toHaveClass('pr-9');
    expect(root(container).querySelector('.eg-spinner')).toBeNull();
  });

  it('preserves consumer busy semantics when idle and native restrictions when loading', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Input aria-label='Title' aria-busy={true} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-busy', 'true');
    rerender(<Input aria-label='Title' loading={true} aria-busy={false} readOnly={true} defaultValue='fixed' />);
    const control = screen.getByRole('textbox');
    expect(control).toHaveAttribute('aria-busy', 'true');
    await user.type(control, 'x');
    expect(control).toHaveValue('fixed');
    rerender(<Input aria-label='Title' loading={true} disabled={true} />);
    expect(control).toBeDisabled();
    expect(control).toHaveAttribute('aria-busy', 'true');
  });

  it.each(['md', 'sm'] as const)('reserves trailing space without a leading icon at size %s', (size) => {
    const { container } = render(<Input aria-label='Title' loading={true} size={size} variant='code' />);
    expect(screen.getByRole('textbox')).toHaveClass('pr-9');
    expect(screen.getByRole('textbox')).not.toHaveClass('pl-9');
    expect(root(container).querySelectorAll('.eg-spinner')).toHaveLength(1);
  });

  it('retains controlled value, focus and native input identity when loading ends', async () => {
    const user = userEvent.setup();
    const values = vi.fn();
    const { rerender } = render(<Controlled onChange={values} loading={true} />);
    const control = screen.getByRole('textbox', { name: 'Title' });
    await user.type(control, 'draft');
    expect(control).toHaveValue('draft');
    expect(values).toHaveBeenCalledTimes(5);
    rerender(<Controlled onChange={values} loading={false} />);
    expect(screen.getByRole('textbox', { name: 'Title' })).toBe(control);
    expect(control).toHaveFocus();
    expect(control).toHaveValue('draft');
    expect(control).not.toHaveAttribute('aria-busy');
    expect(values).toHaveBeenCalledTimes(5);
  });

  it('renders a span.eg-input root around a native text input and forwards the ref (AC-01)', () => {
    const ref = createRef<HTMLInputElement>();
    const { container } = render(<Input aria-label='Title' ref={ref} />);
    const wrapper = root(container);
    expect(container.children).toHaveLength(1);
    expect(wrapper.tagName).toBe('SPAN');
    const control = screen.getByRole('textbox', { name: 'Title' });
    expect(control.parentElement).toBe(wrapper);
    expect(control).toHaveAttribute('type', 'text');
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current).toBe(control);
    expect(wrapper.children).toHaveLength(1);
    expect(control).not.toHaveClass('eg-input');
  });

  it('forwards native props to the input and className only to the root (AC-02)', () => {
    const { container } = render(
      <Input
        id='title'
        name='title'
        placeholder='Untitled'
        aria-label='Title'
        aria-describedby='title-hint'
        required={true}
        autoComplete='off'
        data-source='consumer'
        className='w-64 w-80 mt-2'
      />
    );
    const wrapper = root(container);
    const control = screen.getByRole('textbox', { name: 'Title' });
    for (const [attribute, value] of [
      ['id', 'title'],
      ['name', 'title'],
      ['placeholder', 'Untitled'],
      ['aria-describedby', 'title-hint'],
      ['autocomplete', 'off'],
      ['data-source', 'consumer']
    ] as const) {
      expect(control).toHaveAttribute(attribute, value);
      expect(wrapper).not.toHaveAttribute(attribute);
    }
    expect(control).toBeRequired();
    expect(wrapper).toHaveClass('eg-input', 'w-80', 'mt-2');
    expect(wrapper).not.toHaveClass('w-64', 'w-full');
    expect(wrapper.className.split(' ').at(-1)).toBe('mt-2');
    expect(control).not.toHaveClass('w-80', 'mt-2');
    expect(control).toHaveClass('w-full');
  });

  it('types in controlled and uncontrolled modes with one onChange per keystroke (AC-03)', async () => {
    const user = userEvent.setup();
    const values = vi.fn();
    render(<Controlled onChange={values} />);
    const controlled = screen.getByRole('textbox', { name: 'Title' });
    await user.type(controlled, 'egdev');
    expect(controlled).toHaveValue('egdev');
    expect(values).toHaveBeenCalledTimes(5);
    expect(values).toHaveBeenLastCalledWith('egdev');

    const changes = vi.fn();
    render(<Input aria-label='Slug' defaultValue='a' onChange={changes} />);
    const uncontrolled = screen.getByRole('textbox', { name: 'Slug' });
    await user.type(uncontrolled, 'bc');
    expect(uncontrolled).toHaveValue('abc');
    expect(changes).toHaveBeenCalledTimes(2);
  });

  it('blocks focus and typing when disabled and dims the root (AC-04)', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <>
        <button type='button'>Before</button>
        <Input aria-label='Locked' disabled={true} defaultValue='fixed' />
        <button type='button'>After</button>
      </>
    );
    const control = screen.getByRole('textbox', { name: 'Locked' });
    await user.tab();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.type(control, 'x');
    expect(control).toHaveValue('fixed');
    expect(control).toBeDisabled();
    expect(root(container)).toHaveClass('has-[:disabled]:opacity-45', 'has-[:disabled]:pointer-events-none');
    expect(control).toHaveClass('disabled:cursor-not-allowed');
  });

  it('keeps readOnly focusable and selectable but not editable (AC-04)', async () => {
    const user = userEvent.setup();
    render(<Input aria-label='Token' readOnly={true} defaultValue='abc123' />);
    const control = screen.getByRole('textbox', { name: 'Token' });
    await user.tab();
    expect(control).toHaveFocus();
    await user.type(control, 'x');
    expect(control).toHaveValue('abc123');
    expect(control).toHaveAttribute('readonly');
    expect(control).toHaveClass('read-only:hover:border-border-control');
  });

  it('passes aria-invalid through and carries the danger border variants (AC-05)', () => {
    render(<Input aria-label='Post text' aria-invalid='true' />);
    const control = screen.getByRole('textbox', { name: 'Post text' });
    expect(control).toHaveAttribute('aria-invalid', 'true');
    expect(control).toBeInvalid();
    expect(control).toHaveClass('aria-invalid:border-status-danger', 'aria-invalid:focus-visible:border-status-danger');
    expect(control).not.toHaveAttribute('data-state');
  });

  it('applies the md/default well recipe by default and the sm and code treatments (AC-06)', () => {
    render(<Input aria-label='Default' />);
    const control = screen.getByRole('textbox', { name: 'Default' });
    expect(control).toHaveClass(
      'box-border',
      'w-full',
      'rounded-md',
      'border',
      'border-border-control',
      'bg-surface-0',
      'shadow-[var(--shadow-well)]',
      'font-sans',
      'text-fg-default',
      'placeholder:text-fg-muted',
      'min-h-11',
      'px-3',
      'py-2',
      'text-body-default'
    );

    render(<Input aria-label='Small' size='sm' />);
    const small = screen.getByRole('textbox', { name: 'Small' });
    expect(small).toHaveClass(
      'min-h-9',
      'py-1.5',
      'text-label-default',
      'font-[var(--text-body-default--font-weight)]'
    );
    expect(small).not.toHaveClass('min-h-11', 'text-body-default');
    expect(small).not.toHaveAttribute('size');

    render(<Input aria-label='Command' variant='code' size='sm' />);
    const code = screen.getByRole('textbox', { name: 'Command' });
    expect(code).toHaveClass('font-mono', 'text-code', 'bg-primitive-neutral-950', 'min-h-9');
    expect(code).not.toHaveClass('font-sans', 'bg-surface-0', 'text-label-default', 'text-body-default');
  });

  it('resolves documented defaults in the hook and splits root from control props (AC-06)', () => {
    const { result } = renderHook(() => useInput({ className: 'w-64', id: 'x', 'aria-label': 'Title' }));
    expect(result.current.size).toBe('md');
    expect(result.current.variant).toBe('default');
    expect(result.current.hasIcon).toBe(false);
    expect(result.current.loading).toBe(false);
    expect(result.current.controlProps).not.toHaveProperty('loading');
    expect(result.current.controlProps).toMatchObject({ id: 'x', type: 'text', 'aria-label': 'Title' });
    expect(result.current.controlProps).not.toHaveProperty('icon');
    expect(result.current.controlProps).not.toHaveProperty('size');
    expect(result.current.controlProps).not.toHaveProperty('variant');
    expect(result.current.rootProps.className).toContain('eg-input');
    expect(result.current.rootProps.className).toContain('w-64');
    expect(result.current.controlProps.className).not.toContain('w-64');
    const { result: withIcon } = renderHook(() => useInput({ icon: <svg />, type: 'search', size: 'sm' }));
    expect(withIcon.current.hasIcon).toBe(true);
    expect(withIcon.current.controlProps.type).toBe('search');
    expect(withIcon.current.controlProps.className).toContain('pl-9');
  });

  it.each([
    ['email', 'textbox'],
    ['password', null],
    ['search', 'searchbox'],
    ['tel', 'textbox'],
    ['url', 'textbox'],
    ['number', 'spinbutton']
  ] as const)('narrows type %s to its native role', (type, role) => {
    const { container } = render(<Input aria-label='Field' type={type} />);
    const control = container.querySelector('input');
    expect(control).toHaveAttribute('type', type);
    if (role) {
      expect(screen.getByRole(role, { name: 'Field' })).toBe(control);
    }
  });

  it('renders a decorative leading icon without changing the accessible name (AC-07)', () => {
    const { container } = render(
      <Input
        aria-label='Search'
        type='search'
        size='sm'
        icon={
          <svg role='img' aria-label='Magnifier'>
            <title>Magnifier</title>
          </svg>
        }
      />
    );
    const wrapper = root(container);
    const control = screen.getByRole('searchbox', { name: 'Search' });
    const icon = wrapper.firstElementChild;
    expect(wrapper.children).toHaveLength(2);
    expect(icon?.tagName).toBe('SPAN');
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(icon).toHaveClass('absolute', 'left-3', 'size-4', 'text-fg-muted', 'pointer-events-none');
    expect(icon?.nextElementSibling).toBe(control);
    expect(control).toHaveClass('pl-9', 'px-3');
    expect(screen.queryByRole('img', { name: 'Magnifier' })).toBeNull();
    expect(wrapper).toHaveClass('relative');
  });

  it('omits the icon wrapper for absent, null or false icon content (AC-07)', () => {
    const { container } = render(
      <>
        <Input aria-label='One' />
        <Input aria-label='Two' icon={null} />
        <Input aria-label='Three' icon={false} />
      </>
    );
    for (const wrapper of container.querySelectorAll('.eg-input')) {
      expect(wrapper.children).toHaveLength(1);
      expect(wrapper.querySelector('[aria-hidden]')).toBeNull();
      expect(wrapper.querySelector('input')).not.toHaveClass('pl-9');
    }
  });

  it('declares the focus, hover, motion and token-only recipe in CVA (AC-08)', () => {
    const control = inputControlVariants({ size: 'md', variant: 'default' });
    for (const utility of [
      'hover:border-fg-muted',
      'focus-visible:outline-none',
      'focus-visible:border-border-brand-strong',
      'focus-visible:shadow-[var(--shadow-well),var(--shadow-ring-brand)]',
      'transition-[border-color,box-shadow]',
      'ease-out',
      'duration-[var(--duration-fast)]',
      'motion-reduce:transition-none'
    ]) {
      expect(control.split(' ')).toContain(utility);
    }
    for (const classes of [control, inputVariants(), inputIconVariants()]) {
      expect(classes).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|\d+px|gradient|!important/i);
    }
    expect(inputVariants()).toContain('eg-input');
  });

  it('composes with a label and description the way Field will (AC-11)', () => {
    render(<Labelled />);
    const control = screen.getByRole('textbox', { name: 'Project title' });
    expect(control).toHaveAccessibleDescription('Shown on the dashboard.');
    expect(control).toBeRequired();
  });
});
