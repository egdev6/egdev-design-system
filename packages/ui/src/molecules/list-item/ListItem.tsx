import type { FC } from 'react';
import type { ListItemPartProps, ListItemProps } from './types';
import { useListItem, useListItemPart } from './useListItem';

/** Generic content item; the host supplies visible status text and independent actions. */
export const ListItem: FC<ListItemProps> = (props) => {
  const { component: Component, rootProps, children } = useListItem(props);
  return <Component {...rootProps}>{children}</Component>;
};

/** Leading content, optional host handle and passive media grouping. */
export const ListItemBody: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('body', props);
  return <div {...partProps} />;
};

/** Flexible readable content; never automatically clamped or hidden. */
export const ListItemContent: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('content', props);
  return <div {...partProps} />;
};

/** Passive square thumbnail well; consumers own image alt and poster content. */
export const ListItemMedia: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('media', props);
  return <div {...partProps} />;
};

/** Wrapping metadata/action band for card and compact compositions. */
export const ListItemFooter: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('footer', props);
  return <div {...partProps} />;
};

/** Non-interactive context and visible status text. */
export const ListItemMeta: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('meta', props);
  return <div {...partProps} />;
};

/** Independent trailing controls; no item-wide activation or primary navigation region. */
export const ListItemActions: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('actions', props);
  return <div {...partProps} />;
};
