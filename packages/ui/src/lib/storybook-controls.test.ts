// @vitest-environment node
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { composeStory, INTERNAL_DEFAULT_PROJECT_ANNOTATIONS } from '@storybook/react-vite';
import { withCustomConfig } from 'react-docgen-typescript';
import type { SBType, StrictArgTypes } from 'storybook/internal/types';
import { beforeAll, describe, expect, it } from 'vitest';
import { jsdocControlsEnhancer, mapJSDocControls } from '../../../../.storybook/jsdoc-controls';
import config from '../../../../.storybook/main';
import preview from '../../../../.storybook/preview';

const components = [
  ['AspectRatio', 'primitives/aspect-ratio'],
  ['Cluster', 'primitives/stack'],
  ['Gauge', 'atoms/gauge'],
  ['Heading', 'primitives/text'],
  ['Icon', 'atoms/icon'],
  ['IconButton', 'atoms/icon-button'],
  ['Input', 'atoms/input'],
  ['Kbd', 'atoms/kbd'],
  ['Logo', 'atoms/logo'],
  ['ProductMark', 'atoms/product-mark'],
  ['ProgressBar', 'atoms/progress-bar'],
  ['Skeleton', 'primitives/skeleton'],
  ['Spinner', 'atoms/spinner'],
  ['Stack', 'primitives/stack'],
  ['StatusDot', 'atoms/status-dot'],
  ['Surface', 'primitives/surface'],
  ['Text', 'primitives/text'],
  ['Textarea', 'atoms/textarea'],
  ['VisuallyHidden', 'primitives/visually-hidden']
] as const;
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;

function component(name: string) {
  const doc = docs.find((item) => item.displayName === name);
  if (!doc) {
    throw new Error(`Missing docgen for ${name}`);
  }
  // Attach real parser output at the same boundary used by Vite's docgen transform.
  return Object.assign((_props: Record<string, unknown>) => null, { __docgenInfo: doc });
}

function story(name: string, registered = true) {
  return composeStory(
    {},
    { title: `Metadata/${name}`, component: component(name) },
    registered ? preview : {},
    'Default'
  );
}

type FixtureType = { name: string; value?: unknown[] | string };

function fixture(type: FixtureType, directive: unknown, reason?: string) {
  const argTypes: StrictArgTypes = {
    sample: {
      // Exercise runtime metadata too: SBEnumType's declared union omits primitive booleans.
      name: 'sample',
      description: 'Original description',
      type: type as SBType,
      table: {
        type: { summary: 'Original type' },
        defaultValue: { summary: 'Documented default' }
      }
    }
  };
  const metadata = {
    displayName: 'Fixture',
    __docgenInfo: {
      props: { sample: { tags: { control: directive, controlReason: reason } } }
    }
  };
  return { argTypes, metadata };
}

