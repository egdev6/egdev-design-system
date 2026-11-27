import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

type RootNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
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
  | 'onLoad'
  | 'onError'
>;

/** Native iframe attributes the consumer may choose per provider; none has a default except loading. */
type FrameAttributes = Pick<
  ComponentPropsWithoutRef<'iframe'>,
  'allow' | 'allowFullScreen' | 'referrerPolicy' | 'sandbox' | 'onLoad'
>;

type EmbedSharedProps = {
  /**
   * Accessible name of the embedded content, never rendered visibly: the iframe title in the frame branch and the
   * name of the root group when no iframe is rendered. Describe the content (for example "Keynote recording" or
   * "Post by @egdev6 on X"), not the technology. The wording and language are the consumer's, so there is no default.
   * A blank, whitespace-only or non-string label warns in development and renders nothing, so a frame is never left
   * unnamed.
   * @control text
   */
  label: string;
  /**
   * Width divided by height of the reserved box. Every state keeps the box, so a state change never moves the
   * layout; the parent owns the width. A positive finite number whose reciprocal percentage is finite is used as
   * given, and anything else silently falls back to the default.
   * @default 16 / 9
   * @control number
   */
  ratio?: number;
  /**
   * Consumer-supplied alternative rendered in place of the frame or the children in the fallback state, inside the
   * reserved box. Expected content is a short, localized explanation plus a link to the original. It must fit the
   * box, because overflow is clipped. There is no built-in text: without a renderable fallback an empty reserved box
   * is rendered and a development warning is raised.
   * @control false
   * @controlReason ReactNode content is not serializable; see Fallback.
   */
  fallback?: ReactNode;
};

// Union branches merge their JSDoc in docgen: repeat identical descriptions and directives, keep @default on one branch.
type EmbedFrameProps = FrameAttributes & {
  /**
   * Document URL of the external content, rendered in a native iframe that mounts after the first client render, so a
   * server render never starts the request. Only http: and https: URLs are accepted, absolute, scheme-relative or
   * relative, as resolved by the WHATWG URL parser. An absent, empty or whitespace-only value renders the fallback
   * state; any other scheme (javascript:, data:, blob:, vbscript:, file:) or an unparsable value renders the
   * fallback state and warns in development. A different value mounts a fresh frame and restarts loading. Exclusive
   * with children.
   * @control text
   */
  src?: string;
  /**
   * Native deferral of the frame request until it nears the viewport; use eager for embeds above the fold. Only
   * available with src.
   * @default lazy
   * @control select
   */
  loading?: 'lazy' | 'eager';
  /**
   * Consumer-owned content that a script or the app fills, for example a post blockquote that a provider script
   * upgrades. It is rendered inside the reserved box with data-state ready and the root becomes a group named by
   * label; the component never loads a script. Exclusive with src and the frame attributes.
   * @control false
   * @controlReason ReactNode content is not serializable; see ScriptEmbed.
   */
  children?: never;
};

type EmbedContentProps = {
  /**
   * Consumer-owned content that a script or the app fills, for example a post blockquote that a provider script
   * upgrades. It is rendered inside the reserved box with data-state ready and the root becomes a group named by
   * label; the component never loads a script. Exclusive with src and the frame attributes.
   * @control false
   * @controlReason ReactNode content is not serializable; see ScriptEmbed.
   */
  children: ReactNode;
  /**
   * Document URL of the external content, rendered in a native iframe that mounts after the first client render, so a
   * server render never starts the request. Only http: and https: URLs are accepted, absolute, scheme-relative or
   * relative, as resolved by the WHATWG URL parser. An absent, empty or whitespace-only value renders the fallback
   * state; any other scheme (javascript:, data:, blob:, vbscript:, file:) or an unparsable value renders the
   * fallback state and warns in development. A different value mounts a fresh frame and restarts loading. Exclusive
   * with children.
   * @control text
   */
  src?: never;
} & Partial<Record<'loading' | 'allow' | 'allowFullScreen' | 'referrerPolicy' | 'sandbox' | 'onLoad', never>>;

/**
 * Named, reserved frame for external content in a recessed Material well: a native iframe for an http(s) src, or
 * consumer children for embeds that a provider script fills, with a decorative loading state while the frame loads
 * and a consumer fallback when there is no usable content. The reserved ratio never changes with the state. It never
 * loads or injects a script and decides nothing about consent, cookies or URL trust: mount it only after the app's own
 * consent decision, because mounting a frame is what makes the browser request its src. className supports outer
 * placement only (margin, self-alignment, flex and grid item placement), merged last on the root; width, paint and
 * state overrides are not supported and no part exposes a className. No variant, size, ref, asChild or built-in text.
 * The component name, title, role, aria-* naming attributes, tab stop, inline style, click and key handlers and
 * data-state are owned by the component and are not part of the public type.
 */
export type EmbedProps = RootNativeProps & EmbedSharedProps & (EmbedFrameProps | EmbedContentProps);

/** Root recipe: the stable public marker, the clip and a zero minimum width; Material comes from the Surface well. */
export const embedVariants = cva('eg-embed min-w-0 overflow-hidden');
/** Loading layer: fills the reserved box and centers the decorative Spinner behind the frame. */
export const embedLoadingVariants = cva('absolute inset-0 grid place-items-center text-fg-muted');
/** Frame: fills the reserved box, positioned and later in tree order so it paints over the loading layer. */
export const embedFrameVariants = cva('relative block size-full border-0');
/**
 * Fallback layer: the consumer's alternative, centered in the box in the muted body type. It is the only part with
 * padding, so it is sized border-box: otherwise `size-full` plus the padding would overflow the reserved box wherever
 * no preflight sets border-box sizing (docs/components/embed/v0.1/approval.md, Amendment 1).
 */
export const embedFallbackVariants = cva(
  'box-border grid size-full place-items-center p-6 text-center font-sans text-body-default text-fg-muted'
);
