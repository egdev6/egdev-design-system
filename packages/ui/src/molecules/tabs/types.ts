import { cva, type VariantProps } from 'class-variance-authority';
import type { ReactNode } from 'react';

export const tabsListVariants = cva('eg-tabs', {
  variants: {
    size: { md: '', sm: 'eg-tabs--sm' },
    /**
     * `underline`: pestañas con subrayado neón (estados de una lista, partes de un editor).
     * `segmented`: pozo con la opción activa elevada, para 2–4 opciones cortas (24 h · 7 d · 30 d, Lista · Calendario).
     */
    variant: { underline: '', segmented: 'eg-tabs--segmented' }
  },
  defaultVariants: { size: 'md', variant: 'underline' }
});

export type TabItem = {
  value: string;
  label: ReactNode;
  /** Contador junto a la etiqueta. */
  count?: number;
  /** El contador va en rojo (errores, fallos). */
  danger?: boolean;
  disabled?: boolean;
  /** Panel asociado. Si ningún item lo tiene, Tabs funciona como selector (24 h · 7 d · 30 d). */
  content?: ReactNode;
};

export type TabsProps = VariantProps<typeof tabsListVariants> & {
  /** Nombre accesible de la lista de pestañas. */
  label: string;
  items: TabItem[];
  /** Pestaña inicial (no controlado). Por defecto, la primera. */
  defaultValue?: string;
  /** Pestaña activa (controlado). */
  value?: string;
  onValueChange?: (value: string) => void;
  /**
   * @control select
   * @default 'md'
   */
  size?: 'md' | 'sm';
  /**
   * @control select
   * @default 'underline'
   */
  variant?: 'underline' | 'segmented';
  className?: string;
};
