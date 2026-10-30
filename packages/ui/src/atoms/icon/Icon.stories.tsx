import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { iconPaths } from './icon-paths';
import type { IconName } from './types';

const names = Object.keys(iconPaths) as IconName[];

/**
 * ## Description
 * One inline glyph from the closed 45-name system set: 1.75 stroke, round caps and joins,
 * no fill unless filled, and color inherited from the surrounding text (currentColor).
 *
 * ## Dependencies
 * Informative icons use Radix AccessibleIcon (`@radix-ui/react-accessible-icon`) for their
 * visually hidden name. Decorative icons render the bare svg.
 *
 * ## Usage guidelines
 * Icons are decorative by default: name the containing control instead, or pass `label` when
 * the icon carries meaning without visible text. Never rely on color alone. className supports
 * outer layout, `text-*` color tokens and spacing-scale `size-*` overrides for containers that
 * need 14, 15 or 18px glyphs; other appearance overrides are unsupported.
 */
const meta: Meta<typeof Icon> = {
  title: 'Atoms/Icon',
  component: Icon,
  tags: ['autodocs']
};
export default meta;
type Story = StoryObj<typeof Icon>;

/** Required glyph name only; size, fill and decorative defaults are preserved. */
export const Default: Story = {
  args: { name: 'search' }
};

/** Every glyph of the closed set with its name. */
export const Gallery: Story = {
  args: { name: 'search' },
  render: (args) => (
    <div className='grid grid-cols-6 gap-2'>
      {names.map((name) => (
        <div key={name} className='flex flex-col items-center gap-2 rounded-md border border-border-subtle px-2 py-4'>
          <Icon {...args} name={name} />
          <span className='text-meta text-fg-muted'>{name}</span>
        </div>
      ))}
    </div>
  )
};

/** The sm, md and lg presets: 16, 20 (--icon-size) and 28px. */
export const Sizes: Story = {
  args: { name: 'radio' },
  render: (args) => (
    <div className='flex items-center gap-4'>
      <Icon {...args} size='sm' />
      <Icon {...args} size='md' />
      <Icon {...args} size='lg' />
    </div>
  )
};

/** Solid glyph form: the fill follows currentColor and the stroke stays. */
export const Filled: Story = {
  args: { name: 'play', filled: true }
};

/** Color comes from the surrounding text; here a brand-colored parent. */
export const InheritedColor: Story = {
  args: { name: 'terminal' },
  render: (args) => (
    <span className='text-fg-brand-default'>
      <Icon {...args} />
    </span>
  )
};

/** Informative icon inside an icon-only control; AccessibleIcon supplies the name. */
export const Labelled: Story = {
  args: { name: 'search', label: 'Search' },
  render: (args) => (
    <button type='button' className='inline-grid place-items-center rounded-md p-2 text-fg-secondary'>
      <Icon {...args} />
    </button>
  )
};

/** Containers own off-preset sizes through spacing-scale size-* utilities: 14, 15 and 18px. */
export const ContainerSizes: Story = {
  args: { name: 'arrow-up-right' },
  render: (args) => (
    <div className='flex items-center gap-4'>
      <Icon {...args} className='size-3.5' />
      <Icon {...args} className='size-3.75' />
      <Icon {...args} className='size-4.5' />
    </div>
  )
};
