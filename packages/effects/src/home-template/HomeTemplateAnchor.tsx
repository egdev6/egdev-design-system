import type { HomeTemplateAnchorProps } from './types';
import { useHomeTemplateAnchor } from './useHomeTemplate';

/** Measured 3D anchor with consumer-owned decorative fallback content. */
export function HomeTemplateAnchor(props: HomeTemplateAnchorProps) {
  const anchor = useHomeTemplateAnchor(props);
  return (
    <div {...anchor.native} ref={anchor.ref} className={anchor.className}>
      <div className={anchor.fallbackClass}>{anchor.children}</div>
    </div>
  );
}
