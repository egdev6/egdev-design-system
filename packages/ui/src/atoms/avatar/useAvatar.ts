import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/cn';
import {
  type AvatarProps,
  avatarFallbackIconVariants,
  avatarFallbackVariants,
  avatarImageVariants,
  avatarVariants
} from './types';

type AvatarResult = {
  rootProps: ComponentPropsWithoutRef<'span'> & { 'data-state': 'active' | 'paused' };
  src: string | undefined;
  imageClassName: string;
  fallbackClassName: string;
  fallbackIconClassName: string;
};

/** Derive naming and appearance; Radix alone manages image loading and fallback swapping. */
export function useAvatar({ src, label, size = 'md', paused = false, className, ...rest }: AvatarProps): AvatarResult {
  return {
    rootProps: {
      ...rest,
      role: label ? 'img' : undefined,
      'aria-label': label || undefined,
      'aria-labelledby': undefined,
      'aria-hidden': label ? undefined : true,
      'data-state': paused ? 'paused' : 'active',
      className: cn(avatarVariants({ size }), className)
    },
    src,
    imageClassName: cn(avatarImageVariants()),
    fallbackClassName: cn(avatarFallbackVariants()),
    fallbackIconClassName: cn(avatarFallbackIconVariants({ size }))
  };
}
