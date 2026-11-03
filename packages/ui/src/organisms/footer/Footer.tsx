import type { FC } from 'react';
import { Link } from '../../atoms/link';
import type {
  FooterBrandProps,
  FooterLegalProps,
  FooterMottoProps,
  FooterNavigationProps,
  FooterProps,
  FooterSocialProps
} from './types';
import {
  useFooter,
  useFooterBrand,
  useFooterLegal,
  useFooterMotto,
  useFooterNavigation,
  useFooterSocial
} from './useFooter';

/** Passive site footer; the host owns its placement and background. */
export const Footer: FC<FooterProps> = (props) => {
  const { rootProps, stage, grid, legal, gridClassName } = useFooter(props, {
    motto: FooterMotto,
    brand: FooterBrand,
    navigation: FooterNavigation,
    social: FooterSocial,
    legal: FooterLegal
  });
  return (
    <footer {...rootProps}>
      {stage}
      {grid.length > 0 && <div className={gridClassName}>{grid}</div>}
      {legal}
    </footer>
  );
};
/** Non-interactive motto stage. */
export const FooterMotto: FC<FooterMottoProps> = (props) => {
  const { children, props: native } = useFooterMotto(props);
  return <div {...native}>{children}</div>;
};
/** Consumer-owned brand and optional tagline. */
export const FooterBrand: FC<FooterBrandProps> = (props) => {
  const { children, props: native } = useFooterBrand(props);
  return <div {...native}>{children}</div>;
};
/** Named section navigation with the Footer-local link target exception. */
export const FooterNavigation: FC<FooterNavigationProps> = (props) => {
  const {
    valid,
    entries,
    label,
    heading: Heading,
    headingProps,
    listClassName,
    linkClassName,
    props: native
  } = useFooterNavigation(props);
  return valid ? (
    <nav {...native}>
      <Heading {...headingProps}>{label}</Heading>
      <ul className={listClassName}>
        {entries.map((item, index) => (
          <li key={`${index}-${item.href}`}>
            <Link href={item.href} arrow={false} className={linkClassName}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  ) : null;
};
/** Social heading and separately named list supplied by the consumer. */
export const FooterSocial: FC<FooterSocialProps> = (props) => {
  const { children, props: native } = useFooterSocial(props);
  return <div {...native}>{children}</div>;
};
/** Consumer legal and credit row. */
export const FooterLegal: FC<FooterLegalProps> = (props) => {
  const { children, props: native } = useFooterLegal(props);
  return <div {...native}>{children}</div>;
};
