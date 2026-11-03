import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useId } from 'react';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Surface } from '../../primitives/surface';
import { Heading, Text } from '../../primitives/text';
import { SectionShell } from '../../templates/section-shell';
import { LabStage } from './LabStage';

const experiment = (
  <Surface asChild={true}>
    <article>
      <Badge>In progress</Badge>
      <Heading level={3}>An experiment</Heading>
      <Text>Exploring a new idea.</Text>
      <Button asChild={true} size='lg' variant='secondary'>
        <a href='#experiment'>Explore the experiment</a>
      </Button>
    </article>
  </Surface>
);
const image = <img src='/brand/egdev-logo.png' alt='' className='block h-full w-full object-contain' />;
function SceneHost({ children }: { children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <SectionShell register='show' aria-labelledby={id}>
      {children(id)}
    </SectionShell>
  );
}
/** The host owns the section name and the consumer owns the experiment and media. */
const meta = {
  title: 'Organisms/LabStage',
  component: LabStage,
  tags: ['autodocs'],
  args: { title: 'Explore the lab', level: 2 },
  decorators: [(Story, context) => <SceneHost>{(id) => <Story args={{ ...context.args, id }} />}</SceneHost>]
} satisfies Meta<typeof LabStage>;
export default meta;
type Story = StoryObj<typeof meta>;
/** Required heading only. */
export const Default: Story = {};
/** Optional heading context and introduction. */
export const OptionalCopy: Story = {
  args: { eyebrow: 'Ideas', title: 'Explore ', accent: 'the lab', lede: 'Discover works in progress.' }
};
/** Consumer-composed experiment content. */
export const Experiment: Story = { args: { children: experiment } };
/** No media track or fallback is generated. */
export const NoMedia: Story = { args: { children: experiment } };
/** False media is treated as absent. */
export const EmptyMedia: Story = { args: { children: experiment, media: false } };
/** Consumer-owned decorative image. */
export const DecorativeMedia: Story = { args: { children: experiment, media: image } };
/** Long copy remains in normal flow. */
export const LongCopy: Story = {
  args: {
    title: 'A longer exploration of new ideas ',
    accent: 'and experiments',
    lede: 'This introduction describes ongoing work and provides context for the experiment below.',
    children: experiment,
    media: image
  }
};
/** Multiple scenes retain distinct heading IDs. */
export const MultipleScenes: Story = {
  render: (args) => (
    <>
      <LabStage {...args} />
      <LabStage {...args} id={`${args.id}-second`} title='Another experiment' />
    </>
  )
};
/** Resize the canvas to inspect the responsive composition. */
export const Responsive: Story = {
  args: {
    eyebrow: 'Ideas',
    title: 'Explore ',
    accent: 'the lab',
    lede: 'Discover works in progress.',
    children: experiment,
    media: image
  }
};
