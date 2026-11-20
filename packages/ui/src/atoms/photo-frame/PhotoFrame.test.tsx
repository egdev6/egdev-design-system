import { fireEvent, render, screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { PhotoFrame } from './PhotoFrame';
import * as stories from './PhotoFrame.stories';
import type { PhotoFrameFit, PhotoFrameProps } from './types';

const base = { src: '/diagnostic.svg', alt: 'Diagnostic grid' } satisfies PhotoFrameProps;
const focalPointClasses = {
  center: 'object-center',
  top: 'object-top',
  bottom: 'object-bottom',
  left: 'object-left',
  right: 'object-right',
  'left-top': 'object-left-top',
  'right-top': 'object-right-top',
  'left-bottom': 'object-left-bottom',
  'right-bottom': 'object-right-bottom'
} as const;
const focalPoints = Object.keys(focalPointClasses) as (keyof typeof focalPointClasses)[];
const storyRender = (story: { render?: unknown }) => render((story.render as () => ReactElement)());

/** Serialized default output captured from the unmodified v0.4 code (base 2c29b88) before `fit` existed. */
const baseline: Record<string, string> = {
  default:
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div></figure>',
  'ratio:square':
    '<figure data-ratio="square" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 100%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div></figure>',
  'ratio:portrait':
    '<figure data-ratio="portrait" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 125%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div></figure>',
  'ratio:landscape':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div></figure>',
  'ratio:auto':
    '<figure data-ratio="auto" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0 h-full min-h-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none h-full"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></figure>',
  'ratio:numeric':
    '<figure data-ratio="0.8044943820224719" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 124.30167597765363%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div></figure>',
  framed:
    '<figure data-ratio="landscape" data-variant="framed" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-0 rounded-xl border-border-hairline-strong shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] bg-[image:var(--gradient-sheen)] transition-none p-1.5 rotate-[calc(var(--tilt-max)/3)] motion-reduce:rotate-none motion-reduce:transform-none motion-reduce:transition-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-lg"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div></figure>',
  caption:
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-3"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div><figcaption class="eg-photo__cap relative inset-auto z-auto m-0 block min-w-0 pointer-events-auto"><span class="eg-photo__label block min-w-0 font-display text-label-eyebrow uppercase text-inherit before:content-none">Context</span></figcaption></figure>',
  'framed-caption':
    '<figure data-ratio="landscape" data-variant="framed" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-10"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-0 rounded-xl border-border-hairline-strong shadow-[var(--shadow-edge-strong),var(--shadow-elev-2)] bg-[image:var(--gradient-sheen)] transition-none p-1.5 rotate-[calc(var(--tilt-max)/3)] motion-reduce:rotate-none motion-reduce:transform-none motion-reduce:transition-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-lg"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div><figcaption class="eg-photo__cap relative inset-auto z-auto m-0 block min-w-0 pointer-events-auto"><span class="eg-photo__label block min-w-0 font-display text-label-eyebrow uppercase text-inherit before:content-none">Context</span></figcaption></figure>',
  'focal:center':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="center" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-center" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:top':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="top" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-top" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:bottom':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="bottom" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-bottom" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:left':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="left" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-left" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:right':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="right" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-right" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:left-top':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="left-top" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-left-top" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:right-top':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="right-top" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-right-top" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:left-bottom':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="left-bottom" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-left-bottom" src="/diagnostic.svg"></div></div></div></div></figure>',
  'focal:right-bottom':
    '<figure data-ratio="landscape" data-variant="default" data-focal-point="right-bottom" class="eg-photo m-0 min-w-0 flex flex-col overflow-visible rounded-none bg-transparent bg-none shadow-none transform-none transition-none after:content-none gap-0"><div class="eg-surface box-border border border-solid text-fg-default bg-surface-1 bg-[image:var(--gradient-sheen)] p-0 rounded-xl border-border-hairline shadow-[var(--shadow-edge),var(--shadow-elev-1)] transition-none transform-none rotate-none"><div style="position: relative; width: 100%; padding-bottom: 75%;" data-radix-aspect-ratio-wrapper=""><div class="eg-aspect-ratio min-w-0" style="position: absolute; top: 0px; right: 0px; bottom: 0px; left: 0px;"><div class="size-full overflow-hidden rounded-xl"><img alt="Diagnostic grid" loading="lazy" decoding="async" class="eg-photo__img static inset-auto block size-full max-w-none object-cover filter-none object-right-bottom" src="/diagnostic.svg"></div></div></div></div></figure>'
};

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
        'AutoHeight',
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

  it.each(focalPoints)('maps %s to exactly its own static object position', (focalPoint) => {
    render(<PhotoFrame {...base} focalPoint={focalPoint} />);
    const image = screen.getByRole('img');
    expect(image).toHaveClass(focalPointClasses[focalPoint]);
    expect(image.className.match(/\bobject-(?:center|top|bottom|left|right)(?:-(?:top|bottom))?\b/g)).toEqual([
      focalPointClasses[focalPoint]
    ]);
  });

  it('keeps the five v0.2 focal points at their previous utilities', () => {
    for (const focalPoint of ['center', 'top', 'bottom', 'left', 'right'] as const) {
      const { unmount } = render(<PhotoFrame {...base} focalPoint={focalPoint} />);
      expect(screen.getByRole('img')).toHaveClass(`object-${focalPoint}`);
      unmount();
    }
  });

  it('reserves nothing for auto and fills the host-provided height', () => {
    const { container } = render(<PhotoFrame {...base} ratio='auto' />);
    const figure = screen.getByRole('figure');
    const frame = figure.firstElementChild as HTMLElement;
    const viewport = frame.firstElementChild as HTMLElement;
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toBeNull();
    expect(figure).toHaveAttribute('data-ratio', 'auto');
    expect(frame).toHaveClass('eg-surface', 'h-full');
    expect(viewport).toHaveClass('size-full', 'rounded-xl');
    expect(viewport.firstElementChild).toBe(screen.getByRole('img'));
    expect(screen.getByRole('img')).toHaveClass('object-cover', 'object-center');
  });

  it('stretches the root only for auto so a grid, flex or block host can size it', () => {
    const auto = render(<PhotoFrame {...base} ratio='auto' className='mt-8' />);
    expect(screen.getByRole('figure')).toHaveClass('h-full', 'min-h-0', 'mt-8');
    auto.unmount();
    for (const ratio of [undefined, 'square', 'portrait', 'landscape', 716 / 890] as const) {
      const { unmount } = render(<PhotoFrame {...base} ratio={ratio} />);
      expect(screen.getByRole('figure')).not.toHaveClass('h-full', 'min-h-0');
      unmount();
    }
  });

  it('invents no fallback geometry for auto', () => {
    const { container } = render(<PhotoFrame {...base} ratio='auto' />);
    const figure = screen.getByRole('figure');
    const frame = figure.firstElementChild as HTMLElement;
    const viewport = frame.firstElementChild as HTMLElement;
    for (const element of [frame, viewport, screen.getByRole('img')]) {
      expect(element).not.toHaveAttribute('style');
      expect(element.className).not.toMatch(/\bmin-(?:h|w)-/);
    }
    expect(figure.childElementCount).toBe(1);
    expect(frame.childElementCount).toBe(1);
    expect(container.querySelector('[data-ratio="auto"] [aria-hidden]')).toBeNull();
  });

  it('reserves a numeric proportion through AspectRatio without inline image appearance', () => {
    const { container } = render(<PhotoFrame {...base} ratio={716 / 890} />);
    const wrapper = container.querySelector('[data-radix-aspect-ratio-wrapper]') as HTMLElement;
    expect(Number.parseFloat(wrapper.style.paddingBottom)).toBeCloseTo(124.3, 1);
    expect(screen.getByRole('figure')).toHaveAttribute('data-ratio', String(716 / 890));
    expect(screen.getByRole('img')).not.toHaveAttribute('style');
  });

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    'falls back to a square for the unrepresentable numeric ratio %s',
    (ratio) => {
      const { container } = render(<PhotoFrame {...base} ratio={ratio} />);
      expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toHaveStyle({ paddingBottom: '100%' });
      expect(screen.getByRole('figure')).toHaveAttribute('data-ratio', 'square');
    }
  );

  it('keeps every ratio and focal point free of inline appearance', () => {
    for (const ratio of ['square', 'portrait', 'landscape', 'auto', 716 / 890] as const) {
      for (const focalPoint of focalPoints) {
        const { unmount } = render(<PhotoFrame {...base} ratio={ratio} focalPoint={focalPoint} />);
        expect(screen.getByRole('img')).not.toHaveAttribute('style');
        unmount();
      }
    }
  });

  it.each(focalPoints)('composes auto with the framed recipe for %s without extra classes', (focalPoint) => {
    const preset = render(<PhotoFrame {...base} variant='framed' focalPoint={focalPoint} />);
    const expected = preset.container.querySelector('figure') as HTMLElement;
    const expectedFrame = expected.firstElementChild as HTMLElement;
    const expectedImage = preset.container.querySelector('img') as HTMLElement;
    const expectedViewport = expectedImage.parentElement as HTMLElement;
    const expectedImageClassName = expectedImage.className;
    preset.unmount();
    const { container } = render(<PhotoFrame {...base} ratio='auto' variant='framed' focalPoint={focalPoint} />);
    const figure = screen.getByRole('figure');
    const frame = figure.firstElementChild as HTMLElement;
    const viewport = frame.firstElementChild as HTMLElement;
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toBeNull();
    expect(new Set(frame.className.split(' '))).toEqual(new Set([...expectedFrame.className.split(' '), 'h-full']));
    expect(viewport.className).toBe(expectedViewport.className);
    expect(frame).toHaveClass('p-1.5', 'motion-reduce:rotate-none');
    expect(screen.getByRole('img').className).toBe(expectedImageClassName);
  });

  it('demonstrates the supported definite-height host for auto', () => {
    const { container } = storyRender(stories.AutoHeight);
    expect(container.firstElementChild).toHaveClass('h-96');
    expect(container.querySelector('[data-ratio="auto"]')).not.toBeNull();
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toBeNull();
  });

  it('renders the extended focal-point matrix story', () => {
    const { container } = storyRender(stories.FocalPoints);
    const rendered = [...container.querySelectorAll('figure')].map((figure) => figure.getAttribute('data-focal-point'));
    expect(new Set(rendered)).toEqual(new Set(focalPoints));
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
    const invalid = { ratio: 'wide', variant: 'bad', focalPoint: 'middle' } as unknown as PhotoFrameProps;
    const { container } = render(<PhotoFrame {...base} {...invalid} />);
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toHaveStyle({ paddingBottom: '75%' });
    expect(screen.getByRole('img')).toHaveClass('object-center');
    expect(screen.getByRole('figure')).toHaveAttribute('data-variant', 'default');
    expect(screen.getByRole('figure')).toHaveAttribute('data-ratio', 'landscape');
    expect(screen.getByRole('figure')).toHaveAttribute('data-focal-point', 'center');
    expect(container.innerHTML).not.toMatch(/wide|middle/);
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

const fingerprintProps: Record<string, Partial<PhotoFrameProps>> = {
  default: {},
  'ratio:square': { ratio: 'square' },
  'ratio:portrait': { ratio: 'portrait' },
  'ratio:landscape': { ratio: 'landscape' },
  'ratio:auto': { ratio: 'auto' },
  'ratio:numeric': { ratio: 716 / 890 },
  framed: { variant: 'framed' },
  caption: { imageCaption: 'Context' },
  'framed-caption': { variant: 'framed', imageCaption: 'Context' },
  ...Object.fromEntries(focalPoints.map((focalPoint) => [`focal:${focalPoint}`, { focalPoint }]))
};
const fingerprintKeys = Object.keys(fingerprintProps);
const ratios = ['square', 'portrait', 'landscape', 'auto', 716 / 890] as const;
const withFit = (fit: unknown) => ({ fit }) as unknown as Partial<PhotoFrameProps>;
const nodeStyles = (container: HTMLElement) =>
  [...container.querySelectorAll('*')].map((node) => (node.hasAttribute('style') ? node.tagName : ''));

describe('PhotoFrame fit (v0.5)', () => {
  it('pins a baseline fingerprint for every matrix case', () => {
    expect(Object.keys(baseline).sort()).toEqual([...fingerprintKeys].sort());
  });

  it.each(fingerprintKeys)(
    'PF5-01 keeps the v0.4 output byte-identical for %s with fit omitted, cover or unknown',
    (key) => {
      for (const fit of [undefined, 'cover', 'fill', null, 3]) {
        const { container, unmount } = render(<PhotoFrame {...base} {...fingerprintProps[key]} {...withFit(fit)} />);
        expect(container.innerHTML).toBe(baseline[key]);
        unmount();
      }
      const plain = render(<PhotoFrame {...base} {...fingerprintProps[key]} />);
      expect(plain.container.innerHTML).toBe(baseline[key]);
    }
  );

  it.each(ratios)('PF5-02 gives contain object-contain and no object-cover on the image only (ratio %s)', (ratio) => {
    const cover = render(<PhotoFrame {...base} ratio={ratio} fit='cover' imageCaption='c' />);
    const coverClasses = [...cover.container.querySelectorAll('*')].map((node) => node.className);
    cover.unmount();
    const { container } = render(<PhotoFrame {...base} ratio={ratio} fit='contain' imageCaption='c' />);
    const image = screen.getByRole('img');
    expect(image).toHaveClass('eg-photo__img', 'object-contain', 'object-center');
    expect(image).not.toHaveClass('object-cover');
    const differing = [...container.querySelectorAll('*')].filter(
      (node, index) => node.className !== coverClasses[index]
    );
    expect(differing).toEqual([image]);
    expect(container.innerHTML.match(/object-contain/g)).toHaveLength(1);
  });

  it('PF5-03 falls back to cover for an unknown fit without leaking it to the DOM', () => {
    for (const fit of ['fill', 'none', 'scale-down', '', null, 0]) {
      const { container, unmount } = render(<PhotoFrame {...base} {...withFit(fit)} />);
      expect(screen.getByRole('img')).toHaveClass('object-cover');
      expect(screen.getByRole('img')).not.toHaveClass('object-contain');
      expect(container.innerHTML).toBe(baseline.default);
      expect(container.innerHTML).not.toMatch(/fill|scale-down|data-fit/);
      unmount();
    }
  });

  it.each(ratios)('PF5-04 keeps the reservation unchanged under contain (ratio %s)', (ratio) => {
    const cover = render(<PhotoFrame {...base} ratio={ratio} fit='cover' />);
    const coverWrapper = cover.container.querySelector('[data-radix-aspect-ratio-wrapper]') as HTMLElement | null;
    const coverPadding = coverWrapper?.style.paddingBottom;
    const coverRoot = screen.getByRole('figure').className;
    const coverMarker = screen.getByRole('figure').getAttribute('data-ratio');
    const coverFrame = (screen.getByRole('figure').firstElementChild as HTMLElement).className;
    cover.unmount();
    const { container } = render(<PhotoFrame {...base} ratio={ratio} fit='contain' />);
    const wrapper = container.querySelector('[data-radix-aspect-ratio-wrapper]') as HTMLElement | null;
    expect(wrapper?.style.paddingBottom).toBe(coverPadding);
    expect(wrapper === null).toBe(ratio === 'auto');
    expect(screen.getByRole('figure').className).toBe(coverRoot);
    expect((screen.getByRole('figure').firstElementChild as HTMLElement).className).toBe(coverFrame);
    expect(screen.getByRole('figure').getAttribute('data-ratio')).toBe(coverMarker);
  });

  it('PF5-04 keeps auto stretching the figure and filling the host height under contain', () => {
    render(<PhotoFrame {...base} ratio='auto' fit='contain' />);
    expect(screen.getByRole('figure')).toHaveClass('h-full', 'min-h-0');
    expect(screen.getByRole('figure').firstElementChild).toHaveClass('h-full');
  });

  it.each(ratios)('PF5-05 adds no inline appearance and keeps the media Surface classes (ratio %s)', (ratio) => {
    const cover = render(<PhotoFrame {...base} ratio={ratio} fit='cover' />);
    const coverStyles = nodeStyles(cover.container);
    const coverMedia = (screen.getByRole('figure').firstElementChild as HTMLElement).className;
    cover.unmount();
    const { container } = render(<PhotoFrame {...base} ratio={ratio} fit='contain' />);
    expect(nodeStyles(container)).toEqual(coverStyles);
    expect(screen.getByRole('img')).not.toHaveAttribute('style');
    expect((screen.getByRole('figure').firstElementChild as HTMLElement).className).toBe(coverMedia);
    expect(coverMedia).toContain('eg-surface');
    expect(container.innerHTML).not.toMatch(/object-\[|\[object|style="[^"]*object-fit/);
  });

  it('PF5-05 keeps the framed media Surface under contain', () => {
    render(<PhotoFrame {...base} variant='framed' fit='contain' />);
    expect(screen.getByRole('figure').firstElementChild).toHaveClass('eg-surface', 'bg-surface-0', 'p-1.5');
  });

  it.each(focalPoints)(
    'PF5-06 composes contain with focalPoint %s, framed and caption without extra classes',
    (focalPoint) => {
      const cover = render(<PhotoFrame {...base} focalPoint={focalPoint} variant='framed' imageCaption='Caption' />);
      const coverNodes = [...cover.container.querySelectorAll('*')].map((node) => new Set(node.className.split(' ')));
      const coverMarkers = screen.getByRole('figure').getAttributeNames();
      cover.unmount();
      const { container } = render(
        <PhotoFrame {...base} focalPoint={focalPoint} variant='framed' imageCaption='Caption' fit='contain' />
      );
      const figure = screen.getByRole('figure');
      const image = screen.getByRole('img');
      const nodes = [...container.querySelectorAll('*')];
      nodes.forEach((node, index) => {
        const expected = new Set(coverNodes[index]);
        if (node === image) {
          expected.delete('object-cover');
          expected.add('object-contain');
        }
        expect(new Set(node.className.split(' '))).toEqual(expected);
      });
      expect(image).toHaveClass(focalPointClasses[focalPoint]);
      expect(figure).toHaveAttribute('data-focal-point', focalPoint);
      expect(figure).toHaveAttribute('data-variant', 'framed');
      expect(figure.getAttributeNames()).toEqual(coverMarkers);
      expect(figure).not.toHaveAttribute('data-fit');
      expect(container.querySelector('figcaption')).toHaveTextContent('Caption');
    }
  );

  it('keeps the fit change at runtime to the static class without remounting the image', () => {
    const { rerender } = render(<PhotoFrame {...base} />);
    const image = screen.getByRole('img');
    rerender(<PhotoFrame {...base} fit='contain' />);
    expect(screen.getByRole('img')).toBe(image);
    expect(image).toHaveClass('object-contain');
    expect(image).not.toHaveClass('object-cover');
    rerender(<PhotoFrame {...base} fit='cover' />);
    expect(screen.getByRole('img')).toBe(image);
    expect(image).toHaveClass('object-cover');
    expect(image).not.toHaveClass('object-contain');
  });

  it('rejects unsupported fit values at the type boundary', () => {
    // @ts-expect-error only cover and contain are supported.
    const fill: PhotoFrameProps = { ...base, fit: 'fill' };
    const contain: PhotoFrameProps = { ...base, fit: 'contain' satisfies PhotoFrameFit };
    expect([fill, contain]).toHaveLength(2);
  });

  it('provides the Fit story with a tall screenshot fixture and the PF-5 recommendation', () => {
    expect(Object.keys(stories)).toContain('Fit');
    const { container } = storyRender(stories.Fit);
    const images = [...container.querySelectorAll('img')];
    expect(images.length).toBeGreaterThanOrEqual(4);
    expect(new Set(images.map((image) => image.getAttribute('src'))).size).toBe(1);
    expect(images.some((image) => image.classList.contains('object-contain'))).toBe(true);
    expect(images.some((image) => image.classList.contains('object-cover'))).toBe(true);
    const framed = container.querySelector('[data-variant="framed"][data-focal-point="top"]');
    expect(framed?.querySelector('img')).toHaveClass('object-contain');
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).not.toBeNull();
  });
});
