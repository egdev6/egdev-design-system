/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import diagnostic from '../../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url';
import { PhotoFrame } from './PhotoFrame';

/** Passive editorial media. The host owns image rights, useful alt, crop and caption contrast.
 * Layout className applies only to the figure; no appearance overrides are supported.
 */
const meta: Meta<typeof PhotoFrame> = { title: 'Atoms/PhotoFrame', component: PhotoFrame, tags: ['autodocs'] };
export default meta;
type Story = StoryObj<typeof PhotoFrame>;
const args = { src: diagnostic, alt: 'Diagnostic grid with labelled edges and quadrants' };
/** Required resource and alternative only. */
export const Default: Story = { args };
/** Caption follows the media, outside the cropped viewport. */
export const WithCaption: Story = { args: { ...args, imageCaption: 'Diagnostic crop fixture, not a photograph.' } };
/** Explicit empty alternative for decorative media. */
export const Decorative: Story = { args: { ...args, alt: '', imageCaption: 'Decorative grid' } };
/** Framed media has a resting tilt, removed by reduced motion. */
export const Framed: Story = { args: { ...args, variant: 'framed', imageCaption: 'Framed diagnostic grid' } };
/** Portrait proportions exercise horizontal cropping. */
export const Portrait: Story = { args: { ...args, ratio: 'portrait', focalPoint: 'left' } };
/** Square proportions retain the full square diagnostic source. */
export const Square: Story = { args: { ...args, ratio: 'square' } };
/** Request metadata is passed to the image, not the figure. */
export const ResponsiveImage: Story = { args: { ...args, srcSet: `${diagnostic} 1x`, sizes: '100vw' } };
/** Request eager loading when the host needs it. */
export const EagerImage: Story = { args: { ...args, loading: 'eager' } };
/** Caption is omitted without leaving a gap. */
export const WithoutCaption: Story = { args };
/** Long captions wrap in normal flow. */
export const LongCaption: Story = {
  args: {
    ...args,
    imageCaption:
      'A deliberately long diagnostic caption that wraps in a narrow layout without being clipped by the image viewport.'
  }
};
/** The three viewport ratios share one diagnostic resource. */
export const Ratios: Story = {
  args,
  render: () => (
    <div className='grid grid-cols-3 gap-6'>
      {(['square', 'portrait', 'landscape'] as const).map((ratio) => (
        <PhotoFrame key={ratio} {...args} ratio={ratio} imageCaption={ratio} />
      ))}
    </div>
  )
};
/** The diagnostic grid exposes horizontal and vertical cover choices. */
export const FocalPoints: Story = {
  args,
  render: () => (
    <div className='grid grid-cols-3 gap-6'>
      {(['portrait', 'landscape', 'square'] as const).flatMap((ratio) =>
        (['left', 'center', 'right', 'top', 'bottom'] as const).map((focalPoint) => (
          <PhotoFrame
            key={`${ratio}-${focalPoint}`}
            {...args}
            ratio={ratio}
            focalPoint={focalPoint}
            imageCaption={`${ratio} / ${focalPoint}`}
          />
        ))
      )}
    </div>
  )
};
/** Compare inherited foreground on different host contexts. */
export const HostContexts: Story = {
  args,
  render: () => (
    <div className='flex flex-col gap-6'>
      <div className='bg-surface-0 p-6 text-fg-default'>
        <PhotoFrame {...args} imageCaption='Canvas context' />
      </div>
      <div className='bg-surface-1 p-6 text-fg-default'>
        <PhotoFrame {...args} imageCaption='Raised context' />
      </div>
      <div className='bg-fg-brand-default p-6 text-fg-on-flood'>
        <PhotoFrame {...args} imageCaption='Flood context' />
      </div>
    </div>
  )
};
/** Emulate reduced motion in browser tools to inspect the resting frame tilt. */
export const ReducedMotion: Story = { args: { ...args, variant: 'framed', imageCaption: 'Reduced-motion comparison' } };
/** Legacy styles remain loaded beside the new utility recipe. */
export const LegacyCoexistence: Story = { args: { ...args, variant: 'framed', imageCaption: 'Legacy styles coexist' } };
/** The figure is passive and has no activation behavior. */
export const Passive: Story = { args: { ...args, imageCaption: 'Selectable plain caption' } };
/** Narrow host with a wrapping caption. */
export const Narrow: Story = {
  args: { ...args, imageCaption: 'A long diagnostic caption for a constrained host.', className: 'max-w-32' }
};
/** Caption remains in flow in a right-to-left host. */
export const RTL: Story = {
  args: { ...args, dir: 'rtl', imageCaption: 'Diagnostic caption in a right-to-left context.' }
};
/** The root accepts outer layout placement. */
export const ConsumerLayout: Story = {
  args: { ...args, className: 'mt-8 max-w-64 self-center', imageCaption: 'Host layout' }
};
