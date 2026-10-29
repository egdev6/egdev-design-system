// @vitest-environment node
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { withCustomConfig } from 'react-docgen-typescript';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import config from '../../../../.storybook/main';

const source = (name: string) => fileURLToPath(new URL(`../molecules/tabs/${name}`, import.meta.url));
const ast = (name: string) =>
  ts.createSourceFile(name, readFileSync(source(name), 'utf8'), ts.ScriptTarget.Latest, true);
const controls: Record<string, string> = {
  items: 'false',
  label: 'text',
  value: 'text',
  defaultValue: 'text',
  onValueChange: 'false',
  variant: 'select',
  size: 'select'
};

function storyNames() {
  const file = ast('Tabs.stories.tsx');
  return file.statements.flatMap((node) =>
    ts.isVariableStatement(node) && node.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword)
      ? node.declarationList.declarations.map((declaration) => declaration.name.getText(file))
      : []
  );
}

describe('Tabs Storybook metadata', () => {
  it('annotates every own props/item declaration, with concrete reasons and constant-only defaults', () => {
    const file = ast('types.ts');
    const properties: ts.PropertySignature[] = [];
    function visit(node: ts.Node) {
      if (ts.isPropertySignature(node)) {
        properties.push(node);
      }
      ts.forEachChild(node, visit);
    }
    for (const node of file.statements) {
      if (ts.isTypeAliasDeclaration(node) && ['TabsProps', 'TabsItem'].includes(node.name.text)) {
        visit(node.type);
      }
    }
    expect(properties).toHaveLength(13);
    for (const property of properties) {
      const tags = ts.getJSDocTags(property);
      const control = tags.filter((tag) => tag.tagName.text === 'control');
      expect(control, property.name.getText(file)).toHaveLength(1);
      if (ts.getTextOfJSDocComment(control[0]?.comment) === 'false') {
        const reason = tags.find((tag) => tag.tagName.text === 'controlReason');
        expect(ts.getTextOfJSDocComment(reason?.comment), property.name.getText(file)).toMatch(
          /serializable.*stor(?:y|ies)/
        );
      }
      if (!property.questionToken) {
        expect(tags.some((tag) => tag.tagName.text === 'default')).toBe(false);
      }
    }
    expect(storyNames()).toEqual(['Default', 'WithCounts', 'Small', 'Segmented', 'Controlled', 'Disabled']);
    expect(readFileSync(source('Tabs.stories.tsx'), 'utf8')).not.toMatch(/argTypes:|\bplay:/);
  });

  it('extracts required inputs, string choices, derived selection and approved native rows from the real component', () => {
    const parser = withCustomConfig(fileURLToPath(new URL('../../tsconfig.json', import.meta.url)), {
      ...config.typescript?.reactDocgenTypescriptOptions
    });
    const doc = parser.parse(source('Tabs.tsx')).find(({ displayName }) => displayName === 'Tabs');
    expect(doc).toBeDefined();
    const props = doc?.props ?? {};
    for (const [name, control] of Object.entries(controls)) {
      expect(props[name], name).toMatchObject({ required: ['items', 'label'].includes(name), tags: { control } });
      if (control === 'false') {
        expect(props[name]?.tags).toMatchObject({ controlReason: expect.any(String) });
      }
    }
    expect(props.items?.type.name).toBe('TabsItem[]');
    expect(props.onValueChange?.type.name).toBe('((value: string) => void)');
    expect(props.label?.type.name).toBe('string');
    for (const name of ['items', 'label', 'value', 'defaultValue', 'onValueChange']) {
      expect(props[name]?.defaultValue ?? null, name).toBeNull();
    }
    expect(props.defaultValue?.description).toMatch(/first enabled item/);
    expect(props.variant?.defaultValue?.value).toBe('underline');
    expect(props.size?.defaultValue?.value).toBe('md');
    const choices = (name: string) =>
      props[name]?.type.value.map(({ value }: { value: string }) => value.replaceAll('"', ''));
    expect(choices('variant')).toEqual(['underline', 'segmented']);
    expect(choices('size')).toEqual(['md', 'sm']);
    expect(Object.keys(props).sort()).toEqual(
      [...Object.keys(controls), 'id', 'title', 'aria-describedby', 'className', 'style'].sort()
    );
    for (const name of ['children', 'onChange', 'dir', 'orientation', 'activationMode', 'asChild', 'ref']) {
      expect(props[name], name).toBeUndefined();
    }
  }, 20_000);
});
