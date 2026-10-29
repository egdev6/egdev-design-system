import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Button } from '../../atoms/button';
import { Stack } from '../../primitives/stack';
import { Surface } from '../../primitives/surface';
import { Text } from '../../primitives/text';
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

/**
 * ## Description
 * A manually navigated read-only slide collection with bounded controls, native scrolling and roving focus.
 *
 * ## Dependencies
 * IconButton and Icon provide 48px navigation controls; ProgressBar shows decorative position.
 * VisuallyHidden supplies instructions and status. Surface is consumer content, not Carousel paint.
 *
 * ## Usage guidelines
 * Slides must not contain links, controls, tab stops or autoplay. Arrow keys work on the slide group itself;
 * Home/End reach the boundaries. Text selection is preserved; media/background supports mouse dragging.
 * Controlled requests commit only when accepted. Never drive periodic value changes to simulate autoplay.
 * Root className supports only width, margins and layout placement. No stylesheet or part override API.
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
