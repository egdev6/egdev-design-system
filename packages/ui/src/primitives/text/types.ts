import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Display-scale title recipes shared by Text and Heading. `inverse` is display scale on flood hosts. */
export type TitleVariant = 'display' | 'hero' | 'section' | 'show' | 'inverse';

/** Text recipes: every title recipe plus the diamond-prefixed eyebrow. */
export type TextVariant = TitleVariant | 'eyebrow';

/** Material context that selects the accent color; never paints a background. */
export type TextTone = 'canvas' | 'raised';

/** Native heading rank, independent of the visual variant. */
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

/** Accent color resolution: canvas neon, raised brand or on-flood for inverse. */
type AccentTone = TextTone | 'flood';

const titleRootClasses = {
  section: 'text-title-section text-fg-default',
  hero: 'text-title-hero text-fg-default',
  show: 'text-title-show text-fg-default',
  display: 'text-title-display text-fg-default',
  inverse: 'text-title-display text-fg-on-flood'
} as const satisfies Record<TitleVariant, string>;

const textVariantClasses = {
  ...titleRootClasses,
  eyebrow:
    "text-label-eyebrow text-fg-secondary inline-flex items-center gap-2.5 before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:bg-fg-brand-default"
} as const satisfies Record<TextVariant, string>;

export const textVariants = cva('eg-text m-0 font-display uppercase wrap-break-word', {
  variants: { variant: textVariantClasses },
  defaultVariants: { variant: 'eyebrow' }
});

export const headingVariants = cva('eg-heading m-0 font-display uppercase wrap-break-word', {
  variants: { variant: titleRootClasses },
  defaultVariants: { variant: 'section' }
});

export const accentVariants = cva('', {
  variants: {
    part: { text: 'eg-text__accent', heading: 'eg-heading__accent' },
    tone: {
      canvas: 'text-fg-brand-default',
      raised: 'text-fg-brand-raised',
      flood: 'text-fg-on-flood'
    } satisfies Record<AccentTone, string>,
    glow: { true: '[text-shadow:var(--text-shadow-title-hero)]', false: '[text-shadow:none]' },
    accentBreak: { true: 'block', false: 'inline' }
  },
  defaultVariants: { tone: 'canvas', glow: false, accentBreak: true }
});

type TitleAccentProps = {
  /**
   * One optional trailing highlighted run of the phrase. Empty or whitespace-only text renders no
   * accent; non-empty text is preserved exactly. No separator is inserted: supply whitespace in children.
   * @control text
   */
  accent?: string;
  /**
   * Whether the accent starts on its own line (block) or continues inline. No effect without an accent.
   * @default true
   * @control boolean
   */
  accentBreak?: boolean;
};

type TextVisualProps =
  | {
      /**
       * Named visual recipe. Text excludes headings: use Heading for document hierarchy.
       * @default eyebrow
       * @control select
       */
      variant?: 'eyebrow';
      /**
       * Accent Material context. Not available on the eyebrow, whose diamond is decorative.
       * @control select
       */
      tone?: never;
      /**
       * Not available on the eyebrow: it is one short phrase with a fixed decorative diamond.
       * @control text
       */
      accent?: never;
      /**
       * Not available on the eyebrow.
       * @control boolean
       */
      accentBreak?: never;
    }
  | ({
      /**
       * Named visual recipe. Text excludes headings: use Heading for document hierarchy.
       * @control select
       */
      variant: Exclude<TitleVariant, 'inverse'>;
      /**
       * Accent Material context: canvas (surface-0) neon or raised brand on surface-1…3 and overlays.
       * Consumers choose it; the host background is never inspected. The canvas hero accent glows.
       * @default canvas
       * @control select
       */
      tone?: TextTone;
    } & TitleAccentProps)
  | ({
      /**
       * Named visual recipe. Text excludes headings: use Heading for document hierarchy.
       * @control select
       */
      variant: 'inverse';
      /**
       * Not available on inverse: root and accent always use the on-flood foreground.
       * @control select
       */
      tone?: never;
    } & TitleAccentProps);

type HeadingVisualProps =
  | ({
      /**
       * Named visual recipe, independent of the heading level.
       * @default section
       * @control select
       */
      variant?: Exclude<TitleVariant, 'inverse'>;
      /**
       * Accent Material context: canvas (surface-0) neon or raised brand on surface-1…3 and overlays.
       * Consumers choose it; the host background is never inspected. The canvas hero accent glows.
       * @default canvas
       * @control select
       */
      tone?: TextTone;
    } & TitleAccentProps)
  | ({
      /**
       * Named visual recipe, independent of the heading level.
       * @control select
       */
      variant: 'inverse';
      /**
       * Not available on inverse: root and accent always use the on-flood foreground.
       * @control select
       */
      tone?: never;
    } & TitleAccentProps);

/**
 * Non-heading display copy or an eyebrow. className supports outer layout only (margins, width
 * constraints, flex/grid placement); typography, color, glow and accent layout follow the contract.
 */
export type TextProps = Omit<ComponentPropsWithoutRef<'p'>, 'children' | 'role' | 'dangerouslySetInnerHTML'> &
  TextVisualProps & {
    /**
     * Main copy. With asChild, exactly one prop-spreading non-heading element with normal children.
     * @control false
     * @controlReason Non-serializable ReactNode content; see the Default, Accents and AsChild stories.
     */
    children: ReactNode;
    /**
     * Render onto one non-heading child element through Slot instead of a paragraph.
     * @default false
     * @control boolean
     */
    asChild?: boolean;
  };

/**
 * Native h1–h6 display heading. className supports outer layout only (margins, width constraints,
 * flex/grid placement); typography, color, glow and accent layout follow the contract.
 */
export type HeadingProps = Omit<
  ComponentPropsWithoutRef<'h2'>,
  'children' | 'role' | 'aria-level' | 'dangerouslySetInnerHTML'
> &
  HeadingVisualProps & {
    /**
     * Heading text; its full visible copy, including the accent, is the accessible name.
     * @control false
     * @controlReason Non-serializable ReactNode content; see the Default, Levels and Accents stories.
     */
    children: ReactNode;
    /**
     * Native heading rank for the document outline; does not change the typography.
     * @default 2
     * @control select
     */
    level?: HeadingLevel;
  };
