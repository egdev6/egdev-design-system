// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import config from '../../../../.storybook/main';
import * as publicAPI from '../index';

const source = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const normalize = (value: unknown) => String(value).replace(/^['"]+|['"]+$/g, '');
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;

const ast = (path: string) => ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);

const gaugeControls: Record<string, string> = {
  label: 'text',
  value: 'number',
  valueText: 'text',
  state: 'select',
  stateText: 'text',
  unavailableText: 'text',
  center: 'false',
  size: 'false'
};
const gaugeControlReasons: Record<string, RegExp> = {
  center: /Non-serializable ReactNode.*CenterContent/,
  size: /Mixed preset and numeric diameter union.*Sizes/
};

function ownProps(file: ts.SourceFile, aliases: string[]): ts.PropertySignature[] {
  const properties: ts.PropertySignature[] = [];
  function visit(node: ts.Node) {
    if (ts.isPropertySignature(node)) {
      properties.push(node);
    }
    ts.forEachChild(node, visit);
  }
  for (const node of file.statements) {
    if (ts.isTypeAliasDeclaration(node) && aliases.includes(node.name.text)) {
      visit(node.type);
    }
  }
  return properties;
}

function gaugeOwnProps(file: ts.SourceFile): ts.PropertySignature[] {
  return ownProps(file, ['GaugeProps', 'GaugeStateProps']);
}

function exportedStoryNames(file: ts.SourceFile): string[] {
  return file.statements.flatMap((node) =>
    ts.isVariableStatement(node) && node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      ? node.declarationList.declarations.map((declaration) => declaration.name.getText(file))
      : []
  );
}

function gaugeControlIssues(
  file: ts.SourceFile,
  stories = exportedStoryNames(ast(source('atoms/gauge/Gauge.stories.tsx')))
): string[] {
  return gaugeOwnProps(file).flatMap((property) => {
    const name = property.name.getText(file);
    const tags = ts.getJSDocTags(property);
    const values = (tagName: string) =>
      tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment)?.trim());
    const controls = values('control');
    const reasons = values('controlReason');
    const issues: string[] = [];
    if (!Object.hasOwn(gaugeControls, name) || controls.length !== 1 || controls[0] !== gaugeControls[name]) {
      issues.push(`${name}: expected @control ${gaugeControls[name]}, received ${controls.join(', ') || 'none'}`);
    }
    if (
      controls[0] === 'false' &&
      (reasons.length !== 1 ||
        !reasons[0] ||
        !gaugeControlReasons[name]?.test(reasons[0]) ||
        !stories.includes(name === 'center' ? 'CenterContent' : 'Sizes'))
    ) {
      issues.push(
        `${name}: @control false requires its concrete type limitation and dedicated story in @controlReason`
      );
    }
    if (!property.questionToken && values('default').length > 0) {
      issues.push(`${name}: required declarations must not invent @default`);
    }
    return issues;
  });
}

// Read the real CVA config and hook bindings, not hand-authored docgen fixtures.
function defaults(path: string, cva: boolean): Record<string, string> {
  const file = ast(path);
  const result: Record<string, string> = {};
  function visit(node: ts.Node) {
    if (
      cva &&
      ts.isPropertyAssignment(node) &&
      node.name.getText(file) === 'defaultVariants' &&
      ts.isObjectLiteralExpression(node.initializer)
    ) {
      for (const property of node.initializer.properties) {
        if (ts.isPropertyAssignment(property)) {
          result[property.name.getText(file)] = normalize(property.initializer.getText(file));
        }
      }
    } else if (!cva && ts.isBindingElement(node) && node.initializer && ts.isIdentifier(node.name)) {
      result[node.name.text] = normalize(node.initializer.getText(file));
    }
    ts.forEachChild(node, visit);
  }
  visit(file);
  return result;
}

