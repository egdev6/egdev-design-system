import { cn } from '@egdev/ui';
import type { CSSProperties } from 'react';
import { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { resolveZones } from './homeDirector';
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
  const { zoneTable, children, onZoneChange: _change, className, ...rest } = props;
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
  return {
    children,
    native,
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
