import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useId } from 'react';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { SectionShell } from '../../templates/section-shell';
import { Closing } from './Closing';

const actions = (
  <>
    <Button asChild={true} icon={<Icon name='arrow-right' />} iconPosition='start'>
      <a href='#explore'>Explore</a>
    </Button>
    <Button asChild={true} variant='secondary' icon={<Icon name='users' />} iconPosition='start'>
      <a href='#community'>Community</a>
    </Button>
    <Button asChild={true} variant='neutral' icon={<Icon name='github' />} iconPosition='start'>
      <a href='#source'>Source</a>
    </Button>
  </>
);
const image = <img alt='' src='/egdev-logo.png' className='block h-full w-full object-contain' />;

function SceneHost({ children }: { children: (id: string) => ReactNode }) {
  const headingId = useId();
  return (
    <SectionShell register='show' aria-labelledby={headingId}>
      {children(headingId)}
    </SectionShell>
  );
}

/** The host owns the section register, heading ID and decorative media. */
const meta = {
  title: 'Organisms/Closing',
  component: Closing,
  tags: ['autodocs'],
  args: { title: 'Keep building', level: 2, children: actions },
  decorators: [(Story, context) => <SceneHost>{(id) => <Story args={{ ...context.args, id }} />}</SceneHost>]
} satisfies Meta<typeof Closing>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Required copy and consumer actions only. */
export const Default: Story = {};
/** Optional copy extends the heading. */
export const OptionalCopy: Story = {
  args: { eyebrow: 'Next', title: 'Build ', accent: 'together', lede: 'Make something meaningful.' }
};
/** Absent media creates no fallback. */
export const NoMedia: Story = {};
/** A decorative image is supplied by the host. */
export const DecorativeMedia: Story = { args: { media: image } };
/** Long copy remains in normal flow. */
export const LongCopy: Story = {
  args: {
    title: 'A longer closing message for a changing world ',
    accent: 'built together',
    lede: 'Continue exploring ideas and making useful things with the people around you.'
  }
};
/** Three independent icon actions can wrap. */
export const ThreeActions: Story = { args: { media: image } };
/** Independent scenes use distinct heading IDs. */
export const MultipleScenes: Story = {
  render: (args) => (
    <>
      <Closing {...args} />
      <Closing {...args} id={`${args.id}-second`} title='Another scene' />
    </>
  )
};
/** Resize the canvas to inspect the responsive composition. */
export const Responsive: Story = {
  args: { eyebrow: 'Next', title: 'Build ', accent: 'together', lede: 'Keep exploring.', media: image }
};
