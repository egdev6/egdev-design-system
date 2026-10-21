import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from './Divider';

/**
 * ## Description
 * A passive brand rule for decorative composition or meaningful content boundaries.
 *
 * ## Dependencies
 * Radix Separator owns presentation/separator roles and semantic orientation.
 *
 * ## Usage guidelines
 * Decorative by default. Use decorative=false for a meaningful boundary, not after every caption.
 * The horizontal rule fades physically left to right, even in RTL; parent layout supplies length.
 * The vertical rule is fixed at the token-derived 18px height, not the parent's full height.
 * className supports outer margins and grid placement only, not paint or dimensions.
 * There are no children, public refs, asChild, focus targets or interactive splitter behavior.
 */
const meta: Meta<typeof Divider> = {
  title: 'Primitives/Divider',
  component: Divider,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Divider>;

/** Uses the decorative horizontal defaults without replacing optional props. */
export const Default: Story = {};

/** A compact solid line separates two short text runs without growing to the row height. */
export const Vertical: Story = {
  args: { orientation: 'vertical' },
  render: (args) => (
    <div className='flex items-center gap-3'>
      <span>03</span>
      <Divider {...args} />
      <span>Think</span>
    </div>
  )
};

/** The horizontal fade fills the available space after an editorial eyebrow. */
export const InlineHeading: Story = {
  render: (args) => (
    <div className='flex items-center gap-4'>
      <span className='text-fg-brand-default' aria-hidden={true}>
        ◆
      </span>
      <span className='text-label-default'>Community</span>
      <Divider {...args} />
    </div>
  )
};

/** A named, non-focusable boundary is exposed as a separator with implicit horizontal orientation. */
export const SemanticHorizontal: Story = {
  args: { decorative: false, 'aria-label': 'Content boundary' }
};

/** Semantic orientation is explicit while geometry remains identical to the decorative vertical rule. */
export const SemanticVertical: Story = {
  args: { decorative: false, orientation: 'vertical', 'aria-label': 'Section boundary' },
  render: (args) => (
    <div className='flex items-center gap-3'>
      <span>Overview</span>
      <Divider {...args} />
      <span>Details</span>
    </div>
  )
};

/** Native RTL direction forwards without reversing the source's physical rightward fade. */
export const RTL: Story = { args: { dir: 'rtl' } };

/** An empty decorative span remains valid phrasing inside a named native control. */
export const InControl: Story = {
  render: (args) => (
    <button type='button' className='inline-flex items-center gap-3'>
      Open section
      <Divider {...args} orientation='vertical' />
      <span aria-hidden={true}>→</span>
    </button>
  )
};

/** Consumer margin and grid placement leave orientation-owned sizing and paint untouched. */
export const ConsumerLayout: Story = {
  args: { className: 'my-4 col-span-2' },
  render: (args) => (
    <div className='grid grid-cols-2'>
      <span>First region</span>
      <span>Second region</span>
      <Divider {...args} />
    </div>
  )
};
