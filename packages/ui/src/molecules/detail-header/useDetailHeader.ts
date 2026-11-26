import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import type { SectionHeaderLevel, SectionHeaderText } from '../section-header';
import { normalizeText } from '../section-header/useSectionHeader';
import { destination } from '../social-links/useSocialLinks';
import {
  type DetailHeaderLink,
  type DetailHeaderMessages,
  type DetailHeaderMetadataItem,
  type DetailHeaderProps,
  detailHeaderLinkItemVariants,
  detailHeaderLinksVariants,
  detailHeaderMetaEntryVariants,
  detailHeaderMetaVariants,
  detailHeaderTagsVariants,
  detailHeaderTermVariants,
  detailHeaderValueVariants,
  detailHeaderVariants
} from './types';

export type DetailHeaderHeadingProps = {
  title: SectionHeaderText;
  eyebrow: SectionHeaderText | undefined;
  lede: SectionHeaderText | undefined;
  level: SectionHeaderLevel;
};

/** One rendered fact: a stable key, the supplied label and value, and an optional machine-readable date. */
export type DetailHeaderMetadataEntry = {
  key: string;
  label: string;
  value: string;
  dateTime: string | undefined;
};

export type DetailHeaderMetadataPart = {
  listProps: ComponentPropsWithoutRef<'dl'>;
  entryClassName: string;
  termClassName: string;
  valueClassName: string;
  entries: DetailHeaderMetadataEntry[];
};

/** One rendered tag: a stable key and the supplied label. */
export type DetailHeaderTagEntry = { key: string; label: string };

export type DetailHeaderTagsPart = {
  listProps: ComponentPropsWithoutRef<'ul'>;
  entries: DetailHeaderTagEntry[];
};

/** One rendered link: a stable key, the supplied label and a validated destination. */
export type DetailHeaderLinkEntry = { key: string; label: string; href: string };

export type DetailHeaderLinksPart = {
  listProps: ComponentPropsWithoutRef<'ul'>;
  itemClassName: string;
  newTabText: string;
  entries: DetailHeaderLinkEntry[];
};

export type UseDetailHeaderResult =
  | { renderRoot: false }
  | {
      renderRoot: true;
      rootProps: ComponentPropsWithoutRef<'div'>;
      headingProps: DetailHeaderHeadingProps;
      /** Absent when no entry is valid, so an empty list is never rendered. */
      metadata: DetailHeaderMetadataPart | undefined;
      /** Absent when no tag is valid, so an empty list is never rendered. */
      tags: DetailHeaderTagsPart | undefined;
      /** Absent when no link is valid, so an empty list is never rendered. */
      links: DetailHeaderLinksPart | undefined;
    };

const headingRanks: readonly SectionHeaderLevel[] = [1, 2, 3, 4, 5, 6];

// Keys the contract owns: the root has no role or name (the heading names the content) and no inline appearance, and the
// content comes from props only. They are removed at untyped and JavaScript boundaries too. `ref` is dropped as well
// because React 19 hands it to a function component as an ordinary prop, which would otherwise reach the root there
// and not under React 18; the component has no public ref.
type ProtectedProps = {
  children?: unknown;
  role?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  dangerouslySetInnerHTML?: unknown;
  style?: unknown;
  ref?: unknown;
};

// Development-only, like SocialLinks and Breadcrumb. The warnings fire during render, so StrictMode can repeat them.
function warn(message: string): void {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn(message);
  }
}

const isNonBlank = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

/** An absent value takes its default silently; a supplied one that is not a readable string warns and falls back. */
function textOrDefault(value: unknown, fallback: string, prop: string): string {
  if (value === undefined) {
    return fallback;
  }
  if (isNonBlank(value)) {
    return value;
  }
  warn(`DetailHeader: ${prop} must not be blank; using its default.`);
  return fallback;
}

/** Keep the entries that have a readable label and value, keyed by their original position. */
function metadataEntries(metadata: unknown): DetailHeaderMetadataEntry[] {
  const entries: DetailHeaderMetadataEntry[] = [];
  if (!Array.isArray(metadata)) {
    return entries;
  }
  for (const [position, item] of metadata.entries()) {
    const entry: Partial<Record<keyof DetailHeaderMetadataItem, unknown>> =
      typeof item === 'object' && item !== null ? item : {};
    if (!isNonBlank(entry.label) || !isNonBlank(entry.value)) {
      warn('DetailHeader: skipping an invalid metadata entry.');
      continue;
    }
    entries.push({
      key: `${position}:${entry.label}`,
      label: entry.label,
      value: entry.value,
      dateTime: isNonBlank(entry.dateTime) ? entry.dateTime : undefined
    });
  }
  return entries;
}

