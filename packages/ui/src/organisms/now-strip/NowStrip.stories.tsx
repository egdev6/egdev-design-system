import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '../../atoms/badge';
import { Link } from '../../atoms/link';
import { NowCard, NowCardBody, NowCardDetail, NowCardFooter } from '../../molecules/now-card';
import { NowStrip } from './NowStrip';

const exampleCards = [
  <NowCard key='building' title='Building' size='sm' statusBadge={<Badge>In progress</Badge>}>
    <NowCardBody>
      <p>Making space for new ideas.</p>
    </NowCardBody>
    <NowCardFooter>
      <NowCardDetail>
        Next <b>review</b>
      </NowCardDetail>
      <Link href='#building'>Explore</Link>
    </NowCardFooter>
  </NowCard>,
  <NowCard key='reading' title='Reading' size='sm'>
    <NowCardBody>
      <p>Exploring a longer collection of notes and references.</p>
    </NowCardBody>
  </NowCard>,
  <NowCard key='writing' title='Writing' size='sm'>
    <NowCardBody>
      <p>Preparing a new article.</p>
    </NowCardBody>
  </NowCard>
];

/** A passive activity group on a host-owned Grafito reading surface. Consumers supply compact cards. */
const meta: Meta<typeof NowStrip> = {
  title: 'Organisms/NowStrip',
  component: NowStrip,
  tags: ['autodocs'],
  args: { label: 'Currently', children: exampleCards }
};
export default meta;
type Story = StoryObj<typeof NowStrip>;

/** Three consumer-authored cards, with no built-in activity data. */
export const Default: Story = {};
/** An empty named group has no placeholder. */
export const Empty: Story = { args: { children: null } };
/** Long content remains visible and wraps naturally. */
export const LongContent: Story = {
  args: {
    children: (
      <NowCard title='A longer activity title' size='sm'>
        <NowCardBody>
          <p>A longer description continues across lines without truncation or pagination.</p>
        </NowCardBody>
      </NowCard>
    )
  }
};
const footer = (id: string) => (
  <NowCardFooter>
    <NowCardDetail>
      Next <b>update</b>
    </NowCardDetail>
    <Link href={`#${id}`}>Explore</Link>
  </NowCardFooter>
);

/** Uneven bodies, an optional badge and a second row: cards stretch and their footer bands align at the bottom. */
export const UnevenCards: Story = {
  args: {
    children: [
      <NowCard key='building' title='Building' size='sm' statusBadge={<Badge>In progress</Badge>}>
        <NowCardBody>
          <p>Making space for new ideas.</p>
        </NowCardBody>
        {footer('building')}
      </NowCard>,
      <NowCard key='reading' title='Reading' size='sm'>
        <NowCardBody>
          <p>
            Exploring a longer collection of notes and references that wraps across several lines in a narrow column.
          </p>
        </NowCardBody>
        {footer('reading')}
      </NowCard>,
      <NowCard key='writing' title='Writing' size='sm'>
        <NowCardBody>
          <p>Preparing a new article.</p>
        </NowCardBody>
        {footer('writing')}
      </NowCard>,
      <NowCard key='learning' title='Learning' size='sm'>
        <NowCardBody>
          <p>Another activity.</p>
        </NowCardBody>
      </NowCard>
    ]
  }
};
/** Resize the viewport around 860px to inspect the grid. */
export const Responsive: Story = {};
/** Each group owns a unique accessible label association. */
export const MultipleInstances: Story = {
  render: (args) => (
    <>
      <NowStrip {...args} />
      <NowStrip label='More activities'>{exampleCards}</NowStrip>
    </>
  )
};
/** Tab to the supplied link; the group itself is not a tab stop. */
export const Keyboard: Story = {};
