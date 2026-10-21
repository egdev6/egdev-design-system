import { cn } from '@/lib/cn';
import type { PortalProps } from './types';

/** Composes the public root marker and supported non-painting consumer layout. */
export function usePortal({ className, ...props }: PortalProps): PortalProps {
  return { ...props, className: cn('eg-portal', className) };
}
