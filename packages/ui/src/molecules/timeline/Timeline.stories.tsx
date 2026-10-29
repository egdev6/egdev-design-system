import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Button } from '../../atoms/button';
import { Icon } from '../../atoms/icon';
import { Surface } from '../../primitives/surface';
import { Timeline } from './Timeline';
import type { TimelineChatItem, TimelineEvent, TimelineProps } from './types';
import { timelineExampleLayoutVariants } from './types';

const events: [TimelineEvent, TimelineEvent, TimelineEvent, TimelineEvent] = [
  {
    id: 'release',
    time: { text: '04:20', dateTime: 'PT4M20S' },
    category: 'Release',
    body: 'A new version is available',
    tone: 'brand',
    highlighted: true
  },
  {
    id: 'joined',
    time: { text: '03:10', dateTime: 'PT3M10S' },
    category: 'Joined',
    body: 'A participant joined the session'
  },
  {
    id: 'milestone',
    time: { text: '02:05', dateTime: 'PT2M5S' },
    category: 'Milestone',
    body: 'The project reached its goal',
    tone: 'brand'
  },
  { id: 'start', time: { text: '00:00', dateTime: 'PT0S' }, category: 'Started', body: 'The session opened' }
];
const chat: [TimelineChatItem, TimelineChatItem, TimelineChatItem] = [
  {
    id: 'greeting',
    time: { text: '12:30', dateTime: '2026-10-29T12:30:00Z' },
    platform: { name: 'Twitch', icon: 'twitch' },
    author: { name: 'Alex' },
    message: 'Hello everyone'
  },
  {
    id: 'command',
    time: { text: '12:31', dateTime: '2026-10-29T12:31:00Z' },
    platform: { name: 'YouTube', icon: 'youtube' },
    author: { name: 'Jordan' },
    message: '!project',
    command: true
  },
  {
    id: 'moderator',
    time: { text: '12:32', dateTime: '2026-10-29T12:32:00Z' },
    platform: { name: 'Twitch', icon: 'twitch' },
    author: { name: 'Sam', moderator: true },
    message: 'Welcome to the session'
  }
];
const overflow: TimelineEvent[] = Array.from({ length: 30 }, (_, index) => ({
  ...events[1],
  id: `event-${index}`,
  body: `Recorded activity ${index + 1}`
}));
const chatArgs = { variant: 'chat', label: 'Live chat, oldest first', items: chat } satisfies TimelineProps;

function UpdatingChat({ history = false }: { history?: boolean }) {
  const [items, setItems] = useState(chat.slice(0, 1));
  const [silent, setSilent] = useState(history);
  return (
    <>
      <Button onClick={() => setItems([...items, { ...chat[0], id: `message-${items.length}` }])}>
        Append message
      </Button>
      {history && <Button onClick={() => setSilent(false)}>Enable live additions</Button>}
      <Timeline variant='chat' label='Live chat, oldest first' items={items} aria-live={silent ? 'off' : 'polite'} />
    </>
  );
}

/**
 * ## Description
 * A read-only ordered event history or plain-text chat transcript with bounded native scrolling.
 *
 * ## Dependencies
 * Radix ScrollArea owns scrolling and geometry. Avatar, Badge, Icon and VisuallyHidden supply identity.
 * Surface supplies only the scrollbar well; examples may compose an external Surface host.
 *
 * ## Usage guidelines
 * Supply stable unique ids, valid consumer-formatted times, passive event content and chronological chat.
 * Nothing sorts, parses commands, follows new messages or announces through a second channel.
 * Silence history with aria-live off, commit, then enable polite for future additions.
 * Native browser anchoring and exact assistive-technology speech remain browser/AT responsibilities.
 * className supports outer width, margin and placement only; size owns the viewport cap.
 */
