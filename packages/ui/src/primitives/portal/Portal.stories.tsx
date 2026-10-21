import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Portal } from './Portal';

/**
 * ## Description
 * An unstyled out-of-tree container that preserves React context and events.
 *
 * ## Dependencies
 * Uses Radix Portal. Components with their own Radix portal keep that specialized portal.
 *
 * ## Usage guidelines
 * Positioning, focus, dismissal, presence and layering belong to the content.
 * className supports non-painting layout only. Body inherits root tokens; scoped
 * themes need a ready container inside their themed subtree. Null uses body:
 * render conditionally when waiting for a custom mount node. Default SSR emits
 * no markup; a custom DOM container during SSR is unsupported.
 */
const meta: Meta<typeof Portal> = {
  title: 'Primitives/Portal',
  component: Portal,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Portal>;

/** The content escapes an overflow-hidden React ancestor and mounts in the iframe body. */
export const Default: Story = {
  args: { children: 'Portalled content outside the clipping ancestor.' },
  render: (args) => (
    <div className='overflow-hidden h-0'>
      <Portal {...args} />
    </div>
  )
};

/** A client-ready target keeps the layer inside the consumer subtree instead of body. */
export const CustomContainer: Story = {
  args: { children: 'Portalled content inside the custom container.' },
  render: function CustomContainerStory(args) {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    return (
      <section aria-label='Custom portal host'>
        <div ref={setContainer} />
        {container ? <Portal {...args} container={container} /> : null}
      </section>
    );
  }
};
