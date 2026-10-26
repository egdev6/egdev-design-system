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
 * Standalone text navigation with a trailing direction arrow. Use for secondary links in a block,
 * not primary actions, icon-only navigation or inline prose.
 *
 * ## Dependencies
 * Icon supplies decorative 16px arrows. Radix Slot/Slottable preserve router-link composition;
 * Radix VisuallyHidden announces a new tab without adding visible copy.
 *
 * ## Usage guidelines
 * Supply descriptive children and a destination. With asChild, supply exactly one anchor-compatible
 * child that forwards props and its ref; it owns href. external forces a safe new tab, including on
 * that child. Localize newTabText. className supports outer margin/alignment only.
 * Browser appearance, focus, reduced motion and Controls widget checks are deferred to owner review.
 */
const meta: Meta<typeof Link> = {
  title: 'Atoms/Link',
  component: Link,
  tags: ['autodocs']
};
export default meta;

type Story = StoryObj<typeof Link>;

/** Required inputs only; preserves the internal arrow and all runtime defaults. */
export const Default: Story = {
  args: { href: '#articles', children: 'All articles' }
};

/** New-tab semantics include safe rel values, an up-right arrow and the default hidden notice. */
export const External: Story = {
  args: { href: 'https://example.com/repository', children: 'View repository', external: true, rel: 'author' }
};

/** Consumers can localize the assistive notice independently of the visible destination label. */
export const CustomNotice: Story = {
  args: { href: 'https://example.com', children: 'Read documentation', external: true, newTabText: '(new window)' }
};

/** Dense footer navigation can omit the decorative arrow without losing its underline or text. */
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

/** Pointer/keyboard inspection target: Tab to focus, hover to move the arrow, emulate reduced motion. */
export const States: Story = {
  args: { href: '#states', children: 'Explore states', className: 'self-start mt-4', onClick: action('navigate') }
};
