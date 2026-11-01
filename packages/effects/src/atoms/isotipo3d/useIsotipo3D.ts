import { cn } from '@egdev/ui';
import { useEffect, useRef, useState } from 'react';
import {
  type IsotipoPose,
  type IsotipoScene,
  isotipoCreateScene,
  isotipoNormalizeProgress,
  isotipoPose
} from './isotipoScene';
import type { IsotipoPoseChange } from './types';
import {
  isotipoCanvasVariants,
  isotipoLightVariants,
  isotipoRootGestureVariants,
  isotipoRootInvariantVariants,
  isotipoRootVariants,
  isotipoShadeVariants,
  isotipoSvgVariants
} from './types';

type State = 'loading' | 'running' | 'static' | 'stopped' | 'fallback';
type Engine = Awaited<ReturnType<typeof isotipoCreateScene>>;

export type IsotipoInteraction = {
  /** Enables drag-to-rotate offsets that spring back to the scene pose. */
  dragRotate?: boolean;
  /** Enables the flip gesture: drag past the threshold or double-click. */
  flip?: boolean;
  /** Enables the interactive accessibility model; requires a non-empty label. */
  interactive?: boolean;
  /** Accessible name required by interactive mode. */
  label?: string;
  /** Freezes the idle loop at the current pose. */
  paused?: boolean;
  /** User-driven pose callback in degrees. */
  onPoseChange?: (pose: IsotipoPoseChange) => void;
};

const labelValid = (label: string | undefined): label is string => typeof label === 'string' && label.trim().length > 0;

/** Yaw/pitch step for interactive keyboard rotation, in degrees. */
const KEY_STEP = 15;
/** Horizontal release velocity (px/ms) that triggers a flip instead of a plain spring-back. */
const FLIP_VELOCITY = 0.5;
/** Critically damped spring stiffness for the post-release return to the scene pose. */
const SPRING_OMEGA = 10;

