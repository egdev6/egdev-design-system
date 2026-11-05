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
  ListItemLeading,
  ListItemMedia,
  ListItemMeta,
  ListItemTitle,
  ListItemTrailing
} from './ListItem';
import type { ListItemSize, ListItemStatus, ListItemTitleProps, ListItemVariant } from './types';
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
      <Button variant='neutral' onClick={edit}>
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
              variant='neutral'
              disabled={index === 0}
              onClick={() => {
                setFirst(!first);
                action('Move up')(item);
              }}
            >
              Move up
            </Button>
            <Button
              variant='neutral'
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
 * ## Parts
 * - ListItemLeading: optional editorial date, index or short label; no controls.
 * - ListItemTitle: editorial heading with a consumer-selected rank.
 * - ListItemBody: groups the main content and optional passive media.
 * - ListItemContent: flexible readable content for card, compact and row variants.
 * - ListItemMedia: passive square thumbnail; supply appropriate image alt text.
 * - ListItemFooter: wrapping metadata and action band for card and compact variants.
 * - ListItemMeta: non-interactive context or visible status text.
 * - ListItemActions: independent controls, not a whole-item activation region.
 * - ListItemTrailing: optional editorial text or decorative icon.
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
 *
 * Editorial rows compose Leading, Body (title then optional meta) and Trailing in DOM order; the
 * consumer may put the meta line before the title in one family (Article) and after it in another
 * (Note/Stream), because the parts are consumer-composed and DOM order equals visual order.
 * ListItemTitle owns the heading rank: pass the level that fits the surrounding outline.
 * Editorial values never compose Content, Media or Footer, and a linked row never composes Actions.
 * A linked row is `<ul><li><ListItem asChild variant="editorial|editorial-divided"><a href>…parts…</a>
 * </ListItem></li></ul>`: the row element itself is the anchor, so the anchor owns the three-zone layout,
 * the hover affordances and the reset decoration. Never put the parts inside an inner anchor whose
 * ListItem sits on the <li>; the recipe and the marker would land on the list item instead.
 * Only a row whose root element is an anchor gets hover affordances; static rows stay inert.
 * editorial-divided paints no surface and separates rows with a single bottom hairline.
 * The consumer formats and owns the day, month, category, reading time and duration text.
 */
