import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CalendarGrid } from './CalendarGrid';
import type { CalendarGridDay, CalendarGridEntry, CalendarGridProps } from './types';

// @ts-expect-error The region is always named by label; aria-label is not accepted.
const invalidAriaLabel: CalendarGridProps = { label: 'Week', items: [], 'aria-label': 'Week' };
// @ts-expect-error Days are supplied through items, never children.
const invalidChildren: CalendarGridProps = { label: 'Week', items: [], children: null };
// @ts-expect-error Day headings support ranks 2-6 only.
const invalidLevel: CalendarGridProps = { label: 'Week', items: [], level: 1 };
// @ts-expect-error Entry statuses exclude ListItem's empty and dragging presentations.
const invalidStatus: CalendarGridEntry = { id: 'x', label: 'X', status: 'dragging' };
// @ts-expect-error There is no asChild surface on the root region.
const invalidAsChild: CalendarGridProps = { label: 'Week', items: [], asChild: true };
export type TypeNegatives = [
  typeof invalidAriaLabel,
  typeof invalidChildren,
  typeof invalidLevel,
  typeof invalidStatus,
  typeof invalidAsChild
];

const clips: CalendarGridEntry = {
  id: 'clips',
  label: 'Publish clips',
  meta: '10:00 · Done',
  href: '#clips',
  status: 'done'
};
const short: CalendarGridEntry = { id: 'short', label: 'Draft short', meta: 'New', status: 'new' };

const monday: CalendarGridDay = {
  date: '2026-10-05',
  label: 'Monday, October 5',
  weekday: 'Mon',
  dayNumber: '5',
  entries: [clips]
};
const tuesday: CalendarGridDay = {
  date: '2026-10-06',
  label: 'Tuesday, October 6',
  weekday: 'Tue',
  dayNumber: '6',
  entries: [],
  past: true
};
const wednesday: CalendarGridDay = {
  date: '2026-10-07',
  label: 'Wednesday, October 7',
  weekday: 'Wed',
  dayNumber: '7',
  entries: [short],
  'aria-current': 'date'
};
const week = [monday, tuesday, wednesday];

const dayItems = (region: HTMLElement) => Array.from(region.querySelectorAll<HTMLElement>(':scope > ol > li'));

