import type * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { AvatarProps } from '../../atoms/avatar';
import type { BadgeProps } from '../../atoms/badge';
import type { IconProps } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { TimelineMessages, TimelineProps } from './types';
import {
  timelineAuthorVariants,
  timelineBodyVariants,
  timelineCategoryVariants,
  timelineEmptyVariants,
  timelineIconWrapperVariants,
  timelineIdentityVariants,
  timelineItemVariants,
  timelineListVariants,
  timelineMessageVariants,
  timelinePlatformVariants,
  timelineScrollbarVariants,
  timelineThumbVariants,
  timelineTimeVariants,
  timelineVariants,
  timelineViewportVariants
} from './types';

type Part<T extends 'div' | 'span' | 'strong' | 'li' | 'ol' | 'time' | 'p'> = ComponentPropsWithoutRef<T> & {
  'data-state'?: 'highlighted';
  'data-kind'?: 'command' | 'message';
  'data-tone'?: 'neutral' | 'brand';
  'data-role'?: 'moderator';
};
type Row = {
  key: string;
  rowProps: Part<'li'>;
  timeProps: Part<'time'>;
  timeText: string;
  bodyProps: Part<'div'>;
} & (
  | {
      kind: 'events';
      categoryProps: Part<'span'>;
      category: string;
      icon: ReactNode;
      showIcon: boolean;
      body: ReactNode;
    }
  | {
      kind: 'chat';
      platformProps: Part<'span'>;
      platformIconProps: IconProps;
      platformName: string;
      authorProps: Part<'strong'>;
      authorName: string;
      avatarProps: AvatarProps | undefined;
      moderatorProps: BadgeProps | undefined;
      commandProps: BadgeProps | undefined;
      messageProps: Part<'span'>;
      message: string;
    }
);

export type UseTimelineResult = {
  rootProps: ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> & {
    'data-variant': 'events' | 'chat';
    'data-size': 'sm' | 'md' | 'lg';
  };
  viewportProps: ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Viewport>;
  listProps: Part<'ol'>;
  emptyProps: Part<'p'>;
  emptyText: string;
  rows: Row[];
  iconWrapperProps: Part<'span'>;
  identityProps: Part<'span'>;
  scrollbarProps: ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Scrollbar>;
  thumbProps: ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Thumb>;
};

const defaultMessages: TimelineMessages = {
  emptyEvents: 'No events yet',
  emptyChat: 'No messages yet',
  moderator: 'Moderator',
  command: 'Command'
};
type OwnedProps = {
  children?: unknown;
  dangerouslySetInnerHTML?: unknown;
  role?: unknown;
  tabIndex?: unknown;
  contentEditable?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  'aria-atomic'?: unknown;
  'aria-relevant'?: unknown;
  'aria-selected'?: unknown;
  'aria-pressed'?: unknown;
  asChild?: unknown;
  ref?: unknown;
  type?: unknown;
  scrollHideDelay?: unknown;
  __scopeScrollArea?: unknown;
};

/** Pure derivation only: the host owns data, timing and history silence; Radix owns scrolling. */
export function useTimeline(props: TimelineProps): UseTimelineResult {
  const {
    label,
    size = 'md',
    variant = 'events',
    items: _items,
    messages: overrides,
    dir,
    className,
    'aria-live': live,
    children: _children,
    dangerouslySetInnerHTML: _html,
    role: _role,
    tabIndex: _tabIndex,
    contentEditable: _editable,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    'aria-atomic': _atomic,
    'aria-relevant': _relevant,
    'aria-selected': _selected,
    'aria-pressed': _pressed,
    asChild: _asChild,
    ref: _ref,
    type: _type,
    scrollHideDelay: _delay,
    __scopeScrollArea: _scope,
    ...rest
  } = props as TimelineProps & OwnedProps;
  const messages = { ...defaultMessages, ...overrides };
  const rowClass = cn(timelineItemVariants({ variant }));
  const timeClass = cn(timelineTimeVariants());
  const bodyClass = cn(timelineBodyVariants());
  const rows: Row[] =
    props.variant === 'chat'
      ? props.items.map(
          (item): Row => ({
            key: item.id,
            kind: 'chat',
            rowProps: {
              className: rowClass,
              'data-state': item.highlighted ? 'highlighted' : undefined,
              'data-kind': item.command ? 'command' : 'message'
            },
            timeProps: { className: timeClass, dateTime: item.time.dateTime },
            timeText: item.time.text,
            bodyProps: { className: bodyClass },
            platformProps: { className: cn(timelinePlatformVariants()) },
            platformIconProps: { name: item.platform.icon, size: 'sm' },
            platformName: item.platform.name,
            authorProps: {
              className: cn(timelineAuthorVariants()),
              'data-role': item.author.moderator ? 'moderator' : undefined
            },
            authorName: item.author.name,
            avatarProps: item.author.avatar ? { src: item.author.avatar.src, size: 'sm' } : undefined,
            moderatorProps: item.author.moderator ? { tone: 'success', children: messages.moderator } : undefined,
            commandProps: item.command ? { tone: 'neutral', children: messages.command } : undefined,
            messageProps: { className: cn(timelineMessageVariants({ command: item.command ?? false })) },
            message: item.message
          })
        )
      : props.items.map(
          (item): Row => ({
            key: item.id,
            kind: 'events',
            rowProps: { className: rowClass, 'data-state': item.highlighted ? 'highlighted' : undefined },
            timeProps: { className: timeClass, dateTime: item.time.dateTime },
            timeText: item.time.text,
            bodyProps: { className: bodyClass },
            categoryProps: { className: cn(timelineCategoryVariants()), 'data-tone': item.tone ?? 'neutral' },
            category: item.category,
            icon: item.icon,
            showIcon: item.icon !== undefined && item.icon !== null && item.icon !== false,
            body: item.body
          })
        );
  return {
    rootProps: {
      ...rest,
      dir,
      type: 'auto',
      role: variant === 'chat' ? 'log' : 'region',
      'aria-label': label,
      'aria-live': variant === 'chat' && live !== 'off' ? 'polite' : 'off',
      'aria-relevant': variant === 'chat' ? 'additions' : undefined,
      'aria-atomic': variant === 'chat' ? false : undefined,
      'data-variant': variant,
      'data-size': size,
      className: cn(timelineVariants(), className)
    },
    viewportProps: {
      role: 'group',
      'aria-label': label,
      tabIndex: 0,
      className: cn(timelineViewportVariants({ size }))
    },
    listProps: { role: 'list', className: cn(timelineListVariants()) },
    emptyProps: { className: cn(timelineEmptyVariants()) },
    emptyText: variant === 'chat' ? messages.emptyChat : messages.emptyEvents,
    rows,
    iconWrapperProps: { 'aria-hidden': true, className: cn(timelineIconWrapperVariants()) },
    identityProps: { className: cn(timelineIdentityVariants()) },
    scrollbarProps: {
      orientation: 'vertical',
      'aria-hidden': true,
      className: cn(surfaceVariants({ tone: 'well', padding: 'none', radius: 'full' }), timelineScrollbarVariants())
    },
    thumbProps: { className: cn(timelineThumbVariants()) }
  };
}
