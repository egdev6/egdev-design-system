import { type FC, Fragment, isValidElement } from 'react';
import type { CommunityCardActionProps, CommunityCardMarkProps, CommunityCardProps } from './types';
import { useCommunityCard, useCommunityCardAction, useCommunityCardMark } from './useCommunityCard';

/**
 * Passive named community card: a Material header band with the role line and the consumer mark,
 * then the generated heading, free copy and the pinned action. Renders nothing without a title.
 */
export const CommunityCard: FC<CommunityCardProps> = (props) => {
  const {
    valid,
    rootProps,
    bandProps,
    topRowProps,
    eyebrowProps,
    eyebrowTextProps,
    headingElement: Heading,
    headingProps,
    title,
    eyebrow,
    marks,
    bodyProps,
    bodyChildren
  } = useCommunityCard(props, CommunityCardMark);
  if (!valid) {
    return null;
  }
  const hasTopRow = eyebrow !== null || marks.length > 0;
  return (
    <article {...rootProps}>
      <div {...bandProps}>
        {hasTopRow && (
          <div {...topRowProps}>
            {eyebrow !== null && (
              <span {...eyebrowProps}>
                <span {...eyebrowTextProps}>{eyebrow}</span>
              </span>
            )}
            {marks.map((mark, position) => (
              <Fragment key={mark.key ?? `community-card-mark-${position}`}>{mark}</Fragment>
            ))}
          </div>
        )}
      </div>
      <div {...bodyProps}>
        <Heading {...headingProps}>{title}</Heading>
        {bodyChildren.map((child, position) => (
          <Fragment key={isValidElement(child) && child.key !== null ? child.key : `community-card-body-${position}`}>
            {child}
          </Fragment>
        ))}
      </div>
    </article>
  );
};

/** Decorative consumer mark slot on the trailing edge of the header band's top row. */
export const CommunityCardMark: FC<CommunityCardMarkProps> = (props) => {
  const { slotProps, children } = useCommunityCardMark(props);
  return <div {...slotProps}>{children}</div>;
};

/** Bottom-edge zone for the card's single supplied action; the card itself stays passive. */
export const CommunityCardAction: FC<CommunityCardActionProps> = (props) => {
  const { actionProps, children } = useCommunityCardAction(props);
  return <div {...actionProps}>{children}</div>;
};
