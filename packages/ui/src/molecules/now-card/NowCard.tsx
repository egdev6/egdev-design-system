import type { FC } from 'react';
import type { NowCardBodyProps, NowCardDetailProps, NowCardFooterProps, NowCardProps } from './types';
import { NowCardContext, useNowCard, useNowCardBody, useNowCardDetail, useNowCardFooter } from './useNowCard';

/** Passive current-status article named by its generated heading. No ref, asChild or activation API. */
export const NowCard: FC<NowCardProps> = (props) => {
  const {
    valid,
    size,
    showBadge,
    badge,
    badgeProps,
    rootProps,
    headingElement: Heading,
    headingProps,
    title,
    children
  } = useNowCard(props);
  return valid ? (
    <NowCardContext.Provider value={{ size }}>
      <article {...rootProps}>
        {showBadge && <span {...badgeProps}>{badge}</span>}
        <Heading {...headingProps}>{title}</Heading>
        {children}
      </article>
    </NowCardContext.Provider>
  ) : null;
};

/** Padded growing zone for the consumer-supplied copy. */
export const NowCardBody: FC<NowCardBodyProps> = (props) => {
  const { className } = useNowCardBody(props);
  return <div className={className}>{props.children}</div>;
};

/** Lower band for one supporting detail and/or one action. */
export const NowCardFooter: FC<NowCardFooterProps> = (props) => {
  const { className } = useNowCardFooter(props);
  return <div className={className}>{props.children}</div>;
};

/** Supporting date or context line with the consumer-marked emphasized value. */
export const NowCardDetail: FC<NowCardDetailProps> = (props) => {
  const { className } = useNowCardDetail(props);
  return <span className={className}>{props.children}</span>;
};
