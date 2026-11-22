import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
import { ListItem, ListItemActions, ListItemBody, ListItemContent, ListItemMeta } from '../../molecules/list-item';
import { Icon } from '../icon';
import { IconButton } from './IconButton';

/**
 * ## Description
 * One icon-only action with a required accessible name. Use Button for ambiguous glyphs or pending actions,
 * and Toggle for persistent pressed state. Ghost is the default toolbar treatment; outline is the round
 * treatment the web's social rows use at lg, and the row itself is the SocialLinks molecule.
 *
 * ## Dependencies
 * Radix Slot/Slottable compose an empty anchor or router-link host. Radix AccessibleIcon hides the glyph
 * and supplies the hidden name. Examples use the merged Icon atom; custom SVG is supported.
 *
 * ## Usage guidelines
 * Supply a non-empty label and a decorative icon without its own label. Refs reach the native button or
 * slotted host. Disabled links are removed from tab order and activation is prevented. Consumers own
 * target/rel and tooltips. className supports only root margin, alignment and placement; appearance
 * overrides are unsupported. Enabled standalone controls extend to a 44.8px square under default tokens.
 * Reserve an unclipped visible gap at least one spacing token above the sum of adjacent target outsets.
 * With default tokens use gap-7 for sm/sm, gap-6 for sm/md, gap-5 for sm/lg or md/md, gap-4 for md/lg,
 * and gap-3 for lg/lg. Adjacent row centers need at least 48px or equivalent clearance with a token margin.
 * Avoid overlays; hover and Tooltip entry can occur outside the visible box. A slotted host
 * must spread props, forward its ref and avoid a competing ::after, clipping, overlays and ancestor scaling.
 * ButtonGroup and Tabs scroll controls suppress the extension; local token overrides can make targets smaller.
 */
const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { label: 'Search', icon: <Icon name='search' /> }
};
export default meta;
type Story = StoryObj<typeof IconButton>;

/** Required inputs only: native button, ghost treatment and md geometry remain runtime defaults. */
export const Default: Story = {};

/** All four approved treatments, without legacy modifier classes or local appearance overrides. */
export const Variants: Story = {
  render: (args) => (
    <div className='flex flex-wrap gap-7'>
      {(['ghost', 'outline', 'primary', 'secondary'] as const).map((variant) => (
        <IconButton {...args} key={variant} variant={variant} label={`${variant} action`} />
      ))}
    </div>
  )
};

/**
 * Visible boxes are 25.6/32/38.4px under default tokens; glyphs are 12.8px at sm and 16px otherwise.
 * The outline cell is the round treatment the web social rows use at lg.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className='flex flex-wrap items-center gap-7'>
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <IconButton {...args} key={size} size={size} />
      ))}
      <IconButton {...args} key='outline-lg' size='lg' variant='outline' label='outline social action' />
    </div>
  )
};

/** Equal and mixed-size neighbors use gap-7, including when the pairs wrap into multiple rows. */
export const AdjacentTargets: Story = {
  render: (args) => (
    <div className='flex flex-wrap gap-7'>
      {(
        [
          ['sm', 'sm'],
          ['md', 'md'],
          ['lg', 'lg'],
          ['sm', 'md'],
          ['md', 'lg']
        ] as const
      ).map(([first, second]) => (
        <div className='flex gap-7' key={`${first}-${second}`}>
          <IconButton {...args} size={first} label={`${first} first action`} />
          <IconButton {...args} size={second} label={`${second} second action`} />
        </div>
      ))}
    </div>
  )
};

/** Two-line rows keep a single independent trailing action and reserve space between neighboring rows. */
export const CompactListItem: Story = {
  render: (args) => (
    <div className='flex w-full flex-col gap-6'>
      {['Release notes', 'Review checklist'].map((title) => (
        <ListItem key={title} variant='row'>
          <ListItemBody>
            <ListItemContent>
              {title}
              <br />
              Details remain readable in the row.
            </ListItemContent>
          </ListItemBody>
          <ListItemMeta>Draft</ListItemMeta>
          <ListItemActions>
            <IconButton {...args} label={`Edit ${title}`} />
          </ListItemActions>
        </ListItem>
      ))}
    </div>
  )
};

/** Disabled controls retain treatment and opacity; native activation and focus are unavailable. */
export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className='flex gap-4'>
      {(['ghost', 'outline', 'primary', 'secondary'] as const).map((variant) => (
        <IconButton {...args} key={variant} variant={variant} />
      ))}
    </div>
  )
};

/** Tab, hover and press to inspect native interaction and the reduced-motion preference separately. */
export const States: Story = { args: { onClick: action('onClick') } };

/** An empty anchor receives the icon and hidden name; external-link policy belongs to its consumer. */
export const AsChildLink: Story = {
  args: { asChild: true, variant: 'outline', label: 'GitHub', icon: <Icon name='github' /> },
  render: (args) => (
    <IconButton {...args}>
      <a href='https://github.com/egdev6' target='_blank' rel='noreferrer' />
    </IconButton>
  )
};

/** A custom SVG receives preset geometry and Radix decorative attributes, just like a system glyph. */
export const RawSvg: Story = {
  args: {
    label: 'Add',
    icon: (
      <svg viewBox='0 0 24 24' fill='none' stroke='currentColor'>
        <path d='M12 5v14M5 12h14' />
      </svg>
    )
  }
};
