import type { ComponentPropsWithoutRef } from 'react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import type { MenuEntry } from '../../molecules/menu';
import type {
  CalendarGridDay,
  CalendarGridEntry,
  CalendarGridEntryStatus,
  CalendarGridHeadingTag,
  CalendarGridProps
} from './types';
import {
  calendarGridAddVariants,
  calendarGridDayNumberVariants,
  calendarGridDayVariants,
  calendarGridEntryListVariants,
  calendarGridHeaderRowVariants,
  calendarGridHeaderVariants,
  calendarGridLinkVariants,
  calendarGridListVariants,
  calendarGridMetaVariants,
  calendarGridTodayVariants,
  calendarGridVariants,
  calendarGridWeekdayVariants
} from './types';

type PendingMove = {
  entryId: string;
  entryLabel: string;
  date: string;
  dayLabel: string;
  items: CalendarGridDay[];
};

type EntryModel = {
  entry: CalendarGridEntry;
  status: CalendarGridEntryStatus;
  linkClassName: string;
  metaClassName: string;
  showFooter: boolean;
  move?: { label: string; header: string; items: MenuEntry[]; triggerRef: (node: HTMLButtonElement | null) => void };
};

type DayModel = {
  day: CalendarGridDay;
  dayProps: ComponentPropsWithoutRef<'li'> & { className: string; 'aria-current'?: 'date' };
  headingClassName: string;
  headerRowClassName: string;
  weekdayClassName: string;
  todayClassName: string;
  dayNumberClassName: string;
  headingText: string;
  todayText: string;
  headingRef: (node: HTMLHeadingElement | null) => void;
  noEntriesText: string;
  entries: EntryModel[];
  add?: { className: string; label: string; onClick: () => void };
};

export type UseCalendarGridResult = {
  rootProps: ComponentPropsWithoutRef<'section'> & { className: string; 'aria-label': string };
  headingTag: CalendarGridHeadingTag;
  listClassName: string;
  entryListClassName: string;
  days: DayModel[];
  announcement: string;
};

const RANKS = [2, 3, 4, 5, 6] as const;

/** Compose the region model, intent requests and the one-shot applied-move confirmation. */
export function useCalendarGrid(props: CalendarGridProps): UseCalendarGridResult {
  const {
    label,
    items,
    onAdd,
    onMove,
    onNavigate,
    level,
    messages,
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = props as CalendarGridProps & {
    children?: unknown;
    role?: unknown;
    'aria-label'?: unknown;
    'aria-labelledby'?: unknown;
  };
  const text = {
    today: messages?.today ?? 'Today',
    noEntries: messages?.noEntries ?? 'No entries',
    addEntry: messages?.addEntry ?? ((dayLabel: string) => `Add entry on ${dayLabel}`),
    moveEntry: messages?.moveEntry ?? ((entryLabel: string) => `Move ${entryLabel}`),
    moveTo: messages?.moveTo ?? 'Move to',
    entryMoved: messages?.entryMoved ?? ((entryLabel: string, dayLabel: string) => `${entryLabel} moved to ${dayLabel}`)
  };
  const pending = useRef<PendingMove | null>(null);
  const triggers = useRef(new Map<string, HTMLButtonElement>());
  const headings = useRef(new Map<string, HTMLHeadingElement>());
  const [announcement, setAnnouncement] = useState('');
  const rank = RANKS.find((value) => value === level) ?? 3;

  // D15: the request resolves on the first items update after it. Applied moves focus the
  // remounted trigger, or the destination day heading when the entry has no trigger left
  // (owner decision 2026-11-02), and announce once; rejected or unrelated data stays silent
  // because there is no rejection signal in the API.
  useEffect(() => {
    const request = pending.current;
    if (request === null || request.items === items) {
      return;
    }
    pending.current = null;
    const target = items.find((day) => day.date === request.date);
    if (target === undefined || !target.entries.some((entry) => entry.id === request.entryId)) {
      return;
    }
    setAnnouncement(text.entryMoved(request.entryLabel, request.dayLabel));
    const trigger = triggers.current.get(request.entryId);
    if (trigger !== undefined) {
      trigger.focus();
      return;
    }
    headings.current.get(request.date)?.focus();
  });

  const days = items.map((day) => {
    const today = day['aria-current'] === 'date';
    const targets = items.filter((candidate) => candidate.date !== day.date && candidate.acceptsEntries !== false);
    const entries = day.entries.map((entry): EntryModel => {
      const status = entry.status ?? 'default';
      const move =
        onMove !== undefined && entry.movable !== false && targets.length > 0
          ? {
              label: text.moveEntry(entry.label),
              header: text.moveTo,
              items: targets.map((target): MenuEntry => {
                const targetLabel = target.label;
                return {
                  id: `move-${entry.id}-${target.date}`,
                  label: targetLabel,
                  onSelect: () => {
                    pending.current = {
                      entryId: entry.id,
                      entryLabel: entry.label,
                      date: target.date,
                      dayLabel: targetLabel,
                      items
                    };
                    onMove(entry, target.date);
                  }
                };
              }),
              triggerRef: (node: HTMLButtonElement | null) => {
                if (node === null) {
                  triggers.current.delete(entry.id);
                  return;
                }
                triggers.current.set(entry.id, node);
              }
            }
          : undefined;
      return {
        entry,
        status,
        linkClassName: cn(calendarGridLinkVariants()),
        metaClassName: cn(calendarGridMetaVariants({ highlighted: status === 'new' })),
        showFooter: entry.meta !== undefined || move !== undefined,
        move
      };
    });
    return {
      day,
      dayProps: {
        className: cn(calendarGridDayVariants()),
        ...(today ? { 'aria-current': 'date' as const } : {})
      },
      headingClassName: cn(calendarGridHeaderVariants()),
      headerRowClassName: cn(calendarGridHeaderRowVariants()),
      weekdayClassName: cn(calendarGridWeekdayVariants({ today })),
      todayClassName: cn(calendarGridTodayVariants()),
      dayNumberClassName: cn(calendarGridDayNumberVariants({ today, past: day.past === true })),
      headingText: today ? `${day.label}, ${text.today}` : day.label,
      todayText: text.today,
      headingRef: (node: HTMLHeadingElement | null) => {
        if (node === null) {
          headings.current.delete(day.date);
          return;
        }
        headings.current.set(day.date, node);
      },
      noEntriesText: text.noEntries,
      entries,
      add:
        onAdd !== undefined && day.acceptsEntries !== false
          ? {
              className: cn(calendarGridAddVariants()),
              label: text.addEntry(day.label),
              onClick: () => onAdd(day.date)
            }
          : undefined
    };
  });

  return {
    rootProps: {
      ...rest,
      'aria-label': label,
      className: cn(calendarGridVariants(), className)
    },
    headingTag: `h${rank}` as CalendarGridHeadingTag,
    listClassName: cn(calendarGridListVariants()),
    entryListClassName: cn(calendarGridEntryListVariants()),
    days,
    announcement
  };
}
