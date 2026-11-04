import type * as Three from 'three';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const colors = { light: '#e91b35', shade: '#800c1d', neon: '#ff0036', redLight: '#ff335e' };
const state = vi.hoisted(() => ({ renderers: [] as unknown[] }));
vi.mock('three', async (original) => {
  const three = await original<typeof import('three')>();
  class Renderer {
    target: Three.WebGLRenderTarget | null = null;
    viewport = new three.Vector4(3, 4, 500, 400);
    scissor = new three.Vector4(5, 6, 300, 200);
    scissorTest = true;
    failRender = false;
    calls: { scene: Three.Scene; camera: Three.Camera; target: Three.WebGLRenderTarget | null }[] = [];
    constructor() {
      state.renderers.push(this);
    }
    setClearColor = vi.fn();
    setPixelRatio = vi.fn();
    getPixelRatio() {
      return 1;
    }
    setSize = vi.fn();
    setRenderTarget(target: Three.WebGLRenderTarget | null) {
      this.target = target;
    }
    getRenderTarget() {
      return this.target;
    }
    getViewport(value: Three.Vector4) {
      return value.copy(this.viewport);
    }
    setViewport(value: Three.Vector4) {
      this.viewport.copy(value);
    }
    getScissor(value: Three.Vector4) {
      return value.copy(this.scissor);
    }
    setScissor(value: Three.Vector4) {
      this.scissor.copy(value);
    }
    getScissorTest() {
      return this.scissorTest;
    }
    setScissorTest(value: boolean) {
      this.scissorTest = value;
    }
    render(scene: Three.Scene, camera: Three.Camera) {
      this.calls.push({ scene, camera, target: this.target });
      if (this.failRender) {
        throw new Error('render failed');
      }
    }
    dispose = vi.fn();
  }
  return { ...three, ...Object.fromEntries([['WebGLRenderer', Renderer]]) };
});

type Renderer = {
  calls: { scene: Three.Scene; camera: Three.PerspectiveCamera; target: Three.WebGLRenderTarget | null }[];
  target: Three.WebGLRenderTarget | null;
  viewport: Three.Vector4;
  scissor: Three.Vector4;
  scissorTest: boolean;
  failRender: boolean;
};
type Projection = {
  viewport: { width: number; height: number };
  anchor: { left: number; top: number; width: number; height: number };
  pad: number;
  feather: number;
};
const projection = (left: number, top: number): Projection => ({
  viewport: { width: 800, height: 600 },
  anchor: { left, top, width: 200, height: 100 },
  pad: 14,
  feather: 20
});

