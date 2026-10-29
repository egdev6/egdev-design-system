import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import { Kbd } from '../../atoms/kbd';
import type { MenuProps } from './types';
import type { UseMenuResult } from './useMenu';
import { useMenu } from './useMenu';

/** Shared entry content: decorative glyph, visible name and optional display-only shortcut. */
const EntryContent = ({
  entry,
  menu
}: {
  entry: Extract<UseMenuResult['entries'][number], { kind: 'item' | 'link' | 'submenu' }>;
  menu: UseMenuResult;
}) => (
  <>
    {entry.iconProps && <Icon {...entry.iconProps} />}
    <span>{entry.label}</span>
    {entry.shortcut !== undefined && (
      <span className={menu.shortcutClassName}>
        <Kbd>{entry.shortcut}</Kbd>
      </span>
    )}
  </>
);

/** Render the hook-normalized schema without forwarding entry data to DOM or Radix props. */
const Entries = ({ entries, menu }: { entries: UseMenuResult['entries']; menu: UseMenuResult }) => (
  <>
    {entries.map((entry) =>
      entry.kind === 'separator' ? (
        <DropdownMenuPrimitive.Separator key={entry.id} className={entry.className} />
      ) : entry.kind === 'label' ? (
        <DropdownMenuPrimitive.Label key={entry.id} className={entry.className}>
          {entry.label}
        </DropdownMenuPrimitive.Label>
      ) : entry.kind === 'submenu' ? (
        <DropdownMenuPrimitive.Sub key={entry.id}>
          <DropdownMenuPrimitive.SubTrigger {...entry.triggerProps}>
            <EntryContent entry={entry} menu={menu} />
            <Icon name='chevron-down' className={menu.chevronClassName} />
          </DropdownMenuPrimitive.SubTrigger>
          <DropdownMenuPrimitive.Portal>
            <DropdownMenuPrimitive.SubContent {...menu.subContentProps}>
              <Entries entries={entry.entries} menu={menu} />
            </DropdownMenuPrimitive.SubContent>
          </DropdownMenuPrimitive.Portal>
        </DropdownMenuPrimitive.Sub>
      ) : entry.kind === 'link' ? (
        <DropdownMenuPrimitive.Item key={entry.id} {...entry.itemProps} asChild={true}>
          <a {...entry.anchorProps}>
            <EntryContent entry={entry} menu={menu} />
          </a>
        </DropdownMenuPrimitive.Item>
      ) : (
        <DropdownMenuPrimitive.Item key={entry.id} {...entry.itemProps}>
          <EntryContent entry={entry} menu={menu} />
        </DropdownMenuPrimitive.Item>
      )
    )}
  </>
);

/** Data-driven dropdown action menu with Radix-owned state, keyboard, focus, ARIA and portals. */
export const Menu: FC<MenuProps> = (props) => {
  const menu = useMenu(props);
  return (
    <DropdownMenuPrimitive.Root {...menu.rootProps}>
      <DropdownMenuPrimitive.Trigger asChild={true}>{menu.trigger}</DropdownMenuPrimitive.Trigger>
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content {...menu.contentProps}>
          {menu.header !== undefined && (
            <DropdownMenuPrimitive.Label className={menu.headerClassName}>{menu.header}</DropdownMenuPrimitive.Label>
          )}
          <Entries entries={menu.entries} menu={menu} />
        </DropdownMenuPrimitive.Content>
      </DropdownMenuPrimitive.Portal>
    </DropdownMenuPrimitive.Root>
  );
};
