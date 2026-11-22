import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListItem, ListItemBody, ListItemContent, ListItemMeta, ListItemTitle } from '../../molecules/list-item';
import { Heading } from './Heading';
import { Text } from './Text';

/**
 * ## Description
 * Non-heading typography: the diamond-prefixed eyebrow by default, title recipes with optional
 * trailing accents, and body, body-large or lede copy with native strong emphasis.
 *
 * ## Dependencies
 * Radix Slot/Slottable for `asChild`; no interactive primitive, focus or state. The ListItem
 * example composes its existing parts without changing their default behavior.
 *
 * ## Usage guidelines
 * Use Heading for document hierarchy; Text never takes a heading role. Supply whitespace in
 * children before a separate accented word; punctuation accents attach directly. Choose
 * `tone="raised"` on surface-1…3 or overlays; the host background is never inspected or painted.
 * Body foreground defaults to inherit. Explicit default, secondary, muted, warning and danger are
 * intended for solid surface-0…3; on flood use inherit or on-flood, and on deep use inherit or
 * default. Check contrast against actual pixels for translucent hosts. Status copy needs meaningful
 * words and a non-color cue; it does not announce itself. The consumer owns the host and contrast.
 * className supports outer layout only (margins, width constraints, flex/grid placement).
 * `truncate` opts into a block-level clipping root, even for a slotted span; do not use it for
 * inline prose. The host bounds the width, makes every flex/grid item and grid track along the
 * shrinking path shrinkable, and provides a visible keyboard- and touch-operable route to every
 * full value. Native title and Tooltip are supplementary only. A truncating root must be passive
 * and non-focusable; do not put focusable descendants, hard breaks or nested block boxes inside it.
 * An ancestor link may own its focus.
 * Display, whitespace, overflow and ellipsis remain owned by `truncate`, not className overrides.
 * Host panels in these examples are illustrative consumer content, not Text parts.
 */
const meta: Meta<typeof Text> = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Text>;

const raisedHost =
  'flex flex-col gap-4 p-6 border border-border-hairline rounded-xl bg-[image:var(--gradient-sheen)] bg-surface-1 shadow-[var(--shadow-edge),var(--shadow-elev-1)]';

/** The default paragraph eyebrow with its decorative diamond; only the required copy is supplied. */
export const Default: Story = {
  args: { children: 'Live every Thursday' }
};

/** Short eyebrows stack above a section heading, as in the Foundation eyebrow board. */
export const Eyebrow: Story = {
  args: { children: 'Weekly stream' },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <Text {...args} />
      <Text>Open source</Text>
      <Text>Design systems</Text>
      <div className='flex flex-col gap-3'>
        <Text>Latest episode</Text>
        <Heading accent='in public'>Building </Heading>
      </div>
    </div>
  )
};

/** Block (default) and inline trailing accents, plus a punctuation accent with no injected space. */
export const Accents: Story = {
  args: { children: 'Big ', variant: 'section', accent: 'ideas' },
  render: (args) => (
    <div className='flex flex-col gap-8'>
      <Text {...args} />
      <Text variant='section' accent='ideas' accentBreak={false}>
        Big{' '}
      </Text>
      <Text variant='display' accent='.' accentBreak={false}>
        Talk
      </Text>
    </div>
  )
};

/** Each title recipe uses its own fluid token scale; resize the viewport to see the clamps. */
export const TypographyScale: Story = {
  args: { children: 'Section ', variant: 'section', accent: 'scale' },
  render: (args) => (
    <div className='flex flex-col gap-8'>
      <Text {...args} />
      <Text variant='hero' accent='scale'>
        Hero{' '}
      </Text>
      <Text variant='show' accent='scale'>
        Show{' '}
      </Text>
      <Text variant='display' accent='scale'>
        Display{' '}
      </Text>
    </div>
  )
};

/** Canvas hero accent glows; the raised tone switches to the raised brand red with no glow. */
export const Raised: Story = {
  args: { children: 'Ship ', variant: 'hero', accent: 'today' },
  render: (args) => (
    <div className='flex flex-col gap-8'>
      <Text {...args} />
      <div className={raisedHost}>
        <Text>On a raised panel</Text>
        <Text {...args} variant='hero' foreground={undefined} tone='raised' />
      </div>
    </div>
  )
};

