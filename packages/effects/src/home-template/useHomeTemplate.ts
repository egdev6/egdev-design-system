import { cn } from '@egdev/ui';
import type { CSSProperties } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { ambientProfiles, createParticleStreaks, resolveAmbientColors } from '../ambient-background/particleStreaks';
import type { DirectorZone, ZoneGeometry } from './homeDirector';
import { computeTargets, deriveBands, resolveZones } from './homeDirector';
import type { HomeTemplateAnchorProps, HomeTemplateProps, HomeTemplateZone } from './types';
import {
  anchorVariants,
  canvasVariants,
  contentVariants,
  fallbackVariants,
  rootVariants,
  vignetteVariants
} from './types';

type Entry = { zone: string; node: HTMLDivElement };
type Register = (zone: string, node: HTMLDivElement) => () => void;
export const HomeTemplateContext = createContext<Register | null>(null);
const warn = (message: string) => {
  if (typeof process === 'undefined' || process.env.NODE_ENV !== 'production') {
    console.warn(message);
  }
};
const opacity = (value: number) => (Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0);

export function useHomeTemplate(props: HomeTemplateProps) {
  const { zoneTable, children, onZoneChange, className, ...rest } = props;
  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLCanvasElement>(null);
  const isotipoRef = useRef<HTMLCanvasElement>(null);
  const callback = useRef(onZoneChange);
  callback.current = onZoneChange;
  const lastNotified = useRef<string | null>(null);
  const remeasure = useRef<(() => void) | null>(null);
  const native = { ...rest } as typeof rest & Record<string, unknown>;
  for (const key of ['style', 'role', 'dangerouslySetInnerHTML', 'ref', 'asChild', 'data-state', 'data-motion']) {
    delete native[key];
  }
  const entries = useRef<Entry[]>([]);
  const validRows = Array.isArray(zoneTable)
    ? zoneTable.filter((row): row is HomeTemplateZone => !!row && typeof row === 'object' && typeof row.id === 'string')
    : [];
  const resolved = resolveZones(validRows);
  const zones = useRef(resolved.zones);
  zones.current = resolved.zones;
  const warned = useRef(new Set<string>());
  const missingSections = useRef(new Set<string>());
  const resolveAnchor = useCallback((zone: string): HTMLDivElement | null => {
    const matches = entries.current.filter((entry) => entry.zone === zone);
    if (!matches.length) {
      return null;
    }
    const valid = zones.current.some((item) => item.id === zone && item.isotipo);
    const cause = valid ? (matches.length > 1 ? 'duplicate' : null) : 'non-3D';
    if (cause) {
      const message = `HomeTemplate: ${cause} anchor: ${zone}`;
      if (!warned.current.has(message)) {
        warned.current.add(message);
        warn(message);
      }
    }
    return valid ? (matches[0]?.node ?? null) : null;
  }, []);
  const refreshAnchors = useCallback(
    (prune: boolean) => {
      const active = new Set<string>();
      for (const zone of new Set(entries.current.map((entry) => entry.zone))) {
        const matches = entries.current.filter((entry) => entry.zone === zone);
        const valid = zones.current.some((item) => item.id === zone && item.isotipo);
        const cause = valid ? (matches.length > 1 ? 'duplicate' : null) : 'non-3D';
        if (cause) {
          active.add(`HomeTemplate: ${cause} anchor: ${zone}`);
        }
      }
      for (const message of warned.current) {
        if (prune && !active.has(message)) {
          warned.current.delete(message);
        }
      }
      for (const zone of new Set(entries.current.map((entry) => entry.zone))) {
        resolveAnchor(zone);
      }
    },
    [resolveAnchor]
  );
  useEffect(() => {
    for (const message of resolved.warnings) {
      warn(message);
    }
  }, [zoneTable]);
  useEffect(() => {
    refreshAnchors(true);
  });
  const register = useCallback<Register>(
    (zone, node) => {
      const entry = { zone, node };
      entries.current.push(entry);
      refreshAnchors(false);
      return () => {
        entries.current = entries.current.filter((item) => item !== entry);
      };
    },
    [refreshAnchors]
  );
  useEffect(() => {
    const root = rootRef.current;
    const content = contentRef.current;
    const canvas = ambientRef.current;
    const isotipo = isotipoRef.current;
    if (!root || !content || !canvas || !isotipo) {
      return;
    }
    let active = true;
    let rows: DirectorZone[] = [];
    let geometry: ZoneGeometry[] = [];
    let valid = false;
    let frame: number | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let motion: MediaQueryList | undefined;
    let observer: ResizeObserver | undefined;
    let engine: ReturnType<typeof createParticleStreaks> = null;
    let failed = false;
    let running = false;
    let profile = '';
    let staticKey = '';
    let size = '';
    let invalidGeometry = '';
    const attempt = (fn: () => void) => {
      try {
        fn();
      } catch {
        /* Fail open. */
      }
    };
    const stop = () => {
      if (engine) {
        attempt(() => engine?.stop());
      }
      running = false;
    };
    const fail = () => {
      failed = true;
      stop();
      attempt(() => engine?.dispose());
      engine = null;
    };
    try {
      const colors = resolveAmbientColors(getComputedStyle(root));
      if (colors) {
        engine = createParticleStreaks(canvas, colors, ambientProfiles.base, fail);
      }
    } catch {
      failed = true;
    }
    try {
      motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    } catch {
      /* Optional service. */
    }
    const update = () => {
      if (!active) {
        return;
      }
      const reduced = motion?.matches === true;
      if (reduced) {
        root.setAttribute('data-motion', 'reduced');
      } else {
        root.removeAttribute('data-motion');
      }
      const targets = valid
        ? computeTargets(
            rows,
            geometry,
            deriveBands(
              geometry,
              window.innerHeight,
              Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
            ),
            window.scrollY,
            window.innerHeight,
            window.innerWidth,
            reduced
          )
        : null;
      isotipo.style.setProperty('--eg-home-isotipo-opacity', '0');
      if (!targets) {
        canvas.style.setProperty('--eg-home-ambient-opacity', '0');
        root.removeAttribute('data-state');
        stop();
        staticKey = '';
        return;
      }
      root.setAttribute('data-state', targets.active);
      if (targets.active !== lastNotified.current) {
        const previous = lastNotified.current;
        lastNotified.current = targets.active;
        callback.current?.({ zone: targets.active, previous });
      }
      canvas.style.setProperty('--eg-home-ambient-opacity', String(opacity(targets.ambient)));
      if (!engine || failed) {
        return;
      }
      try {
        const nextProfile = JSON.stringify(targets.profile);
        if (nextProfile !== profile) {
          engine.set(targets.profile);
          profile = nextProfile;
        }
        const ratio = Math.min(window.devicePixelRatio || 1, 2);
        const nextSize = `${window.innerWidth}:${window.innerHeight}:${ratio}`;
        if (nextSize !== size) {
          engine.resize(window.innerWidth, window.innerHeight, ratio);
          size = nextSize;
        }
        if (document.hidden || targets.ambient <= 0 || window.innerWidth <= 0 || window.innerHeight <= 0) {
          stop();
          staticKey = '';
          return;
        }
        if (!engine.ready()) {
          fail();
          return;
        }
        if (reduced) {
          stop();
          const nextKey = `${nextSize}:${nextProfile}:${targets.ambient}`;
          if (nextKey !== staticKey) {
            engine.renderOnce();
            staticKey = nextKey;
          }
        } else {
          staticKey = '';
          if (!running) {
            engine.start();
            running = true;
          }
        }
      } catch {
        fail();
      }
    };
    const measure = () => {
      if (!active) {
        return;
      }
      try {
        const elements = Array.from(content.querySelectorAll('[data-zone]'));
        const configured = new Set(zones.current.map((zone) => zone.id));
        for (const element of elements) {
          const id = element.getAttribute('data-zone');
          if (id !== null && !configured.has(id)) {
            warn(`HomeTemplate: foreign section: ${id}`);
          }
        }
        const selected: Element[] = [];
        rows = [];
        geometry = [];
        for (const zone of zones.current) {
          const matches = elements.filter((element) => element.getAttribute('data-zone') === zone.id);
          if (matches.length > 1) {
            warn(`HomeTemplate: duplicate section: ${zone.id}`);
          }
          const element = matches[0];
          if (!element) {
            if (!missingSections.current.has(zone.id)) {
              missingSections.current.add(zone.id);
              warn(`HomeTemplate: missing section: ${zone.id}`);
            }
            continue;
          }
          const rect = element.getBoundingClientRect();
          selected.push(element);
          rows.push(zone);
          geometry.push({ top: rect.top + window.scrollY, height: rect.height });
        }
        const order = selected.every(
          (element, index) =>
            index === 0 ||
            !!((selected[index - 1]?.compareDocumentPosition(element) ?? 0) & Node.DOCUMENT_POSITION_FOLLOWING)
        );
        const bands = deriveBands(
          geometry,
          window.innerHeight,
          Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
        );
        valid =
          order &&
          bands.valid &&
          geometry.every((item) => Number.isFinite(item.top) && Number.isFinite(item.height) && item.height > 0);
        if (geometry.length && !valid) {
          const signature = JSON.stringify({
            geometry,
            order,
            viewport: window.innerHeight,
            scrollHeight: document.documentElement.scrollHeight
          });
          if (signature !== invalidGeometry) {
            warn('HomeTemplate: invalid geometry or section order');
            invalidGeometry = signature;
          }
        } else {
          invalidGeometry = '';
        }
      } catch {
        valid = false;
      }
      update();
    };
    const onScroll = () => {
      if (frame === null) {
        frame = requestAnimationFrame(() => {
          frame = null;
          update();
        });
      }
    };
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 150);
    };
    const onVisibility = () => {
      if (document.hidden) {
        update();
      } else {
        measure();
      }
    };
    const onMotion = () => update();
    remeasure.current = measure;
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    window.addEventListener('load', measure);
    document.addEventListener('visibilitychange', onVisibility);
    attempt(() => motion?.addEventListener('change', onMotion));
    attempt(() => {
      observer = new ResizeObserver(measure);
      observer.observe(document.body);
    });
    attempt(() => {
      document.fonts?.ready
        .then(() => {
          if (active) {
            measure();
          }
        })
        .catch(() => {
          /* Fonts are optional. */
        });
    });
    measure();
    return () => {
      active = false;
      remeasure.current = null;
      clearTimeout(timer);
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', measure);
      document.removeEventListener('visibilitychange', onVisibility);
      attempt(() => motion?.removeEventListener('change', onMotion));
      attempt(() => observer?.disconnect());
      stop();
      attempt(() => engine?.dispose());
    };
  }, []);
  useEffect(() => {
    remeasure.current?.();
  }, [zoneTable, children]);
  return {
    children,
    native,
    rootRef,
    contentRef,
    ambientRef,
    isotipoRef,
    register,
    resolveAnchor,
    rootClass: cn(className, rootVariants()),
    ambientClass: cn(canvasVariants({ layer: 'ambient' })),
    isotipoClass: cn(canvasVariants({ layer: 'isotipo' })),
    vignetteClass: cn(vignetteVariants()),
    contentClass: cn(contentVariants()),
    ambientStyle: { '--eg-home-ambient-opacity': opacity(0) } as CSSProperties,
    isotipoStyle: { '--eg-home-isotipo-opacity': opacity(0) } as CSSProperties
  };
}

export function useHomeTemplateAnchor(props: HomeTemplateAnchorProps) {
  const { zone, children, className, ...rest } = props;
  const native = { ...rest } as typeof rest & Record<string, unknown>;
  for (const key of ['style', 'role', 'dangerouslySetInnerHTML', 'ref', 'asChild']) {
    delete native[key];
  }
  const register = useContext(HomeTemplateContext);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (register && ref.current) {
      return register(zone, ref.current);
    }
  }, [register, zone]);
  return { children, native, ref, className: cn(className, anchorVariants()), fallbackClass: cn(fallbackVariants()) };
}
