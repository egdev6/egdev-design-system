import type { Meta, StoryObj } from '@storybook/react-vite';
import { Isotipo3D } from './Isotipo3D';

/** A decorative isotype filling a positioned, token-backed host. */
const meta = {
  title: 'Atoms/Isotipo3D',
  component: Isotipo3D,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className='relative h-96 w-full bg-bg-canvas'>
        <Story />
      </div>
    )
  ]
} satisfies Meta<typeof Isotipo3D>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default hero animation. */
export const Default: Story = {};
/** Assembled hero pose with neutral pointer. */
export const Hero: Story = { args: { scene: 'hero', progress: 1, pointerTilt: false } };
/** Chapter pose. */
export const Chapter: Story = { args: { scene: 'chapter', progress: 0.5 } };
/** Exploded Lab pose. */
export const Lab: Story = { args: { scene: 'lab', progress: 0.5, pointerTilt: false } };
/** Closing pose. */
export const Outro: Story = { args: { scene: 'outro', progress: 1 } };
/** Semi-transparent layer. */
export const Opacity: Story = { args: { opacity: 0.5 } };
/** A zero-opacity layer suspends drawing. */
export const Paused: Story = { args: { opacity: 0 } };
/** A narrow host selects the low tier. */
export const Narrow: Story = {
  args: { scene: 'lab', progress: 0.5 },
  decorators: [
    (Story) => (
      <div className='relative h-96 w-64 bg-bg-canvas'>
        <Story />
      </div>
    )
  ]
};
