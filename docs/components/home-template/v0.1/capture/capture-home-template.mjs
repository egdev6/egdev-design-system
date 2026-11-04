/**
 * HomeTemplate v0.1 source captures — read-only harness.
 *
 * Captures genuine Chromium screenshots of the owner-granted Pulso reference page
 * (`/home/egdev/proyectos/egdev-website/egdev-foundation/reference-web/pulso-source.html`)
 * at choreography states needed by the HomeTemplate v0.1 spec (odd/tasks/web-catalog.md, H2/S1–S4/S6).
 *
 * Safety invariants enforced here:
 * - The original source file is never modified. A filled copy (template markers resolved to
 *   read-only local assets by absolute file:// URLs) is written ONLY under this capture
 *   directory; its SHA-256 and the full marker map are recorded in harness-meta.json.
 * - No persistent server, detached process or public interface: Chrome runs headless, bound to
 *   loopback CDP only, and is killed in `finally`; its ephemeral profile dir is removed in `finally`.
 * - No source effect math, style or content is altered to manufacture parity; three.js and web
 *   fonts load from their original CDNs exactly as the source page requests them.
 *
 * Output (all paths relative to the capture directory this script lives in; invoke it from its
 * own directory: `cd capture && node capture-home-template.mjs`):
 * - ../home-template--<state>--<viewport>--dark.png (full-viewport captures)
 * - capture/capture-raw.json (per-shot runtime probes + conditions)
 * - capture/harness/harness-meta.json (marker map + hashes)
 *
 * A new capture version must go into a NEW directory (e.g. v0.1/capture-2/) with its own
 * filenames; this script never archives, moves or removes current evidence — any cleanup is a
 * separate, explicitly authorized task. Existing evidence is never overwritten (see preflight).
 */
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC_ROOT = '/home/egdev/proyectos/egdev-website/egdev-foundation';
const SOURCE_HTML = join(SRC_ROOT, 'reference-web/pulso-source.html');
const HARNESS_DIR = join(HERE, 'harness');
const OUT_DIR = join(HERE, '..');
const GLOBAL_TIMEOUT_MS = 150_000;
const sha256 = (p) => createHash('sha256').update(readFileSync(p)).digest('hex');

