import type { Meta, StoryObj } from '@storybook/react-vite';
import { Surface } from '../../primitives/surface';
import { PullQuote } from './PullQuote';

/**
 * ## Description
 * One editorial quotation as native figure > blockquote > p, with an optional source caption in a
 * figcaption outside the quoted passage. Pull is a compact reading interruption with a brand filet
 * and a 40ch measure; display is a large typographic quote moment. Both stay quotations, never headings.
 *
 * ## Dependencies
 * No Radix behavior base: passive native document semantics. No stylesheet is required.
 *
 * ## Usage guidelines
 * Use it only for real quotations or reproduced passages: the consumer owns wording, attribution,
 * permissions and source accuracy. Supply punctuation and the space before an accent yourself; no
 * quotation marks are inserted. `source` is plain caption text, never parsed into an author, work
 * title or link; the native `cite` URL is metadata on the blockquote only. For linked references,
 * compose native figure/blockquote/figcaption with Link outside this component. Choose
 * `tone="raised"` on surface-1…3 or overlay hosts. className supports outer margins, narrower widths
 * and parent placement only.
 */
const meta: Meta<typeof PullQuote> = {
  title: 'Atoms/PullQuote',
  component: PullQuote,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof PullQuote>;

/** Only the required passage: pull variant, canvas tone, no caption. */
export const Default: Story = {
  args: { text: 'A design system is a promise you keep in every screen, not a folder of parts.' }
};

/** A visible source caption follows the quotation in a figcaption, outside the passage. */
export const WithSource: Story = {
  args: {
    text: 'Name the decision once, then let every component inherit it.',
    source: 'Illustrative source, team handbook'
  }
};

/** The cite URL is blockquote metadata only: no link or visible attribution is fabricated. */
export const SourceMetadata: Story = {
  args: {
    text: 'Tokens describe intent; utilities only deliver it.',
    cite: 'https://example.com/illustrative-source'
  }
};

/** The display variant: display family, uppercase in CSS only and a block accent. Still a quotation. */
export const Display: Story = {
  args: {
    text: 'Build the system ',
    accent: 'before the screen.',
    source: 'Illustrative contextual caption',
    variant: 'display'
  }
};

/** Accent layout follows the variant: inline in pull, block in display. The caller supplies the space. */
export const Accents: Story = {
  render: () => (
    <div className='flex flex-col gap-8'>
      <PullQuote text='Ship small, review often and ' accent='keep the contract.' />
      <PullQuote text='Ship small, ' accent='keep the contract.' variant='display' />
    </div>
  )
};

/** On a raised Surface the accent switches to the raised brand color; nothing else changes. */
export const Raised: Story = {
  render: () => (
    <Surface tone='surface-1' padding='lg' radius='lg'>
      <PullQuote
        text='Material belongs to the host; the quotation only adapts its accent '
        accent='to the surface.'
        source='Illustrative source'
        tone='raised'
      />
    </Surface>
  )
};

/** In a right-to-left context the filet and inset move to the logical start edge. */
export const RTL: Story = {
  args: {
    text: 'Logical properties keep the filet at the start edge in either direction.',
    source: 'Illustrative source',
    dir: 'rtl'
  }
};

/** A long passage and long words wrap within the 40ch measure without clipping or truncation. */
export const LongContent: Story = {
  args: {
    text: 'Internationalization, accessibility and documentation are not finishing touches: they shape the contract from the first draft, and déjà-vu reviews prove that postponing them only multiplies the work later on.',
    accent: ' Plan them early.',
    source: 'Illustrative source with a deliberately long caption that also wraps across several lines'
  }
};
