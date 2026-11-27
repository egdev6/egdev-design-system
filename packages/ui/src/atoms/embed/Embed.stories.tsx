/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
// no-inline: the production build would otherwise embed this small SVG as a data: URL, which Embed rejects by design.
import diagnostic from '../../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?no-inline';
import { Stack } from '../../primitives/stack';
import { Text } from '../../primitives/text';
import { SectionShell } from '../../templates/section-shell';
import { Link } from '../link';
import { Embed } from './Embed';

/**
 * ## Description
 * A named, reserved frame for external content, in a recessed well. It reserves the proportion of the content before it
 * arrives, so the layout never moves, and holds either a native `iframe` for a URL (`src`) or consumer `children` for
 * embeds that a provider script fills, plus a consumer `fallback`. A required `label` names the content for assistive
 * technology and is never rendered visibly. The root exposes three states through `data-state`: `loading`, `ready` and
 * `fallback`.
 *
 * ## Dependencies
 * Composes the exported AspectRatio primitive (Radix AspectRatio) for the reserved box, the Spinner for the decorative
 * loading state and the Surface `well` recipe for the Material. No new Radix primitive, ref, `asChild` or stylesheet.
 * Every story here uses a same-origin fixture or static content: no story requests third-party content.
 *
 * ## Usage guidelines
 * The component never loads or injects a script, and it decides nothing about consent, cookies or URL trust. Mounting a
 * frame is what makes the browser request its `src`, so mount `Embed` only after your own consent decision, load any
 * provider script yourself and isolate its subtree. Only http(s) URLs are accepted; anything else shows the fallback
 * and warns in development. Choose `sandbox`, `allow` and `referrerPolicy` per provider: none has a default. Pick a
 * `ratio` that fits the content, because taller output is clipped and the component cannot detect a failed frame, so
 * drop `src` yourself to show the fallback. `className` supports outer placement only, and the parent owns the width.
 */
const meta: Meta<typeof Embed> = {
  title: 'Atoms/Embed',
  component: Embed,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: { label: 'Diagnostic grid fixture' }
};
export default meta;
type Story = StoryObj<typeof Embed>;

/**
 * The frame branch: a native `iframe` named by `label` that mounts after the first client render, so a server render
 * never starts the request. It starts in `loading` with a decorative Spinner and moves to `ready` on the frame's native
 * `load` event, which `onLoad` also reports. The fixture is a same-origin SVG: it is fixed at 1000 by 1000, so inside a
 * 16:9 frame the browser crops or scrolls it. Only the required name and the example source are supplied, so Docs
 * shows the constant `ratio` and `loading` defaults.
 */
export const Default: Story = {
  args: { src: diagnostic, onLoad: action('onLoad') },
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*8)]'>
      <Embed {...args} />
    </div>
  )
};

const ratios = [
  { label: 'Widescreen frame', ratio: 16 / 9, caption: '16:9, the default' },
  { label: 'Classic frame', ratio: 4 / 3, caption: '4:3' },
  { label: 'Square frame', ratio: 1, caption: '1:1' },
  { label: 'Portrait frame', ratio: 9 / 16, caption: '9:16' },
  { label: 'Frame with an unusable ratio', ratio: 0, caption: 'ratio 0 is not representable: it falls back to 16:9' }
];

/**
 * `ratio` is the width divided by the height and reserves the box in every state, so a state change never moves the
 * layout. A positive finite number is used as given. Zero, a negative number, NaN or an infinite value silently falls
 * back to 16:9. A fixed ratio clips taller content and leaves a blank well below shorter content.
 */
export const Ratios: Story = {
  render: () => (
    <div className='grid w-full max-w-[calc(var(--space-24)*8)] grid-cols-2 items-start gap-6'>
      {ratios.map(({ label, ratio, caption }) => (
        <Stack key={label} gap={2}>
          <Embed label={label} src={diagnostic} ratio={ratio} />
          <Text variant='body' foreground='muted'>
            {caption}
          </Text>
        </Stack>
      ))}
    </div>
  )
};

function Post() {
  return (
    <blockquote className='m-0 grid h-full content-center gap-3 p-6'>
      <Text variant='body'>
        This block stands for what a provider script would fill after the app loads it: the component renders it as is.
      </Text>
      <Link href='#original-post'>View the original post</Link>
    </blockquote>
  );
}

/**
 * The content branch: consumer `children` that a script or the app fills, rendered directly in the reserved box with
 * `data-state="ready"`. There is no frame, Spinner or busy state, and the root becomes a group named by `label`. The
 * component adds no script: the app loads the provider script after its own consent decision and isolates this subtree,
 * so React does not reconcile nodes that the script replaced. `children` and `src` are exclusive.
 */
export const ScriptEmbed: Story = {
  args: { label: 'Post by @egdev6', ratio: 4 / 3, children: <Post /> },
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*8)]'>
      <Embed {...args} />
    </div>
  )
};

/**
 * The fallback state: no `src` and no `children`, so no frame is mounted and no request is made, and the consumer's
 * `fallback` fills the box inside a group named by `label`. The copy is the consumer's: keep it short, localized and
 * link to the original. The app also drops `src` to reach this state after a failure, because the component cannot
 * detect one. Without a `fallback` an empty reserved box is rendered and a development warning is raised.
 */
export const Fallback: Story = {
  args: {
    label: 'Keynote recording',
    fallback: (
      <Stack gap={2} alignItems='center'>
        <Text variant='body' foreground='muted'>
          The recording is not available here.
        </Text>
        <Link href='#recording'>Watch it on the original site</Link>
      </Stack>
    )
  },
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*8)]'>
      <Embed {...args} />
    </div>
  )
};

/**
 * The content branch inside a grafito reading section, the register of the reading pages that need it. A capture here
 * is an observation under story conditions, not the website's page.
 */
export const OnGrafito: Story = {
  args: { label: 'Post by @egdev6', ratio: 4 / 3, children: <Post /> },
  render: (args) => (
    <SectionShell register='grafito' aria-label='Reading'>
      <div className='w-full max-w-[calc(var(--space-24)*8)]'>
        <Embed {...args} />
      </div>
    </SectionShell>
  )
};
