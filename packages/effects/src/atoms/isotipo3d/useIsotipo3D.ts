import { cn } from '@egdev/ui';
import { useEffect, useRef, useState } from 'react';
import {
  type IsotipoPose,
  type IsotipoScene,
  isotipoCreateScene,
  isotipoNormalizeProgress,
  isotipoPose
} from './isotipoScene';
import {
  isotipoCanvasVariants,
  isotipoLightVariants,
  isotipoRootInvariantVariants,
  isotipoRootVariants,
  isotipoShadeVariants,
  isotipoSvgVariants
} from './types';

type State = 'loading' | 'running' | 'static' | 'stopped' | 'fallback';
type Engine = Awaited<ReturnType<typeof isotipoCreateScene>>;

/** Coordinates one decorative scene without scheduling work during render or SSR. */
export function useIsotipo3D(
  scene: IsotipoScene,
  progress: number,
  opacity: number,
  hidden: boolean,
  pointerTilt = true,
  className?: string
) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const values = useRef({ scene, progress, opacity, hidden, pointerTilt });
  values.current = { scene, progress, opacity, hidden, pointerTilt };
  const updateRef = useRef<(() => void) | null>(null);
  const [state, setState] = useState<State>('loading');
  const [hasFrame, setHasFrame] = useState(false);
  const stateRef = useRef<State>('loading');
  const transition = (next: State) => {
    if (stateRef.current !== next) {
      stateRef.current = next;
      setState(next);
    }
  };

  useEffect(() => {
    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) {
      return;
    }
    let active = true;
    const controller = new AbortController();
    let failed = false;
    let pending = false;
    let shown = false;
    let engine: Engine | null = null;
    let frame: number | null = null;
    let version = 0;
    let last: number | null = null;
    let time = 0;
    let intro = 0;
    let smoothedPose: IsotipoPose | null = null;
    let poseScene: IsotipoScene | null = null;
    let motion: MediaQueryList;
    let coarse: MediaQueryList;
    try {
      motion = window.matchMedia('(prefers-reduced-motion: reduce)');
      coarse = window.matchMedia('(pointer: coarse)');
    } catch {
      controller.abort();
      transition('fallback');
      return;
    }
    let detachSubscriptions = () => {
      // No subscriptions have been installed yet.
    };
    let pointerAttached = false;
    let previousScene = values.current.scene;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const resetPointer = () => {
      pointer.x = 0;
      pointer.y = 0;
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    const onPointer = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') {
        return;
      }
      const rect = root.getBoundingClientRect();
      if (
        rect.width <= 0 ||
        rect.height <= 0 ||
        event.clientX < rect.left ||
        event.clientX > rect.right ||
        event.clientY < rect.top ||
        event.clientY > rect.bottom
      ) {
        resetPointer();
        return;
      }
      pointer.targetX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.targetY = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    };
    const onExit = (event: PointerEvent) => {
      if (!event.relatedTarget) {
        resetPointer();
      }
    };
    const detachPointer = () => {
      if (pointerAttached) {
        attempt(() => window.removeEventListener('pointermove', onPointer));
        attempt(() => window.removeEventListener('pointerout', onExit));
        attempt(() => window.removeEventListener('blur', resetPointer));
        pointerAttached = false;
      }
      resetPointer();
    };
    const attempt = (cleanup: () => void) => {
      try {
        cleanup();
      } catch {
        // Each owned resource must still receive its cleanup attempt.
      }
    };
    const cancel = () => {
      version++;
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      frame = null;
      last = null;
    };
    const fail = () => {
      if (!active || failed) {
        return;
      }
      failed = true;
      controller.abort();
      cancel();
      detachPointer();
      detachSubscriptions();
      const previous = engine;
      engine = null;
      if (previous) {
        attempt(() => previous.dispose());
      }
      transition('fallback');
    };
    const draw = (now: number, generation: number) => {
      if (!active || failed || generation !== version || !engine) {
        return;
      }
      frame = null;
      try {
        const dt = last === null ? 0 : Math.max(0, Math.min(0.05, (now - last) / 1000));
        last = now;
        time += dt;
        intro = Math.min(1, intro + dt / 1.2);
        const current = values.current;
        const target = isotipoPose(current.scene, isotipoNormalizeProgress(current.progress), false);
        if (!smoothedPose || poseScene !== current.scene) {
          smoothedPose = target;
        } else {
          const factor = 1 - Math.exp(-dt / 0.05);
          for (const key of ['az', 'el', 'fov', 'ex', 'halo'] as const) {
            smoothedPose[key] += (target[key] - smoothedPose[key]) * factor;
          }
        }
        poseScene = current.scene;
        const smoothing = Math.min(1, dt * 3);
        pointer.x += (pointer.targetX - pointer.x) * smoothing;
        pointer.y += (pointer.targetY - pointer.y) * smoothing;
        engine.render(current.scene, isotipoNormalizeProgress(current.progress), false, {
          time,
          intro,
          pose: { ...smoothedPose },
          ...(pointer.x !== 0 || pointer.y !== 0 ? { tiltX: pointer.x, tiltY: pointer.y } : {})
        });
        if (!shown) {
          shown = true;
          setHasFrame(true);
        }
        transition('running');
        frame = requestAnimationFrame((next) => draw(next, generation));
      } catch {
        fail();
      }
    };
    const update = () => {
      if (!active || failed) {
        return;
      }
      const current = values.current;
      if (current.scene !== previousScene) {
        resetPointer();
        previousScene = current.scene;
      }
      const bounds = root.getBoundingClientRect();
      const visible =
        bounds.width > 0 &&
        bounds.height > 0 &&
        !document.hidden &&
        !current.hidden &&
        isotipoNormalizeProgress(current.opacity) > 0;
      if (!visible) {
        detachPointer();
        cancel();
        transition('stopped');
        return;
      }
      if (!engine) {
        transition('loading');
        if (pending) {
          return;
        }
        const style = getComputedStyle(root);
        const names = ['--logo-red', '--logo-red-shade', '--color-primitive-red-neon', '--color-primitive-red-light'];
        const colors = names.map((name) => style.getPropertyValue(name).trim());
        if (colors.some((color) => !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color))) {
          fail();
          return;
        }
        const [light, shade, neon, redLight] = colors;
        if (!light || !shade || !neon || !redLight) {
          fail();
          return;
        }
        pending = true;
        isotipoCreateScene(canvas, { light, shade, neon, redLight }, controller.signal)
          .then((created) => {
            pending = false;
            if (!active || failed) {
              attempt(() => created.dispose());
              return;
            }
            engine = created;
            update();
          })
          .catch(() => fail());
        return;
      }
      try {
        engine.resize(bounds.width, bounds.height, window.devicePixelRatio || 1, coarse.matches);
        const pointerEligible =
          !motion.matches &&
          !coarse.matches &&
          current.pointerTilt === true &&
          (current.scene === 'hero' || current.scene === 'outro');
        if (pointerEligible && !pointerAttached) {
          pointerAttached = true;
          window.addEventListener('pointermove', onPointer, { passive: true });
          window.addEventListener('pointerout', onExit, { passive: true });
          window.addEventListener('blur', resetPointer);
        } else if (!pointerEligible) {
          detachPointer();
        }
        if (motion.matches) {
          cancel();
          smoothedPose = null;
          poseScene = null;
          intro = 1;
          engine.render(current.scene, isotipoNormalizeProgress(current.progress), true, { time: 0, intro: 1 });
          if (!shown) {
            shown = true;
            setHasFrame(true);
          }
          transition('static');
        } else if (frame === null) {
          transition(shown ? 'running' : 'loading');
          const generation = version;
          frame = requestAnimationFrame((now) => draw(now, generation));
        }
      } catch {
        fail();
      }
    };
    let dprMedia: MediaQueryList | null = null;
    let observer: ResizeObserver | null = null;
    const onDprChange = () => {
      if (!active || failed) {
        return;
      }
      try {
        dprMedia?.removeEventListener('change', onDprChange);
        dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
        dprMedia.addEventListener('change', onDprChange);
        update();
      } catch {
        fail();
      }
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    detachSubscriptions = () => {
      attempt(() => observer?.disconnect());
      observer = null;
      attempt(() => canvas.removeEventListener('webglcontextlost', contextLost));
      attempt(() => document.removeEventListener('visibilitychange', update));
      attempt(() => window.removeEventListener('resize', update));
      attempt(() => motion.removeEventListener('change', update));
      attempt(() => coarse.removeEventListener('change', update));
      attempt(() => dprMedia?.removeEventListener('change', onDprChange));
      dprMedia = null;
    };
    try {
      dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
      dprMedia.addEventListener('change', onDprChange);
      observer = new ResizeObserver(update);
      observer.observe(root);
      canvas.addEventListener('webglcontextlost', contextLost);
      document.addEventListener('visibilitychange', update);
      window.addEventListener('resize', update);
      motion.addEventListener('change', update);
      coarse.addEventListener('change', update);
      updateRef.current = update;
      update();
    } catch {
      fail();
    }
    return () => {
      active = false;
      controller.abort();
      cancel();
      attempt(detachPointer);
      updateRef.current = null;
      detachSubscriptions();
      const previous = engine;
      engine = null;
      if (previous) {
        attempt(() => previous.dispose());
      }
    };
  }, []);
  useEffect(() => {
    updateRef.current?.();
  }, [scene, progress, opacity, hidden, pointerTilt]);
  return {
    rootRef,
    canvasRef,
    state,
    showCanvas: hasFrame && state !== 'fallback',
    rootClassName: cn(isotipoRootVariants(), className, isotipoRootInvariantVariants()),
    canvasClassName: cn(isotipoCanvasVariants({ visible: hasFrame && state !== 'fallback' })),
    svgClassName: cn(isotipoSvgVariants({ visible: !hasFrame || state === 'fallback' })),
    lightClassName: cn(isotipoLightVariants()),
    shadeClassName: cn(isotipoShadeVariants())
  };
}
