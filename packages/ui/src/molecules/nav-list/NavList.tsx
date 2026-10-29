import * as CollapsiblePrimitive from '@radix-ui/react-collapsible';
import type { FC } from 'react';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import { StatusDot } from '../../atoms/status-dot';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { NavListProps } from './types';
import type { UseNavListResult } from './useNavList';
import { useNavList } from './useNavList';

type LinkModel = Extract<UseNavListResult['entries'][number], { kind: 'link' }>;
type GroupModel = Exclude<UseNavListResult['entries'][number], LinkModel>;

const LinkRow = ({ item, view }: { item: LinkModel; view: UseNavListResult }) => (
  <li>
    <a {...item.anchorProps}>
      {item.icon && <Icon name={item.icon} className={view.iconClassName} />}
      <span className={view.labelClassName}>{item.label}</span>
      <span className={view.metadataClassName}>
        {item.tag && <Badge tone={item.tag.tone}>{item.tag.children}</Badge>}
        {item.count !== undefined && <span className={view.countClassName}>{item.count}</span>}
        {item.warning && (
          <>
            <Icon name='alert' className={view.warningClassName} />
            <VisuallyHidden>{item.warning}</VisuallyHidden>
          </>
        )}
      </span>
    </a>
  </li>
);

const GroupLabel = ({ item, view }: { item: GroupModel; view: UseNavListResult }) => (
  <>
    <span className={view.labelClassName}>{item.label}</span>
    <span className={view.metadataClassName}>
      {item.signal && (
        <>
          <StatusDot state={item.signal.state} />
          <VisuallyHidden>{item.signal.text}</VisuallyHidden>
        </>
      )}
      {item.count !== undefined && <span className={view.countClassName}>{item.count}</span>}
    </span>
  </>
);

/** In-flow native destinations with independent Radix disclosures; the application owns routing. */
export const NavList: FC<NavListProps> = (props) => {
  const view = useNavList(props);
  return (
    <nav {...view.rootProps}>
      <ul className={view.listClassName}>
        {view.entries.map((item) =>
          item.kind === 'link' ? (
            <LinkRow key={item.id} item={item} view={view} />
          ) : item.kind === 'group' ? (
            <li key={item.id}>
              <div id={item.captionId} className={view.captionClassName}>
                <GroupLabel item={item} view={view} />
              </div>
              <ul className={view.listClassName} aria-labelledby={item.captionId}>
                {item.items.map((child) => (
                  <LinkRow key={child.id} item={child} view={view} />
                ))}
              </ul>
            </li>
          ) : (
            <CollapsiblePrimitive.Root key={item.id} {...item.disclosureProps} asChild={true}>
              <li>
                <CollapsiblePrimitive.Trigger className={view.triggerClassName}>
                  <Icon name='chevron-down' className={view.chevronClassName} />
                  <GroupLabel item={item} view={view} />
                </CollapsiblePrimitive.Trigger>
                <CollapsiblePrimitive.Content>
                  <ul className={view.listClassName}>
                    {item.items.map((child) => (
                      <LinkRow key={child.id} item={child} view={view} />
                    ))}
                  </ul>
                </CollapsiblePrimitive.Content>
              </li>
            </CollapsiblePrimitive.Root>
          )
        )}
      </ul>
    </nav>
  );
};