const meta: Meta<typeof Timeline> = {
  title: 'Molecules/Timeline',
  component: Timeline,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Timeline>;

/** Only required args: default events/md are resolved by the component. */
export const Default: Story = { args: { label: 'Stream events, newest first', items: events } };
/** One native polite log, with readable platform and visible role/command qualifiers. */
export const Chat: Story = { args: chatArgs };
/** A host-controlled history update may opt out of live announcements. */
export const ChatSilent: Story = { args: { ...chatArgs, 'aria-live': 'off' } };
/** Oldest-first events remain exactly in supplied order, unlike the source board. */
export const EventOrder: Story = { args: { label: 'Events, oldest first', items: [...events].reverse() } };
/** Equal timestamps remain distinct entries identified only by their stable ids. */
export const EqualTimes: Story = { args: { label: 'Events', items: [events[0], { ...events[0], id: 'equal-time' }] } };
/** Repeated messages are not deduplicated or grouped. */
export const RepeatedMessages: Story = { args: { ...chatArgs, items: [chat[0], { ...chat[0], id: 'repeat' }] } };
/** Append through the host without a Timeline auto-follow or focus effect. */
export const ChatAppend: Story = { args: chatArgs, render: () => <UpdatingChat /> };
/** History starts live-off; enable polite in a separate host update before appending. */
export const ChatHistory: Story = { args: chatArgs, render: () => <UpdatingChat history={true} /> };
/** Updating an existing id changes text, not row identity or announcement priority. */
export const EditedMessage: Story = { args: { ...chatArgs, items: [{ ...chat[0], message: 'Corrected message' }] } };
/** Native busy metadata can coalesce a batch but is not a history-silencing switch. */
export const ChatBatch: Story = { args: { ...chatArgs, 'aria-busy': true } };
/** All caps use the existing 96px spacing token, multiplied by two, three and four. */
export const Sizes: Story = {
  args: { label: 'Events', items: overflow },
  render: (args) => (
    <>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Timeline key={size} {...args} size={size} />
      ))}
    </>
  )
};
/** Radix auto reveals the vertical track only when content overflows the cap. */
export const Overflow: Story = { args: { label: 'Events', items: overflow, size: 'sm' } };
/** A maximum is not a fixed height: short content leaves no forced blank area. */
export const Short: Story = { args: { label: 'Events', items: events.slice(0, 1), size: 'lg' } };
/** Focus the viewport; native browser scroll keys work without item navigation or trapping. */
export const KeyboardScroll: Story = { ...Overflow };
/** Direction changes layout, never the chronological array order. */
export const RTL: Story = { args: { ...chatArgs, dir: 'rtl' } };
/** HTML durations represent elapsed time without inventing a date. */
export const ElapsedTime: Story = { args: { label: 'Elapsed session events, newest first', items: events } };
/** Timezone-qualified wall-clock values are passed through, never reformatted. */
export const WallClock: Story = {
  args: { label: 'Events', items: [{ ...events[0], time: { text: '14:30', dateTime: '2026-10-29T14:30:00+02:00' } }] }
};
/** Platform names remain readable independently of decorative network glyphs. */
export const PlatformNames: Story = { args: { ...chatArgs, items: chat.slice(0, 2) } };
/** Moderator status includes a visible success Badge, never color alone. */
export const Moderator: Story = { args: { ...chatArgs, items: chat.slice(2) } };
/** The host supplies command metadata; Timeline does not infer it from the exclamation mark. */
export const Command: Story = { args: { ...chatArgs, items: chat.slice(1, 2) } };
/** An empty avatar object requests the fallback; omitted avatar renders no disc. */
export const WithAvatars: Story = {
  args: {
    ...chatArgs,
    items: [
      chat[0],
      { ...chat[1], author: { ...chat[1].author, avatar: {} } },
      { ...chat[2], author: { ...chat[2].author, avatar: { src: '/missing-avatar.png' } } }
    ]
  }
};
/** Plain strings are escaped without markup, command parsing or linkification. */
export const LiteralMessage: Story = {
  args: { ...chatArgs, items: [{ ...chat[0], message: '<b>!run https://example.test</b>' }] }
};
/** Event ReactNode bodies and glyphs must remain trusted and passive. */
export const RichEvent: Story = {
  args: {
    label: 'Events',
    items: [
      {
        ...events[0],
        icon: <Icon name='bell' size='sm' />,
        body: (
          <>
            <b>Release</b> completed successfully
          </>
        )
      }
    ]
  }
};
/** Highlight persists until the host removes the metadata; no timer is started. */
export const Highlighted: Story = { args: { label: 'Events', items: events.slice(0, 1) } };
/** Highlight background wins without hiding the Command label or mono text. */
export const HighlightedCommand: Story = { args: { ...chatArgs, items: [{ ...chat[1], highlighted: true }] } };
/** Empty feedback is a paragraph, never a fabricated row. */
export const EmptyEvents: Story = { args: { label: 'Events', items: [] } };
/** Empty chat retains one named log and no empty list. */
export const EmptyChat: Story = { args: { ...chatArgs, items: [] } };
/** Partial dictionaries retain defaults for every omitted key; data remains consumer copy. */
export const Localized: Story = { args: { ...chatArgs, messages: { moderator: 'Host', command: 'Instruction' } } };
/** Long unbroken names and messages wrap rather than ellipsizing their meaning. */
export const LongMessages: Story = {
  args: {
    ...chatArgs,
    items: [
      { ...chat[0], author: { name: 'LongAuthorName'.repeat(8) }, message: 'LongMessageWithoutSpaces'.repeat(20) }
    ]
  }
};
/** Whole concise Badges may move to another line without overriding Badge nowrap text. */
export const Narrow: Story = { args: { ...chatArgs, className: timelineExampleLayoutVariants({ layout: 'narrow' }) } };
/** Supported outer width and placement classes merge without changing internal recipes. */
export const ConsumerLayout: Story = {
  args: { label: 'Events', items: events, className: timelineExampleLayoutVariants({ layout: 'consumer' }) }
};
/** Host Material is external; Timeline never clones the board's flat box. */
export const EventsInSurface: Story = {
  args: Default.args,
  render: (args) => (
    <Surface>
      <Timeline {...args} />
    </Surface>
  )
};
/** A Surface host supplies paint without becoming another live region. */
export const ChatInSurface: Story = {
  args: chatArgs,
  render: (args) => (
    <Surface>
      <Timeline {...args} />
    </Surface>
  )
};
