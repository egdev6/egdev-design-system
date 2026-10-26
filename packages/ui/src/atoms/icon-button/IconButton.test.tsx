import { readdirSync } from 'node:fs';
import * as SlotPrimitive from '@radix-ui/react-slot';
import { fireEvent, render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Icon } from '../icon';
import { IconButton } from './index';
import { useIconButton } from './useIconButton.js';

const base = { label: 'Search', icon: <Icon name='search' /> };

describe('IconButton public contract', () => {
  it('keeps exactly six meaningful files and no stylesheet or public helper recipe', () => {
    expect(readdirSync(import.meta.dirname).sort()).toEqual([
      'IconButton.stories.tsx',
      'IconButton.test.tsx',
      'IconButton.tsx',
      'index.ts',
      'types.ts',
      'useIconButton.ts'
    ]);
  });
  it('derives native defaults and merges supported layout on the root', () => {
    const { result } = renderHook(() => useIconButton({ ...base, className: 'ms-1 ms-3' }));
    expect(result.current.asChild).toBe(false);
    expect(result.current.rootProps.type).toBe('button');
    expect(result.current.rootProps.disabled).toBe(false);
    expect(result.current.rootProps.className).toContain('eg-icon-btn');
    expect(result.current.rootProps.className).toContain('size-10');
    expect(result.current.rootProps.className).toContain('ms-3');
    expect(result.current.rootProps.className).not.toContain('ms-1');
  });

  it('names the button through one Radix hidden label and hides its icon', () => {
    render(<IconButton {...base} id='search-action' data-origin='toolbar' aria-describedby='hint' />);
    const button = screen.getByRole('button', { name: 'Search' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveClass('eg-icon-btn', 'box-border', 'p-0', 'border-solid', 'size-10');
    expect(button).not.toHaveClass('eg-icon-button');
    expect(button).not.toHaveAttribute('aria-label');
    expect(button).not.toHaveAttribute('aria-pressed');
    expect(button).not.toHaveAttribute('data-state');
    expect(button).toHaveAttribute('data-origin', 'toolbar');
    expect(button).toHaveAttribute('aria-describedby', 'hint');
    expect(button.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    expect(button.querySelector('svg')).toHaveAttribute('focusable', 'false');
    expect(screen.getAllByText('Search')).toHaveLength(1);
    expect(screen.getByText('Search')).toHaveStyle({ position: 'absolute' });
  });

  it('activates with click, Enter and Space using native behavior', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    render(<IconButton {...base} onClick={click} />);
    await user.tab();
    expect(screen.getByRole('button')).toHaveFocus();
    await user.keyboard('{Enter} ');
    await user.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledTimes(3);
  });

  it('does not submit a form by default and respects explicit submit', async () => {
    const user = userEvent.setup();
    const submit = vi.fn((event: React.FormEvent) => event.preventDefault());
    render(
      <form onSubmit={submit}>
        <IconButton {...base} />
        <IconButton {...base} label='Submit' type='submit' />
      </form>
    );
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(submit).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Submit' }));
    expect(submit).toHaveBeenCalledOnce();
  });

  it('blocks activation and skips focus when natively disabled, then recovers', async () => {
    const user = userEvent.setup();
    const click = vi.fn();
    const { rerender } = render(
      <>
        <IconButton {...base} disabled={true} onClick={click} />
        <button type='button'>Next</button>
      </>
    );
    const button = screen.getByRole('button', { name: 'Search' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('data-disabled');
    fireEvent.click(button);
    await user.tab();
    expect(screen.getByRole('button', { name: 'Next' })).toHaveFocus();
    expect(click).not.toHaveBeenCalled();
    rerender(<IconButton {...base} onClick={click} />);
    await user.click(screen.getByRole('button'));
    expect(click).toHaveBeenCalledOnce();
    expect(screen.getByRole('button')).not.toHaveAttribute('data-disabled');
  });

  it('forwards native refs and props through a Radix Slot trigger', () => {
    const ref = createRef<HTMLButtonElement>();
    const click = vi.fn();
    // Slot is the same props/ref bridge used by future Tooltip.Trigger asChild.
    render(
      <SlotPrimitive.Root onClick={click} aria-expanded='false' ref={ref}>
        <IconButton {...base} />
      </SlotPrimitive.Root>
    );
    const button = screen.getByRole('button');
    expect(ref.current === button).toBe(true);
    expect(button).toHaveAttribute('aria-expanded', 'false');
    fireEvent.click(button);
    expect(click).toHaveBeenCalledOnce();
  });

  it('slots an anchor with its icon, hidden name, native props and root ref', async () => {
    const user = userEvent.setup();
    const ref = createRef<HTMLButtonElement>();
    const rootClick = vi.fn((event: React.MouseEvent) => event.preventDefault());
    const childClick = vi.fn();
    render(
      <IconButton {...base} asChild={true} ref={ref} onClick={rootClick}>
        <a href='#search' target='_blank' rel='noreferrer' onClick={childClick} />
      </IconButton>
    );
    const link = screen.getByRole('link', { name: 'Search' });
    expect(ref.current === link).toBe(true);
    expect(link).toHaveClass('eg-icon-btn');
    expect(link).toHaveAttribute('href', '#search');
    expect(link).toHaveAttribute('rel', 'noreferrer');
    expect(link).not.toHaveAttribute('type');
    expect(link.querySelector('svg')).not.toBeNull();
    await user.tab();
    await user.keyboard('{Enter}');
    expect(childClick).toHaveBeenCalledOnce();
    expect(rootClick).toHaveBeenCalledOnce();
  });

  it('suppresses disabled slotted child and root handlers and navigation, then restores them', () => {
    const rootClick = vi.fn();
    const childClick = vi.fn();
    const keyDown = vi.fn();
    const { rerender } = render(
      <IconButton {...base} asChild={true} disabled={true} onClick={rootClick} onKeyDown={keyDown}>
        <a href='#search' tabIndex={0} onClick={childClick} onKeyDown={keyDown} />
      </IconButton>
    );
    const link = screen.getByRole('link', { name: 'Search' });
    expect(link).toHaveAttribute('aria-disabled', 'true');
    expect(link).toHaveAttribute('tabindex', '-1');
    expect(link).toHaveAttribute('data-disabled');
    expect(link).not.toHaveAttribute('disabled');
    expect(fireEvent.click(link)).toBe(false);
    expect(fireEvent.keyDown(link, { key: 'Enter' })).toBe(false);
    expect(rootClick).not.toHaveBeenCalled();
    expect(childClick).not.toHaveBeenCalled();
    expect(keyDown).not.toHaveBeenCalled();
    rerender(
      <IconButton {...base} asChild={true} onClick={rootClick}>
        <a href='#search' onClick={childClick} />
      </IconButton>
    );
    expect(screen.getByRole('link')).not.toHaveAttribute('aria-disabled');
    expect(screen.getByRole('link')).not.toHaveAttribute('tabindex');
    fireEvent.click(screen.getByRole('link'));
    expect(rootClick).toHaveBeenCalledOnce();
    expect(childClick).toHaveBeenCalledOnce();
  });

  it.each([
    ['sm', 'size-8', 'size-4'],
    ['md', 'size-10', 'size-(--icon-size)'],
    ['lg', 'size-12', 'size-(--icon-size)']
  ] as const)('uses the %s control and decorative glyph presets', (size, control, glyph) => {
    render(<IconButton {...base} size={size} icon={<Icon name='search' size='lg' className='shrink-0' />} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass(control);
    expect(button.querySelector('svg')).toHaveClass(glyph, 'shrink-0');
    expect(button.querySelector('svg')).not.toHaveClass('size-7');
  });

  it.each(['ghost', 'outline', 'primary', 'secondary'] as const)(
    'selects %s without emitting legacy modifiers',
    (variant) => {
      render(<IconButton {...base} variant={variant} />);
      const button = screen.getByRole('button');
      expect(button.className).not.toMatch(/eg-icon-btn--|is-hover|is-pressed/);
      expect(button).toHaveClass(variant === 'outline' ? 'rounded-full' : 'rounded-md');
      expect(button).toHaveClass(
        'focus-visible:shadow-focus',
        'motion-reduce:transition-none',
        'motion-reduce:transform-none'
      );
    }
  );

  it('limits interactive geometry to motion-safe states and keeps focus out of state-shadow competition', () => {
    render(<IconButton {...base} variant='outline' />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('motion-safe:[&:not([data-disabled]):active]:scale-94');
    expect(button).toHaveClass('motion-safe:[&:not([data-disabled]):hover:not(:active)]:-translate-y-0.5');
    expect(button).toHaveClass(
      '[&:not([data-disabled]):hover:not(:focus-visible)]:shadow-[var(--shadow-edge-strong),var(--shadow-elev-1),var(--shadow-glow-base)]'
    );
  });

  it('supports raw SVG and merges the existing icon layout class without adding a public part marker', () => {
    render(
      <IconButton
        {...base}
        size='sm'
        icon={
          <svg className='size-7 shrink-0' viewBox='0 0 24 24'>
            <path d='M1 1h2' />
          </svg>
        }
      />
    );
    const svg = screen.getByRole('button').querySelector('svg');
    expect(svg).toHaveClass('size-4', 'shrink-0');
    expect(svg).not.toHaveClass('size-7');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    expect(svg).toHaveAttribute('focusable', 'false');
  });
});
