import { cn } from '@/lib/cn';
import { surfaceVariants } from '../../primitives/surface';
import {
  type SidebarProps,
  sidebarBodyVariants,
  sidebarContentVariants,
  sidebarFooterVariants,
  sidebarHeaderVariants,
  sidebarNameVariants,
  sidebarScrollbarVariants,
  sidebarThumbVariants,
  sidebarVariants,
  sidebarViewportVariants
} from './types';

/** Resolve the passive slots and static material recipes; navigation remains consumer-owned. */
export function useSidebar({ product, children, footer, className, ...native }: SidebarProps) {
  const validProduct = product && typeof product.name === 'string' && product.name.trim() ? product : undefined;
  if (product && !validProduct && (typeof process === 'undefined' || process.env.NODE_ENV !== 'production')) {
    console.warn('Sidebar: product name must not be blank.');
  }
  const {
    role: _role,
    dangerouslySetInnerHTML: _html,
    ...safeNative
  } = native as typeof native & {
    role?: unknown;
    dangerouslySetInnerHTML?: unknown;
  };
  const scrollDirection: 'ltr' | 'rtl' | undefined =
    safeNative.dir === 'rtl' ? 'rtl' : safeNative.dir === 'ltr' ? 'ltr' : undefined;
  return {
    product: validProduct,
    scrollDirection,
    children,
    footer,
    rootProps: {
      ...safeNative,
      className: cn(
        surfaceVariants({ tone: 'surface-1', elevation: 0, padding: 'none', radius: 'none' }),
        sidebarVariants(),
        className
      )
    },
    headerClass: cn(sidebarHeaderVariants()),
    nameClass: cn(sidebarNameVariants()),
    bodyClass: cn(sidebarBodyVariants()),
    viewportClass: cn(sidebarViewportVariants()),
    contentClass: cn(sidebarContentVariants({ header: !!validProduct })),
    scrollbarClass: cn(sidebarScrollbarVariants()),
    thumbClass: cn(sidebarThumbVariants()),
    footerClass: cn(
      surfaceVariants({ tone: 'surface-0', elevation: 0, padding: 'none', radius: 'none' }),
      sidebarFooterVariants()
    )
  };
}
