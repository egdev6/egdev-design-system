import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentPropsWithoutRef } from 'react';
import { forwardRef } from 'react';
import { action } from 'storybook/actions';
import { Link } from './Link';

const RouterLink = forwardRef<HTMLAnchorElement, ComponentPropsWithoutRef<'a'>>((props, ref) => (
  <a {...props} ref={ref} />
));

/**
 * ## Description
 * Link-colored text navigation with a centered right arrow. At rest the label carries a text underline in
 * the link color, offset by a space token; on hover the arrow moves right and the underline is removed, while
 * the color stays the same. Use for secondary links in a block, not primary actions, icon-only navigation or
 * inline prose.
 *
 * ## Dependencies
 * Icon supplies decorative 16px arrows. Radix Slot/Slottable preserve router-link composition;
 * Radix VisuallyHidden announces a new tab without adding visible copy.
 *
 * ## Usage guidelines
 * Supply descriptive children and a destination. With asChild, supply exactly one anchor-compatible
 * child that forwards props and its ref; it owns href. external forces a safe new tab, including on
 * that child. Localize newTabText. The underline is part of the default look, so omit `variant`:
 * `underlined` is deprecated, renders exactly like `plain` and will be removed in a later major. Never
 * add border or decoration utilities through className. className supports outer margin/alignment only.
 * No stylesheet ships with this atom.
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
