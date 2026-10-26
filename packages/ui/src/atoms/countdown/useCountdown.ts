import { type ComponentPropsWithoutRef, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import {
  type CountdownProps,
  type CountdownUnits,
  countdownDateVariants,
  countdownLabelVariants,
  countdownNameVariants,
  countdownRootVariants,
  countdownRowVariants,
  countdownStatusVariants,
  countdownUnitVariants,
  countdownValueVariants
} from './types';

type CountdownState = 'initializing' | 'running' | 'expired' | 'unavailable';
type CountdownSample = { deadline: number; seconds: number; expired: boolean };
type CountdownEpisode = { key: number | null; expired: boolean; consumed: boolean };
type UseCountdownReturn = {
  rootProps: ComponentPropsWithoutRef<'div'> & { 'data-state': CountdownState };
  labelProps: { id: string; className: string; children: string };
  row: { className: string; unitClassName: string; valueClassName: string; nameClassName: string } | undefined;
  units: { key: string; value: string; name: string }[];
  time: { id: string; dateTime: string; className: string; children: string } | undefined;
  status: { id: string; className: string; children: string } | undefined;
};

const defaults = {
  label: 'Next event in',
  initializingText: 'Calculating time remaining',
  expiredText: 'Time reached',
  unavailableText: 'Time unavailable'
};
const defaultUnits: CountdownUnits = ['days', 'hours', 'minutes', 'seconds'];
const unitKeys = ['days', 'hours', 'minutes', 'seconds'];

/** Safe-integer Unix milliseconds whose UTC year is 1–9999; nothing is coerced. */
const isValidDeadline = (deadline: unknown): deadline is number => {
  if (typeof deadline !== 'number' || !Number.isSafeInteger(deadline)) {
    return false;
  }
  const year = new Date(deadline).getUTCFullYear();
  return year >= 1 && year <= 9999;
};

const isBlank = (text: unknown): boolean => typeof text !== 'string' || text.trim() === '';

/** Supplied non-blank text, otherwise the documented English fallback. */
const textOr = (text: unknown, fallback: string): string =>
  typeof text === 'string' && !isBlank(text) ? text : fallback;

const isUnits = (units: unknown): units is CountdownUnits =>
  Array.isArray(units) && units.length === 4 && units.every((name) => !isBlank(name));

/** Fixed 86400-second days (unbounded); hours, minutes and seconds padded to two digits. */
const fields = (seconds: number): string[] => [
  String(Math.floor(seconds / 86_400)),
  String(Math.floor((seconds % 86_400) / 3600)).padStart(2, '0'),
  String(Math.floor((seconds % 3600) / 60)).padStart(2, '0'),
  String(seconds % 60).padStart(2, '0')
];

export const useCountdown = ({
  deadline,
  deadlineText,
  label,
  units,
  size = 'md',
  tone = 'inherit',
  onExpire,
  initializingText,
  expiredText,
  unavailableText,
  className,
  'aria-describedby': describedBy,
  ...rest
}: CountdownProps): UseCountdownReturn => {
  const labelId = useId();
  const timeId = useId();
  const statusId = useId();
  const [sample, setSample] = useState<CountdownSample | null>(null);
  const episodeRef = useRef<CountdownEpisode>({ key: null, expired: false, consumed: false });
  const onExpireRef = useRef(onExpire);
  const valid = isValidDeadline(deadline);
  // Adding zero normalizes -0, so both zeros form one episode.
  const key = valid ? deadline + 0 : null;

  const blank = [
    label !== undefined && isBlank(label) ? 'label' : '',
    units !== undefined && !isUnits(units) ? 'units' : '',
    initializingText !== undefined && isBlank(initializingText) ? 'initializingText' : '',
    expiredText !== undefined && isBlank(expiredText) ? 'expiredText' : '',
    unavailableText !== undefined && isBlank(unavailableText) ? 'unavailableText' : '',
    key !== null && isBlank(deadlineText) ? 'deadlineText' : ''
  ]
    .filter(Boolean)
    .join(', ');

  useEffect(() => {
    if (blank) {
      console.warn(`Countdown: blank or invalid ${blank}; using the documented fallback.`);
    }
  }, [blank]);

  useEffect(() => {
    onExpireRef.current = onExpire;
  });

  useEffect(() => {
    // Same key after Strict Mode replay keeps the episode latch; any other key starts a new one.
    if (episodeRef.current.key !== key) {
      episodeRef.current = { key, expired: false, consumed: false };
    }
    if (key === null) {
      setSample(null);
      return;
    }
    const episode = episodeRef.current;
    let disposed = false;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    const cancel = () => {
      if (timeout !== undefined) {
        clearTimeout(timeout);
        timeout = undefined;
      }
    };
    const stop = () => {
      cancel();
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
    const observe = () => {
      if (disposed) {
        return;
      }
      cancel();
      const now = Date.now();
      if (episode.expired || now >= key) {
        stop();
        episode.expired = true;
        setSample({ deadline: key, seconds: 0, expired: true });
        if (!episode.consumed) {
          episode.consumed = true;
          onExpireRef.current?.(key);
        }
        return;
      }
      setSample({ deadline: key, seconds: Math.ceil((key - now) / 1000), expired: false });
      timeout = setTimeout(observe, Math.min(1000, key - now));
    };
    function onVisibilityChange() {
      if (document.visibilityState === 'visible') {
        observe();
      }
    }
    observe();
    if (!episode.expired) {
      document.addEventListener('visibilitychange', onVisibilityChange);
    }
    return () => {
      disposed = true;
      stop();
    };
  }, [key]);

  const current = key !== null && sample?.deadline === key ? sample : undefined;
  const state: CountdownState =
    key === null ? 'unavailable' : current === undefined ? 'initializing' : current.expired ? 'expired' : 'running';
  const statusText = {
    initializing: textOr(initializingText, defaults.initializingText),
    running: undefined,
    expired: textOr(expiredText, defaults.expiredText),
    unavailable: textOr(unavailableText, defaults.unavailableText)
  }[state];
  // Pure UTC ISO conversion of the supplied instant: deterministic on server and client.
  const dateTime = key === null ? undefined : new Date(key).toISOString();
  const time =
    dateTime === undefined
      ? undefined
      : {
          id: timeId,
          dateTime,
          className: cn(countdownDateVariants({ tone })),
          children: textOr(deadlineText, dateTime)
        };
  const names = isUnits(units) ? units : defaultUnits;
  const values = current ? fields(current.seconds) : [];
  const descriptions = [
    ...new Set(
      [describedBy ?? '', time?.id ?? '', statusText === undefined ? '' : statusId]
        .join(' ')
        .split(/\s+/)
        .filter(Boolean)
    )
  ];

  return {
    rootProps: {
      ...rest,
      role: 'timer',
      'aria-label': undefined,
      'aria-labelledby': labelId,
      'aria-live': 'off',
      'aria-atomic': undefined,
      'aria-hidden': undefined,
      'aria-describedby': descriptions.join(' '),
      tabIndex: undefined,
      accessKey: undefined,
      contentEditable: undefined,
      children: undefined,
      dangerouslySetInnerHTML: undefined,
      'data-state': state,
      className: cn(countdownRootVariants({ tone }), className)
    },
    labelProps: {
      id: labelId,
      className: cn(countdownLabelVariants({ tone })),
      children: textOr(label, defaults.label)
    },
    row: current
      ? {
          className: cn(countdownRowVariants()),
          unitClassName: cn(countdownUnitVariants()),
          valueClassName: cn(countdownValueVariants({ size, tone })),
          nameClassName: cn(countdownNameVariants({ tone }))
        }
      : undefined,
    units: current
      ? unitKeys.map((unitKey, index) => ({ key: unitKey, value: values[index] ?? '', name: names[index] ?? '' }))
      : [],
    time,
    status:
      statusText === undefined
        ? undefined
        : { id: statusId, className: cn(countdownStatusVariants({ tone })), children: statusText }
  };
};
