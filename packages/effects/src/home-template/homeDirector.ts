import { ambientProfiles } from '../ambient-background/particleStreaks';

type ProfileName = keyof typeof ambientProfiles;
type Scene = 'hero' | 'chapter' | 'lab' | 'outro';
export type DirectorZoneInput = {
  id: string;
  isotipo?: boolean;
  ambient?: number;
  profile?: ProfileName;
  scene?: Scene;
  mobileIsotipo?: boolean;
};
export type DirectorZone = {
  id: string;
  isotipo: boolean;
  ambient: number;
  profile: ProfileName;
  scene?: Scene;
  mobileIsotipo: boolean;
};
export type ZoneGeometry = { top: number; height: number };
export type BandTable = { valid: boolean; bands: { start: number; end: number }[] };
const clamp = (n: number) => Math.max(0, Math.min(1, n));

export function resolveZones(input: readonly DirectorZoneInput[]): { zones: DirectorZone[]; warnings: string[] } {
  const zones: DirectorZone[] = [];
  const warnings: string[] = [];
  const ids = new Set<string>();
  for (const zone of input) {
    if (ids.has(zone.id)) {
      warnings.push(`Duplicate zone: ${zone.id}`);
      continue;
    }
    ids.add(zone.id);
    let isotipo = zone.isotipo === true;
    let ambient = zone.ambient === undefined ? (isotipo ? 0 : 1) : Number.isNaN(zone.ambient) ? 0 : clamp(zone.ambient);
    if (isotipo && zone.ambient !== undefined && ambient > 0) {
      ambient = 0;
      warnings.push(`Conflicting ownership: ${zone.id}`);
    }
    const scene =
      zone.scene === 'hero' || zone.scene === 'chapter' || zone.scene === 'lab' || zone.scene === 'outro'
        ? zone.scene
        : undefined;
    if (isotipo && !scene) {
      isotipo = false;
      ambient = 1;
      warnings.push(`Invalid scene: ${zone.id}`);
    }
    const profile = zone.profile === 'read' || zone.profile === 'live' ? zone.profile : 'base';
    zones.push({
      id: zone.id,
      isotipo,
      ambient,
      profile,
      mobileIsotipo: zone.mobileIsotipo !== false,
      ...(isotipo && scene ? { scene } : {})
    });
  }
  return { zones, warnings };
}

export function deriveBands(zones: readonly ZoneGeometry[], viewport: number, maxScroll: number): BandTable {
  const bands: BandTable['bands'] = [];
  for (let i = 0; i < zones.length - 1; i++) {
    const a = zones[i];
    const b = zones[i + 1];
    if (!a || !b) {
      continue;
    }
    let out = 0.35 * a.height;
    let incoming = 0.15 * b.height;
    const sum = out + incoming;
    const minimum = 0.75 * viewport;
    if (sum < minimum) {
      out *= minimum / sum;
      incoming *= minimum / sum;
    }
    let start = b.top - out;
    let end = b.top + incoming;
    if (i === 0 && start < 0.5 * viewport) {
      end += 0.5 * viewport - start;
      start = 0.5 * viewport;
    }
    const rmax = maxScroll + 0.5 * viewport;
    if (end > rmax) {
      const shift = end - rmax;
      start -= shift;
      end -= shift;
    }
    const previous = bands[i - 1];
    if (previous && start < previous.end) {
      start = previous.end;
    }
    bands.push({ start, end: Math.max(start + 1, end) });
  }
  const valid =
    zones.length > 0 &&
    Number.isFinite(viewport) &&
    viewport > 0 &&
    Number.isFinite(maxScroll) &&
    bands.every(
      (band, i) =>
        Number.isFinite(band.start) &&
        Number.isFinite(band.end) &&
        band.end - band.start >= 0.75 * viewport &&
        (i !== 0 || band.start >= 0.5 * viewport) &&
        (i !== bands.length - 1 || band.end <= maxScroll + 0.5 * viewport) &&
        (i === 0 || band.start >= (bands[i - 1]?.end ?? Infinity))
    );
  return { valid, bands };
}

export function computeTargets(
  zones: readonly DirectorZone[],
  geometry: readonly ZoneGeometry[],
  table: BandTable,
  scrollY: number,
  viewport: number,
  width: number,
  reducedMotion: boolean
) {
  if (!table.valid || !zones.length || zones.length !== geometry.length || table.bands.length !== zones.length - 1) {
    return null;
  }
  const reading = scrollY + 0.5 * viewport;
  let index = 0;
  for (let i = 0; i < geometry.length; i++) {
    if ((geometry[i]?.top ?? Infinity) <= reading) {
      index = i;
    }
  }
  const current = geometry[index];
  if (!current) {
    return null;
  }
  const nextTop = geometry[index + 1]?.top ?? current.top + current.height;
  const position = index + clamp((reading - current.top) / Math.max(1, nextTop - current.top));
  let ai = zones.length - 1;
  let bi = ai;
  let t = 0;
  for (let i = 0; i < table.bands.length; i++) {
    const band = table.bands[i];
    if (!band) {
      continue;
    }
    if (reading < band.start) {
      ai = i;
      bi = i;
      break;
    }
    if (reading <= band.end) {
      ai = i;
      bi = i + 1;
      t = (reading - band.start) / (band.end - band.start);
      break;
    }
  }
  if (reducedMotion) {
    t = t < 0.5 ? 0 : 1;
  }
  const a = zones[ai];
  const b = zones[bi];
  if (!a || !b) {
    return null;
  }
  const layer = (z: DirectorZone) =>
    width <= 760 && !z.mobileIsotipo && z.isotipo
      ? { isotipo: 0, ambient: 1 }
      : { isotipo: z.isotipo ? 1 : 0, ambient: z.ambient };
  const la = layer(a);
  const lb = layer(b);
  const segment = (x: number, y: number) =>
    x > 0 && y > 0 ? x + (y - x) * t : x * Math.max(0, 1 - 2 * t) + y * Math.max(0, 2 * t - 1);
  let isotipo = segment(la.isotipo, lb.isotipo);
  let ambient = segment(la.ambient, lb.ambient);
  if (isotipo < 0.002) {
    isotipo = 0;
  }
  if (ambient < 0.002) {
    ambient = 0;
  }
  if (isotipo > 0 && ambient > 0) {
    if (t < 0.5) {
      ambient = 0;
    } else {
      isotipo = 0;
    }
  }
  const pa = ambientProfiles[a.profile];
  const pb = ambientProfiles[b.profile];
  const lerp = (key: keyof typeof pa) => pa[key] + (pb[key] - pa[key]) * t;
  const scale = width < 700 ? 0.6 : 1;
  const profile = {
    lineCount: Math.round(lerp('lineCount') * scale),
    squareCount: Math.round(lerp('squareCount') * scale),
    speedMultiplier: Math.round(lerp('speedMultiplier') * 1000) / 1000,
    backgroundGlowOpacity: Math.round(lerp('backgroundGlowOpacity') * 10000) / 10000
  };
  return { position, active: t < 0.5 ? a.id : b.id, mix: { a: a.id, b: b.id, t }, isotipo, ambient, profile };
}
