import { Heading, Text } from '../../primitives/text';
import type { ClosingProps } from './types';
import { useClosing } from './useClosing';

/** A passive concluding scene inside a consumer-named section. */
export function Closing(props: ClosingProps) {
  const scene = useClosing(props);
  return (
    <div {...scene.rootProps}>
      <div className={scene.grid}>
        <div className={scene.copy}>
          {scene.eyebrow != null && <Text variant='eyebrow'>{scene.eyebrow}</Text>}
          <div className={scene.heading}>
            <Heading id={scene.id} level={scene.level} variant='hero' accent={scene.accent}>
              {scene.title}
            </Heading>
          </div>
          {scene.lede != null && <p className={scene.ledeClass}>{scene.lede}</p>}
          <div className={scene.actions}>{scene.children}</div>
        </div>
        {scene.hasMedia && (
          <div className={scene.mediaClass} aria-hidden='true'>
            {scene.media}
          </div>
        )}
      </div>
    </div>
  );
}
