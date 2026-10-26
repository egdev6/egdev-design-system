import type { FC } from 'react';
import type { ProductMarkProps } from './types';
import { useProductMark } from './useProductMark';

/** Square product monogram tile with the product-mark Material; a native link when `href` is set. */
export const ProductMark: FC<ProductMarkProps> = (props) => {
  const mark = useProductMark(props);
  const monogram = <span aria-hidden='true'>{mark.monogram}</span>;
  return mark.link ? <a {...mark.linkProps}>{monogram}</a> : <span {...mark.imageProps}>{monogram}</span>;
};
