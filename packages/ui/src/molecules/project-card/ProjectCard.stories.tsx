import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from '../../atoms/link';
import {
  ProjectCard,
  ProjectCardBackdrop,
  ProjectCardCode,
  ProjectCardFooter,
  ProjectCardMark,
  ProjectCardTags
} from './ProjectCard';

/**
 * ## Description
 * A passive project card for presenting open-source projects, tools and experiments in web views.
 * It carries an optional decorative index, an optional eyebrow, a generated heading, free body copy,
 * an optional technology chip list, an optional labelled code sample and one footer action.
 *
 * ## Dependencies
 * - Chip (static mode): renders each technology label as a non-interactive pill.
 * - Link (consumer-supplied): the card's single interactive element lives in the footer.
 * - Surface recipes: the raised Material frame composes `surfaceVariants` internally.
 *
 * ## Usage guidelines
 * The card is passive: it adds no tab stop and never reacts to pointer hover. The only focusable
 * element is the one action the consumer supplies inside `ProjectCardFooter`. At most one card per
 * view should use `variant="featured"`, which adds only the brand edge, halo and index ink.
 * `size="sm"` reduces density but never hides supplied content; omit `ProjectCardCode` instead.
 * `className` supports outer layout only (grid placement, margin, width), not internal appearance.
 */
const meta: Meta<typeof ProjectCard> = {
  title: 'Molecules/ProjectCard',
  component: ProjectCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
};

export default meta;

type Story = StoryObj<typeof ProjectCard>;

const installLines = [
  { text: 'pnpm add @egdev/ui' },
  { text: '# requires Node 20 or newer', kind: 'comment' as const }
];

/** Uses only the required title plus body copy and the footer action, preserving every default. */
export const Default: Story = {
  args: {
    title: 'Pulso',
    children: (
      <>
        <p>An autonomous agent workspace that watches your repositories and reports what changed.</p>
        <ProjectCardFooter>
          <Link href='#pulso' variant='underlined'>
            View project
          </Link>
        </ProjectCardFooter>
      </>
    )
  }
};

/** Decorative image and non-interactive mark: the consumer supplies accessible image content. */
export const BackdropAndMark: Story = {
  render: () => (
    <ProjectCard title='Pulso' index='01' eyebrow='Open source'>
      <ProjectCardBackdrop>
        <img src='/brand/egdev-logo-with-name.png' alt='' />
      </ProjectCardBackdrop>
      <ProjectCardMark>
        <img src='/brand/egdev-logo.png' alt='EGDEV' className='h-12 w-auto' />
      </ProjectCardMark>
      <p>A project with a decorative backdrop.</p>
    </ProjectCard>
  )
};

/** A backdrop image that fails to load keeps the well, the single scrim and legible text. */
export const BrokenBackdrop: Story = {
  render: () => (
    <ProjectCard title='Pulso' index='01' eyebrow='Open source'>
      <ProjectCardBackdrop>
        <img src='/missing-backdrop.png' alt='' />
      </ProjectCardBackdrop>
      <p>The image is missing; the card stays readable.</p>
    </ProjectCard>
  )
};

/** The featured signature (brand edge, halo, index ink) beside the raised default frame. */
export const Variants: Story = {
  render: () => (
    <div className='grid max-w-3xl grid-cols-2 items-start gap-6'>
      <ProjectCard variant='featured' index='01' eyebrow='Featured' title='Pulso'>
        <p>An autonomous agent workspace that watches your repositories and reports what changed.</p>
        <ProjectCardTags items={['React', 'TypeScript']} />
        <ProjectCardCode label='Install commands' items={installLines} />
        <ProjectCardFooter>
          <Link href='#pulso' variant='underlined'>
            View project
          </Link>
        </ProjectCardFooter>
      </ProjectCard>
      <ProjectCard index='02' title='TubeMaster'>
        <p>Batch title and description tooling for long-form video libraries.</p>
        <ProjectCardTags items={['Python', 'Playwright']} />
        <ProjectCardFooter>
          <Link href='#tubemaster' variant='underlined'>
            View project
          </Link>
        </ProjectCardFooter>
      </ProjectCard>
    </div>
  )
};

/** Both densities render every supplied part; sm only shrinks the steps. */
export const Sizes: Story = {
  render: () => (
    <div className='grid max-w-3xl grid-cols-2 items-start gap-6'>
      <ProjectCard title='Regular density'>
        <ProjectCardCode label='Install commands' items={installLines} />
      </ProjectCard>
      <ProjectCard title='Compact density' size='sm'>
        <ProjectCardCode label='Install commands' items={installLines} />
      </ProjectCard>
    </div>
  )
};

/** The native heading rank changes the outline position, never the visual step. */
export const HeadingRanks: Story = {
  render: () => (
    <div className='flex max-w-xl flex-col gap-6'>
      <ProjectCard title='Section child' level={3}>
        <p>A card under a section heading.</p>
      </ProjectCard>
      <ProjectCard title='Nested group' level={4}>
        <p>A card nested one outline level deeper.</p>
      </ProjectCard>
    </div>
  )
};

/** Technology labels render as a real list of static, non-interactive chips. */
export const Tags: Story = {
  args: {
    title: 'Pulso',
    children: (
      <>
        <p>Tags stay static labels; the card exposes no tag controls.</p>
        <ProjectCardTags items={['React', 'TypeScript', 'Vitest', 'Storybook']} />
      </>
    )
  }
};

/** The labelled mono well keeps command and comment lines passive and non-focusable. */
export const Code: Story = {
  args: {
    title: 'Pulso',
    children: <ProjectCardCode label='Install commands' items={installLines} />
  }
};

/** The footer hosts exactly one action; the card itself adds no tab stop. */
export const WithLink: Story = {
  args: {
    title: 'Pulso',
    eyebrow: 'Open source',
    children: (
      <ProjectCardFooter>
        <Link href='#pulso' variant='underlined'>
          View project
        </Link>
      </ProjectCardFooter>
    )
  }
};

/** Long copy and many tags wrap at word boundaries; nothing is truncated or clamped. */
export const LongContent: Story = {
  render: () => (
    <div className='w-72'>
      <ProjectCard
        index='03'
        title='A very long project title that must wrap across several lines inside a narrow card'
      >
        <p>
          A long body paragraph describing a repository watcher, its scheduling model and how reports reach the team,
          written so every line wraps at word boundaries without ever being clamped.
        </p>
        <ProjectCardTags items={['React', 'TypeScript', 'Vitest', 'Storybook', 'Tailwind', 'Radix']} />
        <ProjectCardFooter>
          <Link href='#pulso' variant='underlined'>
            View project
          </Link>
        </ProjectCardFooter>
      </ProjectCard>
    </div>
  )
};
