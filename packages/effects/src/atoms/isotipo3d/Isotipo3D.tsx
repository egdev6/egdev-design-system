import { type CSSProperties, forwardRef, useImperativeHandle } from 'react';
import { isotipoNormalizeProgress } from './isotipoScene';
import type { Isotipo3DProps } from './types';
import { useIsotipo3D } from './useIsotipo3D';

/**
 * Decorative, container-sized isotype with a stationary SVG fallback.
 * `className` supports outer layout and positioning; recognized size, clipping,
 * pointer, opacity and paint conflicts yield to the component invariants.
 * Arbitrary CSS and unrecognized utilities are not guaranteed overrides.
 * Opt-in interaction: `dragRotate`/`flip` add pointer gestures to the decorative
 * layer; `interactive` requires `label` and switches to a focusable image role
 * with Arrow-key rotate and Enter/Space flip.
 */
export const Isotipo3D = forwardRef<HTMLDivElement, Isotipo3DProps>(function Isotipo3D(
  {
    scene = 'hero',
    progress = 0,
    opacity = 1,
    pointerTilt = true,
    paused = false,
    dragRotate = false,
    flip = false,
    interactive = false,
    label,
    onPoseChange,
    className,
    ...native
  },
  ref
) {
  const normalizedScene = scene === 'chapter' || scene === 'lab' || scene === 'outro' ? scene : 'hero';
  const normalizedOpacity = isotipoNormalizeProgress(opacity);
  const hook = useIsotipo3D(
    normalizedScene,
    isotipoNormalizeProgress(progress),
    normalizedOpacity,
    native.hidden === true,
    pointerTilt === true,
    className,
    {
      paused: paused === true,
      dragRotate: dragRotate === true,
      flip: flip === true,
      interactive: interactive === true,
      label,
      onPoseChange
    }
  );
  useImperativeHandle(ref, () => hook.rootRef.current as HTMLDivElement, [hook.rootRef]);
  const safeNative = Object.fromEntries(
    Object.entries(native).filter(
      ([key]) =>
        ![
          'children',
          'dangerouslysetinnerhtml',
          'style',
          'role',
          'tabindex',
          'contenteditable',
          'autofocus',
          'aria-hidden',
          'data-state'
        ].includes(key.toLowerCase())
    )
  );
  return (
    <div
      {...safeNative}
      ref={hook.rootRef}
      className={hook.rootClassName}
      style={{ '--eg-iso3d-opacity': normalizedOpacity } as CSSProperties}
      {...(interactive === true && typeof label === 'string' && label.trim().length > 0
        ? { role: 'img', tabIndex: 0, 'aria-label': label }
        : { 'aria-hidden': true as const })}
      data-state={hook.state}
    >
      <canvas ref={hook.canvasRef} className={hook.canvasClassName} hidden={!hook.showCanvas} aria-hidden='true' />
      <svg
        className={hook.svgClassName}
        {...(hook.showCanvas ? { hidden: true } : {})}
        aria-hidden='true'
        focusable='false'
        viewBox='-20 -20 678.45 652.37'
        preserveAspectRatio='xMidYMid meet'
      >
        <polygon
          className={hook.lightClassName}
          points='415.52 185.14 415.52 231.18 350.31 197.81 350.31 315.25 638.45 466.95 638.45 297.64 415.52 185.14'
        />
        <polygon className={hook.shadeClassName} points='288.15 152.23 288.15 315.25 0 466.95 0 297.64 288.15 152.23' />
        <polygon className={hook.lightClassName} points='0 297.64 288.15 449.34 288.15 612.37 0 466.95 0 297.64' />
        <polygon
          className={hook.shadeClassName}
          points='638.45 297.64 350.31 449.34 350.31 612.37 638.45 466.95 638.45 297.64'
        />
        <polygon
          className={hook.lightClassName}
          points='432.36 157.09 353.05 116.52 353.05 37.2 432.36 77.77 432.36 157.09'
        />
        <polygon className={hook.lightClassName} points='521.88 74.4 472.66 49.22 472.66 0 521.88 25.18 521.88 74.4' />
        <polygon
          className={hook.lightClassName}
          points='555.8 219.34 487.96 184.64 487.96 116.8 555.8 151.5 555.8 219.34'
        />
      </svg>
    </div>
  );
});
