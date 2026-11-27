/// <reference types="vite/client" />
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useRef } from 'react';
import diagnostic from '../../../../docs/components/photo-frame/v0.3/fixtures/diagnostic.svg?url';
import { Button } from '../atoms/button';
import { PhotoFrame } from '../atoms/photo-frame';
import { Carousel, type CarouselItem } from '../molecules/carousel';
import { Dialog, DialogContent, DialogTrigger } from '../molecules/dialog';

/**
 * ## Description
 * An enlarged image view for a gallery, documented as a composition of delivered public components and not as a
 * component. A list of `PhotoFrame` thumbnails, each with its own `Button`, opens a full-size `Dialog`; inside it a
 * `Carousel` of `PhotoFrame` images with `fit='contain'` starts at the photo that was clicked. Arrow keys move between
 * photos, Home and End reach the first and last, Escape closes the dialog and focus returns to the button that opened
 * it. There is no GalleryLightbox export, no new API, no token and no appearance override.
 *
 * ## Why the app composes it
 * Issue #509 (PhotoFrame `fit`) settled that opening or enlarging an image is the host application's job, and #575
 * re-checked that decision against this request: every behaviour the lightbox needs already exists in a delivered
 * component, so the pattern is documented here instead of shipped as a new component or a Dialog variant.
 *
 * ## Dependencies
 * - `Dialog`, `DialogTrigger`, `DialogContent` (Radix Dialog): the modal, its focus trap, Escape, the scrim, the
 *   required visible `title` and the return of focus to the trigger. `size='full'` fills the viewport.
 * - `Carousel`: read-only slides with a stable identity (`defaultValue` picks the first one shown), Left and Right Arrow
 *   keys on the slide group, Home and End, Previous and Next buttons, a counter and a progress bar.
 * - `PhotoFrame`: the cropped thumbnails (default `cover`) and the whole, letterboxed slides (`fit='contain'`). It
 *   always renders a native `figure` and has no non-figure mode.
 * - `Button`: the visible trigger under each thumbnail (`size='lg'` meets the 44px touch target), composed onto
 *   `DialogTrigger` with `asChild`.
 *
 * ## Usage guidelines
 * - Keep the markup valid. A `figure` is flow content, so it must never sit inside a `button`, whose content is
 *   phrasing content only, or inside any other interactive element. Each list item holds the thumbnail `figure` and its
 *   trigger as siblings; the trigger is never a wrapper of the thumbnail.
 * - Render one `Dialog` per list item. The item's `Button` is that Dialog's `DialogTrigger`, so Radix returns focus to
 *   it on close, and the Carousel mounts only while the dialog is open, with `defaultValue` set to the clicked photo.
 * - The host owns every string: the list name, each thumbnail's `alt` and caption, the visible `Button` label and its
 *   accessible name (unique per photo, and containing the visible label), the dialog `title` (required, visible,
 *   localized), the `dismissLabel`, the Carousel `label` and optional `messages`, and each slide `label`.
 * - Slides stay read-only: a plain `PhotoFrame` caption is fine, links and controls inside a slide are not.
 * - Give every slide the same numeric `ratio`, so the viewer does not change height between photos; `contain` shows
 *   tall or wide images whole and letterboxes the spare axis.
 * - When the dialog opens, Radix focuses its first enabled control, the Previous or Next button, and the arrow keys
 *   act on the slide group. The recipe's `Viewer` moves focus to the current slide so the keys work at once; Radix
 *   leaves focus that is already inside the dialog alone and still restores it to the trigger on close. Without that
 *   step, Tab reaches the current slide.
 * - Layout utilities in this story (the list grid and the viewer width) belong to the story; a host chooses its own
 *   layout with its own tokens.
 * - If a second host needs identical behaviour, reopen #509 instead of copying this recipe into a component by drift.
 */
const meta = {
  title: 'Recipes/Gallery lightbox',
  parameters: { layout: 'padded' }
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/** Illustrative gallery entries; a real host supplies its own images, names and alternatives. */
const photos = [
  { value: 'workbench', label: 'Workbench' },
  { value: 'whiteboard', label: 'Whiteboard' },
  { value: 'prototype', label: 'Prototype' },
  { value: 'notes', label: 'Notes wall' },
  { value: 'desk', label: 'Desk setup' },
  { value: 'release', label: 'Release day' }
];

/**
 * Host-owned, localizable wording; the recipe fixes none of it. The trigger shows a short `enlarge` label and takes the
 * longer `enlargeNamed` accessible name, which starts with the visible label so the two never disagree.
 */
const text = {
  gallery: 'Photo gallery',
  title: 'Studio photos',
  carousel: 'Photos',
  dismiss: 'Close photos',
  enlarge: 'Enlarge',
  enlargeNamed: (label: string) => `Enlarge photo: ${label}`,
  alt: (label: string) => `Diagnostic grid fixture standing in for the photograph "${label}"`
};

/** One slide per photo: a letterboxed `contain` image in a viewport that keeps the same proportion for every photo. */
const slides: CarouselItem[] = photos.map(({ value, label }) => ({
  value,
  label,
  children: <PhotoFrame src={diagnostic} alt={text.alt(label)} ratio={16 / 9} fit='contain' imageCaption={label} />
}));

/** The enlarged view: every photo in one Carousel, starting at the one the reader opened. */
function Viewer({ start }: { start: string }) {
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // The arrow keys, Home and End act on the slide group, so hand initial focus to the current slide.
    frame.current?.querySelector<HTMLElement>('[aria-current="true"]')?.focus({ preventScroll: true });
  }, []);
  return (
    <div ref={frame} className='mx-auto w-full max-w-[calc(var(--space-24)*10)]'>
      <Carousel label={text.carousel} defaultValue={start} items={slides} />
    </div>
  );
}

/**
 * A list of thumbnails; each item holds a `PhotoFrame` figure and, beside it, the `Button` that opens its own
 * full-size dialog at its own photo. The trigger is a sibling of the figure, never a wrapper, so the markup stays
 * valid. The thumbnails crop to a square and the enlarged view shows each image whole. Open one with the pointer or
 * with Enter and Space, move with the arrow keys, Home and End, and close with Escape to return to its button.
 */
export const Default: Story = {
  render: () => (
    <ul aria-label={text.gallery} className='m-0 grid list-none grid-cols-3 gap-6 p-0'>
      {photos.map(({ value, label }) => (
        <li key={value} className='flex min-w-0 flex-col gap-3'>
          <PhotoFrame src={diagnostic} alt={text.alt(label)} ratio='square' imageCaption={label} />
          <Dialog>
            <DialogTrigger asChild={true}>
              <Button variant='neutral' size='lg' aria-label={text.enlargeNamed(label)}>
                {text.enlarge}
              </Button>
            </DialogTrigger>
            <DialogContent title={text.title} size='full' dismissLabel={text.dismiss}>
              <Viewer start={value} />
            </DialogContent>
          </Dialog>
        </li>
      ))}
    </ul>
  )
};
