import { cn } from '@/lib/cn';
import { type PixelProps, type PixelState, pixelVariants } from './types';

const forbidden = new Set([
  'children',
  'dangerouslySetInnerHTML',
  'role',
  'aria-hidden',
  'aria-label',
  'aria-labelledby',
  'data-state',
  'tabIndex',
  'contentEditable'
]);

export type UsePixelResult = {
  rootProps: Record<string, unknown> & {
    'aria-hidden': true;
    'data-state': PixelState;
    className: string;
  };
};

/** Resolve the consumer-selected appearance and protect decorative semantics. */
export function usePixel(props: PixelProps): UsePixelResult {
  const { state = 'idle', className, ...rest } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(rest)) {
    if (!forbidden.has(key) && !/^on/i.test(key)) {
      passthrough[key] = value;
    }
  }
  return {
    rootProps: {
      ...passthrough,
      'aria-hidden': true,
      'data-state': state,
      className: cn(pixelVariants({ state }), className)
    }
  };
}
