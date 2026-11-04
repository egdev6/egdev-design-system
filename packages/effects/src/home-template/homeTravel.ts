import type { IsotipoPose, IsotipoScene } from '../atoms/isotipo3d/isotipoScene';
import { isotipoNormalizeProgress, isotipoPose } from '../atoms/isotipo3d/isotipoScene';
import type { ZoneGeometry } from './homeDirector';

type Rect = { left: number; top: number; width: number; height: number };
type Viewport = { width: number; height: number };
type TravelEndpoint = { scene: IsotipoScene; geometry: ZoneGeometry; anchor: Rect | null; sticky: boolean };
type Projection = { viewport: Viewport; anchor: Rect; pad: number; feather: number };

export function sceneProgress(
  scene: IsotipoScene,
  geometry: ZoneGeometry,
  scrollY: number,
  vh: number,
  sticky: boolean
): number {
  const { top, height } = geometry;
  let progress: number;
  switch (scene) {
    case 'hero':
      progress = scrollY / height;
      break;
    case 'chapter':
      progress = (scrollY + vh - top) / (height + vh);
      break;
    case 'lab':
      progress =
        sticky && height > 1.3 * vh && height - vh > 0
          ? (scrollY - top) / (height - vh)
          : (scrollY + 0.6 * vh - top) / height;
      break;
    case 'outro':
      progress = (scrollY + vh - top) / height;
      break;
  }
  return isotipoNormalizeProgress(progress);
}

const validRect = (rect: Rect | null): rect is Rect =>
  rect !== null &&
  [rect.left, rect.top, rect.width, rect.height].every(Number.isFinite) &&
  rect.width > 0 &&
  rect.height > 0;

export function computeTravel(
  a: TravelEndpoint,
  b: TravelEndpoint,
  t: number,
  scrollY: number,
  viewport: Viewport,
  reducedMotion: boolean
): { pose: IsotipoPose; projection: Projection } | null {
  if (
    !validRect(a.anchor) ||
    !validRect(b.anchor) ||
    !Number.isFinite(viewport.width) ||
    !Number.isFinite(viewport.height) ||
    viewport.width <= 0 ||
    viewport.height <= 0 ||
    !Number.isFinite(t)
  ) {
    return null;
  }
  const rect = (endpoint: TravelEndpoint, anchor: Rect): Rect => ({
    ...anchor,
    // Foundation pulso-iso3d.mjs:196 adds the scroll offset to the hero viewport top.
    top: anchor.top + (endpoint.scene === 'hero' && !reducedMotion ? Math.min(scrollY, viewport.height) * 0.3 : 0)
  });
  const ra = rect(a, a.anchor);
  const rb = rect(b, b.anchor);
  const pa = isotipoPose(
    a.scene,
    sceneProgress(a.scene, a.geometry, scrollY, viewport.height, a.sticky),
    reducedMotion
  );
  const pb = isotipoPose(
    b.scene,
    sceneProgress(b.scene, b.geometry, scrollY, viewport.height, b.sticky),
    reducedMotion
  );
  const mix = (x: number, y: number) => x + (y - x) * t;
  const anchor = {
    left: mix(ra.left, rb.left),
    top: mix(ra.top, rb.top),
    width: mix(ra.width, rb.width),
    height: mix(ra.height, rb.height)
  };
  if (!validRect(anchor)) {
    return null;
  }
  const size = Math.min(anchor.width, anchor.height);
  return {
    pose: {
      az: mix(pa.az, pb.az),
      el: mix(pa.el, pb.el),
      fov: mix(pa.fov, pb.fov),
      ex: mix(pa.ex, pb.ex),
      halo: mix(pa.halo, pb.halo)
    },
    projection: { viewport, anchor, pad: Math.round(size * 0.14), feather: Math.round(size * 0.2) }
  };
}
