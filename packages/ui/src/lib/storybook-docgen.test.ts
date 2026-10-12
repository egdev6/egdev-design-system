// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { beforeAll, describe, expect, it } from 'vitest';
import config from '../../../../.storybook/main';

const source = (path: string) => fileURLToPath(new URL(`../${path}`, import.meta.url));
const components = [
  ['IconButton', 'atoms/icon-button', 'useIconButton'],
  ['Surface', 'primitives/surface', 'useSurface'],
  ['Tabs', 'molecules/tabs', 'useTabs']
] as const;
const normalize = (value: unknown) => String(value).replace(/^['"]+|['"]+$/g, '');
const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
  ...config.typescript?.reactDocgenTypescriptOptions
});
let docs: ReturnType<typeof parser.parse>;

// Read the real CVA config and hook bindings, not hand-authored docgen fixtures.
function defaults(path: string, cva: boolean): Record<string, string> {
  const file = ts.createSourceFile(path, readFileSync(path, 'utf8'), ts.ScriptTarget.Latest, true);
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
  beforeAll(() => {
    expect(config.typescript?.reactDocgen).toBe('react-docgen-typescript');
    docs = parser.parse(components.map(([name, directory]) => source(`${directory}/${name}.tsx`)));
  }, 20_000);

  it.each(components)('%s exposes documented defaults matching CVA and hook defaults', (name, directory, hook) => {
    const doc = docs.find((item) => item.displayName === name);
    expect(doc, `${name} must be discovered through its public props alias`).toBeDefined();
    if (!doc) {
      throw new Error(`Missing docgen for ${name}`);
    }
    const variants = defaults(source(`${directory}/types.ts`), true);
    const bindings = defaults(source(`${directory}/${hook}.ts`), false);
    expect(Object.keys(variants).length).toBeGreaterThan(0);
    for (const [prop, value] of Object.entries({ ...variants, ...(name !== 'Tabs' ? { asChild: 'false' } : {}) })) {
      expect(bindings[prop], `${name}.${prop} runtime default`).toBe(value);
      expect(normalize(doc.props[prop]?.defaultValue?.value), `${name}.${prop} documented default`).toBe(value);
    }
    if (name !== 'Tabs') {
      expect(doc.props.asChild?.description).toMatch(/Renderiza el hijo/);
    }
  });

  it('extracts required accessible props and select-compatible literal enums', () => {
    const props = docs.find((doc) => doc.displayName === 'IconButton')?.props;
    expect(props?.label?.required).toBe(true);
    expect(props?.icon?.required).toBe(true);
    expect(props?.label?.description).toMatch(/Nombre accesible/);
    expect(props?.icon?.description).toMatch(/lectores de pantalla/);
    for (const [prop, values, value] of [
      ['variant', ['ghost', 'outline'], 'ghost'],
      ['shape', ['round', 'square'], 'round'],
      ['size', ['md', 'sm'], 'md']
    ] as const) {
      expect(props?.[prop]?.type.name).toBe('enum');
      expect(props?.[prop]?.type.value?.map((item: { value: string }) => normalize(item.value))).toEqual(values);
      expect(normalize(props?.[prop]?.defaultValue?.value)).toBe(value);
    }
    const tabs = docs.find((doc) => doc.displayName === 'Tabs')?.props;
    expect(normalize(tabs?.size?.defaultValue?.value)).toBe('md');
    expect(normalize(tabs?.variant?.defaultValue?.value)).toBe('underline');
    expect(tabs?.label?.description).toMatch(/Nombre accesible/);
    expect(tabs?.defaultValue?.description).toMatch(/Pestaña inicial/);
    expect(tabs?.value?.description).toMatch(/Pestaña activa/);
  });
});
