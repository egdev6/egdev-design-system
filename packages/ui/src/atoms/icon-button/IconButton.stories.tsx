import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const Gear = () => (
  <svg className='eg-icon' viewBox='0 0 24 24' aria-hidden='true'>
    <circle cx='12' cy='12' r='3' />
    <path d='M12 2v3M12 19v3M2 12h3M19 12h3' />
  </svg>
);

/**
 * ## Descripción
 * Botón con solo icono y nombre accesible obligatorio.
 *
 * ## Radix
 * `AccessibleIcon` da el nombre accesible al icono y `Slot` permite usarlo como enlace con `asChild`.
 *
 * ## Uso
 * `shape='square'` sustituye a la antigua variante `Button --icon`: una variante, no un componente nuevo.
 */
const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { label: 'Ajustes', icon: <Gear /> }
};
export default meta;

type Story = StoryObj<typeof IconButton>;

/** Botón redondo ghost por defecto. */
export const Default: Story = {};

/** Variantes de forma, estilo y tamaño. */
export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
      <IconButton {...args} />
      <IconButton {...args} variant='outline' />
      <IconButton {...args} shape='square' />
      <IconButton {...args} size='sm' />
      <IconButton {...args} pressed={true} label='Ajustes (activo)' />
    </div>
  )
};
