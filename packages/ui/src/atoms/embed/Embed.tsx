import type { FC } from 'react';
import { AspectRatio } from '../../primitives/aspect-ratio';
import { Spinner } from '../spinner';
import type { EmbedProps } from './types';
import { useEmbed } from './useEmbed';

/** Named, reserved frame for external content: a native iframe or consumer children in a recessed well. */
export const Embed: FC<EmbedProps> = (props) => {
  const embed = useEmbed(props);
  if (!embed.valid) {
    return null;
  }
  return (
    <div {...embed.rootProps}>
      <AspectRatio ratio={embed.ratio}>
        {embed.loading && (
          <span className={embed.loadingClassName}>
            <Spinner />
          </span>
        )}
        {embed.frame && <iframe key={embed.frame.key} title={embed.frame.title} {...embed.frame.props} />}
        {embed.content}
        {embed.fallback !== undefined && <div className={embed.fallbackClassName}>{embed.fallback}</div>}
      </AspectRatio>
    </div>
  );
};
