import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { action } from 'storybook/actions';
import { Surface } from '../../primitives/surface';
import { Link } from './Link';

const RouterLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) => (
  <a {...props} ref={ref} />
));

/**
 * ## Description
 * Text navigation with a centered right arrow. At rest the label carries a text underline, offset by a space
 * token; on hover the arrow moves right and the underline is removed, while the color stays the same. The
 * default look is link-colored text underlined in that color; the `quiet` variant keeps neutral text and paints
 * the underline in the brand color, for links inside cards and footer navigation. Use for secondary links in a
 * block, not primary actions, icon-only navigation or inline prose.
 *
 * ## Dependencies
 * Icon supplies decorative 16px arrows. Radix Slot/Slottable preserve router-link composition;
 * Radix VisuallyHidden announces a new tab without adding visible copy.
 *
 * ## Usage guidelines
 * Supply descriptive children and a destination. With asChild, supply exactly one anchor-compatible
 * child that forwards props and its ref; it owns href. external forces a safe new tab, including on
 * that child. Localize newTabText. Omit `variant` for the default look and pass `variant="quiet"` for links
 * inside cards and footer navigation. Keep `quiet` out of inline prose: with neutral text the underline is the
 * only cue that the text is a link, and hover removes it. `underlined` is deprecated, renders exactly like
 * `plain` and will be removed in a later major. Never add border or decoration utilities through className.
 * className supports outer margin/alignment only. No stylesheet ships with this atom.
 * The arrow always points right; it never encodes the destination and no ref exists beyond the anchor.
 * Browser appearance, focus, reduced motion and Controls widget checks are deferred to owner review.
 */
const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Link>;

/** Required inputs only: the underlined label at rest, the internal arrow and all runtime defaults. */
export const Default: Story = {
  args: { href: '#articles', children: 'All articles' }
};

/** New-tab semantics retain safe rel values and a hidden notice; the arrow still points right. */
export const External: Story = {
  args: { href: 'https://example.com/repository', children: 'View repository', external: true, rel: 'author' }
};

/** Consumers can localize the assistive notice independently of the visible destination label. */
export const CustomNotice: Story = {
  args: { href: 'https://example.com', children: 'Read documentation', external: true, newTabText: '(new window)' }
};

/** Dense footer navigation can omit the decorative arrow while retaining its brand-colored text. */
export const WithoutArrow: Story = {
  args: { href: '#legal', children: 'Legal information', arrow: false }
};

/** A router-like child owns href while Slot appends the arrow and preserves props, events and refs. */
export const AsChild: Story = {
  args: {
    asChild: true,
    children: <RouterLink href='#router-documentation'>Router documentation</RouterLink>,
    onClick: action('navigate')
  }
};

/**
 * Hover removes the underline and moves the arrow right by one space token (unless motion is reduced); the
 * color does not change. Tab to inspect the focus ring.
 */
export const States: Story = {
  args: { href: '#states', children: 'Explore states', className: 'self-start mt-4', onClick: action('navigate') }
};

/**
 * Deprecated: `variant="underlined"` is an alias of the default and renders exactly the same classes, shown
 * here next to a default link for comparison. Existing consumers keep working; omit the prop in new code,
 * because the value will be removed in a later major.
 */
export const Underlined: Story = {
  args: {
    href: '#guides',
    children: 'Read the guide',
    variant: 'underlined',
    className: 'self-start',
    onClick: action('navigate')
  },
  render: ({ children, href, onClick }) => (
    <div className='flex flex-col gap-2'>
      <Link href={href ?? '#guides'} variant='underlined' className='self-start' onClick={onClick}>
        {children ?? 'Read the guide'}
      </Link>
      <Link href='#guides-default' className='self-start' onClick={onClick}>
        Read the guide (default)
      </Link>
    </div>
  )
};

/**
 * `variant="quiet"`: neutral text with a brand-colored underline, for links inside cards and footer navigation. The
 * underline stays at rest because, with neutral text, it is the only thing that marks the text as a link; hover
 * removes it while the arrow still moves right (unless motion is reduced). Switch `arrow` off in Controls for the
 * footer-navigation case, where the underline removal is the only hover feedback. Not for inline prose.
 */
export const Quiet: Story = {
  args: {
    href: '#quiet',
    children: 'Open the guide',
    variant: 'quiet',
    className: 'self-start',
    onClick: action('navigate')
  }
};

/**
 * The pattern `quiet` is for: one link in the footer band of a card. The card is composed from the exported Surface
 * primitive only (a body on surface-1 and a nested band on surface-0) and native elements; no card molecule is used
 * and no paint is written by hand. The brand underline marks the link on neutral text, and hover removes it.
 */
export const QuietInCardFooter: Story = {
  args: { href: '#project', children: 'Open the project', variant: 'quiet', onClick: action('navigate') },
  render: ({ children, href, onClick, variant }) => (
    <div className='max-w-120'>
      <Surface tone='surface-1' elevation={1} padding='none' radius='lg'>
        <div className='flex flex-col gap-2 p-6'>
          <h3 className='text-heading-small'>Now building</h3>
          <p className='text-body-default text-fg-secondary'>
            A short supporting line sits above the band that holds the card's single navigation link.
          </p>
        </div>
        <Surface tone='surface-0' elevation={0} padding='md' radius='none'>
          <Link href={href ?? '#project'} variant={variant} onClick={onClick}>
            {children ?? 'Open the project'}
          </Link>
        </Surface>
      </Surface>
    </div>
  )
};

const tones = ['surface-0', 'surface-1', 'surface-2', 'surface-3'] as const;

/**
 * A plain and a quiet link side by side on each tone of the Grafito ladder, from surface-0 to surface-3, each tone
 * named in text. Plain keeps link-colored text underlined in that color; quiet keeps neutral text on every tone and
 * marks the link with the brand underline, so it suits cards on any tone. A visual comparison only: it states no
 * measured contrast.
 */
export const QuietOnSurfaces: Story = {
  render: () => (
    <div className='flex flex-wrap items-start gap-4'>
      {tones.map((tone) => (
        <Surface key={tone} tone={tone} elevation={0} padding='md' radius='lg'>
          <div className='flex flex-col items-start gap-3'>
            <span className='text-meta text-fg-muted'>{tone}</span>
            <Link href={`#plain-on-${tone}`}>Plain on {tone}</Link>
            <Link href={`#quiet-on-${tone}`} variant='quiet'>
              Quiet on {tone}
            </Link>
          </div>
        </Surface>
      ))}
    </div>
  )
};
