/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import diagnostic from '../../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url';
import { SectionShell } from '../../templates/section-shell';
import { Cluster, Stack } from '../stack';
import { Surface } from '../surface';
import { Text } from '../text';
import { Prose } from './Prose';

/**
 * ## Description
 * A passive reading column for long-form content. It renders one `div` that gives bare semantic children a
 * readable, token-backed presentation with a built-in reading measure of 65 characters (`--container-prose`) and a
 * 16px body step. Supported children are `h2` to `h4`, `p`, `ul`, `ol`, `li`, `a`, `strong`, `blockquote`, `pre`,
 * inline `code`, `img`, `figure`, `figcaption`, a simple `table` (`th`, `td`) and `hr`. Everything else renders with
 * browser defaults, relative to the root's body step.
 *
 * ## Dependencies
 * None beyond React. It is static: no interactive primitive, no state and no events. Its recipes echo the token roles
 * of Text, Heading, Link, PullQuote, Table and the Surface well without importing them.
 *
 * ## Usage guidelines
 * Prose takes React children only. It never parses, converts or sanitizes content and accepts no HTML string: the
 * app converts its rich text to elements, or renders an HTML string it has already sanitized through its own element
 * inside Prose, which keeps every rule except the trimming of the outer margins. The converter also owns the heading
 * levels (the page title is the `h1`, Prose styles `h2` to `h4` and leaves `h1`, `h5` and `h6` to browser defaults),
 * `alt` text, table header cells, the `lang` attribute, link `target` and `rel`, a scroll region for tables wider
 * than the column, and font loading including an italic face. A host that needs a landmark wraps Prose in its own
 * `article` or `section`.
 *
 * Do not nest `PullQuote`, `Table`, `PhotoFrame` or any other component that owns a recipe inside Prose: its
 * descendant rules override those components' own utilities. `pre` scrolls inside the root, while a table wider than
 * the column overflows it. Body colour is inherited from the host. Links and inline code use the neon brand colours,
 * which are below 4.5:1 on `surface-1` to `surface-3`: the owner retained that trade-off, and links keep an underline
 * as their non-colour cue. `className` supports outer layout only (margins such as `mx-auto`, self-alignment, flex or
 * grid placement); width constraints are unsupported.
 */
const meta: Meta<typeof Prose> = {
  title: 'Primitives/Prose',
  component: Prose,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Prose>;

const article: ReactNode = (
  <>
    <h2>Why a reading column matters</h2>
    <p>
      Long-form pages are read, not scanned. A line of about sixty-five characters keeps the eye on its path from one
      line to the next, so <a href='#measure'>the measure</a> is part of the design rather than a side effect of the
      page width. Headings, lists and quotations only help when they stay out of the way.
    </p>
    <p>
      The column has <strong>three jobs</strong>: set the line length, give every element a rhythm of its own and keep
      the supplied markup untouched, so assistive technology reads exactly what the author wrote.
    </p>
    <ul>
      <li>A heading outline the page can navigate</li>
      <li>Paragraphs that breathe at the reading size</li>
      <li>Links that stay underlined at rest</li>
    </ul>
  </>
);

const elements: ReactNode = (
  <>
    <h2>Section title</h2>
    <p>
      A paragraph with <a href='#links'>an underlined link</a>, <strong>bold words</strong> and <code>inline code</code>{' '}
      in the brand colour. The link loses its underline on hover and shows the shared focus ring from the keyboard.
    </p>
    <h3>Subsection title</h3>
    <ul>
      <li>A bulleted item</li>
      <li>A second bulleted item</li>
    </ul>
    <h4>Minor title</h4>
    <ol>
      <li>A numbered step</li>
      <li>A second numbered step</li>
    </ol>
    <blockquote>
      <p>A quotation takes a brand rule at its start and a secondary text colour.</p>
    </blockquote>
    <pre>
      <code>{'const measure = "65ch";\nconst size = "md";'}</code>
    </pre>
    <figure>
      <img src={diagnostic} alt='Square crop diagnostic grid with four numbered quadrants and a central crosshair' />
      <figcaption>A captioned image keeps its source line in the muted colour.</figcaption>
    </figure>
    <table>
      <thead>
        <tr>
          <th scope='col'>Element</th>
          <th scope='col'>Treatment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Table header</td>
          <td>A raised band with a hairline rule</td>
        </tr>
        <tr>
          <td>Thematic break</td>
          <td>A white hairline, never brand red</td>
        </tr>
      </tbody>
    </table>
    <hr />
    <p>The last paragraph loses its bottom margin, so the column adds no space below its own content.</p>
  </>
);

const overflow: ReactNode = (
  <>
    <p>
      A long unbroken address wraps inside the column instead of widening it:{' '}
      <a href='#overflow'>https://example.com/a/very/long/address/that/has/no/natural/break/points/at/all</a>
    </p>
    <pre>
      <code>{'const greeting = "A single code line that is much longer than the reading column can hold";'}</code>
    </pre>
    <table>
      <thead>
        <tr>
          <th scope='col'>Identifier</th>
          <th scope='col'>Checksum</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>reading-column</td>
          <td>9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</td>
        </tr>
      </tbody>
    </table>
    <p>The code block scrolls inside the root, while the table is wider than the column and overflows it.</p>
  </>
);

/** An article sample on the Grafito register, the host a detail page uses, centred with `className="mx-auto"`. */
export const Default: Story = {
  args: { children: article },
  render: (args) => (
    <SectionShell register='grafito' aria-label='Article'>
      <Prose {...args} className='mx-auto' />
    </SectionShell>
  )
};

/**
 * Every supported element at the default width: three heading levels, links, bold text, bulleted and numbered
 * lists, a quotation, inline code, a code block, a captioned image, a simple table and a thematic break.
 */
export const Elements: Story = { args: { children: elements } };

/** `md` is the 16px reading size and the default; `sm` is the compact 12.8px step and shortens the measure with it. */
export const Sizes: Story = {
  args: { children: article },
  render: (args) => (
    <Cluster gap={8} alignItems='start'>
      <Stack gap={2}>
        <Text variant='eyebrow'>md (default)</Text>
        <Prose {...args} size='md' />
      </Stack>
      <Stack gap={2}>
        <Text variant='eyebrow'>sm</Text>
        <Prose {...args} size='sm' />
      </Stack>
    </Cluster>
  )
};

/** `tone="raised"` selects the raised brand colour of inline code on `surface-1` to `surface-3` hosts. */
export const RaisedTone: Story = {
  args: { size: 'sm', tone: 'raised', children: elements },
  render: (args) => (
    <Surface tone='surface-1' padding='md' radius='lg'>
      <Prose {...args} />
    </Surface>
  )
};

/**
 * Narrow-column overflow policy: long words and addresses wrap, a code block scrolls inside the root and a table
 * wider than the column overflows it. The converter wraps wide tables in its own scroll region or uses `Table`.
 */
export const Overflow: Story = {
  args: { children: overflow },
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*4)]'>
      <Prose {...args} />
    </div>
  )
};