/** Inverse is display scale in the on-flood foreground; the consumer host supplies the flood. */
export const Inverse: Story = {
  args: { children: 'Show ', variant: 'inverse', accent: 'time' },
  render: (args) => (
    <div className='p-6 bg-bg-flood'>
      <Text {...args} />
    </div>
  )
};

/** Long copy wraps without clipping, truncation or a fixed line count. */
export const LongText: Story = {
  args: {
    children: 'Incomprehensibilities of a supercalifragilistic design system ',
    variant: 'section',
    accent: 'still readable'
  },
  render: (args) => (
    <div className='max-w-[calc(var(--space-24)*4)]'>
      <Text {...args} />
    </div>
  )
};

const fullTitle = 'A complete project note title that can overflow a narrow list item';
const fullProject = 'A complete project and workspace name that can also overflow';

/** A bounded flex item truncates only when needed; the separate disclosure retains visual access. */
export const Truncate: Story = {
  args: { children: fullTitle, variant: 'body', truncate: true },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <div className='flex w-full max-w-[calc(var(--space-24)*3)] gap-2'>
        <div className='min-w-0 flex-1'>
          <Text variant='body' truncate={true}>
            Fits
          </Text>
          <Text {...args} />
        </div>
        <span className='shrink-0'>More</span>
      </div>
      <Text variant='body' truncate={true} className='w-max'>
        {fullTitle}
      </Text>
      <details>
        <summary>View complete text</summary>
        <p>{fullTitle}</p>
      </details>
    </div>
  )
};

/** Editorial heading/meta spans and compact paragraphs each keep a separate full-value disclosure. */
export const TruncateListItem: Story = {
  args: { children: fullTitle },
  render: () => (
    <div className='flex flex-col gap-4'>
      <div className='w-full max-w-[calc(var(--space-24)*3)]'>
        <ListItem variant='editorial'>
          <ListItemBody>
            <ListItemTitle level={3} className='self-stretch'>
              <Text asChild={true} variant='body-large' truncate={true} title={fullTitle}>
                <span>{fullTitle}</span>
              </Text>
            </ListItemTitle>
            <ListItemMeta className='self-stretch'>
              <Text asChild={true} variant='body' foreground='muted' truncate={true} title={fullProject}>
                <span>{fullProject}</span>
              </Text>
            </ListItemMeta>
          </ListItemBody>
        </ListItem>
        <details>
          <summary>View the full editorial note</summary>
          <p>{fullTitle}</p>
          <p>{fullProject}</p>
        </details>
      </div>
      <div className='w-full max-w-[calc(var(--space-24)*3)]'>
        <ListItem variant='compact'>
          <ListItemContent>
            <Text variant='body-large' truncate={true}>
              {fullTitle}
            </Text>
            <Text variant='body' foreground='muted' truncate={true}>
              {fullProject}
            </Text>
          </ListItemContent>
        </ListItem>
        <details>
          <summary>View the full compact note</summary>
          <p>{fullTitle}</p>
          <p>{fullProject}</p>
        </details>
      </div>
    </div>
  )
};

/** A shrinkable grid track shows direction, long tokens, eyebrow, inline accent and a zero-width limit. */
export const TruncateDirections: Story = {
  args: { children: 'LongUnbrokenTextWithoutNaturalWrapOpportunities', variant: 'body', truncate: true },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <div className='grid w-full max-w-[calc(var(--space-24)*3)] grid-cols-[minmax(0,1fr)] gap-2'>
        <div className='min-w-0'>
          <Text {...args} />
          <Text variant='body' dir='rtl' truncate={true}>
            A long right-to-left paragraph with the ellipsis at the inline end
          </Text>
          <Text variant='body' dir='ltr' truncate={true}>
            Mixed direction: <bdi dir='rtl'>a right-to-left segment 123</bdi> with surrounding text
          </Text>
          <Text truncate={true}>A long eyebrow with its decorative diamond</Text>
          <Text variant='hero' accent='glow' truncate={true}>
            A long title with{' '}
          </Text>
          <Text variant='body' truncate={true} className='max-w-0'>
            No room for the marker
          </Text>
          <a href='https://example.com/'>
            <Text asChild={true} variant='body' truncate={true}>
              <span>A complete link name that can overflow the grid</span>
            </Text>
          </a>
        </div>
      </div>
      <details>
        <summary>View complete examples</summary>
        <p>LongUnbrokenTextWithoutNaturalWrapOpportunities</p>
        <p dir='rtl'>A long right-to-left paragraph with the ellipsis at the inline end</p>
        <p>
          Mixed direction: <bdi dir='rtl'>a right-to-left segment 123</bdi> with surrounding text
        </p>
        <p>A long eyebrow with its decorative diamond</p>
        <p>A long title with glow</p>
        <p>No room for the marker</p>
        <p>A complete link name that can overflow the grid</p>
      </details>
    </div>
  )
};

