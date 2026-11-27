import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
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
 * an optional technology chip list, an optional labelled code sample and one to three footer actions.
 *
 * ## Dependencies
 * - Chip (static mode): renders each technology label as a non-interactive pill.
 * - Button and Link (consumer-supplied): the card's interactive elements live in the footer, one to three of them.
 * - Surface recipes: the raised Material frame composes `surfaceVariants` internally.
 *
 * ## Usage guidelines
 * The card is passive: it adds no tab stop and never reacts to pointer hover. The only focusable
 * elements are the one to three actions the consumer supplies inside `ProjectCardFooter`. At most one card
 * per view should use `variant="featured"`, which adds only the brand edge, halo and index ink.
 * `size="sm"` reduces density but never hides supplied content; omit `ProjectCardCode` instead.
 * `className` supports outer layout only (grid placement, margin, width), not internal appearance.
 * Keep the cap of three and give each action an accessible name that is unique within the card, adding the
 * project name when the same wording repeats across a listing: the card enforces neither, adds no whole-card
 * link and never nests controls.
 *
 * `statusBadge` takes one consumer-supplied, non-interactive Badge composition, typically a short status
 * such as a warning "testing" Badge with an alert icon. It sits in a header row at the inline end, after the
 * index and eyebrow and before the heading. The card owns no status word, tone or icon, never inspects the
 * node and announces nothing: the consumer supplies short localized text and any announcement of changes.
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

/** A footer with one action; the card itself adds no tab stop. */
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

/**
 * The footer holds one to three supplied Button or Link actions in importance order and wraps in a narrow card.
 * The card adds no tab stop; the cap of three and unique accessible names within the card are the consumer's to keep.
 */
export const WithActions: Story = {
  args: {
    title: 'Pulso',
    eyebrow: 'Open source',
    children: (
      <>
        <p>An autonomous agent workspace that watches your repositories and reports what changed.</p>
        <ProjectCardFooter>
          <Link href='#pulso' variant='quiet'>
            Details
          </Link>
          <Link href='#pulso-source' variant='quiet'>
            GitHub
          </Link>
          <Button size='sm' variant='neutral' onClick={action('Open demo')}>
            Demo
          </Button>
        </ProjectCardFooter>
      </>
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

/** The consumer-supplied warning "testing" Badge with an alert icon, shared by the status stories. */
const testing = (
  <Badge tone='warning' icon={<Icon name='alert' />}>
    testing
  </Badge>
);

/** The Lab experiment card: index and eyebrow at the start of the header row, the warning status at the end. */
export const WithStatus: Story = {
  args: {
    title: 'OpenDesign × Gentle AI',
    index: '014',
    eyebrow: 'Experiment',
    statusBadge: testing,
    children: <p>Designing interfaces directly from agents.</p>
  }
};

/** The header row with a status only, an eyebrow only, an index only and both, at the compact density. */
export const StatusPlacements: Story = {
  render: () => (
    <div className='grid max-w-3xl grid-cols-2 items-start gap-6'>
      <ProjectCard size='sm' title='Status only' statusBadge={testing}>
        <p>The row holds only the status, at the inline end.</p>
      </ProjectCard>
      <ProjectCard size='sm' title='Eyebrow and status' eyebrow='Experiment' statusBadge={testing}>
        <p>The lead holds only the eyebrow.</p>
      </ProjectCard>
      <ProjectCard size='sm' title='Index and status' index='014' statusBadge={testing}>
        <p>The lead holds only the index.</p>
      </ProjectCard>
      <ProjectCard size='sm' title='Index, eyebrow and status' index='014' eyebrow='Experiment' statusBadge={testing}>
        <p>The index stays above the eyebrow.</p>
      </ProjectCard>
    </div>
  )
};

/** The status over a backdrop and mark; a solid Badge is the consumer's legibility choice over the scrim. */
export const StatusOverBackdrop: Story = {
  render: () => (
    <ProjectCard
      title='OpenDesign × Gentle AI'
      index='014'
      eyebrow='Experiment'
      statusBadge={
        <Badge tone='warning' variant='solid' icon={<Icon name='alert' />}>
          testing
        </Badge>
      }
    >
      <ProjectCardBackdrop>
        <img src='/brand/egdev-logo-with-name.png' alt='' />
      </ProjectCardBackdrop>
      <ProjectCardMark>
        <img src='/brand/egdev-logo.png' alt='EGDEV' className='h-12 w-auto' />
      </ProjectCardMark>
      <p>The header row sits over the backdrop and its single scrim.</p>
    </ProjectCard>
  )
};

/** In a narrow host the row wraps: the status drops to its own line at the inline end, never truncated. */
export const StatusInNarrowCard: Story = {
  render: () => (
    <div className='w-72'>
      <ProjectCard
        title='A very long experiment title that must wrap across several lines inside a narrow card'
        index='014'
        eyebrow='Experiment in early testing'
        statusBadge={testing}
      >
        <p>The lead and the status share a wrapping row; nothing is clamped or clipped by the card.</p>
      </ProjectCard>
    </div>
  )
};