const expected: Record<string, Record<string, string | false>> = {
  aspectratio: {
    ratio: 'number'
  },
  stack: { gap: 'select', justifyContent: 'select', asChild: 'boolean', alignItems: 'select' },
  cluster: { gap: 'select', justifyContent: 'select', asChild: 'boolean', alignItems: 'select' },
  text: {
    variant: 'select',
    tone: 'select',
    accent: 'text',
    accentBreak: 'boolean',
    children: false,
    asChild: 'boolean'
  },
  heading: {
    variant: 'select',
    tone: 'select',
    accent: 'text',
    accentBreak: 'boolean',
    children: false,
    level: 'select'
  },
  surface: { tone: 'select', elevation: 'select', padding: 'select', radius: 'select', asChild: 'boolean' },
  visuallyhidden: { children: false, asChild: 'boolean' },
  skeleton: { variant: 'select', size: 'select', pulse: 'boolean' },
  icon: { name: 'select', size: 'select', filled: 'boolean', label: 'text' },
  iconbutton: { label: 'text', icon: false, variant: 'select', size: 'select', asChild: 'boolean', children: false },
  spinner: { label: 'text', size: 'select' },
  logo: { variant: 'select', size: 'select', label: 'text', href: 'text' },
  statusdot: { state: 'select', pulse: 'boolean' },
  kbd: { children: 'text', label: 'text' },
  progressbar: {
    value: 'number',
    label: 'text',
    valueText: 'text',
    size: 'select',
    variant: 'select',
    edge: 'boolean'
  },
  textarea: { variant: 'select' },
  input: { size: 'select', variant: 'select', type: 'select', icon: false },
  productmark: { monogram: 'text', label: 'text', href: 'text' },
  gauge: {
    label: 'text',
    value: 'number',
    valueText: 'text',
    state: 'select',
    stateText: 'text',
    unavailableText: 'text',
    center: false,
    size: false
  }
};
const ownPropCounts: Record<string, number> = {
  aspectratio: 1,
  gauge: 8,
  icon: 4,
  iconbutton: 6,
  skeleton: 3,
  spinner: 2,
  logo: 4,
  statusdot: 2,
  kbd: 2,
  progressbar: 6,
  textarea: 1,
  input: 4,
  productmark: 3,
  visuallyhidden: 2,
  stack: 4,
  cluster: 4,
  text: 6,
  heading: 6,
  surface: 5
};
const ownPropCount = (name: string): number => {
  const count = ownPropCounts[name.toLowerCase()];
  if (count === undefined) {
    throw new Error(`Missing own prop count for ${name}`);
  }
  return count;
};

