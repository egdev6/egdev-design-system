import { render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { useTimeline } from '@/molecules/timeline/useTimeline';
import type { TimelineChatItem, TimelineEvent, TimelineProps } from './index';
import { Timeline } from './index';

const event: TimelineEvent = {
  id: 'start',
  time: { text: '01:13', dateTime: 'PT1M13S' },
  category: 'Started',
  body: 'Session opened'
};
const chat: TimelineChatItem = {
  id: 'message',
  time: { text: '12:30', dateTime: '2026-10-29T12:30:00Z' },
  platform: { name: 'Community stream', icon: 'twitch' },
  author: { name: 'Alex' },
  message: 'Hello'
};

// jsdom has no layout observer; do not mock Radix interaction, focus or semantics.
beforeAll(() =>
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {
        /* No browser layout in jsdom. */
      }
      unobserve() {
        /* No observer subscription to remove. */
      }
      disconnect() {
        /* No observer subscription to remove. */
      }
    }
  )
);
afterAll(() => vi.unstubAllGlobals());

describe('Timeline public contract', () => {
  it('defaults to a named live-off events region and native ordered list', () => {
    render(<Timeline label='Events, newest first' items={[event]} />);
    const root = screen.getByRole('region', { name: 'Events, newest first' });
    expect(root).toHaveClass('eg-timeline', 'block');
    expect(root).toHaveAttribute('data-variant', 'events');
    expect(root).toHaveAttribute('data-size', 'md');
    expect(root).toHaveAttribute('aria-live', 'off');
    expect(within(root).getByRole('list').tagName).toBe('OL');
    expect(within(root).getAllByRole('listitem')).toHaveLength(1);
    expect(screen.getByText('01:13')).toHaveAttribute('datetime', 'PT1M13S');
  });

  it('uses one log live mechanism, readable platform and visible qualifiers', () => {
    render(
      <Timeline
        variant='chat'
        label='Chat'
        items={[{ ...chat, command: true, author: { name: 'Alex', moderator: true } }]}
      />
    );
    const root = screen.getByRole('log', { name: 'Chat' });
    expect(root).toHaveAttribute('aria-live', 'polite');
    expect(root).toHaveAttribute('aria-relevant', 'additions');
    expect(root).toHaveAttribute('aria-atomic', 'false');
    expect(root.querySelectorAll('[aria-live]')).toHaveLength(0);
    expect(screen.getByText('Community stream')).toBeInTheDocument();
    expect(screen.getByText('Moderator')).toBeVisible();
    expect(screen.getByText('Command')).toBeVisible();
    expect(screen.getByText('Alex')).toHaveAttribute('data-role', 'moderator');
    expect(screen.getByText('Hello')).toHaveClass('eg-timeline__cmd');
    expect(screen.getByText('12:30')).toHaveAttribute('datetime', chat.time.dateTime);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('preserves supplied order, repeated content, equal times and keyed row identity', () => {
    const second = { ...event, id: 'second' };
    const { rerender } = render(<Timeline label='Events' items={[event, second]} />);
    const original = screen.getAllByRole('listitem');
    rerender(<Timeline label='Events' items={[{ ...second, body: 'Changed' }, event, { ...event, id: 'third' }]} />);
    const updated = screen.getAllByRole('listitem');
    expect(updated[0]).toBe(original[1]);
    expect(updated[1]).toBe(original[0]);
    expect(updated[0]).toHaveTextContent('Changed');
    rerender(<Timeline label='Events' items={[event]} />);
    expect(screen.getAllByRole('listitem')).toEqual([original[0]]);
  });

  it('appends, edits and backfills chat without forced focus or scrolling', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<Timeline variant='chat' label='Chat' aria-live='off' items={[chat]} />);
    const viewport = screen.getByRole('group', { name: 'Chat' });
    await user.tab();
    expect(viewport).toHaveFocus();
    viewport.scrollTop = 17;
    const focus = vi.spyOn(HTMLElement.prototype, 'focus');
    const first = screen.getByRole('listitem');
    rerender(
      <Timeline
        variant='chat'
        label='Chat'
        items={[
          { ...chat, highlighted: true, message: 'Edited' },
          { ...chat, id: 'append' }
        ]}
      />
    );
    expect(screen.getAllByRole('listitem')[0]).toBe(first);
    expect(first).toHaveAttribute('data-state', 'highlighted');
    expect(viewport).toHaveFocus();
    expect(viewport.scrollTop).toBe(17);
    expect(focus).not.toHaveBeenCalled();
    rerender(
      <Timeline
        variant='chat'
        label='Chat'
        aria-live='off'
        aria-busy={true}
        items={[{ ...chat, id: 'history' }, chat]}
      />
    );
    expect(screen.getByRole('log')).toHaveAttribute('aria-live', 'off');
    expect(screen.getByRole('log')).toHaveAttribute('aria-busy', 'true');
    expect(screen.getAllByRole('listitem')[1]).toBe(first);
    expect(first).not.toHaveAttribute('data-state');
    focus.mockRestore();
  });

  it('has one viewport tab stop and lets Tab leave normally', async () => {
    const user = userEvent.setup();
    render(
      <>
        <button type='button'>Before</button>
        <Timeline variant='chat' label='Chat' items={[chat]} />
        <button type='button'>After</button>
      </>
    );
    await user.tab();
    expect(screen.getByRole('button', { name: 'Before' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('group', { name: 'Chat' })).toHaveFocus();
    await user.tab();
    expect(screen.getByRole('button', { name: 'After' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('group', { name: 'Chat' })).toHaveFocus();
  });

  it.each(['events', 'chat'] as const)('shows localized empty %s feedback outside a list', (variant) => {
    render(
      variant === 'chat' ? (
        <Timeline variant='chat' label='History' items={[]} />
      ) : (
        <Timeline label='History' items={[]} />
      )
    );
    const text = screen.getByText(variant === 'events' ? 'No events yet' : 'No messages yet');
    expect(text.tagName).toBe('P');
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });

  it('merges partial messages without changing content data', () => {
    const { rerender } = render(<Timeline label='History' items={[]} messages={{ emptyEvents: 'Nothing recorded' }} />);
    expect(screen.getByText('Nothing recorded')).toBeVisible();
    rerender(
      <Timeline
        variant='chat'
        label='Chat'
        items={[{ ...chat, command: true, author: { name: 'Alex', moderator: true } }]}
        messages={{ command: 'Instruction' }}
      />
    );
    expect(screen.getByText('Instruction')).toBeVisible();
    expect(screen.getByText('Moderator')).toBeVisible();
    expect(screen.getByText('Alex')).toBeVisible();
  });

  it('escapes chat strings and never parses commands or links', () => {
    render(<Timeline variant='chat' label='Chat' items={[{ ...chat, message: '<b>!run https://example.test</b>' }]} />);
    expect(screen.getByText('<b>!run https://example.test</b>')).toBeVisible();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
    expect(screen.queryByText('Command')).not.toBeInTheDocument();
  });

  it('renders passive rich events and hides the optional category icon', () => {
    render(
      <Timeline
        label='Events'
        items={[
          {
            ...event,
            tone: 'brand',
            body: (
              <>
                <b>Release</b> completed
              </>
            ),
            icon: <svg aria-label='Duplicate category' />
          }
        ]}
      />
    );
    expect(screen.getByText('Release').tagName).toBe('B');
    const category = screen.getByText('Started');
    expect(category).toHaveAttribute('data-tone', 'brand');
    expect(category.querySelector('[aria-hidden=true]')).toBeInTheDocument();
  });

  it('only creates a decorative sm Avatar when the avatar object is supplied', () => {
    const { rerender } = render(<Timeline variant='chat' label='Chat' items={[chat]} />);
    expect(screen.getByRole('log').querySelector('.eg-avatar')).toBeNull();
    rerender(<Timeline variant='chat' label='Chat' items={[{ ...chat, author: { name: 'Alex', avatar: {} } }]} />);
    const avatar = screen.getByRole('log').querySelector('.eg-avatar');
    expect(avatar).toHaveAttribute('aria-hidden', 'true');
    expect(avatar).toHaveClass('size-6');
    rerender(
      <Timeline
        variant='chat'
        label='Chat'
        items={[{ ...chat, author: { name: 'Alex', avatar: { src: 'https://example.test/avatar.png' } } }]}
      />
    );
    expect(screen.getByRole('log').querySelector('.eg-avatar')).toHaveAttribute('aria-hidden', 'true');
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('keeps highlight and command as independent host-controlled metadata', () => {
    const { rerender } = render(
      <Timeline variant='chat' label='Chat' items={[{ ...chat, command: true, highlighted: true }]} />
    );
    const row = screen.getByRole('listitem');
    expect(row).toHaveAttribute('data-state', 'highlighted');
    expect(row).toHaveAttribute('data-kind', 'command');
    expect(row).toHaveClass('not-data-[state=highlighted]:data-[kind=command]:bg-fg-default/3');
    expect(screen.getByText('Command')).toBeVisible();
    rerender(<Timeline variant='chat' label='Chat' items={[chat]} />);
    expect(row).not.toHaveAttribute('data-state');
    expect(row).toHaveAttribute('data-kind', 'message');
    expect(screen.queryByText('Command')).not.toBeInTheDocument();
    expect(row.className).not.toMatch(/is-new|is-command|--chat/);
  });

  it.each([
    ['sm', 2],
    ['md', 3],
    ['lg', 4]
  ] as const)('caps %s without a fixed height', (size, multiplier) => {
    render(<Timeline label='Events' items={[event]} size={size} />);
    const viewport = screen.getByRole('group');
    expect(viewport).toHaveClass(`max-h-[calc(var(--space-24)*${multiplier})]`);
    expect(viewport.className).not.toMatch(/(?:^|\s)(?:h|min-h)-/);
    expect(viewport).toHaveStyle({ overflowX: 'hidden', overflowY: 'scroll' });
  });

  it('protects semantics from untyped overrides and forwards compatible root attributes', () => {
    const injected = {
      role: 'menu',
      tabIndex: 9,
      contentEditable: true,
      children: 'Injected',
      dangerouslySetInnerHTML: { __html: '<b>Injected</b>' },
      'aria-label': 'Wrong',
      'aria-labelledby': 'wrong',
      'aria-live': 'assertive',
      'aria-relevant': 'all',
      'aria-atomic': true,
      'aria-selected': true,
      'aria-pressed': true
    };
    render(
      <Timeline
        {...(injected as unknown as Extract<TimelineProps, { variant?: 'events' }>)}
        variant='events'
        label='Events'
        items={[event]}
        id='history'
        title='History'
        aria-describedby='help'
        data-consumer='yes'
        className='w-full mt-3'
        dir='rtl'
      />
    );
    const root = screen.getByRole('region', { name: 'Events' });
    expect(root).toHaveAttribute('id', 'history');
    expect(root).toHaveAttribute('dir', 'rtl');
    expect(root).toHaveAttribute('data-consumer', 'yes');
    expect(root).toHaveAttribute('aria-describedby', 'help');
    expect(root).toHaveClass('w-full', 'mt-3');
    expect(root).toHaveAttribute('aria-live', 'off');
    for (const attr of [
      'tabindex',
      'contenteditable',
      'aria-labelledby',
      'aria-selected',
      'aria-pressed',
      'aria-relevant',
      'aria-atomic'
    ]) {
      expect(root).not.toHaveAttribute(attr);
    }
    expect(screen.queryByText('Injected')).not.toBeInTheDocument();
  });

  it('keeps repeated chat messages and equal times as distinct keyed entries', () => {
    const repeated = { ...chat, id: 'repeat' };
    const { rerender } = render(<Timeline variant='chat' label='Chat' items={[chat, repeated]} />);
    const rows = screen.getAllByRole('listitem');
    expect(screen.getAllByText('Hello')).toHaveLength(2);
    rerender(<Timeline variant='chat' label='Chat' items={[repeated, chat]} />);
    expect(screen.getAllByRole('listitem')).toEqual([rows[1], rows[0]]);
    rerender(<Timeline variant='chat' label='Chat' items={[chat]} />);
    expect(screen.getByRole('listitem')).toBe(rows[0]);
  });

  it('recomputes variant semantics and clamps an untyped chat live priority', () => {
    const { rerender } = render(<Timeline label='History' items={[event]} />);
    const untyped = { 'aria-live': 'assertive' } as unknown as Extract<TimelineProps, { variant: 'chat' }>;
    rerender(<Timeline {...untyped} variant='chat' label='History' items={[chat]} />);
    expect(screen.queryByRole('region')).not.toBeInTheDocument();
    expect(screen.getByRole('log')).toHaveAttribute('aria-live', 'polite');
    rerender(<Timeline label='History' items={[]} messages={{ emptyEvents: 'Empty history' }} />);
    expect(screen.queryByRole('log')).not.toBeInTheDocument();
    expect(screen.getByRole('region')).not.toHaveAttribute('aria-relevant');
    expect(screen.getByText('Empty history')).toBeVisible();
  });

  it('derives typed parts, defaults and silent chat policy in the hook', () => {
    const { result } = renderHook(() => useTimeline({ variant: 'chat', label: 'Chat', items: [], 'aria-live': 'off' }));
    expect(result.current.rootProps['aria-live']).toBe('off');
    expect(result.current.viewportProps.tabIndex).toBe(0);
    expect(result.current.emptyText).toBe('No messages yet');
    expect(result.current.scrollbarProps['aria-hidden']).toBe(true);
    expect(result.current.scrollbarProps.orientation).toBe('vertical');
    expect(result.current.scrollbarProps.className).toContain('eg-surface');
  });
});
