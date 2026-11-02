import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { CalendarGrid } from './CalendarGrid';
import type { CalendarGridDay, CalendarGridProps } from './types';

const published: CalendarGridDay[] = [
  {
    date: '2026-10-05',
    label: 'Monday, October 5',
    weekday: 'Mon',
    dayNumber: '5',
    past: true,
    entries: [
      { id: 'mon-clips', label: 'Clips del directo', meta: '10:00 · X · Published', href: '#mon-clips', status: 'done' }
    ]
  },
  {
    date: '2026-10-06',
    label: 'Tuesday, October 6',
    weekday: 'Tue',
    dayNumber: '6',
    past: true,
    entries: [
      {
        id: 'tue-short',
        label: 'Engram Monitor',
        meta: '13:00 · LinkedIn · Published',
        href: '#tue-short',
        status: 'done'
      }
    ]
  },
  {
    date: '2026-10-07',
    label: 'Wednesday, October 7',
    weekday: 'Wed',
    dayNumber: '7',
    'aria-current': 'date',
    entries: [{ id: 'wed-live', label: 'Directo semanal', meta: '19:00 · YouTube · Scheduled' }]
  },
  {
    date: '2026-10-08',
    label: 'Thursday, October 8',
    weekday: 'Thu',
    dayNumber: '8',
    entries: [{ id: 'thu-short', label: 'Short del directo', meta: '18:00 · YouTube · New', status: 'new' }]
  },
  {
    date: '2026-10-09',
    label: 'Friday, October 9',
    weekday: 'Fri',
    dayNumber: '9',
    entries: [{ id: 'fri-notes', label: 'Notas del directo', meta: '12:00 · Newsletter', href: '#fri-notes' }]
  },
  {
    date: '2026-10-10',
    label: 'Saturday, October 10',
    weekday: 'Sat',
    dayNumber: '10',
    entries: []
  },
  {
    date: '2026-10-11',
    label: 'Sunday, October 11',
    weekday: 'Sun',
    dayNumber: '11',
    entries: []
  }
];

const workWeek = published.slice(0, 5);

/** Named planning region of consumer-owned days; add, move and navigation stay requests. */
const meta: Meta<typeof CalendarGrid> = {
  title: 'Organisms/CalendarGrid',
  component: CalendarGrid,
  tags: ['autodocs'],
  args: {
    label: 'Week of October 5',
    items: published,
    onAdd: action('add-request'),
    onMove: action('move-intent'),
    onNavigate: action('navigation-intent')
  },
  decorators: [
    (Story) => (
      <div className='w-[64rem] max-w-full p-6 bg-surface-0 text-fg-default'>
        <Story />
      </div>
    )
  ]
};
export default meta;
type Story = StoryObj<typeof CalendarGrid>;

/** Seven days with published, current and empty lanes plus both intents. */
export const Default: Story = {};

/** Today carries the brand lane and the visible Today cue; past days mute only their numerals. */
export const TodayAndPast: Story = {};

/** Weekend lanes without entries keep their heading and hidden empty text. */
export const EmptyDays: Story = {
  args: { items: [...published.slice(0, 1), ...published.slice(5)] }
};

/** Only the add intent is supplied, so entries offer no move control. */
export const AddIntent: Story = {
  args: { onMove: undefined }
};

/** Applies the requested move locally so the announcement and focus hand-off are observable. */
const MoveMenuHost = (args: CalendarGridProps) => {
  const [items, setItems] = useState<CalendarGridDay[]>(args.items);
  return (
    <CalendarGrid
      {...args}
      items={items}
      onMove={(entry, date) => {
        args.onMove?.(entry, date);
        setItems((current) =>
          current.map((day) => ({
            ...day,
            entries:
              day.date === date
                ? [...day.entries, { ...entry }]
                : day.entries.filter((candidate) => candidate.id !== entry.id)
          }))
        );
      }}
    />
  );
};

/** Only the move intent is supplied, and this story applies it, so focus and the status announcement follow. */
export const MoveMenu: Story = {
  args: { onAdd: undefined },
  render: (args) => <MoveMenuHost {...args} />
};

/** Non-accepting days expose neither an add control nor a move target. */
export const NonAcceptingDays: Story = {
  args: { items: published.map((day, index) => (index > 2 ? { ...day, acceptsEntries: false } : day)) }
};

/** Five equal columns for a work week inside a wide container. */
export const WorkWeek: Story = {
  args: { items: workWeek }
};

/** Narrow host: the lanes stack without a minimum height. */
export const Stacked: Story = {
  args: { items: workWeek },
  decorators: [
    (Story) => (
      <div className='w-96 max-w-full p-4 bg-surface-0 text-fg-default'>
        <Story />
      </div>
    )
  ]
};

/** Every built-in text is supplied by the consumer. */
export const LocalizedMessages: Story = {
  args: {
    label: 'Semana del 5 de octubre',
    items: published.map((day) =>
      day['aria-current'] === 'date' ? { ...day, label: 'Miércoles, 7 de octubre' } : day
    ),
    messages: {
      today: 'Hoy',
      noEntries: 'Sin entradas',
      addEntry: (day) => `Añadir entrada el ${day}`,
      moveEntry: (entry) => `Mover ${entry}`,
      moveTo: 'Mover a',
      entryMoved: (entry, day) => `${entry} se movió a ${day}`
    }
  }
};
