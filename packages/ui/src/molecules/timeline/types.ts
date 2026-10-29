import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import type { IconName } from '../../atoms/icon';

export type TimelineVariant = 'events' | 'chat';
export type TimelineSize = 'sm' | 'md' | 'lg';

/** Consumer-formatted visible time and valid HTML datetime; never parsed or sorted. */
export type TimelineTime = {
  /** Localized visible time, non-empty. @control text */
  text: string;
  /** HTML datetime, including durations such as PT1M13S. @control text */
  dateTime: string;
};

/** Passive event data. Unique stable non-empty ids and valid content are caller responsibilities. */
export type TimelineEvent = {
  /** Stable data key, not a DOM id. @control text */
  id: string;
  /** Consumer-owned time representation.
   * @control false
   * @controlReason Structured time data; see ElapsedTime and WallClock.
   */
  time: TimelineTime;
  /** Non-empty event category. @control text */
  category: string;
  /** Trusted passive rich content; never supply focusable controls.
   * @control false
   * @controlReason Non-serializable ReactNode; see RichEvent.
   */
  body: ReactNode;
  /** Optional decorative category glyph; meaning belongs in category/body.
   * @control false
   * @controlReason Non-serializable ReactNode; see RichEvent.
   */
  icon?: ReactNode;
  /** Category color, never urgency. @control select @default neutral */
  tone?: 'neutral' | 'brand';
  /** Host-controlled emphasis, without arrival detection or a timer.
   * @control boolean
   * @default false
   */
  highlighted?: boolean;
};

/** Plain-text chat entry; no transport, moderation, command execution or link parsing. */
export type TimelineChatItem = {
  /** Unique stable non-empty data key. @control text */
  id: string;
  /** Consumer-owned time representation.
   * @control false
   * @controlReason Structured time data; see WallClock.
   */
  time: TimelineTime;
  /** Readable source identity and decorative system glyph.
   * @control false
   * @controlReason Structured identity data; see PlatformNames.
   */
  platform: {
    /** Non-empty source name, readable independently of the glyph. @control text */
    name: string;
    /** Decorative system glyph. @control select */
    icon: IconName;
  };
  /** Visible author identity, with optional decorative avatar and moderator qualifier.
   * @control false
   * @controlReason Structured identity data; see Moderator and WithAvatars.
   */
  author: {
    /** Non-empty author name. @control text */
    name: string;
    /** Omit for no disc; an empty object requests Avatar's fallback.
     * @control false
     * @controlReason Optional avatar object; see WithAvatars.
     */
    avatar?: {
      /** Optional photo URL; omitted or unavailable uses Avatar's fallback. @control text */
      src?: string;
    };
    /** Visible moderator qualifier. @control boolean @default false */
    moderator?: boolean;
  };
  /** Non-empty plain text, escaped without interpretation. @control text */
  message: string;
  /** Display metadata only, accompanied by visible Command text.
   * @control boolean
   * @default false
   */
  command?: boolean;
  /** Host-controlled emphasis, without a timer. @control boolean @default false */
  highlighted?: boolean;
};

/** Localizable built-in text; supplied strings must be non-empty. */
export type TimelineMessages = {
  /** Empty event feedback; omitted message override resolves to No events yet. @control text */
  emptyEvents: string;
  /** Empty chat feedback; omitted message override resolves to No messages yet. @control text */
  emptyChat: string;
  /** Visible moderator qualifier; omitted message override resolves to Moderator. @control text */
  moderator: string;
  /** Visible command qualifier; omitted message override resolves to Command. @control text */
  command: string;
};

type TimelineNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-live'
  | 'aria-atomic'
  | 'aria-relevant'
  | 'aria-selected'
  | 'aria-pressed'
  | 'dir'
>;

/** Read-only bounded collection. className supports outer width, margin and placement only.
 * No ref, asChild, viewport props, height clipping or internal appearance overrides.
 * Root listeners target the root, not the native scrolling viewport.
 */
