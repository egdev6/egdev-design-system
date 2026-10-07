import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps } from 'react';

export const surfaceVariants = cva('eg-surface', {
  variants: {
    /**
     * Material de la superficie (Material v2).
     * `default`: surface-1 con brillo cenital y borde de luz. `glass`: overlay translúcido para lo que flota
     * (antes ModuleCard --glass, Stat --glass y la tira de Gauge). `brand`: tinte rojo de lo destacado o lo que
     * añade el agente. `well`: pozo hundido (gráficas, vistas previas). `ghost`: hueco discontinuo, sin materia.
     */
    tone: {
      default: '',
      glass: 'eg-surface--glass',
      brand: 'eg-surface--brand',
      well: 'eg-surface--well',
      ghost: 'eg-surface--ghost'
    },
    /** Elevación: `flat` sin sombra, `low` (shadow-elev-1) o `high` (shadow-elev-2). `glass` siempre flota (elev-3). */
    elevation: {
      flat: 'eg-surface--flat',
      low: '',
      high: 'eg-surface--high'
    },
    padding: {
      none: 'eg-surface--pad-none',
      sm: 'eg-surface--pad-sm',
      md: '',
      lg: 'eg-surface--pad-lg'
    },
    radius: {
      md: 'eg-surface--radius-md',
      lg: 'eg-surface--radius-lg',
      xl: '',
      full: 'eg-surface--radius-full'
    }
  },
  defaultVariants: { tone: 'default', elevation: 'low', padding: 'md', radius: 'xl' }
});

export type SurfaceProps = ComponentProps<'div'> &
  VariantProps<typeof surfaceVariants> & {
    /**
     * Renderiza el hijo en lugar de un `div` (Radix Slot): `<Surface asChild><section/></Surface>`.
     * @default false
     */
    asChild?: boolean;
    /**
     * @control select
     * @default 'default'
     */
    tone?: 'default' | 'glass' | 'brand' | 'well' | 'ghost';
    /**
     * @control select
     * @default 'low'
     */
    elevation?: 'flat' | 'low' | 'high';
    /**
     * @control select
     * @default 'md'
     */
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /**
     * @control select
     * @default 'xl'
     */
    radius?: 'md' | 'lg' | 'xl' | 'full';
  };
