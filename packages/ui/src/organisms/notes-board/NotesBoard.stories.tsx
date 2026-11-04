import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '../../atoms/chip';
import { ListItem, ListItemBody, ListItemLeading, ListItemTitle, ListItemTrailing } from '../../molecules/list-item';
import { SectionHeader } from '../../molecules/section-header';
import { NotesBoard, NotesBoardList, NotesBoardSide } from './NotesBoard';

/** A passive editorial board. Hosts own section labels, chronology, destinations and topic copy. */
const meta: Meta<typeof NotesBoard> = { title: 'Organisms/NotesBoard', component: NotesBoard, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof NotesBoard>;

const topics = (
  <ul aria-label='Topics' className='list-none m-0 p-0 flex flex-wrap gap-2'>
    <li>
      <Chip mode='static'>Design</Chip>
    </li>
    <li>
      <Chip mode='static'>Code</Chip>
    </li>
  </ul>
);
const notes = (
  <>
    <li>
      <ListItem variant='editorial-divided' size='sm' asChild={true}>
        <a href='#first-note'>
          <ListItemLeading>
            <time dateTime='2026-09-12'>
              12<small>Sep</small>
            </time>
          </ListItemLeading>
          <ListItemBody>
            <ListItemTitle>Building a calmer catalog</ListItemTitle>
          </ListItemBody>
          <ListItemTrailing>
            <span aria-hidden='true'>→</span>
          </ListItemTrailing>
        </a>
      </ListItem>
    </li>
    <li>
      <ListItem variant='editorial-divided' size='sm' asChild={true}>
        <a href='#second-note'>
          <ListItemLeading>
            <time dateTime='2026-08-30'>
              30<small>Aug</small>
            </time>
          </ListItemLeading>
          <ListItemBody>
            <ListItemTitle>Notes on shared patterns</ListItemTitle>
          </ListItemBody>
          <ListItemTrailing>
            <span aria-hidden='true'>→</span>
          </ListItemTrailing>
        </a>
      </ListItem>
    </li>
  </>
);
const content = (
  <>
    <NotesBoardSide>
      <SectionHeader title='Notes' lede='Ideas from the studio.' />
      {topics}
    </NotesBoardSide>
    <NotesBoardList>{notes}</NotesBoardList>
  </>
);

/** Required composition only; sticky retains its default. */
export const Default: Story = { args: { children: content } };
/** Empty lists have no invented message. */
export const Empty: Story = {
  args: {
    children: (
      <>
        <NotesBoardSide>
          <SectionHeader title='Notes' />
        </NotesBoardSide>
        <NotesBoardList>{null}</NotesBoardList>
      </>
    )
  }
};
/** Informational topics are static Chips in a named list, not a selection control. */
export const Topics: Story = { args: { children: content } };
/** Each direct list item contains one divided editorial anchor and a machine-readable date. */
export const DatedNotes: Story = { args: { children: content } };
/** The host must verify header clearance and scrolling constraints. */
export const Sticky: Story = { args: { children: content, sticky: true } };
/** Long titles remain consumer content. */
export const LongTitles: Story = {
  args: {
    children: (
      <>
        <NotesBoardSide>
          <SectionHeader title='Notes' />
        </NotesBoardSide>
        <NotesBoardList>
          <li>
            <ListItem variant='editorial' size='sm' asChild={true}>
              <a href='#long'>
                <ListItemBody>
                  <ListItemTitle>
                    A long note about building accessible systems across many different contexts and screen sizes
                  </ListItemTitle>
                </ListItemBody>
              </a>
            </ListItem>
          </li>
        </NotesBoardList>
      </>
    )
  }
};
/** Host-owned spacing separates sections, which use distinct supplied heading IDs. */
export const MultipleBoards: Story = {
  args: { children: content },
  render: () => (
    <div className='flex flex-col gap-16'>
      <section aria-labelledby='notes-one'>
        <NotesBoard>
          <NotesBoardSide>
            <SectionHeader title='First notes' titleId='notes-one' />
          </NotesBoardSide>
          <NotesBoardList>{notes}</NotesBoardList>
        </NotesBoard>
      </section>
      <section aria-labelledby='notes-two'>
        <NotesBoard>
          <NotesBoardSide>
            <SectionHeader title='Second notes' titleId='notes-two' />
          </NotesBoardSide>
          <NotesBoardList>{null}</NotesBoardList>
        </NotesBoard>
      </section>
    </div>
  )
};
/** The enclosing section, not the board, owns the landmark and heading association. */
export const HostSection: Story = {
  args: { children: content },
  render: () => (
    <section aria-labelledby='host-notes'>
      <NotesBoard>
        <NotesBoardSide>
          <SectionHeader title='Host notes' titleId='host-notes' />
          {topics}
        </NotesBoardSide>
        <NotesBoardList>{notes}</NotesBoardList>
      </NotesBoard>
    </section>
  )
};
