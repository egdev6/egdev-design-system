import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

/** Editorial arrangement, independent of heading rank. */
export type SectionHeaderVariant = 'stack' | 'split' | 'inline';
/** Native heading rank; section typography is unchanged. */
export type SectionHeaderLevel = 1 | 2 | 3 | 4 | 5 | 6;
/** Host context for the Heading accent; never paints the header. */
export type SectionHeaderTone = 'canvas' | 'raised';
/** One plain-text run, with optional native language and decorative status. */
export type SectionHeaderTextRun = readonly [text: string, lang?: string, decorative?: boolean];
/** Plain text or ordered plain-text runs; callers supply their own whitespace. */
export type SectionHeaderText = string | readonly SectionHeaderTextRun[];

type SectionHeaderNativeProps = Omit<
  ComponentPropsWithoutRef<'header'>,
  'children' | 'title' | 'dangerouslySetInnerHTML'
>;

/**
 * Passive editorial introduction. className supports outer margins, width constraints and parent
 * flex/grid placement only, merged last with cn. Inner layout and typography are contract-owned;
 * arbitrary selector/layer precedence and appearance overrides are not supported.
 */
export type SectionHeaderProps = SectionHeaderNativeProps & {
  /**
   * Required readable heading copy, preserved verbatim. Include any separating space before accent.
   * Blank or decorative-only titles warn in development and render no header.
   * @control false
   * @controlReason Text or structured multilingual runs cannot be represented by one control; see Multilingual.
   */
  title: SectionHeaderText;
  /**
   * Optional context before the heading, rendered by Text's decorative diamond eyebrow recipe.
   * Blank or decorative-only text is omitted.
   * @control false
   * @controlReason Text or structured multilingual runs cannot be represented by one control; see Multilingual.
   */
  eyebrow?: SectionHeaderText;
  /**
   * Optional trailing highlighted run in the same heading; blank text is omitted. No separator is inserted.
   * @control text
   */
  accent?: string;
  /**
   * Start the accent on a separate visual line. No effect without an accent.
   * @default false
   * @control boolean
   */
  accentBreak?: boolean;
  /**
   * Optional introductory paragraph; blank or decorative-only text is omitted, never a placeholder.
   * @control false
   * @controlReason Text or structured multilingual runs cannot be represented by one control; see Multilingual.
   */
  lede?: SectionHeaderText;
  /**
   * Editorial arrangement. Split without a lede and inline without an eyebrow resolve to stack.
   * @default stack
   * @control select
   */
  variant?: SectionHeaderVariant;
  /**
   * Native heading rank only, not a font-size selector.
   * @default 2
   * @control select
   */
  level?: SectionHeaderLevel;
  /**
   * Consumer-supplied document-unique heading ID for external relationships, distinct from root id.
   * Blank IDs are omitted; no ID is generated.
   * @control text
   */
  titleId?: string;
  /**
   * Accent context: canvas neon or raised brand on surface-1 through surface-3 and overlays.
   * @default canvas
   * @control select
   */
  tone?: SectionHeaderTone;
};

/** Local layout only; primitive typography and Material recipes are never copied. */
export const sectionHeaderVariants = cva('eg-section-head min-w-0', {
  variants: {
    variant: {
      stack: 'flex flex-col items-start gap-5',
      split:
        'grid grid-cols-1 items-end gap-y-6 gap-x-12 section-header-split:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]',
      inline: 'grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] items-center gap-6'
    }
  },
  defaultVariants: { variant: 'stack' }
});

export const sectionHeaderEyebrowVariants = cva('min-w-0', {
  variants: { variant: { stack: '', split: 'col-span-full', inline: '' } }
});
export const sectionHeaderHeadingVariants = cva('min-w-0', {
  variants: { variant: { stack: '', split: '', inline: 'col-span-full' } }
});
export const sectionHeaderLedeVariants = cva('eg-section-head__lede min-w-0 max-w-[var(--bp-sm)]', {
  variants: {
    variant: {
      stack: '',
      split: 'justify-self-start section-header-split:justify-self-end',
      inline: 'col-span-full'
    }
  }
});
/** Override Divider's attribute-specific minimum width through its supported sizing surface. */
export const sectionHeaderRuleVariants = cva('min-w-0 data-[orientation=horizontal]:min-w-0 self-center');
