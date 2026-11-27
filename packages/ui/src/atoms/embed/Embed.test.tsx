import { readFileSync } from 'node:fs';
import { act, fireEvent, render, renderHook, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef, type ReactEventHandler, StrictMode, type SyntheticEvent } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { afterEach, describe, expect, expectTypeOf, it, vi } from 'vitest';
import { Embed } from './Embed';
import {
  type EmbedProps,
  embedFallbackVariants,
  embedFrameVariants,
  embedLoadingVariants,
  embedVariants
} from './types';
import { useEmbed } from './useEmbed';

const consoleWarn = vi.spyOn(console, 'warn').mockImplementation(() => {
  // Intentionally silent: development warnings are asserted, not printed.
});

afterEach(() => {
  consoleWarn.mockClear();
  vi.unstubAllEnvs();
});

// The one documented cast: a JavaScript caller can pass values that the public type rejects.
function untyped(props: Record<string, unknown>): EmbedProps {
  return props as unknown as EmbedProps;
}

const wellTokens = [
  'eg-surface',
  'bg-surface-0',
  'border-border-hairline',
  'shadow-[var(--shadow-well)]',
  'rounded-xl',
  'p-0'
];

describe('Embed root (EM-01)', () => {
  it('renders one well root with the stable marker around one reserved box', () => {
    const { container } = render(<Embed label='Keynote recording' src='/keynote' />);
    const root = container.firstElementChild;
    expect(container.children).toHaveLength(1);
    expect(root?.tagName).toBe('DIV');
    expect(root).toHaveClass('eg-embed', 'min-w-0', 'overflow-hidden', ...wellTokens);
    expect(root).toHaveAttribute('data-state');
    const boxes = container.querySelectorAll('[data-radix-aspect-ratio-wrapper]');
    expect(boxes).toHaveLength(1);
    expect(boxes[0]?.parentElement).toBe(root);
    expect(boxes[0]?.querySelectorAll('.eg-aspect-ratio')).toHaveLength(1);
  });

  it('merges className last on the root only and keeps the public markers', () => {
    const { container } = render(<Embed label='Keynote recording' src='/keynote' className='mt-4 self-start' />);
    const root = container.firstElementChild;
    expect(root).toHaveClass('eg-embed', 'mt-4', 'self-start', ...wellTokens);
    expect(root?.className.split(' ').slice(-2)).toEqual(['mt-4', 'self-start']);
    expect(container.querySelectorAll('.mt-4')).toHaveLength(1);
  });

  it('keeps the stable markers even when className conflicts with a recipe utility', () => {
    const { container } = render(<Embed label='Keynote recording' src='/keynote' className='p-8 overflow-visible' />);
    expect(container.firstElementChild).toHaveClass('eg-embed', 'eg-surface');
  });

  it('derives the root props and the layers in the hook', () => {
    const { result } = renderHook(() => useEmbed({ label: 'Keynote recording', src: '/keynote', id: 'talk' }));
    expect(result.current.valid).toBe(true);
    expect(result.current.rootProps).toMatchObject({ id: 'talk', 'data-state': 'loading' });
    expect(result.current.rootProps.className.split(' ')).toEqual(expect.arrayContaining(['eg-embed', ...wellTokens]));
    for (const consumed of ['label', 'src', 'ratio', 'loading', 'fallback', 'children']) {
      expect(result.current.rootProps, consumed).not.toHaveProperty(consumed);
    }
    expect(consoleWarn).not.toHaveBeenCalled();
  });
});

const reserved = (container: HTMLElement) =>
  (container.querySelector('[data-radix-aspect-ratio-wrapper]') as HTMLElement).style.paddingBottom;
const defaultReserved = `${100 / (16 / 9)}%`;

