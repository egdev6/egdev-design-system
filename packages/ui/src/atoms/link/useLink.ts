import * as SlotPrimitive from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/cn';
import { type LinkProps, linkArrowVariants, linkVariants } from './types';

type LinkResult = {
  root: 'a' | typeof SlotPrimitive.Root;
  rootProps: ComponentPropsWithoutRef<'a'>;
  children: ReactNode;
  external: boolean;
  arrowName: 'arrow-right' | 'arrow-up-right';
  showArrow: boolean;
  newTabText: string;
  arrowClassName: string;
};

/** Derive native/Slot composition and the external-navigation safety contract. */
export function useLink({
  asChild = false,
  href,
  children,
  external = false,
  newTabText = '(opens in a new tab)',
  arrow = true,
  target,
  rel,
  className,
  ...rest
}: LinkProps): LinkResult {
  const child = asChild && isValidElement<ComponentPropsWithoutRef<'a'>>(children) ? children : undefined;
  const safeRel = external
    ? [
        ...new Set(
          [rel, child?.props.rel, 'noopener noreferrer'].filter(Boolean).join(' ').split(/\s+/).filter(Boolean)
        )
      ].join(' ')
    : rel;
  // Slot normally lets child props win. Normalize only the contract-owned external attributes
  // on the child too, so a router anchor cannot accidentally undo new-tab safety.
  const content = external && child ? cloneElement(child, { target: '_blank', rel: safeRel }) : children;

  return {
    root: asChild ? SlotPrimitive.Root : 'a',
    rootProps: {
      ...rest,
      href: asChild ? undefined : href,
      target: external ? '_blank' : target,
      rel: safeRel,
      className: cn(linkVariants(), className)
    },
    children: content,
    external,
    arrowName: external ? 'arrow-up-right' : 'arrow-right',
    showArrow: arrow,
    newTabText,
    arrowClassName: cn(linkArrowVariants())
  };
}
