import type { Meta, StoryObj } from '@storybook/react';
import { Surface } from './Surface';

/**
 * ## Descripción
 * Caja con el material del sistema (Material v2): superficie tonal, brillo cenital, borde de luz y sombra de
 * dos capas. Es la base de ModuleCard, ListItem, el panel de Quorb y cualquier sección de ajustes: nada debería
 * repetir `background + border + radius + box-shadow` a mano.
 *
 * - **Lo que flota** (menús, paneles sobre el escritorio) es `tone="glass"`: overlay translúcido con alternativa
 *   sólida en `prefers-reduced-transparency`.
 * - **Lo que se rellena o se mira dentro** (gráficas, vistas previas) es `tone="well"`: un pozo.
 *
 * ## Radix
 * Usa `Slot` para `asChild`, así puede ser un `section`, un `article` o un `li` sin envolturas extra.
 */
const meta: Meta<typeof Surface> = {
  title: 'Primitives/Surface',
  component: Surface,
  tags: ['autodocs'],
  args: { children: 'Contenido de la superficie' }
};
export default meta;

type Story = StoryObj<typeof Surface>;

/** Superficie por defecto: surface-1, borde hairline, borde de luz y elevación baja. */
export const Default: Story = {};

/** Los cinco tonos. */
export const Tones: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }}>
      <Surface>default</Surface>
      <Surface tone='glass'>glass</Surface>
      <Surface tone='brand'>brand</Surface>
      <Surface tone='well'>well</Surface>
      <Surface tone='ghost'>ghost</Surface>
    </div>
  )
};

/** Elevación: sin sombra, baja (tarjeta) y alta (hover o destacado). */
export const Elevation: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <Surface elevation='flat'>flat</Surface>
      <Surface elevation='low'>low</Surface>
      <Surface elevation='high'>high</Surface>
    </div>
  )
};
