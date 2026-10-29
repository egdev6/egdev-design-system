import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { Badge } from '../../atoms/badge';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Link } from '../../atoms/link';
import { Stack } from '../../primitives/stack';
import {
  ListItem,
  ListItemActions,
  ListItemBody,
  ListItemContent,
  ListItemFooter,
  ListItemMedia,
  ListItemMeta
} from './ListItem';
import type { ListItemStatus, ListItemVariant } from './types';
import { listItemExampleVariants } from './types';

const edit = action('Edit item');
const create = action('Create item');
const labels = {
  default: 'Draft',
  new: 'New draft',
  failed: 'Failed: upload did not complete',
  done: 'Completed',
  off: 'Inactive',
  dragging: 'Moving item'
};

function Example({
  status = 'default',
  variant = 'card',
  media = false
}: {
  status?: Exclude<ListItemStatus, 'empty'>;
  variant?: ListItemVariant;
  media?: boolean;
}) {
  const metadata = (
    <ListItemMeta>
      <Badge
        tone={status === 'failed' ? 'danger' : 'neutral'}
        icon={status === 'failed' ? <Icon name='alert' size='sm' /> : undefined}
      >
        {labels[status]}
      </Badge>
    </ListItemMeta>
  );
  const actions = (
    <ListItemActions>
      <Button variant='ghost' onClick={edit}>
        {status === 'off' ? 'Show' : 'Edit'}
      </Button>
    </ListItemActions>
  );
  return (
    <ListItem status={status} variant={variant}>
      <ListItemBody>
        <ListItemContent>Prepare the next release notes.</ListItemContent>
        {media && (
          <ListItemMedia>
            <img src='/brand/egdev-logo.png' alt='EGDEV artwork' />
          </ListItemMedia>
        )}
      </ListItemBody>
      {variant === 'row' ? (
        <>
          {metadata}
          {actions}
        </>
      ) : (
        <ListItemFooter>
          {metadata}
          {actions}
        </ListItemFooter>
      )}
    </ListItem>
  );
}

function ReorderExample() {
  const [first, setFirst] = useState(true);
  const items = first ? ['Release notes', 'Review checklist'] : ['Review checklist', 'Release notes'];
  return (
    <Stack>
      {items.map((item, index) => (
        <ListItem key={item} variant='row' status='dragging'>
          <ListItemBody>
            <ListItemContent>{item}</ListItemContent>
          </ListItemBody>
          <ListItemMeta>Moving item</ListItemMeta>
          <ListItemActions>
            <IconButton label={`Drag ${item}`} icon={<Icon name='grip' />} disabled={true} />
            <Button
              variant='ghost'
              disabled={index === 0}
              onClick={() => {
                setFirst(!first);
                action('Move up')(item);
              }}
            >
              Move up
            </Button>
            <Button
              variant='ghost'
              disabled={index === items.length - 1}
              onClick={() => {
                setFirst(!first);
                action('Move down')(item);
              }}
            >
              Move down
            </Button>
          </ListItemActions>
        </ListItem>
      ))}
    </Stack>
  );
}

/**
 * ## Description
 * A generic content row or card with readable content, optional passive media and independent actions.
 *
 * ## Dependencies
 * Radix Slot preserves native child composition; Surface recipes provide elevated and recessed Material.
 * Examples compose Badge, Button, Icon, IconButton and Link without copying their recipes.
 *
 * ## Usage guidelines
 * Card/compact use Body then optional Footer. Row uses Body, Meta and Actions in DOM order.
 * Supply visible words for every non-default status and readable failure details for failed.
 * Empty requires one native button/anchor with phrasing content, never compound parts or nested controls.
 * Populated items are non-focusable containers, never whole-card buttons or links around actions.
 * Dragging is presentation only: collection owners supply accessible reorder actions and announcements.
 * Root className supports outer layout only; part classes support local placement/width, not appearance.
 */