/** One span keeps its own attributes and classes; the accent lands inside it after its children. */
export const AsChild: Story = {
  args: {
    asChild: true,
    variant: 'section',
    accent: 'inline',
    accentBreak: false,
    children: <span data-origin='consumer'>Slotted </span>
  }
};

/** The three body typography recipes inherit their host color without forcing uppercase. */
export const BodyRecipes: Story = {
  args: { variant: 'body', children: 'Body copy follows the surrounding foreground.' },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <Text {...args} />
      <Text variant='body-large'>Large body copy has a stronger presence.</Text>
      <Text variant='lede'>Lede copy introduces a longer section.</Text>
    </div>
  )
};

/** Native strong content stays in reading order in a paragraph and a slotted inline element. */
export const Emphasis: Story = {
  args: {
    variant: 'body',
    children: (
      <>
        Read <strong>important</strong> words in order.
      </>
    )
  },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <Text {...args} />
      <Text asChild={true} variant='lede'>
        <span>
          Keep <strong>important</strong> context inline.
        </span>
      </Text>
    </div>
  )
};

/** Compare explicit foregrounds on each supported solid surface and the two flood choices. */
export const ForegroundMatrix: Story = {
  args: { variant: 'body', children: 'Default foreground', foreground: 'default' },
  render: (args) => (
    <div className='grid gap-4'>
      {['bg-surface-0', 'bg-surface-1', 'bg-surface-2', 'bg-surface-3'].map((host, index) => (
        <div key={host} className={`flex flex-col gap-2 p-6 ${host}`}>
          <Text {...args}>Surface {index}: default</Text>
          <Text variant='body' foreground='secondary'>
            Secondary copy
          </Text>
          <Text variant='body' foreground='muted'>
            Muted copy
          </Text>
          <Text variant='body' foreground='warning'>
            <span aria-hidden='true'>⚠ </span>Warning: review required
          </Text>
          <Text variant='body' foreground='danger'>
            <span aria-hidden='true'>✕ </span>Danger: action failed
          </Text>
        </div>
      ))}
      <div className='flex flex-col gap-2 p-6 bg-bg-flood text-fg-on-flood'>
        <Text variant='body'>Flood: inherited foreground</Text>
        <Text variant='body' foreground='on-flood'>
          Flood: explicit on-flood foreground
        </Text>
      </div>
    </div>
  )
};

/** Warning and danger remain passive text with meaningful wording and non-color cues. */
export const StatusCopy: Story = {
  args: {
    variant: 'body',
    foreground: 'warning',
    children: (
      <>
        <span aria-hidden='true'>⚠ </span>Warning: review required
      </>
    )
  },
  render: (args) => (
    <div className='flex flex-col gap-4'>
      <Text {...args} />
      <Text variant='body' foreground='danger'>
        <span aria-hidden='true'>✕ </span>Danger: action failed
      </Text>
    </div>
  )
};

/** Slot preserves the child's language, whitespace and semantic emphasis without a paragraph wrapper. */
export const BodyAsChild: Story = {
  args: {
    asChild: true,
    variant: 'body-large',
    lang: 'en',
    children: (
      <span data-origin='consumer'>
        Slotted <strong>important</strong> copy.
      </span>
    )
  }
};

/** Long ordinary copy wraps naturally within a consumer-owned width constraint. */
export const BodyLongText: Story = {
  args: {
    variant: 'body',
    children:
      'Long prose remains in the normal flow and wraps with its host width. Meaningful emphasis stays in reading order, and the host is responsible for providing a contrasting foreground.'
  },
  render: (args) => (
    <div className='max-w-[calc(var(--space-24)*3)]'>
      <Text {...args} />
    </div>
  )
};
