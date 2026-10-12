import { render, renderHook, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from './IconButton';
import { useIconButton } from './useIconButton';

const icon = <svg viewBox='0 0 24 24' />;

describe('useIconButton — logic', () => {
  it('uses type button by default', () => {
    const { result } = renderHook(() => useIconButton({ label: 'Ajustes', icon }));
    expect(result.current.type).toBe('button');
  });

  it('exposes the label as accessible name', () => {
    const { result } = renderHook(() => useIconButton({ label: 'Ajustes', icon }));
    expect(result.current.ariaLabel).toBe('Ajustes');
  });
});

describe('IconButton — component', () => {
  it.each([false, true])('forwards its public button ref with asChild=%s', (asChild) => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <IconButton asChild={asChild} ref={ref} label='Save' icon={icon}>
        {asChild ? <button type='button' /> : undefined}
      </IconButton>
    );
    expect(ref.current).toBe(screen.getByRole('button', { name: 'Save' }));
  });

  it('is reachable by its label', () => {
    render(<IconButton label='Ajustes' icon={icon} />);
    expect(screen.getByRole('button', { name: 'Ajustes' })).toBeInTheDocument();
  });

  it('reflects the pressed state', () => {
    render(<IconButton label='Ocultar capa' icon={icon} pressed={true} />);
    expect(screen.getByRole('button', { name: 'Ocultar capa' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('calls onClick', async () => {
    const onClick = vi.fn();
    render(<IconButton label='Actualizar' icon={icon} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('does not fire when disabled', async () => {
    const onClick = vi.fn();
    render(<IconButton label='Actualizar' icon={icon} disabled={true} onClick={onClick} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actualizar' }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
