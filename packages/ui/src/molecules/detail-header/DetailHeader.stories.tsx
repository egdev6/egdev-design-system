import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '../../primitives/stack';
import { DetailHeader } from './DetailHeader';

/**
 * ## Description
 * The opening block of a detail page: the page heading with its metadata. `title` is the page heading, with an
 * optional `eyebrow` before it (typically the kind of content) and an optional `lede` after it. Below that block come
 * three optional lists in a fixed reading order: `metadata` facts such as the date, the source or the place; `tags`,
 * short non-interactive pills; and `links`, external destinations such as the canonical page, a repository, a demo or
 * the online event. The component paints no surface of its own, so it sits on the host background.
 *
 * ## Dependencies
 * It composes the exported SectionHeader for the heading block, Chip (`static` mode) for each tag and Link (`external`,
 * so every link opens in a new tab with a hidden notice) for each destination. The facts are a native description
 * list (`dl`, `dt`, `dd`, with `time` for a date). There is no Radix primitive, Surface or stylesheet of its own: the
 * layout is token-backed utilities.
 *
 * ## Usage guidelines
 * Render it inside `main` or `article` (the stories do), because SectionHeader renders a native `header`, which is
 * exposed as a banner landmark only outside sectioning content. Supply exactly one page-level heading per page: the
 * default `level` is 1. The host owns the text: it formats dates and values in the page language, passes `messages`
 * and `newTabText` on localized pages (the two list names and the new-tab notice are English by default), and bounds
 * how many entries it supplies. A blank or invalid entry is skipped with a development warning, a list with no valid
 * entry is not rendered, and a blank title renders nothing. Links must be absolute `https:` URLs. Values and labels
 * wrap and are never truncated. Only the root takes `className`, for outer margins, width constraints and placement;
 * no part is customizable.
 */
const meta: Meta<typeof DetailHeader> = {
  title: 'Molecules/DetailHeader',
  component: DetailHeader,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <article>
        <Story />
      </article>
    )
  ]
};
export default meta;
type Story = StoryObj<typeof DetailHeader>;

/** An editorial post with every part: eyebrow, title, lede, a dated fact, a source fact, three tags and one link. */
export const Default: Story = {
  args: {
    eyebrow: 'Article',
    title: 'Designing a calm reading page',
    lede: 'How a quiet header, a measured column and honest metadata make a long read easier to start.',
    metadata: [
      { label: 'Published', value: 'November 26, 2026', dateTime: '2026-11-26' },
      { label: 'Source', value: 'example.com' }
    ],
    tags: ['Design', 'Systems', 'Accessibility'],
    links: [{ label: 'Canonical article', href: 'https://example.com/articles/calm-reading-page' }]
  }
};

/** An event: date and place facts, tags, an event page link and a recording link. */
export const Event: Story = {
  args: {
    eyebrow: 'Event',
    title: 'Open source design systems meetup',
    lede: 'An evening of short talks about tokens, components and the people who maintain them.',
    metadata: [
      { label: 'Date', value: 'December 12, 2026, 18:30', dateTime: '2026-12-12T18:30' },
      { label: 'Location', value: 'Example Hall, 12 Sample Street, Exampleville' },
      { label: 'Format', value: 'In person and online' }
    ],
    tags: ['Meetup', 'Design systems', 'Community'],
    links: [
      { label: 'Event page', href: 'https://example.com/events/design-systems-meetup' },
      { label: 'Recording', href: 'https://example.org/recordings/design-systems-meetup' }
    ]
  }
};

/** A project: status, stack and last update as facts, with a repository link and a live demo link. */
export const Project: Story = {
  args: {
    eyebrow: 'Project',
    title: 'Tokenizer',
    lede: 'A small command line tool that turns design tokens into CSS custom properties.',
    metadata: [
      { label: 'Status', value: 'Active' },
      { label: 'Stack', value: 'TypeScript, Node.js' },
      { label: 'Updated', value: 'November 2026', dateTime: '2026-11' }
    ],
    tags: ['CLI', 'Tokens'],
    links: [
      { label: 'Repository', href: 'https://example.com/projects/tokenizer' },
      { label: 'Live demo', href: 'https://example.org/tokenizer/demo' }
    ]
  }
};

/** A short note: facts and tags with no links, so the links list is not rendered. */
export const Note: Story = {
  args: {
    eyebrow: 'Note',
    title: 'Why the grid stays at eight pixels',
    metadata: [
      { label: 'Published', value: 'November 20, 2026', dateTime: '2026-11-20' },
      { label: 'Reading time', value: '3 minutes' }
    ],
    tags: ['Layout', 'Spacing']
  }
};

/** The title is the only required content: the optional parts reserve no empty space. */
export const TitleOnly: Story = { args: { title: 'Release notes' } };

/** All six native heading ranks keep the same section-scale typography; the default rank is 1. */
export const Levels: Story = {
  args: { title: 'Document hierarchy' },
  render: (args) => (
    <Stack gap={8}>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <DetailHeader key={level} {...args} level={level} />
      ))}
    </Stack>
  )
};

/**
 * A localized page: `messages` renames the tags and links lists and `newTabText` replaces the new-tab notice that is
 * appended to every link name, here with other English wording. The eyebrow and title are language-tagged runs: each
 * run keeps its own `lang`, and the decorative separator is hidden from assistive technology.
 */
export const Localized: Story = {
  args: {
    eyebrow: [['Localized page', 'en']],
    title: [
      ['Release notes ', 'en'],
      ['/ ', undefined, true],
      ['changelog', 'en']
    ],
    lede: [['The two list names and the new-tab notice come from the host.', 'en']],
    metadata: [{ label: 'Published', value: 'November 26, 2026', dateTime: '2026-11-26' }],
    tags: ['Release', 'Changelog'],
    links: [
      { label: 'Release page', href: 'https://example.com/releases/1-2' },
      { label: 'Download', href: 'https://example.org/downloads/1-2' }
    ],
    messages: { tags: 'Topics', links: 'Related pages' },
    newTabText: '(opens in a new window)'
  }
};

/**
 * A long multi-word title, an unbroken checksum value, a long link label, an unbroken link label and many tags: every
 * part wraps and nothing is truncated or clipped. Narrow the viewport to see the facts, the tags and the links reflow.
 */
export const LongContent: Story = {
  args: {
    eyebrow: 'A long context line that wraps when the viewport is narrow',
    title:
      'A deliberately long page title made of many ordinary words so that it has to wrap onto several lines without being cut',
    lede: 'A long introductory paragraph keeps going for a while, so that it also wraps naturally inside its own column and never hides a single word of the copy, however narrow the page becomes or however far the reader zooms in.',
    metadata: [
      { label: 'Checksum', value: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08' },
      {
        label: 'A long fact label that has to wrap',
        value: 'Example Hall, 12 Sample Street, Exampleville, Sampleland'
      },
      { label: 'Published', value: 'November 26, 2026', dateTime: '2026-11-26' }
    ],
    tags: [
      'Design systems',
      'Accessibility',
      'Tokens',
      'Components',
      'Documentation',
      'Open source',
      'Typography',
      'Layout',
      'Spacing',
      'Color'
    ],
    links: [
      {
        label: 'A long link label that describes its destination in several words and wraps inside its own item',
        href: 'https://example.com/a/long/path/that/is/never/shown'
      },
      { label: 'Repository', href: 'https://example.org/repository' },
      {
        label: 'ReleaseBundleIdentifier0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
        href: 'https://example.com/releases/bundle'
      }
    ]
  }
};
