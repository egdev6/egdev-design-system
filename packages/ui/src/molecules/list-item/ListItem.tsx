import type { FC } from 'react';
import type { ListItemPartProps, ListItemProps, ListItemTitleProps } from './types';
import { useListItem, useListItemPart, useListItemTitle } from './useListItem';

/** Generic content item; the host supplies visible status text and independent actions. */
export const ListItem: FC<ListItemProps> = (props) => {
  const { component: Component, rootProps, children } = useListItem(props);
  return <Component {...rootProps}>{children}</Component>;
};

/** Optional editorial leading zone: a dated time stamp, index or short label; no controls. */
export const ListItemLeading: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('leading', props);
  return <div {...partProps} />;
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

/** Editorial row title; level picks the native heading rank h2–h6 independently of typography. */
export const ListItemTitle: FC<ListItemTitleProps> = (props) => {
  const { component: Heading, titleProps } = useListItemTitle(props);
  return <Heading {...titleProps} />;
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

/** Optional editorial trailing zone: a decorative icon or readable text such as a duration. */
export const ListItemTrailing: FC<ListItemPartProps> = (props) => {
  const partProps = useListItemPart('trailing', props);
  return <div {...partProps} />;
};
