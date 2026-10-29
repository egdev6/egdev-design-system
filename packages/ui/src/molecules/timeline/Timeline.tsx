import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import type { FC } from 'react';
import { Avatar } from '../../atoms/avatar';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { TimelineProps } from './types';
import { useTimeline } from './useTimeline';

/** Read-only chronological events or chat, with Radix-owned native scrolling. */
export const Timeline: FC<TimelineProps> = (props) => {
  const timeline = useTimeline(props);
  return (
    <ScrollAreaPrimitive.Root {...timeline.rootProps}>
      <ScrollAreaPrimitive.Viewport {...timeline.viewportProps}>
        {timeline.rows.length > 0 ? (
          <ol {...timeline.listProps}>
            {timeline.rows.map((row) => (
              <li key={row.key} {...row.rowProps}>
                <time {...row.timeProps}>{row.timeText}</time>
                {row.kind === 'events' ? (
                  <>
                    <span {...row.categoryProps}>
                      {row.showIcon && <span {...timeline.iconWrapperProps}>{row.icon}</span>}
                      {row.category}
                    </span>
                    <div {...row.bodyProps}>{row.body}</div>
                  </>
                ) : (
                  <>
                    <span {...row.platformProps}>
                      <Icon {...row.platformIconProps} />
                      <VisuallyHidden>{row.platformName}</VisuallyHidden>
                    </span>
                    <div {...row.bodyProps}>
                      <span {...timeline.identityProps}>
                        {row.avatarProps && <Avatar {...row.avatarProps} />}
                        <strong {...row.authorProps}>{row.authorName}</strong>
                        {row.moderatorProps && <Badge {...row.moderatorProps} />}
                        {row.commandProps && <Badge {...row.commandProps} />}
                      </span>
                      <span {...row.messageProps}>{row.message}</span>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        ) : (
          <p {...timeline.emptyProps}>{timeline.emptyText}</p>
        )}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar {...timeline.scrollbarProps}>
        <ScrollAreaPrimitive.Thumb {...timeline.thumbProps} />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
};
