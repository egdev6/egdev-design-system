import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';
import { Text } from './Text';

/**
 * ## Description
 * Non-heading display typography: the diamond-prefixed eyebrow by default, or any title recipe
 * (`section`, `hero`, `show`, `display`, `inverse`) as paragraph copy with an optional trailing accent.
 *
 * ## Dependencies
 * Radix Slot/Slottable for `asChild`; no interactive primitive, focus or state.
 *
 * ## Usage guidelines
 * Use Heading for document hierarchy; Text never takes a heading role. Supply whitespace in
 * children before a separate accented word; punctuation accents attach directly. Choose
 * `tone="raised"` on surface-1…3 or overlays; the host background is never inspected or painted.
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
        <Text {...args} variant='hero' tone='raised' />
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