describe('Storybook TypeScript docgen contract', () => {
  it('extracts the Toggle union, boolean defaults, native button props and every own directive', () => {
    const doc = parser.parse(source('atoms/toggle/Toggle.tsx')).find((item) => item.displayName === 'Toggle');
    expect(doc).toBeDefined();
    expect(doc?.props.size).toMatchObject({ tags: { control: 'select' }, defaultValue: { value: 'md' } });
    expect(doc?.props.size?.type.value.map(({ value }: { value: string }) => normalize(value))).toEqual([
      'sm',
      'md',
      'lg'
    ]);
    expect(doc?.props.defaultPressed).toMatchObject({ tags: { control: 'boolean' }, defaultValue: { value: 'false' } });
    expect(doc?.props.pressed).toMatchObject({ tags: { control: 'boolean' }, defaultValue: null });
    expect(doc?.props.label?.type.name).toBe('string');
    expect(doc?.props.children?.required).toBe(false);
    expect(doc?.props.icon?.required).toBe(false);
    expect(doc?.props.label?.required).toBe(false);
    for (const name of ['icon', 'children', 'onPressedChange']) {
      const tags = doc?.props[name]?.tags as Record<string, string> | undefined;
      expect(tags?.control?.split('\n').every((tag) => tag === 'false')).toBe(true);
      expect(tags?.controlReason).toBeTruthy();
    }
    for (const name of ['disabled', 'type', 'id', 'title', 'className', 'onClick', 'aria-describedby']) {
      expect(doc?.props[name], name).toBeDefined();
    }
    for (const name of ['asChild', 'aria-pressed', 'toggleVariants', 'toggleIconVariants']) {
      expect(doc?.props[name], name).toBeUndefined();
    }
    const file = ast(source('atoms/toggle/types.ts'));
    const properties = ownProps(file, ['ToggleContentProps', 'ToggleProps']);
    expect(properties).toHaveLength(10);
    for (const property of properties) {
      const tags = ts.getJSDocTags(property);
      expect(tags.filter((tag) => tag.tagName.text === 'control')).toHaveLength(1);
      if (!property.questionToken) {
        expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      }
    }
  });
  it('exposes the layout primitives, Surface, Gauge, AspectRatio, Portal, Slot and cn through the barrel', () => {
    const file = ast(source('index.ts'));
    const modules = file.statements.flatMap((node) =>
      ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
        ? [node.moduleSpecifier.text]
        : []
    );
    // Each primitive exports its type alias first and runtime component second; dedupe the specifiers.
    expect([...new Set(modules)].sort()).toEqual([
      './atoms/avatar',
      './atoms/badge',
      './atoms/button',
      './atoms/checkbox',
      './atoms/dropzone',
      './atoms/gauge',
      './atoms/icon',
      './atoms/icon-button',
      './atoms/input',
      './atoms/kbd',
      './atoms/link',
      './atoms/logo',
      './atoms/product-mark',
      './atoms/progress-bar',
      './atoms/radio-group',
      './atoms/select',
      './atoms/slider',
      './atoms/spinner',
      './atoms/status-dot',
      './atoms/switch',
      './atoms/textarea',
      './atoms/toggle',
      './atoms/tooltip',
      './lib/cn',
      './primitives/aspect-ratio',
      './primitives/divider',

      './primitives/label',
      './primitives/portal',
      './primitives/skeleton',
      './primitives/slot',
      './primitives/stack',
      './primitives/surface',
      './primitives/text',
      './primitives/visually-hidden'
    ]);
    expect(Object.keys(publicAPI).sort()).toEqual([
      'AspectRatio',
      'Avatar',
      'Badge',
      'Button',
      'Checkbox',
      'Cluster',
      'Divider',
      'Dropzone',
      'Gauge',
      'Heading',
      'Icon',
      'IconButton',
      'Input',
      'Kbd',
      'Label',
      'Link',
      'Logo',
      'Portal',
      'ProductMark',
      'ProgressBar',
      'RadioGroup',
      'Select',
      'Skeleton',
      'Slider',
      'Slot',
      'Slottable',
      'Spinner',
      'Stack',
      'StatusDot',
      'Surface',
      'Switch',
      'Text',
      'Textarea',
      'Toggle',
      'Tooltip',
      'VisuallyHidden',
      'badgeVariants',
      'cn',
      'dropzoneVariants',
      'labelVariants',
      'progressBarVariants',
      'radioGroupVariants',
      'sliderVariants',
      'statusDotVariants',
      'surfaceVariants',
      'tooltipVariants'
    ]);
  });

  it('extracts Button own metadata, real defaults and permitted native action props', () => {
    const doc = parser.parse(source('atoms/button/Button.tsx')).find(({ displayName }) => displayName === 'Button');
    expect(doc).toBeDefined();
    const props = doc?.props ?? {};
    expect(props.children?.required).toBe(true);
    const controls: Record<string, string> = {
      children: 'false',
      variant: 'select',
      size: 'select',
      icon: 'false',
      iconPosition: 'select',
      loading: 'boolean',
      asChild: 'boolean'
    };
    const file = ast(source('atoms/button/types.ts'));
    const own = ownProps(file, ['ButtonProps']);
    expect(own).toHaveLength(7);
    for (const declaration of own) {
      const name = declaration.name.getText(file);
      expect(ts.getJSDocTags(declaration).filter(({ tagName }) => tagName.text === 'control')).toHaveLength(1);
      expect(props[name]?.tags).toMatchObject({ control: controls[name] });
      if (controls[name] === 'false') {
        expect(props[name]?.tags).toMatchObject({ controlReason: expect.stringMatching(/ReactNode/) });
      }
    }
    for (const [name, value] of Object.entries({
      variant: 'primary',
      size: 'md',
      iconPosition: 'end',
      loading: 'false',
      asChild: 'false'
    })) {
      expect(normalize(props[name]?.defaultValue?.value)).toBe(value);
    }
    expect(props.children?.defaultValue).toBeNull();
    expect(props.icon?.defaultValue).toBeNull();
    expect(props.variant?.type.value.map(({ value }: { value: string }) => normalize(value))).toEqual([
      'primary',
      'secondary',
      'ghost',
      'dark'
    ]);
    expect(props.size?.type.value.map(({ value }: { value: string }) => normalize(value))).toEqual(['md', 'sm']);
    for (const name of ['type', 'disabled', 'onClick', 'className']) {
      expect(props[name]).toBeDefined();
    }
    expect(props.href).toBeUndefined();
  });

  beforeAll(() => {
    expect(config.typescript?.reactDocgen).toBe('react-docgen-typescript');
    docs = parser.parse([
      source('atoms/checkbox/Checkbox.tsx'),
      source('atoms/gauge/Gauge.tsx'),
      source('atoms/icon-button/IconButton.tsx'),
      source('primitives/aspect-ratio/AspectRatio.tsx'),
      source('primitives/stack/Stack.tsx'),
      source('primitives/stack/Cluster.tsx'),
      source('primitives/text/Text.tsx'),
      source('primitives/text/Heading.tsx'),
      source('primitives/surface/Surface.tsx')
    ]);
  }, 20_000);

  it('documents every own IconButton prop and extracts required hidden naming without fake defaults', () => {
    const file = ast(source('atoms/icon-button/types.ts'));
    const properties = ownProps(file, ['IconButtonProps']);
    const expected: Record<string, string> = {
      label: 'text',
      icon: 'false',
      variant: 'select',
      size: 'select',
      asChild: 'boolean',
      children: 'false'
    };
    expect(properties).toHaveLength(6);
    const doc = docs.find((item) => item.displayName === 'IconButton');
    expect(doc).toBeDefined();
    for (const prop of properties) {
      const name = prop.name.getText(file);
      const tags = ts.getJSDocTags(prop);
      expect(
        tags.filter((tag) => tag.tagName.text === 'control').map((tag) => ts.getTextOfJSDocComment(tag.comment))
      ).toEqual([expected[name]]);
      expect(doc?.props[name]?.tags, name).toMatchObject({ control: expected[name] });
      if (expected[name] === 'false') {
        expect(doc?.props[name]?.tags, name).toMatchObject({
          controlReason: expect.stringMatching(/ReactElement.*(?:Variants|AsChildLink)/)
        });
      }
      expect(doc?.props[name]?.required, name).toBe(!prop.questionToken);
    }
    for (const prop of ['label', 'icon', 'children']) {
      expect(doc?.props[prop]?.defaultValue, prop).toBeNull();
    }
    for (const [prop, value] of Object.entries({ variant: 'ghost', size: 'md', asChild: 'false' })) {
      expect(normalize(doc?.props[prop]?.defaultValue?.value)).toBe(value);
    }
    expect(doc?.props['aria-label']).toBeUndefined();
    for (const prop of ['disabled', 'type', 'onClick', 'id', 'name', 'value', 'className']) {
      expect(doc?.props[prop], prop).toBeDefined();
    }
    const stories = ast(source('atoms/icon-button/IconButton.stories.tsx'));
    expect(exportedStoryNames(stories)).toEqual([
      'Default',
      'Variants',
      'Sizes',
      'Disabled',
      'States',
      'AsChildLink',
      'RawSvg'
    ]);
    expect(readFileSync(source('atoms/icon-button/IconButton.stories.tsx'), 'utf8')).not.toMatch(/argTypes:|\bplay:/);
    const barrel = readFileSync(source('atoms/icon-button/index.ts'), 'utf8');
    expect(barrel).not.toMatch(/iconButtonVariants|iconButtonIconVariants|useIconButton/);
  });

  it('documents every Checkbox declaration and real mixed state metadata without invented defaults', () => {
    const file = ast(source('atoms/checkbox/types.ts'));
    const controls: Record<string, string> = {
      checked: 'false',
      defaultChecked: 'false',
      onCheckedChange: 'false',
      disabled: 'boolean',
      required: 'boolean',
      name: 'text',
      value: 'text'
    };
    const properties = ownProps(file, ['CheckboxProps']);
    expect(properties).toHaveLength(7);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      expect(
        tags.filter((tag) => tag.tagName.text === 'control').map((tag) => ts.getTextOfJSDocComment(tag.comment))
      ).toEqual([controls[name]]);
      if (controls[name] === 'false') {
        expect(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment).toMatch(/stories|story/);
      }
    }
    const doc = docs.find((item) => item.displayName === 'Checkbox');
    expect(doc).toBeDefined();
    for (const name of Object.keys(controls)) {
      expect(doc?.props[name]).toMatchObject({ required: false, tags: { control: controls[name] } });
    }
    expect(doc?.props.checked?.type.name).toMatch(/CheckboxCheckedState/);
    expect(doc?.props.checked?.defaultValue).toBeNull();
    expect(doc?.props.name?.defaultValue).toBeNull();
    const actualDefaults = defaults(source('atoms/checkbox/useCheckbox.ts'), false);
    for (const [name, value] of Object.entries({
      defaultChecked: 'false',
      disabled: 'false',
      required: 'false',
      value: 'on'
    })) {
      expect(actualDefaults[name], name).toBe(value);
      expect(normalize(doc?.props[name]?.defaultValue?.value), name).toBe(value);
    }
    const storyFile = ast(source('atoms/checkbox/Checkbox.stories.tsx'));
    expect(exportedStoryNames(storyFile)).toEqual([
      'Default',
      'Controlled',
      'Indeterminate',
      'Disabled',
      'States',
      'WithLabel'
    ]);
    expect(readFileSync(source('atoms/checkbox/Checkbox.stories.tsx'), 'utf8')).not.toMatch(/argTypes\s*:|\bplay\s*:/);
    expect(doc?.props.children).toBeUndefined();
    expect(doc?.props.asChild).toBeUndefined();
  });

  it('extracts every Badge own prop, defaults, native attributes and finite choices from the real source', () => {
    const file = ast(source('atoms/badge/types.ts'));
    const properties = ownProps(file, ['BadgeProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['children', 'tone', 'variant', 'icon']);
    const controls: Record<string, string> = { children: 'false', tone: 'select', variant: 'select', icon: 'false' };
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      expect(
        tags.filter((tag) => tag.tagName.text === 'control').map((tag) => ts.getTextOfJSDocComment(tag.comment))
      ).toEqual([controls[name]]);
      if (controls[name] === 'false') {
        expect(
          tags.some(
            (tag) =>
              tag.tagName.text === 'controlReason' &&
              /ReactNode.*(?:WithIcon|Default)/.test(ts.getTextOfJSDocComment(tag.comment) ?? '')
          )
        ).toBe(true);
      }
    }
    const doc = parser.parse(source('atoms/badge/Badge.tsx')).find((item) => item.displayName === 'Badge');
    expect(doc).toBeDefined();
    expect(doc?.props.children).toMatchObject({ required: true, defaultValue: null, tags: { control: 'false' } });
    expect(doc?.props.icon).toMatchObject({ required: false, defaultValue: null, tags: { control: 'false' } });
    for (const [name, values] of [
      ['tone', ['neutral', 'info', 'success', 'warning', 'danger', 'brand']],
      ['variant', ['soft', 'solid']]
    ] as const) {
      expect(doc?.props[name]?.type.value.map((item: { value: string }) => normalize(item.value))).toEqual(values);
      expect(doc?.props[name]).toMatchObject({
        required: false,
        defaultValue: { value: values[0] },
        tags: { control: 'select' }
      });
      expect(defaults(source('atoms/badge/types.ts'), true)[name]).toBe(values[0]);
      expect(defaults(source('atoms/badge/useBadge.ts'), false)[name]).toBe(values[0]);
    }
    for (const name of ['id', 'title', 'aria-describedby', 'className']) {
      expect(doc?.props[name], name).toBeDefined();
    }
    expect(doc?.props.ref).toBeUndefined();
    expect(doc?.props.asChild).toBeUndefined();
    expect(exportedStoryNames(ast(source('atoms/badge/Badge.stories.tsx')))).toEqual([
      'Default',
      'Tones',
      'Solid',
      'WithIcon'
    ]);
  });

  it('extracts Dropzone owned metadata and preserves native button boundaries', () => {
    const file = ast(source('atoms/dropzone/types.ts'));
    const properties = ownProps(file, ['DropzoneProps']);
    const expected: Record<string, string> = {
      onFiles: 'false',
      label: 'text',
      dropLabel: 'text',
      accept: 'text',
      multiple: 'boolean',
      variant: 'select'
    };
    expect(properties.map((property) => property.name.getText(file))).toEqual(Object.keys(expected));
    for (const property of properties) {
      const controls = ts.getJSDocTags(property).filter((tag) => tag.tagName.text === 'control');
      expect(controls).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe(expected[property.name.getText(file)]);
    }
    const doc = parser.parse(source('atoms/dropzone/Dropzone.tsx')).find((item) => item.displayName === 'Dropzone');
    expect(doc?.props.onFiles).toMatchObject({ required: true, defaultValue: null, tags: { control: 'false' } });
    expect(doc?.props.onFiles?.tags).toMatchObject({
      controlReason: expect.stringMatching(/File objects.*Default and MultipleFiles/)
    });
    for (const [prop, value] of Object.entries({
      label: 'Drag, paste or upload',
      dropLabel: 'Drop here',
      multiple: 'false',
      variant: 'default'
    })) {
      expect(doc?.props[prop]).toMatchObject({ required: false, defaultValue: { value } });
    }
    expect(doc?.props.accept?.defaultValue).toBeNull();
    for (const name of ['id', 'disabled', 'title', 'onClick', 'className', 'aria-describedby']) {
      expect(doc?.props[name], name).toBeDefined();
    }
    for (const name of [
      'children',
      'type',
      'ref',
      'asChild',
      'over',
      'onDrop',
      'onPaste',
      'onDragEnter',
      'onDragOver',
      'onDragLeave'
    ]) {
      expect(doc?.props[name], name).toBeUndefined();
    }
    const stories = ast(source('atoms/dropzone/Dropzone.stories.tsx'));
    expect(exportedStoryNames(stories)).toEqual([
      'Default',
      'Inline',
      'Disabled',
      'MultipleFiles',
      'DragOver',
      'ConsumerLayout'
    ]);
    expect(stories.getText()).not.toMatch(/argTypes\s*:|\bplay\s*:/);
  });

  it('annotates each own VisuallyHidden prop without fabricating a content default', () => {
    const file = ast(source('primitives/visually-hidden/types.ts'));
    const properties: ts.PropertySignature[] = [];
    const visit = (node: ts.Node) => {
      if (ts.isPropertySignature(node)) {
        properties.push(node);
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
    expect(properties.map((prop) => prop.name.getText(file))).toEqual(['children', 'asChild']);
    for (const prop of properties) {
      const tags = ts.getJSDocTags(prop);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe(
        prop.name.getText(file) === 'children' ? 'false' : 'boolean'
      );
      if (!prop.questionToken) {
        expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      }
    }
  });

  it('extracts VisuallyHidden required content, composition metadata and native attributes', () => {
    const doc = parser
      .parse(source('primitives/visually-hidden/VisuallyHidden.tsx'))
      .find((item) => item.displayName === 'VisuallyHidden');
    expect(doc).toBeDefined();
    expect(doc?.props.children).toMatchObject({ required: true, tags: { control: 'false' }, defaultValue: null });
    expect(doc?.props.children?.tags).toMatchObject({
      controlReason: expect.stringMatching(/ReactNode.*Default and AsChild/)
    });
    expect(doc?.props.asChild).toMatchObject({
      required: false,
      tags: { control: 'boolean' },
      defaultValue: { value: 'false' }
    });
    for (const prop of ['id', 'title', 'className', 'style', 'aria-describedby', 'lang']) {
      expect(doc?.props[prop], prop).toBeDefined();
    }
  });

  it('keeps explicit parser options aligned with Vite and extracts clean descriptions plus separate tags', () => {
    const options = config.typescript?.reactDocgenTypescriptOptions;
    expect(options?.shouldIncludePropTagMap).toBe(true);
    expect(options?.savePropValueAsString).toBe(true);
    for (const doc of docs) {
      for (const prop of Object.values(doc.props)) {
        expect(prop.description).not.toMatch(/@control(?:Reason)?/);
      }
      if (doc.displayName === 'Gauge') {
        expect(doc.props.label?.tags).toMatchObject({ control: 'text' });
      }
    }
    const props = docs.find((doc) => doc.displayName === 'Gauge')?.props;
    expect(props?.state?.tags).toMatchObject({ control: 'select\nselect' });
    expect(props?.stateText?.tags).toMatchObject({ control: 'text\ntext' });
    expect(props?.label?.defaultValue).toBeNull();
    expect(props?.value?.defaultValue).toBeNull();
  });

  it('extracts Gauge measurement, conditional cues, numeric sizes and passive native props', () => {
    const doc = docs.find((item) => item.displayName === 'Gauge');
    expect(doc, 'Gauge must be discovered from its real component and public props alias').toBeDefined();
    if (!doc) {
      throw new Error('Missing docgen for Gauge');
    }
    const props = doc.props;
    expect(props.label?.required).toBe(true);
    expect(props.value?.required).toBe(true);
    const bindings = defaults(source('atoms/gauge/useGauge.ts'), false);
    const variants = defaults(source('atoms/gauge/types.ts'), true);
    for (const [prop, value] of [
      ['size', 'md'],
      ['state', 'normal'],
      ['unavailableText', 'Data unavailable']
    ] as const) {
      expect(bindings[prop]).toBe(value);
      expect(normalize(props[prop]?.defaultValue?.value)).toBe(value);
    }
    expect(variants.size).toBe('md');
    for (const prop of ['center', 'stateText', 'valueText']) {
      expect(props[prop]?.defaultValue, `Gauge.${prop} has no constant default`).toBeNull();
      expect(props[prop]?.tags).not.toHaveProperty('default');
    }
    expect(props.center?.description).toMatch(/No center content when omitted/);
    expect(props.stateText?.description).toMatch(/Omitted when not supplied/);
    expect(props.valueText?.description).toMatch(/When omitted.*normalized decimal "X \/ 100"/);
    expect(props.valueText?.description).toMatch(/Non-finite values.*no aria-valuetext/);
    // Mixed numeric unions retain the alias in docgen; verify its real AST literals too.
    expect(props.size?.type.name).toBe('number | GaugeSize');
    const file = ast(source('atoms/gauge/types.ts'));
    const size = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'GaugeSize');
    expect(size && ts.isTypeAliasDeclaration(size) && size.type.getText(file)).toBe("'sm' | 'md' | 'lg'");
    expect(props.state?.type.value?.map((item: { value: string }) => normalize(item.value))).toEqual([
      'normal',
      'warning',
      'critical',
      'muted'
    ]);
    expect(props.stateText?.required).toBe(false);
    expect(props.stateText?.description).toMatch(/Required non-empty visible description/);
    expect(props.state?.description).toMatch(/non-normal condition; requires stateText/);
    for (const prop of ['id', 'title', 'aria-describedby', 'className']) {
      expect.soft(props[prop]?.type.name, `Gauge native ${prop} must remain available in autodocs`).toBe('string');
    }
    expect.soft(props.style?.type.name).toBe('CSSProperties');
    for (const prop of ['ref', 'asChild', 'onClick', 'onChange', 'role', 'tabIndex', 'onMouseEnter']) {
      expect(props[prop]).toBeUndefined();
    }
  });

  it('documents controls on every Gauge own prop, including both discriminated-union branches', () => {
    const file = ast(source('atoms/gauge/types.ts'));
    expect(gaugeOwnProps(file).map((property) => property.name.getText(file))).toEqual([
      'state',
      'stateText',
      'state',
      'stateText',
      'label',
      'value',
      'valueText',
      'center',
      'size',
      'unavailableText'
    ]);
    expect(gaugeControlIssues(file)).toEqual([]);
  });

  it.each([
    ['state', 0, 'control'],
    ['state', 1, 'control'],
    ['center', 0, 'controlReason'],
    ['size', 0, 'controlReason'],
    ['value', 0, 'invalidControl']
  ] as const)('rejects missing or invalid Gauge annotations: %s occurrence %i (%s)', (name, occurrence, mutation) => {
    // Reparse a targeted mutation in memory; never rewrite the real types or use a source snapshot.
    const file = ast(source('atoms/gauge/types.ts'));
    const property = gaugeOwnProps(file).filter((node) => node.name.getText(file) === name)[occurrence];
    if (!property) {
      throw new Error('Missing property to mutate');
    }
    const tagName = mutation === 'invalidControl' ? 'control' : mutation;
    const tag = ts.getJSDocTags(property).find((node) => node.tagName.text === tagName);
    expect(tag, 'mutation must target an existing annotation').toBeDefined();
    if (!tag) {
      throw new Error('Missing annotation to mutate');
    }
    const replacement = mutation === 'invalidControl' ? '@control object\n * ' : '';
    const mutated = ts.createSourceFile(
      file.fileName,
      file.text.slice(0, tag.getStart(file)) + replacement + file.text.slice(tag.end),
      ts.ScriptTarget.Latest,
      true
    );
    expect(gaugeControlIssues(mutated).some((issue) => issue.startsWith(`${name}:`))).toBe(true);
  });

  it.each([
    ['Gauge', 'atoms/gauge', 'label', 0],
    ['Gauge', 'atoms/gauge', 'stateText', 0],
    ['Gauge', 'atoms/gauge', 'stateText', 1]
  ] as const)('rejects obsolete string annotation on %s.%s.%s occurrence %i', (name, directory, prop, occurrence) => {
    const file = ast(source(`${directory}/types.ts`));
    const properties = gaugeOwnProps(file);
    const property = properties.filter((node) => node.name.getText(file) === prop)[occurrence];
    if (!property) {
      throw new Error(`Missing property ${name}.${prop}`);
    }
    const tag = ts.getJSDocTags(property).find((node) => node.tagName.text === 'control');
    if (!tag) {
      throw new Error(`Missing annotation to mutate: ${name}.${prop}`);
    }
    const mutated = ts.createSourceFile(
      file.fileName,
      `${file.text.slice(0, tag.getStart(file))}@control string\n * ${file.text.slice(tag.end)}`,
      ts.ScriptTarget.Latest,
      true
    );
    const issues = gaugeControlIssues(mutated);
    expect(issues).toContain(`${prop}: expected @control text, received string`);
  });

  it.each([
    ['center', 'CenterContent'],
    ['size', 'Sizes']
  ])('rejects a missing dedicated story for Gauge.%s', (prop, story) => {
    const stories = exportedStoryNames(ast(source('atoms/gauge/Gauge.stories.tsx')));
    expect(stories).toContain(story);
    expect(
      gaugeControlIssues(
        ast(source('atoms/gauge/types.ts')),
        stories.filter((name) => name !== story)
      )
    ).toContain(`${prop}: @control false requires its concrete type limitation and dedicated story in @controlReason`);
  });

  it.each(['label', 'value'])('rejects an invented required Gauge.%s default', (prop) => {
    const file = ast(source('atoms/gauge/types.ts'));
    const property = gaugeOwnProps(file).find((node) => node.name.getText(file) === prop);
    const tag = property && ts.getJSDocTags(property).find((node) => node.tagName.text === 'control');
    if (!tag) {
      throw new Error(`Missing annotation to mutate: Gauge.${prop}`);
    }
    const mutated = ts.createSourceFile(
      file.fileName,
      `${file.text.slice(0, tag.getStart(file))}@default invented\n     * ${file.text.slice(tag.getStart(file))}`,
      ts.ScriptTarget.Latest,
      true
    );
    expect(gaugeControlIssues(mutated)).toContain(`${prop}: required declarations must not invent @default`);
  });

  it('extracts the real AspectRatio ratio contract and passive native props', () => {
    const doc = docs.find((item) => item.displayName === 'AspectRatio');
    expect(doc, 'AspectRatio must be discovered from its real component and public props alias').toBeDefined();
    if (!doc) {
      throw new Error('Missing docgen for AspectRatio');
    }
    const props = doc.props;
    expect(props.ratio?.required).toBe(false);
    expect(props.ratio?.type.name).toBe('number');
    expect(normalize(props.ratio?.defaultValue?.value)).toBe('1');
    expect(props.ratio?.tags).toMatchObject({ control: 'number' });
    expect(props.ratio?.description).toMatch(/Non-positive, non-finite or unrepresentable/);
    expect(props.ratio?.description).toMatch(/fall back to a square/);
    for (const prop of ['id', 'title', 'aria-describedby', 'className']) {
      expect
        .soft(props[prop]?.type.name, `AspectRatio native ${prop} must remain available in autodocs`)
        .toBe('string');
    }
    expect.soft(props.style?.type.name).toBe('CSSProperties');
    for (const prop of ['ref', 'asChild']) {
      expect(props[prop]).toBeUndefined();
    }
  });

  it('extracts the real Stack and Cluster layout contracts with separate alignment defaults', () => {
    for (const [name, alignmentDefault] of [
      ['Stack', 'stretch'],
      ['Cluster', 'center']
    ] as const) {
      const doc = docs.find((item) => item.displayName === name);
      expect(doc, `${name} must be discovered from its real component`).toBeDefined();
      if (!doc) {
        throw new Error(`Missing docgen for ${name}`);
      }
      const props = doc.props;
      expect(normalize(props.gap?.defaultValue?.value)).toBe('4');
      expect(props.gap?.type.name).toBe('enum');
      const gapValues = (props.gap?.type.value ?? []).map((item: { value: string }) => Number(normalize(item.value)));
      expect(gapValues.sort((first: number, second: number) => first - second)).toEqual([
        0, 1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 14, 16, 20, 24
      ]);
      expect(props.gap?.tags).toMatchObject({ control: 'select' });
      expect(normalize(props.alignItems?.defaultValue?.value)).toBe(alignmentDefault);
      expect(props.alignItems?.tags).toMatchObject({ control: 'select' });
      expect(normalize(props.justifyContent?.defaultValue?.value)).toBe('start');
      expect(props.justifyContent?.tags).toMatchObject({ control: 'select' });
      expect(normalize(props.asChild?.defaultValue?.value)).toBe('false');
      expect(props.asChild?.tags).toMatchObject({ control: 'boolean' });
      for (const prop of ['id', 'title', 'aria-describedby', 'className']) {
        expect.soft(props[prop]?.type.name, `${name} native ${prop} must remain available in autodocs`).toBe('string');
      }
      expect.soft(props.style?.type.name).toBe('CSSProperties');
      // The propFilter omits the children row, as in the other primitives.
    }
  });

  it('extracts the real Text and Heading typography contracts with their own defaults', () => {
    for (const [name, variants, variantDefault, extra] of [
      ['Text', ['display', 'eyebrow', 'hero', 'inverse', 'section', 'show'], 'eyebrow', 'asChild'],
      ['Heading', ['display', 'hero', 'inverse', 'section', 'show'], 'section', 'level']
    ] as const) {
      const doc = docs.find((item) => item.displayName === name);
      if (!doc) {
        throw new Error(`Missing docgen for ${name}`);
      }
      const props = doc.props;
      const values = (prop: string) =>
        (props[prop]?.type.value ?? []).map((item: { value: string }) => normalize(item.value)).sort();
      expect(props.variant?.type.name).toBe('enum');
      expect(values('variant')).toEqual(variants);
      expect(normalize(props.variant?.defaultValue?.value)).toBe(variantDefault);
      expect(values('tone')).toEqual(['canvas', 'raised']);
      expect(normalize(props.tone?.defaultValue?.value)).toBe('canvas');
      expect(props.accent?.type.name).toBe('string');
      expect(props.accent?.defaultValue, `${name}.accent absence is described, not a fixed default`).toBeNull();
      expect(props.accent?.description).toMatch(/whitespace-only text renders no\s+accent/);
      expect(normalize(props.accentBreak?.defaultValue?.value)).toBe('true');
      expect(props.children?.required, `${name}.children must stay required`).toBe(true);
      expect(props.children?.defaultValue).toBeNull();
      expect(props.children?.tags).toMatchObject({ control: 'false' });
      expect(props[extra], `${name}.${extra}`).toBeDefined();
      for (const prop of ['id', 'title', 'aria-describedby', 'className']) {
        expect.soft(props[prop]?.type.name, `${name} native ${prop} must remain in autodocs`).toBe('string');
      }
      for (const prop of ['role', 'dangerouslySetInnerHTML', 'aria-level', 'ref', 'tabIndex']) {
        expect(props[prop], `${name} must not document ${prop}`).toBeUndefined();
      }
    }
    const heading = docs.find((item) => item.displayName === 'Heading')?.props;
    expect(heading?.asChild).toBeUndefined();
    expect((heading?.level?.type.value ?? []).map((item: { value: string }) => item.value)).toEqual([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6'
    ]);
    expect(normalize(heading?.level?.defaultValue?.value)).toBe('2');
    expect(docs.find((item) => item.displayName === 'Text')?.props.level).toBeUndefined();
  });

  it('annotates every Text and Heading own declaration, including each union branch', () => {
    const file = ast(source('primitives/text/types.ts'));
    const properties = ownProps(file, [
      'TitleAccentProps',
      'TextVisualProps',
      'HeadingVisualProps',
      'TextProps',
      'HeadingProps'
    ]);
    const allowed: Record<string, string> = {
      variant: 'select',
      tone: 'select',
      accent: 'text',
      accentBreak: 'boolean',
      asChild: 'boolean',
      children: 'false',
      level: 'select'
    };
    // Two accent props, Text's three branches (4 + 2 + 2), Heading's two branches (2 + 2), two own extras each.
    expect(properties).toHaveLength(18);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const values = (tagName: string) =>
        tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment)?.trim());
      expect(values('control'), `${name} @control`).toEqual([allowed[name]]);
      if (allowed[name] === 'false') {
        expect(values('controlReason')[0], `${name} @controlReason`).toMatch(/ReactNode.*stories/);
      }
      if (!property.questionToken) {
        expect(values('default'), `required ${name} must not invent @default`).toEqual([]);
      }
      expect(ts.getTextOfJSDocComment(ts.getJSDocCommentsAndTags(property)[0]?.comment), name).toBeTruthy();
    }
  });

  it('extracts Surface from both public branches with single constant defaults', () => {
    const doc = docs.find((item) => item.displayName === 'Surface');
    expect(doc, 'Surface must be discovered from its real component').toBeDefined();
    if (!doc) {
      throw new Error('Missing docgen for Surface');
    }
    const props = doc.props;
    const values = (prop: string) =>
      (props[prop]?.type.value ?? []).map((item: { value: string }) => normalize(item.value));
    expect(values('tone')).toEqual(['surface-0', 'surface-1', 'surface-2', 'surface-3', 'well', 'overlay']);
    expect(values('elevation')).toEqual(['0', '1', '2', '3']);
    expect(values('padding')).toEqual(['none', 'sm', 'md', 'lg']);
    expect(values('radius')).toEqual(['none', 'md', 'lg', 'xl', 'full']);
    // Union branches merge JSDoc; @default lives on one branch so the value is never repeated.
    for (const [prop, value] of [
      ['tone', 'surface-1'],
      ['elevation', '1'],
      ['padding', 'md'],
      ['radius', 'xl'],
      ['asChild', 'false']
    ] as const) {
      expect(normalize(props[prop]?.defaultValue?.value), `Surface.${prop} default`).toBe(value);
      expect(props[prop]?.required, `Surface.${prop} stays optional`).toBe(false);
    }
    // The default branch must stay visible: asChild is an optional boolean, not the slotted literal.
    expect(props.asChild?.type.name).toBe('boolean');
    for (const prop of ['id', 'title', 'aria-label', 'aria-labelledby', 'className']) {
      expect.soft(props[prop]?.type.name, `Surface native ${prop} must remain available in autodocs`).toBe('string');
    }
    expect.soft(props.style?.type.name).toBe('CSSProperties');
  });

  it('documents controls on every Surface own prop and union branch', () => {
    const file = ast(source('primitives/surface/types.ts'));
    const properties = ownProps(file, [
      'SurfaceRaisedToneProps',
      'SurfaceFixedToneProps',
      'SurfaceOwnProps',
      'SurfaceDefaultProps',
      'SurfaceSlottedProps'
    ]);
    const controls: Record<string, string> = {
      tone: 'select',
      elevation: 'select',
      padding: 'select',
      radius: 'select',
      asChild: 'boolean',
      children: 'false'
    };
    expect(properties).toHaveLength(10);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const control = tags.filter((tag) => tag.tagName.text === 'control');
      expect(
        control.map((tag) => ts.getTextOfJSDocComment(tag.comment)?.trim()),
        name
      ).toEqual([controls[name]]);
      if (controls[name] === 'false') {
        expect(tags.some((tag) => tag.tagName.text === 'controlReason' && tag.comment)).toBe(true);
      }
      if (!property.questionToken) {
        expect(
          tags.some((tag) => tag.tagName.text === 'default'),
          `${name}: required declarations must not invent @default`
        ).toBe(false);
      }
    }
  });

  it('documents controls on every AspectRatio own prop through its real annotations', () => {
    const file = ast(source('primitives/aspect-ratio/types.ts'));
    const properties = ownProps(file, ['AspectRatioProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['ratio']);
    const property = properties[0];
    if (!property) {
      throw new Error('Missing AspectRatio.ratio property');
    }
    expect(property.questionToken, 'AspectRatio ratio must stay optional').toBeDefined();
    expect(
      ts
        .getJSDocTags(property)
        .map((tag) => tag.tagName.text)
        .sort()
    ).toEqual(['control', 'default']);
  });

  it('limits real parser discovery to the current public React components', () => {
    expect(docs.map((doc) => doc.displayName)).toEqual([
      'Checkbox',
      'Gauge',
      'IconButton',
      'AspectRatio',
      'Stack',
      'Cluster',
      'Text',
      'Heading',
      'Surface'
    ]);
    expect(Object.keys(gaugeControls)).toHaveLength(8);
  });
});

