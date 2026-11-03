import type { Meta, StoryObj } from '@storybook/react-vite';
import { type ReactNode, useId } from 'react';
import { SectionShell } from '../../templates/section-shell';
import { ChapterBreak } from './ChapterBreak';

const image = <img src='/brand/egdev-logo.png' alt='' className='block h-full w-full object-contain' />;

function SceneHost({ children }: { children: (id: string) => ReactNode }) {
  const id = useId();
  return (
    <SectionShell register='show' aria-labelledby={id}>
      {children(id)}
    </SectionShell>
  );
}

/** The host owns the section name, heading ID and decorative media. */
const meta = {
  title: 'Organisms/ChapterBreak',
  component: ChapterBreak,
  tags: ['autodocs'],
  args: { title: 'A new chapter', level: 2 },
  decorators: [(Story, context) => <SceneHost>{(id) => <Story args={{ ...context.args, id }} />}</SceneHost>]
} satisfies Meta<typeof ChapterBreak>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Required copy only. */
export const Default: Story = {};
/** Optional copy extends the heading. */
export const OptionalCopy: Story = {
  args: { eyebrow: 'Chapter', title: 'Explore ', accent: 'together', lede: 'Discover a new perspective.' }
};
/** No media means no fallback or empty track. */
export const NoMedia: Story = {};
/** The host supplies decorative media. */
export const DecorativeMedia: Story = { args: { media: image } };
/** Longer translated copy stays in normal flow. */
export const LongLocalizedContent: Story = {
  args: {
    title: 'A longer chapter for people building a more thoughtful world ',
    accent: 'together',
    lede: 'Explore new ideas and make space for different perspectives as the story continues.'
  }
};
/** Independent sections receive unique heading IDs. */
export const MultipleSections: Story = {
  render: (args) => (
    <>
      <ChapterBreak {...args} />
      <SceneHost>{(id) => <ChapterBreak {...args} id={id} title='Another chapter' />}</SceneHost>
    </>
  )
};
/** Resize the canvas to inspect the responsive layout. */
export const Responsive: Story = {
  args: { eyebrow: 'Chapter', title: 'Explore ', accent: 'together', lede: 'Discover a new perspective.', media: image }
};
