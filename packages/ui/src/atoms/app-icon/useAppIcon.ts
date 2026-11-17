import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import { type AppIconProps, appIconFallbackVariants, appIconImageVariants, appIconVariants } from './types';

type AppIconResult = {
  rootProps: ComponentPropsWithoutRef<'span'>;
  src: string | undefined;
  imageClassName: string;
  fallbackClassName: string;
};

/** Derive passive naming and classes; Radix manages image loading and fallback. */
export function useAppIcon(props: AppIconProps): AppIconResult {
  // Untyped callers must not override the owned host, semantics or passive behavior.
  const {
    monogram: _monogram,
    src,
    label,
    size = 'md',
    className,
    children: _children,
    role: _role,
    'aria-label': _ariaLabel,
    'aria-labelledby': _ariaLabelledBy,
    'aria-hidden': _ariaHidden,
    tabIndex: _tabIndex,
    style: _style,
    dangerouslySetInnerHTML: _html,
    contentEditable: _contentEditable,
    onClick: _onClick,
    onKeyDown: _onKeyDown,
    ref: _ref,
    asChild: _asChild,
    alt: _alt,
    ...rest
  } = props as AppIconProps & ComponentPropsWithoutRef<'span'> & { ref?: unknown; asChild?: unknown; alt?: unknown };
  const name = label?.trim() ? label : undefined;
  return {
    rootProps: {
      ...rest,
      role: name ? 'img' : undefined,
      'aria-label': name,
      'aria-labelledby': undefined,
      'aria-hidden': name ? undefined : true,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 0, radius: 'md', padding: 'none' }),
        appIconVariants({ size }),
        className
      )
    },
    src: src?.trim() ? src : undefined,
    imageClassName: cn(appIconImageVariants()),
    fallbackClassName: cn(appIconFallbackVariants({ size }))
  };
}
