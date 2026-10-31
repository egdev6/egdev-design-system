import { cva } from 'class-variance-authority';
import type { ComponentPropsWithoutRef } from 'react';

export type AmbientBackgroundProfile = 'base' | 'read' | 'live';

export type AmbientBackgroundProps = Omit<ComponentPropsWithoutRef<'div'>, 'children'> & {
  /** Particle density and motion profile.
   * @default base
   * @control select
   */
  profile?: AmbientBackgroundProfile;
  /** Layer opacity, clamped to [0, 1]; non-finite values become zero.
   * @default 1
   * @control number
   */
  opacity?: number;
};

export const ambientRootVariants = cva(
  'eg-ambient-background absolute inset-0 pointer-events-none bg-ambient-bg opacity-[var(--eg-ambient-opacity)]'
);
export const ambientCanvasVariants = cva('block h-full w-full forced-colors:hidden');
