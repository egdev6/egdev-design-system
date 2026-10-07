/* EGDEV Foundation · código de referencia extraído de la web EGDEV Pulso (1 oct 2026). Implementación aprobada; portar a componentes respetando su API. */
/* Isotipo 3D (three@0.160.0, import dinámico). Lee el estado del director (window.PULSO). Ver Isotipo3D. */
/* ─────────────────────────────────────────────────────────────────────────
   PULSO · isotipo 3D extruido (three@0.160.0). Lee el estado del DIRECTOR
   (window.PULSO): zona 3D activa, progreso local y opacidad. Si no hay WebGL
   o el import falla, se quedan los isotipos SVG de cada hueco (.fb3d).
   El bucle se detiene cuando la opacidad del canvas es 0.
   El logo se encuadra proyectando su bounding box dentro de la caja ancla
   (#slot-*) y el canvas lleva una máscara alrededor de esa caja: el 3D nunca
   pasa por detrás de textos ni tarjetas.
   ───────────────────────────────────────────────────────────────────────── */
const THREE_URL = 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
const root = document.documentElement;

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}
function fallback(msg, err) {
  root.classList.remove('gl-on');
  root.classList.add('gl-off');
  if (window.PULSO) window.PULSO.wake = null;
  console.info('[Pulso] Isotipo SVG activo: ' + msg, err || '');
}

(async function init() {
  const P = window.PULSO;
  if (!P) { fallback('director no disponible'); return; }
  if (!hasWebGL()) { fallback('WebGL no disponible'); return; }
  let THREE;
  try { THREE = await import(THREE_URL); }
  catch (err) { fallback('no se pudo cargar three.js', err); return; }
  try { boot(THREE, P); }
  catch (err) { fallback('error al montar la escena', err); }
})();

