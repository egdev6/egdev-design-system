import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from '../../primitives/surface';
import { SectionHeader } from './SectionHeader';

/**
 * ## Description
 * A passive editorial section introduction with an optional eyebrow, trailing accent and lede.
 *
 * ## Dependencies
 * Heading owns section-scale typography and accent semantics; Text owns the decorative eyebrow;
 * Divider owns the inline decorative rule. Surface supplies the raised host example only.
 *
 * ## Usage guidelines
 * Supply title/accent whitespace explicitly. The enclosing section owns outer spacing and region
 * naming; titleId links its heading to an external aria-labelledby. className is outer layout only.
 * Split without a lede and inline without an eyebrow resolve to stack. No actions or children API.
 */
const meta: Meta<typeof SectionHeader> = {
  title: 'Molecules/SectionHeader',
  component: SectionHeader,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof SectionHeader>;

/** Required title only: native h2 and the untouched stack/canvas defaults. */
export const Default: Story = { args: { title: 'Built with intention.' } };

/** Explicit trailing space preserves a single readable phrase with an inline accent. */
export const Stack: Story = {
  args: { title: 'Build ', accent: 'together.', eyebrow: 'Our work', lede: 'Tools for thoughtful teams.' }
};

/** One column below 860px; bottom-aligned 1:0.8 title/lede columns from 860px. */
export const Split: Story = {
  args: { ...Stack.args, variant: 'split' }
};

/** Eyebrow and decorative fading rule precede a full-width heading and lede. */
export const Inline: Story = {
  args: { ...Stack.args, variant: 'inline' }
};

/** The accent moves to a separate visual line without leaving the heading. */
export const AccentBreak: Story = {
  args: { title: 'Built for ', accent: 'people.', eyebrow: 'Our approach', variant: 'inline', accentBreak: true }
};

/** Missing required optional parts collapse both requested layouts to ordinary stacks. */
export const MissingOptionalParts: Story = {
  args: { title: 'Nothing reserved.' },
  render: (args) => (
    <>
      <SectionHeader {...args} variant='split' eyebrow='No lede' />
      <SectionHeader {...args} variant='inline' lede='No eyebrow means no orphan rule.' />
    </>
  )
};

/** All six native heading ranks keep the same section-scale typography. */
export const HeadingLevels: Story = {
  args: { title: 'Document hierarchy.' },
  render: (args) => (
    <>
      <SectionHeader {...args} level={1} />
      <SectionHeader {...args} level={2} />
      <SectionHeader {...args} level={3} />
      <SectionHeader {...args} level={4} />
      <SectionHeader {...args} level={5} />
      <SectionHeader {...args} level={6} />
    </>
  )
};

/** The host supplies Material; raised tone changes only the accent foreground. */
export const Raised: Story = {
  args: { ...Stack.args, tone: 'raised' },
  render: (args) => (
    <Surface padding='lg'>
      <SectionHeader {...args} />
    </Surface>
  )
};

/** DOM order is unchanged in RTL; logical lede alignment follows the host direction. */
export const RTL: Story = {
  args: { title: 'نبني ', accent: 'معاً.', eyebrow: 'عملنا', lede: 'أدوات للفرق.', variant: 'split', dir: 'rtl' }
};

/** Long copy, diacritics and an unbroken word exercise wrapping without component clipping. */
export const LongContent: Story = {
  args: {
    title: 'Équipe: deliberate tools for a more thoughtful shared practice ',
    accent: 'everywhere.',
    eyebrow: 'Research and collaboration',
    lede: 'InternationalisationWithoutArbitraryTruncation: content remains complete at narrow widths and increased zoom.',
    variant: 'split'
  }
};
