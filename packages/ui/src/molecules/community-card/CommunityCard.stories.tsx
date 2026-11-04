import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../atoms/button';
import { Link } from '../../atoms/link';
import { CommunityCard, CommunityCardAction, CommunityCardMark } from './CommunityCard';

/**
 * ## Description
 * A passive community card that invites readers into a community, server or collaboration as one
 * self-contained unit. It carries an optional two-line role line with a decorative diamond,
 * an optional consumer-supplied mark, a generated display heading, free body copy and one supplied
 * action pinned to the bottom edge.
 *
 * ## Dependencies
 * - Button / Link (consumer-supplied): the card's single interactive element lives in the action part.
 * - Surface recipes: the banded Material frame composes `surfaceVariants` internally.
 *
 * ## Usage guidelines
 * The card is passive: it adds no tab stop and never reacts to pointer hover; only the supplied
 * action is interactive. The mark must be one non-interactive element: named (`role="img"` with
 * `aria-label`, or `img` with `alt`) or decorative (`img alt=""`) when it repeats the visible name.
 * Non-image marks must fit within 153.6 × 51.2 CSS pixels without distortion; the card does not clip them.
 * Supply no mark artwork of your own invention on the card: the boxed wordmark in these stories is
 * consumer content, exactly as a real consumer would supply it. Card width and equal-height
 * stretching are consumer layout; the pinned action aligns across stretched cards with unequal copy.
 */
const meta: Meta<typeof CommunityCard> = {
  title: 'Molecules/CommunityCard',
  component: CommunityCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded'
  }
};

export default meta;

type Story = StoryObj<typeof CommunityCard>;

const logoSrc =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 42"%3E%3Ccircle cx="20" cy="21" r="12" fill="%23e94560"/%3E%3Ccircle cx="44" cy="21" r="12" fill="none" stroke="%23e94560" stroke-width="4"/%3E%3C/svg%3E';

/** Consumer wordmark content: a boxed `role="img"` element the card never paints itself. */
const wordmark = (
  <CommunityCardMark>
    <span
      role='img'
      aria-label='Stack and Flow'
      className='flex size-16 shrink-0 items-center justify-center rounded-lg border border-border-hairline bg-surface-0 text-center font-display text-xs leading-tight [font-weight:var(--text-heading-section--font-weight)]'
    >
      STACK &amp; FLOW
    </span>
  </CommunityCardMark>
);

/** Uses every optional part: role line, boxed wordmark, copy and the pinned primary action. */
export const Default: Story = {
  args: {
    title: 'Stack and Flow',
    eyebrow: 'My community',
    children: (
      <>
        <p>Where members of the studio share work in progress, review each other and ship together.</p>
        {wordmark}
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </>
    )
  }
};

/** An image logo mark joins the card content through its alternative text. */
export const WithImageMark: Story = {
  args: {
    title: 'Gentleman Programming',
    eyebrow: 'Open community',
    children: (
      <>
        <p>Streams, builds and code reviews with a community of builders.</p>
        <CommunityCardMark>
          <img src={logoSrc} alt='Gentleman Programming' className='h-16 w-auto' />
        </CommunityCardMark>
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </>
    )
  }
};

/** The web's boxed `role="img"` wordmark, supplied exactly as consumer mark content. */
export const WithWordmarkMark: Story = {
  args: {
    title: 'Stack and Flow',
    eyebrow: 'My community',
    children: (
      <>
        <p>Where members of the studio share work in progress, review each other and ship together.</p>
        {wordmark}
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </>
    )
  }
};

/** A mark that repeats the visible name stays decorative and is announced only once. */
export const DecorativeMark: Story = {
  args: {
    title: 'Gentleman Programming',
    eyebrow: 'Open community',
    children: (
      <>
        <p>Streams, builds and code reviews with a community of builders.</p>
        <CommunityCardMark>
          <img src={logoSrc} alt='' className='h-16 w-auto' />
        </CommunityCardMark>
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </>
    )
  }
};

/** Without a role line the top row collapses to the mark; the band still renders. */
export const WithoutEyebrow: Story = {
  args: {
    title: 'Gentleman Programming',
    children: (
      <>
        <p>Streams, builds and code reviews with a community of builders.</p>
        <CommunityCardMark>
          <img src={logoSrc} alt='Gentleman Programming' className='h-16 w-auto' />
        </CommunityCardMark>
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </>
    )
  }
};

/** The single action can be a primary Button; the card itself stays passive. */
export const WithButton: Story = {
  args: {
    title: 'Stack and Flow',
    eyebrow: 'My community',
    children: (
      <>
        <p>Where members of the studio share work in progress, review each other and ship together.</p>
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </>
    )
  }
};

/** The single action can be a Link; external destinations keep consumer target and rel. */
export const WithLink: Story = {
  args: {
    title: 'Stack and Flow',
    eyebrow: 'My community',
    children: (
      <>
        <p>Where members of the studio share work in progress, review each other and ship together.</p>
        <CommunityCardAction>
          <Link href='#community' variant='underlined'>
            Join the Discord
          </Link>
        </CommunityCardAction>
      </>
    )
  }
};

/** The native heading rank changes the outline position, never the display typography. */
export const HeadingRanks: Story = {
  render: () => (
    <div className='flex max-w-xl flex-col gap-6'>
      <CommunityCard title='Section child' level={3} eyebrow='Open community'>
        <p>A card under a section heading.</p>
      </CommunityCard>
      <CommunityCard title='Nested group' level={4} eyebrow='Open community'>
        <p>A card nested one outline level deeper.</p>
      </CommunityCard>
    </div>
  )
};

/** Long copy and long names wrap at word boundaries; nothing is truncated or clamped. */
export const LongContent: Story = {
  render: () => (
    <div className='w-72'>
      <CommunityCard
        title='A very long community name that must wrap across several lines inside a narrow card'
        eyebrow='Open community'
      >
        <p>
          A long body paragraph describing the community, its weekly calls and how new members join, written so every
          line wraps at word boundaries without ever being clamped.
        </p>
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </CommunityCard>
    </div>
  )
};

/** Matched cards and a full label show the two-line visual limit without removing the source text. */
export const LongEyebrow: Story = {
  render: () => {
    const label = 'A long community relationship line that continues beyond two lines at narrow card widths';
    return (
      <div className='flex flex-col gap-6'>
        <p>{label}</p>
        <div className='grid grid-cols-2 items-stretch gap-6'>
          <CommunityCard title='With mark' eyebrow={label}>
            {wordmark}
            <p>Shared description.</p>
            <CommunityCardAction>
              <Button>Join</Button>
            </CommunityCardAction>
          </CommunityCard>
          <CommunityCard title='Without mark' eyebrow={label}>
            <p>Shared description.</p>
            <CommunityCardAction>
              <Button>Join</Button>
            </CommunityCardAction>
          </CommunityCard>
        </div>
      </div>
    );
  }
};

/** Card width is consumer layout; in a stretched grid the pinned actions align across unequal copy. */
export const Widths: Story = {
  render: () => (
    <div className='grid max-w-3xl grid-cols-2 items-stretch gap-6'>
      <CommunityCard title='Fixed width' eyebrow='Open community' className='w-72'>
        <p>A short description.</p>
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </CommunityCard>
      <CommunityCard title='Stretched by the grid' eyebrow='My community'>
        <p>
          A much longer description that makes this card taller, so the neighbouring card's pinned action aligns with
          this one at the bottom edge of the stretched row.
        </p>
        <CommunityCardAction>
          <Button>Join the Discord</Button>
        </CommunityCardAction>
      </CommunityCard>
    </div>
  )
};
