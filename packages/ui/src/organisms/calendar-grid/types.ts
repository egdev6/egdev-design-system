import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';

/** Entry presentation; non-default values need a readable word in meta. */
export type CalendarGridEntryStatus = 'default' | 'new' | 'failed' | 'done' | 'off';

/** One dated entry; ids are unique React keys and move payloads, never DOM ids. */
export type CalendarGridEntry = {
  /** Stable unique key across the whole grid. @control text */
  id: string;
  /** Visible entry name and accessible name source. @control text */
  label: string;
  /** Supplementary line rendered below the label; carries the readable status word. @control text */
  meta?: string;
  /** Native destination; when present the label renders as an anchor. @control text */
  href?: string;
  /** Entry presentation; non-default values need a readable word in meta. @control select */
  status?: CalendarGridEntryStatus;
  /** When false, no move control is offered. @control boolean */
  movable?: boolean;
};

/** One date lane; the consumer owns locale, ordering, today and eligibility. */
export type CalendarGridDay = {
  /** Unique ISO YYYY-MM-DD calendar date; the add and move intent payload. @control text */
  date: string;
  /** Full accessible day name, such as Thursday, October 8. @control text */
  label: string;
  /** Visible short weekday, duplicated for sighted users only. @control text */
  weekday: string;
  /** Visible day-of-month text. @control text */
  dayNumber: string;
  /** Entries in display order. @control false
   * @controlReason Structured entries are not scalar controls; see Default and TodayAndPast.
   */
  entries: CalendarGridEntry[];
  /** Marks today; the consumer supplies at most one day. @control select */
  'aria-current'?: 'date';
  /** Mutes the header numerals of a day before today. @control boolean */
  past?: boolean;
  /** Adds the add control and enables the day as a move target. @control boolean */
  acceptsEntries?: boolean;
};

/** Localizable built-in text with English defaults for omitted entries. */
export type CalendarGridMessages = {
  /** Visible and announced word for today. @control text */
  today?: string;
  /** Hidden text for a day without entries. @control text */
  noEntries?: string;
  /** Accessible name of a day's add control. @control false
   * @controlReason Functions are not serializable; see LocalizedMessages.
   */
  addEntry?: (dayLabel: string) => string;
  /** Accessible name of an entry's move control. @control false
   * @controlReason Functions are not serializable; see LocalizedMessages.
   */
  moveEntry?: (entryLabel: string) => string;
  /** Heading of the move menu. @control text */
  moveTo?: string;
  /** Announcement of an applied move. @control false
   * @controlReason Functions are not serializable; see LocalizedMessages.
   */
  entryMoved?: (entryLabel: string, dayLabel: string) => string;
};

type CalendarGridNativeProps = Omit<
  ComponentPropsWithoutRef<'section'>,
  'children' | 'aria-label' | 'aria-labelledby' | 'role'
>;

/**
 * Named planning region of ordered days; it renders consumer data and emits add, move and
 * navigation requests without owning scheduling rules, dates or persistence. className supports
 * outer layout only and is merged last. No ref, asChild, variant, size or tone axis.
 */
export type CalendarGridProps = CalendarGridNativeProps & {
  /** Accessible name of the planning region, such as Week of October 5. @control text */
  label: string;
  /** Ordered days, 1-7, rendered as equal columns or stacked lanes. @control false
   * @controlReason Structured days and entries are not scalar controls; see Default and WorkWeek.
   */
  items: CalendarGridDay[];
  /** Add request for a day's ISO date; supplying it renders the add controls. @control false
   * @controlReason Callbacks are not serializable; see AddIntent.
   */
  onAdd?: (date: string) => void;
  /** Move request for an entry to another date; supplying it renders the move menus. @control false
   * @controlReason Callbacks are not serializable; see MoveMenu.
   */
  onMove?: (entry: CalendarGridEntry, date: string) => void;
  /** Entry link activation; preventDefault lets a router handle the navigation. @control false
   * @controlReason Callbacks receive a native-anchor event; see Default.
   */
  onNavigate?: (entry: CalendarGridEntry, event: MouseEvent<HTMLAnchorElement>) => void;
  /** Rank of the day headings. @control select */
  level?: 2 | 3 | 4 | 5 | 6;
  /** Localizable built-in text and formatters. @control false
   * @controlReason Structured functions are not serializable; see LocalizedMessages.
   */
  messages?: CalendarGridMessages;
};

/** Rank of a rendered day heading. */
export type CalendarGridHeadingTag = 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

/** Public root layout recipe; the lanes, entries and controls keep their own Material. */
export const calendarGridVariants = cva('eg-calendar-grid @container block min-w-0 font-sans text-fg-default');

export const calendarGridListVariants = cva(
  'm-0 p-0 list-none grid grid-flow-col auto-cols-fr gap-2 @max-calendar-grid-stack:grid-flow-row @max-calendar-grid-stack:grid-cols-1'
);

export const calendarGridDayVariants = cva(
  'flex flex-col gap-2 min-w-0 min-h-80 p-2 rounded-lg border border-solid border-transparent bg-fg-default/2 aria-[current=date]:border-border-brand aria-[current=date]:bg-alpha-red-07 @max-calendar-grid-stack:min-h-0'
);

export const calendarGridHeaderVariants = cva('flex items-baseline gap-2 pt-1 px-0.5 pb-2 m-0');

export const calendarGridHeaderRowVariants = cva('flex grow items-baseline justify-between gap-2');

export const calendarGridWeekdayVariants = cva('font-display text-meta uppercase text-fg-muted', {
  variants: { today: { true: 'text-fg-brand-raised', false: '' } },
  defaultVariants: { today: false }
});

export const calendarGridDayNumberVariants = cva('font-display text-heading-small text-fg-secondary', {
  variants: {
    today: { true: 'text-fg-default', false: '' },
    past: { true: 'text-fg-muted', false: '' }
  },
  defaultVariants: { today: false, past: false }
});

export const calendarGridTodayVariants = cva('font-display text-meta uppercase text-fg-brand-raised');

export const calendarGridEntryListVariants = cva('m-0 p-0 list-none flex flex-col gap-2');

export const calendarGridLinkVariants = cva(
  'rounded-sm text-fg-default no-underline hover:underline focus-visible:shadow-focus focus-visible:outline-none'
);

export const calendarGridMetaVariants = cva('text-label-default text-fg-muted', {
  variants: { highlighted: { true: 'text-fg-brand-raised', false: '' } },
  defaultVariants: { highlighted: false }
});

export const calendarGridAddVariants = cva(
  'mt-auto flex w-full min-h-11 items-center justify-center rounded-md border border-dashed border-transparent bg-transparent text-fg-muted transition-colors duration-[var(--duration-fast)] ease-[var(--ease-out)] hover:border-border-control hover:text-fg-default focus-visible:border-border-control focus-visible:text-fg-default focus-visible:shadow-focus focus-visible:outline-none motion-reduce:transition-none'
);
