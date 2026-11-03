import type { PixelProps } from './types';
import { usePixel } from './usePixel';

/** Decorative position marker; its host supplies the meaning. */
export function Pixel(props: PixelProps) {
  const { rootProps } = usePixel(props);
  return <span {...rootProps} />;
}
