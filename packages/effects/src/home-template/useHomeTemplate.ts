import { cn } from '@egdev/ui';
import type { CSSProperties } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ambientProfiles, createParticleStreaks, resolveAmbientColors } from '../ambient-background/particleStreaks';
import { isotipoCreateScene } from '../atoms/isotipo3d/isotipoScene';
import type { DirectorZone, ZoneGeometry } from './homeDirector';
import { computeTargets, deriveBands, resolveZones } from './homeDirector';
import { computeTravel, sceneProgress } from './homeTravel';
import type { HomeTemplateAnchorProps, HomeTemplateProps, HomeTemplateZone } from './types';
import {
  anchorVariants,
  canvasVariants,
  contentVariants,
  fallbackVariants,
  rootVariants,
  vignetteVariants
} from './types';

type Entry = { zone: string; node: HTMLDivElement; painted: boolean; notify: (painted: boolean) => void };
type Register = (zone: string, node: HTMLDivElement, notify: (painted: boolean) => void) => () => void;
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
  const anchorObserver = useRef<ResizeObserver | null>(null);
  const updateIsotipo = useRef<
    | ((state: {
        targets: ReturnType<typeof computeTargets>;
        rows: DirectorZone[];
        geometry: ZoneGeometry[];
        sections: Element[];
        reduced: boolean;
        generation: number;
      }) => void)
    | null
  >(null);
  const native = { ...rest } as typeof rest & Record<string, unknown>;
  for (const key of ['style', 'role', 'dangerouslySetInnerHTML', 'ref', 'asChild', 'data-state', 'data-motion']) {
    delete native[key];
  }
  const entries = useRef<Entry[]>([]);
  const paint = useCallback((nodes: readonly HTMLDivElement[], allowNew: boolean) => {
    for (const entry of entries.current) {
      const next = nodes.includes(entry.node) && (allowNew || entry.painted);
      if (entry.painted !== next) {
        entry.painted = next;
        entry.notify(next);
      }
    }
  }, []);
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
    (zone, node, notify) => {
      const entry: Entry = { zone, node, notify, painted: false };
      notify(false);
      entries.current.push(entry);
      try {
        anchorObserver.current?.observe(node);
      } catch {
        /* Optional service. */
      }
      refreshAnchors(false);
      return () => {
        paint([], false);
        entries.current = entries.current.filter((item) => item !== entry);
        try {
          anchorObserver.current?.unobserve(node);
        } catch {
          /* Optional service. */
        }
        remeasure.current?.();
      };
    },
    [paint, refreshAnchors]
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
    let sections: Element[] = [];
    let valid = false;
    let generation = 0;
    let frame: number | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let motion: MediaQueryList | undefined;
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
      updateIsotipo.current?.({ targets, rows, geometry, sections, reduced, generation });
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
      generation++;
      paint([], false);
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
        sections = selected;
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
      anchorObserver.current = new ResizeObserver((changes) => {
        if (!changes.length || changes.some((change) => change.target === document.body)) {
          measure();
        } else {
          onScroll();
        }
      });
      attempt(() => anchorObserver.current?.observe(document.body));
      for (const entry of entries.current) {
        attempt(() => anchorObserver.current?.observe(entry.node));
      }
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
      attempt(() => anchorObserver.current?.disconnect());
      anchorObserver.current = null;
      stop();
      attempt(() => engine?.dispose());
    };
  }, []);
  useEffect(() => {
    const root = rootRef.current;
    const canvas = isotipoRef.current;
    if (!root || !canvas || !zones.current.some((zone) => zone.isotipo)) {
      return;
    }
    const controller = new AbortController();
    let active = true;
    let scene: Awaited<ReturnType<typeof isotipoCreateScene>> | null = null;
    let frame: number | null = null;
    let last: number | null = null;
    let time = 0;
    let intro = 0;
    let size = '';
    let staticKey = '';
    let drawState: {
      name: NonNullable<DirectorZone['scene']>;
      progress: number;
      travel: NonNullable<ReturnType<typeof computeTravel>>;
      nodes: HTMLDivElement[];
      refresh: () => ReturnType<typeof computeTravel>;
    } | null = null;
    let coarse: MediaQueryList | undefined;
    const stop = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      frame = null;
      last = null;
    };
    const dispose = () => {
      const previous = scene;
      scene = null;
      try {
        previous?.dispose();
      } catch {
        /* Fail open. */
      }
    };
    const fail = () => {
      active = false;
      controller.abort();
      stop();
      paint([], false);
      dispose();
      canvas.style.setProperty('--eg-home-isotipo-opacity', '0');
    };
    const draw = (now: number) => {
      frame = null;
      if (!active || !scene || !drawState) {
        return;
      }
      try {
        const travel = drawState.refresh();
        if (!travel) {
          paint([], false);
          stop();
          canvas.style.setProperty('--eg-home-isotipo-opacity', '0');
          return;
        }
        drawState.travel = travel;
        const dt = last === null ? 0 : Math.max(0, Math.min(0.05, (now - last) / 1000));
        last = now;
        time += dt;
        intro = Math.min(1, intro + dt / 1.2);
        scene.render(
          drawState.name,
          drawState.progress,
          false,
          { time, intro, pose: drawState.travel.pose },
          drawState.travel.projection
        );
        paint(drawState.nodes, true);
        frame = requestAnimationFrame(draw);
      } catch {
        fail();
      }
    };
    const update: NonNullable<typeof updateIsotipo.current> = ({
      targets,
      rows,
      geometry,
      sections,
      reduced,
      generation
    }) => {
      if (!active || !scene || !targets || targets.isotipo <= 0 || document.hidden) {
        paint([], false);
        stop();
        staticKey = '';
        canvas.style.setProperty('--eg-home-isotipo-opacity', '0');
        return;
      }
      try {
        const endpoint = (id: string) => {
          const index = rows.findIndex((zone) => zone.id === id);
          const zone = rows[index];
          const section = sections[index];
          const bounds = geometry[index];
          if (
            !zone?.isotipo ||
            !zone.scene ||
            !section ||
            !bounds ||
            (window.innerWidth <= 760 && !zone.mobileIsotipo)
          ) {
            return null;
          }
          const node = resolveAnchor(id);
          const rect = node?.getBoundingClientRect();
          let sticky = false;
          for (let parent = node?.parentElement; parent && section.contains(parent); parent = parent.parentElement) {
            if (getComputedStyle(parent).position === 'sticky') {
              sticky = true;
            }
            if (parent === section) {
              break;
            }
          }
          return {
            scene: zone.scene,
            node,
            geometry: bounds,
            anchor: rect ? { left: rect.left, top: rect.top, width: rect.width, height: rect.height } : null,
            sticky
          };
        };
        const first = endpoint(targets.mix.a);
        const second = endpoint(targets.mix.b);
        const a = first ?? second;
        const b = second ?? first;
        if (!a || !b) {
          paint([], false);
          stop();
          staticKey = '';
          canvas.style.setProperty('--eg-home-isotipo-opacity', '0');
          return;
        }
        const viewport = { width: window.innerWidth, height: window.innerHeight };
        const travel = computeTravel(a, b, targets.mix.t, window.scrollY, viewport, reduced);
        if (!travel) {
          paint([], false);
          stop();
          staticKey = '';
          canvas.style.setProperty('--eg-home-isotipo-opacity', '0');
          return;
        }
        const nodes = [a.node, b.node].filter((node): node is HTMLDivElement => node !== null);
        paint(nodes, false);
        const ratio = window.devicePixelRatio || 1;
        const nextSize = `${viewport.width}:${viewport.height}:${ratio}:${coarse?.matches === true}`;
        if (size !== nextSize) {
          scene.resize(viewport.width, viewport.height, ratio, coarse?.matches === true);
          size = nextSize;
        }
        const chosen = reduced && targets.mix.t >= 0.5 ? b : a;
        const progress = sceneProgress(chosen.scene, chosen.geometry, window.scrollY, viewport.height, chosen.sticky);
        canvas.style.setProperty('--eg-home-isotipo-opacity', String(opacity(targets.isotipo)));
        if (reduced) {
          stop();
          const key = JSON.stringify([chosen.scene, progress, travel.projection, nextSize, generation]);
          if (key !== staticKey) {
            scene.render(chosen.scene, progress, true, { time: 0, intro: 1 }, travel.projection);
            paint(nodes, true);
            staticKey = key;
          }
        } else {
          staticKey = '';
          drawState = {
            name: a.scene,
            progress,
            travel,
            nodes,
            refresh: () => {
              const currentFirst = endpoint(targets.mix.a);
              const currentSecond = endpoint(targets.mix.b);
              const currentA = currentFirst ?? currentSecond;
              const currentB = currentSecond ?? currentFirst;
              return currentA && currentB
                ? computeTravel(currentA, currentB, targets.mix.t, window.scrollY, viewport, false)
                : null;
            }
          };
          if (frame === null) {
            frame = requestAnimationFrame(draw);
          }
        }
      } catch {
        fail();
      }
    };
    const onCoarse = () => remeasure.current?.();
    let dprMedia: MediaQueryList | undefined;
    const onDprChange = () => {
      try {
        dprMedia?.removeEventListener('change', onDprChange);
        dprMedia = window.matchMedia(`(resolution: ${window.devicePixelRatio || 1}dppx)`);
        dprMedia.addEventListener('change', onDprChange);
      } catch {
        /* Optional service. */
      }
      remeasure.current?.();
    };
    const contextLost = (event: Event) => {
      event.preventDefault();
      fail();
    };
    try {
      const style = getComputedStyle(root);
      const colors = [
        '--logo-red',
        '--logo-red-shade',
        '--color-primitive-red-neon',
        '--color-primitive-red-light'
      ].map((name) => style.getPropertyValue(name).trim());
      const [light, shade, neon, redLight] = colors;
      if (
        !light ||
        !shade ||
        !neon ||
        !redLight ||
        colors.some((color) => !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color)) ||
        !(canvas.getContext('webgl2') || canvas.getContext('webgl'))
      ) {
        return;
      }
      updateIsotipo.current = update;
      try {
        coarse = window.matchMedia('(pointer: coarse)');
        coarse.addEventListener('change', onCoarse);
        onDprChange();
      } catch {
        /* Optional service. */
      }
      canvas.addEventListener('webglcontextlost', contextLost);
      isotipoCreateScene(canvas, { light, shade, neon, redLight }, controller.signal)
        .then((created) => {
          if (!active) {
            try {
              created.dispose();
            } catch {
              /* Fail open. */
            }
            return;
          }
          scene = created;
          remeasure.current?.();
        })
        .catch(() => {
          if (active) {
            fail();
          }
        });
    } catch {
      fail();
    }
    return () => {
      active = false;
      controller.abort();
      stop();
      paint([], false);
      updateIsotipo.current = null;
      canvas.style.setProperty('--eg-home-isotipo-opacity', '0');
      try {
        coarse?.removeEventListener('change', onCoarse);
        dprMedia?.removeEventListener('change', onDprChange);
      } catch {
        /* Optional service. */
      }
      canvas.removeEventListener('webglcontextlost', contextLost);
      dispose();
    };
  }, [zoneTable]);
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
  const [painted, setPainted] = useState(false);
  useEffect(() => {
    if (register && ref.current) {
      return register(zone, ref.current, setPainted);
    }
  }, [register, zone]);
  return {
    children,
    native,
    ref,
    painted,
    className: cn(className, anchorVariants()),
    fallbackClass: cn(fallbackVariants())
  };
}
