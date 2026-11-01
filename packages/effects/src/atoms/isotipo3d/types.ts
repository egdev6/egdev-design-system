import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

type NativeProps = Omit<
  ComponentPropsWithoutRef<'div'>,
  | 'children'
  | 'dangerouslySetInnerHTML'
  | 'style'
  | 'role'
  | 'tabIndex'
  | 'contentEditable'
  | 'autoFocus'
  | 'aria-hidden'
  | 'data-state'
>;

export type Isotipo3DProps = NativeProps & {
  /** Animation scene.
   * @default hero
   * @control select
   */
  scene?: 'hero' | 'chapter' | 'lab' | 'outro';
  /** Local scene progress, clamped to [0, 1].
   * @default 0
   * @control number
   */
  progress?: number;
  /** Decorative layer opacity, clamped to [0, 1].
   * @default 1
   * @control number
   */
  opacity?: number;
  /** Enables mouse-only cosmetic camera tilt.
   * @default true
   * @control boolean
   */
  pointerTilt?: boolean;
  /** Freezes the idle animation loop at the current pose; gestures still repaint and it resumes when false.
   * @default false
   * @control boolean
   */
  paused?: boolean;
  /** Enables drag-to-rotate offsets that spring back to the scene pose on release.
   * @default false
   * @control boolean
   */
  dragRotate?: boolean;
  /** Enables the flip gesture: a drag released past the threshold or a double-click toggles 180°.
   * @default false
   * @control boolean
   */
  flip?: boolean;
  /** Switches to the interactive accessibility model: focusable image role with Arrow-key rotate
   * and Enter/Space flip. Requires a non-empty `label`; without one the component renders its
   * decorative fallback posture and warns in development.
   * @default false
   * @control boolean
   */
  interactive?: boolean;
  /** Required accessible name for `interactive` mode; ignored while decorative.
   * @control text
   */
  label?: string;
  /** Reports the user-driven pose (drag and keyboard offsets in degrees plus the flip state) on
   * gesture changes and on spring-back settle; never for scene or progress prop changes.
   * @control false
   * @controlReason Non-serializable event callback; see DragRotate and InteractiveKeyboard.
   */
  onPoseChange?: (pose: IsotipoPoseChange) => void;
};

/** User-driven pose reported by `onPoseChange`; angles are degrees. */
export type IsotipoPoseChange = { yaw: number; pitch: number; flipped: boolean };

export const isotipoRootVariants = cva('eg-isotipo-3d relative');
export const isotipoRootInvariantVariants = cva(
  'h-full w-full overflow-hidden pointer-events-none opacity-[var(--eg-iso3d-opacity)] bg-transparent bg-none border-0 shadow-none ring-0 ring-offset-0 outline-none'
);
/** Appended by the hook only when a gesture prop is enabled; keeps the default decorative class string unchanged. */
export const isotipoRootGestureVariants = cva('', {
  variants: {
    mode: {
      none: '',
      drag: 'pointer-events-auto',
      interactive: 'pointer-events-auto touch-none'
    }
  }
});
export const isotipoCanvasVariants = cva('absolute inset-0 h-full w-full', {
  variants: { visible: { true: 'block', false: 'hidden' } }
});
export const isotipoSvgVariants = cva('absolute inset-0 h-full w-full', {
  variants: { visible: { true: 'block', false: 'hidden' } }
});
export const isotipoLightVariants = cva('fill-[var(--logo-red)]');
export const isotipoShadeVariants = cva('fill-[var(--logo-red-shade)]');
