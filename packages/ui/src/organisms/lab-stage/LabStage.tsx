import { Heading, Text } from '../../primitives/text';
import type { LabStageProps } from './types';
import { useLabStage } from './useLabStage';

/** A passive experiment scene inside a consumer-named section. */
export function LabStage(props: LabStageProps) {
  const scene = useLabStage(props);
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
          {scene.hasChildren && <div className={scene.experiment}>{scene.children}</div>}
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
