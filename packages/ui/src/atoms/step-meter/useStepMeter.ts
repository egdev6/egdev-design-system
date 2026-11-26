import { cn } from '@/lib/cn';
import { type StepMeterProps, stepMeterStepVariants, stepMeterVariants } from './types';

const DEFAULT_STEPS = 4;
const MAX_STEPS = 10;

// Protected at untyped boundaries too: label owns the accessible name and the steps own the content, so none of
// these may reach the root. `ref` is dropped as well because React 19 delivers it to function components as a prop.
const forbidden = new Set([
  'children',
  'dangerouslySetInnerHTML',
  'role',
  'aria-label',
  'aria-labelledby',
  'aria-hidden',
  'aria-live',
  'aria-valuemin',
  'aria-valuemax',
  'aria-valuenow',
  'aria-valuetext',
  'data-state',
  'title',
  'tabIndex',
  'contentEditable',
  'ref'
]);

export type StepMeterStepState = 'filled' | 'empty';

export type StepMeterStep = {
  /** Stable zero-based position of the step in the scale, used as its React key. */
  position: number;
  'data-state': StepMeterStepState;
  className: string;
};

export type UseStepMeterResult = {
  valid: boolean;
  rootProps: Record<string, unknown> & {
    role: 'img';
    'aria-label': string;
    className: string;
  };
  steps: StepMeterStep[];
};

/** Name the image from label, resolve the step count and the filled run, and compose the root class. */
export function useStepMeter(props: StepMeterProps): UseStepMeterResult {
  const { label, value, steps, className, ...rest } = props;
  const passthrough: Record<string, unknown> = {};
  for (const [key, entry] of Object.entries(rest)) {
    if (!forbidden.has(key) && !/^on/i.test(key)) {
      passthrough[key] = entry;
    }
  }
  const named = typeof label === 'string' && label.trim().length > 0;
  const measured = typeof value === 'number' && Number.isFinite(value);
  // Same development-only guard as NowCard; each invalid input has its own warning and nothing is rendered.
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    if (!named) {
      console.warn('StepMeter requires a non-empty label. Nothing was rendered.');
    }
    if (!measured) {
      console.warn('StepMeter requires a finite numeric value. Nothing was rendered.');
    }
  }
  // An invalid total is not a consumer error worth a warning: it silently falls back to the default.
  const total =
    typeof steps === 'number' && Number.isInteger(steps) && steps >= 1 && steps <= MAX_STEPS ? steps : DEFAULT_STEPS;
  // Floor, never round, so the level is never overstated; then keep it inside the scale.
  const filled = measured ? Math.min(Math.max(Math.floor(value), 0), total) : 0;
  return {
    valid: named && measured,
    rootProps: {
      ...passthrough,
      role: 'img',
      'aria-label': label,
      className: cn(stepMeterVariants(), className)
    },
    steps: Array.from({ length: total }, (_, position) => ({
      position,
      'data-state': position < filled ? 'filled' : 'empty',
      className: stepMeterStepVariants()
    }))
  };
}
