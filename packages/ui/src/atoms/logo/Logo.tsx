import type { FC } from 'react';
import type { LogoProps } from './types';
import { useLogo } from './useLogo';

/** The egdev brand logo: the isotype or the wordmark, as a named image or a named native link. */
export const Logo: FC<LogoProps> = (props) => {
  const logo = useLogo(props);
  const artwork = (
    <svg className={logo.artworkClassName} aria-hidden='true' focusable='false' viewBox={logo.artwork.viewBox}>
      {logo.shapes.map((shape) =>
        shape.kind === 'polygon' ? (
          <polygon key={shape.key} className={shape.className} points={shape.data} />
        ) : (
          <path key={shape.key} className={shape.className} d={shape.data} />
        )
      )}
    </svg>
  );
  return logo.href === undefined ? <span {...logo.rootProps}>{artwork}</span> : <a {...logo.rootProps}>{artwork}</a>;
};
