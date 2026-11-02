import * as SlotPrimitive from '@radix-ui/react-slot';
import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cloneElement, isValidElement } from 'react';
import { cn } from '@/lib/cn';
import { type LinkProps, type LinkVariant, linkArrowVariants, linkVariants } from './types';

type LinkResult = {
  root: 'a' | typeof SlotPrimitive.Root;
  rootProps: ComponentPropsWithoutRef<'a'>;
  children: ReactNode;
  external: boolean;
  arrowName: 'arrow-right';
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
  variant = 'plain',
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
  // A cast-invalid runtime value must not reach CVA: with no variant classes the legacy .eg-link
  // border would paint, so outside the union resolves to the plain default instead.
  const resolvedVariant: LinkVariant = variant === 'underlined' ? 'underlined' : 'plain';

  return {
    root: asChild ? SlotPrimitive.Root : 'a',
    rootProps: {
      ...rest,
      href: asChild ? undefined : href,
      target: external ? '_blank' : target,
      rel: safeRel,
      className: cn(linkVariants({ variant: resolvedVariant }), className)
    },
    children: content,
    external,
    arrowName: 'arrow-right',
    showArrow: arrow,
    newTabText,
    arrowClassName: cn(linkArrowVariants())
  };
}
