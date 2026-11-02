import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusDot } from '../../atoms/status-dot';
import { TerminalCard, TerminalCardBar, TerminalCardList } from './TerminalCard';
import type { TerminalCardRow } from './types';

/**
 * ## Description
 * A passive, named terminal-shaped key/value card: a title bar with the current path and an
 * optional shell name above an ordered definition list. It presents profile sheets, project
 * metadata or any definition pairs with a developer tone. The card is not a code block, an
 * executable terminal or a data table.
 *
 * ## Dependencies
 * `Icon` draws the decorative terminal glyph in the bar. Values may compose decorative system
 * atoms such as `StatusDot`. The root and the bar compose the public Surface material recipes
 * (`surface-1` frame, `surface-2` header band).
 *
 * ## Usage guidelines
 * `label` is the required accessible name of the group; a blank label renders nothing.
 * Compose `TerminalCardBar` and `TerminalCardList` as direct children in that order. Success
 * rows keep their readable condition text, because colour is never the only cue. The card is
 * passive: no tab stop, no interactions, no state. Root `className` is outer layout only and
 * the card has no built-in maximum width.
 */
const meta = {
  title: 'Molecules/TerminalCard',
  component: TerminalCard,
  tags: ['autodocs']
} satisfies Meta<typeof TerminalCard>;
export default meta;
type Story = StoryObj<typeof meta>;

const profileRows: TerminalCardRow[] = [
  { term: 'user', value: 'egdev' },
  { term: 'role', value: 'Design Engineer' },
  { term: 'editor', value: 'neovim' },
  { term: 'status', value: 'online', tone: 'success' },
  { term: 'building', value: 'agent-teams', caret: true }
];

/** Profile sheet mirroring the approved reference: path, shell, status ink and caret. */
export const Default: Story = {
  args: {
    label: 'Profile',
    children: (
      <>
        <TerminalCardBar shell='zsh'>~/egdev</TerminalCardBar>
        <TerminalCardList items={profileRows} />
      </>
    )
  }
};

/** The shell name sits on the trailing edge of the bar, after the path text. */
export const WithShell: Story = {
  args: {
    label: 'Agent teams',
    children: (
      <>
        <TerminalCardBar shell='bash'>~/egdev/agent-teams</TerminalCardBar>
        <TerminalCardList
          items={[
            { term: 'status', value: 'passing', tone: 'success' },
            { term: 'coverage', value: '94.2%' },
            { term: 'runtime', value: 'node 22' }
          ]}
        />
      </>
    )
  }
};

/** Without a shell the bar shows only the decorative glyph and the path text. */
export const WithoutShell: Story = {
  args: {
    label: 'Session',
    children: (
      <>
        <TerminalCardBar>~/egdev</TerminalCardBar>
        <TerminalCardList items={[{ term: 'mode', value: 'interactive' }]} />
      </>
    )
  }
};

/** Success rows repaint only the value; the visible text still states the condition. */
export const StatusPairs: Story = {
  args: {
    label: 'Services',
    children: (
      <>
        <TerminalCardBar shell='zsh'>~/egdev/pulso</TerminalCardBar>
        <TerminalCardList
          items={[
            { term: 'api', value: 'online', tone: 'success' },
            { term: 'db', value: 'online', tone: 'success' },
            { term: 'queue', value: 'draining' }
          ]}
        />
      </>
    )
  }
};

/** A decorative `StatusDot` may accompany a success value; the text stays required. */
export const WithStatusDot: Story = {
  args: {
    label: 'Services with dots',
    children: (
      <>
        <TerminalCardBar>~/egdev/pulso</TerminalCardBar>
        <TerminalCardList
          items={[
            {
              term: 'api',
              value: (
                <>
                  <StatusDot state='live' /> online
                </>
              ),
              tone: 'success'
            }
          ]}
        />
      </>
    )
  }
};

/** The caret is a decorative cursor after the value; it announces nothing. */
export const WithCaret: Story = {
  args: {
    label: 'Building',
    children: (
      <>
        <TerminalCardBar>~/egdev/agent-teams</TerminalCardBar>
        <TerminalCardList items={[{ term: 'build', value: 'running', caret: true }]} />
      </>
    )
  }
};

/** Long terms and values wrap inside the two-column grid; nothing is truncated. */
export const LongValues: Story = {
  args: {
    label: 'Deployment',
    className: 'w-72',
    children: (
      <>
        <TerminalCardBar>~/egdev/very-long-project-directory-name</TerminalCardBar>
        <TerminalCardList
          items={[
            {
              term: 'Deployment target region',
              value: 'eu-west-1-primary-with-secondary-failover-and-managed-replication'
            }
          ]}
        />
      </>
    )
  }
};

/** Width is consumer layout: the same card at a narrow and a wide host width. */
export const Widths: Story = {
  args: { label: 'Width comparison', children: null },
  render: () => (
    <div className='flex flex-wrap items-start gap-4'>
      <TerminalCard label='Narrow card' className='w-72'>
        <TerminalCardBar shell='zsh'>~/egdev</TerminalCardBar>
        <TerminalCardList items={profileRows} />
      </TerminalCard>
      <TerminalCard label='Wide card' className='w-[32rem]'>
        <TerminalCardBar shell='zsh'>~/egdev</TerminalCardBar>
        <TerminalCardList items={profileRows} />
      </TerminalCard>
    </div>
  )
};

/** Under reduced motion the caret renders static; only the pulse stops, never the marker. */
export const ReducedMotion: Story = {
  args: {
    label: 'Reduced motion',
    children: (
      <>
        <TerminalCardBar>~/egdev</TerminalCardBar>
        <TerminalCardList items={[{ term: 'build', value: 'running', caret: true }]} />
      </>
    )
  }
};
