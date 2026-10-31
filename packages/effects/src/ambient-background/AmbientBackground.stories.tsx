import type { Meta, StoryObj } from '@storybook/react-vite';
import { AmbientBackground } from './AmbientBackground';

/** A decorative particle layer filling its positioned host. */
const meta = {
  title: 'Atoms/AmbientBackground',
  component: AmbientBackground,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='relative h-96 w-full overflow-hidden'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof AmbientBackground>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The default base profile. */
export const Default: Story = {};
/** A quieter profile. */
export const Read: Story = { args: { profile: 'read' } };
/** A denser profile. */
export const Live: Story = { args: { profile: 'live' } };
/** Layer opacity can be controlled by the host. */
export const Opacity: Story = { args: { opacity: 0.5 } };
/** Density adapts to the actual container width. */
export const NarrowContainer: Story = {
  decorators: [
    (Story) => (
      <div className='relative h-96 w-64 overflow-hidden'>
        <Story />
      </div>
    )
  ]
};
