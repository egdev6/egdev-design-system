import { Children } from 'react';
import { cn } from '../../lib/cn';
import {
  type BlogGridProps,
  type BlogGridRowsProps,
  blogGridArchiveVariants,
  blogGridFeatureVariants,
  blogGridRowsVariants,
  blogGridRowVariants,
  blogGridVariants
} from './types';

/** Derive the passive root and preserve compatible native attributes. */
export function useBlogGrid({ children, className, ...native }: BlogGridProps) {
  return { children, rootProps: { ...native, className: cn(blogGridVariants(), className) } };
}

/** Derive slot classes and omit ordinary empty collections. */
export function useBlogGridParts({ children }: BlogGridRowsProps) {
  return {
    hasRows: Children.toArray(children).length > 0,
    featureClassName: cn(blogGridFeatureVariants()),
    rowsClassName: cn(blogGridRowsVariants()),
    rowClassName: cn(blogGridRowVariants()),
    archiveClassName: cn(blogGridArchiveVariants())
  };
}
