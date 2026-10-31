import { cn } from '@egdev/ui';
import { useEffect, useRef, useState } from 'react';
import { createParticleStreaks } from './particleStreaks';
import { type AmbientBackgroundProfile, ambientCanvasVariants, ambientRootVariants } from './types';

const profiles = {
  base: { lineCount: 70, squareCount: 90, speedMultiplier: 1, backgroundGlowOpacity: 0.1 },
  read: { lineCount: 20, squareCount: 25, speedMultiplier: 0.6, backgroundGlowOpacity: 0.1 },
  live: { lineCount: 110, squareCount: 120, speedMultiplier: 1.4, backgroundGlowOpacity: 0.18 }
};

type State = 'stopped' | 'static' | 'running';

export function useAmbientBackground(profile: AmbientBackgroundProfile, opacity: number, className?: string) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<State>('stopped');
  const values = useRef({ profile, opacity });
  values.current = { profile, opacity };
  const updateRef = useRef<(() => void) | null>(null);
  const normalized = Number.isFinite(opacity) ? Math.max(0, Math.min(1, opacity)) : 0;

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) {
      return;
    }
    const style = getComputedStyle(root);
    const names = [
      '--color-ambient-bg',
      '--color-ambient-glow',
      '--color-ambient-line',
      '--color-ambient-line-glow',
      '--color-ambient-square',
      '--color-ambient-square-glow'
    ];
    const colors = names.map((name) => style.getPropertyValue(name).trim());
    if (colors.length !== 6 || colors.some((color) => !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color))) {
      return;
    }
    const [backgroundColor, backgroundGlowColor, lineColor, lineGlowColor, squareColor, squareGlowColor] = colors;
    if (!backgroundColor || !backgroundGlowColor || !lineColor || !lineGlowColor || !squareColor || !squareGlowColor) {
      return;
    }
    let failed = false;
    const engine = createParticleStreaks(
      canvas,
      { backgroundColor, backgroundGlowColor, lineColor, lineGlowColor, squareColor, squareGlowColor },
      profiles[values.current.profile],
      () => {
        failed = true;
        setState('stopped');
      }
    );
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
      const preset = profiles[current.profile];
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
            previousOpacity !== currentOpacity)
        ) {
          engine.renderOnce();
        }
      }
      previousState = next;
      previousProfile = current.profile;
      previousOpacity = currentOpacity;
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
  }, [profile, opacity]);
  return {
    rootRef,
    canvasRef,
    state,
    normalized,
    rootClassName: cn(ambientRootVariants(), className),
    canvasClassName: cn(ambientCanvasVariants())
  };
}
