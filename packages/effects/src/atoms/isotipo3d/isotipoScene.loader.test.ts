import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const colors = { light: '#e91b35', shade: '#800c1d', neon: '#ff0036', redLight: '#ff335e' };

describe('Isotipo3D lazy three loading', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  beforeEach(() => {
    vi.resetModules();
    vi.doUnmock('three');
  });

  it('does not load three on scene module import and loads it when requested', async () => {
    let isotipoCalls = 0;
    vi.doMock('three', () => {
      isotipoCalls++;
      return Object.fromEntries([['Scene', class {}]]);
    });
    const scene = await import('./isotipoScene');
    expect(isotipoCalls).toBe(0);
    const load = Reflect.get(scene, 'isotipoLoadThree');
    expect(load).toBeTypeOf('function');
    const three = await load();
    expect(isotipoCalls).toBe(1);
    expect(three.Scene).toBeTypeOf('function');
  });

  it('creates, sizes, renders and disposes the seven source meshes without scheduling frames', async () => {
    const disposed = vi.fn();
    const setSize = vi.fn();
    const setPixelRatio = vi.fn();
    const render = vi.fn();
    const cameraPositions: number[][] = [];
    const meshes: unknown[] = [];
    const debris: InstancedMesh[] = [];
    const sprites: Sprite[] = [];
    const stops: [number, string][] = [];
    const materialOptions: Record<string, unknown>[] = [];
    const materials: Material[] = [];
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      createRadialGradient: () => ({ addColorStop: (offset: number, color: string) => stops.push([offset, color]) }),
      fillRect: vi.fn(),
      fillStyle: ''
    } as unknown as CanvasRenderingContext2D);
    const lights: { color: string | number; intensity: number; position: { set: ReturnType<typeof vi.fn> } }[] = [];
    class Vector2 {
      constructor(
        public x: number,
        public y: number
      ) {}
    }
    class Shape {
      constructor(public points: Vector2[]) {}
    }
    class Geometry {
      translate() {
        return this;
      }
      computeVertexNormals = vi.fn();
      dispose() {
        disposed('geometry');
      }
    }
    class Material {
      emissiveIntensity = 0;
      constructor(options: Record<string, unknown>) {
        materialOptions.push(options);
        materials.push(this);
      }
      dispose() {
        disposed('material');
      }
    }
    class Group {
      matrixWorld = {};
      rotation = { y: 0 };
      scale = { setScalar: vi.fn() };
      updateMatrixWorld = vi.fn();
      add(...items: unknown[]) {
        meshes.push(...items);
      }
    }
    class Camera {
      aspect = 1;
      fov = 0;
      distance = 0;
      position = {
        set: (...args: number[]) => {
          cameraPositions.push(args);
          this.distance = Math.hypot(...args);
        }
      };
      lookAt = vi.fn();
      updateProjectionMatrix = vi.fn();
      updateMatrixWorld = vi.fn();
    }
    class Vector3 {
      constructor(
        public x = 0,
        public y = 0,
        public z = 0
      ) {}
      copy(other: Vector3) {
        this.x = other.x;
        this.y = other.y;
        this.z = other.z;
        return this;
      }
      length() {
        return Math.hypot(this.x, this.y, this.z);
      }
      applyMatrix4() {
        return this;
      }
      project(camera: Camera) {
        const scale = (camera.distance - this.z) * Math.tan((camera.fov * Math.PI) / 360);
        this.x /= scale * camera.aspect;
        this.y /= scale;
        return this;
      }
    }
    class Box3 {
      min = new Vector3(-3.2, -3.05, -0.22);
      max = new Vector3(3.2, 3.05, 0.22);
      setFromObject() {
        return this;
      }
    }
    class Renderer {
      setSize = setSize;
      setPixelRatio = setPixelRatio;
      render = render;
      setClearColor = vi.fn();
      dispose() {
        disposed('renderer');
      }
    }
    class Mesh {
      position = { set: vi.fn() };
      rotation = { set: vi.fn() };
      constructor(
        public geometry: Geometry,
        public material: unknown
      ) {}
    }
    class InstancedMesh {
      count = 100;
      visible = false;
      frustumCulled = true;
      instanceMatrix = { setUsage: vi.fn(), needsUpdate: false };
      setColorAt = vi.fn();
      setMatrixAt = vi.fn();
      constructor() {
        debris.push(this);
      }
      dispose = vi.fn();
    }
    class SpriteMaterial extends Material {
      opacity = 0;
    }
    class CanvasTexture {
      colorSpace = '';
      dispose() {
        disposed('texture');
      }
    }
    class Sprite {
      scale = { set: vi.fn() };
      position = { set: vi.fn() };
      constructor(public material: SpriteMaterial) {
        sprites.push(this);
      }
    }
    class Object3D {
      position = { set: vi.fn() };
      rotation = { set: vi.fn() };
      scale = { setScalar: vi.fn() };
      matrix: unknown = {};
      updateMatrix() {
        this.matrix = {
          position: this.position.set.mock.lastCall,
          rotation: this.rotation.set.mock.lastCall,
          scale: this.scale.setScalar.mock.lastCall
        };
      }
    }
    class Color {
      constructor(public color: string) {}
    }
    class Light {
      position = { set: vi.fn() };
      constructor(
        public color: string | number,
        public intensity: number
      ) {
        lights.push(this);
      }
    }
    vi.doMock('three', () =>
      Object.fromEntries([
        ['WebGLRenderer', Renderer],
        ['Scene', Group],
        ['Group', Group],
        ['PerspectiveCamera', Camera],
        ['AmbientLight', Light],
        ['DirectionalLight', Light],
        ['Vector2', Vector2],
        ['Vector3', Vector3],
        ['Box3', Box3],
        ['Shape', Shape],
        ['ShapeUtils', { isClockWise: () => false }],
        ['ExtrudeGeometry', Geometry],
        ['MeshStandardMaterial', Material],
        ['Mesh', Mesh],
        ['InstancedMesh', InstancedMesh],
        ['Sprite', Sprite],
        ['SpriteMaterial', SpriteMaterial],
        ['CanvasTexture', CanvasTexture],
        ['AdditiveBlending', 1],
        ['Object3D', Object3D],
        ['Color', Color],
        ['DynamicDrawUsage', 1],
        ['FrontSide', 0],
        ['SRGBColorSpace', 'srgb']
      ])
    );
    const scene = await import('./isotipoScene');
    const create = Reflect.get(scene, 'isotipoCreateScene');
    expect(create).toBeTypeOf('function');
    const engine = await create(document.createElement('canvas'), colors);
    expect(meshes.filter((item) => item instanceof Mesh)).toHaveLength(7);
    expect(lights.map(({ color, intensity }) => [color, intensity])).toEqual([
      [0xffffff, 0.6],
      [0xffffff, 2],
      ['#ff0036', 5.5],
      ['#ff335e', 2.2]
    ]);
    expect(lights[1]?.position.set).toHaveBeenCalledWith(-4, 6, 10);
    expect(lights[2]?.position.set).toHaveBeenCalledWith(9, 3.5, -3);
    expect(lights[3]?.position.set).toHaveBeenCalledWith(-8, -3, -4);
    expect(materialOptions[0]).toMatchObject({
      color: '#e91b35',
      emissive: '#e91b35',
      emissiveIntensity: 0.3,
      roughness: 0.62,
      metalness: 0.04
    });
    expect(materialOptions[1]).toMatchObject({
      color: '#800c1d',
      emissive: '#800c1d',
      emissiveIntensity: 0.3,
      roughness: 0.62,
      metalness: 0.04
    });
    expect(materialOptions[2]).toMatchObject({
      color: 0x5a0a18,
      emissive: 0x1a0005,
      roughness: 0.34,
      metalness: 0.55,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1
    });
    expect(materialOptions[3]).toMatchObject({ color: 0xffffff, emissive: 0x220006, roughness: 0.5, metalness: 0.1 });
    expect(materialOptions[4]).toMatchObject({ color: '#ff0036', transparent: true, depthWrite: false, opacity: 0.3 });
    expect(debris).toHaveLength(1);
    expect(sprites).toHaveLength(1);
    expect(stops).toEqual([
      [0, 'rgba(255,255,255,1)'],
      [0.25, 'rgba(255,255,255,.42)'],
      [0.6, 'rgba(255,255,255,.08)'],
      [1, 'rgba(255,255,255,0)']
    ]);
    expect(sprites[0]?.scale.set).toHaveBeenCalledWith(9, 9, 1);
    expect(sprites[0]?.position.set).toHaveBeenCalledWith(0.2, 0.1, -2.2);
    expect(debris[0]?.setColorAt).toHaveBeenCalledTimes(100);
    engine.resize(760, 200, 3, false);
    expect(debris[0]?.count).toBe(44);
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.25);
    engine.resize(761, 200, 3, false);
    expect(debris[0]?.count).toBe(100);
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.75);
    engine.resize(761, 200, 3, true);
    expect(debris[0]?.count).toBe(44);
    expect(setPixelRatio).toHaveBeenLastCalledWith(1.25);
    engine.resize(320, 200, 1, false);
    expect(setPixelRatio).toHaveBeenLastCalledWith(1);
    expect(setSize).toHaveBeenCalledWith(320, 200, false);
    engine.render('hero', 4, false);
    expect(render).toHaveBeenCalledTimes(1);
    const finalPosition = cameraPositions.at(-1);
    expect(finalPosition).toBeDefined();
    const distance = Math.hypot(...(finalPosition ?? []));
    const projectedHeight = 6.1 / ((distance - 0.22) * Math.tan((12 * Math.PI) / 360));
    expect(projectedHeight).toBeCloseTo(1.8, 3);
    const callsAfterFit = cameraPositions.length;
    engine.render('hero', 4, false);
    expect(cameraPositions.length - callsAfterFit).toBeLessThanOrEqual(1);
    engine.resize(200, 400);
    const callsBeforeRefit = cameraPositions.length;
    engine.render('hero', 4, false);
    expect(cameraPositions.length - callsBeforeRefit).toBeGreaterThan(1);
    const portraitPosition = cameraPositions.at(-1);
    const portraitDistance = Math.hypot(...(portraitPosition ?? []));
    const projectedWidth = 6.4 / ((portraitDistance - 0.22) * Math.tan((12 * Math.PI) / 360) * 0.5);
    expect(projectedWidth).toBeCloseTo(1.8, 3);
    engine.resize(320, 200);
    const pieces = meshes.filter((item): item is Mesh => item instanceof Mesh);
    const assembled = pieces.map((piece) => piece.position.set.mock.lastCall);
    engine.render('lab', 0.5, false);
    expect(sprites[0]?.material.opacity).toBeCloseTo(0.21);
    expect(materials[0]?.emissiveIntensity).toBeCloseTo(0.45);
    expect(materials[1]?.emissiveIntensity).toBeCloseTo(0.45);
    expect(debris[0]?.visible).toBe(true);
    expect(debris[0]?.setMatrixAt).toHaveBeenCalledTimes(44);
    const firstDebrisMatrices = debris[0]?.setMatrixAt.mock.calls.slice();
    const exploded = pieces.map((piece) => piece.position.set.mock.lastCall);
    expect(exploded).not.toEqual(assembled);
    engine.render('lab', 0.5, false);
    expect(pieces.map((piece) => piece.position.set.mock.lastCall)).toEqual(exploded);
    engine.render('lab', 0.5, true);
    expect(pieces.slice(0, 4).map((piece) => piece.position.set.mock.lastCall)).toEqual(assembled.slice(0, 4));
    const second = await create(document.createElement('canvas'), colors);
    second.resize(320, 200);
    second.render('lab', 0.5, false);
    expect(debris[1]?.setMatrixAt.mock.calls).toEqual(firstDebrisMatrices);
    const secondPieces = meshes.filter((item): item is Mesh => item instanceof Mesh).slice(7);
    expect(secondPieces.map((piece) => piece.position.set.mock.lastCall)).toEqual(exploded);
    const group = meshes.find((item): item is Group => item instanceof Group);
    engine.render('hero', 0, false, { time: 2, intro: 0.5 });
    expect(group?.scale.setScalar).toHaveBeenLastCalledWith(0.99);
    expect(group?.rotation.y).toBeCloseTo(Math.sin(0.6) * 0.02);
    const firstPixel = pieces[4]?.position.set.mock.lastCall;
    const callsBeforeAnimatedRefit = cameraPositions.length;
    engine.render('hero', 0, false, { time: 3, intro: 0.5 });
    expect(cameraPositions.length - callsBeforeAnimatedRefit).toBeGreaterThan(1);
    expect(pieces[4]?.position.set.mock.lastCall).not.toEqual(firstPixel);
    engine.render('lab', 0.5, false, { time: 2, intro: 1 });
    expect(debris[0]?.setMatrixAt.mock.calls.slice(-44)).not.toEqual(firstDebrisMatrices);
    engine.dispose();
    engine.dispose();
    expect(disposed.mock.calls.filter(([kind]) => kind === 'geometry')).toHaveLength(8);
    expect(disposed.mock.calls.filter(([kind]) => kind === 'material')).toHaveLength(5);
    expect(disposed.mock.calls.filter(([kind]) => kind === 'texture')).toHaveLength(1);
    expect(disposed.mock.calls.filter(([kind]) => kind === 'renderer')).toHaveLength(1);
    second.dispose();
  });

  it('releases acquired resources after a failed geometry constructor, even if a disposer throws', async () => {
    const released: string[] = [];
    let materials = 0;
    class Renderer {
      setClearColor = vi.fn();
      dispose() {
        released.push('renderer');
      }
    }
    class Material {
      id = ++materials;
      dispose() {
        released.push(`material-${this.id}`);
        if (this.id === 2) {
          throw new Error('disposal failed');
        }
      }
    }
    class Group {
      add = vi.fn();
    }
    class Light {
      position = { set: vi.fn() };
    }
    class Vector2 {
      constructor(
        public x: number,
        public y: number
      ) {}
    }
    class BrokenGeometry {
      constructor() {
        throw new Error('geometry failed');
      }
    }
    vi.doMock('three', () =>
      Object.fromEntries([
        ['WebGLRenderer', Renderer],
        ['Scene', Group],
        ['Group', Group],
        ['PerspectiveCamera', class {}],
        ['AmbientLight', Light],
        ['DirectionalLight', Light],
        ['MeshStandardMaterial', Material],
        ['Vector2', Vector2],
        ['Shape', class {}],
        ['ShapeUtils', { isClockWise: () => false }],
        ['ExtrudeGeometry', BrokenGeometry],
        ['FrontSide', 0],
        ['SRGBColorSpace', 'srgb']
      ])
    );
    const { isotipoCreateScene } = await import('./isotipoScene');
    await expect(isotipoCreateScene(document.createElement('canvas'), colors)).rejects.toThrow('geometry failed');
    expect(released).toEqual(['material-3', 'material-2', 'material-1', 'renderer']);
  });

  it.each([
    ['WebGLRenderer', 1],
    ['Scene', 1],
    ['PerspectiveCamera', 1],
    ['Group', 1],
    ['AmbientLight', 1],
    ['DirectionalLight', 1],
    ['DirectionalLight', 2],
    ['DirectionalLight', 3],
    ['MeshStandardMaterial', 1],
    ['MeshStandardMaterial', 2],
    ['MeshStandardMaterial', 3],
    ['MeshStandardMaterial', 4],
    ['ExtrudeGeometry', 1],
    ['ExtrudeGeometry', 2],
    ['ExtrudeGeometry', 3],
    ['ExtrudeGeometry', 4],
    ['ExtrudeGeometry', 5],
    ['ExtrudeGeometry', 6],
    ['ExtrudeGeometry', 7],
    ['ExtrudeGeometry', 8],
    ['Mesh', 1],
    ['Mesh', 2],
    ['Mesh', 3],
    ['Mesh', 4],
    ['Mesh', 5],
    ['Mesh', 6],
    ['Mesh', 7],
    ['Box3', 1],
    ['InstancedMesh', 1],
    ['Color', 1],
    ['Color', 2],
    ['Object3D', 1],
    ['CanvasTexture', 1],
    ['SpriteMaterial', 1],
    ['Sprite', 1]
  ])('releases all earlier GPU resources when %s acquisition %i fails', async (failingName, failingIndex) => {
    const acquired: string[] = [];
    const disposed: string[] = [];
    const counts = new Map<string, number>();
    const disposable = new Set([
      'WebGLRenderer',
      'MeshStandardMaterial',
      'ExtrudeGeometry',
      'InstancedMesh',
      'CanvasTexture',
      'SpriteMaterial'
    ]);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue({
      createRadialGradient: () => ({ addColorStop: vi.fn() }),
      fillRect: vi.fn(),
      fillStyle: ''
    } as unknown as CanvasRenderingContext2D);
    class Fake {
      position = { set: vi.fn() };
      scale = { set: vi.fn() };
      instanceMatrix = { setUsage: vi.fn() };
      min = { x: -3, y: -3, z: -1 };
      max = { x: 3, y: 3, z: 1 };
      setClearColor = vi.fn();
      add = vi.fn();
      updateMatrixWorld = vi.fn();
      setFromObject() {
        return this;
      }
      translate = vi.fn();
      computeVertexNormals = vi.fn();
      setColorAt = vi.fn();
    }
    const make = (name: string) =>
      class extends Fake {
        dispose: () => void;
        constructor(..._args: unknown[]) {
          super();
          const count = (counts.get(name) ?? 0) + 1;
          counts.set(name, count);
          const label = `${name}:${count}`;
          if (name === failingName && count === failingIndex) {
            throw new Error(`failed ${label}`);
          }
          if (disposable.has(name)) {
            acquired.push(label);
          }
          this.dispose = () => {
            disposed.push(label);
          };
        }
      };
    const constructors = [
      'WebGLRenderer',
      'Scene',
      'PerspectiveCamera',
      'AmbientLight',
      'DirectionalLight',
      'MeshStandardMaterial',
      'Group',
      'Vector2',
      'Vector3',
      'Shape',
      'ExtrudeGeometry',
      'Mesh',
      'Box3',
      'InstancedMesh',
      'Color',
      'Object3D',
      'CanvasTexture',
      'SpriteMaterial',
      'Sprite'
    ];
    vi.doMock('three', () =>
      Object.fromEntries([
        ...constructors.map((name) => [name, make(name)]),
        ['ShapeUtils', { isClockWise: () => false }],
        ['FrontSide', 0],
        ['SRGBColorSpace', 'srgb'],
        ['DynamicDrawUsage', 1],
        ['AdditiveBlending', 1]
      ])
    );
    const { isotipoCreateScene } = await import('./isotipoScene');
    await expect(isotipoCreateScene(document.createElement('canvas'), colors)).rejects.toThrow(
      `failed ${failingName}:${failingIndex}`
    );
    expect(disposed).toEqual(acquired.reverse());
  });

  it('does not acquire GPU resources if aborted while the three import is pending', async () => {
    let release: (() => void) | undefined;
    const pending = new Promise<void>((resolve) => {
      release = resolve;
    });
    const acquired = vi.fn();
    class Renderer {
      constructor() {
        acquired('renderer');
      }
    }
    vi.doMock('three', async () => {
      await pending;
      return Object.fromEntries([['WebGLRenderer', Renderer]]);
    });
    const scene = await import('./isotipoScene');
    const create = Reflect.get(scene, 'isotipoCreateScene');
    const controller = new AbortController();
    const result = create(document.createElement('canvas'), colors, controller.signal);
    controller.abort();
    release?.();
    await expect(result).rejects.toMatchObject({ name: 'AbortError' });
    expect(acquired).not.toHaveBeenCalled();
  });

  it('propagates a rejected chunk import to its caller', async () => {
    let isotipoCalls = 0;
    vi.doMock('three', () => {
      isotipoCalls++;
      throw new Error('isotipo chunk unavailable');
    });
    const scene = await import('./isotipoScene');
    expect(isotipoCalls).toBe(0);
    const load = Reflect.get(scene, 'isotipoLoadThree');
    expect(load).toBeTypeOf('function');
    await expect(load()).rejects.toThrow();
    expect(isotipoCalls).toBe(1);
  });
});
