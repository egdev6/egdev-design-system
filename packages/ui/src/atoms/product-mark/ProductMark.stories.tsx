import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from '../../primitives/surface';
import { ProductMark } from './ProductMark';

/**
 * ## Description
 * A square 40px monogram that identifies an EGDEV product (Mando, Cadencia, egdev-live,
 * Criterio, media-tool, Quorb) in rails, sidebars and headers. It is passive by default
 * (`role="img"` named by `label`); with `href` it renders a native link.
 *
 * ## Dependencies
 * No Radix behavior base: static content or a native anchor. No stylesheet is required.
 *
 * ## Usage guidelines
 * Use one or two characters for `monogram`; longer text is unsupported and not truncated.
 * The monogram is hidden from assistive technology, so `label` must name the product, or the
 * link purpose in link mode (`Mando home`). The tile uses the product-mark Material
 * (primary gradient, primary bevel and halo, black display text) and has no hover or press
 * change; link focus replaces the shadow with the focus ring. Router integration wraps the
 * mark in the consumer. className supports root margin and alignment only.
 */
const meta: Meta<typeof ProductMark> = {
  title: 'Atoms/ProductMark',
  component: ProductMark,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof ProductMark>;

/** A passive product mark named by its product. */
export const Default: Story = {
  args: { monogram: 'M', label: 'Mando' }
};

/** One- and two-character monograms of the EGDEV products, centered in the same tile. */
export const Monograms: Story = {
  render: () => (
    <div className='flex items-center gap-6'>
      <ProductMark monogram='M' label='Mando' />
      <ProductMark monogram='C' label='Cadencia' />
      <ProductMark monogram='L' label='egdev-live' />
      <ProductMark monogram='Cr' label='Criterio' />
      <ProductMark monogram='Mt' label='media-tool' />
      <ProductMark monogram='Q' label='Quorb' />
    </div>
  )
};

/** The mark keeps its raised Material on a raised surface. */
export const OnSurface: Story = {
  render: () => (
    <Surface padding='sm' radius='lg' className='inline-flex items-center gap-6'>
      <ProductMark monogram='M' label='Mando' />
      <ProductMark monogram='M' label='Mando home' href='#' />
    </Surface>
  )
};

/** Link mode: a native link named by its purpose; Tab shows the focus ring instead of the shadow. */
export const HomeLink: Story = {
  args: { monogram: 'M', label: 'Mando home', href: '#' }
};
