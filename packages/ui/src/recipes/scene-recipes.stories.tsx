/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import diagnostic from '../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url';
import { Button } from '../atoms/button';
import { PhotoFrame } from '../atoms/photo-frame';
import { PullQuote } from '../atoms/pull-quote';
import { CommunityCard, CommunityCardAction, CommunityCardMark } from '../molecules/community-card';
import type { TerminalCardRow } from '../molecules/terminal-card';
import { TerminalCard, TerminalCardBar, TerminalCardList } from '../molecules/terminal-card';
import { SectionShell } from '../templates/section-shell';

/**
 * ## Description
 * Documented scene recipes for the About and Community sections of the web catalog (layer (e)
 * close). They are compositions of delivered public components, not exports: there is no scene
 * component, no new API and no choreography. Each recipe shows how a host assembles the approved
 * parts inside a `SectionShell`, exactly as the owner approved — "Recetas documentadas, sin export".
 *
 * ## Dependencies
 * - `SectionShell` (template): the section frame and its registers; the host owns the landmark name.
 * - `PhotoFrame`, `PullQuote`, `TerminalCard` (About): photo + quote split with a key/value card.
 * - `CommunityCard` (Community): a grid of passive community cards, each with one action.
 * - `Button` / `Link` (consumer-supplied actions).
 *
 * ## Usage guidelines
 * Copy the composition, not an abstraction: the host supplies its own copy, media, marks and
 * actions, and keeps section registers, heading identifiers and image alternatives under its
 * control. Every part stays within its own contract (outer layout only on `className`, one action
 * per card, decorative media with an explicit empty alternative when appropriate).
 */
const meta = {
  title: 'Recipes/Scene recipes',
  parameters: { layout: 'padded' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const media = diagnostic;

/** Illustrative profile rows; a real host supplies its own domain-free definition pairs. */
const studioRows: TerminalCardRow[] = [
  { term: 'studio', value: 'EGDEV Foundation' },
  { term: 'craft', value: 'design engineering' },
  { term: 'stack', value: 'react + tokens' },
  { term: 'status', value: 'shipping', tone: 'success' },
  { term: 'building', value: 'design-system', caret: true }
];

/** Consumer wordmark content, exactly as a real host would supply it. */
const wordmark = (
  <CommunityCardMark>
    <span role='img' aria-label='Stack and Flow' className='font-display text-fg-default'>
      STACK &amp; FLOW
    </span>
  </CommunityCardMark>
);

const logoSrc = '/brand/egdev-logo.png';

/**
 * About scene: a photo + quote split with a key/value card. A host that wants the media to fill the
 * stretched row's height may switch to `ratio='auto'`, as PhotoFrame documents for definite-height
 * hosts; the preset here stays readable at every canvas width.
 */
export const AboutScene: Story = {
  name: 'About scene',
  render: () => (
    <SectionShell register='pro' aria-label='About the project'>
      <div className='grid gap-10 min-[48rem]:grid-cols-2 min-[48rem]:items-stretch'>
        <PhotoFrame
          src={media}
          alt='Diagnostic grid fixture standing in for a photograph'
          variant='framed'
          ratio='landscape'
          imageCaption='Studio bench, mid-build'
        />
        <div className='flex min-w-0 flex-col justify-center gap-8'>
          <PullQuote
            text='A design system is how a project keeps its promises '
            accent='at every scale.'
            source='Illustrative quotation, not web copy'
          />
          <TerminalCard label='Studio profile' className='w-full'>
            <TerminalCardBar shell='zsh'>~/egdev</TerminalCardBar>
            <TerminalCardList items={studioRows} />
          </TerminalCard>
        </div>
      </div>
    </SectionShell>
  )
};

/**
 * Community scene: a grid of two passive community cards stretched to equal height, so the pinned
 * actions align at the bottom edge. Each card carries exactly one action; the register is the
 * host's choice.
 */
export const CommunityScene: Story = {
  name: 'Community scene',
  render: () => (
    <SectionShell register='grafito' aria-label='Community'>
      <div className='grid items-stretch gap-6 min-[48rem]:grid-cols-2'>
        <CommunityCard title='Stack and Flow' eyebrow='My community'>
          <p>Where members of the studio share work in progress, review each other and ship together.</p>
          {wordmark}
          <CommunityCardAction>
            <Button asChild={true} size='lg'>
              <a href='#community'>Join the community</a>
            </Button>
          </CommunityCardAction>
        </CommunityCard>
        <CommunityCard title='EGDEV builders' eyebrow='Open community'>
          <p>Streams, builds and code reviews with a community of builders.</p>
          <CommunityCardMark>
            <img src={logoSrc} alt='EGDEV' className='h-16 w-auto' />
          </CommunityCardMark>
          <CommunityCardAction>
            <Button asChild={true} size='lg' variant='secondary'>
              <a href='#join'>Join the streams</a>
            </Button>
          </CommunityCardAction>
        </CommunityCard>
      </div>
    </SectionShell>
  )
};
