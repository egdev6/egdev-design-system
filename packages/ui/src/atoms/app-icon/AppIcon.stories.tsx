import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../button';
import { AppIcon } from './AppIcon';

const squareArtwork =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"%3E%3Ccircle cx="32" cy="32" r="24" fill="%23e52c46"/%3E%3Cpath d="M20 32h24M32 20v24" stroke="white" stroke-width="5"/%3E%3C/svg%3E';
const wideArtwork =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 48"%3E%3Crect width="120" height="48" rx="8" fill="%23e52c46"/%3E%3Cpath d="M18 24h84" stroke="white" stroke-width="6"/%3E%3C/svg%3E';

/**
 * ## Description
 * A passive square application identity showing supplied artwork or exact initials.
 *
 * ## Dependencies
 * Radix Avatar owns image loading and fallback. The existing Surface recipe supplies Material.
 *
 * ## Usage guidelines
 * Supply one or two meaningful grapheme clusters. Add a localized label when meaningful;
 * omit it beside equivalent visible text or within a named control. Source trust belongs to the
 * consumer. Root className supports outer placement only, not size or appearance overrides.
 */
const meta = {
  title: 'Atoms/AppIcon',
  component: AppIcon,
  tags: ['autodocs'],
  args: { monogram: 'Eg' }
} satisfies Meta<typeof AppIcon>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Required initials only, preserving the decorative md default. */
export const Default: Story = {};

/** All three approved square sizes and their fallback typography. */
export const Sizes: Story = {
  render: () => (
    <div className='flex items-center gap-4'>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <AppIcon key={size} monogram='Eg' label={`Example app ${size}`} size={size} />
      ))}
    </div>
  )
};

/** Self-contained square artwork replaces the fallback when loaded. */
export const WithImage: Story = { args: { label: 'Example application', src: squareArtwork } };

/** Non-square artwork is contained and centered without cropping. */
export const NonSquareImage: Story = { args: { label: 'Wide application artwork', src: wideArtwork, size: 'lg' } };

/** An absent image source presents the exact supplied initials immediately. */
export const MissingImage: Story = { args: { monogram: 'AB', label: 'Application without artwork' } };

/** Invalid image bytes leave the immediate monogram fallback visible. */
export const BrokenImage: Story = {
  args: { monogram: 'AB', label: 'Application with unavailable artwork', src: 'data:image/png,invalid' }
};

/** Meaningful standalone identity exposes one accessible image name. */
export const Named: Story = { args: { label: 'Example application' } };

/** Adjacent text supplies the name, so the icon remains decorative. */
export const Decorative: Story = {
  render: () => (
    <div className='flex items-center gap-2'>
      <AppIcon monogram='Eg' />
      <span>Example application</span>
    </div>
  )
};

/** The surrounding named button owns focus and activation, not the decorative icon. */
export const InButton: Story = {
  render: () => (
    <Button>
      <AppIcon monogram='Eg' size='sm' />
      Open application
    </Button>
  )
};