/** Keep the tags that have readable text, keyed by their original position so duplicates both render. */
function tagEntries(tags: unknown): DetailHeaderTagEntry[] {
  const entries: DetailHeaderTagEntry[] = [];
  if (!Array.isArray(tags)) {
    return entries;
  }
  for (const [position, tag] of tags.entries()) {
    if (!isNonBlank(tag)) {
      warn('DetailHeader: skipping a blank tag.');
      continue;
    }
    entries.push({ key: `${position}:${tag}`, label: tag });
  }
  return entries;
}

/** Keep the links that have a readable label and a safe destination, trimmed as SocialLinks trims it. */
function linkEntries(links: unknown): DetailHeaderLinkEntry[] {
  const entries: DetailHeaderLinkEntry[] = [];
  if (!Array.isArray(links)) {
    return entries;
  }
  for (const [position, item] of links.entries()) {
    const entry: Partial<Record<keyof DetailHeaderLink, unknown>> =
      typeof item === 'object' && item !== null ? item : {};
    // SocialLinks' own destination rule, reused rather than copied: an absolute https URL with a host, without
    // credentials or raw control characters. Anything else (relative, http, script) is dropped, never rendered.
    const href = typeof entry.href === 'string' ? destination(entry.href) : undefined;
    if (!isNonBlank(entry.label) || href === undefined) {
      warn('DetailHeader: skipping an invalid link entry.');
      continue;
    }
    entries.push({ key: `${position}:${entry.label}`, label: entry.label, href });
  }
  return entries;
}

/** Resolve the heading block, the root props and the validated lists. */
export function useDetailHeader(props: DetailHeaderProps): UseDetailHeaderResult {
  const {
    title,
    eyebrow,
    lede,
    level = 1,
    metadata,
    tags,
    links,
    newTabText = '(opens in a new tab)',
    messages,
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    dangerouslySetInnerHTML: _html,
    style: _style,
    ref: _ref,
    ...rest
  } = props as DetailHeaderProps & ProtectedProps;
  // SectionHeader's own readable-text rule, reused rather than copied. An unreadable title gates everything else, so
  // no list is evaluated and exactly one warning is reported.
  if (normalizeText(title) === undefined) {
    warn('DetailHeader requires a non-blank title; nothing was rendered.');
    return { renderRoot: false };
  }
  // A value outside 1 to 6 (an untyped caller) resolves to 1, so no invalid heading element is ever rendered.
  const rank = headingRanks.find((candidate) => candidate === level) ?? 1;
  const facts = metadataEntries(metadata);
  const labels = tagEntries(tags);
  const destinations = linkEntries(links);
  const notice = textOrDefault(newTabText, '(opens in a new tab)', 'newTabText');
  // A messages value that is not an object (an untyped caller) is treated as absent.
  const names: Partial<Record<keyof DetailHeaderMessages, unknown>> =
    typeof messages === 'object' && messages !== null ? messages : {};
  const tagsName = textOrDefault(names.tags, 'Tags', 'messages.tags');
  const linksName = textOrDefault(names.links, 'Links', 'messages.links');
  return {
    renderRoot: true,
    rootProps: { ...rest, className: cn(detailHeaderVariants(), className) },
    headingProps: { title, eyebrow, lede, level: rank },
    metadata:
      facts.length > 0
        ? {
            listProps: { className: cn(detailHeaderMetaVariants()) },
            entryClassName: cn(detailHeaderMetaEntryVariants()),
            termClassName: cn(detailHeaderTermVariants()),
            valueClassName: cn(detailHeaderValueVariants()),
            entries: facts
          }
        : undefined,
    tags:
      labels.length > 0
        ? {
            listProps: { role: 'list', 'aria-label': tagsName, className: cn(detailHeaderTagsVariants()) },
            entries: labels
          }
        : undefined,
    links:
      destinations.length > 0
        ? {
            listProps: { role: 'list', 'aria-label': linksName, className: cn(detailHeaderLinksVariants()) },
            itemClassName: cn(detailHeaderLinkItemVariants()),
            newTabText: notice,
            entries: destinations
          }
        : undefined
  };
}
