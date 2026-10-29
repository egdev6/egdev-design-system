import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { action } from 'storybook/actions';
import { SelectTile } from './SelectTile';
import type { SelectTileOption, SelectTileRatio } from './types';

const options: SelectTileOption[] = [
  { value: 'camera', label: 'Camera', meta: 'Two layers' },
  { value: 'slides', label: 'Slides', meta: 'Presentation output' },
  { value: 'break', label: 'Break', meta: 'Waiting scene' },
  { value: 'credits', label: 'Credits', meta: 'Closing scene' }
];

/**
 * ## Description
 * Choose recognizable visual options using single radios or independent multiple toggles.
 *
 * ## Dependencies
 * Surface recipes own Material frames and wells; AspectRatio reserves media geometry;
 * Badge supplies unmodified passive annotations. Radix owns keyboard, focus and selection.
 *
 * ## Usage guidelines
 * Supply unique non-empty values and meaningful labels. Live is independent of selection,
 * requires readable badge text, and may mark at most one option. Media is decorative.
 * Single submits a form value; multiple consumers serialize arrays themselves. Navigation
 * is horizontal and one-dimensional even when cards wrap into several rows.
 * className supports root margins, width, columns and parent layout, not part appearance.
 */
const meta: Meta<typeof SelectTile> = {
  title: 'Molecules/SelectTile',
  component: SelectTile,
  tags: ['autodocs'],
  args: { type: 'single', label: 'Scenes', options }
};
export default meta;
type Story = StoryObj<typeof SelectTile>;

/** Starts empty; click or Space selects, arrows select neighbours, Enter does not activate. */
export const Single: Story = { args: { onValueChange: action('single-value-change') } };

/** Toggles in activation order; arrows only focus and final removal produces an empty array. */
export const Multiple: Story = {
  args: { type: 'multiple', defaultValue: ['slides', 'credits'], onValueChange: action('multiple-value-change') }
};

/** The live camera is not selected; selection may move independently of the on-air output. */
export const LiveAndSelected: Story = {
  args: {
    defaultValue: 'slides',
    options: [{ value: 'camera', label: 'Camera', meta: 'Two layers', live: true, badge: 'Live' }, ...options.slice(1)]
  }
};

/** Every preset uses the same parent width and shared AspectRatio, without custom geometry. */
export const Ratios: Story = {
  render: () => (
    <>
      {(['landscape', 'portrait', 'story', 'square', 'wide', 'banner'] satisfies SelectTileRatio[]).map((ratio) => (
        <SelectTile key={ratio} type='single' label={ratio} ratio={ratio} options={[{ value: ratio, label: ratio }]} />
      ))}
    </>
  )
};

/** Absent media repeats the identifying label decoratively inside the reserved well. */
export const MissingThumbnail: Story = { args: { options: [{ value: 'camera', label: 'Camera' }] } };

/** An intentionally invalid inline image exercises the real browser error fallback, without fetching an asset. */
export const FailedThumbnail: Story = {
  args: {
    options: [{ value: 'preview', label: 'Unavailable preview', thumb: { src: 'data:image/png;base64,broken' } }]
  }
};

/** Disabled selected/live content remains readable and each whole card dims only once. */
export const Disabled: Story = {
  args: {
    disabled: true,
    defaultValue: 'camera',
    options: [{ value: 'camera', label: 'Camera', live: true, badge: 'Live' }, ...options.slice(1)]
  }
};

/** The consumer acknowledges each single-mode request through the authoritative value prop. */
export const Controlled: Story = {
  render: function ControlledTiles() {
    const [value, setValue] = useState('slides');
    return (
      <SelectTile
        type='single'
        label='Controlled scenes'
        options={options}
        value={value}
        onValueChange={(next) => {
          setValue(next);
          action('controlled-value-change')(next);
        }}
      />
    );
  }
};

/** Native required validity and Radix-owned hidden inputs participate in a real form. */
export const RequiredForm: Story = {
  render: () => (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        action('submit-scene')(Object.fromEntries(new FormData(event.currentTarget)));
      }}
    >
      <SelectTile type='single' label='Required scene' options={options} name='scene' required={true} />
      <button type='submit'>Submit scene</button>
    </form>
  )
};

/** Logical left/right navigation reverses without introducing two-dimensional grid semantics. */
export const RTL: Story = { args: { dir: 'rtl' } };

/** Host layout may use one column; long identifying captions wrap instead of truncating. */
export const Narrow: Story = {
  args: {
    className: 'grid-cols-1 w-48',
    options: [
      {
        value: 'long',
        label: 'Presentation with a long identifying scene name',
        meta: 'Supplementary details also wrap within the host'
      }
    ]
  }
};

/** A named empty collection has no controls and no keyboard entry point. */
export const Empty: Story = { args: { options: [] } };
