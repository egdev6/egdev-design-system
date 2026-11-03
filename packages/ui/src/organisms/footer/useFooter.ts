import {
  Children,
  type ComponentPropsWithoutRef,
  type FC,
  Fragment,
  isValidElement,
  type ReactNode,
  useId
} from 'react';
import { cn } from '../../lib/cn';
import {
  type FooterBrandProps,
  type FooterLegalProps,
  type FooterMottoProps,
  type FooterNavigationProps,
  type FooterProps,
  type FooterSocialProps,
  footerBrandVariants,
  footerGridVariants,
  footerHeadingVariants,
  footerLegalVariants,
  footerListVariants,
  footerMottoVariants,
  footerNavigationVariants,
  footerSocialVariants,
  footerVariants
} from './types';

type Parts = {
  motto: FC<FooterMottoProps>;
  brand: FC<FooterBrandProps>;
  navigation: FC<FooterNavigationProps>;
  social: FC<FooterSocialProps>;
  legal: FC<FooterLegalProps>;
};

function validItems(items: FooterNavigationProps['items']): FooterNavigationProps['items'] {
  return items.filter(
    (item) =>
      typeof item.href === 'string' &&
      item.href.length > 0 &&
      typeof item.label === 'string' &&
      item.label.trim().length > 0
  );
}

function collect(node: ReactNode, parts: Parts, stage: ReactNode[], grid: ReactNode[], legal: ReactNode[]): void {
  Children.forEach(node, (child) => {
    if (!isValidElement(child)) {
      return;
    }
    if (child.type === Fragment) {
      collect((child.props as { children?: ReactNode }).children, parts, stage, grid, legal);
    } else if (child.type === parts.motto) {
      stage.push(child);
    } else if (child.type === parts.legal) {
      legal.push(child);
    } else if (child.type === parts.navigation) {
      const props = child.props as FooterNavigationProps;
      if (typeof props.label === 'string' && props.label.trim() && validItems(props.items).length) {
        grid.push(child);
      }
    } else {
      grid.push(child);
    }
  });
}

/** Partition named parts while suppressing an empty grid and protecting native semantics. */
export function useFooter({ children, className, ...native }: FooterProps, parts: Parts) {
  const {
    role: _role,
    tabIndex: _tabIndex,
    style: _style,
    dangerouslySetInnerHTML: _html,
    ref: _ref,
    asChild: _asChild,
    ...rest
  } = native as typeof native & Record<string, unknown>;
  const stage: ReactNode[] = [];
  const grid: ReactNode[] = [];
  const legal: ReactNode[] = [];
  collect(children, parts, stage, grid, legal);
  return {
    rootProps: { ...rest, className: cn(footerVariants(), className) } as ComponentPropsWithoutRef<'footer'>,
    stage,
    grid,
    legal,
    gridClassName: cn(footerGridVariants())
  };
}

/** Compose stage attributes. */
export function useFooterMotto({ children, className, ...rest }: FooterMottoProps) {
  return { children, props: { ...rest, className: cn(footerMottoVariants(), className) } };
}
/** Compose brand attributes. */
export function useFooterBrand({ children, className, ...rest }: FooterBrandProps) {
  return { children, props: { ...rest, className: cn(footerBrandVariants(), className) } };
}
/** Validate the label and items, and associate the nav with a unique visible heading. */
export function useFooterNavigation({ label, level = 2, items, className, ...rest }: FooterNavigationProps) {
  const id = useId();
  const entries = validItems(items);
  const valid = typeof label === 'string' && label.trim().length > 0 && entries.length > 0;
  const heading = `h${level}` as const;
  const {
    role: _role,
    'aria-label': _label,
    'aria-labelledby': _labelledBy,
    ...native
  } = rest as typeof rest & Record<string, unknown>;
  return {
    valid,
    entries,
    label,
    heading,
    headingProps: { id, className: cn(footerHeadingVariants()) },
    listClassName: cn(footerListVariants()),
    props: {
      ...native,
      'aria-labelledby': id,
      className: cn(footerNavigationVariants(), className)
    } as ComponentPropsWithoutRef<'nav'>
  };
}
/** Compose social attributes. */
export function useFooterSocial({ children, className, ...rest }: FooterSocialProps) {
  return { children, props: { ...rest, className: cn(footerSocialVariants(), className) } };
}
/** Compose legal row attributes. */
export function useFooterLegal({ children, className, ...rest }: FooterLegalProps) {
  return { children, props: { ...rest, className: cn(footerLegalVariants(), className) } };
}