function boot(THREE, P) {
  const canvas = document.getElementById('gl');
  if (!canvas) throw new Error('sin canvas #gl');
  const mqMobile = window.matchMedia('(max-width: 760px)');
  const low = mqMobile.matches || window.matchMedia('(pointer: coarse)').matches;

  const deg = THREE.MathUtils.degToRad;
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp01 = (v) => Math.max(0, Math.min(1, v));
  const smooth = (a, b, v) => { const t = clamp01((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  let seed = 24092026;
  const rnd = () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const rand = (a, b) => a + (b - a) * rnd();

  /* ── Renderer / escena ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 400);

  /* ── Luces: las caras frontales salen casi exactas a la marca
     (key 2.0·cos/π + ambiente 0.6/π + emisivo 0.3 ≈ 1). Los cantos metálicos
     solo recogen las dos luces rojas laterales: filo rojo, sin halo. ── */
  const amb = new THREE.AmbientLight(0xffffff, 0.6);
  const key = new THREE.DirectionalLight(0xffffff, 2.0); key.position.set(-4, 6, 10);
  const rim = new THREE.DirectionalLight(0xFF0036, 5.5); rim.position.set(9, 3.5, -3);
  const rim2 = new THREE.DirectionalLight(0xFF335E, 2.2); rim2.position.set(-8, -3, -4);
  scene.add(amb, key, rim, rim2);

  /* ── ISOTIPO extruido. Las dos caras que se solapaban en el SVG van YA
     RECORTADAS (solo su parte visible), así ninguna tapa comparte plano con
     otra: sin z-fighting. Todas con la misma profundidad, centradas en z=0. ── */
  const VBW = 638.45, VBH = 612.37, S = 0.01;
  const ISO_H = VBH * S;
  const parse = (str) => {
    const a = str.trim().split(/[\s,]+/).map(Number), pts = [];
    for (let i = 0; i < a.length; i += 2) pts.push([(a[i] - VBW / 2) * S, -(a[i + 1] - VBH / 2) * S]);
    const f = pts[0], l = pts[pts.length - 1];
    if (pts.length > 3 && Math.abs(f[0] - l[0]) < 1e-9 && Math.abs(f[1] - l[1]) < 1e-9) pts.pop();
    return pts;
  };
  const LIGHT = 0xE91B35, DARK = 0x800C1D;
  const POLYS = [
    [LIGHT, '415.52 185.14 415.52 231.18 350.31 197.81 350.31 315.25 477.66 382.29 638.45 297.64', 0],
    [DARK, '288.15 152.23 288.15 315.25 160.80 382.29 0 297.64', 0],
    [LIGHT, '0 297.64 288.15 449.34 288.15 612.37 0 466.95', 0],
    [DARK, '638.45 297.64 350.31 449.34 350.31 612.37 638.45 466.95', 0],
    [LIGHT, '432.36 157.09 353.05 116.52 353.05 37.2 432.36 77.77', 1],
    [LIGHT, '521.88 74.4 472.66 49.22 472.66 0 521.88 25.18', 1],
    [LIGHT, '555.8 219.34 487.96 184.64 487.96 116.8 555.8 151.5', 1]
  ];
  const capMat = (c) => new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: 0.3, roughness: 0.62, metalness: 0.04, side: THREE.FrontSide });
  const mCapL = capMat(LIGHT), mCapD = capMat(DARK);
  /* laterales empujados en profundidad: en los cantos siempre gana la tapa */
  const mSide = new THREE.MeshStandardMaterial({ color: 0x5a0a18, emissive: 0x1a0005, roughness: 0.34, metalness: 0.55, side: THREE.FrontSide, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const DEPTH = 44 * S;
  /* sin bisel: el bisel ensancha la pieza fuera del contorno y las vecinas se pisarían */
  const EXTR = { depth: DEPTH, bevelEnabled: false, curveSegments: 1 };
  const shapeOf = (pts, cx, cy) => {
    let v = pts.map((p) => new THREE.Vector2(p[0] - cx, p[1] - cy));
    /* con la Y invertida el orden se da la vuelta: la Shape debe ir en sentido antihorario */
    if (THREE.ShapeUtils.isClockWise(v)) v = v.reverse();
    return new THREE.Shape(v);
  };

  const isoRoot = new THREE.Group(); scene.add(isoRoot);
  const isoGroup = new THREE.Group(); isoRoot.add(isoGroup);
  const PXDIR = new THREE.Vector3(0.72, 0.5, 0.35).normalize();
  const pieces = POLYS.map(([c, str, isPx]) => {
    const pts = parse(str);
    let cx = 0, cy = 0; pts.forEach((p) => { cx += p[0]; cy += p[1]; }); cx /= pts.length; cy /= pts.length;
    const geo = new THREE.ExtrudeGeometry(shapeOf(pts, cx, cy), EXTR); geo.translate(0, 0, -DEPTH / 2); geo.computeVertexNormals();
    const mesh = new THREE.Mesh(geo, [c === LIGHT ? mCapL : mCapD, mSide]);
    mesh.position.set(cx, cy, 0);
    isoGroup.add(mesh);
    const dir = new THREE.Vector3(cx, cy, 0).normalize().add(new THREE.Vector3(rand(-0.5, 0.5), rand(-0.5, 0.5), rand(-1, 1))).normalize();
    return { mesh, home: new THREE.Vector3(cx, cy, 0), dir, dist: isPx ? rand(3.4, 5.2) : rand(2.0, 3.2), rot: new THREE.Vector3(rand(-2, 2), rand(-2, 2), rand(-1.1, 1.1)), px: !!isPx, ph: rand(0, 6.28) };
  });
  /* bounding box del logo montado: es lo que se proyecta para encuadrar */
  isoGroup.updateMatrixWorld(true);
  const BB = new THREE.Box3().setFromObject(isoGroup);
  const CORNERS = [];
  for (let i = 0; i < 8; i++) CORNERS.push(new THREE.Vector3(i & 1 ? BB.max.x : BB.min.x, i & 2 ? BB.max.y : BB.min.y, i & 4 ? BB.max.z : BB.min.z));

  /* píxel de marca (paralelogramo de pendiente .51) */
  const PX_PTS = parse('432.36 157.09 353.05 116.52 353.05 37.2 432.36 77.77');
  function pixelGeo(h, depth) {
    let cx = 0, cy = 0; PX_PTS.forEach((p) => { cx += p[0]; cy += p[1]; }); cx /= PX_PTS.length; cy /= PX_PTS.length;
    const k = h / ((157.09 - 37.2) * S);
    const g = new THREE.ExtrudeGeometry(shapeOf(PX_PTS.map((p) => [(p[0] - cx) * k, (p[1] - cy) * k]), 0, 0), { depth, bevelEnabled: false });
    g.translate(0, 0, -depth / 2);
    return g;
  }

  /* ── Esquirlas del Lab: salen del interior del bloque (solo en lab) ── */
  const mainPolys = POLYS.filter((p) => !p[2]).map((p) => parse(p[1]));
  const inPoly = (x, y, pts) => { let ins = false; for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) ins = !ins; } return ins; };
  const DEB = low ? 44 : 100;
  const debris = new THREE.InstancedMesh(pixelGeo(0.18, 0.07), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x220006, roughness: 0.5, metalness: 0.1 }), DEB);
  debris.frustumCulled = false; debris.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const D = [];
  const cLight = new THREE.Color(LIGHT), cDark = new THREE.Color(DARK);
  for (let i = 0; i < DEB; i++) {
    let x = 0, y = 0, tries = 0;
    do { x = rand(-VBW / 2, VBW / 2) * S; y = rand(-VBH / 2, VBH / 2) * S; tries++; } while (!mainPolys.some((p) => inPoly(x, y, p)) && tries < 40);
    const dir = new THREE.Vector3(x, y, 0).normalize().add(new THREE.Vector3(rand(-0.7, 0.7), rand(-0.7, 0.7), rand(-1.2, 1.2))).normalize();
    D.push({ home: new THREE.Vector3(x, y, rand(-0.15, 0.15)), dir, dist: rand(1.8, 6.5), s: rand(0.5, 1.25), spin: new THREE.Vector3(rand(-3, 3), rand(-3, 3), rand(-2, 2)), ph: rand(0, 6.28) });
    debris.setColorAt(i, rnd() > 0.35 ? cLight : cDark);
  }
  debris.visible = false;
  isoGroup.add(debris);

  /* ── Satélites: pocos píxeles pegados al isotipo, en la diagonal de marca ── */
  const SAT = low ? 5 : 9;
  const sat = new THREE.InstancedMesh(pixelGeo(0.22, 0.06), new THREE.MeshStandardMaterial({ color: 0xFF0036, emissive: 0xFF0036, emissiveIntensity: 0.55, roughness: 0.5, metalness: 0 }), SAT);
  sat.frustumCulled = false; sat.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const SATDIR = new THREE.Vector3(1, 0.51, 0.12).normalize();
  const SA = [];
  for (let i = 0; i < SAT; i++) SA.push({ o: new THREE.Vector3(rand(1.4, 2.6), rand(1.2, 2.4), rand(-0.6, 0.6)), len: rand(0.8, 1.6), sp: rand(0.05, 0.11), ph: rnd(), s: rand(0.45, 1) });
  isoGroup.add(sat);

  /* ── Halo suave (sprite aditivo) ── */
  const hc = document.createElement('canvas'); hc.width = hc.height = 256;
  const hg = hc.getContext('2d'); const gr = hg.createRadialGradient(128, 128, 0, 128, 128, 128);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.25, 'rgba(255,255,255,.42)'); gr.addColorStop(0.6, 'rgba(255,255,255,.08)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  hg.fillStyle = gr; hg.fillRect(0, 0, 256, 256);
  const haloTex = new THREE.CanvasTexture(hc); haloTex.colorSpace = THREE.SRGBColorSpace;
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, color: 0xFF0036, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0.3 }));
  halo.scale.set(9, 9, 1); halo.position.set(0.2, 0.1, -2.2);
  isoRoot.add(halo);

  /* ── Pose por zona (en función del progreso de sección, que da el director).
     Cada pose incluye su caja ancla en pantalla (l, t, w, h) para que entre
     dos zonas el logo viaje de una caja a otra en vez de saltar. ── */
  const ISO_EL = 35.264;
  const SLOT = { hero: document.getElementById('slot-hero'), chapter: document.getElementById('slot-cap'), lab: document.getElementById('slot-lab'), outro: document.getElementById('slot-outro') };
  const POSE_KEYS = ['az', 'el', 'fov', 'ex', 'halo', 'l', 't', 'w', 'h'];
  let W = 1, H = 1;
  function poseOf(z) {
    const el = SLOT[z];
    if (!el) return null;
    const rm = P.rm, p = P.p;
    let o;
    if (z === 'chapter') { const c = rm ? 0.5 : p.chapter; o = { az: lerp(33, 57, c), el: ISO_EL, fov: 10, ex: 0, halo: 0.2 }; }
    else if (z === 'lab') {
      const l = rm ? 0 : p.lab;
      o = { az: lerp(-12, 28, l), el: lerp(4, 16, l), fov: 30, ex: rm ? 0 : smooth(0.06, 0.42, l) * (1 - smooth(0.7, 0.96, l)), halo: 0.35 };
    }
    else if (z === 'outro') {
      /* cierre: de piezas separadas a logo completo en isométrica, según entra la sección */
      const q = rm ? 1 : smooth(0.2, 0.85, p.outro);
      o = { az: lerp(-20, 45, q), el: lerp(12, ISO_EL, q), fov: lerp(26, 12, q), ex: rm ? 0 : 0.9 * (1 - q), halo: 0.08 + 0.2 * q };
    }
    else { const h = rm ? 0 : smooth(0, 0.4, p.hero); o = { az: lerp(-16, 45, h), el: lerp(7, ISO_EL, h), fov: lerp(24, 12, h), ex: 0, halo: 0.3 }; }
    const r = el.getBoundingClientRect();
    let top = r.top;
    if (z === 'hero' && !rm) top += Math.min(window.scrollY || 0, H) * 0.3; /* parallax por scroll */
    o.l = r.left; o.t = top; o.w = Math.max(40, r.width); o.h = Math.max(40, r.height);
    return o;
  }
  function applyShift(sx, sy) {
    const e = camera.projectionMatrix.elements; e[8] = -sx; e[9] = -sy;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
  }
  function layout() {
    W = window.innerWidth; H = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, (low || mqMobile.matches) ? 1.25 : 1.75));
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
  }
  /* coloca la cámara y devuelve el tamaño en px del bounding box proyectado */
  const pv = new THREE.Vector3();
  function placeCamera(dist, az, el, sx, sy) {
    camera.position.set(dist * Math.cos(el) * Math.sin(az), dist * Math.sin(el), dist * Math.cos(el) * Math.cos(az));
    camera.lookAt(0, 0, 0);
    camera.near = Math.max(0.1, dist - 30); camera.far = dist + 40;
    camera.updateProjectionMatrix(); applyShift(sx, sy); camera.updateMatrixWorld();
    let x0 = 1e9, x1 = -1e9, y0 = 1e9, y1 = -1e9;
    for (const c of CORNERS) {
      pv.copy(c).applyMatrix4(isoRoot.matrixWorld).project(camera);
      x0 = Math.min(x0, pv.x); x1 = Math.max(x1, pv.x); y0 = Math.min(y0, pv.y); y1 = Math.max(y1, pv.y);
    }
    return { w: (x1 - x0) * W / 2, h: (y1 - y0) * H / 2 };
  }
  /* máscara del canvas: rectángulo de la caja ancla con un margen que se funde */
  let maskKey = '';
  function setMask(b) {
    let m = 'none';
    if (b) {
      const pad = Math.round(Math.min(b.w, b.h) * 0.14), f = Math.round(Math.min(b.w, b.h) * 0.2);
      const l = Math.round(b.l - pad), r = Math.round(b.l + b.w + pad), t = Math.round(b.t - pad), bt = Math.round(b.t + b.h + pad);
      m = `linear-gradient(90deg,transparent ${l}px,#000 ${l + f}px,#000 ${r - f}px,transparent ${r}px),linear-gradient(180deg,transparent ${t}px,#000 ${t + f}px,#000 ${bt - f}px,transparent ${bt}px)`;
    }
    if (m === maskKey) return; maskKey = m;
    const st = canvas.style;
    st.webkitMaskImage = m; st.maskImage = m;
    st.webkitMaskComposite = 'source-in'; st.maskComposite = 'intersect';
  }

  /* ── Bucle ── */
  const cur = { az: -16, el: 7, fov: 24, ex: 0, halo: 0.3, l: 0, t: 0, w: 100, h: 100, fit: 1 };
  const ptr = { x: 0, y: 0 }, ptrT = { x: 0, y: 0 };
  const dummy = new THREE.Object3D();
  let time = 0, intro = P.rm ? 1 : 0, last = performance.now(), raf = 0, running = false, shown = false, inited = false, zPrev = '', lastW = null;

  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000)); last = now;
    const vis = P.glA;
    if (shown && vis <= 0.003) { running = false; return; } /* opacidad 0: pausa */
    const rm = P.rm;
    time += rm ? 0 : dt;
    intro = rm ? 1 : Math.min(1, intro + dt / 1.2);

    /* pose = mezcla de la pose de A y la de B con la misma t del director */
    const M = P.mix || { a: 'hero', b: 'hero', t: 0 };
    const pa = poseOf(M.a), pb = M.b !== M.a ? poseOf(M.b) : null;
    let w = null;
    if (pa && pb) { w = {}; for (const k of POSE_KEYS) w[k] = lerp(pa[k], pb[k], M.t); }
    else w = pa || pb || lastW;
    if (!w) { running = false; return; }
    lastW = w;
    const z = pa && (!pb || M.t < 0.5) ? M.a : (pb ? M.b : zPrev);
    const snap = rm || !inited || vis < 0.02 || z !== zPrev;
    zPrev = z; inited = true;
    /* solo antitemblor (τ = 50 ms): la pose ya viene del scroll */
    const k = snap ? 1 : 1 - Math.exp(-dt / 0.05);
    for (const key of POSE_KEYS) cur[key] += (w[key] - cur[key]) * k;
    const kf = k;
    const b = { l: cur.l, t: cur.t, w: cur.w, h: cur.h };
    cur.sx = ((b.l + b.w / 2) / W) * 2 - 1; cur.sy = -(((b.t + b.h / 2) / H) * 2 - 1);
    if (rm) { ptr.x = ptr.y = 0; } else { const pk = Math.min(1, dt * 3); ptr.x += (ptrT.x - ptr.x) * pk; ptr.y += (ptrT.y - ptr.y) * pk; }

    /* isotipo: vaivén mínimo, píxeles que se escapan, explosión */
    const exE = cur.ex * cur.ex * (3 - 2 * cur.ex);
    const ie = 1 - Math.pow(1 - intro, 3);
    isoGroup.rotation.y = rm ? 0 : Math.sin(time * 0.3) * 0.02 * (1 - exE);
    isoGroup.scale.setScalar(0.92 + 0.08 * ie);
    isoRoot.updateMatrixWorld(true);

    /* cámara: órbita + desplazamiento de lente al centro de la caja ancla;
       la distancia se corrige proyectando el bounding box para que quepa (90%) */
    const tilt = (!rm && (z === 'hero' || z === 'outro')) ? 1 : 0;
    const az = deg(cur.az + ptr.x * 3 * tilt), el = deg(cur.el - ptr.y * 2 * tilt);
    camera.fov = cur.fov;
    const tanH = Math.tan(deg(cur.fov) / 2);
    const bh = b ? b.h : H * 0.4, bw = b ? b.w : W * 0.4;
    let dist = ISO_H / (2 * tanH * Math.max(0.04, bh / H)) * cur.fit;
    const pr = placeCamera(dist, az, el, cur.sx, cur.sy);
    const need = Math.max(pr.w / (bw * 0.9), pr.h / (bh * 0.9));
    const fitT = cur.fit * (isFinite(need) && need > 0 ? need : 1);
    cur.fit += (fitT - cur.fit) * (snap ? 1 : kf);
    dist = ISO_H / (2 * tanH * Math.max(0.04, bh / H)) * cur.fit;
    placeCamera(dist, az, el, cur.sx, cur.sy);
    setMask(b);

    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      const pi = rm ? 1 : clamp01(intro * 1.5 - i * 0.07), pe = 1 - Math.pow(1 - pi, 3);
      const e = Math.max(exE, (1 - pe) * 0.6);
      const fl = p.px ? (rm ? 0.1 : 0.1 + 0.03 * Math.sin(time * 0.42 + p.ph)) * (1 - exE) : 0; /* vaivén mínimo */
      p.mesh.position.copy(p.home).addScaledVector(PXDIR, fl).addScaledVector(p.dir, e * p.dist);
      p.mesh.rotation.set(p.rot.x * e, p.rot.y * e, p.rot.z * e);
    }
    mCapL.emissiveIntensity = mCapD.emissiveIntensity = 0.3 + exE * 0.15;

    debris.visible = z === 'lab' && exE > 0.003;
    if (debris.visible) {
      const ds = smooth(0, 0.35, exE);
      for (let i = 0; i < DEB; i++) {
        const d = D[i];
        dummy.position.copy(d.home).addScaledVector(d.dir, exE * d.dist);
        dummy.position.y += Math.sin(time * 0.6 + d.ph) * 0.12 * exE;
        dummy.rotation.set(d.spin.x * exE + time * 0.2 * exE, d.spin.y * exE, d.spin.z * exE);
        dummy.scale.setScalar(d.s * ds);
        dummy.updateMatrix(); debris.setMatrixAt(i, dummy.matrix);
      }
      debris.instanceMatrix.needsUpdate = true;
    }
    sat.visible = false; // satélites retirados a petición del usuario
    if (sat.visible) {
      for (let i = 0; i < SAT; i++) {
        const s = SA[i], t = rm ? 0.5 : (s.ph + time * s.sp) % 1;
        dummy.position.copy(s.o).addScaledVector(SATDIR, t * s.len);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(s.s * Math.sin(t * Math.PI) * cur.sat * ie);
        dummy.updateMatrix(); sat.setMatrixAt(i, dummy.matrix);
      }
      sat.instanceMatrix.needsUpdate = true;
    }
    halo.material.opacity = cur.halo * (1 - exE * 0.4);

    renderer.render(scene, camera);
    if (!shown) { shown = true; root.classList.add('gl-on'); if (P.kick) P.kick(); }
    if (rm) { running = false; return; } /* reduced motion: un frame por cambio */
    raf = requestAnimationFrame(frame);
  }
  function start() { if (running || document.hidden) return; running = true; last = performance.now(); raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); raf = 0; }
  P.wake = start;

  let lt = 0;
  window.addEventListener('resize', () => { cancelAnimationFrame(lt); lt = requestAnimationFrame(() => { layout(); if (P.glA > 0.003) start(); }); });
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    ptrT.x = (e.clientX / W) * 2 - 1; ptrT.y = (e.clientY / H) * 2 - 1;
  }, { passive: true });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); else if (P.kick) P.kick(); });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); stop(); fallback('contexto WebGL perdido'); });

  layout();
  start();
}