describe('CalendarGrid', () => {
  it('renders a named region, ordered day list and native headings without grid roles', () => {
    render(<CalendarGrid label='Week of October 5' items={week} />);
    const region = screen.getByRole('region', { name: 'Week of October 5' });
    expect(region).toHaveClass('eg-calendar-grid');
    expect(region.firstElementChild?.tagName).toBe('OL');
    expect(dayItems(region)).toHaveLength(3);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings).toHaveLength(3);
    expect(headings[0]).toHaveAccessibleName('Monday, October 5');
    expect(headings[1]).toHaveAccessibleName('Tuesday, October 6');
    expect(headings[2]).toHaveAccessibleName('Wednesday, October 7, Today');
    expect(region.querySelector('[role="grid"], [role="gridcell"], [role="row"], [role="rowgroup"]')).toBeNull();
  });

  it('honours the heading level and hides the decorative weekday and number', () => {
    render(<CalendarGrid label='Week of October 5' items={[monday]} level={2} />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Monday, October 5' });
    expect(heading.querySelector('[aria-hidden="true"]')?.textContent).toBe('Mon5');
    expect(screen.queryByRole('heading', { level: 3 })).toBeNull();
  });

  it('marks only today, names it in the heading and shows the visible Today cue', () => {
    render(<CalendarGrid label='Week of October 5' items={week} />);
    const region = screen.getByRole('region', { name: 'Week of October 5' });
    const days = dayItems(region);
    expect(days[0]).not.toHaveAttribute('aria-current');
    expect(days[2]).toHaveAttribute('aria-current', 'date');
    expect(days[2]).toHaveClass('aria-[current=date]:border-border-brand', 'aria-[current=date]:bg-alpha-red-07');
    expect(within(days[2] as HTMLElement).getByText('Today')).toBeInTheDocument();
    expect(within(days[0] as HTMLElement).queryByText('Today')).toBeNull();
  });

  it('mutes only past header numerals and keeps entry presentation untouched', () => {
    render(<CalendarGrid label='Week of October 5' items={week} />);
    const region = screen.getByRole('region', { name: 'Week of October 5' });
    const past = dayItems(region)[1] as HTMLElement;
    expect(within(past).getByText('6')).toHaveClass('text-fg-muted');
    expect(past.className).not.toMatch(/opacity-\d/);
    const entry = screen.getByText('Publish clips').closest('li') as HTMLElement;
    expect(entry).toHaveAttribute('data-state', 'done');
    expect(entry).toHaveClass('eg-list-item', 'data-[state=done]:bg-transparent');
  });

  it('renders empty days without a list, with hidden empty text and the add control', () => {
    render(<CalendarGrid label='Week of October 5' items={week} onAdd={vi.fn()} />);
    const region = screen.getByRole('region', { name: 'Week of October 5' });
    const empty = dayItems(region)[1] as HTMLElement;
    expect(empty.querySelector('ul')).toBeNull();
    expect(within(empty).getByText('No entries')).toBeInTheDocument();
    expect(within(empty).getByRole('button', { name: 'Add entry on Tuesday, October 6' })).toBeInTheDocument();
  });

  it('emits one add request per pointer or keyboard activation', async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn();
    render(<CalendarGrid label='Week of October 5' items={week} onAdd={onAdd} />);
    const add = screen.getByRole('button', { name: 'Add entry on Wednesday, October 7' });
    await user.click(add);
    expect(onAdd).toHaveBeenCalledWith('2026-10-07');
    add.focus();
    await user.keyboard('{Enter}');
    await user.keyboard(' ');
    expect(onAdd).toHaveBeenCalledTimes(3);
    expect(onAdd.mock.calls.every(([date]) => date === '2026-10-07')).toBe(true);
  });

  it('omits add controls without a handler or on non-accepting days', () => {
    const { unmount } = render(<CalendarGrid label='Week of October 5' items={week} />);
    expect(screen.queryByRole('button', { name: /Add entry/ })).toBeNull();
    unmount();
    render(
      <CalendarGrid
        label='Week of October 5'
        items={[{ ...monday, acceptsEntries: false }, wednesday]}
        onAdd={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: 'Add entry on Monday, October 5' })).toBeNull();
    expect(screen.getByRole('button', { name: 'Add entry on Wednesday, October 7' })).toBeInTheDocument();
  });

  it('composes compact entries with the meta line below the label and cancels navigation on demand', () => {
    const onNavigate = vi.fn((_entry: CalendarGridEntry, event: React.MouseEvent<HTMLAnchorElement>) =>
      event.preventDefault()
    );
    render(<CalendarGrid label='Week of October 5' items={[monday]} onNavigate={onNavigate} />);
    const link = screen.getByRole('link', { name: 'Publish clips' });
    expect(link).toHaveAttribute('href', '#clips');
    const item = link.closest('li') as HTMLElement;
    expect(item).toHaveAttribute('data-variant', 'compact');
    expect(link.closest('.eg-list-item__content')).not.toBeNull();
    expect(screen.getByText('10:00 · Done').closest('.eg-list-item__meta')).not.toBeNull();
    expect(fireEvent.click(link)).toBe(false);
    expect(onNavigate).toHaveBeenCalledWith(clips, expect.anything());
  });

  it('omits the entry footer when there is no meta and no move control', () => {
    render(
      <CalendarGrid label='Week of October 5' items={[{ ...monday, entries: [{ id: 'bare', label: 'Bare' }] }]} />
    );
    const item = screen.getByText('Bare').closest('li') as HTMLElement;
    expect(item.querySelector('.eg-list-item__foot')).toBeNull();
    expect(item).not.toHaveAttribute('role');
    expect(item).not.toHaveAttribute('tabindex');
    expect(item).not.toHaveAttribute('draggable');
  });

  it('opens the move menu with keyboard, lists other accepting days and emits the move intent', async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    render(<CalendarGrid label='Week of October 5' items={week} onMove={onMove} />);
    const trigger = screen.getByRole('button', { name: 'Move Publish clips' });
    trigger.focus();
    await user.keyboard('{Enter}');
    const menu = await screen.findByRole('menu');
    expect(within(menu).getByText('Move to')).toBeInTheDocument();
    const options = within(menu).getAllByRole('menuitem');
    expect(options).toHaveLength(2);
    const [tuesdayOption, wednesdayOption] = options as [HTMLElement, HTMLElement];
    expect(tuesdayOption).toHaveFocus();
    expect(tuesdayOption).toHaveAccessibleName('Tuesday, October 6');
    expect(wednesdayOption).toHaveAccessibleName('Wednesday, October 7');
    await user.click(tuesdayOption);
    expect(onMove).toHaveBeenCalledTimes(1);
    expect(onMove).toHaveBeenCalledWith(clips, '2026-10-06');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(trigger).toHaveFocus();
    expect(screen.getByRole('status')).toHaveTextContent('');
  });

  it('closes the move menu with Escape and returns focus to its trigger', async () => {
    const user = userEvent.setup();
    render(<CalendarGrid label='Week of October 5' items={week} onMove={vi.fn()} />);
    const trigger = screen.getByRole('button', { name: 'Move Publish clips' });
    await user.click(trigger);
    expect(await screen.findByRole('menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    await waitFor(() => expect(screen.queryByRole('menu')).toBeNull());
    expect(trigger).toHaveFocus();
  });

  it('offers no move control without another accepting day or when the entry is fixed', () => {
    const { unmount } = render(
      <CalendarGrid
        label='Week of October 5'
        items={[
          { ...monday, entries: [clips] },
          { ...tuesday, acceptsEntries: false },
          { ...wednesday, acceptsEntries: false }
        ]}
        onMove={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: 'Move Publish clips' })).toBeNull();
    unmount();
    render(
      <CalendarGrid
        label='Week of October 5'
        items={[{ ...monday, entries: [{ ...clips, movable: false }] }, wednesday]}
        onMove={vi.fn()}
      />
    );
    expect(screen.queryByRole('button', { name: 'Move Publish clips' })).toBeNull();
  });

  it('focuses the moved entry trigger and announces the applied move once', async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const { rerender } = render(<CalendarGrid label='Week of October 5' items={week} onMove={onMove} />);
    await user.click(screen.getByRole('button', { name: 'Move Publish clips' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Tuesday, October 6' }));
    expect(onMove).toHaveBeenCalledWith(clips, '2026-10-06');
    rerender(
      <CalendarGrid
        label='Week of October 5'
        items={[{ ...monday, entries: [] }, { ...tuesday, entries: [clips] }, wednesday]}
        onMove={onMove}
      />
    );
    const moved = screen.getByRole('button', { name: 'Move Publish clips' });
    await waitFor(() => expect(moved).toHaveFocus());
    expect(screen.getByRole('status')).toHaveTextContent('Publish clips moved to Tuesday, October 6');
    rerender(
      <CalendarGrid
        label='Week of October 5'
        items={[{ ...monday, entries: [] }, { ...tuesday, entries: [clips] }, wednesday]}
        onMove={onMove}
      />
    );
    expect(screen.getByRole('status')).toHaveTextContent('Publish clips moved to Tuesday, October 6');
  });

  it('falls back to the destination day heading when the moved entry has no move trigger', async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const { rerender } = render(<CalendarGrid label='Week of October 5' items={week} onMove={onMove} />);
    await user.click(screen.getByRole('button', { name: 'Move Publish clips' }));
    await user.click(await screen.findByRole('menuitem', { name: 'Tuesday, October 6' }));
    expect(onMove).toHaveBeenCalledWith(clips, '2026-10-06');
    // The consumer applies the move and fixes the entry, so no Move trigger exists to receive focus.
    rerender(
      <CalendarGrid
        label='Week of October 5'
        items={[{ ...monday, entries: [] }, { ...tuesday, entries: [{ ...clips, movable: false }] }, wednesday]}
        onMove={onMove}
      />
    );
    const heading = screen.getByRole('heading', { level: 3, name: 'Tuesday, October 6' });
    await waitFor(() => expect(heading).toHaveFocus());
    expect(heading).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('status')).toHaveTextContent('Publish clips moved to Tuesday, October 6');
    expect(document.body).not.toHaveFocus();
  });

  it('stays silent for a rejected move and for unrelated updates', async () => {
    const user = userEvent.setup();
    const onMove = vi.fn();
    const { rerender } = render(<CalendarGrid label='Week of October 5' items={week} onMove={onMove} />);
    const trigger = screen.getByRole('button', { name: 'Move Publish clips' });
    await user.click(trigger);
    await user.click(await screen.findByRole('menuitem', { name: 'Tuesday, October 6' }));
    expect(onMove).toHaveBeenCalledTimes(1);
    rerender(<CalendarGrid label='Week of October 5' items={week} onMove={onMove} className='w-full' />);
    expect(screen.getByRole('status')).toHaveTextContent('');
    expect(screen.getByRole('button', { name: 'Move Publish clips' })).toHaveFocus();
  });

  it('localizes every built-in text and keeps English defaults', () => {
    const { unmount } = render(
      <CalendarGrid label='Week of October 5' items={week} onAdd={vi.fn()} onMove={vi.fn()} />
    );
    expect(screen.getByRole('button', { name: 'Add entry on Tuesday, October 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Move Publish clips' })).toBeInTheDocument();
    expect(screen.getByText('No entries')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    unmount();
    render(
      <CalendarGrid
        label='Semana del 5 de octubre'
        items={week}
        onAdd={vi.fn()}
        onMove={vi.fn()}
        messages={{
          today: 'Hoy',
          noEntries: 'Sin entradas',
          addEntry: (day) => `Añadir entrada el ${day}`,
          moveEntry: (entry) => `Mover ${entry}`,
          moveTo: 'Mover a',
          entryMoved: (entry, day) => `${entry} se movió a ${day}`
        }}
      />
    );
    expect(screen.getByRole('button', { name: 'Añadir entrada el Tuesday, October 6' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Mover Publish clips' })).toBeInTheDocument();
    expect(screen.getByText('Sin entradas')).toBeInTheDocument();
    expect(screen.getByText('Hoy')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 3, name: 'Wednesday, October 7, Hoy' })).toBeInTheDocument();
  });

  it('forwards native attributes and merges consumer layout last under the stable marker', () => {
    render(<CalendarGrid label='Week of October 5' items={week} className='w-4 mt-4' id='grid' data-owner='app' />);
    const region = screen.getByRole('region', { name: 'Week of October 5' });
    expect(region).toHaveAttribute('id', 'grid');
    expect(region).toHaveAttribute('data-owner', 'app');
    expect(region).toHaveClass('eg-calendar-grid', 'w-4', 'mt-4');
    expect(region.className).toContain('@container');
  });

  it('stacks the lanes from the component container token instead of an undefined breakpoint', () => {
    render(<CalendarGrid label='Week of October 5' items={week} />);
    const region = screen.getByRole('region', { name: 'Week of October 5' });
    const list = region.querySelector('ol') as HTMLElement;
    expect(list).toHaveClass('@max-calendar-grid-stack:grid-flow-row', '@max-calendar-grid-stack:grid-cols-1');
    expect(list.className).not.toContain('@max-4xl:');
    const lane = dayItems(region)[0] as HTMLElement;
    expect(lane).toHaveClass('@max-calendar-grid-stack:min-h-0');
    expect(lane.className).not.toContain('@max-4xl:');
  });

  it('keeps the named empty region when there are no days', () => {
    render(<CalendarGrid label='Week of October 5' items={[]} />);
    const region = screen.getByRole('region', { name: 'Week of October 5' });
    expect(region.querySelector('ol')?.children).toHaveLength(0);
    expect(screen.queryByRole('heading')).toBeNull();
  });
});