describe('pure JSDoc Controls metadata mapping', () => {
  it.each([
    [{ name: 'string' }, 'text', { type: 'text' }],
    [{ name: 'number' }, 'number', { type: 'number' }],
    [{ name: 'boolean' }, 'boolean', { type: 'boolean' }],
    [{ name: 'enum', value: [false, true] }, 'boolean', { type: 'boolean' }],
    [{ name: 'enum', value: [true, false] }, 'boolean', { type: 'boolean' }],
    [{ name: 'enum', value: ['z', 2, false] }, 'select\nselect', { type: 'select' }],
    [{ name: 'string' }, ' text\r\ntext\n ', { type: 'text' }],
    [{ name: 'other', value: 'ReactNode' }, 'false', false]
  ] satisfies [FixtureType, unknown, unknown][])(
    'maps extracted %j with directive %j without mutating unrelated fields',
    (type, directive, control) => {
      const { argTypes, metadata } = fixture(type, directive, 'Non-serializable content; use the Content story.');
      const before = structuredClone(argTypes);
      const result = mapJSDocControls(argTypes, metadata);
      expect(result.diagnostics).toEqual([]);
      expect(result.argTypes.sample).toEqual({
        ...before.sample,
        control,
        ...('value' in type && type.name === 'enum' && String(directive).startsWith('select')
          ? { options: type.value }
          : {})
      });
      expect(result.argTypes.sample?.table?.disable).toBeUndefined();
      expect(argTypes).toEqual(before);
    }
  );

  it.each([
    [{ name: 'string' }, 'select'],
    [{ name: 'other', value: 'GaugeSize | number' }, 'select'],
    [{ name: 'enum', value: [] }, 'select'],
    [{ name: 'enum', value: [Number.NaN] }, 'select'],
    [{ name: 'enum', value: [Number.POSITIVE_INFINITY] }, 'select'],
    [{ name: 'enum', value: [{ value: '"alias"' }] }, 'select'],
    [{ name: 'enum', value: ['false', 'true'] }, 'boolean'],
    [{ name: 'enum', value: [true] }, 'boolean'],
    [{ name: 'other', value: 'ReactNode' }, 'boolean'],
    [{ name: 'string' }, 'number'],
    [{ name: 'number' }, 'text'],
    [{ name: 'text' }, 'text'],
    [{ name: 'string' }, 'string'],
    [{ name: 'number' }, 'range'],
    [{ name: 'enum', value: ['a', 'b'] }, 'select\nnumber'],
    [{ name: 'string' }, ''],
    [{ name: 'string' }, null],
    [{ name: 'string' }, { type: 'text' }],
    [{ name: 'other', value: 'ReactNode' }, 'false']
  ] satisfies [FixtureType, unknown][])(
    'diagnoses incompatible or unsupported metadata: %j / %j',
    (type, directive) => {
      const { argTypes, metadata } = fixture(type, directive);
      const result = mapJSDocControls(argTypes, metadata);
      expect(result.diagnostics).toHaveLength(1);
      expect(result.diagnostics[0]).toMatch(/^Fixture\.sample: /);
      expect(result.argTypes).toEqual(argTypes);
      expect(result.argTypes.sample?.control).toBeUndefined();
    }
  );

  it('rejects the obsolete string directive without changing the row or native fallback', () => {
    const { argTypes, metadata } = fixture({ name: 'string' }, 'string');
    expect(mapJSDocControls(argTypes, metadata)).toEqual({
      argTypes,
      diagnostics: ['Fixture.sample: unsupported @control string']
    });
  });

  it.each([false, { type: 'radio' }] as const)('preserves explicit control override %j', (control) => {
    const { argTypes, metadata } = fixture({ name: 'enum', value: ['b', 'a'] }, 'select');
    argTypes.sample = { ...argTypes.sample, name: 'sample', control, options: ['a', 'b'] };
    expect(mapJSDocControls(argTypes, metadata)).toEqual({ argTypes, diagnostics: [] });
  });

  it('rejects conflicting options instead of synthesizing a select from unverified choices', () => {
    const { argTypes, metadata } = fixture({ name: 'enum', value: ['b', 'a'] }, 'select');
    argTypes.sample = { ...argTypes.sample, name: 'sample', options: ['alias'] };
    const result = mapJSDocControls(argTypes, metadata);
    expect(result.argTypes).toEqual(argTypes);
    expect(result.diagnostics).toEqual(['Fixture.sample: @control select conflicts with existing options']);
  });

  it('ignores unknown, inherited, untagged and absent rows without creating props', () => {
    const { argTypes } = fixture({ name: 'string' }, 'text');
    const metadata = {
      __docgenInfo: {
        props: {
          sample: { parent: { fileName: '/repo/node_modules/@types/react/index.d.ts' }, tags: { control: 'nonsense' } },
          missing: { tags: { control: 'text' } }
        }
      }
    };
    for (const value of [
      undefined,
      null,
      [],
      'unknown',
      {},
      { __docgenInfo: [] },
      metadata,
      { __docgenInfo: { props: { sample: { tags: {} } } } }
    ]) {
      expect(mapJSDocControls(argTypes, value)).toEqual({ argTypes, diagnostics: [] });
    }
    expect(mapJSDocControls({}, metadata)).toEqual({ argTypes: {}, diagnostics: [] });
  });

  it('fails safe per prop without dropping a valid sibling', () => {
    const { argTypes, metadata } = fixture({ name: 'string' }, 'text');
    const result = mapJSDocControls(
      { ...argTypes, invalid: { name: 'invalid', type: { name: 'number' } } },
      {
        ...metadata,
        __docgenInfo: {
          props: {
            ...metadata.__docgenInfo.props,
            invalid: { tags: { control: 'text' } }
          }
        }
      }
    );
    expect(result.argTypes.sample?.control).toEqual({ type: 'text' });
    expect(result.argTypes.invalid?.control).toBeUndefined();
    expect(result.diagnostics).toEqual(['Fixture.invalid: @control text is incompatible with the extracted type']);
  });
});