function skeletonOwnProps(file: ts.SourceFile): ts.PropertySignature[] {
  const properties: ts.PropertySignature[] = [];
  function visit(node: ts.Node) {
    if (ts.isPropertySignature(node)) {
      properties.push(node);
    }
    ts.forEachChild(node, visit);
  }
  for (const node of file.statements) {
    if (ts.isTypeAliasDeclaration(node) && node.name.text === 'SkeletonProps') {
      visit(node.type);
    }
  }
  return properties;
}

describe('Skeleton decorative metadata contract', () => {
  it('keeps the silhouette unions and optional select-controlled variant/size annotations', () => {
    const file = ast(source('primitives/skeleton/types.ts'));
    const union = (name: string) => {
      const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === name);
      return alias && ts.isTypeAliasDeclaration(alias) ? alias.type.getText(file) : undefined;
    };
    expect(union('SkeletonVariant')).toBe("'line' | 'block' | 'circle'");
    expect(union('SkeletonSize')).toBe("'sm' | 'md' | 'lg'");
    const properties = skeletonOwnProps(file);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['variant', 'size', 'pulse']);
    for (const property of properties) {
      const name = property.name.getText(file);
      if (name === 'pulse') {
        expect(property.type?.getText(file), 'Skeleton.pulse type').toBe('boolean');
        expect(property.questionToken, 'Skeleton.pulse stays optional').toBeTruthy();
        const pulseTags = ts.getJSDocTags(property);
        const pulseControls = pulseTags.filter((tag) => tag.tagName.text === 'control');
        expect(pulseControls, 'Skeleton.pulse control').toHaveLength(1);
        expect(ts.getTextOfJSDocComment(pulseControls[0]?.comment), 'Skeleton.pulse @control').toBe('boolean');
        const pulseDefault = pulseTags.find((tag) => tag.tagName.text === 'default');
        expect(ts.getTextOfJSDocComment(pulseDefault?.comment), 'Skeleton.pulse @default').toBe('true');
        continue;
      }
      expect(property.type?.getText(file), `Skeleton.${name} alias`).toBe(
        name === 'variant' ? 'SkeletonVariant' : 'SkeletonSize'
      );
      expect(property.questionToken, `Skeleton.${name} stays optional`).toBeTruthy();
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, `Skeleton.${name} control`).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment), `Skeleton.${name} @control`).toBe('select');
      const defaultTag = tags.find((tag) => tag.tagName.text === 'default');
      expect(ts.getTextOfJSDocComment(defaultTag?.comment), `Skeleton.${name} @default`).toBe(
        name === 'variant' ? 'line' : 'md'
      );
    }
  });

  it('omits exactly the forbidden content, semantic and interaction span props from SkeletonProps', () => {
    const file = ast(source('primitives/skeleton/types.ts'));
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'SkeletonProps');
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing SkeletonProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (
        !omitted.length &&
        ts.isTypeReferenceNode(node) &&
        node.typeName.getText(file) === 'Omit' &&
        node.typeArguments
      ) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual([
      'children',
      'dangerouslySetInnerHTML',
      'role',
      'aria-hidden',
      'aria-label',
      'aria-labelledby',
      'aria-live',
      'aria-busy',
      'tabIndex',
      'contentEditable'
    ]);
    // No public ref or asChild: the decorative span host is component-owned.
    expect(alias.type.getText(file)).not.toMatch(/\bref\b|ComponentPropsWithRef|asChild/);
  });

  it('binds the CVA default variants to the documented line/md defaults and the pulsing default', () => {
    expect(defaults(source('primitives/skeleton/types.ts'), true)).toEqual({
      variant: 'line',
      size: 'md',
      pulse: 'true'
    });
  });

  describe('installed docgen extraction', () => {
    let skeletonDocs: ReturnType<typeof parser.parse>;

    beforeAll(() => {
      skeletonDocs = parser.parse(source('primitives/skeleton/Skeleton.tsx'));
    }, 20_000);

    it('extracts Skeleton enums, select controls and real defaults without semantic props', () => {
      expect(skeletonDocs.map((doc) => doc.displayName)).toEqual(['Skeleton']);
      const doc = skeletonDocs.find((item) => item.displayName === 'Skeleton');
      if (!doc) {
        throw new Error('Missing docgen for Skeleton');
      }
      const props = doc.props;
      for (const [prop, choices] of [
        ['variant', ['line', 'block', 'circle']],
        ['size', ['sm', 'md', 'lg']]
      ] as const) {
        expect(props[prop], prop).toBeDefined();
        expect(props[prop]?.required, `${prop} stays optional`).toBe(false);
        expect(props[prop]?.type.value?.map((item: { value: string }) => normalize(item.value)).sort()).toEqual(
          [...choices].sort()
        );
        expect(props[prop]?.tags).toMatchObject({ control: 'select' });
        expect(normalize(props[prop]?.defaultValue?.value), `${prop} documented default`).toBe(
          prop === 'variant' ? 'line' : 'md'
        );
      }
      expect(props.pulse, 'pulse').toBeDefined();
      expect(props.pulse?.required, 'pulse stays optional').toBe(false);
      expect(props.pulse?.type.name, 'pulse semantic type').toBe('boolean');
      expect(props.pulse?.tags).toMatchObject({ control: 'boolean' });
      expect(normalize(props.pulse?.defaultValue?.value), 'pulse documented default').toBe('true');
      for (const prop of ['id', 'title', 'className', 'style']) {
        expect(props[prop], `Skeleton native ${prop} must remain available in autodocs`).toBeDefined();
      }
      for (const prop of [
        'children',
        'dangerouslySetInnerHTML',
        'ref',
        'asChild',
        'role',
        'aria-hidden',
        'aria-label',
        'aria-labelledby',
        'aria-live',
        'aria-busy',
        'tabIndex',
        'contentEditable'
      ]) {
        expect(props[prop], prop).toBeUndefined();
      }
    });
  });
});

