import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Link } from '../../atoms/link';
import { SectionNav } from './SectionNav';

const items = [
  { id: 'overview', label: 'Overview', href: '#overview' },
  { id: 'work', label: 'Work', href: '#work' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];
const manySections = Array.from({ length: 12 }, (_, index) => ({
  id: `section-${index + 1}`,
  label: `Section ${index + 1}`,
  href: `#section-${index + 1}`
}));
/**
 * Host supplies section destinations, names and equivalent progress text. Each section is numbered by its position
 * in `items`, zero-padded, and labels render uppercase through CSS.
 */
const meta = {
  title: 'Organisms/SectionNav',
  component: SectionNav,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className='min-h-[calc(var(--space-24)*6)] pb-24'>
        <Story />
      </div>
    )
  ],
  args: {
    label: 'Page sections',
    disclosureLabel: 'Open section index',
    nextLabel: 'Go to work',
    items,
    activeId: 'overview',
    value: 33
  }
} satisfies Meta<typeof SectionNav>;
export default meta;
type Story = StoryObj<typeof meta>;
/** Default host-driven navigation. */
export const Default: Story = {};
/** Host acknowledges open requests. */
export const Controlled: Story = {
  render: function Example(args) {
    const [open, setOpen] = useState(false);
    return <SectionNav {...args} open={open} onOpenChange={setOpen} />;
  }
};
/** The final destination wraps to the first. */
export const LastWrap: Story = { args: { activeId: 'contact', nextLabel: 'Go to overview' } };
/** No destinations means no controls. */
export const Empty: Story = { args: { items: [] } };
/** An unknown identity does not select a section. */
export const Unmatched: Story = { args: { activeId: 'unknown' } };
/** Host hides the region after moving focus. */
export const Hidden: Story = { args: { hidden: true } };
/** Long localized names remain host supplied. */
export const LongLocalizedNames: Story = {
  args: {
    disclosureLabel: 'Open the navigation index for all sections on this page',
    nextLabel: 'Go to the next destination with a longer localized name'
  }
};
/** The host provides the visible equivalent of the decorative edge. */
export const Progress: Story = {
  render: (args) => (
    <>
      <p>Page progress: 33%</p>
      <Link href='#overview' arrow={false}>
        Overview
      </Link>
      <SectionNav {...args} />
    </>
  )
};
/** Open the index and hover or focus its controls to inspect their states. */
export const Hover: Story = { args: { defaultOpen: true } };
/** Twelve sections with the tenth current: the open index shows zero-padded numbers across the 09 and 10 boundary. */
export const ManySections: Story = {
  args: {
    items: manySections,
    activeId: 'section-10',
    nextLabel: 'Go to section 11',
    value: 83,
    defaultOpen: true
  }
};
/** View the navigation in a narrow host and resize the viewport to inspect fixed positioning. */
export const Responsive: Story = {
  render: (args) => (
    <div className='w-full max-w-[calc(var(--space-24)*5)]'>
      <SectionNav {...args} />
    </div>
  )
};
