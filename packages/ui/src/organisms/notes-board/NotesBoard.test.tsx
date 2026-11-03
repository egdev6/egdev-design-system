import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Chip } from '../../atoms/chip';
import { ListItem, ListItemBody, ListItemLeading, ListItemTitle, ListItemTrailing } from '../../molecules/list-item';
import { SectionHeader } from '../../molecules/section-header';
import { NotesBoard, NotesBoardList, NotesBoardSide } from './index';

const row = (title: string, date: string) => (
  <li key={title}>
    <ListItem variant='editorial' size='sm' asChild={true}>
      <a href={`#${title}`}>
        <ListItemLeading>
          <time dateTime={date}>
            12 <small>Sep</small>
          </time>
        </ListItemLeading>
        <ListItemBody>
          <ListItemTitle>{title}</ListItemTitle>
        </ListItemBody>
        <ListItemTrailing>
          <span aria-hidden='true'>→</span>
        </ListItemTrailing>
      </a>
    </ListItem>
  </li>
);
const side = (
  <NotesBoardSide>
    <SectionHeader title='Notes' titleId='notes-title' />
    <ul aria-label='Topics'>
      <li>
        <Chip mode='static'>Design</Chip>
      </li>
    </ul>
  </NotesBoardSide>
);
const board = (titles: string[]) => (
  <NotesBoard>
    {side}
    <NotesBoardList>{titles.map((title) => row(title, '2026-09-12'))}</NotesBoardList>
  </NotesBoard>
);

describe('NotesBoard public contract', () => {
  it('keeps a passive root, side then ordered list and an empty list (NB-01)', () => {
    const { container } = render(board([]));
    const root = container.querySelector('.eg-notes');
    expect(root?.tagName).toBe('DIV');
    expect(root).not.toHaveAttribute('role');
    expect(root?.children[0]).toContainElement(screen.getByRole('heading', { name: 'Notes' }));
    expect(root?.children[1]).toBe(screen.getAllByRole('list')[1]);
    expect(root?.children[1]?.tagName).toBe('OL');
    expect(root?.children[1]?.children).toHaveLength(0);
  });
  it('lets hosts name separate sections with unique supplied heading IDs (NB-02)', () => {
    render(
      <>
        <section aria-labelledby='first'>
          <NotesBoard>
            <NotesBoardSide>
              <SectionHeader title='First' titleId='first' />
            </NotesBoardSide>
            <NotesBoardList>{null}</NotesBoardList>
          </NotesBoard>
        </section>
        <section aria-labelledby='second'>
          <NotesBoard>
            <NotesBoardSide>
              <SectionHeader title='Second' titleId='second' />
            </NotesBoardSide>
            <NotesBoardList>{null}</NotesBoardList>
          </NotesBoard>
        </section>
      </>
    );
    expect(screen.getByRole('region', { name: 'First' })).toContainElement(
      screen.getByRole('heading', { name: 'First' })
    );
    expect(screen.getByRole('region', { name: 'Second' })).toContainElement(
      screen.getByRole('heading', { name: 'Second' })
    );
    expect(document.querySelectorAll('#first, #second')).toHaveLength(2);
  });
  it('leaves static topics out of the tab order and preserves native row activation (NB-03, NB-04)', async () => {
    const user = userEvent.setup();
    const click = vi.fn((event: MouseEvent) => event.preventDefault());
    render(board(['Alpha', 'Beta']));
    const topics = screen.getByRole('list', { name: 'Topics' });
    expect(within(topics).queryByRole('button')).toBeNull();
    expect(within(topics).getByText('Design')).not.toHaveAttribute('aria-pressed');
    const link = screen.getByRole('link', { name: /12 Sep Alpha/ });
    const listItem = link.parentElement;
    expect(listItem?.tagName).toBe('LI');
    expect(listItem?.parentElement?.tagName).toBe('OL');
    expect(listItem?.children).toHaveLength(1);
    expect(link).toHaveAttribute('href', '#Alpha');
    expect(link).toHaveAttribute('data-variant', 'editorial');
    expect(link).toHaveAttribute('data-size', 'sm');
    expect(link.querySelector('time')).toHaveAttribute('datetime', '2026-09-12');
    expect(link.querySelector('[aria-hidden=true]')).toHaveTextContent('→');
    link.addEventListener('click', click);
    await user.tab();
    expect(link).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(click).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(screen.getByRole('link', { name: /Beta/ })).toHaveFocus();
    await user.tab({ shift: true });
    expect(link).toHaveFocus();
  });
  it('preserves consumer ordering and destinations after rerender (NB-05)', () => {
    const { rerender } = render(board(['Alpha', 'Beta']));
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['#Alpha', '#Beta']);
    rerender(board(['Beta', 'Alpha']));
    expect(screen.getAllByRole('link').map((link) => link.getAttribute('href'))).toEqual(['#Beta', '#Alpha']);
  });
  it('uses exact responsive and sticky classes, without legacy part markers (NB-06–09)', () => {
    const { container, rerender } = render(board([]));
    const root = container.querySelector('.eg-notes') as HTMLElement;
    const sideElement = root.children[0];
    expect(root).toHaveClass(
      'grid',
      'grid-cols-[minmax(0,4fr)_minmax(0,7fr)]',
      'gap-10',
      'items-center',
      '[@media(width<=1080px)]:grid-cols-1',
      '[@media(width<=1080px)]:gap-8'
    );
    expect(sideElement).not.toHaveClass('sticky');
    expect(root.children[1]).toHaveClass('list-none', 'm-0', 'p-0', 'flex', 'flex-col', 'gap-2', 'min-w-0');
    rerender(
      <NotesBoard sticky={true}>
        {side}
        <NotesBoardList>{row('Alpha', '2026-09-12')}</NotesBoardList>
      </NotesBoard>
    );
    expect(root.children[0]).toHaveClass(
      'sticky',
      'self-start',
      'top-[calc(var(--nav-height)+var(--space-10))]',
      '[@media(width<=1080px)]:static',
      '[@media(width<=1080px)]:self-auto'
    );
    expect(container.querySelector('[class*="eg-notes__"], [class*="eg-notes--"], .eg-note')).toBeNull();
  });
  it('forwards safe attributes, merges outer layout and strips protected inputs (NB-10)', () => {
    const unsafe = { role: 'button', style: { color: 'red' }, dangerouslySetInnerHTML: { __html: 'bad' } };
    const { container } = render(
      <NotesBoard {...unsafe} data-example='yes' className='w-full mt-4'>
        <NotesBoardSide>Intro</NotesBoardSide>
        <NotesBoardList>{null}</NotesBoardList>
      </NotesBoard>
    );
    const root = container.querySelector('.eg-notes');
    expect(root).toHaveAttribute('data-example', 'yes');
    expect(root).toHaveClass('w-full', 'mt-4');
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('style');
    expect(root).toHaveTextContent('Intro');
  });
});
