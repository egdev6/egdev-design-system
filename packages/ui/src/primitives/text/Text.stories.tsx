import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';
import { Text } from './Text';

/**
 * ## Description
 * Non-heading typography: the diamond-prefixed eyebrow by default, title recipes with optional
 * trailing accents, and body, body-large or lede copy with native strong emphasis.
 *
 * ## Dependencies
 * Radix Slot/Slottable for `asChild`; no interactive primitive, focus or state.
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
