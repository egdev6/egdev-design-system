import type { ComponentPropsWithoutRef } from 'react';
import type { IconButtonProps } from '../../atoms/icon-button';
import { cn } from '../../lib/cn';
import type { ClusterProps, StackProps } from '../../primitives/stack';
import { Cluster, Stack } from '../../primitives/stack';
import {
  type SocialLinksProps,
  socialLinksCaptionVariants,
  socialLinksItemVariants,
  socialLinksListVariants,
  socialLinksVariants
} from './types';

type OwnedProps = {
  children?: unknown;
  dangerouslySetInnerHTML?: unknown;
  role?: unknown;
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
};
type PreparedItem = {
  id: string;
  buttonProps: IconButtonProps;
  anchorProps: ComponentPropsWithoutRef<'a'>;
};
type SocialLinksResult = {
  layout: typeof Stack | typeof Cluster;
  layoutProps: StackProps | ClusterProps;
  rootProps: ComponentPropsWithoutRef<'div'>;
  listProps: ComponentPropsWithoutRef<'ul'>;
  gap: 1 | 2;
  caption: string | undefined;
  captionClassName: string;
  itemClassName: string;
  items: PreparedItem[];
};

function warn(message: string): void {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn(`SocialLinks: ${message}`);
  }
}

function nameOrDefault(value: string, fallback: string, prop: string): string {
  if (value.trim()) {
    return value;
  }
  warn(`${prop} must not be blank; using its default.`);
  return fallback;
}

function destination(href: string): string | undefined {
  // URL parsing normalizes away some raw controls; reject them before trimming/parsing.
  if (
    [...href].some((character) => {
      const code = character.charCodeAt(0);
      return code < 32 || (code >= 127 && code <= 159);
    })
  ) {
    return undefined;
  }
  const trimmed = href.trim();
  try {
    const url = new URL(trimmed);
    return url.protocol === 'https:' && url.hostname && !url.username && !url.password ? trimmed : undefined;
  } catch {
    return undefined;
  }
}

function secureRel(rel = ''): string {
  const tokens = new Map<string, string>();
  for (const token of [...rel.split(/\s+/), 'noopener', 'noreferrer']) {
    if (token && !tokens.has(token.toLowerCase())) {
      tokens.set(token.toLowerCase(), token);
    }
  }
  return [...tokens.values()].join(' ');
}

/** Validate data, derive complete accessible names and delegate all layout/control recipes. */
export function useSocialLinks(props: SocialLinksProps): SocialLinksResult {
  const {
    items,
    label = 'Social profiles',
    caption = 'Follow me',
    inline = false,
    variant = 'outline',
    size = 'lg',
    gap = 2,
    newTabText = '(opens in a new tab)',
    className,
    children: _children,
    dangerouslySetInnerHTML: _html,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    ...rest
  } = props as SocialLinksProps & OwnedProps;
  const listName = nameOrDefault(label, 'Social profiles', 'label');
  const notice = nameOrDefault(newTabText, '(opens in a new tab)', 'newTabText');
  const seen = new Set<string>();
  const valid: PreparedItem[] = [];
  for (const entry of items) {
    const duplicate = seen.has(entry.id);
    seen.add(entry.id); // Even an invalid first occurrence reserves its key.
    const href = destination(entry.href);
    if (!entry.id.trim() || !entry.label.trim() || duplicate || !href) {
      warn('Skipping an invalid or duplicate profile entry.');
      continue;
    }
    valid.push({
      id: entry.id,
      buttonProps: {
        asChild: true,
        variant,
        size,
        label: entry.external ? `${entry.label} ${notice}` : entry.label,
        icon: entry.icon
      },
      anchorProps: {
        href,
        target: entry.external ? '_blank' : undefined,
        rel: entry.external ? secureRel(entry.rel) : entry.rel
      }
    });
  }
  return {
    layout: inline ? Cluster : Stack,
    layoutProps: { asChild: true, gap: inline ? 4 : 3, ...(inline ? { alignItems: 'center' as const } : {}) },
    rootProps: { ...rest, className: cn(socialLinksVariants(), className) },
    listProps: { role: 'list', 'aria-label': listName, className: cn(socialLinksListVariants()) },
    gap,
    caption: caption?.trim() ? caption : undefined,
    captionClassName: cn(socialLinksCaptionVariants()),
    itemClassName: cn(socialLinksItemVariants()),
    items: valid
  };
}
