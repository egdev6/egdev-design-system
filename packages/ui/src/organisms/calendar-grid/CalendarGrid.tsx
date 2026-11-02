import type { FC } from 'react';
import { Icon } from '../../atoms/icon';
import { IconButton } from '../../atoms/icon-button';
import {
  ListItem,
  ListItemActions,
  ListItemBody,
  ListItemContent,
  ListItemFooter,
  ListItemMeta
} from '../../molecules/list-item';
import { Menu } from '../../molecules/menu';
import { VisuallyHidden } from '../../primitives/visually-hidden';
import type { CalendarGridProps } from './types';
import { useCalendarGrid } from './useCalendarGrid';

/**
 * Named planning region of ordered days. It renders consumer data and emits add, move and
 * navigation requests; scheduling rules, dates, locale and persistence stay with the consumer.
 */
export const CalendarGrid: FC<CalendarGridProps> = (props) => {
  const view = useCalendarGrid(props);
  const Heading = view.headingTag;
  const { onNavigate } = props;
  return (
    <section {...view.rootProps}>
      <ol className={view.listClassName}>
        {view.days.map(
          ({
            day,
            dayProps,
            headingClassName,
            headerRowClassName,
            weekdayClassName,
            todayClassName,
            dayNumberClassName,
            headingText,
            todayText,
            headingRef,
            noEntriesText,
            entries,
            add
          }) => (
            <li key={day.date} {...dayProps}>
              <Heading className={headingClassName} tabIndex={-1} ref={headingRef}>
                <VisuallyHidden>{headingText}</VisuallyHidden>
                <span aria-hidden='true' className={headerRowClassName}>
                  <span className={weekdayClassName}>{day.weekday}</span>
                  {day['aria-current'] === 'date' && <span className={todayClassName}>{todayText}</span>}
                  <span className={dayNumberClassName}>{day.dayNumber}</span>
                </span>
              </Heading>
              {entries.length > 0 ? (
                <ul className={view.entryListClassName}>
                  {entries.map(({ entry, status, linkClassName, metaClassName, showFooter, move }) => (
                    <ListItem key={entry.id} variant='compact' status={status} asChild={true}>
                      <li>
                        <ListItemBody>
                          <ListItemContent>
                            {entry.href === undefined ? (
                              entry.label
                            ) : (
                              <a
                                href={entry.href}
                                className={linkClassName}
                                onClick={onNavigate === undefined ? undefined : (event) => onNavigate(entry, event)}
                              >
                                {entry.label}
                              </a>
                            )}
                          </ListItemContent>
                        </ListItemBody>
                        {showFooter && (
                          <ListItemFooter>
                            {entry.meta !== undefined && (
                              <ListItemMeta className={metaClassName}>{entry.meta}</ListItemMeta>
                            )}
                            {move !== undefined && (
                              <ListItemActions>
                                <Menu header={move.header} items={move.items}>
                                  <IconButton
                                    ref={move.triggerRef}
                                    label={move.label}
                                    icon={<Icon name='calendar' />}
                                    size='sm'
                                    variant='ghost'
                                  />
                                </Menu>
                              </ListItemActions>
                            )}
                          </ListItemFooter>
                        )}
                      </li>
                    </ListItem>
                  ))}
                </ul>
              ) : (
                <VisuallyHidden>{noEntriesText}</VisuallyHidden>
              )}
              {add !== undefined && (
                <button type='button' className={add.className} onClick={add.onClick}>
                  <Icon name='plus' size='sm' />
                  <VisuallyHidden>{add.label}</VisuallyHidden>
                </button>
              )}
            </li>
          )
        )}
      </ol>
      <VisuallyHidden role='status' aria-live='polite'>
        {view.announcement}
      </VisuallyHidden>
    </section>
  );
};
