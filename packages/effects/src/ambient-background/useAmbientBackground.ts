import { cn } from '@egdev/ui';
import { useEffect, useRef, useState } from 'react';
import { ambientProfiles, createParticleStreaks, resolveAmbientColors } from './particleStreaks';
import {
  type AmbientBackgroundProfile,
  type AmbientDirection,
  ambientCanvasVariants,
  ambientRootVariants
} from './types';

const directionAngles: Record<AmbientDirection, number> = {
  up: 270,
  'up-right': 315,
  right: 0,
  'down-right': 45,
  down: 90,
  'down-left': 135,
  left: 180,
  'up-left': 225
};

function resolveDirection(value: AmbientDirection | undefined, prop: string): number {
  if (value === undefined) {
    return 225;
  }
  if (Object.hasOwn(directionAngles, value)) {
    return directionAngles[value];
  }
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn(`AmbientBackground: invalid ${prop}; using up-left.`);
  }
  return 225;
}

type State = 'stopped' | 'static' | 'running';

export function useAmbientBackground(
  profile: AmbientBackgroundProfile,
  opacity: number,
  lineDirection?: AmbientDirection,
  squareDirection?: AmbientDirection,
  className?: string
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<State>('stopped');
  const lineAngle = resolveDirection(lineDirection, 'lineDirection');
  const squareAngle = resolveDirection(squareDirection, 'squareDirection');
  const values = useRef({ profile, opacity, lineAngle, squareAngle });
  values.current = { profile, opacity, lineAngle, squareAngle };
  const updateRef = useRef<(() => void) | null>(null);
  const normalized = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 0;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) {
      return;
    }
    const colors = resolveAmbientColors(getComputedStyle(root));
    if (!colors) {
      return;
    }
    let failed = false;
    const engine = createParticleStreaks(canvas, colors, ambientProfiles[values.current.profile], () => {
      failed = true;
      setState('stopped');
    });
    if (!engine) {
      return;
    }
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let active = true;
    let width = -1;
    let height = -1;
    let dpr = -1;
    let previousProfile: AmbientBackgroundProfile | undefined;
    let previousOpacity = -1;
    let previousLineAngle = -1;
    let previousSquareAngle = -1;
    let previousState: State = 'stopped';
    let detach: (() => void) | undefined;
    const update = () => {
      if (!active) {
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const changedSize = rect.width !== width || rect.height !== height || ratio !== dpr;
      width = rect.width;
      height = rect.height;
      dpr = ratio;
      const current = values.current;
      const currentOpacity = Number.isFinite(current.opacity) ? Math.max(0, Math.min(1, current.opacity)) : 0;
      const preset = ambientProfiles[current.profile];
      engine.setDirections(current.lineAngle, current.squareAngle);
      const scale = width < 700 ? 0.6 : 1;
      engine.set({
        ...preset,
        lineCount: Math.round(preset.lineCount * scale),
        squareCount: Math.round(preset.squareCount * scale)
      });
      if (changedSize) {
        engine.resize(width, height, ratio);
      }
      const next: State =
        width <= 0 || height <= 0 || document.hidden || currentOpacity === 0
          ? 'stopped'
          : media.matches
            ? 'static'
            : 'running';
      if (next !== 'stopped' && !engine.ready()) {
        failed = true;
        active = false;
        detach?.();
        engine.dispose();
        setState('stopped');
        return;
      }
      if (next === 'running') {
        engine.start();
      } else {
        engine.stop();
        if (
          next === 'static' &&
          (previousState !== 'static' ||
            changedSize ||
            previousProfile !== current.profile ||
            previousOpacity !== currentOpacity ||
            previousLineAngle !== current.lineAngle ||
            previousSquareAngle !== current.squareAngle)
        ) {
          engine.renderOnce();
        }
      }
      previousState = next;
      previousProfile = current.profile;
      previousOpacity = currentOpacity;
      previousLineAngle = current.lineAngle;
      previousSquareAngle = current.squareAngle;
      setState(failed ? 'stopped' : next);
    };
    updateRef.current = update;
    update();
    if (failed) {
      updateRef.current = null;
      return;
    }
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(update);
    observer?.observe(canvas);
    window.addEventListener('resize', update);
    document.addEventListener('visibilitychange', update);
    media.addEventListener('change', update);
    detach = () => {
      detach = undefined;
      observer?.disconnect();
      window.removeEventListener('resize', update);
      document.removeEventListener('visibilitychange', update);
      media.removeEventListener('change', update);
    };
    return () => {
      active = false;
      updateRef.current = null;
      detach?.();
      engine.dispose();
    };
  }, []);
  useEffect(() => {
    updateRef.current?.();
  }, [profile, opacity, lineAngle, squareAngle]);
  return {
    rootRef,
    canvasRef,
    state,
    normalized,
    rootClassName: cn(ambientRootVariants(), className),
    canvasClassName: cn(ambientCanvasVariants())
  };
}
