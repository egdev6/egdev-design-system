import { render, renderHook, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Surface } from './Surface';
import { useSurface } from './useSurface';

describe('useSurface — logic', () => {
  it('does not render as child by default', () => {
    const { result } = renderHook(() => useSurface({}));
    expect(result.current.asChild).toBe(false);
  });

  it('keeps the className passed by the consumer', () => {
    const { result } = renderHook(() => useSurface({ className: 'custom' }));
    expect(result.current.className).toContain('custom');
  });
});

describe('Surface — component', () => {
  it('renders a div with its content', () => {
    render(<Surface data-testid='surface'>Contenido</Surface>);
    expect(screen.getByTestId('surface').tagName).toBe('DIV');
    expect(screen.getByText('Contenido')).toBeInTheDocument();
  });

  it('renders the child element when asChild is set', () => {
    render(
      <Surface asChild={true}>
        <section aria-label='Panel'>Contenido</section>
      </Surface>
    );
    expect(screen.getByRole('region', { name: 'Panel' })).toBeInTheDocument();
  });

  it('passes native attributes to the root', () => {
    render(
      <Surface tone='well' elevation='flat' data-testid='surface' aria-label='Historial'>
        Gráfica
      </Surface>
    );
    expect(screen.getByTestId('surface')).toHaveAttribute('aria-label', 'Historial');
  });
});
