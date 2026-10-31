import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PhotoFrame } from './PhotoFrame';
import * as stories from './PhotoFrame.stories';
import type { PhotoFrameProps } from './types';

const base = { src: '/diagnostic.svg', alt: 'Diagnostic grid' } satisfies PhotoFrameProps;

describe('PhotoFrame', () => {
  it('provides the planned diagnostic story matrix with the adopted fixture', () => {
    expect(Object.keys(stories)).toEqual(
      expect.arrayContaining([
        'Default',
        'WithCaption',
        'Decorative',
        'Ratios',
        'ResponsiveImage',
        'EagerImage',
        'WithoutCaption',
        'LongCaption',
        'HostContexts',
        'FocalPoints',
        'Framed',
        'ReducedMotion',
        'LegacyCoexistence',
        'Passive',
        'Narrow',
        'RTL',
        'ConsumerLayout'
      ])
    );
    expect(stories.Default.args?.src).toMatch(/^data:image\/svg\+xml;base64,/);
  });
  it('renders passive native defaults with real landscape reservation', () => {
    const { container } = render(<PhotoFrame {...base} />);
    const figure = screen.getByRole('figure');
    const image = screen.getByRole('img', { name: base.alt });
    expect(figure).toHaveClass('eg-photo');
    expect(image).toHaveClass('eg-photo__img', 'object-cover', 'object-center');
    expect(image).toHaveAttribute('src', base.src);
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image).toHaveAttribute('decoding', 'async');
    expect(figure.querySelector('[data-radix-aspect-ratio-wrapper]')).toHaveStyle({ paddingBottom: '75%' });
    expect(container.querySelector('figcaption')).toBeNull();
    expect(figure).not.toHaveAttribute('role');
    expect(figure).not.toHaveAttribute('tabindex');
  });

  it.each([
    ['square', '100%'],
    ['portrait', '125%'],
    ['landscape', '75%']
  ] as const)('maps %s to its own reservation', (ratio, paddingBottom) => {
    const { container } = render(<PhotoFrame {...base} ratio={ratio} width={99} height={10} />);
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toHaveStyle({ paddingBottom });
    expect(screen.getByRole('img')).toHaveAttribute('width', '99');
  });

  it.each(['center', 'top', 'bottom', 'left', 'right'] as const)('uses static %s cover alignment', (focalPoint) => {
    render(<PhotoFrame {...base} focalPoint={focalPoint} />);
    expect(screen.getByRole('img')).toHaveClass(`object-${focalPoint}`);
  });

  it('routes image attributes and native events only to the image and root attributes only to figure', () => {
    const observed: EventTarget[] = [];
    const onLoad = vi.fn((event: React.SyntheticEvent<HTMLImageElement>) => observed.push(event.currentTarget));
    const onError = vi.fn((event: React.SyntheticEvent<HTMLImageElement>) => observed.push(event.currentTarget));
    const { rerender } = render(
      <PhotoFrame
        {...base}
        id='frame'
        aria-describedby='note'
        srcSet='/a 1x'
        sizes='100vw'
        width={300}
        height={200}
        loading='eager'
        decoding='sync'
        crossOrigin='anonymous'
        referrerPolicy='no-referrer'
        onLoad={onLoad}
        onError={onError}
      />
    );
    const image = screen.getByRole('img');
    const figure = screen.getByRole('figure');
    expect(figure).toHaveAttribute('id', 'frame');
    expect(figure).toHaveAttribute('aria-describedby', 'note');
    expect(figure).not.toHaveAttribute('src');
    expect(image).not.toHaveAttribute('id');
    for (const [key, value] of Object.entries({
      srcset: '/a 1x',
      sizes: '100vw',
      width: '300',
      height: '200',
      loading: 'eager',
      decoding: 'sync',
      crossorigin: 'anonymous',
      referrerpolicy: 'no-referrer'
    })) {
      expect(image).toHaveAttribute(key, value);
    }
    fireEvent.load(image);
    fireEvent.error(image);
    expect(onLoad).toHaveBeenCalledOnce();
    expect(onError).toHaveBeenCalledOnce();
    expect(observed).toEqual([image, image]);
    rerender(<PhotoFrame {...base} src='/diagnostic.svg?next' />);
    expect(screen.getByRole('img')).toHaveAttribute('src', '/diagnostic.svg?next');
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('omits blank captions and preserves supplied text outside the media', () => {
    const { container, rerender } = render(<PhotoFrame {...base} imageCaption='  ' />);
    expect(container.querySelector('figcaption')).toBeNull();
    expect(screen.getByRole('figure')).not.toHaveClass('gap-3', 'gap-10');
    rerender(<PhotoFrame {...base} imageCaption='  Context  ' variant='framed' />);
    const caption = container.querySelector('figcaption');
    expect(caption).toHaveClass('eg-photo__cap');
    expect(caption?.textContent).toBe('  Context  ');
    expect(caption?.parentElement).toBe(screen.getByRole('figure'));
    expect(caption?.querySelector('span')).toHaveClass('eg-photo__label');
    expect(screen.getByRole('figure')).toHaveClass('gap-10');
  });

  it('preserves explicit decorative alt separately from caption', () => {
    const { container } = render(<PhotoFrame src='/x' alt='' imageCaption='Context' />);
    expect(container.querySelector('img')).toHaveAttribute('alt', '');
    expect(container.querySelector('figcaption')).toHaveTextContent('Context');
    expect(screen.queryByRole('img')).toBeNull();
  });

  it('uses the approved media recipe, resets legacy and merges root layout only', () => {
    const { container } = render(<PhotoFrame {...base} variant='framed' className='mt-8 w-64' />);
    const figure = screen.getByRole('figure');
    const frame = figure.firstElementChild;
    expect(figure).toHaveClass('eg-photo', 'mt-8', 'w-64', 'after:content-none', 'overflow-visible');
    expect(frame).toHaveClass('eg-surface', 'bg-surface-0', 'p-1.5', 'motion-reduce:rotate-none');
    expect(frame).not.toHaveClass('mt-8');
    expect(container.querySelector('img')).toHaveClass('static', 'inset-auto', 'filter-none');
    expect(figure).not.toHaveClass('eg-photo--framed');
  });

  it('falls back for unknown enums without leaking them to the DOM', () => {
    const invalid = { ratio: 'bad', variant: 'bad', focalPoint: 'bad' } as unknown as PhotoFrameProps;
    const { container } = render(<PhotoFrame {...base} {...invalid} />);
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toHaveStyle({ paddingBottom: '75%' });
    expect(screen.getByRole('img')).toHaveClass('object-center');
    expect(screen.getByRole('figure')).toHaveAttribute('data-variant', 'default');
  });

  it('rejects unsupported APIs at the type boundary', () => {
    // @ts-expect-error src and alt are required.
    const missing: PhotoFrameProps = {};
    // @ts-expect-error no children API.
    const children: PhotoFrameProps = { ...base, children: 'x' };
    // @ts-expect-error no interactive root.
    const click: PhotoFrameProps = { ...base, onClick: () => undefined };
    // @ts-expect-error no ref forwarding.
    const ref: PhotoFrameProps = { ...base, ref: null };
    // @ts-expect-error no composition API.
    const slot: PhotoFrameProps = { ...base, asChild: true };
    expect([missing, children, click, ref, slot]).toHaveLength(5);
  });
});