describe('Icon glyph metadata contract', () => {
  const iconControls: Record<string, string> = { name: 'select', size: 'select', filled: 'boolean', label: 'text' };
  let iconDocs: ReturnType<typeof parser.parse>;

  beforeAll(() => {
    iconDocs = parser.parse(source('atoms/icon/Icon.tsx'));
  }, 20_000);

  it('annotates each own Icon prop with one control and constant-only defaults', () => {
    const file = ast(source('atoms/icon/types.ts'));
    const properties = ownProps(file, ['IconProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['name', 'size', 'filled', 'label']);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, `Icon.${name} control`).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment), `Icon.${name} @control`).toBe(iconControls[name]);
      const fixed = tags.find((tag) => tag.tagName.text === 'default');
      expect(fixed ? ts.getTextOfJSDocComment(fixed.comment) : undefined, `Icon.${name} @default`).toBe(
        { size: 'md', filled: 'false' }[name]
      );
    }
    expect(defaults(source('atoms/icon/types.ts'), true)).toEqual({ size: 'md', filled: 'false' });
    expect(defaults(source('atoms/icon/useIcon.ts'), false)).toEqual({ filled: 'false' });
  });

  it('extracts the closed glyph enum, presets, fill and label from the real component', () => {
    expect(iconDocs.map((doc) => doc.displayName)).toEqual(['Icon']);
    const props = iconDocs[0]?.props;
    if (!props) {
      throw new Error('Missing docgen for Icon');
    }
    expect(props.name).toMatchObject({ required: true, defaultValue: null, tags: { control: 'select' } });
    expect(props.name?.type.name).toBe('enum');
    const glyphs = (props.name?.type.value ?? []).map((item: { value: string }) => normalize(item.value));
    expect(glyphs).toHaveLength(42);
    expect(glyphs).toEqual(expect.arrayContaining(['check', 'minus', 'plus', 'chevron-down']));
    expect(props.size?.type.value?.map((item: { value: string }) => normalize(item.value)).sort()).toEqual([
      'lg',
      'md',
      'sm'
    ]);
    expect(normalize(props.size?.defaultValue?.value)).toBe('md');
    expect(props.filled).toMatchObject({ required: false, type: { name: 'boolean' }, tags: { control: 'boolean' } });
    expect(normalize(props.filled?.defaultValue?.value)).toBe('false');
    expect(props.label).toMatchObject({ required: false, type: { name: 'string' }, tags: { control: 'text' } });
    expect(props.label?.defaultValue).toBeNull();
    expect(props.label?.description).toMatch(/When\s+omitted or empty, the icon is decorative/);
    for (const prop of ['id', 'aria-describedby', 'className']) {
      expect.soft(props[prop]?.type.name, `Icon native ${prop} must remain available in autodocs`).toBe('string');
    }
    expect.soft(props.style?.type.name).toBe('CSSProperties');
    for (const prop of [
      'children',
      'viewBox',
      'role',
      'aria-hidden',
      'aria-label',
      'aria-labelledby',
      'focusable',
      'fill',
      'stroke',
      'strokeWidth',
      'width',
      'height',
      'dangerouslySetInnerHTML',
      'ref',
      'asChild'
    ]) {
      expect(props[prop], prop).toBeUndefined();
    }
  });
});

describe('Spinner passive metadata contract', () => {
  it('keeps the size union and annotates exactly label (text) and size (select)', () => {
    const file = ast(source('atoms/spinner/types.ts'));
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'SpinnerSize');
    expect(alias && ts.isTypeAliasDeclaration(alias) ? alias.type.getText(file) : undefined).toBe("'sm' | 'md' | 'lg'");
    const properties = ownProps(file, ['SpinnerProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['label', 'size']);
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(property.questionToken, `Spinner.${name} stays optional`).toBeTruthy();
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, `Spinner.${name} control`).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe(name === 'label' ? 'text' : 'select');
      const defaultTag = tags.find((tag) => tag.tagName.text === 'default');
      // An absent label is a derived decorative rule, not a fixed default value.
      expect(ts.getTextOfJSDocComment(defaultTag?.comment)).toBe(name === 'label' ? undefined : 'md');
    }
  });

  it('omits exactly the contract-owned span props and exposes no ref or asChild', () => {
    const file = ast(source('atoms/spinner/types.ts'));
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'SpinnerProps');
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing SpinnerProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(['children', 'role', 'aria-hidden', 'aria-live']);
    expect(alias.type.getText(file)).not.toMatch(/\bref\b|ComponentPropsWithRef|asChild/);
  });

  it('binds the CVA default size to the documented md preset', () => {
    expect(defaults(source('atoms/spinner/types.ts'), true)).toEqual({ size: 'md' });
  });

  it('extracts optional label/size, the size choices, real defaults and documented native rows', () => {
    const doc = parser.parse(source('atoms/spinner/Spinner.tsx')).find((item) => item.displayName === 'Spinner');
    if (!doc) {
      throw new Error('Missing docgen for Spinner');
    }
    const { props } = doc;
    expect(props.label).toMatchObject({ required: false, tags: { control: 'text' } });
    expect(props.label?.type.name).toBe('string');
    expect(props.label?.defaultValue ?? null).toBeNull();
    expect(props.label?.description).toMatch(/When omitted, empty or whitespace-only.*decorative/s);
    expect(props.size).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(props.size?.type.value?.map((item: { value: string }) => normalize(item.value)).sort()).toEqual([
      'lg',
      'md',
      'sm'
    ]);
    expect(normalize(props.size?.defaultValue?.value)).toBe('md');
    for (const prop of ['id', 'title', 'className', 'style']) {
      expect(props[prop], `Spinner native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'aria-hidden', 'aria-live', 'tone', 'color']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('Avatar identity metadata contract', () => {
  it('annotates all five optional own props with constant-only defaults', () => {
    const file = ast(source('atoms/avatar/types.ts'));
    const properties = ownProps(file, ['AvatarProps']);
    const controls: Record<string, string> = {
      src: 'text',
      label: 'text',
      size: 'select',
      badgeIcon: 'select',
      paused: 'boolean'
    };
    expect(properties.map((property) => property.name.getText(file))).toEqual(Object.keys(controls));
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(property.questionToken, name).toBeDefined();
      const tags = ts.getJSDocTags(property);
      expect(
        tags.filter((tag) => tag.tagName.text === 'control').map((tag) => ts.getTextOfJSDocComment(tag.comment))
      ).toEqual([controls[name]]);
      const fixed = tags.find((tag) => tag.tagName.text === 'default');
      expect(fixed ? ts.getTextOfJSDocComment(fixed.comment) : undefined).toBe({ size: 'md', paused: 'false' }[name]);
    }
    expect(defaults(source('atoms/avatar/useAvatar.ts'), false)).toEqual({ size: 'md', paused: 'false' });
  });

  it('extracts actual Avatar enums, naming and native rows without ref or composition', () => {
    const doc = parser.parse(source('atoms/avatar/Avatar.tsx')).find((item) => item.displayName === 'Avatar');
    if (!doc) {
      throw new Error('Missing Avatar docgen');
    }
    const { props } = doc;
    for (const prop of ['src', 'label']) {
      expect(props[prop]).toMatchObject({ required: false, type: { name: 'string' }, tags: { control: 'text' } });
      expect(props[prop]?.defaultValue).toBeNull();
    }
    const values = (prop: string) =>
      (props[prop]?.type.value ?? []).map((item: { value: string }) => normalize(item.value));
    expect(values('size').sort()).toEqual(['lg', 'md', 'sm', 'xl']);
    expect(normalize(props.size?.defaultValue?.value)).toBe('md');
    expect(values('badgeIcon')).toHaveLength(42);
    expect(values('badgeIcon')).toContain('user');
    expect(values('badgeIcon')).toContain('linkedin');
    expect(props.badgeIcon?.defaultValue).toBeNull();
    expect(props.paused).toMatchObject({ required: false, type: { name: 'boolean' }, tags: { control: 'boolean' } });
    expect(normalize(props.paused?.defaultValue?.value)).toBe('false');
    for (const prop of ['id', 'title', 'aria-describedby', 'className', 'style']) {
      expect(props[prop], prop).toBeDefined();
    }
    for (const prop of [
      'ref',
      'asChild',
      'children',
      'role',
      'aria-label',
      'aria-labelledby',
      'aria-hidden',
      'dangerouslySetInnerHTML'
    ]) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('Link navigation metadata contract', () => {
  it('annotates every own declaration and union branch with meaningful controls', () => {
    const file = ast(source('atoms/link/types.ts'));
    const properties = ownProps(file, ['LinkTargetProps', 'LinkProps']);
    const controls: Record<string, string> = {
      asChild: 'boolean',
      href: 'text',
      children: 'false',
      external: 'boolean',
      newTabText: 'text',
      arrow: 'boolean'
    };
    expect(properties.map((property) => property.name.getText(file))).toEqual([
      'asChild',
      'href',
      'asChild',
      'href',
      'children',
      'external',
      'newTabText',
      'arrow'
    ]);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      expect(
        tags.filter((tag) => tag.tagName.text === 'control').map((tag) => ts.getTextOfJSDocComment(tag.comment))
      ).toEqual([controls[name]]);
      if (name === 'children') {
        expect(tags.find((tag) => tag.tagName.text === 'controlReason')?.comment).toMatch(
          /ReactNode.*Default and AsChild/
        );
      }
      if (!property.questionToken) {
        expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      }
    }
  });

  it('extracts real Link defaults, the conditional destination and native navigation props', () => {
    const doc = parser.parse(source('atoms/link/Link.tsx')).find((item) => item.displayName === 'Link');
    if (!doc) {
      throw new Error('Missing docgen for Link');
    }
    const { props } = doc;
    expect(props.children).toMatchObject({ required: true, defaultValue: null, tags: { control: 'false' } });
    // Docgen flattens the union: href is optional overall; the packed negative types enforce each branch.
    expect(props.href).toMatchObject({ required: false, type: { name: 'string' }, defaultValue: null });
    expect(props.asChild?.tags).toMatchObject({ control: 'boolean\nboolean' });
    const bindings = defaults(source('atoms/link/useLink.ts'), false);
    for (const [prop, value] of [
      ['asChild', 'false'],
      ['external', 'false'],
      ['arrow', 'true'],
      ['newTabText', '(opens in a new tab)']
    ] as const) {
      expect(bindings[prop], prop).toBe(value);
      expect(normalize(props[prop]?.defaultValue?.value), prop).toBe(value);
    }
    for (const prop of ['id', 'title', 'target', 'rel', 'onClick', 'aria-describedby', 'className', 'style']) {
      expect(props[prop], `Link native ${prop}`).toBeDefined();
    }
    expect(props.newTabText?.tags).toMatchObject({ control: 'text' });
    expect(props.external?.tags).toMatchObject({ control: 'boolean' });
    expect(props.arrow?.tags).toMatchObject({ control: 'boolean' });
    for (const prop of ['disabled', 'size', 'variant']) {
      expect(props[prop]).toBeUndefined();
    }
  }, 20_000);
});

describe('Logo brand-artwork metadata contract', () => {
  it('keeps the variant/size unions and annotates own props on both mode branches', () => {
    const file = ast(source('atoms/logo/types.ts'));
    const union = (name: string) => {
      const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === name);
      return alias && ts.isTypeAliasDeclaration(alias) ? alias.type.getText(file) : undefined;
    };
    expect(union('LogoVariant')).toBe("'mark' | 'wordmark'");
    expect(union('LogoSize')).toBe("'sm' | 'md' | 'lg'");
    const own = ownProps(file, ['LogoOwnProps', 'LogoLinkProps', 'LogoImageProps']);
    expect(own.map((property) => property.name.getText(file))).toEqual(['variant', 'size', 'label', 'href', 'href']);
    const expected: Record<string, [string, string | undefined]> = {
      variant: ['select', 'wordmark'],
      size: ['select', 'md'],
      label: ['text', 'egdev'],
      href: ['text', undefined]
    };
    for (const property of own) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const values = (tagName: string) =>
        tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment));
      expect(values('control'), `Logo.${name} control`).toEqual([expected[name]?.[0]]);
      // An absent href is the derived image mode, never a fixed default.
      expect(values('default')[0], `Logo.${name} default`).toBe(expected[name]?.[1]);
    }
    const [linkHref, imageHref] = own.slice(3);
    expect(linkHref?.questionToken, 'the link branch requires href').toBeUndefined();
    expect(imageHref?.questionToken, 'the image branch leaves href absent').toBeTruthy();
    expect(imageHref?.type?.getText(file)).toBe('undefined');
  });

  it('omits exactly the contract-owned naming and content props per mode and exposes no ref or asChild', () => {
    const file = ast(source('atoms/logo/types.ts'));
    const omitted = (name: string) => {
      const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === name);
      if (!alias || !ts.isTypeAliasDeclaration(alias)) {
        throw new Error(`Missing ${name} declaration`);
      }
      const keys: string[] = [];
      const visit = (node: ts.Node): void => {
        if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
          const [base, union] = node.typeArguments;
          keys.push(normalize(base?.getText(file)));
          if (union && ts.isUnionTypeNode(union)) {
            keys.push(...union.types.map((member) => normalize(member.getText(file))));
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(alias.type);
      expect(alias.type.getText(file)).not.toMatch(/\bref\b|ComponentPropsWithRef|asChild/);
      return keys;
    };
    expect(omitted('LogoLinkProps')).toEqual([
      "ComponentPropsWithoutRef<'a'>",
      'children',
      'href',
      'aria-label',
      'aria-labelledby',
      'dangerouslySetInnerHTML'
    ]);
    expect(omitted('LogoImageProps')).toEqual([
      "ComponentPropsWithoutRef<'span'>",
      'children',
      'role',
      'aria-label',
      'aria-labelledby',
      'aria-hidden',
      'dangerouslySetInnerHTML'
    ]);
  });

  it('binds the CVA default size and the hook default variant to the documented presets', () => {
    expect(defaults(source('atoms/logo/types.ts'), true)).toEqual({ size: 'md', link: 'false' });
    expect(defaults(source('atoms/logo/useLogo.ts'), false)).toEqual({ variant: 'wordmark' });
    expect(readFileSync(source('atoms/logo/useLogo.ts'), 'utf8')).toMatch(/const DEFAULT_LABEL = 'egdev';/);
  });

  it('extracts the own rows, choices, real defaults and documented native rows', () => {
    const doc = parser.parse(source('atoms/logo/Logo.tsx')).find((item) => item.displayName === 'Logo');
    if (!doc) {
      throw new Error('Missing docgen for Logo');
    }
    const { props } = doc;
    const choices = (prop: string) =>
      props[prop]?.type.value?.map((item: { value: string }) => normalize(item.value)).sort();
    expect(props.variant).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(choices('variant')).toEqual(['mark', 'wordmark']);
    expect(normalize(props.variant?.defaultValue?.value)).toBe('wordmark');
    expect(props.size).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(choices('size')).toEqual(['lg', 'md', 'sm']);
    expect(normalize(props.size?.defaultValue?.value)).toBe('md');
    expect(props.label).toMatchObject({ required: false, tags: { control: 'text' } });
    expect(props.label?.type.name).toBe('string');
    expect(normalize(props.label?.defaultValue?.value)).toBe('egdev');
    // Both mode branches merge into one optional href row whose identical directives normalize.
    expect(props.href).toMatchObject({ required: false, tags: { control: 'text\ntext' } });
    expect(props.href?.type.name).toBe('string');
    expect(props.href?.defaultValue ?? null).toBeNull();
    for (const prop of ['id', 'title', 'className', 'style', 'target', 'rel']) {
      expect(props[prop], `Logo native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'aria-label', 'aria-labelledby', 'aria-hidden', 'tone']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('StatusDot decorative metadata contract', () => {
  it('keeps the state union and annotates exactly state (select) and pulse (boolean)', () => {
    const file = ast(source('atoms/status-dot/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'StatusDotState'
    );
    expect(alias && ts.isTypeAliasDeclaration(alias) ? alias.type.getText(file) : undefined).toBe(
      "'running' | 'idle' | 'warning' | 'error' | 'stopped' | 'live' | 'standby'"
    );
    const properties = ownProps(file, ['StatusDotProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['state', 'pulse']);
    const expectedTags: Record<string, [string, string]> = { state: ['select', 'stopped'], pulse: ['boolean', 'true'] };
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(property.questionToken, `StatusDot.${name} stays optional`).toBeTruthy();
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, `StatusDot.${name} control`).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe(expectedTags[name]?.[0]);
      const defaultTag = tags.find((tag) => tag.tagName.text === 'default');
      expect(ts.getTextOfJSDocComment(defaultTag?.comment)).toBe(expectedTags[name]?.[1]);
    }
  });

  it('omits exactly the contract-owned span props and exposes no ref or asChild', () => {
    const file = ast(source('atoms/status-dot/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'StatusDotProps'
    );
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing StatusDotProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(['children', 'role', 'aria-hidden', 'aria-label', 'aria-labelledby']);
    expect(alias.type.getText(file)).not.toMatch(/\bref\b|ComponentPropsWithRef|asChild/);
  });

  it('binds the CVA and hook defaults to the documented stopped state with pulse on', () => {
    expect(defaults(source('atoms/status-dot/types.ts'), true)).toEqual({ state: 'stopped', pulse: 'true' });
    expect(defaults(source('atoms/status-dot/useStatusDot.ts'), false)).toEqual({ state: 'stopped', pulse: 'true' });
  });

  it('extracts optional state/pulse, the state choices, real defaults and documented native rows', () => {
    const doc = parser.parse(source('atoms/status-dot/StatusDot.tsx')).find((item) => item.displayName === 'StatusDot');
    if (!doc) {
      throw new Error('Missing docgen for StatusDot');
    }
    const { props } = doc;
    expect(props.state).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(props.state?.type.value?.map((item: { value: string }) => normalize(item.value)).sort()).toEqual([
      'error',
      'idle',
      'live',
      'running',
      'standby',
      'stopped',
      'warning'
    ]);
    expect(normalize(props.state?.defaultValue?.value)).toBe('stopped');
    expect(props.pulse).toMatchObject({ required: false, tags: { control: 'boolean' } });
    expect(normalize(props.pulse?.defaultValue?.value)).toBe('true');
    expect(props.pulse?.description).toMatch(/no effect on status states.*reduced-motion/s);
    for (const prop of ['id', 'title', 'className', 'style']) {
      expect(props[prop], `StatusDot native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'aria-hidden', 'aria-label', 'aria-labelledby', 'ring']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('Kbd passive metadata contract', () => {
  it('annotates exactly required children and optional label as text controls without defaults', () => {
    const file = ast(source('atoms/kbd/types.ts'));
    const properties = ownProps(file, ['KbdProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['children', 'label']);
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(Boolean(property.questionToken), `Kbd.${name} optionality`).toBe(name === 'label');
      expect(property.type?.getText(file), `Kbd.${name} type`).toBe('string');
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, `Kbd.${name} control`).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe('text');
      // Absent label is a derived plain-text rule, not a fixed default value.
      expect(tags.find((tag) => tag.tagName.text === 'default')).toBeUndefined();
    }
  });

  it('omits exactly children and dangerouslySetInnerHTML and exposes no ref or asChild', () => {
    const file = ast(source('atoms/kbd/types.ts'));
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'KbdProps');
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing KbdProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(['children', 'dangerouslySetInnerHTML']);
    expect(alias.type.getText(file)).toMatch(/ComponentPropsWithoutRef<'kbd'>/);
    expect(alias.type.getText(file)).not.toMatch(/\bref\b|ComponentPropsWithRef|asChild/);
  });

  it('extracts required children, optional label and only the documented native rows', () => {
    const doc = parser.parse(source('atoms/kbd/Kbd.tsx')).find((item) => item.displayName === 'Kbd');
    if (!doc) {
      throw new Error('Missing docgen for Kbd');
    }
    const { props } = doc;
    expect(props.children).toMatchObject({ required: true, tags: { control: 'text' } });
    expect(props.children?.type.name).toBe('string');
    expect(props.label).toMatchObject({ required: false, tags: { control: 'text' } });
    expect(props.label?.type.name).toBe('string');
    expect(props.label?.defaultValue ?? null).toBeNull();
    expect(props.label?.description).toMatch(/When omitted or empty.*read as-is/s);
    for (const prop of ['id', 'title', 'className']) {
      expect(props[prop], `Kbd native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of ['ref', 'asChild', 'dangerouslySetInnerHTML', 'style', 'onClick', 'variant', 'size']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('Select form metadata contract', () => {
  it('annotates all own props and option members with constant-only defaults', () => {
    const file = ast(source('atoms/select/types.ts'));
    const controls: Record<string, string> = {
      options: 'false',
      value: 'text',
      defaultValue: 'text',
      onValueChange: 'false',
      placeholder: 'text',
      size: 'select',
      name: 'text',
      required: 'boolean',
      disabled: 'boolean',
      label: 'text'
    };
    const props = ownProps(file, ['SelectProps', 'SelectOption']);
    expect(props).toHaveLength(12);
    for (const prop of props) {
      const name = prop.name.getText(file);
      const tags = ts.getJSDocTags(prop);
      const values = (tagName: string) =>
        tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment));
      expect(values('control'), name).toEqual([controls[name]]);
      if (controls[name] === 'false') {
        expect(values('controlReason')[0], name).toMatch(/stories|story/);
      }
      if (!prop.questionToken) {
        expect(values('default'), name).toEqual([]);
      }
    }
    expect(defaults(source('atoms/select/types.ts'), true)).toEqual({ size: 'md' });
    expect(defaults(source('atoms/select/useSelect.ts'), false)).toEqual({
      size: 'md',
      required: 'false',
      disabled: 'false'
    });
  });

  it('extracts required options, full enums, actual defaults and native trigger rows', () => {
    const doc = parser.parse(source('atoms/select/Select.tsx')).find((item) => item.displayName === 'Select');
    if (!doc) {
      throw new Error('Missing docgen for Select');
    }
    const { props } = doc;
    expect(props.options).toMatchObject({ required: true, defaultValue: null, tags: { control: 'false' } });
    expect(props.options?.type.name).toBe('SelectOption[]');
    expect(props.onValueChange).toMatchObject({ required: false, tags: { control: 'false' } });
    expect(props.placeholder).toMatchObject({
      type: { name: 'string' },
      defaultValue: null,
      tags: { control: 'text' }
    });
    expect(props.size?.type.value?.map((item: { value: string }) => normalize(item.value)).sort()).toEqual([
      'md',
      'sm'
    ]);
    for (const [prop, value] of [
      ['size', 'md'],
      ['required', 'false'],
      ['disabled', 'false']
    ]) {
      expect(normalize(props[prop ?? '']?.defaultValue?.value)).toBe(value);
    }
    for (const prop of ['value', 'defaultValue', 'placeholder', 'onValueChange', 'name']) {
      expect(props[prop]?.defaultValue, prop).toBeNull();
    }
    for (const prop of [
      'id',
      'aria-label',
      'aria-labelledby',
      'aria-describedby',
      'aria-invalid',
      'className',
      'onFocus',
      'onBlur'
    ]) {
      expect(props[prop], prop).toBeDefined();
    }
    for (const prop of ['open', 'defaultOpen', 'onOpenChange', 'asChild', 'children', 'type', 'dir', 'onChange']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('RadioGroup metadata contract', () => {
  const radioGroupControls: Record<string, string> = {
    label: 'text',
    options: 'false',
    value: 'text',
    defaultValue: 'text',
    onValueChange: 'false',
    orientation: 'select',
    disabled: 'boolean',
    required: 'boolean',
    name: 'text'
  };
  const radioGroupDefaults: Record<string, string> = {
    orientation: 'vertical',
    disabled: 'false',
    required: 'false'
  };
  const radioGroupReasons: Record<string, RegExp> = {
    options: /Array of option objects.*Default and DisabledOption stories/,
    onValueChange: /Event handler.*Controlled story/
  };

  it('annotates every own prop with one control, concrete reasons and only actual constant defaults', () => {
    const file = ast(source('atoms/radio-group/types.ts'));
    const properties = ownProps(file, ['RadioGroupProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(Object.keys(radioGroupControls));
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(Boolean(property.questionToken), `RadioGroup.${name} optionality`).toBe(
        !['label', 'options'].includes(name)
      );
      const tags = ts.getJSDocTags(property);
      const values = (tagName: string) =>
        tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment));
      expect(values('control'), `RadioGroup.${name} control`).toEqual([radioGroupControls[name]]);
      expect(values('default'), `RadioGroup.${name} default`).toEqual(
        radioGroupDefaults[name] ? [radioGroupDefaults[name]] : []
      );
      const reason = radioGroupReasons[name];
      if (reason) {
        expect(values('controlReason')[0]).toMatch(reason);
      }
    }
    const stories = exportedStoryNames(ast(source('atoms/radio-group/RadioGroup.stories.tsx')));
    expect(stories).toEqual(['Default', 'Controlled', 'Horizontal', 'DisabledOption', 'DisabledGroup']);
  });

  it('binds the documented defaults to the hook destructuring and the root CVA', () => {
    expect(defaults(source('atoms/radio-group/useRadioGroup.ts'), false)).toEqual(radioGroupDefaults);
    expect(defaults(source('atoms/radio-group/types.ts'), true)).toEqual({ orientation: 'vertical' });
  });

  it('omits exactly the Radix-owned div props and exposes no ref or asChild', () => {
    const file = ast(source('atoms/radio-group/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'RadioGroupProps'
    );
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing RadioGroupProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(['children', 'defaultValue', 'dir', 'onChange', 'role', 'aria-label']);
    expect(alias.type.getText(file)).toMatch(/ComponentPropsWithoutRef<'div'>/);
    expect(file.getText()).not.toMatch(/asChild|ComponentPropsWithRef/);
  });

  it('extracts the own rows, real defaults and only the documented native rows', () => {
    const doc = parser
      .parse(source('atoms/radio-group/RadioGroup.tsx'))
      .find((item) => item.displayName === 'RadioGroup');
    if (!doc) {
      throw new Error('Missing docgen for RadioGroup');
    }
    const { props } = doc;
    for (const [prop, control] of Object.entries(radioGroupControls)) {
      expect(props[prop], `RadioGroup.${prop}`).toMatchObject({
        required: ['label', 'options'].includes(prop),
        tags: { control }
      });
      expect(normalize(props[prop]?.defaultValue?.value ?? ''), `RadioGroup.${prop} default`).toBe(
        radioGroupDefaults[prop] ?? ''
      );
    }
    for (const prop of ['label', 'value', 'defaultValue', 'name']) {
      expect(props[prop]?.type.name, prop).toBe('string');
    }
    for (const prop of ['disabled', 'required']) {
      expect(props[prop]?.type.name, prop).toBe('boolean');
    }
    // The checker resolves the literal union alphabetically; the AST keeps the declared order.
    expect(props.orientation?.type.value?.map((item: { value: string }) => normalize(item.value))).toEqual([
      'horizontal',
      'vertical'
    ]);
    expect(props.value?.description).toMatch(/When omitted the group is uncontrolled/);
    expect(props.defaultValue?.description).toMatch(/Nothing is selected when omitted/);
    expect(Object.keys(props).sort()).toEqual(
      [...Object.keys(radioGroupControls), 'id', 'aria-labelledby', 'aria-describedby', 'className'].sort()
    );
  }, 20_000);
});

describe('Switch metadata contract', () => {
  const switchControls: Record<string, string> = {
    checked: 'boolean',
    defaultChecked: 'boolean',
    onCheckedChange: 'false',
    disabled: 'boolean',
    required: 'boolean',
    name: 'text',
    value: 'text'
  };
  const switchDefaults: Record<string, string> = {
    defaultChecked: 'false',
    disabled: 'false',
    required: 'false',
    value: 'on'
  };

  it('annotates every own prop with one control and only actual constant defaults (AC-11)', () => {
    const file = ast(source('atoms/switch/types.ts'));
    const properties = ownProps(file, ['SwitchProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(Object.keys(switchControls));
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(property.questionToken, `Switch.${name} stays optional`).toBeTruthy();
      const tags = ts.getJSDocTags(property);
      const values = (tagName: string) =>
        tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment));
      expect(values('control'), `Switch.${name} control`).toEqual([switchControls[name]]);
      expect(values('default'), `Switch.${name} default`).toEqual(switchDefaults[name] ? [switchDefaults[name]] : []);
      if (name === 'onCheckedChange') {
        expect(values('controlReason')[0]).toMatch(/Event handler.*Controlled story/);
      }
    }
  });

  it('binds the documented defaults to the hook destructuring', () => {
    expect(defaults(source('atoms/switch/useSwitch.ts'), false)).toEqual(switchDefaults);
  });

  it('omits the Radix-owned and re-declared button props and exposes no asChild', () => {
    const file = ast(source('atoms/switch/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'SwitchNativeProps'
    );
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing SwitchNativeProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(['checked', 'defaultChecked', 'onChange', 'value', 'type', 'children', 'disabled', 'name']);
    expect(alias.type.getText(file)).toMatch(/ComponentPropsWithoutRef<'button'>/);
    expect(file.getText()).not.toMatch(/asChild/);
  });

  it('extracts the own rows, real defaults and only the documented native rows', () => {
    const doc = parser.parse(source('atoms/switch/Switch.tsx')).find((item) => item.displayName === 'Switch');
    if (!doc) {
      throw new Error('Missing docgen for Switch');
    }
    const { props } = doc;
    for (const [prop, control] of Object.entries(switchControls)) {
      expect(props[prop], `Switch.${prop}`).toMatchObject({ required: false, tags: { control } });
      expect(normalize(props[prop]?.defaultValue?.value ?? ''), `Switch.${prop} default`).toBe(
        switchDefaults[prop] ?? ''
      );
    }
    for (const prop of ['checked', 'defaultChecked', 'disabled', 'required']) {
      expect(props[prop]?.type.name, prop).toBe('boolean');
    }
    for (const prop of ['name', 'value']) {
      expect(props[prop]?.type.name, prop).toBe('string');
    }
    expect(props.checked?.description).toMatch(/When omitted the switch is uncontrolled/);
    expect(Object.keys(props).sort()).toEqual(
      [...Object.keys(switchControls), 'id', 'aria-label', 'aria-labelledby', 'aria-describedby', 'className'].sort()
    );
  }, 20_000);
});

describe('Tooltip metadata contract', () => {
  const controls: Record<string, string> = { content: 'text', children: 'false', side: 'select', className: 'text' };

  it('annotates exactly content, children, side and className with one control each', () => {
    const file = ast(source('atoms/tooltip/types.ts'));
    const properties = ownProps(file, ['TooltipProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(Object.keys(controls));
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(Boolean(property.questionToken), `Tooltip.${name} optionality`).toBe(
        name === 'side' || name === 'className'
      );
      const tags = ts.getJSDocTags(property);
      const values = (tagName: string) =>
        tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment));
      expect(values('control'), `Tooltip.${name} control`).toEqual([controls[name]]);
      expect(values('default'), `Tooltip.${name} default`).toEqual(name === 'side' ? ['top'] : []);
      if (name === 'children') {
        expect(values('controlReason')[0]).toMatch(/ReactElement trigger is not serializable.*Default.*Sides/);
      }
    }
  });

  it('declares a standalone props type without native inheritance, ref or asChild', () => {
    const file = ast(source('atoms/tooltip/types.ts'));
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'TooltipProps');
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing TooltipProps declaration');
    }
    // A plain type literal: no inherited native or Radix props, so no ref, asChild or open state.
    expect(ts.isTypeLiteralNode(alias.type)).toBe(true);
    const members = ts.isTypeLiteralNode(alias.type)
      ? alias.type.members.map((member) => member.name?.getText(file))
      : [];
    expect(members).toEqual(Object.keys(controls));
  });

  it('extracts required content/children, the ordered side choices and its top default', () => {
    const doc = parser.parse(source('atoms/tooltip/Tooltip.tsx')).find((item) => item.displayName === 'Tooltip');
    if (!doc) {
      throw new Error('Missing docgen for Tooltip');
    }
    const { props } = doc;
    expect(Object.keys(props).sort()).toEqual(['children', 'className', 'content', 'side']);
    expect(props.content).toMatchObject({ required: true, tags: { control: 'text' } });
    expect(props.content?.type.name).toBe('string');
    expect(props.children).toMatchObject({ required: true, tags: { control: 'false' } });
    expect(props.side).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(props.side?.type.value?.map((item: { value: string }) => normalize(item.value))).toEqual([
      'top',
      'right',
      'bottom',
      'left'
    ]);
    expect(normalize(props.side?.defaultValue?.value)).toBe('top');
    expect(props.className).toMatchObject({ required: false, tags: { control: 'text' } });
    expect(props.className?.description).toMatch(/Appearance overrides are unsupported/);
  }, 20_000);
});

describe('ProgressBar passive metadata contract', () => {
  const controls: Record<string, string> = {
    size: 'select',
    edge: 'boolean',
    value: 'number',
    label: 'text',
    valueText: 'text',
    variant: 'select'
  };

  it('annotates every own declaration, including both size/edge union branches, with one control', () => {
    const file = ast(source('atoms/progress-bar/types.ts'));
    const properties = ownProps(file, ['ProgressBarProps', 'ProgressBarSizeProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual([
      'size',
      'edge',
      'size',
      'edge',
      'value',
      'label',
      'valueText',
      'variant'
    ]);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const directives = tags.filter((tag) => tag.tagName.text === 'control');
      expect(directives, `ProgressBar.${name} control`).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(directives[0]?.comment)).toBe(controls[name]);
      if (!property.questionToken) {
        expect(
          tags.some((tag) => tag.tagName.text === 'default'),
          `${name}: required must not invent @default`
        ).toBe(false);
      }
    }
    // D7: the lg branch requires size="lg" and narrows edge to false.
    const lg = properties.filter((property) => property.name.getText(file) === 'size')[1];
    expect(lg?.questionToken).toBeUndefined();
    expect(lg?.type?.getText(file)).toBe("'lg'");
    expect(properties.filter((property) => property.name.getText(file) === 'edge')[1]?.type?.getText(file)).toBe(
      'false'
    );
  });

  it('omits exactly the Radix- and contract-owned div props and exposes no ref or asChild', () => {
    const file = ast(source('atoms/progress-bar/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'ProgressBarNativeProps'
    );
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing ProgressBarNativeProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual([
      'children',
      'role',
      'aria-valuemin',
      'aria-valuemax',
      'aria-valuenow',
      'aria-valuetext',
      'aria-label',
      'aria-labelledby',
      'aria-hidden',
      'dangerouslySetInnerHTML'
    ]);
    expect(alias.type.getText(file)).toMatch(/ComponentPropsWithoutRef<'div'>/);
    expect(alias.type.getText(file)).not.toMatch(/\bref\b|ComponentPropsWithRef|asChild/);
  });

  it('binds the CVA defaults to the documented sm, default and non-edge presets', () => {
    // Track and fill defaults merge into one map; size is sm in both configs.
    expect(defaults(source('atoms/progress-bar/types.ts'), true)).toEqual({
      size: 'sm',
      edge: 'false',
      variant: 'default'
    });
  });

  it('extracts the required value, optional own rows, real defaults and documented native rows', () => {
    const doc = parser
      .parse(source('atoms/progress-bar/ProgressBar.tsx'))
      .find((item) => item.displayName === 'ProgressBar');
    if (!doc) {
      throw new Error('Missing docgen for ProgressBar');
    }
    const { props } = doc;
    expect(props.value).toMatchObject({ required: true, tags: { control: 'number' } });
    expect(props.value?.defaultValue ?? null).toBeNull();
    expect(props.value?.description).toMatch(/clamp to 0–100.*non-finite values are indeterminate/s);
    for (const prop of ['label', 'valueText']) {
      expect(props[prop], prop).toMatchObject({ required: false, tags: { control: 'text' } });
      expect(props[prop]?.type.name, prop).toBe('string');
      expect(props[prop]?.defaultValue ?? null, prop).toBeNull();
    }
    expect(props.label?.description).toMatch(/When omitted, empty or\s+whitespace-only.*decorative/s);
    expect(props.valueText?.description).toMatch(/When omitted.*"45%"/s);
    expect(props.size).toMatchObject({ required: false, tags: { control: 'select\nselect', default: 'sm' } });
    expect(props.size?.type.value?.map((item: { value: string }) => normalize(item.value))).toEqual(['sm', 'lg']);
    expect(props.size?.defaultValue?.value).toBe('sm');
    expect(props.variant).toMatchObject({ required: false, tags: { control: 'select', default: 'default' } });
    expect(props.variant?.type.value?.map((item: { value: string }) => normalize(item.value))).toEqual([
      'default',
      'muted'
    ]);
    expect(props.edge).toMatchObject({ required: false, tags: { control: 'boolean\nboolean', default: 'false' } });
    expect(props.edge?.type.name).toBe('boolean');
    expect(props.edge?.defaultValue?.value).toBe('false');
    for (const prop of ['id', 'title', 'aria-describedby', 'className', 'style']) {
      expect(props[prop], `ProgressBar native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of ['children', 'ref', 'asChild', 'role', 'max', 'getValueLabel', 'aria-label', 'aria-hidden']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('Textarea native control metadata contract', () => {
  it('annotates exactly the optional variant as a select with the actual default', () => {
    const file = ast(source('atoms/textarea/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'TextareaVariant'
    );
    expect(alias && ts.isTypeAliasDeclaration(alias) ? alias.type.getText(file) : undefined).toBe(
      "'default' | 'code' | 'prose'"
    );
    const properties = ownProps(file, ['TextareaProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['variant']);
    const [variant] = properties;
    expect(variant?.questionToken, 'Textarea.variant stays optional').toBeTruthy();
    expect(variant?.type?.getText(file)).toBe('TextareaVariant');
    const tags = variant ? ts.getJSDocTags(variant) : [];
    const controls = tags.filter((tag) => tag.tagName.text === 'control');
    expect(controls).toHaveLength(1);
    expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe('select');
    const defaultTag = tags.find((tag) => tag.tagName.text === 'default');
    expect(ts.getTextOfJSDocComment(defaultTag?.comment)).toBe('default');
    expect(defaults(source('atoms/textarea/types.ts'), true)).toEqual({ variant: 'default' });
    expect(defaults(source('atoms/textarea/useTextarea.ts'), false)).toEqual({ variant: 'default' });
  });

  it('omits exactly children from the native textarea props and adds no asChild', () => {
    const file = ast(source('atoms/textarea/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'TextareaNativeProps'
    );
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing TextareaNativeProps declaration');
    }
    expect(normalize(alias.type.getText(file))).toBe("Omit<ComponentPropsWithoutRef<'textarea'>, 'children'>");
    expect(readFileSync(source('atoms/textarea/Textarea.tsx'), 'utf8')).toMatch(
      /forwardRef<HTMLTextAreaElement, TextareaProps>/
    );
  });

  it('extracts the variant enum, its default and only the documented native rows', () => {
    const doc = parser.parse(source('atoms/textarea/Textarea.tsx')).find((item) => item.displayName === 'Textarea');
    if (!doc) {
      throw new Error('Missing docgen for Textarea');
    }
    const { props } = doc;
    expect(props.variant).toMatchObject({ required: false, tags: { control: 'select', default: 'default' } });
    expect(normalize(props.variant?.defaultValue?.value)).toBe('default');
    expect(props.variant?.type.name).toBe('enum');
    for (const prop of [
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
    ]) {
      expect(props[prop], `Textarea native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of ['children', 'ref', 'asChild', 'dangerouslySetInnerHTML', 'style', 'onClick', 'size']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('Input text-control metadata contract', () => {
  it('keeps the public unions and annotates exactly size, variant, type (select) and icon (false)', () => {
    const file = ast(source('atoms/input/types.ts'));
    const union = (name: string) => {
      const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === name);
      return alias && ts.isTypeAliasDeclaration(alias) ? alias.type.getText(file) : undefined;
    };
    expect(union('InputSize')).toBe("'md' | 'sm'");
    expect(union('InputVariant')).toBe("'default' | 'code'");
    expect(union('InputType')).toBe("'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number'");
    const properties = ownProps(file, ['InputProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['size', 'variant', 'type', 'icon']);
    const constants: Record<string, string | undefined> = {
      size: 'md',
      variant: 'default',
      type: 'text',
      icon: undefined
    };
    for (const property of properties) {
      const name = property.name.getText(file);
      expect(property.questionToken, `Input.${name} stays optional`).toBeTruthy();
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, `Input.${name} control`).toHaveLength(1);
      expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe(name === 'icon' ? 'false' : 'select');
      // An absent icon renders nothing: an absence rule, not a fixed default value.
      const defaultTag = tags.find((tag) => tag.tagName.text === 'default');
      expect(ts.getTextOfJSDocComment(defaultTag?.comment), `Input.${name} @default`).toBe(constants[name]);
    }
    const iconReason = ts
      .getJSDocTags(properties[3] as ts.PropertySignature)
      .find((tag) => tag.tagName.text === 'controlReason');
    expect(ts.getTextOfJSDocComment(iconReason?.comment)).toMatch(/Non-serializable ReactNode.*WithIcon/);
    expect(exportedStoryNames(ast(source('atoms/input/Input.stories.tsx')))).toContain('WithIcon');
  });

  it('omits exactly the native size, type and children from the forwarded input props', () => {
    const file = ast(source('atoms/input/types.ts'));
    const alias = file.statements.find(
      (node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'InputNativeProps'
    );
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing InputNativeProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const members = node.typeArguments[1];
        if (members && ts.isUnionTypeNode(members)) {
          omitted.push(...members.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(['size', 'type', 'children']);
    expect(alias.type.getText(file)).toMatch(/ComponentPropsWithoutRef<'input'>/);
    expect(alias.type.getText(file)).not.toMatch(/asChild/);
  });

  it('binds the CVA defaults to the documented md/default presets', () => {
    expect(defaults(source('atoms/input/types.ts'), true)).toEqual({ size: 'md', variant: 'default', icon: 'false' });
    expect(defaults(source('atoms/input/useInput.ts'), false)).toEqual({
      size: 'md',
      variant: 'default',
      type: 'text'
    });
  });

  it('extracts the select choices, real defaults, the icon row and only the documented native rows', () => {
    const doc = parser.parse(source('atoms/input/Input.tsx')).find((item) => item.displayName === 'Input');
    if (!doc) {
      throw new Error('Missing docgen for Input');
    }
    const { props } = doc;
    const choices = (prop: string) =>
      props[prop]?.type.value?.map((item: { value: string }) => normalize(item.value)).sort();
    expect(props.size).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(choices('size')).toEqual(['md', 'sm']);
    expect(normalize(props.size?.defaultValue?.value)).toBe('md');
    expect(props.variant).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(choices('variant')).toEqual(['code', 'default']);
    expect(normalize(props.variant?.defaultValue?.value)).toBe('default');
    expect(props.type).toMatchObject({ required: false, tags: { control: 'select' } });
    expect(choices('type')).toEqual(['email', 'number', 'password', 'search', 'tel', 'text', 'url']);
    expect(normalize(props.type?.defaultValue?.value)).toBe('text');
    expect(props.icon).toMatchObject({ required: false, tags: { control: 'false' } });
    expect(props.icon?.defaultValue ?? null).toBeNull();
    expect(props.icon?.description).toMatch(/No icon is rendered when omitted/);
    for (const prop of ['id', 'name', 'placeholder', 'disabled', 'readOnly', 'required', 'className']) {
      expect(props[prop], `Input native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of ['children', 'asChild', 'onChange', 'style', 'tone', 'invalid', 'onValueChange']) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('ProductMark mode metadata contract', () => {
  const branches = ['ProductMarkLinkProps', 'ProductMarkImageProps'];

  it('annotates monogram, label and href as text controls on every branch without defaults', () => {
    const file = ast(source('atoms/product-mark/types.ts'));
    const properties = ownProps(file, ['ProductMarkOwnProps', ...branches]);
    expect(properties.map((property) => property.name.getText(file))).toEqual(['monogram', 'label', 'href', 'href']);
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const controls = tags.filter((tag) => tag.tagName.text === 'control');
      expect(controls, `ProductMark.${name} control`).toHaveLength(1);
      // Union branches merge their tags in docgen: a differing directive per branch would be ambiguous.
      expect(ts.getTextOfJSDocComment(controls[0]?.comment)).toBe('text');
      expect(tags.find((tag) => tag.tagName.text === 'default')).toBeUndefined();
    }
    const [monogram, label, linkHref, imageHref] = properties;
    expect(monogram?.questionToken).toBeUndefined();
    expect(label?.questionToken).toBeUndefined();
    expect(linkHref?.questionToken).toBeUndefined();
    expect(linkHref?.type?.getText(file)).toBe('string');
    expect(imageHref?.questionToken).toBeTruthy();
    expect(imageHref?.type?.getText(file)).toBe('undefined');
  });

  it.each([
    ['ProductMarkLinkProps', ['children', 'href', 'aria-label', 'aria-labelledby', 'dangerouslySetInnerHTML']],
    [
      'ProductMarkImageProps',
      ['children', 'role', 'aria-label', 'aria-labelledby', 'aria-hidden', 'dangerouslySetInnerHTML']
    ]
  ] as const)('%s omits exactly the contract-owned naming and content props and exposes no ref', (name, expected) => {
    const file = ast(source('atoms/product-mark/types.ts'));
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === name);
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error(`Missing ${name} declaration`);
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(expected);
    expect(alias.type.getText(file)).not.toMatch(/\bref\b|ComponentPropsWithRef|asChild/);
  });

  it('extracts required monogram/label, optional href and only the documented native rows', () => {
    const doc = parser
      .parse(source('atoms/product-mark/ProductMark.tsx'))
      .find((item) => item.displayName === 'ProductMark');
    if (!doc) {
      throw new Error('Missing docgen for ProductMark');
    }
    const { props } = doc;
    for (const prop of ['monogram', 'label']) {
      expect(props[prop], prop).toMatchObject({ required: true, tags: { control: 'text' } });
      expect(props[prop]?.type.name, prop).toBe('string');
      expect(props[prop]?.defaultValue ?? null, prop).toBeNull();
    }
    expect(props.href).toMatchObject({ required: false });
    expect(props.href?.type.name).toBe('string');
    // Both branches carry the same directive; docgen joins them and the enhancer normalizes to one.
    expect(props.href).toMatchObject({ tags: { control: expect.stringMatching(/^text\s*\n\s*text$/) } });
    expect(props.href?.description).toMatch(/When absent.*role="img"/s);
    for (const prop of ['id', 'title', 'className', 'target', 'rel']) {
      expect(props[prop], `ProductMark native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of [
      'children',
      'ref',
      'asChild',
      'role',
      'aria-label',
      'dangerouslySetInnerHTML',
      'size',
      'onClick'
    ]) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});

describe('Slider interactive metadata contract', () => {
  const sliderControls: Record<string, string> = {
    label: 'text',
    value: 'number',
    defaultValue: 'number',
    onValueChange: 'false',
    onValueCommit: 'false',
    min: 'number',
    max: 'number',
    step: 'number',
    valueText: 'false',
    disabled: 'boolean',
    name: 'text'
  };

  it('annotates every own prop with one control, concrete false-control reasons and constant-only defaults', () => {
    const file = ast(source('atoms/slider/types.ts'));
    const properties = ownProps(file, ['SliderProps']);
    expect(properties.map((property) => property.name.getText(file))).toEqual(Object.keys(sliderControls));
    for (const property of properties) {
      const name = property.name.getText(file);
      const tags = ts.getJSDocTags(property);
      const values = (tagName: string) =>
        tags.filter((tag) => tag.tagName.text === tagName).map((tag) => ts.getTextOfJSDocComment(tag.comment));
      expect(Boolean(property.questionToken), `Slider.${name} optionality`).toBe(name !== 'label');
      expect(values('control'), `Slider.${name} control`).toEqual([sliderControls[name]]);
      expect(values('controlReason').length, `Slider.${name} reason`).toBe(sliderControls[name] === 'false' ? 1 : 0);
    }
    const reasons = properties.flatMap((property) =>
      ts
        .getJSDocTags(property)
        .filter((tag) => tag.tagName.text === 'controlReason')
        .map((tag) => ts.getTextOfJSDocComment(tag.comment) ?? '')
    );
    const stories = exportedStoryNames(ast(source('atoms/slider/Slider.stories.tsx')));
    for (const reason of reasons) {
      const named = /see the (\w+) story/.exec(reason)?.[1];
      expect(named && stories.includes(named), reason).toBe(true);
    }
  });

  it('binds the documented constant defaults to the hook bindings', () => {
    expect(defaults(source('atoms/slider/useSlider.ts'), false)).toEqual({
      min: '0',
      max: '100',
      step: '1',
      disabled: 'false'
    });
  });

  it('omits exactly the contract span props and exposes no ref or asChild', () => {
    const file = ast(source('atoms/slider/types.ts'));
    const alias = file.statements.find((node) => ts.isTypeAliasDeclaration(node) && node.name.text === 'SliderProps');
    if (!alias || !ts.isTypeAliasDeclaration(alias)) {
      throw new Error('Missing SliderProps declaration');
    }
    const omitted: string[] = [];
    const visit = (node: ts.Node): void => {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText(file) === 'Omit' && node.typeArguments) {
        const union = node.typeArguments[1];
        if (union && ts.isUnionTypeNode(union)) {
          omitted.push(...union.types.map((member) => normalize(member.getText(file))));
        }
      }
      ts.forEachChild(node, visit);
    };
    visit(alias.type);
    expect(omitted).toEqual(['children', 'defaultValue', 'dir', 'onChange']);
    expect(alias.type.getText(file)).toMatch(/ComponentPropsWithoutRef<'span'>/);
    expect(alias.type.getText(file)).not.toMatch(/ComponentPropsWithRef|asChild/);
  });

  it('extracts required label, numeric bounds with defaults, callbacks and only the documented native rows', () => {
    const doc = parser.parse(source('atoms/slider/Slider.tsx')).find((item) => item.displayName === 'Slider');
    if (!doc) {
      throw new Error('Missing docgen for Slider');
    }
    const { props } = doc;
    expect(props.label).toMatchObject({ required: true, tags: { control: 'text' } });
    expect(props.label?.type.name).toBe('string');
    for (const [prop, value] of [
      ['min', '0'],
      ['max', '100'],
      ['step', '1']
    ] as const) {
      expect(props[prop], prop).toMatchObject({ required: false, tags: { control: 'number' } });
      expect(props[prop]?.type.name, prop).toBe('number');
      expect(props[prop]?.defaultValue?.value, prop).toBe(value);
    }
    expect(props.disabled?.defaultValue?.value).toBe('false');
    for (const prop of ['value', 'defaultValue', 'valueText', 'name', 'onValueChange', 'onValueCommit']) {
      expect(props[prop], prop).toMatchObject({ required: false });
      expect(props[prop]?.defaultValue ?? null, prop).toBeNull();
    }
    // The parser parenthesizes optional function types; the signatures stay scalar.
    expect(props.onValueChange?.type.name).toBe('((value: number) => void)');
    expect(props.onValueCommit?.type.name).toBe('((value: number) => void)');
    expect(props.valueText?.type.name).toBe('((value: number) => string)');
    for (const prop of ['id', 'title', 'aria-describedby', 'className']) {
      expect(props[prop], `Slider native ${prop} must remain available in autodocs`).toBeDefined();
    }
    for (const prop of [
      'ref',
      'asChild',
      'children',
      'dir',
      'onChange',
      'orientation',
      'inverted',
      'style',
      'onClick'
    ]) {
      expect(props[prop], prop).toBeUndefined();
    }
  }, 20_000);
});
