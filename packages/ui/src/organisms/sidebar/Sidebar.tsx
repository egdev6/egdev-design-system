import * as ScrollArea from '@radix-ui/react-scroll-area';
import type { FC } from 'react';
import type { SidebarProps } from './types';
import { useSidebar } from './useSidebar';

/** Host-sized passive panel; navigation and responsive behavior belong to its consumer. */
export const Sidebar: FC<SidebarProps> = (props) => {
  const s = useSidebar(props);
  return (
    <div {...s.rootProps}>
      {s.product && (
        <div className={s.headerClass}>
          {s.product.href ? (
            <a href={s.product.href} aria-label={s.product.name}>
              <span aria-hidden='true'>{s.product.node}</span>
            </a>
          ) : (
            <span aria-hidden='true'>{s.product.node}</span>
          )}
          <span className={s.nameClass} aria-hidden={s.product.href ? true : undefined}>
            {s.product.name}
          </span>
        </div>
      )}
      <ScrollArea.Root className={s.bodyClass} type='auto'>
        <ScrollArea.Viewport className={s.viewportClass}>
          <div className={s.contentClass}>{s.children}</div>
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar className={s.scrollbarClass} orientation='vertical'>
          <ScrollArea.Thumb className={s.thumbClass} />
        </ScrollArea.Scrollbar>
      </ScrollArea.Root>
      {s.footer != null && <div className={s.footerClass}>{s.footer}</div>}
    </div>
  );
};