describe('private scene projection and confinement', () => {
  beforeEach(() => {
    state.renderers.length = 0;
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      createRadialGradient: () => ({ addColorStop: vi.fn() }),
      fillRect: vi.fn()
    } as unknown as CanvasRenderingContext2D);
  });
  afterEach(() => vi.restoreAllMocks());
  async function setup() {
    const { isotipoCreateScene } = await import('./isotipoScene');
    const engine = await isotipoCreateScene(document.createElement('canvas'), colors);
    engine.resize(800, 600);
    const renderer = state.renderers[0] as Renderer;
    const render = engine.render as unknown as (
      name: 'hero',
      progress: number,
      reduced: boolean,
      animation: { time: number; intro: number },
      input?: Projection
    ) => void;
    return { engine, renderer, render: (input?: Projection) => render('hero', 0, true, { time: 0, intro: 1 }, input) };
  }
  it.each([
    [300, 250],
    [80, 120],
    [-250, -90]
  ])('projects anchor center at signed position %i,%i and fits', async (left, top) => {
    const { engine, renderer, render } = await setup();
    render(projection(left, top));
    expect(renderer.calls).toHaveLength(2);
    const camera = renderer.calls[0]?.camera;
    if (!camera) {
      throw new Error('Missing camera');
    }
    const three = await import('three');
    const center = new three.Vector3(0, 0, 0).project(camera);
    expect(center.x).toBeCloseTo(((left + 100) / 800) * 2 - 1, 5);
    expect(center.y).toBeCloseTo(1 - ((top + 50) / 600) * 2, 5);
    const identity = camera.projectionMatrix.clone().multiply(camera.projectionMatrixInverse);
    expect(identity.elements[0]).toBeCloseTo(1, 6);
    expect(identity.elements[5]).toBeCloseTo(1, 6);
    engine.dispose();
  });
  it('recomputes on anchor changes and clears lens shift on return to legacy', async () => {
    const { engine, renderer, render } = await setup();
    render(projection(80, 120));
    const camera = renderer.calls[0]?.camera;
    if (!camera) {
      throw new Error('Missing camera');
    }
    const first = camera.position.clone();
    const input = projection(80, 120);
    input.anchor.height = 50;
    render(input);
    expect(camera.position.distanceTo(first)).toBeGreaterThan(0.01);
    render();
    expect(camera.projectionMatrix.elements[8]).toBeCloseTo(0);
    expect(camera.projectionMatrix.elements[9]).toBeCloseTo(0);
    engine.dispose();
  });
  it('composites the entire scene with feather shader and restores renderer state and disposes target', async () => {
    const { engine, renderer, render } = await setup();
    const viewport = renderer.viewport.clone();
    const scissor = renderer.scissor.clone();
    render(projection(-50, 120));
    const scenePass = renderer.calls[0];
    const finalPass = renderer.calls[1];
    if (!scenePass?.target || !finalPass) {
      throw new Error('Missing render pass');
    }
    expect(scenePass.target).not.toBeNull();
    expect(finalPass.target).toBeNull();
    const material = (finalPass.scene.children[0] as Three.Mesh).material as Three.ShaderMaterial;
    expect(material.fragmentShader).toMatch(/clamp/);
    expect(material.fragmentShader).toContain('#include <colorspace_fragment>');
    expect(scenePass.target.samples).toBe(4);
    expect(material.uniforms).toHaveProperty('maskRect');
    expect(renderer.target).toBeNull();
    expect(renderer.viewport.equals(viewport)).toBe(true);
    expect(renderer.scissor.equals(scissor)).toBe(true);
    expect(renderer.scissorTest).toBe(true);
    const disposal = vi.spyOn(scenePass.target, 'dispose');
    const mesh = finalPass.scene.children[0] as Three.Mesh;
    const geometryDisposal = vi.spyOn(mesh.geometry, 'dispose');
    const materialDisposal = vi.spyOn(mesh.material as Three.Material, 'dispose');
    engine.dispose();
    expect(disposal).toHaveBeenCalledOnce();
    expect(geometryDisposal).toHaveBeenCalledOnce();
    expect(materialDisposal).toHaveBeenCalledOnce();
  });

  it('fits assembled projected bounds to 90% of the anchor', async () => {
    const { engine, renderer, render } = await setup();
    const input = projection(80, 120);
    render(input);
    const call = renderer.calls[0];
    if (!call) {
      throw new Error('Missing scene pass');
    }
    const three = await import('three');
    const { isotipoPolygons, isotipoParsePolygon } = await import('./isotipoScene');
    const points = isotipoPolygons.flatMap((polygon) => isotipoParsePolygon(polygon.points));
    const xs = points.map(([x]) => x);
    const ys = points.map(([, y]) => y);
    const group = call.scene.children.find((item) => item.type === 'Group');
    if (!group) {
      throw new Error('Missing group');
    }
    const projected = [Math.min(...xs), Math.max(...xs)].flatMap((x) =>
      [Math.min(...ys), Math.max(...ys)].flatMap((y) =>
        [-0.22, 0.22].map((z) => new three.Vector3(x, y, z).applyMatrix4(group.matrixWorld).project(call.camera))
      )
    );
    const width = (Math.max(...projected.map((p) => p.x)) - Math.min(...projected.map((p) => p.x))) * 400;
    const height = (Math.max(...projected.map((p) => p.y)) - Math.min(...projected.map((p) => p.y))) * 300;
    expect(width).toBeLessThanOrEqual(input.anchor.width * 0.90001);
    expect(height).toBeLessThanOrEqual(input.anchor.height * 0.90001);
    expect(Math.max(width / input.anchor.width, height / input.anchor.height)).toBeCloseTo(0.9, 4);
    engine.dispose();
  });

  it('sets signed mask limits and linear intersecting ramps within the viewport', async () => {
    const { engine, renderer, render } = await setup();
    render(projection(-50, 120));
    const pass = renderer.calls[1];
    if (!pass) {
      throw new Error('Missing composite');
    }
    const material = (pass.scene.children[0] as Three.Mesh).material as Three.ShaderMaterial;
    const rect = material.uniforms.maskRect?.value as Three.Vector4;
    const viewport = material.uniforms.viewportSize?.value as Three.Vector2;
    const feather = material.uniforms.feather?.value as number;
    expect(rect.toArray()).toEqual([-64, 106, 164, 234]);
    expect(viewport.toArray()).toEqual([800, 600]);
    expect(feather).toBe(20);
    const sample = (x: number, y: number) => {
      if (x < 0 || y < 0 || x >= viewport.x || y >= viewport.y) {
        return 0;
      }
      const ramp = (edge: number) => Math.max(0, Math.min(1, edge / feather));
      return ramp(Math.min(x - rect.x, rect.z - x)) * ramp(Math.min(y - rect.y, rect.w - y));
    };
    expect(sample(30, 150)).toBe(1);
    expect(sample(165, 150)).toBe(0);
    expect(sample(154, 150)).toBeCloseTo(0.5);
    expect(sample(154, 116)).toBeCloseTo(0.25);
    expect(sample(-1, 150)).toBe(0);
    expect(sample(0, 150)).toBe(1);
    engine.dispose();
  });

  it('invalidates fit for geometry, viewport, pose, fov, rotation and scale', async () => {
    const { engine, renderer } = await setup();
    const input = projection(80, 120);
    const pose = { az: -16, el: 7, fov: 24, ex: 0, halo: 0.3 };
    const draw = (p: Projection, time: number, intro: number, nextPose = pose) =>
      engine.render('hero', 0, false, { time, intro, pose: nextPose }, p);
    draw(input, 0, 1);
    const camera = renderer.calls[0]?.camera;
    if (!camera) {
      throw new Error('Missing camera');
    }
    const update = vi.spyOn(camera, 'updateProjectionMatrix');
    draw(input, 0, 1);
    expect(update).not.toHaveBeenCalled();
    const changed = (action: () => void) => {
      draw(input, 0, 1);
      update.mockClear();
      action();
      expect(update.mock.calls.length).toBeGreaterThan(1);
    };
    changed(() => draw({ ...input, anchor: { ...input.anchor, left: 81 } }, 0, 1));
    changed(() => draw({ ...input, anchor: { ...input.anchor, top: 121 } }, 0, 1));
    changed(() => draw({ ...input, anchor: { ...input.anchor, width: 201 } }, 0, 1));
    changed(() => draw({ ...input, anchor: { ...input.anchor, height: 101 } }, 0, 1));
    changed(() => draw({ ...input, viewport: { width: 801, height: 600 } }, 0, 1));
    changed(() => draw({ ...input, viewport: { width: 800, height: 601 } }, 0, 1));
    changed(() => draw(input, 0, 1, { ...pose, fov: 25 }));
    changed(() => draw(input, 0, 1, { ...pose, az: -15 }));
    changed(() => draw(input, 0, 1, { ...pose, el: 8 }));
    changed(() => draw(input, 0, 1, { ...pose, ex: 0.1 }));
    changed(() => draw(input, 0, 1, { ...pose, halo: 0.4 }));
    changed(() => draw(input, 1, 1));
    changed(() => draw(input, 1, 0.5));
    engine.dispose();
  });

  it('restores state and disposes every composite resource if a projected render throws', async () => {
    const { engine, renderer, render } = await setup();
    const three = await import('three');
    const prior = new three.WebGLRenderTarget(2, 2);
    renderer.target = prior;
    const viewport = renderer.viewport.clone();
    const scissor = renderer.scissor.clone();
    render(projection(80, 120));
    const scenePass = renderer.calls[0];
    const finalPass = renderer.calls[1];
    if (!scenePass?.target || !finalPass) {
      throw new Error('Missing render passes');
    }
    expect(finalPass.target).toBe(prior);
    const mesh = finalPass.scene.children[0] as Three.Mesh;
    const targetDisposed = vi.spyOn(scenePass.target, 'dispose');
    const geometryDisposed = vi.spyOn(mesh.geometry, 'dispose');
    const materialDisposed = vi.spyOn(mesh.material as Three.Material, 'dispose');
    renderer.failRender = true;
    expect(() => render(projection(80, 120))).toThrow('render failed');
    expect(renderer.target).toBe(prior);
    expect(renderer.viewport.equals(viewport)).toBe(true);
    expect(renderer.scissor.equals(scissor)).toBe(true);
    expect(renderer.scissorTest).toBe(true);
    expect(targetDisposed).toHaveBeenCalledOnce();
    expect(geometryDisposed).toHaveBeenCalledOnce();
    expect(materialDisposed).toHaveBeenCalledOnce();
    engine.dispose();
    expect(targetDisposed).toHaveBeenCalledOnce();
    prior.dispose();
  });
});
