import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import { Link } from '../../atoms/link';
import { NowCard, NowCardBody, NowCardDetail, NowCardFooter } from './NowCard';

/**
 * ## Description
 * Passive current-status article for "what I am doing now" strips: an optional status badge, a
 * generated heading, free body copy and a footer band holding one supporting detail and/or one
 * action. The card never polls, schedules or announces; the consumer supplies every word, date
 * and control.
 *
 * ## Dependencies
 * Surface's elevated recipe supplies the Material frame and the surface-0 footer band; Badge,
 * Link and IconButton are consumer compositions the card never requires.
 *
 * ## Usage guidelines
 * Supply the status badge through the statusBadge slot: the card renders it itself as its first
 * content, before the heading (badge → title → copy, as the web card reads). The body holds copy
 * only. Keep at most one action in the footer and mark emphasized detail values with <b> (wrap
 * real instants in <time dateTime>). Density never clamps or hides supplied content, so consumers
 * shorten their own copy. The card adds no tab stop, no hover motion and no live region.
 */
const meta: Meta<typeof NowCard> = {
  title: 'Molecules/NowCard',
  component: NowCard,
  tags: ['autodocs'],
  args: { title: 'Currently building' }
};
export default meta;
type Story = StoryObj<typeof NowCard>;

/** Badge slot, copy and a banded footer with a detail and an underlined link. */
export const Default: Story = {
  render: () => (
    <NowCard
      title='Currently building'
      statusBadge={
        <Badge tone='brand' variant='soft'>
          Building
        </Badge>
      }
    >
      <NowCardBody>
        <p>Porting the web catalog molecules into the design system.</p>
      </NowCardBody>
      <NowCardFooter>
        <NowCardDetail>
          Layer (c) <b>in review</b>
        </NowCardDetail>
        <Link href='#building' variant='underlined'>
          Follow along
        </Link>
      </NowCardFooter>
    </NowCard>
  )
};

/** The status pill is a plain Badge composition in the leading slot; the card never bakes a tone. */
export const WithBadge: Story = {
  render: () => (
    <NowCard
      title='Currently exploring'
      statusBadge={
        <Badge tone='brand' variant='soft' icon={<Icon name='compass' />}>
          Exploring
        </Badge>
      }
    >
      <NowCardBody>
        <p>Testing token-backed density presets for compact card strips.</p>
      </NowCardBody>
    </NowCard>
  )
};

/** A footer action keeps its native anchor semantics, hover and focus treatment. */
export const WithLink: Story = {
  render: () => (
    <NowCard title='Currently writing'>
      <NowCardBody>
        <p>Drafting the layer (c) catalog notes.</p>
      </NowCardBody>
      <NowCardFooter>
        <NowCardDetail>
          Draft <b>v0.2</b>
        </NowCardDetail>
        <Link href='#writing' variant='underlined'>
          Read the draft
        </Link>
      </NowCardFooter>
    </NowCard>
  )
};

/** A machine-readable instant inside the emphasized value stays consumer-owned. */
export const WithNextDate: Story = {
  render: () => (
    <NowCard
      title='Currently streaming'
      statusBadge={
        <Badge tone='brand' variant='soft'>
          Streaming
        </Badge>
      }
    >
      <NowCardBody>
        <p>Live coding session on the design system.</p>
      </NowCardBody>
      <NowCardFooter>
        <NowCardDetail>
          Next stream{' '}
          <b>
            <time dateTime='2026-11-05T18:00:00Z'>Thu 18:00</time>
          </b>
        </NowCardDetail>
        <IconButton label='Open stream' variant='outline' icon={<Icon name='twitch' />} />
      </NowCardFooter>
    </NowCard>
  )
};

/** A single footer child aligns to the leading edge; the footer is not stretched into an empty cell. */
export const WithSingleChild: Story = {
  render: () => (
    <NowCard title='Currently shipping'>
      <NowCardFooter>
        <NowCardDetail>
          Released <b>v0.1</b>
        </NowCardDetail>
      </NowCardFooter>
    </NowCard>
  )
};

/** Both densities render every supplied part; sm shrinks padding and the heading/body copy steps. */
export const Sizes: Story = {
  render: () => (
    <div className='grid gap-4'>
      <NowCard
        title='Currently building'
        size='md'
        statusBadge={
          <Badge tone='brand' variant='soft'>
            Building
          </Badge>
        }
      >
        <NowCardBody>
          <p>Standard-density card copy.</p>
        </NowCardBody>
        <NowCardFooter>
          <NowCardDetail>
            Size <b>md</b>
          </NowCardDetail>
        </NowCardFooter>
      </NowCard>
      <NowCard
        title='Currently building'
        size='sm'
        statusBadge={
          <Badge tone='brand' variant='soft'>
            Building
          </Badge>
        }
      >
        <NowCardBody>
          <p>Compact three-up strip copy that still renders in full.</p>
        </NowCardBody>
        <NowCardFooter>
          <NowCardDetail>
            Size <b>sm</b>
          </NowCardDetail>
        </NowCardFooter>
      </NowCard>
    </div>
  )
};

/** The rank never changes the visual step, only the outline. */
export const HeadingRanks: Story = {
  render: () => (
    <div className='grid gap-4'>
      <NowCard title='Ranked second' level={2}>
        <NowCardBody>
          <p>Heading rank two.</p>
        </NowCardBody>
      </NowCard>
      <NowCard title='Ranked fourth' level={4}>
        <NowCardBody>
          <p>Heading rank four.</p>
        </NowCardBody>
      </NowCard>
      <NowCard title='Ranked sixth' level={6}>
        <NowCardBody>
          <p>Heading rank six.</p>
        </NowCardBody>
      </NowCard>
    </div>
  )
};

/** Long copy and long details wrap at word boundaries; nothing is clamped, hidden or reordered. */
export const LongContent: Story = {
  render: () => (
    <div style={{ width: 240 }}>
      <NowCard title='Currently building a very long descriptive status title'>
        <NowCardBody>
          <p>
            Shipping an unusually long status sentence that must wrap at word boundaries inside a narrow grid column
            without ever being clamped, truncated or replaced by a tooltip.
          </p>
        </NowCardBody>
        <NowCardFooter>
          <NowCardDetail>
            Next milestone lands after the final review pass of the second batch{' '}
            <b>
              <time dateTime='2026-11-05T18:00:00Z'>Thu 18:00</time>
            </b>
          </NowCardDetail>
        </NowCardFooter>
      </NowCard>
    </div>
  )
};

/**
 * The card owns no transition, animation or hover movement: the pointer changes nothing and the
 * only motion belongs to the supplied action's own treatment.
 */
export const ReducedMotion: Story = {
  render: () => (
    <NowCard title='Currently building'>
      <NowCardBody>
        <p>Hover the card: no lift, no glow and no pointer cursor.</p>
      </NowCardBody>
      <NowCardFooter>
        <NowCardDetail>
          Passive <b>frame</b>
        </NowCardDetail>
        <Link href='#passive' variant='underlined'>
          Supplied action only
        </Link>
      </NowCardFooter>
    </NowCard>
  )
};
