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
  it('exposes Gauge, AspectRatio, Portal, Slot and the cn utility through the package source barrel', () => {
    const file = ast(source('index.ts'));
    const modules = file.statements.flatMap((node) =>
      ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
        ? [node.moduleSpecifier.text]
        : []
    );
    // Each primitive exports its type alias first and runtime component second; dedupe the specifiers.
    expect([...new Set(modules)].sort()).toEqual([
      './atoms/gauge',
      './lib/cn',
      './primitives/aspect-ratio',
      './primitives/divider',

      './primitives/label',
      './primitives/portal',
      './primitives/skeleton',
      './primitives/slot',
      './primitives/visually-hidden'
    ]);
    expect(Object.keys(publicAPI).sort()).toEqual([
      'AspectRatio',
      'Divider',
      'Gauge',
      'Label',
      'Portal',
      'Skeleton',
      'Slot',
      'Slottable',
      'VisuallyHidden',
      'cn',
      'labelVariants'
    ]);
  });

  beforeAll(() => {
    expect(config.typescript?.reactDocgen).toBe('react-docgen-typescript');
    docs = parser.parse([source('atoms/gauge/Gauge.tsx'), source('primitives/aspect-ratio/AspectRatio.tsx')]);
  }, 20_000);

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
    expect(docs.map((doc) => doc.displayName)).toEqual(['Gauge', 'AspectRatio']);
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
    expect(properties.map((property) => property.name.getText(file))).toEqual(['variant', 'size']);
    for (const property of properties) {
      const name = property.name.getText(file);
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

  it('binds the CVA default variants to the documented line/md defaults', () => {
    expect(defaults(source('primitives/skeleton/types.ts'), true)).toEqual({ variant: 'line', size: 'md' });
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
