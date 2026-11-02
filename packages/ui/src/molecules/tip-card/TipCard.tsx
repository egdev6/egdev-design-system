import type { FC } from 'react';
import { Badge } from '../../atoms/badge';
import { PhotoFrame } from '../../atoms/photo-frame';
import type { TipCardProps } from './types';
import { useTipCard } from './useTipCard';

/** Passive 2:3 tip poster: fixed PhotoFrame cover, optional solid brand badge and a mono
 * technical label below the cover. No hover, zoom, glow, link or slider behavior of its own. */
export const TipCard: FC<TipCardProps> = (props) => {
  const { valid, rootProps, headingElement: Heading, headingProps, title, badge, capProps } = useTipCard(props);
  return valid ? (
    <article {...rootProps}>
      <PhotoFrame src={props.src} alt={props.alt} focalPoint={props.focalPoint} ratio={2 / 3} />
      <div {...capProps}>
        {badge !== null && (
          <Badge tone='brand' variant='solid'>
            {badge}
          </Badge>
        )}
        <Heading {...headingProps}>{title}</Heading>
      </div>
    </article>
  ) : null;
};
