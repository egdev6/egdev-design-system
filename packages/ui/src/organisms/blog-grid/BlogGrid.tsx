import type { FC } from 'react';
import type {
  BlogGridArchiveProps,
  BlogGridFeatureProps,
  BlogGridProps,
  BlogGridRowProps,
  BlogGridRowsProps
} from './types';
import { useBlogGrid, useBlogGridParts } from './useBlogGrid';

/** Passive feature and editorial list layout; the host owns its section heading. */
export const BlogGrid: FC<BlogGridProps> = (props) => {
  const { children, rootProps } = useBlogGrid(props);
  return <div {...rootProps}>{children}</div>;
};

/** Wrap one ArticleFeature whole-card link. */
export const BlogGridFeature: FC<BlogGridFeatureProps> = ({ children }) => {
  const { featureClassName } = useBlogGridParts({ children });
  return <div className={featureClassName}>{children}</div>;
};

/** Render a semantic list only when rows are present. */
export const BlogGridRows: FC<BlogGridRowsProps> = ({ children }) => {
  const { hasRows, rowsClassName } = useBlogGridParts({ children });
  return hasRows ? <ul className={rowsClassName}>{children}</ul> : null;
};

/** Wrap one editorial anchor in a native list item. */
export const BlogGridRow: FC<BlogGridRowProps> = ({ children }) => {
  const { rowClassName } = useBlogGridParts({ children });
  return <li className={rowClassName}>{children}</li>;
};

/** Wrap the independent archive link. */
export const BlogGridArchive: FC<BlogGridArchiveProps> = ({ children }) => {
  const { archiveClassName } = useBlogGridParts({ children });
  return <div className={archiveClassName}>{children}</div>;
};
