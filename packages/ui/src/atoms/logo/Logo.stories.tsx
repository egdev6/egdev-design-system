import type { Meta, StoryObj } from '@storybook/react-vite';
import { Logo } from './Logo';

/**
 * ## Description
 * The egdev brand logo: the isometric isotype (`mark`) or the isotype with the white name
 * (`wordmark`), 28, 32 or 36px high. Use ProductMark for other apps and Isotipo3D for large artwork.
 *
 * ## Dependencies
 * No Radix primitive applies: the root is a named image (`span` with `role="img"`) or a native
 * link. The V4 artwork ships as inline SVG data painted with the `--logo-red` and
 * `--logo-red-shade` tokens and white; no stylesheet or asset URL is required.
 *
 * ## Usage guidelines
 * Place the wordmark only on the canvas or surface backgrounds: its name is white by design.
 * Never recolor the artwork. Pass `href` for a home link and name it, for example
 * `label="egdev, home"`. For client-router navigation, wrap an unlinked Logo in the router link.
 * className supports root margin and alignment only, not artwork overrides.
 */
const meta: Meta<typeof Logo> = {
  title: 'Atoms/Logo',
  component: Logo,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof Logo>;

/** Wordmark image named "egdev", 32px high. */
export const Default: Story = {};

/** The isotype alone, with its light and shade red faces. */
export const Mark: Story = {
  args: { variant: 'mark' }
};

/** The isotype with the white name, for the TopBar and Footer on canvas or surface. */
export const Wordmark: Story = {
  args: { variant: 'wordmark' }
};

/** Height presets per variant: sm 28px, md 32px (default) and lg 36px; width follows the ratio. */
export const Sizes: Story = {
  render: () => (
    <div className='flex flex-col gap-6'>
      <div className='flex items-end gap-8'>
        <Logo size='sm' />
        <Logo />
        <Logo size='lg' />
      </div>
      <div className='flex items-end gap-8'>
        <Logo variant='mark' size='sm' />
        <Logo variant='mark' />
        <Logo variant='mark' size='lg' />
      </div>
    </div>
  )
};

/** A home link named "egdev, home": Tab shows the focus ring on the small radius. */
export const HomeLink: Story = {
  args: { href: '#home', label: 'egdev, home' }
};