const meta: Meta<typeof ListItem> = {
  title: 'Molecules/ListItem',
  component: ListItem,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof ListItem>;

/** Only required children are supplied; all runtime defaults remain untouched. */
export const Default: Story = {
  args: {
    children: (
      <ListItemBody>
        <ListItemContent>Prepare release notes.</ListItemContent>
      </ListItemBody>
    )
  }
};

/** The entire composition becomes a single native list item without another root wrapper. */
export const AsList: Story = {
  args: {
    asChild: true,
    children: (
      <li>
        <ListItemBody>
          <ListItemContent>Release notes</ListItemContent>
        </ListItemBody>
      </li>
    )
  },
  decorators: [
    (Story) => (
      <ul>
        <Story />
      </ul>
    )
  ]
};

/** An independently meaningful article retains its consumer-provided accessible name. */
export const AsArticle: Story = {
  args: {
    asChild: true,
    'aria-label': 'Release notes',
    children: (
      <article>
        <ListItemBody>
          <ListItemContent>Release notes</ListItemContent>
        </ListItemBody>
      </article>
    )
  }
};

/** Card, compact and wrapping row share content and independent controls. */
export const Variants: Story = {
  render: () => (
    <Stack>
      {(['card', 'compact', 'row'] as const).map((variant) => (
        <Example key={variant} variant={variant} />
      ))}
    </Stack>
  )
};

/** All exclusive snapshots carry visible words; the host chooses transitions. */
export const Statuses: Story = {
  render: () => (
    <Stack>
      {(Object.keys(labels) as Exclude<ListItemStatus, 'empty'>[]).map((status) => (
        <Example key={status} status={status} />
      ))}
      <ListItem status='empty' asChild={true}>
        <button type='button' onClick={create}>
          Create item
        </button>
      </ListItem>
    </Stack>
  )
};

/** New remains until the host explicitly changes it, without timers or auto-clear. */
export const New: Story = { render: () => <Example status='new' /> };
/** Failure is readable text with an icon, not an automatic alert or form error. */
export const Failed: Story = { render: () => <Example status='failed' /> };
/** Completed items expose their host frame while independent controls remain active. */
export const Done: Story = { render: () => <Example status='done' /> };
/** Inactive is not disabled; the Show action remains operable. */
export const Off: Story = { render: () => <Example status='off' variant='row' /> };
/** Only passive media is de-emphasized; text and controls retain contrast. */
export const Dragging: Story = { render: () => <Example status='dragging' media={true} /> };

/** Native button owns activation, explicit non-submit type and visible creation text. */
export const Empty: Story = {
  args: {
    status: 'empty',
    asChild: true,
    children: (
      <button type='button' onClick={create}>
        <Icon name='plus' />
        Create item
      </button>
    )
  }
};
/** Native navigation keeps anchor semantics and Enter behavior without Space emulation. */
export const EmptyLink: Story = {
  args: { status: 'empty', asChild: true, children: <a href='#create'>Create item</a> }
};
/** Disabled belongs to the native child and removes the empty action from tab order. */
export const EmptyDisabled: Story = {
  args: {
    status: 'empty',
    asChild: true,
    children: (
      <button type='button' disabled={true}>
        Create item
      </button>
    )
  }
};
/** Tab to this action to inspect the focus ring replacing the unpainted frame shadow. */
export const EmptyFocus: Story = { ...Empty };
/** A passive image retains its own alt text in the recessed square thumbnail. */
export const WithMedia: Story = { render: () => <Example media={true} /> };

/** Omitted media/footer/actions create no hidden placeholders or synthesized controls. */
export const ContentOnly: Story = {
  args: {
    children: (
      <ListItemBody>
        <ListItemContent>Readable content only.</ListItemContent>
      </ListItemBody>
    )
  }
};
/** Independent controls retain their native semantics and document order. */
export const WithActions: Story = {
  args: {
    children: (
      <>
        <ListItemBody>
          <ListItemContent>Release notes</ListItemContent>
        </ListItemBody>
        <ListItemFooter>
          <ListItemActions>
            <Button onClick={edit}>Edit</Button>
            <Link href='#full-content'>Read full content</Link>
          </ListItemActions>
        </ListItemFooter>
      </>
    )
  }
};
/** Long content is not clamped or replaced with an ellipsis or tooltip. */
export const LongContent: Story = {
  args: {
    children: (
      <ListItemBody>
        <ListItemContent>{'Readable release notes and essential details. '.repeat(24)}</ListItemContent>
      </ListItemBody>
    )
  }
};
/** A narrow host constrains only outer width; row parts wrap without reordering or root clipping. */
export const Narrow: Story = {
  render: () => (
    <Stack className={listItemExampleVariants({ layout: 'narrow' })}>
      <Example variant='row' media={true} />
    </Stack>
  )
};
/** A two-position host owns boundary checks and callbacks; no drag engine is included. */
export const ReorderIntegration: Story = { render: () => <ReorderExample /> };
/** Supported className composition changes outer width/margins, never internal appearance. */
export const ClassComposition: Story = {
  args: {
    className: listItemExampleVariants({ layout: 'outer' }),
    children: (
      <ListItemBody>
        <ListItemContent>Outer layout composition</ListItemContent>
      </ListItemBody>
    )
  }
};
/** ListItem adds no motion; inspect with the OS reduced-motion preference enabled. */
export const ReducedMotion: Story = { render: () => <Example status='new' /> };
