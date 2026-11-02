import * as SlotPrimitive from '@radix-ui/react-slot';
import type { FC } from 'react';
import { Badge } from '../../atoms/badge';
import { Icon } from '../../atoms/icon';
import { AspectRatio } from '../../primitives/aspect-ratio';
import type { ArticleFeatureCoverProps, ArticleFeatureProps } from './types';
import { useArticleFeature, useArticleFeatureCover } from './useArticleFeature';

/**
 * Whole-card featured-article link: one anchor (native or the consumer's through asChild) around
 * the reserved cover, the context row, the generated heading and the paint-only action label.
 */
export const ArticleFeature: FC<ArticleFeatureProps> = (props) => {
  const {
    valid,
    root: Root,
    rootProps,
    children,
    headingElement: Heading,
    headingProps,
    title,
    eyebrow,
    eyebrowProps,
    detail,
    detailProps,
    metaProps,
    separatorProps,
    action,
    actionProps,
    arrowProps
  } = useArticleFeature(props);
  if (!valid) {
    return null;
  }
  return (
    <Root {...rootProps}>
      <SlotPrimitive.Slottable>{children}</SlotPrimitive.Slottable>
      {(eyebrow !== null || detail !== null) && (
        <p {...metaProps}>
          {eyebrow !== null && <span {...eyebrowProps}>{eyebrow}</span>}
          {eyebrow !== null && detail !== null && <span {...separatorProps}>·</span>}
          {detail !== null && <span {...detailProps}>{detail}</span>}
        </p>
      )}
      <Heading {...headingProps}>{title}</Heading>
      {action !== null && (
        <span {...actionProps}>
          {action}
          <Icon {...arrowProps} />
        </span>
      )}
    </Root>
  );
};

/**
 * Reserved 16:8 cover region: the generative recessed plate with the aria-hidden word, or the
 * supplied `PhotoFrame ratio="auto"` filling the reservation, plus the optional overlay badge.
 */
export const ArticleFeatureCover: FC<ArticleFeatureCoverProps> = (props) => {
  const { coverProps, reservationProps, media, plateProps, word, wordProps, badge, badgeProps } =
    useArticleFeatureCover(props);
  return (
    <div {...coverProps}>
      <AspectRatio {...reservationProps}>
        {media !== null ? media : <div {...plateProps}>{word !== null && <span {...wordProps}>{word}</span>}</div>}
      </AspectRatio>
      {badge !== null && (
        <Badge tone='brand' variant='solid' {...badgeProps}>
          {badge}
        </Badge>
      )}
    </div>
  );
};
