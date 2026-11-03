import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { SocialLinks } from '../../molecules/social-links';
import { SectionShell } from '../../templates/section-shell';
import { Hero } from './Hero';

/** A passive scene hosted in a named show section. */
const meta = {
  title: 'Organisms/Hero',
  component: Hero,
  tags: ['autodocs'],
  args: { title: 'Build together', level: 1 },
  decorators: [
    (Story) => (
      <SectionShell register='show' wrap={true} aria-label='Introduction'>
        <Story />
      </SectionShell>
    )
  ]
} satisfies Meta<typeof Hero>;
export default meta;
type Story = StoryObj<typeof meta>;
const media = <img src='/brand/egdev-logo.png' alt='' className='block h-full w-full object-contain' />;
const social = (
  <SocialLinks
    size='lg'
    label='Project profiles'
    caption='Follow the project'
    items={[
      { id: 'github', href: 'https://example.org/profile', label: 'Project profile', icon: <Icon name='github' /> }
    ]}
  />
);
/** Required props only. */
export const Default: Story = {};
/** Consumer-supplied copy, actions, profiles and decorative media. */
export const FullScene: Story = {
  args: {
    eyebrow: 'Introduction',
    title: 'Build ',
    accent: 'together',
    lede: 'Make meaningful things.',
    media,
    social,
    children: (
      <>
        <Button size='lg'>Explore</Button>
        <Button size='lg' variant='secondary'>
          Learn more
        </Button>
      </>
    )
  }
};
/** Copy fills the available width without media. */
export const NoMedia: Story = { args: { lede: 'A scene without media.' } };
/** Decorative consumer image and no actions. */
export const MediaOnlyDecoration: Story = { args: { media } };
/** One independent action. */
export const OneAction: Story = { args: { children: <Button size='lg'>Explore</Button> } };
/** Two distinct independent actions. */
export const TwoActions: Story = {
  args: {
    children: (
      <>
        <Button size='lg'>Explore</Button>
        <Button size='lg' variant='secondary'>
          Learn more
        </Button>
      </>
    )
  }
};
/** Long copy exercises responsive wrapping. */
export const LongLocalizedContent: Story = {
  args: {
    title: 'A longer introduction for a multilingual and collaborative project',
    lede: 'Long descriptions remain in normal document flow and adapt to the available space.',
    media
  }
};
/** Multiple host sections use unique heading identifiers. */
export const MultipleSections: Story = {
  render: () => (
    <>
      <SectionShell register='show' wrap={true} aria-labelledby='scene-one'>
        <Hero id='scene-one' title='First scene' level={2} />
      </SectionShell>
      <SectionShell register='show' wrap={true} aria-labelledby='scene-two'>
        <Hero id='scene-two' title='Second scene' level={2} />
      </SectionShell>
    </>
  )
};
/** Resize the canvas to inspect the scene at both local boundaries. */
export const Responsive: Story = {
  args: { media, lede: 'Resize to inspect the layout.', children: <Button size='lg'>Explore</Button> }
};
