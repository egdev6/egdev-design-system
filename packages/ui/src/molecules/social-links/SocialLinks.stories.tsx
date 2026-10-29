import type { Meta, StoryObj } from '@storybook/react-vite';
import type { IconName } from '../../atoms/icon';
import { Icon } from '../../atoms/icon';
import { Stack } from '../../primitives/stack';
import { SocialLinks } from './SocialLinks';
import type { SocialLinkItem } from './types';

const networks: IconName[] = ['github', 'youtube', 'twitch', 'x', 'linkedin', 'instagram'];
const profiles: SocialLinkItem[] = networks.map((name) => ({
  id: name,
  href: `https://example.org/profiles/${name}`,
  label: `${name} project profile`,
  icon: <Icon name={name} />
}));

/**
 * ## Description
 * A named list of native social-profile links with an optional, independent visible caption.
 *
 * ## Dependencies
 * IconButton owns link appearance and hidden names; supplied Icon elements are decorative.
 * Stack and Cluster own stacked/wrapping layout. No extra interaction primitive is needed.
 *
 * ## Usage guidelines
 * Supply stable ids, HTTPS destinations and meaningful labels; external is explicitly opt-in
 * per entry. lg is touch-sized; md is dense desktop only. Caption omission never removes the
 * accessible list name. Root className supports outer sizing/margins/placement, not appearance.
 */
const meta: Meta<typeof SocialLinks> = {
  title: 'Molecules/SocialLinks',
  component: SocialLinks,
  tags: ['autodocs'],
  args: { items: profiles }
};
export default meta;
type Story = StoryObj<typeof SocialLinks>;

/** Required entries only: stacked caption, outline lg links, same-context navigation and gap 2. */
export const Default: Story = {};

/** Caption and list share a wrapping row, without changing DOM or keyboard order. */
export const Inline: Story = { args: { inline: true } };

/** The atom's ghost treatment with the source's tight token spacing and no caption. */
export const Ghost: Story = { args: { variant: 'ghost', caption: null, gap: 1 } };

/** Both null and blank captions remove visible copy while preserving the named list. */
export const WithoutCaption: Story = {
  args: { caption: null },
  render: (args) => (
    <Stack>
      <SocialLinks {...args} />
      <SocialLinks {...args} caption='   ' />
    </Stack>
  )
};

/** Explicit mixed targets, localized notices and custom rel tokens; hostnames never decide target. */
export const MixedTargets: Story = {
  args: {
    newTabText: '(opens in a new window)',
    items: profiles.slice(0, 3).map((profile, index) => ({
      ...profile,
      external: index !== 1,
      rel: index === 0 ? 'me nofollow NOOPENER me' : undefined
    }))
  }
};

/** Token-sized example container exercises independent inline-root and inner-list wrapping. */
export const Constrained: Story = {
  args: { inline: true },
  decorators: [
    (Story) => (
      <div style={{ width: 'var(--space-24)' }}>
        <Story />
      </div>
    )
  ]
};

/** Dense 40px desktop targets compared with default 48px touch-sized targets. */
export const Sizes: Story = {
  render: (args) => (
    <Stack>
      <SocialLinks {...args} size='md' />
      <SocialLinks {...args} size='lg' />
    </Stack>
  )
};

/** RTL changes logical direction, never data order or tab order. */
export const RTL: Story = { args: { dir: 'rtl', inline: true } };

/** Invalid destinations, blank names and later duplicate keys are skipped with development warnings. */
export const InvalidItems: Story = {
  args: {
    items: [
      ...profiles.slice(0, 2),
      { id: 'unsafe', href: 'http://example.org', label: 'Invalid destination', icon: <Icon name='x' /> },
      { id: 'github', href: 'https://example.org/duplicate', label: 'Duplicate key', icon: <Icon name='github' /> },
      { id: 'unnamed', href: 'https://example.org', label: ' ', icon: <Icon name='linkedin' /> }
    ]
  }
};
