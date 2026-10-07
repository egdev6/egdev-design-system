/* EGDEV Foundation · código de referencia extraído de la web EGDEV Pulso (1 oct 2026). Implementación aprobada; portar a componentes respetando su API. */
// Port vanilla y fiel del motor ParticleStreaks de Quique (camzuna.com/anim · Particle Studio).
// Config EXACTA exportada por el usuario. No cambies valores salvo los multiplicadores por zona (ver API).
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

// API: const fx = createParticleStreaks(canvas, overrides?)
//   fx.set({ lineCount, squareCount, speedMultiplier, backgroundGlowOpacity, ... })  -> cambia parámetros en caliente (p.ej. por zona)
//   fx.start() / fx.stop() / fx.renderOnce()   (stop cancela el rAF: úsalo cuando la capa está a opacidad 0 o en reduced-motion)
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
