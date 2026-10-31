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
};

export const isotipoRootVariants = cva('eg-isotipo-3d relative');
export const isotipoRootInvariantVariants = cva(
  'h-full w-full overflow-hidden pointer-events-none opacity-[var(--eg-iso3d-opacity)] bg-transparent bg-none border-0 shadow-none ring-0 ring-offset-0 outline-none'
);
export const isotipoCanvasVariants = cva('absolute inset-0 h-full w-full', {
  variants: { visible: { true: 'block', false: 'hidden' } }
});
export const isotipoSvgVariants = cva('absolute inset-0 h-full w-full', {
  variants: { visible: { true: 'block', false: 'hidden' } }
});
export const isotipoLightVariants = cva('fill-[var(--logo-red)]');
export const isotipoShadeVariants = cva('fill-[var(--logo-red-shade)]');
