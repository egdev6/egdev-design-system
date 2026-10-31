type Colors = {
  backgroundColor: string;
  backgroundGlowColor: string;
  lineColor: string;
  lineGlowColor: string;
  squareColor: string;
  squareGlowColor: string;
};

type Profile = { lineCount: number; squareCount: number; speedMultiplier: number; backgroundGlowOpacity: number };
type Particle = {
  laneId: number;
  laneOffset: number;
  distance: number;
  maxDistance: number;
  currentSpeed: number;
  progress: number;
  x: number;
  y: number;
  opacity: number;
};
type Line = Particle & { length: number; width: number; maxOpacity: number };
type Square = Particle & { baseSize: number; opacityPhase: number; rotation: number };

const rgb = (hex: string) => {
  const h = hex.slice(1);
  const n = Number.parseInt(h.length === 3 ? [...h].map((c) => c + c).join('') : h, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
};

/** Private Particle Studio engine. Browser resources are acquired only on construction. */
export function createParticleStreaks(
  canvas: HTMLCanvasElement,
  colors: Colors,
  initial: Profile,
  onFailure: () => void
) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) {
    return null;
  }
  let sprites: {
    squareCanvas: HTMLCanvasElement;
    lineCanvas: HTMLCanvasElement;
    coreCanvas: HTMLCanvasElement;
  } | null = null;
  let pending: {
    squareCanvas: HTMLCanvasElement;
    lineCanvas: HTMLCanvasElement;
    coreCanvas: HTMLCanvasElement;
    squareCtx: CanvasRenderingContext2D;
    lineCtx: CanvasRenderingContext2D;
    coreCtx: CanvasRenderingContext2D;
  } | null = null;
  let cfg = initial;
  let width = 0;
  let height = 0;
  let dpr = 0;
  let running = false;
  let disposed = false;
  let generation = 0;
  let raf = 0;
  let lastTime = 0;
  let lines: Line[] = [];
  let squares: Square[] = [];
  const rand = (a: number, b: number) => a + Math.random() * (b - a);
  const diag = () => Math.hypot(width, height) + 400;
  const lane = (i: number, total: number, d: number) => (i + 0.5) * ((d * 1.5) / Math.max(1, total)) - (d * 1.5) / 2;
  const makeLine = (randomStart: boolean, laneId: number, total: number): Line => {
    const d = diag();
    const maxDistance = d * 1.2;
    const distance = randomStart ? Math.random() * maxDistance : 0;
    const currentSpeed = rand(1.5, 4.5) * 60;
    const maxOpacity = rand(0.25, 0.85);
    return {
      laneId,
      laneOffset: lane(laneId, total, d),
      distance,
      maxDistance,
      currentSpeed,
      length: rand(180, 390),
      width: rand(0.8, 2),
      opacity: maxOpacity,
      maxOpacity,
      progress: distance / maxDistance,
      x: 0,
      y: 0
    };
  };
  const makeSquare = (randomStart: boolean, laneId: number, total: number): Square => {
    const d = diag();
    const maxDistance = d * 1.2;
    const distance = randomStart ? Math.random() * maxDistance : 0;
    const currentSpeed = rand(0.8, 2.6) * 60;
    const baseSize = rand(6, 28);
    return {
      laneId,
      laneOffset: lane(laneId, total, d),
      distance,
      maxDistance,
      currentSpeed,
      baseSize,
      opacity: 0.1,
      opacityPhase: Math.random() * Math.PI * 2,
      rotation: 45,
      progress: distance / maxDistance,
      x: 0,
      y: 0
    };
  };
  const init = () => {
    const total = Math.max(1, cfg.lineCount + cfg.squareCount);
    lines = Array.from({ length: cfg.lineCount }, (_, i) => makeLine(true, i, total));
    squares = Array.from({ length: cfg.squareCount }, (_, i) => makeSquare(true, cfg.lineCount + i, total));
  };
  const ready = () => {
    if (sprites || pending) {
      return true;
    }
    const squareCanvas = document.createElement('canvas');
    const lineCanvas = document.createElement('canvas');
    const coreCanvas = document.createElement('canvas');
    const squareCtx = squareCanvas.getContext('2d');
    const lineCtx = lineCanvas.getContext('2d');
    const coreCtx = coreCanvas.getContext('2d');
    if (!squareCtx || !lineCtx || !coreCtx) {
      return false;
    }
    pending = { squareCanvas, lineCanvas, coreCanvas, squareCtx, lineCtx, coreCtx };
    return true;
  };
  const prepareSprites = () => {
    if (sprites) {
      return sprites;
    }
    if (!ready() || !pending) {
      return null;
    }
    const { squareCanvas, lineCanvas, coreCanvas, squareCtx, lineCtx, coreCtx } = pending;
    pending = null;
    squareCanvas.width = 512;
    squareCanvas.height = 512;
    squareCtx.clearRect(0, 0, 512, 512);
    const squareGradient = squareCtx.createRadialGradient(256, 256, 6, 256, 256, 87);
    const squareRgb = rgb(colors.squareGlowColor);
    (
      [
        [0, 0.3],
        [0.25, 0.1875],
        [0.6, 0.0625],
        [0.85, 0.015],
        [1, 0]
      ] as const
    ).forEach(([p, a]) => squareGradient.addColorStop(p, `rgba(${squareRgb}, ${a})`));
    squareCtx.fillStyle = squareGradient;
    squareCtx.beginPath();
    squareCtx.arc(256, 256, 87, 0, Math.PI * 2);
    squareCtx.fill();
    squareCtx.save();
    squareCtx.translate(256, 256);
    squareCtx.beginPath();
    squareCtx.rect(-20, -20, 40, 40);
    squareCtx.fillStyle = colors.squareColor;
    squareCtx.fill();
    squareCtx.restore();
    lineCanvas.width = 1024;
    lineCanvas.height = 256;
    lineCtx.clearRect(0, 0, 1024, 256);
    const lineRgb = rgb(colors.lineGlowColor);
    for (let p = 32; p >= 1; p--) {
      const t = p / 32;
      const w = 1024 * (0.15 + 0.85 * Math.sqrt(t));
      const h = 256 * ((1 - t) ** 1.5 * 0.9 + 0.02);
      const a = 0.3 * (1 - t) ** 2.2 * 0.22;
      const g = lineCtx.createLinearGradient(512 - w / 2, 128, 512 + w / 2, 128);
      (
        [
          [0, 0],
          [0.12, a * 0.3],
          [0.5, a],
          [0.88, a * 0.3],
          [1, 0]
        ] as const
      ).forEach(([pos, alpha]) => g.addColorStop(pos, `rgba(${lineRgb}, ${alpha})`));
      lineCtx.fillStyle = g;
      lineCtx.beginPath();
      lineCtx.ellipse(512, 128, w / 2, Math.max(1, h / 2), 0, 0, Math.PI * 2);
      lineCtx.fill();
    }
    coreCanvas.width = 512;
    coreCanvas.height = 16;
    coreCtx.clearRect(0, 0, 512, 16);
    const coreGradient = coreCtx.createLinearGradient(0, 0, 512, 0);
    const coreRgb = rgb(colors.lineColor);
    (
      [
        [0, 0],
        [0.18, 0.5],
        [0.5, 1],
        [0.82, 0.5],
        [1, 0]
      ] as const
    ).forEach(([pos, alpha]) => coreGradient.addColorStop(pos, `rgba(${coreRgb}, ${alpha})`));
    coreCtx.fillStyle = coreGradient;
    coreCtx.fillRect(0, 0, 512, 16);
    sprites = { squareCanvas, lineCanvas, coreCanvas };
    return sprites;
  };
  const frame = (now: number, dt: number) => {
    const resources = prepareSprites();
    if (!resources) {
      stop();
      disposed = true;
      onFailure();
      return;
    }
    const { squareCanvas, lineCanvas, coreCanvas } = resources;
    const r = ((315 - 90) * Math.PI) / 180;
    const dx = Math.cos(r);
    const dy = Math.sin(r);
    const px = -dy;
    const py = dx;
    const d = diag();
    const cx = width / 2;
    const cy = height / 2;
    const total = Math.max(1, cfg.lineCount + cfg.squareCount);
    while (lines.length < cfg.lineCount) {
      lines.push(makeLine(false, lines.length, total));
    }
    while (lines.length > cfg.lineCount) {
      lines.pop();
    }
    while (squares.length < cfg.squareCount) {
      squares.push(makeSquare(false, cfg.lineCount + squares.length, total));
    }
    while (squares.length > cfg.squareCount) {
      squares.pop();
    }
    ctx.globalCompositeOperation = 'source-over';
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.backgroundColor;
    ctx.fillRect(0, 0, width, height);
    if (cfg.backgroundGlowOpacity > 0) {
      const g = ctx.createRadialGradient(cx, cy, 10, cx, cy, Math.max(width, height) * 0.6);
      const color = rgb(colors.backgroundGlowColor);
      const op = cfg.backgroundGlowOpacity;
      (
        [
          [0, op],
          [0.4, op * 0.4],
          [0.75, op * 0.1],
          [1, 0]
        ] as const
      ).forEach(([pos, alpha]) => g.addColorStop(pos, `rgba(${color}, ${alpha})`));
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);
    }
    ctx.globalCompositeOperation = 'screen';
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if (!l) {
        continue;
      }
      l.distance += l.currentSpeed * cfg.speedMultiplier * dt;
      l.progress = l.distance / l.maxDistance;
      if (l.progress >= 1) {
        lines[i] = makeLine(false, l.laneId, total);
        continue;
      }
      l.x = cx - dx * d * 0.6 + px * l.laneOffset + dx * l.distance;
      l.y = cy - dy * d * 0.6 + py * l.laneOffset + dy * l.distance;
      let op = l.maxOpacity;
      if (l.progress < 0.15) {
        op *= l.progress / 0.15;
      } else if (l.progress > 0.85) {
        op *= (1 - l.progress) / 0.15;
      }
      l.opacity = Math.max(0, Math.min(1, op));
      const half = l.length / 2;
      const gl = l.length + 18;
      const gh = l.width * 2 + 16;
      ctx.save();
      ctx.translate(l.x - dx * half, l.y - dy * half);
      ctx.rotate(Math.atan2(dy, dx));
      ctx.globalAlpha = l.opacity;
      ctx.drawImage(lineCanvas, -gl / 2, -gh / 2, gl, gh);
      ctx.globalAlpha = l.opacity;
      ctx.drawImage(coreCanvas, -half, -l.width / 2, l.length, l.width);
      ctx.restore();
    }
    for (let i = 0; i < squares.length; i++) {
      const q = squares[i];
      if (!q) {
        continue;
      }
      q.distance += q.currentSpeed * cfg.speedMultiplier * dt;
      q.progress = q.distance / q.maxDistance;
      if (q.progress >= 1) {
        squares[i] = makeSquare(false, q.laneId, total);
        continue;
      }
      q.x = cx - dx * d * 0.6 + px * q.laneOffset + dx * q.distance;
      q.y = cy - dy * d * 0.6 + py * q.laneOffset + dy * q.distance;
      const osc = 0.5 * (1 + Math.sin(((now / 1000) * (Math.PI * 2)) / 10 + q.opacityPhase));
      let op = 0.1 + osc * 0.85;
      if (q.progress < 0.15) {
        op *= q.progress / 0.15;
      } else if (q.progress > 0.85) {
        op *= (1 - q.progress) / 0.15;
      }
      q.opacity = Math.max(0, Math.min(1, op));
      const sf = (q.baseSize * (0.7 + Math.sin(q.progress * Math.PI) * 0.45)) / 40;
      ctx.save();
      ctx.translate(q.x, q.y);
      ctx.rotate((q.rotation * Math.PI) / 180);
      ctx.scale(sf, sf);
      ctx.globalAlpha = q.opacity;
      ctx.drawImage(squareCanvas, -256, -256, 512, 512);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  };
  const stop = () => {
    running = false;
    generation++;
    cancelAnimationFrame(raf);
  };
  return {
    ready,
    set(next: Profile) {
      cfg = next;
    },
    resize(w: number, h: number, ratio: number) {
      const nextDpr = Math.min(ratio || 1, 2);
      if (w === width && h === height && nextDpr === dpr) {
        return false;
      }
      width = w;
      height = h;
      dpr = nextDpr;
      if (w > 0 && h > 0) {
        canvas.width = Math.floor(w * dpr);
        canvas.height = Math.floor(h * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        init();
      }
      return true;
    },
    start() {
      if (running || disposed) {
        return;
      }
      running = true;
      lastTime = performance.now();
      const current = ++generation;
      const loop = (now: number) => {
        if (!running || disposed || current !== generation) {
          return;
        }
        const dt = Math.min((now - lastTime) / 1000, 0.1);
        lastTime = now;
        frame(now, dt);
        if (running && !disposed && current === generation) {
          raf = requestAnimationFrame(loop);
        }
      };
      raf = requestAnimationFrame(loop);
    },
    stop,
    renderOnce() {
      if (!disposed) {
        frame(performance.now(), 0);
      }
    },
    dispose() {
      disposed = true;
      stop();
      lines = [];
      squares = [];
      sprites = null;
      pending = null;
    }
  };
}