describe('registered JSDoc Controls through installed Storybook extraction and inference', () => {
  beforeAll(() => {
    // Parse only implemented components: pending files fail their own tests, never their siblings.
    docs = parser.parse(
      components
        .map(([name, directory]) => fileURLToPath(new URL(`../${directory}/${name}.tsx`, import.meta.url)))
        .filter((path) => existsSync(path))
    );
  }, 20_000);

  it('demonstrates the native pipeline ignores separate docgen control tags', () => {
    const argTypes = story('Gauge', false).argTypes;
    expect(component('Gauge').__docgenInfo.props.state?.tags).toMatchObject({ control: 'select\nselect' });
    expect(argTypes.state?.control).toEqual({ type: 'radio' });
    expect(argTypes.center?.control).toEqual({ type: 'object' });
    expect(argTypes.size?.control).toEqual({ type: 'object' });
    expect(argTypes.state?.table?.jsDocTags).toBeUndefined();
  });

  it.each(components)('%s maps every annotated own prop after real extraction and inference', (name) => {
    const composed = story(name);
    expect(Object.keys(expected[name.toLowerCase()] ?? {})).toHaveLength(ownPropCount(name));
    for (const [prop, control] of Object.entries(expected[name.toLowerCase()] ?? {})) {
      expect
        .soft(composed.argTypes[prop]?.control, `${name}.${prop}`)
        .toEqual(control === false ? false : { type: control });
      if (control === 'text') {
        expect(composed.argTypes[prop]?.type?.name, `${name}.${prop} semantic type`).toBe('string');
      }
    }
    if (!['VisuallyHidden', 'Stack', 'Cluster', 'Text', 'Surface', 'IconButton'].includes(name)) {
      expect(composed.argTypes.asChild, `${name} must not expose asChild`).toBeUndefined();
    }
    expect(composed.args).toEqual({});
    const native = story(name, false).argTypes;
    for (const [prop, control] of Object.entries(expected[name.toLowerCase()] ?? {})) {
      if (control === 'select') {
        expect(composed.argTypes[prop]?.options, `${name}.${prop} full enum order`).toEqual(native[prop]?.options);
      }
    }
    // This is the installed renderer extractor, not inference reconstructed from tags.
    const extract = INTERNAL_DEFAULT_PROJECT_ANNOTATIONS.parameters?.docs?.extractArgTypes;
    expect(typeof extract).toBe('function');
    const extracted: StrictArgTypes = extract(component(name));
    expect(mapJSDocControls(extracted, component(name)).diagnostics).toEqual([]);
    for (const [prop, row] of Object.entries(extracted)) {
      const { control: _control, options: _options, ...unchanged } = composed.argTypes[prop] ?? {};
      expect(unchanged).toEqual(row);
    }
  });

  it.each([
    ['Gauge', { state: '"normal"', size: 'md', unavailableText: '"Data unavailable"' }],
    ['AspectRatio', { ratio: '1' }],
    ['Stack', { gap: '4', alignItems: '"stretch"', justifyContent: '"start"', asChild: 'false' }],
    ['Cluster', { gap: '4', alignItems: '"center"', justifyContent: '"start"', asChild: 'false' }],
    ['Text', { variant: '"eyebrow"', tone: '"canvas"', accentBreak: 'true', asChild: 'false' }],
    ['Heading', { variant: '"section"', tone: '"canvas"', accentBreak: 'true', level: '2' }],
    ['Surface', { tone: '"surface-1"', elevation: '1', padding: '"md"', radius: '"xl"', asChild: 'false' }],
    ['VisuallyHidden', { asChild: 'false' }],
    ['Skeleton', { variant: '"line"', size: '"md"', pulse: 'true' }],
    ['ProgressBar', { size: '"sm"', variant: '"default"', edge: 'false' }],
    ['Textarea', { variant: '"default"' }],
    ['Icon', { size: '"md"', filled: 'false' }],
    ['IconButton', { variant: '"ghost"', size: '"md"', asChild: 'false' }],
    ['Input', { size: '"md"', variant: '"default"', type: '"text"' }],
    ['Spinner', { size: '"md"' }],
    ['Logo', { variant: '"wordmark"', size: '"md"', label: '"egdev"' }],
    ['StatusDot', { state: '"stopped"', pulse: 'true' }]
  ] as const)('%s presents actual constant defaults without extra quote characters', (name, defaults) => {
    const { argTypes, args } = story(name);
    for (const [prop, summary] of Object.entries(defaults)) {
      expect.soft(argTypes[prop]?.table?.defaultValue?.summary, `${name}.${prop}`).toBe(summary);
    }
    // Documentation must not initialize optional Controls args just to fill the UI.
    expect(args).toEqual({});
  });

  it('keeps computed fallbacks and optional absence in descriptions, not fixed default metadata', () => {
    for (const [name, prop, rules] of [
      ['Gauge', 'valueText', [/When omitted/, /normalized decimal "X \/ 100"/, /Non-finite values.*no aria-valuetext/]],
      ['Gauge', 'stateText', [/Omitted when not supplied/]],
      ['Gauge', 'center', [/No center content when omitted/]]
    ] as const) {
      const row = story(name).argTypes[prop];
      expect.soft(row, `${name}.${prop} row`).toBeDefined();
      expect.soft(row?.table?.defaultValue, `${name}.${prop} must not invent a fixed default`).toBeUndefined();
      for (const rule of rules) {
        expect.soft(row?.description, `${name}.${prop} fallback rule`).toMatch(rule);
      }
    }
    expect(story('Gauge').argTypes.unavailableText?.table?.defaultValue?.summary).toBe('"Data unavailable"');
  });

  it('preserves explicit controls in real story composition without hiding rows', () => {
    const definition = {
      argTypes: { state: { control: { type: 'radio' as const } }, center: { control: false as const } }
    };
    const meta = { title: 'Metadata/Overrides', component: component('Gauge') };
    const composed = composeStory(definition, meta, preview, 'Default');
    const native = composeStory(definition, meta, {}, 'Default');
    // Storybook normalizes story-level controls before enhancers; preserve that representation too.
    expect(composed.argTypes.state?.control).toMatchObject({ type: 'radio' });
    expect(composed.argTypes.state?.control).toEqual(native.argTypes.state?.control);
    expect(composed.argTypes.center?.control).toEqual(native.argTypes.center?.control);
    expect(composed.argTypes.center?.table?.disable).toBeUndefined();
    expect(composed.args).toEqual({});
  });

  it('registers the first-pass enhancer without changing preview parameters', () => {
    expect(preview.argTypesEnhancers).toEqual([jsdocControlsEnhancer]);
    expect(jsdocControlsEnhancer.secondPass).toBeUndefined();
    expect(preview.parameters?.backgrounds).toEqual({ disable: true });
    expect(preview.parameters?.layout).toBe('padded');
  });

  it('retains IconButton required hidden naming, full choices and native button rows', () => {
    const { argTypes } = story('IconButton');
    expect(argTypes.label?.type).toMatchObject({ name: 'string', required: true });
    expect(argTypes.icon?.type?.required).toBe(true);
    for (const prop of ['label', 'icon', 'children']) {
      expect(argTypes[prop]?.table?.defaultValue, prop).toBeUndefined();
    }
    expect([...(argTypes.variant?.options ?? [])].sort()).toEqual(['ghost', 'outline', 'primary', 'secondary']);
    expect([...(argTypes.size?.options ?? [])].sort()).toEqual(['lg', 'md', 'sm']);
    for (const prop of ['icon', 'children']) {
      expect(argTypes[prop]?.control).toBe(false);
      expect(argTypes[prop]?.table?.disable).toBeUndefined();
    }
    for (const prop of [
      'id',
      'title',
      'className',
      'disabled',
      'type',
      'onClick',
      'name',
      'value',
      'tabIndex',
      'aria-describedby'
    ]) {
      expect(argTypes[prop], prop).toBeDefined();
      expect(argTypes[prop], prop).toEqual(story('IconButton', false).argTypes[prop]);
    }
    expect(argTypes['aria-label']).toBeUndefined();
  });

  it('retains Gauge rows, full public types, requiredness, defaults and ordered state choices', () => {
    const { argTypes } = story('Gauge');
    expect(argTypes.state?.options).toEqual(['normal', 'warning', 'critical', 'muted']);
    expect(argTypes.label?.type).toMatchObject({ name: 'string', required: true });
    expect(argTypes.value?.type).toMatchObject({ name: 'number', required: true });
    expect(argTypes.label?.table?.defaultValue).toBeUndefined();
    expect(argTypes.value?.table?.defaultValue).toBeUndefined();
    expect(argTypes.valueText?.table?.defaultValue).toBeUndefined();
    expect(argTypes.center?.table?.defaultValue).toBeUndefined();
    expect(argTypes.size?.table?.defaultValue?.summary).toBe('md');
    expect(argTypes.stateText?.description).toMatch(/Required non-empty/);
    for (const prop of ['center', 'size']) {
      expect(argTypes[prop]?.control).toBe(false);
      expect(argTypes[prop]?.table?.disable).not.toBe(true);
      expect(argTypes[prop]?.name).toBe(prop);
      expect(argTypes[prop]?.description).toBeTruthy();
    }
    expect(component('Gauge').__docgenInfo.props.size?.type.name).toBe('number | GaugeSize');
    expect(argTypes.center?.type?.name).not.toBe('boolean');
    for (const prop of ['id', 'title', 'aria-describedby', 'className', 'style']) {
      expect(argTypes[prop]).toEqual(story('Gauge', false).argTypes[prop]);
    }
    for (const prop of ['role', 'onClick', 'asChild', 'tabIndex']) {
      expect(argTypes[prop]).toBeUndefined();
    }
  });

  it('retains Skeleton silhouette rows, full choice order and decorative native rows', () => {
    const { argTypes } = story('Skeleton');
    // The installed extractor reorders resolved union members; only the choice set is contractual.
    expect([...(argTypes.variant?.options ?? [])].sort()).toEqual(['block', 'circle', 'line']);
    expect([...(argTypes.size?.options ?? [])].sort()).toEqual(['lg', 'md', 'sm']);
    expect(argTypes.pulse?.type, 'pulse').toMatchObject({ name: 'boolean', required: false });
    expect(argTypes.pulse?.control, 'pulse').toEqual({ type: 'boolean' });
    expect(argTypes.pulse?.table?.defaultValue?.summary, 'pulse must document its on default').toBe('true');
    for (const prop of ['variant', 'size']) {
      expect(argTypes[prop]?.type, prop).toMatchObject({ name: 'enum', required: false });
      expect(argTypes[prop]?.control, prop).toEqual({ type: 'select' });
      expect(argTypes[prop]?.table?.defaultValue, `${prop} must document its preset`).toBeDefined();
    }
    for (const prop of ['id', 'title', 'className', 'style']) {
      expect(argTypes[prop], prop).toEqual(story('Skeleton', false).argTypes[prop]);
    }
    for (const prop of [
      'children',
      'dangerouslySetInnerHTML',
      'ref',
      'asChild',
      'role',
      'aria-label',
      'aria-hidden',
      'aria-live',
      'aria-busy',
      'tabIndex',
      'contentEditable'
    ]) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains Spinner label/size rows without a fixed label default or semantic native rows', () => {
    const { argTypes } = story('Spinner');
    expect(argTypes.label?.type).toMatchObject({ name: 'string', required: false });
    expect(argTypes.label?.control).toEqual({ type: 'text' });
    expect(argTypes.label?.table?.defaultValue).toBeUndefined();
    expect([...(argTypes.size?.options ?? [])].sort()).toEqual(['lg', 'md', 'sm']);
    expect(argTypes.size?.type).toMatchObject({ name: 'enum', required: false });
    expect(argTypes.size?.control).toEqual({ type: 'select' });
    for (const prop of ['id', 'title', 'className', 'style']) {
      expect(argTypes[prop], prop).toEqual(story('Spinner', false).argTypes[prop]);
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'aria-hidden', 'aria-live']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains Logo variant/size/label/href rows, the image/link native rows and no naming overrides', () => {
    const { argTypes } = story('Logo');
    for (const prop of ['variant', 'size']) {
      expect(argTypes[prop]?.type, prop).toMatchObject({ name: 'enum', required: false });
      expect(argTypes[prop]?.control, prop).toEqual({ type: 'select' });
    }
    expect([...(argTypes.variant?.options ?? [])].sort()).toEqual(['mark', 'wordmark']);
    expect([...(argTypes.size?.options ?? [])].sort()).toEqual(['lg', 'md', 'sm']);
    for (const prop of ['label', 'href']) {
      expect(argTypes[prop]?.type, prop).toMatchObject({ name: 'string', required: false });
      expect(argTypes[prop]?.control, prop).toEqual({ type: 'text' });
    }
    // An absent href is a derived image mode, not a fixed default value.
    expect(argTypes.href?.table?.defaultValue).toBeUndefined();
    for (const prop of ['id', 'title', 'className', 'style', 'target', 'rel']) {
      expect(argTypes[prop], prop).toEqual(story('Logo', false).argTypes[prop]);
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'aria-label', 'aria-labelledby', 'aria-hidden']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains StatusDot state/pulse rows, the seven state choices and decorative native rows', () => {
    const { argTypes } = story('StatusDot');
    expect([...(argTypes.state?.options ?? [])].sort()).toEqual([
      'error',
      'idle',
      'live',
      'running',
      'standby',
      'stopped',
      'warning'
    ]);
    expect(argTypes.state?.type).toMatchObject({ name: 'enum', required: false });
    expect(argTypes.state?.control).toEqual({ type: 'select' });
    expect(argTypes.pulse?.type).toMatchObject({ name: 'boolean', required: false });
    expect(argTypes.pulse?.control).toEqual({ type: 'boolean' });
    for (const prop of ['id', 'title', 'className', 'style']) {
      expect(argTypes[prop], prop).toEqual(story('StatusDot', false).argTypes[prop]);
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'aria-hidden', 'aria-label', 'aria-labelledby']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains Kbd required children and optional label text rows without defaults or extra rows', () => {
    const { argTypes, args } = story('Kbd');
    expect(argTypes.children?.type).toMatchObject({ name: 'string', required: true });
    expect(argTypes.children?.control).toEqual({ type: 'text' });
    expect(argTypes.label?.type).toMatchObject({ name: 'string', required: false });
    expect(argTypes.label?.control).toEqual({ type: 'text' });
    for (const prop of ['children', 'label']) {
      expect(argTypes[prop]?.table?.defaultValue, prop).toBeUndefined();
    }
    expect(args).toEqual({});
    for (const prop of ['id', 'title', 'className']) {
      expect(argTypes[prop], prop).toEqual(story('Kbd', false).argTypes[prop]);
    }
    for (const prop of ['ref', 'asChild', 'dangerouslySetInnerHTML', 'role', 'onClick']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains ProgressBar rows, ordered presets and requiredness without injecting args', () => {
    const { argTypes, args } = story('ProgressBar');
    expect(argTypes.value?.type).toMatchObject({ name: 'number', required: true });
    expect(argTypes.value?.control).toEqual({ type: 'number' });
    expect(argTypes.value?.table?.defaultValue).toBeUndefined();
    for (const prop of ['label', 'valueText']) {
      expect(argTypes[prop]?.type, prop).toMatchObject({ name: 'string', required: false });
      expect(argTypes[prop]?.table?.defaultValue, prop).toBeUndefined();
    }
    expect(argTypes.size?.options).toEqual(['sm', 'lg']);
    expect([...(argTypes.variant?.options ?? [])].sort()).toEqual(['default', 'muted']);
    expect(argTypes.edge?.type).toMatchObject({ name: 'boolean', required: false });
    expect(args).toEqual({});
    for (const prop of ['id', 'title', 'aria-describedby', 'className', 'style']) {
      expect(argTypes[prop], prop).toEqual(story('ProgressBar', false).argTypes[prop]);
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'max', 'getValueLabel', 'aria-label', 'aria-hidden']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains the Textarea variant select and only the documented native form rows', () => {
    const { argTypes, args } = story('Textarea');
    expect([...(argTypes.variant?.options ?? [])].sort()).toEqual(['code', 'default', 'prose']);
    expect(argTypes.variant?.type).toMatchObject({ name: 'enum', required: false });
    expect(argTypes.variant?.control).toEqual({ type: 'select' });
    expect(args).toEqual({});
    const documented = [
      'id',
      'name',
      'rows',
      'placeholder',
      'disabled',
      'readOnly',
      'required',
      'maxLength',
      'aria-invalid',
      'aria-describedby',
      'className'
    ];
    for (const prop of documented) {
      expect(argTypes[prop], prop).toBeDefined();
      expect(argTypes[prop], prop).toEqual(story('Textarea', false).argTypes[prop]);
    }
    for (const prop of ['children', 'ref', 'asChild', 'dangerouslySetInnerHTML', 'role', 'style', 'onClick']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains Input select rows, the icon row without a widget and only documented native rows', () => {
    const { argTypes, args } = story('Input');
    expect([...(argTypes.size?.options ?? [])].sort()).toEqual(['md', 'sm']);
    expect([...(argTypes.variant?.options ?? [])].sort()).toEqual(['code', 'default']);
    expect([...(argTypes.type?.options ?? [])].sort()).toEqual([
      'email',
      'number',
      'password',
      'search',
      'tel',
      'text',
      'url'
    ]);
    for (const prop of ['size', 'variant', 'type']) {
      expect(argTypes[prop]?.type, prop).toMatchObject({ name: 'enum', required: false });
      expect(argTypes[prop]?.control, prop).toEqual({ type: 'select' });
    }
    expect(argTypes.icon?.control).toBe(false);
    expect(argTypes.icon?.table?.disable).toBeUndefined();
    expect(argTypes.icon?.table?.defaultValue).toBeUndefined();
    expect(args).toEqual({});
    for (const prop of ['id', 'name', 'placeholder', 'disabled', 'readOnly', 'required', 'className']) {
      expect(argTypes[prop], prop).toEqual(story('Input', false).argTypes[prop]);
    }
    for (const prop of ['children', 'asChild', 'ref', 'onChange', 'style', 'invalid']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });

  it('retains ProductMark required monogram/label and optional href text rows across both branches', () => {
    const { argTypes, args } = story('ProductMark');
    for (const prop of ['monogram', 'label']) {
      expect(argTypes[prop]?.type, prop).toMatchObject({ name: 'string', required: true });
      expect(argTypes[prop]?.control, prop).toEqual({ type: 'text' });
    }
    expect(argTypes.href?.type).toMatchObject({ name: 'string', required: false });
    expect(argTypes.href?.control).toEqual({ type: 'text' });
    for (const prop of ['monogram', 'label', 'href']) {
      expect(argTypes[prop]?.table?.defaultValue, prop).toBeUndefined();
    }
    expect(args).toEqual({});
    for (const prop of ['id', 'title', 'className', 'target', 'rel']) {
      expect(argTypes[prop], prop).toEqual(story('ProductMark', false).argTypes[prop]);
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'aria-label', 'aria-hidden', 'size', 'onClick']) {
      expect(argTypes[prop], prop).toBeUndefined();
    }
  });
});
