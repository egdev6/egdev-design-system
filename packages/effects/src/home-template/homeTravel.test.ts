import { describe, expect, it } from 'vitest';
import { isotipoPose } from '../atoms/isotipo3d/isotipoScene';
import { computeTravel, sceneProgress } from './homeTravel';

const viewport = { width: 1000, height: 500 };
const a = {
  scene: 'chapter' as const,
  geometry: { top: 100, height: 1000 },
  anchor: { left: -100, top: 20, width: 101, height: 201 },
  sticky: false
};
const b = {
  scene: 'outro' as const,
  geometry: { top: 1200, height: 1000 },
  anchor: { left: 1100, top: -200, width: 301, height: 401 },
  sticky: false
};

describe('home travel', () => {
  it('calculates and clamps all scene progress formulas', () => {
    const g = { top: 100, height: 1000 };
    expect(sceneProgress('hero', g, 250, 500, false)).toBe(0.25);
    expect(sceneProgress('chapter', g, 250, 500, false)).toBe(650 / 1500);
    expect(sceneProgress('lab', g, 250, 500, true)).toBe(0.3);
    expect(sceneProgress('lab', g, 250, 500, false)).toBe(0.45);
    expect(sceneProgress('lab', { top: 100, height: 650 }, 250, 500, true)).toBe(450 / 650);
    expect(sceneProgress('lab', { top: 100, height: 500 }, 250, 500, true)).toBe(0.9);
    expect(sceneProgress('outro', g, 250, 500, false)).toBe(0.65);
    expect(sceneProgress('hero', g, -100, 500, false)).toBe(0);
    expect(sceneProgress('hero', g, 2000, 500, false)).toBe(1);
  });
  it('mixes all pose and signed rectangle fields with the director t in either direction', () => {
    const pa = isotipoPose('chapter', sceneProgress('chapter', a.geometry, 250, 500, false), false);
    const pb = isotipoPose('outro', sceneProgress('outro', b.geometry, 250, 500, false), false);
    for (const t of [0, 0.5, 1]) {
      const result = computeTravel(a, b, t, 250, viewport, false);
      expect(result).not.toBeNull();
      for (const key of ['az', 'el', 'fov', 'ex', 'halo'] as const) {
        expect(result?.pose[key]).toBeCloseTo(pa[key] + (pb[key] - pa[key]) * t);
      }
      for (const key of ['left', 'top', 'width', 'height'] as const) {
        expect(result?.projection.anchor[key]).toBeCloseTo(a.anchor[key] + (b.anchor[key] - a.anchor[key]) * t);
      }
      expect(computeTravel(b, a, 1 - t, 250, viewport, false)).toEqual(result);
    }
    const middle = computeTravel(a, b, 0.5, 250, viewport, false);
    expect(middle?.projection).toEqual({
      viewport,
      anchor: { left: 500, top: -90, width: 201, height: 301 },
      pad: 28,
      feather: 40
    });
  });
  it('uses reduced-motion poses and already snapped t', () => {
    for (const t of [0, 1]) {
      const selected = t === 0 ? a : b;
      const result = computeTravel(a, b, t, 250, viewport, true);
      expect(result?.pose).toEqual(
        isotipoPose(selected.scene, sceneProgress(selected.scene, selected.geometry, 250, 500, false), true)
      );
      expect(result?.projection.anchor).toEqual(selected.anchor);
    }
  });
  it('adds hero parallax to anchor top only outside reduced motion', () => {
    const hero = { ...a, scene: 'hero' as const };
    expect(computeTravel(hero, hero, 0, 1000, viewport, false)?.projection.anchor).toEqual({
      ...hero.anchor,
      top: 170
    });
    expect(computeTravel(hero, hero, 0, 1000, viewport, true)?.projection.anchor).toEqual(hero.anchor);
  });
  it('suppresses missing, zero-area, negative and non-finite anchors', () => {
    for (const anchor of [
      null,
      { ...a.anchor, width: 0 },
      { ...a.anchor, height: -1 },
      { ...a.anchor, left: Infinity },
      { ...a.anchor, top: NaN }
    ]) {
      expect(computeTravel({ ...a, anchor }, b, 0.5, 250, viewport, false)).toBeNull();
      expect(computeTravel(b, { ...a, anchor }, 0.5, 250, viewport, false)).toBeNull();
    }
  });
});
