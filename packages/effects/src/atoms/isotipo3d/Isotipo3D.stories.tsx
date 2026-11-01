import type { Meta, StoryObj } from '@storybook/react-vite';
import { action } from 'storybook/actions';
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
/** A paused prop freezes the idle loop at the current pose; gestures still repaint. */
export const PausedLoop: Story = { args: { paused: true } };
/** Drag to rotate with the user-driven pose logged; a fast or far horizontal drag flips. */
export const DragRotate: Story = {
  args: { dragRotate: true, flip: true, onPoseChange: action('onPoseChange') }
};
/** Double-click (or a drag released past the threshold) toggles the 180° flip. */
export const Flip: Story = { args: { flip: true, onPoseChange: action('onPoseChange') } };
/** Interactive mode: focus the logo and use Arrow keys to rotate, Enter/Space to flip. */
export const InteractiveKeyboard: Story = {
  args: {
    interactive: true,
    label: 'EGDEV isotype',
    dragRotate: true,
    flip: true,
    onPoseChange: action('onPoseChange')
  }
};
/** With the host emulating prefers-reduced-motion, drags apply immediately without inertia or spring-back and flips swap instantly. */
export const DragReducedMotion: Story = {
  args: { dragRotate: true, flip: true, onPoseChange: action('onPoseChange') }
};
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
