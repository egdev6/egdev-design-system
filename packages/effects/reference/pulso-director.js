/* EGDEV Foundation · código de referencia extraído de la web EGDEV Pulso (1 oct 2026). Implementación aprobada; portar a componentes respetando su API. */
/* Director de coreografía por % de scroll + motor de partículas + UI de la página. Ver HomeTemplate y AmbientBackground. */
/* ═══════════════════════════════════════════════════════════════════════════
   COREOGRAFÍA DE EFECTOS · TODO va por % de scroll (nada por tiempo)
   ---------------------------------------------------------------------------
   Fuente de verdad única: DIRECTOR (más abajo). Punto de lectura fijo R =
   scrollY + 50% del viewport. Posición continua u = índice de zona + fracción
   (R − top de la zona) / (top de la siguiente − top de la zona).
   BANDAS: entre la zona A y la siguiente B hay una banda de mezcla que ocupa
   el último 35% de A y el primer 15% de B (mínimo 0.75 vh, misma proporción;
   la última banda se desplaza para que acabe antes del final del scroll).
   t = posición lineal de R dentro de la banda (0..1). Fuera de bandas: valores
   puros de la zona. Si paras el scroll a mitad, todo se queda a mitad.
   REGLA DE CAPAS: si cambia la capa dominante (3D ↔ fondo), la saliente baja
   lineal de 1 a 0 en la 1ª mitad de la banda y la entrante sube de 0 a 1 en la
   2ª: nunca están las dos > 0. La capa a 0 para su bucle (fx.stop() / pausa
   del render 3D).
   Se interpola con t: opacidad de capas, multiplicadores del fondo
   (lineCount y squareCount redondeados, speedMultiplier, glow) y la pose 3D
   (az, el, fov, explosión, halo y la caja ancla donde se encuadra el logo).
   Dentro de cada zona 3D su animación propia va por progreso de sección.
   Solo queda un antitemblor de τ = 50 ms en la cámara 3D.
   El 3D vive SOLO dentro de una caja ancla vacía (#slot-*), con máscara.

   Zona       | Manda        | 3D isotipo (#gl)                            | Fondo ParticleStreaks (#ambient)        | Nav
   -----------+--------------+---------------------------------------------+-----------------------------------------+-----------
   hero       | 3D           | 1 · gira de frontal a isométrica con scroll | 0 · fx.stop()                           | –
   about      | fondo        | 0 · pausa                                   | 1 · config original                     | –
   build      | fondo        | 0 · pausa                                   | 1 · config original                     | Build
   chapter    | 3D (breve)   | 1 · isométrica, gira 33°→57° con scroll     | 0 · fx.stop() (en móvil: 1, original)   | –
              |              |   (en móvil: 0, SVG)                        |                                         |
   think      | lectura      | 0 · pausa                                   | 1 · líneas 20, cuadrados 25, vel .6     | Think
   blog       | lectura      | 0 · pausa                                   | 1 · líneas 20, cuadrados 25, vel .6     | Blog
   lab        | 3D           | 1 · EXPLOTA con el scroll y se recompone    | 0 · fx.stop()                           | Lab
   live       | fondo intenso| 0 · pausa                                   | 1 · líneas 110, cuadr. 120, vel 1.4,    | Live
              |              |                                             |     glow .18                            |
   community  | foto         | 0 · pausa                                   | 1 · config original                     | Community
   discord    | fondo        | 0 · pausa                                   | 1 · config original                     | Community
   outro      | 3D (cierre)  | 1 · se ENSAMBLA con el scroll: de piezas    | 0 · fx.stop()                           | –
              |              |   separadas a logo isométrico completo      |                                         |
   footer     | calma        | 0 · pausa                                   | 0.25 · perfil de lectura                | –
   -----------+--------------+---------------------------------------------+-----------------------------------------+-----------
   Entre dos zonas de la tabla los valores se interpolan con t (ver BANDAS).
   Móvil (<700px): recuentos del fondo al 60%. 3D en hero, Lab y cierre.
   prefers-reduced-motion: valores de la zona más cercana (t redondeado),
   sin interpolación ni animación; fondo con fx.renderOnce(); 3D en poses fijas.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  "use strict";
  var root = document.documentElement;
  var RM = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  var MQ3D = window.matchMedia ? window.matchMedia("(max-width: 760px)") : { matches: false };
  var MOBFX = window.innerWidth < 700;

  var ZONES = {
    hero:      { gl: 1, amb: 0,    prof: "base", nav: "" },
    about:     { gl: 0, amb: 1,    prof: "base", nav: "about" },
    build:     { gl: 0, amb: 1,    prof: "base", nav: "build" },
    chapter:   { gl: 1, amb: 0,    prof: "base", nav: "" },
    think:     { gl: 0, amb: 1,    prof: "read", nav: "think" },
    blog:      { gl: 0, amb: 1,    prof: "read", nav: "blog" },
    lab:       { gl: 1, amb: 0,    prof: "base", nav: "lab" },
    live:      { gl: 0, amb: 1,    prof: "live", nav: "live" },
    community: { gl: 0, amb: 1,    prof: "base", nav: "community" },
    discord:   { gl: 0, amb: 1,    prof: "base", nav: "community" },
    outro:     { gl: 1, amb: 0,    prof: "base", nav: "" },
    footer:    { gl: 0, amb: 0.25, prof: "read", nav: "" }
  };
  /* en móvil el capítulo no lleva 3D (se queda su SVG); hero, Lab y cierre sí */
  function applyMobileZones() {
    var m = !!MQ3D.matches;
    ZONES.chapter.gl = m ? 0 : 1; ZONES.chapter.amb = m ? 1 : 0;
    root.classList.toggle("gl-mob", m);
  }
  applyMobileZones();

  /* estado compartido con el módulo 3D */
  var P = window.PULSO = {
    zone: "hero", glA: 0, ambA: 0, u: 0,
    mix: { a: "hero", b: "hero", t: 0 },
    p: { hero: 0, chapter: 0.5, lab: 0, outro: 1 },
    rm: !!RM.matches, wake: null, kick: null
  };

  /* ═════════ FONDO · ParticleStreaks: port fiel del motor de Quique (Particle Studio, camzuna.com/anim) con SU config exportada ═════════ */
  const PARTICLE_CONFIG = {
    angle: 315, speedMultiplier: 1,
    backgroundColor: "#060103",
    backgroundGlow: true, backgroundGlowOpacity: 0.1, backgroundGlowX: 50, backgroundGlowY: 50, backgroundGlowRadius: 0.6, backgroundGlowColor: "#b40a1e",
    blendMode: "screen",
    lineCount: 70, lineSpeedMin: 1.5, lineSpeedMax: 4.5, lineLengthMin: 180, lineLengthMax: 390, lineWidthMin: 0.8, lineWidthMax: 2,
    lineOpacityMin: 0.25, lineOpacityMax: 0.85, lineGlow: 5, lineGlowOpacity: 0.3, lineColor: "#950e20", lineGlowColor: "#4d000d",
    squareCount: 90, squareSpeedMin: 0.8, squareSpeedMax: 2.6, squareSizeMin: 6, squareSizeMax: 28, squareOpacityMin: 0.1, squareOpacityMax: 0.95,
    squareRotation: 45, squareSpinSpeed: 0, squareGlow: 14, squareGlowOpacity: 0.25, squareColor: "#e6001a", squareGlowColor: "#ff2244",
    squareBorderColor: "#ff4d66", squareBorderWidth: 0, squareFilled: true, squareScaleEffect: true, squareFadeEffect: true,
    squareOpacityCycleDuration: 10, streamClustering: false, clusterIntensity: 0.5
  };

  function hexToRgb(hex) {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
  }

  function createParticleStreaks(canvas, overrides = {}) {
    const cfg = { ...PARTICLE_CONFIG, ...overrides };
    const ctx = canvas.getContext('2d', { alpha: false });
    let width = 0, height = 0, animId = 0, running = false, lastTime = performance.now(), idc = 0;
    const lines = [], squares = [];
    const rand = (a, b) => a + Math.random() * (b - a);

    let spriteCanvas = null, lastGlowKey = '';
    const spriteBaseInner = 40;
    function updateSquareSprite() {
      const key = `${cfg.squareColor}_${cfg.squareGlowColor}_${cfg.squareGlow}_${cfg.squareGlowOpacity}_${cfg.squareBorderWidth}_${cfg.squareBorderColor}_${cfg.squareFilled}`;
      if (key === lastGlowKey && spriteCanvas) return; lastGlowKey = key;
      spriteCanvas = spriteCanvas || document.createElement('canvas');
      spriteCanvas.width = 512; spriteCanvas.height = 512;
      const s = spriteCanvas.getContext('2d'); s.clearRect(0, 0, 512, 512);
      const c = 256, inner = spriteBaseInner;
      if (cfg.squareGlow > 0 && cfg.squareGlowOpacity > 0) {
        const r = Math.min(230, inner * 0.6 + cfg.squareGlow * 4.5), rgb = hexToRgb(cfg.squareGlowColor), o = cfg.squareGlowOpacity;
        const g = s.createRadialGradient(c, c, inner * 0.15, c, c, r);
        g.addColorStop(0, `rgba(${rgb}, ${Math.min(1, o * 1.2)})`);
        g.addColorStop(0.25, `rgba(${rgb}, ${o * 0.75})`);
        g.addColorStop(0.6, `rgba(${rgb}, ${o * 0.25})`);
        g.addColorStop(0.85, `rgba(${rgb}, ${o * 0.06})`);
        g.addColorStop(1, 'rgba(0,0,0,0)');
        s.fillStyle = g; s.beginPath(); s.arc(c, c, r, 0, Math.PI * 2); s.fill();
      }
      s.save(); s.translate(c, c); s.beginPath(); s.rect(-inner / 2, -inner / 2, inner, inner);
      if (cfg.squareFilled) { s.fillStyle = cfg.squareColor; s.fill(); }
      if (cfg.squareBorderWidth > 0) { s.strokeStyle = cfg.squareBorderColor; s.lineWidth = cfg.squareBorderWidth * 1.5; s.stroke(); }
      s.restore();
    }

    let lineSprite = null, lastLineKey = '';
    function updateLineSprite() {
      const key = `${cfg.lineGlowColor}_${cfg.lineGlow}_${cfg.lineGlowOpacity}`;
      if (key === lastLineKey && lineSprite) return; lastLineKey = key;
      lineSprite = lineSprite || document.createElement('canvas');
      lineSprite.width = 1024; lineSprite.height = 256;
      const l = lineSprite.getContext('2d'); l.clearRect(0, 0, 1024, 256);
      if (cfg.lineGlow <= 0) return;
      const cx = 512, cy = 128, rgb = hexToRgb(cfg.lineGlowColor), mo = cfg.lineGlowOpacity ?? 0.7, passes = 32;
      for (let p = passes; p >= 1; p--) {
        const t = p / passes, w = 1024 * (0.15 + 0.85 * Math.sqrt(t)), h = 256 * (Math.pow(1 - t, 1.5) * 0.9 + 0.02);
        const a = mo * Math.pow(1 - t, 2.2) * 0.22;
        const g = l.createLinearGradient(cx - w / 2, cy, cx + w / 2, cy);
        g.addColorStop(0, `rgba(${rgb}, 0)`); g.addColorStop(0.12, `rgba(${rgb}, ${a * 0.3})`);
        g.addColorStop(0.5, `rgba(${rgb}, ${a})`); g.addColorStop(0.88, `rgba(${rgb}, ${a * 0.3})`); g.addColorStop(1, `rgba(${rgb}, 0)`);
        l.fillStyle = g; l.beginPath(); l.ellipse(cx, cy, w / 2, Math.max(1, h / 2), 0, 0, Math.PI * 2); l.fill();
      }
    }

    let coreSprite = null, lastCore = '';
    function updateCoreSprite() {
      if (cfg.lineColor === lastCore && coreSprite) return; lastCore = cfg.lineColor;
      coreSprite = coreSprite || document.createElement('canvas');
      coreSprite.width = 512; coreSprite.height = 16;
      const k = coreSprite.getContext('2d'); k.clearRect(0, 0, 512, 16);
      const rgb = hexToRgb(cfg.lineColor), g = k.createLinearGradient(0, 0, 512, 0);
      g.addColorStop(0, `rgba(${rgb}, 0)`); g.addColorStop(0.18, `rgba(${rgb}, 0.5)`); g.addColorStop(0.5, `rgba(${rgb}, 1)`);
      g.addColorStop(0.82, `rgba(${rgb}, 0.5)`); g.addColorStop(1, `rgba(${rgb}, 0)`);
      k.fillStyle = g; k.fillRect(0, 0, 512, 16);
    }

    const dirVec = deg => { const r = ((deg - 90) * Math.PI) / 180; return { dx: Math.cos(r), dy: Math.sin(r), perpX: -Math.sin(r), perpY: Math.cos(r) }; };
    const diag = () => Math.hypot(width, height) + 400;
    function laneOffset(i, total, d) {
      const span = d * 1.5, slot = span / Math.max(1, total), base = (i + 0.5) * slot - span / 2;
      if (cfg.streamClustering) { const u = base / (span / 2); return Math.pow(Math.abs(u), 1 + cfg.clusterIntensity * 1.5) * Math.sign(u) * (span / 2); }
      return base;
    }
    function initLine(randomStart, laneId, total) {
      const d = diag(), maxD = d * 1.2, dist = randomStart ? Math.random() * maxD : 0, sp = rand(cfg.lineSpeedMin, cfg.lineSpeedMax) * 60, mo = rand(cfg.lineOpacityMin, cfg.lineOpacityMax);
      return { id: ++idc, laneId, laneOffset: laneOffset(laneId, total, d), distance: dist, maxDistance: maxD, currentSpeed: sp,
        length: rand(cfg.lineLengthMin, cfg.lineLengthMax), width: rand(cfg.lineWidthMin, cfg.lineWidthMax), opacity: mo, maxOpacity: mo, progress: dist / maxD, x: 0, y: 0 };
    }
    function initSquare(randomStart, laneId, total) {
      const d = diag(), maxD = d * 1.2, dist = randomStart ? Math.random() * maxD : 0, sp = rand(cfg.squareSpeedMin, cfg.squareSpeedMax) * 60, size = rand(cfg.squareSizeMin, cfg.squareSizeMax);
      return { id: ++idc, laneId, laneOffset: laneOffset(laneId, total, d), distance: dist, maxDistance: maxD, currentSpeed: sp,
        baseSize: size, opacity: cfg.squareOpacityMin, opacityPhase: Math.random() * Math.PI * 2, rotation: cfg.squareRotation, progress: dist / maxD, x: 0, y: 0 };
    }
    function initParticles() {
      lines.length = 0; squares.length = 0;
      const total = Math.max(1, cfg.lineCount + cfg.squareCount);
      for (let i = 0; i < cfg.lineCount; i++) lines.push(initLine(true, i, total));
      for (let i = 0; i < cfg.squareCount; i++) squares.push(initSquare(true, cfg.lineCount + i, total));
    }
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2), rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      canvas.width = Math.floor(width * dpr); canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    function frame(now, dt) {
      const dir = dirVec(cfg.angle), d = diag(), cx = width / 2, cy = height / 2, total = Math.max(1, cfg.lineCount + cfg.squareCount);
      updateSquareSprite(); updateLineSprite(); updateCoreSprite();
      while (lines.length < cfg.lineCount) lines.push(initLine(false, lines.length, total));
      while (lines.length > cfg.lineCount) lines.pop();
      while (squares.length < cfg.squareCount) squares.push(initSquare(false, cfg.lineCount + squares.length, total));
      while (squares.length > cfg.squareCount) squares.pop();

      ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
      ctx.fillStyle = cfg.backgroundColor; ctx.fillRect(0, 0, width, height);
      if (cfg.backgroundGlow && cfg.backgroundGlowOpacity > 0) {
        const gx = width * (cfg.backgroundGlowX / 100), gy = height * (cfg.backgroundGlowY / 100), gr = Math.max(width, height) * cfg.backgroundGlowRadius;
        const rgb = hexToRgb(cfg.backgroundGlowColor), op = cfg.backgroundGlowOpacity;
        const g = ctx.createRadialGradient(gx, gy, 10, gx, gy, gr);
        g.addColorStop(0, `rgba(${rgb}, ${op})`); g.addColorStop(0.4, `rgba(${rgb}, ${op * 0.4})`); g.addColorStop(0.75, `rgba(${rgb}, ${op * 0.1})`); g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g; ctx.fillRect(0, 0, width, height);
      }
      ctx.globalCompositeOperation = cfg.blendMode || 'screen';
      const ang = Math.atan2(dir.dy, dir.dx);
      for (let i = 0; i < lines.length; i++) {
        const l = lines[i];
        l.distance += l.currentSpeed * cfg.speedMultiplier * dt; l.progress = l.distance / l.maxDistance;
        if (l.progress >= 1) { lines[i] = initLine(false, l.laneId, total); continue; }
        const sx = cx - dir.dx * (d * 0.6) + dir.perpX * l.laneOffset, sy = cy - dir.dy * (d * 0.6) + dir.perpY * l.laneOffset;
        l.x = sx + dir.dx * l.distance; l.y = sy + dir.dy * l.distance;
        let op = l.maxOpacity; if (l.progress < 0.15) op *= l.progress / 0.15; else if (l.progress > 0.85) op *= (1 - l.progress) / 0.15;
        l.opacity = Math.max(0, Math.min(1, op));
        const half = l.length / 2;
        ctx.save(); ctx.translate(l.x - dir.dx * half, l.y - dir.dy * half); ctx.rotate(ang);
        if (cfg.lineGlow > 0 && lineSprite) { const gl = l.length + cfg.lineGlow * 3.6, gh = l.width * 2 + cfg.lineGlow * 3.2; ctx.globalAlpha = l.opacity; ctx.drawImage(lineSprite, -gl / 2, -gh / 2, gl, gh); }
        ctx.globalAlpha = l.opacity; ctx.drawImage(coreSprite, -half, -l.width / 2, l.length, l.width);
        ctx.restore();
      }
      const t = now / 1000, cyc = Math.max(3, Math.min(20, cfg.squareOpacityCycleDuration));
      for (let i = 0; i < squares.length; i++) {
        const q = squares[i];
        q.distance += q.currentSpeed * cfg.speedMultiplier * dt; q.progress = q.distance / q.maxDistance;
        if (q.progress >= 1) { squares[i] = initSquare(false, q.laneId, total); continue; }
        const sx = cx - dir.dx * (d * 0.6) + dir.perpX * q.laneOffset, sy = cy - dir.dy * (d * 0.6) + dir.perpY * q.laneOffset;
        q.x = sx + dir.dx * q.distance; q.y = sy + dir.dy * q.distance;
        const osc = 0.5 * (1 + Math.sin(t * (Math.PI * 2) / cyc + q.opacityPhase));
        let o = cfg.squareOpacityMin + osc * (cfg.squareOpacityMax - cfg.squareOpacityMin);
        if (cfg.squareFadeEffect) { if (q.progress < 0.15) o *= q.progress / 0.15; else if (q.progress > 0.85) o *= (1 - q.progress) / 0.15; }
        q.opacity = Math.max(0, Math.min(1, o));
        let size = q.baseSize; if (cfg.squareScaleEffect) size *= 0.7 + Math.sin(q.progress * Math.PI) * 0.45;
        const sf = size / spriteBaseInner;
        ctx.save(); ctx.translate(q.x, q.y); ctx.rotate((q.rotation * Math.PI) / 180); ctx.scale(sf, sf); ctx.globalAlpha = q.opacity;
        ctx.drawImage(spriteCanvas, -256, -256, 512, 512); ctx.restore();
      }
      ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
    }
    function loop(now) { const dt = Math.min((now - lastTime) / 1000, 0.1); lastTime = now; frame(now, dt); if (running) animId = requestAnimationFrame(loop); }

    window.addEventListener('resize', resize); resize();
    return {
      config: cfg,
      set(patch) { Object.assign(cfg, patch); },
      start() { if (running) return; running = true; lastTime = performance.now(); animId = requestAnimationFrame(loop); },
      stop() { running = false; cancelAnimationFrame(animId); },
      renderOnce() { frame(performance.now(), 0); },
      get running() { return running; }
    };
  }
  /* ═════════ fin del motor ═════════ */

  /* multiplicadores por zona (la estética base no se toca) */
  var cv = document.getElementById("ambient"), fx = null;
  try { fx = cv && cv.getContext ? createParticleStreaks(cv) : null; } catch (e) { fx = null; }
  var MF = MOBFX ? 0.6 : 1;
  var PROF = {
    base: { lineCount: 70, squareCount: 90, speedMultiplier: 1, backgroundGlowOpacity: 0.1 },
    read: { lineCount: 20, squareCount: 25, speedMultiplier: 0.6, backgroundGlowOpacity: 0.1 },
    live: { lineCount: 110, squareCount: 120, speedMultiplier: 1.4, backgroundGlowOpacity: 0.18 }
  };
  /* multiplicadores interpolados con el scroll entre el perfil de A y el de B */
  var fxKey = "";
  function applyProfile(pa, pb, t) {
    if (!fx) return false;
    var A = PROF[pa] || PROF.base, B = PROF[pb] || PROF.base;
    function L(k) { return A[k] + (B[k] - A[k]) * t; }
    var o = {
      lineCount: Math.round(L("lineCount") * MF),
      squareCount: Math.round(L("squareCount") * MF),
      speedMultiplier: Math.round(L("speedMultiplier") * 1000) / 1000,
      backgroundGlowOpacity: Math.round(L("backgroundGlowOpacity") * 10000) / 10000
    };
    var key = o.lineCount + "|" + o.squareCount + "|" + o.speedMultiplier + "|" + o.backgroundGlowOpacity;
    if (key === fxKey) return false;
    fxKey = key; fx.set(o); return true;
  }
  applyProfile("base", "base", 0);
  function ambStart() {
    if (!fx || document.hidden) return;
    if (RM.matches) { fx.stop(); fx.renderOnce(); return; }
    if (!fx.running) fx.start();
  }
  function ambStop() { if (fx && fx.running) fx.stop(); }

  /* ---------------- NAV ---------------- */
  var nav = document.getElementById("nav");
  var navLinks = document.querySelectorAll("[data-nav]");
  var activeNav = null;
  function setActive(id) {
    if (id === activeNav) return; activeNav = id;
    for (var i = 0; i < navLinks.length; i++) {
      var on = navLinks[i].getAttribute("data-nav") === id;
      navLinks[i].classList.toggle("active", on);
      if (on) navLinks[i].setAttribute("aria-current", "true"); else navLinks[i].removeAttribute("aria-current");
    }
  }

  /* ---------------- DIRECTOR · fuente de verdad: todo en función del scroll ---------------- */
  var glCv = document.getElementById("gl");
  var labStage = document.querySelector(".lab-stage");
  var zEls = [].slice.call(document.querySelectorAll("[data-zone]"));
  var Z = [], byName = {}, vh = window.innerHeight, maxS = 0, labSticky = true;
  var lastAmbDraw = "", sY = 0;
  function clamp01(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }
  function measure() {
    vh = window.innerHeight;
    var sy = window.scrollY || 0;
    maxS = Math.max(0, root.scrollHeight - vh);
    Z = zEls.map(function (el) {
      var r = el.getBoundingClientRect(), name = el.getAttribute("data-zone");
      return { name: name, z: ZONES[name], top: r.top + sy, h: Math.max(1, r.height) };
    }).filter(function (z) { return z.z; }).sort(function (a, b) { return a.top - b.top; });
    byName = {}; Z.forEach(function (z) { byName[z.name] = z; });
    /* bandas: último 35% de la saliente + primer 15% de la entrante (mín. 0.75 vh) */
    var Rmax = maxS + vh * 0.5;
    for (var i = 0; i < Z.length - 1; i++) {
      var A = Z[i], B = Z[i + 1], out = 0.35 * A.h, inn = 0.15 * B.h, sum = out + inn, minB = 0.75 * vh;
      if (sum < minB) { out *= minB / sum; inn *= minB / sum; }
      var s0 = B.top - out, e0 = B.top + inn;
      if (i === 0 && s0 < vh * 0.5) { e0 += vh * 0.5 - s0; s0 = vh * 0.5; } /* arriba del todo, el hero empieza puro */
      if (e0 > Rmax) { var sh = e0 - Rmax; s0 -= sh; e0 -= sh; }
      if (i > 0 && s0 < Z[i - 1].bandE) s0 = Z[i - 1].bandE;
      A.bandS = s0; A.bandE = Math.max(s0 + 1, e0);
    }
    labSticky = !!(labStage && getComputedStyle(labStage).position === "sticky" && byName.lab && byName.lab.h > vh * 1.3);
  }
  /* si una de las dos capas vale 0 el cruce es secuencial (1ª mitad baja, 2ª sube) */
  function seg(a, b, t) {
    if (a > 0 && b > 0) return a + (b - a) * t;
    return a * Math.max(0, 1 - 2 * t) + b * Math.max(0, 2 * t - 1);
  }
  function compute() {
    var sy = window.scrollY || 0;
    sY = sy;
    if (!Z.length) return null;
    var R = sy + vh * 0.5;
    /* posición continua u = índice de zona + fracción */
    var i = 0;
    for (var k = 0; k < Z.length; k++) if (Z[k].top <= R) i = k;
    var nt = i < Z.length - 1 ? Z[i + 1].top : Z[i].top + Z[i].h;
    P.u = i + clamp01((R - Z[i].top) / Math.max(1, nt - Z[i].top));
    /* estado: zona pura o mezcla A→B dentro de su banda */
    var a = Z.length - 1, b = a, t = 0;
    for (var j = 0; j < Z.length - 1; j++) {
      if (R < Z[j].bandS) { a = b = j; break; }
      if (R <= Z[j].bandE) { a = j; b = j + 1; t = (R - Z[j].bandS) / (Z[j].bandE - Z[j].bandS); break; }
    }
    if (RM.matches) t = t < 0.5 ? 0 : 1; /* zona más cercana, sin interpolación */
    var h = byName.hero, c = byName.chapter, l = byName.lab, o = byName.outro;
    if (h) P.p.hero = clamp01(sy / h.h);
    if (c) P.p.chapter = clamp01((sy + vh - c.top) / (c.h + vh));
    if (l) P.p.lab = labSticky ? clamp01((sy - l.top) / Math.max(1, l.h - vh)) : clamp01((sy + vh * 0.6 - l.top) / l.h);
    if (o) P.p.outro = clamp01((sy + vh - o.top) / o.h);
    return { A: Z[a], B: Z[b], t: t };
  }
  function direct() {
    var st = compute();
    if (!st) return;
    var rm = !!RM.matches, A = st.A.z, B = st.B.z, t = st.t;
    P.rm = rm;
    var gl = seg(A.gl, B.gl, t), amb = seg(A.amb, B.amb, t);
    if (gl < 0.002) gl = 0;
    if (amb < 0.002) amb = 0;
    if (gl > 0 && amb > 0) { if (t < 0.5) amb = 0; else gl = 0; } /* compuerta de seguridad */
    var near = t < 0.5 ? st.A : st.B;
    P.zone = near.name;
    P.mix = { a: st.A.name, b: st.B.name, t: t };
    /* fondo */
    P.ambA = amb;
    if (fx) {
      cv.style.opacity = amb.toFixed(3);
      if (amb > 0) {
        applyProfile(A.prof, B.prof, t);
        if (rm) { var sig = fxKey + "|" + amb.toFixed(2); if (sig !== lastAmbDraw) { lastAmbDraw = sig; ambStart(); } }
        else ambStart();
      } else ambStop();
    }
    /* 3D */
    P.glA = gl;
    if (glCv && root.classList.contains("gl-on")) glCv.style.opacity = gl.toFixed(3);
    if (gl > 0 && P.wake) P.wake();
    /* nav */
    setActive(near.z.nav);
    nav.classList.toggle("scrolled", sY > 24 || !mnav.hidden);
    root.setAttribute("data-fx", P.zone);
  }
  /* sin suavizado temporal: un cálculo por frame cuando hay scroll o cambia el layout */
  var dRaf = 0;
  function dFrame() { dRaf = 0; direct(); }
  function dKick() { if (!dRaf) dRaf = requestAnimationFrame(dFrame); }
  P.kick = dKick;

  var menuBtn = document.getElementById("menuBtn"), mnav = document.getElementById("mnav");
  measure(); direct(0.016);
  window.addEventListener("scroll", dKick, { passive: true });
  var rt = 0;
  window.addEventListener("resize", function () {
    clearTimeout(rt);
    rt = setTimeout(function () { applyMobileZones(); measure(); lastAmbDraw = ""; dKick(); }, 150);
  });
  if ("ResizeObserver" in window) { var ro = new ResizeObserver(function () { measure(); dKick(); }); ro.observe(document.body); }
  window.addEventListener("load", function () { measure(); dKick(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { measure(); dKick(); });
  document.addEventListener("visibilitychange", function () { if (document.hidden) ambStop(); else { lastAmbDraw = ""; dKick(); } });
  if (RM.addEventListener) RM.addEventListener("change", function () { lastAmbDraw = ""; P.rm = !!RM.matches; if (RM.matches) ambStop(); dKick(); });

  /* ---------------- MENÚ MÓVIL ---------------- */
  function closeMenu() { mnav.hidden = true; menuBtn.setAttribute("aria-expanded", "false"); menuBtn.setAttribute("aria-label", "Abrir menú"); dKick(); }
  menuBtn.addEventListener("click", function () {
    var open = mnav.hidden; mnav.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open)); menuBtn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
    dKick();
  });
  mnav.addEventListener("click", function (e) { if (e.target.closest("a")) closeMenu(); });

  /* ---------------- CUENTA ATRÁS (Europe/Madrid, miércoles 18:00) ---------------- */
  var fmt = null;
  try { fmt = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23", weekday: "short" }); } catch (e) { fmt = null; }
  function parts2(d) { var o = {}; fmt.formatToParts(d).forEach(function (p) { o[p.type] = p.value; }); return o; }
  function offsetAt(ms) { var o = parts2(new Date(ms)); return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour % 24, +o.minute, +o.second) - Math.floor(ms / 1000) * 1000; }
  function nextStream(nowMs) {
    var o = parts2(new Date(nowMs));
    var wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[o.weekday];
    var secOfDay = (+o.hour % 24) * 3600 + (+o.minute) * 60 + (+o.second);
    var add = (3 - wd + 7) % 7, live = false;
    if (add === 0 && secOfDay >= 18 * 3600) { if (secOfDay < 20 * 3600) live = true; else add = 7; }
    var wall = Date.UTC(+o.year, +o.month - 1, +o.day + add, 18, 0, 0);
    var ts = wall - offsetAt(wall); ts = wall - offsetAt(ts);
    return { ts: ts, live: live };
  }
  function $(id) { return document.getElementById(id); }
  var sigTime = $("sigTime"), sigLabel = $("sigLabel"), signal = $("signal"), nextDate = $("nextDate");
  var cdD = $("cdD"), cdH = $("cdH"), cdM = $("cdM"), cdS = $("cdS"), cdLabel = $("cdLabel");
  var MES = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function tick() {
    if (!fmt) return;
    var now = Date.now(), n = nextStream(now), d;
    if (n.live) {
      if (signal) { signal.classList.add("on"); sigLabel.textContent = "En directo ahora · Twitch"; }
      d = Math.max(0, Math.floor((now - n.ts) / 1000));
      cdLabel.textContent = "En directo desde hace";
    } else {
      if (signal) { signal.classList.remove("on"); sigLabel.textContent = "Offline · Próximo directo mié 18:00"; }
      d = Math.max(0, Math.floor((n.ts - now) / 1000));
      cdLabel.textContent = "Próximo directo en";
    }
    var dd = Math.floor(d / 86400), hh = Math.floor(d / 3600) % 24, mm = Math.floor(d / 60) % 60, ss = d % 60;
    if (sigTime) sigTime.textContent = (dd ? dd + "D " : "") + pad(hh) + ":" + pad(mm) + ":" + pad(ss);
    cdD.textContent = String(dd); cdH.textContent = pad(hh); cdM.textContent = pad(mm); cdS.textContent = pad(ss);
    if (nextDate) { var p = parts2(new Date(n.ts)); nextDate.textContent = p.day + " " + MES[+p.month - 1] + " · 18:00"; }
  }
  tick(); setInterval(tick, 1000);

  /* ---------------- COUNT-UP ---------------- */
  (function () {
    var els = document.querySelectorAll("[data-count]");
    if (RM.matches || !els.length) return;
    var t0 = performance.now(), dur = 1400;
    function step(t) {
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      for (var i = 0; i < els.length; i++) els[i].textContent = String(Math.round(+els[i].getAttribute("data-count") * e));
      if (k < 1) requestAnimationFrame(step);
    }
    for (var i = 0; i < els.length; i++) els[i].textContent = "0";
    requestAnimationFrame(step);
  })();

  /* ---------------- BUSCADOR ⌘K ---------------- */
  var IDX = [
    ["Sobre mí", "Sección", "#about"], ["Build", "Sección", "#build"], ["Think", "Sección", "#think"], ["Blog", "Sección", "#blog"], ["Lab", "Sección", "#lab"], ["Live", "Sección", "#live"], ["Community", "Sección", "#community"],
    ["Agent Teams", "Proyecto", "#build"], ["GitHub Repository Bootstrap", "Proyecto", "#build"], ["Gentle UI", "Proyecto", "#build"],
    ["OpenDesign × Gentle AI", "Lab", "#lab"],
    ["¿Dónde deberían vivir las llamadas a API?", "Nota", "#think"], ["Skills, harnesses y por qué el modelo importa menos.", "Nota", "#think"], ["El problema no era el componente. Era la decisión.", "Nota", "#think"],
    ["Arquitectura frontend: el problema no es dónde pones las carpetas.", "Artículo", "#blog"], ["Diseñando un sistema de agentes para desarrollo frontend", "Artículo", "#blog"],
    ["React no necesita otra abstracción", "Artículo", "#blog"], ["Lo que aprendí construyendo mi propio Design System", "Artículo", "#blog"],
    ["OpenDesign + agentes", "Directo", "#live"], ["Configurando mi entorno de agentes", "Directo", "#live"], ["Stack & Flow", "Discord", "#discord"], ["Gentleman Programming", "Discord", "#discord"], ["Cierre", "Sección", "#cierre"]
  ];
  var spop = $("spop"), sq = $("sq"), sres = $("sres"), sbtn = $("searchBtn"), lastFocus = null;
  function norm(s) { return s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, ""); }
  function esc(s) { return s.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function render() {
    var q = norm(sq.value.trim()), out = "";
    IDX.forEach(function (r) {
      if (!q || norm(r[0]).indexOf(q) > -1 || norm(r[1]).indexOf(q) > -1) out += '<a href="' + r[2] + '">' + esc(r[0]) + "<span>" + r[1].toUpperCase() + "</span></a>";
    });
    sres.innerHTML = out || '<p class="empty">Sin resultados. Prueba con “agentes” o “React”.</p>';
  }
  function openS() { lastFocus = document.activeElement; spop.hidden = false; sq.value = ""; render(); sq.focus(); }
  function closeS() { spop.hidden = true; if (lastFocus && lastFocus.focus) lastFocus.focus(); }
  sbtn.addEventListener("click", openS);
  $("sclose").addEventListener("click", closeS);
  sq.addEventListener("input", render);
  spop.addEventListener("click", function (e) { if (e.target === spop) closeS(); else if (e.target.closest("a")) spop.hidden = true; });
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); if (spop.hidden) openS(); else closeS(); }
    else if (e.key === "Escape") { if (!spop.hidden) closeS(); else if (!mnav.hidden) { closeMenu(); menuBtn.focus(); } }
    else if (e.key === "Tab" && !spop.hidden) {
      var fo = spop.querySelectorAll("input,button,a"); if (!fo.length) return;
      var first = fo[0], lastEl = fo[fo.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); lastEl.focus(); }
      else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------- REVEAL (lo último: solo se oculta cuando todo está cableado) ---------------- */
  if ("IntersectionObserver" in window && !RM.matches) {
    var rev = document.querySelectorAll("[data-reveal],[data-wipe]");
    for (var r = 0; r < rev.length; r++) {
      var el = rev[r], sib = el.parentElement.children, n = 0;
      for (var q = 0; q < sib.length && sib[q] !== el; q++) if (sib[q].hasAttribute("data-reveal") || sib[q].hasAttribute("data-wipe")) n++;
      el.style.setProperty("--d", (n * 90) + "ms");
    }
    var vh0 = window.innerHeight;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0 });
    for (var r2 = 0; r2 < rev.length; r2++) {
      if (rev[r2].getBoundingClientRect().top < vh0 * 0.92) rev[r2].classList.add("in", "done");
      else io.observe(rev[r2]);
    }
    document.addEventListener("transitionend", function (e) { if (e.propertyName === "clip-path" && e.target.hasAttribute && e.target.hasAttribute("data-wipe")) e.target.classList.add("done"); });
    root.classList.add("js");
  }
})();
