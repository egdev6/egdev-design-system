import { Heading, Text } from '../../primitives/text';
import type { ChapterBreakProps } from './types';
import { useChapterBreak } from './useChapterBreak';

/** A passive interlude inside a consumer-named section. */
export function ChapterBreak(props: ChapterBreakProps) {
  const scene = useChapterBreak(props);
  return (
    <div {...scene.rootProps}>
      <div className={scene.grid}>
        <div className={scene.copy}>
          {scene.eyebrow != null && <Text variant='eyebrow'>{scene.eyebrow}</Text>}
          <div className={scene.heading}>
            <Heading
              id={scene.id}
              level={scene.level}
              variant='hero'
              tone='canvas'
              accent={scene.accent}
              accentBreak={true}
            >
              {scene.title}
            </Heading>
          </div>
          {scene.lede != null && <p className={scene.ledeClass}>{scene.lede}</p>}
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
