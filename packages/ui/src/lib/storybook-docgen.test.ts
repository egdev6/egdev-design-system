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

function gaugeOwnProps(file: ts.SourceFile): ts.PropertySignature[] {
  const properties: ts.PropertySignature[] = [];
  function visit(node: ts.Node) {
    if (ts.isPropertySignature(node)) {
      properties.push(node);
    }
    ts.forEachChild(node, visit);
  }
  for (const node of file.statements) {
    if (ts.isTypeAliasDeclaration(node) && ['GaugeProps', 'GaugeStateProps'].includes(node.name.text)) {
      visit(node.type);
    }
  }
  return properties;
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
  it('exposes only Gauge and the cn utility through the package source barrel', () => {
    const file = ast(source('index.ts'));
    const modules = file.statements.flatMap((node) =>
      ts.isExportDeclaration(node) && node.moduleSpecifier && ts.isStringLiteral(node.moduleSpecifier)
        ? [node.moduleSpecifier.text]
        : []
    );
    expect(modules).toEqual(['./atoms/gauge', './lib/cn']);
    expect(Object.keys(publicAPI).sort()).toEqual(['Gauge', 'cn']);
  });

  beforeAll(() => {
    expect(config.typescript?.reactDocgen).toBe('react-docgen-typescript');
    docs = parser.parse(source('atoms/gauge/Gauge.tsx'));
  }, 20_000);

  it('keeps explicit parser options aligned with Vite and extracts clean descriptions plus separate tags', () => {
    const options = config.typescript?.reactDocgenTypescriptOptions;
    expect(options?.shouldIncludePropTagMap).toBe(true);
    expect(options?.savePropValueAsString).toBe(true);
    for (const doc of docs) {
      for (const prop of Object.values(doc.props)) {
        expect(prop.description).not.toMatch(/@control(?:Reason)?/);
      }
      expect(doc.props.label?.tags).toMatchObject({ control: 'text' });
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

  it('limits real parser discovery to the current public React component', () => {
    expect(docs.map((doc) => doc.displayName)).toEqual(['Gauge']);
    expect(Object.keys(gaugeControls)).toHaveLength(8);
  });
});