const MARKERS = {
  '{{WORDMARK}}': join(SRC_ROOT, 'reference-web/assets/logo-wordmark.svg'),
  '{{PHOTO_CANYON}}': join(SRC_ROOT, 'reference-web/assets/photo-canyon.webp'),
  '{{PHOTO_HAZLO}}': join(SRC_ROOT, 'reference-web/assets/photo-hazlo.webp'),
  '{{PHOTO_SETUP}}': join(SRC_ROOT, 'reference-web/assets/photo-setup.webp'),
  '{{TIP_ABORTCONTROLLER}}': join(SRC_ROOT, 'reference-web/assets/tips/abortController.webp'),
  '{{TIP_ALLSETTLED}}': join(SRC_ROOT, 'reference-web/assets/tips/allsettled.webp'),
  '{{TIP_ARIA_CURRENT}}': join(SRC_ROOT, 'reference-web/assets/tips/aria-current.webp'),
  '{{TIP_DETAILS}}': join(SRC_ROOT, 'reference-web/assets/tips/details.webp'),
  '{{TIP_INPUTMODE}}': join(SRC_ROOT, 'reference-web/assets/tips/inputmode.webp'),
  '{{TIP_ISOLATION}}': join(SRC_ROOT, 'reference-web/assets/tips/isolation.webp'),
  '{{TIP_NULLISH}}': join(SRC_ROOT, 'reference-web/assets/tips/nullish.webp'),
  '{{TIP_STARTING_STYLE}}': join(SRC_ROOT, 'reference-web/assets/tips/starting-style.webp'),
  '{{TIP_STICKY}}': join(SRC_ROOT, 'reference-web/assets/tips/sticky.webp'),
  '{{TIP_TOUCH_ACTION}}': join(SRC_ROOT, 'reference-web/assets/tips/touch-action.webp')
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let chromeProc = null;
let currentProfile = null;
const cleanupRun = () => {
  if (chromeProc) {
    try {
      chromeProc.kill('SIGKILL');
    } catch {
      // Best-effort cleanup: keep attempting the remaining owned resources.
    }
  }
  if (currentProfile) {
    try {
      rmSync(currentProfile, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup: keep attempting the remaining owned resources.
    }
  }
};
const globalTimer = setTimeout(() => {
  console.error('GLOBAL TIMEOUT: cleaning up this run, then exiting.');
  cleanupRun();
  process.exit(2);
}, GLOBAL_TIMEOUT_MS);

const OUT_FILES = [
  'home-template--initial-3d--1280x900--dark.png',
  'home-template--layer-handoff--1280x900--dark.png',
  'home-template--ambient-read--1280x900--dark.png',
  'home-template--ambient-live--1280x900--dark.png',
  'home-template--lab-3d--1280x900--dark.png',
  'home-template--outro-3d--1280x900--dark.png',
  'home-template--outro-assembly--1280x900--dark.png',
  'home-template--footer-calma--1280x900--dark.png',
  'home-template--mobile-chapter-gate--390x844--dark.png',
  'home-template--reduced-motion--1280x900--dark.png',
  'capture/capture-raw.json',
  'capture/harness/pulso-capture.html',
  'capture/harness/harness-meta.json'
].map((f) => join(OUT_DIR, f));
// Refuse to touch any existing evidence BEFORE writing files, spawning a browser or cleaning up.
// Existing capture versions are retained evidence: record a NEW capture version (e.g.
// v0.1-capture-2 with its own filenames/directory) instead of overwriting.
const existing = OUT_FILES.filter((f) => existsSync(f));
if (existing.length > 0) {
  console.error(
    `REFUSING TO RUN: existing capture evidence would be overwritten (${existing.length} file(s), first: ${existing[0]}).`
  );
  console.error(
    'Record a new capture version in a new directory (e.g. capture-2/) with its own filenames; do not move or remove current evidence.'
  );
  process.exit(1);
}

async function main() {
  const sourceSha = sha256(SOURCE_HTML);
  let html = readFileSync(SOURCE_HTML, 'utf8');
  const markerMap = {};
  for (const [marker, asset] of Object.entries(MARKERS)) {
    if (!html.includes(marker)) {
      throw new Error(`marker not found in source: ${marker}`);
    }
    markerMap[marker] = { asset: asset.replace(SRC_ROOT + '/', ''), sha256: sha256(asset) };
    html = html.split(marker).join('file://' + asset);
  }
  if (/{{[A-Z_]+}}/.test(html)) {
    throw new Error('unresolved markers remain in harness copy');
  }
  mkdirSync(HARNESS_DIR, { recursive: true });
  const harnessPath = join(HARNESS_DIR, 'pulso-capture.html');
  writeFileSync(harnessPath, html);
  const meta = {
    sourceFile: SOURCE_HTML,
    sourceSha256: sourceSha,
    harnessFile: harnessPath,
    harnessSha256: sha256(harnessPath),
    markerMap,
    note: 'Filled copy exists only under the design-system capture directory; the original source file was not modified. Assets are referenced read-only by absolute file:// URLs.'
  };
  writeFileSync(join(HARNESS_DIR, 'harness-meta.json'), JSON.stringify(meta, null, 1));

  // Uniquely created, owned by THIS run only; cleaned up by exact path in finally/timeout.
  const profile = mkdtempSync(join(HARNESS_DIR, 'profile-'));
  currentProfile = profile;
  chromeProc = spawn(
    '/usr/bin/google-chrome',
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      '--no-default-browser-check',
      '--disable-extensions',
      '--enable-unsafe-swiftshader',
      '--hide-scrollbars',
      'about:blank'
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );
  const chrome = chromeProc;
  let wsUrl = null;
  chrome.stderr.on('data', (d) => {
    const m = String(d).match(/DevTools listening on (ws:\/\/\S+)/);
    if (m && !wsUrl) {
      wsUrl = m[1];
    }
  });
  for (let i = 0; i < 50 && !wsUrl; i++) {
    await sleep(100);
  }
  if (!wsUrl) {
    throw new Error('Chrome did not expose a DevTools endpoint');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = rej;
  });
  let msgId = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}, sessionId) =>
    new Promise((resolve, reject) => {
      const id = ++msgId;
      const payload = { id, method, params };
      if (sessionId) {
        payload.sessionId = sessionId;
      }
      const timer = setTimeout(() => {
        if (pending.has(id)) {
          pending.delete(id);
          reject(new Error(method + ' timed out'));
        }
      }, 20_000);
      pending.set(id, (m) => {
        clearTimeout(timer);
        if (m.error) {
          reject(new Error(method + ': ' + JSON.stringify(m.error)));
        } else {
          resolve(m.result);
        }
      });
      ws.send(JSON.stringify(payload));
    });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const S = (method, params) => send(method, params, sessionId);
  await S('Page.enable');
  await S('Runtime.enable');

  const evalJs = async (expr) => {
    const r = await S('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) {
      throw new Error(
        'evaluate failed: ' + JSON.stringify(r.exceptionDetails.exception?.description || r.exceptionDetails)
      );
    }
    return r.result.value;
  };
  const shot = async (name) => {
    const r = await S('Page.captureScreenshot', { format: 'png' });
    writeFileSync(join(OUT_DIR, name), Buffer.from(r.data, 'base64'));
    console.log('captured', name);
  };
  const probe = () =>
    evalJs(`(() => { const P = window.PULSO; let webgl = false;
    try { const c = document.createElement('canvas'); webgl = !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl'))); } catch (e) {}
    return { zone: P && P.zone, mix: P && P.mix, glA: P && P.glA, ambA: P && P.ambA, u: P && P.u, rm: !!(P && P.rm),
      progress: P && P.p, glOn: document.documentElement.classList.contains('gl-on'),
      glOff: document.documentElement.classList.contains('gl-off'),
      dataFx: document.documentElement.getAttribute('data-fx'), webgl,
      vw: innerWidth, vh: innerHeight, scrollY: Math.round(scrollY),
      fonts: document.fonts ? document.fonts.status : 'unknown',
      ua: navigator.userAgent }; })()`);

  const goto = async () => {
    await S('Page.navigate', { url: 'file://' + harnessPath });
    await evalJs(
      `new Promise(r => { if (document.readyState === 'complete') r(); else addEventListener('load', r, { once: true }); })`
    );
    await evalJs(`document.fonts && document.fonts.ready ? document.fonts.ready.then(() => 1) : 1`);
    await evalJs(`new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))`);
  };

  const shots = [];
  const runState = async (state) => {
    const p = await probe();
    shots.push({ ...state, probe: p });
  };

  // Desktop states, one navigation, sequential scrolls.
  await S('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await goto();
  await sleep(2200); // initial 3D intro (source intro ramp ≈1.2 s) + first frames
  await runState({ id: 'initial-3d-hero', file: 'home-template--initial-3d--1280x900--dark.png' });
  await shot('home-template--initial-3d--1280x900--dark.png');

  const geomExpr = `(() => {
    const vh = innerHeight, sy = scrollY, maxS = Math.max(0, document.documentElement.scrollHeight - vh);
    const zs = [...document.querySelectorAll('[data-zone]')].map(el => ({ name: el.getAttribute('data-zone'), top: el.getBoundingClientRect().top + sy, h: Math.max(1, el.getBoundingClientRect().height) })).sort((a,b) => a.top - b.top);
    const bands = [];
    const Rmax = maxS + vh * 0.5;
    for (let i = 0; i < zs.length - 1; i++) {
      const A = zs[i], B = zs[i+1]; let out = 0.35 * A.h, inn = 0.15 * B.h, sum = out + inn; const minB = 0.75 * vh;
      if (sum < minB) { out *= minB / sum; inn *= minB / sum; }
      let s0 = B.top - out, e0 = B.top + inn;
      if (i === 0 && s0 < vh * 0.5) { e0 += vh * 0.5 - s0; s0 = vh * 0.5; }
      if (e0 > Rmax) { const sh = e0 - Rmax; s0 -= sh; e0 -= sh; }
      if (i > 0 && s0 < bands[i-1].e) s0 = bands[i-1].e;
      bands.push({ a: A.name, b: B.name, s: s0, e: Math.max(s0 + 1, e0) });
    }
    return { vh, maxS, zones: zs, bands };
  })()`;
  // Re-measure before every scroll: the live layout (images, reveals) can shift zone tops after
  // the load-time measurement the director caches, and source CSS sets scroll-behavior:smooth,
  // so every programmatic scroll uses behavior:'instant' and is verified against the observer.
  const measure = () => evalJs(geomExpr);
  let geom = await measure();
  const zone = (n) => geom.zones.find((z) => z.name === n);
  const scrollForR = (R) => Math.max(0, Math.min(geom.maxS, Math.round(R - geom.vh * 0.5)));
  const instantScroll = async (y) => {
    for (let i = 0; i < 4; i++) {
      await evalJs(`scrollTo({ top: ${y}, left: 0, behavior: 'instant' }); 1`);
      await sleep(250);
      const at = await evalJs('Math.round(scrollY)');
      if (Math.abs(at - y) <= 2) {
        return at;
      }
    }
    throw new Error(`scroll did not settle at ${y}`);
  };
  const bandT = (a, b, t) => {
    const bd = geom.bands.find((x) => x.a === a && x.b === b);
    if (!bd) {
      throw new Error('band not found ' + a + '->' + b);
    }
    return scrollForR(bd.s + t * (bd.e - bd.s));
  };

  const states = [
    {
      name: 'layer-handoff-hero-about-t025',
      file: 'home-template--layer-handoff--1280x900--dark.png',
      y: () => bandT('hero', 'about', 0.25)
    },
    {
      name: 'ambient-read-think',
      file: 'home-template--ambient-read--1280x900--dark.png',
      y: () => scrollForR(zone('think').top + zone('think').h * 0.5)
    },
    {
      name: 'ambient-live-live',
      file: 'home-template--ambient-live--1280x900--dark.png',
      y: () => scrollForR(zone('live').top + zone('live').h * 0.5)
    },
    {
      name: 'lab-3d-mid',
      file: 'home-template--lab-3d--1280x900--dark.png',
      y: () => Math.round(zone('lab').top + 0.5 * (zone('lab').h - geom.vh))
    },
    {
      name: 'outro-3d-mid',
      file: 'home-template--outro-3d--1280x900--dark.png',
      y: () => Math.round(zone('outro').top + 0.5 * zone('outro').h - geom.vh)
    },
    {
      name: 'outro-3d-assembled-late',
      file: 'home-template--outro-assembly--1280x900--dark.png',
      y: () => Math.round(zone('outro').top + 0.85 * zone('outro').h - geom.vh)
    },
    { name: 'footer-calma-bottom', file: 'home-template--footer-calma--1280x900--dark.png', y: () => geom.maxS }
  ];
  for (const st of states) {
    geom = await measure();
    const y = st.y();
    const observedY = await instantScroll(y);
    await sleep(500); // director rAF + profile interpolation + 3D pose settle (τ=50 ms)
    await runState({ id: st.name, file: st.file, requestedScrollY: y, observedScrollY: observedY });
    await shot(st.file);
  }

  // Mobile chapter gate (<=760 px source rules). The extracted source HTML carries no viewport
  // meta, so mobile-DEVICE emulation would report a 980 px layout viewport and never engage the
  // 760 px gate; the gate is exercised with a 390 px desktop-style layout viewport instead.
  await S('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: false });
  await goto();
  await sleep(1500);
  const mGeom = await evalJs(`(() => { const sy = scrollY; const el = document.querySelector('[data-zone="chapter"]');
    return { top: el.getBoundingClientRect().top + sy, h: el.getBoundingClientRect().height, vh: innerHeight }; })()`);
  const mY = Math.max(0, Math.round(mGeom.top + mGeom.h * 0.5 - mGeom.vh * 0.5));
  const mObs = await instantScroll(mY);
  await sleep(500);
  await runState({
    id: 'mobile-chapter-gate',
    file: 'home-template--mobile-chapter-gate--390x844--dark.png',
    requestedScrollY: mY,
    observedScrollY: mObs,
    viewport: '390x844@2x desktop-style layout viewport'
  });
  await shot('home-template--mobile-chapter-gate--390x844--dark.png');

  // Reduced motion: emulate media, reload, initial hero state (nearest-zone static frame).
  await S('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
  await S('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await goto();
  await sleep(1200);
  await runState({
    id: 'reduced-motion-hero',
    file: 'home-template--reduced-motion--1280x900--dark.png',
    emulatedMedia: 'prefers-reduced-motion: reduce'
  });
  await shot('home-template--reduced-motion--1280x900--dark.png');

  writeFileSync(
    join(HERE, 'capture-raw.json'),
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        harness: meta,
        geometry: geom,
        shots
      },
      null,
      1
    )
  );
  console.log('DONE shots=' + shots.length);
}

try {
  await main();
} finally {
  clearTimeout(globalTimer);
  cleanupRun();
}