const meta: Meta<typeof ListItem> = {
  title: 'Molecules/ListItem',
  component: ListItem,
  subcomponents: {
    listItemLeading: ListItemLeading,
    listItemTitle: ListItemTitle,
    listItemBody: ListItemBody,
    listItemContent: ListItemContent,
    listItemMedia: ListItemMedia,
    listItemFooter: ListItemFooter,
    listItemMeta: ListItemMeta,
    listItemActions: ListItemActions,
    listItemTrailing: ListItemTrailing
  },
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

/** Editorial and card anatomy use separate compositions; see Parts above for each role. */
export const Anatomy: Story = {
  render: () => (
    <Stack>
      <ListItem variant='editorial'>
        <ListItemLeading>
          <time dateTime='2026-09-12'>
            12 <small>SEP</small>
          </time>
        </ListItemLeading>
        <ListItemBody>
          <ListItemTitle>Release notes</ListItemTitle>
          <ListItemMeta>Notes · 4 min read</ListItemMeta>
        </ListItemBody>
        <ListItemTrailing>18:04</ListItemTrailing>
      </ListItem>
      <Example media={true} />
    </Stack>
  )
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

type EditorialNote = {
  day: string;
  month: string;
  dateTime: string;
  title: string;
  meta: string;
  duration: string;
};

const firstNote: EditorialNote = {
  day: '12',
  month: 'SEP',
  dateTime: '2026-09-12',
  title: 'Reading the release train',
  meta: 'Notes · 4 min read',
  duration: '18:04'
};

const secondNote: EditorialNote = {
  day: '30',
  month: 'AUG',
  dateTime: '2026-08-30',
  title: 'Shipping a calmer catalog',
  meta: 'Notes · 6 min read',
  duration: '22:41'
};

const thirdNote: EditorialNote = {
  day: '04',
  month: 'AUG',
  dateTime: '2026-08-04',
  title: 'One row for three editorial lists',
  meta: 'Notes · 3 min read',
  duration: '11:20'
};

const editorialNotes = [firstNote, secondNote, thirdNote];

function EditorialParts({
  note = firstNote,
  level,
  metaFirst = false
}: {
  note?: EditorialNote;
  level?: ListItemTitleProps['level'];
  metaFirst?: boolean;
}) {
  const title = (
    <ListItemTitle key='title' level={level}>
      {note.title}
    </ListItemTitle>
  );
  const meta = (
    <ListItemMeta key='meta'>
      <b>{note.meta.split(' · ')[0]}</b> · {note.meta.split(' · ')[1]}
    </ListItemMeta>
  );
  return (
    <>
      <ListItemLeading>
        <time dateTime={note.dateTime}>
          {note.day}
          <small>{note.month}</small>
        </time>
      </ListItemLeading>
      <ListItemBody>{metaFirst ? [meta, title] : [title, meta]}</ListItemBody>
      <ListItemTrailing>{note.duration}</ListItemTrailing>
    </>
  );
}

/** Editorial rows stack leading, title/meta and trailing inside the raised row. */
export const EditorialRow: Story = {
  render: () => (
    <ListItem variant='editorial'>
      <EditorialParts />
    </ListItem>
  )
};

/** Article rows put an uppercase meta line above the title; Note and Stream rows put it below. */
export const EditorialVariants: Story = {
  render: () => (
    <Stack>
      <ListItem variant='editorial'>
        <ListItemBody>
          <ListItemMeta>
            <b>Article</b> · 5 min read
          </ListItemMeta>
          <ListItemTitle>Editorial meta line above a two-line title</ListItemTitle>
        </ListItemBody>
      </ListItem>
      <ListItem variant='editorial'>
        <EditorialParts />
      </ListItem>
      <ListItem variant='editorial-divided'>
        <EditorialParts note={secondNote} />
      </ListItem>
    </Stack>
  )
};

/** A non-default status repaints the row and keeps its visible status words mandatory. */
export const EditorialStatuses: Story = {
  render: () => (
    <Stack>
      {(['default', 'new', 'failed', 'done', 'off', 'dragging'] as const).map((status) => (
        <ListItem key={status} status={status} variant='editorial'>
          <EditorialParts />
          <ListItemMeta>{labels[status]}</ListItemMeta>
        </ListItem>
      ))}
      <ListItem status='empty' asChild={true}>
        <button type='button' onClick={create}>
          Create item
        </button>
      </ListItem>
    </Stack>
  )
};

/** sm narrows the leading column and lowers the day and title steps; md is the default. */
export const EditorialSizes: Story = {
  render: () => (
    <Stack>
      {(['md', 'sm'] as ListItemSize[]).map((size) => (
        <ListItem key={size} variant='editorial' size={size}>
          <EditorialParts />
        </ListItem>
      ))}
    </Stack>
  )
};

/** A dated list keeps a real time[datetime] and one anchor per row. */
export const EditorialDatedList: Story = {
  render: () => (
    <ul className='flex list-none flex-col gap-3 p-0'>
      {editorialNotes.map((note) => (
        <li key={note.dateTime}>
          <ListItem asChild={true} variant='editorial'>
            <a href={`#${note.dateTime}`}>
              <EditorialParts note={note} />
            </a>
          </ListItem>
        </li>
      ))}
    </ul>
  )
};

/** ListItemTitle picks the native heading rank while typography stays a part recipe. */
export const EditorialHeadingRanks: Story = {
  render: () => (
    <Stack>
      {([2, 3, 4, 5, 6] as const).map((level) => (
        <ListItem key={level} variant='editorial'>
          <EditorialParts level={level} />
        </ListItem>
      ))}
    </Stack>
  )
};

/** One anchor owns the whole editorial row, its name and its single tab stop. */
export const EditorialLinkRow: Story = {
  render: () => (
    <ListItem asChild={true} variant='editorial'>
      <a href='#notes'>
        <EditorialParts />
      </a>
    </ListItem>
  )
};

/** Tab to a linked row to inspect the row focus ring; static rows never receive focus. */
export const EditorialFocus: Story = {
  render: () => (
    <Stack>
      <ListItem asChild={true} variant='editorial'>
        <a href='#first'>
          <EditorialParts />
        </a>
      </ListItem>
      <ListItem asChild={true} variant='editorial-divided'>
        <a href='#second'>
          <EditorialParts note={thirdNote} />
        </a>
      </ListItem>
    </Stack>
  )
};

/** A static editorial row is a plain container: no tab stop, role or hover affordance. */
export const EditorialStaticRow: Story = {
  render: () => (
    <ListItem variant='editorial'>
      <EditorialParts />
    </ListItem>
  )
};

/** Divided rows paint no surface and separate rows with a single bottom hairline. */
export const EditorialDivided: Story = {
  render: () => (
    <ul className='flex list-none flex-col p-0'>
      {editorialNotes.map((note) => (
        <li key={note.dateTime}>
          <ListItem asChild={true} variant='editorial-divided'>
            <a href={`#${note.dateTime}`}>
              <EditorialParts note={note} />
            </a>
          </ListItem>
        </li>
      ))}
    </ul>
  )
};

/** Hover affordances exist only on linked rows: brand border and wash on editorial, wash and indent when divided. */
export const EditorialHover: Story = {
  render: () => (
    <Stack>
      <ListItem asChild={true} variant='editorial'>
        <a href='#raised'>
          <EditorialParts />
        </a>
      </ListItem>
      <ListItem asChild={true} variant='editorial-divided'>
        <a href='#divided'>
          <EditorialParts note={secondNote} />
        </a>
      </ListItem>
    </Stack>
  )
};
