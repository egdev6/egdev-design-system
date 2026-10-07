import { cva, type VariantProps } from 'class-variance-authority';
import type { ComponentProps, ReactNode } from 'react';

export const iconButtonVariants = cva('eg-icon-btn', {
  variants: {
    variant: { ghost: '', outline: 'eg-icon-btn--outline' },
    /** Forma: `square` es la variante sin redondeo completo (la que antes era Button --icon). */
    shape: { round: '', square: 'eg-icon-btn--square' },
    size: { md: '', sm: 'eg-icon-btn--sm' }
  },
  defaultVariants: { variant: 'ghost', shape: 'round', size: 'md' }
});

export type IconButtonProps = Omit<ComponentProps<'button'>, 'children'> &
  VariantProps<typeof iconButtonVariants> & {
    /** Nombre accesible. Obligatorio: el botón solo tiene icono. */
    label: string;
    /** Icono (normalmente `<Icon name='…' />`). Se oculta a lectores de pantalla. */
    icon: ReactNode;
    /**
     * @control select
     * @default 'ghost'
     */
    variant?: 'ghost' | 'outline';
    /**
     * @control select
     * @default 'round'
     */
    shape?: 'round' | 'square';
    /**
     * @control select
     * @default 'md'
     */
    size?: 'md' | 'sm';
    /**
     * Estado conmutado (mostrar/ocultar, silenciar). Se refleja en `aria-pressed`.
     */
    pressed?: boolean;
    /**
     * Renderiza el hijo (p. ej. un enlace) con el aspecto de IconButton (Radix Slot).
     * @default false
     */
    asChild?: boolean;
    /** Solo con `asChild`: el elemento que hereda el aspecto (p. ej. `<a href>`). El icono se añade dentro. */
    children?: ReactNode;
  };
