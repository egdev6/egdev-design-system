import type { FC } from 'react';
import { AspectRatio } from '../../primitives/aspect-ratio';
import type { PhotoFrameProps } from './types';
import { usePhotoFrame } from './usePhotoFrame';

/** Passive native figure with an optionally reserved, cover-cropped image and optional caption. */
export const PhotoFrame: FC<PhotoFrameProps> = (props) => {
  const { rootProps, mediaClassName, viewportClassName, imageProps, caption, captionClassName, labelClassName, ratio } =
    usePhotoFrame(props);
  const viewport = (
    <div className={viewportClassName}>
      <img {...imageProps} />
    </div>
  );
  return (
    <figure {...rootProps}>
      <div className={mediaClassName}>
        {ratio === undefined ? viewport : <AspectRatio ratio={ratio}>{viewport}</AspectRatio>}
      </div>
      {caption !== undefined && (
        <figcaption className={captionClassName}>
          <span className={labelClassName}>{caption}</span>
        </figcaption>
      )}
    </figure>
  );
};
