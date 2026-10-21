import type { Meta, StoryObj } from '@storybook/react-vite';
import { VisuallyHidden } from './VisuallyHidden';

/**
 * ## Description
 * Content that is visually hidden but remains in reading order for assistive technology.
 *
 * ## Dependencies
 * Radix VisuallyHidden owns the inline accessibility geometry. No stylesheet is required.
 *
 * ## Usage guidelines
 * Do not hide focusable content or use this primitive for skip links.
 * asChild requires one non-focusable HTML host, or a component forwarding props/ref to it.
 * The public ref targets that host as HTMLElement; native props remain span attributes.
 * className supports non-visual hooks only. Root/child styles must not override hiding geometry.
 * Live announcements require a consumer-owned live region.
 */
const meta: Meta<typeof VisuallyHidden> = {
  title: 'Primitives/VisuallyHidden',
  component: VisuallyHidden,
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof VisuallyHidden>;

/** A new-tab notice contributes to the link name without appearing visually. */
export const Default: Story = {
  args: { children: '(opens in a new tab)' },
  render: (args) => (
    <a href='/docs' target='_blank' rel='noopener noreferrer'>
      Docs <VisuallyHidden {...args} />
    </a>
  )
};

/** A hidden heading retains heading semantics and names its containing region. */
export const AsChild: Story = {
  args: { asChild: true, children: <h2 id='settings-heading'>Settings</h2> },
  render: (args) => (
    <section aria-labelledby='settings-heading'>
      <VisuallyHidden {...args} />
    </section>
  )
};
