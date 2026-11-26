/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import cover from '../../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url';
import { Button } from '../../atoms/button';
import { Stack } from '../../primitives/stack';
import { Surface } from '../../primitives/surface';
import { Text } from '../../primitives/text';
import { TipCard } from '../tip-card';
import { Carousel } from './Carousel';
import type { CarouselItem, CarouselProps } from './types';

const items: [CarouselItem, CarouselItem, CarouselItem] = [
  {
    value: 'read',
    label: 'Read the context',
    children: (
      <Surface padding='lg'>
        <Text>Start with the shared context before making a change.</Text>
      </Surface>
    )
  },
  {
    value: 'test',
    label: 'Test the behavior',
    children: (
      <Surface padding='lg'>
        <Text>Describe the observable behavior with a focused test.</Text>
      </Surface>
    )
  },
  {
    value: 'review',
    label: 'Review the result',
    children: (
      <Surface padding='lg'>
        <Text>Check the result and explain any remaining limitations.</Text>
      </Surface>
    )
  }
];

const tips: [CarouselItem, CarouselItem, CarouselItem] = [
  {
    value: 'context',
    label: 'Share the context first',
    children: (
      <TipCard title='Share the context first' badge='Tip' src={cover} alt='Diagnostic grid cover of the context tip' />
    )
  },
  {
    value: 'test',
    label: 'Describe the behavior with a test',
    children: (
      <TipCard
        title='Describe the behavior with a test'
        badge='Tip'
        src={cover}
        alt='Diagnostic grid cover of the testing tip'
      />
    )
  },
  {
    value: 'review',
    label: 'Review before you ship',
    children: (
      <TipCard title='Review before you ship' badge='Tip' src={cover} alt='Diagnostic grid cover of the review tip' />
    )
  }
];

/**
 * ## Description
 * A manually navigated read-only slide collection with bounded controls, native scrolling and roving focus.
 *
 * ## Dependencies
 * IconButton and Icon provide navigation controls with 38.4px visible boxes and extended targets under default tokens;
 * ProgressBar shows decorative position.
 * VisuallyHidden supplies instructions and status. Slide content, such as Surface or TipCard, is consumer content:
 * Carousel paints nothing by default.
 *
 * ## Usage guidelines
 * Slides must not contain links, controls, tab stops or autoplay. Arrow keys work on the slide group itself;
 * Home/End reach the boundaries. Text selection is preserved; media/background supports mouse dragging.
 * Controlled requests commit only when accepted. Never drive periodic value changes to simulate autoplay.
 * Full-width tracks hide the scrollbar visually while retaining native scrolling; fit content inside each slide.
 * The control row uses 9.6px default-token spacing to separate the expanded navigation targets.
 * Root className supports only width, margins and layout placement. No stylesheet or part override API.
 *
 * ## Current-slide emphasis
 * `variant='current-emphasis'` is an opt-in. Carousel then paints only the current slide's transparent frame: a brand
 * border and glow keyed off `aria-current`, while neighbours keep their own paint. The frame reserves a transparent
 * border on every slide and adds token padding around the track for the glow, so slide geometry changes only when
 * opted in. It applies to the default track; with `trackLayout='full-width'` it resolves to `default`. The frame
 * follows the slide box, not its content: slide content should fill the slide with corners at or below `--radius-xl`.
 * The emphasis is decorative redundancy, because the current slide is also stated in its accessible name,
 * `aria-current`, the visible counter and the progress bar. It moves with the accepted slide, not frame by frame while
 * scrolling, and shows against neighbours while the track moves.
 */
const meta: Meta<typeof Carousel> = {
  title: 'Molecules/Carousel',
  component: Carousel,
  tags: ['autodocs'],
  args: { label: 'Working together', items }
};
export default meta;
type Story = StoryObj<typeof Carousel>;

/** Required inputs only: first item, one tab stop, all read-only content mounted. */
export const Default: Story = {};

/** Edge-to-edge slides retain native scrolling and a visible inset focus indicator. */
export const FullWidth: Story = { args: { trackLayout: 'full-width' } };

/** The full-width track remains navigable in a narrow, token-sized host. */
export const FullWidthNarrow: Story = {
  args: { trackLayout: 'full-width' },
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*3)]'>
      <Carousel {...args} />
    </div>
  )
};

/** The current slide shows a brand border and glow; its neighbours keep their default paint. */
export const CurrentEmphasis: Story = { args: { variant: 'current-emphasis', defaultValue: 'test' } };

/** TipCard slides in a poster-wide host: the frame hugs the card, with the second slide current. */
export const CurrentEmphasisTipCards: Story = {
  args: { variant: 'current-emphasis', items: tips, defaultValue: 'test' },
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*4)]'>
      <Carousel {...args} />
    </div>
  )
};

/** With the full-width track the variant resolves to default, so this renders exactly as FullWidth. */
export const CurrentEmphasisFullWidth: Story = {
  args: { variant: 'current-emphasis', trackLayout: 'full-width' }
};

/** A one-item collection retains its readable slide while both controls are disabled. */
export const SingleItem: Story = { args: { items: items.slice(0, 1) } };

/** Zero items retain the name, empty message, zero counter and disabled controls. */
export const Empty: Story = { args: { items: [] } };

/** Invalid identities render the same safe empty state and warn during development. */
export const InvalidItems: Story = { args: { items: [items[0], items[0]] } };

/** Start at the final boundary; the next control is disabled, and Home returns to the first slide. */
export const Boundaries: Story = { args: { defaultValue: 'review' } };

/** Native inherited direction reverses horizontal keys and arrow icons, not data order. */
export const RTL: Story = { args: { dir: 'rtl' } };

/** Each message key is independently localizable; the formatter receives one-based positions. */
export const Localized: Story = {
  args: {
    messages: {
      previousSlide: 'Previous card',
      nextSlide: 'Next card',
      carousel: 'card collection',
      slide: 'card',
      instructions: 'Use the horizontal arrow keys to navigate cards. Home and End reach the boundaries.',
      empty: 'No cards available',
      position: (current, total, name) => `${name}, card ${current} of ${total}`
    }
  }
};

function ControlledExample(props: CarouselProps) {
  const [value, setValue] = useState('read');
  return (
    <Carousel
      {...props}
      value={value}
      onValueChange={(next) => {
        props.onValueChange?.(next);
        setValue(next);
      }}
    />
  );
}

/** The owner accepts each identity request; actions record only user requests, never acknowledgements. */
export const Controlled: Story = {
  args: { onValueChange: action('onValueChange') },
  render: (args) => <ControlledExample {...args} />
};

function DynamicExample(props: CarouselProps) {
  const [entries, setEntries] = useState(props.items);
  return (
    <Stack>
      <Button onClick={() => setEntries((current) => current.slice(1))}>Remove first slide</Button>
      <Carousel {...props} items={entries} />
    </Stack>
  );
}

/** Removal preserves surviving identities and falls back silently when the current entry disappears. */
export const DynamicItems: Story = { render: (args) => <DynamicExample {...args} /> };

/** Non-selectable decorative media supports mouse dragging; touch and trackpad keep native scrolling. */
export const DragAndSwipe: Story = {
  args: {
    items: items.map((item) => ({
      ...item,
      children: (
        <Surface padding='lg'>
          <svg role='img' aria-label={item.label} viewBox='0 0 200 80'>
            <title>{item.label}</title>
            <path d='M10 40h180' stroke='currentColor' />
          </svg>
        </Surface>
      )
    }))
  }
};
