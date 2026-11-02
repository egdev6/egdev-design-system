import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';

/** Material signature axis: the raised default frame or the brand-edged featured card. */
export type ProjectCardVariant = 'default' | 'featured';
/** Density preset; `sm` never hides supplied content. */
export type ProjectCardSize = 'md' | 'sm';
/** Native heading rank for the document outline, independent of typography. */
export type ProjectCardLevel = 2 | 3 | 4 | 5 | 6;

/** One line of the sample code block; `kind` selects the prompt glyph or the muted comment. */
export type ProjectCardCodeLine = {
  /**
   * Literal text of the line; rendered verbatim inside the mono well.
   * @control text
   */
  text: string;
  /**
   * Presentation of the line: command lines show the decorative brand prompt, comments stay muted.
   * @default command
   * @control select
   */
  kind?: 'command' | 'comment';
};

type ProjectCardNativeProps = Omit<
  ComponentPropsWithoutRef<'article'>,
  | 'title'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'dangerouslySetInnerHTML'
  | 'aria-label'
  | 'aria-labelledby'
  | 'aria-disabled'
  | 'aria-selected'
  | 'aria-pressed'
  | 'aria-live'
>;

/** Passive named project card. className supports external layout only, merged last;
 * appearance, spacing and parts remain owned. Use className for grid placement, margin and width.
 * No ref, asChild or whole-card activation API.
 */
export type ProjectCardProps = ProjectCardNativeProps & {
  /**
   * Visible heading text and the complete article name. Blank titles warn in development and render nothing.
   * @control text
   */
  title: string;
  /**
   * Native heading rank only; the visual step follows the size, never the rank.
   * @default 3
   * @control select
   */
  level?: ProjectCardLevel;
  /**
   * Optional uppercase context line above the heading; whitespace-only renders nothing.
   * @control text
   */
  eyebrow?: string;
  /**
   * Optional decorative outline number such as 01; aria-hidden and never part of the accessible name.
   * Whitespace-only renders nothing.
   * @control text
   */
  index?: string;
  /**
   * Visual treatment: the raised default frame or the featured signature (brand edge, halo and index ink).
   * @default default
   * @control select
   */
  variant?: ProjectCardVariant;
  /**
   * Density preset; every supplied part still renders, including the code block.
   * @default md
   * @control select
   */
  size?: ProjectCardSize;
  /**
   * Free body flow in reading order: paragraphs, then ProjectCardTags, ProjectCardCode and ProjectCardFooter.
   * @control false
   * @controlReason Non-serializable ReactNode content; see Default, Tags, Code and WithLink for body compositions.
   */
  children?: ReactNode;
  /**
   * Outer layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Ordered technology labels rendered as one static Chip per list item. */
export type ProjectCardTagsProps = {
  /**
   * Technology labels; empty arrays render an empty list, so omit the part instead.
   * @control false
   * @controlReason A string array is not a scalar control; see the Tags story for supplied lists.
   */
  items: string[];
  /**
   * Local layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Sample command block in a labelled mono well; passive text, never executable or focusable. */
export type ProjectCardCodeProps = {
  /**
   * Accessible name of the block and the only description assistive technology receives.
   * @control text
   */
  label: string;
  /**
   * Ordered code lines; command lines carry the decorative prompt, comments render muted.
   * @control false
   * @controlReason A structured array is not a scalar control; see the Code story for supplied lines.
   */
  items: ProjectCardCodeLine[];
  /**
   * Local layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Footer zone for the card's single action; the consumer supplies exactly one Link or Button. */
export type ProjectCardFooterProps = {
  /**
   * One supplied action; the card itself stays passive and adds no tab stop of its own.
   * @control false
   * @controlReason Non-serializable ReactNode content; see the WithLink story for the supplied action.
   */
  children: ReactNode;
  /**
   * Local layout only (grid placement, margin, width); appearance stays with the recipes.
   * @control text
   */
  className?: string;
};

/** Public raised frame: Surface material plus the card's layout and signature variant. */
export const projectCardVariants = cva('eg-project-card flex flex-col gap-4 min-w-0', {
  variants: {
    variant: {
      default: '',
      featured: 'border-border-brand shadow-[var(--shadow-hot)]'
    },
    size: {
      md: '',
      sm: 'gap-3 p-3'
    }
  },
  defaultVariants: { variant: 'default', size: 'md' }
});

/** Decorative outlined index: transparent ink over a token-valued text stroke; featured uses brand ink. */
export const projectCardIndexVariants = cva(
  'tabular-nums leading-none text-transparent [-webkit-text-stroke:var(--border-width)_var(--color-border-brand)]',
  {
    variants: {
      variant: {
        default: '',
        featured: '[-webkit-text-stroke:var(--border-width)_var(--color-fg-brand-default)]'
      },
      size: {
        md: 'text-title-display',
        sm: 'text-title-section'
      }
    },
    defaultVariants: { variant: 'default', size: 'md' }
  }
);

/** Internal uppercase context line above the heading. */
export const projectCardEyebrowVariants = cva('text-label-eyebrow text-fg-secondary uppercase');

/** Card title step, independent of the heading rank; sm uses the smaller density step. */
export const projectCardHeadingVariants = cva('m-0 wrap-anywhere text-fg-default', {
  variants: {
    size: {
      md: 'text-heading-small',
      sm: 'text-body-large'
    }
  },
  defaultVariants: { size: 'md' }
});

/** Inherited body copy typography for the free flow; parts override with their own recipes. */
export const projectCardBodyVariants = cva('text-body-large text-fg-secondary');

/** Tag list: a real ul of static chips. */
export const projectCardTagsVariants = cva('eg-project-card__tags m-0 flex min-w-0 list-none flex-wrap gap-1.5 p-0');

/** Mono well over the recessed Surface recipe; horizontal scroll stays inside the well. */
export const projectCardCodeVariants = cva('eg-project-card__code m-0 overflow-x-auto font-mono text-code');

/** One code line; comment lines render muted without the prompt glyph. */
export const projectCardCodeLineVariants = cva('eg-project-card__code-line', {
  variants: {
    kind: {
      command: '',
      comment: 'text-fg-muted'
    }
  },
  defaultVariants: { kind: 'command' }
});

/** Decorative brand prompt glyph inside command lines. */
export const projectCardCodeGlyphVariants = cva('text-fg-brand-raised');

/** Footer zone for the card's single supplied action; no pinning, it follows the body flow. */
export const projectCardFootVariants = cva('eg-project-card__foot flex items-center gap-3');
