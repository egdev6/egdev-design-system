import type { Meta, StoryObj } from '@storybook/react-vite';
import { useId, useRef, useState } from 'react';
import { Button } from '../../atoms/button';
import { Input } from '../../atoms/input';
import { Link } from '../../atoms/link';
import { Label } from '../../primitives/label';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import { SectionShell } from '../../templates/section-shell';
import { EmptyState } from './EmptyState';

/**
 * ## Description
 * A passive empty state for a listing, or a filter combination, that returns nothing. It tells the reader that
 * nothing matches and offers one way back, such as clearing the filters: a native heading (`title`, rank 2 to 6 and 3
 * by default), an optional plain-text `description`, an optional decorative `icon` and one recovery `actions` element,
 * centred on the host backdrop with no card, border or shadow.
 *
 * ## Dependencies
 * Icon draws the optional pictogram at its `lg` preset inside an `aria-hidden` wrapper. The action is a supplied
 * Button (including a Button `asChild` around an anchor) or Link, rendered unchanged, so it keeps its own keyboard
 * behavior and focus ring. No Radix primitive, Surface or stylesheet: the recipe is token-backed utilities.
 *
 * ## Usage guidelines
 * The state is passive. It renders no live region and never moves focus, so the host announces "no results" when it
 * wants speech (a visually hidden status mounted before the results change and updated with the count, as in
 * `FilteredListing`) and places focus on a stable target, such as the filter control or the results heading, when the
 * action removes the state. Copy and language are the consumer's: there is no built-in text. Choose the heading rank
 * from the page outline (2 to 6, never `h1`); the typography never follows the rank. Prefer a Button, or a Button
 * `asChild` around an anchor, for the action where a 44px touch target matters: a bare Link's hit area is only its
 * text line. `className` supports outer layout only (margin, placement and width constraints).
 */
const meta: Meta<typeof EmptyState> = {
  title: 'Molecules/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { title: 'No posts match these filters' }
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

/** A pictogram, a title, a short explanation and one secondary Button: the usual shape of a filtered listing. */
export const Default: Story = {
  args: {
    icon: 'search',
    description: 'Try removing a filter or searching for a different word.',
    actions: <Button variant='secondary'>Clear filters</Button>
  }
};

/** The title is the only required content; the optional parts reserve no empty space. */
export const TitleOnly: Story = { args: { title: 'Nothing published yet' } };

/** A Link works as the action. Its hit area is only its text line, so prefer a Button where touch matters. */
export const WithLinkAction: Story = {
  args: {
    title: 'Nothing published yet',
    icon: 'inbox',
    description: 'This section has no posts yet.',
    actions: <Link href='#all-posts'>Browse all posts</Link>
  }
};

/** A Button `asChild` around an anchor keeps link semantics and the touch target of a large Button. */
export const AsLinkButton: Story = {
  args: {
    title: 'Nothing published yet',
    icon: 'inbox',
    description: 'This section has no posts yet.',
    actions: (
      <Button asChild={true} variant='secondary' size='lg'>
        <a href='#all-posts'>Browse all posts</a>
      </Button>
    )
  }
};

/** The rank only sets the outline position: the typography is the same at every rank, and `h1` is never used. */
export const HeadingLevels: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      {([2, 3, 4, 5, 6] as const).map((level) => (
        <EmptyState
          key={level}
          level={level}
          title={`Heading rank ${level}`}
          description='The same typography at every rank.'
        />
      ))}
    </div>
  )
};

/** A long unbroken title and explanation wrap inside a narrow host: nothing is truncated, clipped or scrolled. */
export const LongContent: Story = {
  args: {
    title: 'InternationalWorkspaceProjectArchiveWithoutWordBreaks'.repeat(2),
    icon: 'search',
    description: 'Averyveryverylongunbrokenexplanationwithoutanyspacesthatmustwrapinsteadofoverflowing'.repeat(2),
    actions: (
      <Button variant='secondary' labelWrap={true}>
        Clear every filter currently applied to this listing
      </Button>
    )
  },
  render: (args) => (
    <div className='w-[calc(var(--space-24)*4)] max-w-full'>
      <EmptyState {...args} />
    </div>
  )
};

const posts = ['Design tokens in practice', 'Packing a design system', 'Reading measure and rhythm'];

function FilteredListingHost() {
  const inputId = useId();
  const input = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('quantum');
  const needle = query.trim().toLowerCase();
  const matches = posts.filter((post) => post.toLowerCase().includes(needle));
  const clear = () => {
    setQuery('');
    // The filter control stays mounted, so it is the stable focus target when the action removes the state.
    input.current?.focus();
  };
  return (
    <div className='flex max-w-xl flex-col gap-4'>
      <Label htmlFor={inputId}>Filter posts</Label>
      <Input id={inputId} ref={input} type='search' value={query} onChange={(event) => setQuery(event.target.value)} />
      <VisuallyHidden asChild={true}>
        <output>{matches.length === 0 ? 'No posts match this filter.' : `${matches.length} posts shown.`}</output>
      </VisuallyHidden>
      {matches.length === 0 ? (
        <EmptyState
          icon='search'
          title='No posts match this filter'
          description='Try a shorter word, or clear the filter to see every post.'
          actions={
            <Button variant='secondary' onClick={clear}>
              Clear filter
            </Button>
          }
        />
      ) : (
        <ul className='m-0 flex list-none flex-col gap-2 p-0 font-sans text-body-default text-fg-default'>
          {matches.map((post) => (
            <li key={post}>{post}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/**
 * A filtered listing whose host owns what the state does not: a visually hidden status that is mounted before the
 * results change and updated with the count, and the focus move to the filter control when the action clears the
 * filter. This documents the host boundary only and proves nothing about what a screen reader speaks.
 */
export const FilteredListing: Story = { render: () => <FilteredListingHost /> };

/** The state on the Grafito reading register, the host of a listing page. It paints nothing of its own. */
export const OnGrafitoSection: Story = {
  args: {
    icon: 'search',
    description: 'Try removing a filter or searching for a different word.',
    actions: <Button variant='secondary'>Clear filters</Button>
  },
  render: (args) => (
    <SectionShell register='grafito' aria-label='Posts'>
      <EmptyState {...args} />
    </SectionShell>
  )
};
