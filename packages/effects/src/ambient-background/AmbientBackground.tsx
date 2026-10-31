import type { CSSProperties } from 'react';
import { forwardRef, useImperativeHandle } from 'react';
import type { AmbientBackgroundProps } from './types';
import { useAmbientBackground } from './useAmbientBackground';

/** Decorative, container-sized particle layer. */
export const AmbientBackground = forwardRef<HTMLDivElement, AmbientBackgroundProps>(function AmbientBackground(
  { profile = 'base', opacity = 1, className, style, ...native },
  ref
) {
  const { rootRef, canvasRef, state, normalized, rootClassName, canvasClassName } = useAmbientBackground(
    profile,
    opacity,
    className
  );
  useImperativeHandle(ref, () => rootRef.current as HTMLDivElement, [rootRef]);
  const safeNative = Object.fromEntries(
    Object.entries(native).filter(
      ([key]) =>
        key !== 'children' &&
        key !== 'dangerouslySetInnerHTML' &&
        key !== 'tabIndex' &&
        key !== 'contentEditable' &&
        key !== 'role'
    )
  );
  return (
    <div
      {...safeNative}
      ref={rootRef}
      className={rootClassName}
      style={{ ...style, '--eg-ambient-opacity': normalized } as CSSProperties}
      aria-hidden='true'
      data-state={state}
    >
      <canvas ref={canvasRef} className={canvasClassName} />
    </div>
  );
});
