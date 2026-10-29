import type * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { ComponentPropsWithoutRef, MouseEvent } from 'react';
import type { IconProps } from '../../atoms/icon';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import type { MenuEntry, MenuProps } from './types';
import {
  menuChevronVariants,
  menuHeaderVariants,
  menuIconVariants,
  menuItemVariants,
  menuLabelVariants,
  menuSeparatorVariants,
  menuShortcutVariants,
  menuVariants
} from './types';

type ItemProps = ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item>;
type EntryContent = { label: string; iconProps?: IconProps; shortcut?: string };
type PreparedEntry =
  | { kind: 'separator'; id: string; className: string }
  | { kind: 'label'; id: string; className: string; label: string }
  | (EntryContent & { kind: 'item'; id: string; itemProps: ItemProps })
  | (EntryContent & {
      kind: 'link';
      id: string;
      itemProps: ItemProps;
      anchorProps: ComponentPropsWithoutRef<'a'>;
    })
  | (EntryContent & {
      kind: 'submenu';
      id: string;
      triggerProps: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger>;
      entries: PreparedEntry[];
    });

export type UseMenuResult = {
  rootProps: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>;
  trigger: MenuProps['children'];
  header: MenuProps['header'];
  entries: PreparedEntry[];
  contentProps: {
    side: NonNullable<MenuProps['side']>;
    align: NonNullable<MenuProps['align']>;
    sideOffset: number;
    loop: true;
    className: string;
  };
  subContentProps: { sideOffset: number; alignOffset: number; loop: true; className: string };
  headerClassName: string;
  shortcutClassName: string;
  chevronClassName: string;
};

/** Resolve entry kinds, link interception and shared Material composition; Radix owns all interaction state. */
export function useMenu(props: MenuProps): UseMenuResult {
  const {
    children,
    items,
    header,
    side = 'bottom',
    align = 'start',
    open,
    defaultOpen = false,
    onOpenChange,
    onNavigate,
    className
  } = props;
  const panelClassName = cn(
    surfaceVariants({ tone: 'overlay', padding: 'none', radius: 'xl' }),
    menuVariants(),
    className
  );
  const prepare = (entry: MenuEntry): PreparedEntry => {
    if (entry.kind === 'separator') {
      return { kind: 'separator', id: entry.id, className: cn(menuSeparatorVariants()) };
    }
    if (entry.kind === 'label') {
      return { kind: 'label', id: entry.id, label: entry.label, className: cn(menuLabelVariants()) };
    }
    const tone = entry.kind === 'submenu' ? 'default' : entry.tone;
    const content: EntryContent = {
      label: entry.label,
      iconProps: entry.icon ? { name: entry.icon, className: cn(menuIconVariants({ tone })) } : undefined
    };
    const itemProps = {
      disabled: entry.disabled,
      className: cn(menuItemVariants({ tone, submenu: entry.kind === 'submenu' }))
    };
    if (entry.kind === 'submenu') {
      return { ...content, kind: 'submenu', id: entry.id, triggerProps: itemProps, entries: entry.items.map(prepare) };
    }
    if (entry.kind === 'link') {
      // Radix dispatches its cancellable selection synchronously from the original click.
      // Invoke navigation there so preventing the anchor's default does not cancel menu selection.
      let clickEvent: MouseEvent<HTMLAnchorElement> | undefined;
      return {
        ...content,
        kind: 'link',
        id: entry.id,
        anchorProps: {
          href: entry.disabled ? undefined : entry.href,
          onClick: (event) => {
            if (entry.disabled) {
              event.preventDefault();
              return;
            }
            clickEvent = event;
          }
        },
        itemProps: {
          ...itemProps,
          onSelect: () => {
            if (clickEvent) {
              onNavigate?.(entry, clickEvent);
              clickEvent = undefined;
            }
          }
        }
      };
    }
    return {
      ...content,
      kind: 'item',
      id: entry.id,
      shortcut: entry.shortcut,
      itemProps: { ...itemProps, onSelect: entry.onSelect }
    };
  };
  return {
    rootProps: { open, defaultOpen, onOpenChange, modal: true },
    trigger: children,
    header,
    entries: items.map(prepare),
    // Geometry constants map to --space-2, --space-1 and negative --space-2 respectively.
    contentProps: { side, align, sideOffset: 8, loop: true, className: panelClassName },
    subContentProps: { sideOffset: 4, alignOffset: -8, loop: true, className: panelClassName },
    headerClassName: cn(menuHeaderVariants()),
    shortcutClassName: cn(menuShortcutVariants()),
    chevronClassName: cn(menuChevronVariants())
  };
}
