import type { ComponentPropsWithoutRef } from 'react';
import { useId } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { NavListEntry, NavListLink, NavListProps, NavListSignal, NavListTag } from './types';
import {
  navListCaptionVariants,
  navListChevronVariants,
  navListCountVariants,
  navListIconVariants,
  navListLabelVariants,
  navListLinkVariants,
  navListListVariants,
  navListMetadataVariants,
  navListTriggerVariants,
  navListVariants,
  navListWarningVariants
} from './types';

type LinkModel = {
  kind: 'link';
  id: string;
  label: string;
  icon: NavListLink['icon'];
  count: number | undefined;
  tag: NavListTag | undefined;
  warning: string | undefined;
  anchorProps: ComponentPropsWithoutRef<'a'>;
};

type GroupModel = {
  kind: 'group' | 'collapsible-group';
  id: string;
  label: string;
  count: number | undefined;
  signal: NavListSignal | undefined;
  captionId: string;
  items: LinkModel[];
  disclosureProps: { open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void };
};

export type UseNavListResult = {
  rootProps: ComponentPropsWithoutRef<'nav'>;
  entries: (LinkModel | GroupModel)[];
  listClassName: string;
  labelClassName: string;
  iconClassName: string;
  countClassName: string;
  metadataClassName: string;
  captionClassName: string;
  triggerClassName: string;
  chevronClassName: string;
  warningClassName: string;
};

const countText = (count: number | undefined) =>
  count !== undefined && Number.isFinite(count) && Number.isInteger(count) && count >= 0 ? count : undefined;

/** Normalize optional metadata, adapt navigation callbacks and compose existing Material/atom recipes. */
export function useNavList(props: NavListProps): UseNavListResult {
  const instanceId = useId();
  const {
    label,
    items,
    onNavigate,
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    dangerouslySetInnerHTML: _html,
    ...rest
  } = props as NavListProps & {
    children?: unknown;
    role?: unknown;
    'aria-label'?: unknown;
    'aria-labelledby'?: unknown;
  };

  const link = (item: NavListLink): LinkModel => ({
    kind: 'link',
    id: item.id,
    label: item.label,
    icon: item.icon,
    count: countText(item.count),
    tag: item.tag?.children.trim() ? item.tag : undefined,
    warning: item.warning?.trim() ? item.warning : undefined,
    anchorProps: {
      href: item.href,
      'aria-current': item['aria-current'],
      onClick: onNavigate ? (event) => onNavigate(item, event) : undefined,
      className: cn(
        item['aria-current'] === 'page' &&
          surfaceVariants({ tone: 'surface-3', elevation: 1, padding: 'none', radius: 'md' }),
        navListLinkVariants()
      )
    }
  });

  const entry = (item: NavListEntry, index: number): LinkModel | GroupModel => {
    if (item.kind !== 'group' && item.kind !== 'collapsible-group') {
      return link(item);
    }
    return {
      kind: item.kind,
      id: item.id,
      label: item.label,
      count: countText(item.count),
      signal: item.signal?.text.trim() ? item.signal : undefined,
      captionId: `${instanceId}-caption-${index}`,
      items: item.items.map(link),
      disclosureProps:
        item.kind === 'collapsible-group'
          ? { open: item.open, defaultOpen: item.defaultOpen, onOpenChange: item.onOpenChange }
          : {}
    };
  };

  return {
    rootProps: { ...rest, 'aria-label': label, className: cn(navListVariants(), className) },
    entries: items.map(entry),
    listClassName: cn(navListListVariants()),
    labelClassName: cn(navListLabelVariants()),
    iconClassName: cn(navListIconVariants()),
    countClassName: cn(navListCountVariants()),
    metadataClassName: cn(navListMetadataVariants()),
    captionClassName: cn(navListCaptionVariants()),
    triggerClassName: cn(navListTriggerVariants()),
    chevronClassName: cn(navListChevronVariants()),
    warningClassName: cn(navListWarningVariants())
  };
}
