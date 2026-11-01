import { AspectRatio } from '../../primitives/aspect-ratio';
import { Text } from '../../primitives/text';
import type { PreviewFrameProps } from './types';
import { usePreviewFrame } from './usePreviewFrame';

/** Passive, named preview figure with decorative guides and consumer-owned controls. */
export function PreviewFrame(props: PreviewFrameProps) {
  const frame = usePreviewFrame(props);
  return (
    <figure {...frame.rootProps}>
      {frame.figureCaption !== undefined && (
        <figcaption id={frame.captionId} className={frame.captionClass}>
          <Text variant='eyebrow'>{frame.figureCaption}</Text>
        </figcaption>
      )}
      {frame.actions != null && <div className={frame.actionsClass}>{frame.actions}</div>}
      <div className={frame.canvasClass} data-canvas='' aria-hidden='true'>
        <AspectRatio ratio={frame.ratio}>
          <div className={frame.innerClass}>
            {frame.children}
            {frame.guides.map((zone) => (
              <div key={zone.id} data-zone='' className={zone.className} style={zone.style}>
                <span className={frame.labelClass}>{zone.label}</span>
              </div>
            ))}
            {frame.safeArea && <div data-safe-area='' className={frame.safeClass} />}
          </div>
        </AspectRatio>
      </div>
      {frame.footer != null && <div className={frame.footerClass}>{frame.footer}</div>}
    </figure>
  );
}
