import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';
import type { SectionHeaderLevel, SectionHeaderText } from '../section-header';

/** One label/value fact about the page content, such as a publication date, a source or a place. Plain text only. */
export type DetailHeaderMetadataItem = {
  /**
   * Visible term of the fact, rendered as supplied. Consumer-owned and localized: there is no built-in text. A blank,
   * whitespace-only or non-string label omits the entry with a development warning.
   * @control text
   */
  label: string;
  /**
   * Visible plain-text value of the fact, rendered as supplied and never truncated. A blank, whitespace-only or
   * non-string value omits the entry with a development warning.
   * @control text
   */
  value: string;
  /**
   * Optional machine-readable date or time, a valid HTML date or time string such as 2026-11-26, that wraps the value
   * in a native time element. The component neither formats nor validates it, and a blank value is ignored: the plain
   * value renders without a time element.
   * @control text
   */
  dateTime?: string;
};

/** One external destination related to the page content, such as a canonical page, a repository or a demo. */
export type DetailHeaderLink = {
  /**
   * Visible and descriptive link text, rendered as supplied. A blank, whitespace-only or non-string label omits the
   * entry with a development warning.
   * @control text
   */
  label: string;
  /**
   * Absolute HTTPS destination with a host, without credentials or raw control characters; surrounding whitespace is
   * trimmed. The link always opens in a new tab. A relative, protocol-relative, http, script or malformed destination
   * omits the entry with a development warning.
   * @control text
   */
  href: string;
};

/** Built-in interface text of the two lists: both accessible names are English by default. */
export type DetailHeaderMessages = {
  /**
   * Accessible name of the tags list. Blank input warns in development and uses the default name, Tags.
   * @control text
   */
  tags: string;
  /**
   * Accessible name of the links list. Blank input warns in development and uses the default name, Links.
   * @control text
   */
  links: string;
};

type DetailHeaderNativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  'children' | 'title' | 'role' | 'aria-label' | 'aria-labelledby' | 'dangerouslySetInnerHTML' | 'style'
>;

/**
 * Passive opening block of a detail page: the SectionHeader heading block (optional eyebrow, the page heading and an
 * optional lede) followed by optional label/value facts, static tag pills and external links, in that reading order.
 * The host supplies the text, formats dates and localizes; nothing is fetched, routed, filtered or painted, and the
 * component has no state, ref or asChild. className supports outer margins, width constraints and parent flex/grid
 * placement only, merged last with cn on the root; no part exposes a className and the inner layout is
 * contract-owned.
 * @classNameAllows width min-width max-width inline-size min-inline-size max-inline-size
 */
export type DetailHeaderProps = DetailHeaderNativeProps & {
  /**
   * Required page title, rendered by SectionHeader as the page heading. Plain text or ordered language-tagged runs
   * that keep their own lang and decorative separators. A blank or decorative-only title warns in development and
   * renders nothing: no heading, facts, tags or links.
   * @control false
   * @controlReason Text or structured multilingual runs cannot be represented by one control; see Default and Localized.
   */
  title: SectionHeaderText;
  /**
   * Optional context line before the title, typically the kind of content such as post, article or event. A blank or
   * decorative-only value is omitted.
   * @control false
   * @controlReason Text or structured multilingual runs cannot be represented by one control; see Default and Localized.
   */
  eyebrow?: SectionHeaderText;
  /**
   * Optional introductory paragraph after the title. A blank or decorative-only value is omitted, never a placeholder.
   * @control false
   * @controlReason Text or structured multilingual runs cannot be represented by one control; see Default and Localized.
   */
  lede?: SectionHeaderText;
  /**
   * Native heading rank of the page title, never a typography selector: the title keeps its section-scale look at every
   * rank. A runtime value outside 1 to 6 resolves to 1.
   * @default 1
   * @control select
   */
  level?: SectionHeaderLevel;
  /**
   * Ordered facts about the content, rendered as a description list after the heading block. Entries with a blank
   * label or value are omitted with a development warning; absent, empty and all-invalid input renders no list.
   * @control false
   * @controlReason Structured entries are not a scalar control; see Default, Event, Project and Note.
   */
  metadata?: DetailHeaderMetadataItem[];
  /**
   * Ordered short labels, rendered as a named list of non-interactive pills. Blank entries are omitted with a
   * development warning and duplicates both render; absent, empty and all-invalid input renders no list.
   * @control false
   * @controlReason An array of strings is not a scalar control; see Default, Project and Note.
   */
  tags?: string[];
  /**
   * Ordered external destinations, rendered as a named list of links that open in a new tab. Entries with a blank
   * label or an unsafe destination are omitted with a development warning; absent, empty and all-invalid input
   * renders no list.
   * @control false
   * @controlReason Structured entries are not a scalar control; see Default, Event and Project.
   */
  links?: DetailHeaderLink[];
  /**
   * Localized notice appended, after one space, to the accessible name of every link, for example
   * "Repository (opens in a new tab)". Blank input warns in development and uses the default.
   * @default (opens in a new tab)
   * @control text
   */
  newTabText?: string;
  /**
   * Localized accessible names of the two lists: tags falls back to Tags and links to Links. A missing key keeps its
   * default, and a blank key warns in development and uses its default.
   * @control false
   * @controlReason A partial object of two names is not a scalar control; see Localized.
   */
  messages?: Partial<DetailHeaderMessages>;
};

/** Root recipe: the stable public marker, containment and the reading-order stack. The host owns the background. */
export const detailHeaderVariants = cva('eg-detail-header flex min-w-0 flex-col gap-6');
/** Facts list: a retained internal marker and a wrapping row of facts. */
export const detailHeaderMetaVariants = cva('eg-detail-header__meta m-0 flex min-w-0 flex-wrap gap-x-8 gap-y-4');
/** One fact: the term above its value. */
export const detailHeaderMetaEntryVariants = cva('flex min-w-0 flex-col gap-1');
/** Term of a fact: the muted uppercase eyebrow step, an uppercase presentation of the supplied label. */
export const detailHeaderTermVariants = cva('m-0 font-display text-label-eyebrow uppercase text-fg-muted');
/** Value of a fact: body text that wraps instead of overflowing, never truncated. */
export const detailHeaderValueVariants = cva('m-0 min-w-0 font-sans text-body-default text-fg-default wrap-anywhere');
/** Tags list: a retained internal marker, the list reset and a wrapping row of pills. */
export const detailHeaderTagsVariants = cva('eg-detail-header__tags m-0 flex min-w-0 list-none flex-wrap gap-1.5 p-0');
/** Links list: a retained internal marker, the list reset and a wrapping row of links. */
export const detailHeaderLinksVariants = cva(
  'eg-detail-header__links m-0 flex min-w-0 list-none flex-wrap gap-x-6 gap-y-3 p-0'
);
/** Link item: lets a long link label wrap instead of overflowing. */
export const detailHeaderLinkItemVariants = cva('min-w-0');
