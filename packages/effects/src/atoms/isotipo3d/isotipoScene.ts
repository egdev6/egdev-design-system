export type IsotipoScene = 'hero' | 'chapter' | 'lab' | 'outro';
export type IsotipoPose = { az: number; el: number; fov: number; ex: number; halo: number };

// Internal scene input: all geometry is in CSS pixels, including signed viewport coordinates.
type SceneProjection = {
  viewport: { width: number; height: number };
  anchor: { left: number; top: number; width: number; height: number };
  pad: number;
  feather: number;
};

// Clipped extrusion faces, in source draw order; these are not the assembled SVG fallback polygons.
export const isotipoPolygons = [
  {
    ink: 'light',
    pixel: false,
    points: '415.52 185.14 415.52 231.18 350.31 197.81 350.31 315.25 477.66 382.29 638.45 297.64'
  },
  { ink: 'shade', pixel: false, points: '288.15 152.23 288.15 315.25 160.80 382.29 0 297.64' },
  { ink: 'light', pixel: false, points: '0 297.64 288.15 449.34 288.15 612.37 0 466.95' },
  { ink: 'shade', pixel: false, points: '638.45 297.64 350.31 449.34 350.31 612.37 638.45 466.95' },
  { ink: 'light', pixel: true, points: '432.36 157.09 353.05 116.52 353.05 37.2 432.36 77.77' },
  { ink: 'light', pixel: true, points: '521.88 74.4 472.66 49.22 472.66 0 521.88 25.18' },
  { ink: 'light', pixel: true, points: '555.8 219.34 487.96 184.64 487.96 116.8 555.8 151.5' }
] as const;

export function isotipoParsePolygon(input: string): [number, number][] {
  const values = input
    .trim()
    .split(/[\s,]+/)
    .map(Number);
  const points: [number, number][] = [];
  for (let i = 0; i < values.length; i += 2) {
    const x = values[i];
    const y = values[i + 1];
    if (x === undefined || y === undefined) {
      throw new Error('Incomplete isotipo polygon');
    }
    points.push([(x - 638.45 / 2) * 0.01, -(y - 612.37 / 2) * 0.01]);
  }
  const first = points[0];
  const last = points[points.length - 1];
  if (
    points.length > 3 &&
    first &&
    last &&
    Math.abs(first[0] - last[0]) < 1e-9 &&
    Math.abs(first[1] - last[1]) < 1e-9
  ) {
    points.pop();
  }
  return points;
}

export function isotipoLoadThree(): Promise<typeof import('three')> {
  return import('three');
}

