import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MouseEvent } from 'react';
import { action } from 'storybook/actions';
import { Stack } from '../../primitives/stack';
import { Surface } from '../../primitives/surface';
import { Text } from '../../primitives/text';
import { Breadcrumb } from './Breadcrumb';
import type { BreadcrumbItem } from './types';

const trail: BreadcrumbItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Editorial', href: '#editorial' },
  { label: 'Post title' }
];

/**
 * ## Description
 * A named trail that shows where the reader is on a detail page, such as "Home / Editorial / Post title". `label`
 * names the navigation landmark and `items` run from the root to the current page: every earlier entry is a link and
 * the last supplied entry is the current page, plain text marked `aria-current="page"` that is never a link.
 * Decorative chevrons separate the steps. Nothing is painted behind the trail: it sits on the host's surface.
 *
 * ## Dependencies
 * Each ancestor is the exported Link with its `quiet` variant (neutral text with a brand underline) and no arrow, and
 * each separator is the exported Icon (`chevron-down`, turned a quarter turn). The semantics are native (`nav`, `ol`,
 * `li`, `a`): no Radix primitive, Surface or stylesheet, and the recipes are token-backed utilities.
 *
 * ## Usage guidelines
 * The host builds the trail. It owns the route titles, the order from the root to the current page, and the wording
 * and language of `label` and of every entry label, because the component has no built-in text. It also gives each
 * landmark on the page a distinct name. An entry with a blank label, or an ancestor without an `href`, is omitted
 * with a development warning and nobody is promoted to current. The trail wraps onto further rows and a long label
 * wraps inside its step: nothing is truncated or collapsed. `className` supports outer placement only. For navigation
 * that is not a trail, use NavList, TopBar or SectionNav instead.
 */
const meta: Meta<typeof Breadcrumb> = {
  title: 'Molecules/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Breadcrumb', items: trail }
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

/** Two ancestor links and the current page: "Home / Editorial / Post title". */
export const Default: Story = {};

/** A single entry is the current page alone: no link and no separator. */
export const SingleStep: Story = { args: { items: [{ label: 'Home' }] } };

const longTrail: BreadcrumbItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Editorial', href: '#editorial' },
  { label: 'Design systems and long-form engineering notes', href: '#notes' },
  { label: 'Architecture decisions', href: '#architecture' },
  {
    label:
      'A deliberately long article title that has to wrap inside its own step instead of being truncated or clipped'
  }
];

/**
 * Many steps and long labels in a narrow column: the rows wrap, a long label wraps inside its step, and nothing is
 * truncated, clipped or collapsed. The column here is a story host only, so a narrow viewport shows the wrapping.
 */
export const Wrapping: Story = {
  args: { items: longTrail },
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*5)]'>
      <Breadcrumb {...args} />
    </div>
  )
};

const tones = ['surface-0', 'surface-1', 'surface-2', 'surface-3'] as const;

/**
 * The trail on each tone of the Grafito ladder, from surface-0 to surface-3, each tone named in text. The host owns
 * the surface: the trail paints nothing of its own. Each landmark has its own name, as a page needs.
 */
export const OnSurfaces: Story = {
  render: (args) => (
    <Stack gap={4} alignItems='start'>
      {tones.map((tone) => (
        <Surface key={tone} tone={tone} elevation={0} padding='md' radius='lg'>
          <Stack gap={2} alignItems='start'>
            <Breadcrumb {...args} label={`Breadcrumb on ${tone}`} />
            <Text variant='body' foreground='muted'>
              {tone}
            </Text>
          </Stack>
        </Surface>
      ))}
    </Stack>
  )
};

// A client router takes over only an unmodified primary activation; a modified click keeps its native behavior, so
// "open in a new tab" still works. There is no router dependency here: the story only reports the entry.
function routeUnmodifiedPrimaryClick(item: BreadcrumbItem, event: MouseEvent<HTMLAnchorElement>) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
    return;
  }
  event.preventDefault();
  action('onNavigate')(item);
}

/**
 * `onNavigate` receives the original entry and the React click event of an ancestor link, and is never called for the
 * current page. The component never prevents default itself: for client routing, call `preventDefault` only on an
 * unmodified primary click, as here, and let modified clicks stay native.
 */
export const ClientRouting: Story = { args: { onNavigate: routeUnmodifiedPrimaryClick } };