describe('Embed ratio (EM-02)', () => {
  it('reserves 16:9 by default', () => {
    const { container } = render(<Embed label='Keynote recording' src='/keynote' />);
    expect(defaultReserved).toBe('56.25%');
    expect(reserved(container)).toBe(defaultReserved);
  });

  it.each([1, 4 / 3, 2.35, 0.5, 9 / 16])('reserves the representable ratio %s as given', (ratio) => {
    const { container } = render(<Embed label='Keynote recording' src='/keynote' ratio={ratio} />);
    expect(reserved(container)).toBe(`${100 / ratio}%`);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([
    ['zero', 0],
    ['negative', -1],
    ['NaN', Number.NaN],
    ['Infinity', Number.POSITIVE_INFINITY],
    ['-Infinity', Number.NEGATIVE_INFINITY],
    ['a number whose reciprocal percentage is infinite', Number.MIN_VALUE],
    ['a numeric string', '2'],
    ['null', null],
    ['an object', {}],
    ['undefined', undefined]
  ])('falls back to 16:9 silently when ratio is %s', (_name, ratio) => {
    const { container } = render(<Embed {...untyped({ label: 'Keynote recording', src: '/keynote', ratio })} />);
    expect(reserved(container)).toBe(defaultReserved);
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it.each([1e-300, Number.MAX_VALUE, 16 / 9, 3])('keeps the representable ratio %s in the hook', (ratio) => {
    const { result } = renderHook(() => useEmbed({ label: 'Keynote recording', src: '/keynote', ratio }));
    expect(result.current.ratio).toBe(ratio);
  });

  it('keeps the reserved box when the ratio changes between renders without replacing the box', () => {
    const { container, rerender } = render(<Embed label='Keynote recording' src='/keynote' ratio={1} />);
    const box = container.querySelector('[data-radix-aspect-ratio-wrapper]');
    expect(reserved(container)).toBe('100%');
    rerender(<Embed label='Keynote recording' src='/keynote' ratio={4 / 3} />);
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toBe(box);
    expect(reserved(container)).toBe('75%');
  });
});

const videoUrl = 'https://video.example/embed/1';
const frameOf = () => screen.getByTitle('Keynote recording') as HTMLIFrameElement;

describe('Embed frame mounting (EM-03)', () => {
  it('renders no iframe and never the src in the server markup', () => {
    for (const html of [
      renderToStaticMarkup(<Embed label='Keynote recording' src={videoUrl} />),
      renderToString(<Embed label='Keynote recording' src={videoUrl} loading='eager' />)
    ]) {
      expect(html).not.toContain('<iframe');
      expect(html).not.toContain('video.example');
      expect(html).toContain('eg-embed');
    }
  });

  it('keeps the first client render free of the frame and mounts it right after', () => {
    const seen: boolean[] = [];
    renderHook(() => {
      const embed = useEmbed({ label: 'Keynote recording', src: videoUrl });
      seen.push(embed.frame !== undefined);
      return embed;
    });
    expect(seen[0]).toBe(false);
    expect(seen.at(-1)).toBe(true);
  });

  it('hydrates the server markup without a mismatch and mounts the frame after hydration', () => {
    const element = <Embed label='Keynote recording' src={videoUrl} />;
    const host = document.createElement('div');
    // Parse the trusted server output from this test instead of assigning markup directly.
    host.append(...new DOMParser().parseFromString(renderToString(element), 'text/html').body.childNodes);
    document.body.append(host);
    expect(host.querySelector('iframe')).toBeNull();
    const onRecoverableError = vi.fn();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: a hydration mismatch is asserted through the spy.
    });
    let root: ReturnType<typeof hydrateRoot> | undefined;
    act(() => {
      root = hydrateRoot(host, element, { onRecoverableError });
    });
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(host.querySelectorAll('iframe')).toHaveLength(1);
    expect(host.querySelector('iframe')).toHaveAttribute('src', videoUrl);
    act(() => root?.unmount());
    consoleError.mockRestore();
    host.remove();
  });

  it('mounts one iframe named by label with the supplied src and lazy loading by default', () => {
    const { container } = render(<Embed label='Keynote recording' src={videoUrl} />);
    const frame = frameOf();
    expect(frame.tagName).toBe('IFRAME');
    expect(container.querySelectorAll('iframe')).toHaveLength(1);
    expect(frame).toHaveAttribute('title', 'Keynote recording');
    expect(frame).toHaveAttribute('src', videoUrl);
    expect(frame).toHaveAttribute('loading', 'lazy');
    for (const attribute of [
      'allow',
      'allowfullscreen',
      'referrerpolicy',
      'sandbox',
      'name',
      'srcdoc',
      'width',
      'height'
    ]) {
      expect(frame, attribute).not.toHaveAttribute(attribute);
    }
    expect(frame.closest('.eg-aspect-ratio')).not.toBeNull();
  });

  it('passes the supplied src through as written', () => {
    render(<Embed label='Keynote recording' src={`  ${videoUrl}  `} />);
    expect(frameOf()).toHaveAttribute('src', `  ${videoUrl}  `);
  });

  it('passes loading, allow, allowFullScreen, referrerPolicy and sandbox through unchanged', () => {
    render(
      <Embed
        label='Keynote recording'
        src={videoUrl}
        loading='eager'
        allow='fullscreen; picture-in-picture'
        allowFullScreen={true}
        referrerPolicy='no-referrer'
        sandbox='allow-scripts allow-same-origin'
      />
    );
    const frame = frameOf();
    expect(frame).toHaveAttribute('loading', 'eager');
    expect(frame).toHaveAttribute('allow', 'fullscreen; picture-in-picture');
    expect(frame).toHaveAttribute('allowfullscreen');
    expect(frame).toHaveAttribute('referrerpolicy', 'no-referrer');
    expect(frame).toHaveAttribute('sandbox', 'allow-scripts allow-same-origin');
  });

  it('keeps an empty sandbox, the strictest value, instead of defaulting or dropping it', () => {
    render(<Embed label='Keynote recording' src={videoUrl} sandbox='' />);
    expect(frameOf()).toHaveAttribute('sandbox', '');
  });
});

const rootOf = (container: HTMLElement) => container.firstElementChild as HTMLElement;
const spinnerOf = (container: HTMLElement) => container.querySelector('.eg-spinner');

describe('Embed load state (EM-04)', () => {
  it('starts loading with aria-busy and a decorative spinner, and leaves the name to the frame', () => {
    const { container } = render(<Embed label='Keynote recording' src={videoUrl} />);
    const root = rootOf(container);
    expect(root).toHaveAttribute('data-state', 'loading');
    expect(root).toHaveAttribute('aria-busy', 'true');
    expect(spinnerOf(container)).toHaveAttribute('aria-hidden', 'true');
    expect(spinnerOf(container)?.textContent).toBe('');
    expect(screen.queryByRole('status')).toBeNull();
    expect(screen.queryByRole('alert')).toBeNull();
    expect(container.querySelector('[aria-live]')).toBeNull();
    // One name source at a time: the iframe title names the frame, so the root is not a second named group.
    expect(root).not.toHaveAttribute('role');
    expect(root).not.toHaveAttribute('aria-label');
    expect(screen.queryByRole('group')).toBeNull();
  });

  it('puts the loading state and the spinner in the server markup', () => {
    const html = renderToStaticMarkup(<Embed label='Keynote recording' src={videoUrl} />);
    expect(html).toContain('data-state="loading"');
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain('eg-spinner');
    expect(html).toContain('aria-hidden="true"');
  });

  it('moves to ready on the frame load event and calls onLoad once with the native event', () => {
    const onLoad = vi.fn();
    const { container } = render(<Embed label='Keynote recording' src={videoUrl} onLoad={onLoad} />);
    const frame = frameOf();
    expect(onLoad).not.toHaveBeenCalled();
    fireEvent.load(frame);
    const root = rootOf(container);
    expect(root).toHaveAttribute('data-state', 'ready');
    expect(root).not.toHaveAttribute('aria-busy');
    expect(spinnerOf(container)).toBeNull();
    expect(frameOf()).toBe(frame);
    expect(onLoad).toHaveBeenCalledTimes(1);
    // Compared separately: a subset match would walk the React fiber graph attached to the DOM node.
    const event = onLoad.mock.calls[0]?.[0] as SyntheticEvent<HTMLIFrameElement>;
    expect(event.type).toBe('load');
    expect(event.target).toBe(frame);
  });

  it('becomes ready without an onLoad handler', () => {
    const { container } = render(<Embed label='Keynote recording' src={videoUrl} />);
    fireEvent.load(frameOf());
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
  });

  it('mounts a fresh frame and returns to loading when the src changes, then loads again', () => {
    const onLoad = vi.fn();
    const { container, rerender } = render(<Embed label='Keynote recording' src={videoUrl} onLoad={onLoad} />);
    const first = frameOf();
    fireEvent.load(first);
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    rerender(<Embed label='Keynote recording' src='https://video.example/embed/2' onLoad={onLoad} />);
    const second = frameOf();
    expect(second).not.toBe(first);
    expect(first.isConnected).toBe(false);
    expect(second).toHaveAttribute('src', 'https://video.example/embed/2');
    expect(container.querySelectorAll('iframe')).toHaveLength(1);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(rootOf(container)).toHaveAttribute('aria-busy', 'true');
    expect(spinnerOf(container)).not.toBeNull();
    fireEvent.load(second);
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    expect(onLoad).toHaveBeenCalledTimes(2);
  });

  it('keeps the same frame and the ready state when only unrelated props change', () => {
    const { container, rerender } = render(<Embed label='Keynote recording' src={videoUrl} />);
    const frame = frameOf();
    fireEvent.load(frame);
    rerender(<Embed label='Keynote recording' src={videoUrl} className='mt-2' ratio={1} />);
    expect(frameOf()).toBe(frame);
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
  });

  it('reports every later load of the same frame', () => {
    const onLoad = vi.fn();
    render(<Embed label='Keynote recording' src={videoUrl} onLoad={onLoad} />);
    fireEvent.load(frameOf());
    fireEvent.load(frameOf());
    expect(onLoad).toHaveBeenCalledTimes(2);
  });
});

describe('Embed load state after a round trip of the src (EM-04)', () => {
  it('forgets an earlier load when the src goes away and comes back', () => {
    const { container, rerender } = render(<Embed label='Keynote recording' src={videoUrl} />);
    const first = frameOf();
    fireEvent.load(first);
    rerender(<Embed label='Keynote recording' src='' />);
    rerender(<Embed label='Keynote recording' src={videoUrl} />);
    const second = frameOf();
    expect(second).not.toBe(first);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(rootOf(container)).toHaveAttribute('aria-busy', 'true');
    expect(spinnerOf(container)).not.toBeNull();
    fireEvent.load(second);
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
  });

  it('forgets an earlier load when the src changes and changes back before the other frame loads', () => {
    const { container, rerender } = render(<Embed label='Keynote recording' src={videoUrl} />);
    const first = frameOf();
    fireEvent.load(first);
    rerender(<Embed label='Keynote recording' src='https://video.example/embed/2' />);
    rerender(<Embed label='Keynote recording' src={videoUrl} />);
    const third = frameOf();
    expect(third).not.toBe(first);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(spinnerOf(container)).not.toBeNull();
    fireEvent.load(third);
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    expect(spinnerOf(container)).toBeNull();
  });
});

const postLabel = 'Post by @egdev6 on X';

describe('Embed content branch (EM-05)', () => {
  it('renders children directly in the box, ready, as a named group without a frame, spinner or busy state', () => {
    const { container } = render(
      <Embed label={postLabel}>
        <blockquote>Hello from the post</blockquote>
      </Embed>
    );
    const group = screen.getByRole('group', { name: postLabel });
    expect(group).toBe(rootOf(container));
    expect(group).toHaveAttribute('data-state', 'ready');
    expect(group).not.toHaveAttribute('aria-busy');
    expect(group).toHaveAttribute('aria-label', postLabel);
    expect(container.querySelector('iframe')).toBeNull();
    expect(spinnerOf(container)).toBeNull();
    const box = container.querySelector('.eg-aspect-ratio');
    expect(box?.children).toHaveLength(1);
    expect(box?.firstElementChild?.tagName).toBe('BLOCKQUOTE');
    expect(box).toContainElement(screen.getByText('Hello from the post'));
  });

  it('keeps interactive children reachable and untouched inside the group', () => {
    render(
      <Embed label={postLabel}>
        <a href='#original'>Open the original</a>
      </Embed>
    );
    expect(
      within(screen.getByRole('group', { name: postLabel })).getByRole('link', { name: 'Open the original' })
    ).toHaveAttribute('href', '#original');
  });

  it('reserves the ratio in the content branch too', () => {
    const { container } = render(
      <Embed label={postLabel} ratio={4 / 3}>
        <p>Post</p>
      </Embed>
    );
    expect(reserved(container)).toBe('75%');
  });

  it('adds no script and touches neither cookies nor storage in either branch or state', () => {
    const cookieGet = vi.spyOn(Document.prototype, 'cookie', 'get');
    const cookieSet = vi.spyOn(Document.prototype, 'cookie', 'set');
    const storage = (['getItem', 'setItem', 'removeItem', 'clear', 'key'] as const).map((method) =>
      vi.spyOn(Storage.prototype, method)
    );
    const scripts = document.scripts.length;
    const { container, rerender } = render(
      <Embed label={postLabel}>
        <p>Post</p>
      </Embed>
    );
    rerender(<Embed label={postLabel} src={videoUrl} />);
    fireEvent.load(container.querySelector('iframe') as HTMLIFrameElement);
    rerender(<Embed label={postLabel} />);
    expect(container.querySelector('script')).toBeNull();
    expect(document.scripts).toHaveLength(scripts);
    expect(cookieGet).not.toHaveBeenCalled();
    expect(cookieSet).not.toHaveBeenCalled();
    for (const spy of storage) {
      expect(spy).not.toHaveBeenCalled();
    }
    cookieGet.mockRestore();
    cookieSet.mockRestore();
    for (const spy of storage) {
      spy.mockRestore();
    }
  });

  it('never wires a consumer onLoad to the root, so the load of a child image is not reported', () => {
    const onLoad = vi.fn();
    render(
      <Embed {...untyped({ label: postLabel, onLoad, children: <img alt='Attached photo' src='/photo.png' /> })} />
    );
    fireEvent.load(screen.getByAltText('Attached photo'));
    expect(onLoad).not.toHaveBeenCalled();
  });

  it('switches from the frame branch to the content branch and back without keeping the frame', () => {
    const { container, rerender } = render(<Embed label={postLabel} src={videoUrl} />);
    expect(container.querySelector('iframe')).not.toBeNull();
    rerender(
      <Embed label={postLabel}>
        <p>Post</p>
      </Embed>
    );
    expect(container.querySelector('iframe')).toBeNull();
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    expect(screen.getByRole('group', { name: postLabel })).toBeInTheDocument();
    rerender(<Embed label={postLabel} src={videoUrl} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.getByTitle(postLabel)).toBeInTheDocument();
  });
});

const fallbackNode = (
  <p>
    This post is not available here. <a href='#original'>Open the original</a>
  </p>
);

describe('Embed fallback state (EM-06)', () => {
  it.each([
    ['absent', undefined],
    ['empty', ''],
    ['whitespace-only', '   '],
    ['made of tabs and newlines', ' \t\n\r '],
    ['null', null]
  ])('renders the fallback in the box for an %s src and mounts no frame', (_name, src) => {
    const { container } = render(<Embed {...untyped({ label: postLabel, src, fallback: fallbackNode })} />);
    const root = rootOf(container);
    expect(root).toHaveAttribute('data-state', 'fallback');
    expect(screen.getByRole('group', { name: postLabel })).toBe(root);
    expect(root).not.toHaveAttribute('aria-busy');
    expect(container.querySelector('iframe')).toBeNull();
    expect(spinnerOf(container)).toBeNull();
    const box = container.querySelector('.eg-aspect-ratio');
    expect(box).toContainElement(screen.getByRole('link', { name: 'Open the original' }));
    expect(box?.children).toHaveLength(1);
    expect(box?.firstElementChild).toHaveTextContent('This post is not available here. Open the original');
  });

  it('puts the fallback state and the fallback in the server markup', () => {
    const html = renderToStaticMarkup(<Embed label={postLabel} fallback={fallbackNode} />);
    expect(html).toContain('data-state="fallback"');
    expect(html).toContain('role="group"');
    expect(html).toContain('aria-label="Post by @egdev6 on X"');
    expect(html).toContain('Open the original');
    expect(html).not.toContain('<iframe');
    expect(html).not.toContain('aria-busy');
  });

  it('unmounts the frame and shows the fallback when a valid src becomes blank, and back', () => {
    const { container, rerender } = render(<Embed label={postLabel} src={videoUrl} fallback={fallbackNode} />);
    const frame = screen.getByTitle(postLabel);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(container.querySelector('a[href="#original"]')).toBeNull();
    rerender(<Embed label={postLabel} src='  ' fallback={fallbackNode} />);
    expect(frame.isConnected).toBe(false);
    expect(container.querySelector('iframe')).toBeNull();
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    expect(screen.getByRole('group', { name: postLabel })).toBe(rootOf(container));
    expect(screen.getByRole('link', { name: 'Open the original' })).toBeInTheDocument();
    rerender(<Embed label={postLabel} src={videoUrl} fallback={fallbackNode} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(screen.queryByRole('link', { name: 'Open the original' })).toBeNull();
    expect(screen.queryByRole('group')).toBeNull();
    expect(screen.getByTitle(postLabel)).toBeInTheDocument();
  });

  it.each([
    ['null', null],
    ['false', false],
    ['undefined', undefined],
    ['an empty array', []],
    ['an array of empty nodes', [null, false]]
  ])('uses the fallback state when the children are %s', (_name, children) => {
    const { container } = render(<Embed {...untyped({ label: postLabel, children, fallback: fallbackNode })} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    expect(screen.getByRole('link', { name: 'Open the original' })).toBeInTheDocument();
    expect(container.querySelector('iframe')).toBeNull();
  });

  it('falls back when the children become empty and returns to the content when they come back', () => {
    const { container, rerender } = render(
      <Embed label={postLabel} fallback={fallbackNode}>
        <p>Post</p>
      </Embed>
    );
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    expect(screen.queryByRole('link', { name: 'Open the original' })).toBeNull();
    rerender(<Embed {...untyped({ label: postLabel, children: null, fallback: fallbackNode })} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    expect(screen.queryByText('Post')).toBeNull();
    expect(screen.getByRole('link', { name: 'Open the original' })).toBeInTheDocument();
    rerender(
      <Embed label={postLabel} fallback={fallbackNode}>
        <p>Post</p>
      </Embed>
    );
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    expect(screen.queryByRole('link', { name: 'Open the original' })).toBeNull();
  });

  it('counts an empty string, zero and a space as renderable children, as Children.toArray does', () => {
    // Observed, not chosen: the spec defines renderable children as a non-empty Children.toArray result.
    for (const children of ['', 0, ' ']) {
      const { container, unmount } = render(
        <Embed {...untyped({ label: postLabel, children, fallback: fallbackNode })} />
      );
      expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
      expect(screen.queryByRole('link', { name: 'Open the original' })).toBeNull();
      unmount();
    }
  });

  it('reserves the same box in the loading, ready and fallback states', () => {
    const { container, rerender } = render(
      <Embed label={postLabel} src={videoUrl} ratio={4 / 3} fallback={fallbackNode} />
    );
    const box = container.querySelector('[data-radix-aspect-ratio-wrapper]');
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(reserved(container)).toBe('75%');
    fireEvent.load(screen.getByTitle(postLabel));
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    expect(reserved(container)).toBe('75%');
    rerender(<Embed label={postLabel} src='' ratio={4 / 3} fallback={fallbackNode} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    expect(reserved(container)).toBe('75%');
    expect(container.querySelector('[data-radix-aspect-ratio-wrapper]')).toBe(box);
  });
});

const labelWarning = 'Embed requires a non-empty label. Nothing was rendered.';

describe('Embed label (EM-07)', () => {
  it.each([
    ['empty', ''],
    ['whitespace-only', ' \t\n '],
    ['undefined', undefined],
    ['null', null],
    ['a number', 42],
    ['an object', {}],
    ['an array', ['Keynote recording']]
  ])('warns and renders nothing when label is %s, in every branch', (_name, label) => {
    for (const extra of [{ src: videoUrl }, { children: <p>Post</p> }, {}]) {
      const { container, unmount } = render(<Embed {...untyped({ label, ...extra })} />);
      expect(container).toBeEmptyDOMElement();
      expect(consoleWarn).toHaveBeenCalledWith(labelWarning);
      consoleWarn.mockClear();
      unmount();
    }
  });

  it('renders nothing from the server for an invalid label', () => {
    expect(renderToStaticMarkup(<Embed {...untyped({ label: '', src: videoUrl })} />)).toBe('');
    expect(consoleWarn).toHaveBeenCalledWith(labelWarning);
  });

  it('renders normally after a valid rerender and nothing again after an invalid one', () => {
    const { container, rerender } = render(<Embed {...untyped({ label: ' ', src: videoUrl })} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Embed label='Keynote recording' src={videoUrl} />);
    expect(rootOf(container)).toHaveClass('eg-embed');
    expect(frameOf()).toHaveAttribute('src', videoUrl);
    rerender(<Embed {...untyped({ label: '', src: videoUrl })} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('reports an invalid label as not valid from the hook, without any other warning', () => {
    const { result } = renderHook(() => useEmbed(untyped({ label: '', src: 'javascript:alert(1)' })));
    expect(result.current.valid).toBe(false);
    expect(consoleWarn).toHaveBeenCalledWith(labelWarning);
    expect(consoleWarn.mock.calls.every(([message]) => message === labelWarning)).toBe(true);
  });

  it('repeats the same message in StrictMode and stays silent in production', () => {
    render(
      <StrictMode>
        <Embed {...untyped({ label: '', src: videoUrl })} />
      </StrictMode>
    );
    expect(consoleWarn.mock.calls.length).toBeGreaterThan(0);
    expect(consoleWarn.mock.calls.every(([message]) => message === labelWarning)).toBe(true);
    consoleWarn.mockClear();
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<Embed {...untyped({ label: '', src: videoUrl })} />);
    expect(container).toBeEmptyDOMElement();
    expect(consoleWarn).not.toHaveBeenCalled();
  });

  it('names the frame and the groups only from label', () => {
    render(
      <Embed {...untyped({ label: 'Keynote recording', src: videoUrl, title: 'Other', 'aria-label': 'Other' })} />
    );
    expect(screen.getByTitle('Keynote recording')).toBeInTheDocument();
    expect(screen.queryByTitle('Other')).toBeNull();
    expect(screen.queryByLabelText('Other')).toBeNull();
  });
});

describe('Embed owned attributes (EM-07)', () => {
  const owned = {
    title: 'Other name',
    role: 'region',
    'aria-label': 'Other name',
    'aria-labelledby': 'someone-else',
    'aria-hidden': true,
    'aria-busy': false,
    tabIndex: 0,
    style: { color: 'red' },
    'data-state': 'ready',
    dangerouslySetInnerHTML: { __html: '<b>injected</b>' },
    contentEditable: true
  };
  const kept = { id: 'talk', 'data-extra': 'yes', 'aria-describedby': 'hint', lang: 'es', dir: 'rtl' };

  it.each([
    ['frame', { src: videoUrl }, 'loading', null],
    ['content', { children: <p>Post</p> }, 'ready', 'group'],
    ['fallback', {}, 'fallback', 'group']
  ])(
    'drops every owned attribute at an untyped boundary in the %s branch and keeps the compatible ones',
    (_name, branch, state, role) => {
      const { container } = render(
        <Embed {...untyped({ label: 'Keynote recording', ...branch, ...owned, ...kept })} />
      );
      const root = rootOf(container);
      for (const attribute of ['title', 'aria-labelledby', 'aria-hidden', 'tabindex', 'style', 'contenteditable']) {
        expect(root, attribute).not.toHaveAttribute(attribute);
      }
      // The role and the name are the component's: a group named by label outside the frame branch, nothing in it.
      expect(root.getAttribute('role')).toBe(role);
      expect(root.getAttribute('aria-label')).toBe(role === null ? null : 'Keynote recording');
      expect(root.getAttribute('data-state')).toBe(state);
      expect(root.getAttribute('aria-busy')).toBe(state === 'loading' ? 'true' : null);
      expect(root).toHaveAttribute('id', 'talk');
      expect(root).toHaveAttribute('data-extra', 'yes');
      expect(root).toHaveAttribute('aria-describedby', 'hint');
      expect(root).toHaveAttribute('lang', 'es');
      expect(root).toHaveAttribute('dir', 'rtl');
      expect(container.querySelector('b')).toBeNull();
    }
  );

  it('derives data-state from the component, never from the caller', () => {
    const { container } = render(
      <Embed {...untyped({ label: 'Keynote recording', src: videoUrl, 'data-state': 'ready' })} />
    );
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
  });

  it('drops the click, key, error and load handlers: the component adds and forwards none', async () => {
    const handlers = { onClick: vi.fn(), onKeyDown: vi.fn(), onError: vi.fn(), onLoad: vi.fn() };
    const { container } = render(
      <Embed {...untyped({ label: 'Post', children: <img alt='Attached photo' src='/photo.png' />, ...handlers })} />
    );
    const root = rootOf(container);
    await userEvent.click(root);
    fireEvent.keyDown(root, { key: 'Enter' });
    fireEvent.error(screen.getByAltText('Attached photo'));
    fireEvent.load(screen.getByAltText('Attached photo'));
    for (const [name, handler] of Object.entries(handlers)) {
      expect(handler, name).not.toHaveBeenCalled();
    }
  });

  it('delivers no ref and no Slot composition: both are dropped', () => {
    const ref = createRef<HTMLDivElement>();
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {
      // Intentionally silent: an unknown DOM prop would be logged and asserted below.
    });
    const { container } = render(
      <Embed {...untyped({ label: 'Keynote recording', src: videoUrl, ref, asChild: true })} />
    );
    expect(ref.current).toBeNull();
    expect(rootOf(container)).not.toHaveAttribute('aschild');
    expect(consoleError).not.toHaveBeenCalled();
    consoleError.mockRestore();
  });

  it('adds no tab stop and keeps every part out of the tab order except the frame', async () => {
    const { container } = render(<Embed label='Keynote recording' src={videoUrl} />);
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
    await userEvent.tab();
    expect(rootOf(container)).not.toHaveFocus();
  });
});

describe('Embed public type (EM-07)', () => {
  const base = { label: 'Keynote recording', src: videoUrl } satisfies EmbedProps;

  it('excludes the owned attributes, a ref and asChild, and types the frame attributes', () => {
    expectTypeOf<
      Extract<
        keyof EmbedProps,
        | 'title'
        | 'role'
        | 'aria-label'
        | 'aria-labelledby'
        | 'aria-hidden'
        | 'aria-busy'
        | 'tabIndex'
        | 'style'
        | 'dangerouslySetInnerHTML'
        | 'contentEditable'
        | 'onClick'
        | 'onKeyDown'
        | 'onError'
        | 'ref'
        | 'asChild'
        | 'srcDoc'
      >
    >().toEqualTypeOf<never>();
    expectTypeOf<EmbedProps['label']>().toEqualTypeOf<string>();
    expectTypeOf<EmbedProps['ratio']>().toEqualTypeOf<number | undefined>();
    expectTypeOf<NonNullable<EmbedProps['onLoad']>>().toEqualTypeOf<ReactEventHandler<HTMLIFrameElement>>();
    expectTypeOf<NonNullable<EmbedProps['loading']>>().toEqualTypeOf<'lazy' | 'eager'>();
    const frameOnly: EmbedProps = { label: 'Keynote recording' };
    const withFrame: EmbedProps = {
      ...base,
      loading: 'eager',
      allow: 'fullscreen',
      allowFullScreen: true,
      sandbox: ''
    };
    const withContent: EmbedProps = { label: 'Post', children: <p>Post</p>, fallback: <p>Unavailable</p> };
    // @ts-expect-error The name is label: there is no title.
    const withTitle: EmbedProps = { ...base, title: 'x' };
    // @ts-expect-error The root has no role override.
    const withRole: EmbedProps = { ...base, role: 'region' };
    // @ts-expect-error The name is label: there is no aria-label.
    const withAriaLabel: EmbedProps = { ...base, 'aria-label': 'x' };
    // @ts-expect-error The name is label: there is no aria-labelledby.
    const withLabelledBy: EmbedProps = { ...base, 'aria-labelledby': 'x' };
    // @ts-expect-error The component owns the busy hint.
    const withBusy: EmbedProps = { ...base, 'aria-busy': true };
    // @ts-expect-error The component adds no tab stop and accepts none.
    const withTabIndex: EmbedProps = { ...base, tabIndex: 0 };
    // @ts-expect-error No inline appearance.
    const withStyle: EmbedProps = { ...base, style: { color: 'red' } };
    // @ts-expect-error No injected markup.
    const withHtml: EmbedProps = { ...base, dangerouslySetInnerHTML: { __html: 'x' } };
    // @ts-expect-error The component has no click handler of its own.
    const withClick: EmbedProps = { ...base, onClick: () => undefined };
    // @ts-expect-error The component has no key handler of its own.
    const withKey: EmbedProps = { ...base, onKeyDown: () => undefined };
    // @ts-expect-error A frame reports no navigation failure: there is no onError.
    const withError: EmbedProps = { ...base, onError: () => undefined };
    // @ts-expect-error There is no ref in this API.
    const withRef: EmbedProps = { ...base, ref: null };
    // @ts-expect-error There is no Slot composition.
    const withAsChild: EmbedProps = { ...base, asChild: true };
    // @ts-expect-error Inline documents are not supported.
    const withSrcDoc: EmbedProps = { ...base, srcDoc: '<p>x</p>' };
    // @ts-expect-error The label is required.
    const withoutLabel: EmbedProps = { src: videoUrl };
    // @ts-expect-error A frame and children are exclusive.
    const bothSources: EmbedProps = { ...base, children: <p>Post</p> };
    // @ts-expect-error Frame attributes belong to the frame branch.
    const sandboxWithChildren: EmbedProps = { label: 'Post', children: <p>Post</p>, sandbox: '' };
    // @ts-expect-error Loading belongs to the frame branch.
    const loadingWithChildren: EmbedProps = { label: 'Post', children: <p>Post</p>, loading: 'eager' };
    // @ts-expect-error The ratio is a number.
    const textRatio: EmbedProps = { ...base, ratio: '16 / 9' };
    // @ts-expect-error Loading is lazy or eager.
    const autoLoading: EmbedProps = { ...base, loading: 'auto' };
    expect([
      frameOnly,
      withFrame,
      withContent,
      withTitle,
      withRole,
      withAriaLabel,
      withLabelledBy,
      withBusy,
      withTabIndex,
      withStyle,
      withHtml,
      withClick,
      withKey,
      withError,
      withRef,
      withAsChild,
      withSrcDoc,
      withoutLabel,
      bothSources,
      sandboxWithChildren,
      loadingWithChildren,
      textRatio,
      autoLoading
    ]).toHaveLength(23);
  });
});

const schemeWarning = 'Embed ignored a src that is not an http(s) URL. The fallback state was rendered.';
const bothWarning = 'Embed received both src and children. The src was ignored.';
const emptyWarning = 'Embed has no src, children or fallback. An empty reserved frame was rendered.';
const warned = () => consoleWarn.mock.calls.map(([message]) => message);

describe('Embed src policy (EM-08)', () => {
  it.each([
    ['javascript:alert(1)'],
    ['JavaScript:alert(1)'],
    [' javascript:alert(1)'],
    ['\u0000javascript:alert(1)'],
    ['jav\tascript:alert(1)'],
    ['jav\nascript:alert(1)'],
    ['jav\r\nascript:alert(1)'],
    ['data:text/html,<p>x</p>'],
    ['blob:https://video.example/6c1f7a52-0b43-4a31-9d0c-1f62b1c5c2d1'],
    ['vbscript:msgbox(1)'],
    ['file:///etc/passwd'],
    ['ftp://video.example/talk'],
    ['mailto:talks@video.example'],
    ['about:blank'],
    ['localhost:3000/embed'],
    ['http://'],
    ['https://exa mple.com/x'],
    ['http://[::1']
  ])('renders the fallback state and warns for the src %j, mounting no frame', (src) => {
    const { container } = render(<Embed label='Keynote recording' src={src} fallback={fallbackNode} />);
    const root = rootOf(container);
    expect(root).toHaveAttribute('data-state', 'fallback');
    expect(screen.getByRole('group', { name: 'Keynote recording' })).toBe(root);
    expect(container.querySelector('iframe')).toBeNull();
    expect(spinnerOf(container)).toBeNull();
    expect(screen.getByRole('link', { name: 'Open the original' })).toBeInTheDocument();
    expect(warned()).toContain(schemeWarning);
    expect(warned()).not.toContain(emptyWarning);
    expect(warned()).not.toContain(bothWarning);
  });

  it.each([
    ['a number', 42],
    ['zero', 0],
    ['true', true],
    ['false', false],
    ['an object', { href: videoUrl }],
    ['an array', [videoUrl]]
  ])('rejects %s as a src from an untyped caller with the same warning', (_name, src) => {
    const { container } = render(<Embed {...untyped({ label: 'Keynote recording', src, fallback: fallbackNode })} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    expect(container.querySelector('iframe')).toBeNull();
    expect(warned()).toContain(schemeWarning);
  });

  it.each([
    [videoUrl],
    ['http://video.example/embed/1'],
    ['HTTPS://VIDEO.EXAMPLE/EMBED/1'],
    [`  ${videoUrl}  `],
    ['//video.example/embed/1'],
    ['/embed/1'],
    ['embed/1'],
    ['?talk=1'],
    ['#talk'],
    ['java\u0000script:alert(1)']
  ])('accepts the src %j without a warning and mounts the frame as written', (src) => {
    const { container } = render(<Embed label='Keynote recording' src={src} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(frameOf()).toHaveAttribute('src', src);
    expect(warned()).toEqual([]);
  });

  it('keeps a rejected src out of the markup of the server render too', () => {
    const html = renderToStaticMarkup(
      <Embed label='Keynote recording' src='javascript:alert(1)' fallback={fallbackNode} />
    );
    expect(html).not.toContain('javascript:');
    expect(html).not.toContain('<iframe');
    expect(html).toContain('data-state="fallback"');
    expect(warned()).toContain(schemeWarning);
  });

  it('turns a rejected src into a loading frame when a valid one arrives, and back', () => {
    const { container, rerender } = render(
      <Embed label='Keynote recording' src='data:text/html,x' fallback={fallbackNode} />
    );
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    rerender(<Embed label='Keynote recording' src={videoUrl} fallback={fallbackNode} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'loading');
    expect(frameOf()).toHaveAttribute('src', videoUrl);
    rerender(<Embed label='Keynote recording' src='javascript:alert(1)' fallback={fallbackNode} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    expect(container.querySelector('iframe')).toBeNull();
  });
});

describe('Embed warnings (EM-08)', () => {
  it.each([
    ['a valid src', { src: videoUrl }],
    ['children', { children: <p>Post</p> }],
    ['a blank src with children', { src: '', children: <p>Post</p> }],
    ['a fallback', { fallback: fallbackNode }],
    ['a blank src with a fallback', { src: '   ', fallback: fallbackNode }]
  ])('stays silent for %s', (_name, props) => {
    render(<Embed {...untyped({ label: 'Keynote recording', ...props })} />);
    expect(warned()).toEqual([]);
  });

  it.each([
    ['a valid src', { src: videoUrl }],
    ['a rejected src', { src: 'javascript:alert(1)' }],
    ['a numeric src', { src: 42 }]
  ])('renders the children and warns that the src was ignored when %s comes with children', (_name, extra) => {
    const { container } = render(<Embed {...untyped({ label: postLabel, children: <p>Post</p>, ...extra })} />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'ready');
    expect(screen.getByRole('group', { name: postLabel })).toBe(rootOf(container));
    expect(screen.getByText('Post')).toBeInTheDocument();
    expect(container.querySelector('iframe')).toBeNull();
    expect(warned()).toContain(bothWarning);
    expect(warned()).not.toContain(schemeWarning);
  });

  it.each([
    ['nothing at all', {}],
    ['a blank src', { src: ' ' }],
    ['a null fallback', { fallback: null }],
    ['a false fallback', { fallback: false }],
    ['an empty fallback array', { fallback: [] }],
    ['empty children', { children: null }]
  ])('renders an empty reserved box and warns when there is %s to show', (_name, props) => {
    const { container } = render(<Embed {...untyped({ label: postLabel, ...props })} />);
    const root = rootOf(container);
    expect(root).toHaveAttribute('data-state', 'fallback');
    expect(screen.getByRole('group', { name: postLabel })).toBe(root);
    expect(container.querySelector('.eg-aspect-ratio')).toBeEmptyDOMElement();
    expect(reserved(container)).toBe(defaultReserved);
    expect(warned()).toContain(emptyWarning);
  });

  it('warns about both a rejected src and a missing fallback when neither is usable', () => {
    render(<Embed label={postLabel} src='javascript:alert(1)' />);
    expect(warned()).toEqual(expect.arrayContaining([schemeWarning, emptyWarning]));
  });

  it('repeats the same messages in StrictMode and stays silent in production', () => {
    render(
      <StrictMode>
        <Embed label={postLabel} src='javascript:alert(1)' />
      </StrictMode>
    );
    expect(new Set(warned())).toEqual(new Set([schemeWarning, emptyWarning]));
    consoleWarn.mockClear();
    vi.stubEnv('NODE_ENV', 'production');
    const { container } = render(<Embed label={postLabel} src='javascript:alert(1)' />);
    expect(rootOf(container)).toHaveAttribute('data-state', 'fallback');
    expect(warned()).toEqual([]);
  });

  it('never mounts a frame for a rejected src, even after the mount effect ran', () => {
    const { result } = renderHook(() =>
      useEmbed(untyped({ label: postLabel, src: 'javascript:alert(1)', fallback: fallbackNode }))
    );
    expect(result.current.frame).toBeUndefined();
    expect(result.current.rootProps['data-state']).toBe('fallback');
  });
});

describe('Embed keyboard and pointer (EM-09)', () => {
  const frameBranch = <Embed label='Keynote recording' src={videoUrl} />;
  const contentBranch = (
    <Embed label={postLabel}>
      <p>Post</p>
    </Embed>
  );
  const fallbackBranch = <Embed label={postLabel} fallback={<p>Unavailable</p>} />;

  it.each([
    ['frame', frameBranch],
    ['content', contentBranch],
    ['fallback', fallbackBranch]
  ])('adds no tab stop, handler or focus management to any part of the %s branch', (_name, element) => {
    const { container } = render(element);
    expect(container.querySelectorAll('[tabindex]')).toHaveLength(0);
    expect(container.querySelectorAll('a[href], button, input, select, textarea, [contenteditable]')).toHaveLength(0);
    for (const part of [rootOf(container), ...container.querySelectorAll('*')]) {
      for (const attribute of part.getAttributeNames()) {
        expect(attribute, `${part.tagName}.${attribute}`).not.toMatch(/^on/i);
      }
    }
  });

  it('moves no focus on render, load, a src change or a fallback switch', () => {
    const outside = document.createElement('button');
    document.body.append(outside);
    outside.focus();
    const { rerender } = render(frameBranch);
    fireEvent.load(frameOf());
    rerender(<Embed label='Keynote recording' src='https://video.example/embed/2' />);
    rerender(fallbackBranch);
    expect(outside).toHaveFocus();
    outside.remove();
  });

  it('leaves the keyboard to the page: Tab goes from the button before to the button after', async () => {
    const { container } = render(
      <>
        <button type='button'>Before</button>
        <Embed label={postLabel} fallback={<p>Unavailable</p>} />
        <button type='button'>After</button>
      </>
    );
    const stops: (string | null)[] = [];
    for (let press = 0; press < 3; press += 1) {
      await userEvent.tab();
      stops.push(document.activeElement?.textContent ?? null);
    }
    // Before, After, then the browser chrome (the body): nothing inside the Embed took a stop.
    expect(stops.slice(0, 2)).toEqual(['Before', 'After']);
    expect(container.querySelector('.eg-embed')?.contains(document.activeElement)).toBe(false);
  });

  it('ignores the pointer and the keys on the group', async () => {
    const { container } = render(contentBranch);
    const root = rootOf(container);
    await userEvent.click(root);
    await userEvent.keyboard('{Enter}');
    expect(root).not.toHaveFocus();
    expect(root).toHaveAttribute('data-state', 'ready');
  });
});

describe('Embed parts and recipes (EM-11)', () => {
  it('lays the loading layer, the frame and the fallback layer out with their token utilities', () => {
    const { container } = render(<Embed label='Keynote recording' src={videoUrl} />);
    const box = container.querySelector('.eg-aspect-ratio');
    // The frame comes later in tree order than the loading layer, so it paints over it.
    expect([...(box?.children ?? [])].map((child) => child.tagName)).toEqual(['SPAN', 'IFRAME']);
    const layer = spinnerOf(container)?.parentElement;
    expect(layer).toBe(box?.firstElementChild);
    expect(layer).toHaveClass('absolute', 'inset-0', 'grid', 'place-items-center', 'text-fg-muted');
    expect(frameOf()).toHaveClass('relative', 'block', 'size-full', 'border-0');
    expect(spinnerOf(container)).toHaveClass('eg-spinner', 'size-(--icon-size)');
  });

  it('centers the fallback in the muted body type with token spacing', () => {
    const { container } = render(<Embed label='Keynote recording' fallback={fallbackNode} />);
    const layer = container.querySelector('.eg-aspect-ratio')?.firstElementChild;
    expect(layer).toHaveClass(
      'box-border',
      'grid',
      'size-full',
      'place-items-center',
      'p-6',
      'text-center',
      'font-sans',
      'text-body-default',
      'text-fg-muted'
    );
    expect(layer).toContainElement(screen.getByRole('link', { name: 'Open the original' }));
  });

  it('sizes every full-size part that has padding with border-box, so a host without a preflight cannot overflow the reserved box (Amendment 1)', () => {
    // jsdom has no layout, so the geometry is a browser check (EM-11); this guards the recipe that makes it hold.
    const recipes = { embedVariants, embedLoadingVariants, embedFrameVariants, embedFallbackVariants };
    for (const [name, recipe] of Object.entries(recipes)) {
      const classes = recipe().split(/\s+/);
      const fullSize = classes.some((utility) => ['size-full', 'w-full', 'h-full'].includes(utility));
      const padded = classes.some((utility) => /^p[xytblrse]?-\d/.test(utility));
      if (fullSize && padded) {
        expect(classes, name).toContain('box-border');
      }
    }
    // The fallback layer is the one part with padding, so it is exactly the guarded case.
    expect(embedFallbackVariants().split(/\s+/)).toEqual(expect.arrayContaining(['size-full', 'p-6', 'box-border']));
    // The loading layer and the frame carry no padding and no border width, so they need no reset.
    for (const recipe of [embedLoadingVariants, embedFrameVariants]) {
      expect(
        recipe()
          .split(/\s+/)
          .some((utility) => /^p[xytblrse]?-\d/.test(utility))
      ).toBe(false);
    }
  });

  it.each([
    ['frame', <Embed key='frame' label='Keynote recording' src={videoUrl} />],
    [
      'content',
      <Embed key='content' label={postLabel}>
        {<p>Post</p>}
      </Embed>
    ],
    ['fallback', <Embed key='fallback' label={postLabel} fallback={fallbackNode} />]
  ])('carries no inline style but the geometry Radix owns, in the %s branch', (_name, element) => {
    const { container } = render(element);
    const styled = [...container.querySelectorAll('[style]')];
    expect(styled.length).toBeGreaterThan(0);
    for (const node of styled) {
      expect(node.hasAttribute('data-radix-aspect-ratio-wrapper') || node.classList.contains('eg-aspect-ratio')).toBe(
        true
      );
    }
    expect(rootOf(container)).not.toHaveAttribute('style');
  });

  it('keeps the component sources free of inline style, handwritten values and motion', () => {
    const read = (name: string) => readFileSync(new URL(name, import.meta.url), 'utf8');
    const types = read('./types.ts');
    // Four static recipes made of string literals: nothing interpolated, nothing computed.
    const calls = [...types.matchAll(/cva\(\s*('(?:[^'\\]|\\.)*')/g)];
    expect(calls).toHaveLength(4);
    expect(types.match(/\bcva\(/g)).toHaveLength(4);
    const recipes = calls.map(([, literal]) => literal ?? '').join(' ');
    for (const forbidden of ['transition', 'transform', 'animate', '!', '#', 'rgb', 'px', '[', 'calc(']) {
      expect(recipes, forbidden).not.toContain(forbidden);
    }
    expect(read('./Embed.tsx')).not.toMatch(/\bstyle\b/);
    expect(read('./useEmbed.ts')).not.toMatch(
      /\bstyle:|dangerouslySetInnerHTML:|srcDoc|document\.cookie|localStorage|sessionStorage|createElement|appendChild/
    );
  });

  it('keeps the stable marker on the root only', () => {
    const { container } = render(<Embed label='Keynote recording' src={videoUrl} />);
    expect(container.querySelectorAll('.eg-embed')).toHaveLength(1);
    expect(container.querySelectorAll('[class*="eg-embed__"]')).toHaveLength(0);
  });
});