/** Coordinates one decorative scene without scheduling work during render or SSR. */
export function useIsotipo3D(
  scene: IsotipoScene,
  progress: number,
  opacity: number,
  hidden: boolean,
  pointerTilt = true,
  className?: string,
  interaction: IsotipoInteraction = {}
) {
  const { dragRotate = false, flip = false, interactive = false, label, paused = false, onPoseChange } = interaction;
  if (interactive && !labelValid(label) && (typeof process === 'undefined' || process.env.NODE_ENV !== 'production')) {
    console.warn('Isotipo3D: interactive mode requires a non-empty label; rendering the decorative fallback posture.');
  }
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const values = useRef({
    scene,
    progress,
    opacity,
    hidden,
    pointerTilt,
    dragRotate,
    flip,
    interactive,
    label,
    paused,
    onPoseChange
  });
  values.current = {
    scene,
    progress,
    opacity,
    hidden,
    pointerTilt,
    dragRotate,
    flip,
    interactive,
    label,
    paused,
    onPoseChange
  };
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
    let gestureAttached = false;
    let previousScene = values.current.scene;
    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const resetPointer = () => {
      pointer.x = 0;
      pointer.y = 0;
      pointer.targetX = 0;
      pointer.targetY = 0;
    };
    const gesture = {
      dragging: false,
      releasing: false,
      pointerId: -1,
      lastX: 0,
      lastY: 0,
      lastT: 0,
      vX: 0,
      vY: 0,
      distance: 0,
      startWidth: 1,
      yaw: 0,
      pitch: 0,
      flipped: false,
      rvx: 0,
      rvy: 0
    };
    const effectiveInteractive = () => {
      const current = values.current;
      return current.interactive === true && labelValid(current.label);
    };
    const gesturesEnabled = () => {
      const current = values.current;
      return current.dragRotate === true || current.flip === true || effectiveInteractive();
    };
    const resetOffsets = () => {
      gesture.yaw = 0;
      gesture.pitch = 0;
      gesture.releasing = false;
    };
    const emitPose = () => {
      values.current.onPoseChange?.({ yaw: gesture.yaw, pitch: gesture.pitch, flipped: gesture.flipped });
    };
    const gesturePayload = () =>
      gesture.yaw !== 0 || gesture.pitch !== 0 || gesture.flipped
        ? {
            yawOffset: gesture.yaw,
            pitchOffset: gesture.pitch,
            ...(gesture.flipped ? { flipped: true as const } : {})
          }
        : {};
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
    const releaseCapture = () => {
      if (gesture.pointerId < 0) {
        return;
      }
      attempt(() => root.releasePointerCapture(gesture.pointerId));
      gesture.pointerId = -1;
    };
    /** Applies the user-driven pose immediately under reduced motion, otherwise schedules a frame. */
    const repaint = () => {
      if (!active || failed || !engine) {
        return;
      }
      if (motion.matches) {
        try {
          const current = values.current;
          engine.render(current.scene, isotipoNormalizeProgress(current.progress), true, {
            time: 0,
            intro: 1,
            ...gesturePayload()
          });
          if (!shown) {
            shown = true;
            setHasFrame(true);
          }
          transition('static');
        } catch {
          fail();
        }
        return;
      }
      if (frame === null) {
        frame = requestAnimationFrame((now) => draw(now, version));
      }
    };
    /** Returns the user pose to the scene pose: instant snap under reduced motion, spring otherwise. */
    const settle = () => {
      if (motion.matches) {
        resetOffsets();
        emitPose();
        repaint();
        return;
      }
      gesture.releasing = true;
      gesture.rvx = Math.max(-360, Math.min(360, gesture.vX * (180 / gesture.startWidth) * 1000));
      gesture.rvy = Math.max(-360, Math.min(360, gesture.vY * (180 / gesture.startWidth) * 1000));
      repaint();
    };
    const endDrag = (allowFlip: boolean) => {
      if (!gesture.dragging) {
        return;
      }
      gesture.dragging = false;
      releaseCapture();
      const current = values.current;
      if (allowFlip && current.flip === true) {
        const horizontal = Math.abs(gesture.vX) > FLIP_VELOCITY || gesture.distance > gesture.startWidth * 0.6;
        if (horizontal) {
          gesture.flipped = !gesture.flipped;
          emitPose();
        }
      }
      gesture.vX = 0;
      gesture.vY = 0;
      settle();
    };
    const onGestureDown = (event: PointerEvent) => {
      if (!gesturesEnabled() || event.button !== 0) {
        return;
      }
      if (event.pointerType === 'touch' && !effectiveInteractive()) {
        // Decorative layers never trap touch scroll (OQ5).
        return;
      }
      const rect = root.getBoundingClientRect();
      gesture.dragging = true;
      gesture.pointerId = event.pointerId;
      gesture.lastX = event.clientX;
      gesture.lastY = event.clientY;
      gesture.lastT = event.timeStamp || performance.now();
      gesture.vX = 0;
      gesture.vY = 0;
      gesture.distance = 0;
      gesture.startWidth = rect.width > 0 ? rect.width : 1;
      gesture.releasing = false;
      attempt(() => root.setPointerCapture(event.pointerId));
    };
    const onGestureMove = (event: PointerEvent) => {
      if (!gesture.dragging || event.pointerId !== gesture.pointerId) {
        return;
      }
      const now = event.timeStamp || performance.now();
      const dt = Math.max(1, now - gesture.lastT);
      const dx = event.clientX - gesture.lastX;
      const dy = event.clientY - gesture.lastY;
      gesture.lastX = event.clientX;
      gesture.lastY = event.clientY;
      gesture.lastT = now;
      gesture.vX = gesture.vX * 0.8 + (dx / dt) * 0.2;
      gesture.vY = gesture.vY * 0.8 + (dy / dt) * 0.2;
      gesture.distance += Math.abs(dx) + Math.abs(dy);
      const degreesPerPx = 180 / gesture.startWidth;
      gesture.yaw = Math.max(-90, Math.min(90, gesture.yaw + dx * degreesPerPx));
      gesture.pitch = Math.max(-30, Math.min(30, gesture.pitch - dy * degreesPerPx));
      emitPose();
      repaint();
    };
    const onGestureUp = (event: PointerEvent) => {
      if (gesture.dragging && event.pointerId === gesture.pointerId) {
        endDrag(true);
      }
    };
    const onGestureCancel = (event: PointerEvent) => {
      if (gesture.dragging && event.pointerId === gesture.pointerId) {
        endDrag(false);
      }
    };
    const onLostCapture = () => {
      endDrag(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!effectiveInteractive()) {
        return;
      }
      if (event.key === 'Enter' || event.key === ' ') {
        if (values.current.flip !== true) {
          return;
        }
        event.preventDefault();
        gesture.flipped = !gesture.flipped;
        emitPose();
        repaint();
        return;
      }
      if (
        event.key !== 'ArrowLeft' &&
        event.key !== 'ArrowRight' &&
        event.key !== 'ArrowUp' &&
        event.key !== 'ArrowDown'
      ) {
        return;
      }
      event.preventDefault();
      if (event.key === 'ArrowLeft') {
        gesture.yaw = Math.max(-90, Math.min(90, gesture.yaw - KEY_STEP));
      } else if (event.key === 'ArrowRight') {
        gesture.yaw = Math.max(-90, Math.min(90, gesture.yaw + KEY_STEP));
      } else if (event.key === 'ArrowUp') {
        gesture.pitch = Math.max(-30, Math.min(30, gesture.pitch + KEY_STEP));
      } else {
        gesture.pitch = Math.max(-30, Math.min(30, gesture.pitch - KEY_STEP));
      }
      emitPose();
      repaint();
    };
    const onFocusOut = () => {
      if (effectiveInteractive() && (gesture.yaw !== 0 || gesture.pitch !== 0 || gesture.releasing)) {
        settle();
      }
    };
    const onDoubleTap = () => {
      if (!gesturesEnabled() || values.current.flip !== true) {
        return;
      }
      gesture.flipped = !gesture.flipped;
      emitPose();
      repaint();
    };
    const detachGestures = () => {
      if (gestureAttached) {
        gestureAttached = false;
        attempt(() => root.removeEventListener('pointerdown', onGestureDown));
        attempt(() => root.removeEventListener('pointermove', onGestureMove));
        attempt(() => root.removeEventListener('pointerup', onGestureUp));
        attempt(() => root.removeEventListener('pointercancel', onGestureCancel));
        attempt(() => root.removeEventListener('lostpointercapture', onLostCapture));
        attempt(() => root.removeEventListener('dblclick', onDoubleTap));
        attempt(() => root.removeEventListener('keydown', onKeyDown));
        attempt(() => root.removeEventListener('focusout', onFocusOut));
      }
      releaseCapture();
      gesture.dragging = false;
      resetOffsets();
    };
    const attachGestures = () => {
      if (gestureAttached) {
        return;
      }
      gestureAttached = true;
      root.addEventListener('pointerdown', onGestureDown);
      root.addEventListener('pointermove', onGestureMove);
      root.addEventListener('pointerup', onGestureUp);
      root.addEventListener('pointercancel', onGestureCancel);
      root.addEventListener('lostpointercapture', onLostCapture);
      root.addEventListener('dblclick', onDoubleTap);
      root.addEventListener('keydown', onKeyDown);
      root.addEventListener('focusout', onFocusOut);
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
      detachGestures();
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
        if (gesture.releasing && dt > 0) {
          const integrate = (position: number, velocity: number) => {
            const nextVelocity =
              velocity + (-2 * SPRING_OMEGA * velocity - SPRING_OMEGA * SPRING_OMEGA * position) * dt;
            return [position + nextVelocity * dt, nextVelocity] as const;
          };
          const [yaw, rvx] = integrate(gesture.yaw, gesture.rvx);
          const [pitch, rvy] = integrate(gesture.pitch, gesture.rvy);
          gesture.yaw = yaw;
          gesture.pitch = pitch;
          gesture.rvx = rvx;
          gesture.rvy = rvy;
          if (
            Math.abs(gesture.yaw) < 0.05 &&
            Math.abs(gesture.pitch) < 0.05 &&
            Math.abs(gesture.rvx) < 0.5 &&
            Math.abs(gesture.rvy) < 0.5
          ) {
            resetOffsets();
            emitPose();
          }
        }
        engine.render(current.scene, isotipoNormalizeProgress(current.progress), false, {
          time,
          intro,
          pose: { ...smoothedPose },
          ...(pointer.x !== 0 || pointer.y !== 0 ? { tiltX: pointer.x, tiltY: pointer.y } : {}),
          ...gesturePayload()
        });
        if (!shown) {
          shown = true;
          setHasFrame(true);
        }
        transition('running');
        if (!current.paused) {
          frame = requestAnimationFrame((next) => draw(next, generation));
        }
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
        detachGestures();
        cancel();
        transition('stopped');
        return;
      }
      if (gesturesEnabled()) {
        attachGestures();
      } else {
        detachGestures();
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
          engine.render(current.scene, isotipoNormalizeProgress(current.progress), true, {
            time: 0,
            intro: 1,
            ...gesturePayload()
          });
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
      attempt(detachGestures);
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
  }, [scene, progress, opacity, hidden, pointerTilt, dragRotate, flip, interactive, label, paused]);
  const gestureMode = interactive && labelValid(label) ? 'interactive' : dragRotate || flip ? 'drag' : 'none';
  return {
    rootRef,
    canvasRef,
    state,
    showCanvas: hasFrame && state !== 'fallback',
    rootClassName: cn(
      isotipoRootVariants(),
      className,
      isotipoRootInvariantVariants(),
      isotipoRootGestureVariants({ mode: gestureMode })
    ),
    canvasClassName: cn(isotipoCanvasVariants({ visible: hasFrame && state !== 'fallback' })),
    svgClassName: cn(isotipoSvgVariants({ visible: !hasFrame || state === 'fallback' })),
    lightClassName: cn(isotipoLightVariants()),
    shadeClassName: cn(isotipoShadeVariants())
  };
}
