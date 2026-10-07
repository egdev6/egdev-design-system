import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { Tabs } from './Tabs';

/**
 * ## Descripción
 * Pestañas con contador opcional. Sin paneles, sirve de selector.
 *
 * - `variant="underline"` (por defecto): estados de una lista o partes de un editor. La activa lleva subrayado neón con brillo.
 * - `variant="segmented"`: un pozo con la opción activa elevada (Material v2). Para 2–4 opciones cortas:
 *   24 h · 7 d · 30 d en Quorb, Lista · Semana · Mes en Cadencia, Forma · Contenido · Voz en Criterio.
 *   No la uses con contadores largos ni con muchas pestañas.
 *
 * ## Radix
 * `Tabs` aporta los roles `tablist`/`tab`/`tabpanel`, el foco itinerante con flechas y `aria-selected`,
 * que es justo el atributo que ya estiliza la hoja de EGDEV.
 */
const meta: Meta<typeof Tabs> = {
  title: 'Molecules/Tabs',
  component: Tabs,
  tags: ['autodocs'],
  args: {
    label: 'Vistas de la cola',
    onValueChange: action('value-change'),
    items: [
      { value: 'cola', label: 'Cola', count: 12, content: 'Posts programados' },
      { value: 'borradores', label: 'Borradores', count: 4, content: 'Borradores' },
      { value: 'fallos', label: 'Fallos', count: 1, danger: true, content: 'Posts con error' }
    ]
  }
};
export default meta;

type Story = StoryObj<typeof Tabs>;

/** Pestañas con paneles y contador de error. */
export const Default: Story = {};

/** Selector segmentado sin paneles: el rango del historial de Quorb. */
export const Segmented: Story = {
  args: {
    label: 'Historial',
    size: 'sm',
    variant: 'segmented',
    defaultValue: '7d',
    items: [
      { value: '24h', label: '24 h' },
      { value: '7d', label: '7 d' },
      { value: '30d', label: '30 d' }
    ]
  }
};