/** Instance-local GPU ownership; animation and subscriptions belong to the hook. */
export async function isotipoCreateScene(
  canvas: HTMLCanvasElement,
  colors: { light: string; shade: string; neon: string; redLight: string },
  signal?: AbortSignal
) {
  const three = await isotipoLoadThree();
  if (signal?.aborted) {
    throw new DOMException('Isotipo initialization aborted', 'AbortError');
  }
  const resources: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(resource: T): T => {
    resources.push(resource);
    return resource;
  };
  let disposed = false;
  const dispose = () => {
    if (disposed) {
      return;
    }
    disposed = true;
    for (const resource of resources.reverse()) {
      try {
        resource.dispose();
      } catch {
        // Disposal of one resource must not prevent the remaining attempts.
      }
    }
  };
  try {
    const renderer = own(
      new three.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' })
    );
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = three.SRGBColorSpace;
    const scene = new three.Scene();
    const camera = new three.PerspectiveCamera(24, 1, 0.1, 400);
    const ambient = new three.AmbientLight(0xffffff, 0.6);
    const key = new three.DirectionalLight(0xffffff, 2);
    key.position.set(-4, 6, 10);
    const rim = new three.DirectionalLight(colors.neon, 5.5);
    rim.position.set(9, 3.5, -3);
    const rim2 = new three.DirectionalLight(colors.redLight, 2.2);
    rim2.position.set(-8, -3, -4);
    scene.add(ambient, key, rim, rim2);
    const cap = (color: string) =>
      own(
        new three.MeshStandardMaterial({
          color,
          emissive: color,
          emissiveIntensity: 0.3,
          roughness: 0.62,
          metalness: 0.04,
          side: three.FrontSide
        })
      );
    const light = cap(colors.light);
    const shade = cap(colors.shade);
    const side = own(
      new three.MeshStandardMaterial({
        color: 0x5a0a18,
        emissive: 0x1a0005,
        roughness: 0.34,
        metalness: 0.55,
        side: three.FrontSide,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        polygonOffsetUnits: 1
      })
    );
    const group = new three.Group();
    scene.add(group);
    let seed = 24092026;
    const random = () => {
      seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const rand = (min: number, max: number) => min + (max - min) * random();
    const pieces: {
      mesh: import('three').Mesh;
      home: [number, number];
      direction: [number, number, number];
      distance: number;
      rotation: [number, number, number];
      pixel: boolean;
      phase: number;
    }[] = [];
    for (const polygon of isotipoPolygons) {
      const points = isotipoParsePolygon(polygon.points);
      const cx = points.reduce((sum, point) => sum + point[0], 0) / points.length;
      const cy = points.reduce((sum, point) => sum + point[1], 0) / points.length;
      const vectors = points.map(([x, y]) => new three.Vector2(x - cx, y - cy));
      if (three.ShapeUtils.isClockWise(vectors)) {
        vectors.reverse();
      }
      const geometry = own(
        new three.ExtrudeGeometry(new three.Shape(vectors), { depth: 0.44, bevelEnabled: false, curveSegments: 1 })
      );
      geometry.translate(0, 0, -0.22);
      geometry.computeVertexNormals();
      const mesh = new three.Mesh(geometry, [polygon.ink === 'light' ? light : shade, side]);
      mesh.position.set(cx, cy, 0);
      group.add(mesh);
      const homeLength = Math.hypot(cx, cy) || 1;
      const dx = cx / homeLength + rand(-0.5, 0.5);
      const dy = cy / homeLength + rand(-0.5, 0.5);
      const dz = rand(-1, 1);
      const length = Math.hypot(dx, dy, dz) || 1;
      pieces.push({
        mesh,
        home: [cx, cy],
        direction: [dx / length, dy / length, dz / length],
        distance: polygon.pixel ? rand(3.4, 5.2) : rand(2, 3.2),
        rotation: [rand(-2, 2), rand(-2, 2), rand(-1.1, 1.1)],
        pixel: polygon.pixel,
        phase: rand(0, 6.28)
      });
    }
    group.updateMatrixWorld(true);
    const bounds = new three.Box3().setFromObject(group);
    const corners: import('three').Vector3[] = [];
    for (let index = 0; index < 8; index++) {
      corners.push(
        new three.Vector3(
          index & 1 ? bounds.max.x : bounds.min.x,
          index & 2 ? bounds.max.y : bounds.min.y,
          index & 4 ? bounds.max.z : bounds.min.z
        )
      );
    }
    const projected = new three.Vector3();
    const pixelPoints = isotipoParsePolygon(isotipoPolygons[4].points);
    const pixelX = pixelPoints.reduce((sum, point) => sum + point[0], 0) / pixelPoints.length;
    const pixelY = pixelPoints.reduce((sum, point) => sum + point[1], 0) / pixelPoints.length;
    const pixelScale = 0.18 / ((157.09 - 37.2) * 0.01);
    const pixelVectors = pixelPoints.map(
      ([x, y]) => new three.Vector2((x - pixelX) * pixelScale, (y - pixelY) * pixelScale)
    );
    if (three.ShapeUtils.isClockWise(pixelVectors)) {
      pixelVectors.reverse();
    }
    const debrisGeometry = own(
      new three.ExtrudeGeometry(new three.Shape(pixelVectors), { depth: 0.07, bevelEnabled: false })
    );
    debrisGeometry.translate(0, 0, -0.035);
    const debrisMaterial = own(
      new three.MeshStandardMaterial({ color: 0xffffff, emissive: 0x220006, roughness: 0.5, metalness: 0.1 })
    );
    const debrisMesh = own(new three.InstancedMesh(debrisGeometry, debrisMaterial, 100));
    debrisMesh.frustumCulled = false;
    debrisMesh.instanceMatrix.setUsage(three.DynamicDrawUsage);
    debrisMesh.visible = false;
    group.add(debrisMesh);
    const mainPolygons = isotipoPolygons
      .filter((polygon) => !polygon.pixel)
      .map((polygon) => isotipoParsePolygon(polygon.points));
    const inside = (x: number, y: number, points: [number, number][]) => {
      let result = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const [xi, yi] = points[i] as [number, number];
        const [xj, yj] = points[j] as [number, number];
        if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
          result = !result;
        }
      }
      return result;
    };
    const debrisData: {
      home: [number, number, number];
      direction: [number, number, number];
      distance: number;
      size: number;
      spin: [number, number, number];
      phase: number;
    }[] = [];
    const lightColor = new three.Color(colors.light);
    const shadeColor = new three.Color(colors.shade);
    for (let index = 0; index < 100; index++) {
      let x = 0;
      let y = 0;
      let tries = 0;
      do {
        x = rand(-638.45 / 2, 638.45 / 2) * 0.01;
        y = rand(-612.37 / 2, 612.37 / 2) * 0.01;
        tries++;
      } while (!mainPolygons.some((polygon) => inside(x, y, polygon)) && tries < 40);
      const homeLength = Math.hypot(x, y) || 1;
      const dx = x / homeLength + rand(-0.7, 0.7);
      const dy = y / homeLength + rand(-0.7, 0.7);
      const dz = rand(-1.2, 1.2);
      const length = Math.hypot(dx, dy, dz) || 1;
      debrisData.push({
        home: [x, y, rand(-0.15, 0.15)],
        direction: [dx / length, dy / length, dz / length],
        distance: rand(1.8, 6.5),
        size: rand(0.5, 1.25),
        spin: [rand(-3, 3), rand(-3, 3), rand(-2, 2)],
        phase: rand(0, 6.28)
      });
      debrisMesh.setColorAt(index, random() > 0.35 ? lightColor : shadeColor);
    }
    const dummy = new three.Object3D();
    const haloCanvas = canvas.ownerDocument.createElement('canvas');
    haloCanvas.width = 256;
    haloCanvas.height = 256;
    const context = haloCanvas.getContext('2d');
    if (!context) {
      throw new Error('Unable to create isotipo halo');
    }
    const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.25, 'rgba(255,255,255,.42)');
    gradient.addColorStop(0.6, 'rgba(255,255,255,.08)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 256, 256);
    const haloTexture = own(new three.CanvasTexture(haloCanvas));
    haloTexture.colorSpace = three.SRGBColorSpace;
    const haloMaterial = own(
      new three.SpriteMaterial({
        map: haloTexture,
        color: colors.neon,
        blending: three.AdditiveBlending,
        transparent: true,
        depthWrite: false,
        opacity: 0.3
      })
    );
    const halo = new three.Sprite(haloMaterial);
    halo.scale.set(9, 9, 1);
    halo.position.set(0.2, 0.1, -2.2);
    scene.add(halo);
    let fitKey = '';
    let legacyAspect = 1;
    let composite:
      | {
          target: import('three').WebGLRenderTarget;
          scene: import('three').Scene;
          camera: import('three').OrthographicCamera;
          material: import('three').ShaderMaterial;
        }
      | undefined;
    const getComposite = () => {
      if (composite) {
        return composite;
      }
      const target = own(new three.WebGLRenderTarget(1, 1, { samples: 4 }));
      const geometry = own(new three.PlaneGeometry(2, 2));
      const material = own(
        new three.ShaderMaterial({
          uniforms: {
            image: { value: target.texture },
            maskRect: { value: new three.Vector4() },
            viewportSize: { value: new three.Vector2() },
            feather: { value: 0 }
          },
          vertexShader: 'varying vec2 uvScreen; void main() { uvScreen = uv; gl_Position = vec4(position, 1.0); }',
          fragmentShader: `
          uniform sampler2D image;
          uniform vec4 maskRect;
          uniform vec2 viewportSize;
          uniform float feather;
          varying vec2 uvScreen;
          void main() {
            vec2 p = vec2(uvScreen.x, 1.0 - uvScreen.y) * viewportSize;
            vec2 edge = min(p - maskRect.xy, maskRect.zw - p);
            float mask = clamp(edge.x / max(feather, 0.00001), 0.0, 1.0)
              * clamp(edge.y / max(feather, 0.00001), 0.0, 1.0);
            vec4 color = texture2D(image, uvScreen);
            gl_FragColor = color * mask;
            #include <colorspace_fragment>
          }
        `,
          blending: three.NoBlending,
          depthTest: false,
          depthWrite: false
        })
      );
      const finalScene = new three.Scene();
      finalScene.add(new three.Mesh(geometry, material));
      composite = { target, scene: finalScene, camera: new three.OrthographicCamera(-1, 1, 1, -1, 0, 1), material };
      return composite;
    };
    return {
      resize(width: number, height: number, dpr = 1, coarse = false) {
        if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
          return;
        }
        const ratio = Number.isFinite(dpr) && dpr > 0 ? dpr : 1;
        fitKey = '';
        const low = width <= 760 || coarse;
        debrisMesh.count = low ? 44 : 100;
        renderer.setPixelRatio(Math.min(ratio, low ? 1.25 : 1.75));
        renderer.setSize(width, height, false);
        legacyAspect = width / height;
        camera.aspect = legacyAspect;
        camera.updateProjectionMatrix();
      },
      render(
        name: IsotipoScene,
        progress: number,
        reducedMotion: boolean,
        animation: {
          time: number;
          intro: number;
          tiltX?: number;
          tiltY?: number;
          yawOffset?: number;
          pitchOffset?: number;
          flipped?: boolean;
          pose?: IsotipoPose;
        } = { time: 0, intro: 1 },
        projection?: SceneProjection
      ) {
        const validProjection =
          projection &&
          [
            projection.viewport.width,
            projection.viewport.height,
            projection.anchor.left,
            projection.anchor.top,
            projection.anchor.width,
            projection.anchor.height,
            projection.pad,
            projection.feather
          ].every(Number.isFinite) &&
          projection.viewport.width > 0 &&
          projection.viewport.height > 0 &&
          projection.anchor.width > 0 &&
          projection.anchor.height > 0 &&
          projection.pad >= 0 &&
          projection.feather >= 0
            ? projection
            : undefined;
        camera.aspect = validProjection
          ? validProjection.viewport.width / validProjection.viewport.height
          : legacyAspect;
        const pose = reducedMotion
          ? isotipoPose(name, isotipoNormalizeProgress(progress), true)
          : (animation.pose ?? isotipoPose(name, isotipoNormalizeProgress(progress), false));
        const time = reducedMotion || !Number.isFinite(animation.time) ? 0 : Math.max(0, animation.time);
        const intro = reducedMotion ? 1 : isotipoNormalizeProgress(animation.intro);
        const tiltX = reducedMotion ? 0 : Math.max(-1, Math.min(1, animation.tiltX ?? 0));
        const tiltY = reducedMotion ? 0 : Math.max(-1, Math.min(1, animation.tiltY ?? 0));
        // Gesture offsets stay available under reduced motion so a user-driven drag still repaints.
        const yawOffset = animation.yawOffset ?? 0;
        const pitchOffset = animation.pitchOffset ?? 0;
        const flipped = animation.flipped === true;
        const angles = isotipoGestureAngles(pose, tiltX, tiltY, yawOffset, pitchOffset, flipped);
        const az = (angles.az * Math.PI) / 180;
        const el = (angles.el * Math.PI) / 180;
        camera.fov = pose.fov;
        const explosion = pose.ex * pose.ex * (3 - 2 * pose.ex);
        const introEase = 1 - (1 - intro) ** 3;
        const rotation = reducedMotion ? 0 : Math.sin(time * 0.3) * 0.02 * (1 - explosion);
        const groupScale = 0.92 + 0.08 * introEase;
        group.rotation.y = rotation;
        group.scale.setScalar(groupScale);
        group.updateMatrixWorld(true);
        const projectedExtent = (distance: number) => {
          camera.position.set(
            distance * Math.cos(el) * Math.sin(az),
            distance * Math.sin(el),
            distance * Math.cos(el) * Math.cos(az)
          );
          camera.near = Math.max(0.1, distance - 30);
          camera.far = distance + 40;
          camera.lookAt(0, 0, 0);
          camera.updateProjectionMatrix();
          camera.updateMatrixWorld();
          let minX = Infinity;
          let maxX = -Infinity;
          let minY = Infinity;
          let maxY = -Infinity;
          for (const corner of corners) {
            projected.copy(corner).applyMatrix4(group.matrixWorld).project(camera);
            minX = Math.min(minX, projected.x);
            maxX = Math.max(maxX, projected.x);
            minY = Math.min(minY, projected.y);
            maxY = Math.max(maxY, projected.y);
          }
          const width = maxX - minX;
          const height = maxY - minY;
          return validProjection
            ? Math.max(
                width / ((1.8 * validProjection.anchor.width) / validProjection.viewport.width),
                height / ((1.8 * validProjection.anchor.height) / validProjection.viewport.height)
              )
            : Math.max(width, height);
        };
        const nextFitKey =
          `${
            pose.az + tiltX * 3 + isotipoGestureBand(yawOffset) + (flipped ? 180 : 0)
          }: ${pose.el - tiltY * 2 + isotipoGestureBand(pitchOffset)}:${pose.fov}:${camera.aspect}:${rotation}:${groupScale}` +
          (validProjection
            ? `:${JSON.stringify(validProjection)}:${angles.az}:${angles.el}:${pose.ex}:${pose.halo}`
            : ':legacy');
        if (fitKey !== nextFitKey) {
          let lower = Math.max(...corners.map((corner) => corner.length())) + 1;
          let upper = lower * 2;
          const limit = validProjection ? 1 : 1.8;
          while (projectedExtent(upper) > limit) {
            upper *= 2;
          }
          for (let index = 0; index < 32; index++) {
            const middle = (lower + upper) / 2;
            if (projectedExtent(middle) > limit) {
              lower = middle;
            } else {
              upper = middle;
            }
          }
          projectedExtent(upper);
          fitKey = nextFitKey;
        }
        if (validProjection) {
          const { anchor, viewport } = validProjection;
          camera.projectionMatrix.elements[8] = -(((anchor.left + anchor.width / 2) / viewport.width) * 2 - 1);
          camera.projectionMatrix.elements[9] = -(1 - ((anchor.top + anchor.height / 2) / viewport.height) * 2);
          camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
        }
        const pixelDirectionLength = Math.hypot(0.72, 0.5, 0.35);
        for (const [index, piece] of pieces.entries()) {
          const partIntro = reducedMotion ? 1 : Math.max(0, Math.min(1, intro * 1.5 - index * 0.07));
          const partEase = 1 - (1 - partIntro) ** 3;
          const spread = Math.max(explosion, (1 - partEase) * 0.6);
          const drift = piece.pixel
            ? (reducedMotion ? 0.1 : 0.1 + 0.03 * Math.sin(time * 0.42 + piece.phase)) * (1 - explosion)
            : 0;
          piece.mesh.position.set(
            piece.home[0] + (0.72 / pixelDirectionLength) * drift + piece.direction[0] * spread * piece.distance,
            piece.home[1] + (0.5 / pixelDirectionLength) * drift + piece.direction[1] * spread * piece.distance,
            (0.35 / pixelDirectionLength) * drift + piece.direction[2] * spread * piece.distance
          );
          piece.mesh.rotation.set(piece.rotation[0] * spread, piece.rotation[1] * spread, piece.rotation[2] * spread);
        }
        light.emissiveIntensity = 0.3 + explosion * 0.15;
        shade.emissiveIntensity = 0.3 + explosion * 0.15;
        haloMaterial.opacity = pose.halo * (1 - explosion * 0.4);
        debrisMesh.visible = name === 'lab' && explosion > 0.003;
        if (debrisMesh.visible) {
          const scale = smooth(0, 0.35, explosion);
          for (let index = 0; index < debrisMesh.count; index++) {
            const item = debrisData[index];
            if (!item) {
              continue;
            }
            dummy.position.set(
              item.home[0] + item.direction[0] * explosion * item.distance,
              item.home[1] +
                item.direction[1] * explosion * item.distance +
                Math.sin(time * 0.6 + item.phase) * 0.12 * explosion,
              item.home[2] + item.direction[2] * explosion * item.distance
            );
            dummy.rotation.set(
              item.spin[0] * explosion + time * 0.2 * explosion,
              item.spin[1] * explosion,
              item.spin[2] * explosion
            );
            dummy.scale.setScalar(item.size * scale);
            dummy.updateMatrix();
            debrisMesh.setMatrixAt(index, dummy.matrix);
          }
          debrisMesh.instanceMatrix.needsUpdate = true;
        }
        if (!validProjection) {
          renderer.render(scene, camera);
          return;
        }
        const { anchor, viewport, pad, feather } = validProjection;
        try {
          const pass = getComposite();
          const previousTarget = renderer.getRenderTarget();
          const previousViewport = renderer.getViewport(new three.Vector4());
          const previousScissor = renderer.getScissor(new three.Vector4());
          const previousScissorTest = renderer.getScissorTest();
          try {
            const ratio = renderer.getPixelRatio();
            pass.target.setSize(Math.round(viewport.width * ratio), Math.round(viewport.height * ratio));
            const { maskRect, viewportSize, feather: featherUniform } = pass.material.uniforms;
            if (!maskRect || !viewportSize || !featherUniform) {
              throw new Error('Missing isotipo composite uniforms');
            }
            maskRect.value.set(
              Math.round(anchor.left - pad),
              Math.round(anchor.top - pad),
              Math.round(anchor.left + anchor.width + pad),
              Math.round(anchor.top + anchor.height + pad)
            );
            viewportSize.value.set(viewport.width, viewport.height);
            featherUniform.value = feather;
            renderer.setRenderTarget(pass.target);
            renderer.setScissorTest(false);
            renderer.render(scene, camera);
            renderer.setRenderTarget(previousTarget);
            renderer.setViewport(previousViewport);
            renderer.setScissorTest(false);
            renderer.render(pass.scene, pass.camera);
          } finally {
            renderer.setRenderTarget(previousTarget);
            renderer.setViewport(previousViewport);
            renderer.setScissor(previousScissor);
            renderer.setScissorTest(previousScissorTest);
          }
        } catch (error) {
          dispose();
          throw error;
        }
      },
      dispose
    };
  } catch (error) {
    dispose();
    throw error;
  }
}

