import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoFrame } from '../../atoms/photo-frame';
import { ArticleFeature, ArticleFeatureCover } from './ArticleFeature';

/**
 * ## Description
 * A featured-article card rendered as one whole-card link. The card carries a reserved 16:8 cover
 * (a recessed generative plate with an oversized decorative word, or a supplied photograph), an
 * optional featured badge, an optional context row (category plus a short detail), a generated
 * heading and an optional paint-only action label. The card element is the single link: there is
 * no nested action and no second tab stop.
 *
 * ## Dependencies
 * `ArticleFeatureCover` reserves its proportion through the public `AspectRatio` primitive and
 * composes the public `PhotoFrame` atom (with `ratio="auto"`) for photographic covers. The badge
 * reuses the public `Badge`, the action arrow reuses the public `Icon`, and the frame composes the
 * public Surface recipes plus the approved `ListItem` anchor hover treatment.
 *
 * ## Usage guidelines
 * Supply every string, the destination (or the anchor itself through `asChild`), the photograph
 * and its alternative, and the formatted date or reading time. On the media branch, compose the
 * child as exactly one `PhotoFrame ratio="auto"` so the cover keeps its reserved 16:8 proportion;
 * a child with its own ratio breaks the reservation and warns in development. A cover whose
 * meaning already lives in the title should use `alt=""`, because an informative `alt` joins the
 * card's accessible name; a consumer that wants a shorter name can supply `aria-label`, which
 * then replaces the content name. `className` supports outer layout only.
 */
const meta = {
  title: 'Molecules/ArticleFeature',
  component: ArticleFeature,
  tags: ['autodocs']
} satisfies Meta<typeof ArticleFeature>;
export default meta;
type Story = StoryObj<typeof meta>;

/** Canonical card: generative cover with badge, context row, generated heading and action label. */
export const Default: Story = {
  args: {
    title: 'Design tokens in production',
    href: '/blog/design-tokens',
    children: <ArticleFeatureCover coverWord='/src' badge='Featured' />,
    eyebrow: 'Architecture',
    detail: '12 min · 18 Sep 2026',
    actionLabel: 'Read article'
  }
};

/** A router link receives the whole card through Radix Slot and keeps its own semantics. */
export const AsChildLink: Story = {
  args: {
    title: 'Router-driven featured article',
    asChild: true,
    children: <ArticleFeatureCover coverWord='/src' />,
    actionLabel: 'Read article'
  },
  render: (args) => (
    <ArticleFeature {...args}>
      <a href='/blog/router-driven' />
    </ArticleFeature>
  )
};

/** The generative branch: a recessed well holding the oversized decorative ghost word. */
export const GenerativeCover: Story = {
  args: {
    title: 'Building the design system in the open',
    href: '/blog/open-design-system',
    children: <ArticleFeatureCover coverWord='/design-system' />,
    eyebrow: 'Design systems',
    detail: '8 min · 02 Oct 2026'
  }
};

/**
 * The media branch: the supplied `PhotoFrame ratio="auto"` fills the reserved 16:8 region. A child
 * with its own ratio breaks the reservation and warns in development.
 */
export const MediaCover: Story = {
  args: {
    title: 'Choosing focal points for editorial photography',
    href: '/blog/focal-points',
    children: (
      <ArticleFeatureCover>
        <PhotoFrame
          ratio='auto'
          src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NDAiIGhlaWdodD0iMzIwIj48cmVjdCB3aWR0aD0iNjQwIiBoZWlnaHQ9IjMyMCIgZmlsbD0iIzFhMWExYSIvPjxjaXJjbGUgY3g9IjMyMCIgY3k9IjE2MCIgcj0iODAiIGZpbGw9IiMzYTNhM2EiLz48L3N2Zz4='
          alt=''
        />
      </ArticleFeatureCover>
    ),
    eyebrow: 'Photography',
    detail: '6 min · 25 Sep 2026',
    actionLabel: 'Read article'
  }
};

/** The context row renders the category in brand ink and the detail in secondary ink. */
export const ContextRow: Story = {
  args: {
    title: 'Context row above the heading',
    href: '/blog/context-row',
    eyebrow: 'Directos',
    detail: '8 min · 20 Sep 2026'
  }
};

/** A single supplied value renders the row without a dangling separator. */
export const DetailOnly: Story = {
  args: {
    title: 'Detail without a category',
    href: '/blog/detail-only',
    detail: '5 min · 30 Sep 2026'
  }
};

/** The action label is paint and text only: the whole card is the single activation target. */
export const WithActionLabel: Story = {
  args: {
    title: 'One action per featured slot',
    href: '/blog/one-action',
    actionLabel: 'Read article'
  }
};

/** Long titles and details wrap without truncation; the action label stays pinned to the bottom. */
export const LongContent: Story = {
  args: {
    title: 'A very long featured article title that wraps across several narrow lines instead of being truncated',
    href: '/blog/long-content',
    className: 'w-72',
    eyebrow: 'Architecture',
    detail: 'twelve minutes of reading time plus the nineteenth of September in the year twenty twenty-six',
    actionLabel: 'Read article'
  }
};

/** Card width is consumer layout: the same card at a narrow and a wide host width. */
export const Widths: Story = {
  args: { title: 'Width comparison', href: '/blog/widths', children: null },
  render: () => (
    <div className='flex flex-wrap items-start gap-4'>
      <ArticleFeature title='Narrow card' href='/blog/narrow' className='w-72'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
      <ArticleFeature title='Wide card' href='/blog/wide' className='w-[32rem]'>
        <ArticleFeatureCover coverWord='/src' />
      </ArticleFeature>
    </div>
  )
};

/** Under reduced motion the hover and focus transitions are removed; nothing moves in any case. */
export const ReducedMotion: Story = {
  args: {
    title: 'Reduced motion keeps the frame still',
    href: '/blog/reduced-motion',
    eyebrow: 'Architecture',
    actionLabel: 'Read article'
  }
};
