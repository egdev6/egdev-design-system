import type { Meta, StoryObj } from '@storybook/react-vite';
import { Heading } from './Heading';
import { Text } from './Text';

/**
 * ## Description
 * A native h1–h6 display heading. `level` sets the document rank; `variant` sets the visual recipe
 * (`section`, `hero`, `show`, `display`, `inverse`); the two are independent.
 *
 * ## Dependencies
 * None beyond React: the native heading owns its role and level. No interactive primitive.
 *
 * ## Usage guidelines
 * The full visible copy, including the accent, is the accessible name. Supply whitespace in
 * children before a separate accented word. Choose `tone="raised"` on surface-1…3 or overlays.
 * Consumers own the document outline and localization. className supports outer layout only.
 * Host panels in these examples are illustrative consumer content, not Heading parts.
 */
const meta: Meta<typeof Heading> = {
  title: 'Primitives/Heading',
  component: Heading,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Heading>;

const raisedHost =
  'flex flex-col gap-4 p-6 border border-border-hairline rounded-xl bg-[image:var(--gradient-sheen)] bg-surface-1 shadow-[var(--shadow-edge),var(--shadow-elev-1)]';

/** The default h2 section title; only the required copy is supplied. */
export const Default: Story = {
  args: { children: 'Section title' }
};

/** Every rank from h1 to h6 keeps the same section recipe: level never resizes the typography. */
export const Levels: Story = {
  args: { children: 'Rank ', variant: 'section' },
  render: (args) => (
    <div className='flex flex-col gap-6'>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Heading {...args} level={level} key={level}>
          {`Rank h${level}`}
        </Heading>
      ))}
    </div>
  )
};

/** Block (default) and inline trailing accents, plus a punctuation accent with no injected space. */
export const Accents: Story = {
  args: { children: 'Big ', accent: 'ideas' },
  render: (args) => (
    <div className='flex flex-col gap-8'>
      <Heading {...args} />
      <Heading accent='ideas' accentBreak={false}>
        Big{' '}
      </Heading>
      <Heading variant='display' accent='.' accentBreak={false}>
        Talk
      </Heading>
    </div>
  )
};

/** The six Foundation title rows: hero, section inline and block, show, inverse and punctuation. */
export const TypographyScale: Story = {
  args: { children: 'Build ', variant: 'hero', accent: 'in public' },
  render: (args) => (
    <div className='flex flex-col gap-10'>
      <Heading {...args} level={1} />
      <Heading accent='live' accentBreak={false}>
        Code{' '}
      </Heading>
      <Heading accent='together'>Learn </Heading>
      <Heading variant='show' accent='tonight'>
        Show{' '}
      </Heading>
      <div className='p-6 bg-bg-flood'>
        <Heading variant='inverse'>Black on red</Heading>
      </div>
      <Heading variant='display' accent='.' accentBreak={false}>
        Done
      </Heading>
    </div>
  )
};

/** Eyebrow plus heading on canvas, then the same copy on a raised panel with the raised accent. */
export const Raised: Story = {
  args: { children: 'Design ', accent: 'systems', accentBreak: false },
  render: (args) => (
    <div className='flex flex-col gap-8'>
      <div className='flex flex-col gap-3'>
        <Text>Canvas</Text>
        <Heading {...args} />
      </div>
      <div className={raisedHost}>
        <Text>Raised panel</Text>
        <Heading {...args} variant='section' tone='raised' />
      </div>
    </div>
  )
};

/** Inverse is display scale in the on-flood foreground; the consumer host supplies the flood. */
export const Inverse: Story = {
  args: { children: 'Show ', variant: 'inverse', accent: 'time' },
  render: (args) => (
    <div className='p-6 bg-bg-flood'>
      <Heading {...args} />
    </div>
  )
};

/** Consumer layout classes only: outer margin and width constraint; the marker is preserved. */
export const ConsumerLayout: Story = {
  args: {
    children: 'Constrained ',
    accent: 'width',
    className: 'mb-6 max-w-[calc(var(--space-24)*5)]'
  }
};