export type TimelineProps = TimelineNativeProps & {
  /** Required non-empty accessible name, including ordering context. @control text */
  label: string;
  /** Viewport maximum height: sm 192px, md 288px, lg 384px; short content stays short.
   * @control select
   * @default md
   */
  size?: TimelineSize;
  /** Omitted keys use the documented English messages, never content translations.
   * @control false
   * @controlReason Partial localization dictionary; see Localized and EmptyChat.
   */
  messages?: Partial<TimelineMessages>;
  /** Radix layout direction; inherits the document when omitted. @control select */
  dir?: 'ltr' | 'rtl';
} & (
    | {
        /** Events region or passive chat log. @control select @default events */
        variant?: 'events';
        /** Events in display order, with unique stable ids; may be empty.
         * @control false
         * @controlReason Mode-dependent structured entries with ReactNode bodies; see Default and RichEvent.
         */
        items: TimelineEvent[];
        /** Events never request live announcements. @control select */
        'aria-live'?: 'off';
      }
    | {
        /** Events region or passive chat log. @control select */
        variant: 'chat';
        /** Chat in chronological oldest-first order, with unique stable ids; may be empty.
         * @control false
         * @controlReason Mode-dependent structured identity entries; see Chat and WithAvatars.
         */
        items: TimelineChatItem[];
        /** Native log speech request. Use off for history/backfill, commit, then restore polite.
         * Initial-mount speech and exact delivery depend on browser/AT.
         * @control select
         */
        'aria-live'?: 'off' | 'polite';
      }
  );

export const timelineVariants = cva('eg-timeline relative block min-w-0 m-0 p-0 list-none');
export const timelineViewportVariants = cva(
  'eg-timeline__viewport w-full focus-visible:outline-solid focus-visible:outline-(length:--focus-width) focus-visible:outline-focus-ring focus-visible:-outline-offset-(--focus-width)',
  {
    variants: {
      size: {
        sm: 'max-h-[calc(var(--space-24)*2)]',
        md: 'max-h-[calc(var(--space-24)*3)]',
        lg: 'max-h-[calc(var(--space-24)*4)]'
      }
    },
    defaultVariants: { size: 'md' }
  }
);
export const timelineListVariants = cva('eg-timeline__list m-0 p-0 list-none');
export const timelineItemVariants = cva(
  'eg-timeline__item grid min-w-0 items-baseline gap-3 px-2 font-sans text-fg-secondary [overflow-wrap:anywhere] data-[state=highlighted]:bg-bg-brand-subtle',
  {
    variants: {
      variant: {
        events:
          'grid-cols-[var(--space-14)_minmax(0,auto)_minmax(0,1fr)] py-2 border-b border-solid border-border-subtle last:border-b-0 text-body-default',
        chat: 'grid-cols-[calc(var(--space-10)+var(--space-1))_var(--icon-size)_minmax(0,1fr)] py-1.5 border-b-0 text-label-default not-data-[state=highlighted]:data-[kind=command]:bg-fg-default/3 data-[kind=command]:rounded-sm'
      }
    },
    defaultVariants: { variant: 'events' }
  }
);
export const timelineTimeVariants = cva('eg-timeline__time font-mono text-code text-fg-muted tabular-nums');
export const timelineCategoryVariants = cva(
  'eg-timeline__type inline-flex min-w-0 flex-wrap items-center gap-1.5 font-display text-label-eyebrow uppercase whitespace-normal text-fg-default data-[tone=brand]:text-fg-brand-raised [&_.eg-icon]:size-4 [&_.eg-icon]:text-inherit'
);
export const timelineIconWrapperVariants = cva('inline-flex shrink-0');
export const timelineBodyVariants = cva(
  'eg-timeline__body min-w-0 [&_b]:text-fg-default [&_b]:font-(weight:--text-cta-label--font-weight) [&_strong]:text-fg-default [&_strong]:font-(weight:--text-cta-label--font-weight)'
);
export const timelinePlatformVariants = cva(
  'eg-timeline__pf grid size-(--icon-size) place-items-center rounded-sm bg-bg-glass text-fg-secondary [&_.eg-icon]:size-3'
);
export const timelineIdentityVariants = cva('inline-flex max-w-full flex-wrap items-baseline gap-1.5 me-1.5');
export const timelineAuthorVariants = cva(
  'eg-timeline__who min-w-0 m-0 font-(weight:--text-cta-label--font-weight) text-fg-default data-[role=moderator]:text-status-success'
);
export const timelineMessageVariants = cva('', {
  variants: { command: { true: 'eg-timeline__cmd font-mono text-code text-fg-brand-raised', false: '' } }
});
export const timelineEmptyVariants = cva('m-0 p-2 font-sans text-body-default text-fg-muted [overflow-wrap:anywhere]');
export const timelineScrollbarVariants = cva('eg-timeline__scrollbar flex w-3 touch-none select-none p-0.5');
export const timelineThumbVariants = cva('relative flex-1 min-h-6 rounded-full bg-border-control');

/** Story-only host layout, never internal appearance overrides. */
export const timelineExampleLayoutVariants = cva('', {
  variants: {
    layout: {
      narrow: 'max-w-[calc(var(--space-24)*3)]',
      consumer: 'w-full max-w-[calc(var(--space-24)*4)] mx-auto'
    }
  }
});