export function isotipoNormalizeProgress(value: unknown): number {
  return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(1, value)) : 0;
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (a: number, b: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** Camera view angles in degrees: approved pose plus ambient tilt, user gesture offsets and flip. */
export function isotipoGestureAngles(
  pose: Pick<IsotipoPose, 'az' | 'el'>,
  tiltX = 0,
  tiltY = 0,
  yawOffset = 0,
  pitchOffset = 0,
  flipped = false
): { az: number; el: number } {
  return {
    az: pose.az + Math.max(-1, Math.min(1, tiltX)) * 3 + Math.max(-90, Math.min(90, yawOffset)) + (flipped ? 180 : 0),
    el: pose.el - Math.max(-1, Math.min(1, tiltY)) * 2 + Math.max(-30, Math.min(30, pitchOffset))
  };
}

/** Five-degree hysteresis band so gesture drags do not recompute the assembled fit every frame. */
export function isotipoGestureBand(value: number): number {
  return Math.round(value / 5) * 5;
}

/** Target pose; progress is normalized by the component before entering the engine. */
export function isotipoPose(scene: IsotipoScene, progress: number, reducedMotion: boolean): IsotipoPose {
  if (scene === 'chapter') {
    const p = reducedMotion ? 0.5 : progress;
    return { az: lerp(33, 57, p), el: 35.264, fov: 10, ex: 0, halo: 0.2 };
  }
  if (scene === 'lab') {
    const p = reducedMotion ? 0 : progress;
    return {
      az: lerp(-12, 28, p),
      el: lerp(4, 16, p),
      fov: 30,
      ex: reducedMotion ? 0 : smooth(0.06, 0.42, p) * (1 - smooth(0.7, 0.96, p)),
      halo: 0.35
    };
  }
  if (scene === 'outro') {
    const q = reducedMotion ? 1 : smooth(0.2, 0.85, progress);
    return {
      az: lerp(-20, 45, q),
      el: lerp(12, 35.264, q),
      fov: lerp(26, 12, q),
      ex: reducedMotion ? 0 : 0.9 * (1 - q),
      halo: 0.08 + 0.2 * q
    };
  }
  const h = reducedMotion ? 0 : smooth(0, 0.4, progress);
  return { az: lerp(-16, 45, h), el: lerp(7, 35.264, h), fov: lerp(24, 12, h), ex: 0, halo: 0.3 };
}
