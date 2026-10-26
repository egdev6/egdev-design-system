import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Quote presentation: compact pull interruption or typographic display moment. Both stay quotations. */
export type PullQuoteVariant = 'pull' | 'display';

/** Material context that selects the accent color only; never paints a background. */
export type PullQuoteTone = 'canvas' | 'raised';

type PullQuoteNativeProps = Omit<ComponentPropsWithoutRef<'figure'>, 'children' | 'role' | 'dangerouslySetInnerHTML'>;

/**
 * One editorial quotation: native figure > blockquote > p with an optional figcaption source.
 * Native figure attributes reach the root; the native `cite` URL reaches only the blockquote.
 */
export type PullQuoteProps = PullQuoteNativeProps &
  Pick<ComponentPropsWithoutRef<'blockquote'>, 'cite'> & {
    /**
     * Main quoted passage as plain text. Must contain non-whitespace content: blank text warns in
     * development and renders nothing. Punctuation and whitespace are preserved; no quotation
     * marks are inserted.
     * @control text
     */
    text: string;
    /**
     * Optional trailing emphasized run of the same quotation, inline for pull and block for
     * display. Blank text renders no accent. No separator is inserted: supply the space in text.
     * @control text
     */
    accent?: string;
    /**
     * Optional visible attribution or contextual caption rendered in a figcaption outside the
     * quoted passage. Plain text only: never parsed into an author, work title or link. Blank text
     * renders no caption.
     * @control text
     */
    source?: string;
    /**
     * Quote presentation. Both variants keep blockquote semantics; display never creates a heading.
     * @default pull
     * @control select
     */
    variant?: PullQuoteVariant;
    /**
     * Accent context: raised on surface-1…3 or overlay hosts. Only the accent color changes.
     * @default canvas
     * @control select
     */
    tone?: PullQuoteTone;
  };

/** Root figure: pull carries the logical brand filet, inset and 40ch measure; display has none. */
export const pullQuoteVariants = cva('eg-quote m-0 min-w-0 flex flex-col border-0 border-solid p-0', {
  variants: {
    variant: {
      pull: 'gap-3 max-w-quote-pull border-s-[length:calc(var(--border-width)*2)] border-fg-brand-default py-0.5 ps-4.5',
      display: 'gap-5.5 max-w-none border-0 p-0'
    } satisfies Record<PullQuoteVariant, string>
  },
  defaultVariants: { variant: 'pull' }
});

/** Native blockquote with the quote typography recipe. Display casing is CSS only. */
export const pullQuoteQuotationVariants = cva('eg-quote__text m-0 min-w-0', {
  variants: {
    variant: {
      pull: 'font-sans text-quote-pull text-fg-secondary',
      display: 'font-display text-quote-display uppercase text-fg-default'
    } satisfies Record<PullQuoteVariant, string>
  },
  defaultVariants: { variant: 'pull' }
});

/** Passage paragraph inside the blockquote. */
export const pullQuotePassageVariants = cva('m-0 min-w-0');

/** Trailing accent run: tone selects the brand color, variant selects inline or block layout. */
export const pullQuoteAccentVariants = cva('eg-quote__accent', {
  variants: {
    tone: {
      canvas: 'text-fg-brand-default',
      raised: 'text-fg-brand-raised'
    } satisfies Record<PullQuoteTone, string>,
    variant: { pull: 'inline', display: 'block' } satisfies Record<PullQuoteVariant, string>
  },
  defaultVariants: { tone: 'canvas', variant: 'pull' }
});

/** Source caption outside the quoted passage with body-default leading. */
export const pullQuoteSourceVariants = cva('eg-quote__source m-0 font-sans text-body-default text-fg-secondary');
