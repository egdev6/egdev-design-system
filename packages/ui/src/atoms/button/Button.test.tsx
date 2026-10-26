import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type FormEvent } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from '../icon';
import { Button } from './Button';
import { useButton } from './useButton';

describe('Button contract', () => {
  it.each(['primary', 'secondary', 'ghost', 'dark'] as const)(
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
