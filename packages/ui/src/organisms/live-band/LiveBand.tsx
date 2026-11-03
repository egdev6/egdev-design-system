import type { FC } from 'react';
import type {
  LiveBandFieldProps,
  LiveBandListProps,
  LiveBandRowProps,
  LiveBandRowsProps,
  LiveBandStreamsProps,
  LiveBandVodProps
} from './types';
import { useLiveBandField, useLiveBandParts, useLiveBandRows, useLiveBandStreams, useLiveBandVod } from './useLiveBand';
/** Unpainted field for host-supplied event content. */
export const LiveBandField: FC<LiveBandFieldProps> = (props) => {
  const { children, rootProps } = useLiveBandField(props);
  return <div {...rootProps}>{children}</div>;
};
/** Independent recording and archive grid. */
export const LiveBandStreams: FC<LiveBandStreamsProps> = (props) => {
  const { children, rootProps } = useLiveBandStreams(props);
  return <div {...rootProps}>{children}</div>;
};
/** Single whole-card recording link. */
export const LiveBandVod: FC<LiveBandVodProps> = (props) => {
  const { children, rootProps } = useLiveBandVod(props);
  return <a {...rootProps}>{children}</a>;
};
/** Passive column preserving consumer order. */
export const LiveBandList: FC<LiveBandListProps> = ({ children }) => {
  const { listClassName } = useLiveBandParts();
  return <div className={listClassName}>{children}</div>;
};
/** Semantic list omitted when empty. */
export const LiveBandRows: FC<LiveBandRowsProps> = (props) => {
  const { children, hasRows, rootProps } = useLiveBandRows(props);
  return hasRows ? <ul {...rootProps}>{children}</ul> : null;
};
/** One semantic recording row. */
export const LiveBandRow: FC<LiveBandRowProps> = ({ children }) => {
  const { rowClassName } = useLiveBandParts();
  return <li className={rowClassName}>{children}</li>;
};
