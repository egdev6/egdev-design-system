import { Children } from 'react';
import { cn } from '../../lib/cn';
import { surfaceVariants } from '../../primitives/surface/types';
import {
  type LiveBandFieldProps,
  type LiveBandRowsProps,
  type LiveBandStreamsProps,
  type LiveBandVodProps,
  liveBandFieldVariants,
  liveBandListVariants,
  liveBandRowsVariants,
  liveBandRowVariants,
  liveBandStreamsVariants,
  liveBandVodVariants
} from './types';

/** Strip semantic overrides and handlers even from untyped consumers. */
function passive<T extends object>(native: T): T {
  return Object.fromEntries(
    Object.entries(native).filter(
      ([key]) =>
        !/^on[A-Z]/.test(key) &&
        ![
          'role',
          'style',
          'dangerouslySetInnerHTML',
          'tabIndex',
          'contentEditable',
          'accessKey',
          'aria-hidden',
          'aria-live',
          'aria-pressed',
          'aria-selected',
          'aria-disabled',
          'ref'
        ].includes(key)
    )
  ) as T;
}
export function useLiveBandField({ children, className, ...native }: LiveBandFieldProps) {
  return { children, rootProps: { ...passive(native), className: cn(liveBandFieldVariants(), className) } };
}
export function useLiveBandStreams({ children, className, ...native }: LiveBandStreamsProps) {
  return { children, rootProps: { ...passive(native), className: cn(liveBandStreamsVariants(), className) } };
}
export function useLiveBandVod({ children, href, ...native }: LiveBandVodProps) {
  const { className: _className, ...rest } = passive(native) as typeof native & { className?: string };
  return {
    children,
    rootProps: { ...rest, href, className: cn(surfaceVariants({ padding: 'none' }), liveBandVodVariants()) }
  };
}
export function useLiveBandRows({ children, className, ...native }: LiveBandRowsProps) {
  return {
    children,
    hasRows: Children.toArray(children).length > 0,
    rootProps: { ...passive(native), className: cn(liveBandRowsVariants(), className) }
  };
}
export function useLiveBandParts() {
  return { listClassName: cn(liveBandListVariants()), rowClassName: cn(liveBandRowVariants()) };
}
