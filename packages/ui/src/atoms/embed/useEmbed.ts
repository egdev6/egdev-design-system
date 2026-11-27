import {
  Children,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type SyntheticEvent,
  useEffect,
  useState
} from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type EmbedProps,
  embedFallbackVariants,
  embedFrameVariants,
  embedLoadingVariants,
  embedVariants
} from './types';

export type EmbedState = 'loading' | 'ready' | 'fallback';

const DEFAULT_RATIO = 16 / 9;
// The AspectRatio representability predicate: a positive finite ratio with a finite reciprocal percentage.
const representable = (ratio: unknown): ratio is number =>
  typeof ratio === 'number' && Number.isFinite(ratio) && ratio > 0 && Number.isFinite(100 / ratio);

type SourceStatus = 'absent' | 'accepted' | 'rejected';

/**
 * Classify a src: blank means absent, and only http(s) results of the WHATWG URL parser are accepted. The parser strips
 * tabs, newlines and surrounding control characters first, so obfuscated schemes are still seen as what they are;
 * relative and scheme-relative values resolve against a placeholder base. A non-string from an untyped caller is
 * treated as unparsable.
 */
function sourceStatus(src: unknown): SourceStatus {
  if (src === undefined || src === null || (typeof src === 'string' && src.trim() === '')) {
    return 'absent';
  }
  if (typeof src !== 'string') {
    return 'rejected';
  }
  try {
    const { protocol } = new URL(src, 'http://embed.invalid');
    return protocol === 'http:' || protocol === 'https:' ? 'accepted' : 'rejected';
  } catch {
    return 'rejected';
  }
}

// Owned by the component at untyped boundaries too: label owns the name and the Surface recipe the paint, the frame
// owns focus and the load handler, and `data-state` is derived. `ref` is dropped as well because React 19 delivers it
// to function components as a prop.
const owned = new Set([
  'title',
  'role',
  'aria-label',
  'aria-labelledby',
  'aria-hidden',
  'aria-busy',
  'tabIndex',
  'style',
  'dangerouslySetInnerHTML',
  'contentEditable',
  'onClick',
  'onKeyDown',
  'onError',
  'data-state',
  'ref',
  'asChild'
]);

export type EmbedFrame = {
  /** The supplied src string: a different value is a fresh frame. */
  key: string;
  title: string;
  props: ComponentPropsWithoutRef<'iframe'>;
};

export type UseEmbedResult = {
  /** False when label is unusable: nothing is rendered, because a frame is never left unnamed. */
  valid: boolean;
  ratio: number;
  rootProps: Record<string, unknown> & { 'data-state': EmbedState; className: string };
  /** True while the decorative loading layer shows. */
  loading: boolean;
  loadingClassName: string;
  frame: EmbedFrame | undefined;
  /** The consumer's children in the content branch; null otherwise. */
  content: ReactNode;
  /** The consumer's fallback in the fallback state when one is renderable; undefined otherwise. */
  fallback: ReactNode;
  fallbackClassName: string;
};

/** Derive the root props of the reserved frame. */
export function useEmbed(props: EmbedProps): UseEmbedResult {
  const {
    label,
    src,
    ratio,
    loading = 'lazy',
    allow,
    allowFullScreen,
    referrerPolicy,
    sandbox,
    onLoad,
    children,
    fallback,
    className,
    ...rest
  } = props;
  const named = typeof label === 'string' && label.trim().length > 0;
  const passthrough: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(rest)) {
    if (!owned.has(key)) {
      passthrough[key] = entry;
    }
  }
  // An iframe rendered on the server starts its request before hydration, so the frame mounts after the first client render.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // Renderable children select the content branch; src is then ignored.
  const hasContent = Children.toArray(children).length > 0;
  const source = sourceStatus(src);
  const frameSource = !hasContent && source === 'accepted' && typeof src === 'string' ? src : undefined;
  // The frame is loaded once its load event recorded this exact src. A different src, or none, is a different frame, so
  // the record is dropped during render (no effect, no frame of stale ready) and a src that returns starts loading again.
  const [loadedSource, setLoadedSource] = useState<string | undefined>(undefined);
  const [trackedSource, setTrackedSource] = useState<string | undefined>(frameSource);
  if (trackedSource !== frameSource) {
    setTrackedSource(frameSource);
    setLoadedSource(undefined);
  }
  const loaded = trackedSource === frameSource && frameSource !== undefined && loadedSource === frameSource;
  let state: EmbedState = 'fallback';
  if (hasContent || loaded) {
    state = 'ready';
  } else if (frameSource !== undefined) {
    state = 'loading';
  }
  const fallbackRenderable = Children.toArray(fallback).length > 0;
  // Same development-only guard as NowCard and StepMeter. An unnamed frame is never rendered, so nothing else warns.
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    if (!named) {
      console.warn('Embed requires a non-empty label. Nothing was rendered.');
    } else {
      if (hasContent && source !== 'absent') {
        console.warn('Embed received both src and children. The src was ignored.');
      }
      if (!hasContent && source === 'rejected') {
        console.warn('Embed ignored a src that is not an http(s) URL. The fallback state was rendered.');
      }
      if (state === 'fallback' && !fallbackRenderable) {
        console.warn('Embed has no src, children or fallback. An empty reserved frame was rendered.');
      }
    }
  }
  const handleLoad = (event: SyntheticEvent<HTMLIFrameElement>) => {
    setLoadedSource(frameSource);
    onLoad?.(event);
  };
  const frame: EmbedFrame | undefined =
    named && mounted && frameSource !== undefined
      ? {
          key: frameSource,
          title: label,
          props: {
            src: frameSource,
            loading,
            allow,
            allowFullScreen,
            referrerPolicy,
            sandbox,
            onLoad: handleLoad,
            className: cn(embedFrameVariants())
          }
        }
      : undefined;
  return {
    valid: named,
    ratio: representable(ratio) ? ratio : DEFAULT_RATIO,
    rootProps: {
      ...passthrough,
      'data-state': state,
      'aria-busy': state === 'loading' ? true : undefined,
      // The iframe title names a frame; the root is the named group when no iframe carries the name.
      role: hasContent || state === 'fallback' ? 'group' : undefined,
      'aria-label': hasContent || state === 'fallback' ? label : undefined,
      className: cn(surfaceVariants({ tone: 'well', padding: 'none', radius: 'xl' }), embedVariants(), className)
    },
    loading: state === 'loading',
    loadingClassName: cn(embedLoadingVariants()),
    frame,
    content: hasContent ? children : null,
    fallback: state === 'fallback' && fallbackRenderable ? fallback : undefined,
    fallbackClassName: cn(embedFallbackVariants())
  };
}
