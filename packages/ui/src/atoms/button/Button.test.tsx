import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from '../icon';
import { Button } from './Button';
import { useButton } from './useButton';

describe('Button contract', () => {
  it('renders the large recipe and md-sized icon, including while loading', () => {
    const { rerender } = render(
      <Button size='lg' icon={<Icon name='check' />}>
        Save
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('min-h-14', 'py-3', 'px-5.5', 'gap-2.5', 'text-cta-label');
    expect(button.querySelector('.eg-btn__icon')).toHaveClass('size-(--icon-size)');
    rerender(
      <Button size='lg' loading={true}>
        Save
      </Button>
    );
    expect(button.querySelector('.eg-btn__icon')).toHaveClass('size-(--icon-size)');
    expect(button.querySelector('.eg-spinner')).not.toBeNull();
  });

  it.each([
    ['md', ['min-h-12', 'py-3', 'px-5.5', 'gap-2.5', 'text-cta-label'], 'size-(--icon-size)'],
    [
      'sm',
      ['min-h-10', 'py-2', 'px-4', 'gap-2', 'text-label-default', '[font-weight:var(--text-cta-label--font-weight)]'],
      'size-4'
    ]
  ] as const)('preserves the %s size recipe and icon', (size, classes, iconClass) => {
    render(
      <Button size={size} icon={<Icon name='check' />}>
        Save
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass(...classes);
    expect(button.querySelector('.eg-btn__icon')).toHaveClass(iconClass);
  });
  it.each(['primary', 'secondary', 'neutral', 'dark'] as const)(
    'supports the %s treatment in both sizes without legacy modifiers',
    (variant) => {
      const { rerender } = render(
        <Button variant={variant} size='md'>
          Action
        </Button>
      );
      const button = screen.getByRole('button', { name: 'Action' });
      expect(button).toHaveClass('eg-btn', 'min-h-12', 'text-cta-label');
      expect(button.className.split(' ').some((name) => name.startsWith('eg-btn--') || name.startsWith('is-'))).toBe(
        false
      );
      rerender(
        <Button variant={variant} size='sm'>
          Action
        </Button>
      );
      expect(button).toHaveClass('min-h-10', 'text-label-default');
      expect(button).not.toHaveClass('text-cta-label');
    }
  );

  it.each(['primary', 'secondary'] as const)(
    'keeps the %s resting Material image and shadow free of competing resets after merging',
    (variant) => {
      const { rerender } = render(<Button variant={variant}>Save</Button>);
      const button = screen.getByRole('button', { name: 'Save' });
      for (const size of ['md', 'sm'] as const) {
        rerender(
          <Button variant={variant} size={size} className='w-full ms-1 ms-2'>
            Save
          </Button>
        );
        expect(button).toHaveClass(`[background-image:var(--gradient-btn-${variant})]`);
        expect(button).toHaveClass(
          variant === 'primary'
            ? '[box-shadow:var(--shadow-btn-primary)]'
            : '[box-shadow:var(--shadow-edge-strong),var(--shadow-elev-1)]'
        );
        expect(button).not.toHaveClass('bg-none');
        expect(button).not.toHaveClass('shadow-none');
        expect(button).toHaveClass('w-full', 'ms-2', 'focus-visible:[box-shadow:var(--shadow-focus)]');
        expect(button).toHaveClass('data-disabled:shadow-none');
        expect(button).toHaveClass('[&:not([aria-disabled=true]):active]:bg-none');
      }
    }
  );

  it('keeps explicit no-image and no-shadow resets for dark at rest', () => {
    render(<Button variant='dark'>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass('bg-none', 'shadow-none');
    expect(button).toHaveClass('bg-primitive-black');
  });

  it('styles the neutral treatment as a visible grey surface with opacity-only hover feedback', () => {
    render(<Button variant='neutral'>Save</Button>);
    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveClass(
      'bg-surface-2',
      'bg-[image:var(--gradient-sheen)]',
      'border-border-hairline',
      'shadow-(--shadow-edge)',
      'text-fg-default'
    );
    expect(button).not.toHaveClass('bg-transparent');
    expect(button).toHaveClass('[&:not([aria-disabled=true]):hover]:opacity-80');
    expect(button).toHaveClass('[&:not([aria-disabled=true]):active]:opacity-70');
    expect(button).toHaveClass('focus-visible:[box-shadow:var(--shadow-focus)]');
  });

  it.each(['start', 'end'] as const)('centers the %s icon without an inline SVG line box', (iconPosition) => {
    render(
      <Button icon={<Icon name='check' />} iconPosition={iconPosition}>
        Save
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    const slot = button.querySelector('.eg-btn__icon');
    expect(slot).toHaveClass('inline-flex', 'items-center', 'justify-center', '[&>svg]:block', '[&>svg]:size-full');
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(slot?.querySelector('svg')).toHaveClass('eg-icon');
    expect(iconPosition === 'start' ? button.firstChild === slot : button.lastChild === slot).toBe(true);
  });

  it('preserves capture handlers when enabled and blocks them during pending activation', async () => {
    const user = userEvent.setup();
    const capture = vi.fn();
    const click = vi.fn();
    const { rerender } = render(
      <Button onClickCapture={capture} onClick={click}>
        Save
      </Button>
    );
    await user.click(screen.getByRole('button'));
    expect(capture).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
    rerender(
      <Button loading={true} onClickCapture={capture} onClick={click}>
        Save
      </Button>
    );
    await user.click(screen.getByRole('button'));
    expect(capture).toHaveBeenCalledTimes(1);
    expect(click).toHaveBeenCalledTimes(1);
  });

  it('removes disabled Slot links from keyboard navigation and restores loading links', async () => {
    const user = userEvent.setup();
    const rootClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());
    const childClick = vi.fn();
    const childRef = createRef<HTMLAnchorElement>();
    const props = {
      asChild: true,
      onClick: rootClick,
      children: (
        <a ref={childRef} href='#save' onClick={childClick}>
          Save
        </a>
      )
    };
    const { rerender } = render(
      <>
        <Button {...props} disabled={true} />
        <button type='button'>Next</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    rerender(
      <>
        <Button {...props} loading={true} />
        <button type='button'>Next</button>
      </>
    );
    const link = screen.getByRole('link');
    expect(childRef.current === link).toBe(true);
    expect(link).not.toHaveAttribute('tabindex');
    link.focus();
    await user.keyboard('{Enter}');
    expect(rootClick).not.toHaveBeenCalled();
    expect(childClick).not.toHaveBeenCalled();
    rerender(
      <>
        <Button {...props} />
        <button type='button'>Next</button>
      </>
    );
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(rootClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
  });

  it('defaults to a named native non-submit action and derives idle hook state', () => {
    const { result } = renderHook(() => useButton({ children: 'Save draft' }));
    expect(result.current.rootProps.type).toBe('button');
    expect(result.current.rootProps['data-state']).toBe('idle');
    render(<Button>Save draft</Button>);
    const button = screen.getByRole('button', { name: 'Save draft' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('eg-btn', 'box-border', 'border-solid', 'min-h-12');
    expect(button).not.toHaveAttribute('aria-disabled');
  });

  it('activates by click, Enter and Space, without submitting by default', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const submit = vi.fn((event: FormEvent<HTMLFormElement>) => event.preventDefault());
    const { rerender } = render(
      <form onSubmit={submit}>
        <Button onClick={click}>Save</Button>
      </form>
    );
    await user.click(screen.getByRole('button'));
    await user.keyboard('{Enter} ');
    expect(click).toHaveBeenCalledTimes(3);
    expect(submit).not.toHaveBeenCalled();
    rerender(
      <form onSubmit={submit}>
        <Button type='submit'>Save</Button>
      </form>
    );
    await user.click(screen.getByRole('button'));
    expect(submit).toHaveBeenCalledTimes(1);
  });

  it('removes native disabled actions from tab order and suppresses activation', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(
      <>
        <Button disabled={true} onClick={click}>
          Unavailable
        </Button>
        <button type='button'>Next</button>
      </>
    );
    const button = screen.getByRole('button', { name: 'Unavailable' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled');
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    fireEvent.click(button);
    expect(click).not.toHaveBeenCalled();
  });

  it('retains focus while loading, replaces the icon decoratively and recovers', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const icon = <Icon name='check' />;
    const { rerender } = render(
      <Button icon={icon} onClick={click}>
        Save
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save' });
    await user.tab();
    rerender(
      <Button icon={icon} loading={true} onClick={click}>
        Save
      </Button>
    );
    expect(button).toHaveFocus();
    expect(button).not.toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('data-state', 'loading');
    expect(button.querySelector('.eg-spinner')).not.toBeNull();
    expect(button.querySelector('.eg-icon')).toBeNull();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    await user.click(button);
    await user.keyboard('{Enter} ');
    expect(click).not.toHaveBeenCalled();
    rerender(
      <Button icon={icon} onClick={click}>
        Save
      </Button>
    );
    expect(button.querySelector('.eg-spinner')).toBeNull();
    expect(button.querySelector('.eg-icon')).not.toBeNull();
    expect(button).not.toHaveAttribute('aria-busy');
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
  });

  it.each(['start', 'end'] as const)('inserts the %s icon inside a slotted anchor', (iconPosition) => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button asChild={true} icon={<Icon name='arrow-right' />} iconPosition={iconPosition} ref={ref}>
        <a href='#projects'>Projects</a>
      </Button>
    );
    const link = screen.getByRole('link', { name: 'Projects' });
    expect(link).toHaveClass('eg-btn');
    expect(link).not.toHaveAttribute('type');
    expect(ref.current === link).toBe(true);
    const slot = link.querySelector('.eg-btn__icon');
    expect(slot).toHaveAttribute('aria-hidden', 'true');
    expect(iconPosition === 'start' ? link.firstChild === slot : link.lastChild === slot).toBe(true);
  });

  it.each([{ disabled: true }, { loading: true }])('blocks both slotted and root activation with %j', async (state) => {
    const user = userEvent.setup();
    const rootClick = vi.fn();
    const childClick = vi.fn();
    render(
      <Button asChild={true} {...state} onClick={rootClick}>
        <a href='#save' onClick={childClick}>
          Save
        </a>
      </Button>
    );
    const link = screen.getByRole('link');
    expect(link).not.toHaveAttribute('disabled');
    expect(link).toHaveAttribute('aria-disabled', 'true');
    if (state.disabled) {
      expect(link).toHaveAttribute('tabindex', '-1');
    } else {
      await user.tab();
      expect(link).toHaveFocus();
      await user.keyboard('{Enter}');
    }
    expect(fireEvent.click(link)).toBe(false);
    expect(childClick).not.toHaveBeenCalled();
    expect(rootClick).not.toHaveBeenCalled();
  });

  it('composes enabled child handlers, native attributes, layout classes and button refs', async () => {
    const user = userEvent.setup();
    const rootClick = vi.fn();
    const childClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <Button ref={ref} className='w-full ms-1 ms-2' name='save' data-purpose='draft'>
        Save
      </Button>
    );
    const button = screen.getByRole('button');
    expect(ref.current === button).toBe(true);
    expect(button).toHaveClass('eg-btn', 'w-full', 'ms-2');
    expect(button).not.toHaveClass('ms-1');
    expect(button).toHaveAttribute('name', 'save');
    expect(button).toHaveAttribute('data-purpose', 'draft');
    rerender(
      <Button asChild={true} onClick={rootClick}>
        <a href='#save' onClick={childClick}>
          Save
        </a>
      </Button>
    );
    await user.click(screen.getByRole('link'));
    expect(rootClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
  });

  it('uses the small slot scale, end placement by default and disabled precedence', () => {
    const { rerender } = render(
      <Button size='sm' icon={<Icon name='check' />}>
        Save
      </Button>
    );
    const button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-10', 'text-label-default');
    expect(button.lastChild).toHaveClass('eg-btn__icon', 'size-4');
    rerender(
      <Button disabled={true} loading={true}>
        Save
      </Button>
    );
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled');
  });
});

describe('Button label wrapping', () => {
  it.each(
    (['primary', 'secondary', 'neutral', 'dark'] as const).flatMap((variant) =>
      (['sm', 'md', 'lg'] as const).map((size) => [variant, size] as const)
    )
  )('keeps omitted and false classes identical for %s / %s', (variant, size) => {
    const { rerender } = render(
      <Button variant={variant} size={size}>
        Save draft
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save draft' });
    const omitted = button.className;
    rerender(
      <Button variant={variant} size={size} labelWrap={false}>
        Save draft
      </Button>
    );
    expect(button.className).toBe(omitted);
    expect(button).toHaveClass('whitespace-nowrap');
    for (const utility of ['whitespace-normal', 'wrap-anywhere', 'text-center']) {
      expect(button).not.toHaveClass(utility);
    }
    expect(button).not.toHaveAttribute('labelwrap');
  });

  it.each([
    ['sm', 'min-h-10', 'py-2'],
    ['md', 'min-h-12', 'py-3'],
    ['lg', 'min-h-14', 'py-3']
  ] as const)('wraps long text while retaining the %s minimum and padding', (size, minHeight, padding) => {
    const label = 'Publish extraordinarilylongunbrokenlocalizedactionlabel now';
    render(
      <Button size={size} labelWrap={true}>
        {label}
      </Button>
    );
    const button = screen.getByRole('button', { name: label });
    expect(button).toHaveClass('whitespace-normal', 'wrap-anywhere', 'text-center', minHeight, padding);
    expect(button).not.toHaveClass('whitespace-nowrap');
    expect(button).not.toHaveClass('wrap-break-word');
    expect(button).not.toHaveAttribute('labelwrap');
  });

  it.each(['start', 'end'] as const)(
    'keeps the wrapped %s icon and spinner decorative and in order',
    (iconPosition) => {
      const { rerender } = render(
        <Button labelWrap={true} icon={<Icon name='check' />} iconPosition={iconPosition}>
          Save draft now
        </Button>
      );
      const button = screen.getByRole('button', { name: 'Save draft now' });
      expect(button).toHaveClass('whitespace-normal', 'wrap-anywhere', 'text-center');
      const icon = button.querySelector('.eg-btn__icon');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
      expect(icon?.querySelector('.eg-icon')).not.toBeNull();
      expect(iconPosition === 'start' ? button.firstChild : button.lastChild).toBe(icon);
      rerender(
        <Button labelWrap={true} loading={true} iconPosition={iconPosition}>
          Save draft now
        </Button>
      );
      const spinner = button.querySelector('.eg-btn__icon');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
      expect(spinner?.querySelector('.eg-spinner')).not.toBeNull();
      expect(iconPosition === 'start' ? button.firstChild : button.lastChild).toBe(spinner);
      expect(button).toHaveAccessibleName('Save draft now');
    }
  );

  it('preserves native refs, activation, loading and disabled guards with wrapping', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const capture = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const { rerender } = render(
      <Button labelWrap={true} ref={ref} onClick={click} onClickCapture={capture} className='w-full w-auto m-2'>
        Save draft now
      </Button>
    );
    const button = screen.getByRole('button', { name: 'Save draft now' });
    expect(button).toHaveClass('whitespace-normal', 'wrap-anywhere', 'text-center', 'w-auto', 'm-2');
    expect(button).not.toHaveClass('w-full');
    expect(button).not.toHaveClass('m-0');
    expect(button).not.toHaveClass('whitespace-nowrap');
    expect(button).not.toHaveAttribute('labelwrap');
    expect(ref.current).toBe(button);
    await user.tab();
    expect(button).toHaveFocus();
    await user.keyboard('{Enter} ');
    await user.click(button);
    expect(click).toHaveBeenCalledTimes(3);
    expect(capture).toHaveBeenCalledTimes(3);
    rerender(
      <Button labelWrap={true} ref={ref} loading={true} onClick={click} onClickCapture={capture}>
        Save draft now
      </Button>
    );
    expect(button).toHaveFocus();
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Enter} ');
    await user.click(button);
    expect(click).toHaveBeenCalledTimes(3);
    expect(capture).toHaveBeenCalledTimes(3);
    rerender(
      <Button labelWrap={true} ref={ref} disabled={true} loading={true} onClick={click}>
        Save draft now
      </Button>
    );
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(click).toHaveBeenCalledTimes(3);
    rerender(
      <Button labelWrap={true} ref={ref} onClick={click}>
        Save draft now
      </Button>
    );
    expect(button).not.toHaveAttribute('aria-busy');
    await user.click(button);
    expect(click).toHaveBeenCalledTimes(4);
  });

  it('preserves slotted link refs, handlers, focus and guarded Enter activation with wrapping', async () => {
    const user = userEvent.setup();
    const rootClick = vi.fn((event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault());
    const childClick = vi.fn();
    const ref = createRef<HTMLButtonElement>();
    const link = (
      <a href='#draft' onClick={childClick}>
        Review draft details
      </a>
    );
    const view = (state: { loading?: boolean; disabled?: boolean } = {}) => (
      <Button asChild={true} labelWrap={true} ref={ref} onClick={rootClick} {...state}>
        {link}
      </Button>
    );
    const { rerender } = render(view());
    const anchor = screen.getByRole('link', { name: 'Review draft details' });
    expect(anchor).toHaveClass('whitespace-normal', 'wrap-anywhere', 'text-center');
    expect(anchor).not.toHaveClass('whitespace-nowrap');
    expect(anchor).not.toHaveAttribute('labelwrap');
    expect(ref.current === anchor).toBe(true);
    await user.tab();
    expect(anchor).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(rootClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
    rerender(view({ loading: true }));
    expect(anchor).toHaveFocus();
    expect(anchor).toHaveAttribute('aria-busy', 'true');
    expect(anchor).toHaveAttribute('aria-disabled', 'true');
    await user.keyboard('{Enter}');
    expect(fireEvent.click(anchor)).toBe(false);
    expect(rootClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
    rerender(view({ disabled: true }));
    expect(anchor).toHaveAttribute('tabindex', '-1');
    expect(anchor).toHaveAttribute('aria-disabled', 'true');
    expect(fireEvent.click(anchor)).toBe(false);
    expect(rootClick).toHaveBeenCalledTimes(1);
    expect(childClick).toHaveBeenCalledTimes(1);
    rerender(view());
    expect(anchor).not.toHaveAttribute('aria-busy');
    expect(anchor).not.toHaveAttribute('tabindex');
    anchor.focus();
    await user.keyboard('{Enter}');
    expect(rootClick).toHaveBeenCalledTimes(2);
    expect(childClick).toHaveBeenCalledTimes(2);
  });
});

describe('Button hover motion (#224 owner review)', () => {
  const hoverMotion = /hover\]?(?:\/button)?:-?(?:translate|scale)|hover\]:-?translate/;

  it.each(['primary', 'secondary', 'neutral', 'dark'] as const)('keeps the %s root still on hover', (variant) => {
    render(<Button variant={variant}>Save</Button>);
    const classes = screen.getByRole('button', { name: 'Save' }).className.split(/\s+/);
    expect(classes.filter((value) => hoverMotion.test(value))).toEqual([]);
  });

  it('keeps the icon still on hover while preserving the press feedback', () => {
    render(<Button icon={<Icon name='arrow-right' />}>Next</Button>);
    const button = screen.getByRole('button', { name: 'Next' });
    const icon = button.querySelector('.eg-btn__icon');
    expect(icon).not.toBeNull();
    expect(icon?.className.split(/\s+/).filter((value) => /hover.*translate/.test(value))).toEqual([]);
    expect(button.className).toContain('[&:not([aria-disabled=true]):active]:translate-y-px');
  });
});
