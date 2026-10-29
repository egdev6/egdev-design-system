import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { renderToString } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Slot } from '../../primitives/slot';
import { ButtonGroup } from './ButtonGroup';
import { useButtonGroup } from './useButtonGroup';

const actions = [<Button key='cancel'>Cancel</Button>, <Button key='save'>Save</Button>];

describe('useButtonGroup', () => {
  it('keeps the exact children and composes outer layout last without a fabricated label default', () => {
    const { result } = renderHook(() => useButtonGroup({ children: actions, className: 'ms-auto mt-3' }));
    expect(result.current.children).toBe(actions);
    expect(result.current.rootProps.role).toBe('group');
    expect(result.current.rootProps['aria-label']).toBeUndefined();
    expect(result.current.rootProps.className?.split(' ').slice(-2)).toEqual(['ms-auto', 'mt-3']);
  });
});

describe('ButtonGroup v0.1 public contract', () => {
  it('renders a passive unnamed div group with spaced wrapping defaults and unchanged direct children', () => {
    render(<ButtonGroup>{actions}</ButtonGroup>);
    const group = screen.getByRole('group');
    expect(group.tagName).toBe('DIV');
    expect(group).toHaveClass('eg-button-group', 'inline-flex', 'items-center', 'flex-wrap', 'gap-3');
    expect(group).not.toHaveAttribute('aria-label');
    expect(group).not.toHaveAttribute('tabindex');
    expect(group).not.toHaveAttribute('data-state');
    expect([...group.children]).toEqual(screen.getAllByRole('button'));
    expect(group.className).not.toMatch(/eg-btn-split|eg-btn--join|bg-|shadow-/);
  });

  it('maps the optional label and removes an empty label on rerender', () => {
    const { rerender } = render(<ButtonGroup label='Save options'>{actions}</ButtonGroup>);
    const group = screen.getByRole('group', { name: 'Save options' });
    expect(group).toHaveAttribute('aria-label', 'Save options');
    rerender(<ButtonGroup label=''>{actions}</ButtonGroup>);
    expect(group).not.toHaveAttribute('aria-label');
    rerender(<ButtonGroup>{actions}</ButtonGroup>);
    expect(group).not.toHaveAttribute('aria-label');
  });

  it('forwards native relationships, events and outer layout without dropping the marker', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <>
        <h2 id='actions-title'>Document actions</h2>
        <p id='actions-help'>Choose an action</p>
        <ButtonGroup
          id='actions'
          data-context='footer'
          aria-labelledby='actions-title'
          aria-describedby='actions-help'
          className='ms-auto mt-3'
          dir='rtl'
          onClick={onClick}
        >
          {actions}
        </ButtonGroup>
      </>
    );
    const group = screen.getByRole('group', { name: 'Document actions', description: 'Choose an action' });
    expect(group).toHaveAttribute('id', 'actions');
    expect(group).toHaveAttribute('data-context', 'footer');
    expect(group).toHaveAttribute('dir', 'rtl');
    expect(group).toHaveClass('eg-button-group', 'ms-auto', 'mt-3');
    await user.click(screen.getByRole('button', { name: 'Save' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('attaches three actions using logical direct-child corners and focus stacking, without injecting child classes', () => {
    const children = ['First', 'Middle', 'Last'].map((text) => (
      <Button key={text} variant='secondary'>
        {text}
      </Button>
    ));
    const standalone = renderToString(<>{children}</>);
    const { rerender } = render(<ButtonGroup variant='attached'>{children}</ButtonGroup>);
    const group = screen.getByRole('group');
    expect(group).toHaveClass(
      'flex-nowrap',
      'items-stretch',
      'gap-0.5',
      '*:not-first:rounded-s-sm',
      '*:not-last:rounded-e-sm',
      '*:focus-visible:relative',
      '*:focus-visible:z-10'
    );
    expect(group).not.toHaveClass('flex-wrap', 'items-center', 'gap-3');
    expect(group.innerHTML).toBe(standalone);
    rerender(<ButtonGroup variant='spaced'>{children}</ButtonGroup>);
    expect(group).toHaveClass('flex-wrap', 'gap-3');
    expect(group).not.toHaveClass('*:not-first:rounded-s-sm', '*:not-last:rounded-e-sm', '*:focus-visible:z-10');
  });

  it('retains each enabled tab stop, skips only disabled children and adds no arrow navigation', async () => {
    const user = userEvent.setup();
    const onKeyDown = vi.fn();
    const onClick = vi.fn();
    render(
      <ButtonGroup variant='attached'>
        <Button onKeyDown={onKeyDown} onClick={onClick}>
          First
        </Button>
        <Button disabled={true}>Unavailable</Button>
        <Button onClick={onClick}>Last</Button>
      </ButtonGroup>
    );
    const first = screen.getByRole('button', { name: 'First' });
    const last = screen.getByRole('button', { name: 'Last' });
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowRight}{ArrowDown}{ArrowLeft}{ArrowUp}');
    expect(first).toHaveFocus();
    expect(onKeyDown).toHaveBeenCalledTimes(4);
    await user.keyboard('{Enter}');
    await user.tab();
    expect(last).toHaveFocus();
    await user.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(2);
    expect(screen.getByRole('button', { name: 'Unavailable' })).toBeDisabled();
    expect(first).not.toBeDisabled();
    expect(last).not.toBeDisabled();
    await user.tab({ shift: true });
    expect(first).toHaveFocus();
  });

  it.each([
    ['md', 'lg'],
    ['sm', 'md']
  ] as const)('keeps consumer-owned %s/%s sizes, refs and trigger props', async (size, iconSize) => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const onKeyDown = vi.fn();
    const onClick = vi.fn();
    render(
      <ButtonGroup variant='attached' label='Save options'>
        <Button size={size}>Save</Button>
        <Slot
          ref={ref}
          aria-haspopup='menu'
          aria-expanded={false}
          data-state='closed'
          onKeyDown={onKeyDown}
          onClick={onClick}
        >
          <IconButton label='More save options' icon={<Icon name='chevron-down' />} size={iconSize} variant='primary' />
        </Slot>
      </ButtonGroup>
    );
    const trigger = screen.getByRole('button', { name: 'More save options' });
    expect(ref.current).toBe(trigger);
    expect(trigger.parentElement).toBe(screen.getByRole('group', { name: 'Save options' }));
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveAttribute('data-state', 'closed');
    expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(size === 'md' ? 'min-h-12' : 'min-h-10');
    expect(trigger).toHaveClass(iconSize === 'lg' ? 'size-12' : 'size-10');
    await user.tab();
    await user.tab();
    expect(trigger).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(onKeyDown).toHaveBeenCalledTimes(1);
    await user.click(trigger);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('protects its owned group role and name from untyped native-attribute injection', () => {
    const injected = { role: 'toolbar', 'aria-label': 'Injected name' };
    const { rerender } = render(
      <ButtonGroup {...injected} label='Related actions'>
        {actions}
      </ButtonGroup>
    );
    expect(screen.getByRole('group', { name: 'Related actions' })).not.toHaveAttribute('role', 'toolbar');
    rerender(<ButtonGroup {...injected}>{actions}</ButtonGroup>);
    expect(screen.getByRole('group')).not.toHaveAttribute('aria-label');
  });

  it('renders deterministic server markup without introducing popup state or wrappers', () => {
    const element = (
      <ButtonGroup variant='attached' label='Save options'>
        {actions}
      </ButtonGroup>
    );
    const html = renderToString(element);
    expect(renderToString(element)).toBe(html);
    expect(html).toMatch(/^<div[^>]*role="group"/);
    expect(html).not.toMatch(/aria-expanded|aria-haspopup|tabindex|eg-btn--join/);
  });
});
