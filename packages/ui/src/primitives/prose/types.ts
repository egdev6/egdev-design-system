import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Root body step: md is the 16px reading size and sm the compact 12.8px step. It is also the unit of the measure. */
export type ProseSize = 'sm' | 'md';

/** Surface family hosting the prose. It only selects the brand colour of inline code and never paints a background. */
export type ProseTone = 'canvas' | 'raised';

type ProseNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML'
>;

/**
 * Passive reading column for converted, sanitized long-form content: one div that gives bare semantic children a
 * token-backed presentation with a built-in reading measure. It converts and sanitizes nothing and accepts no HTML
 * string: pass React nodes, or render an HTML string you have already sanitized through your own element. Supported
 * children are h2 to h4 (the page title is the h1), p, ul, ol, li, a, strong, blockquote, pre, inline code, img,
 * figure, figcaption, a simple table (th, td) and hr. Do not nest PullQuote, Table, PhotoFrame or any other component
 * that owns a recipe inside it: the descendant rules would override that component's own utilities. className supports
 * outer layout only (margins, self-alignment, flex or grid placement); width constraints are unsupported.
 */
export type ProseProps = ProseNativeProps & {
  /**
   * Converted and sanitized flow content as React nodes.
   * @control false
   * @controlReason ReactNode content is not serializable in Controls; see the Default and Elements stories.
   */
  children: ReactNode;
  /**
   * Root body step and unit of the ch measure: md is the 16px reading size, sm the compact 12.8px step.
   * @default md
   * @control select
   */
  size?: ProseSize;
  /**
   * Surface family hosting the prose: canvas for surface-0 and the grafito register, raised for surface-1 to
   * surface-3 hosts. It only selects the brand colour of inline code and never paints a background.
   * @default canvas
   * @control select
   */
  tone?: ProseTone;
};

// The root alone carries the descendant recipe: every utility is a static literal with its own `[&_selector]:`
// variant, so the Tailwind scanner emits it from this file and the elements stay bare, with no markers or classes.
// Native consumers get no Preflight, so each element sets its own margin, padding, list style, border and font.
// Descendant rules have specificity (0,1,1), pseudo-class rules (0,2,1) and the direct first and last child rules
// (0,2,0), which is why the latter trim the outer margins. Inline code is any code outside a pre, a direct child of
// the root included (the not() argument is a complex selector, so that rule has specificity (0,1,3)).
export const proseVariants = cva(
  [
    'eg-prose box-border min-w-0 max-w-prose font-sans wrap-break-word text-pretty',
    '[&>:first-child]:mt-0 [&>:last-child]:mb-0',
    '[&_h2]:m-0 [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:font-display [&_h2]:uppercase [&_h2]:text-balance',
    '[&_h2]:text-heading-section [&_h2]:text-fg-default',
    '[&_h3]:m-0 [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-sans [&_h3]:normal-case [&_h3]:text-balance',
    '[&_h3]:text-heading-small [&_h3]:text-fg-default',
    '[&_h4]:m-0 [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:font-sans [&_h4]:normal-case [&_h4]:text-balance',
    '[&_h4]:text-body-large [&_h4]:text-fg-default [&_h4]:[font-weight:var(--text-heading-small--font-weight)]',
    '[&_p]:m-0 [&_p]:mb-5',
    '[&_a]:text-link-default [&_a]:underline [&_a]:underline-offset-(--space-1) [&_a:hover]:no-underline',
    '[&_a:focus-visible]:outline-none [&_a:focus-visible]:rounded-sm',
    '[&_a:focus-visible]:[box-shadow:var(--shadow-focus)]',
    '[&_strong]:[font-weight:var(--text-heading-small--font-weight)]',
    '[&_ul]:m-0 [&_ul]:mb-5 [&_ul]:ps-7 [&_ul]:list-disc [&_ol]:m-0 [&_ol]:mb-5 [&_ol]:ps-7 [&_ol]:list-decimal',
    '[&_li]:mt-2 [&_li:first-child]:mt-0 [&_li::marker]:text-fg-muted',
    '[&_blockquote]:m-0 [&_blockquote]:my-8 [&_blockquote]:ps-4.5 [&_blockquote]:text-fg-secondary',
    '[&_blockquote]:border-s-[length:calc(var(--border-width)*2)] [&_blockquote]:border-fg-brand-default',
    '[&_code]:font-mono [&_code]:text-code',
    '[&_pre]:my-6 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:border [&_pre]:border-border-hairline',
    '[&_pre]:bg-surface-0 [&_pre]:p-4 [&_pre]:shadow-[var(--shadow-well)]',
    '[&_pre]:font-mono [&_pre]:text-code [&_pre]:text-fg-secondary',
    '[&_pre:focus-visible]:outline-none [&_pre:focus-visible]:[box-shadow:var(--shadow-focus)]',
    '[&_img]:block [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-md',
    '[&_figure]:m-0 [&_figure]:my-8 [&_figcaption]:mt-2 [&_figcaption]:text-body-default [&_figcaption]:text-fg-muted',
    '[&_table]:my-8 [&_table]:w-full [&_table]:border-collapse',
    '[&_th]:border-b [&_th]:border-border-default [&_th]:bg-surface-2 [&_th]:px-4 [&_th]:py-2.5 [&_th]:text-start',
    '[&_th]:font-display [&_th]:text-label-eyebrow [&_th]:uppercase [&_th]:text-fg-muted',
    '[&_td]:border-b [&_td]:border-border-subtle [&_td]:px-4 [&_td]:py-3 [&_td]:text-start [&_td]:align-top',
    '[&_td]:wrap-break-word [&_td]:text-body-default [&_td]:text-fg-secondary',
    '[&_hr]:m-0 [&_hr]:my-10 [&_hr]:border-0 [&_hr]:border-t [&_hr]:border-solid [&_hr]:border-border-hairline'
  ],
  {
    variants: {
      size: { sm: 'text-body-default', md: 'text-body-large' },
      tone: {
        canvas: '[&_code:not(pre_code)]:text-fg-brand-default',
        raised: '[&_code:not(pre_code)]:text-fg-brand-raised'
      }
    },
    defaultVariants: { size: 'md', tone: 'canvas' }
  }
);
