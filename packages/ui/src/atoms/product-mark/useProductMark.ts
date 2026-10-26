import { cn } from '@/lib/cn';
import type { ProductMarkImageProps, ProductMarkLinkProps, ProductMarkProps } from './types';
import { productMarkVariants } from './types';

type OwnKeys = 'monogram' | 'label';

export type UseProductMarkResult =
  | {
      link: true;
      monogram: string;
      linkProps: Omit<ProductMarkLinkProps, OwnKeys> & { 'aria-label': string; className: string };
    }
  | {
      link: false;
      monogram: string;
      imageProps: Omit<ProductMarkImageProps, OwnKeys | 'href'> & {
        role: 'img';
        'aria-label': string;
        className: string;
      };
    };

/** Resolve image versus link mode, name the root by label and compose its classes with layout className last. */
export function useProductMark(props: ProductMarkProps): UseProductMarkResult {
  if (props.href !== undefined) {
    const { monogram, label, className, ...rest } = props;
    return {
      link: true,
      monogram,
      linkProps: { ...rest, 'aria-label': label, className: cn(productMarkVariants({ link: true }), className) }
    };
  }
  // The union admits anchor-only attributes without href; the image keeps its own role and name.
  const {
    monogram,
    label,
    className,
    href: _href,
    'aria-hidden': _hidden,
    ...rest
  } = props as ProductMarkImageProps & {
    'aria-hidden'?: unknown;
  };
  return {
    link: false,
    monogram,
    imageProps: { ...rest, role: 'img', 'aria-label': label, className: cn(productMarkVariants(), className) }
  };
}
