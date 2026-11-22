import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Display-scale title recipes shared by Text and Heading. `inverse` is display scale on flood hosts. */
export type TitleVariant = 'display' | 'hero' | 'section' | 'show' | 'inverse';

/** Heading recipes include the compact band treatment without widening Text. */
type HeadingVariant = TitleVariant | 'compact';

/** Body and lede typography recipes, available only on Text. */
type TextBodyVariant = 'body' | 'body-large' | 'lede';

/** Text recipes: title, eyebrow and body typography. */
export type TextVariant = TitleVariant | 'eyebrow' | TextBodyVariant;

/** Semantic body foreground; inherit follows the actual host color. */
export type TextForeground = 'inherit' | 'default' | 'secondary' | 'muted' | 'warning' | 'danger' | 'on-flood';

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

const headingRootClasses = {
  ...titleRootClasses,
  compact: 'text-heading-small'
} as const satisfies Record<HeadingVariant, string>;

const textVariantClasses = {
  ...titleRootClasses,
  eyebrow:
    "text-label-eyebrow text-fg-secondary inline-flex items-center gap-2.5 before:content-[''] before:size-2 before:shrink-0 before:rotate-45 before:bg-fg-brand-default"
} as const satisfies Record<Exclude<TextVariant, TextBodyVariant>, string>;

export const textVariants = cva('eg-text m-0 font-display uppercase wrap-break-word', {
  variants: {
    variant: textVariantClasses,
    truncate: { true: 'block min-w-0 truncate', false: null }
  },
  compoundVariants: [{ variant: 'eyebrow', truncate: true, class: 'before:inline-block before:me-2.5' }],
  defaultVariants: { variant: 'eyebrow', truncate: false }
});

const textBodyVariantClasses = {
  body: 'text-body-default',
  'body-large': 'text-body-large',
  lede: 'text-body-muted'
} as const satisfies Record<TextBodyVariant, string>;

export const textForegroundClasses = {
  inherit: '',
  default: 'text-fg-default',
  secondary: 'text-fg-secondary',
  muted: 'text-fg-muted',
  warning: 'text-status-warning',
  danger: 'text-status-danger',
  'on-flood': 'text-fg-on-flood'
} as const satisfies Record<TextForeground, string>;

export const textBodyVariants = cva(
  'eg-text m-0 font-sans [&_strong]:[font-weight:var(--text-heading-small--font-weight)]',
  {
    variants: {
      variant: textBodyVariantClasses,
      foreground: textForegroundClasses,
      truncate: { true: 'block min-w-0 truncate', false: null }
    },
    defaultVariants: { foreground: 'inherit', truncate: false }
  }
);

export const headingVariants = cva('eg-heading m-0 font-display uppercase wrap-break-word', {
  variants: { variant: headingRootClasses, foreground: textForegroundClasses },
  defaultVariants: { variant: 'section', foreground: 'inherit' }
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
       * Semantic foreground is only available on body recipes.
       * @control select
       */
      foreground?: never;
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
       * Semantic foreground is only available on body recipes.
       * @control select
       */
      foreground?: never;
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
       * Semantic foreground is only available on body recipes.
       * @control select
       */
      foreground?: never;
      /**
       * Not available on inverse: root and accent always use the on-flood foreground.
       * @control select
       */
      tone?: never;
    } & TitleAccentProps)
  | {
      /**
       * Body or lede typography; use Heading for document hierarchy.
       * @control select
       */
      variant: TextBodyVariant;
      /**
       * Foreground for body copy. Inherit follows the host; use on-flood or inherit on flood,
       * and provide meaningful words and a non-color cue for status colors.
       * @default inherit
       * @control select
       */
      foreground?: TextForeground;
      /**
       * Accent Material context is unavailable on body recipes.
       * @control select
       */
      tone?: never;
      /**
       * Use semantic strong content instead of a trailing accent on body recipes.
       * @control text
       */
      accent?: never;
      /**
       * Accent layout is unavailable on body recipes.
       * @control boolean
       */
      accentBreak?: never;
    };

type HeadingVisualProps =
  | ({
      /**
       * Named visual recipe, independent of the heading level.
       * @default section
       * @control select
       */
      variant?: Exclude<TitleVariant, 'inverse'>;
      /**
       * Semantic foreground is available only on the compact recipe.
       * @control select
       */
      foreground?: never;
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
       * Semantic foreground is available only on the compact recipe.
       * @control select
       */
      foreground?: never;
      /**
       * Not available on inverse: root and accent always use the on-flood foreground.
       * @control select
       */
      tone?: never;
    } & TitleAccentProps)
  | {
      /**
       * Compact uppercase display-family heading, independent of native rank.
       * @control select
       */
      variant: 'compact';
      /**
       * Semantic foreground for compact headings. Inherit follows the host. Explicit default,
       * secondary, muted, warning and danger are for solid surface-0…3; on flood use inherit or
       * on-flood, and on deep use inherit or default. Check actual pixels on translucent hosts.
       * Supply meaningful words and a non-color cue for status colors.
       * @default inherit
       * @control select
       */
      foreground?: TextForeground;
      /**
       * Accent Material context is unavailable on compact headings.
       * @control select
       */
      tone?: never;
      /**
       * Compact headings use their children rather than a trailing accent.
       * @control text
       */
      accent?: never;
      /**
       * Accent layout is unavailable on compact headings.
       * @control boolean
       */
      accentBreak?: never;
    };

/**
 * Non-heading display, eyebrow or body copy. className supports outer layout only (margins, width
 * constraints, flex/grid placement); typography, color, glow and accent layout follow the contract.
 * When truncating, display, whitespace, clipping and ellipsis are owned by the truncate prop.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
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
    /**
     * Visually elide overflowing copy to one line without removing its content. The host must bound
     * the width, make every shrinking flex/grid ancestor and grid track shrinkable, and provide a
     * visible keyboard- and touch-operable route to the complete text; title is supplementary only.
     * A slotted child must be passive and block-compatible; it becomes block rather than inline.
     * Do not place focusable descendants, hard breaks or nested block boxes in the clipping root.
     * @default false
     * @control boolean
     */
    truncate?: boolean;
  };

/**
 * Native h1–h6 display heading. className supports outer layout only (margins, width constraints,
 * flex/grid placement); typography, color, glow and accent layout follow the contract.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
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
